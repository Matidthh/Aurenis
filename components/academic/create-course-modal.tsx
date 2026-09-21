"use client";

import React, { useState } from "react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, AlertCircle } from "lucide-react";

interface CreateCourseModalProps {
  schoolSlug: string;
  educationLevels: Array<{ id: string; name: string }>;
  currentYear: number;
}

export function CreateCourseModal({
  schoolSlug,
  educationLevels,
  currentYear,
}: CreateCourseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [gradeNumber, setGradeNumber] = useState(1);
  const [letter, setLetter] = useState("A");
  const [educationLevelId, setEducationLevelId] = useState(
    educationLevels[0]?.id || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("El nombre del curso es requerido.");
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      setIsOpen(false);
      setName("");
    } catch (err: any) {
      setError(err?.message || "Error al crear curso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-1.5" />
        Nuevo Curso
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="md">
        <ModalHeader>
          <ModalTitle>Crear Nuevo Curso</ModalTitle>
          <ModalDescription>
            Habilita un nuevo nivel o división de curso para el año {currentYear}.
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nombre del Curso
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: 1° Medio A"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Grado Numérico
                </label>
                <Input
                  type="number"
                  value={gradeNumber}
                  onChange={(e) => setGradeNumber(Number(e.target.value))}
                  min={1}
                  max={12}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Letra / Paralelo
                </label>
                <Input
                  value={letter}
                  onChange={(e) => setLetter(e.target.value.toUpperCase())}
                  maxLength={2}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Nivel Educativo
              </label>
              <select
                value={educationLevelId}
                onChange={(e) => setEducationLevelId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                {educationLevels.map((lvl) => (
                  <option key={lvl.id} value={lvl.id}>
                    {lvl.name}
                  </option>
                ))}
              </select>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Crear Curso"}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </>
  );
}
