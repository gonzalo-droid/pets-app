import { PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

/** Logo único de HUELLAS: icono en bloque verde + nombre. */
export function Logo({
  size = "md",
  className,
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const sm = size === "sm";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display font-black tracking-tight text-foreground",
        sm ? "text-lg" : "text-xl",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "rounded-xl bg-primary text-primary-foreground",
          sm ? "p-1.5" : "p-2",
        )}
      >
        <PawPrint size={sm ? 18 : 23} />
      </span>
      HUELLAS
    </span>
  );
}
