import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, Globe, Package, Settings, Wallet } from "lucide-react";

export const metadata: Metadata = { title: "Más opciones del panel" };

const LINKS = [
  { href: "/shelter/settings", label: "Perfil del albergue", text: "Fotos, historia, contacto y redes", icon: Settings },
  { href: "/shelter/needs", label: "Necesidades", text: "Productos y servicios que te faltan", icon: Package },
  { href: "/shelter/donations", label: "Apoyos", text: "Compromisos y apadrinamientos registrados", icon: Wallet },
  { href: "/", label: "Ver HUELLAS", text: "La web tal como la ve la comunidad", icon: Globe },
] as const;

export default function Page() {
  return (
    <div className="max-w-2xl space-y-5">
      <h1 className="text-3xl">Más</h1>
      <ul className="divide-y divide-border overflow-hidden rounded-[24px] bg-card">
        {LINKS.map(({ href, label, text, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="flex min-h-16 items-center gap-4 p-4 hover:bg-secondary/60">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-extrabold">{label}</span>
                <span className="text-sm text-muted-foreground">{text}</span>
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
