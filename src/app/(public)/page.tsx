import Link from 'next/link'
import { PawPrint, Search, Heart, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import AnimalFeedFilter from '@/components/animals/AnimalFeedFilter'
import CampaignCard from '@/components/campaigns/CampaignCard'
import LostReportCard from '@/components/lost/LostReportCard'
import ShelterCard from '@/components/shelters/ShelterCard'
import { getAnimals } from '@/lib/mock/animals'
import { getCampaigns } from '@/lib/mock/campaigns'
import { getLostReports } from '@/lib/mock/lost-reports'
import { getShelters } from '@/lib/mock/shelters'

export default async function HomePage() {
  // Fetch paralelo desde los mocks (mismo patrón que usará Supabase)
  const [animals, campaigns, lostReports, shelters] = await Promise.all([
    getAnimals({ status: 'available' }),
    getCampaigns({ is_active: true }),
    getLostReports({ is_resolved: false }),
    getShelters(),
  ])

  // Mapa de id → nombre de albergue para las cards de animales
  const shelterNames = Object.fromEntries(shelters.map((s) => [s.id, s.name]))

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-accent to-background px-4 py-20 text-center sm:py-28">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <PawPrint className="h-4 w-4" />
            Lambayeque, Perú
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Cada animal merece
            <br />
            <span className="text-primary">un hogar con amor</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Adopta, reporta animales perdidos y apoya a los albergues de Lambayeque.
            Todo en un solo lugar, sin Facebook.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/adopt" className={cn(buttonVariants({ size: 'lg' }))}>
              <Heart className="h-5 w-5" />
              Ver en adopción
            </Link>
            <Link href="/lost" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
              <Search className="h-5 w-5" />
              Buscar perdidos
            </Link>
          </div>
        </div>
      </section>

      {/* ── Accesos rápidos ───────────────────────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-5xl grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { href: '/adopt', icon: '🐾', label: 'Adoptar', desc: `${animals.length} disponibles` },
            { href: '/lost', icon: '🔍', label: 'Perdidos', desc: `${lostReports.length} activos` },
            { href: '/donate', icon: '💛', label: 'Donar', desc: `${campaigns.length} campañas` },
            { href: '#shelters', icon: '🏠', label: 'Albergues', desc: `${shelters.length} verificados` },
          ].map(({ href, icon, label, desc }) => (
            <Link
              key={label}
              href={href}
              className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center hover:border-primary/40 hover:bg-accent/50 transition-colors"
            >
              <span className="text-3xl">{icon}</span>
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Feed adopciones ───────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Animales en adopción"
            subtitle="Todos esperando un hogar responsable en Lambayeque"
            href="/adopt"
          />
          <AnimalFeedFilter animals={animals} shelterNames={shelterNames} />
        </div>
      </section>

      {/* ── Campañas activas ──────────────────────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Campañas de donación activas"
            subtitle="Tu aporte en soles hace la diferencia"
            href="/donate"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Perdidos recientes ────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-muted/20">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Perdidos y encontrados"
            subtitle="Ayuda a reunir mascotas con sus familias"
            href="/lost"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lostReports.map((report) => (
              <LostReportCard key={report.id} report={report} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/lost/new"
              className={cn(buttonVariants({ variant: 'outline' }))}
            >
              Reportar animal perdido o encontrado
            </Link>
          </div>
        </div>
      </section>

      {/* ── Albergues verificados ─────────────────────────────────────────── */}
      <section id="shelters" className="py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Albergues verificados"
            subtitle="Organizaciones comprometidas con el rescate animal en Lambayeque"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shelters.map((shelter) => (
              <Link key={shelter.id} href={`/shelters/${shelter.id}`}>
                <ShelterCard shelter={shelter} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA para albergues ────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-primary/5 border-t border-primary/10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-foreground">¿Tienes un albergue?</h2>
          <p className="mt-3 text-muted-foreground">
            Regístrate gratis y gestiona tus animales, solicitudes de adopción y campañas
            de donación desde un solo panel. Sin comisiones en el MVP.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/register" className={cn(buttonVariants({ size: 'lg' }))}>
              Registrar mi albergue
            </Link>
            <Link
              href="/shelter/dashboard"
              className={cn(buttonVariants({ variant: 'ghost', size: 'lg' }))}
            >
              Ver demo del panel
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Componente interno reutilizable ────────────────────────────────────────────

function SectionHeader({
  title,
  subtitle,
  href,
}: {
  title: string
  subtitle?: string
  href?: string
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-7">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline shrink-0"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
