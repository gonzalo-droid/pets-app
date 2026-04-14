import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationNavProps {
  currentPage: number
  totalPages: number
  /** Query string actual SIN el param page (ej: "species=dog&q=rocky") */
  paramString: string
  pathname: string
}

function buildHref(pathname: string, paramString: string, page: number) {
  const params = new URLSearchParams(paramString)
  if (page > 1) {
    params.set('page', String(page))
  } else {
    params.delete('page')
  }
  const qs = params.toString()
  return qs ? `${pathname}?${qs}` : pathname
}

export default function PaginationNav({
  currentPage,
  totalPages,
  paramString,
  pathname,
}: PaginationNavProps) {
  if (totalPages <= 1) return null

  // Genera rango de páginas con elipsis cuando hay muchas
  const pages: (number | 'ellipsis')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('ellipsis')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
  }

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1 mt-10">
      {/* Anterior */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(pathname, paramString, currentPage - 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground/40 cursor-not-allowed">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Páginas */}
      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="flex h-9 w-9 items-center justify-center text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(pathname, paramString, p)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
              p === currentPage
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-foreground hover:border-primary/40 hover:text-primary'
            )}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}

      {/* Siguiente */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(pathname, paramString, currentPage + 1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
          aria-label="Página siguiente"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground/40 cursor-not-allowed">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  )
}
