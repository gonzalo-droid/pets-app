import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, MapPin } from "lucide-react";
import {
  CAMPAIGN_KIND_LABEL,
  campaignImage,
  eventDateLabel,
  isCampaignOpen,
} from "@/lib/huellas/domain";
import PawProgress, { PawIcon } from "@/components/campaigns/PawProgress";
import ShareCampaign from "@/components/campaigns/ShareCampaign";
import { shareMessage } from "@/components/campaigns/CampaignCard";
import { SupportForm } from "@/components/huellas/Forms";
import LoginRequired from "@/components/huellas/LoginRequired";
import { currentActor } from "@/lib/huellas/auth";
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
  const description =
    campaign.description?.slice(0, 160) ?? `${campaign.shelter.name} necesita tu apoyo.`;
  return {
    title: campaign.title,
    description,
    openGraph: { title: campaign.title, description, type: "article" },
  };
}

function deadlineLabel(isoDate: string | null): string {
  if (!isoDate) return "Abierta, sin fecha límite";
  const days = Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "Cerrada";
  if (days === 0) return "Abierta, último día";
  return `Abierta, quedan ${days} día${days === 1 ? "" : "s"}`;
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { slug } = await params;
  const campaign = await getCampaignBySlug(slug);
  if (!campaign) notFound();

  const [shelter, actor] = await Promise.all([
    getShelterById(campaign.shelter_id),
    currentActor(),
  ]);
  const open = isCampaignOpen(campaign);
  const photo = campaignImage(campaign);
  const kindLabel = CAMPAIGN_KIND_LABEL[campaign.kind];

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-8 lg:px-8">
      <Link
        href="/donate"
        className="mb-3 inline-flex min-h-11 items-center gap-1.5 rounded-full text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Campañas
      </Link>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-10">
        {/* Foto, título y avance */}
        <div className="flex flex-col gap-5 lg:col-start-1">
          <div className="relative">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[28px] bg-support-soft">
              {photo ? (
                <Image
                  src={photo}
                  alt={campaign.animal ? `Foto de ${campaign.animal.name}` : ""}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover object-[center_35%]"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-support/30">
                  <PawIcon className="h-20 w-20" />
                </div>
              )}
            </div>
            {campaign.animal && (
              <span className="huellas-tag absolute -bottom-5 left-4 text-3xl sm:text-4xl">
                {campaign.animal.name}
              </span>
            )}
          </div>

          <header className={campaign.animal ? "pt-5" : ""}>
            <p className="text-sm font-extrabold text-muted-foreground">{kindLabel}</p>
            <p className="mt-1 flex items-center gap-1.5 font-bold text-primary">
              {campaign.shelter.name}
              {shelter?.is_verified && (
                <BadgeCheck className="h-4 w-4 shrink-0" aria-label="Albergue verificado" />
              )}
            </p>
            <h1 className="mt-2 text-3xl leading-tight text-foreground sm:text-4xl">
              {campaign.title}
            </h1>
            {campaign.kind === "event" && campaign.event_at ? (
              <div className="mt-3 flex flex-col gap-1.5 font-semibold">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="first-letter:uppercase">{eventDateLabel(campaign.event_at)}</span>
                </p>
                {campaign.event_place && (
                  <p className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    {campaign.event_place}
                  </p>
                )}
              </div>
            ) : (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" aria-hidden="true" />
                {open ? deadlineLabel(campaign.ends_at) : "Cerrada: ya no recibe apoyos"}
              </p>
            )}
          </header>

          <div className="rounded-[24px] bg-card p-5">
            <PawProgress
              current={campaign.current_amount}
              goal={campaign.goal_amount}
              size="lg"
              open={open}
            />
            {campaign.current_amount > 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Montos de ejemplo. Los compromisos pendientes no suman a lo registrado.
              </p>
            )}
          </div>
        </div>

        {/* Apoyar y compartir */}
        <aside
          id="apoyar"
          className="flex scroll-mt-24 flex-col gap-4 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1"
        >
          {open ? (
            actor ? (
              <SupportForm kind="donation" slug={slug} title={campaign.title} />
            ) : (
              <LoginRequired returnTo={`/donate/${slug}#apoyar`} action="apoyar esta campaña" />
            )
          ) : (
            <div className="rounded-[24px] bg-muted p-5 text-sm">
              <p className="font-display text-lg font-semibold text-foreground">Campaña cerrada</p>
              <p className="mt-1 text-muted-foreground">
                Ya no recibe apoyos. Gracias a quienes la acompañaron.
              </p>
              <Link
                href="/donate"
                className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-extrabold text-primary hover:underline"
              >
                Ver campañas abiertas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
          {open && (
            <div className="rounded-[24px] bg-secondary p-5">
              <p className="font-extrabold">¿No puedes aportar ahora?</p>
              <p className="mt-1 text-sm leading-relaxed text-foreground/85">
                Compartir la campaña también ayuda a {campaign.shelter.name}.
              </p>
              <ShareCampaign
                slug={slug}
                title={campaign.title}
                message={shareMessage(campaign)}
                label="Compartir la campaña"
                className="mt-3 w-full"
              />
            </div>
          )}
        </aside>

        {/* Historia y albergue */}
        <div className="flex flex-col gap-6 lg:col-start-1">
          {campaign.description && (
            <section>
              <h2 className="text-2xl text-foreground">
                {campaign.animal ? `La historia de ${campaign.animal.name}` : "Sobre esta campaña"}
              </h2>
              <p className="mt-3 max-w-[68ch] whitespace-pre-line text-lg leading-relaxed text-foreground/90">
                {campaign.description}
              </p>
            </section>
          )}
          {shelter && (
            <Link
              href={`/shelters/${shelter.id}`}
              className="flex min-h-16 items-center gap-4 rounded-[24px] bg-card p-4 transition-colors hover:bg-secondary/60"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-primary">
                {shelter.avatar_url ? (
                  <Image
                    src={shelter.avatar_url}
                    unoptimized={shelter.avatar_url.includes("api.dicebear.com")}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 object-cover"
                  />
                ) : (
                  <PawIcon className="h-6 w-6" />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-muted-foreground">Albergue responsable</span>
                <span className="block truncate font-display text-lg font-semibold">{shelter.name}</span>
              </span>
              <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
