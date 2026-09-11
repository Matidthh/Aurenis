import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
}

/**
 * Encabezado de página institucional Aurenis.
 *
 * Jerarquía:
 * Breadcrumbs → Título → Descripción → Metadata (badge) → Acciones → Contenido (fuera).
 *
 * En mobile el título envuelve y las acciones pasan a disposición vertical
 * para evitar overflow. `children` sigue siendo el slot de acciones (compatibilidad).
 */
export function PageHeader({
  title,
  description,
  badge,
  breadcrumbs,
  action,
  children,
  className,
}: PageHeaderProps) {
  const actions = action || children;

  return (
    <header className={cn("space-y-3", className)}>
      {breadcrumbs}

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white break-words text-balance">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
              {description}
            </p>
          )}
          {badge && <div className="pt-0.5">{badge}</div>}
        </div>

        {actions && (
          <div className="flex flex-col items-stretch gap-3 w-full sm:flex-row sm:flex-wrap sm:items-center md:w-auto md:shrink-0 md:justify-end [&>*]:w-full sm:[&>*]:w-auto">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
  );
}
