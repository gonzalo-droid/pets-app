import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Pencil, Plus } from "lucide-react";
import { shelterContext } from "@/lib/huellas/auth";
import { getCampaigns } from "@/lib/data/campaigns";
import { CAMPAIGN_KIND_LABEL, campaignImage, eventDateLabel, isCampaignOpen } from "@/lib/huellas/domain";
import { ActionButton } from "@/components/huellas/Forms";
import PawProgress, { PawIcon } from "@/components/campaigns/PawProgress";
import ShareCampaign from "@/components/campaigns/ShareCampaign";
import { shareMessage } from "@/components/campaigns/CampaignCard";
import Image from "next/image";
import { cn } from "@/lib/utils";

const deadline = (iso: string | null) =>
  iso
    ? "Hasta el " +
      new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "long", timeZone: "America/Lima" })
    : "Sin fecha límite";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ publicada?: string; guardada?: string }>;
}) {
  const id = await shelterContext();
  const { publicada, guardada } = await searchParams;
  const campaigns = await getCampaigns({ shelter_id: id });
  const justPublished = publicada ? campaigns.find((c) => c.slug === publicada) : undefined;
  const sorted = [...campaigns].sort((a, b) => Number(isCampaignOpen(b)) - Number(isCampaignOpen(a)));

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl">Tus campañas</h1>
          <p className="mt-2 text-muted-foreground">
            Casos, fondos y eventos. Compártelos para llegar a más personas.
          </p>
        </div>
        <Link href="/shelter/campaigns/new" className="huellas-button huellas-button--support">
          <Plus className="h-5 w-5" aria-hidden="true" />
          Nueva campaña
        </Link>
      </div>

      {justPublished && (
        <section role="status" className="flex flex-col gap-3 rounded-[24px] bg-success-bg p-5 text-success-fg sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl">Campaña publicada</h2>
            <p className="mt-1 text-sm">El primer apoyo suele llegar de tu propia comunidad: compártela ahora.</p>
          </div>
          <ShareCampaign
            slug={justPublished.slug}
            title={justPublished.title}
            message={shareMessage(justPublished)}
            tone="primary"
            label="Compartir ahora"
            className="shrink-0"
          />
        </section>
      )}
      {guardada && (
        <p role="status" className="rounded-2xl bg-success-bg px-4 py-3 text-sm font-bold text-success-fg">
          Cambios guardados.
        </p>
      )}

      <section aria-label="Lista de campañas" className="space-y-4">
        {sorted.map((c) => {
          const open = isCampaignOpen(c);
          const expired = c.is_active && !open;
          const state = open
            ? { label: "Abierta", className: "bg-success-bg text-success-fg" }
            : expired
              ? { label: "Vencida", className: "bg-warning-bg text-warning-fg" }
              : { label: "Cerrada", className: "bg-muted text-muted-foreground" };
          const photo = campaignImage(c);
          return (
            <article key={c.id} className="space-y-4 rounded-[24px] bg-card p-4 sm:p-5">
              <div className="flex gap-4">
                <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-support-soft sm:h-20 sm:w-20">
                  {photo ? (
                    <Image src={photo} alt="" fill sizes="80px" className="object-cover" />
                  ) : (
                    <PawIcon className="absolute inset-0 m-auto h-8 w-8 text-support/30" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
                    <span className="text-primary">{CAMPAIGN_KIND_LABEL[c.kind]}</span>
                    <span className={cn("rounded-full px-2.5 py-0.5", state.className)}>{state.label}</span>
                  </p>
                  <h2 className="mt-1 font-body text-lg font-extrabold leading-snug">{c.title}</h2>
                  {c.kind === "event" && c.event_at ? (
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" aria-hidden="true" />
                        {eventDateLabel(c.event_at)}
                      </span>
                      {c.event_place && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4" aria-hidden="true" />
                          {c.event_place}
                        </span>
                      )}
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {deadline(c.ends_at)}
                      {expired && ". Edita la fecha para reabrirla."}
                    </p>
                  )}
                </div>
              </div>
              {c.kind !== "event" && (
                <PawProgress current={c.current_amount} goal={c.goal_amount} open={open} />
              )}

              <div className="flex flex-wrap items-center gap-2">
                {open && (
                  <ShareCampaign
                    slug={c.slug}
                    title={c.title}
                    message={shareMessage(c)}
                    tone="primary"
                  />
                )}
                <Link href={`/shelter/campaigns/${c.id}/edit`} className="huellas-button huellas-button--secondary">
                  <Pencil className="h-4 w-4" aria-hidden="true" />
                  Editar
                </Link>
                {c.is_active ? (
                  <ActionButton
                    tone="danger"
                    payload={{ action: "campaign_active", id: c.id, shelter_id: id, is_active: false }}
                    confirm="¿Cerrar esta campaña? Dejará de recibir apoyos. No se borra: seguirá visible como cerrada y conservará sus compromisos."
                  >
                    Cerrar
                  </ActionButton>
                ) : (
                  <ActionButton
                    tone="primary"
                    payload={{ action: "campaign_active", id: c.id, shelter_id: id, is_active: true }}
                  >
                    Reabrir
                  </ActionButton>
                )}
                <Link
                  href={"/donate/" + c.slug}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-extrabold text-primary hover:underline"
                >
                  Ver pública
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
        {!campaigns.length && (
          <div className="rounded-[24px] border-2 border-dashed border-input bg-card p-8 text-center">
            <p className="text-lg font-bold">Aún no has publicado campañas</p>
            <p className="mt-1 text-muted-foreground">
              Cuenta qué necesitan tus rescatados, cuánto hace falta o qué evento organizas.
            </p>
            <Link href="/shelter/campaigns/new" className="huellas-button huellas-button--support mt-5">
              Publicar la primera
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
