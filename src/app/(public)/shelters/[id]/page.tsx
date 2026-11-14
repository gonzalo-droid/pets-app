import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AtSign, Heart, Mail, MapPin, MessageCircle, Package, Phone } from "lucide-react";
import { getShelterWithPhotos } from "@/lib/data/shelters";
import { getAnimalsByShelter } from "@/lib/data/animals";
import { getCampaigns } from "@/lib/data/campaigns";
import { records } from "@/lib/huellas/records";
import { isCampaignOpen } from "@/lib/huellas/domain";
import { DISTRICT_LABEL } from "@/lib/ubigeo";
import AnimalCard from "@/components/animals/AnimalCard";
import CampaignCard from "@/components/campaigns/CampaignCard";
import { PawIcon } from "@/components/campaigns/PawProgress";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const shelter = await getShelterWithPhotos(id);
  if (!shelter) return { title: "Albergue no encontrado" };
  return {
    title: shelter.name,
    description: shelter.description ?? undefined,
  };
}

const TABS = [
  { id: "campanas", label: "Campañas" },
  { id: "animales", label: "Animales" },
  { id: "necesidades", label: "Necesidades" },
] as const;

export default async function ShelterPublicPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab: rawTab } = await searchParams;
  const tab = TABS.some((t) => t.id === rawTab) ? rawTab! : "campanas";
  const [shelter, animals, campaigns, needs] = await Promise.all([
    getShelterWithPhotos(id),
    getAnimalsByShelter(id),
    getCampaigns({ shelter_id: id }),
    records("needs", id),
  ]);
  if (!shelter) notFound();

  const place = DISTRICT_LABEL[shelter.ubigeo] ?? "Lambayeque";
  const openCampaigns = campaigns.filter((c) => isCampaignOpen(c));
  const shownCampaigns = [...openCampaigns, ...campaigns.filter((c) => !isCampaignOpen(c))];
  const available = animals.filter((a) => a.status === "available" || a.status === "in_process");
  const openNeeds = needs.filter((n) => !n.fulfilled);
  const counts: Record<string, number> = {
    campanas: openCampaigns.length,
    animales: available.length,
    necesidades: openNeeds.length,
  };

  // Solo los medios que el albergue publicó en su perfil.
  const contacts = [
    shelter.whatsapp && { href: `https://wa.me/51${shelter.whatsapp}`, icon: MessageCircle, label: "WhatsApp" },
    shelter.phone && { href: `tel:${shelter.phone}`, icon: Phone, label: shelter.phone },
    shelter.email && { href: `mailto:${shelter.email}`, icon: Mail, label: shelter.email },
    shelter.instagram && { href: `https://instagram.com/${shelter.instagram}`, icon: AtSign, label: `@${shelter.instagram}` },
    shelter.facebook && { href: `https://facebook.com/${shelter.facebook}`, icon: AtSign, label: shelter.facebook },
  ].filter(Boolean) as { href: string; icon: typeof Phone; label: string }[];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Link
        href="/shelters"
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a albergues
      </Link>

      {/* Portada + identidad */}
      <section className="overflow-hidden rounded-[32px] border border-border bg-card">
        <div className="relative h-40 bg-support-soft sm:h-56">
          {shelter.banner_url && (
            <Image src={shelter.banner_url} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 1024px" />
          )}
        </div>
        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-11 flex items-end justify-between gap-3">
            {shelter.avatar_url ? (
              <Image
                src={shelter.avatar_url}
                unoptimized={shelter.avatar_url.includes("api.dicebear.com")}
                alt=""
                width={88}
                height={88}
                className="h-[88px] w-[88px] rounded-[26px] border-[5px] border-card bg-secondary object-cover"
              />
            ) : (
              <span className="flex h-[88px] w-[88px] items-center justify-center rounded-[26px] border-[5px] border-card bg-secondary text-primary">
                <PawIcon className="h-10 w-10" />
              </span>
            )}
            {shelter.is_verified && (
              <span
                className="mb-1 rounded-full bg-highlight px-3 py-1 text-sm font-extrabold"
                title="HUELLAS revisó la identidad del albergue. No garantiza cada una de sus actuaciones."
              >
                Verificado
              </span>
            )}
          </div>
          <h1 className="mt-4 text-4xl leading-tight text-foreground">{shelter.name}</h1>
          <p className="mt-1 flex items-center gap-1.5 font-bold text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            {place}
          </p>
          {(shelter.long_description || shelter.description) && (
            <p className="mt-4 max-w-3xl leading-relaxed text-foreground/80">
              {shelter.long_description ?? shelter.description}
            </p>
          )}
          {openCampaigns.length > 0 && (
            <Link href="?tab=campanas#contenido" className="huellas-button huellas-button--support mt-6">
              <Heart className="h-5 w-5" aria-hidden="true" />
              Apoyar a este albergue
            </Link>
          )}
        </div>
      </section>

      {/* Pestañas */}
      <nav
        id="contenido"
        aria-label="Contenido del albergue"
        className="mt-8 flex gap-1 rounded-full bg-muted p-1.5"
      >
        {TABS.map((t) => (
          <Link
            key={t.id}
            href={`?tab=${t.id}#contenido`}
            scroll={false}
            aria-current={tab === t.id ? "page" : undefined}
            className={cn(
              "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full px-2 text-sm font-extrabold transition-colors",
              tab === t.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-card",
            )}
          >
            {t.label}
            <span className={cn("rounded-full px-1.5 text-xs", tab === t.id ? "bg-white/20" : "bg-card")}>
              {counts[t.id]}
            </span>
          </Link>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "campanas" &&
          (shownCampaigns.length ? (
            <div className="grid gap-5 md:grid-cols-2">
              {shownCampaigns.map((c) => (
                <CampaignCard key={c.id} campaign={c} />
              ))}
            </div>
          ) : (
            <Empty text="Este albergue aún no publicó campañas." />
          ))}

        {tab === "animales" &&
          (available.length ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {available.map((a) => (
                <AnimalCard key={a.id} animal={a} shelterName={shelter.name} />
              ))}
            </div>
          ) : (
            <Empty text="Por ahora no hay animales publicados." />
          ))}

        {tab === "necesidades" &&
          (openNeeds.length ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {openNeeds.map((n) => (
                <li key={n.id} className="flex gap-4 rounded-[24px] bg-warning-bg p-5">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-card text-foreground">
                    <Package className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <span className="rounded-full bg-card px-3 py-1 text-xs font-extrabold">{n.quantity}</span>
                    <h3 className="mt-2 text-xl">{n.title}</h3>
                    <p className="mt-1 text-sm text-foreground/80">{n.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <Empty text="Este albergue no tiene necesidades abiertas." />
          ))}
      </div>

      {/* Galería */}
      {shelter.shelter_photos.length > 0 && (
        <section className="mt-10">
          <h2 className="text-2xl">Así es el albergue</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {shelter.shelter_photos.map((photo) => (
              <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-muted">
                <Image src={photo.url} alt={`Foto de ${shelter.name}`} fill className="object-cover" sizes="(max-width: 640px) 50vw, 33vw" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contacto autorizado */}
      <section className="mt-10 rounded-[28px] border border-border bg-card p-6">
        <h2 className="text-2xl">Contacto</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Medios que el albergue publicó. Escríbeles para coordinar entregas o visitas.
        </p>
        {contacts.length ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {contacts.map(({ href, icon: Icon, label }) => (
              <li key={href}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-primary px-4 text-sm font-extrabold text-primary hover:bg-secondary"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm">Este albergue aún no publicó medios de contacto.</p>
        )}
        {shelter.address && (
          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {shelter.address}
          </p>
        )}
      </section>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-[24px] border-2 border-dashed border-border bg-card p-8 text-center text-muted-foreground">
      {text}
    </p>
  );
}
