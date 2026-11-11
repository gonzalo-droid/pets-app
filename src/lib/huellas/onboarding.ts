import { randomUUID } from "node:crypto";
import { isDemo } from "./config";
import { mutateDemo } from "./demo";
import { createClient } from "@/lib/supabase/server";
import type { Actor } from "./domain";

export type ShelterRequest = {
  name: string;
  description: string;
  ubigeo: string;
  whatsapp: string | null;
};

/**
 * Registra el albergue de una persona de la comunidad. Queda como responsable
 * y el albergue empieza sin verificar: no aparece en el portal hasta que la
 * administración lo verifique.
 */
export async function registerShelter(actor: Actor, values: ShelterRequest) {
  if (actor.role !== "user") throw new Error("Solo una cuenta de la comunidad puede registrar un albergue.");
  if (isDemo()) {
    const id = randomUUID();
    const now = new Date().toISOString();
    await mutateDemo((d) => {
      if (d.shelters.some((s) => s.profile_id === actor.id))
        throw new Error("Ya registraste un albergue con esta cuenta.");
      d.shelters.push({
        id,
        profile_id: actor.id,
        name: values.name,
        description: values.description,
        long_description: null,
        address: null,
        ubigeo: values.ubigeo,
        phone: null,
        email: null,
        whatsapp: values.whatsapp,
        instagram: null,
        facebook: null,
        tiktok: null,
        avatar_url: null,
        banner_url: null,
        is_verified: false,
        yape_number: null,
        bank_account: null,
        bank_name: null,
        account_holder: null,
        created_at: now,
        updated_at: now,
      });
      const prev = d.profiles?.[actor.id];
      d.profiles = {
        ...d.profiles,
        [actor.id]: {
          full_name: prev?.full_name ?? actor.full_name,
          phone: prev?.phone ?? null,
          role: "shelter",
          shelter_id: id,
        },
      };
    });
    return id;
  }
  const db = await createClient();
  const { data, error } = await db.rpc("request_shelter", {
    p_name: values.name,
    p_description: values.description,
    p_ubigeo: values.ubigeo,
    p_whatsapp: values.whatsapp,
  });
  if (error)
    throw new Error(
      error.message.includes("already")
        ? "Ya registraste un albergue con esta cuenta."
        : "No se pudo registrar el albergue. Revisa los datos.",
    );
  return data as string;
}
