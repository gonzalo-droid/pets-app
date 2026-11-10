import { sameOrigin } from "@/lib/huellas/domain";
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { currentActor } from "@/lib/huellas/auth";
import { canManage } from "@/lib/huellas/domain";
import { isDemo } from "@/lib/huellas/config";
import { mutateDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";

type Db = Awaited<ReturnType<typeof createClient>>;
const targetId = z.string().min(1).max(64);

// Supabase no devuelve error si un UPDATE no toca filas (id inexistente o
// bloqueado por RLS); sin esta comprobación el panel mostraría "guardado".
async function updateOne(
  db: Db,
  table: string,
  values: Record<string, unknown>,
  id: string,
  shelterId: string,
) {
  const { data, error } = await db
    .from(table)
    .update(values)
    .eq("id", id)
    .eq(table === "shelters" ? "id" : "shelter_id", shelterId)
    .select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("Registro no encontrado o sin permiso");
}

// Estado del animal según la decisión sobre una solicitud de adopción.
const ANIMAL_STATUS_FOR_REQUEST = {
  approved: "in_process",
  completed: "adopted",
} as const;
const animalSchema = z.object({
  name: z.string().trim().min(1).max(60),
  species: z.enum(["dog", "cat", "other"]),
  size: z.enum(["small", "medium", "large"]),
  gender: z.enum(["male", "female", "unknown"]),
  description: z.string().min(20).max(1000),
  age_months: z.coerce.number().int().min(0).max(480).nullable().optional(),
  breed: z.string().max(60).optional(),
  color: z.string().max(60).optional(),
  is_vaccinated: z.boolean().default(false),
  is_neutered: z.boolean().default(false),
  is_microchipped: z.boolean().default(false),
  ubigeo: z.string().regex(/^\d{6}$/),
});
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  const actor = await currentActor();
  if (!actor)
    return NextResponse.json(
      { error: "Inicia sesión para continuar" },
      { status: 401 },
    );
  try {
    const body = await request.json();
    const shelterId = z
      .string()
      .min(1)
      .parse(body.shelter_id ?? actor.shelter_id);
    if (!canManage(actor, shelterId))
      return NextResponse.json(
        { error: "No tienes acceso a este albergue" },
        { status: 403 },
      );
    const id = randomUUID(),
      now = new Date().toISOString();
    const db = isDemo() ? null : await createClient();
    if (body.action === "animal") {
      const values = animalSchema.parse(body);
      const row = {
        ...values,
        id,
        shelter_id: shelterId,
        posted_by: actor.id,
        age_months: values.age_months ?? null,
        breed: values.breed ?? null,
        color: values.color ?? null,
        status: "available" as const,
        slug: `${values.name
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")}-${id.slice(0, 8)}`,
        created_at: now,
        updated_at: now,
      };
      const urls = z
        .array(z.url().refine((u) => u.startsWith("https://")))
        .max(3)
        .parse(body.photos ?? []);
      const photos = urls.map((url, i) => ({
        id: randomUUID(),
        animal_id: id,
        url,
        is_cover: i === 0,
        order_index: i,
      }));
      if (!db)
        await mutateDemo((d) => {
          d.animals.unshift({ ...row, animal_photos: photos });
        });
      else {
        const { error } = await db.rpc("create_animal_with_photos", {
          animal: row,
          photos: urls,
        });
        if (error) throw error;
      }
    } else if (body.action === "animal_status") {
      const status = z
        .enum(["available", "in_process", "adopted"])
        .parse(body.status);
      const id = targetId.parse(body.id);
      if (!db)
        await mutateDemo((d) => {
          const a = d.animals.find(
            (a) => a.id === id && a.shelter_id === shelterId,
          );
          if (!a) throw new Error("Animal no encontrado");
          a.status = status;
        });
      else await updateOne(db, "animals", { status }, id, shelterId);
    } else if (body.action === "campaign") {
      const values = z
        .object({
          title: z.string().trim().min(4).max(120),
          description: z.string().min(10).max(2000),
          goal_amount: z.coerce.number().min(1).max(1000000),
        })
        .parse(body);
      const row = {
        ...values,
        id,
        shelter_id: shelterId,
        animal_id: null,
        current_amount: 0,
        is_active: true,
        ends_at: null,
        slug: `campana-${id.slice(0, 8)}`,
        created_at: now,
        updated_at: now,
      };
      if (!db)
        await mutateDemo((d) => {
          const s = d.shelters.find((s) => s.id === shelterId);
          if (!s) throw new Error("Albergue no encontrado");
          d.campaigns.unshift({
            ...row,
            currency: "PEN",
            shelter: { id: s.id, name: s.name, avatar_url: s.avatar_url },
            animal: null,
          });
        });
      else {
        const { error } = await db.from("donation_campaigns").insert(row);
        if (error) throw error;
      }
    } else if (body.action === "need") {
      const values = z
        .object({
          title: z.string().trim().min(4).max(120),
          description: z.string().min(10).max(1000),
          quantity: z.string().min(1).max(80),
        })
        .parse(body);
      const row = { ...values, id, shelter_id: shelterId, fulfilled: false };
      if (!db)
        await mutateDemo((d) => {
          d.needs.unshift(row);
        });
      else {
        const { error } = await db.from("needs").insert(row);
        if (error) throw error;
      }
    } else if (body.action === "fulfill") {
      const id = targetId.parse(body.id);
      const fulfilled = z.boolean().parse(body.fulfilled);
      if (!db)
        await mutateDemo((d) => {
          const n = d.needs.find(
            (n) => n.id === id && n.shelter_id === shelterId,
          );
          if (!n) throw new Error("Necesidad no encontrada");
          n.fulfilled = fulfilled;
        });
      else await updateOne(db, "needs", { fulfilled }, id, shelterId);
    } else if (body.action === "verify" && actor.role === "admin") {
      const verified = z.boolean().parse(body.verified);
      if (!db)
        await mutateDemo((d) => {
          const s = d.shelters.find((s) => s.id === shelterId);
          if (!s) throw new Error("Albergue no encontrado");
          s.is_verified = verified;
        });
      else {
        const { error } = await db.rpc("verify_shelter", {
          target: shelterId,
          verified,
        });
        if (error) throw error;
      }
    } else if (body.action === "request_status") {
      const status = z
        .enum(["reviewing", "approved", "rejected", "completed"])
        .parse(body.status);
      const id = targetId.parse(body.id);
      const animalStatus =
        status in ANIMAL_STATUS_FOR_REQUEST
          ? ANIMAL_STATUS_FOR_REQUEST[status as keyof typeof ANIMAL_STATUS_FOR_REQUEST]
          : null;
      if (!db)
        await mutateDemo((d) => {
          const r = d.requests.find(
            (r) => r.id === id && r.shelter_id === shelterId,
          );
          if (!r) throw new Error("Solicitud no encontrada");
          r.status = status;
          const a = d.animals.find((a) => a.id === r.animal_id);
          if (!a) return;
          if (animalStatus) a.status = animalStatus;
          // Al rechazar, el animal vuelve a estar disponible si no queda otra aprobada.
          else if (
            status === "rejected" &&
            a.status === "in_process" &&
            !d.requests.some(
              (o) => o.animal_id === a.id && o.status === "approved",
            )
          )
            a.status = "available";
        });
      else {
        const { data, error } = await db
          .from("adoption_requests")
          .update({ status })
          .eq("id", id)
          .eq("shelter_id", shelterId)
          .select("animal_id");
        if (error) throw error;
        if (!data?.length) throw new Error("Solicitud no encontrada");
        const animalId = data[0].animal_id as string;
        if (animalStatus)
          await updateOne(db, "animals", { status: animalStatus }, animalId, shelterId);
        else if (status === "rejected") {
          const { count, error: countError } = await db
            .from("adoption_requests")
            .select("id", { count: "exact", head: true })
            .eq("animal_id", animalId)
            .eq("status", "approved");
          if (countError) throw countError;
          if (!count) {
            const { error: resetError } = await db
              .from("animals")
              .update({ status: "available" })
              .eq("id", animalId)
              .eq("shelter_id", shelterId)
              .eq("status", "in_process");
            if (resetError) throw resetError;
          }
        }
      }
    } else if (body.action === "settings") {
      const values = z
        .object({
          name: z.string().trim().min(2).max(100),
          description: z.string().min(10).max(1000),
        })
        .parse(body);
      if (!db)
        await mutateDemo((d) => {
          const s = d.shelters.find((s) => s.id === shelterId);
          if (!s) throw new Error("Albergue no encontrado");
          Object.assign(s, values);
        });
      else await updateOne(db, "shelters", values, shelterId, shelterId);
    } else throw new Error("Acción no permitida");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar. Revisa los campos y los permisos." },
      { status: 400 },
    );
  }
}
