import Link from "next/link";
import { ArrowRight, HeartHandshake, House, Package } from "lucide-react";
import { getAnimalsPage } from "@/lib/data/animals";
import { getShelters } from "@/lib/data/shelters";
import { getCampaignTotals, getCampaignsPage } from "@/lib/data/campaigns";
import { recordsPage } from "@/lib/huellas/records";
import { campaignImage } from "@/lib/huellas/domain";
import AnimalCard from "@/components/animals/AnimalCard";
import CampaignCard, { shareMessage } from "@/components/campaigns/CampaignCard";
import ShareCampaign from "@/components/campaigns/ShareCampaign";
import { cn } from "@/lib/utils";
import type { CampaignKind } from "@/types";

const FILTERS: { id: string; label: string; kind?: CampaignKind }[] = [
  { id: "", label: "Todas" },
  { id: "caso", label: "Casos", kind: "case" },
  { id: "fondo", label: "Fondos", kind: "fund" },
  { id: "evento", label: "Eventos", kind: "event" },
];

const EMPTY: Record<string, string> = {
  "": "Por ahora no hay campañas abiertas.",
  caso: "Ahora no hay casos abiertos.",
  fondo: "Ahora no hay fondos abiertos.",
  evento: "Ahora no hay eventos próximos.",
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const { tipo = "" } = await searchParams;
  const filter = FILTERS.find((f) => f.id === tipo) ?? FILTERS[0];
  // Solo se piden las tarjetas visibles; los totales salen de conteos reales.
  const [campaignsPage, campaignTotals, animalsPage, shelters, needsPage] = await Promise.all([
    getCampaignsPage({ open_only: true, kind: filter.kind }, 1, 6),
    getCampaignTotals({ is_active: true }),
    getAnimalsPage({ status: "available" }, 1, 4),
    getShelters(),
    recordsPage("needs", { openNeeds: true }, 1, 1),
  ]);
  const campaigns = campaignsPage.items;
  // Destacada: primero un caso con la foto del animal, para que la campaña
  // tenga una cara; si no hay, la primera con alguna foto.
  const featured =
    campaigns.find((c) => c.animal?.photo_url) ?? campaigns.find((c) => campaignImage(c)) ?? campaigns[0];
  const others = campaigns.filter((c) => c !== featured);
  const shelterName = (id: string) => shelters.find((s) => s.id === id)?.name;

  return (
    <div>
      {/* ── Campañas: lo primero ─────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex min-w-0 flex-col gap-5">
            <h1 className="text-[2rem] leading-[1.08] text-foreground sm:text-5xl">
              Campañas de los albergues
            </h1>
            <p className="max-w-[46ch] text-lg leading-relaxed text-muted-foreground">
              Apoya un caso, un fondo o un evento de los albergues de tu región. Si hoy no
              puedes aportar, compartir también los ayuda.
            </p>
            <nav aria-label="Tipo de campaña" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
              {FILTERS.map((f) => (
                <Link
                  key={f.id}
                  href={f.id ? `/?tipo=${f.id}` : "/"}
                  scroll={false}
                  aria-current={f.id === filter.id ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 shrink-0 items-center rounded-full border-2 px-5 text-sm font-extrabold transition-colors",
                    f.id === filter.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-card text-foreground hover:bg-secondary",
                  )}
                >
                  {f.label}
                </Link>
              ))}
            </nav>

            {/* En escritorio, la lista va junto a la destacada. */}
            {others.length > 0 && (
              <ul className="hidden divide-y divide-border overflow-hidden rounded-[24px] bg-card lg:block">
                {others.map((c) => (
                  <li key={c.id}>
                    <CampaignCard campaign={c} variant="row" />
                  </li>
                ))}
              </ul>
            )}
            {campaignTotals.open > campaigns.length && (
              <Link href="/donate" className="hidden min-h-11 items-center gap-1.5 self-start font-extrabold text-primary hover:underline lg:inline-flex">
                Ver las {campaignTotals.open} campañas abiertas
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>

          {featured ? (
            <CampaignCard campaign={featured} variant="featured" />
          ) : (
            <div className="rounded-[28px] border-2 border-dashed border-input bg-card p-8 text-center">
              <p className="text-lg font-bold">{EMPTY[filter.id]}</p>
              <p className="mt-1 text-muted-foreground">
                Mira las necesidades de los albergues o{" "}
                <Link href="/donate?estado=cerradas" className="font-extrabold text-primary underline">
                  el resultado de campañas anteriores
                </Link>
                .
              </p>
            </div>
          )}

          {others.length > 0 && (
            <ul className="divide-y divide-border overflow-hidden rounded-[24px] bg-card lg:hidden">
              {others.map((c) => (
                <li key={c.id}>
                  <CampaignCard campaign={c} variant="row" />
                </li>
              ))}
            </ul>
          )}
        </div>
        <Link href="/donate" className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-extrabold text-primary hover:underline lg:hidden">
          Ver todas las campañas
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>

      {/* ── Difundir ─────────────────────────────────────────── */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 rounded-[28px] bg-secondary p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <h2 className="text-2xl">Compartir también ayuda</h2>
              <p className="mt-1 max-w-[52ch] leading-relaxed text-foreground/85">
                Un albergue pequeño llega a pocas personas. Envía una campaña por WhatsApp a quien
                pueda apoyarla.
              </p>
            </div>
            <ShareCampaign
              slug={featured.slug}
              title={featured.title}
              message={shareMessage(featured)}
              label="Compartir una campaña"
              tone="primary"
              className="shrink-0"
            />
          </div>
        </section>
      )}

      {/* ── Otras formas de ayudar ───────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl">Otras formas de ayudar</h2>
        <ul className="mt-4 grid divide-y divide-border overflow-hidden rounded-[24px] bg-card sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { href: "/adopt", icon: HeartHandshake, title: "Apadrinar a un rescatado", text: "Un aporte mensual para su cuidado" },
            {
              href: "/needs",
              icon: Package,
              title: "Donar productos",
              text: needsPage.total ? `${needsPage.total} necesidad${needsPage.total === 1 ? "" : "es"} abierta${needsPage.total === 1 ? "" : "s"}` : "Mira lo que necesitan",
            },
            { href: "/adopt", icon: House, title: "Adoptar", text: `${animalsPage.total} ${animalsPage.total === 1 ? "animal busca" : "animales buscan"} hogar` },
          ].map(({ href, icon: Icon, title, text }) => (
            <li key={title}>
              <Link href={href} className="flex min-h-16 items-center gap-4 p-4 transition-colors hover:bg-secondary/60 sm:p-5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-extrabold">{title}</span>
                  <span className="text-sm text-muted-foreground">{text}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Animales ─────────────────────────────────────────── */}
      {animalsPage.items.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pt-12 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-2xl sm:text-3xl">Buscan un hogar</h2>
            <Link href="/adopt" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-extrabold text-primary hover:underline">
              Ver los {animalsPage.total}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
            {animalsPage.items.map((a) => (
              <AnimalCard key={a.id} animal={a} shelterName={shelterName(a.shelter_id)} />
            ))}
          </div>
        </section>
      )}

      {/* ── Para albergues ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex flex-col gap-5 rounded-[28px] bg-primary p-6 text-primary-foreground sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div>
            <h2 className="text-2xl sm:text-3xl">¿Tienes un albergue?</h2>
            <p className="mt-2 max-w-[52ch] leading-relaxed text-primary-foreground/90">
              Publica tus campañas, eventos y rescatados en minutos, y compártelos con un enlace.
              Lo revisamos y, una vez verificado, aparece en HUELLAS.
            </p>
          </div>
          <Link
            href="/registrar-albergue"
            className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start rounded-full bg-card px-6 font-extrabold text-primary hover:bg-secondary sm:self-auto"
          >
            Registrar mi albergue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
