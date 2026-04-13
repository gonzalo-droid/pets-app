import { Suspense } from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import LostReportCard from '@/components/lost/LostReportCard'
import LostFiltersPanel from '@/components/lost/LostFiltersPanel'
import { getLostReports } from '@/lib/mock/lost-reports'
import type { ReportType } from '@/types'

export const metadata: Metadata = {
  title: 'Perdidos y Encontrados',
  description: 'Reportes de animales perdidos y encontrados en Lambayeque, Perú.',
}

interface LostPageProps {
  searchParams: Promise<{ type?: string }>
}

export default async function LostPage({ searchParams }: LostPageProps) {
  const params = await searchParams
  const type = params.type as ReportType | undefined

  const reports = await getLostReports({
    type,
    is_resolved: false,
  })

  const lostCount = reports.filter((r) => r.type === 'lost').length
  const foundCount = reports.filter((r) => r.type === 'found').length

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Perdidos y Encontrados
          </h1>
          <p className="mt-2 text-muted-foreground">
            {lostCount} reportes de perdidos · {foundCount} animales encontrados en Lambayeque
          </p>
        </div>
        <Link
          href="/lost/new"
          className={cn(buttonVariants(), 'shrink-0')}
        >
          + Nuevo reporte
        </Link>
      </div>

      {/* Filtros */}
      <div className="mb-6 p-4 rounded-xl border border-border bg-muted/20">
        <Suspense fallback={<div className="h-9 w-48 animate-pulse rounded-full bg-muted" />}>
          <LostFiltersPanel />
        </Suspense>
      </div>

      {/* Lista */}
      {reports.length > 0 ? (
        <div className="flex flex-col gap-4">
          {reports.map((report) => (
            <LostReportCard key={report.id} report={report} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <span className="text-5xl">🔍</span>
          <p className="text-lg font-medium text-foreground">Sin reportes activos</p>
          <p className="text-muted-foreground text-sm max-w-xs">
            No hay reportes con este filtro. ¿Perdiste a tu mascota?
          </p>
          <Link href="/lost/new" className={cn(buttonVariants({ variant: 'outline' }), 'mt-2')}>
            Crear reporte
          </Link>
        </div>
      )}

      {/* Aviso de contacto */}
      <div className="mt-10 rounded-xl bg-muted/30 border border-border px-5 py-4 text-sm text-muted-foreground">
        <strong className="text-foreground">¿Cómo funciona?</strong> Cada reporte muestra el
        teléfono de contacto directo. Si reconoces a un animal, comunícate con el dueño o
        la persona que lo encontró. Puedes dejar avistamientos en cada reporte para ayudar
        a rastrear la ubicación.
      </div>
    </div>
  )
}
