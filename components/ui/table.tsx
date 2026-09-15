import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Inbox, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

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
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: TablePaginationProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs text-slate-500 dark:text-slate-400 gap-3",
        className
      )}
    >
      <div>
        Mostrando <span className="font-semibold text-slate-700 dark:text-slate-300">{startItem}</span> a{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-300">{endItem}</span> de{" "}
        <span className="font-semibold text-slate-700 dark:text-slate-300">{totalItems}</span> registros
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-medium text-slate-700 dark:text-slate-300">
          Página {currentPage} de {totalPages || 1}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// 10. Generic DataTable with Sorting and Row Selection
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
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
    <Table containerClassName={containerClassName} className={className}>
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
            const alignClasses = {
              left: "text-left",
              center: "text-center",
              right: "text-right",
            };
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
                <div className={cn("flex items-center gap-1.5", col.align === "right" && "justify-end", col.align === "center" && "justify-center")}>
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
        {sortedData.length === 0 ? (
          <TableEmptyState title={emptyTitle} description={emptyDescription} colSpan={colSpanCount} />
        ) : (
          sortedData.map((item) => {
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
    </Table>
  );
}
