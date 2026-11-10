import type { Metadata } from 'next'
import CampaignCard from '@/components/campaigns/CampaignCard'
import DonationProgress from '@/components/campaigns/DonationProgress'
import PaginationNav from '@/components/ui/pagination-nav'
import { getCampaignTotals, getCampaignsPage } from '@/lib/data/campaigns'
import { parsePage, queryWithoutPage } from '@/lib/pagination'
import { formatPEN } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Campañas de donación',
  description: 'Conoce las campañas de los albergues y registra tu compromiso de apoyo.',
}

const PAGE_SIZE = 9

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const params = await searchParams
  const [{ items: campaigns, page, totalPages }, totals] = await Promise.all([
    // Todas: las cerradas siguen visibles (marcadas) para mostrar su resultado.
    getCampaignsPage({}, parsePage(params.page), PAGE_SIZE),
    getCampaignTotals({}),
  ])
  const totalGoal = totals.goal
  const totalRaised = totals.raised

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl text-foreground">
          Campañas de los albergues
        </h1>
        <p className="mt-2 text-muted-foreground">
          Cada campaña tiene un objetivo concreto de un albergue. Por ahora registras un
          compromiso de apoyo: no se realiza ningún cobro.
        </p>
      </div>

      {/* Resumen global */}
      <div className="mb-10 rounded-[28px] bg-support-soft px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Recaudado registrado en las campañas</p>
            <p className="text-2xl font-bold text-foreground mt-0.5">
              {formatPEN(totalRaised)}{' '}
              <span className="text-base font-normal text-muted-foreground">
                de {formatPEN(totalGoal)}
              </span>
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {totals.open} campaña{totals.open !== 1 ? 's' : ''} abierta{totals.open !== 1 ? 's' : ''}
            {totals.closed > 0 && ` · ${totals.closed} cerrada${totals.closed !== 1 ? 's' : ''}`}
          </div>
        </div>
        <DonationProgress current={totalRaised} goal={totalGoal} showNumbers={false} />
      </div>

      {/* Grid de campañas */}
      {campaigns.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
          <PaginationNav
            currentPage={page}
            totalPages={totalPages}
            paramString={queryWithoutPage(params)}
            pathname="/donate"
          />
        </>
      ) : (
        <div className="flex flex-col items-center py-20 text-center gap-3">
          
          <p className="text-lg font-medium text-foreground">No hay campañas activas</p>
          <p className="text-sm text-muted-foreground">Vuelve pronto.</p>
        </div>
      )}

      {/* Cómo funciona */}
      <div className="mt-14 rounded-[28px] bg-secondary p-6 sm:p-8">
        <h2 className="text-lg font-semibold text-foreground mb-5">¿Cómo funciona un compromiso de apoyo?</h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { n: '1', title: 'Elige una campaña', desc: 'Selecciona el caso o albergue que quieres apoyar.' },
            { n: '2', title: 'Elige un importe', desc: 'Indica cuánto te gustaría aportar.' },
            { n: '3', title: 'Registra tu compromiso', desc: 'Queda guardado sin cobro. Los pagos aún no están habilitados.' },
            { n: '4', title: 'Consúltalo en Mis apoyos', desc: 'Puedes cancelarlo mientras esté pendiente.' },
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
