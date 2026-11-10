import Link from "next/link";
import PaginationNav from "@/components/ui/pagination-nav";
import { recordsPage } from "@/lib/huellas/records";
import { getShelters } from "@/lib/data/shelters";
import { parsePage, queryWithoutPage } from "@/lib/pagination";

const PAGE_SIZE = 9;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const [{ items: visible, page, totalPages }, shelters] = await Promise.all([
    recordsPage("needs", { openNeeds: true }, parsePage(params.page), PAGE_SIZE),
    getShelters(),
  ]);
  return (
    <div className="max-w-6xl mx-auto px-5 py-12 space-y-8">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-widest text-primary">
          Ayuda que se convierte en cuidado
        </p>
        <h1 className="text-4xl font-bold mt-3">
          A veces, un saco de alimento
          <br />
          lo cambia todo.
        </h1>
        <p className="text-muted-foreground mt-4">
          Descubre necesidades concretas. Coordina directamente con el albergue
          antes de realizar una entrega.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {visible.map((n) => (
          <article key={n.id} className="rounded-2xl border bg-card p-6">
            <span className="text-xs rounded-full bg-accent text-accent-foreground px-3 py-1">
              {n.quantity}
            </span>
            <h2 className="text-xl font-bold mt-5">{n.title}</h2>
            <p className="text-sm text-muted-foreground mt-3">
              {n.description}
            </p>
            <p className="text-sm font-bold mt-5">
              {shelters.find((s) => s.id === n.shelter_id)?.name}
            </p>
            <Link
              className="inline-block text-sm underline mt-3"
              href={"/shelters/" + n.shelter_id}
            >
              Conocer al albergue ↗
            </Link>
          </article>
        ))}
      </div>
      {!visible.length && <p>No hay necesidades abiertas en este momento.</p>}
      <PaginationNav
        currentPage={page}
        totalPages={totalPages}
        paramString={queryWithoutPage(params)}
        pathname="/needs"
      />
    </div>
  );
}
