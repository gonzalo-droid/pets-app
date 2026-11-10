import { isDemo } from "@/lib/huellas/config";
import { readDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import type { Shelter, ShelterWithPhotos } from "@/types";
import {
  cleanSearch,
  fetchPage,
  ilikeAny,
  includesAny,
  slicePage,
  type Paged,
} from "@/lib/pagination";

export async function getShelters(): Promise<Shelter[]> {
  if (isDemo()) return (await readDemo()).shelters.filter((s) => s.is_verified);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shelters")
    .select("*")
    .eq("is_verified", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[data/shelters] getShelters:", error.message);
    throw new Error(
      "No se pudo consultar Supabase. Revisa la configuración y migraciones.",
    );
  }

  return (data ?? []) as Shelter[];
}

export async function getShelterById(id: string): Promise<Shelter | null> {
  if (isDemo())
    return (await readDemo()).shelters.find((s) => s.id === id) ?? null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shelters")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[data/shelters] getShelterById:", error.message);
    }
    return null;
  }

  return data as Shelter;
}

export async function getShelterWithPhotos(
  id: string,
): Promise<ShelterWithPhotos | null> {
  if (isDemo()) {
    const d = await readDemo();
    const s = d.shelters.find((s) => s.id === id && s.is_verified);
    return s
      ? { ...s, shelter_photos: d.photos.filter((p) => p.shelter_id === id) }
      : null;
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("shelters")
    .select("*, shelter_photos(*)")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[data/shelters] getShelterWithPhotos:", error.message);
    }
    return null;
  }

  // Ordenar fotos por order_index
  const shelter = data as ShelterWithPhotos;
  shelter.shelter_photos = (shelter.shelter_photos ?? []).sort(
    (a, b) => a.order_index - b.order_index,
  );

  return shelter;
}

/** Una página de albergues verificados, con búsqueda por nombre, descripción o dirección. */
export async function getSheltersPage(
  search: string | undefined,
  page: number,
  pageSize: number,
): Promise<Paged<Shelter>> {
  const q = cleanSearch(search);
  if (isDemo()) {
    const rows = (await readDemo()).shelters.filter(
      (s) => s.is_verified && (!q || includesAny(q, s.name, s.description, s.address)),
    );
    return slicePage(rows, page, pageSize);
  }
  const supabase = await createClient();
  return fetchPage<Shelter>(
    (from, to) => {
      let query = supabase
        .from("shelters")
        .select("*", { count: "exact" })
        .eq("is_verified", true)
        .order("created_at", { ascending: false })
        .order("id");
      if (q) query = query.or(ilikeAny(["name", "description", "address"], q));
      return query.range(from, to);
    },
    page,
    pageSize,
    "getSheltersPage",
  );
}

export type ShelterStats = { openCampaigns: number; animals: number; openNeeds: number };

/**
 * Actividad visible de varios albergues: campañas abiertas, animales que
 * buscan hogar y necesidades abiertas. Tres consultas en total, no una por albergue.
 */
export async function getShelterStats(ids: string[]): Promise<Record<string, ShelterStats>> {
  const stats: Record<string, ShelterStats> = Object.fromEntries(
    ids.map((id) => [id, { openCampaigns: 0, animals: 0, openNeeds: 0 }]),
  );
  if (!ids.length) return stats;
  const now = new Date();
  let campaigns: { shelter_id: string }[] = [];
  let animals: { shelter_id: string }[] = [];
  let needs: { shelter_id: string }[] = [];
  if (isDemo()) {
    const d = await readDemo();
    campaigns = d.campaigns.filter(
      (c) => c.is_active && (!c.ends_at || new Date(c.ends_at) >= now),
    );
    animals = d.animals.filter((a) => a.status === "available");
    needs = d.needs.filter((n) => !n.fulfilled);
  } else {
    const db = await createClient();
    const [c, a, n] = await Promise.all([
      db
        .from("donation_campaigns")
        .select("shelter_id")
        .in("shelter_id", ids)
        .eq("is_active", true)
        .or(`ends_at.is.null,ends_at.gte.${now.toISOString()}`),
      db.from("animals").select("shelter_id").in("shelter_id", ids).eq("status", "available"),
      db.from("needs").select("shelter_id").in("shelter_id", ids).eq("fulfilled", false),
    ]);
    campaigns = c.data ?? [];
    animals = a.data ?? [];
    needs = n.data ?? [];
  }
  for (const r of campaigns) if (stats[r.shelter_id]) stats[r.shelter_id].openCampaigns++;
  for (const r of animals) if (stats[r.shelter_id]) stats[r.shelter_id].animals++;
  for (const r of needs) if (stats[r.shelter_id]) stats[r.shelter_id].openNeeds++;
  return stats;
}
