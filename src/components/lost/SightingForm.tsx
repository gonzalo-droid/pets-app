'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

const sightingSchema = z.object({
  message: z
    .string()
    .min(10, 'Describe dónde lo viste (mínimo 10 caracteres)')
    .max(500, 'Máximo 500 caracteres'),
})

type SightingFormData = z.infer<typeof sightingSchema>

interface SightingFormProps {
  reportId: string
}

export default function SightingForm({ reportId }: SightingFormProps) {
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SightingFormData>({
    resolver: zodResolver(sightingSchema),
    defaultValues: { message: '' },
  })

  const onSubmit = async (data: SightingFormData) => {
    // Fase mock — cuando conectemos Supabase: insertar en lost_found_sightings
    await new Promise((r) => setTimeout(r, 600))
    console.log('Avistamiento enviado (mock):', { reportId, ...data })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-rescue/5 border border-rescue/20 px-4 py-3 text-sm text-center text-foreground">
        ¡Gracias! Tu avistamiento fue registrado. El dueño verá tu mensaje.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Label htmlFor="sighting-message" className="flex items-center gap-1.5">
        <MessageSquare className="h-4 w-4" />
        Agregar avistamiento
      </Label>
      <Textarea
        id="sighting-message"
        rows={3}
        placeholder="¿Dónde lo viste? Describe la calle, hora o cualquier detalle útil..."
        {...register('message')}
        aria-invalid={!!errors.message}
      />
      <div className="flex items-center justify-between gap-2">
        {errors.message ? (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        ) : (
          <p className="text-xs text-muted-foreground">{watch('message').length}/500</p>
        )}
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Publicar avistamiento'}
        </Button>
      </div>
    </form>
  )
}
