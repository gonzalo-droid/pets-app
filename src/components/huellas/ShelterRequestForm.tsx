"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LAMBAYEQUE_DISTRICTS } from "@/lib/ubigeo";

/** Formulario para que una persona registre su albergue (queda pendiente de verificación). */
export default function ShelterRequestForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  return (
    <form
      className="space-y-4 rounded-[28px] border border-border bg-card p-5 sm:p-7"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          const values = Object.fromEntries(new FormData(e.currentTarget));
          const r = await fetch("/api/shelter-request", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const d = await r.json();
          if (!r.ok) throw new Error(d.error);
          // La sesión ahora corresponde a un responsable de albergue.
          router.push("/shelter/dashboard?nuevo=1");
          router.refresh();
        } catch (err) {
          setError((err as Error).message);
          setBusy(false);
        }
      }}
    >
      <label className="block text-sm font-bold">
        Nombre del albergue
        <input className="huellas-field" name="name" required minLength={2} maxLength={100} />
      </label>
      <label className="block text-sm font-bold">
        ¿Qué hacen y a quiénes rescatan?
        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
          Aparecerá en el directorio cuando el albergue esté verificado.
        </span>
        <textarea className="huellas-field" name="description" required minLength={10} maxLength={1000} rows={4} />
      </label>
      <label className="block text-sm font-bold">
        Distrito
        <select className="huellas-field" name="ubigeo" defaultValue="140101" required>
          {LAMBAYEQUE_DISTRICTS.map((d) => (
            <option key={d.ubigeo} value={d.ubigeo}>
              {d.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-bold">
        WhatsApp de contacto <span className="font-normal text-muted-foreground">(opcional)</span>
        <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
          Solo números, sin +51. Ayuda a la administración a contactarte para la verificación.
        </span>
        <input className="huellas-field" name="whatsapp" type="tel" inputMode="numeric" pattern="\d{9,15}" />
      </label>
      <label className="flex items-start gap-3 rounded-2xl bg-secondary p-4 text-sm">
        <input type="checkbox" name="responsible" required className="mt-1 h-4 w-4 accent-primary" />
        <span>
          Confirmo que represento a este albergue y que la información es verdadera. Entiendo que
          HUELLAS revisará su identidad antes de publicarlo.
        </span>
      </label>
      {error && (
        <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">
          {error}
        </p>
      )}
      <button className="huellas-button w-full" disabled={busy}>
        {busy ? "Registrando…" : "Registrar mi albergue"}
      </button>
    </form>
  );
}
