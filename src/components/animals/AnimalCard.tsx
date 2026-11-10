import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, MapPin, PawPrint } from 'lucide-react'
import { cn, formatAge, SPECIES_LABELS } from '@/lib/utils'
import type { AnimalWithPhotos } from '@/types'

interface AnimalCardProps {
  animal: AnimalWithPhotos
  shelterName?: string
  /** Se mantiene por compatibilidad; la tarjeta completa enlaza a la ficha. */
  shelterId?: string
}

// El estado se comunica con texto y color, nunca solo con color.
const STATUS_CHIP: Record<string, { label: string; className: string }> = {
  available: { label: 'Busca un hogar', className: 'bg-success-bg text-success-fg' },
  in_process: { label: 'En proceso', className: 'bg-warning-bg text-warning-fg' },
  adopted: { label: 'Adoptado', className: 'bg-muted text-muted-foreground' },
}

export default function AnimalCard({ animal, shelterName }: AnimalCardProps) {
  const coverPhoto = animal.animal_photos.find((p) => p.is_cover) ?? animal.animal_photos[0]
  const chip = STATUS_CHIP[animal.status]

  return (
    // Un único enlace para foto, nombre y acción: sin enlaces anidados y
    // con toda la superficie clicable (también en móvil).
    <Link
      href={`/adopt/${animal.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color] duration-200 hover:border-primary/40 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {coverPhoto ? (
          <Image
            src={coverPhoto.url}
            alt={`Foto de ${animal.name}`}
            fill
            className="object-cover object-[center_30%] transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          // Placeholder de marca: nunca la foto de otro animal.
          <div className="flex h-full flex-col items-center justify-center gap-2 text-primary/50">
            <PawPrint className="h-10 w-10" aria-hidden="true" />
            <span className="text-xs font-medium text-muted-foreground">Sin foto todavía</span>
          </div>
        )}
        {chip && (
          <span
            className={cn(
              'absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold',
              chip.className,
            )}
          >
            {chip.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-xl font-bold leading-tight text-foreground">{animal.name}</h3>
        <ul className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <PawPrint className="h-4 w-4 text-primary" aria-hidden="true" />
            {SPECIES_LABELS[animal.species]}
          </li>
          <li>{formatAge(animal.age_months)}</li>
          {shelterName && (
            <li className="flex min-w-0 items-center gap-1.5">
              <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{shelterName}</span>
            </li>
          )}
        </ul>
        <span className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-primary/60 px-4 text-sm font-semibold text-primary transition-colors group-hover:bg-secondary">
          Conocer su historia
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  )
}
