import { isDemo } from "@/lib/huellas/config";
import { readDemo, type DemoData } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import type { CampaignWithShelter, CampaignFilters } from "@/types";
import { isCampaignOpen } from "@/lib/huellas/domain";
import {
  fetchPage,
  slicePage,
  type Paged,
} from "@/lib/pagination";

// La foto de portada del animal y del albergue se piden junto con la campaña:
// una campaña sin foto propia usa la del animal y, si no, la del albergue.
const SELECT = `*,
  shelter:shelters ( id, name, avatar_url, banner_url ),
  animal:animals ( id, name, species, animal_photos ( url, is_cover, order_index ) )`;

// Supabase devuelve los datos con snake_case. El campo `currency` no existe en la
// tabla (siempre es PEN), así que lo inyectamos al mapear.
type RawCampaign = Omit<CampaignWithShelter, "currency" | "animal"> & {
  currency?: never;
  animal: {
    id: string;
    name: string;
    species: string;
    animal_photos?: { url: string; is_cover: boolean; order_index: number }[];
  } | null;
};

function coverOf(photos?: { url: string; is_cover: boolean; order_index: number }[]) {
  if (!photos?.length) return null;
  return (photos.find((p) => p.is_cover) ?? [...photos].sort((a, b) => a.order_index - b.order_index)[0]).url;
}

function mapCampaign(raw: RawCampaign): CampaignWithShelter {
  return {
    ...raw,
    currency: "PEN",
    kind: raw.kind ?? (raw.animal_id ? "case" : "fund"),
    event_at: raw.event_at ?? null,
    event_place: raw.event_place ?? null,
    image_url: raw.image_url ?? null,
    animal: raw.animal
      ? {
          id: raw.animal.id,
          name: raw.animal.name,
          species: raw.animal.species as import("@/types").AnimalSpecies,
          photo_url: coverOf(raw.animal.animal_photos),
        }
      : null,
  };
}

/** En la demo, completa los campos nuevos y las fotos desde el almacén local. */
function demoCampaign(d: DemoData, c: CampaignWithShelter): CampaignWithShelter {
  const animal = c.animal_id ? d.animals.find((a) => a.id === c.animal_id) : undefined;
  const shelter = d.shelters.find((s) => s.id === c.shelter_id);
  return {
    ...c,
    kind: c.kind ?? (c.animal_id ? "case" : "fund"),
    event_at: c.event_at ?? null,
    event_place: c.event_place ?? null,
    image_url: c.image_url ?? null,
    shelter: { ...c.shelter, name: shelter?.name ?? c.shelter.name, banner_url: shelter?.banner_url ?? null },
    animal: animal
      ? { id: animal.id, name: animal.name, species: animal.species, photo_url: coverOf(animal.animal_photos) }
      : null,
  };
}

export async function getCampaigns(
  filters?: CampaignFilters,
): Promise<CampaignWithShelter[]> {
  if (isDemo()) {
    const d = await readDemo();
    return d.campaigns
      .map((c) => demoCampaign(d, c))
      .filter(
        (c) =>
          (filters?.shelter_id ||
            d.shelters.some((s) => s.id === c.shelter_id && s.is_verified)) &&
          (!filters?.shelter_id || c.shelter_id === filters.shelter_id) &&
          (filters?.is_active === undefined ||
            c.is_active === filters.is_active) &&
          (!filters?.animal_id || c.animal_id === filters.animal_id) &&
          (!filters?.kind || c.kind === filters.kind),
      );
  }
  const supabase = await createClient();

  let query = supabase
    .from("donation_campaigns")
    .select(SELECT)
    .order("created_at", { ascending: false });

  if (filters?.is_active !== undefined)
    query = query.eq("is_active", filters.is_active);
  if (filters?.shelter_id) query = query.eq("shelter_id", filters.shelter_id);
  if (filters?.animal_id) query = query.eq("animal_id", filters.animal_id);
  if (filters?.kind) query = query.eq("kind", filters.kind);

  const { data, error } = await query;

  if (error) {
    console.error("[data/campaigns] getCampaigns:", error.message);
    throw new Error(
      "No se pudo consultar Supabase. Revisa la configuración y migraciones.",
    );
  }

  return (data ?? []).map((c) => mapCampaign(c as RawCampaign));
}

export async function getCampaignBySlug(
  slug: string,
): Promise<CampaignWithShelter | null> {
  if (isDemo()) {
    const d = await readDemo();
    const c = d.campaigns.find(
      (c) =>
        c.slug === slug &&
        d.shelters.some((s) => s.id === c.shelter_id && s.is_verified),
    );
    return c ? demoCampaign(d, c) : null;
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("donation_campaigns")
    .select(SELECT)
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[data/campaigns] getCampaignBySlug:", error.message);
    }
    return null;
  }

  return mapCampaign(data as RawCampaign);
}

/** Una página de campañas (mismos filtros que getCampaigns). */
export async function getCampaignsPage(
  filters: CampaignFilters | undefined,
  page: number,
  pageSize: number,
): Promise<Paged<CampaignWithShelter>> {
  if (isDemo()) {
    // Mismo orden que en Supabase: sin fecha límite y fechas más lejanas primero.
    const rows = (await getCampaigns(filters))
      .filter((c) => !filters?.open_only || isCampaignOpen(c))
      .filter((c) => !filters?.closed_only || !isCampaignOpen(c))
      .sort(
        (a, b) =>
          Number(b.is_active) - Number(a.is_active) ||
          (b.ends_at ? Date.parse(b.ends_at) : Infinity) -
            (a.ends_at ? Date.parse(a.ends_at) : Infinity),
      );
    return slicePage(rows, page, pageSize);
  }
  const supabase = await createClient();
  const result = await fetchPage<RawCampaign>(
    (from, to) => {
      let query = supabase
        .from("donation_campaigns")
        .select(SELECT, { count: "exact" })
        // Las abiertas primero: activas, sin fecha límite o con la más lejana.
        .order("is_active", { ascending: false })
        .order("ends_at", { ascending: false, nullsFirst: true })
        .order("created_at", { ascending: false })
        .order("id");
      if (filters?.is_active !== undefined)
        query = query.eq("is_active", filters.is_active);
      if (filters?.shelter_id) query = query.eq("shelter_id", filters.shelter_id);
      if (filters?.animal_id) query = query.eq("animal_id", filters.animal_id);
      if (filters?.kind) query = query.eq("kind", filters.kind);
      if (filters?.open_only)
        query = query
          .eq("is_active", true)
          .or(`ends_at.is.null,ends_at.gte.${new Date().toISOString()}`);
      if (filters?.closed_only)
        query = query.or(`is_active.eq.false,ends_at.lt.${new Date().toISOString()}`);
      return query.range(from, to);
    },
    page,
    pageSize,
    "getCampaignsPage",
  );
  return { ...result, items: result.items.map(mapCampaign) };
}

/** Meta, recaudado y campañas abiertas, sumando todas las que cumplen el filtro. */
export async function getCampaignTotals(filters?: CampaignFilters) {
  let rows: {
    goal_amount: number;
    current_amount: number;
    is_active: boolean;
    ends_at: string | null;
  }[];
  if (isDemo()) rows = await getCampaigns(filters);
  else {
    const supabase = await createClient();
    let query = supabase
      .from("donation_campaigns")
      .select("goal_amount, current_amount, is_active, ends_at");
    if (filters?.is_active !== undefined)
      query = query.eq("is_active", filters.is_active);
    if (filters?.shelter_id) query = query.eq("shelter_id", filters.shelter_id);
    const { data, error } = await query;
    if (error) {
      console.error("[data/campaigns] getCampaignTotals:", error.message);
      throw new Error(
        "No se pudo consultar Supabase. Revisa la configuración y migraciones.",
      );
    }
    rows = data ?? [];
  }
  return {
    goal: rows.reduce((s, c) => s + Number(c.goal_amount), 0),
    raised: rows.reduce((s, c) => s + Number(c.current_amount), 0),
    open: rows.filter((c) => isCampaignOpen(c)).length,
    closed: rows.filter((c) => !isCampaignOpen(c)).length,
  };
}
