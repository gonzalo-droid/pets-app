import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isDemo } from "@/lib/huellas/config";
// Las páginas que piden sesión leen esta cabecera para volver a la misma
// ruta después de iniciar sesión.
const PATH_HEADER = "x-huellas-path";

export async function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(PATH_HEADER, request.nextUrl.pathname + request.nextUrl.search);
  if (isDemo()) return NextResponse.next({ request: { headers } });
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
    return new NextResponse(
      "Configura Supabase o inicia la demo local con npm run dev.",
      { status: 503 },
    );
  return (await updateSession(request, headers)).supabaseResponse;
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
