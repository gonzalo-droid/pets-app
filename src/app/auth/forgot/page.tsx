import type { Metadata } from "next";
import { isDemo } from "@/lib/huellas/config";
import { ForgotForm } from "@/components/huellas/PasswordForms";

export const metadata: Metadata = { title: "Recuperar contraseña" };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ vencido?: string }>;
}) {
  const { vencido } = await searchParams;
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl">Recupera tu contraseña</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Te enviaremos un enlace para crear una nueva. Vence en poco tiempo, úsalo pronto.
        </p>
      </div>
      {isDemo() ? (
        <p className="rounded-2xl bg-secondary p-4 text-sm">
          En la demo no hay contraseñas: elige un perfil en{" "}
          <a className="font-bold text-primary underline" href="/auth/login">Ingresar</a>.
        </p>
      ) : (
        <ForgotForm expired={vencido === "1"} />
      )}
    </div>
  );
}
