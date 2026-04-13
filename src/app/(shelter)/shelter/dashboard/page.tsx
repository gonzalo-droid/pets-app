import type { Metadata } from 'next'
import Link from 'next/link'
import { PawPrint, ClipboardList, HeartHandshake, Plus, ArrowRight, Wallet } from 'lucide-react'
import { cn, formatPEN } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAnimalsByShelter } from '@/lib/mock/animals'
import { getRequestsByShelter, MOCK_REQUESTER_NAMES, MOCK_ANIMAL_NAMES } from '@/lib/mock/requests'
import { getCampaigns } from '@/lib/mock/campaigns'
import { getDonationsByCampaigns } from '@/lib/mock/donations'

export const metadata: Metadata = { title: 'Dashboard — Panel Albergue' }

// Albergue mock activo para desarrollo
const MOCK_SHELTER_ID = 'shelter-001'
const MOCK_SHELTER_NAME = 'Patitas Chiclayo'

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  reviewing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  approved:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected:  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-muted text-muted-foreground',
}
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  reviewing: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  completed: 'Completada',
}

export default async function DashboardPage() {
  const [animals, requests, campaigns] = await Promise.all([
    getAnimalsByShelter(MOCK_SHELTER_ID),
    getRequestsByShelter(MOCK_SHELTER_ID),
    getCampaigns({ shelter_id: MOCK_SHELTER_ID, is_active: true }),
  ])

  const campaignIds = campaigns.map((c) => c.id)
  const donations = await getDonationsByCampaigns(campaignIds)

  // Stats
  const activeAnimals = animals.filter((a) => a.status === 'available' || a.status === 'in_process').length
  const pendingRequests = requests.filter((r) => r.status === 'pending').length
  const totalRaised = donations
    .filter((d) => d.payment_status === 'approved')
    .reduce((s, d) => s + d.amount, 0)
  const pendingDonations = donations.filter((d) => d.payment_status === 'pending').length

  const recentRequests = requests
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{MOCK_SHELTER_NAME}</p>
        </div>
        <Link href="/shelter/animals/new" className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="h-4 w-4" />
          Publicar animal
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: PawPrint, label: 'Animales activos', value: activeAnimals, href: '/shelter/animals', color: 'text-primary' },
          { icon: ClipboardList, label: 'Solicitudes pendientes', value: pendingRequests, href: '/shelter/requests', color: 'text-yellow-600 dark:text-yellow-400' },
          { icon: HeartHandshake, label: 'Total recaudado', value: formatPEN(totalRaised), href: '/shelter/donations', color: 'text-green-600 dark:text-green-400' },
          { icon: Wallet, label: 'Pagos por verificar', value: pendingDonations, href: '/shelter/donations', color: 'text-blue-600 dark:text-blue-400' },
        ].map(({ icon: Icon, label, value, href, color }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <Icon className={cn('h-5 w-5', color)} />
            <div>
              <p className="text-2xl font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: '/shelter/animals/new', label: 'Publicar animal' },
          { href: '/shelter/requests', label: 'Ver solicitudes' },
          { href: '/shelter/campaigns', label: 'Mis campañas' },
          { href: '/shelter/donations', label: 'Verificar pagos' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'justify-center')}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Solicitudes recientes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Solicitudes recientes</h2>
          <Link href="/shelter/requests" className="flex items-center gap-1 text-xs text-primary hover:underline">
            Ver todas <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
          {recentRequests.length === 0 ? (
            <p className="px-5 py-8 text-sm text-muted-foreground text-center">No hay solicitudes aún.</p>
          ) : (
            recentRequests.map((req) => (
              <div key={req.id} className="flex items-center gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {MOCK_REQUESTER_NAMES[req.requester_id] ?? 'Usuario'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Solicita adoptar a <strong>{MOCK_ANIMAL_NAMES[req.animal_id] ?? '—'}</strong>
                  </p>
                </div>
                <span className={cn('text-xs font-medium px-2 py-1 rounded-full', STATUS_COLORS[req.status])}>
                  {STATUS_LABELS[req.status]}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
