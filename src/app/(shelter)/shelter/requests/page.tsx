import { shelterContext } from "@/lib/huellas/auth";
import { records } from "@/lib/huellas/records";
import { ActionButton } from "@/components/huellas/Forms";
export default async function Page() {
  const id = await shelterContext();
  const rows = await records("adoption_requests", id);
  return (
    <div className="max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Adopciones responsables</h1>
      {rows.map((r) => (
        <article className="rounded-xl border bg-card p-5 space-y-3" key={r.id}>
          <p className="font-bold">Solicitud · {r.status}</p>
          <p>{r.message}</p>
          <p className="text-sm">Contacto privado: {r.phone}</p>
          <div className="flex flex-wrap gap-2">
            {[
              ["reviewing", "En revisión"],
              ["approved", "Aprobar"],
              ["rejected", "Rechazar"],
              ["completed", "Completar"],
            ].map(([status, label]) => (
              <ActionButton
                key={status}
                payload={{
                  action: "request_status",
                  id: r.id,
                  shelter_id: id,
                  status,
                }}
              >
                {label}
              </ActionButton>
            ))}
          </div>
        </article>
      ))}
      {!rows.length && (
        <p className="text-muted-foreground">
          Aún no hay solicitudes. Comparte los perfiles de tus animales.
        </p>
      )}
    </div>
  );
}
