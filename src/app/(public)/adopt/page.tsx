import { Suspense } from 'react'
import type { Metadata } from 'next'
import AnimalCard from '@/components/animals/AnimalCard'
import AnimalFiltersPanel from '@/components/animals/AnimalFiltersPanel'
import { Skeleton } from '@/components/ui/skeleton'
import { getAnimals } from '@/lib/mock/animals'
import { getShelters } from '@/lib/mock/shelters'
import type { AnimalSpecies, AnimalSize } from '@/types'

export const metadata: Metadata = {
  title: 'Animales en adopción',
  description: 'Encuentra tu compañero ideal entre los animales disponibles en Lambayeque, Perú.',
}

interface AdoptPageProps {
  searchParams: Promise<{ species?: string; size?: string }>
}

export default async function AdoptPage({ searchParams }: AdoptPageProps) {
  const params = await searchParams
  const species = params.species as AnimalSpecies | undefined
  const size = params.size as AnimalSize | undefined

  const [animals, shelters] = await Promise.all([
    getAnimals({ species, size, status: 'available' }),
    getShelters(),
  ])

  const shelterNames = Object.fromEntries(shelters.map((s) => [s.id, s.name]))

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Animales en adopción
        </h1>
        <p className="mt-2 text-muted-foreground">
          {animals.length === 0
            ? 'No hay animales disponibles con estos filtros.'
            : `${animals.length} animal${animals.length === 1 ? '' : 'es'} esperando un hogar`}
        </p>
      </div>

      {/* Filtros — suspense necesario por useSearchParams dentro */}
      <div className="mb-8 p-4 rounded-xl border border-border bg-muted/20">
        <Suspense fallback={<div className="h-10 animate-pulse bg-muted rounded-full w-64" />}>
          <AnimalFiltersPanel />
        </Suspense>
      </div>

      {/* Grid */}
      {animals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {animals.map((animal) => (
            <AnimalCard
              key={animal.id}
              animal={animal}
              shelterName={shelterNames[animal.shelter_id]}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl">🐾</span>
          <p className="text-lg font-medium text-foreground">Sin resultados</p>
          <p className="text-muted-foreground text-sm max-w-xs">
            Prueba quitando algún filtro para ver más animales disponibles.
          </p>
        </div>
      )}
    </div>
  )
}
