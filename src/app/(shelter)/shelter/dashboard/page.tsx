import Link from "next/link";
import { ArrowRight, Dog, HeartHandshake, Megaphone, Package, Wallet } from "lucide-react";
import { shelterContext } from "@/lib/huellas/auth";
import { getAnimalsByShelter } from "@/lib/data/animals";
import { getCampaigns } from "@/lib/data/campaigns";
import { records } from "@/lib/huellas/records";
import { isCampaignOpen } from "@/lib/huellas/domain";
import { getShelterById } from "@/lib/data/shelters";

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

  // Cada indicador lleva a la vista donde se gestiona.
  const indicators = [
    { label: "Campañas abiertas", value: campaigns.filter((c) => isCampaignOpen(c)).length, href: "/shelter/campaigns", icon: Megaphone, tone: "bg-support-soft" },
    { label: "Compromisos pendientes", value: support.filter((s) => s.status === "pending").length, href: "/shelter/donations", icon: Wallet, tone: "bg-highlight/60" },
    { label: "Solicitudes por revisar", value: requests.filter((r) => r.status === "pending" || r.status === "reviewing").length, href: "/shelter/requests", icon: HeartHandshake, tone: "bg-success-bg" },
    { label: "Animales publicados", value: animals.length, href: "/shelter/animals", icon: Dog, tone: "bg-secondary" },
    { label: "Necesidades abiertas", value: needs.filter((n) => !n.fulfilled).length, href: "/shelter/needs", icon: Package, tone: "bg-muted" },
  ];

  return (
    <div className="max-w-6xl space-y-10">
      {shelter && !shelter.is_verified && (
        <section className="rounded-[28px] bg-warning-bg p-5 text-warning-fg sm:p-6" aria-labelledby="pendiente">
          <h2 id="pendiente" className="text-xl">
            {nuevo ? "¡Albergue registrado! Está pendiente de verificación" : "Tu albergue está pendiente de verificación"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed">
            Todavía no aparece en el portal. Mientras tanto, completa tu perfil con fotos y
            contacto, y registra a tus rescatados y campañas: se publicarán cuando la administración
            de HUELLAS verifique tu albergue.
          </p>
          <Link href="/shelter/settings" className="mt-3 inline-flex min-h-11 items-center font-extrabold underline">
            Completar el perfil del albergue
          </Link>
        </section>
      )}
      <div>
        <h1 className="text-3xl sm:text-4xl">Cada cuidado cuenta</h1>
        <p className="mt-2 text-muted-foreground">
          Publica lo que tu albergue necesita y revisa quién quiere ayudar.
        </p>
      </div>

      {/* Publicar: lo más frecuente, siempre a mano */}
      <section aria-labelledby="publicar">
        <h2 id="publicar" className="text-xl">Publicar</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Link href="/shelter/campaigns" className="huellas-button huellas-button--support min-h-14 text-base">
            <Megaphone className="h-5 w-5" aria-hidden="true" />
            Nueva campaña
          </Link>
          <Link href="/shelter/animals/new" className="huellas-button min-h-14 text-base">
            <Dog className="h-5 w-5" aria-hidden="true" />
            Registrar animal
          </Link>
          <Link href="/shelter/needs" className="huellas-button huellas-button--secondary min-h-14 text-base">
            <Package className="h-5 w-5" aria-hidden="true" />
            Publicar necesidad
          </Link>
        </div>
      </section>

      <section aria-labelledby="resumen">
        <h2 id="resumen" className="text-xl">Resumen</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {indicators.map(({ label, value, href, icon: Icon, tone }) => (
            <li key={label}>
              <Link
                href={href}
                className={`flex h-full items-center gap-4 rounded-[28px] p-5 transition-transform duration-200 hover:-translate-y-0.5 ${tone}`}
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-primary">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-3xl font-semibold leading-none">{value}</span>
                  <span className="mt-1 block text-sm font-bold text-foreground/75">{label}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-foreground/60" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-2xl bg-warning-bg px-4 py-3 text-sm text-warning-fg">
        Los compromisos son intenciones de apoyo. No equivalen a donaciones
        cobradas ni a suscripciones activas.
      </p>
      <Link href={`/shelters/${id}`} className="inline-flex items-center gap-1.5 text-sm font-extrabold text-primary hover:underline">
        Ver mi perfil público
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </div>
  );
}
