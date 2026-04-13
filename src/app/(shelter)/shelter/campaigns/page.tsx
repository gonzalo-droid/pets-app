import type { Metadata } from 'next'
import Link from 'next/link'
import { cn, formatPEN, campaignProgress } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import DonationProgress from '@/components/campaigns/DonationProgress'
import { getCampaigns } from '@/lib/mock/campaigns'

export const metadata: Metadata = { title: 'Campañas — Panel Albergue' }

const MOCK_SHELTER_ID = 'shelter-001'

export default async function ShelterCampaignsPage() {
  const campaigns = await getCampaigns({ shelter_id: MOCK_SHELTER_ID })

  const totalRaised = campaigns.reduce((s, c) => s + c.current_amount, 0)

  return (
    <div className="max-w-4xl flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis campañas</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {campaigns.length} campaña{campaigns.length !== 1 ? 's' : ''} · Total recaudado:{' '}
            <strong className="text-foreground">{formatPEN(totalRaised)}</strong>
          </p>
        </div>
        {/* En MVP la creación de campañas es manual — se activa cuando conectemos Supabase */}
        <div className="text-xs text-muted-foreground italic">
          Creación de campañas disponible al conectar Supabase
        </div>
      </div>

      {/* Lista */}
      {campaigns.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center gap-3 rounded-xl border border-dashed border-border">
          <span className="text-4xl">💛</span>
          <p className="text-muted-foreground text-sm">No tienes campañas activas.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {campaigns.map((campaign) => {
            const pct = campaignProgress(campaign.current_amount, campaign.goal_amount)
            return (
              <div key={campaign.id} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-foreground">{campaign.title}</h2>
                    {campaign.animal && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Para {campaign.animal.name}
                      </p>
                    )}
                  </div>
                  <span className={cn(
                    'text-xs font-medium px-2.5 py-1 rounded-full shrink-0',
                    campaign.is_active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'
                  )}>
                    {campaign.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>

                {/* Progreso */}
                <DonationProgress current={campaign.current_amount} goal={campaign.goal_amount} />

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border text-center text-sm">
                  <div>
                    <p className="font-bold text-foreground">{formatPEN(campaign.current_amount)}</p>
                    <p className="text-xs text-muted-foreground">Recaudado</p>
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{formatPEN(campaign.goal_amount)}</p>
                    <p className="text-xs text-muted-foreground">Meta</p>
                  </div>
                  <div>
                    <p className="font-bold text-primary">{pct}%</p>
                    <p className="text-xs text-muted-foreground">Completado</p>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 flex-wrap">
                  <Link
                    href={`/donate/${campaign.slug}`}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
                    target="_blank"
                  >
                    Ver público →
                  </Link>
                  <Link
                    href="/shelter/donations"
                    className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                  >
                    Ver donaciones
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
