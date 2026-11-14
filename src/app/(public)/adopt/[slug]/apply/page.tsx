import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import AdoptionForm from './AdoptionForm'
import { getAnimalBySlug } from '@/lib/data/animals'
import { SPECIES_LABELS } from '@/lib/utils'
import LoginRequired from '@/components/huellas/LoginRequired'
import { currentActor } from '@/lib/huellas/auth'
import { getOwnProfile } from '@/lib/huellas/profile'

interface ApplyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ApplyPageProps): Promise<Metadata> {
  const { slug } = await params
  const animal = await getAnimalBySlug(slug)
  if (!animal) return { title: 'Animal no encontrado' }
  return {
    title: `Solicitar adopción de ${animal.name}`,
  }
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { slug } = await params
  const [animal, actor] = await Promise.all([getAnimalBySlug(slug), currentActor()])
  if (!animal) notFound()

  if (animal.status !== 'available') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <h1 className="text-xl font-bold text-foreground">Este animal ya no está disponible</h1>
        <p className="mt-2 text-muted-foreground">
          {animal.name} ya tiene un proceso de adopción en curso o fue adoptado.
        </p>
        <Link href="/adopt" className="mt-6 inline-flex text-sm text-primary hover:underline">
          ← Ver otros animales
        </Link>
      </div>
    )
  }

  const photo = animal.animal_photos.find((p) => p.is_cover) ?? animal.animal_photos[0]
  const STEPS = [
    ['Enviada', 'La ves en Mi espacio.'],
    ['En revisión', 'El albergue lee tu solicitud.'],
    ['Aprobada', 'Te llaman para conocerse.'],
    ['Completada', `${animal.name} llega a tu casa.`],
  ]

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6 sm:py-10">
      <Link
        href={`/adopt/${slug}`}
        className="mb-4 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {animal.name}
      </Link>

      <header className="mb-6 flex items-center gap-4">
        <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-[20px] bg-highlight">
          {photo && <Image src={photo.url} alt="" fill sizes="64px" className="object-cover" />}
        </span>
        <div>
          <h1 className="text-3xl leading-tight text-foreground">Quiero adoptar a {animal.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {SPECIES_LABELS[animal.species]}. La revisa el albergue y no tiene costo.
          </p>
        </div>
      </header>

      {actor ? (
        <AdoptionForm
          animalSlug={slug}
          animalName={animal.name}
          defaultPhone={(await getOwnProfile(actor)).phone ?? ''}
        />
      ) : (
        <LoginRequired
          returnTo={`/adopt/${slug}/apply`}
          action={`solicitar la adopción de ${animal.name}`}
        />
      )}

      <section aria-labelledby="despues" className="mt-8 rounded-[24px] bg-secondary p-5">
        <h2 id="despues" className="font-body text-base font-extrabold">Qué pasa después</h2>
        <ol className="mt-3 flex flex-col gap-3">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-primary-foreground">
                {i + 1}
              </span>
              <span className="leading-snug">
                <strong>{title}.</strong> {text}
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
