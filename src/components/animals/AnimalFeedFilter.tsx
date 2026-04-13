'use client'

import { useState } from 'react'
import AnimalCard from './AnimalCard'
import { cn } from '@/lib/utils'
import type { AnimalWithPhotos, AnimalSpecies } from '@/types'

const FILTERS: { label: string; value: AnimalSpecies | 'all' }[] = [
  { label: 'Todos', value: 'all' },
  { label: '🐶 Perros', value: 'dog' },
  { label: '🐱 Gatos', value: 'cat' },
  { label: '🐾 Otros', value: 'other' },
]

interface AnimalFeedFilterProps {
  animals: AnimalWithPhotos[]
  shelterNames: Record<string, string>
}

export default function AnimalFeedFilter({ animals, shelterNames }: AnimalFeedFilterProps) {
  const [active, setActive] = useState<AnimalSpecies | 'all'>('all')

  const filtered = active === 'all' ? animals : animals.filter((a) => a.species === active)

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs de filtro */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActive(value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium border transition-colors',
              active === value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-background'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grid de animales */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              shelterName={shelterNames[animal.shelter_id]}
            />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm py-8 text-center">
          No hay animales disponibles en esta categoría.
        </p>
      )}
    </div>
  )
}
