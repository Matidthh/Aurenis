"use client";

import React, { useState } from "react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, AlertCircle, Percent } from "lucide-react";
import { AcademicPeriodItem } from "./school-settings-view";

interface CreatePeriodModalProps {
  isOpen: boolean;
  schoolId: string;
  onClose: () => void;
  onPeriodCreated: (newPeriod: AcademicPeriodItem) => void;
  termType?: string;
  existingPeriodsCount?: number;
}

export function CreatePeriodModal({
  isOpen,
  schoolId,
  onClose,
  onPeriodCreated,
  termType = "SEMESTER",
  existingPeriodsCount = 0,
}: CreatePeriodModalProps) {
  const currentYear = new Date().getFullYear();
  const defaultName =
    termType === "TRIMESTER"
      ? `${existingPeriodsCount + 1}° Trimestre`
      : `${existingPeriodsCount + 1}° Semestre`;

  const [name, setName] = useState(defaultName);
  const [year, setYear] = useState(currentYear);
  const [startDate, setStartDate] = useState(`${currentYear}-03-01`);
  const [endDate, setEndDate] = useState(`${currentYear}-07-15`);
  const [weightPercentage, setWeightPercentage] = useState<number>(50);
  const [isCurrent, setIsCurrent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre del período es requerido.");
      return;
    }
    if (new Date(startDate) >= new Date(endDate)) {
      setError("La fecha de inicio debe ser anterior a la fecha de término.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const newPeriod: AcademicPeriodItem = {
        id: `period_${Date.now()}`,
        name: name.trim(),
        year: Number(year),
        startDate,
        endDate,
        isCurrent,
        isClosed: false,
        weightPercentage: Number(weightPercentage) || 0,
      };

      onPeriodCreated(newPeriod);
      onClose();
      setName("");
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al crear el período.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader>
        <ModalTitle>Añadir Período Académico</ModalTitle>
        <ModalDescription>
          Configura un nuevo semestre o trimestre para el registro de calificaciones.
        </ModalDescription>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody>
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nombre del Período
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: 1° Semestre"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Año Lectivo
              </label>
              <Input
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={2020}
                max={2035}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Ponderación Anual (%)
              </label>
              <div className="relative">
                <Input
                  type="number"
                  value={weightPercentage}
                  onChange={(e) => setWeightPercentage(Number(e.target.value))}
                  min={1}
                  max={100}
                  required
                />
                <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Inicio
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Término
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isCurrentCheck"
              checked={isCurrent}
              onChange={(e) => setIsCurrent(e.target.checked)}
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isCurrentCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              Establecer como período académico activo/vigente
            </label>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Creando..." : "Crear Período"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
