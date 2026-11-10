import { isDemo } from "@/lib/huellas/config";
import { readDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import { departmentPrefix } from "@/lib/ubigeo";
import type { LostReportWithSightings, LostReportFilters } from "@/types";
import {
  cleanSearch,
  fetchPage,
  ilikeAny,
  includesAny,
  slicePage,
  type Paged,
} from "@/lib/pagination";

type Db = Awaited<ReturnType<typeof createClient>>;

function departmentFilter(filters?: LostReportFilters) {
  const prefix = filters?.department ? departmentPrefix(filters.department) : null;
  return { prefix, impossible: Boolean(filters?.department && !prefix) };
}

async function demoReports(filters: LostReportFilters | undefined, prefix: string | null) {
  const q = cleanSearch(filters?.q);
  return (await readDemo()).reports.filter(
    (r) =>
      (!filters?.type || r.type === filters.type) &&
      (filters?.is_resolved === undefined || r.is_resolved === filters.is_resolved) &&
      (!filters?.ubigeo || r.ubigeo === filters.ubigeo) &&
      (!prefix || r.ubigeo.startsWith(prefix)) &&
      (!q || includesAny(q, r.description, r.last_seen_address)),
  );
}

// Sin async: el builder de Supabase es "thenable" y se ejecutaría al devolverlo.
function reportsQuery(
  supabase: Db,
  filters: LostReportFilters | undefined,
  prefix: string | null,
  select = "*, sightings:lost_found_sightings(*)",
  head = false,
) {
  let query = supabase
    .from("lost_found_reports")
    .select(select, { count: "exact", head })
    .order("created_at", { ascending: false })
    .order("id");
  if (filters?.type) query = query.eq("type", filters.type);
  if (filters?.is_resolved !== undefined)
    query = query.eq("is_resolved", filters.is_resolved);
  if (filters?.ubigeo) query = query.eq("ubigeo", filters.ubigeo);
  if (prefix) query = query.like("ubigeo", `${prefix}%`);
  const q = cleanSearch(filters?.q);
  if (q) query = query.or(ilikeAny(["description", "last_seen_address"], q));
  return query;
}

export async function getLostReports(
  filters?: LostReportFilters,
): Promise<LostReportWithSightings[]> {
  const { prefix, impossible } = departmentFilter(filters);
  if (impossible) return [];
  if (isDemo()) return demoReports(filters, prefix);

  const { data, error } = await reportsQuery(await createClient(), filters, prefix);
  if (error) {
    console.error("[data/lost-reports] getLostReports:", error.message);
    throw new Error(
      "No se pudo consultar Supabase. Revisa la configuración y migraciones.",
    );
  }
  return (data ?? []) as unknown as LostReportWithSightings[];
}

/** Una página de reportes; Supabase solo devuelve las filas de esa página. */
export async function getLostReportsPage(
  filters: LostReportFilters | undefined,
  page: number,
  pageSize: number,
): Promise<Paged<LostReportWithSightings>> {
  const { prefix, impossible } = departmentFilter(filters);
  if (impossible) return slicePage([], page, pageSize);
  if (isDemo()) return slicePage(await demoReports(filters, prefix), page, pageSize);
  const supabase = await createClient();
  return fetchPage<LostReportWithSightings>(
    (from, to) =>
      reportsQuery(supabase, filters, prefix).range(from, to) as unknown as PromiseLike<{
        data: LostReportWithSightings[] | null;
        count: number | null;
        error: { message: string } | null;
      }>,
    page,
    pageSize,
    "getLostReportsPage",
  );
}

/** Cuántos reportes de perdidos y encontrados cumplen el filtro (sin traer filas). */
export async function countLostReports(filters?: LostReportFilters) {
  const { prefix, impossible } = departmentFilter(filters);
  if (impossible) return { lost: 0, found: 0 };
  if (isDemo()) {
    const rows = await demoReports(filters, prefix);
    return {
      lost: rows.filter((r) => r.type === "lost").length,
      found: rows.filter((r) => r.type === "found").length,
    };
  }
  const supabase = await createClient();
  const count = async (type: "lost" | "found") => {
    if (filters?.type && filters.type !== type) return 0;
    const { count, error } = await reportsQuery(
      supabase,
      { ...filters, type },
      prefix,
      "id",
      true,
    );
    if (error) throw new Error("No se pudo contar los reportes.");
    return count ?? 0;
  };
  const [lost, found] = await Promise.all([count("lost"), count("found")]);
  return { lost, found };
}

export async function getLostReportBySlug(
  slug: string,
): Promise<LostReportWithSightings | null> {
  if (isDemo())
    return (await readDemo()).reports.find((r) => r.slug === slug) ?? null;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("lost_found_reports")
    .select("*, sightings:lost_found_sightings(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[data/lost-reports] getLostReportBySlug:", error.message);
    }
    return null;
  }

  return data as LostReportWithSightings;
}
