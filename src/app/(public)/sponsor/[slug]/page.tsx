import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, HeartHandshake } from "lucide-react";
import { getAnimalBySlug } from "@/lib/data/animals";
import { SupportForm } from "@/components/huellas/Forms";
import LoginRequired from "@/components/huellas/LoginRequired";
import { currentActor } from "@/lib/huellas/auth";

export const metadata: Metadata = { title: "Apadrinar" };

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [a, actor] = await Promise.all([getAnimalBySlug(slug), currentActor()]);
  // Un animal adoptado no recibe nuevos apadrinamientos.
  if (!a || a.status === "adopted") notFound();
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      <Link
        href={`/adopt/${slug}`}
        className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a {a.name}
      </Link>

      <section className="rounded-[28px] bg-secondary p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card text-primary">
          <HeartHandshake className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-3xl">Apadrina a {a.name}</h1>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed">
          <li>
            <strong>Tu aporte es para {a.name}:</strong> se destina a su alimento, salud y
            cuidados en el albergue.
          </li>
          <li>Apadrinar no te da la propiedad del animal ni reemplaza la adopción.</li>
          <li>
            Si {a.name} es adoptado, no recibirá nuevos apadrinamientos. Tu compromiso nunca se
            pasa a otro animal sin tu consentimiento.
          </li>
          <li>Por ahora es un compromiso mensual sin cobro ni débito automático.</li>
        </ul>
      </section>

      <div className="mt-6">
        {actor ? (
          <SupportForm kind="sponsorship" slug={slug} title={`Apadrinamiento de ${a.name}`} />
        ) : (
          <LoginRequired returnTo={`/sponsor/${slug}`} action={`apadrinar a ${a.name}`} />
        )}
      </div>
    </div>
  );
}
