import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import type { Shelter } from '@/types'

const CITY_BY_UBIGEO: Record<string, string> = {
  '140101': 'Chiclayo',
  '140108': 'José L. Ortiz',
  '140110': 'La Victoria',
  '140201': 'Ferreñafe',
  '140301': 'Lambayeque',
}

interface ShelterCardProps {
  shelter: Shelter
}

export default function ShelterCard({ shelter }: ShelterCardProps) {
  const city = CITY_BY_UBIGEO[shelter.ubigeo] ?? 'Lambayeque'

  return (
    <Link
      href={`/shelters/${shelter.id}`}
      className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-shelter/40 hover:shadow-sm transition-all"
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        {shelter.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={shelter.avatar_url}
            alt={shelter.name}
            className="h-14 w-14 rounded-full border-2 border-border bg-muted object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-border bg-accent text-2xl">
            🏠
          </div>
        )}
        {shelter.is_verified && (
          <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-shelter text-white">
            <BadgeCheck className="h-3.5 w-3.5" />
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-foreground truncate">{shelter.name}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{city}, Lambayeque</p>
        {shelter.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{shelter.description}</p>
        )}
      </div>
    </Link>
  )
}
