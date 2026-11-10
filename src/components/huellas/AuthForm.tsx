"use client";
import { useState } from "react";
export default function AuthForm({
  demo,
  register = false,
  redirectTo,
}: {
  demo: boolean;
  register?: boolean;
  /** Ruta interna a la que volver tras iniciar sesión (ya validada). */
  redirectTo?: string;
}) {
  const [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false);
  async function send(values: Record<string, unknown>) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const r = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, redirectTo }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (d.redirect) window.location.assign(d.redirect);
      else setNotice(d.message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <span className="inline-block -rotate-2 rounded-full bg-highlight px-3 py-1 text-xs font-extrabold">
          Comunidad HUELLAS
        </span>
        <h1 className="mt-3 text-3xl">
          {demo
            ? "Elige cómo explorar"
            : register
              ? "Crea tu cuenta"
              : "Qué bueno verte"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {demo
            ? "Perfiles ficticios para probar los flujos. Los cambios se guardan en este equipo."
            : "Apoya a quienes cuidan de ellos."}
        </p>
        {redirectTo && (
          <p className="mt-3 rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
            Después de ingresar volverás a lo que estabas haciendo.
          </p>
        )}
      </div>
      {demo ? (
        <div className="grid gap-3">
          {[
            ["donor", "Donante", "Descubre, apoya y apadrina"],
            ["shelter", "Patitas Chiclayo", "Gestiona el primer albergue"],
            [
              "shelter2",
              "Huellas Lambayeque",
              "Prueba el aislamiento entre albergues",
            ],
            ["admin", "Administración", "Verifica los albergues de la red"],
          ].map(([role, label, detail]) => (
            <button
              disabled={busy}
              key={role}
              className="min-h-16 rounded-[20px] border-2 border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-secondary/50 disabled:opacity-60"
              onClick={() => send({ demoRole: role })}
            >
              <strong className="block font-display text-lg font-semibold">{label}</strong>
              <span className="text-xs text-muted-foreground">{detail}</span>
            </button>
          ))}
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            send({
              ...Object.fromEntries(new FormData(e.currentTarget)),
              action: register ? "register" : "login",
            });
          }}
        >
          {register && (
            <label className="block text-sm">
              Nombre completo
              <input
                className="huellas-field"
                name="full_name"
                required
                minLength={2}
                autoComplete="name"
              />
            </label>
          )}
          <label className="block text-sm">
            Correo electrónico
            <input
              className="huellas-field"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </label>
          <label className="block text-sm">
            Contraseña
            <input
              className="huellas-field"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete={register ? "new-password" : "current-password"}
            />
          </label>
          <button className="huellas-button w-full" disabled={busy}>
            {busy ? "Un momento…" : register ? "Registrarme" : "Ingresar"}
          </button>
          <a
            className="block text-center text-sm font-bold text-primary underline"
            href={
              (register ? "/auth/login" : "/auth/register") +
              (redirectTo ? "?redirect=" + encodeURIComponent(redirectTo) : "")
            }
          >
            {register ? "Ya tengo cuenta" : "Crear una cuenta de donante"}
          </a>
        </form>
      )}
      {error && (
        <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="rounded-2xl bg-success-bg p-3 text-sm text-success-fg">
          {notice}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Los accesos de albergue y administrador se asignan por invitación del
        equipo.
      </p>
    </div>
  );
}
