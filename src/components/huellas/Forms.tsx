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
}: {
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
          const res = await fetch("/api/manage", {
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
  const [amount, setAmount] = useState(30),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [key] = useState(() => crypto.randomUUID());
  return (
    <form
      className="space-y-5 rounded-2xl border bg-card p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
          const r = await fetch("/api/support", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ kind, slug, amount, idempotency_key: key }),
          });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          setMessage(d.message);
          setDone(true);
        } catch (e) {
          setMessage((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-muted-foreground">
        {kind === "sponsorship"
          ? "Expresa tu intención de apoyar cada mes."
          : "Registra tu intención de aportar."}{" "}
        Los cobros están deshabilitados. No ingreses datos de tarjetas ni
        realices transferencias.
      </p>
      {!done && (
        <>
          <div className="flex flex-wrap gap-2">
            {[10, 30, 50, 100].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={amount === n}
                className={`rounded-xl border px-5 py-3 ${amount === n ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                onClick={() => setAmount(n)}
              >
                S/ {n}
              </button>
            ))}
          </div>
          <label className="block text-sm">
            Monto en soles{kind === "sponsorship" ? " por mes" : ""}
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
          <button disabled={busy} className="huellas-button huellas-button--support w-full">
            {busy ? "Guardando…" : "Registrar compromiso sin cobro"}
          </button>
        </>
      )}
      {message && (
        <p
          role="status"
          className={`rounded-2xl p-4 text-sm ${done ? "bg-success-bg text-success-fg" : "bg-error-bg text-error-fg"}`}
        >
          {message}{" "}
          {done && (
            <a className="font-extrabold underline" href="/profile">
              Ver mis apoyos
            </a>
          )}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Los compromisos pendientes no incrementan la recaudación. Puedes
        cancelarlos desde tu perfil.
      </p>
    </form>
  );
}
