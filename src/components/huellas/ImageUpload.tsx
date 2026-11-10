"use client";
import { useRef, useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

/**
 * Botón para elegir una imagen y subirla. Devuelve la URL pública con
 * `onUploaded`; no guarda nada en la ficha por sí mismo.
 */
export default function ImageUpload({
  shelterId,
  kind,
  label,
  onUploaded,
  disabled = false,
}: {
  shelterId: string;
  kind: "avatar" | "banner" | "animal";
  label: string;
  onUploaded: (url: string) => void | Promise<void>;
  disabled?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setError("");
    if (file.size > 4 * 1024 * 1024) {
      setError("La imagen pesa más de 4 MB. Prueba con una más liviana.");
      return;
    }
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("kind", kind);
      form.append("shelter_id", shelterId);
      const r = await fetch("/api/upload", { method: "POST", body: form });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      await onUploaded(d.url);
    } catch (e) {
      setError((e as Error).message || "No se pudo subir la imagen.");
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <span className="inline-flex flex-col gap-1">
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
        }}
      />
      <button
        type="button"
        disabled={busy || disabled}
        onClick={() => input.current?.click()}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-primary bg-card px-4 text-sm font-extrabold text-primary transition-colors hover:bg-secondary disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <ImagePlus className="h-4 w-4" aria-hidden="true" />
        )}
        {busy ? "Subiendo…" : label}
      </button>
      {error && (
        <span role="alert" className="text-xs font-semibold text-error-fg">
          {error}
        </span>
      )}
    </span>
  );
}
