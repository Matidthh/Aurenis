import * as React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<"nav"> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
}

/**
 * Componente accesible de Breadcrumbs según especificaciones WAI-ARIA.
 *
 * Características:
 * - <nav aria-label="Breadcrumb"> semántico.
 * - <ol> para jerarquía ordenada de niveles.
 * - aria-current="page" en el último elemento (página activa actual).
 * - El último elemento no es interactivo (no es enlace).
 * - Separador visual decorativo con aria-hidden="true".
 * - Soporte responsive con flex-wrap para evitar overflow horizontal en móvil.
 */
export function Breadcrumbs({
  items,
  separator,
  className,
  ...props
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center text-xs", className)} {...props}>
      <ol className="flex items-center gap-1.5 flex-wrap text-slate-500 dark:text-slate-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {index > 0 && (
                <span
                  className="text-slate-300 dark:text-slate-600 select-none shrink-0"
                  aria-hidden="true"
                >
                  {separator || <ChevronRight className="w-3.5 h-3.5" />}
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={cn(
                    "font-medium truncate max-w-[200px] sm:max-w-none",
                    isLast
                      ? "text-slate-800 dark:text-slate-200"
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-500 rounded"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
