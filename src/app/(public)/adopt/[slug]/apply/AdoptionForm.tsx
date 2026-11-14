"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";

// ─── Schema de validación ──────────────────────────────────────────────────────

const adoptionSchema = z.object({
  has_home: z.boolean(),
  has_other_pets: z.boolean(),
  has_children: z.boolean(),
  phone: z
    .string()
    .min(9, "Ingresa un número de al menos 9 dígitos")
    .max(15, "El número es demasiado largo")
    .regex(/^\d+$/, "Solo dígitos, sin espacios ni guiones"),
  message: z
    .string()
    .min(30, "Cuéntanos más sobre ti (mínimo 30 caracteres)")
    .max(1000, "Máximo 1000 caracteres"),
});

type AdoptionFormData = z.infer<typeof adoptionSchema>;

interface AdoptionFormProps {
  animalSlug: string;
  animalName: string;
  /** Teléfono guardado en "Mi perfil", para no escribirlo de nuevo. */
  defaultPhone?: string;
}

// ─── Componente de checkbox con label ─────────────────────────────────────────

function CheckField({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border-2 border-input bg-card p-4 transition-colors hover:bg-secondary/50 has-[:checked]:border-primary has-[:checked]:bg-secondary/60"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-6 w-6 shrink-0 accent-primary"
      />
      <div>
        <p className="font-bold text-foreground">{label}</p>
        {description && (
          <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

// ─── Formulario principal ─────────────────────────────────────────────────────

export default function AdoptionForm({
  animalSlug,
  animalName,
  defaultPhone = "",
}: AdoptionFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    setError,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AdoptionFormData>({
    resolver: zodResolver(adoptionSchema),
    defaultValues: {
      has_home: false,
      has_other_pets: false,
      has_children: false,
      phone: defaultPhone,
      message: "",
    },
  });
  // useWatch es compatible con el React Compiler (watch() no lo es).
  const [hasHome, hasOtherPets, hasChildren, message] = useWatch({
    control,
    name: ["has_home", "has_other_pets", "has_children", "message"],
  });

  const onSubmit = async (data: AdoptionFormData) => {
    const response = await fetch("/api/support", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, kind: "adoption", slug: animalSlug }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError("root", { message: result.error });
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <CheckCircle2 className="h-16 w-16 text-primary" />
        <h2 className="text-2xl text-foreground">
          Solicitud enviada
        </h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          El albergue revisará tu solicitud y se pondrá en contacto contigo por
          teléfono en los próximos días. ¡Gracias por querer darle un hogar a{" "}
          {animalName}!
        </p>
        <Link href="/profile?tab=solicitudes" className="huellas-button mt-2">
          Ver mis solicitudes
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
      {/* Perfil del hogar */}
      <section className="flex flex-col gap-3">
        <h2 className="text-xl text-foreground">Tu hogar</h2>
        <p className="text-sm text-muted-foreground -mt-1">
          Ayuda al albergue a saber si {animalName} estará a gusto. Marca lo que corresponda.
        </p>
        <CheckField
          id="has_home"
          label="Tengo patio o espacio exterior"
          description="Jardín, terraza o zona donde el animal pueda moverse libremente."
          checked={hasHome}
          onChange={(v) => setValue("has_home", v)}
        />
        <CheckField
          id="has_other_pets"
          label="Ya tengo otras mascotas"
          description="Perros, gatos u otras mascotas que conviven en casa."
          checked={hasOtherPets}
          onChange={(v) => setValue("has_other_pets", v)}
        />
        <CheckField
          id="has_children"
          label="Hay niños en casa"
          description="Menores de 12 años que vivirán con el animal."
          checked={hasChildren}
          onChange={(v) => setValue("has_children", v)}
        />
      </section>

      {/* Contacto */}
      <section className="flex flex-col gap-2">
        <label htmlFor="phone" className="font-extrabold">
          Tu teléfono
        </label>
        <input
          id="phone"
          type="tel"
          placeholder="987654321"
          inputMode="numeric"
          autoComplete="tel"
          required
          className="huellas-field mt-0 text-base"
          {...register("phone")}
          aria-invalid={!!errors.phone}
          aria-describedby="phone-hint"
        />
        {errors.phone && (
          <p role="alert" className="text-sm text-error-fg">{errors.phone.message}</p>
        )}
        <p id="phone-hint" className="text-sm text-muted-foreground">
          Solo lo ve el albergue, para llamarte.
        </p>
      </section>

      {/* Mensaje */}
      <section className="flex flex-col gap-2">
        <label htmlFor="message" className="font-extrabold">
          ¿Por qué quieres adoptar a {animalName}?
        </label>
        <textarea
          id="message"
          rows={5}
          required
          placeholder="Cuéntanos cómo es tu casa, tu rutina y qué le ofrecerías."
          className="huellas-field mt-0 text-base leading-relaxed"
          {...register("message")}
          aria-invalid={!!errors.message}
        />
        <div className="flex justify-between gap-3">
          {errors.message ? (
            <p role="alert" className="text-sm text-error-fg">{errors.message.message}</p>
          ) : (
            <span />
          )}
          <p className="shrink-0 text-sm text-muted-foreground">
            {message.length} de 1000
          </p>
        </div>
      </section>

      {/* Submit */}
      {errors.root && (
        <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">
          {errors.root.message}
        </p>
      )}
      <button type="submit" disabled={isSubmitting} className="huellas-button min-h-[52px] text-base">
        {isSubmitting ? "Enviando…" : "Enviar solicitud"}
      </button>

      <p className="text-sm text-muted-foreground text-center">
        Al enviar, aceptas que el albergue revise tu información de contacto.
      </p>
    </form>
  );
}
