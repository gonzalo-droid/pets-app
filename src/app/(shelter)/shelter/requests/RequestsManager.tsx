'use client'

import { useState } from 'react'
import { Phone, Home, PawPrint, Baby } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdoptionRequest, AdoptionStatus } from '@/types'

const TABS: { value: AdoptionStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'reviewing', label: 'En revisión' },
  { value: 'approved', label: 'Aprobadas' },
  { value: 'rejected', label: 'Rechazadas' },
]

const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  approved:  'bg-green-100 text-green-800',
  rejected:  'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-600',
}
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', reviewing: 'En revisión',
  approved: 'Aprobada', rejected: 'Rechazada', completed: 'Completada',
}

interface Props {
  requests: AdoptionRequest[]
  requesterNames: Record<string, string>
  animalNames: Record<string, string>
}

export default function RequestsManager({ requests, requesterNames, animalNames }: Props) {
  const [statuses, setStatuses] = useState<Record<string, AdoptionStatus>>(
    Object.fromEntries(requests.map((r) => [r.id, r.status]))
  )
  const [activeTab, setActiveTab] = useState<AdoptionStatus | 'all'>('all')

  const updateStatus = (id: string, status: AdoptionStatus) => {
    setStatuses((prev) => ({ ...prev, [id]: status }))
    // Cuando conectemos Supabase: actualizar adoption_requests y animal.status si es necesario
    console.log('Actualizar solicitud (mock):', id, status)
  }

  const filtered = requests.filter((r) =>
    activeTab === 'all' ? true : statuses[r.id] === activeTab
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex gap-1.5 flex-wrap">
        {TABS.map(({ value, label }) => {
          const count = value === 'all'
            ? requests.length
            : requests.filter((r) => statuses[r.id] === value).length
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

      {/* Cards */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground text-sm">No hay solicitudes en esta categoría.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((req) => {
            const currentStatus = statuses[req.id]
            const canAct = currentStatus === 'pending' || currentStatus === 'reviewing'
            return (
              <div key={req.id} className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <p className="font-semibold text-foreground">
                      {requesterNames[req.requester_id] ?? 'Usuario'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Solicita adoptar a <strong>{animalNames[req.animal_id] ?? '—'}</strong> ·{' '}
                      {new Date(req.created_at).toLocaleDateString('es-PE', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                  <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', STATUS_STYLES[currentStatus])}>
                    {STATUS_LABELS[currentStatus]}
                  </span>
                </div>

                {/* Perfil del hogar */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <span className={cn('flex items-center gap-1', req.has_home ? 'text-foreground' : 'text-muted-foreground line-through')}>
                    <Home className="h-3.5 w-3.5" /> Tiene patio
                  </span>
                  <span className={cn('flex items-center gap-1', req.has_other_pets ? 'text-foreground' : 'text-muted-foreground line-through')}>
                    <PawPrint className="h-3.5 w-3.5" /> Otras mascotas
                  </span>
                  <span className={cn('flex items-center gap-1', req.has_children ? 'text-foreground' : 'text-muted-foreground line-through')}>
                    <Baby className="h-3.5 w-3.5" /> Niños en casa
                  </span>
                </div>

                {/* Mensaje */}
                {req.message && (
                  <blockquote className="border-l-2 border-primary/30 pl-3 text-sm text-muted-foreground italic">
                    {req.message}
                  </blockquote>
                )}

                {/* Footer: teléfono + acciones */}
                <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-border">
                  <a href={`tel:${req.phone}`} className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                    <Phone className="h-4 w-4" /> {req.phone}
                  </a>
                  {canAct && (
                    <div className="flex gap-2">
                      {currentStatus === 'pending' && (
                        <button
                          onClick={() => updateStatus(req.id, 'reviewing')}
                          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors"
                        >
                          Poner en revisión
                        </button>
                      )}
                      <button
                        onClick={() => updateStatus(req.id, 'approved')}
                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => updateStatus(req.id, 'rejected')}
                        className="rounded-md bg-destructive/10 text-destructive px-3 py-1.5 text-xs font-medium hover:bg-destructive/20 transition-colors"
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
