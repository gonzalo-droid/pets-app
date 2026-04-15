import Link from 'next/link'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <span className="text-xl leading-none" aria-hidden="true">🐾</span>
              <span className="font-display font-black text-lg leading-none">
                <span className="text-brand-400">Paw</span>
                <span className="text-foreground">Rescue</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              La plataforma de adopción y rescate animal de Perú. Conectamos animales
              con hogares responsables en Lambayeque y todo el país.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
              >
                Instagram
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-primary transition-colors underline"
              >
                Facebook
              </a>
            </div>
          </div>

          {/* Cómo funciona */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Cómo funciona</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/adopt" className="hover:text-primary transition-colors">
                  Ver animales en adopción
                </Link>
              </li>
              <li>
                <Link href="/lost" className="hover:text-primary transition-colors">
                  Reportar animal perdido
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-primary transition-colors">
                  Apoyar una campaña
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-primary transition-colors">
                  Crear una cuenta
                </Link>
              </li>
            </ul>
          </div>

          {/* Para albergues */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Para albergues</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auth/register" className="hover:text-primary transition-colors">
                  Registrar mi albergue
                </Link>
              </li>
              <li>
                <Link href="/shelter/dashboard" className="hover:text-primary transition-colors">
                  Panel de gestión
                </Link>
              </li>
              <li>
                <Link href="/shelter/animals/new" className="hover:text-primary transition-colors">
                  Publicar un animal
                </Link>
              </li>
              <li>
                <Link href="/shelter/campaigns" className="hover:text-primary transition-colors">
                  Crear campaña de donación
                </Link>
              </li>
            </ul>
          </div>

          {/* CTA albergues */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">¿Tienes un albergue?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Únete a PawRescue y gestiona tus animales, solicitudes de adopción y
              campañas de donación desde un solo lugar.
            </p>
            <Link
              href="/auth/register"
              className={cn(buttonVariants({ size: 'sm' }))}
            >
              Registrar albergue gratis
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PawRescue. Hecho con amor en Lambayeque, Perú.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-primary transition-colors">
              Términos de uso
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
