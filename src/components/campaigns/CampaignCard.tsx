import Link from 'next/link'
import { CalendarDays } from 'lucide-react'
import DonationProgress from './DonationProgress'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import type { CampaignWithShelter } from '@/types'

interface CampaignCardProps {
  campaign: CampaignWithShelter
}

function daysUntil(isoDate: string | null): string {
  if (!isoDate) return 'Sin fecha límite'
  const diff = new Date(isoDate).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Finalizada'
  if (days === 0) return 'Último día'
  return `${days} día${days === 1 ? '' : 's'} restantes`
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5 gap-4 hover:border-donate/40 hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href={`/shelters/${campaign.shelter.id}`}
          className="shrink-0 hover:opacity-80 transition-opacity"
        >
          {campaign.shelter.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={campaign.shelter.avatar_url}
              alt={campaign.shelter.name}
              className="h-10 w-10 rounded-full border border-border bg-muted"
            />
          ) : (
            <div className="h-10 w-10 rounded-full border border-border bg-muted" />
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
            {campaign.title}
          </h3>
          <Link
            href={`/shelters/${campaign.shelter.id}`}
            className="text-xs text-muted-foreground hover:text-brand-400 transition-colors mt-0.5 block"
          >
            {campaign.shelter.name}
          </Link>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {campaign.description}
      </p>

      {/* Progreso */}
      <DonationProgress current={campaign.current_amount} goal={campaign.goal_amount} />

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{daysUntil(campaign.ends_at)}</span>
        </div>
        <Link
          href={`/donate/${campaign.slug}`}
          className={cn(buttonVariants({ size: 'sm' }))}
        >
          Donar ahora
        </Link>
      </div>
    </div>
  )
}
