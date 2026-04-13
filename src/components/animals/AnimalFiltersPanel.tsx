'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'

const SPECIES_OPTIONS = [
  { value: '', label: 'Todas las especies' },
  { value: 'dog', label: '🐶 Perros' },
  { value: 'cat', label: '🐱 Gatos' },
  { value: 'other', label: '🐾 Otros' },
]

const SIZE_OPTIONS = [
  { value: '', label: 'Cualquier tamaño' },
  { value: 'small', label: 'Pequeño' },
  { value: 'medium', label: 'Mediano' },
  { value: 'large', label: 'Grande' },
]

export default function AnimalFiltersPanel() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeSpecies = searchParams.get('species') ?? ''
  const activeSize = searchParams.get('size') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Filtro especie */}
      <div className="flex gap-1.5 flex-wrap">
        {SPECIES_OPTIONS.map(({ value, label }) => (
          <button
            key={value || 'all-species'}
            onClick={() => updateParam('species', value)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors',
              activeSpecies === value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-background'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="h-5 w-px bg-border hidden sm:block" />

      {/* Filtro tamaño */}
      <div className="flex gap-1.5 flex-wrap">
        {SIZE_OPTIONS.map(({ value, label }) => (
          <button
            key={value || 'all-sizes'}
            onClick={() => updateParam('size', value)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium border transition-colors',
              activeSize === value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-background'
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
