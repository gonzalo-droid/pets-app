import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-support-soft/60 px-4 py-12">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-1.5 mb-8 hover:opacity-90 transition-opacity"
      >
        <Logo />
      </Link>

      {/* Card centrada */}
      <div className="w-full max-w-md rounded-[32px] bg-card p-6 shadow-sm sm:p-8">
        {children}
      </div>

      {/* Volver */}
      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
      >
        ← Volver al inicio
      </Link>
    </div>
  );
}
