import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: {
    default: 'PawRescue — Adopción y rescate animal en Perú',
    template: '%s | PawRescue',
  },
  description:
    'Encuentra tu compañero ideal, reporta animales perdidos y apoya a los albergues de Lambayeque y todo el Perú.',
  keywords: ['adopción animales', 'perros en adopción', 'gatos en adopción', 'Chiclayo', 'Lambayeque', 'Perú'],
  openGraph: {
    siteName: 'PawRescue',
    locale: 'es_PE',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${nunito.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
