import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Search } from "lucide-react";
import ShelterCard from "@/components/shelters/ShelterCard";
import ShelterSearchInput from "./ShelterSearchInput";
import PaginationNav from "@/components/ui/pagination-nav";
import { getShelterStats, getSheltersPage } from "@/lib/data/shelters";
import { parsePage, queryWithoutPage } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Albergues",
  description:
    "Conoce los albergues y refugios de animales en Lambayeque, Perú.",
};

const PAGE_SIZE = 6;

interface SheltersPageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SheltersPage({
  searchParams,
}: SheltersPageProps) {
  const params = await searchParams;
  const {
    items: shelters,
    page,
    totalPages,
    total,
  } = await getSheltersPage(params.q, parsePage(params.page), PAGE_SIZE);
  const paramString = queryWithoutPage(params);
  const stats = await getShelterStats(shelters.map((s) => s.id));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Cabecera salvia con buscador */}
      <section className="rounded-[32px] bg-secondary p-6 sm:p-10">
        <h1 className="text-4xl text-foreground sm:text-5xl">Quienes los cuidan</h1>
        <p className="mt-3 max-w-2xl text-lg text-foreground/80">
          Conoce a los albergues de tu región, sus rescatados y sus campañas.{" "}
          {total > 0 && `${total} albergue${total === 1 ? "" : "s"} verificado${total === 1 ? "" : "s"}.`}
        </p>
        <div className="mt-6 max-w-xl">
          <Suspense
            fallback={<div className="h-12 w-full animate-pulse rounded-full bg-card" />}
          >
            <ShelterSearchInput />
          </Suspense>
        </div>
      </section>
      <p className="mb-8 mt-4 flex max-w-2xl items-start gap-2 rounded-2xl border border-border bg-card px-4 py-3 text-sm">
        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <span>
          <strong className="font-extrabold">Verificado</strong> significa que HUELLAS revisó la
          identidad del albergue. No garantiza cada una de sus actuaciones.
        </span>
      </p>

      {/* Lista */}
      {shelters.length > 0 ? (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shelters.map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} stats={stats[shelter.id]} />
            ))}
          </div>
          <PaginationNav
            currentPage={page}
            totalPages={totalPages}
            paramString={paramString}
            pathname="/shelters"
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card py-16 text-center">
          <Search className="h-8 w-8 text-primary/60" aria-hidden="true" />
          <p className="text-lg font-semibold text-foreground">
            No encontramos albergues con esa búsqueda
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Revisa la escritura o prueba con el nombre de la ciudad.
          </p>
          <Link href="/shelters" className="huellas-button huellas-button--secondary mt-2 text-sm">
            Ver todos los albergues
          </Link>
        </div>
      )}
    </div>
  );
}
