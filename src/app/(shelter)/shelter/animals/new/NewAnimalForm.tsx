'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, ImageOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { LAMBAYEQUE_DISTRICTS } from '@/lib/ubigeo'

const schema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(60),
  species: z.enum(['dog', 'cat', 'other']),
  breed: z.string().max(60).optional(),
  age_months: z.string().optional(),
  size: z.enum(['small', 'medium', 'large']),
  gender: z.enum(['male', 'female', 'unknown']),
  color: z.string().max(60).optional(),
  description: z.string().min(20, 'Mínimo 20 caracteres').max(1000),
  is_vaccinated: z.boolean(),
  is_neutered: z.boolean(),
  is_microchipped: z.boolean(),
  ubigeo: z.string().min(6),
})

type FormData = z.infer<typeof schema>

const SPECIES_OPTIONS = [{ value: 'dog', label: '🐶 Perro' }, { value: 'cat', label: '🐱 Gato' }, { value: 'other', label: '🐾 Otro' }]
const SIZE_OPTIONS = [{ value: 'small', label: 'Pequeño' }, { value: 'medium', label: 'Mediano' }, { value: 'large', label: 'Grande' }]
const GENDER_OPTIONS = [{ value: 'male', label: 'Macho' }, { value: 'female', label: 'Hembra' }, { value: 'unknown', label: 'Desconocido' }]

function ToggleGroup<T extends string>({
  options, value, onChange, error,
}: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; error?: string }) {
  return (
    <div>
      <div className="flex gap-2 flex-wrap">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
              value === opt.value
                ? 'border-brand-400 bg-brand-400 text-white'
                : 'border-border text-muted-foreground hover:border-brand-400/40'
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  )
}

const PLACEHOLDER_URL = 'https://placehold.co/600x400/e2e8f0/94a3b8?text=Sin+foto'

export default function NewAnimalForm() {
  const [submitted, setSubmitted] = useState(false)
  const [photoUrls, setPhotoUrls] = useState<string[]>(['', '', ''])

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: {
      name: '', species: 'dog', breed: '', age_months: '',
      size: 'medium', gender: 'unknown', color: '',
      description: '', is_vaccinated: false, is_neutered: false,
      is_microchipped: false, ubigeo: '140101',
    },
  })

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 800))
    const filledUrls = photoUrls.filter(Boolean)
    const photos = filledUrls.length > 0 ? filledUrls : [PLACEHOLDER_URL]
    console.log('Animal publicado (mock):', { ...data, photos })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <CheckCircle2 className="h-14 w-14 text-adopt" />
        <h2 className="font-display font-bold text-xl">¡Animal publicado!</h2>
        <p className="text-muted-foreground text-sm max-w-sm">
          Ya aparece en el feed público de adopciones.
        </p>
        <div className="flex gap-3 mt-2">
          <a href="/shelter/animals" className="text-sm text-brand-400 hover:underline">← Volver a mis animales</a>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Nombre */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nombre <span className="text-destructive">*</span></Label>
        <Input id="name" placeholder="Ej: Rocky" {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
      </div>

      {/* Especie */}
      <div className="flex flex-col gap-2">
        <Label>Especie <span className="text-destructive">*</span></Label>
        <ToggleGroup options={SPECIES_OPTIONS} value={watch('species')} onChange={(v) => setValue('species', v as FormData['species'])} error={errors.species?.message} />
      </div>

      {/* Tamaño y Género */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label>Tamaño <span className="text-destructive">*</span></Label>
          <ToggleGroup options={SIZE_OPTIONS} value={watch('size')} onChange={(v) => setValue('size', v as FormData['size'])} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Género <span className="text-destructive">*</span></Label>
          <ToggleGroup options={GENDER_OPTIONS} value={watch('gender')} onChange={(v) => setValue('gender', v as FormData['gender'])} />
        </div>
      </div>

      {/* Raza, Edad, Color */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="breed">Raza (opcional)</Label>
          <Input id="breed" placeholder="Mestizo" {...register('breed')} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="age_months">Edad en meses</Label>
          <Input id="age_months" type="number" inputMode="numeric" min="0" placeholder="18" {...register('age_months')} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="color">Color</Label>
          <Input id="color" placeholder="Café con blanco" {...register('color')} />
        </div>
      </div>

      {/* Salud */}
      <div className="flex flex-col gap-2">
        <Label>Estado de salud</Label>
        <div className="flex flex-wrap gap-3">
          {[
            { key: 'is_vaccinated', label: '💉 Vacunado' },
            { key: 'is_neutered', label: '✂️ Castrado/a' },
            { key: 'is_microchipped', label: '📡 Microchip' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register(key as keyof FormData)}
                className="accent-primary"
              />
              <span className="text-sm text-foreground">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Distrito */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="ubigeo">Distrito <span className="text-destructive">*</span></Label>
        <select
          id="ubigeo"
          {...register('ubigeo')}
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {LAMBAYEQUE_DISTRICTS.map((d) => (
            <option key={d.ubigeo} value={d.ubigeo}>{d.label}</option>
          ))}
        </select>
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descripción <span className="text-destructive">*</span></Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Describe la personalidad, necesidades especiales, compatibilidad con niños u otras mascotas..."
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        <div className="flex justify-between">
          {errors.description
            ? <p className="text-xs text-destructive">{errors.description.message}</p>
            : <span />}
          <span className="text-xs text-muted-foreground">{watch('description').length}/1000</span>
        </div>
      </div>

      {/* Fotos */}
      <div className="flex flex-col gap-3">
        <div>
          <Label>Fotos (máx. 3)</Label>
          <p className="text-xs text-muted-foreground mt-1">La primera URL será la foto de portada.</p>
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
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                />
              ) : (
                <ImageOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <Input
              placeholder={idx === 0 ? 'URL de la foto de portada' : `URL de la foto ${idx + 1} (opcional)`}
              value={url}
              onChange={(e) => {
                const updated = [...photoUrls]
                updated[idx] = e.target.value
                setPhotoUrls(updated)
              }}
            />
          </div>
        ))}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? 'Publicando...' : 'Publicar animal'}
      </Button>
    </form>
  )
}
