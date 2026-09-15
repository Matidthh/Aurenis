import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Inbox,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { TableSkeleton } from "./skeleton";

// 1. Table Root Wrapper
export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  containerClassName?: string;
}

export function Table({ className, containerClassName, children, ...props }: TableProps) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs",
        containerClassName
      )}
    >
      <table
        className={cn("w-full text-left text-sm text-slate-600 dark:text-slate-300 border-collapse", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

// 2. Table Header
export function TableHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

// 3. Table Body
export function TableBody({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900", className)}
      {...props}
    >
      {children}
    </tbody>
  );
}

// 4. Table Row
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  isSelected?: boolean;
}

export function TableRow({ className, isSelected, children, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors duration-100 hover:bg-slate-50/80 dark:hover:bg-slate-800/50",
        isSelected && "bg-brand-50/60 dark:bg-brand-950/40 font-medium",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

// 5. Table Head Cell
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
  isSorted?: boolean;
  sortDirection?: "asc" | "desc";
}

export function TableHead({
  className,
  align = "left",
  children,
  ...props
}: TableHeadProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <th
      scope="col"
      className={cn(
        "px-4 py-3.5 text-xs font-semibold select-none",
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
}

// 6. Table Cell
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "center" | "right";
}

export function TableCell({
  className,
  align = "left",
  children,
  ...props
}: TableCellProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <td
      className={cn(
        "px-4 py-3.5 text-sm align-middle",
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

// 7. Table Caption (Accessible)
export function TableCaption({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn("p-2 text-xs text-slate-400 italic text-left", className)}
      {...props}
    >
      {children}
    </caption>
  );
}

// 8. Empty State for Tables
export interface TableEmptyStateProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  colSpan?: number;
}

export function TableEmptyState({
  title = "No se encontraron registros",
  description = "No hay datos disponibles para mostrar en esta vista.",
  action,
  colSpan = 1,
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="p-8 text-center">
        <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-2.5">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Inbox className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{description}</p>
          {action && <div className="pt-2">{action}</div>}
        </div>
      </td>
    </tr>
  );
}

// 9. Table Pagination Bar
export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showQuickJumper?: boolean;
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = [10, 25, 50],
  showPageSizeSelector = true,
  showQuickJumper = true,
  className,
}: TablePaginationProps) {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < safeTotalPages && totalItems > 0;

  return (
    <div
      id="table-pagination-control"
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/80 text-xs text-slate-500 dark:text-slate-400 gap-3",
        className
      )}
    >
      {/* Contador total y selector de filas por página */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <div id="pagination-counter-label">
          {totalItems === 0 ? (
            <span>0 registros encontrados</span>
          ) : (
            <>
              Mostrando <span className="font-semibold text-slate-700 dark:text-slate-300">{startItem}</span> a{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{endItem}</span> de{" "}
              <span className="font-semibold text-slate-700 dark:text-slate-300">{totalItems}</span> registros
            </>
          )}
        </div>

        {showPageSizeSelector && onItemsPerPageChange && (
          <div className="flex items-center gap-2">
            <label htmlFor="select-rows-per-page" className="text-slate-500 dark:text-slate-400 whitespace-nowrap">
              Filas por página:
            </label>
            <select
              id="select-rows-per-page"
              aria-label="Selector de filas por página"
              value={itemsPerPage}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                onItemsPerPageChange(newSize);
              }}
              className="px-2 py-1 text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer transition shadow-2xs"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Botonera de navegación e indicador de página X de Y */}
      <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
        {showQuickJumper && (
          <button
            type="button"
            id="btn-pagination-first"
            onClick={() => onPageChange(1)}
            disabled={!canGoPrevious}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Primera página"
            title="Primera página"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        <button
          type="button"
          id="btn-pagination-prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Página anterior"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span
          id="pagination-indicator-text"
          className="px-3 py-1 font-medium text-slate-700 dark:text-slate-300 select-none whitespace-nowrap"
        >
          Página <strong className="font-semibold text-slate-900 dark:text-white">{currentPage}</strong> de{" "}
          <strong className="font-semibold text-slate-900 dark:text-white">{safeTotalPages}</strong>
        </span>

        <button
          type="button"
          id="btn-pagination-next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
          aria-label="Página siguiente"
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {showQuickJumper && (
          <button
            type="button"
            id="btn-pagination-last"
            onClick={() => onPageChange(safeTotalPages)}
            disabled={!canGoNext}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            aria-label="Última página"
            title="Última página"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// 10. Generic DataTable with Sorting, Row Selection, and Synchronized Pagination
export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  containerClassName?: string;
  className?: string;

  // Pagination support
  pagination?: boolean;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Loading state with animated skeleton
  isLoading?: boolean;
  loadingRows?: number;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  emptyTitle = "No se encontraron registros",
  emptyDescription = "No hay elementos para mostrar en esta tabla.",
  containerClassName,
  className,
  pagination = false,
  initialPageSize = 10,
  pageSizeOptions = [10, 25, 50],
  currentPage: controlledPage,
  onPageChange: controlledOnPageChange,
  onPageSizeChange: controlledOnPageSizeChange,
  isLoading = false,
  loadingRows,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Local pagination state if not controlled
  const [localPage, setLocalPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);

  const activePage = controlledPage !== undefined ? controlledPage : localPage;

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a: any, b: any) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;
      const comparison = aVal < bVal ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  // Synchronized pagination calculation
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;

  // Sliced data based on active page
  const displayData = useMemo(() => {
    if (!pagination) return sortedData;
    const clampedPage = Math.min(Math.max(1, activePage), totalPages);
    const startIndex = (clampedPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, activePage, pageSize, totalPages]);

  const handlePageChange = (newPage: number) => {
    const clamped = Math.min(Math.max(1, newPage), totalPages);
    if (controlledOnPageChange) {
      controlledOnPageChange(clamped);
    } else {
      setLocalPage(clamped);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    if (controlledOnPageSizeChange) {
      controlledOnPageSizeChange(newSize);
    }
    // Sincronización: volver a la página 1 al cambiar el tamaño de página
    handlePageChange(1);
  };

  if (isLoading) {
    return (
      <TableSkeleton
        rows={loadingRows || initialPageSize || 5}
        columns={columns.map((c) => ({
          header: c.header,
          align: c.align,
        }))}
        selectable={selectable}
        showPagination={pagination}
        containerClassName={containerClassName}
        className={className}
      />
    );
  }

  const allSelected = data.length > 0 && data.every((item) => selectedIds.includes(keyExtractor(item)));
  const someSelected = data.some((item) => selectedIds.includes(keyExtractor(item))) && !allSelected;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      const allIds = data.map((item) => keyExtractor(item));
      onSelectionChange(Array.from(new Set([...selectedIds, ...allIds])));
    } else {
      const currentIdsToRemove = new Set(data.map((item) => keyExtractor(item)));
      onSelectionChange(selectedIds.filter((id) => !currentIdsToRemove.has(id)));
    }
  };

  const handleSelectRow = (item: T) => {
    if (!onSelectionChange) return;
    const id = keyExtractor(item);
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const colSpanCount = columns.length + (selectable ? 1 : 0);

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs",
        containerClassName
      )}
    >
      <div className="w-full overflow-x-auto">
        <table
          className={cn("w-full text-left text-sm text-slate-600 dark:text-slate-300 border-collapse", className)}
        >
          <TableHeader>
            <tr>
              {selectable && (
                <th scope="col" className="w-12 px-4 py-3.5">
                  <input
                    type="checkbox"
                    aria-label="Seleccionar todos los elementos"
                    checked={allSelected}
                    ref={(input) => {
                      if (input) input.indeterminate = someSelected;
                    }}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                return (
                  <TableHead
                    key={String(col.key)}
                    align={col.align || "left"}
                    onClick={() => col.sortable && handleSort(String(col.key))}
                    className={cn(
                      col.sortable && "cursor-pointer hover:text-slate-900 dark:hover:text-white transition",
                      col.className
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-1.5",
                        col.align === "right" && "justify-end",
                        col.align === "center" && "justify-center"
                      )}
                    >
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="w-3.5 h-3.5 text-brand-600" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-brand-600" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-50 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </tr>
          </TableHeader>
          <TableBody>
            {displayData.length === 0 ? (
              <TableEmptyState title={emptyTitle} description={emptyDescription} colSpan={colSpanCount} />
            ) : (
              displayData.map((item) => {
                const id = keyExtractor(item);
                const isSelected = selectedIds.includes(id);
                return (
                  <TableRow key={id} isSelected={isSelected}>
                    {selectable && (
                      <td className="w-12 px-4 py-3.5">
                        <input
                          type="checkbox"
                          aria-label={`Seleccionar elemento ${id}`}
                          checked={isSelected}
                          onChange={() => handleSelectRow(item)}
                          className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <TableCell key={String(col.key)} align={col.align || "left"} className={col.className}>
                        {col.cell ? col.cell(item) : (item as any)[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </table>
      </div>

      {pagination && (
        <TablePagination
          currentPage={activePage}
          totalPages={totalPages}
          totalItems={sortedData.length}
          itemsPerPage={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}

export { TableSkeleton, TableRowSkeleton } from "./skeleton";
