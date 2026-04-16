import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  // Saltar auth si está desactivado explícitamente o si Supabase aún no está configurado
  const supabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (process.env.SKIP_AUTH_MIDDLEWARE === 'true' || !supabaseConfigured) {
    return NextResponse.next()
  }

  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Proteger rutas del panel de albergue
  if (pathname.startsWith('/shelter')) {
    if (!user) {
      const loginUrl = request.nextUrl.clone()
      loginUrl.pathname = '/auth/login'
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar rol de albergue — requiere consulta adicional a profiles
    // cuando conectemos Supabase. Por ahora la sesión es suficiente.
    // TODO: verificar user.app_metadata.role === 'shelter'
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Proteger rutas /shelter/*
    '/shelter/:path*',
    // Excluir archivos estáticos y rutas de API de Next.js
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
