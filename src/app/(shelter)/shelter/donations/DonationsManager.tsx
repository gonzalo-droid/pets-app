'use client'

import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { cn, formatPEN } from '@/lib/utils'
import type { Donation, PaymentStatus } from '@/types'

const TABS: { value: PaymentStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'approved', label: 'Aprobadas' },
  { value: 'rejected', label: 'Rechazadas' },
]

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
}
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', approved: 'Aprobada',
  rejected: 'Rechazada', refunded: 'Reembolsada',
}

interface Props {
  donations: Donation[]
  donorNames: Record<string, string>
  campaignTitles: Record<string, string>
}

export default function DonationsManager({ donations, donorNames, campaignTitles }: Props) {
  const [statuses, setStatuses] = useState<Record<string, PaymentStatus>>(
    Object.fromEntries(donations.map((d) => [d.id, d.payment_status]))
  )
  const [activeTab, setActiveTab] = useState<PaymentStatus | 'all'>('pending')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const approve = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: 'approved' }))
    // Cuando conectemos Supabase: actualizar payment_status + incrementar campaign.current_amount
    console.log('Donación aprobada (mock):', id)
  }
  const reject = (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: 'rejected' }))
    console.log('Donación rechazada (mock):', id)
  }

  const filtered = donations.filter((d) =>
    activeTab === 'all' ? true : statuses[d.id] === activeTab
  )

  const totalApproved = donations
    .filter((d) => statuses[d.id] === 'approved')
    .reduce((s, d) => s + d.amount, 0)

  return (
    <div className="flex flex-col gap-6">
      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total aprobado', value: formatPEN(totalApproved), color: 'text-green-600' },
          { label: 'Pendientes', value: donations.filter((d) => statuses[d.id] === 'pending').length, color: 'text-yellow-600' },
          { label: 'Total donaciones', value: donations.length, color: 'text-foreground' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={cn('text-xl font-bold', color)}>{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {TABS.map(({ value, label }) => {
          const count = value === 'all' ? donations.length : donations.filter((d) => statuses[d.id] === value).length
          return (
            <button
              key={value}
              onClick={() => setActiveTab(value)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors',
                activeTab === value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40'
              )}
            >
              {label} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          )
        })}
      </div>

      {/* Modal de comprobante */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-w-sm w-full rounded-xl overflow-hidden bg-background" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Comprobante" className="w-full object-contain max-h-[70vh]" />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute top-2 right-2 bg-background/80 rounded-full px-2 py-0.5 text-xs font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No hay donaciones en esta categoría.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
          {filtered.map((don) => {
            const currentStatus = statuses[don.id]
            const isPending = currentStatus === 'pending'
            return (
              <div key={don.id} className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4">
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-foreground text-sm">
                      {don.is_anonymous ? 'Anónimo' : donorNames[don.donor_id] ?? 'Usuario'}
                    </span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full font-medium', STATUS_STYLES[currentStatus])}>
                      {STATUS_LABELS[currentStatus]}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {campaignTitles[don.campaign_id] ?? don.campaign_id} ·{' '}
                    {new Date(don.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {don.message && <p className="text-xs text-muted-foreground italic mt-1">&ldquo;{don.message}&rdquo;</p>}
                </div>

                {/* Monto */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-foreground">{formatPEN(don.amount)}</p>
                </div>

                {/* Comprobante + acciones */}
                <div className="flex items-center gap-2 shrink-0">
                  {don.receipt_url ? (
                    <button
                      onClick={() => setPreviewUrl(don.receipt_url!)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Ver comprobante
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Sin comprobante</span>
                  )}

                  {isPending && (
                    <div className="flex gap-1.5 ml-2">
                      <button
                        onClick={() => approve(don.id)}
                        className="rounded bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700 transition-colors"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => reject(don.id)}
                        className="rounded bg-destructive/10 text-destructive px-2.5 py-1 text-xs font-medium hover:bg-destructive/20 transition-colors"
                      >
                        Rechazar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
