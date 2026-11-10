"use client";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, UserRound, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Actor } from "@/lib/huellas/domain";
export default function Navbar() {
  const [actor, setActor] = useState<Actor | null>(null),
    [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json())
      .then((d) => setActor(d.actor))
      .catch(() => {});
  }, []);
  const links = [
    ["/", "Inicio"],
    ["/shelters", "Albergues"],
    ["/adopt", "Adopta y apadrina"],
    ["/donate", "Campañas"],
    ["/needs", "Necesidades"],
  ];
  // "Inicio" solo está activo en la portada; el resto, en su sección y subpáginas.
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const personal =
    actor?.role === "admin"
      ? { href: "/admin", label: "Administración" }
      : actor?.role === "shelter"
        ? { href: "/shelter/dashboard", label: "Panel del albergue" }
        : { href: "/profile", label: "Mi espacio" };
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <nav
        aria-label="Navegación principal"
        className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link href="/" aria-label="HUELLAS, inicio" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <button
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="menu-principal"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div
          id="menu-principal"
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-1 pb-2 lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-1 lg:pb-0`}
        >
          {links.map(([href, label]) => (
            <Link
              onClick={() => setOpen(false)}
              aria-current={isActive(href) ? "page" : undefined}
              className={`rounded-full px-4 py-2.5 text-[15px] font-bold transition-colors ${
                isActive(href)
                  ? "bg-secondary text-primary font-extrabold"
                  : "text-foreground/80 hover:bg-secondary/60 hover:text-foreground"
              }`}
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
          <div className="flex items-center gap-2 pt-2 lg:pt-0 lg:pl-2">
            <ThemeToggle />
            {actor ? (
              <>
                <Link
                  className="huellas-button text-sm flex-1 lg:flex-none"
                  href={personal.href}
                  onClick={() => setOpen(false)}
                >
                  <UserRound size={18} aria-hidden="true" />
                  {personal.label}
                </Link>
                <button
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  onClick={async () => {
                    await fetch("/api/session", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ action: "logout" }),
                    });
                    setOpen(false);
                    setActor(null);
                    router.push("/");
                    router.refresh();
                  }}
                >
                  Salir
                </button>
              </>
            ) : (
              <Link
                className="huellas-button huellas-button--support text-sm flex-1 lg:flex-none"
                href="/auth/login"
                onClick={() => setOpen(false)}
              >
                <Heart size={18} aria-hidden="true" />
                Quiero ayudar
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
