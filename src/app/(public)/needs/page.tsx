import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import PaginationNav from "@/components/ui/pagination-nav";
import { recordsPage } from "@/lib/huellas/records";
import { getShelters } from "@/lib/data/shelters";
import { parsePage, queryWithoutPage } from "@/lib/pagination";

export const metadata: Metadata = {
  title: "Necesidades de los albergues",
  description: "Productos y servicios concretos que necesitan los albergues. Coordina antes de entregar.",
};

const PAGE_SIZE = 9;

const STEPS = [
  ["Elige", "Busca algo que puedas conseguir o prestar."],
  ["Coordina", "Escribe al albergue para acordar día y lugar."],
  ["Entrega", "El albergue la marca como resuelta al recibirla."],
];

// Fondos suaves alternados para distinguir las tarjetas sin depender del color.
const TONES = ["bg-highlight", "bg-success-bg", "bg-secondary", "bg-support-soft"];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const [{ items: needs, page, totalPages, total }, shelters] = await Promise.all([
    recordsPage("needs", { openNeeds: true }, parsePage(params.page), PAGE_SIZE),
    getShelters(),
  ]);
  const shelterName = (id: string) => shelters.find((s) => s.id === id)?.name;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <section className="rounded-[32px] bg-warning-bg p-6 sm:p-10">
        <h1 className="text-4xl text-foreground sm:text-5xl">Lista de deseos de los albergues</h1>
        <p className="mt-3 max-w-2xl text-lg text-foreground/80">
          Productos y servicios concretos. Coordina con el albergue antes de llevar algo.
          {total > 0 && ` Hay ${total} necesidad${total === 1 ? "" : "es"} abierta${total === 1 ? "" : "s"}.`}
        </p>
      </section>

      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {STEPS.map(([title, text], i) => (
          <li key={title} className="flex items-start gap-3 rounded-[24px] border border-border bg-card p-4">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-display text-lg font-semibold text-primary-foreground">
              {i + 1}
            </span>
            <span>
              <strong className="font-display text-lg font-semibold">{title}</strong>
              <span className="block text-sm text-muted-foreground">{text}</span>
            </span>
          </li>
        ))}
      </ol>

      {needs.length ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {needs.map((n, i) => (
            <li key={n.id} className="flex flex-col gap-3 rounded-[28px] border border-border bg-card p-5">
              <div className="flex items-start gap-3">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${TONES[i % TONES.length]}`}>
                  <Package className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="text-xl leading-snug">{n.title}</h2>
                  <span className="mt-1 inline-block -rotate-1 rounded-full bg-support-soft px-3 py-0.5 text-sm font-extrabold">
                    {n.quantity}
                  </span>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{n.description}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
                <span className="text-sm font-bold text-muted-foreground">{shelterName(n.shelter_id)}</span>
                <Link
                  href={`/shelters/${n.shelter_id}?tab=necesidades#contenido`}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-extrabold text-primary-foreground hover:bg-primary-hover"
                >
                  Coordinar entrega
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-[28px] border-2 border-dashed border-border bg-card p-10 text-center">
          <p className="text-lg font-bold">No hay necesidades abiertas en este momento</p>
          <p className="mt-1 text-muted-foreground">Puedes apoyar una campaña mientras tanto.</p>
          <Link href="/donate" className="huellas-button huellas-button--support mt-5">
            Ver campañas
          </Link>
        </div>
      )}

      <PaginationNav
        currentPage={page}
        totalPages={totalPages}
        paramString={queryWithoutPage(params)}
        pathname="/needs"
      />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Publicar una necesidad no significa que alguien ya la cubrió: el albergue la marca como
        resuelta al recibirla.
      </p>
    </div>
  );
}
