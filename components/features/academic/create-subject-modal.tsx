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
import { Plus, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { apiClient } from "@/lib/api";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    courseId: courses[0]?.id || "",
    teacherProfileId: teachers[0]?.id || "",
    hoursPerWeek: "4",
  });

  const handleOpen = () => {
    setError(null);
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
    setError(null);

    try {
      await apiClient.post(`/api/schools/${schoolSlug}/subjects`, {
        name: formData.name,
        code: formData.code,
        courseId: formData.courseId,
        teacherProfileId: formData.teacherProfileId || undefined,
        hoursPerWeek: parseInt(formData.hoursPerWeek, 10),
      });

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
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
            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Asignatura creada exitosamente. Actualizando...</span>
              </div>
            )}

            <Input
              id="subject-name"
              label="Nombre de la Asignatura"
              placeholder="Ej: Matemáticas, Lengua y Literatura"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="subject-code"
                label="Código de la Asignatura"
                placeholder="Ej: MAT-101"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              />

              <Input
                id="subject-hours"
                type="number"
                label="Horas Semanales"
                min={1}
                max={30}
                required
                value={formData.hoursPerWeek}
                onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
              />
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
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, teacherProfileId: e.target.value })}
                className="w-full text-sm rounded-xl py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
              >
                <option value="">-- Sin profesor asignado --</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} {t.specialty ? `(${t.specialty})` : ""}
                  </option>
                ))}
              </select>
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
