import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardList,
  Heart,
  HeartHandshake,
  Megaphone,
  Package,
  PawPrint,
} from "lucide-react";
import { getAnimalsPage } from "@/lib/data/animals";
import { getShelters } from "@/lib/data/shelters";
import { getCampaignTotals, getCampaignsPage } from "@/lib/data/campaigns";
import { recordsPage } from "@/lib/huellas/records";
import AnimalCard from "@/components/animals/AnimalCard";
import CampaignCard from "@/components/campaigns/CampaignCard";

function SectionHeader({
  title,
  text,
  href,
  linkLabel,
}: {
  title: string;
  text: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="mt-2 text-muted-foreground">{text}</p>
      </div>
      <Link
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
        href={href}
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

export default async function Page() {
  // Solo se piden las tarjetas visibles; los totales salen de conteos reales.
  const [animalsPage, shelters, campaignsPage, campaignTotals, needsPage] =
    await Promise.all([
      getAnimalsPage({ status: "available" }, 1, 4),
      getShelters(),
      getCampaignsPage({ is_active: true }, 1, 3),
      getCampaignTotals({ is_active: true }),
      recordsPage("needs", { openNeeds: true }, 1, 3),
    ]);
  const animals = animalsPage.items;
  const campaigns = campaignsPage.items;
  const needs = needsPage.items;
  const shelterName = (id: string) => shelters.find((s) => s.id === id)?.name;

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <div className="grid overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-[45fr_55fr]">
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <h1 className="text-[2.5rem] font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl xl:text-6xl">
              Tu ayuda deja una{" "}
              <span className="font-editorial text-primary">huella</span> para
              siempre.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Conecta con albergues de tu región, conoce a sus rescatados y
              acompaña su cuidado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="huellas-button" href="/shelters">
                <PawPrint className="h-5 w-5" aria-hidden="true" />
                Conocer albergues
              </Link>
              <Link className="huellas-button huellas-button--secondary" href="/adopt">
                <Heart className="h-5 w-5" aria-hidden="true" />
                Quiero apadrinar
              </Link>
            </div>
            {/* Cifras reales de la plataforma, no ilustrativas */}
            <p className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              <BadgeCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>
                {shelters.length} albergue{shelters.length === 1 ? "" : "s"} verificado
                {shelters.length === 1 ? "" : "s"}
              </span>
              <span aria-hidden="true">·</span>
              <span>
                {animalsPage.total} animal{animalsPage.total === 1 ? "" : "es"} buscando
                hogar
              </span>
            </p>
          </div>
          <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[520px]">
            <Image
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&q=85"
              alt="Perro descansando al aire libre"
              fill
              priority
              sizes="(min-width:1024px) 55vw, 100vw"
              className="object-cover object-[center_35%]"
            />
            <p className="absolute bottom-4 right-4 rounded-xl bg-card/95 px-4 py-3 text-sm font-medium text-card-foreground shadow-sm sm:bottom-6 sm:right-6">
              Una nueva historia empieza contigo
            </p>
          </div>
        </div>
      </section>

      {/* ── Campañas: prioridad tras el hero ─────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeader
          title="Ayuda donde más se necesita"
          text={
            campaignTotals.open > 0
              ? `Campañas de los albergues para cuidados concretos. ${campaignTotals.open} abierta${campaignTotals.open === 1 ? "" : "s"} ahora.`
              : "Campañas de los albergues para cuidados concretos."
          }
          href="/donate"
          linkLabel="Ver todas las campañas"
        />
        {campaigns.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
            Por ahora no hay campañas publicadas. Puedes conocer las necesidades
            de los albergues.
          </p>
        )}
      </section>

      {/* ── Animales ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeader
            title="Alguien está esperando por ti"
            text="Conoce su historia. Puedes solicitar su adopción o acompañar su cuidado como padrino."
            href="/adopt"
            linkLabel="Ver todos los animales"
          />
          {animals.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {animals.map((a) => (
                <AnimalCard key={a.id} animal={a} shelterName={shelterName(a.shelter_id)} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
              Pronto compartiremos nuevas historias.
            </p>
          )}
        </div>
      </section>

      {/* ── Necesidades ──────────────────────────────────────── */}
      {needs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeader
            title="Lo que necesitan hoy"
            text="Productos y servicios concretos. Coordina con el albergue antes de hacer una entrega."
            href="/needs"
            linkLabel="Ver todas las necesidades"
          />
          <div className="grid gap-5 md:grid-cols-3">
            {needs.map((n) => (
              <Link
                key={n.id}
                href={`/shelters/${n.shelter_id}`}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-[box-shadow,border-color] hover:border-primary/40 hover:shadow-md"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Package className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="text-lg font-bold text-foreground">{n.title}</h3>
                <span className="self-start rounded-full bg-warning-bg px-3 py-1 text-sm font-semibold text-warning-fg">
                  {n.quantity}
                </span>
                <p className="mt-auto text-sm text-muted-foreground">
                  {shelterName(n.shelter_id)} ·{" "}
                  <span className="font-semibold text-primary group-hover:underline">
                    Coordinar con el albergue
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── HUELLAS Gestión ──────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid gap-10 rounded-3xl bg-primary p-8 text-primary-foreground sm:p-12 md:grid-cols-2">
          <div>
            <HeartHandshake className="h-9 w-9" aria-hidden="true" />
            <h2 className="mt-5 text-3xl font-bold">
              ¿Tienes un albergue? Organízalo en un solo lugar.
            </h2>
            <p className="mt-4 leading-relaxed text-primary-foreground/85">
              HUELLAS Gestión reúne animales, solicitudes, campañas y
              necesidades. Menos pendientes, más tiempo para cuidar.
            </p>
          </div>
          <ul className="flex flex-col justify-center gap-4">
            {[
              [ClipboardList, "Fichas de tus rescatados y solicitudes de adopción"],
              [Package, "Necesidades que tu comunidad puede ver"],
              [Megaphone, "Campañas y compromisos de apoyo, sin confundirlos con pagos"],
            ].map(([Icon, text]) => {
              const I = Icon as typeof Package;
              return (
                <li
                  key={text as string}
                  className="flex items-center gap-3 border-b border-primary-foreground/20 pb-4 last:border-0"
                >
                  <I className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {text as string}
                </li>
              );
            })}
            <li>
              <Link
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-card px-5 font-semibold text-primary hover:bg-secondary"
                href="/auth/login"
              >
                Entrar a mi albergue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
