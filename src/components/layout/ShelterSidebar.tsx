'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Dog,
  ClipboardList,
  HeartHandshake,
  Wallet,
  PawPrint,
  ChevronLeft,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'

const SHELTER_LINKS = [
  { href: '/shelter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/shelter/animals', label: 'Mis animales', icon: Dog },
  { href: '/shelter/requests', label: 'Solicitudes', icon: ClipboardList },
  { href: '/shelter/campaigns', label: 'Campañas', icon: HeartHandshake },
  { href: '/shelter/donations', label: 'Donaciones', icon: Wallet },
] as const

export default function ShelterSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-sidebar min-h-screen">
      {/* Logo del panel */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-border">
        <PawPrint className="h-5 w-5 text-primary" />
        <span className="font-bold text-sm text-foreground">Panel Albergue</span>
      </div>

      {/* Links de navegación */}
      <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
        {SHELTER_LINKS.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
              pathname === href || (href !== '/shelter/dashboard' && pathname.startsWith(href))
                ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                : 'text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Volver al sitio + toggle tema */}
      <div className="px-3 pb-4 border-t border-border pt-3 flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Volver al sitio
        </Link>
        <div className="flex items-center gap-2 px-3 py-1">
          <span className="text-xs text-muted-foreground flex-1">Tema</span>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  )
}
