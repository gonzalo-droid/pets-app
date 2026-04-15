'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn, formatAge, SPECIES_LABELS, SIZE_LABELS } from '@/lib/utils'
import type { AnimalWithPhotos } from '@/types'

interface AnimalCardProps {
  animal: AnimalWithPhotos
  shelterName?: string
  shelterId?: string
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  available: {
    label: 'Disponible',
    className: 'bg-adopt text-white',
  },
  in_process: {
    label: 'En proceso',
    className: 'bg-donate-light text-donate-dark',
  },
  adopted: {
    label: 'Adoptado',
    className: 'bg-muted text-muted-foreground',
  },
}

export default function AnimalCard({ animal, shelterName, shelterId }: AnimalCardProps) {
  const coverPhoto = animal.animal_photos.find((p) => p.is_cover) ?? animal.animal_photos[0]
  const badge = STATUS_BADGE[animal.status]

  return (
    <div className="group relative flex flex-col rounded-2xl bg-card overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
      {/* Link principal — cubre toda la card */}
      <Link
        href={`/adopt/${animal.slug}`}
        className="absolute inset-0 z-0"
        aria-label={`Ver ${animal.name}`}
      />

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

        {/* Badge flotante sobre la foto */}
        {badge && (
          <span className={cn(
            'absolute top-3 left-3 z-10 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
            badge.className
          )}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col gap-2 p-4 flex-1 pointer-events-none">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-bold text-foreground text-base leading-tight">
            {animal.name}
          </h3>
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

        {/* Albergue */}
        {shelterName && (
          <div className="mt-auto pt-2 border-t border-border pointer-events-auto">
            {shelterId ? (
              <Link
                href={`/shelters/${shelterId}`}
                className="text-xs text-brand-400 hover:underline truncate block"
              >
                {shelterName}
              </Link>
            ) : (
              <p className="text-xs text-muted-foreground truncate">{shelterName}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
