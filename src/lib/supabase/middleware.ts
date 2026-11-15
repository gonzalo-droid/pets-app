import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Helper que refresca la sesión de Supabase en cada request.
// Requerido por @supabase/ssr para mantener los tokens actualizados.
// `requestHeaders`: cabeceras de la petición que deben llegar a las páginas
// (por ejemplo, la ruta pedida para volver a ella tras iniciar sesión).
export async function updateSession(
  request: NextRequest,
  requestHeaders: Headers = request.headers,
) {
  let supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          // Las páginas deben recibir los tokens recién renovados.
          requestHeaders.set("cookie", request.headers.get("cookie") ?? "");
          supabaseResponse = NextResponse.next({ request: { headers: requestHeaders } });
          Object.entries(headers ?? {}).forEach(([name, value]) =>
            supabaseResponse.headers.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresca la sesión — no eliminar este bloque.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
