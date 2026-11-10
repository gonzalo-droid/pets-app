import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, PawPrint } from "lucide-react";
import { DISTRICT_LABEL } from "@/lib/ubigeo";
import type { Shelter } from "@/types";

interface ShelterCardProps {
  shelter: Shelter;
}

export default function ShelterCard({ shelter }: ShelterCardProps) {
  const place = DISTRICT_LABEL[shelter.ubigeo] ?? "Lambayeque";

  return (
    <Link
      href={`/shelters/${shelter.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[box-shadow,border-color] duration-200 hover:border-primary/40 hover:shadow-md"
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
              className="mb-1 inline-flex items-center gap-1 rounded-full bg-success-bg px-2.5 py-1 text-xs font-semibold text-success-fg"
              title="HUELLAS revisó la identidad del albergue. No garantiza cada una de sus actuaciones."
            >
              <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Verificado
            </span>
          )}
        </div>

        <div>
          <h3 className="text-lg font-bold leading-snug text-foreground">
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

        <span className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary">
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
