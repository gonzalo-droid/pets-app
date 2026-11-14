"use client";

import { useRef, useState } from "react";
import { Check, Image as ImageIcon, Link2, QrCode, Share2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Compartir una campaña: WhatsApp con mensaje listo, copiar enlace, imagen
 * para estados y código QR para afiches. Los albergues pequeños llegan a poca
 * gente; esto les ayuda a difundir sin depender de nadie.
 */
export default function ShareCampaign({
  slug,
  title,
  message,
  label = "Compartir",
  variant = "button",
  tone = "secondary",
  className,
}: {
  slug: string;
  title: string;
  /** Frase que acompaña al enlace en WhatsApp. */
  message: string;
  label?: string;
  /** "icon": botón redondo solo con icono (lleva aria-label). */
  variant?: "button" | "icon";
  /** Botón con texto: verde (primary) o con borde (secondary). */
  tone?: "primary" | "secondary";
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<string | null>(null);
  const [canNativeShare, setCanNativeShare] = useState(false);


  async function showQr() {
    const QRCode = (await import("qrcode")).default;
    setQr(await QRCode.toDataURL(url, { width: 480, margin: 2, color: { dark: "#1e2b25" } }));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Sin permiso de portapapeles: se selecciona el enlace para copiarlo a mano.
      document.getElementById(`share-url-${slug}`)?.focus();
    }
  }

  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${message} ${url}`)}`;
  const tile =
    "flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-input bg-card px-2 text-center text-xs font-extrabold text-foreground transition-colors hover:bg-secondary";

  return (
    <>
      <button
        type="button"
        onClick={() => {
          // El enlace se arma al abrir: depende del dominio desde el que se navega.
          setUrl(`${window.location.origin}/donate/${slug}`);
          setCanNativeShare(typeof navigator.share === "function");
          setQr(null);
          dialog.current?.showModal();
        }}
        aria-label={variant === "icon" ? `${label}: ${title}` : undefined}
        className={cn(
          variant === "icon"
            ? "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-input bg-card text-foreground hover:bg-secondary"
            : tone === "primary"
              ? "huellas-button"
              : "huellas-button huellas-button--secondary",
          className,
        )}
      >
        <Share2 className="h-5 w-5" aria-hidden="true" />
        {variant === "button" && label}
      </button>

      <dialog
        ref={dialog}
        aria-labelledby={`share-title-${slug}`}
        className="m-0 mt-auto w-full max-w-none rounded-t-[28px] bg-background p-0 text-foreground backdrop:bg-foreground/50 sm:m-auto sm:max-w-md sm:rounded-[28px]"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="flex flex-col gap-4 p-4 pb-6 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id={`share-title-${slug}`} className="text-2xl">
              Compartir la campaña
            </h2>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Cerrar"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="rounded-2xl bg-card p-4 text-sm leading-relaxed">
            <p className="mb-1 text-xs font-extrabold text-muted-foreground">Mensaje que se envía</p>
            {message} <span className="break-all text-primary">{url}</span>
          </div>

          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="huellas-button min-h-[52px] text-base"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5Z" />
            </svg>
            Enviar por WhatsApp
          </a>

          <div className="grid grid-cols-3 gap-2">
            <button type="button" onClick={copy} className={tile}>
              {copied ? <Check className="h-5 w-5 text-primary" aria-hidden="true" /> : <Link2 className="h-5 w-5" aria-hidden="true" />}
              {copied ? "Copiado" : "Copiar enlace"}
            </button>
            <a href={`/api/share/${slug}`} download={`${slug}.png`} className={tile}>
              <ImageIcon className="h-5 w-5" aria-hidden="true" />
              Imagen para estados
            </a>
            <button type="button" onClick={showQr} className={tile}>
              <QrCode className="h-5 w-5" aria-hidden="true" />
              QR para afiches
            </button>
          </div>
          <p role="status" className="sr-only">
            {copied ? "Enlace copiado" : ""}
          </p>

          {qr && (
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- imagen generada en el navegador */}
              <img src={qr} alt={`Código QR que abre la campaña ${title}`} className="h-48 w-48" />
              <a href={qr} download={`qr-${slug}.png`} className="huellas-button huellas-button--secondary">
                Descargar el QR
              </a>
            </div>
          )}

          <label className="text-xs font-bold text-muted-foreground" htmlFor={`share-url-${slug}`}>
            Enlace de la campaña
          </label>
          <input
            id={`share-url-${slug}`}
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="huellas-field mt-0 text-sm"
          />

          {canNativeShare && (
            <button
              type="button"
              onClick={() => navigator.share({ title, text: message, url }).catch(() => {})}
              className="text-sm font-extrabold text-primary underline"
            >
              Más opciones para compartir
            </button>
          )}
        </div>
      </dialog>
    </>
  );
}
