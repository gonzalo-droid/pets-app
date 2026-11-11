import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeRedirect } from "@/lib/huellas/domain";

/**
 * Vuelta desde los enlaces de correo de Supabase (p. ej. recuperar contraseña):
 * cambia el código por una sesión y lleva a la página indicada.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeRedirect(url.searchParams.get("next"), "/profile");
  if (code) {
    const { error } = await (await createClient()).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/auth/forgot?vencido=1", url.origin));
}
