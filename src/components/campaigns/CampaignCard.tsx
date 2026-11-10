import Image from "next/image";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import DonationProgress from "./DonationProgress";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import type { CampaignWithShelter } from "@/types";
import { isCampaignOpen } from "@/lib/huellas/domain";

interface CampaignCardProps {
  campaign: CampaignWithShelter;
}

function daysUntil(isoDate: string | null): string {
  if (!isoDate) return "Sin fecha límite";
  const diff = new Date(isoDate).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "Cerrada";
  if (days === 0) return "Último día";
  return `${days} día${days === 1 ? "" : "s"} restantes`;
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const open = isCampaignOpen(campaign);
  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border border-border bg-card p-5 gap-4 transition-all",
        open ? "hover:border-donate/40 hover:shadow-md" : "opacity-75",
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href={`/shelters/${campaign.shelter.id}`}
          className="shrink-0 hover:opacity-80 transition-opacity"
        >
          {campaign.shelter.avatar_url ? (
            <Image
              src={campaign.shelter.avatar_url}
              unoptimized={campaign.shelter.avatar_url.includes(
                "api.dicebear.com",
              )}
              alt={campaign.shelter.name}
              width={40}
              height={40}
              sizes="40px"
              className="h-10 w-10 rounded-full border border-border bg-muted object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full border border-border bg-muted" />
          )}
        </Link>
        <div className="flex-1 min-w-0">
          {!open && (
            <span className="mb-1 inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
              Cerrada
            </span>
          )}
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
            {campaign.title}
          </h3>
          <Link
            href={`/shelters/${campaign.shelter.id}`}
            className="text-xs text-muted-foreground hover:text-primary transition-colors mt-0.5 block"
          >
            {campaign.shelter.name}
          </Link>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {campaign.description}
      </p>

      {/* Progreso */}
      <DonationProgress
        current={campaign.current_amount}
        goal={campaign.goal_amount}
      />

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-border">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          <span>{open ? daysUntil(campaign.ends_at) : "Cerrada"}</span>
        </div>
        {open ? (
          <Link
            href={`/donate/${campaign.slug}`}
            className={cn(buttonVariants({ size: "sm" }), "bg-brand-400 text-[#1f1300] hover:bg-brand-300")}
          >
            Donar ahora
          </Link>
        ) : (
          <Link
            href={`/donate/${campaign.slug}`}
            className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
          >
            Ver resultado
          </Link>
        )}
      </div>
    </div>
  );
}
