"use client";

import React, { useState } from "react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle, Percent } from "lucide-react";
import { AcademicPeriodItem } from "./school-settings-view";

interface EditPeriodModalProps {
  isOpen: boolean;
  period: AcademicPeriodItem;
  schoolId: string;
  onClose: () => void;
  onPeriodUpdated: (updated: AcademicPeriodItem) => void;
  onPeriodDeleted: (periodId: string) => void;
}

export function EditPeriodModal({
  isOpen,
  period,
  schoolId,
  onClose,
  onPeriodUpdated,
  onPeriodDeleted,
}: EditPeriodModalProps) {
  const [name, setName] = useState(period.name);
  const [year, setYear] = useState(period.year);
  const [startDate, setStartDate] = useState(period.startDate);
  const [endDate, setEndDate] = useState(period.endDate);
  const [weightPercentage, setWeightPercentage] = useState<number>(period.weightPercentage ?? 50);
  const [isCurrent, setIsCurrent] = useState(period.isCurrent);
  const [isClosed, setIsClosed] = useState(period.isClosed);
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
      const updated: AcademicPeriodItem = {
        ...period,
        name: name.trim(),
        year: Number(year),
        startDate,
        endDate,
        isCurrent,
        isClosed,
        weightPercentage: Number(weightPercentage) || 0,
      };

      onPeriodUpdated(updated);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Ocurrió un error al actualizar el período.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar el período "${period.name}"?`)) {
      onPeriodDeleted(period.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader>
        <ModalTitle>Editar Período: {period.name}</ModalTitle>
        <ModalDescription>
          Modifica la ponderación, fechas y estado de cierre de actas.
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

          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isCurrentEditCheck"
                checked={isCurrent}
                onChange={(e) => setIsCurrent(e.target.checked)}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="isCurrentEditCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Período académico activo/vigente
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isClosedEditCheck"
                checked={isClosed}
                onChange={(e) => setIsClosed(e.target.checked)}
                className="rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="isClosedEditCheck" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                Cerrar actas y bloquear calificaciones en este período
              </label>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleDelete}
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Eliminar
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
