import type { Metadata } from 'next'
import CampaignCard from '@/components/campaigns/CampaignCard'
import DonationProgress from '@/components/campaigns/DonationProgress'
import { getCampaigns } from '@/lib/mock/campaigns'
import { formatPEN } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Campañas de donación',
  description: 'Apoya a los albergues de Lambayeque con donaciones directas vía Yape o transferencia bancaria.',
}

export default async function DonatePage() {
  const campaigns = await getCampaigns({ is_active: true })

  const totalGoal = campaigns.reduce((s, c) => s + c.goal_amount, 0)
  const totalRaised = campaigns.reduce((s, c) => s + c.current_amount, 0)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Campañas de donación
        </h1>
        <p className="mt-2 text-muted-foreground">
          Aporta directamente vía Yape o transferencia bancaria. Sin comisiones, 100% al albergue.
        </p>
      </div>

      {/* Resumen global */}
      <div className="mb-10 rounded-2xl bg-primary/5 border border-primary/20 px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total recaudado entre todas las campañas</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {formatPEN(totalRaised)}{' '}
              <span className="text-base font-normal text-muted-foreground">
                de {formatPEN(totalGoal)}
              </span>
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {campaigns.length} campaña{campaigns.length !== 1 ? 's' : ''} activa{campaigns.length !== 1 ? 's' : ''}
          </div>
        </div>
        <DonationProgress current={totalRaised} goal={totalGoal} showNumbers={false} />
      </div>

      {/* Grid de campañas */}
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center gap-3">
          <span className="text-5xl">💛</span>
          <p className="text-lg font-medium text-foreground">No hay campañas activas</p>
          <p className="text-sm text-muted-foreground">Vuelve pronto.</p>
        </div>
      )}

      {/* Cómo funciona */}
      <div className="mt-14 rounded-2xl border border-border p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-5">¿Cómo funciona una donación?</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { n: '1', title: 'Elige una campaña', desc: 'Selecciona el caso o albergue que quieres apoyar.' },
            { n: '2', title: 'Escoge el monto', desc: 'Desde S/5 o el monto que puedas aportar.' },
            { n: '3', title: 'Transfiere por Yape o banco', desc: 'Los datos del albergue aparecen en pantalla.' },
            { n: '4', title: 'Sube el comprobante', desc: 'El albergue confirma y la barra se actualiza.' },
          ].map(({ n, title, desc }) => (
            <li key={n} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                {n}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
