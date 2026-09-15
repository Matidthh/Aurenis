import React from "react";
import { cn } from "@/lib/utils/cn";

// ============================================================================
// 1. SKELETON BASE PRIMITIVE
// ============================================================================

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "shimmer" | "pulse" | "none";
  rounded?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

export function Skeleton({
  className,
  variant = "shimmer",
  rounded = "xl",
  ...props
}: SkeletonProps) {
  const roundedClasses = {
    none: "rounded-none",
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    xl: "rounded-xl",
    "2xl": "rounded-2xl",
    full: "rounded-full",
  };

  const variantClasses = {
    shimmer: "skeleton-shimmer animate-shimmer bg-slate-200/75 dark:bg-slate-800/80",
    pulse: "animate-pulse bg-slate-200/80 dark:bg-slate-800/80",
    none: "bg-slate-200/70 dark:bg-slate-800/70",
  };

  return (
    <div
      role="status"
      aria-label="Cargando contenido..."
      className={cn(
        "select-none overflow-hidden",
        roundedClasses[rounded],
        variantClasses[variant],
        className
      )}
      {...props}
    >
      <span className="sr-only">Cargando...</span>
    </div>
  );
}

// ============================================================================
// 2. STAT CARD SKELETON (TARJETAS DE RESUMEN Y MÉTRICAS)
// ============================================================================

export interface StatCardSkeletonProps {
  className?: string;
  variant?: "shimmer" | "pulse";
}

export function StatCardSkeleton({
  className,
  variant = "shimmer",
}: StatCardSkeletonProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        {/* Título de métrica */}
        <Skeleton variant={variant} className="h-3.5 w-24 rounded-md" />
        {/* Ícono de métrica */}
        <Skeleton variant={variant} className="h-7 w-7 rounded-lg shrink-0" />
      </div>

      {/* Valor numérico principal grande */}
      <Skeleton variant={variant} className="h-8 w-20 rounded-lg" />

      {/* Subtítulo / etiqueta de contexto */}
      <Skeleton variant={variant} className="h-3 w-32 rounded-md" />
    </div>
  );
}

export interface StatCardsGridSkeletonProps {
  count?: number;
  columnsClassName?: string;
  className?: string;
  variant?: "shimmer" | "pulse";
}

export function StatCardsGridSkeleton({
  count = 5,
  columnsClassName = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5",
  className,
  variant = "shimmer",
}: StatCardsGridSkeletonProps) {
  return (
    <div className={cn("grid gap-4", columnsClassName, className)}>
      {Array.from({ length: count }).map((_, index) => (
        <StatCardSkeleton key={index} variant={variant} />
      ))}
    </div>
  );
}

// ============================================================================
// 3. TABLE SKELETON (TABLAS ACCESIBLES CON CABECERA Y PAGINACIÓN)
// ============================================================================

export interface TableColumnSkeletonConfig {
  header?: string;
  width?: string;
  align?: "left" | "center" | "right";
}

export interface TableSkeletonProps {
  rows?: number;
  columns?: number | TableColumnSkeletonConfig[];
  showHeader?: boolean;
  showToolbar?: boolean;
  showPagination?: boolean;
  selectable?: boolean;
  containerClassName?: string;
  className?: string;
  variant?: "shimmer" | "pulse";
}

export function TableSkeleton({
  rows = 5,
  columns = 5,
  showHeader = true,
  showToolbar = false,
  showPagination = true,
  selectable = false,
  containerClassName,
  className,
  variant = "shimmer",
}: TableSkeletonProps) {
  // Configurar columnas numéricas o estructuradas
  const colsConfig: TableColumnSkeletonConfig[] = Array.isArray(columns)
    ? columns
    : Array.from({ length: columns }).map((_, i) => ({
        width: i === 0 ? "35%" : i === columns - 1 ? "15%" : "20%",
        align: i === columns - 1 ? "right" : "left",
      }));

  // Variaciones de ancho realistas para cada fila y evitar efecto bloque idéntico
  const cellWidthPatterns = [
    ["w-3/4", "w-1/2", "w-2/3", "w-1/3", "w-16"],
    ["w-2/3", "w-3/5", "w-1/2", "w-2/5", "w-20"],
    ["w-4/5", "w-2/5", "w-3/4", "w-1/2", "w-14"],
    ["w-3/5", "w-1/2", "w-2/3", "w-1/3", "w-18"],
    ["w-2/3", "w-3/4", "w-1/2", "w-2/5", "w-16"],
  ];

  return (
    <div className="space-y-4 w-full">
      {/* Barra de herramientas / buscador superior (si aplica) */}
      {showToolbar && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton variant={variant} className="h-10 w-full sm:w-80 rounded-xl" />
            <Skeleton variant={variant} className="h-10 w-36 rounded-xl hidden sm:block" />
            <Skeleton variant={variant} className="h-10 w-36 rounded-xl hidden md:block" />
          </div>
          <Skeleton variant={variant} className="h-10 w-36 rounded-xl shrink-0" />
        </div>
      )}

      {/* Contenedor de Tabla con Cabecera y Filas */}
      <div
        className={cn(
          "w-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs",
          containerClassName
        )}
      >
        <div className="w-full overflow-x-auto">
          <table className={cn("w-full text-left text-sm border-collapse", className)}>
            {showHeader && (
              <thead className="bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                <tr>
                  {selectable && (
                    <th scope="col" className="w-12 px-4 py-3.5">
                      <Skeleton variant={variant} className="w-4 h-4 rounded-md" />
                    </th>
                  )}
                  {colsConfig.map((col, idx) => (
                    <th
                      key={idx}
                      scope="col"
                      className={cn(
                        "px-4 py-3.5",
                        col.align === "right" && "text-right",
                        col.align === "center" && "text-center"
                      )}
                      style={{ width: col.width }}
                    >
                      {col.header ? (
                        <span>{col.header}</span>
                      ) : (
                        <div
                          className={cn(
                            "flex items-center",
                            col.align === "right" && "justify-end",
                            col.align === "center" && "justify-center"
                          )}
                        >
                          <Skeleton
                            variant={variant}
                            className={cn(
                              "h-3.5 rounded-md",
                              idx === 0 ? "w-28" : idx === colsConfig.length - 1 ? "w-16" : "w-20"
                            )}
                          />
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {Array.from({ length: rows }).map((_, rIdx) => {
                const widthSet = cellWidthPatterns[rIdx % cellWidthPatterns.length];
                return (
                  <tr key={rIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    {selectable && (
                      <td className="w-12 px-4 py-4">
                        <Skeleton variant={variant} className="w-4 h-4 rounded-md" />
                      </td>
                    )}
                    {colsConfig.map((col, cIdx) => {
                      const cellW = widthSet[cIdx % widthSet.length];
                      return (
                        <td
                          key={cIdx}
                          className={cn(
                            "px-4 py-4 align-middle",
                            col.align === "right" && "text-right",
                            col.align === "center" && "text-center"
                          )}
                        >
                          <div
                            className={cn(
                              "flex items-center gap-3",
                              col.align === "right" && "justify-end",
                              col.align === "center" && "justify-center"
                            )}
                          >
                            {/* Avatar o ícono simulado en primera columna */}
                            {cIdx === 0 && (
                              <Skeleton
                                variant={variant}
                                className="w-9 h-9 rounded-xl shrink-0 border border-slate-200 dark:border-slate-700/60"
                              />
                            )}

                            <div className={cn("space-y-1.5 flex-1", cIdx === 0 && "min-w-0")}>
                              <Skeleton
                                variant={variant}
                                className={cn("h-4 rounded-md", cellW)}
                              />
                              {cIdx === 0 && (
                                <Skeleton
                                  variant={variant}
                                  className="h-3 w-1/2 rounded-md"
                                />
                              )}
                            </div>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginación Skeleton */}
        {showPagination && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-850/80 gap-3">
            {/* Contador de registros */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
              <Skeleton variant={variant} className="h-4 w-44 rounded-md" />
              <Skeleton variant={variant} className="h-6 w-32 rounded-lg hidden sm:block" />
            </div>

            {/* Botones de navegación */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center sm:justify-end">
              <Skeleton variant={variant} className="h-8 w-8 rounded-lg" />
              <Skeleton variant={variant} className="h-8 w-8 rounded-lg" />
              <Skeleton variant={variant} className="h-6 w-24 rounded-md mx-2" />
              <Skeleton variant={variant} className="h-8 w-8 rounded-lg" />
              <Skeleton variant={variant} className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Fila individual de esqueleto para inserción en `<tbody>` existente
export interface TableRowSkeletonProps {
  columns?: number;
  selectable?: boolean;
  variant?: "shimmer" | "pulse";
}

export function TableRowSkeleton({
  columns = 5,
  selectable = false,
  variant = "shimmer",
}: TableRowSkeletonProps) {
  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
      {selectable && (
        <td className="w-12 px-4 py-4">
          <Skeleton variant={variant} className="w-4 h-4 rounded-md" />
        </td>
      )}
      {Array.from({ length: columns }).map((_, cIdx) => (
        <td key={cIdx} className="px-4 py-4 align-middle">
          <div className="flex items-center gap-3">
            {cIdx === 0 && (
              <Skeleton variant={variant} className="w-8 h-8 rounded-xl shrink-0" />
            )}
            <div className="space-y-1.5 flex-1">
              <Skeleton
                variant={variant}
                className={cn(
                  "h-4 rounded-md",
                  cIdx === 0 ? "w-3/4" : cIdx === columns - 1 ? "w-16" : "w-1/2"
                )}
              />
              {cIdx === 0 && (
                <Skeleton variant={variant} className="h-3 w-2/5 rounded-md" />
              )}
            </div>
          </div>
        </td>
      ))}
    </tr>
  );
}

// ============================================================================
// 4. CARD SKELETON (TARJETAS GENÉRICAS, CURSOS, AVISOS)
// ============================================================================

export interface CardSkeletonProps {
  className?: string;
  hasHeader?: boolean;
  hasFooter?: boolean;
  lines?: number;
  variant?: "shimmer" | "pulse";
}

export function CardSkeleton({
  className,
  hasHeader = true,
  hasFooter = true,
  lines = 2,
  variant = "shimmer",
}: CardSkeletonProps) {
  return (
    <div
      className={cn(
        "p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4",
        className
      )}
    >
      {hasHeader && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <Skeleton variant={variant} className="w-9 h-9 rounded-xl shrink-0" />
            <div className="space-y-1 flex-1">
              <Skeleton variant={variant} className="h-4 w-2/3 rounded-md" />
              <Skeleton variant={variant} className="h-3 w-1/3 rounded-md" />
            </div>
          </div>
          <Skeleton variant={variant} className="h-5 w-16 rounded-full shrink-0" />
        </div>
      )}

      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant={variant}
            className={cn(
              "h-3.5 rounded-md",
              i === lines - 1 ? "w-4/5" : "w-full"
            )}
          />
        ))}
      </div>

      {hasFooter && (
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Skeleton variant={variant} className="h-3 w-24 rounded-md" />
          <Skeleton variant={variant} className="h-7 w-20 rounded-lg" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 5. PAGE HEADER SKELETON (ENCABEZADOS DE PÁGINA)
// ============================================================================

export interface PageHeaderSkeletonProps {
  className?: string;
  hasAction?: boolean;
  variant?: "shimmer" | "pulse";
}

export function PageHeaderSkeleton({
  className,
  hasAction = true,
  variant = "shimmer",
}: PageHeaderSkeletonProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800",
        className
      )}
    >
      <div className="space-y-2">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2">
          <Skeleton variant={variant} className="h-3.5 w-16 rounded-md" />
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <Skeleton variant={variant} className="h-3.5 w-24 rounded-md" />
        </div>

        {/* Título Principal */}
        <div className="flex items-center gap-3">
          <Skeleton variant={variant} className="h-8 w-64 md:w-80 rounded-xl" />
          <Skeleton variant={variant} className="h-6 w-24 rounded-full" />
        </div>

        {/* Descripción */}
        <Skeleton variant={variant} className="h-4 w-96 max-w-full rounded-md" />
      </div>

      {/* Botón de acción */}
      {hasAction && (
        <div className="flex items-center gap-2">
          <Skeleton variant={variant} className="h-10 w-36 rounded-xl" />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 6. SMOOTH TRANSITION WRAPPER (TRANSICIONES VISUALES SUAVES SIN SALTOS)
// ============================================================================

export interface SmoothTransitionProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SmoothTransition({
  isLoading,
  skeleton,
  children,
  className,
}: SmoothTransitionProps) {
  return (
    <div className={cn("relative w-full transition-all duration-300 ease-in-out", className)}>
      {isLoading ? (
        <div className="w-full animate-fade-in" key="skeleton-view">
          {skeleton}
        </div>
      ) : (
        <div className="w-full animate-fade-in" key="content-view">
          {children}
        </div>
      )}
    </div>
  );
}
