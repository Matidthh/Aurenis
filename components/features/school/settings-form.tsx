"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";

interface SettingsFormProps {
  schoolId: string;
  initialSettings: {
    termType: string;
    minPassingGrade: number;
    minGrade: number;
    maxGrade: number;
    gradeScalePrecision: number;
    primaryColor: string;
    requireAttendanceNote: boolean;
  };
}

export function SchoolSettingsForm({ schoolId, initialSettings }: SettingsFormProps) {
  const [formData, setFormData] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    try {
      await apiClient.patch(`/api/schools/${schoolId}/settings`, formData);
      setStatusMessage({ type: "success", text: "Configuración actualizada exitosamente." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-sm border ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Régimen y Periodos */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Régimen y Periodos Lectivos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Estructura del Periodo
            </label>
            <select
              value={formData.termType}
              onChange={(e) => setFormData({ ...formData, termType: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            >
              <option value="SEMESTER">Semestral (2 periodos)</option>
              <option value="TRIMESTER">Trimestral (3 periodos)</option>
              <option value="ANNUAL">Anual (1 periodo continuo)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Color de Identidad Institucional
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
              />
              <span className="font-mono text-sm uppercase">{formData.primaryColor}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Escala de Calificaciones */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Escala de Calificaciones</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Nota Mínima
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.minGrade}
              onChange={(e) => setFormData({ ...formData, minGrade: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Nota de Aprobación
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.minPassingGrade}
              onChange={(e) => setFormData({ ...formData, minPassingGrade: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Nota Máxima
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.maxGrade}
              onChange={(e) => setFormData({ ...formData, maxGrade: parseFloat(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition shadow-sm disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Guardando cambios...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
