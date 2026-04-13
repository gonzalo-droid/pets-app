import Link from 'next/link'
import { PawPrint } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 px-4 py-12">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 font-bold text-xl text-primary mb-8 hover:opacity-90 transition-opacity"
      >
        <PawPrint className="h-6 w-6" />
        PawRescue
      </Link>

      {/* Card centrada */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-sm p-8">
        {children}
      </div>

      {/* Volver */}
      <Link
        href="/"
        className="mt-6 text-xs text-muted-foreground hover:text-primary transition-colors"
      >
        ← Volver al inicio
      </Link>
    </div>
  )
}
