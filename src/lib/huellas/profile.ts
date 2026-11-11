import { isDemo } from "./config";
import { mutateDemo, readDemo } from "./demo";
import { createClient } from "@/lib/supabase/server";
import type { Actor } from "./domain";

export type OwnProfile = { full_name: string; phone: string | null };

/** Datos editables del perfil de la persona con sesión (solo los suyos). */
export async function getOwnProfile(actor: Actor): Promise<OwnProfile> {
  if (isDemo()) {
    const edited = (await readDemo()).profiles?.[actor.id];
    return edited ?? { full_name: actor.full_name, phone: null };
  }
  const db = await createClient();
  const { data } = await db
    .from("profiles")
    .select("full_name, phone")
    .eq("id", actor.id)
    .maybeSingle();
  return { full_name: data?.full_name ?? actor.full_name, phone: data?.phone ?? null };
}

export async function saveOwnProfile(actor: Actor, values: OwnProfile) {
  if (isDemo()) {
    await mutateDemo((d) => {
      d.profiles = { ...d.profiles, [actor.id]: { ...d.profiles?.[actor.id], ...values } };
    });
    return;
  }
  const db = await createClient();
  // La RLS solo permite actualizar el propio perfil; el rol no es editable.
  const { data, error } = await db
    .from("profiles")
    .update(values)
    .eq("id", actor.id)
    .select("id");
  if (error) throw error;
  if (!data?.length) throw new Error("Perfil no encontrado");
}
