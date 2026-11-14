import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Heart, MapPin } from "lucide-react";
import PawProgress, { PawIcon } from "./PawProgress";
import ShareCampaign from "./ShareCampaign";
import { cn } from "@/lib/utils";
import {
  CAMPAIGN_KIND_LABEL,
  campaignImage,
  eventDateLabel,
  isCampaignOpen,
} from "@/lib/huellas/domain";
import type { CampaignWithShelter } from "@/types";

interface CampaignCardProps {
  campaign: CampaignWithShelter;
  /**
   * featured: grande, con botones de apoyar y compartir (portada).
   * row: fila compacta para listas.
   * card (por defecto): tarjeta con foto para grillas.
   */
  variant?: "card" | "featured" | "row";
  /** Compatibilidad: equivale a variant="featured". */
  featured?: boolean;
}

function deadlineLabel(isoDate: string | null): string {
  if (!isoDate) return "Sin fecha límite";
  const days = Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "Cerrada";
  if (days === 0) return "Último día";
  return `Quedan ${days} día${days === 1 ? "" : "s"}`;
}

/** Frase para WhatsApp: qué se necesita y de quién. */
export function shareMessage(c: CampaignWithShelter) {
  if (c.kind === "event" && c.event_at)
    return `${c.shelter.name} organiza "${c.title}" el ${eventDateLabel(c.event_at)}${c.event_place ? ` en ${c.event_place}` : ""}. Puedes apoyar o compartir aquí:`;
  return `${c.shelter.name} necesita ayuda: "${c.title}". Puedes apoyar o compartir aquí:`;
}

function Photo({ c, className, sizes }: { c: CampaignWithShelter; className?: string; sizes: string }) {
  const src = campaignImage(c);
  return (
    <div className={cn("relative overflow-hidden bg-support-soft", className)}>
      {src ? (
        <Image
          src={src}
          alt={c.animal ? `Foto de ${c.animal.name}` : ""}
          fill
          sizes={sizes}
          className="object-cover object-[center_35%]"
        />
      ) : (
        <div className="flex h-full items-center justify-center text-support/30">
          <PawIcon className="h-12 w-12" />
        </div>
      )}
    </div>
  );
}

function EventLine({ c }: { c: CampaignWithShelter }) {
  if (c.kind !== "event" || !c.event_at) return null;
  return (
    <p className="flex flex-col gap-1 text-sm font-semibold text-foreground">
      <span className="flex items-center gap-1.5">
        <CalendarDays className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span className="first-letter:uppercase">{eventDateLabel(c.event_at)}</span>
      </span>
      {c.event_place && (
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          {c.event_place}
        </span>
      )}
    </p>
  );
}

export default function CampaignCard({ campaign: c, variant, featured }: CampaignCardProps) {
  const kind = variant ?? (featured ? "featured" : "card");
  const open = isCampaignOpen(c);
  const href = `/donate/${c.slug}`;
  const kindLabel = CAMPAIGN_KIND_LABEL[c.kind];

  if (kind === "row")
    return (
      <article className="relative flex items-center gap-4 p-4">
        <Photo c={c} className="h-16 w-16 shrink-0 rounded-2xl" sizes="64px" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-extrabold text-primary">
            {kindLabel}
            {!open && <span className="text-muted-foreground"> (cerrada)</span>}
          </p>
          <h3 className="font-body text-base font-extrabold leading-snug">
            <Link href={href} className="after:absolute after:inset-0 hover:underline">
              {c.title}
            </Link>
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{c.shelter.name}</p>
          {c.kind !== "event" && (
            <div className="mt-2">
              <PawProgress current={c.current_amount} goal={c.goal_amount} size="sm" open={open} />
            </div>
          )}
        </div>
      </article>
    );

  const big = kind === "featured";
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[28px] bg-card",
        !big && "border border-border",
      )}
    >
      <div className="relative">
        <Photo
          c={c}
          className={big ? "aspect-[16/10] sm:aspect-[16/9]" : "aspect-[16/10]"}
          sizes={big ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
        />
        <span className="absolute left-3 top-3 rounded-full bg-card px-3 py-1 text-xs font-extrabold text-foreground">
          {open ? kindLabel : `${kindLabel} cerrada`}
        </span>
        {c.animal && (
          <span
            className={cn(
              "huellas-tag absolute -bottom-5 left-4",
              big ? "text-2xl sm:text-3xl" : "huellas-tag--sm text-lg",
            )}
          >
            {c.animal.name}
          </span>
        )}
      </div>

      <div className={cn("flex flex-1 flex-col gap-3", big ? "p-5 pt-8 sm:p-7 sm:pt-9" : "p-5 pt-7")}>
        <p className="text-sm font-bold text-primary">{c.shelter.name}</p>
        <h3 className={cn("leading-tight text-foreground", big ? "text-2xl sm:text-3xl" : "text-xl")}>
          {/* El título enlaza al detalle; el área de la tarjeta lo extiende. */}
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {c.title}
          </Link>
        </h3>
        {big && c.description && (
          <p className="line-clamp-2 leading-relaxed text-muted-foreground">{c.description}</p>
        )}
        <EventLine c={c} />
        {c.kind !== "event" && (
          <PawProgress current={c.current_amount} goal={c.goal_amount} size={big ? "lg" : "md"} open={open} />
        )}
        {!big && (
          <p className="mt-auto flex items-center gap-1.5 pt-1 text-xs font-semibold text-muted-foreground">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {open ? deadlineLabel(c.ends_at) : "Ya no recibe apoyos"}
          </p>
        )}
        {big && (
          <div className="relative z-10 mt-auto flex gap-2 pt-1">
            <Link
              href={open ? `${href}#apoyar` : href}
              className={cn("huellas-button flex-1 text-base", open ? "huellas-button--support" : "huellas-button--secondary")}
            >
              {open && <Heart className="h-5 w-5" aria-hidden="true" />}
              {open ? (c.animal ? `Apoyar a ${c.animal.name}` : "Apoyar") : "Ver resultado"}
            </Link>
            <ShareCampaign slug={c.slug} title={c.title} message={shareMessage(c)} variant="icon" />
          </div>
        )}
      </div>
    </article>
  );
}
