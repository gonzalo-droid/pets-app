import { sameOrigin } from "@/lib/huellas/domain";
import { NextResponse } from "next/server";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { currentActor } from "@/lib/huellas/auth";
import { money, paymentState } from "@/lib/huellas/domain";
import { isDemo } from "@/lib/huellas/config";
import { readDemo, mutateDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import { getAnimalBySlug } from "@/lib/data/animals";
import { getCampaignBySlug } from "@/lib/data/campaigns";
// Una persona solo puede tener una solicitud activa por animal (igual que el índice SQL).
const ACTIVE_REQUEST = ["pending", "reviewing", "approved"];

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  const actor = await currentActor();
  if (!actor)
    return NextResponse.json(
      { error: "Inicia sesión para registrar tu apoyo." },
      { status: 401 },
    );
  try {
    const body = await request.json();
    const db = isDemo() ? null : await createClient();
    if (body.action === "cancel") {
      const id = z.string().parse(body.id);
      if (!db)
        await mutateDemo((d) => {
          const s = d.support.find(
            (s) => s.id === id && s.donor_id === actor.id,
          );
          if (!s) throw new Error();
          s.status = "cancelled";
        });
      else {
        const { error } = await db.rpc("cancel_support", { target: id });
        if (error) throw error;
      }
      return NextResponse.json({ ok: true });
    }
    const slug = z.string().min(1).max(180).parse(body.slug);
    const animal =
      body.kind === "sponsorship" || body.kind === "adoption"
        ? await getAnimalBySlug(slug)
        : null;
    const campaign =
      body.kind === "donation" ? await getCampaignBySlug(slug) : null;
    if (body.kind === "adoption") {
      if (!animal || animal.status !== "available") throw new Error();
      const values = z
        .object({
          phone: z.string().regex(/^\d{9,15}$/),
          message: z.string().min(30).max(1000),
          has_home: z.boolean(),
          has_other_pets: z.boolean(),
          has_children: z.boolean(),
        })
        .parse(body);
      const row = {
        ...values,
        id: randomUUID(),
        animal_id: animal.id,
        shelter_id: animal.shelter_id,
        requester_id: actor.id,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      if (!db)
        await mutateDemo((d) => {
          if (
            d.requests.some(
              (r) =>
                r.animal_id === animal.id &&
                r.requester_id === actor.id &&
                ACTIVE_REQUEST.includes(r.status),
            )
          )
            throw new Error();
          d.requests.unshift(row);
        });
      else {
        const { error } = await db.from("adoption_requests").insert(row);
        if (error) throw error;
      }
      return NextResponse.json({ ok: true });
    }
    const kind = z.enum(["donation", "sponsorship"]).parse(body.kind);
    if (
      kind === "donation" &&
      (!campaign ||
        !campaign.is_active ||
        (campaign.ends_at && new Date(campaign.ends_at) < new Date()))
    )
      throw new Error();
    if (kind === "sponsorship" && (!animal || animal.status === "adopted"))
      throw new Error();
    const shelterId = animal?.shelter_id ?? campaign!.shelter_id;
    if (
      !db &&
      !(await readDemo()).shelters.find((s) => s.id === shelterId)?.is_verified
    )
      throw new Error();
    const row = {
      id: randomUUID(),
      donor_id: actor.id,
      shelter_id: shelterId,
      campaign_id: campaign?.id ?? null,
      animal_id: animal?.id ?? null,
      amount: money(body.amount),
      kind,
      status: paymentState(),
      created_at: new Date().toISOString(),
      idempotency_key: z.uuid().parse(body.idempotency_key),
    };
    let id: string = row.id;
    if (!db)
      await mutateDemo((d) => {
        const old = d.support.find(
          (s) =>
            s.idempotency_key === row.idempotency_key &&
            s.donor_id === actor.id,
        );
        if (old) {
          id = old.id;
          return;
        }
        d.support.unshift(row);
      });
    else {
      const { data, error } = await db.rpc("pledge_support", {
        p_kind: kind,
        p_campaign: row.campaign_id,
        p_animal: row.animal_id,
        p_amount: row.amount,
        p_key: row.idempotency_key,
      });
      if (error) throw error;
      id = data;
    }
    return NextResponse.json({
      ok: true,
      id,
      message:
        "Compromiso guardado. No se realizó ningún cobro. El apadrinamiento no tiene débito automático.",
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo registrar. Revisa los datos, el estado del destino y las migraciones.",
      },
      { status: 400 },
    );
  }
}
