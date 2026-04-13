import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
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
    <html lang="es" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
