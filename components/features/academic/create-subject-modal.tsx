"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
import { Plus, BookOpen, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api";
import { useApiFormErrors } from "@/lib/hooks/use-api-form-errors";
import { ApiErrorAlert } from "@/components/ui/api-error-alert";
import { FormFieldError } from "@/components/ui/form-field-error";
import { useToast } from "@/components/ui/toast";

/**
 * Modal para Creación de Asignatura Académica con Mapeo de Errores Zod
 * Responsable de autoría: Frank M. (Gestión Curricular y Estructura Académica)
 */

interface CourseOption {
  id: string;
  name: string;
}

interface TeacherOption {
  id: string;
  name: string;
  specialty?: string | null;
}

interface CreateSubjectModalProps {
  schoolSlug: string;
  courses: CourseOption[];
  teachers: TeacherOption[];
}

export function CreateSubjectModal({
  schoolSlug,
  courses,
  teachers,
}: CreateSubjectModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { error, getFieldError, hasFieldError, clearErrors, handleApiError } = useApiFormErrors();
  const { toastSuccess } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    courseId: courses[0]?.id || "",
    teacherProfileId: teachers[0]?.id || "",
    hoursPerWeek: "4",
  });

  const handleOpen = () => {
    clearErrors();
    setSuccess(false);
    setFormData({
      name: "",
      code: "",
      courseId: courses[0]?.id || "",
      teacherProfileId: teachers[0]?.id || "",
      hoursPerWeek: "4",
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearErrors();

    try {
      await apiClient.post(`/api/schools/${schoolSlug}/subjects`, {
        name: formData.name,
        code: formData.code || undefined,
        courseId: formData.courseId,
        teacherProfileId: formData.teacherProfileId || undefined,
        hoursPerWeek: parseInt(formData.hoursPerWeek, 10),
      });

      setSuccess(true);
      toastSuccess("Asignatura Creada", {
        description: `La asignatura "${formData.name}" ha sido creada exitosamente.`,
      });

      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 700);
    } catch (err: unknown) {
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        id="btn-trigger-create-subject"
        variant="primary"
        onClick={handleOpen}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Nueva Asignatura
      </Button>

      <Modal isOpen={isOpen} onClose={() => !isLoading && setIsOpen(false)} size="md">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <ModalHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <ModalTitle>Crear Nueva Asignatura</ModalTitle>
                <ModalDescription>
                  Agrega una asignatura a la malla curricular de un curso.
                </ModalDescription>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="space-y-4">
            <ApiErrorAlert error={error} onDismiss={clearErrors} />

            {success && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Asignatura creada exitosamente. Actualizando...</span>
              </div>
            )}

            <div>
              <Input
                id="subject-name"
                label="Nombre de la Asignatura *"
                placeholder="Ej: Matemáticas, Lengua y Literatura"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (hasFieldError("name")) clearErrors();
                }}
              />
              <FormFieldError error={getFieldError("name")} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  id="subject-code"
                  label="Código de la Asignatura"
                  placeholder="Ej: MAT-101"
                  value={formData.code}
                  onChange={(e) => {
                    setFormData({ ...formData, code: e.target.value });
                    if (hasFieldError("code")) clearErrors();
                  }}
                />
                <FormFieldError error={getFieldError("code")} />
              </div>

              <div>
                <Input
                  id="subject-hours"
                  type="number"
                  label="Horas Semanales *"
                  min={1}
                  max={30}
                  required
                  value={formData.hoursPerWeek}
                  onChange={(e) => {
                    setFormData({ ...formData, hoursPerWeek: e.target.value });
                    if (hasFieldError("hoursPerWeek")) clearErrors();
                  }}
                />
                <FormFieldError error={getFieldError("hoursPerWeek")} />
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="subject-course"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Curso Asignado *
              </label>
              <select
                id="subject-course"
                required
                value={formData.courseId}
                onChange={(e) => {
                  setFormData({ ...formData, courseId: e.target.value });
                  if (hasFieldError("courseId")) clearErrors();
                }}
                className="w-full text-sm rounded-xl py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
                {courses.length === 0 && (
                  <option value="" disabled>
                    No hay cursos disponibles (crea un curso primero)
                  </option>
                )}
              </select>
              <FormFieldError error={getFieldError("courseId")} />
            </div>

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="subject-teacher"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Docente Responsable
              </label>
              <select
                id="subject-teacher"
                value={formData.teacherProfileId}
                onChange={(e) => {
                  setFormData({ ...formData, teacherProfileId: e.target.value });
                  if (hasFieldError("teacherProfileId")) clearErrors();
                }}
                className="w-full text-sm rounded-xl py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <option value="">-- Sin profesor asignado --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.specialty ? `(${t.specialty})` : ""}
                  </option>
                ))}
              </select>
              <FormFieldError error={getFieldError("teacherProfileId")} />
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              loadingText="Guardando..."
            >
              Crear Asignatura
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
