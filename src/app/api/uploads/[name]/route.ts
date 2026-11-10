import { isDemo } from "@/lib/huellas/config";
import { readDemoUpload } from "@/lib/huellas/uploads";

/** Sirve las imágenes subidas en la demo local. En modo conectado no existe. */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  if (!isDemo()) return new Response("No encontrado", { status: 404 });
  const file = await readDemoUpload((await params).name);
  if (!file) return new Response("No encontrado", { status: 404 });
  return new Response(new Uint8Array(file.data), {
    headers: { "Content-Type": file.contentType, "Cache-Control": "public, max-age=31536000, immutable" },
  });
}
