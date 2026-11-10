import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, BadgeCheck, CalendarDays, Heart } from "lucide-react";
import { isCampaignOpen } from "@/lib/huellas/domain";
import PawProgress, { PawIcon } from "@/components/campaigns/PawProgress";
import { cn, formatPEN } from "@/lib/utils";
import { getCampaignBySlug } from "@/lib/data/campaigns";
import { getShelterById } from "@/lib/data/shelters";

interface CampaignDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CampaignDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) return { title: "Campaña no encontrada" };
  return {
    title: campaign.title,
    description: campaign.description ?? undefined,
  };
}

function deadlineLabel(isoDate: string | null): string {
  if (!isoDate) return "Sin fecha límite";
  const days = Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "Cerrada";
  if (days === 0) return "Último día";
  return `${days} día${days === 1 ? "" : "s"} restantes`;
}

export default async function CampaignDetailPage({
  params,
}: CampaignDetailPageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();

  const shelter = await getShelterById(campaign.shelter_id);
  const open = isCampaignOpen(campaign);
  const remaining = Math.max(0, campaign.goal_amount - campaign.current_amount);

  const cta = open ? (
    <div className="flex flex-col gap-3">
      <Link href={`/donate/${slug}/confirm`} className="huellas-button huellas-button--support min-h-13 w-full text-base">
        <Heart className="h-5 w-5" aria-hidden="true" />
        Apoyar esta campaña
      </Link>
      <p className="text-center text-xs text-muted-foreground">
        Compromiso sin cobro. Los pagos aún no están habilitados.
      </p>
    </div>
  ) : (
    <div className="rounded-[24px] bg-muted p-5 text-sm">
      <p className="font-display text-lg font-semibold text-foreground">Campaña cerrada</p>
      <p className="mt-1 text-muted-foreground">
        Ya no recibe aportes. Gracias a quienes la apoyaron.
      </p>
      <Link href="/donate" className="mt-3 inline-block font-extrabold text-primary hover:underline">
        Ver campañas abiertas →
      </Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Link
        href="/donate"
        className="mb-6 inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a campañas
      </Link>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1.4fr_1fr]">
        <div className="flex flex-col gap-8">
          {/* Tarjeta principal */}
          <section className="huellas-card-pop rounded-[32px] bg-card p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {campaign.shelter.avatar_url ? (
                  <Image
                    src={campaign.shelter.avatar_url}
                    unoptimized={campaign.shelter.avatar_url.includes("api.dicebear.com")}
                    alt=""
                    width={48}
                    height={48}
                    sizes="48px"
                    className="h-12 w-12 rounded-full border-2 border-secondary bg-secondary object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
                    <PawIcon className="h-6 w-6" />
                  </span>
                )}
                <p className="font-bold text-muted-foreground">{campaign.shelter.name}</p>
              </div>
              <span
                className={cn(
                  "-rotate-2 rounded-full px-3 py-1 text-sm font-extrabold",
                  open ? "bg-highlight text-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {open ? `Abierta · ${deadlineLabel(campaign.ends_at)}` : "Cerrada"}
              </span>
            </div>
            <h1 className="mt-5 text-3xl leading-tight text-foreground sm:text-4xl">
              {campaign.title}
            </h1>
            {campaign.animal && (
              <p className="mt-2 text-sm font-bold text-muted-foreground">
                Campaña para {campaign.animal.name}
              </p>
            )}
            <div className="mt-6">
              <PawProgress current={campaign.current_amount} goal={campaign.goal_amount} size="lg" />
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
              {[
                ["Registrado", formatPEN(campaign.current_amount)],
                ["Meta", formatPEN(campaign.goal_amount)],
                ["Falta", formatPEN(remaining)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-support-soft px-2 py-3">
                  <dt className="text-xs font-bold text-muted-foreground">{label}</dt>
                  <dd className="font-display text-lg font-semibold text-foreground">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted-foreground">
              Montos de ejemplo. Los compromisos pendientes no suman a lo registrado.
            </p>
          </section>

          {/* Acción en móvil, justo después del avance */}
          <div className="lg:hidden">{cta}</div>

          {campaign.description && (
            <section>
              <h2 className="text-2xl text-foreground">Sobre esta campaña</h2>
              <p className="mt-3 leading-relaxed text-foreground/80">{campaign.description}</p>
            </section>
          )}
        </div>

        {/* Lateral */}
        <aside className="flex flex-col gap-5 lg:sticky lg:top-24">
          <div className="hidden lg:block">{cta}</div>
          {shelter && (
            <Link
              href={`/shelters/${shelter.id}`}
              className="flex items-center gap-4 rounded-[24px] border border-border bg-card p-4 transition-transform hover:-translate-y-0.5"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <PawIcon className="h-6 w-6" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-muted-foreground">Albergue responsable</span>
                <span className="flex items-center gap-1.5 truncate font-display text-lg font-semibold">
                  {shelter.name}
                  {shelter.is_verified && (
                    <BadgeCheck className="h-4 w-4 shrink-0 text-primary" aria-label="Verificado" />
                  )}
                </span>
              </span>
            </Link>
          )}
          {open && campaign.ends_at && (
            <p className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3 text-sm font-bold">
              <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
              {deadlineLabel(campaign.ends_at)}
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
