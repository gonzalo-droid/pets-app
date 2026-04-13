'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { AnimalPhoto } from '@/types'

interface PhotoGalleryProps {
  photos: AnimalPhoto[]
  animalName: string
}

export default function PhotoGallery({ photos, animalName }: PhotoGalleryProps) {
  const sorted = [...photos].sort((a, b) => a.order_index - b.order_index)
  const [active, setActive] = useState(0)

  if (sorted.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-muted text-6xl">
        🐾
      </div>
    )
  }

  const prev = () => setActive((i) => (i - 1 + sorted.length) % sorted.length)
  const next = () => setActive((i) => (i + 1) % sorted.length)

  return (
    <div className="flex flex-col gap-3">
      {/* Foto principal */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted">
        <Image
          src={sorted[active].url}
          alt={`${animalName} — foto ${active + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />

        {/* Controles de navegación */}
        {sorted.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow hover:bg-background transition-colors"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow hover:bg-background transition-colors"
              aria-label="Foto siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            {/* Indicador */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {sorted.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                  aria-label={`Ver foto ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Miniaturas */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((photo, i) => (
            <button
              key={photo.id}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                i === active ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={photo.url}
                alt={`Miniatura ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
