import { Suspense } from 'react'
import type { Metadata } from 'next'
import AnimalCard from '@/components/animals/AnimalCard'
import AnimalFiltersPanel from '@/components/animals/AnimalFiltersPanel'
import PaginationNav from '@/components/ui/pagination-nav'
import { Skeleton } from '@/components/ui/skeleton'
import { getAnimals } from '@/lib/mock/animals'
import { getShelters } from '@/lib/mock/shelters'
import type { AnimalSpecies, AnimalSize } from '@/types'

export const metadata: Metadata = {
  title: 'Animales en adopción',
  description: 'Encuentra tu compañero ideal entre los animales disponibles en Lambayeque, Perú.',
}

const PAGE_SIZE = 8

interface AdoptPageProps {
  searchParams: Promise<{ species?: string; size?: string; q?: string; page?: string }>
}

export default async function AdoptPage({ searchParams }: AdoptPageProps) {
  const params = await searchParams
  const species = params.species as AnimalSpecies | undefined
  const size = params.size as AnimalSize | undefined
  const q = params.q?.toLowerCase().trim()
  const currentPage = Math.max(1, Number(params.page ?? 1))

  const [allAnimals, shelters] = await Promise.all([
    getAnimals({ species, size, status: 'available' }),
    getShelters(),
  ])

  const filtered = q
    ? allAnimals.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          (a.breed?.toLowerCase().includes(q) ?? false) ||
          (a.description?.toLowerCase().includes(q) ?? false)
      )
    : allAnimals

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const page = Math.min(currentPage, Math.max(1, totalPages))
  const animals = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const shelterNames = Object.fromEntries(shelters.map((s) => [s.id, s.name]))
  const shelterIds = Object.fromEntries(shelters.map((s) => [s.id, s.id]))

  // Params sin 'page' para que PaginationNav construya los hrefs correctamente
  const { page: _page, ...restParams } = params
  const paramString = new URLSearchParams(
    Object.fromEntries(Object.entries(restParams).filter(([, v]) => v !== undefined)) as Record<string, string>
  ).toString()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Animales en adopción
        </h1>
        <p className="mt-2 text-muted-foreground">
          {filtered.length === 0
            ? 'No hay animales disponibles con estos filtros.'
            : `${filtered.length} animal${filtered.length === 1 ? '' : 'es'} esperando un hogar`}
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-8 p-4 rounded-xl border border-border bg-muted/20">
        <Suspense fallback={<div className="h-10 animate-pulse bg-muted rounded-full w-64" />}>
          <AnimalFiltersPanel />
        </Suspense>
      </div>

      {/* Grid */}
      {animals.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {animals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                shelterName={shelterNames[animal.shelter_id]}
                shelterId={shelterIds[animal.shelter_id]}
              />
            ))}
          </div>
          <PaginationNav
            currentPage={page}
            totalPages={totalPages}
            paramString={paramString}
            pathname="/adopt"
          />
        </>
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
