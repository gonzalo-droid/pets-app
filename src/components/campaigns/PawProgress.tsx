import { campaignProgress, formatPEN } from "@/lib/utils";

// Huella compartida por el progreso, los espacios sin foto y la marca.
export function PawIcon({ className, fill = "currentColor" }: { className?: string; fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={fill} aria-hidden="true">
      <circle cx="6" cy="9" r="2.4" />
      <circle cx="10" cy="5.5" r="2.4" />
      <circle cx="14" cy="5.5" r="2.4" />
      <circle cx="18" cy="9" r="2.4" />
      <path d="M12 11c-3.5 0-6.5 3.8-6.5 6.5 0 2 1.6 3 3.4 3 1.4 0 2-.7 3.1-.7s1.7.7 3.1.7c1.8 0 3.4-1 3.4-3C18.5 14.8 15.5 11 12 11z" />
    </svg>
  );
}

/**
 * Avance de la meta. La barra tiene borde para verse aun vacía (contraste 3:1)
 * y el texto dice siempre el monto, así no depende solo del color.
 * Sin apoyos todavía, invita a ser la primera persona en lugar de mostrar 0 %.
 */
export default function PawProgress({
  current,
  goal,
  size = "md",
  open = true,
}: {
  current: number;
  goal: number;
  size?: "sm" | "md" | "lg";
  /** Una campaña cerrada no invita a apoyar. */
  open?: boolean;
}) {
  const pct = campaignProgress(current, goal);
  const done = pct >= 100;
  const bar = size === "lg" ? "h-3.5" : size === "sm" ? "h-2" : "h-3";
  return (
    <div className="flex flex-col gap-2">
      <div
        role="progressbar"
        aria-label="Avance de la meta"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-valuetext={`${formatPEN(current)} de ${formatPEN(goal)}`}
        className={`${bar} overflow-hidden rounded-full border border-track-border bg-track`}
      >
        <div
          className={`h-full rounded-full ${done ? "bg-primary" : "bg-support"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {size !== "sm" && (
        <p className="text-sm text-muted-foreground">
          {current > 0 ? (
            <>
              <strong className="font-extrabold text-foreground">{formatPEN(current)}</strong> de{" "}
              {formatPEN(goal)} ({pct} %)
            </>
          ) : (
            <>
              <strong className="font-extrabold text-foreground">Meta: {formatPEN(goal)}.</strong>{" "}
              {open ? "Aún no hay apoyos registrados; el tuyo sería el primero." : "No recibió apoyos registrados."}
            </>
          )}
        </p>
      )}
    </div>
  );
}
