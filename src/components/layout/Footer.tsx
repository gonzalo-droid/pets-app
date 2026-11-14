import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="max-w-7xl mx-auto px-5 py-10 flex flex-wrap justify-between gap-6">
        <div>
          <Link href="/" aria-label="HUELLAS, inicio">
            <Logo size="sm" />
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Pequeños actos. Grandes vidas.
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
          <Link href="/shelters">Albergues</Link>
          <Link href="/needs">Necesidades</Link>
          <Link href="/registrar-albergue">Registra tu albergue</Link>
          <Link href="/auth/login">Mi espacio</Link>
        </div>
        <p className="text-xs text-muted-foreground max-w-xs">
          Por ahora los apoyos son compromisos sin cobro: todavía no hay pagos
          ni débitos automáticos.
        </p>
      </div>
    </footer>
  );
}
