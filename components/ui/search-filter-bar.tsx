"use client";

import { useState, useEffect } from "react";
import { Search, X, Filter, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  
  // Course filter
  courses?: FilterOption[];
  selectedCourse?: string;
  onCourseChange?: (value: string) => void;

  // Status filter
  statuses?: FilterOption[];
  selectedStatus?: string;
  onStatusChange?: (value: string) => void;

  // Subject filter
  subjects?: FilterOption[];
  selectedSubject?: string;
  onSubjectChange?: (value: string) => void;

  // Reset handler
  onReset?: () => void;
  className?: string;
}

export function SearchFilterBar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Buscar por nombre, RUT o correo...",
  courses = [],
  selectedCourse = "",
  onCourseChange,
  statuses = [],
  selectedStatus = "",
  onStatusChange,
  subjects = [],
  selectedSubject = "",
  onSubjectChange,
  onReset,
  className,
}: SearchFilterBarProps) {
  // Internal search state with 300ms debounce
  const [inputValue, setInputValue] = useState(searchTerm);

  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== searchTerm) {
        onSearchChange(inputValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, searchTerm, onSearchChange]);

  const hasActiveFilters =
    Boolean(searchTerm) ||
    Boolean(selectedCourse) && selectedCourse !== "ALL" && selectedCourse !== "" ||
    Boolean(selectedStatus) && selectedStatus !== "ALL" && selectedStatus !== "" ||
    Boolean(selectedSubject) && selectedSubject !== "ALL" && selectedSubject !== "";

  const handleClearAll = () => {
    setInputValue("");
    onSearchChange("");
    if (onCourseChange) onCourseChange("ALL");
    if (onStatusChange) onStatusChange("ALL");
    if (onSubjectChange) onSubjectChange("ALL");
    if (onReset) onReset();
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3",
        className
      )}
    >
      {/* Input de búsqueda con debounce de 300ms */}
      <div className="relative flex-1">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-10 pr-9 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all text-slate-900 dark:text-white placeholder-slate-400"
        />
        {inputValue && (
          <button
            type="button"
            onClick={() => {
              setInputValue("");
              onSearchChange("");
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Limpiar búsqueda"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selectores de Filtro Combinables */}
      <div className="flex flex-wrap items-center gap-2">
        {courses.length > 0 && onCourseChange && (
          <select
            value={selectedCourse}
            onChange={(e) => onCourseChange(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="ALL">Todos los Cursos</option>
            {courses.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        )}

        {statuses.length > 0 && onStatusChange && (
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="ALL">Todos los Estados</option>
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}

        {subjects.length > 0 && onSubjectChange && (
          <select
            value={selectedSubject}
            onChange={(e) => onSubjectChange(e.target.value)}
            className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
          >
            <option value="ALL">Todas las Asignaturas</option>
            {subjects.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
        )}

        {/* Limpieza rápida de filtros */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 px-3 h-9"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Limpiar Filtros
          </Button>
        )}
      </div>
    </div>
  );
}
