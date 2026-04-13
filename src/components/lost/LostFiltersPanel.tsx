'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'

const TYPE_OPTIONS = [
  { value: '', label: 'Todos' },
  { value: 'lost', label: '🔍 Perdidos' },
  { value: 'found', label: '📍 Encontrados' },
]

export default function LostFiltersPanel() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeType = searchParams.get('type') ?? ''

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
    <div className="flex gap-2 flex-wrap">
      {TYPE_OPTIONS.map(({ value, label }) => (
        <button
          key={value || 'all'}
          onClick={() => updateParam('type', value)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium border transition-colors',
            activeType === value
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground bg-background'
          )}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
