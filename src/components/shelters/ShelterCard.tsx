import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, PawPrint } from "lucide-react";
import { DISTRICT_LABEL } from "@/lib/ubigeo";
import type { Shelter } from "@/types";
import type { ShelterStats } from "@/lib/data/shelters";

interface ShelterCardProps {
  shelter: Shelter;
  stats?: ShelterStats;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export default function ShelterCard({ shelter, stats }: ShelterCardProps) {
  const place = DISTRICT_LABEL[shelter.ubigeo] ?? "Lambayeque";

  return (
    <Link
      href={`/shelters/${shelter.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border bg-card transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* Portada: imagen del albergue o bloque salvia de marca */}
      <div className="relative h-28 bg-secondary sm:h-32">
        {shelter.banner_url ? (
          <Image
            src={shelter.banner_url}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <PawPrint
            aria-hidden="true"
            className="absolute right-5 top-5 h-12 w-12 text-primary/15"
          />
        )}
      </div>

      <div className="relative flex flex-1 flex-col gap-3 px-5 pb-5">
        <div className="-mt-9 flex items-end justify-between gap-3">
          {shelter.avatar_url ? (
            <Image
              src={shelter.avatar_url}
              unoptimized={shelter.avatar_url.includes("api.dicebear.com")}
              alt=""
              width={72}
              height={72}
              sizes="72px"
              className="h-[72px] w-[72px] rounded-2xl border-4 border-card bg-card object-cover"
            />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-4 border-card bg-secondary text-primary">
              <PawPrint className="h-8 w-8" aria-hidden="true" />
            </div>
          )}
          {shelter.is_verified && (
            <span
              className="mb-1 inline-flex -rotate-2 items-center gap-1 rounded-full bg-highlight px-3 py-1 text-xs font-extrabold text-foreground"
              title="HUELLAS revisó la identidad del albergue. No garantiza cada una de sus actuaciones."
            >
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Verificado
            </span>
          )}
        </div>

        <div>
          <h3 className="text-xl leading-snug text-foreground">
            {shelter.name}
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {place}
          </p>
        </div>

        {shelter.description && (
          <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
            {shelter.description}
          </p>
        )}

        {stats && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Actividad del albergue">
            {stats.openCampaigns > 0 && (
              <li className="rounded-full bg-support-soft px-2.5 py-1 text-xs font-extrabold">
                {plural(stats.openCampaigns, "campaña abierta", "campañas abiertas")}
              </li>
            )}
            <li className="rounded-full bg-secondary px-2.5 py-1 text-xs font-extrabold">
              {plural(stats.animals, "animal", "animales")}
            </li>
            {stats.openNeeds > 0 && (
              <li className="rounded-full bg-warning-bg px-2.5 py-1 text-xs font-extrabold text-warning-fg">
                {plural(stats.openNeeds, "necesidad", "necesidades")}
              </li>
            )}
          </ul>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-extrabold text-primary">
          Conocer el albergue
          <ArrowRight
            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </div>
    </Link>
  );
}
