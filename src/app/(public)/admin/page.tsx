import { requireActor } from "@/lib/huellas/auth";
import { isDemo } from "@/lib/huellas/config";
import { readDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import { ActionButton } from "@/components/huellas/Forms";
import PaginationNav from "@/components/ui/pagination-nav";
import { fetchPage, parsePage, slicePage } from "@/lib/pagination";
import type { Shelter } from "@/types";

const PAGE_SIZE = 20;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireActor(["admin"]);
  const requested = parsePage((await searchParams).page);
  // Primero los pendientes de verificación, luego los más recientes.
  const {
    items: shelters,
    page,
    totalPages,
  } = isDemo()
    ? slicePage(
        [...(await readDemo()).shelters].sort(
          (a, b) => Number(a.is_verified) - Number(b.is_verified),
        ),
        requested,
        PAGE_SIZE,
      )
    : await (async () => {
        const db = await createClient();
        return fetchPage<Shelter>(
          (from, to) =>
            db
              .from("shelters")
              .select("*", { count: "exact" })
              .order("is_verified")
              .order("created_at", { ascending: false })
              .order("id")
              .range(from, to),
          requested,
          PAGE_SIZE,
          "admin:shelters",
        );
      })();
  return (
    <div className="max-w-5xl mx-auto px-5 py-12 space-y-6">
      <p className="uppercase tracking-widest text-xs text-primary">
        Administración HUELLAS
      </p>
      <h1 className="text-3xl font-bold">Una red en la que confiar.</h1>
      <p className="text-muted-foreground">
        Verifica la identidad y documentación de cada albergue antes de
        publicarlo.
      </p>
      {shelters.map((s) => (
        <article
          className="rounded-2xl border bg-card p-5 flex flex-wrap items-center justify-between gap-4"
          key={s.id}
        >
          <div>
            <h2 className="font-bold">{s.name}</h2>
            <p className="text-sm text-muted-foreground">
              {s.is_verified ? "Verificado" : "Pendiente de verificación"}
            </p>
          </div>
          <ActionButton
            payload={{
              action: "verify",
              shelter_id: s.id,
              verified: !s.is_verified,
            }}
          >
            {s.is_verified ? "Retirar verificación" : "Verificar albergue"}
          </ActionButton>
        </article>
      ))}
      <PaginationNav
        currentPage={page}
        totalPages={totalPages}
        paramString=""
        pathname="/admin"
      />
    </div>
  );
}
