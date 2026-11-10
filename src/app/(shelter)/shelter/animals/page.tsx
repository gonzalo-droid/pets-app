import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Plus } from "lucide-react";
import { shelterContext } from "@/lib/huellas/auth";
import { ActionButton } from "@/components/huellas/Forms";
import { PawIcon } from "@/components/campaigns/PawProgress";
import PaginationNav from "@/components/ui/pagination-nav";
import { getAnimalsByShelterPage } from "@/lib/data/animals";
import { parsePage } from "@/lib/pagination";
import { cn, formatAge, SPECIES_LABELS, STATUS_LABELS } from "@/lib/utils";

export const metadata: Metadata = { title: "Animales — Panel del albergue" };

const PAGE_SIZE = 20;

const STATUS_CHIP: Record<string, string> = {
  available: "bg-success-bg text-success-fg",
  in_process: "bg-warning-bg text-warning-fg",
  adopted: "bg-muted text-muted-foreground",
};

// Cambio manual de estado. Las solicitudes de adopción ya lo actualizan solas.
const STATUS_ACTIONS: Record<string, { label: string; confirm?: string }> = {
  available: { label: "Marcar disponible" },
  in_process: { label: "Marcar en proceso" },
  adopted: {
    label: "Marcar adoptado",
    confirm: "¿Marcar como adoptado? Dejará de recibir solicitudes y apadrinamientos.",
  },
};

export default async function ShelterAnimalsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const { items: animals, page, totalPages, total } = await getAnimalsByShelterPage(
    await shelterContext(),
    parsePage(rawPage),
    PAGE_SIZE,
  );

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl">Animales</h1>
          <p className="mt-1 text-muted-foreground">
            {total} publicado{total === 1 ? "" : "s"}. Mantén su estado al día.
          </p>
        </div>
        <Link href="/shelter/animals/new" className="huellas-button">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Registrar animal
        </Link>
      </div>

      {animals.length === 0 ? (
        <div className="rounded-[28px] border-2 border-dashed border-border bg-card p-10 text-center">
          <p className="text-lg font-bold">Aún no has publicado animales</p>
          <p className="mt-1 text-muted-foreground">
            Cuéntale a la comunidad quiénes buscan hogar en tu albergue.
          </p>
          <Link href="/shelter/animals/new" className="huellas-button mt-5">
            Registrar el primero
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {animals.map((animal) => {
            const cover = animal.animal_photos.find((p) => p.is_cover) ?? animal.animal_photos[0];
            const health = [
              animal.is_vaccinated && "Vacunado",
              animal.is_neutered && "Esterilizado",
              animal.is_microchipped && "Microchip",
            ].filter(Boolean) as string[];
            return (
              <li
                key={animal.id}
                className="flex flex-col gap-4 rounded-[24px] border border-border bg-card p-4 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-support-soft">
                    {cover ? (
                      <Image src={cover.url} alt="" fill className="object-cover" sizes="64px" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-primary/50">
                        <PawIcon className="h-7 w-7" />
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl">{animal.name}</h2>
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-extrabold", STATUS_CHIP[animal.status] ?? STATUS_CHIP.adopted)}>
                        {STATUS_LABELS[animal.status] ?? animal.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {SPECIES_LABELS[animal.species]} · {formatAge(animal.age_months)}
                    </p>
                    {health.length > 0 && (
                      <ul className="mt-1 flex flex-wrap gap-1.5" aria-label="Salud">
                        {health.map((h) => (
                          <li key={h} className="flex items-center gap-1 text-xs font-bold text-primary">
                            <Check className="h-3.5 w-3.5" aria-hidden="true" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {(["available", "in_process", "adopted"] as const)
                    .filter((status) => status !== animal.status)
                    .map((status) => (
                      <ActionButton
                        key={status}
                        confirm={STATUS_ACTIONS[status].confirm}
                        payload={{ action: "animal_status", shelter_id: animal.shelter_id, id: animal.id, status }}
                      >
                        {STATUS_ACTIONS[status].label}
                      </ActionButton>
                    ))}
                  <Link
                    href={`/adopt/${animal.slug}`}
                    target="_blank"
                    className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-extrabold text-primary hover:underline"
                  >
                    Ver ficha
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <PaginationNav currentPage={page} totalPages={totalPages} paramString="" pathname="/shelter/animals" />
    </div>
  );
}
