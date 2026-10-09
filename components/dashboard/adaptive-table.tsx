"use client";

import React, { useState, useMemo } from "react";
import { Search, ChevronRight, Inbox, ArrowUpDown, Filter } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { EmptyState } from "@/components/ui/empty-state";

/**
 * ============================================================================
 * TABLA ADAPTATIVA MULTI-DISPOSITIVO (ADAPTIVE TABLE)
 * ============================================================================
 * - Desktop: Vista de tabla densa HTML tradicional con alineación estricta
 * - Móvil / Tablet: Vista apilada en tarjetas (Card Stack) táctil ≥ 44px
 * - Búsqueda en tiempo real integrada
 * - Estado vacío nativo con llamada a la acción
 *
 * Responsables: Lucas P. (UX/Responsive) & Malcom Marcelo (Lógica de Cliente)
 * ============================================================================
 */

export interface AdaptiveTableColumn<T> {
  key: string;
  header: string;
  className?: string;
  align?: "left" | "center" | "right";
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

export interface AdaptiveTableProps<T> {
  title?: string;
  description?: string;
  columns: AdaptiveTableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  searchPlaceholder?: string;
  searchFilter?: (item: T, query: string) => boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  renderMobileCard?: (item: T) => React.ReactNode;
  headerAction?: React.ReactNode;
  className?: string;
}

export function AdaptiveTable<T>({
  title,
  description,
  columns,
  data,
  keyExtractor,
  searchPlaceholder = "Buscar registros...",
  searchFilter,
  emptyTitle = "No se encontraron registros",
  emptyDescription = "No hay datos para mostrar en este período académico o filtro seleccionado.",
  emptyActionLabel,
  onEmptyAction,
  renderMobileCard,
  headerAction,
  className,
}: AdaptiveTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Filtrado reactivo en cliente
  const filteredData = useMemo(() => {
    let result = [...data];

    if (searchQuery.trim() && searchFilter) {
      result = result.filter((item) => searchFilter(item, searchQuery.trim()));
    }

    if (sortKey) {
      result.sort((a: any, b: any) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === valB) return 0;
        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return sortOrder === "asc" ? strA.localeCompare(strB) : strB.localeCompare(strA);
      });
    }

    return result;
  }, [data, searchQuery, searchFilter, sortKey, sortOrder]);

  function handleToggleSort(key: string) {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0C1425]/90 backdrop-blur-md shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Barra Superior: Título, Búsqueda y Acciones */}
      {(title || searchFilter || headerAction) && (
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {title && (
              <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {searchFilter && (
              <div className="relative flex-1 md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs rounded-xl py-2 pl-9 pr-3 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/30"
                />
              </div>
            )}
            {headerAction}
          </div>
        </div>
      )}

      {/* Contenido: Si está vacío */}
      {filteredData.length === 0 ? (
        <div className="py-10 px-4">
          <EmptyState
            title={searchQuery ? "Sin resultados de búsqueda" : emptyTitle}
            description={
              searchQuery
                ? `No se encontraron coincidencias para "${searchQuery}". Intenta con otros términos.`
                : emptyDescription
            }
            action={
              emptyActionLabel && onEmptyAction ? (
                <button
                  type="button"
                  onClick={onEmptyAction}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs cursor-pointer min-h-[44px]"
                >
                  {emptyActionLabel}
                </button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          {/* =========================================================================
              1. VISTA ESCRITORIO (HTML TABLE - HIDDEN EN MÓVIL)
              ========================================================================= */}
          <div className="hidden md:block w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-900/60 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleToggleSort(col.key)}
                      className={cn(
                        "py-3.5 px-4 font-semibold select-none",
                        col.sortable && "cursor-pointer hover:text-slate-900 dark:hover:text-white transition",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center",
                        col.className
                      )}
                    >
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5",
                          col.align === "right" && "justify-end",
                          col.align === "center" && "justify-center"
                        )}
                      >
                        <span>{col.header}</span>
                        {col.sortable && (
                          <ArrowUpDown className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredData.map((item) => (
                  <tr
                    key={keyExtractor(item)}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group"
                  >
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "py-3 px-4 text-slate-700 dark:text-slate-300 align-middle",
                          col.align === "right" && "text-right font-mono",
                          col.align === "center" && "text-center",
                          col.className
                        )}
                      >
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* =========================================================================
              2. VISTA MÓVIL / TABLET (CARD STACK - MD:HIDDEN)
              ========================================================================= */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
            {filteredData.map((item) => {
              if (renderMobileCard) {
                return (
                  <div key={keyExtractor(item)} className="p-4">
                    {renderMobileCard(item)}
                  </div>
                );
              }

              // Renderizado por defecto de tarjeta si no se pasa función custom
              return (
                <div
                  key={keyExtractor(item)}
                  className="p-4 space-y-2.5 active:bg-slate-50 dark:active:bg-slate-900/60 transition-colors"
                >
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className="flex items-center justify-between text-xs gap-3"
                    >
                      <span className="text-[11px] font-semibold uppercase text-slate-500 dark:text-slate-400">
                        {col.header}:
                      </span>
                      <div className="text-right font-medium text-slate-800 dark:text-slate-200">
                        {col.render ? col.render(item) : (item as any)[col.key]}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pie de Tabla: Conteo de Registros */}
      {filteredData.length > 0 && (
        <div className="p-3.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
          <span>Mostrando {filteredData.length} registros</span>
          <span className="text-slate-400 dark:text-slate-500">Sincronizado con base de datos</span>
        </div>
      )}
    </div>
  );
}
