export type Role = "user" | "shelter" | "admin";
export type Actor = {
  id: string;
  full_name: string;
  role: Role;
  shelter_id?: string;
};
export function canManage(actor: Actor, shelterId: string) {
  return (
    actor.role === "admin" ||
    (actor.role === "shelter" && actor.shelter_id === shelterId)
  );
}
export function safeRedirect(value: unknown, fallback = "/") {
  return typeof value === "string" &&
    /^\/(?![\/\\])/.test(value) &&
    !/[\\\r\n]/.test(value)
    ? value
    : fallback;
}
export function money(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (
    !Number.isFinite(n) ||
    n < 1 ||
    n > 100000 ||
    Math.abs(n * 100 - Math.round(n * 100)) > 0.000001
  )
    throw new Error(
      "El monto debe ser de S/ 1 a S/ 100 000, con máximo dos decimales.",
    );
  return n;
}
export function paymentState() {
  return "pending" as const;
}

export function sameOrigin(request: Request) {
  try {
    const origin = new URL(request.headers.get("origin") ?? "");
    return (
      origin.host === request.headers.get("host") &&
      origin.protocol === new URL(request.url).protocol
    );
  } catch {
    return false;
  }
}

/** Una campaña recibe aportes si está activa y su fecha límite no pasó. */
export function isCampaignOpen(
  c: { is_active: boolean; ends_at: string | null },
  now = Date.now(),
) {
  return c.is_active && (!c.ends_at || new Date(c.ends_at).getTime() >= now);
}

/**
 * Cambios de estado permitidos en una solicitud de adopción.
 * Rechazada y Completada son finales. Aprobar no completa la adopción:
 * completar es un paso explícito posterior.
 */
export const REQUEST_TRANSITIONS: Record<string, readonly string[]> = {
  pending: ["reviewing", "approved", "rejected"],
  reviewing: ["approved", "rejected"],
  approved: ["completed", "rejected"],
  rejected: [],
  completed: [],
};

export function canTransitionRequest(from: string, to: string) {
  return REQUEST_TRANSITIONS[from]?.includes(to) ?? false;
}
