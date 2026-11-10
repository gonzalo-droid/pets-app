import Link from "next/link";
import { CalendarDays, Home, Phone, Users, Dog } from "lucide-react";
import { shelterContext } from "@/lib/huellas/auth";
import { recordsPage } from "@/lib/huellas/records";
import { lookupTargets } from "@/lib/huellas/targets";
import { REQUEST_TRANSITIONS } from "@/lib/huellas/domain";
import { ActionButton } from "@/components/huellas/Forms";
import PaginationNav from "@/components/ui/pagination-nav";
import { parsePage } from "@/lib/pagination";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "Nueva", className: "bg-highlight text-foreground" },
  reviewing: { label: "En revisión", className: "bg-warning-bg text-warning-fg" },
  approved: { label: "Aprobada", className: "bg-success-bg text-success-fg" },
  rejected: { label: "Rechazada", className: "bg-muted text-muted-foreground" },
  completed: { label: "Adopción completada", className: "bg-success-bg text-success-fg" },
};

// Acción para cada estado de destino, con su efecto explicado cuando importa.
const ACTIONS: Record<string, { label: string; tone: "default" | "primary" | "danger"; confirm?: string }> = {
  reviewing: { label: "Marcar en revisión", tone: "default" },
  approved: {
    label: "Aprobar",
    tone: "primary",
    confirm: "¿Aprobar esta solicitud? El animal pasará a «Adopción en proceso» y dejará de recibir nuevas solicitudes.",
  },
  completed: {
    label: "Completar adopción",
    tone: "primary",
    confirm: "¿Confirmas que la adopción se concretó? El animal quedará como adoptado. Este paso no se puede deshacer.",
  },
  rejected: {
    label: "Rechazar",
    tone: "danger",
    confirm: "¿Rechazar esta solicitud? No se puede deshacer. Si no quedan otras aprobadas, el animal vuelve a estar disponible.",
  },
};

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("es-PE", { day: "numeric", month: "long", timeZone: "America/Lima" });

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const id = await shelterContext();
  const { page: rawPage } = await searchParams;
  const { items: rows, page, totalPages } = await recordsPage(
    "adoption_requests",
    { shelterId: id },
    parsePage(rawPage),
    PAGE_SIZE,
  );
  const { animals } = await lookupTargets([], rows.map((r) => r.animal_id));

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl sm:text-4xl">Solicitudes de adopción</h1>
        <p className="mt-2 text-muted-foreground">
          Revisa cada solicitud, contacta a la persona y registra tu decisión. Aprobar no completa
          la adopción: complétala cuando el animal esté en su nuevo hogar.
        </p>
      </div>

      {rows.map((r) => {
        const st = STATUS[r.status] ?? STATUS.pending;
        const animal = animals[r.animal_id];
        const next = REQUEST_TRANSITIONS[r.status] ?? [];
        return (
          <article key={r.id} className="space-y-4 rounded-[28px] border border-border bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl">
                  {animal ? (
                    <Link href={animal.href} className="hover:underline">
                      Adopción de {animal.label}
                    </Link>
                  ) : (
                    "Solicitud de adopción"
                  )}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  Recibida el {date(r.created_at)}
                </p>
              </div>
              <span className={cn("rounded-full px-3 py-1 text-xs font-extrabold", st.className)}>
                {st.label}
              </span>
            </div>

            <p className="rounded-2xl bg-muted/60 p-4 text-sm leading-relaxed">{r.message}</p>

            <ul className="flex flex-wrap gap-2 text-xs font-bold">
              <li className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                <Home className="h-3.5 w-3.5" aria-hidden="true" />
                {r.has_home ? "Tiene patio o espacio exterior" : "Sin espacio exterior"}
              </li>
              <li className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                <Dog className="h-3.5 w-3.5" aria-hidden="true" />
                {r.has_other_pets ? "Tiene otras mascotas" : "Sin otras mascotas"}
              </li>
              <li className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
                <Users className="h-3.5 w-3.5" aria-hidden="true" />
                {r.has_children ? "Hay niños en casa" : "Sin niños en casa"}
              </li>
            </ul>

            <a
              href={`tel:${r.phone}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-primary px-4 text-sm font-extrabold text-primary hover:bg-secondary"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Llamar · {r.phone}
              <span className="sr-only">(dato privado, solo visible para tu albergue)</span>
            </a>

            {next.length > 0 ? (
              <div className="flex flex-wrap gap-2 border-t border-border pt-4">
                {next.map((status) => {
                  const a = ACTIONS[status];
                  return (
                    <ActionButton
                      key={status}
                      tone={a.tone}
                      confirm={a.confirm}
                      payload={{ action: "request_status", id: r.id, shelter_id: id, status }}
                    >
                      {a.label}
                    </ActionButton>
                  );
                })}
              </div>
            ) : (
              <p className="border-t border-border pt-4 text-sm text-muted-foreground">
                Esta solicitud ya está cerrada.
              </p>
            )}
          </article>
        );
      })}

      {!rows.length && (
        <div className="rounded-[28px] border-2 border-dashed border-border bg-card p-8 text-center">
          <p className="text-lg font-bold">Aún no hay solicitudes</p>
          <p className="mt-1 text-muted-foreground">Comparte los perfiles de tus animales para que más personas los conozcan.</p>
          <Link href="/shelter/animals" className="huellas-button mt-5">
            Ver mis animales
          </Link>
        </div>
      )}

      <PaginationNav currentPage={page} totalPages={totalPages} paramString="" pathname="/shelter/requests" />
    </div>
  );
}
