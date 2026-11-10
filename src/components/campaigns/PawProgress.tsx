import { campaignProgress, formatPEN } from "@/lib/utils";

// Huella compartida por el progreso y la marca.
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
 * Avance de la meta con 10 huellitas. El texto acompaña siempre al dibujo
 * (no solo color) y aclara que la recaudación es un dato registrado.
 */
export default function PawProgress({
  current,
  goal,
  size = "md",
}: {
  current: number;
  goal: number;
  size?: "md" | "lg";
}) {
  const pct = campaignProgress(current, goal);
  const filled = Math.round(pct / 10);
  const paw = size === "lg" ? "h-7 w-7" : "h-5 w-5";
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex flex-wrap gap-1"
        role="img"
        aria-label={`Avance de la meta: ${pct} %`}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <PawIcon
            key={i}
            className={`${paw} ${i < filled ? "text-support" : "text-support-soft"}`}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        <strong className="font-extrabold text-foreground">{formatPEN(current)}</strong> de{" "}
        {formatPEN(goal)} · {pct} %
      </p>
    </div>
  );
}
