"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useApiFormErrors } from "@/lib/hooks/use-api-form-errors";
import { ApiErrorAlert } from "@/components/ui/api-error-alert";
import { FormFieldError } from "@/components/ui/form-field-error";
import { useToast } from "@/components/ui/toast";

/**
 * Formulario de Ajustes Institucionales con Mapeo de Errores de API y Zod
 * Responsable de autoría: Maicol R. (Módulos de Gestión Escolar & Configuración)
 */

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { error, getFieldError, hasFieldError, clearErrors, handleApiError } = useApiFormErrors();
  const { toastSuccess } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage(null);
    clearErrors();

    try {
      const response = await apiClient.patch(`/api/schools/${schoolId}/settings`, formData);
      setSuccessMessage("Configuración actualizada exitosamente.");
      toastSuccess("Configuración guardada", {
        description: response.message || "Los parámetros escolares fueron guardados correctamente.",
      });
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Alerta de Éxito */}
      {successMessage && (
        <div className="p-4 rounded-xl text-sm border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 flex items-center justify-between animate-in fade-in">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-xs font-bold underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Alerta de Error de API mapeada (400, 401, 403, 422, 500) */}
      <ApiErrorAlert error={error} onDismiss={clearErrors} />

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
              onChange={(e) => {
                setFormData({ ...formData, termType: e.target.value });
                if (hasFieldError("termType")) clearErrors();
              }}
              className={`w-full px-3.5 py-2.5 rounded-lg border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                hasFieldError("termType")
                  ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            >
              <option value="SEMESTER">Semestral (2 periodos)</option>
              <option value="TRIMESTER">Trimestral (3 periodos)</option>
              <option value="ANNUAL">Anual (1 periodo continuo)</option>
            </select>
            <FormFieldError error={getFieldError("termType")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Color de Identidad Institucional
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => {
                  setFormData({ ...formData, primaryColor: e.target.value });
                  if (hasFieldError("primaryColor")) clearErrors();
                }}
                className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer p-0.5"
              />
              <span className="font-mono text-sm uppercase">{formData.primaryColor}</span>
            </div>
            <FormFieldError error={getFieldError("primaryColor")} />
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
              onChange={(e) => {
                setFormData({ ...formData, minGrade: parseFloat(e.target.value) || 0 });
                if (hasFieldError("minGrade")) clearErrors();
              }}
              className={`w-full px-3.5 py-2.5 rounded-lg border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                hasFieldError("minGrade")
                  ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />
            <FormFieldError error={getFieldError("minGrade")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Nota de Aprobación
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.minPassingGrade}
              onChange={(e) => {
                setFormData({ ...formData, minPassingGrade: parseFloat(e.target.value) || 0 });
                if (hasFieldError("minPassingGrade")) clearErrors();
              }}
              className={`w-full px-3.5 py-2.5 rounded-lg border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                hasFieldError("minPassingGrade")
                  ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />
            <FormFieldError error={getFieldError("minPassingGrade")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
              Nota Máxima
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.maxGrade}
              onChange={(e) => {
                setFormData({ ...formData, maxGrade: parseFloat(e.target.value) || 0 });
                if (hasFieldError("maxGrade")) clearErrors();
              }}
              className={`w-full px-3.5 py-2.5 rounded-lg border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                hasFieldError("maxGrade")
                  ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />
            <FormFieldError error={getFieldError("maxGrade")} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm transition shadow-sm disabled:opacity-50 cursor-pointer"
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
