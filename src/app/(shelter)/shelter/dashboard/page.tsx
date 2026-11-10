import Link from "next/link";
import { shelterContext } from "@/lib/huellas/auth";
import { getAnimalsByShelter } from "@/lib/data/animals";
import { getCampaigns } from "@/lib/data/campaigns";
import { records } from "@/lib/huellas/records";
import { PawPrint, HeartHandshake, Package, ArrowUpRight } from "lucide-react";
export default async function Page() {
  const id = await shelterContext();
  const [animals, campaigns, needs, support] = await Promise.all([
    getAnimalsByShelter(id),
    getCampaigns({ shelter_id: id }),
    records("needs", id),
    records("support_intents", id),
  ]);
  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="uppercase tracking-widest text-xs text-emerald-700">
            HUELLAS Manager
          </p>
          <h1 className="text-3xl font-bold mt-2">Cada cuidado cuenta.</h1>
          <p className="mt-2 text-muted-foreground">
            Tu albergue, organizado. Tu comunidad, más cerca.
          </p>
        </div>
        <Link
          className="huellas-button self-center"
          href="/shelter/animals/new"
        >
          + Registrar animal
        </Link>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          ["Animales registrados", animals.length],
          ["Campañas activas", campaigns.filter((c) => c.is_active).length],
          ["Necesidades abiertas", needs.filter((n) => !n.fulfilled).length],
          [
            "Compromisos pendientes",
            support.filter((s) => s.status === "pending").length,
          ],
        ].map(([label, n]) => (
          <div className="rounded-2xl border bg-card p-5" key={label}>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-4xl font-bold mt-4">{n}</p>
          </div>
        ))}
      </div>
      <section className="rounded-3xl bg-emerald-950 text-white p-7 md:p-10">
        <HeartHandshake size={32} />
        <h2 className="mt-5 text-2xl font-bold">Más tiempo para cuidarlos.</h2>
        <p className="max-w-xl text-emerald-100 mt-3">
          Publica lo que necesitan, presenta a tus rescatados y conecta con
          personas que quieran acompañarlos.
        </p>
        <div className="flex flex-wrap gap-4 mt-6">
          <Link
            className="rounded-xl bg-white px-5 py-3 text-emerald-950 font-bold"
            href="/shelter/campaigns"
          >
            Crear una campaña ↗
          </Link>
          <Link
            className="rounded-xl border border-white/30 px-5 py-3"
            href={"/shelters/" + id}
          >
            Ver mi perfil público
          </Link>
        </div>
      </section>
      <div className="grid md:grid-cols-2 gap-5">
        {[
          [
            PawPrint,
            "Su próxima oportunidad",
            "Actualiza sus fichas y estado de adopción.",
            "/shelter/animals",
          ],
          [
            Package,
            "Lo que hace falta hoy",
            "Comparte necesidades concretas con la comunidad.",
            "/shelter/needs",
          ],
        ].map(([Icon, title, text, href]) => {
          const I = Icon as typeof PawPrint;
          return (
            <Link
              href={href as string}
              key={title as string}
              className="rounded-2xl border bg-card p-6"
            >
              <I className="text-emerald-700" />
              <h2 className="mt-4 font-bold text-xl">
                {title as string} <ArrowUpRight className="inline" size={18} />
              </h2>
              <p className="text-muted-foreground text-sm mt-2">
                {text as string}
              </p>
            </Link>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground">
        Los compromisos son intenciones de apoyo. No equivalen a donaciones
        cobradas ni a suscripciones activas.
      </p>
    </div>
  );
}
