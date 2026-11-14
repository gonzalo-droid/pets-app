import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Pencil, Plus } from "lucide-react";
import { shelterContext } from "@/lib/huellas/auth";
import { getAnimalsByShelter } from "@/lib/data/animals";
import { getCampaigns } from "@/lib/data/campaigns";
import { records } from "@/lib/huellas/records";
import { CAMPAIGN_KIND_LABEL, campaignImage, isCampaignOpen } from "@/lib/huellas/domain";
import { getShelterById } from "@/lib/data/shelters";
import PawProgress, { PawIcon } from "@/components/campaigns/PawProgress";
import ShareCampaign from "@/components/campaigns/ShareCampaign";
import { shareMessage } from "@/components/campaigns/CampaignCard";
import { formatPEN } from "@/lib/utils";

const since = (iso: string) => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  return days <= 0 ? "hoy" : days === 1 ? "ayer" : `hace ${days} días`;
};

const thisWeek = (iso: string) => Date.now() - new Date(iso).getTime() <= 7 * 86_400_000;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ nuevo?: string }>;
}) {
  const id = await shelterContext();
  const { nuevo } = await searchParams;
  const [shelter, animals, campaigns, needs, support, requests] = await Promise.all([
    getShelterById(id),
    getAnimalsByShelter(id),
    getCampaigns({ shelter_id: id }),
    records("needs", id),
    records("support_intents", id),
    records("adoption_requests", id),
  ]);

  const open = campaigns.filter((c) => isCampaignOpen(c));
  const animalName = (aid: string | null) => animals.find((a) => a.id === aid)?.name;
  const campaignTitle = (cid: string | null) => campaigns.find((c) => c.id === cid)?.title;

  // Para hoy: solicitudes sin decidir y compromisos de la última semana.
  const today = [
    ...requests
      .filter((r) => r.status === "pending" || r.status === "reviewing")
      .map((r) => ({
        key: r.id,
        title: `Solicitud para adoptar a ${animalName(r.animal_id) ?? "un rescatado"}`,
        detail: `${r.status === "pending" ? "Sin revisar" : "En revisión"}, enviada ${since(r.created_at)}`,
        href: "/shelter/requests",
        action: "Revisar",
        at: r.created_at,
      })),
    ...support
      .filter((s) => s.status === "pending" && thisWeek(s.created_at))
      .map((s) => ({
        key: s.id,
        title: `Compromiso de ${formatPEN(Number(s.amount))}${s.kind === "sponsorship" ? " al mes" : ""}`,
        detail: `${s.kind === "sponsorship" ? `Apadrinamiento de ${animalName(s.animal_id) ?? "un rescatado"}` : campaignTitle(s.campaign_id) ?? "Campaña"}, ${since(s.created_at)}. Sin cobro.`,
        href: "/shelter/donations",
        action: "Ver",
        at: s.created_at,
      })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5);

  // Perfil completo: lo que da confianza a quien quiere apoyar.
  const checks = shelter
    ? [
        { ok: !!shelter.avatar_url, label: "Subir el logo o una foto de perfil" },
        { ok: !!shelter.banner_url, label: "Subir una foto de portada" },
        { ok: (shelter.long_description ?? shelter.description ?? "").length >= 40, label: "Contar la historia del albergue" },
        { ok: !!(shelter.whatsapp || shelter.phone), label: "Agregar un WhatsApp o teléfono" },
        { ok: !!shelter.address, label: "Agregar la dirección o zona" },
        { ok: !!(shelter.instagram || shelter.facebook || shelter.tiktok), label: "Agregar tus redes sociales" },
      ]
    : [];
  const done = checks.filter((c) => c.ok).length;
  const openNeeds = needs.filter((n) => !n.fulfilled).length;

  return (
    <div className="max-w-4xl space-y-10">
      {shelter && !shelter.is_verified && (
        <section className="rounded-[24px] bg-warning-bg p-5 text-warning-fg sm:p-6" aria-labelledby="pendiente">
          <h2 id="pendiente" className="text-xl">
            {nuevo ? "¡Albergue registrado! Está pendiente de verificación" : "Tu albergue está pendiente de verificación"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            Todavía no aparece en el portal. Mientras tanto, completa tu perfil con fotos y
            contacto, y prepara tus campañas y rescatados: se publicarán cuando la administración
            de HUELLAS verifique tu albergue.
          </p>
        </section>
      )}

      {/* Tus campañas: lo principal */}
      <section aria-labelledby="campanas">
        <div className="flex items-center justify-between gap-3">
          <h1 id="campanas" className="text-3xl sm:text-4xl">Tus campañas</h1>
          <Link href="/shelter/campaigns/new" className="huellas-button huellas-button--support shrink-0 px-4">
            <Plus className="h-5 w-5" aria-hidden="true" />
            Nueva
          </Link>
        </div>
        {open.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {open.slice(0, 3).map((c) => {
              const photo = campaignImage(c);
              return (
                <li key={c.id} className="space-y-3 rounded-[24px] bg-card p-4">
                  <div className="flex items-center gap-3">
                    <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-support-soft">
                      {photo ? (
                        <Image src={photo} alt="" fill sizes="56px" className="object-cover" />
                      ) : (
                        <PawIcon className="absolute inset-0 m-auto h-7 w-7 text-support/30" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-extrabold text-primary">{CAMPAIGN_KIND_LABEL[c.kind]}</p>
                      <p className="font-extrabold leading-snug">{c.title}</p>
                    </div>
                  </div>
                  {c.kind !== "event" && (
                    <PawProgress current={c.current_amount} goal={c.goal_amount} size="sm" />
                  )}
                  <div className="flex flex-wrap gap-2">
                    <ShareCampaign slug={c.slug} title={c.title} message={shareMessage(c)} tone="primary" className="flex-1" />
                    <Link href={`/shelter/campaigns/${c.id}/edit`} className="huellas-button huellas-button--secondary flex-1">
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                      Editar
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="mt-4 rounded-[24px] border-2 border-dashed border-input bg-card p-6 text-center">
            <p className="font-bold">No tienes campañas abiertas</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Publica un caso, un fondo o un evento y compártelo por WhatsApp.
            </p>
          </div>
        )}
        {campaigns.length > 0 && (
          <Link href="/shelter/campaigns" className="mt-3 inline-flex min-h-11 items-center gap-1.5 font-extrabold text-primary hover:underline">
            Ver todas tus campañas ({campaigns.length})
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
      </section>

      {/* Para hoy */}
      <section aria-labelledby="hoy">
        <h2 id="hoy" className="text-2xl">Para hoy</h2>
        {today.length > 0 ? (
          <ul className="mt-3 divide-y divide-border overflow-hidden rounded-[24px] bg-card">
            {today.map((t) => (
              <li key={t.key} className="flex items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold leading-snug">{t.title}</p>
                  <p className="text-sm text-muted-foreground">{t.detail}</p>
                </div>
                <Link href={t.href} className="huellas-button huellas-button--secondary shrink-0 px-4">
                  {t.action}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-[24px] bg-card p-5 text-muted-foreground">
            Todo al día: no hay solicitudes ni compromisos nuevos esta semana.
          </p>
        )}
      </section>

      {/* Rescatados */}
      <section aria-labelledby="rescatados">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="rescatados" className="text-2xl">Tus rescatados ({animals.length})</h2>
          <Link href="/shelter/animals/new" className="inline-flex min-h-11 items-center gap-1.5 font-extrabold text-primary hover:underline">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Registrar animal
          </Link>
        </div>
        <div className="mt-3 flex flex-wrap gap-3">
          {animals.slice(0, 5).map((a) => {
            const p = a.animal_photos.find((p) => p.is_cover) ?? a.animal_photos[0];
            return (
              <Link key={a.id} href={`/shelter/animals/${a.id}/edit`} className="group flex w-20 flex-col items-center gap-1 text-center">
                <span className="relative h-20 w-20 overflow-hidden rounded-[20px] bg-highlight">
                  {p ? <Image src={p.url} alt="" fill sizes="80px" className="object-cover" /> : <PawIcon className="absolute inset-0 m-auto h-8 w-8 text-primary/30" />}
                </span>
                <span className="w-full truncate text-sm font-bold group-hover:underline">{a.name}</span>
              </Link>
            );
          })}
          {animals.length > 5 && (
            <Link href="/shelter/animals" className="flex h-20 w-20 items-center justify-center rounded-[20px] border-2 border-dashed border-input font-extrabold hover:bg-secondary">
              +{animals.length - 5}
            </Link>
          )}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {openNeeds} necesidad{openNeeds === 1 ? "" : "es"} abierta{openNeeds === 1 ? "" : "s"}.{" "}
          <Link href="/shelter/needs" className="font-bold text-primary underline">Publicar o revisar necesidades</Link>
        </p>
      </section>

      {/* Perfil completo */}
      {checks.length > 0 && done < checks.length && (
        <section aria-labelledby="perfil" className="rounded-[24px] bg-secondary p-5 sm:p-6">
          <h2 id="perfil" className="text-2xl">
            Tu perfil está al {done} de {checks.length}
          </h2>
          <p className="mt-1 text-sm leading-relaxed">
            Un perfil completo da confianza a quien quiere apoyarte. Te falta:
          </p>
          <ul className="mt-3 space-y-1">
            {checks
              .filter((c) => !c.ok)
              .map((c) => (
                <li key={c.label}>
                  <Link href="/shelter/settings" className="inline-flex min-h-11 items-center gap-2 font-bold text-primary underline">
                    {c.label}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      )}

      <p className="text-sm text-muted-foreground">
        Los compromisos son intenciones de apoyo: no equivalen a donaciones cobradas ni a
        suscripciones activas.{" "}
        <Link href={`/shelters/${id}`} className="font-bold text-primary underline">
          Ver mi perfil público
        </Link>
      </p>
    </div>
  );
}
