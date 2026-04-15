'use client'

import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { Eye, EyeOff, User, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
// import { createBrowserClient } from '@/lib/supabase/client'

const schema = z
  .object({
    full_name: z.string().min(2, 'Mínimo 2 caracteres').max(100),
    email: z.string().min(1, 'El correo es obligatorio').email('Correo inválido'),
    password: z
      .string()
      .min(8, 'Mínimo 8 caracteres')
      .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe tener al menos un número'),
    confirm_password: z.string().min(1, 'Confirma tu contraseña'),
    role: z.enum(['user', 'shelter']),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Las contraseñas no coinciden',
    path: ['confirm_password'],
  })

type FormData = z.infer<typeof schema>

const ROLE_OPTIONS = [
  {
    value: 'user',
    icon: User,
    label: 'Adoptante',
    description: 'Quiero adoptar o reportar animales',
  },
  {
    value: 'shelter',
    icon: Building2,
    label: 'Albergue',
    description: 'Gestiono un albergue o rescato animales',
  },
] as const

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { role: 'user' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      // ── Supabase Auth (activar cuando conectemos DB) ──────────────────
      // const supabase = createBrowserClient()
      // const { data: authData, error } = await supabase.auth.signUp({
      //   email: data.email,
      //   password: data.password,
      //   options: {
      //     data: { full_name: data.full_name, role: data.role },
      //   },
      // })
      // if (error) throw error
      // // Insert profile row (trigger o manual según la DB)
      // if (authData.user) {
      //   await supabase.from('users').insert({
      //     id: authData.user.id,
      //     email: data.email,
      //     full_name: data.full_name,
      //     role: data.role,
      //   })
      // }
      // ─────────────────────────────────────────────────────────────────

      // Mock: simular delay
      await new Promise((r) => setTimeout(r, 900))
      console.log('Registro mock:', { email: data.email, role: data.role })
      setDone(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al registrarse'
      if (msg.includes('already registered')) {
        setServerError('Ya existe una cuenta con ese correo.')
      } else {
        setServerError(msg)
      }
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-400/10">
          <User className="h-8 w-8 text-brand-400" />
        </div>
        <h2 className="font-display font-bold text-xl">¡Cuenta creada!</h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          Revisa tu correo para confirmar tu cuenta y empieza a usar PawRescue.
        </p>
        <Link
          href="/auth/login"
          className="mt-2 text-sm font-medium text-brand-400 hover:underline"
        >
          Ir a iniciar sesión →
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display font-bold text-2xl text-foreground">Crear cuenta</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Únete a la comunidad PawRescue
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        {/* Tipo de cuenta */}
        <div className="flex flex-col gap-2">
          <Label>Tipo de cuenta</Label>
          <div className="grid grid-cols-2 gap-3">
            {ROLE_OPTIONS.map(({ value, icon: Icon, label, description }) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue('role', value)}
                className={cn(
                  'flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-colors',
                  selectedRole === value
                    ? 'border-brand-400 bg-brand-400/5 text-brand-400'
                    : 'border-border text-muted-foreground hover:border-brand-400/40'
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{label}</span>
                <span className="text-xs leading-tight opacity-80">{description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="full_name">Nombre completo</Label>
          <Input
            id="full_name"
            placeholder="María García"
            autoComplete="name"
            aria-invalid={!!errors.full_name}
            {...register('full_name')}
          />
          {errors.full_name && (
            <p className="text-xs text-destructive">{errors.full_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              className="pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : (
            <p className="text-xs text-muted-foreground">Al menos 8 caracteres, una mayúscula y un número.</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="confirm_password">Confirmar contraseña</Label>
          <div className="relative">
            <Input
              id="confirm_password"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repite tu contraseña"
              autoComplete="new-password"
              aria-invalid={!!errors.confirm_password}
              className="pr-10"
              {...register('confirm_password')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm_password && (
            <p className="text-xs text-destructive">{errors.confirm_password.message}</p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full mt-1">
          {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          Al registrarte aceptas nuestros{' '}
          <Link href="/terms" className="underline hover:text-foreground">
            Términos de uso
          </Link>{' '}
          y{' '}
          <Link href="/privacy" className="underline hover:text-foreground">
            Política de privacidad
          </Link>
          .
        </p>
      </form>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{' '}
        <Link href="/auth/login" className="font-medium text-brand-400 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
