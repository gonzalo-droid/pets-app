import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { cn, formatAge, SPECIES_LABELS, SIZE_LABELS } from '@/lib/utils'
import type { AnimalWithPhotos } from '@/types'

interface AnimalCardProps {
  animal: AnimalWithPhotos
  shelterName?: string
}

const HEALTH_CHIPS = [
  { key: 'is_vaccinated', label: 'Vacunado' },
  { key: 'is_neutered', label: 'Castrado' },
  { key: 'is_microchipped', label: 'Microchip' },
] as const

export default function AnimalCard({ animal, shelterName }: AnimalCardProps) {
  const coverPhoto = animal.animal_photos.find((p) => p.is_cover) ?? animal.animal_photos[0]
  const activeChips = HEALTH_CHIPS.filter(({ key }) => animal[key])

  return (
    <Link
      href={`/adopt/${animal.slug}`}
      className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden hover:border-primary/40 hover:shadow-md transition-all"
    >
      {/* Foto */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {coverPhoto ? (
          <Image
            src={coverPhoto.url}
            alt={`Foto de ${animal.name}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-muted-foreground">
            {animal.species === 'dog' ? '🐶' : animal.species === 'cat' ? '🐱' : '🐾'}
          </div>
        )}
        {/* Badge de estado */}
        {animal.status === 'in_process' && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="text-xs">En proceso</Badge>
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground text-base leading-tight">{animal.name}</h3>
          <span className="text-xs text-muted-foreground shrink-0">
            {SPECIES_LABELS[animal.species]}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatAge(animal.age_months)}</span>
          <span>·</span>
          <span>{SIZE_LABELS[animal.size]}</span>
          {animal.breed && (
            <>
              <span>·</span>
              <span className="truncate">{animal.breed}</span>
            </>
          )}
        </div>

        {/* Chips de salud */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {activeChips.map(({ label }) => (
              <span
                key={label}
                className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Albergue */}
        {shelterName && (
          <p className="mt-auto pt-2 text-xs text-muted-foreground border-t border-border truncate">
            {shelterName}
          </p>
        )}
      </div>
    </Link>
  )
}
