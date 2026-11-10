import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, PawPrint } from "lucide-react";
import DonationProgress from "./DonationProgress";
import { cn } from "@/lib/utils";
import { isCampaignOpen } from "@/lib/huellas/domain";
import type { CampaignWithShelter } from "@/types";

interface CampaignCardProps {
  campaign: CampaignWithShelter;
}

function deadlineLabel(isoDate: string | null): string {
  if (!isoDate) return "Sin fecha límite";
  const days = Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "Cerrada";
  if (days === 0) return "Último día";
  return `${days} día${days === 1 ? "" : "s"} restantes`;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const open = isCampaignOpen(campaign);
  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:p-6 transition-[box-shadow,border-color] duration-200",
        open ? "hover:border-primary/40 hover:shadow-md" : "opacity-80",
      )}
    >
      <div className="flex items-start gap-3">
        {campaign.shelter.avatar_url ? (
          <Image
            src={campaign.shelter.avatar_url}
            unoptimized={campaign.shelter.avatar_url.includes("api.dicebear.com")}
            alt=""
            width={44}
            height={44}
            sizes="44px"
            className="h-11 w-11 shrink-0 rounded-xl border border-border bg-secondary object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
            <PawPrint className="h-5 w-5" aria-hidden="true" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-muted-foreground">
            {campaign.shelter.name}
          </p>
          <span
            className={cn(
              "mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
              open ? "bg-success-bg text-success-fg" : "bg-muted text-muted-foreground",
            )}
          >
            {open ? "Abierta" : "Cerrada"}
          </span>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold leading-snug text-foreground">
          {/* El título enlaza al detalle; el área de la tarjeta lo extiende. */}
          <Link
            href={`/donate/${campaign.slug}`}
            className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none"
          >
            {campaign.title}
          </Link>
        </h3>
        {campaign.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {campaign.description}
          </p>
        )}
      </div>

      <DonationProgress current={campaign.current_amount} goal={campaign.goal_amount} />

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          {open ? deadlineLabel(campaign.ends_at) : "No recibe aportes"}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-sm font-semibold",
            open ? "text-primary" : "text-muted-foreground",
          )}
        >
          {open ? "Apoyar campaña" : "Ver resultado"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}
