import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import AnimalCard from '@/components/animals/AnimalCard'
import AnimalFiltersPanel from '@/components/animals/AnimalFiltersPanel'
import PaginationNav from '@/components/ui/pagination-nav'
import { getAnimalsPage } from '@/lib/data/animals'
import { parsePage, queryWithoutPage } from '@/lib/pagination'
import { getShelters } from '@/lib/data/shelters'
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

  const [result, shelters] = await Promise.all([
    getAnimalsPage(
      { species, size, status: 'available', q: params.q },
      parsePage(params.page),
      PAGE_SIZE,
    ),
    getShelters(),
  ])
  const { items: animals, page, totalPages, total } = result

  const shelterNames = Object.fromEntries(shelters.map((s) => [s.id, s.name]))

  // Params sin 'page' para que PaginationNav construya los hrefs correctamente
  const paramString = queryWithoutPage(params)

  const filtered = Boolean(params.species || params.size || params.q)

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6 max-w-2xl">
        <h1 className="text-4xl text-foreground sm:text-5xl">Te están esperando</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Solicita su adopción o apadrínalos para acompañar su cuidado mientras encuentran hogar.
        </p>
      </div>

      <div className="mb-6 rounded-[28px] border border-border bg-card p-4 sm:p-6">
        <Suspense fallback={<div className="h-12 w-full animate-pulse rounded-full bg-muted" />}>
          <AnimalFiltersPanel />
        </Suspense>
      </div>

      <p className="mb-4 text-sm font-extrabold text-muted-foreground" aria-live="polite">
        {total} animal{total === 1 ? '' : 'es'}
        {filtered ? ' con estos filtros' : ' buscan hogar'}
      </p>

      {animals.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {animals.map((animal) => (
              <AnimalCard
                key={animal.id}
                animal={animal}
                shelterName={shelterNames[animal.shelter_id]}
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
        <div className="rounded-[28px] border-2 border-dashed border-border bg-card p-10 text-center">
          <p className="text-lg font-bold text-foreground">No hay animales con estos filtros</p>
          <p className="mx-auto mt-1 max-w-sm text-muted-foreground">
            Prueba con otra especie o tamaño, o revisa la búsqueda.
          </p>
          <Link href="/adopt" className="huellas-button huellas-button--secondary mt-5">
            Quitar filtros
          </Link>
        </div>
      )}
    </div>
  )
}
