"use client";

import { useState, useEffect, useCallback } from "react";
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

  const getInitialForm = useCallback(() => ({
    name: defaultName,
    year: currentYear,
    startDate: `${currentYear}-03-01`,
    endDate: `${currentYear}-07-15`,
    weightPercentage: termType === "TRIMESTER" ? 33 : 50,
    isCurrent: existingPeriodsCount === 0,
    isClosed: false,
  }), [defaultName, currentYear, termType, existingPeriodsCount]);

  const [formData, setFormData] = useState(getInitialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialForm());
      setFieldErrors({});
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen, getInitialForm]);

  function handleClose() {
    if (isLoading) return;
    setFormData(getInitialForm());
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
      handleClose();
    } catch (err: any) {
      setError(err.message || "Error al crear el periodo académico");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <form onSubmit={handleSubmit} noValidate>
        <ModalHeader>
          <ModalTitle>Nuevo Periodo Académico</ModalTitle>
          <ModalDescription>
            Define un nuevo semestre o trimestre para el año lectivo institucional.
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
              disabled={isLoading}
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
              }}
              placeholder="Ej: Primer Semestre 2026"
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
                Año Lectivo *
              </label>
              <input
                type="number"
                required
                min={2020}
                max={2030}
                disabled={isLoading}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || currentYear })}
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
                  disabled={isLoading}
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
              <div className="relative">
                <input
                  type="date"
                  required
                  disabled={isLoading}
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
              </div>
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
              <div className="relative">
                <input
                  type="date"
                  required
                  disabled={isLoading}
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
              </div>
              {fieldErrors.endDate && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.endDate}</span>
                </p>
              )}
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                disabled={isLoading}
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ ...formData, isCurrent: e.target.checked })}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 disabled:opacity-50"
              />
              <span>Marcar como Periodo Vigente Actual</span>
            </label>
            <p className="text-[11px] text-slate-500 ml-6">
              El periodo vigente es el seleccionado por defecto en libros de clases y planillas de notas.
            </p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" size="sm" type="button" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" type="submit" isLoading={isLoading} disabled={isLoading}>
            <Plus className="w-4 h-4 mr-1.5" />
            {isLoading ? "Creando..." : "Crear Periodo"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
