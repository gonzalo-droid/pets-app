import { NextResponse } from "next/server";
import { z } from "zod";
import { currentActor } from "@/lib/huellas/auth";
import { canManage, sameOrigin } from "@/lib/huellas/domain";
import { storeImage, UPLOAD_KINDS } from "@/lib/huellas/uploads";

/** Sube una imagen del albergue y devuelve su URL. No modifica ninguna ficha. */
export async function POST(request: Request) {
  if (!sameOrigin(request))
    return NextResponse.json({ error: "Origen inválido" }, { status: 403 });
  const actor = await currentActor();
  if (!actor)
    return NextResponse.json({ error: "Inicia sesión para continuar" }, { status: 401 });
  try {
    const form = await request.formData();
    const shelterId = z.string().min(1).parse(form.get("shelter_id") ?? actor.shelter_id);
    const kind = z.enum(UPLOAD_KINDS).parse(form.get("kind"));
    const file = form.get("file");
    if (!(file instanceof File)) throw new Error("Elige una imagen.");
    if (!canManage(actor, shelterId))
      return NextResponse.json({ error: "No tienes acceso a este albergue" }, { status: 403 });
    const url = await storeImage(file, shelterId, kind);
    return NextResponse.json({ url });
  } catch (e) {
    const message =
      e instanceof Error && !(e instanceof z.ZodError) ? e.message : "No se pudo subir la imagen.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
