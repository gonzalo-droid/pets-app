import { shelterContext } from "@/lib/huellas/auth";
import { records } from "@/lib/huellas/records";
import { ManageForm, ActionButton } from "@/components/huellas/Forms";
export default async function Page() {
  const id = await shelterContext();
  const needs = await records("needs", id);
  return (
    <div className="max-w-5xl space-y-7">
      <h1 className="text-3xl font-bold">Lo que necesitamos</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <ManageForm
          action="need"
          shelterId={id}
          title="Publicar necesidad"
          fields={[
            { name: "title", label: "Producto o necesidad" },
            {
              name: "description",
              label: "Detalles para coordinar la entrega",
            },
            { name: "quantity", label: "Cantidad y unidad" },
          ]}
        />
        <div className="space-y-4">
          {needs.map((n) => (
            <article className="rounded-2xl border bg-card p-5" key={n.id}>
              <p className="text-xs uppercase text-emerald-700">
                {n.fulfilled ? "Resuelta" : "Abierta"} · {n.quantity}
              </p>
              <h2 className="font-bold text-lg mt-2">{n.title}</h2>
              <p className="text-sm text-muted-foreground my-3">
                {n.description}
              </p>
              <ActionButton
                payload={{
                  action: "fulfill",
                  id: n.id,
                  shelter_id: id,
                  fulfilled: !n.fulfilled,
                }}
              >
                {n.fulfilled ? "Reabrir" : "Marcar como resuelta"}
              </ActionButton>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
