"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
      className="flex items-start gap-3 p-4 rounded-lg border border-border hover:border-primary/40 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-accent/40"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
      />
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
    </label>
  );
}

// ─── Formulario principal ─────────────────────────────────────────────────────

export default function AdoptionForm({
  animalSlug,
  animalName,
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
      phone: "",
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
        <h2 className="text-xl font-bold text-foreground">
          ¡Solicitud enviada!
        </h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          El albergue revisará tu solicitud y se pondrá en contacto contigo por
          teléfono en los próximos días. ¡Gracias por querer darle un hogar a{" "}
          {animalName}!
        </p>
        <Link href="/adopt" className="mt-2 text-sm text-primary hover:underline">
          Ver más animales en adopción →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7">
      {/* Perfil del hogar */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Tu hogar</h2>
        <p className="text-xs text-muted-foreground -mt-1">
          Esta información ayuda al albergue a evaluar la compatibilidad.
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
        <Label htmlFor="phone">
          Número de contacto <span className="text-destructive">*</span>
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="987654321"
          inputMode="numeric"
          {...register("phone")}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p className="text-xs text-destructive">{errors.phone.message}</p>
        )}
        <p className="text-xs text-muted-foreground">
          El albergue usará este número para contactarte. No se muestra
          públicamente.
        </p>
      </section>

      {/* Mensaje */}
      <section className="flex flex-col gap-2">
        <Label htmlFor="message">
          ¿Por qué quieres adoptar a {animalName}?{" "}
          <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="message"
          rows={5}
          placeholder={`Cuéntanos sobre tu estilo de vida, por qué ${animalName} encajaría en tu hogar y qué puedes ofrecerle...`}
          {...register("message")}
          aria-invalid={!!errors.message}
        />
        <div className="flex justify-between">
          {errors.message ? (
            <p className="text-xs text-destructive">{errors.message.message}</p>
          ) : (
            <span />
          )}
          <p className="text-xs text-muted-foreground">
            {message.length}/1000
          </p>
        </div>
      </section>

      {/* Submit */}
      {errors.root && (
        <p role="alert" className="text-red-600">
          {errors.root.message}
        </p>
      )}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting
          ? "Enviando solicitud..."
          : "Enviar solicitud de adopción"}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Al enviar, aceptas que el albergue revise tu información de contacto.
      </p>
    </form>
  );
}
