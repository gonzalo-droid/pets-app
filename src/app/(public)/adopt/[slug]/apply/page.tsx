import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { ArrowLeft } from 'lucide-react'
import AdoptionForm from './AdoptionForm'
import { getAnimalBySlug } from '@/lib/mock/animals'
import { SPECIES_LABELS } from '@/lib/utils'

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
  const animal = await getAnimalBySlug(slug)
  if (!animal) notFound()

  if (animal.status !== 'available') {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <p className="text-3xl mb-4">😔</p>
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

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href={`/adopt/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al perfil de {animal.name}
      </Link>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          Solicitar adopción de {animal.name}
        </h1>
        <p className="mt-2 text-muted-foreground text-sm">
          {SPECIES_LABELS[animal.species]} · El albergue revisará tu solicitud y se
          contactará contigo por teléfono si es aprobada.
        </p>
      </div>

      {/* Aviso */}
      <div className="mb-6 rounded-lg bg-accent/60 border border-primary/20 px-4 py-3 text-sm text-accent-foreground">
        <strong>¿Cómo funciona?</strong> Completa el formulario → el albergue revisa tu
        perfil → si hay compatibilidad te contactan por teléfono para coordinar el proceso.
        No hay ningún costo.
      </div>

      {/* Formulario (Client Component) */}
      <AdoptionForm animalSlug={slug} animalName={animal.name} />
    </div>
  )
}
