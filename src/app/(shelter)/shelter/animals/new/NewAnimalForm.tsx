"use client";

import { useState } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { LAMBAYEQUE_DISTRICTS } from "@/lib/ubigeo";

const schema = z.object({
  name: z.string().min(1, "El nombre es obligatorio").max(60),
  species: z.enum(["dog", "cat", "other"]),
  breed: z.string().max(60).optional(),
  age_months: z.string().optional(),
  size: z.enum(["small", "medium", "large"]),
  gender: z.enum(["male", "female", "unknown"]),
  color: z.string().max(60).optional(),
  description: z.string().min(20, "Mínimo 20 caracteres").max(1000),
  is_vaccinated: z.boolean(),
  is_neutered: z.boolean(),
  is_microchipped: z.boolean(),
  ubigeo: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

const SPECIES_OPTIONS = [
  { value: "dog", label: "Perro" },
  { value: "cat", label: "Gato" },
  { value: "other", label: "Otro" },
];
const SIZE_OPTIONS = [
  { value: "small", label: "Pequeño" },
  { value: "medium", label: "Mediano" },
  { value: "large", label: "Grande" },
];
const GENDER_OPTIONS = [
  { value: "male", label: "Macho" },
  { value: "female", label: "Hembra" },
  { value: "unknown", label: "Desconocido" },
];

function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  error,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            aria-pressed={value === opt.value}
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border-2 px-4 text-sm font-extrabold transition-colors",
              value === opt.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-foreground hover:border-primary/50",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}


/** Datos actuales de un animal, para editarlo con el mismo formulario. */
export type EditableAnimal = {
  id: string;
  slug: string;
  name: string;
  species: FormData["species"];
  breed: string | null;
  age_months: number | null;
  size: FormData["size"];
  gender: FormData["gender"];
  color: string | null;
  description: string | null;
  is_vaccinated: boolean;
  is_neutered: boolean;
  is_microchipped: boolean;
  ubigeo: string;
};

export default function NewAnimalForm({
  shelterId,
  animal,
}: {
  shelterId: string;
  /** Si se pasa, el formulario edita ese animal en lugar de registrar uno nuevo. */
  animal?: EditableAnimal;
}) {
  const editing = Boolean(animal);
  const [submitted, setSubmitted] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>(["", "", ""]);

  const {
    register,
    setError,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: animal
      ? {
          name: animal.name,
          species: animal.species,
          breed: animal.breed ?? "",
          age_months: animal.age_months != null ? String(animal.age_months) : "",
          size: animal.size,
          gender: animal.gender,
          color: animal.color ?? "",
          description: animal.description ?? "",
          is_vaccinated: animal.is_vaccinated,
          is_neutered: animal.is_neutered,
          is_microchipped: animal.is_microchipped,
          ubigeo: animal.ubigeo,
        }
      : {
          name: "",
          species: "dog",
          breed: "",
          age_months: "",
          size: "medium",
          gender: "unknown",
          color: "",
          description: "",
          is_vaccinated: false,
          is_neutered: false,
          is_microchipped: false,
          ubigeo: "140101",
        },
  });
  // useWatch es compatible con el React Compiler (watch() no lo es).
  const [species, size, gender, description] = useWatch({
    control,
    name: ["species", "size", "gender", "description"],
  });

  const onSubmit = async (data: FormData) => {
    const photos = photoUrls.filter(Boolean);
    const response = await fetch("/api/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        action: editing ? "animal_update" : "animal",
        id: animal?.id,
        shelter_id: shelterId,
        age_months: data.age_months ? Number(data.age_months) : null,
        photos: editing ? undefined : photos,
      }),
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
        <CheckCircle2 className="h-14 w-14 text-success-fg" aria-hidden="true" />
        <h2 className="text-2xl">{editing ? "Cambios guardados" : "Animal registrado"}</h2>
        <p className="max-w-sm text-sm text-muted-foreground">
          {editing
            ? "La ficha pública ya muestra los datos actualizados."
            : "Su ficha aparece en el portal mientras tu albergue esté verificado."}
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-3">
          <a href="/shelter/animals" className="huellas-button">
            Volver a animales
          </a>
          {animal && (
            <a href={`/adopt/${animal.slug}`} className="huellas-button huellas-button--secondary">
              Ver ficha pública
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 rounded-[28px] border border-border bg-card p-5 sm:p-7"
    >
      {/* Nombre */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">
          Nombre <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          placeholder="Ej: Rocky"
          {...register("name")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Especie */}
      <div className="flex flex-col gap-2">
        <Label>
          Especie <span className="text-destructive">*</span>
        </Label>
        <ToggleGroup
          options={SPECIES_OPTIONS}
          value={species}
          onChange={(v) => setValue("species", v as FormData["species"])}
          error={errors.species?.message}
        />
      </div>

      {/* Tamaño y Género */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>
            Tamaño <span className="text-destructive">*</span>
          </Label>
          <ToggleGroup
            options={SIZE_OPTIONS}
            value={size}
            onChange={(v) => setValue("size", v as FormData["size"])}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label>
            Género <span className="text-destructive">*</span>
          </Label>
          <ToggleGroup
            options={GENDER_OPTIONS}
            value={gender}
            onChange={(v) => setValue("gender", v as FormData["gender"])}
          />
        </div>
      </div>

      {/* Raza, Edad, Color */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="breed">Raza (opcional)</Label>
          <Input id="breed" placeholder="Mestizo" {...register("breed")} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="age_months">Edad en meses</Label>
          <Input
            id="age_months"
            type="number"
            inputMode="numeric"
            min="0"
            placeholder="18"
            {...register("age_months")}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            placeholder="Café con blanco"
            {...register("color")}
          />
        </div>
      </div>

      {/* Salud */}
      <div className="flex flex-col gap-2">
        <Label>Estado de salud</Label>
        <div className="flex flex-wrap gap-3">
          {[
            { key: "is_vaccinated", label: "Vacunado" },
            { key: "is_neutered", label: "Esterilizado" },
            { key: "is_microchipped", label: "Con microchip" },
          ].map(({ key, label }) => (
            <label
              key={key}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 border-border bg-card px-4 has-[:checked]:border-primary has-[:checked]:bg-secondary"
            >
              <input
                type="checkbox"
                {...register(key as keyof FormData)}
                className="accent-primary"
              />
              <span className="text-sm font-bold text-foreground">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distrito */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="ubigeo">
          Distrito <span className="text-destructive">*</span>
        </Label>
        <select
          id="ubigeo"
          {...register("ubigeo")}
          className="huellas-field mt-0"
        >
          {LAMBAYEQUE_DISTRICTS.map((d) => (
            <option key={d.ubigeo} value={d.ubigeo}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">
          Descripción <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Describe la personalidad, necesidades especiales, compatibilidad con niños u otras mascotas..."
          {...register("description")}
          aria-invalid={!!errors.description}
        />
        <div className="flex justify-between">
          {errors.description ? (
            <p className="text-xs text-destructive">
              {errors.description.message}
            </p>
          ) : (
            <span />
          )}
          <span className="text-xs text-muted-foreground">
            {description.length}/1000
          </span>
        </div>
      </div>

      {/* Fotos (solo al registrar; las fotos publicadas aún no se editan) */}
      {!editing && (
      <div className="flex flex-col gap-3">
        <div>
          <Label>Fotos (máx. 3)</Label>
          <p className="text-xs text-muted-foreground mt-1">
            La primera URL será la foto de portada. Usa HTTPS y un host
            autorizado en next.config.ts.
          </p>
        </div>
        {photoUrls.map((url, idx) => (
          <div key={idx} className="flex gap-3 items-center">
            <div className="h-14 w-14 shrink-0 rounded-lg border border-border bg-muted overflow-hidden flex items-center justify-center">
              {url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={url}
                  alt={`Preview ${idx + 1}`}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <ImageOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <Input
              placeholder={
                idx === 0
                  ? "URL de la foto de portada"
                  : `URL de la foto ${idx + 1} (opcional)`
              }
              value={url}
              onChange={(e) => {
                const updated = [...photoUrls];
                updated[idx] = e.target.value;
                setPhotoUrls(updated);
              }}
            />
          </div>
        ))}
      </div>
      )}

      {errors.root && (
        <p role="alert" className="rounded-2xl bg-error-bg p-3 text-sm text-error-fg">
          {errors.root.message}
        </p>
      )}
      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? "Guardando…" : editing ? "Guardar cambios" : "Registrar animal"}
      </Button>
    </form>
  );
}
