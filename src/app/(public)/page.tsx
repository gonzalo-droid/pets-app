import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  ShieldCheck,
  HeartHandshake,
  PawPrint,
} from "lucide-react";
import { getAnimalsPage } from "@/lib/data/animals";
import { getShelters } from "@/lib/data/shelters";
import { getCampaignsPage } from "@/lib/data/campaigns";
import AnimalCard from "@/components/animals/AnimalCard";
import CampaignCard from "@/components/campaigns/CampaignCard";
export default async function Page() {
  // Solo se piden las tarjetas visibles; el total sale del conteo de la consulta.
  const [animalsPage, shelters, campaignsPage] = await Promise.all([
    getAnimalsPage({ status: "available" }, 1, 4),
    getShelters(),
    getCampaignsPage({ is_active: true }, 1, 3),
  ]);
  const animals = animalsPage.items;
  const campaigns = campaignsPage.items;
  return (
    <div>
      <section className="mx-auto max-w-7xl px-5 py-8 md:py-12">
        <div className="grid lg:grid-cols-2 overflow-hidden rounded-[2rem] border bg-cream text-foreground">
          <div className="p-7 sm:p-12 lg:p-14 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[.18em] font-bold text-primary flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Una comunidad. Muchas segundas oportunidades.
            </span>
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-[1.06] mt-7">
              Tu ayuda deja
              <br />
              una <span className="text-primary">huella</span>
              <br />
              para siempre.
            </h1>
            <p className="text-base leading-relaxed mt-6 max-w-md text-muted-foreground">
              Detrás de cada rescate hay alguien que no se rindió. Conecta con
              albergues, apadrina una vida y ayúdalos a seguir cuidando.
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link className="huellas-button" href="/shelters">
                Encuentra un albergue <ArrowUpRight size={18} />
              </Link>
              <Link
                className="huellas-button huellas-button--accent text-sm"
                href="/adopt"
              >
                Quiero apadrinar ♡
              </Link>
            </div>
            <div className="flex items-center gap-3 mt-8 text-xs text-muted-foreground">
              <ShieldCheck size={20} />
              Albergues verificados · Apoyo con transparencia
            </div>
          </div>
          <div className="relative min-h-[350px] lg:min-h-[610px]">
            <Image
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200&q=85"
              alt="Un perro rescatado al aire libre"
              fill
              priority
              sizes="(min-width:1024px) 50vw,100vw"
              className="object-cover"
            />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-card/95 text-card-foreground p-5 shadow-lg flex gap-4 items-center">
              <div className="bg-accent text-accent-foreground p-3 rounded-xl">
                <PawPrint size={24} />
              </div>
              <div>
                <p className="font-bold">Una nueva historia empieza contigo.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Adopta, apadrina o comparte. Todo suma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-5 py-5 grid grid-cols-3 gap-4 text-center border-b pb-10">
        {[
          [shelters.length, "albergues en la comunidad"],
          [animalsPage.total, "vidas listas para un hogar"],
          [campaignsPage.total, "campañas que puedes apoyar"],
        ].map(([n, t]) => (
          <div key={t}>
            <p className="text-3xl font-bold">{n}</p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">{t}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-bold">
              Historias por escribir
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              Alguien está esperando por ti.
            </h2>
            <p className="text-muted-foreground mt-3">
              Conócelos. Tal vez tu próxima gran amistad empieza aquí.
            </p>
          </div>
          <Link className="text-sm font-bold underline" href="/adopt">
            Conocer a todos ↗
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {animals.map((a) => (
            <div key={a.id}>
              <AnimalCard
                animal={a}
                shelterName={shelters.find((s) => s.id === a.shelter_id)?.name}
              />
              <Link
                className="block text-center py-3 text-sm font-bold text-primary"
                href={"/sponsor/" + a.slug}
              >
                Apadrinar a {a.name} ♡
              </Link>
            </div>
          ))}
        </div>
        {!animals.length && <p>Pronto compartiremos nuevas historias.</p>}
      </section>
      <section className="bg-muted/60 border-y">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-7">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-bold">
                Un poquito de ti, mucho para ellos
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                Ayuda donde más se necesita.
              </h2>
            </div>
            <Link className="text-sm underline font-bold" href="/donate">
              Todas las campañas ↗
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {campaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-5 py-14">
        <div className="rounded-3xl bg-forest text-white p-8 sm:p-12 grid md:grid-cols-2 gap-10">
          <div>
            <HeartHandshake size={36} />
            <h2 className="text-3xl font-bold mt-5">
              Ellos cuidan de sus vidas.
              <br />
              Nosotros, de su misión.
            </h2>
            <p className="mt-4 text-white/80 leading-relaxed">
              HUELLAS Manager reúne animales, necesidades y campañas en un solo
              espacio. Menos pendientes, más tiempo para cuidar.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-5">
            <p className="border-b border-white/20 pb-4">
              01 &nbsp; Organiza las fichas de tus rescatados
            </p>
            <p className="border-b border-white/20 pb-4">
              02 &nbsp; Comparte necesidades con tu comunidad
            </p>
            <p>03 &nbsp; Acompaña cada intención de apoyo</p>
            <Link
              className="self-start rounded-xl bg-white px-5 py-3 font-bold text-forest"
              href="/auth/login"
            >
              Entrar a mi albergue ↗
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
