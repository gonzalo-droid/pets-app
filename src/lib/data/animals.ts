import { isDemo } from "@/lib/huellas/config";
import { readDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import { departmentPrefix } from "@/lib/ubigeo";
import type { AnimalWithPhotos, AnimalFilters } from "@/types";
import {
  cleanSearch,
  fetchPage,
  ilikeAny,
  includesAny,
  slicePage,
  type Paged,
} from "@/lib/pagination";

// Un departamento no soportado no devuelve resultados (igual en demo y Supabase).
function departmentFilter(filters?: AnimalFilters) {
  const prefix = filters?.department ? departmentPrefix(filters.department) : null;
  return { prefix, impossible: Boolean(filters?.department && !prefix) };
}

async function demoAnimals(filters: AnimalFilters | undefined, prefix: string | null) {
  const d = await readDemo();
  const q = cleanSearch(filters?.q);
  return d.animals.filter(
    (a) =>
      d.shelters.some((s) => s.id === a.shelter_id && s.is_verified) &&
      (!filters?.species || a.species === filters.species) &&
      (!filters?.size || a.size === filters.size) &&
      (!filters?.status || a.status === filters.status) &&
      (!filters?.ubigeo || a.ubigeo === filters.ubigeo) &&
      (!prefix || a.ubigeo.startsWith(prefix)) &&
      (!q || includesAny(q, a.name, a.breed, a.description)),
  );
}

type Db = Awaited<ReturnType<typeof createClient>>;

// Sin async: el builder de Supabase es "thenable" y se ejecutaría al devolverlo.
function animalsQuery(
  supabase: Db,
  filters: AnimalFilters | undefined,
  prefix: string | null,
) {
  let query = supabase
    .from("animals")
    .select("*, animal_photos(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id");
  if (filters?.species) query = query.eq("species", filters.species);
  if (filters?.size) query = query.eq("size", filters.size);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.ubigeo) query = query.eq("ubigeo", filters.ubigeo);
  if (prefix) query = query.like("ubigeo", `${prefix}%`);
  const q = cleanSearch(filters?.q);
  if (q) query = query.or(ilikeAny(["name", "breed", "description"], q));
  return query;
}

export async function getAnimals(
  filters?: AnimalFilters,
): Promise<AnimalWithPhotos[]> {
  const { prefix, impossible } = departmentFilter(filters);
  if (impossible) return [];
  if (isDemo()) return demoAnimals(filters, prefix);

  const { data, error } = await animalsQuery(await createClient(), filters, prefix);
  if (error) {
    console.error("[data/animals] getAnimals:", error.message);
    throw new Error(
      "No se pudo consultar Supabase. Revisa la configuración y migraciones.",
    );
  }
  return (data ?? []) as AnimalWithPhotos[];
}

/** Una página de animales; Supabase solo devuelve las filas de esa página. */
export async function getAnimalsPage(
  filters: AnimalFilters | undefined,
  page: number,
  pageSize: number,
): Promise<Paged<AnimalWithPhotos>> {
  const { prefix, impossible } = departmentFilter(filters);
  if (impossible) return slicePage([], page, pageSize);
  if (isDemo()) return slicePage(await demoAnimals(filters, prefix), page, pageSize);
  const supabase = await createClient();
  return fetchPage<AnimalWithPhotos>(
    (from, to) => animalsQuery(supabase, filters, prefix).range(from, to),
    page,
    pageSize,
    "getAnimalsPage",
  );
}

export async function getAnimalBySlug(
  slug: string,
): Promise<AnimalWithPhotos | null> {
  if (isDemo()) {
    const d = await readDemo();
    return (
      d.animals.find(
        (a) =>
          a.slug === slug &&
          d.shelters.some((s) => s.id === a.shelter_id && s.is_verified),
      ) ?? null
    );
  }
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("animals")
    .select("*, animal_photos(*)")
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code !== "PGRST116") {
      console.error("[data/animals] getAnimalBySlug:", error.message);
    }
    return null;
  }

  return data as AnimalWithPhotos;
}

export async function getAnimalsByShelter(
  shelterId: string,
): Promise<AnimalWithPhotos[]> {
  if (isDemo())
    return (await readDemo()).animals.filter((a) => a.shelter_id === shelterId);
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("animals")
    .select("*, animal_photos(*)")
    .eq("shelter_id", shelterId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[data/animals] getAnimalsByShelter:", error.message);
    throw new Error(
      "No se pudo consultar Supabase. Revisa la configuración y migraciones.",
    );
  }

  return (data ?? []) as AnimalWithPhotos[];
}

/** Una página de los animales de un albergue (panel). */
export async function getAnimalsByShelterPage(
  shelterId: string,
  page: number,
  pageSize: number,
): Promise<Paged<AnimalWithPhotos>> {
  if (isDemo())
    return slicePage(await getAnimalsByShelter(shelterId), page, pageSize);
  const supabase = await createClient();
  return fetchPage<AnimalWithPhotos>(
    (from, to) =>
      supabase
        .from("animals")
        .select("*, animal_photos(*)", { count: "exact" })
        .eq("shelter_id", shelterId)
        .order("created_at", { ascending: false })
        .order("id")
        .range(from, to),
    page,
    pageSize,
    "getAnimalsByShelterPage",
  );
}
