import Link from "next/link";
import {
  ArrowRight,
  Heart,
  HeartHandshake,
  House,
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
import HeroPets from "@/components/brand/HeroPets";

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
        <h2 className="text-3xl text-foreground sm:text-4xl">{title}</h2>
        <p className="mt-2 text-lg text-muted-foreground">{text}</p>
      </div>
      <Link
        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-1 text-sm font-extrabold text-primary hover:underline"
        href={href}
      >
        {linkLabel}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}

const WAYS_TO_HELP = [
  {
    href: "/donate",
    icon: Heart,
    title: "Apoyar una campaña",
    text: "Cuidados concretos: alimento, operaciones, refugio.",
    tile: "bg-support-soft",
    iconBox: "bg-support text-support-foreground",
  },
  {
    href: "/adopt",
    icon: HeartHandshake,
    title: "Apadrinar",
    text: "Acompaña cada mes el cuidado de un rescatado.",
    tile: "bg-secondary",
    iconBox: "bg-primary text-primary-foreground",
  },
  {
    href: "/needs",
    icon: Package,
    title: "Donar productos",
    text: "Mira lo que necesitan y coordina la entrega.",
    tile: "bg-highlight/60",
    iconBox: "bg-card text-foreground",
  },
  {
    href: "/adopt",
    icon: House,
    title: "Adoptar",
    text: "Dale un hogar para siempre.",
    tile: "bg-success-bg",
    iconBox: "bg-card text-primary",
  },
] as const;

export default async function Page() {
  // Solo se piden las tarjetas visibles; los totales salen de conteos reales.
  const [animalsPage, shelters, campaignsPage, campaignTotals, needsPage] =
    await Promise.all([
      getAnimalsPage({ status: "available" }, 1, 4),
      getShelters(),
      getCampaignsPage({ open_only: true }, 1, 3),
      getCampaignTotals({ is_active: true }),
      recordsPage("needs", { openNeeds: true }, 1, 3),
    ]);
  const animals = animalsPage.items;
  const campaigns = campaignsPage.items;
  const [featured, ...otherCampaigns] = campaigns;
  const needs = needsPage.items;
  const shelterName = (id: string) => shelters.find((s) => s.id === id)?.name;
  const stats = [
    [campaignTotals.open, campaignTotals.open === 1 ? "campaña abierta" : "campañas abiertas"],
    [shelters.length, shelters.length === 1 ? "albergue verificado" : "albergues verificados"],
    [animalsPage.total, animalsPage.total === 1 ? "animal busca hogar" : "animales buscan hogar"],
  ] as const;

  return (
    <div>
      {/* ── Hero: campañas y aportes primero ─────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 sm:pt-8 lg:px-8">
        <div className="relative grid overflow-hidden rounded-[36px] bg-support-soft lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10 flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <span className="self-start -rotate-2 rounded-full bg-highlight px-4 py-1.5 text-sm font-extrabold text-foreground">
              Apoya · Apadrina · Adopta
            </span>
            <h1 className="mt-5 text-[2.6rem] leading-[1.05] text-foreground sm:text-6xl">
              Cada aporte cuida <span className="text-support">una vida</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-foreground/80">
              Los albergues de tu región publican lo que necesitan para cuidar a
              sus rescatados mientras les buscan un hogar. Elige cómo ayudar.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="huellas-button huellas-button--support" href="/donate">
                <Heart className="h-5 w-5" aria-hidden="true" />
                Apoyar una campaña
              </Link>
              <Link className="huellas-button huellas-button--secondary" href="/shelters">
                Conocer albergues
              </Link>
            </div>
            {/* Cifras reales de la plataforma */}
            <ul className="mt-8 flex flex-wrap gap-2">
              {stats.map(([n, label]) => (
                <li
                  key={label}
                  className="rounded-2xl bg-card/80 px-4 py-2.5 text-sm text-muted-foreground"
                >
                  <strong className="font-display text-xl font-semibold text-foreground">{n}</strong>{" "}
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <HeroPets className="flex items-end justify-center px-6 pt-2 lg:pt-16" />
        </div>
      </section>

      {/* ── Campañas ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <SectionHeader
          title="Campañas que necesitan tu apoyo"
          text="Cada albergue publica sus campañas con un objetivo claro. Tu compromiso los ayuda a planificar."
          href="/donate"
          linkLabel="Ver todas las campañas"
        />
        {featured ? (
          <div className="grid items-start gap-6 lg:grid-cols-[1.25fr_1fr]">
            <CampaignCard campaign={featured} featured />
            <div className="grid gap-6">
              {otherCampaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          </div>
        ) : (
          <p className="rounded-[28px] border-2 border-dashed border-border bg-card p-8 text-center text-muted-foreground">
            Por ahora no hay campañas abiertas. Puedes ver las necesidades de los
            albergues o{" "}
            <Link href="/donate" className="font-extrabold text-primary hover:underline">
              el resultado de campañas anteriores
            </Link>
            .
          </p>
        )}
      </section>

      {/* ── Formas de ayudar ─────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20 lg:px-8">
        <h2 className="text-3xl text-foreground sm:text-4xl">¿Cómo quieres ayudar?</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WAYS_TO_HELP.map(({ href, icon: Icon, title, text, tile, iconBox }) => (
            <li key={title}>
              <Link
                href={href}
                className={`flex h-full flex-col gap-3 rounded-[28px] p-5 transition-transform duration-200 hover:-translate-y-0.5 ${tile}`}
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconBox}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="font-display text-xl font-semibold text-foreground">{title}</span>
                <span className="text-sm text-foreground/75">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Animales ─────────────────────────────────────────── */}
      <section className="border-y border-border bg-secondary/60">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeader
            title="Te están esperando"
            text="Cada albergue publica a sus rescatados. Conoce su historia, solicita su adopción o apadrínalos."
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
            <p className="rounded-[28px] border-2 border-dashed border-border bg-card p-8 text-center text-muted-foreground">
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
                className="group flex flex-col gap-3 rounded-[28px] border border-border bg-card p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-highlight text-foreground">
                  <Package className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="text-xl text-foreground">{n.title}</h3>
                <span className="self-start -rotate-1 rounded-full bg-support-soft px-3 py-1 text-sm font-extrabold text-foreground">
                  {n.quantity}
                </span>
                <p className="mt-auto text-sm text-muted-foreground">
                  {shelterName(n.shelter_id)} ·{" "}
                  <span className="font-extrabold text-primary group-hover:underline">
                    Coordinar entrega
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Para albergues: publicar ─────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8">
        <div className="grid gap-10 rounded-[36px] bg-primary p-8 text-primary-foreground sm:p-12 md:grid-cols-2">
          <div>
            <span className="inline-block -rotate-2 rounded-full bg-highlight px-4 py-1.5 text-sm font-extrabold text-foreground">
              Para albergues
            </span>
            <h2 className="mt-5 text-3xl sm:text-4xl">
              Publica tus campañas y encuentra a quienes quieren ayudarte
            </h2>
            <p className="mt-4 leading-relaxed text-primary-foreground/85">
              Desde tu panel publicas campañas, rescatados y necesidades, y
              revisas las solicitudes de adopción y los compromisos de apoyo.
            </p>
          </div>
          <ul className="flex flex-col justify-center gap-4">
            {[
              [Megaphone, "Campañas con meta y avance visible"],
              [PawPrint, "Fichas de tus rescatados para adopción y apadrinamiento"],
              [Package, "Necesidades que tu comunidad puede cubrir"],
            ].map(([Icon, text]) => {
              const I = Icon as typeof Package;
              return (
                <li
                  key={text as string}
                  className="flex items-center gap-3 border-b border-primary-foreground/20 pb-4 last:border-0"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary-foreground/15">
                    <I className="h-5 w-5" aria-hidden="true" />
                  </span>
                  {text as string}
                </li>
              );
            })}
            <li>
              <Link
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-highlight px-6 font-extrabold text-foreground hover:brightness-95"
                href="/auth/login"
              >
                Publicar con mi albergue
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
