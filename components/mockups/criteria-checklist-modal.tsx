"use client";

import React, { useState } from "react";
import {
  X,
  CheckCircle2,
  Circle,
  Sparkles,
  Plus,
  Check,
  Award,
  Layers,
  Monitor,
  Eye,
  CheckCheck,
} from "lucide-react";

export interface CriterionItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  details: string[];
}

interface CriteriaChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  criteria: CriterionItem[];
  onToggleCriterion: (id: string) => void;
  onMarkAll: () => void;
  onAddCriterion: (title: string, description: string) => void;
}

export function CriteriaChecklistModal({
  isOpen,
  onClose,
  criteria,
  onToggleCriterion,
  onMarkAll,
  onAddCriterion,
}: CriteriaChecklistModalProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | "browser" | "responsive" | "resilience" | "e2e">("all");

  if (!isOpen) return null;

  const filteredCriteria = criteria.filter((c) => {
    if (filterCategory === "browser") return c.id.includes("browser");
    if (filterCategory === "responsive") return c.id.includes("responsive");
    if (filterCategory === "resilience") return c.id.includes("resilience");
    if (filterCategory === "e2e") return c.id.includes("e2e");
    return true;
  });

  const completedCount = criteria.filter((c) => c.completed).length;
  const totalCount = criteria.length;
  const percentage = Math.round((completedCount / totalCount) * 100);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddCriterion(newTitle.trim(), newDesc.trim() || "Criterio personalizado agregado por el equipo");
    setNewTitle("");
    setNewDesc("");
    setShowAddForm(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Definition of Done (Criterios de Aceptación)
              </h3>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  completedCount === totalCount
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200"
                }`}
              >
                {completedCount}/{totalCount} ({percentage}%)
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Verificación de entregables para los Mockups de Alta Fidelidad
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progreso y Acciones */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Progreso del Sprint
              </span>
              <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                {percentage}%
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onMarkAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
              >
                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Marcar todos</span>
              </button>

              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-900 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar criterio</span>
              </button>
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                completedCount === totalCount ? "bg-emerald-500" : "bg-brand-600"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Filtros por Categoría de DoD */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setFilterCategory("all")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition shrink-0 ${
                filterCategory === "all"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
              }`}
            >
              Todos ({criteria.length})
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("browser")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition shrink-0 ${
                filterCategory === "browser"
                  ? "bg-indigo-600 text-white"
                  : "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100"
              }`}
            >
              4 Navegadores (3)
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("responsive")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition shrink-0 ${
                filterCategory === "responsive"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100"
              }`}
            >
              Responsividad (3)
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("resilience")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition shrink-0 ${
                filterCategory === "resilience"
                  ? "bg-rose-600 text-white"
                  : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 hover:bg-rose-100"
              }`}
            >
              Resiliencia 500 (3)
            </button>
            <button
              type="button"
              onClick={() => setFilterCategory("e2e")}
              className={`px-2.5 py-1 rounded-lg font-semibold transition shrink-0 ${
                filterCategory === "e2e"
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100"
              }`}
            >
              Flujo E2E & BD (3)
            </button>
          </div>
        </div>

        {/* Formulario Agregar Criterio */}
        {showAddForm && (
          <form
            onSubmit={handleCreate}
            className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 space-y-2 text-xs"
          >
            <h4 className="font-bold text-slate-900 dark:text-white">Nuevo Criterio de Aceptación</h4>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Nombre del criterio (ej. Soporte para impresión de actas)"
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
              required
            />
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Descripción y detalles de cumplimiento..."
              className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-bold"
              >
                Guardar Criterio
              </button>
            </div>
          </form>
        )}

        {/* Lista de Criterios */}
        <div className="p-5 overflow-y-auto space-y-3.5 flex-1 text-xs">
          {filteredCriteria.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleCriterion(item.id)}
              className={`cursor-pointer p-4 rounded-xl border transition-all space-y-2 ${
                item.completed
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  className="mt-0.5 text-slate-400 hover:text-brand-600 focus:outline-hidden shrink-0"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`font-bold text-sm ${
                        item.completed
                          ? "text-emerald-900 dark:text-emerald-200 line-through opacity-90"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {item.title}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.completed
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {item.completed ? "Cumplido" : "Pendiente"}
                    </span>
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                    {item.description}
                  </p>

                  {item.details && item.details.length > 0 && (
                    <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                      {item.details.map((detail, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {completedCount === totalCount ? "🎉 Todos los criterios cumplidos" : "Haz clic en cada tarjeta para alternar su estado"}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
