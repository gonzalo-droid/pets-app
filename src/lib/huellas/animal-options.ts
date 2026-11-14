import { getAnimalsByShelter } from "@/lib/data/animals";

/** Animales que pueden tener un caso: los que aún están en el albergue (y el actual al editar). */
export async function animalOptions(shelterId: string, keep?: string | null) {
  const animals = await getAnimalsByShelter(shelterId);
  return animals
    .filter((a) => a.status !== "adopted" || a.id === keep)
    .map((a) => ({
      id: a.id,
      name: a.name,
      photo: (a.animal_photos.find((p) => p.is_cover) ?? a.animal_photos[0])?.url ?? null,
    }));
}
