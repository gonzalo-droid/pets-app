import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Check,
  Heart,
  Info,
  MapPin,
} from "lucide-react";
import PhotoGallery from "@/components/animals/PhotoGallery";
import {
  cn,
  formatAge,
  SPECIES_LABELS,
  SIZE_LABELS,
  GENDER_LABELS,
} from "@/lib/utils";
import { DISTRICT_LABEL } from "@/lib/ubigeo";
import { getAnimalBySlug } from "@/lib/data/animals";
import { getShelterById } from "@/lib/data/shelters";

interface AnimalDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: AnimalDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const animal = await getAnimalBySlug(slug);
  if (!animal) return { title: "Animal no encontrado" };
  return {
    title: `${animal.name} — ${SPECIES_LABELS[animal.species]} en adopción`,
    description:
      animal.description ??
      `Conoce a ${animal.name}, disponible para adopción en Lambayeque.`,
  };
}

// Solo se muestran los datos de salud confirmados: la ausencia de un dato
// no significa que el animal no lo tenga.
const HEALTH = [
  { key: "is_vaccinated", label: "Vacunado" },
  { key: "is_neutered", label: "Esterilizado" },
  { key: "is_microchipped", label: "Con microchip" },
] as const;

const STATUS_CHIP = {
  available: { label: "Busca un hogar", className: "bg-success-bg text-success-fg" },
  in_process: { label: "Adopción en proceso", className: "bg-warning-bg text-warning-fg" },
  adopted: { label: "Adoptado", className: "bg-muted text-muted-foreground" },
} as const;

export default async function AnimalDetailPage({
  params,
}: AnimalDetailPageProps) {
  const { slug } = await params;
  const animal = await getAnimalBySlug(slug);
  if (!animal) notFound();

  const shelter = await getShelterById(animal.shelter_id);
  const place = DISTRICT_LABEL[animal.ubigeo] ?? "Lambayeque";
  const canAdopt = animal.status === "available";
  // Un animal adoptado no recibe nuevos apadrinamientos.
  const canSponsor = animal.status !== "adopted";
  const chip =
    STATUS_CHIP[animal.status as keyof typeof STATUS_CHIP] ?? STATUS_CHIP.adopted;
  const health = HEALTH.filter(({ key }) => animal[key]);
  const facts = [
    { label: "Especie", value: SPECIES_LABELS[animal.species] + (animal.breed ? ` · ${animal.breed}` : "") },
    { label: "Edad aproximada", value: formatAge(animal.age_months) },
    { label: "Tamaño", value: SIZE_LABELS[animal.size] },
    { label: "Sexo", value: GENDER_LABELS[animal.gender] },
    ...(animal.color ? [{ label: "Color", value: animal.color }] : []),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 pt-6 sm:px-6 sm:pt-10 lg:px-8 lg:pb-12">
      <Link
        href="/adopt"
        className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a los animales
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
        <PhotoGallery photos={animal.animal_photos} animalName={animal.name} />

        <div className="flex flex-col gap-6">
          <div>
            <span
              className={cn(
                "inline-flex -rotate-2 rounded-full px-3 py-1 text-sm font-extrabold",
                chip.className,
              )}
            >
              {chip.label}
            </span>
            <h1 className="mt-3 text-5xl leading-none text-foreground">
              {animal.name}
            </h1>
            {shelter && (
              <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {shelter.name} · {place}
              </p>
            )}
          </div>

          <dl className="grid grid-cols-2 gap-3">
            {facts.map(({ label, value }) => (
              <div key={label} className="rounded-2xl bg-secondary px-4 py-3">
                <dt className="text-xs text-muted-foreground">{label}</dt>
                <dd className="mt-0.5 text-sm font-semibold text-foreground">{value}</dd>
              </div>
            ))}
          </dl>

          {health.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Salud informada por el albergue">
              {health.map(({ key, label }) => (
                <li
                  key={key}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-foreground"
                >
                  <Check className="h-4 w-4 text-primary" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          )}

          {/* Acciones según el estado del animal (en móvil, también en la barra fija) */}
          <div className="flex flex-col gap-3 rounded-[28px] border border-border bg-card p-5">
            {canAdopt ? (
              <Link
                href={`/adopt/${animal.slug}/apply`}
                className="huellas-button w-full"
              >
                Solicitar adopción
              </Link>
            ) : (
              <p className="flex items-start gap-2 rounded-xl bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {animal.status === "adopted"
                  ? `${animal.name} ya encontró un hogar.`
                  : `${animal.name} tiene una adopción en proceso. No recibe nuevas solicitudes por ahora.`}
              </p>
            )}
            {canSponsor && (
              <>
                <Link
                  href={`/sponsor/${animal.slug}`}
                  className="huellas-button huellas-button--support-outline w-full"
                >
                  <Heart className="h-5 w-5" aria-hidden="true" />
                  Apadrinar a {animal.name}
                </Link>
                <p className="text-center text-xs text-muted-foreground">
                  Tu aporte mensual va al cuidado de {animal.name}. Sin cobro por ahora;
                  no reemplaza la adopción.
                </p>
              </>
            )}
          </div>

          {shelter && (
            <Link
              href={`/shelters/${shelter.id}`}
              className="flex items-center gap-4 rounded-[24px] border border-border bg-card p-4 transition-transform hover:-translate-y-0.5"
            >
              {shelter.avatar_url && (
                <Image
                  src={shelter.avatar_url}
                  unoptimized={shelter.avatar_url.includes("api.dicebear.com")}
                  alt=""
                  width={48}
                  height={48}
                  sizes="48px"
                  className="h-12 w-12 rounded-xl border border-border bg-secondary object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">Albergue responsable</p>
                <p className="flex items-center gap-1.5 truncate font-semibold text-foreground">
                  {shelter.name}
                  {shelter.is_verified && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verificado" />
                  )}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>

      {animal.description && (
        <section className="mt-10 max-w-3xl">
          <h2 className="text-3xl text-foreground">Su historia</h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{animal.description}</p>
          <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            Publicado el{" "}
            {new Date(animal.created_at).toLocaleDateString("es-PE", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </section>
      )}

      {/* Barra fija en móvil con las acciones disponibles */}
      {(canAdopt || canSponsor) && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex gap-3 rounded-t-[28px] border-t border-border bg-card px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 lg:hidden">
          {canSponsor && (
            <Link
              href={`/sponsor/${animal.slug}`}
              className="huellas-button huellas-button--support-outline flex-1 px-3"
            >
              <Heart className="h-5 w-5" aria-hidden="true" />
              Apadrinar
            </Link>
          )}
          {canAdopt && (
            <Link href={`/adopt/${animal.slug}/apply`} className="huellas-button flex-[1.3] px-3">
              Solicitar adopción
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
