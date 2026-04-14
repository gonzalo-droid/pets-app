import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { daysAgo } from '@/lib/utils'
import type { LostReportWithSightings } from '@/types'

// Ubigeos de Lambayeque → nombre legible (simplificado para MVP)
const DISTRICT_NAMES: Record<string, string> = {
  '140101': 'Chiclayo',
  '140108': 'José L. Ortiz',
  '140110': 'La Victoria',
  '140201': 'Ferreñafe',
  '140301': 'Lambayeque',
}

interface LostReportCardProps {
  report: LostReportWithSightings
}

export default function LostReportCard({ report }: LostReportCardProps) {
  const days = daysAgo(report.created_at)
  const district = DISTRICT_NAMES[report.ubigeo] ?? report.ubigeo
  const isLost = report.type === 'lost'

  return (
    <Link
      href={`/lost/${report.slug}`}
      className="flex gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/40 hover:shadow-md transition-all"
    >
      {/* Foto o ícono */}
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
        {report.photo_urls && report.photo_urls.length > 0 ? (
          <Image
            src={report.photo_urls[0]}
            alt="Foto del animal"
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center text-2xl ${
              isLost ? 'bg-destructive/10' : 'bg-primary/10'
            }`}
          >
            {isLost ? '🔍' : '📍'}
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge
            variant={isLost ? 'destructive' : 'default'}
            className="text-[10px] px-1.5 py-0"
          >
            {isLost ? 'Perdido' : 'Encontrado'}
          </Badge>
          <span className="text-xs text-muted-foreground truncate">{district}</span>
        </div>

        <p className="text-sm text-foreground font-medium line-clamp-2 leading-snug">
          {report.description}
        </p>

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {days === 0 ? 'Hoy' : `Hace ${days} día${days === 1 ? '' : 's'}`}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Lambayeque
          </span>
          {report.sightings.length > 0 && (
            <span className="text-primary font-medium">
              {report.sightings.length} avistamiento{report.sightings.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
