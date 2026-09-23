"use client";

import React from "react";
import { SearchX, Inbox, FilterX, RotateCcw, Plus } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils/cn";

export interface EmptyStateProps {
  icon?: "search" | "inbox" | "filter" | React.ReactNode;
  title?: string;
  description?: string;
  searchTerm?: string;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  clearButtonText?: string;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
  compact?: boolean;
  inTable?: boolean;
  colSpan?: number;
  variant?: "filter" | "search" | "no-data" | string;
  onResetFilters?: () => void;
  resetLabel?: string;
  activeFilters?: any[];
  helpfulTips?: string[];
}

export function EmptyState({
  icon = "search",
  title = "No se encontraron resultados",
  description = "Intenta ajustar los términos de búsqueda o restablecer los filtros aplicados para ver los registros.",
  searchTerm,
  activeFilterCount,
  onClearFilters,
  clearButtonText = "Limpiar filtros",
  action,
  secondaryAction,
  className,
  compact = false,
  inTable = false,
  colSpan = 1,
  variant,
  onResetFilters,
  resetLabel = "Restablecer filtros",
  activeFilters,
  helpfulTips,
}: EmptyStateProps) {
  const handleClear = onClearFilters || onResetFilters;
  const filterCount = activeFilterCount ?? (activeFilters ? activeFilters.length : undefined);

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;
    if (variant === "filter") return <FilterX className={cn("text-slate-400 dark:text-slate-500", compact ? "w-6 h-6" : "w-8 h-8")} />;
    if (variant === "inbox" || variant === "no-data") return <Inbox className={cn("text-slate-400 dark:text-slate-500", compact ? "w-6 h-6" : "w-8 h-8")} />;

    switch (icon) {
      case "inbox":
        return <Inbox className={cn("text-slate-400 dark:text-slate-500", compact ? "w-6 h-6" : "w-8 h-8")} />;
      case "filter":
        return <FilterX className={cn("text-slate-400 dark:text-slate-500", compact ? "w-6 h-6" : "w-8 h-8")} />;
      case "search":
      default:
        return <SearchX className={cn("text-slate-400 dark:text-slate-500", compact ? "w-6 h-6" : "w-8 h-8")} />;
    }
  };

  const content = (
    <div
      role="status"
      aria-label={title}
      className={cn(
        "flex flex-col items-center justify-center text-center mx-auto transition-all animate-in fade-in duration-200 select-none",
        compact ? "p-6 max-w-sm space-y-3" : "py-12 px-6 max-w-md space-y-4",
        className
      )}
    >
      {/* Icono circular estilizado */}
      <div
        className={cn(
          "rounded-3xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 flex items-center justify-center shadow-2xs",
          compact ? "w-12 h-12" : "w-16 h-16"
        )}
      >
        {renderIcon()}
      </div>

      {/* Título y Mensaje descriptivo */}
      <div className="space-y-1.5">
        <h3 className={cn("font-bold text-slate-900 dark:text-white tracking-tight", compact ? "text-sm" : "text-base")}>
          {title}
        </h3>
        <p className={cn("text-slate-500 dark:text-slate-400 leading-relaxed", compact ? "text-xs" : "text-xs sm:text-sm")}>
          {searchTerm ? (
            <span>
              No hay coincidencias para <span className="font-semibold text-slate-700 dark:text-slate-300">«{searchTerm}»</span>. {description}
            </span>
          ) : (
            description
          )}
        </p>

        {filterCount !== undefined && filterCount > 0 && (
          <p className="text-[11px] text-slate-400 font-medium">
            ({filterCount} {filterCount === 1 ? "filtro activo" : "filtros activos"})
          </p>
        )}

        {helpfulTips && helpfulTips.length > 0 && (
          <ul className="pt-2 text-xs text-slate-400 dark:text-slate-500 space-y-1 list-disc list-inside">
            {helpfulTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        )}
      </div>

      {/* Acciones interactivas (Botón de limpiar filtros / Acción personalizada) */}
      {(handleClear || action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {handleClear && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="font-semibold text-xs"
            >
              {resetLabel || clearButtonText}
            </Button>
          )}

          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );

  if (inTable) {
    return (
      <tr>
        <td colSpan={colSpan} className="p-0">
          {content}
        </td>
      </tr>
    );
  }

  return content;
}
