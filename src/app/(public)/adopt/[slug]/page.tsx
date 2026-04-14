import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { BadgeCheck, MapPin, Calendar, ArrowLeft } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import PhotoGallery from '@/components/animals/PhotoGallery'
import { cn, formatAge, SPECIES_LABELS, SIZE_LABELS, GENDER_LABELS, STATUS_LABELS } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { getAnimalBySlug } from '@/lib/mock/animals'
import { getShelterById } from '@/lib/mock/shelters'

interface AnimalDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: AnimalDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const animal = await getAnimalBySlug(slug)
  if (!animal) return { title: 'Animal no encontrado' }
  return {
    title: `${animal.name} — ${SPECIES_LABELS[animal.species]} en adopción`,
    description: animal.description ?? `Conoce a ${animal.name}, disponible para adopción en Lambayeque.`,
  }
}

const HEALTH_CHIPS = [
  { key: 'is_vaccinated', label: '💉 Vacunado', active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', inactive: 'bg-muted text-muted-foreground opacity-50' },
  { key: 'is_neutered', label: '✂️ Castrado/a', active: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', inactive: 'bg-muted text-muted-foreground opacity-50' },
  { key: 'is_microchipped', label: '📡 Microchip', active: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', inactive: 'bg-muted text-muted-foreground opacity-50' },
] as const

const DISTRICT_NAMES: Record<string, string> = {
  '140101': 'Chiclayo',
  '140108': 'José L. Ortiz',
  '140110': 'La Victoria',
  '140201': 'Ferreñafe',
  '140301': 'Lambayeque ciudad',
}

export default async function AnimalDetailPage({ params }: AnimalDetailPageProps) {
  const { slug } = await params
  const animal = await getAnimalBySlug(slug)
  if (!animal) notFound()

  const shelter = await getShelterById(animal.shelter_id)
  const district = DISTRICT_NAMES[animal.ubigeo] ?? 'Lambayeque'
  const isAvailable = animal.status === 'available'

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <Link
        href="/adopt"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a adopciones
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Galería */}
        <div>
          <PhotoGallery photos={animal.animal_photos} animalName={animal.name} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          {/* Nombre y estado */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{animal.name}</h1>
              <p className="text-muted-foreground mt-1">
                {SPECIES_LABELS[animal.species]}
                {animal.breed ? ` · ${animal.breed}` : ''}
              </p>
            </div>
            <Badge
              variant={isAvailable ? 'default' : 'secondary'}
              className="shrink-0 mt-1"
            >
              {STATUS_LABELS[animal.status]}
            </Badge>
          </div>

          {/* Chips de salud */}
          <div className="flex flex-wrap gap-2">
            {HEALTH_CHIPS.map(({ key, label, active, inactive }) => (
              <span
                key={key}
                className={cn(
                  'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
                  animal[key] ? active : inactive
                )}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Características */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Edad', value: formatAge(animal.age_months) },
              { label: 'Tamaño', value: SIZE_LABELS[animal.size] },
              { label: 'Género', value: GENDER_LABELS[animal.gender] },
              { label: 'Color', value: animal.color ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg bg-muted/40 px-4 py-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span>{district}, Lambayeque</span>
          </div>

          {/* Descripción */}
          {animal.description && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">Sobre {animal.name}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{animal.description}</p>
            </div>
          )}

          {/* Albergue */}
          {shelter && (
            <Link
              href={`/shelters/${shelter.id}`}
              className="rounded-xl border border-border p-4 flex items-center gap-4 hover:border-primary/40 hover:shadow-sm transition-all"
            >
              {shelter.avatar_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={shelter.avatar_url}
                  alt={shelter.name}
                  className="h-12 w-12 rounded-full border border-border bg-muted"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-foreground truncate">{shelter.name}</p>
                  {shelter.is_verified && (
                    <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {district}, Lambayeque
                </p>
              </div>
            </Link>
          )}

          {/* Fecha */}
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Publicado el {new Date(animal.created_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {isAvailable ? (
              <Link
                href={`/adopt/${animal.slug}/apply`}
                className={cn(buttonVariants({ size: 'lg' }), 'flex-1 justify-center')}
              >
                Solicitar adopción
              </Link>
            ) : (
              <div className="flex-1 rounded-lg bg-muted px-4 py-3 text-sm text-center text-muted-foreground">
                Este animal ya tiene un proceso de adopción en curso.
              </div>
            )}
            <Link
              href="/adopt"
              className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'flex-1 justify-center')}
            >
              Ver más animales
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
