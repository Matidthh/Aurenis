"use client";

import { useState } from "react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Calendar, Plus, AlertCircle, Percent } from "lucide-react";

interface CreatePeriodModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  onPeriodCreated: (newPeriod: any) => void;
  termType?: string;
  existingPeriodsCount?: number;
}

export function CreatePeriodModal({
  isOpen,
  onClose,
  schoolId,
  onPeriodCreated,
  termType = "SEMESTER",
  existingPeriodsCount = 0,
}: CreatePeriodModalProps) {
  const currentYear = new Date().getFullYear();
  const defaultName =
    termType === "TRIMESTER"
      ? `${existingPeriodsCount + 1}° Trimestre ${currentYear}`
      : `${existingPeriodsCount + 1}° Semestre ${currentYear}`;

  const [formData, setFormData] = useState({
    name: defaultName,
    year: currentYear,
    startDate: `${currentYear}-03-01`,
    endDate: `${currentYear}-07-15`,
    weightPercentage: termType === "TRIMESTER" ? 33 : 50,
    isCurrent: existingPeriodsCount === 0,
    isClosed: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      const res = await fetch(`/api/schools/${schoolId}/academic-periods`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || data.error || "Error al crear periodo");
      }

      onPeriodCreated(data.data.period);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al crear el periodo académico");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <form onSubmit={handleSubmit}>
        <ModalHeader>
          <ModalTitle>Nuevo Periodo Académico</ModalTitle>
          <ModalDescription>
            Define un nuevo semestre o trimestre para el año lectivo institucional.
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
              placeholder="Ej: Primer Semestre 2026"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Año Lectivo *
              </label>
              <input
                type="number"
                required
                min={2020}
                max={2030}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || currentYear })}
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
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Fecha de Término *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
              />
              <span>Marcar como Periodo Vigente Actual</span>
            </label>
            <p className="text-[11px] text-slate-500 ml-6">
              El periodo vigente es el seleccionado por defecto en libros de clases y planillas de notas.
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" size="sm" type="button" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" type="submit" disabled={isLoading}>
            <Plus className="w-4 h-4 mr-1.5" />
            {isLoading ? "Creando..." : "Crear Periodo"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
