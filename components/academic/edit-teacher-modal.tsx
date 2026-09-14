"use client";

import React, { useState } from "react";
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
import { TeacherItem } from "@/lib/services/teacher.service";

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolSlug: string;
  teacher: TeacherItem | null;
  onSuccess: () => void;
}

export function EditTeacherModal({
  isOpen,
  onClose,
  schoolSlug,
  teacher,
  onSuccess,
}: EditTeacherModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: teacher?.membership.user.firstName || "",
    lastName: teacher?.membership.user.lastName || "",
    specialty: teacher?.specialty || "",
    phone: teacher?.membership.user.phone || "",
    rutOrNationalId: teacher?.membership.user.rutOrNationalId || "",
  });

  // Sync state if teacher prop changes
  React.useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.membership.user.firstName || "",
        lastName: teacher.membership.user.lastName || "",
        specialty: teacher.specialty || "",
        phone: teacher.membership.user.phone || "",
        rutOrNationalId: teacher.membership.user.rutOrNationalId || "",
      });
      setError(null);
      setSuccess(false);
    }
  }, [teacher]);

  if (!teacher) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/schools/${schoolSlug}/teachers/${teacher.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          specialty: formData.specialty,
          phone: formData.phone,
          rutOrNationalId: formData.rutOrNationalId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudieron actualizar los datos.");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || "Error al actualizar información del docente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => !isLoading && onClose()} size="md">
      <form onSubmit={handleSubmit} className="flex flex-col h-full">
        <ModalHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <ModalTitle>Editar Datos del Docente</ModalTitle>
              <ModalDescription>
                Actualiza la especialidad y datos de contacto de {teacher.membership.user.firstName} {teacher.membership.user.lastName}.
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
              <span>Cambios guardados con éxito.</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="edit-teacher-firstname"
              label="Nombres"
              required
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <Input
              id="edit-teacher-lastname"
              label="Apellidos"
              required
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
          </div>

          <Input
            id="edit-teacher-specialty"
            label="Especialidad Académica"
            placeholder="Ej: Matemáticas, Lenguaje, Artes Visuales"
            value={formData.specialty}
            onChange={(e) =>
              setFormData({ ...formData, specialty: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              id="edit-teacher-rut"
              label="RUN / Identificación"
              value={formData.rutOrNationalId}
              onChange={(e) =>
                setFormData({ ...formData, rutOrNationalId: e.target.value })
              }
            />

            <Input
              id="edit-teacher-phone"
              label="Teléfono de Contacto"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
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
