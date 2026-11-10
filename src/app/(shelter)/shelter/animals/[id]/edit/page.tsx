import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { shelterContext } from "@/lib/huellas/auth";
import { getShelterAnimal } from "@/lib/data/animals";
import NewAnimalForm from "../../new/NewAnimalForm";
import AnimalPhotos from "@/components/huellas/AnimalPhotos";

export const metadata: Metadata = { title: "Editar animal — Panel del albergue" };

export default async function EditAnimalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const shelterId = await shelterContext();
  const { id } = await params;
  // Solo animales del propio albergue.
  const animal = await getShelterAnimal(id, shelterId);
  if (!animal) notFound();

  return (
    <div className="max-w-2xl">
      <Link
        href="/shelter/animals"
        className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a animales
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl text-foreground sm:text-4xl">Editar a {animal.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Actualiza su ficha pública y sus fotos. El estado se cambia desde la lista de animales.
        </p>
      </div>
      <div className="space-y-6">
        <AnimalPhotos shelterId={shelterId} animalId={animal.id} photos={animal.animal_photos} />
        <NewAnimalForm shelterId={shelterId} animal={animal} />
      </div>
    </div>
  );
}
