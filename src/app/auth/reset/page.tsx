import type { Metadata } from "next";
import { currentActor } from "@/lib/huellas/auth";
import { isDemo } from "@/lib/huellas/config";
import { ResetForm } from "@/components/huellas/PasswordForms";

export const metadata: Metadata = { title: "Nueva contraseña" };

export default async function Page() {
  // Se llega desde el enlace del correo, que abre una sesión temporal.
  const actor = isDemo() ? null : await currentActor();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl">Crea tu nueva contraseña</h1>
      {actor ? (
        <ResetForm />
      ) : (
        <p className="rounded-2xl bg-warning-bg p-4 text-sm text-warning-fg">
          Abre esta página desde el enlace que te enviamos por correo.{" "}
          <a className="font-bold underline" href="/auth/forgot">Pedir un enlace nuevo</a>
        </p>
      )}
    </div>
  );
}
