import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Phone, MapPin, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import SightingForm from '@/components/lost/SightingForm'
import { daysAgo } from '@/lib/utils'
import { DISTRICT_LABEL } from '@/lib/ubigeo'
import { getLostReportBySlug } from '@/lib/mock/lost-reports'

interface LostDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: LostDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const report = await getLostReportBySlug(slug)
  if (!report) return { title: 'Reporte no encontrado' }
  const prefix = report.type === 'lost' ? 'Animal perdido' : 'Animal encontrado'
  return { title: `${prefix} en ${DISTRICT_LABEL[report.ubigeo] ?? 'Lambayeque'}` }
}

export default async function LostDetailPage({ params }: LostDetailPageProps) {
  const { slug } = await params
  const report = await getLostReportBySlug(slug)
  if (!report) notFound()

  const isLost = report.type === 'lost'
  const days = daysAgo(report.created_at)
  const district = DISTRICT_LABEL[report.ubigeo] ?? 'Lambayeque'

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href="/lost"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a perdidos y encontrados
      </Link>

      {/* Header */}
      <div className="flex items-start gap-3 mb-6">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl ${
            isLost ? 'bg-destructive/10' : 'bg-primary/10'
          }`}
        >
          {isLost ? '🔍' : '📍'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={isLost ? 'destructive' : 'default'}>
              {isLost ? 'Animal perdido' : 'Animal encontrado'}
            </Badge>
            {report.is_resolved && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Reunificado
              </Badge>
            )}
          </div>
          <h1 className="text-xl font-bold text-foreground mt-2 leading-snug">
            {report.description}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Columna principal */}
        <div className="sm:col-span-2 flex flex-col gap-6">
          {/* Detalles del avistamiento */}
          <div className="rounded-xl border border-border p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">Detalles</h2>

            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{district}</p>
                {report.last_seen_address && (
                  <p className="text-muted-foreground text-xs mt-0.5">{report.last_seen_address}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span>
                {isLost ? 'Visto por última vez' : 'Encontrado'} el{' '}
                {new Date(report.last_seen_at).toLocaleDateString('es-PE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {' '}({days === 0 ? 'hoy' : `hace ${days} día${days === 1 ? '' : 's'}`})
              </span>
            </div>

            {report.reward_amount !== null && report.reward_amount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="h-4 w-4 text-primary shrink-0" />
                <span className="font-medium text-foreground">
                  Recompensa: S/ {report.reward_amount}
                </span>
              </div>
            )}
          </div>

          {/* Avistamientos */}
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-foreground">
              Avistamientos ({report.sightings.length})
            </h2>

            {report.sightings.length > 0 ? (
              <div className="flex flex-col gap-3">
                {report.sightings.map((sighting) => (
                  <div
                    key={sighting.id}
                    className="rounded-lg border border-border bg-muted/20 px-4 py-3"
                  >
                    <p className="text-sm text-foreground">{sighting.message}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      {new Date(sighting.created_at).toLocaleDateString('es-PE', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aún no hay avistamientos. Si ves a este animal, deja un mensaje abajo.
              </p>
            )}

            {/* Formulario de avistamiento */}
            {!report.is_resolved && (
              <div className="mt-2 rounded-xl border border-border p-4">
                <SightingForm reportId={report.id} />
              </div>
            )}
          </div>
        </div>

        {/* Columna de contacto */}
        <div className="flex flex-col gap-4">
          {/* Contacto */}
          <div className="rounded-xl border border-border p-5 flex flex-col gap-3">
            <h2 className="text-sm font-semibold text-foreground">Contacto</h2>
            <p className="text-xs text-muted-foreground">
              {isLost
                ? 'Si encontraste este animal, contacta directamente al dueño.'
                : 'Si este es tu animal, comunícate con quien lo encontró.'}
            </p>
            <a
              href={`tel:${report.contact_phone}`}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors justify-center"
            >
              <Phone className="h-4 w-4" />
              {report.contact_phone}
            </a>
            <p className="text-[10px] text-muted-foreground text-center">
              El contacto es directo fuera de la plataforma
            </p>
          </div>

          {/* Compartir (texto plano MVP) */}
          <div className="rounded-xl border border-dashed border-border p-4 text-center">
            <p className="text-xs text-muted-foreground">
              Comparte este reporte para aumentar las probabilidades de reunificación.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
