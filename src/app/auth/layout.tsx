import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/20 px-4 py-12">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-1.5 mb-8 hover:opacity-90 transition-opacity"
      >
        <span className="text-2xl leading-none" aria-hidden="true">🐾</span>
        <span className="font-display font-black text-xl leading-none">
          <span className="text-brand-400">Paw</span>
          <span className="text-foreground">Rescue</span>
        </span>
      </Link>

      {/* Card centrada */}
      <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-sm p-8">
        {children}
      </div>

      {/* Volver */}
      <Link
        href="/"
        className="mt-6 text-xs text-muted-foreground hover:text-brand-400 transition-colors"
      >
        ← Volver al inicio
      </Link>
    </div>
  )
}
