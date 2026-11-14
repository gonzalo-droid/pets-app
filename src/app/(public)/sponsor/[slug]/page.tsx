import type { Metadata } from "next";
import Image from "next/image";
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
  const photo = a.animal_photos.find((p) => p.is_cover) ?? a.animal_photos[0];
  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:py-10">
      <Link
        href={`/adopt/${slug}`}
        className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Volver a {a.name}
      </Link>

      <header className="flex items-center gap-4">
        <span className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[22px] bg-highlight">
          {photo ? (
            <Image src={photo.url} alt="" fill sizes="80px" className="object-cover" />
          ) : (
            <HeartHandshake className="absolute inset-0 m-auto h-8 w-8 text-primary" aria-hidden="true" />
          )}
        </span>
        <div>
          <h1 className="text-3xl leading-tight">Apadrina a {a.name}</h1>
          <p className="mt-1 leading-relaxed text-muted-foreground">
            Tu aporte mensual va a su alimento, salud y cuidados en el albergue.
          </p>
        </div>
      </header>

      <div className="mt-6">
        {actor ? (
          <SupportForm kind="sponsorship" slug={slug} title={`Apadrinamiento de ${a.name}`} />
        ) : (
          <LoginRequired returnTo={`/sponsor/${slug}`} action={`apadrinar a ${a.name}`} />
        )}
      </div>

      <details className="group mt-4 rounded-[24px] bg-secondary px-5 pb-4" open>
        <summary className="flex min-h-12 cursor-pointer items-center font-extrabold">
          Qué significa apadrinar
        </summary>
        <ul className="ml-5 list-disc space-y-2 leading-relaxed">
          <li>No te da la propiedad de {a.name} ni reemplaza la adopción.</li>
          <li>Si {a.name} es adoptado, deja de recibir apadrinamientos nuevos.</li>
          <li>Tu aporte nunca pasa a otro animal sin tu permiso.</li>
        </ul>
      </details>
    </div>
  );
}
