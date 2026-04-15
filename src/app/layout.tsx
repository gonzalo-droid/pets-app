import type { Metadata } from 'next'
import { Nunito, Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
})

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
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
    <html
      lang="es"
      className={`${nunito.variable} ${jakarta.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
