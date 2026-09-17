"use client";

import React from "react";
import { RotateCcw, Plus, Sparkles, HelpCircle } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { cn } from "@/lib/utils/cn";

export type EmptyStateVariant = "search" | "filter" | "no-data" | "error";

export interface EmptyStateProps {
  /**
   * Tipo predefinido de ilustración y contexto
   * @default "search"
   */
  variant?: EmptyStateVariant;

  /**
   * Título principal visible
   */
  title: string;

  /**
   * Descripción amigable que explica el motivo y posibles soluciones
   */
  description?: string;

  /**
   * Término de búsqueda que causó el resultado vacío (opcional, para resaltar en el texto)
   */
  searchTerm?: string;

  /**
   * Función para restablecer filtros y reiniciar la búsqueda
   */
  onResetFilters?: () => void;

  /**
   * Texto del botón de restablecer filtros
   * @default "Restablecer filtros"
   */
  resetLabel?: string;

  /**
   * Acción primaria o secundaria adicional (ej. "Crear registro")
   */
  secondaryAction?: React.ReactNode;

  /**
   * Consejos o pasos guía útiles para orientar al usuario
   */
  helpfulTips?: string[];

  /**
   * Badges de filtros activos que pueden removerse
   */
  activeFilters?: Array<{
    id: string;
    label: string;
    value: string;
    onRemove?: () => void;
  }>;

  /**
   * Ilustración personalizada en caso de no desear las predeterminadas
   */
  customIllustration?: React.ReactNode;

  /**
   * Si se renderiza dentro de una tabla (crea <tr><td colSpan={colSpan}>...</td></tr>)
   */
  inTable?: boolean;

  /**
   * Número de columnas para colspan si se usa en tabla
   */
  colSpan?: number;

  /**
   * Clases adicionales para el contenedor principal
   */
  className?: string;
}

// Ilustración SVG de Búsqueda sin Resultados
function SearchEmptyIllustration() {
  return (
    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
      {/* Fondo circular con degradado suave y ondas de radar */}
      <div className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800/60 animate-pulse opacity-70" />
      <div className="absolute inset-2 rounded-full border border-dashed border-slate-300 dark:border-slate-700/80" />
      <div className="absolute inset-6 rounded-full bg-white dark:bg-slate-850 shadow-inner" />

      {/* SVG Ilustrativo de Lupa y Documento */}
      <svg
        className="w-16 h-16 relative z-10 text-brand-600 dark:text-brand-400 drop-shadow-sm"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Documento de fondo flotante */}
        <rect
          x="12"
          y="10"
          width="24"
          height="32"
          rx="4"
          className="fill-slate-200/80 dark:fill-slate-700/60 stroke-slate-300 dark:stroke-slate-600"
          strokeWidth="1.5"
        />
        <line
          x1="17"
          y1="18"
          x2="27"
          y2="18"
          className="stroke-slate-400 dark:stroke-slate-500"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="17"
          y1="24"
          x2="31"
          y2="24"
          className="stroke-slate-400 dark:stroke-slate-500"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="17"
          y1="30"
          x2="25"
          y2="30"
          className="stroke-slate-400 dark:stroke-slate-500"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Círculo de la lupa principal */}
        <circle
          cx="38"
          cy="34"
          r="13"
          className="fill-white dark:fill-slate-800 stroke-brand-500 dark:stroke-brand-400"
          strokeWidth="2.5"
        />

        {/* Destello interior de la lente */}
        <path
          d="M33 27C34.5 25.5 37 25 39 25"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-brand-400 dark:text-brand-300"
        />

        {/* Mango de la lupa */}
        <path
          d="M47 43L55 51"
          className="stroke-brand-600 dark:stroke-brand-400"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Pequeño signo de interrogación suave en la lente */}
        <path
          d="M36.5 32C36.5 30.5 37.5 29.5 39 29.5C40.5 29.5 41.5 30.5 41.5 31.5C41.5 33 39 33.5 39 35"
          className="stroke-slate-400 dark:stroke-slate-400"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="39" cy="37.5" r="0.75" className="fill-slate-400 dark:fill-slate-400" />
      </svg>

      {/* Partículas decorativas de brillo */}
      <span className="absolute top-2 right-4 text-amber-500 dark:text-amber-400">
        <Sparkles className="w-3.5 h-3.5 animate-bounce" />
      </span>
    </div>
  );
}

// Ilustración SVG de Filtro sin Resultados
function FilterEmptyIllustration() {
  return (
    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-indigo-50 dark:bg-indigo-950/40 opacity-80" />
      <div className="absolute inset-3 rounded-full border border-dashed border-indigo-200 dark:border-indigo-800/70" />

      <svg
        className="w-16 h-16 relative z-10 text-indigo-600 dark:text-indigo-400"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Embudo de filtrado */}
        <path
          d="M16 18H48L36 32V46L28 42V32L16 18Z"
          className="fill-white dark:fill-slate-800 stroke-indigo-600 dark:stroke-indigo-400"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Línea de exclusión cruzada */}
        <line
          x1="22"
          y1="22"
          x2="42"
          y2="22"
          className="stroke-indigo-300 dark:stroke-indigo-500"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Burbujas de filtros que se escapan */}
        <circle cx="20" cy="48" r="4" className="fill-indigo-100 dark:fill-indigo-900 stroke-indigo-400" strokeWidth="1.5" />
        <circle cx="44" cy="46" r="3" className="fill-indigo-100 dark:fill-indigo-900 stroke-indigo-400" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

// Ilustración SVG para colección vacía (sin datos creados aún)
function NoDataEmptyIllustration() {
  return (
    <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-slate-100 dark:bg-slate-800/60" />
      <div className="absolute inset-2 rounded-full border border-dashed border-slate-300 dark:border-slate-700" />

      <svg
        className="w-16 h-16 relative z-10 text-slate-500 dark:text-slate-400"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M14 20C14 17.7909 15.7909 16 18 16H27L31 21H46C48.2091 21 50 22.7909 50 25V44C50 46.2091 48.2091 48 46 48H18C15.7909 48 14 46.2091 14 44V20Z"
          className="fill-white dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-500"
          strokeWidth="2"
        />
        <line
          x1="32"
          y1="31"
          x2="32"
          y2="39"
          className="stroke-brand-500 dark:stroke-brand-400"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="28"
          y1="35"
          x2="36"
          y2="35"
          className="stroke-brand-500 dark:stroke-brand-400"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function EmptyState({
  variant = "search",
  title,
  description,
  searchTerm,
  onResetFilters,
  resetLabel = "Restablecer filtros",
  secondaryAction,
  helpfulTips,
  activeFilters,
  customIllustration,
  inTable = false,
  colSpan = 1,
  className,
}: EmptyStateProps) {
  // Selección de ilustración según la variante
  const renderIllustration = () => {
    if (customIllustration) return customIllustration;
    switch (variant) {
      case "filter":
        return <FilterEmptyIllustration />;
      case "no-data":
        return <NoDataEmptyIllustration />;
      case "search":
      default:
        return <SearchEmptyIllustration />;
    }
  };

  const defaultHelpfulTips =
    variant === "search" || variant === "filter"
      ? [
          "Verifica la ortografía o formato del texto (ej. RUN sin puntos o con guion).",
          "Prueba removiendo algunos filtros de curso, estado o categoría para ampliar los resultados.",
          "Usa palabras clave más generales o el primer apellido del registro.",
        ]
      : undefined;

  const tipsToDisplay = helpfulTips || defaultHelpfulTips;

  const content = (
    <div
      id="illustrated-empty-state"
      role="status"
      aria-live="polite"
      className={cn(
        "py-10 px-6 max-w-xl mx-auto flex flex-col items-center text-center space-y-4",
        className
      )}
    >
      {/* 1. Ilustración visual */}
      <div className="select-none">{renderIllustration()}</div>

      {/* 2. Cabecera y Textos Guía */}
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {searchTerm ? (
              <>
                No encontramos coincidencias para{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-200">
                  &ldquo;{searchTerm}&rdquo;
                </span>
                . {description}
              </>
            ) : (
              description
            )}
          </p>
        )}
      </div>

      {/* 3. Badges de filtros activos con botón de remoción rápida */}
      {activeFilters && activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
            Filtros aplicados:
          </span>
          {activeFilters.map((f) => (
            <Badge key={f.id} variant="neutral" className="text-xs py-0.5 px-2 flex items-center gap-1">
              <span className="text-slate-500 dark:text-slate-400">{f.label}:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{f.value}</span>
              {f.onRemove && (
                <button
                  type="button"
                  onClick={f.onRemove}
                  className="ml-1 hover:text-red-500 transition focus:outline-none"
                  title={`Quitar filtro ${f.label}`}
                  aria-label={`Quitar filtro ${f.label}`}
                >
                  &times;
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* 4. Botonera de Acciones (Botón directo de restablecer filtros + Acción secundaria) */}
      {(onResetFilters || secondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
          {onResetFilters && (
            <Button
              id="btn-reset-filters"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
            >
              {resetLabel}
            </Button>
          )}

          {secondaryAction}
        </div>
      )}

      {/* 5. Bloque de Instrucciones y Consejos Guía Amigables */}
      {tipsToDisplay && tipsToDisplay.length > 0 && (
        <div className="w-full mt-3 p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-850/60 border border-slate-200/80 dark:border-slate-800 text-left">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span>¿Qué puedes hacer para encontrar lo que buscas?</span>
          </div>
          <ul className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pl-4 list-disc marker:text-brand-500">
            {tipsToDisplay.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  if (inTable) {
    return (
      <tr>
        <td colSpan={colSpan} className="p-4 sm:p-8">
          {content}
        </td>
      </tr>
    );
  }

  return content;
}
