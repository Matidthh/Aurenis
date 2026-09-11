"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, School, Shield, Home } from "lucide-react";
import { BreadcrumbItem, generateBreadcrumbs } from "@/lib/navigation/routes";
import { SchoolContextInfo } from "./types";
import { cn } from "@/lib/utils/cn";

export interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  schoolContext?: SchoolContextInfo;
  className?: string;
  showIcon?: boolean;
}

export function Breadcrumbs({
  items: customItems,
  schoolContext,
  className,
  showIcon = true,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  // Si no se suministran items personalizados, se generan dinámicamente con la jerarquía de rutas
  const items =
    customItems ||
    generateBreadcrumbs(pathname, {
      schoolName: schoolContext?.schoolName,
      schoolSlug: schoolContext?.schoolSlug,
    });

  if (!items || items.length === 0) {
    return null;
  }

  function renderIcon(iconName?: string) {
    if (!showIcon) return null;
    switch (iconName) {
      case "Shield":
        return <Shield className="w-3.5 h-3.5 shrink-0 text-slate-500 dark:text-slate-400" />;
      case "School":
        return <School className="w-3.5 h-3.5 shrink-0 text-brand-600 dark:text-brand-400" />;
      case "Home":
        return <Home className="w-3.5 h-3.5 shrink-0 text-slate-500 dark:text-slate-400" />;
      default:
        return null;
    }
  }

  return (
    <nav
      id="app-breadcrumbs-nav"
      aria-label="Migas de pan"
      className={cn(
        "flex items-center text-xs text-slate-500 dark:text-slate-400 min-w-0",
        className
      )}
    >
      <ol className="flex items-center gap-1.5 min-w-0 list-none p-0 m-0">
        {items.map((crumb, idx) => {
          const isLast = crumb.isCurrent || idx === items.length - 1;
          const isFirst = idx === 0;

          return (
            <li
              key={`${crumb.href}-${idx}`}
              className="flex items-center gap-1.5 min-w-0 truncate"
            >
              {idx > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span
                  id={`breadcrumb-item-current-${idx}`}
                  aria-current="page"
                  className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px] sm:max-w-[220px]"
                  title={crumb.label}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  id={`breadcrumb-item-link-${idx}`}
                  href={crumb.href}
                  className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors duration-150 truncate max-w-[130px] sm:max-w-[180px] focus:outline-none focus:underline"
                  title={crumb.label}
                >
                  {isFirst && renderIcon(crumb.iconName)}
                  <span className="truncate">{crumb.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
