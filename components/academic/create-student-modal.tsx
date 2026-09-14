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
import { Plus, UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { validateRut, validateEmail, formatRut } from "@/lib/utils/rut";

interface CourseOption {
  id: string;
  name: string;
}

interface CreateStudentModalProps {
  schoolSlug: string;
  courses: CourseOption[];
}

export function CreateStudentModal({
  schoolSlug,
  courses,
}: CreateStudentModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rutOrNationalId: "",
    courseId: courses[0]?.id || "",
    enrollmentNumber: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    rutOrNationalId: false,
  });

  // Validaciones en vivo
  const isEmailValid = !formData.email || validateEmail(formData.email);
  const emailError = touched.email && formData.email && !isEmailValid ? "Correo electrónico inválido (ej: usuario@dominio.cl)" : null;

  const isRutValid = !formData.rutOrNationalId || validateRut(formData.rutOrNationalId);
  const rutError = touched.rutOrNationalId && formData.rutOrNationalId && !isRutValid ? "RUT chileno inválido (ej: 12345678-9)" : null;

  const handleOpen = () => {
    setError(null);
    setSuccess(false);
    setTouched({ email: false, rutOrNationalId: false });
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      rutOrNationalId: "",
      courseId: courses[0]?.id || "",
      enrollmentNumber: "",
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, rutOrNationalId: true });

    if (formData.email && !validateEmail(formData.email)) {
      setError("Por favor ingresa un correo electrónico válido.");
      return;
    }

    if (formData.rutOrNationalId && !validateRut(formData.rutOrNationalId)) {
      setError("Por favor ingresa un RUT chileno válido.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/schools/${schoolSlug}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          rutOrNationalId: formData.rutOrNationalId,
          courseId: formData.courseId,
          enrollmentNumber: formData.enrollmentNumber,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo matricular al estudiante.");
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
        id="btn-trigger-create-student"
        variant="primary"
        onClick={handleOpen}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Matricular Estudiante
      </Button>

      <Modal isOpen={isOpen} onClose={() => !isLoading && setIsOpen(false)} size="md">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <ModalHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <ModalTitle>Matricular Nuevo Estudiante</ModalTitle>
                <ModalDescription>
                  Registra un alumno y asígnalo a su curso correspondiente con validación en vivo.
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
                <span>Estudiante matriculado con éxito. Actualizando...</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="student-firstname"
                label="Nombres *"
                placeholder="Ej: Sofia"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />

              <Input
                id="student-lastname"
                label="Apellidos *"
                placeholder="Ej: Valenzuela"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  id="student-email"
                  type="email"
                  label="Correo Electrónico *"
                  placeholder="sofia@colegio.cl"
                  required
                  value={formData.email}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {emailError && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">{emailError}</p>
                )}
              </div>

              <div>
                <Input
                  id="student-rut"
                  label="RUT Chileno"
                  placeholder="21.345.678-9"
                  value={formData.rutOrNationalId}
                  onBlur={() => setTouched({ ...touched, rutOrNationalId: true })}
                  onChange={(e) =>
                    setFormData({ ...formData, rutOrNationalId: e.target.value })
                  }
                />
                {rutError && (
                  <p className="text-[11px] text-red-600 dark:text-red-400 mt-1">{rutError}</p>
                )}
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label
                htmlFor="student-course"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Curso de Matrícula *
              </label>
              <select
                id="student-course"
                required
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({ ...formData, courseId: e.target.value })
                }
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

            <Input
              id="student-enrollment-number"
              label="Número de Matrícula (Opcional)"
              placeholder="Ej: MAT-2026-042"
              value={formData.enrollmentNumber}
              onChange={(e) =>
                setFormData({ ...formData, enrollmentNumber: e.target.value })
              }
            />
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
              disabled={isLoading || (!!formData.email && !isEmailValid) || (!!formData.rutOrNationalId && !isRutValid)}
              isLoading={isLoading}
              loadingText="Matriculando..."
            >
              Matricular Estudiante
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
