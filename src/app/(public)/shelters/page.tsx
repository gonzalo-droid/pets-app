import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Search } from 'lucide-react'
import ShelterCard from '@/components/shelters/ShelterCard'
import ShelterSearchInput from './ShelterSearchInput'
import PaginationNav from '@/components/ui/pagination-nav'
import { getShelters } from '@/lib/mock/shelters'

export const metadata: Metadata = {
  title: 'Albergues — PawRescue',
  description: 'Conoce los albergues y refugios de animales en Lambayeque, Perú.',
}

const PAGE_SIZE = 4

interface SheltersPageProps {
  searchParams: Promise<{ q?: string; page?: string }>
}

export default async function SheltersPage({ searchParams }: SheltersPageProps) {
  const params = await searchParams
  const q = params.q?.toLowerCase().trim()
  const currentPage = Math.max(1, Number(params.page ?? 1))

  const allShelters = await getShelters()

  const filtered = q
    ? allShelters.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.description?.toLowerCase().includes(q) ?? false) ||
          (s.address?.toLowerCase().includes(q) ?? false)
      )
    : allShelters

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const page = Math.min(currentPage, Math.max(1, totalPages))
  const shelters = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const { page: _page, ...restParams } = params
  const paramString = new URLSearchParams(
    Object.fromEntries(Object.entries(restParams).filter(([, v]) => v !== undefined)) as Record<string, string>
  ).toString()

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Albergues</h1>
        <p className="mt-2 text-muted-foreground">
          {filtered.length === 0
            ? 'No hay albergues con ese nombre.'
            : `${filtered.length} albergue${filtered.length === 1 ? '' : 's'} en Lambayeque`}
        </p>
      </div>

      {/* Búsqueda */}
      <div className="mb-6 p-4 rounded-xl border border-border bg-muted/20">
        <Suspense fallback={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <div className="w-full h-9 rounded-lg border border-input bg-background pl-9" />
          </div>
        }>
          <ShelterSearchInput />
        </Suspense>
      </div>

      {/* Lista */}
      {shelters.length > 0 ? (
        <>
          <div className="flex flex-col gap-3">
            {shelters.map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </div>
          <PaginationNav
            currentPage={page}
            totalPages={totalPages}
            paramString={paramString}
            pathname="/shelters"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl">🏠</span>
          <p className="text-lg font-medium text-foreground">Sin resultados</p>
          <p className="text-muted-foreground text-sm max-w-xs">
            Prueba con otro término de búsqueda.
          </p>
        </div>
      )}
    </div>
  )
}
