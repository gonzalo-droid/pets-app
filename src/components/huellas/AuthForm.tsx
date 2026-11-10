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
    [busy, setBusy] = useState(false);
  async function send(values: Record<string, unknown>) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, redirectTo }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (d.redirect) window.location.assign(d.redirect);
      else setError(d.message);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">
          Comunidad HUELLAS
        </p>
        <h1 className="mt-2 text-3xl font-bold">
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
              className="rounded-xl border p-4 text-left hover:bg-muted"
              onClick={() => send({ demoRole: role })}
            >
              <strong className="block">{label}</strong>
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
            className="block text-sm underline"
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
        <p role="status" className="rounded-lg bg-muted p-3 text-sm">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Los accesos de albergue y administrador se asignan por invitación del
        equipo.
      </p>
    </div>
  );
}
