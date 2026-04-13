import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { cn, formatAge, SPECIES_LABELS, STATUS_LABELS } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getAnimalsByShelter } from '@/lib/mock/animals'

export const metadata: Metadata = { title: 'Mis animales — Panel Albergue' }

const MOCK_SHELTER_ID = 'shelter-001'

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive'> = {
  available: 'default',
  in_process: 'secondary',
  adopted: 'secondary',
  lost: 'destructive',
  found: 'secondary',
  reunited: 'secondary',
}

export default async function ShelterAnimalsPage() {
  const animals = await getAnimalsByShelter(MOCK_SHELTER_ID)

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Mis animales</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{animals.length} publicados</p>
        </div>
        <Link href="/shelter/animals/new" className={cn(buttonVariants({ size: 'sm' }))}>
          <Plus className="h-4 w-4" />
          Publicar animal
        </Link>
      </div>

      {/* Tabla / lista */}
      {animals.length === 0 ? (
        <div className="flex flex-col items-center py-20 gap-3 text-center rounded-xl border border-dashed border-border">
          <span className="text-4xl">🐾</span>
          <p className="text-muted-foreground text-sm">Aún no has publicado ningún animal.</p>
          <Link href="/shelter/animals/new" className={cn(buttonVariants({ size: 'sm' }), 'mt-2')}>
            Publicar primer animal
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Animal</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Especie</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Edad</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Estado</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Salud</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {animals.map((animal) => {
                  const cover = animal.animal_photos.find((p) => p.is_cover) ?? animal.animal_photos[0]
                  return (
                    <tr key={animal.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted">
                            {cover ? (
                              <Image src={cover.url} alt={animal.name} fill className="object-cover" sizes="40px" />
                            ) : (
                              <span className="flex h-full items-center justify-center text-lg">🐾</span>
                            )}
                          </div>
                          <span className="font-medium text-foreground">{animal.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{SPECIES_LABELS[animal.species]}</td>
                      <td className="px-4 py-3 text-muted-foreground">{formatAge(animal.age_months)}</td>
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_VARIANT[animal.status] ?? 'secondary'} className="text-xs">
                          {STATUS_LABELS[animal.status] ?? animal.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {animal.is_vaccinated && <span className="text-xs bg-green-100 text-green-800 rounded px-1.5 py-0.5">Vac</span>}
                          {animal.is_neutered && <span className="text-xs bg-blue-100 text-blue-800 rounded px-1.5 py-0.5">Cas</span>}
                          {animal.is_microchipped && <span className="text-xs bg-purple-100 text-purple-800 rounded px-1.5 py-0.5">Mic</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/adopt/${animal.slug}`}
                          className="text-xs text-primary hover:underline"
                          target="_blank"
                        >
                          Ver público →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
