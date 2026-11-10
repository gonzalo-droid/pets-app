'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const SPECIES_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'dog', label: 'Perros' },
  { value: 'cat', label: 'Gatos' },
  { value: 'other', label: 'Otros' },
]

const SIZE_OPTIONS = [
  { value: '', label: 'Cualquiera' },
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
  const activeQ = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(activeQ)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Si la URL cambia (atrás/adelante, limpiar filtros), sincroniza el campo.
  const [syncedQ, setSyncedQ] = useState(activeQ)
  if (activeQ !== syncedQ) {
    setSyncedQ(activeQ)
    setQuery(activeQ)
  }

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) { params.set(key, value) } else { params.delete(key) }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const applySearch = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value.trim()) { params.set('q', value.trim()) } else { params.delete('q') }
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams]
  )

  const handleQueryChange = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => applySearch(value), 300)
  }

  const handleClear = () => {
    setQuery('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    applySearch('')
  }

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current) }, [])

  const chip = (on: boolean) =>
    cn(
      'inline-flex min-h-11 items-center rounded-full border-2 px-4 text-sm font-extrabold transition-colors',
      on
        ? 'border-primary bg-primary text-primary-foreground'
        : 'border-border bg-card text-foreground hover:border-primary/50',
    )

  return (
    <div className="flex flex-col gap-4">
      {/* Búsqueda por texto */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <input
          type="search"
          aria-label="Buscar por nombre, raza o descripción"
          placeholder="Nombre, raza o descripción"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { if (debounceRef.current) clearTimeout(debounceRef.current); applySearch(query) } }}
          className="min-h-12 w-full rounded-full border border-input bg-background pl-10 pr-11 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
        <div role="group" aria-labelledby="f-especie">
          <p id="f-especie" className="mb-2 text-sm font-extrabold">Especie</p>
          <div className="flex flex-wrap gap-2">
            {SPECIES_OPTIONS.map(({ value, label }) => (
              <button
                key={value || 'all-species'}
                aria-pressed={activeSpecies === value}
                onClick={() => updateParam('species', value)}
                className={chip(activeSpecies === value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div role="group" aria-labelledby="f-tamano">
          <p id="f-tamano" className="mb-2 text-sm font-extrabold">Tamaño</p>
          <div className="flex flex-wrap gap-2">
            {SIZE_OPTIONS.map(({ value, label }) => (
              <button
                key={value || 'all-sizes'}
                aria-pressed={activeSize === value}
                onClick={() => updateParam('size', value)}
                className={chip(activeSize === value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
