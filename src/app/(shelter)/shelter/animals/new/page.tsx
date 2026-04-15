import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import NewAnimalForm from './NewAnimalForm'

export const metadata: Metadata = { title: 'Publicar animal — Panel Albergue' }

export default function NewAnimalPage() {
  return (
    <div className="max-w-2xl">
      <Link
        href="/shelter/animals"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand-400 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis animales
      </Link>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-foreground">Publicar nuevo animal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          El animal aparecerá en el feed público de adopciones inmediatamente.
        </p>
      </div>
      <NewAnimalForm />
    </div>
  )
}
