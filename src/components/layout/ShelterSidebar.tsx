"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dog,
  ClipboardList,
  HeartHandshake,
  Wallet,
  ChevronLeft,
  Settings,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/layout/Logo";

const SHELTER_LINKS = [
  { href: "/shelter/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/shelter/campaigns", label: "Campañas", icon: HeartHandshake },
  { href: "/shelter/animals", label: "Animales", icon: Dog },
  { href: "/shelter/needs", label: "Necesidades", icon: Package },
  { href: "/shelter/requests", label: "Solicitudes", icon: ClipboardList },
  { href: "/shelter/donations", label: "Apoyos", icon: Wallet },
  { href: "/shelter/settings", label: "Perfil del albergue", icon: Settings },
] as const;

export default function ShelterSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex min-h-screen w-60 shrink-0 flex-col bg-sidebar text-sidebar-foreground">
      <div className="px-5 pb-4 pt-6">
        <Logo size="sm" tone="light" />
        <p className="mt-1 pl-10 text-xs font-bold text-white/70">Gestión</p>
      </div>

      <nav aria-label="Panel del albergue" className="flex flex-1 flex-col gap-1 px-3 py-2">
        {SHELTER_LINKS.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href ||
            (href !== "/shelter/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-full px-4 text-sm font-bold transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-white/90 hover:bg-white/10",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center justify-between gap-2 border-t border-sidebar-border px-4 py-3">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm font-bold text-white/90 hover:bg-white/10"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Ver comunidad
        </Link>
        <ThemeToggle className="text-white hover:bg-white/10 hover:text-white" />
      </div>
    </aside>
  );
}
