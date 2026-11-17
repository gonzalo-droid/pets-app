import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import LostReportForm from './LostReportForm'

export const metadata: Metadata = {
  title: 'Reportar animal perdido o encontrado',
}

export default function NewLostReportPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-10">
      {/* Breadcrumb */}
      <Link
        href="/lost"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a perdidos y encontrados
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Nuevo reporte</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Publica un reporte de animal perdido o encontrado. La información de contacto
          se mostrará directamente en el reporte.
        </p>
      </div>

      {/* Aviso */}
      <div className="mb-6 rounded-lg bg-accent/60 border border-primary/20 px-4 py-3 text-sm text-accent-foreground">
        <strong>Tip:</strong> Entre más detallada sea la descripción (color, marcas, collar,
        nombre), más fácil será para la comunidad identificar al animal.
      </div>

      <LostReportForm />
    </div>
  )
}
