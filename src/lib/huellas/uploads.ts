import { randomUUID } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { isDemo } from "./config";
import { createClient } from "@/lib/supabase/server";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB (también límite del bucket)
export const UPLOAD_KINDS = ["avatar", "banner", "animal"] as const;
export type UploadKind = (typeof UPLOAD_KINDS)[number];

const BUCKET = "huellas";
const DEMO_DIR = path.join(process.cwd(), ".huellas-demo", "uploads");
export const DEMO_UPLOAD_PREFIX = "/api/uploads/";

/** Tipo real de la imagen según sus primeros bytes (no según el nombre). */
export function detectImageType(bytes: Uint8Array): "jpg" | "png" | "webp" | null {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  )
    return "webp";
  return null;
}

const CONTENT_TYPE = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;

/** Prefijo público de las imágenes subidas en Supabase. */
export function storagePublicPrefix() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return `${base.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/`;
}

/**
 * Solo se aceptan imágenes subidas por HUELLAS para el albergue indicado.
 * Evita guardar enlaces externos que la web no puede mostrar o controlar.
 */
export function isOwnUpload(url: string, shelterId: string) {
  const folder = `shelters/${shelterId}/`;
  if (isDemo()) return url.startsWith(`${DEMO_UPLOAD_PREFIX}${folder.replaceAll("/", "__")}`);
  return url.startsWith(storagePublicPrefix() + folder);
}

/** Guarda la imagen y devuelve su URL pública. Lanza Error con mensaje para el usuario. */
export async function storeImage(file: File, shelterId: string, kind: UploadKind) {
  if (file.size === 0) throw new Error("El archivo está vacío.");
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("La imagen pesa más de 4 MB.");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = detectImageType(bytes);
  if (!type) throw new Error("Solo se aceptan imágenes JPG, PNG o WebP.");

  const key = `shelters/${shelterId}/${kind}/${randomUUID()}.${type}`;
  if (isDemo()) {
    // La demo guarda los archivos en disco y los sirve por /api/uploads.
    await mkdir(DEMO_DIR, { recursive: true });
    const name = key.replaceAll("/", "__");
    await writeFile(path.join(DEMO_DIR, name), bytes);
    return DEMO_UPLOAD_PREFIX + name;
  }
  const db = await createClient();
  // La política del bucket solo permite escribir en la carpeta del propio albergue.
  const { error } = await db.storage
    .from(BUCKET)
    .upload(key, bytes, { contentType: CONTENT_TYPE[type], upsert: false });
  if (error) throw new Error("No se pudo subir la imagen. Revisa tus permisos.");
  return storagePublicPrefix() + key;
}

/** Lee una imagen de la demo (solo nombres generados por storeImage). */
export async function readDemoUpload(name: string) {
  if (!/^shelters__[\w-]+__(avatar|banner|animal)__[\w-]+\.(jpg|png|webp)$/.test(name)) return null;
  try {
    const data = await readFile(path.join(DEMO_DIR, name));
    const ext = name.split(".").pop() as keyof typeof CONTENT_TYPE;
    return { data, contentType: CONTENT_TYPE[ext] };
  } catch {
    return null;
  }
}
