import { shelterContext } from "@/lib/huellas/auth";
import { recordsPage } from "@/lib/huellas/records";
import PaginationNav from "@/components/ui/pagination-nav";
import { parsePage } from "@/lib/pagination";

const PAGE_SIZE = 20;
import { formatPEN } from "@/lib/utils";
import { lookupTargets } from "@/lib/huellas/targets";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: rawPage } = await searchParams;
  const { items: rows, page, totalPages } = await recordsPage(
    "support_intents",
    { shelterId: await shelterContext() },
    parsePage(rawPage),
    PAGE_SIZE,
  );
  const targets = await lookupTargets(
    rows.map((r) => r.campaign_id ?? ""),
    rows.map((r) => r.animal_id ?? ""),
  );
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl">Apoyos</h1>
        <p className="mt-2 text-muted-foreground">
          Compromisos de donación y apadrinamiento vinculados a tu albergue.
        </p>
      </div>
      <p className="rounded-2xl bg-warning-bg px-4 py-3 text-sm text-warning-fg">
        Estos registros no confirman pagos. La pasarela y los cobros recurrentes
        están pendientes de integración. No se aprueban cobros desde este panel.
      </p>
      {rows.map((r) => (
        <article
          key={r.id}
          className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-border bg-card p-5"
        >
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              {r.kind === "sponsorship" ? "Apadrinamiento mensual" : "Apoyo a campaña"}
            </p>
            <p className="font-display text-lg font-semibold">
              {(r.campaign_id && targets.campaigns[r.campaign_id]?.label) ||
                (r.animal_id && targets.animals[r.animal_id] && `Apadrinamiento de ${targets.animals[r.animal_id].label}`) ||
                "Destino no disponible"}
            </p>
            <p className="text-xs text-muted-foreground">
              Ref. {r.id.slice(0, 8).toUpperCase()} ·{" "}
              {new Date(r.created_at).toLocaleDateString("es-PE", {
                timeZone: "America/Lima",
              })}
            </p>
          </div>
          <div className="text-right">
            <strong className="font-display text-xl font-semibold">
              {formatPEN(Number(r.amount))}
              {r.kind === "sponsorship" && <span className="text-sm font-bold text-muted-foreground"> / mes</span>}
            </strong>
            <p className="mt-1">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                  r.status === "cancelled" ? "bg-muted text-muted-foreground" : "bg-highlight text-foreground"
                }`}
              >
                {r.status === "cancelled" ? "Cancelado" : "Pendiente · sin cobro"}
              </span>
            </p>
          </div>
        </article>
      ))}
      {!rows.length && (
        <p className="rounded-[24px] border-2 border-dashed border-border bg-card p-6 text-center text-muted-foreground">
          Los nuevos compromisos aparecerán aquí.
        </p>
      )}
      <PaginationNav
        currentPage={page}
        totalPages={totalPages}
        paramString=""
        pathname="/shelter/donations"
      />
    </div>
  );
}
