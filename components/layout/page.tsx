import * as React from "react";
import { cn } from "@/lib/utils/cn";

export type PageWidth = "default" | "narrow" | "full";

export interface PageProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Ancho del contenido de página (no del AppShell).
   * - default: listas, dashboards y tablas (`max-w-6xl`, convención actual).
   * - narrow: formularios y ajustes (`max-w-4xl`).
   * - full: vistas que necesitan el ancho del main (sin tope).
   */
  width?: PageWidth;
}

const widthClass: Record<PageWidth, string> = {
  default: "max-w-6xl",
  narrow: "max-w-4xl",
  full: "max-w-none",
};

/**
 * Contenedor de contenido principal.
 * Define spacing vertical coherente entre cabecera y cuerpo.
 * El padding del viewport lo aporta AppShell; esta pieza no conoce la navegación.
 */
export function Page({ width = "default", className, ...props }: PageProps) {
  return (
    <div
      className={cn("w-full space-y-6", widthClass[width], className)}
      {...props}
    />
  );
}
