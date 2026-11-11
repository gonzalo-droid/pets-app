import { NextResponse } from "next/server";
import { z } from "zod";
import { currentActor } from "@/lib/huellas/auth";
import { sameOrigin } from "@/lib/huellas/domain";
import { registerShelter } from "@/lib/huellas/onboarding";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(10).max(1000),
  ubigeo: z.string().regex(/^\d{6}$/),
  whatsapp: z
    .union([z.literal(""), z.string().trim().regex(/^\d{9,15}$/)])
    .optional()
    .transform((v) => v || null),
  responsible: z.literal("on"),
});

export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  const actor = await currentActor();
  if (!actor)
    return NextResponse.json({ error: "Inicia sesión para continuar" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success)
    return NextResponse.json(
      { error: "Revisa los datos: nombre, descripción de al menos 10 letras, distrito y la confirmación." },
      { status: 400 },
    );
  try {
    const { responsible: _ok, ...values } = parsed.data;
    await registerShelter(actor, values);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
