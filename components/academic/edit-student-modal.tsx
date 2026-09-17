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
import { Edit3, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/components/ui/toast";

interface CourseOption {
  id: string;
  name: string;
}

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolSlug: string;
  courses: CourseOption[];
  studentData: {
    studentProfileId: string;
    firstName: string;
    lastName: string;
    email: string;
    rutOrNationalId?: string | null;
    phone?: string | null;
    birthDate?: string | null;
    medicalNotes?: string | null;
    enrollmentNumber?: string | null;
    courseId: string;
    status: string;
    guardian?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      relationship?: string;
    } | null;
  };
  onSuccess?: () => void;
}

export function EditStudentModal({
  isOpen,
  onClose,
  schoolSlug,
  courses,
  studentData,
  onSuccess,
}: EditStudentModalProps) {
  const router = useRouter();
  const { toastSuccess, toastError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: studentData.firstName || "",
    lastName: studentData.lastName || "",
    email: studentData.email || "",
    rutOrNationalId: studentData.rutOrNationalId || "",
    phone: studentData.phone || "",
    birthDate: studentData.birthDate ? studentData.birthDate.split("T")[0] : "",
    medicalNotes: studentData.medicalNotes || "",
    enrollmentNumber: studentData.enrollmentNumber || "",
    courseId: studentData.courseId || courses[0]?.id || "",
    status: studentData.status || "ACTIVE",
    guardianFirstName: studentData.guardian?.firstName || "",
    guardianLastName: studentData.guardian?.lastName || "",
    guardianEmail: studentData.guardian?.email || "",
    guardianPhone: studentData.guardian?.phone || "",
    guardianRelationship: studentData.guardian?.relationship || "Madre",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/schools/${schoolSlug}/students/${studentData.studentProfileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo actualizar la ficha del estudiante.");
      }

      setSuccess(true);
      toastSuccess("Cambios guardados con éxito", {
        description: `La ficha de ${formData.firstName} ${formData.lastName} ha sido actualizada.`,
      });
      setTimeout(() => {
        setSuccess(false);
        onClose();
        if (onSuccess) onSuccess();
        router.refresh();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
      toastError("Error al guardar cambios", {
        description: err.message || "No se pudo actualizar la información del estudiante.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !isLoading && onClose()} size="lg">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <ModalTitle>Editar Ficha del Estudiante</ModalTitle>
              <ModalDescription>
                Actualiza los datos personales, matrícula y tutor responsable.
              </ModalDescription>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Ficha actualizada exitosamente. Guardando cambios...</span>
            </div>
          )}

          {/* Sección Datos Personales */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              1. Identificación y Contacto
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="edit-student-firstname"
                label="Nombres *"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />

              <Input
                id="edit-student-lastname"
                label="Apellidos *"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                id="edit-student-email"
                type="email"
                label="Correo Institucional *"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />

              <Input
                id="edit-student-rut"
                label="RUT o Identificación"
                placeholder="21.345.678-9"
                value={formData.rutOrNationalId}
                onChange={(e) => setFormData({ ...formData, rutOrNationalId: e.target.value })}
              />

              <Input
                id="edit-student-phone"
                label="Teléfono de Contacto"
                placeholder="+56 9 8765 4321"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="edit-student-birthdate"
                type="date"
                label="Fecha de Nacimiento"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              />

              <div className="space-y-1.5">
                <label htmlFor="edit-student-status" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Estado de Matrícula
                </label>
                <select
                  id="edit-student-status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full text-sm rounded-xl py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white min-h-[44px] focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <option value="ACTIVE">Activo / Regular</option>
                  <option value="SUSPENDED">Suspendido temporal</option>
                  <option value="INACTIVE">Retirado / Inactivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* Sección Académica */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              2. Asignación Académica
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="edit-student-course" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Curso Asignado *
                </label>
                <select
                  id="edit-student-course"
                  required
                  value={formData.courseId}
                  onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full text-sm rounded-xl py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white min-h-[44px] focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                id="edit-student-enrollment-number"
                label="N° de Matrícula"
                placeholder="MAT-2026-001"
                value={formData.enrollmentNumber}
                onChange={(e) => setFormData({ ...formData, enrollmentNumber: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="edit-student-medical" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Observaciones Médicas / Pedagógicas
              </label>
              <textarea
                id="edit-student-medical"
                rows={2}
                placeholder="Alergias, tratamientos especiales, adaptaciones curriculares..."
                value={formData.medicalNotes}
                onChange={(e) => setFormData({ ...formData, medicalNotes: e.target.value })}
                className="w-full text-sm rounded-xl p-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus-visible:ring-2 focus-visible:ring-brand-500"
              />
            </div>
          </div>

          {/* Sección Apoderado */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-1.5">
              3. Apoderado / Tutor Titular
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                id="edit-guardian-firstname"
                label="Nombres Apoderado"
                placeholder="Ej: Marcela"
                value={formData.guardianFirstName}
                onChange={(e) => setFormData({ ...formData, guardianFirstName: e.target.value })}
              />

              <Input
                id="edit-guardian-lastname"
                label="Apellidos Apoderado"
                placeholder="Ej: Rojas Silva"
                value={formData.guardianLastName}
                onChange={(e) => setFormData({ ...formData, guardianLastName: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                id="edit-guardian-email"
                type="email"
                label="Correo Apoderado"
                placeholder="apoderado@correo.cl"
                value={formData.guardianEmail}
                onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
              />

              <Input
                id="edit-guardian-phone"
                label="Teléfono Apoderado"
                placeholder="+56 9 9123 4567"
                value={formData.guardianPhone}
                onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
              />

              <div className="space-y-1.5">
                <label htmlFor="edit-guardian-rel" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Parentesco
                </label>
                <select
                  id="edit-guardian-rel"
                  value={formData.guardianRelationship}
                  onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
                  className="w-full text-sm rounded-xl py-2.5 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white min-h-[44px] focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  <option value="Madre">Madre</option>
                  <option value="Padre">Padre</option>
                  <option value="Tutor Legal">Tutor Legal</option>
                  <option value="Abuelo/a">Abuelo/a</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
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
            Guardar Cambios
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
