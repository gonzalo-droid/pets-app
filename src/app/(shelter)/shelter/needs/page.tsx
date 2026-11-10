import { shelterContext } from "@/lib/huellas/auth";
import { recordsPage } from "@/lib/huellas/records";
import PaginationNav from "@/components/ui/pagination-nav";
import { parsePage } from "@/lib/pagination";

const PAGE_SIZE = 10;
import { ManageForm, ActionButton } from "@/components/huellas/Forms";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const id = await shelterContext();
  const { page: rawPage } = await searchParams;
  const { items: needs, page, totalPages } = await recordsPage(
    "needs",
    { shelterId: id },
    parsePage(rawPage),
    PAGE_SIZE,
  );
  return (
    <div className="max-w-5xl space-y-7">
      <div>
        <h1 className="text-3xl sm:text-4xl">Necesidades</h1>
        <p className="mt-2 text-muted-foreground">
          Publica productos o servicios concretos. Márcalos como resueltos cuando los recibas.
        </p>
      </div>
      <div className="grid items-start gap-6 md:grid-cols-2">
        <ManageForm
          action="need"
          shelterId={id}
          title="Publicar necesidad"
          submitLabel="Publicar necesidad"
          fields={[
            { name: "title", label: "Producto o necesidad", hint: "Ej.: Alimento para cachorros" },
            {
              name: "description",
              label: "Detalles para coordinar la entrega",
            },
            { name: "quantity", label: "Cantidad y unidad", hint: "Ej.: 10 sacos de 15 kg" },
          ]}
        />
        <div className="space-y-4">
          {needs.map((n) => (
            <article className="rounded-[24px] border border-border bg-card p-5" key={n.id}>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                    n.fulfilled ? "bg-success-bg text-success-fg" : "bg-highlight text-foreground"
                  }`}
                >
                  {n.fulfilled ? "Resuelta" : "Abierta"}
                </span>
                <span className="rounded-full bg-support-soft px-2.5 py-0.5 text-xs font-extrabold">
                  {n.quantity}
                </span>
              </div>
              <h2 className="mt-3 text-xl">{n.title}</h2>
              <p className="my-3 text-sm text-muted-foreground">{n.description}</p>
              <ActionButton
                tone={n.fulfilled ? "default" : "primary"}
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
          {!needs.length && (
            <p className="rounded-[24px] border-2 border-dashed border-border bg-card p-6 text-center text-muted-foreground">
              Aún no publicaste necesidades.
            </p>
          )}
          <PaginationNav
            currentPage={page}
            totalPages={totalPages}
            paramString=""
            pathname="/shelter/needs"
          />
        </div>
      </div>
    </div>
  );
}
