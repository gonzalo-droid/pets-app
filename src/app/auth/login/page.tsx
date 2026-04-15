'use client'

import { Suspense, useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { findMockUser, setMockSession } from '@/lib/mock/users'
// import { createBrowserClient } from '@/lib/supabase/client'

const schema = z.object({
  email: z.string().min(1, 'El correo es obligatorio').email('Correo inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormData = z.infer<typeof schema>

function LoginForm() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/'
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
  })

  const onSubmit = async (data: FormData) => {
    setServerError(null)
    try {
      // ── Supabase Auth (activar cuando conectemos DB) ──────────────────
      // const supabase = createBrowserClient()
      // const { error } = await supabase.auth.signInWithPassword({
      //   email: data.email,
      //   password: data.password,
      // })
      // if (error) throw error
      // window.location.href = redirectTo
      // ─────────────────────────────────────────────────────────────────

      // Mock: validar contra usuarios de prueba
      await new Promise((r) => setTimeout(r, 600))
      const mockUser = findMockUser(data.email, data.password)
      if (!mockUser) {
        setServerError('Correo o contraseña incorrectos.')
        return
      }
      setMockSession(mockUser)
      // Albergues van al panel; usuarios normales van a redirectTo o home
      const destination = mockUser.role === 'shelter' ? mockUser.redirectTo : redirectTo
      window.location.href = destination
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión'
      if (msg.includes('Invalid login credentials')) {
        setServerError('Correo o contraseña incorrectos.')
      } else {
        setServerError(msg)
      }
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="font-display font-bold text-2xl text-foreground">Iniciar sesión</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Bienvenido de vuelta a PawRescue
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-muted-foreground hover:text-brand-400 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
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
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full mt-1">
          {isSubmitting ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">o</span>
        </div>
      </div>

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?{' '}
        <Link href="/auth/register" className="font-medium text-brand-400 hover:underline">
          Regístrate gratis
        </Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
