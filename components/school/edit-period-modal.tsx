"use client";

import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Calendar, Save, Trash2, AlertCircle, Percent, Lock, Unlock, Loader2 } from "lucide-react";

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
  const getInitialForm = () => ({
    name: period?.name || "",
    year: period?.year || new Date().getFullYear(),
    startDate: period?.startDate || "",
    endDate: period?.endDate || "",
    weightPercentage: period?.weightPercentage ?? 50,
    isCurrent: period?.isCurrent ?? false,
    isClosed: period?.isClosed ?? false,
  });

  const [formData, setFormData] = useState(getInitialForm());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (period && isOpen) {
      setFormData({
        name: period.name,
        year: period.year,
        startDate: period.startDate,
        endDate: period.endDate,
        weightPercentage: period.weightPercentage ?? 50,
        isCurrent: period.isCurrent,
        isClosed: period.isClosed,
      });
      setFieldErrors({});
      setError(null);
      setIsLoading(false);
      setIsDeleting(false);
    }
  }, [period, isOpen]);

  if (!period) return null;

  function handleClose() {
    if (isLoading || isDeleting) return;
    setFieldErrors({});
    setError(null);
    onClose();
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = "El nombre del periodo es requerido.";
    }
    if (!formData.startDate) {
      errs.startDate = "La fecha de inicio es requerida.";
    }
    if (!formData.endDate) {
      errs.endDate = "La fecha de término es requerida.";
    }
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errs.endDate = "La fecha de término debe ser posterior a la de inicio.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await fetch(`/api/schools/${schoolId}/academic-periods/${period.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || data.error || "Error al actualizar periodo");
      }

      onPeriodUpdated(data.data.period);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Error al actualizar el periodo académico");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (period.assessmentsCount && period.assessmentsCount > 0) {
      setError(`No es posible eliminar este periodo porque tiene ${period.assessmentsCount} evaluaciones registradas.`);
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el periodo "${period.name}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/schools/${schoolId}/academic-periods/${period.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || data.error || "Error al eliminar periodo");
      }

      onPeriodDeleted(period.id);
      handleClose();
    } catch (err: any) {
      setError(err.message || "Error al eliminar el periodo académico");
    } finally {
      setIsDeleting(false);
    }
  };

  const isBusy = isLoading || isDeleting;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <form onSubmit={handleSubmit} noValidate>
        <ModalHeader>
          <ModalTitle>Editar Periodo Académico</ModalTitle>
          <ModalDescription>
            Modifica las fechas y ponderación de {period.name}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2 border border-red-200 dark:border-red-800 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Nombre del Periodo *
            </label>
            <input
              type="text"
              required
              disabled={isBusy}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
              }}
              className={`w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                fieldErrors.name
                  ? "border-red-500 text-red-900 dark:text-red-200"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />
            {fieldErrors.name && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.name}</span>
              </p>
            )}
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
                disabled={isBusy}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || period.year })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
              />
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
                  disabled={isBusy}
                  value={formData.weightPercentage}
                  onChange={(e) => setFormData({ ...formData, weightPercentage: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 pr-8 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
                />
                <Percent className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
              </div>
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
                disabled={isBusy}
                value={formData.startDate}
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e.target.value });
                  if (fieldErrors.startDate) setFieldErrors({ ...fieldErrors, startDate: "" });
                }}
                className={`w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                  fieldErrors.startDate
                    ? "border-red-500 text-red-900 dark:text-red-200"
                    : "border-slate-300 dark:border-slate-700"
                }`}
              />
              {fieldErrors.startDate && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.startDate}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Fecha de Término *
              </label>
              <input
                type="date"
                required
                disabled={isBusy}
                value={formData.endDate}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                  if (fieldErrors.endDate) setFieldErrors({ ...fieldErrors, endDate: "" });
                }}
                className={`w-full px-3.5 py-2 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                  fieldErrors.endDate
                    ? "border-red-500 text-red-900 dark:text-red-200"
                    : "border-slate-300 dark:border-slate-700"
                }`}
              />
              {fieldErrors.endDate && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.endDate}</span>
                </p>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-3">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                disabled={isBusy}
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 disabled:opacity-50"
              />
              <span>Periodo Vigente Actual</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                disabled={isBusy}
                checked={formData.isClosed}
                onChange={(e) => setFormData({ ...formData, isClosed: e.target.checked })}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 disabled:opacity-50"
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
            disabled={isBusy || (period.assessmentsCount ?? 0) > 0}
            title={(period.assessmentsCount ?? 0) > 0 ? "Tiene evaluaciones registradas" : "Eliminar periodo"}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            {isDeleting ? "Eliminando..." : "Eliminar"}
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" type="button" onClick={handleClose} disabled={isBusy}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" type="submit" isLoading={isLoading} disabled={isBusy}>
              <Save className="w-4 h-4 mr-1.5" />
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
