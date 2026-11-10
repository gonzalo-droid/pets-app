"use client";
import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { Actor } from "@/lib/huellas/domain";
export default function Navbar() {
  const [actor, setActor] = useState<Actor | null>(null),
    [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    fetch("/api/session")
      .then((r) => r.json())
      .then((d) => setActor(d.actor))
      .catch(() => {});
  }, []);
  const links = [
    ["/shelters", "Albergues"],
    ["/adopt", "Adopta y apadrina"],
    ["/donate", "Campañas"],
    ["/needs", "Necesidades"],
  ];
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-4">
        <Link
          className="flex items-center gap-3"
          href="/"
        >
          <Logo />
          <span className="hidden xl:block border-l pl-3 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
            Pequeños actos.
            <br />
            Grandes vidas.
          </span>
        </Link>
        <button
          className="md:hidden p-2"
          aria-label="Abrir navegación"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <div
          className={`${open ? "flex" : "hidden"} w-full flex-col gap-3 md:flex md:w-auto md:flex-row md:items-center`}
        >
          {links.map(([href, label]) => (
            <Link
              onClick={() => setOpen(false)}
              aria-current={pathname.startsWith(href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm ${pathname.startsWith(href) ? "bg-muted font-bold" : "text-muted-foreground hover:text-foreground"}`}
              key={href}
              href={href}
            >
              {label}
            </Link>
          ))}
          <ThemeToggle />
          {actor ? (
            <>
              <Link
                className="huellas-button text-sm"
                href={
                  actor.role === "admin"
                    ? "/admin"
                    : actor.role === "shelter"
                      ? "/shelter/dashboard"
                      : "/profile"
                }
              >
                Mi espacio
              </Link>
              <button
                className="text-sm p-2"
                onClick={async () => {
                  await fetch("/api/session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "logout" }),
                  });
                  window.location.assign("/");
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <Link className="huellas-button text-sm" href="/auth/login">
              Quiero ayudar ↗
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
