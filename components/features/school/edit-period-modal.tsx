"use client";

import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Calendar, Save, Trash2, Percent, Lock, Unlock } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useApiFormErrors } from "@/lib/hooks/use-api-form-errors";
import { ApiErrorAlert } from "@/components/ui/api-error-alert";
import { FormFieldError } from "@/components/ui/form-field-error";
import { useToast } from "@/components/ui/toast";

/**
 * Modal para Edición de Periodos Académicos con Mapeo de Errores Zod
 * Responsable de autoría: Maicol R. (Módulos de Gestión Escolar & Configuración)
 */

interface AcademicPeriodData {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isClosed: boolean;
  weightPercentage?: number;
  assessmentsCount?: number;
}

interface EditPeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: AcademicPeriodData | null;
  schoolId: string;
  onPeriodUpdated: (updatedPeriod: AcademicPeriodData) => void;
  onPeriodDeleted: (periodId: string) => void;
}

export function EditPeriodModal({
  isOpen,
  onClose,
  period,
  schoolId,
  onPeriodUpdated,
  onPeriodDeleted,
}: EditPeriodModalProps) {
  const [formData, setFormData] = useState({
    name: period?.name || "",
    year: period?.year || new Date().getFullYear(),
    startDate: period?.startDate || "",
    endDate: period?.endDate || "",
    weightPercentage: period?.weightPercentage ?? 50,
    isCurrent: period?.isCurrent ?? false,
    isClosed: period?.isClosed ?? false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { error, getFieldError, hasFieldError, clearErrors, handleApiError } = useApiFormErrors();
  const { toastSuccess } = useToast();

  useEffect(() => {
    if (period) {
      setFormData({
        name: period.name,
        year: period.year,
        startDate: period.startDate,
        endDate: period.endDate,
        weightPercentage: period.weightPercentage ?? 50,
        isCurrent: period.isCurrent,
        isClosed: period.isClosed,
      });
      clearErrors();
    }
  }, [period, clearErrors]);

  if (!period) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    setIsLoading(true);

    try {
      const response = await apiClient.patch<any>(`/api/schools/${schoolId}/academic-periods/${period.id}`, formData);
      const data = response.data;

      toastSuccess("Periodo Actualizado", {
        description: `El periodo "${formData.name}" ha sido guardado exitosamente.`,
      });

      onPeriodUpdated(data?.data?.period || data?.period || { ...period, ...formData });
      onClose();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (period.assessmentsCount && period.assessmentsCount > 0) {
      handleApiError(new Error(`No es posible eliminar este periodo porque tiene ${period.assessmentsCount} evaluaciones registradas.`));
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el periodo "${period.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsDeleting(true);
    clearErrors();

    try {
      await apiClient.delete(`/api/schools/${schoolId}/academic-periods/${period.id}`);

      toastSuccess("Periodo Eliminado", {
        description: `El periodo "${period.name}" fue eliminado del sistema.`,
      });

      onPeriodDeleted(period.id);
      onClose();
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>Editar Periodo Académico</ModalTitle>
          <ModalDescription>
            Modifica las fechas y ponderación de {period.name}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-4">
          <ApiErrorAlert error={error} onDismiss={clearErrors} />

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Nombre del Periodo *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (hasFieldError("name")) clearErrors();
              }}
              className={`w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                hasFieldError("name")
                  ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />
            <FormFieldError error={getFieldError("name")} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Año Lectivo
              </label>
              <input
                type="number"
                required
                min={2020}
                max={2030}
                value={formData.year}
                onChange={(e) => {
                  setFormData({ ...formData, year: parseInt(e.target.value) || period.year });
                  if (hasFieldError("year")) clearErrors();
                }}
                className={`w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                  hasFieldError("year")
                    ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                    : "border-slate-300 dark:border-slate-700"
                }`}
              />
              <FormFieldError error={getFieldError("year")} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Ponderación Anual (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={formData.weightPercentage}
                  onChange={(e) => {
                    setFormData({ ...formData, weightPercentage: parseFloat(e.target.value) || 0 });
                    if (hasFieldError("weightPercentage")) clearErrors();
                  }}
                  className={`w-full px-3.5 py-2 pr-8 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                    hasFieldError("weightPercentage")
                      ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                      : "border-slate-300 dark:border-slate-700"
                  }`}
                />
                <Percent className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
              <FormFieldError error={getFieldError("weightPercentage")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e.target.value });
                  if (hasFieldError("startDate")) clearErrors();
                }}
                className={`w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                  hasFieldError("startDate")
                    ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                    : "border-slate-300 dark:border-slate-700"
                }`}
              />
              <FormFieldError error={getFieldError("startDate")} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Fecha de Término *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                  if (hasFieldError("endDate")) clearErrors();
                }}
                className={`w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                  hasFieldError("endDate")
                    ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                    : "border-slate-300 dark:border-slate-700"
                }`}
              />
              <FormFieldError error={getFieldError("endDate")} />
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span>Periodo Vigente Actual</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formData.isClosed}
                onChange={(e) => setFormData({ ...formData, isClosed: e.target.checked })}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
              />
              <span className="flex items-center gap-1.5">
                {formData.isClosed ? <Lock className="w-3.5 h-3.5 text-red-500" /> : <Unlock className="w-3.5 h-3.5 text-emerald-500" />}
                Bloquear / Cerrar Actas de Calificación (Solo lectura)
              </span>
            </label>
          </div>
        </ModalBody>

        <ModalFooter className="flex items-center justify-between">
          <Button
            variant="danger"
            size="sm"
            type="button"
            onClick={handleDelete}
            disabled={isLoading || isDeleting || (period.assessmentsCount ?? 0) > 0}
            title={(period.assessmentsCount ?? 0) > 0 ? "Tiene evaluaciones registradas" : "Eliminar periodo"}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isLoading || isDeleting}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={isLoading || isDeleting}>
              <Save className="w-4 h-4 mr-1.5" />
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
