'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Phone, MapPin, ClipboardList, Heart, Search, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getMockSession, setMockSession, type MockUser } from '@/lib/mock/users'
import { MOCK_REQUESTS, MOCK_ANIMAL_NAMES } from '@/lib/mock/requests'
import { MOCK_DONATIONS, MOCK_CAMPAIGN_TITLES } from '@/lib/mock/donations'
import { MOCK_LOST_REPORTS } from '@/lib/mock/lost-reports'

const ADOPTION_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  reviewing: 'En revisión',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  completed: 'Completada',
}

const ADOPTION_STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'outline'> = {
  pending: 'secondary',
  reviewing: 'secondary',
  approved: 'default',
  rejected: 'outline',
  completed: 'default',
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada',
  refunded: 'Reembolsada',
}

type Tab = 'info' | 'requests' | 'donations' | 'reports'

export default function ProfilePage() {
  const router = useRouter()
  const [session, setSession] = useState<MockUser | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [saved, setSaved] = useState(false)

  // Form fields
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState('')

  useEffect(() => {
    const s = getMockSession()
    if (!s) {
      router.push('/auth/login')
      return
    }
    setSession(s)
    setFullName(s.full_name)
    setPhone('')
    setLocation('')
  }, [router])

  if (!session) return null

  // Filtrar datos mock por el usuario actual
  const myRequests = MOCK_REQUESTS.filter((r) => r.requester_id === session.id)
  const myDonations = MOCK_DONATIONS.filter((d) => d.donor_id === session.id)
  const myReports = MOCK_LOST_REPORTS.filter((r) => r.reported_by === session.id)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const updated: MockUser = { ...session!, full_name: fullName }
    setMockSession(updated)
    setSession(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'info', label: 'Mi información', icon: <User className="h-4 w-4" /> },
    { id: 'requests', label: 'Solicitudes', icon: <ClipboardList className="h-4 w-4" />, count: myRequests.length },
    { id: 'donations', label: 'Donaciones', icon: <Heart className="h-4 w-4" />, count: myDonations.length },
    { id: 'reports', label: 'Mis reportes', icon: <Search className="h-4 w-4" />, count: myReports.length },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary shrink-0">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{session.full_name}</h1>
          <p className="text-sm text-muted-foreground">{session.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
        {TABS.map(({ id, label, icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
              activeTab === id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            {icon}
            {label}
            {count !== undefined && count > 0 && (
              <span className="ml-1 rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary leading-none">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Mi información */}
      {activeTab === 'info' && (
        <form onSubmit={handleSave} className="flex flex-col gap-5 max-w-md">
          <div className="flex flex-col gap-2">
            <Label htmlFor="full_name">Nombre completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="pl-9"
                placeholder="Tu nombre"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">Teléfono</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9"
                placeholder="987 654 321"
                type="tel"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="location">Distrito / Ciudad</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
                placeholder="Chiclayo, Lambayeque"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit">Guardar cambios</Button>
            {saved && (
              <span className="flex items-center gap-1.5 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Guardado
              </span>
            )}
          </div>
        </form>
      )}

      {/* Tab: Solicitudes */}
      {activeTab === 'requests' && (
        <div className="flex flex-col gap-4">
          {myRequests.length === 0 ? (
            <EmptyState icon="📋" text="No tienes solicitudes de adopción aún." cta={{ label: 'Ver animales', href: '/adopt' }} />
          ) : (
            myRequests.map((req) => (
              <div key={req.id} className="rounded-xl border border-border p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {MOCK_ANIMAL_NAMES[req.animal_id] ?? 'Animal'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(req.created_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {req.message && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{req.message}</p>
                  )}
                </div>
                <Badge variant={ADOPTION_STATUS_VARIANT[req.status]}>
                  {ADOPTION_STATUS_LABELS[req.status]}
                </Badge>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Donaciones */}
      {activeTab === 'donations' && (
        <div className="flex flex-col gap-4">
          {myDonations.length === 0 ? (
            <EmptyState icon="💛" text="Aún no has realizado ninguna donación." cta={{ label: 'Ver campañas', href: '/donate' }} />
          ) : (
            myDonations.map((don) => (
              <div key={don.id} className="rounded-xl border border-border p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {MOCK_CAMPAIGN_TITLES[don.campaign_id] ?? 'Campaña'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    S/ {don.amount.toFixed(2)} ·{' '}
                    {new Date(don.created_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  {don.message && (
                    <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">"{don.message}"</p>
                  )}
                </div>
                <Badge variant={don.payment_status === 'approved' ? 'default' : 'secondary'}>
                  {PAYMENT_STATUS_LABELS[don.payment_status]}
                </Badge>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab: Reportes */}
      {activeTab === 'reports' && (
        <div className="flex flex-col gap-4">
          {myReports.length === 0 ? (
            <EmptyState icon="🔍" text="No has publicado reportes de mascotas perdidas." cta={{ label: 'Crear reporte', href: '/lost/new' }} />
          ) : (
            myReports.map((rep) => (
              <div key={rep.id} className="rounded-xl border border-border p-4 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {rep.type === 'lost' ? '🔍 Perdido' : '📍 Encontrado'}
                    </span>
                    {rep.is_resolved && (
                      <Badge variant="default" className="text-[10px]">Resuelto</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{rep.description}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(rep.created_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <a
                  href={`/lost/${rep.slug}`}
                  className="text-xs text-primary hover:underline shrink-0"
                >
                  Ver reporte
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function EmptyState({
  icon,
  text,
  cta,
}: {
  icon: string
  text: string
  cta: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="text-muted-foreground text-sm">{text}</p>
      <a href={cta.href} className="text-sm text-primary hover:underline">
        {cta.label} →
      </a>
    </div>
  )
}
