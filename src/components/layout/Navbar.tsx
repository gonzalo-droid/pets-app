'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { PawPrint, Menu, X, Heart, LogOut, LayoutDashboard, UserCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { getMockSession, clearMockSession, type MockUser } from '@/lib/mock/users'

const NAV_LINKS = [
  { href: '/adopt', label: 'Adoptar' },
  { href: '/lost', label: 'Perdidos' },
  { href: '/donate', label: 'Donar' },
  { href: '/shelters', label: 'Albergues' },
] as const

export default function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [session, setSession] = useState<MockUser | null>(null)

  useEffect(() => {
    setSession(getMockSession())
  }, [])

  function handleLogout() {
    clearMockSession()
    setSession(null)
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-90 transition-opacity"
        >
          <PawPrint className="h-6 w-6" />
          <span>PawRescue</span>
        </Link>

        {/* Links de escritorio */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                pathname.startsWith(href)
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth — escritorio */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          {session ? (
            <>
              <span className="text-sm text-muted-foreground">
                {session.full_name}
              </span>
              {session.role === 'user' && (
                <Link
                  href="/profile"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                >
                  <UserCircle className="h-4 w-4" />
                  Mi perfil
                </Link>
              )}
              {session.role === 'shelter' && (
                <Link
                  href="/shelter/dashboard"
                  className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}
              >
                Iniciar sesión
              </Link>
              <Link
                href="/auth/register"
                className={cn(buttonVariants({ size: 'sm' }))}
              >
                <Heart className="h-4 w-4" />
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Controles móvil */}
        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />
          <button
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 pt-2">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                  pathname.startsWith(href)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                {label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
              {session ? (
                <>
                  <span className="px-3 py-1 text-sm text-muted-foreground">{session.full_name}</span>
                  {session.role === 'user' && (
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'justify-center')}
                    >
                      <UserCircle className="h-4 w-4" />
                      Mi perfil
                    </Link>
                  )}
                  {session.role === 'shelter' && (
                    <Link
                      href="/shelter/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'justify-center')}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'justify-center')}
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileOpen(false)}
                    className={cn(buttonVariants({ variant: 'outline', size: 'sm' }), 'justify-center')}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileOpen(false)}
                    className={cn(buttonVariants({ size: 'sm' }), 'justify-center')}
                  >
                    <Heart className="h-4 w-4" />
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
