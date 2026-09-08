import React from "react";
import { cn } from "@/lib/utils/cn";

export interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Encabezado de página institucional Aurenis.
 * Estructura: Breadcrumbs -> Badge -> Title + Description -> Actions.
 * En mobile las acciones se ubican fluidamente debajo del texto sin generar desbordamiento.
 */
export function PageHeader({
  title,
  description,
  badge,
  breadcrumbs,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {breadcrumbs && <div>{breadcrumbs}</div>}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          {badge && <div className="mb-2">{badge}</div>}
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
          )}
        </div>
        {children && (
          <div className="flex items-center gap-3 shrink-0 flex-wrap">{children}</div>
        )}
      </div>
    </div>
  );
}
