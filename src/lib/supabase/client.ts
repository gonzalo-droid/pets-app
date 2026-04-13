import { createBrowserClient } from '@supabase/ssr'

// Cliente para usar en Client Components ('use client')
// Crea una instancia singleton por pestaña del navegador.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
