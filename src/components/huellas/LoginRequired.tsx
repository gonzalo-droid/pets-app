import Link from "next/link";
import { LogIn } from "lucide-react";

/**
 * Se muestra en lugar de un formulario que necesita sesión. Al iniciar
 * sesión (o crear la cuenta) la persona vuelve a `returnTo`.
 */
export default function LoginRequired({
  returnTo,
  action,
}: {
  returnTo: string;
  action: string;
}) {
  const q = "?redirect=" + encodeURIComponent(returnTo);
  return (
    <div className="rounded-[28px] border border-border bg-card p-6 text-center sm:p-8">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary text-primary">
        <LogIn className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-2xl">Inicia sesión para {action}</h2>
      <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
        Así guardamos tu registro y puedes consultarlo en Mi espacio. Después
        volverás aquí.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link className="huellas-button" href={"/auth/login" + q}>
          Iniciar sesión
        </Link>
        <Link className="huellas-button huellas-button--secondary" href={"/auth/register" + q}>
          Crear una cuenta
        </Link>
      </div>
    </div>
  );
}
