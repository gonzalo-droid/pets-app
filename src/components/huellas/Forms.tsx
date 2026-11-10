"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
type Field = {
  name: string;
  label: string;
  type?: string;
  value?: string | number;
};
export function ManageForm({
  action,
  shelterId,
  fields,
  title,
}: {
  action: string;
  shelterId: string;
  fields: Field[];
  title: string;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [saved, setSaved] = useState(false);
  const router = useRouter();
  return (
    <form
      className="rounded-2xl border bg-card p-5 space-y-4"
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
            body: JSON.stringify({ ...values, action, shelter_id: shelterId }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error);
          setSaved(true);
          router.refresh();
          if (action !== "settings") form.reset();
        } catch (e) {
          setError((e as Error).message);
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="text-lg font-bold">{title}</h2>
      {fields.map((f) => (
        <label key={f.name} className="block text-sm font-medium">
          {f.label}
          <input
            required
            className="huellas-field"
            name={f.name}
            type={f.type ?? "text"}
            defaultValue={f.value}
            min={f.type === "number" ? 1 : undefined}
            maxLength={f.name === "description" ? 1000 : 120}
          />
        </label>
      ))}
      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-green-700">
          Cambios guardados.
        </p>
      )}
      <button className="huellas-button" disabled={busy}>
        {busy ? "Guardando…" : "Guardar"}
      </button>
    </form>
  );
}
export function ActionButton({
  endpoint = "/api/manage",
  payload,
  children,
}: {
  endpoint?: string;
  payload: Record<string, unknown>;
  children: React.ReactNode;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const router = useRouter();
  return (
    <span className="inline-flex flex-col gap-1">
      <button
        className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
        disabled={busy}
        onClick={async () => {
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
        <span role="alert" className="text-xs text-red-600">
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
                className={`rounded-xl border px-5 py-3 ${amount === n ? "bg-emerald-800 text-white" : "bg-muted"}`}
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
          <button disabled={busy} className="huellas-button">
            {busy ? "Guardando…" : "Registrar compromiso sin cobro"}
          </button>
        </>
      )}
      {message && (
        <p role="status" className="rounded-xl bg-muted p-4 text-sm">
          {message}{" "}
          {done && (
            <a className="underline" href="/profile">
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
