import { NextResponse } from "next/server";
import { z } from "zod";
import { currentActor } from "@/lib/huellas/auth";
import { sameOrigin } from "@/lib/huellas/domain";
import { saveOwnProfile } from "@/lib/huellas/profile";

const schema = z.object({
  full_name: z.string().trim().min(2).max(80),
  phone: z
    .union([z.literal(""), z.string().trim().regex(/^\d{9,15}$/)])
    .optional()
    .transform((p) => p || null),
});

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  const actor = await currentActor();
  if (!actor)
    return NextResponse.json({ error: "Inicia sesión para continuar" }, { status: 401 });
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success)
      return NextResponse.json(
        { error: "Revisa los datos: el nombre debe tener al menos 2 letras y el teléfono solo números (9 a 15)." },
        { status: 400 },
      );
    await saveOwnProfile(actor, parsed.data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar tu perfil." }, { status: 400 });
  }
}
