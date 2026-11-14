import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { shelterContext } from "@/lib/huellas/auth";
import { animalOptions } from "@/lib/huellas/animal-options";
import { getShelterById } from "@/lib/data/shelters";
import CampaignWizard from "@/components/huellas/CampaignWizard";

export const metadata: Metadata = { title: "Nueva campaña" };

export default async function Page() {
  const id = await shelterContext();
  const [shelter, animals] = await Promise.all([getShelterById(id), animalOptions(id)]);
  return (
    <div className="max-w-5xl space-y-6">
      <Link
        href="/shelter/campaigns"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Campañas
      </Link>
      <h1 className="text-3xl sm:text-4xl">Nueva campaña</h1>
      <CampaignWizard shelterId={id} shelterName={shelter?.name ?? ""} animals={animals} />
    </div>
  );
}
