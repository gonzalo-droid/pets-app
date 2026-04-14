import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft, BadgeCheck, CalendarDays, Target } from 'lucide-react'
import DonationProgress from '@/components/campaigns/DonationProgress'
import { cn, formatPEN, campaignProgress } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { getCampaignBySlug } from '@/lib/mock/campaigns'
import { getShelterById } from '@/lib/mock/shelters'

interface CampaignDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CampaignDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const campaign = await getCampaignBySlug(slug)
  if (!campaign) return { title: 'Campaña no encontrada' }
  return {
    title: campaign.title,
    description: campaign.description ?? undefined,
  }
}

function daysUntil(isoDate: string | null): string | null {
  if (!isoDate) return null
  const diff = new Date(isoDate).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Finalizada'
  if (days === 0) return 'Último día'
  return `${days} día${days === 1 ? '' : 's'} restantes`
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { slug } = await params
  const campaign = await getCampaignBySlug(slug)
  if (!campaign) notFound()

  // Shelter completo para mostrar datos de pago en el flujo de confirmación
  const shelter = await getShelterById(campaign.shelter_id)
  const pct = campaignProgress(campaign.current_amount, campaign.goal_amount)
  const deadline = daysUntil(campaign.ends_at)

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <Link
        href="/donate"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a campañas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna principal */}
        <div className="lg:col-span-2 flex flex-col gap-7">
          {/* Header campaña */}
          <div className="flex items-start gap-4">
            {campaign.shelter.avatar_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={campaign.shelter.avatar_url}
                alt={campaign.shelter.name}
                className="h-14 w-14 rounded-full border border-border bg-muted shrink-0"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {campaign.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                por{' '}
                <span className="font-medium text-foreground">{campaign.shelter.name}</span>
              </p>
              {campaign.animal && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  Campaña para {campaign.animal.name} ({campaign.animal.species === 'dog' ? 'perro' : campaign.animal.species === 'cat' ? 'gato' : 'animal'})
                </p>
              )}
            </div>
          </div>

          {/* Descripción */}
          {campaign.description && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-2">Sobre esta campaña</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{campaign.description}</p>
            </div>
          )}

          {/* Progreso detallado */}
          <div className="rounded-xl border border-border p-5 flex flex-col gap-4">
            <DonationProgress
              current={campaign.current_amount}
              goal={campaign.goal_amount}
            />

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Recaudado</p>
                <p className="font-bold text-foreground mt-0.5">{formatPEN(campaign.current_amount)}</p>
              </div>
              <div className="text-center border-x border-border">
                <p className="text-xs text-muted-foreground">Meta</p>
                <p className="font-bold text-foreground mt-0.5">{formatPEN(campaign.goal_amount)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Completado</p>
                <p className="font-bold text-primary mt-0.5">{pct}%</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
              {deadline && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {deadline}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Target className="h-3.5 w-3.5" />
                Meta: {formatPEN(campaign.goal_amount - campaign.current_amount)} restantes
              </span>
            </div>
          </div>

          {/* CTA móvil */}
          <div className="lg:hidden">
            <Link
              href={`/donate/${slug}/confirm`}
              className={cn(buttonVariants({ size: 'lg' }), 'w-full justify-center')}
            >
              💛 Donar ahora
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* CTA escritorio */}
          <div className="hidden lg:flex flex-col gap-3">
            <Link
              href={`/donate/${slug}/confirm`}
              className={cn(buttonVariants({ size: 'lg' }), 'w-full justify-center')}
            >
              💛 Donar ahora
            </Link>
            <p className="text-xs text-muted-foreground text-center">
              Sin comisiones. 100% va al albergue.
            </p>
          </div>

          {/* Albergue */}
          {shelter && (
            <div className="rounded-xl border border-border p-5 flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-foreground">Albergue responsable</h2>
              <Link
                href={`/shelters/${shelter.id}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                {shelter.avatar_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={shelter.avatar_url}
                    alt={shelter.name}
                    className="h-10 w-10 rounded-full border border-border"
                  />
                )}
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-sm font-medium text-foreground">{shelter.name}</p>
                    {shelter.is_verified && (
                      <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                  {shelter.address && (
                    <p className="text-xs text-muted-foreground mt-0.5">{shelter.address}</p>
                  )}
                </div>
              </Link>

              {/* Métodos de pago disponibles */}
              <div className="pt-3 border-t border-border flex flex-col gap-2">
                <p className="text-xs font-medium text-foreground">Acepta pagos vía:</p>
                {shelter.yape_number && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-5 w-5 flex items-center justify-center rounded bg-[#742483] text-white text-[10px] font-bold">Y</span>
                    Yape disponible
                  </span>
                )}
                {shelter.bank_account && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="h-5 w-5 flex items-center justify-center rounded bg-primary/20 text-primary text-[10px] font-bold">B</span>
                    Transferencia bancaria
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Aviso manual */}
          <div className="rounded-xl bg-muted/30 border border-border px-4 py-3 text-xs text-muted-foreground">
            Las donaciones son manuales. Después de transferir, sube el comprobante y
            el albergue lo confirmará para actualizar la barra de progreso.
          </div>
        </div>
      </div>
    </div>
  )
}
