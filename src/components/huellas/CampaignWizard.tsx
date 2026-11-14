"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, MapPin, X } from "lucide-react";
import ImageUpload from "./ImageUpload";
import { PawIcon } from "@/components/campaigns/PawProgress";
import { cn, formatPEN } from "@/lib/utils";
import type { CampaignKind } from "@/types";

type AnimalOption = { id: string; name: string; photo: string | null };

export type WizardValues = {
  kind: CampaignKind;
  title: string;
  description: string;
  animal_id: string;
  event_at: string; // AAAA-MM-DDTHH:MM, hora de Perú
  event_place: string;
  image_url: string;
  goal_amount: string;
  ends_at: string; // AAAA-MM-DD
};

const KINDS: { id: CampaignKind; label: string; hint: string; example: string }[] = [
  { id: "case", label: "Caso de un rescatado", hint: "Una operación, un tratamiento, una recuperación", example: "Operación de cadera para Zeus" },
  { id: "fund", label: "Fondo", hint: "Un gasto que se repite: alimento, vacunas, alquiler", example: "Alimento para 30 rescatados" },
  { id: "event", label: "Evento", hint: "Jornada de adopción, colecta, esterilización", example: "Jornada de adopción en el parque" },
];

const STEPS = ["Qué necesitas", "Meta y fecha", "Revisar"];

const EMPTY: WizardValues = {
  kind: "case",
  title: "",
  description: "",
  animal_id: "",
  event_at: "",
  event_place: "",
  image_url: "",
  goal_amount: "",
  ends_at: "",
};

/**
 * Publicar o editar una campaña en tres pasos, con vista previa en vivo.
 * La API valida todo de nuevo; aquí solo se evita avanzar con datos vacíos.
 */
export default function CampaignWizard({
  shelterId,
  shelterName,
  animals,
  campaignId,
  initial,
}: {
  shelterId: string;
  shelterName: string;
  animals: AnimalOption[];
  /** Si viene, se edita esa campaña en lugar de crear una nueva. */
  campaignId?: string;
  initial?: Partial<WizardValues>;
}) {
  const router = useRouter();
  const [v, setV] = useState<WizardValues>({
    ...EMPTY,
    ...(animals.length ? {} : { kind: "fund" as const }),
    ...initial,
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (patch: Partial<WizardValues>) => setV((x) => ({ ...x, ...patch }));

  const animal = animals.find((a) => a.id === v.animal_id);
  const photo = v.image_url || animal?.photo || null;
  const kind = KINDS.find((k) => k.id === v.kind)!;

  function stepError(): string {
    if (step === 0) {
      if (v.title.trim().length < 4) return "Escribe un título de al menos 4 letras.";
      if (v.kind === "case" && !v.animal_id) return "Elige a cuál de tus rescatados ayuda este caso.";
      if (v.kind === "event" && (!v.event_at || v.event_place.trim().length < 2))
        return "Un evento necesita fecha, hora y lugar.";
      if (v.description.trim().length < 10) return "Cuenta en al menos 10 letras qué se necesita.";
    }
    if (step === 1 && !(Number(v.goal_amount) >= 1)) return "Indica una meta de al menos S/ 1.";
    return "";
  }

  function next() {
    const e = stepError();
    setError(e);
    if (!e) setStep((s) => s + 1);
  }

  async function publish() {
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: campaignId ? "campaign_update" : "campaign",
          shelter_id: shelterId,
          ...(campaignId ? { id: campaignId } : {}),
          ...v,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      router.push(
        campaignId ? "/shelter/campaigns?guardada=1" : `/shelter/campaigns?publicada=${encodeURIComponent(d.slug)}`,
      );
      router.refresh();
    } catch (e) {
      setError((e as Error).message || "No se pudo guardar.");
      setBusy(false);
    }
  }

  const label = "block font-extrabold";
  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
      <div className="flex flex-col gap-5">
        <ol aria-label="Pasos" className="grid grid-cols-3 gap-2">
          {STEPS.map((s, i) => (
            <li
              key={s}
              aria-current={i === step ? "step" : undefined}
              className={cn("text-sm font-bold", i <= step ? "text-primary" : "text-muted-foreground")}
            >
              <span className={cn("mb-1.5 block h-1.5 rounded-full", i <= step ? "bg-primary" : "bg-track-border")} />
              {s}
            </li>
          ))}
        </ol>
        <p className="text-sm font-bold text-muted-foreground">
          Paso {step + 1} de {STEPS.length}
        </p>

        {step === 0 && (
          <div className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 font-extrabold">¿Qué tipo de campaña es?</legend>
              {KINDS.map((k) => {
                const disabled = k.id === "case" && !animals.length;
                return (
                  <label
                    key={k.id}
                    className={cn(
                      "flex min-h-16 cursor-pointer items-center gap-4 rounded-2xl border-2 bg-card p-4 transition-colors",
                      v.kind === k.id ? "border-primary" : "border-input hover:bg-secondary/50",
                      disabled && "cursor-not-allowed opacity-60",
                    )}
                  >
                    <input
                      type="radio"
                      name="kind"
                      value={k.id}
                      checked={v.kind === k.id}
                      disabled={disabled}
                      onChange={() => set({ kind: k.id })}
                      className="h-5 w-5 shrink-0 accent-primary"
                    />
                    <span>
                      <span className="block font-extrabold">{k.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {disabled ? "Primero registra a un rescatado." : k.hint}
                      </span>
                    </span>
                  </label>
                );
              })}
            </fieldset>

            <label className={label}>
              Título
              <input
                className="huellas-field font-normal"
                value={v.title}
                maxLength={120}
                placeholder={`Por ejemplo: ${kind.example}`}
                onChange={(e) => set({ title: e.target.value })}
              />
            </label>

            {v.kind === "case" && (
              <label className={label}>
                ¿Para cuál de tus rescatados?
                <select
                  className="huellas-field font-normal"
                  value={v.animal_id}
                  onChange={(e) => set({ animal_id: e.target.value })}
                >
                  <option value="">Elige uno</option>
                  {animals.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <span className="mt-1 block text-sm font-normal text-muted-foreground">
                  Si no subes una foto, usamos la suya.
                </span>
              </label>
            )}

            {v.kind === "event" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={label}>
                  Fecha y hora
                  <input
                    type="datetime-local"
                    className="huellas-field font-normal"
                    value={v.event_at}
                    onChange={(e) => set({ event_at: e.target.value })}
                  />
                </label>
                <label className={label}>
                  Lugar
                  <input
                    className="huellas-field font-normal"
                    value={v.event_place}
                    maxLength={160}
                    placeholder="Parque, local, veterinaria…"
                    onChange={(e) => set({ event_place: e.target.value })}
                  />
                </label>
              </div>
            )}

            <div>
              <p className={label}>Foto {v.kind === "case" ? "(opcional)" : "(recomendada)"}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {v.image_url && (
                  <span className="relative h-20 w-28 overflow-hidden rounded-2xl bg-muted">
                    <Image src={v.image_url} alt="Foto de la campaña" fill sizes="112px" className="object-cover" />
                  </span>
                )}
                <ImageUpload
                  shelterId={shelterId}
                  kind="campaign"
                  label={v.image_url ? "Cambiar foto" : "Subir una foto"}
                  onUploaded={(url) => set({ image_url: url })}
                />
                {v.image_url && (
                  <button
                    type="button"
                    onClick={() => set({ image_url: "" })}
                    className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-sm font-extrabold text-error-fg hover:bg-error-bg"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                    Quitar
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">JPG, PNG o WebP, hasta 4 MB.</p>
            </div>

            <label className={label}>
              Cuéntala en pocas líneas
              <textarea
                rows={5}
                maxLength={2000}
                className="huellas-field font-normal leading-relaxed"
                value={v.description}
                placeholder="Qué pasó, qué se necesita y en qué se usará el apoyo."
                onChange={(e) => set({ description: e.target.value })}
              />
            </label>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <label className={label}>
              Meta en soles
              <input
                type="number"
                inputMode="decimal"
                min={1}
                max={1000000}
                className="huellas-field font-normal"
                value={v.goal_amount}
                placeholder="Por ejemplo: 1200"
                onChange={(e) => set({ goal_amount: e.target.value })}
              />
              <span className="mt-1 block text-sm font-normal text-muted-foreground">
                Lo que necesitas reunir. Se muestra junto al avance.
              </span>
            </label>
            <label className={label}>
              Fecha límite (opcional)
              <input
                type="date"
                className="huellas-field font-normal"
                value={v.ends_at}
                onChange={(e) => set({ ends_at: e.target.value })}
              />
              <span className="mt-1 block text-sm font-normal text-muted-foreground">
                Al pasar esta fecha, la campaña se cierra sola. Sin fecha, sigue abierta hasta que la cierres.
              </span>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="rounded-[24px] bg-secondary p-5">
            <h2 className="text-xl">Revisa antes de {campaignId ? "guardar" : "publicar"}</h2>
            <p className="mt-1 text-sm leading-relaxed">
              {campaignId
                ? "Los cambios se ven de inmediato en HUELLAS."
                : "Tu campaña se verá en HUELLAS en cuanto tu albergue esté verificado. Después podrás compartirla por WhatsApp."}
            </p>
          </div>
        )}

        {error && (
          <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          {step > 0 && (
            <button type="button" onClick={() => { setError(""); setStep((s) => s - 1); }} className="huellas-button huellas-button--secondary flex-1">
              Atrás
            </button>
          )}
          {step < 2 ? (
            <button type="button" onClick={next} className="huellas-button flex-[1.4]">
              Siguiente: {STEPS[step + 1].toLowerCase()}
            </button>
          ) : (
            <button type="button" disabled={busy} onClick={publish} className="huellas-button huellas-button--support flex-[1.4]">
              {busy ? "Guardando…" : campaignId ? "Guardar cambios" : "Publicar campaña"}
            </button>
          )}
        </div>
      </div>

      {/* Vista previa en vivo */}
      <section aria-label="Vista previa" className="lg:sticky lg:top-24">
        <p className="mb-2 text-sm font-extrabold text-muted-foreground">Así se verá en HUELLAS</p>
        <div className="overflow-hidden rounded-[28px] border border-border bg-card">
          <div className="relative aspect-[16/10] bg-support-soft">
            {photo ? (
              <Image src={photo} alt="" fill sizes="(max-width: 1024px) 100vw, 40vw" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-support/30">
                <PawIcon className="h-12 w-12" />
              </div>
            )}
            <span className="absolute left-3 top-3 rounded-full bg-card px-3 py-1 text-xs font-extrabold">
              {kind.label.split(" ")[0]}
            </span>
            {v.kind === "case" && animal && (
              <span className="huellas-tag huellas-tag--sm absolute -bottom-4 left-4 text-lg">{animal.name}</span>
            )}
          </div>
          <div className="flex flex-col gap-2 p-5 pt-7">
            <p className="text-sm font-bold text-primary">{shelterName}</p>
            <p className="font-display text-xl font-semibold leading-tight">
              {v.title || kind.example}
            </p>
            {v.kind === "event" && (v.event_at || v.event_place) && (
              <p className="flex flex-col gap-1 text-sm font-semibold">
                {v.event_at && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-primary" aria-hidden="true" />
                    {new Date(v.event_at).toLocaleString("es-PE", { weekday: "long", day: "numeric", month: "long", hour: "numeric", minute: "2-digit" })}
                  </span>
                )}
                {v.event_place && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                    {v.event_place}
                  </span>
                )}
              </p>
            )}
            {v.goal_amount && Number(v.goal_amount) >= 1 && (
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Meta: {formatPEN(Number(v.goal_amount))}.</strong>
              </p>
            )}
            {v.description && <p className="line-clamp-3 text-sm text-muted-foreground">{v.description}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
