import Link from "next/link";
import { ArrowRight, CalendarDays, Pencil } from "lucide-react";
import { shelterContext } from "@/lib/huellas/auth";
import { getCampaigns } from "@/lib/data/campaigns";
import { isCampaignOpen } from "@/lib/huellas/domain";
import { ActionButton, ManageForm } from "@/components/huellas/Forms";
import PawProgress from "@/components/campaigns/PawProgress";
import { cn } from "@/lib/utils";

// Fecha límite guardada (ISO) → valor de un <input type="date"> en hora de Perú.
const toDateInput = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/Lima" }) : "";

const deadline = (iso: string | null) =>
  iso
    ? "Hasta el " +
      new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "long", timeZone: "America/Lima" })
    : "Sin fecha límite";

export default async function Page() {
  const id = await shelterContext();
  const campaigns = await getCampaigns({ shelter_id: id });

  const fields = (c?: (typeof campaigns)[number]) => [
    { name: "title", label: "Título", value: c?.title, hint: "Ej.: Operación de cadera para Zeus" },
    { name: "description", label: "¿Qué necesitan y para qué?", value: c?.description ?? undefined, multiline: true },
    { name: "goal_amount", label: "Meta en soles", type: "number", value: c?.goal_amount },
    {
      name: "ends_at",
      label: "Fecha límite",
      type: "date",
      value: toDateInput(c?.ends_at ?? null),
      optional: true,
      hint: "Al pasar esta fecha la campaña se cierra sola y deja de recibir aportes.",
    },
  ];

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl">Campañas</h1>
        <p className="mt-2 text-muted-foreground">
          Publica objetivos concretos. Los compromisos pendientes no suman a la recaudación.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_1.4fr]">
        <ManageForm action="campaign" shelterId={id} title="Nueva campaña" fields={fields()} submitLabel="Publicar campaña" />

        <section aria-label="Mis campañas" className="space-y-4">
          {campaigns.map((c) => {
            const open = isCampaignOpen(c);
            const expired = c.is_active && !open;
            const state = open
              ? { label: "Abierta", className: "bg-highlight text-foreground" }
              : expired
                ? { label: "Vencida", className: "bg-warning-bg text-warning-fg" }
                : { label: "Cerrada", className: "bg-muted text-muted-foreground" };
            return (
              <article key={c.id} className="space-y-4 rounded-[28px] border border-border bg-card p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-xl leading-snug">{c.title}</h2>
                  <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold", state.className)}>
                    {state.label}
                  </span>
                </div>
                <p className="line-clamp-3 text-sm text-muted-foreground">{c.description}</p>
                <PawProgress current={c.current_amount} goal={c.goal_amount} />
                <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  {deadline(c.ends_at)}
                  {expired && " · edita la fecha para reabrirla"}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {c.is_active ? (
                    <ActionButton
                      tone="danger"
                      payload={{ action: "campaign_active", id: c.id, shelter_id: id, is_active: false }}
                      confirm="¿Cerrar esta campaña? Dejará de recibir aportes. No se borra: seguirá visible como cerrada y conservará sus compromisos."
                    >
                      Cerrar campaña
                    </ActionButton>
                  ) : (
                    <ActionButton
                      tone="primary"
                      payload={{ action: "campaign_active", id: c.id, shelter_id: id, is_active: true }}
                    >
                      Reabrir campaña
                    </ActionButton>
                  )}
                  <Link
                    href={"/donate/" + c.slug}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-extrabold text-primary hover:underline"
                  >
                    Ver pública
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>

                {/* Edición sin salir de la lista */}
                <details className="group rounded-2xl bg-muted/60">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-2xl px-4 text-sm font-extrabold">
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Editar campaña
                  </summary>
                  <div className="p-2">
                    <ManageForm
                      action="campaign_update"
                      shelterId={id}
                      extra={{ id: c.id }}
                      title={`Editar: ${c.title}`}
                      fields={fields(c)}
                      submitLabel="Guardar cambios"
                    />
                  </div>
                </details>
              </article>
            );
          })}
          {!campaigns.length && (
            <div className="rounded-[28px] border-2 border-dashed border-border bg-card p-8 text-center">
              <p className="text-lg font-bold">Aún no has publicado campañas</p>
              <p className="mt-1 text-muted-foreground">
                Usa el formulario para contar qué necesitan tus rescatados y cuánto hace falta.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
