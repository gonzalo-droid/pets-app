"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, Dog, HeartHandshake, House, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

// En móvil el panel usa una barra inferior: las 4 secciones de uso diario y "Más".
const ITEMS = [
  { href: "/shelter/dashboard", label: "Inicio", icon: House },
  { href: "/shelter/campaigns", label: "Campañas", icon: HeartHandshake },
  { href: "/shelter/animals", label: "Animales", icon: Dog },
  { href: "/shelter/requests", label: "Solicitudes", icon: ClipboardList },
  { href: "/shelter/more", label: "Más", icon: MoreHorizontal },
] as const;

const MORE = ["/shelter/more", "/shelter/needs", "/shelter/donations", "/shelter/settings"];

export default function ShelterBottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Secciones del panel"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border bg-card px-1 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1.5 lg:hidden"
    >
      {ITEMS.map(({ href, label, icon: Icon }) => {
        const active =
          href === "/shelter/more"
            ? MORE.some((p) => pathname.startsWith(p))
            : pathname === href || (href !== "/shelter/dashboard" && pathname.startsWith(href));
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-1 text-xs",
              active ? "font-extrabold text-primary" : "font-bold text-muted-foreground",
            )}
          >
            <span className={cn("flex h-7 w-12 items-center justify-center rounded-full", active && "bg-secondary")}>
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
