// Paginación compartida por los listados. En Supabase se pide solo la página
// visible (.range + count); en la demo se recorta el arreglo en memoria.

export type Paged<T> = {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
};

/** Número de página válido (≥ 1) a partir de un parámetro de URL. */
export function parsePage(raw: unknown): number {
  const n = Math.floor(Number(raw));
  return Number.isFinite(n) && n >= 1 ? n : 1;
}

function totalPagesFor(total: number, pageSize: number) {
  return Math.max(1, Math.ceil(total / pageSize));
}

/** Recorta un arreglo ya filtrado. Una página fuera de rango muestra la última. */
export function slicePage<T>(rows: T[], page: number, pageSize: number): Paged<T> {
  const totalPages = totalPagesFor(rows.length, pageSize);
  const current = Math.min(page, totalPages);
  return {
    items: rows.slice((current - 1) * pageSize, current * pageSize),
    total: rows.length,
    page: current,
    totalPages,
  };
}

type RangeResult<T> = {
  data: T[] | null;
  count: number | null;
  error: { message: string } | null;
};

/**
 * Ejecuta una consulta paginada de Supabase. `run(from, to)` debe construir la
 * consulta con `{ count: "exact" }` y aplicar `.range(from, to)`.
 */
export async function fetchPage<T>(
  run: (from: number, to: number) => PromiseLike<RangeResult<T>>,
  page: number,
  pageSize: number,
  label: string,
): Promise<Paged<T>> {
  const query = async (p: number) => {
    const { data, count, error } = await run((p - 1) * pageSize, p * pageSize - 1);
    if (error) {
      console.error(`[pagination] ${label}:`, error.message);
      throw new Error(
        "No se pudo consultar Supabase. Revisa la configuración y migraciones.",
      );
    }
    return { items: data ?? [], total: count ?? 0 };
  };
  let result = await query(page);
  const totalPages = totalPagesFor(result.total, pageSize);
  let current = page;
  // Página fuera de rango (p. ej. ?page=99): se muestra la última.
  if (page > totalPages) {
    current = totalPages;
    result = await query(current);
  }
  return { ...result, page: current, totalPages };
}

/**
 * Texto de búsqueda normalizado. Quita los caracteres que tienen significado en
 * los filtros de PostgREST (comas, paréntesis, comodines) para que no se puedan
 * inyectar condiciones.
 */
export function cleanSearch(q: unknown): string {
  return typeof q === "string"
    ? q.replace(/[,()%_*\\:"']/g, " ").replace(/\s+/g, " ").trim().toLowerCase().slice(0, 80)
    : "";
}

/** Filtro `.or()` de PostgREST: alguna de las columnas contiene el texto. */
export function ilikeAny(columns: string[], q: string) {
  return columns.map((c) => `${c}.ilike.%${q}%`).join(",");
}

/** Búsqueda equivalente en la demo. */
export function includesAny(q: string, ...values: (string | null | undefined)[]) {
  return values.some((v) => v?.toLowerCase().includes(q));
}

/** Query string actual sin `page`, para los enlaces de PaginationNav. */
export function queryWithoutPage(params: Record<string, string | undefined>) {
  const rest = Object.entries(params).filter(
    ([k, v]) => k !== "page" && v !== undefined && v !== "",
  ) as [string, string][];
  return new URLSearchParams(rest).toString();
}
