import { shelterContext } from "@/lib/huellas/auth";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewAnimalForm from "./NewAnimalForm";

export const metadata: Metadata = { title: "Publicar animal — Panel Albergue" };

export default async function NewAnimalPage() {
  const shelterId = await shelterContext();
  return (
    <div className="max-w-2xl">
      <Link
        href="/shelter/animals"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis animales
      </Link>
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-foreground">
          Publicar nuevo animal
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          La ficha será pública cuando el albergue esté verificado.
        </p>
      </div>
      <NewAnimalForm shelterId={shelterId} />
    </div>
  );
}
