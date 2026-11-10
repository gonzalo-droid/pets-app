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
              <p className="text-xs uppercase text-primary">
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
