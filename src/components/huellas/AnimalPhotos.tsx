"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

type Photo = { id: string; url: string; is_cover: boolean; order_index: number };

/** Fotos de un animal publicado: agregar (máx. 3), elegir portada y quitar. */
export default function AnimalPhotos({
  shelterId,
  animalId,
  photos,
}: {
  shelterId: string;
  animalId: string;
  photos: Photo[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const sorted = [...photos].sort((a, b) => a.order_index - b.order_index);

  async function act(action: string, extra: Record<string, unknown>) {
    setError("");
    setBusy(String(extra.id ?? "add"));
    try {
      const r = await fetch("/api/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, shelter_id: shelterId, animal_id: animalId, ...extra }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      router.refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="space-y-4 rounded-[28px] border border-border bg-card p-5 sm:p-7" aria-labelledby="fotos">
      <div>
        <h2 id="fotos" className="text-xl">Fotos</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Hasta 3 fotos (JPG, PNG o WebP de hasta 4 MB). La portada es la que se ve en las tarjetas.
        </p>
      </div>
      {sorted.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {sorted.map((p) => (
            <li key={p.id} className="overflow-hidden rounded-[20px] border border-border">
              <div className="relative aspect-[4/3] bg-muted">
                <Image src={p.url} alt="" fill className="object-cover" sizes="(max-width: 640px) 50vw, 200px" />
                {p.is_cover && (
                  <span className="absolute left-2 top-2 rounded-full bg-highlight px-2.5 py-0.5 text-xs font-extrabold">
                    Portada
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 p-2">
                {!p.is_cover && (
                  <button
                    type="button"
                    disabled={!!busy}
                    onClick={() => act("animal_photo_cover", { id: p.id })}
                    className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-xs font-extrabold text-primary hover:bg-secondary disabled:opacity-60"
                  >
                    <Star className="h-3.5 w-3.5" aria-hidden="true" />
                    Hacer portada
                  </button>
                )}
                <button
                  type="button"
                  disabled={!!busy}
                  onClick={() => {
                    if (window.confirm("¿Quitar esta foto de la ficha?")) act("animal_photo_remove", { id: p.id });
                  }}
                  className="inline-flex min-h-10 items-center gap-1 rounded-full px-3 text-xs font-extrabold text-error-fg hover:bg-error-bg disabled:opacity-60"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Quitar
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-[20px] border-2 border-dashed border-border p-5 text-center text-sm text-muted-foreground">
          Aún no tiene fotos. Una buena foto ayuda mucho a que lo conozcan.
        </p>
      )}
      {sorted.length < 3 && (
        <ImageUpload
          shelterId={shelterId}
          kind="animal"
          label="Agregar foto"
          disabled={!!busy}
          onUploaded={(url) => act("animal_photo_add", { url })}
        />
      )}
      {error && <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">{error}</p>}
    </section>
  );
}
