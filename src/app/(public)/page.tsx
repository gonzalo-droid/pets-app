import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
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
  const [animals, campaigns, lostReports, shelters] = await Promise.all([
    getAnimals({ status: 'available' }),
    getCampaigns({ is_active: true }),
    getLostReports({ is_resolved: false }),
    getShelters(),
  ])

  const shelterNames = Object.fromEntries(shelters.map((s) => [s.id, s.name]))

  return (
    <div className="flex flex-col">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-[520px]">
          {/* Columna izquierda — texto + CTAs */}
          <div className="flex flex-col justify-center gap-6 bg-gradient-to-br from-brand-400 to-orange-500 px-8 py-16 sm:px-12 lg:px-16">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
              Lambayeque · Rescate animal
            </p>
            <h1
              className="font-display font-black text-white leading-tight"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            >
              Encuentra tu<br />
              compañero<br />
              para siempre 🐾
            </h1>
            <p className="text-white/80 text-sm max-w-sm leading-relaxed">
              Adopta, reporta animales perdidos y apoya a los albergues de Lambayeque.
              Todo en un solo lugar, sin Facebook.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/adopt"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-500 hover:bg-white/90 transition-colors"
              >
                Ver animales en adopción
              </Link>
              <Link
                href="/lost"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/70 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition-colors"
              >
                Buscar perdidos
              </Link>
            </div>
            <p className="text-white/60 text-xs">
              🐾 {animals.filter(a => a.status === 'available').length} en adopción
              &nbsp;·&nbsp;
              🔍 {lostReports.length} reportes activos
              &nbsp;·&nbsp;
              🏠 {shelters.length} albergues
            </p>
          </div>

          {/* Columna derecha — foto del animal */}
          <div className="relative h-64 lg:h-auto">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&q=80"
              alt="Animal esperando adopción"
              className="absolute inset-0 h-full w-full object-cover object-center dark:brightness-90"
            />
          </div>
        </div>
      </section>

      {/* ── Accesos rápidos ───────────────────────────────────────────────── */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-5xl grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/adopt"
            className="flex flex-col gap-3 rounded-2xl border-l-4 border-adopt bg-adopt-light p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl">🐾</span>
            <div>
              <p className="font-display font-bold text-foreground text-sm">Adoptar</p>
              <p className="text-xs text-muted-foreground mt-0.5">{animals.filter(a => a.status === 'available').length} disponibles</p>
            </div>
            <span className="text-xs font-semibold text-adopt-dark">Ver todos →</span>
          </Link>

          <Link
            href="/lost"
            className="flex flex-col gap-3 rounded-2xl border-l-4 border-rescue bg-rescue-light p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl">🔍</span>
            <div>
              <p className="font-display font-bold text-foreground text-sm">Perdidos</p>
              <p className="text-xs text-muted-foreground mt-0.5">{lostReports.length} activos</p>
            </div>
            <span className="text-xs font-semibold text-rescue-dark">Ver reportes →</span>
          </Link>

          <Link
            href="/donate"
            className="flex flex-col gap-3 rounded-2xl border-l-4 border-donate bg-donate-light p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl">💛</span>
            <div>
              <p className="font-display font-bold text-foreground text-sm">Donar</p>
              <p className="text-xs text-muted-foreground mt-0.5">{campaigns.length} campañas</p>
            </div>
            <span className="text-xs font-semibold text-donate-dark">Ver campañas →</span>
          </Link>

          <Link
            href="/shelters"
            className="flex flex-col gap-3 rounded-2xl border-l-4 border-shelter bg-shelter-light p-5 hover:-translate-y-1 hover:shadow-md transition-all duration-200"
          >
            <span className="text-3xl">🏠</span>
            <div>
              <p className="font-display font-bold text-foreground text-sm">Albergues</p>
              <p className="text-xs text-muted-foreground mt-0.5">{shelters.length} verificados</p>
            </div>
            <span className="text-xs font-semibold text-shelter-dark">Conocerlos →</span>
          </Link>
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
      <section className="py-12 px-4 bg-neutral-900 dark:bg-neutral-800">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-4 mb-7">
            <div>
              <h2 className="font-display font-bold text-2xl tracking-tight text-white">
                Campañas de donación activas
              </h2>
              <p className="mt-1 text-sm text-neutral-400">Tu aporte en soles hace la diferencia</p>
            </div>
            <Link
              href="/donate"
              className="flex items-center gap-1 text-sm font-semibold text-brand-300 hover:text-brand-400 hover:underline shrink-0 transition-colors"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Perdidos recientes ────────────────────────────────────────────── */}
      <section className="py-12 px-4 bg-rescue-light">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            title="Perdidos y encontrados"
            subtitle="Ayuda a reunir mascotas con sus familias"
            href="/lost"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {lostReports.slice(0, 4).map((report) => (
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
            href="/shelters"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {shelters.slice(0, 4).map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA para albergues ────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-brand-50 dark:bg-brand-600/10 border-t border-brand-100 dark:border-brand-600/20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display font-bold text-2xl text-foreground">¿Tienes un albergue?</h2>
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
        <h2 className="font-display font-bold text-2xl tracking-tight text-foreground">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-semibold text-brand-400 hover:text-brand-500 hover:underline shrink-0 transition-colors"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}
