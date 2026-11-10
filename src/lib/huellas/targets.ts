import { isDemo } from "./config";
import { readDemo } from "./demo";
import { createClient } from "@/lib/supabase/server";

export type Target = { label: string; href: string };

/**
 * Nombres legibles de campañas y animales para mostrar el destino de un
 * apoyo o una solicitud, en lugar de identificadores internos.
 */
export async function lookupTargets(campaignIds: string[], animalIds: string[]) {
  const campaigns: Record<string, Target> = {};
  const animals: Record<string, Target> = {};
  const cIds = [...new Set(campaignIds.filter(Boolean))];
  const aIds = [...new Set(animalIds.filter(Boolean))];
  if (isDemo()) {
    const d = await readDemo();
    for (const c of d.campaigns)
      if (cIds.includes(c.id)) campaigns[c.id] = { label: c.title, href: `/donate/${c.slug}` };
    for (const a of d.animals)
      if (aIds.includes(a.id)) animals[a.id] = { label: a.name, href: `/adopt/${a.slug}` };
    return { campaigns, animals };
  }
  const db = await createClient();
  const [c, a] = await Promise.all([
    cIds.length
      ? db.from("donation_campaigns").select("id, title, slug").in("id", cIds)
      : Promise.resolve({ data: [] as { id: string; title: string; slug: string }[] }),
    aIds.length
      ? db.from("animals").select("id, name, slug").in("id", aIds)
      : Promise.resolve({ data: [] as { id: string; name: string; slug: string }[] }),
  ]);
  for (const r of c.data ?? []) campaigns[r.id] = { label: r.title, href: `/donate/${r.slug}` };
  for (const r of a.data ?? []) animals[r.id] = { label: r.name, href: `/adopt/${r.slug}` };
  return { campaigns, animals };
}
