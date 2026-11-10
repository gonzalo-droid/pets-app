import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { isDemo } from "@/lib/huellas/config";
export async function proxy(request: NextRequest) {
  if (isDemo()) return NextResponse.next();
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
    return new NextResponse(
      "Configura Supabase o inicia la demo local con npm run dev.",
      { status: 503 },
    );
  return (await updateSession(request)).supabaseResponse;
}
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
