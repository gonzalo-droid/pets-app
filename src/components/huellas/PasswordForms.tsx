"use client";
import { useState } from "react";

async function post(values: Record<string, unknown>) {
  const r = await fetch("/api/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error ?? "No se pudo completar. Intenta de nuevo.");
  return d as { message?: string; redirect?: string };
}

/** Pide el enlace para crear una nueva contraseña. */
export function ForgotForm({ expired = false }: { expired?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          const d = await post({ action: "recover", email: new FormData(e.currentTarget).get("email") });
          setMessage(d.message ?? "");
        } catch (err) {
          setError((err as Error).message.startsWith("No se pudo") ? (err as Error).message : "Escribe un correo válido.");
        } finally {
          setBusy(false);
        }
      }}
    >
      {expired && (
        <p className="rounded-2xl bg-warning-bg p-3 text-sm text-warning-fg">
          El enlace venció o ya se usó. Pide uno nuevo.
        </p>
      )}
      <label className="block text-sm font-bold">
        Correo de tu cuenta
        <input className="huellas-field" name="email" type="email" required autoComplete="email" />
      </label>
      {error && <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">{error}</p>}
      {message ? (
        <p role="status" className="rounded-2xl bg-success-bg p-3 text-sm text-success-fg">{message}</p>
      ) : (
        <button className="huellas-button w-full" disabled={busy}>
          {busy ? "Enviando…" : "Enviarme el enlace"}
        </button>
      )}
      <a className="block text-center text-sm font-bold text-primary underline" href="/auth/login">
        Volver a ingresar
      </a>
    </form>
  );
}

/** Crea la nueva contraseña (requiere la sesión del enlace del correo). */
export function ResetForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        if (f.get("password") !== f.get("confirm")) {
          setError("Las contraseñas no coinciden.");
          return;
        }
        setBusy(true);
        setError("");
        try {
          const d = await post({ action: "update_password", password: f.get("password") });
          window.location.href = d.redirect ?? "/profile";
        } catch (err) {
          setError((err as Error).message);
          setBusy(false);
        }
      }}
    >
      <label className="block text-sm font-bold">
        Nueva contraseña
        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">Mínimo 8 caracteres.</span>
        <input className="huellas-field" name="password" type="password" required minLength={8} maxLength={128} autoComplete="new-password" />
      </label>
      <label className="block text-sm font-bold">
        Repite la contraseña
        <input className="huellas-field" name="confirm" type="password" required minLength={8} maxLength={128} autoComplete="new-password" />
      </label>
      {error && <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">{error}</p>}
      <button className="huellas-button w-full" disabled={busy}>
        {busy ? "Guardando…" : "Guardar nueva contraseña"}
      </button>
    </form>
  );
}
