'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { LAMBAYEQUE_DISTRICTS } from '@/lib/ubigeo'

// ─── Schema ───────────────────────────────────────────────────────────────────

const lostReportSchema = z.object({
  type: z.enum(['lost', 'found']),
  description: z
    .string()
    .min(20, 'Describe al animal con más detalle (mínimo 20 caracteres)')
    .max(800, 'Máximo 800 caracteres'),
  last_seen_at: z.string().min(1, 'Indica la fecha en que lo viste'),
  last_seen_address: z.string().min(5, 'Ingresa una dirección o referencia').max(300),
  ubigeo: z.string().min(6, 'Selecciona el distrito'),
  contact_phone: z
    .string()
    .min(9, 'Ingresa un número válido')
    .max(15)
    .regex(/^\d+$/, 'Solo dígitos'),
  // String en el form; se convierte a número en onSubmit
  reward_amount: z.string().optional(),
})

type LostReportFormData = z.infer<typeof lostReportSchema>

// ─── Componente ───────────────────────────────────────────────────────────────

export default function LostReportForm() {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LostReportFormData>({
    resolver: zodResolver(lostReportSchema) as Resolver<LostReportFormData>,
    defaultValues: {
      type: 'lost',
      description: '',
      last_seen_at: new Date().toISOString().split('T')[0],
      last_seen_address: '',
      ubigeo: '140101', // Chiclayo por defecto
      contact_phone: '',
      reward_amount: '',
    },
  })

  const selectedType = watch('type')

  const onSubmit = async (data: LostReportFormData) => {
    // Fase mock — cuando conectemos Supabase: insertar en lost_found_reports
    const payload = {
      ...data,
      reward_amount: data.reward_amount ? Number(data.reward_amount) : null,
    }
    await new Promise((r) => setTimeout(r, 700))
    console.log('Reporte enviado (mock):', payload)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <CheckCircle2 className="h-16 w-16 text-primary" />
        <h2 className="text-xl font-bold text-foreground">¡Reporte publicado!</h2>
        <p className="text-muted-foreground max-w-sm text-sm">
          Tu reporte ya es visible en la comunidad. Si alguien reconoce al animal,
          verá tu número de contacto directamente.
        </p>
        <a href="/lost" className="mt-2 text-sm text-primary hover:underline">
          Ver todos los reportes →
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Tipo de reporte */}
      <div className="flex flex-col gap-2">
        <Label>Tipo de reporte <span className="text-destructive">*</span></Label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'lost', icon: '🔍', label: 'Perdido', desc: 'Busco a mi mascota' },
            { value: 'found', icon: '📍', label: 'Encontrado', desc: 'Encontré un animal' },
          ].map(({ value, icon, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => setValue('type', value as 'lost' | 'found')}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 text-center transition-colors',
                selectedType === value
                  ? 'border-primary bg-accent/40'
                  : 'border-border hover:border-primary/40'
              )}
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-sm font-semibold text-foreground">{label}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </button>
          ))}
        </div>
        {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
      </div>

      {/* Descripción */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="description">
          Descripción del animal <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Ej: Perro mestizo, color café con blanco, collar rojo, responde al nombre Toby. Tiene una mancha en la oreja derecha..."
          {...register('description')}
          aria-invalid={!!errors.description}
        />
        <div className="flex justify-between">
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description.message}</p>
          ) : (
            <span className="text-xs text-muted-foreground">
              Incluye especie, color, marcas, collar y nombre si lo sabes
            </span>
          )}
          <span className="text-xs text-muted-foreground shrink-0">{watch('description').length}/800</span>
        </div>
      </div>

      {/* Fecha y lugar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="last_seen_at">
            Fecha {selectedType === 'lost' ? 'del extravío' : 'en que lo encontraste'}{' '}
            <span className="text-destructive">*</span>
          </Label>
          <Input
            id="last_seen_at"
            type="date"
            {...register('last_seen_at')}
            aria-invalid={!!errors.last_seen_at}
          />
          {errors.last_seen_at && (
            <p className="text-xs text-destructive">{errors.last_seen_at.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="ubigeo">
            Distrito <span className="text-destructive">*</span>
          </Label>
          <select
            id="ubigeo"
            {...register('ubigeo')}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {LAMBAYEQUE_DISTRICTS.map((d) => (
              <option key={d.ubigeo} value={d.ubigeo}>
                {d.label}
              </option>
            ))}
          </select>
          {errors.ubigeo && (
            <p className="text-xs text-destructive">{errors.ubigeo.message}</p>
          )}
        </div>
      </div>

      {/* Dirección */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="last_seen_address">
          Dirección o referencia <span className="text-destructive">*</span>
        </Label>
        <Input
          id="last_seen_address"
          placeholder="Ej: Calle Los Pinos 234, frente al parque central"
          {...register('last_seen_address')}
          aria-invalid={!!errors.last_seen_address}
        />
        {errors.last_seen_address && (
          <p className="text-xs text-destructive">{errors.last_seen_address.message}</p>
        )}
      </div>

      {/* Contacto y recompensa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="contact_phone">
            Teléfono de contacto <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contact_phone"
            type="tel"
            inputMode="numeric"
            placeholder="987654321"
            {...register('contact_phone')}
            aria-invalid={!!errors.contact_phone}
          />
          {errors.contact_phone && (
            <p className="text-xs text-destructive">{errors.contact_phone.message}</p>
          )}
          <p className="text-xs text-muted-foreground">Se mostrará públicamente en el reporte</p>
        </div>

        {selectedType === 'lost' && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="reward_amount">Recompensa en S/ (opcional)</Label>
            <Input
              id="reward_amount"
              type="number"
              inputMode="numeric"
              placeholder="0"
              min="0"
              {...register('reward_amount')}
              aria-invalid={!!errors.reward_amount}
            />
            {errors.reward_amount && (
              <p className="text-xs text-destructive">{errors.reward_amount.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Submit */}
      <Button type="submit" size="lg" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? 'Publicando reporte...' : 'Publicar reporte'}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        El reporte será visible públicamente. Tu número de contacto se mostrará en él.
      </p>
    </form>
  )
}
