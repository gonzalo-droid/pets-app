"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { PawPrint } from "lucide-react";
import ImageUpload from "./ImageUpload";

/** Foto de perfil y portada del albergue: subir, cambiar o quitar. */
export default function ShelterImages({
  shelterId,
  avatarUrl,
  bannerUrl,
}: {
  shelterId: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");

  async function save(field: "avatar_url" | "banner_url", url: string) {
    setError("");
    setSaved("");
    const r = await fetch("/api/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "shelter_images", shelter_id: shelterId, [field]: url }),
    });
    const d = await r.json();
    if (!r.ok) {
      setError(d.error);
      return;
    }
    setSaved(field === "avatar_url" ? "Foto de perfil guardada." : "Portada guardada.");
    router.refresh();
  }

  return (
    <section className="space-y-5 rounded-[28px] border border-border bg-card p-5" aria-labelledby="imagenes">
      <div>
        <h2 id="imagenes" className="text-xl">Imágenes</h2>
        <p className="mt-1 text-sm text-muted-foreground">JPG, PNG o WebP de hasta 4 MB.</p>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-bold">Portada</p>
        <div className="relative h-32 overflow-hidden rounded-[20px] bg-support-soft sm:h-40">
          {bannerUrl ? (
            <Image src={bannerUrl} alt="Portada actual" fill className="object-cover" sizes="640px" />
          ) : (
            <span className="flex h-full items-center justify-center text-sm font-bold text-muted-foreground">
              Sin portada
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <ImageUpload
            shelterId={shelterId}
            kind="banner"
            label={bannerUrl ? "Cambiar portada" : "Subir portada"}
            onUploaded={(url) => save("banner_url", url)}
          />
          {bannerUrl && (
            <button
              type="button"
              onClick={() => save("banner_url", "")}
              className="min-h-11 rounded-full px-4 text-sm font-bold text-error-fg hover:bg-error-bg"
            >
              Quitar
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[22px] bg-secondary">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt="Foto de perfil actual"
              fill
              className="object-cover"
              sizes="80px"
              unoptimized={avatarUrl.includes("api.dicebear.com")}
            />
          ) : (
            <span className="flex h-full items-center justify-center text-primary">
              <PawPrint className="h-8 w-8" aria-hidden="true" />
            </span>
          )}
        </div>
        <div className="space-y-2">
          <p className="text-sm font-bold">Foto de perfil</p>
          <div className="flex flex-wrap gap-2">
            <ImageUpload
              shelterId={shelterId}
              kind="avatar"
              label={avatarUrl ? "Cambiar foto" : "Subir foto"}
              onUploaded={(url) => save("avatar_url", url)}
            />
            {avatarUrl && (
              <button
                type="button"
                onClick={() => save("avatar_url", "")}
                className="min-h-11 rounded-full px-4 text-sm font-bold text-error-fg hover:bg-error-bg"
              >
                Quitar
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">{error}</p>}
      {saved && <p role="status" className="rounded-2xl bg-success-bg p-3 text-sm text-success-fg">{saved}</p>}
    </section>
  );
}
