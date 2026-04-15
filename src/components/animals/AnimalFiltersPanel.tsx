'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
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
  const activeQ = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(activeQ)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setQuery(activeQ) }, [activeQ])

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

  return (
    <div className="flex flex-col gap-4">
      {/* Búsqueda por texto */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar por nombre, raza o descripción..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { if (debounceRef.current) clearTimeout(debounceRef.current); applySearch(query) } }}
          className="w-full rounded-lg border border-input bg-background pl-9 pr-9 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Limpiar búsqueda"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

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
                  ? 'bg-brand-400 text-white border-brand-400'
                  : 'border-border text-muted-foreground hover:border-brand-400/40 hover:text-foreground bg-background'
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
                  ? 'bg-brand-400 text-white border-brand-400'
                  : 'border-border text-muted-foreground hover:border-brand-400/40 hover:text-foreground bg-background'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
