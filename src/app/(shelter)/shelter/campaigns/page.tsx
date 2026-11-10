import Link from "next/link";
import { shelterContext } from "@/lib/huellas/auth";
import { getCampaigns } from "@/lib/data/campaigns";
import { ManageForm } from "@/components/huellas/Forms";
import DonationProgress from "@/components/campaigns/DonationProgress";
export default async function Page() {
  const id = await shelterContext();
  const campaigns = await getCampaigns({ shelter_id: id });
  return (
    <div className="max-w-5xl space-y-7">
      <h1 className="text-3xl font-bold">Campañas que cambian vidas</h1>
      <div className="grid md:grid-cols-[1fr_1.3fr] gap-6">
        <ManageForm
          action="campaign"
          shelterId={id}
          title="Nueva campaña"
          fields={[
            { name: "title", label: "Título" },
            { name: "description", label: "¿Qué necesitan y para qué?" },
            { name: "goal_amount", label: "Meta en soles", type: "number" },
          ]}
        />
        <div className="space-y-4">
          {campaigns.map((c) => (
            <article
              className="rounded-2xl border bg-card p-6 space-y-3"
              key={c.id}
            >
              <h2 className="font-bold text-lg">{c.title}</h2>
              <p className="text-sm text-muted-foreground">{c.description}</p>
              <DonationProgress
                current={c.current_amount}
                goal={c.goal_amount}
              />
              <Link className="text-sm underline" href={"/donate/" + c.slug}>
                Ver campaña ↗
              </Link>
            </article>
          ))}
          {!campaigns.length && <p>Aún no has creado campañas.</p>}
        </div>
      </div>
    </div>
  );
}
