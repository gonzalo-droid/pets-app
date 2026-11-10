import { isDemo } from "./config";
import { readDemo, type DemoData } from "./demo";
import { createClient } from "@/lib/supabase/server";
import { fetchPage, slicePage, type Paged } from "@/lib/pagination";

type Table = "needs" | "support_intents" | "adoption_requests";
type Row<T extends Table> = T extends "needs"
  ? DemoData["needs"][number]
  : T extends "support_intents"
    ? DemoData["support"][number]
    : DemoData["requests"][number];

type Filters = {
  shelterId?: string;
  donorId?: string;
  /** Solo necesidades abiertas de albergues verificados (vista pública). */
  openNeeds?: boolean;
};

async function demoRows<T extends Table>(table: T, f: Filters) {
  const d = await readDemo();
  const rows = (
    table === "needs" ? d.needs : table === "support_intents" ? d.support : d.requests
  ) as Row<T>[];
  return rows.filter(
    (r) =>
      (!f.shelterId || r.shelter_id === f.shelterId) &&
      (!f.donorId ||
        ("donor_id" in r
          ? r.donor_id === f.donorId
          : "requester_id" in r && r.requester_id === f.donorId)) &&
      (!f.openNeeds ||
        ("fulfilled" in r &&
          !r.fulfilled &&
          d.shelters.some((s) => s.id === r.shelter_id && s.is_verified))),
  );
}

type Db = Awaited<ReturnType<typeof createClient>>;

// Sin async: el builder de Supabase es "thenable" y se ejecutaría al devolverlo.
function recordsQuery(db: Db, table: Table, f: Filters) {
  let q = db
    .from(table)
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id");
  if (f.shelterId) q = q.eq("shelter_id", f.shelterId);
  if (f.donorId)
    q = q.eq(table === "adoption_requests" ? "requester_id" : "donor_id", f.donorId);
  // La RLS ya limita las necesidades visibles a albergues verificados.
  if (f.openNeeds) q = q.eq("fulfilled", false);
  return q;
}

export async function records<T extends Table>(
  table: T,
  shelterId?: string,
  donorId?: string,
): Promise<Row<T>[]> {
  if (isDemo()) return demoRows(table, { shelterId, donorId });
  const { data, error } = await recordsQuery(await createClient(), table, {
    shelterId,
    donorId,
  });
  if (error)
    throw new Error(
      "No se pudieron cargar los registros. Revisa las migraciones.",
    );
  return (data ?? []) as Row<T>[];
}

/** Una página de registros; Supabase solo devuelve las filas de esa página. */
export async function recordsPage<T extends Table>(
  table: T,
  filters: Filters,
  page: number,
  pageSize: number,
): Promise<Paged<Row<T>>> {
  if (isDemo()) return slicePage(await demoRows(table, filters), page, pageSize);
  const db = await createClient();
  return fetchPage<Row<T>>(
    (from, to) =>
      recordsQuery(db, table, filters).range(from, to) as unknown as PromiseLike<{
        data: Row<T>[] | null;
        count: number | null;
        error: { message: string } | null;
      }>,
    page,
    pageSize,
    `recordsPage:${table}`,
  );
}
