"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type Field = {
  name: string;
  label: string;
  type?: string;
  value?: string | number;
  /** Campo no obligatorio. */
  optional?: boolean;
  /** Texto largo: se muestra como área de texto. */
  multiline?: boolean;
  /** Ayuda breve debajo de la etiqueta. */
  hint?: string;
};
export function ManageForm({
  action,
  shelterId,
  fields,
  title,
  extra,
  submitLabel = "Guardar",
  resetOnSave,
  endpoint = "/api/manage",
}: {
  /** Ruta de la API que recibe el formulario. */
  endpoint?: string;
  action: string;
  shelterId: string;
  fields: Field[];
  title: string;
  /** Datos adicionales enviados con el formulario (p. ej. el id que se edita). */
  extra?: Record<string, unknown>;
  submitLabel?: string;
  resetOnSave?: boolean;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [saved, setSaved] = useState(false);
  const router = useRouter();
  const reset = resetOnSave ?? (action !== "settings" && !extra?.id);
  return (
    <form
      className="rounded-[28px] border border-border bg-card p-5 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        setSaved(false);
        const form = e.currentTarget;
        try {
          const values = Object.fromEntries(new FormData(form));
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...values, ...extra, action, shelter_id: shelterId }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setSaved(true);
          router.refresh();
          if (reset) form.reset();
        } catch (e) {
          setError((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-xl">{title}</h2>
      {fields.map((f) => {
        const common = {
          required: !f.optional,
          className: "huellas-field",
          name: f.name,
          defaultValue: f.value,
          "aria-describedby": f.hint ? `${action}-${f.name}-hint` : undefined,
        };
        return (
          <label key={f.name} className="block text-sm font-bold">
            {f.label}
            {f.optional && <span className="font-normal text-muted-foreground"> (opcional)</span>}
            {f.hint && (
              <span id={`${action}-${f.name}-hint`} className="mt-0.5 block text-xs font-normal text-muted-foreground">
                {f.hint}
              </span>
            )}
            {(f.multiline ?? f.name === "description") ? (
              <textarea {...common} rows={4} maxLength={2000} />
            ) : (
              <input
                {...common}
                type={f.type ?? "text"}
                min={
                  f.type === "number"
                    ? 1
                    : f.type === "date"
                      ? new Date().toLocaleDateString("en-CA", { timeZone: "America/Lima" })
                      : undefined
                }
                maxLength={f.type === "date" || f.type === "number" ? undefined : 120}
              />
            )}
          </label>
        );
      })}
      {error && (
        <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="rounded-2xl bg-success-bg p-3 text-sm text-success-fg">
          Cambios guardados.
        </p>
      )}
      <button className="huellas-button" disabled={busy}>
        {busy ? "Guardando…" : submitLabel}
      </button>
    </form>
  );
}

export function ActionButton({
  endpoint = "/api/manage",
  payload,
  children,
  confirm,
  tone = "default",
}: {
  endpoint?: string;
  payload: Record<string, unknown>;
  children: React.ReactNode;
  /** Pregunta que explica la consecuencia antes de ejecutar la acción. */
  confirm?: string;
  tone?: "default" | "primary" | "danger";
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <span className="inline-flex flex-col gap-1">
      <button
        className={
          tone === "primary"
            ? "min-h-11 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground hover:bg-primary-hover disabled:opacity-60"
            : tone === "danger"
              ? "min-h-11 rounded-full border-2 border-error-fg/40 px-4 text-sm font-bold text-error-fg hover:bg-error-bg disabled:opacity-60"
              : "min-h-11 rounded-full border-2 border-border px-4 text-sm font-bold hover:bg-muted disabled:opacity-60"
        }
        disabled={busy}
        onClick={async () => {
          if (confirm && !window.confirm(confirm)) return;
          setBusy(true);
          setError("");
          try {
            const r = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error);
            router.refresh();
          } catch (e) {
            setError((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Guardando…" : children}
      </button>
      {error && (
        <span role="alert" className="text-xs font-semibold text-error-fg">
          {error}
        </span>
      )}
    </span>
  );
}
export function SupportForm({
  kind,
  slug,
  title,
}: {
  kind: "donation" | "sponsorship";
  slug: string;
  title: string;
}) {
  const monthly = kind === "sponsorship";
  const presets = monthly ? [10, 30, 50, 100] : [20, 50, 100, 200];
  const [amount, setAmount] = useState(monthly ? 30 : 50),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [ref, setRef] = useState(""),
    [key] = useState(() => crypto.randomUUID());

  // Confirmación: solo tras guardar correctamente, y sin parecer un pago.
  if (ref)
    return (
      <div role="status" className="space-y-4 rounded-[28px] bg-card p-6">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success-bg text-success-fg">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12l5 5 9-10" />
          </svg>
        </span>
        <h2 className="text-2xl">Compromiso guardado</h2>
        <dl className="grid gap-2 rounded-2xl bg-card p-4 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Destino</dt><dd className="text-right font-bold">{title}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Importe</dt><dd className="font-bold">S/ {amount}{monthly ? " / mes" : ""}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Estado</dt><dd className="font-bold">Pendiente</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Referencia</dt><dd className="font-bold">{ref.slice(0, 8).toUpperCase()}</dd></div>
        </dl>
        <p className="text-sm font-bold">
          No se realizó ningún cobro.{monthly ? " No tiene débito automático." : ""} El compromiso no
          equivale a una donación recibida.
        </p>
        <a className="huellas-button w-full" href="/profile">
          Ver mis apoyos
        </a>
      </div>
    );

  return (
    <form
      className="space-y-4 rounded-[28px] bg-card p-5 sm:p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          const r = await fetch("/api/support", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind, slug, amount, idempotency_key: key }),
          });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          setRef(d.id ?? key);
        } catch (e) {
          setError((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-2xl">{monthly ? "¿Cuánto al mes?" : "¿Cuánto quieres aportar?"}</h2>
      <div role="group" aria-label="Importes sugeridos" className="grid grid-cols-4 gap-2">
        {presets.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={amount === n}
            className={`min-h-12 rounded-2xl border-2 text-base font-extrabold transition-colors ${
              amount === n
                ? "border-support bg-support text-support-foreground"
                : "border-input bg-card text-foreground hover:bg-secondary"
            }`}
            onClick={() => setAmount(n)}
          >
            S/ {n}
          </button>
        ))}
      </div>
      <label className="block text-sm font-bold">
        Otro monto en soles{monthly ? " por mes" : ""}
        <input
          className="huellas-field"
          type="number"
          min="1"
          max="100000"
          step="0.01"
          required
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
      </label>
      {error && (
        <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">
          {error}
        </p>
      )}
      <button disabled={busy} className="huellas-button huellas-button--support w-full min-h-13 text-base">
        {busy
          ? "Guardando…"
          : monthly
            ? `Apadrinar con S/ ${amount || 0} al mes`
            : `Registrar compromiso de S/ ${amount || 0}`}
      </button>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Es un compromiso de apoyo: hoy no se cobra nada{monthly ? " ni se activa un débito" : ""}.
        Puedes cancelarlo cuando quieras en Mi espacio. No ingreses datos de tarjetas.
      </p>
    </form>
  );
}
