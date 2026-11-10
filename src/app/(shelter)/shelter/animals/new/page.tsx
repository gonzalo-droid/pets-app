import { shelterContext } from "@/lib/huellas/auth";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewAnimalForm from "./NewAnimalForm";

export const metadata: Metadata = { title: "Registrar animal — Panel del albergue" };

export default async function NewAnimalPage() {
  const shelterId = await shelterContext();
  return (
    <div className="max-w-2xl">
      <Link
        href="/shelter/animals"
        className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a animales
      </Link>
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl text-foreground">Registrar animal</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          La ficha será pública cuando el albergue esté verificado.
        </p>
      </div>
      <NewAnimalForm shelterId={shelterId} />
    </div>
  );
}
