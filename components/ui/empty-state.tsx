"use client";

import React from "react";
import { SearchX, Inbox, FilterX, RotateCcw, Plus } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils/cn";

export interface ActiveFilterItem {
  id: string;
  label: string;
  value: string;
  onRemove?: () => void;
}

export interface EmptyStateProps {
  icon?: "search" | "inbox" | "filter" | React.ReactNode;
  variant?: "filter" | "search" | "no-data";
  title?: string;
  description?: string;
  searchTerm?: string;
  activeFilterCount?: number;
  onClearFilters?: () => void;
  onResetFilters?: () => void;
  clearButtonText?: string;
  resetLabel?: string;
  activeFilters?: ActiveFilterItem[];
  helpfulTips?: string[];
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  className?: string;
  compact?: boolean;
  inTable?: boolean;
  colSpan?: number;
}

export function EmptyState({
  icon = "search",
  variant,
  title = "No se encontraron resultados",
  description = "Intenta ajustar los términos de búsqueda o restablecer los filtros aplicados para ver los registros.",
  searchTerm,
  activeFilterCount,
  onClearFilters,
  onResetFilters,
  clearButtonText,
  resetLabel = "Restablecer filtros",
  activeFilters,
  helpfulTips,
  action,
  secondaryAction,
  className,
  compact = false,
  inTable = false,
  colSpan = 1,
}: EmptyStateProps) {
  const effectiveClear = onClearFilters || onResetFilters;
  const effectiveClearLabel = clearButtonText || resetLabel;

  const renderIcon = () => {
    if (React.isValidElement(icon)) return icon;

    const chosen = variant === "no-data" ? "inbox" : variant === "filter" ? "filter" : icon;

    switch (chosen) {
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

        {activeFilterCount !== undefined && activeFilterCount > 0 && (
          <p className="text-[11px] text-slate-400 font-medium">
            ({activeFilterCount} {activeFilterCount === 1 ? "filtro activo" : "filtros activos"})
          </p>
        )}

        {activeFilters && activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
            {activeFilters.map((af) => (
              <span
                key={af.id}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              >
                <span>{af.label}: {af.value}</span>
                {af.onRemove && (
                  <button
                    type="button"
                    onClick={af.onRemove}
                    className="hover:text-red-500 cursor-pointer ml-0.5"
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
          </div>
        )}

        {helpfulTips && helpfulTips.length > 0 && (
          <div className="text-left bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 space-y-1 mt-2">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Sugerencias:</span>
            <ul className="list-disc list-inside space-y-0.5">
              {helpfulTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Acciones interactivas (Botón de limpiar filtros / Acción personalizada) */}
      {(effectiveClear || action || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {effectiveClear && (
            <Button
              variant="outline"
              size="sm"
              onClick={effectiveClear}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="font-semibold text-xs"
            >
              {effectiveClearLabel}
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
        <td colSpan={colSpan} className="p-0 border-0">
          {content}
        </td>
      </tr>
    );
  }

  return content;
}
