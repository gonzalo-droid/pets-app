import { notFound } from "next/navigation";

// El módulo heredado de mascotas perdidas está fuera del alcance actual de
// HUELLAS. El código se conserva, pero sus páginas no se publican.
export default function LostLayout(): never {
  notFound();
}
