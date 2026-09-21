"use client";

import { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Award, Calendar, Percent, BookOpen } from "lucide-react";
import { apiClient } from "@/lib/api";

interface CreateAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolSlug: string;
  schoolId: string;
  subjectId: string;
  subjectName: string;
  academicPeriodId: string;
  periodName: string;
  onCreated: (newAssessment: any) => void;
}

export function CreateAssessmentModal({
  isOpen,
  onClose,
  schoolSlug,
  schoolId,
  subjectId,
  subjectName,
  academicPeriodId,
  periodName,
  onCreated,
}: CreateAssessmentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [weightPercentage, setWeightPercentage] = useState("20");
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título de la evaluación es obligatorio");
      return;
    }

    const weight = Number(weightPercentage);
    if (isNaN(weight) || weight < 0 || weight > 100) {
      setError("La ponderación debe ser un número entre 0% y 100%");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await apiClient.post<any>(`/api/schools/${schoolId}/grades/assessments`, {
        subjectId,
        academicPeriodId,
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        weightPercentage: weight,
        isPublished,
      });

      const responseData = response.data;
      onCreated(responseData?.data || responseData?.assessment || {
        id: `ass_${Date.now()}`,
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        weightPercentage: weight,
        isPublished,
      });

      // Limpiar formulario
      setTitle("");
      setDescription("");
      setWeightPercentage("20");
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al registrar la evaluación");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader>
        <ModalTitle>Nueva Columna de Evaluación</ModalTitle>
        <ModalDescription>
          Agrega una nueva columna de calificación para {subjectName} ({periodName}).
        </ModalDescription>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Título / Nombre de la Evaluación *
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Control 3: Funciones Cuadráticas"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descripción u Objetivos (Opcional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Ej: Evaluación sumativa sobre resolución de sistemas de ecuaciones..."
              className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Fecha de Aplicación
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Ponderación Semestral (%)
              </label>
              <div className="relative">
                <Percent className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={weightPercentage}
                  onChange={(e) => setWeightPercentage(e.target.value)}
                  placeholder="20"
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isPublishedCheck"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
            <label htmlFor="isPublishedCheck" className="text-xs text-slate-700 dark:text-slate-300 select-none">
              Publicar inmediatamente en el libro de clases (visible para actas)
            </label>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            <Award className="w-4 h-4 mr-1.5" />
            {isSubmitting ? "Creando..." : "Crear Columna"}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
