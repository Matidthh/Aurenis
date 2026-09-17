"use client";

import { useState, useEffect } from "react";
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
import { Trash2, Save, Calendar, Percent, BookOpen } from "lucide-react";
import { GradeMatrixAssessment } from "@/lib/services/grade.service";
import { DestructiveConfirmModal } from "@/components/ui/destructive-confirm-modal";

interface EditAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId: string;
  assessment: GradeMatrixAssessment | null;
  onUpdated: (updated: GradeMatrixAssessment) => void;
  onDeleted: (assessmentId: string) => void;
}

export function EditAssessmentModal({
  isOpen,
  onClose,
  schoolId,
  assessment,
  onUpdated,
  onDeleted,
}: EditAssessmentModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [weightPercentage, setWeightPercentage] = useState("20");
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assessment) {
      setTitle(assessment.title);
      setDescription(assessment.description || "");
      const d = assessment.date
        ? typeof assessment.date === "string"
          ? assessment.date.split("T")[0]
          : new Date(assessment.date).toISOString().split("T")[0]
        : "";
      setDate(d);
      setWeightPercentage(String(assessment.weightPercentage || 100));
      setIsPublished(assessment.isPublished ?? true);
      setError(null);
    }
  }, [assessment]);

  if (!assessment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("El título es obligatorio");
      return;
    }

    const weight = Number(weightPercentage);
    if (isNaN(weight) || weight < 0 || weight > 100) {
      setError("La ponderación debe estar entre 0% y 100%");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const res = await fetch(`/api/schools/${schoolId}/grades/assessments/${assessment.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          date,
          weightPercentage: weight,
          isPublished,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Error al actualizar la evaluación");
      }

      onUpdated({
        ...assessment,
        title: title.trim(),
        description: description.trim() || undefined,
        date,
        weightPercentage: weight,
        isPublished,
      });

      onClose();
    } catch (err: any) {
      setError(err.message || "Error al guardar cambios");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestDelete = () => {
    setIsConfirmDeleteOpen(true);
  };

  const handleExecuteDelete = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      const res = await fetch(`/api/schools/${schoolId}/grades/assessments/${assessment.id}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Error al eliminar evaluación");
      }

      setIsConfirmDeleteOpen(false);
      onDeleted(assessment.id);
      onClose();
    } catch (err: any) {
      setError(err.message || "Error al eliminar evaluación");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader>
        <ModalTitle>Editar Evaluación {assessment.code}</ModalTitle>
        <ModalDescription>
          Modifica los detalles, ponderación o estado de publicación de esta columna de calificación.
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
                placeholder="Título de la evaluación"
                className="pl-9"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descripción u Objetivos
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
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
                  className="pl-9"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="editIsPublishedCheck"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
            <label htmlFor="editIsPublishedCheck" className="text-xs text-slate-700 dark:text-slate-300 select-none">
              Publicada en libro de clases
            </label>
          </div>
        </ModalBody>

        <ModalFooter className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleRequestDelete}
            disabled={isDeleting || isSubmitting}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40"
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            {isDeleting ? "Eliminando..." : "Eliminar Columna"}
          </Button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting || isDeleting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting || isDeleting}>
              <Save className="w-4 h-4 mr-1.5" />
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </ModalFooter>
      </form>

      {/* Modal Destructivo para Eliminar Columna de Evaluación */}
      <DestructiveConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleExecuteDelete}
        title="¿Eliminar columna de evaluación y calificaciones?"
        entityName={assessment ? `${assessment.title} (${assessment.code})` : undefined}
        description="Esta acción eliminará de forma permanente la evaluación seleccionada y todas las notas asignadas a los alumnos en esta columna. Los promedios del curso se recalcularán automáticamente."
        requiredConfirmationText="ELIMINAR"
        confirmButtonText="Confirmar Eliminación de Columna"
        cancelButtonText="Cancelar y Conservar"
        isLoading={isDeleting}
        warningDetails={[
          "Se borrarán todas las notas registradas para cada estudiante en este casillero.",
          "El promedio acumulado y ponderado de los estudiantes se actualizará de inmediato.",
        ]}
      />
    </Modal>
  );
}
