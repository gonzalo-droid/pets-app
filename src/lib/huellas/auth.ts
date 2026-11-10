import { cookies } from "next/headers";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDemo } from "./config";
import { readDemo } from "./demo";
import type { Actor } from "./domain";
const globalSecret = globalThis as typeof globalThis & {
  huellasSecret?: string;
};
function secret() {
  return (globalSecret.huellasSecret ??= randomBytes(32).toString("hex"));
}
const actors: Record<string, Actor> = {
  donor: { id: "demo-donor", full_name: "María · Donante demo", role: "user" },
  shelter: {
    id: "profile-shelter-001",
    full_name: "Patitas Chiclayo",
    role: "shelter",
    shelter_id: "shelter-001",
  },
  shelter2: {
    id: "profile-shelter-002",
    full_name: "Huellas Lambayeque",
    role: "shelter",
    shelter_id: "shelter-002",
  },
  admin: { id: "demo-admin", full_name: "Administración demo", role: "admin" },
};
export function demoToken(key: string) {
  if (!isDemo() || !actors[key]) throw new Error("Perfil demo inválido");
  const payload = `${key}:${Date.now() + 8 * 60 * 60 * 1000}`;
  return `${payload}.${createHmac("sha256", secret()).update(payload).digest("hex")}`;
}
export async function currentActor(): Promise<Actor | null> {
  if (isDemo()) {
    const raw = (await cookies()).get("huellas_demo")?.value;
    if (!raw) return null;
    const [payload, signature = ""] = raw.split(".");
    const expected = createHmac("sha256", secret())
      .update(payload)
      .digest("hex");
    if (
      !/^[a-f0-9]{64}$/.test(signature) ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    )
      return null;
    const [key, expires] = payload.split(":");
    const actor = Number(expires) > Date.now() ? (actors[key] ?? null) : null;
    if (!actor) return null;
    // El nombre editado en "Mi perfil" se guarda en el almacén demo.
    const edited = (await readDemo()).profiles?.[actor.id];
    return edited ? { ...actor, full_name: edited.full_name } : actor;
  }
  const db = await createClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) return null;
  const { data: profile, error } = await db
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", user.id)
    .single();
  if (error || !profile) return null;
  const { data: shelter } = await db
    .from("shelters")
    .select("id")
    .eq("profile_id", user.id)
    .limit(1)
    .maybeSingle();
  return { ...profile, shelter_id: shelter?.id } as Actor;
}
export async function requireActor(roles?: Actor["role"][]) {
  const actor = await currentActor();
  if (!actor) redirect("/auth/login");
  if (roles && !roles.includes(actor.role)) redirect("/profile");
  return actor;
}
export async function shelterContext() {
  const actor = await requireActor(["shelter", "admin"]);
  if (actor.shelter_id) return actor.shelter_id;
  if (actor.role === "admin") {
    if (isDemo()) return "shelter-001";
    const db = await createClient();
    const { data } = await db
      .from("shelters")
      .select("id")
      .order("created_at")
      .limit(1)
      .maybeSingle();
    if (data) return data.id as string;
  }
  redirect("/profile?notice=albergue-pendiente");
}
