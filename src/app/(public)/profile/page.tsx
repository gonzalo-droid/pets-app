import Link from "next/link";
import { CalendarDays, HeartHandshake, Megaphone, PawPrint } from "lucide-react";
import { requireActor } from "@/lib/huellas/auth";
import { records } from "@/lib/huellas/records";
import { lookupTargets } from "@/lib/huellas/targets";
import { ActionButton } from "@/components/huellas/Forms";
import { cn, formatPEN } from "@/lib/utils";

const REQUEST_STATUS: Record<string, { label: string; className: string }> = {
  pending: { label: "Enviada", className: "bg-highlight text-foreground" },
  reviewing: { label: "En revisión", className: "bg-warning-bg text-warning-fg" },
  approved: { label: "Aprobada", className: "bg-success-bg text-success-fg" },
  rejected: { label: "No aprobada", className: "bg-muted text-muted-foreground" },
  completed: { label: "Adopción completada", className: "bg-success-bg text-success-fg" },
};

const date = (iso: string) =>
  new Date(iso).toLocaleDateString("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "America/Lima",
  });

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const a = await requireActor();
  const { tab } = await searchParams;
  const active = tab === "solicitudes" ? "solicitudes" : "apoyos";
  const [support, requests] = await Promise.all([
    records("support_intents", undefined, a.id),
    records("adoption_requests", undefined, a.id),
  ]);
  const targets = await lookupTargets(
    support.map((s) => s.campaign_id ?? ""),
    [...support.map((s) => s.animal_id ?? ""), ...requests.map((r) => r.animal_id)],
  );
  const pending = support.filter((s) => s.status === "pending");

  const tabs = [
    { id: "apoyos", label: "Mis apoyos", count: support.length },
    { id: "solicitudes", label: "Mis solicitudes de adopción", count: requests.length },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <div>
        <p className="text-sm font-bold text-primary">Mi espacio</p>
        <h1 className="mt-1 text-3xl sm:text-4xl">Hola, {a.full_name}</h1>
        <p className="mt-2 text-muted-foreground">
          {pending.length > 0
            ? `Tienes ${pending.length} compromiso${pending.length === 1 ? "" : "s"} de apoyo pendiente${pending.length === 1 ? "" : "s"}.`
            : "Aquí verás tus apoyos y tus solicitudes de adopción."}
        </p>
      </div>

      <nav aria-label="Secciones de Mi espacio" className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t.id}
            href={t.id === "apoyos" ? "/profile" : "/profile?tab=solicitudes"}
            aria-current={active === t.id ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-sm font-extrabold transition-colors",
              active === t.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/70",
            )}
          >
            {t.label}
            <span className="rounded-full bg-card/30 px-2 text-xs">{t.count}</span>
          </Link>
        ))}
      </nav>

      {active === "apoyos" ? (
        <section aria-label="Mis apoyos" className="space-y-4">
          <p className="rounded-2xl bg-warning-bg px-4 py-3 text-sm text-warning-fg">
            Son compromisos sin cobro: no se realizó ningún pago y el apadrinamiento
            no tiene débito automático.
          </p>
          {support.map((s) => {
            const target =
              (s.campaign_id && targets.campaigns[s.campaign_id]) ||
              (s.animal_id && targets.animals[s.animal_id]) ||
              null;
            const sponsorship = s.kind === "sponsorship";
            return (
              <article
                key={s.id}
                className="flex flex-wrap items-start justify-between gap-4 rounded-[28px] border border-border bg-card p-5"
              >
                <div className="flex min-w-0 gap-4">
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                      sponsorship ? "bg-secondary text-primary" : "bg-support-soft text-support",
                    )}
                  >
                    {sponsorship ? (
                      <HeartHandshake className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Megaphone className="h-6 w-6" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-muted-foreground">
                      {sponsorship ? "Apadrinamiento mensual" : "Apoyo a campaña"}
                    </p>
                    <h2 className="text-lg leading-snug">
                      {target ? (
                        <Link href={target.href} className="hover:underline">
                          {sponsorship ? `Apadrinas a ${target.label}` : target.label}
                        </Link>
                      ) : (
                        "Destino ya no disponible"
                      )}
                    </h2>
                    <p className="mt-1 font-display text-xl font-semibold">
                      {formatPEN(Number(s.amount))}
                      {sponsorship && <span className="text-sm font-bold text-muted-foreground"> / mes</span>}
                    </p>
                    <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 font-extrabold",
                          s.status === "cancelled" ? "bg-muted" : "bg-highlight text-foreground",
                        )}
                      >
                        {s.status === "cancelled" ? "Cancelado" : "Pendiente · sin cobro"}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                        {date(s.created_at)}
                      </span>
                      <span>Ref. {s.id.slice(0, 8).toUpperCase()}</span>
                    </p>
                  </div>
                </div>
                {s.status === "pending" && (
                  <ActionButton
                    endpoint="/api/support"
                    payload={{ action: "cancel", id: s.id }}
                    tone="danger"
                    confirm="¿Cancelar este compromiso? No se realizó ningún cobro, así que no hay reembolso que gestionar. El albergue dejará de verlo como pendiente."
                  >
                    Cancelar compromiso
                  </ActionButton>
                )}
              </article>
            );
          })}
          {!support.length && (
            <div className="rounded-[28px] border-2 border-dashed border-border bg-card p-8 text-center">
              <p className="text-lg font-bold">Todavía no tienes compromisos de apoyo</p>
              <p className="mt-1 text-muted-foreground">
                Elige una campaña o apadrina a un rescatado.
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Link className="huellas-button huellas-button--support" href="/donate">
                  Ver campañas
                </Link>
                <Link className="huellas-button huellas-button--secondary" href="/adopt">
                  Conocer animales
                </Link>
              </div>
            </div>
          )}
        </section>
      ) : (
        <section aria-label="Mis solicitudes de adopción" className="space-y-4">
          {requests.map((r) => {
            const animal = targets.animals[r.animal_id];
            const st = REQUEST_STATUS[r.status] ?? REQUEST_STATUS.pending;
            return (
              <article key={r.id} className="flex gap-4 rounded-[28px] border border-border bg-card p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-success-bg text-primary">
                  <PawPrint className="h-6 w-6" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg">
                      {animal ? (
                        <Link href={animal.href} className="hover:underline">
                          Adopción de {animal.label}
                        </Link>
                      ) : (
                        "Solicitud de adopción"
                      )}
                    </h2>
                    <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-extrabold", st.className)}>
                      {st.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Enviada el {date(r.created_at)}</p>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{r.message}</p>
                </div>
              </article>
            );
          })}
          {!requests.length && (
            <div className="rounded-[28px] border-2 border-dashed border-border bg-card p-8 text-center">
              <p className="text-lg font-bold">Aún no has enviado solicitudes</p>
              <p className="mt-1 text-muted-foreground">
                Enviar una solicitud no implica aprobación: el albergue la revisa y te contacta.
              </p>
              <Link className="huellas-button mt-5" href="/adopt">
                Conocer animales
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
