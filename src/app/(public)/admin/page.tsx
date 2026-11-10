import { requireActor } from "@/lib/huellas/auth";
import { isDemo } from "@/lib/huellas/config";
import { readDemo } from "@/lib/huellas/demo";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ActionButton } from "@/components/huellas/Forms";
import { PawIcon } from "@/components/campaigns/PawProgress";
import { DISTRICT_LABEL } from "@/lib/ubigeo";
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
  // Totales de toda la red (no solo de esta página).
  const counts = isDemo()
    ? (() => {
        return readDemo().then((d) => ({
          verified: d.shelters.filter((x) => x.is_verified).length,
          pending: d.shelters.filter((x) => !x.is_verified).length,
        }));
      })()
    : (async () => {
        const db = await createClient();
        const [v, p] = await Promise.all([
          db.from("shelters").select("id", { count: "exact", head: true }).eq("is_verified", true),
          db.from("shelters").select("id", { count: "exact", head: true }).eq("is_verified", false),
        ]);
        return { verified: v.count ?? 0, pending: p.count ?? 0 };
      })();
  const { verified, pending } = await counts;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 sm:py-10">
      <section className="rounded-[32px] bg-secondary p-6 sm:p-10">
        <span className="inline-block -rotate-2 rounded-full bg-highlight px-4 py-1.5 text-sm font-extrabold">
          Administración HUELLAS
        </span>
        <h1 className="mt-4 text-4xl sm:text-5xl">Albergues de la red</h1>
        <p className="mt-3 max-w-2xl text-lg text-foreground/80">
          Revisa la identidad y documentación de cada albergue antes de verificarlo.
        </p>
        <ul className="mt-6 flex flex-wrap gap-3">
          <li className="rounded-2xl bg-card px-5 py-3">
            <strong className="font-display text-2xl font-semibold">{pending}</strong>{" "}
            <span className="text-sm font-bold text-muted-foreground">pendientes</span>
          </li>
          <li className="rounded-2xl bg-card px-5 py-3">
            <strong className="font-display text-2xl font-semibold">{verified}</strong>{" "}
            <span className="text-sm font-bold text-muted-foreground">verificados</span>
          </li>
        </ul>
      </section>

      <p className="rounded-2xl bg-warning-bg px-4 py-3 text-sm text-warning-fg">
        <strong>Verificar</strong> publica el albergue en el portal: su perfil, animales, campañas y
        necesidades. <strong>Retirar la verificación</strong> los oculta del portal de inmediato, pero
        no borra ningún dato ni compromiso, y el albergue sigue entrando a su panel.
      </p>

      <ul className="space-y-3">
        {shelters.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-border bg-card p-5"
          >
            <div className="flex min-w-0 items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <PawIcon className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl">{s.name}</h2>
                <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                      s.is_verified ? "bg-success-bg text-success-fg" : "bg-highlight text-foreground"
                    }`}
                  >
                    {s.is_verified ? "Verificado" : "Pendiente de verificación"}
                  </span>
                  {DISTRICT_LABEL[s.ubigeo] ?? "Lambayeque"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {s.is_verified && (
                <Link
                  href={`/shelters/${s.id}`}
                  className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-extrabold text-primary hover:underline"
                >
                  Ver perfil público
                </Link>
              )}
              <ActionButton
                tone={s.is_verified ? "danger" : "primary"}
                confirm={
                  s.is_verified
                    ? `¿Retirar la verificación de ${s.name}? Dejará de verse en el portal (perfil, animales, campañas y necesidades). No se borra ningún dato.`
                    : `¿Verificar ${s.name}? Confirma que revisaste su identidad y documentación. Su perfil y publicaciones aparecerán en el portal.`
                }
                payload={{ action: "verify", shelter_id: s.id, verified: !s.is_verified }}
              >
                {s.is_verified ? "Retirar verificación" : "Verificar albergue"}
              </ActionButton>
            </div>
          </li>
        ))}
      </ul>
      <PaginationNav
        currentPage={page}
        totalPages={totalPages}
        paramString=""
        pathname="/admin"
      />
    </div>
  );
}
