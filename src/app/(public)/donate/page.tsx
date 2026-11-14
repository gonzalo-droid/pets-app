import Link from 'next/link'
import type { Metadata } from 'next'
import CampaignCard from '@/components/campaigns/CampaignCard'
import PaginationNav from '@/components/ui/pagination-nav'
import { getCampaignTotals, getCampaignsPage } from '@/lib/data/campaigns'
import { parsePage, queryWithoutPage } from '@/lib/pagination'
import { formatPEN } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Campañas de donación',
  description: 'Conoce las campañas de los albergues y registra tu compromiso de apoyo.',
}

const PAGE_SIZE = 9

const FILTERS = [
  { id: 'abiertas', label: 'Abiertas' },
  { id: 'cerradas', label: 'Cerradas' },
  { id: 'todas', label: 'Todas' },
] as const

const KINDS = [
  { id: '', label: 'Todos los tipos' },
  { id: 'caso', label: 'Casos', kind: 'case' },
  { id: 'fondo', label: 'Fondos', kind: 'fund' },
  { id: 'evento', label: 'Eventos', kind: 'event' },
] as const

export default async function DonatePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; estado?: string; tipo?: string }>
}) {
  const params = await searchParams
  const estado = FILTERS.some((f) => f.id === params.estado) ? params.estado! : 'abiertas'
  const tipo = KINDS.find((k) => k.id === params.tipo) ?? KINDS[0]
  const filters = {
    ...(estado === 'abiertas' ? { open_only: true } : estado === 'cerradas' ? { closed_only: true } : {}),
    kind: 'kind' in tipo ? tipo.kind : undefined,
  }
  // Mantiene el otro filtro al cambiar uno.
  const link = (next: { estado?: string; tipo?: string }) => {
    const q = new URLSearchParams()
    const e = next.estado ?? estado
    const t = next.tipo ?? tipo.id
    if (e !== 'abiertas') q.set('estado', e)
    if (t) q.set('tipo', t)
    const s = q.toString()
    return s ? `/donate?${s}` : '/donate'
  }
  const [{ items: campaigns, page, totalPages }, totals] = await Promise.all([
    getCampaignsPage(filters, parsePage(params.page), PAGE_SIZE),
    getCampaignTotals({}),
  ])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Cabecera */}
      <section className="rounded-[32px] bg-card p-6 sm:p-10">
        <h1 className="text-4xl sm:text-5xl text-foreground">Campañas de los albergues</h1>
        <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
          Casos, fondos y eventos con un objetivo concreto. Registras un compromiso de apoyo: no se
          realiza ningún cobro. También puedes compartirlas.
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          <li className="rounded-2xl bg-secondary px-5 py-3">
            <strong className="font-display text-2xl font-semibold">{totals.open}</strong>{' '}
            <span className="text-sm font-bold text-muted-foreground">
              abierta{totals.open === 1 ? '' : 's'}
            </span>
          </li>
          <li className="rounded-2xl bg-secondary px-5 py-3">
            <strong className="font-display text-2xl font-semibold">{totals.closed}</strong>{' '}
            <span className="text-sm font-bold text-muted-foreground">
              cerrada{totals.closed === 1 ? '' : 's'}
            </span>
          </li>
          <li className="rounded-2xl bg-secondary px-5 py-3 text-sm text-muted-foreground">
            <strong className="font-display text-2xl font-semibold text-foreground">
              {formatPEN(totals.raised)}
            </strong>{' '}
            registrados de {formatPEN(totals.goal)} (dato de ejemplo)
          </li>
        </ul>
      </section>

      {/* Filtro por estado */}
      <div className="mt-8 flex flex-col gap-3">
        <nav aria-label="Tipo de campaña" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {KINDS.map((k) => (
            <Link
              key={k.id}
              href={link({ tipo: k.id })}
              aria-current={tipo.id === k.id ? 'page' : undefined}
              className={`inline-flex min-h-11 shrink-0 items-center rounded-full border-2 px-5 text-sm font-extrabold transition-colors ${
                tipo.id === k.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-input bg-card text-foreground hover:bg-secondary'
              }`}
            >
              {k.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="Estado de la campaña" className="flex flex-wrap gap-x-4 gap-y-1">
          {FILTERS.map((f) => (
            <Link
              key={f.id}
              href={link({ estado: f.id })}
              aria-current={estado === f.id ? 'page' : undefined}
              className={`inline-flex min-h-11 items-center text-sm font-extrabold ${
                estado === f.id ? 'text-foreground underline underline-offset-4' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {f.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Campañas */}
      {campaigns.length > 0 ? (
        <>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="mt-6 rounded-[28px] border-2 border-dashed border-input bg-card p-10 text-center">
          <p className="text-lg font-bold text-foreground">
            {estado === 'cerradas'
              ? 'Todavía no hay campañas cerradas de este tipo'
              : tipo.id === 'evento'
                ? 'No hay eventos próximos'
                : 'No hay campañas abiertas de este tipo ahora'}
          </p>
          <p className="mt-1 text-muted-foreground">
            Mientras tanto, puedes ver lo que necesitan los albergues.
          </p>
          <Link className="huellas-button mt-5" href="/needs">
            Ver necesidades
          </Link>
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
