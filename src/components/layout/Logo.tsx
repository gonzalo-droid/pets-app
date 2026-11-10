import { PawIcon } from "@/components/campaigns/PawProgress";
import { cn } from "@/lib/utils";

/**
 * Logo de HUELLAS: huella en burbuja salvia + nombre en Fredoka.
 * `tone="light"` es la versión para fondos verdes (panel).
 */
export function Logo({
  size = "md",
  tone = "default",
  className,
}: {
  size?: "sm" | "md";
  tone?: "default" | "light";
  className?: string;
}) {
  const sm = size === "sm";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display font-bold tracking-tight",
        tone === "light" ? "text-white" : "text-primary",
        sm ? "text-xl" : "text-2xl",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-2xl",
          tone === "light" ? "bg-white/15" : "bg-secondary",
          sm ? "h-8 w-8" : "h-10 w-10",
        )}
      >
        <PawIcon className={sm ? "h-5 w-5" : "h-6 w-6"} />
      </span>
      HUELLAS
    </span>
  );
}
