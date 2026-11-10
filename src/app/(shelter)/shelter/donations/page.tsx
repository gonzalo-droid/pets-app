import { shelterContext } from "@/lib/huellas/auth";
import { records } from "@/lib/huellas/records";
import { formatPEN } from "@/lib/utils";
export default async function Page() {
  const rows = await records("support_intents", await shelterContext());
  return (
    <div className="max-w-5xl space-y-6">
      <h1 className="text-3xl font-bold">Compromisos de apoyo</h1>
      <p className="rounded-xl border bg-card p-5 text-sm">
        Estos registros no confirman pagos. La pasarela y los cobros recurrentes
        están pendientes de integración. No se aprueban cobros desde este panel.
      </p>
      {rows.map((r) => (
        <article
          key={r.id}
          className="rounded-xl border p-5 flex flex-wrap justify-between gap-4"
        >
          <div>
            <p className="font-bold">
              {r.kind === "sponsorship"
                ? "Apadrinamiento mensual"
                : "Donación única"}
            </p>
            <p className="text-xs text-muted-foreground">
              Referencia {r.id} ·{" "}
              {new Date(r.created_at).toLocaleDateString("es-PE", {
                timeZone: "America/Lima",
              })}
            </p>
          </div>
          <div>
            <strong>{formatPEN(Number(r.amount))}</strong>
            <p className="text-xs">
              {r.status === "cancelled" ? "Cancelado" : "Pendiente · sin cobro"}
            </p>
          </div>
        </article>
      ))}
      {!rows.length && (
        <p className="text-muted-foreground">
          Los nuevos compromisos aparecerán aquí.
        </p>
      )}
    </div>
  );
}
