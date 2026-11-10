import { sameOrigin } from "@/lib/huellas/domain";
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { currentActor } from "@/lib/huellas/auth";
import { canManage, canTransitionRequest, REQUEST_TRANSITIONS } from "@/lib/huellas/domain";
import { isDemo } from "@/lib/huellas/config";
import { mutateDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import { isOwnUpload } from "@/lib/huellas/uploads";

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

// Campos editables de una campaña. La fecha límite es opcional (AAAA-MM-DD) y
// cierra la campaña al final de ese día, hora de Perú.
const campaignSchema = z.object({
  title: z.string().trim().min(4).max(120),
  description: z.string().trim().min(10).max(2000),
  goal_amount: z.coerce.number().min(1).max(1000000),
  ends_at: z
    .union([z.literal(""), z.string().regex(/^\d{4}-\d{2}-\d{2}$/)])
    .optional()
    .transform((d) => (d ? `${d}T23:59:59-05:00` : null))
    .refine((d) => !d || new Date(d).getTime() >= Date.now(), {
      message: "La fecha límite no puede estar en el pasado.",
    }),
});

// Error con un mensaje pensado para mostrarse tal cual a quien usa el panel.
class UserError extends Error {}

// Estados desde los que se puede llegar a `to` (ver REQUEST_TRANSITIONS).
const allowedFrom = (to: string) =>
  Object.entries(REQUEST_TRANSITIONS)
    .filter(([, next]) => next.includes(to))
    .map(([from]) => from);

const TRANSITION_ERROR =
  "Ese cambio de estado no está permitido. Una solicitud rechazada o completada ya no cambia, y para completar una adopción primero hay que aprobarla.";

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
      // Solo fotos subidas por HUELLAS a la carpeta de este albergue.
      const urls = z
        .array(z.string().refine((u) => isOwnUpload(u, shelterId)))
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
    } else if (body.action === "shelter_images") {
      // Foto de perfil o portada. Vacío quita la imagen.
      const image = z
        .union([z.literal(""), z.string().refine((u) => isOwnUpload(u, shelterId))])
        .transform((u) => u || null);
      const values = z
        .object({ avatar_url: image.optional(), banner_url: image.optional() })
        .parse(body);
      if (!db)
        await mutateDemo((d) => {
          const s = d.shelters.find((s) => s.id === shelterId);
          if (!s) throw new Error("Albergue no encontrado");
          Object.assign(s, values);
        });
      else await updateOne(db, "shelters", values, shelterId, shelterId);
    } else if (body.action === "animal_photo_add") {
      const animalId = targetId.parse(body.animal_id);
      const url = z.string().refine((u) => isOwnUpload(u, shelterId)).parse(body.url);
      if (!db)
        await mutateDemo((d) => {
          const a = d.animals.find((a) => a.id === animalId && a.shelter_id === shelterId);
          if (!a) throw new Error("Animal no encontrado");
          if (a.animal_photos.length >= 3) throw new UserError("Cada animal puede tener hasta 3 fotos.");
          a.animal_photos.push({
            id,
            animal_id: animalId,
            url,
            is_cover: a.animal_photos.length === 0,
            order_index: a.animal_photos.length,
          });
        });
      else {
        const { data: animal } = await db
          .from("animals")
          .select("id, animal_photos(id)")
          .eq("id", animalId)
          .eq("shelter_id", shelterId)
          .maybeSingle();
        if (!animal) throw new Error("Animal no encontrado");
        const count = (animal.animal_photos as { id: string }[]).length;
        if (count >= 3) throw new UserError("Cada animal puede tener hasta 3 fotos.");
        const { error } = await db
          .from("animal_photos")
          .insert({ animal_id: animalId, url, is_cover: count === 0, order_index: count });
        if (error) throw error;
      }
    } else if (body.action === "animal_photo_cover" || body.action === "animal_photo_remove") {
      const photoId = targetId.parse(body.id);
      const animalId = targetId.parse(body.animal_id);
      const remove = body.action === "animal_photo_remove";
      if (!db)
        await mutateDemo((d) => {
          const a = d.animals.find((a) => a.id === animalId && a.shelter_id === shelterId);
          const photo = a?.animal_photos.find((p) => p.id === photoId);
          if (!a || !photo) throw new Error("Foto no encontrada");
          if (remove) {
            a.animal_photos = a.animal_photos.filter((p) => p.id !== photoId);
            // Si era la portada, la siguiente foto pasa a serlo.
            if (photo.is_cover && a.animal_photos[0]) a.animal_photos[0].is_cover = true;
          } else a.animal_photos.forEach((p) => (p.is_cover = p.id === photoId));
        });
      else {
        const { data: animal } = await db
          .from("animals")
          .select("id, animal_photos(id, is_cover, order_index)")
          .eq("id", animalId)
          .eq("shelter_id", shelterId)
          .maybeSingle();
        const photos = (animal?.animal_photos ?? []) as { id: string; is_cover: boolean; order_index: number }[];
        const photo = photos.find((p) => p.id === photoId);
        if (!animal || !photo) throw new Error("Foto no encontrada");
        const coverId = remove
          ? photo.is_cover
            ? photos.filter((p) => p.id !== photoId).sort((x, y) => x.order_index - y.order_index)[0]?.id
            : undefined
          : photoId;
        if (remove) {
          const { error } = await db.from("animal_photos").delete().eq("id", photoId).eq("animal_id", animalId);
          if (error) throw error;
        }
        if (coverId) {
          const { error: e1 } = await db.from("animal_photos").update({ is_cover: false }).eq("animal_id", animalId);
          if (e1) throw e1;
          const { error: e2 } = await db.from("animal_photos").update({ is_cover: true }).eq("id", coverId);
          if (e2) throw e2;
        }
      }
    } else if (body.action === "animal_update") {
      // Datos de la ficha. El estado, las fotos y el albergue no se cambian aquí.
      const animalId = targetId.parse(body.id);
      const values = animalSchema.parse(body);
      const changes = {
        ...values,
        age_months: values.age_months ?? null,
        breed: values.breed || null,
        color: values.color || null,
      };
      if (!db)
        await mutateDemo((d) => {
          const a = d.animals.find(
            (a) => a.id === animalId && a.shelter_id === shelterId,
          );
          if (!a) throw new Error("Animal no encontrado");
          Object.assign(a, changes, { updated_at: now });
        });
      else await updateOne(db, "animals", changes, animalId, shelterId);
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
      const values = campaignSchema.parse(body);
      const row = {
        ...values,
        id,
        shelter_id: shelterId,
        animal_id: null,
        current_amount: 0,
        is_active: true,
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
    } else if (body.action === "campaign_update") {
      const campaignId = targetId.parse(body.id);
      const values = campaignSchema.parse(body);
      if (!db)
        await mutateDemo((d) => {
          const c = d.campaigns.find(
            (c) => c.id === campaignId && c.shelter_id === shelterId,
          );
          if (!c) throw new Error("Campaña no encontrada");
          Object.assign(c, values, { updated_at: now });
        });
      else await updateOne(db, "donation_campaigns", values, campaignId, shelterId);
    } else if (body.action === "campaign_active") {
      // Cerrar o reabrir. Cerrar no borra la campaña ni sus compromisos.
      const campaignId = targetId.parse(body.id);
      const is_active = z.boolean().parse(body.is_active);
      if (!db)
        await mutateDemo((d) => {
          const c = d.campaigns.find(
            (c) => c.id === campaignId && c.shelter_id === shelterId,
          );
          if (!c) throw new Error("Campaña no encontrada");
          c.is_active = is_active;
        });
      else
        await updateOne(db, "donation_campaigns", { is_active }, campaignId, shelterId);
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
          if (!canTransitionRequest(r.status, status)) throw new UserError(TRANSITION_ERROR);
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
          // Solo desde un estado que permita el cambio (también lo valida la base).
          .in("status", allowedFrom(status))
          .select("animal_id");
        if (error) throw error;
        if (!data?.length) throw new UserError(TRANSITION_ERROR);
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
      // Campos opcionales: vacío → null. Las redes se guardan sin "@".
      const optional = (schema: z.ZodType<string>) =>
        z
          .union([z.literal(""), schema])
          .optional()
          .transform((v) => (v ? v : null));
      const handle = z
        .string()
        .trim()
        .transform((v) => v.replace(/^@/, ""))
        .pipe(z.string().regex(/^[A-Za-z0-9._-]{1,60}$/, "Usuario de red social no válido."));
      const values = z
        .object({
          name: z.string().trim().min(2).max(100),
          description: z.string().trim().min(10).max(1000),
          long_description: optional(z.string().trim().max(3000)),
          address: optional(z.string().trim().max(160)),
          phone: optional(z.string().trim().regex(/^\d{6,15}$/, "El teléfono solo admite números.")),
          whatsapp: optional(z.string().trim().regex(/^\d{9,15}$/, "El WhatsApp solo admite números.")),
          email: optional(z.email("Correo no válido.")),
          instagram: optional(handle),
          facebook: optional(handle),
          tiktok: optional(handle),
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
  } catch (e) {
    // Mensajes de validación pensados para el usuario; el resto, genérico.
    const issue =
      e instanceof UserError
        ? e.message
        : e instanceof z.ZodError
          ? e.issues.find((i) =>
              /^(La fecha|El teléfono|El WhatsApp|Correo|Usuario de red)/.test(i.message),
            )?.message
          : undefined;
    return NextResponse.json(
      { error: issue ?? "No se pudo guardar. Revisa los campos y los permisos." },
      { status: 400 },
    );
  }
}
