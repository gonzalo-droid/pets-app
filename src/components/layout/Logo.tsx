import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Logo de HUELLAS: huella + nombre.
 * `tone="light"` es la versión blanca para fondos verdes (panel).
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
        "inline-flex items-center gap-2 font-display font-extrabold tracking-tight",
        tone === "light" ? "text-white" : "text-primary",
        sm ? "text-lg" : "text-2xl",
        className,
      )}
    >
      <PawPrint
        aria-hidden="true"
        className={sm ? "h-5 w-5" : "h-7 w-7"}
        fill="currentColor"
        strokeWidth={1.5}
      />
      HUELLAS
    </span>
  );
}
