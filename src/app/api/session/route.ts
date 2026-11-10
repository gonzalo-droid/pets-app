import { sameOrigin } from "@/lib/huellas/domain";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { currentActor, demoToken } from "@/lib/huellas/auth";
import { isDemo } from "@/lib/huellas/config";
import { createClient } from "@/lib/supabase/server";
import { safeRedirect } from "@/lib/huellas/domain";
export async function GET() {
  return NextResponse.json(
    { actor: await currentActor(), demo: isDemo() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  try {
    const body = await request.json();
    if (body.action === "logout") {
      (await cookies()).delete("huellas_demo");
      if (!isDemo()) await (await createClient()).auth.signOut();
      return NextResponse.json({ redirect: "/" });
    }
    if (isDemo()) {
      (await cookies()).set("huellas_demo", demoToken(body.demoRole), {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 28800,
      });
    } else {
      const { email, password } = z
        .object({ email: z.email(), password: z.string().min(8).max(128) })
        .parse(body);
      const db = await createClient();
      if (body.action === "register") {
        const { error } = await db.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: z.string().min(2).max(80).parse(body.full_name),
            },
          },
        });
        if (error)
          throw new Error(
            "No se pudo registrar. Revisa los datos o intenta iniciar sesión.",
          );
        return NextResponse.json({
          message:
            "Revisa tu correo para confirmar la cuenta y luego inicia sesión.",
        });
      }
      const { error } = await db.auth.signInWithPassword({ email, password });
      if (error)
        return NextResponse.json(
          { error: "Correo o contraseña incorrectos." },
          { status: 401 },
        );
    }
    const actor = await currentActor();
    return NextResponse.json({
      redirect:
        actor?.role === "admin"
          ? "/admin"
          : actor?.role === "shelter"
            ? "/shelter/dashboard"
            : safeRedirect(body.redirectTo, "/profile"),
    });
  } catch {
    return NextResponse.json(
      { error: "Solicitud inválida. Revisa los campos." },
      { status: 400 },
    );
  }
}
