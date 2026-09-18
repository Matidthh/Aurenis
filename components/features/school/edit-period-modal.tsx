"use client";

import { useState, useEffect } from "react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Calendar, Save, Trash2, AlertCircle, Percent, Lock, Unlock } from "lucide-react";

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
      setError(null);
    }
  }, [period]);

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!period) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      setError("El nombre del periodo es requerido");
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setError("La fecha de término debe ser posterior a la fecha de inicio");
      return;
    }

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
      onClose();
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
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al eliminar el periodo académico");
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
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 rounded-xl text-xs flex items-center gap-2 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-4 h-4 shrink-0" />
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
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
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || period.year })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
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
                  value={formData.weightPercentage}
                  onChange={(e) => setFormData({ ...formData, weightPercentage: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2 pr-8 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
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
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Fecha de Término *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              />
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
