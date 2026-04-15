import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, Phone, MapPin, CheckCircle2, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import SightingForm from '@/components/lost/SightingForm'
import ReportPhotoGallery from '@/components/lost/ReportPhotoGallery'
import { daysAgo } from '@/lib/utils'
import { DISTRICT_LABEL } from '@/lib/ubigeo'
import { getLostReportBySlug } from '@/lib/data/lost-reports'

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
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <Link
        href="/lost"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-rescue transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a perdidos y encontrados
      </Link>

      {/* Layout principal: galería + info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Galería */}
        <div>
          <ReportPhotoGallery urls={report.photo_urls} />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-6">
          {/* Badges + título */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
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
              <h1 className="font-display font-bold text-2xl text-foreground leading-snug">
                {isLost ? '¿Lo viste?' : '¿Es tuyo?'}
              </h1>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-2">Descripción</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{report.description}</p>
          </div>

          {/* Grid de datos clave */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Distrito</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{district}</p>
            </div>
            <div className="rounded-lg bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {isLost ? 'Visto por última vez' : 'Encontrado'}
              </p>
              <p className="text-sm font-medium text-foreground mt-0.5">
                {new Date(report.last_seen_at).toLocaleDateString('es-PE', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            {report.reward_amount !== null && report.reward_amount > 0 && (
              <div className="rounded-lg bg-muted/40 px-4 py-3">
                <p className="text-xs text-muted-foreground">Recompensa</p>
                <p className="text-sm font-medium text-foreground mt-0.5">S/ {report.reward_amount}</p>
              </div>
            )}
            <div className="rounded-lg bg-muted/40 px-4 py-3">
              <p className="text-xs text-muted-foreground">Reporte activo</p>
              <p className="text-sm font-medium text-foreground mt-0.5">
                {days === 0 ? 'Hoy' : `Hace ${days} día${days === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>

          {/* Dirección */}
          {report.last_seen_address && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-rescue shrink-0 mt-0.5" />
              <span>{report.last_seen_address}</span>
            </div>
          )}

          {/* Contacto CTA */}
          <div className="flex flex-col gap-3 pt-2">
            <a
              href={`tel:${report.contact_phone}`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'justify-center gap-2'
              )}
            >
              <Phone className="h-4 w-4" />
              Llamar al {report.contact_phone}
            </a>
            <Link
              href="/lost"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'justify-center'
              )}
            >
              Ver más reportes
            </Link>
          </div>

          {/* Fecha publicación */}
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Publicado el{' '}
            {new Date(report.created_at).toLocaleDateString('es-PE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Avistamientos — ancho completo debajo */}
      <div className="mt-10 flex flex-col gap-4">
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

        {!report.is_resolved && (
          <div className="mt-2 rounded-xl border border-border p-4">
            <SightingForm reportId={report.id} />
          </div>
        )}
      </div>
    </div>
  )
}
