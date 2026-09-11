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
 * Breadcrumbs accesibles (WAI-ARIA).
 *
 * Representan la jerarquía visual de la interfaz, no necesariamente la URL.
 * El último ítem es siempre la página actual: no es enlace, incluso si trae `href`.
 * Los separadores son decorativos (`aria-hidden`).
 */
export function Breadcrumbs({
  items,
  separator,
  className,
  ...props
}: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)} {...props}>
      <ol className="flex items-center gap-1.5 flex-wrap text-xs text-slate-500 dark:text-slate-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isCurrent = isLast;
          const showLink = Boolean(item.href) && !isCurrent;

          return (
            <li
              key={`${item.label}-${index}`}
              className="inline-flex items-center gap-1.5 min-w-0"
            >
              {index > 0 && (
                <span
                  className="text-slate-300 dark:text-slate-600 select-none shrink-0"
                  aria-hidden="true"
                >
                  {separator ?? <ChevronRight className="w-3.5 h-3.5" />}
                </span>
              )}
              {showLink ? (
                <Link
                  href={item.href!}
                  className="truncate max-w-[12rem] sm:max-w-none rounded-sm hover:text-slate-900 dark:hover:text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "truncate max-w-[12rem] sm:max-w-none",
                    isCurrent
                      ? "font-medium text-slate-800 dark:text-slate-200"
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
