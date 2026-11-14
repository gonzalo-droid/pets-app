import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ClipboardList, ShieldCheck } from "lucide-react";
import { currentActor } from "@/lib/huellas/auth";
import LoginRequired from "@/components/huellas/LoginRequired";
import ShelterRequestForm from "@/components/huellas/ShelterRequestForm";

export const metadata: Metadata = {
  title: "Registrar mi albergue",
  description: "Registra tu albergue en HUELLAS para publicar campañas, rescatados y necesidades.",
};

const STEPS = [
  { icon: ClipboardList, title: "Registra tu albergue", text: "Cuéntanos quiénes son. Tú quedas como responsable." },
  { icon: CheckCircle2, title: "Prepara tu panel", text: "Sube fotos, rescatados, campañas y necesidades mientras tanto." },
  { icon: ShieldCheck, title: "Te verificamos", text: "La administración revisa tu identidad y publica tu albergue en el portal." },
];

export default async function Page() {
  const actor = await currentActor();
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <section className="rounded-[32px] bg-secondary p-6 sm:p-10">
        <span className="inline-block rounded-full bg-highlight px-4 py-1.5 text-sm font-extrabold">
          Para albergues
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl">Registra tu albergue</h1>
        <p className="mt-3 text-lg text-foreground/80">
          Publica tus campañas, a tus rescatados y lo que necesitas, y recibe el apoyo de la
          comunidad. Es gratis.
        </p>
      </section>

      <ol className="mt-6 grid gap-3 sm:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <li key={title} className="rounded-[24px] border border-border bg-card p-4">
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-display font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
            </span>
            <strong className="mt-3 block font-display text-lg font-semibold">{title}</strong>
            <span className="text-sm text-muted-foreground">{text}</span>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        {!actor ? (
          <LoginRequired returnTo="/registrar-albergue" action="registrar tu albergue" />
        ) : actor.role === "shelter" ? (
          <div className="rounded-[28px] border border-border bg-card p-6 text-center">
            <p className="text-lg font-bold">Ya eres responsable de un albergue</p>
            <Link href="/shelter/dashboard" className="huellas-button mt-4">
              Ir al panel del albergue
            </Link>
          </div>
        ) : actor.role === "admin" ? (
          <p className="rounded-[28px] border border-border bg-card p-6 text-center">
            Las cuentas de administración no registran albergues.
          </p>
        ) : (
          <ShelterRequestForm />
        )}
      </div>
    </div>
  );
}
