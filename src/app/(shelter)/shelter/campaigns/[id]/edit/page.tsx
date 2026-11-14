import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { shelterContext } from "@/lib/huellas/auth";
import { getCampaigns } from "@/lib/data/campaigns";
import { getShelterById } from "@/lib/data/shelters";
import CampaignWizard from "@/components/huellas/CampaignWizard";
import { animalOptions } from "@/lib/huellas/animal-options";

export const metadata: Metadata = { title: "Editar campaña" };

// Fecha guardada (ISO) → valores de los campos en hora de Perú.
const limaParts = (iso: string) =>
  new Date(iso).toLocaleString("sv-SE", { timeZone: "America/Lima" }).replace(" ", "T");

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: campaignId } = await params;
  const id = await shelterContext();
  const [shelter, campaigns] = await Promise.all([getShelterById(id), getCampaigns({ shelter_id: id })]);
  const c = campaigns.find((c) => c.id === campaignId);
  if (!c) notFound();
  const animals = await animalOptions(id, c.animal_id);
  return (
    <div className="max-w-5xl space-y-6">
      <Link
        href="/shelter/campaigns"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Campañas
      </Link>
      <h1 className="text-3xl sm:text-4xl">Editar campaña</h1>
      <CampaignWizard
        shelterId={id}
        shelterName={shelter?.name ?? ""}
        animals={animals}
        campaignId={c.id}
        initial={{
          kind: c.kind,
          title: c.title,
          description: c.description ?? "",
          animal_id: c.animal_id ?? "",
          event_at: c.event_at ? limaParts(c.event_at).slice(0, 16) : "",
          event_place: c.event_place ?? "",
          image_url: c.image_url ?? "",
          goal_amount: String(c.goal_amount),
          ends_at: c.ends_at ? limaParts(c.ends_at).slice(0, 10) : "",
        }}
      />
    </div>
  );
}
