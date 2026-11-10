'use client'

import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

const noopSubscribe = () => () => {}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  // false en el servidor y true en el cliente: evita el hydration mismatch.
  const mounted = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )

  if (!mounted) {
    return <div className={cn('h-9 w-9 rounded-md', className)} />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
        className
      )}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  )
}
