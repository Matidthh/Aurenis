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
import { Plus, GraduationCap, AlertCircle, CheckCircle2 } from "lucide-react";

interface EducationLevelOption {
  id: string;
  name: string;
  shortCode: string;
}

interface CreateCourseModalProps {
  schoolSlug: string;
  educationLevels: EducationLevelOption[];
  currentYear?: number;
}

export function CreateCourseModal({
  schoolSlug,
  educationLevels,
  currentYear = new Date().getFullYear(),
}: CreateCourseModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gradeNumber: "1",
    letter: "A",
    educationLevelId: educationLevels[0]?.id || "",
    year: currentYear.toString(),
  });

  const handleOpen = () => {
    setError(null);
    setSuccess(false);
    setFormData({
      name: "",
      gradeNumber: "1",
      letter: "A",
      educationLevelId: educationLevels[0]?.id || "",
      year: currentYear.toString(),
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/schools/${schoolSlug}/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          gradeNumber: parseInt(formData.gradeNumber, 10),
          letter: formData.letter,
          educationLevelId: formData.educationLevelId,
          year: parseInt(formData.year, 10),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo crear el curso.");
      }

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
        id="btn-trigger-create-course"
        variant="primary"
        onClick={handleOpen}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Nuevo Curso
      </Button>

      <Modal isOpen={isOpen} onClose={() => !isLoading && setIsOpen(false)} size="md">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <ModalHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <ModalTitle>Crear Nuevo Curso</ModalTitle>
                <ModalDescription>
                  Define un curso o sección académica para el periodo escolar.
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
                <span>Curso creado exitosamente. Actualizando...</span>
              </div>
            )}

            <Input
              id="course-name"
              label="Nombre del Curso"
              placeholder="Ej: 3° Medio A, 1° Básico B"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="course-level"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Nivel Educativo *
                </label>
                <select
                  id="course-level"
                  required
                  value={formData.educationLevelId}
                  onChange={(e) =>
                    setFormData({ ...formData, educationLevelId: e.target.value })
                  }
                  className="w-full text-sm rounded-xl py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {educationLevels.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.name} ({lvl.shortCode})
                    </option>
                  ))}
                  {educationLevels.length === 0 && (
                    <option value="" disabled>
                      Sin niveles configurados
                    </option>
                  )}
                </select>
              </div>

              <Input
                id="course-year"
                type="number"
                label="Año Lectivo"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="course-grade"
                type="number"
                label="Grado Numérico"
                min={1}
                max={12}
                required
                value={formData.gradeNumber}
                onChange={(e) =>
                  setFormData({ ...formData, gradeNumber: e.target.value })
                }
              />

              <Input
                id="course-letter"
                label="Letra / Sección"
                maxLength={2}
                placeholder="A, B, C..."
                required
                value={formData.letter}
                onChange={(e) =>
                  setFormData({ ...formData, letter: e.target.value.toUpperCase() })
                }
              />
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
              Crear Curso
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
