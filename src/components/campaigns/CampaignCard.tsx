import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Heart } from "lucide-react";
import PawProgress, { PawIcon } from "./PawProgress";
import { cn } from "@/lib/utils";
import { isCampaignOpen } from "@/lib/huellas/domain";
import type { CampaignWithShelter } from "@/types";

interface CampaignCardProps {
  campaign: CampaignWithShelter;
  /** Versión grande para la campaña destacada de la portada. */
  featured?: boolean;
}

function deadlineLabel(isoDate: string | null): string {
  if (!isoDate) return "Sin fecha límite";
  const days = Math.ceil((new Date(isoDate).getTime() - Date.now()) / 86_400_000);
  if (days < 0) return "Cerrada";
  if (days === 0) return "Último día";
  return `${days} día${days === 1 ? "" : "s"} restantes`;
}

export default function CampaignCard({ campaign, featured = false }: CampaignCardProps) {
  const open = isCampaignOpen(campaign);
  return (
    <article
      className={cn(
        "relative flex h-full flex-col gap-4 rounded-[28px] bg-card transition-transform duration-200",
        featured ? "huellas-card-pop p-6 sm:p-8" : "border border-border p-5 sm:p-6 hover:-translate-y-0.5",
        !open && "opacity-80",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {campaign.shelter.avatar_url ? (
            <Image
              src={campaign.shelter.avatar_url}
              unoptimized={campaign.shelter.avatar_url.includes("api.dicebear.com")}
              alt=""
              width={40}
              height={40}
              sizes="40px"
              className="h-10 w-10 shrink-0 rounded-full border-2 border-secondary bg-secondary object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
              <PawIcon className="h-5 w-5" />
            </span>
          )}
          <p className="truncate text-sm font-bold text-muted-foreground">{campaign.shelter.name}</p>
        </div>
        <span
          className={cn(
            "shrink-0 -rotate-2 rounded-full px-3 py-1 text-xs font-extrabold",
            open ? "bg-highlight text-foreground" : "bg-muted text-muted-foreground",
          )}
        >
          {open ? "Abierta" : "Cerrada"}
        </span>
      </div>

      <div>
        <h3 className={cn("leading-tight text-foreground", featured ? "text-2xl sm:text-3xl" : "text-xl")}>
          {/* El título enlaza al detalle; el área de la tarjeta lo extiende. */}
          <Link
            href={`/donate/${campaign.slug}`}
            className="after:absolute after:inset-0 after:rounded-[28px] focus-visible:outline-none"
          >
            {campaign.title}
          </Link>
        </h3>
        {campaign.description && (
          <p className={cn("mt-2 leading-relaxed text-muted-foreground", featured ? "line-clamp-3" : "line-clamp-2 text-sm")}>
            {campaign.description}
          </p>
        )}
      </div>

      <PawProgress current={campaign.current_amount} goal={campaign.goal_amount} size={featured ? "lg" : "md"} />

      <div className="mt-auto flex flex-col gap-3">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
          <CalendarDays className="h-4 w-4" aria-hidden="true" />
          {open ? deadlineLabel(campaign.ends_at) : "Ya no recibe aportes"}
        </span>
        <span
          className={cn(
            "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-base font-extrabold",
            open ? "bg-support text-support-foreground" : "border-2 border-border text-muted-foreground",
          )}
        >
          {open && <Heart className="h-5 w-5" aria-hidden="true" />}
          {open ? "Apoyar esta campaña" : "Ver resultado"}
        </span>
      </div>
    </article>
  );
}
