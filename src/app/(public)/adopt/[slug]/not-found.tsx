import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function AnimalNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center gap-4">
      <span className="text-6xl">🐾</span>
      <h1 className="text-2xl font-bold text-foreground">Animal no encontrado</h1>
      <p className="text-muted-foreground max-w-sm text-sm">
        Es posible que este animal ya haya sido adoptado o que el enlace haya cambiado.
      </p>
      <Link href="/adopt" className={cn(buttonVariants(), 'mt-2')}>
        Ver animales disponibles
      </Link>
    </div>
  )
}
