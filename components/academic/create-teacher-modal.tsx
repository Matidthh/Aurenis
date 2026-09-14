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

interface CreateTeacherModalProps {
  schoolSlug: string;
}

export function CreateTeacherModal({ schoolSlug }: CreateTeacherModalProps) {
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
    specialty: "",
    phone: "",
  });

  const handleOpen = () => {
    setError(null);
    setSuccess(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      rutOrNationalId: "",
      specialty: "",
      phone: "",
    });
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/schools/${schoolSlug}/teachers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          rutOrNationalId: formData.rutOrNationalId,
          specialty: formData.specialty,
          phone: formData.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo registrar al docente.");
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
        id="btn-trigger-create-teacher"
        variant="primary"
        onClick={handleOpen}
        leftIcon={<Plus className="w-4 h-4" />}
      >
        Nuevo Profesor
      </Button>

      <Modal isOpen={isOpen} onClose={() => !isLoading && setIsOpen(false)} size="md">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <ModalHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <ModalTitle>Registrar Nuevo Docente</ModalTitle>
                <ModalDescription>
                  Añade un profesor al cuerpo académico de la institución.
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
                <span>Docente registrado con éxito. Actualizando...</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="teacher-firstname"
                label="Nombres"
                placeholder="Ej: Marcelo"
                required
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />

              <Input
                id="teacher-lastname"
                label="Apellidos"
                placeholder="Ej: Bielsa"
                required
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="teacher-email"
                type="email"
                label="Correo Electrónico"
                placeholder="mbielsa@colegio.cl"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <Input
                id="teacher-rut"
                label="RUT o Identificación"
                placeholder="10.234.567-8"
                value={formData.rutOrNationalId}
                onChange={(e) =>
                  setFormData({ ...formData, rutOrNationalId: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                id="teacher-specialty"
                label="Especialidad / Asignatura"
                placeholder="Ej: Historia, Ciencias, Filosofía"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
              />

              <Input
                id="teacher-phone"
                label="Teléfono de Contacto"
                placeholder="+56 9 8765 4321"
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
              Registrar Profesor
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
