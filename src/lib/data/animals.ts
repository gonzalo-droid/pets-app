import { isDemo } from "@/lib/huellas/config";
import { readDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import { departmentPrefix } from "@/lib/ubigeo";
import type { AnimalWithPhotos, AnimalFilters } from "@/types";

export async function getAnimals(
  filters?: AnimalFilters,
): Promise<AnimalWithPhotos[]> {
  // Un departamento no soportado no devuelve resultados (igual en demo y Supabase).
  const prefix = filters?.department ? departmentPrefix(filters.department) : null;
  if (filters?.department && !prefix) return [];
  if (isDemo()) {
    const d = await readDemo();
    return d.animals.filter(
      (a) =>
        d.shelters.some((s) => s.id === a.shelter_id && s.is_verified) &&
        (!filters?.species || a.species === filters.species) &&
        (!filters?.size || a.size === filters.size) &&
        (!filters?.status || a.status === filters.status) &&
        (!filters?.ubigeo || a.ubigeo === filters.ubigeo) &&
        (!prefix || a.ubigeo.startsWith(prefix)),
    );
  }
  const supabase = await createClient();

  let query = supabase
    .from("animals")
    .select("*, animal_photos(*)")
    .order("created_at", { ascending: false });

  if (filters?.species) query = query.eq("species", filters.species);
  if (filters?.size) query = query.eq("size", filters.size);
  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.ubigeo) query = query.eq("ubigeo", filters.ubigeo);
  if (prefix) query = query.like("ubigeo", `${prefix}%`);

  const { data, error } = await query;

  if (error) {
    console.error("[data/animals] getAnimals:", error.message);
    throw new Error(
      "No se pudo consultar Supabase. Revisa la configuración y migraciones.",
    );
  }

  return (data ?? []) as AnimalWithPhotos[];
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
