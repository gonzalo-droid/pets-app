'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

export default function ShelterSearchInput() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeQ = searchParams.get('q') ?? ''
  const [query, setQuery] = useState(activeQ)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Si la URL cambia (atrás/adelante, limpiar filtros), sincroniza el campo.
  const [syncedQ, setSyncedQ] = useState(activeQ)
  if (activeQ !== syncedQ) {
    setSyncedQ(activeQ)
    setQuery(activeQ)
  }

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
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <input
        type="search"
        aria-label="Buscar albergue por nombre, descripción o dirección"
        placeholder="Nombre o ciudad"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') { if (debounceRef.current) clearTimeout(debounceRef.current); applySearch(query) } }}
        className="min-h-12 w-full rounded-full border border-input bg-card pl-10 pr-11 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
  )
}
