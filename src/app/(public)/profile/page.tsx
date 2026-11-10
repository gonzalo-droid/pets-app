import { requireActor } from "@/lib/huellas/auth";
import { records } from "@/lib/huellas/records";
import { ActionButton } from "@/components/huellas/Forms";
import { formatPEN } from "@/lib/utils";
export default async function Page() {
  const a = await requireActor();
  const [support, requests] = await Promise.all([
    records("support_intents", undefined, a.id),
    records("adoption_requests", undefined, a.id),
  ]);
  return (
    <div className="max-w-4xl mx-auto px-5 py-12 space-y-8">
      <div>
        <p className="text-xs uppercase tracking-widest text-primary">
          Mi comunidad
        </p>
        <h1 className="text-3xl font-bold mt-2">Hola, {a.full_name}</h1>
        <p className="text-muted-foreground mt-3">
          Aquí empieza la huella que quieres dejar.
        </p>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Mis donaciones y apadrinamientos</h2>
        {support.map((s) => (
          <article
            className="rounded-2xl border bg-card p-5 flex flex-wrap items-center justify-between gap-4"
            key={s.id}
          >
            <div>
              <strong>
                {s.kind === "sponsorship"
                  ? "Apadrinamiento mensual"
                  : "Apoyo único"}{" "}
                · {formatPEN(Number(s.amount))}
              </strong>
              <p className="text-sm text-muted-foreground mt-1">
                {s.status === "cancelled"
                  ? "Cancelado"
                  : "Compromiso pendiente · no se ha cobrado"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Referencia: {s.id}
              </p>
            </div>
            {s.status === "pending" && (
              <ActionButton
                endpoint="/api/support"
                payload={{ action: "cancel", id: s.id }}
              >
                Cancelar compromiso
              </ActionButton>
            )}
          </article>
        ))}
        {!support.length && (
          <div className="rounded-2xl bg-muted p-7">
            <p>Todavía no tienes compromisos de apoyo.</p>
            <a className="huellas-button mt-4" href="/adopt">
              Conocer a quienes puedes apadrinar ↗
            </a>
          </div>
        )}
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Mis solicitudes de adopción</h2>
        {requests.map((r) => (
          <article className="rounded-xl border p-5" key={r.id}>
            <p>{r.message}</p>
            <p className="text-sm text-muted-foreground mt-2">
              Estado: {r.status}
            </p>
          </article>
        ))}
        {!requests.length && (
          <p className="text-sm text-muted-foreground">
            Aún no has enviado solicitudes.
          </p>
        )}
      </section>
    </div>
  );
}
