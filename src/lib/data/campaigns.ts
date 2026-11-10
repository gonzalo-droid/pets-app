import { isDemo } from "@/lib/huellas/config";
import { readDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import type { CampaignWithShelter, CampaignFilters } from "@/types";
import {
  fetchPage,
  slicePage,
  type Paged,
} from "@/lib/pagination";

// Supabase devuelve los datos con snake_case. El campo `currency` no existe en la
// tabla (siempre es PEN), así que lo inyectamos al mapear.
type RawCampaign = Omit<CampaignWithShelter, "currency" | "animal"> & {
  currency?: never;
  shelter: { id: string; name: string; avatar_url: string | null };
  animal: { id: string; name: string; species: string } | null;
};

function mapCampaign(raw: RawCampaign): CampaignWithShelter {
  return {
    ...raw,
    currency: "PEN",
    animal: raw.animal
      ? {
          id: raw.animal.id,
          name: raw.animal.name,
          species: raw.animal.species as import("@/types").AnimalSpecies,
        }
      : null,
  };
}

export async function getCampaigns(
  filters?: CampaignFilters,
): Promise<CampaignWithShelter[]> {
  if (isDemo()) {
    const d = await readDemo();
    return d.campaigns.filter(
      (c) =>
        (filters?.shelter_id ||
          d.shelters.some((s) => s.id === c.shelter_id && s.is_verified)) &&
        (!filters?.shelter_id || c.shelter_id === filters.shelter_id) &&
        (filters?.is_active === undefined ||
          c.is_active === filters.is_active) &&
        (!filters?.animal_id || c.animal_id === filters.animal_id),
    );
  }
  const supabase = await createClient();

  let query = supabase
    .from("donation_campaigns")
    .select(
      `
      *,
      shelter:shelters ( id, name, avatar_url ),
      animal:animals ( id, name, species )
    `,
    )
    .order("created_at", { ascending: false });

  if (filters?.is_active !== undefined)
    query = query.eq("is_active", filters.is_active);
  if (filters?.shelter_id) query = query.eq("shelter_id", filters.shelter_id);
  if (filters?.animal_id) query = query.eq("animal_id", filters.animal_id);

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
    return (
      d.campaigns.find(
        (c) =>
          c.slug === slug &&
          d.shelters.some((s) => s.id === c.shelter_id && s.is_verified),
      ) ?? null
    );
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("donation_campaigns")
    .select(
      `
      *,
      shelter:shelters ( id, name, avatar_url ),
      animal:animals ( id, name, species )
    `,
    )
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
  if (isDemo()) return slicePage(await getCampaigns(filters), page, pageSize);
  const supabase = await createClient();
  const result = await fetchPage<RawCampaign>(
    (from, to) => {
      let query = supabase
        .from("donation_campaigns")
        .select(
          "*, shelter:shelters ( id, name, avatar_url ), animal:animals ( id, name, species )",
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .order("id");
      if (filters?.is_active !== undefined)
        query = query.eq("is_active", filters.is_active);
      if (filters?.shelter_id) query = query.eq("shelter_id", filters.shelter_id);
      if (filters?.animal_id) query = query.eq("animal_id", filters.animal_id);
      return query.range(from, to);
    },
    page,
    pageSize,
    "getCampaignsPage",
  );
  return { ...result, items: result.items.map(mapCampaign) };
}

/** Meta y recaudado sumados de todas las campañas que cumplen el filtro. */
export async function getCampaignTotals(filters?: CampaignFilters) {
  let rows: { goal_amount: number; current_amount: number }[];
  if (isDemo()) rows = await getCampaigns(filters);
  else {
    const supabase = await createClient();
    let query = supabase
      .from("donation_campaigns")
      .select("goal_amount, current_amount");
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
  };
}
