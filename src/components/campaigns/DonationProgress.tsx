import { formatPEN, campaignProgress } from '@/lib/utils'

interface DonationProgressProps {
  current: number
  goal: number
  showNumbers?: boolean
}

export default function DonationProgress({
  current,
  goal,
  showNumbers = true,
}: DonationProgressProps) {
  const pct = campaignProgress(current, goal)

  return (
    <div className="flex flex-col gap-1.5">
      {showNumbers && (
        <div className="flex items-baseline justify-between text-sm">
          <span className="font-semibold text-foreground">{formatPEN(current)}</span>
          <span className="text-xs text-muted-foreground">de {formatPEN(goal)}</span>
        </div>
      )}
      {/* Barra de progreso */}
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="text-xs text-muted-foreground">{pct}% recaudado</p>
    </div>
  )
}
