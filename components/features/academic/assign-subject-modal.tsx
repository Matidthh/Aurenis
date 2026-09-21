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
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Clock,
  GraduationCap,
  Sparkles,
  Layers,
} from "lucide-react";
import { TeacherItem } from "@/lib/services/teacher.service";
import { apiClient } from "@/lib/api";

export interface CourseOption {
  id: string;
  name: string;
  educationLevel?: { name: string } | null;
}

export interface AvailableSubjectOption {
  id: string;
  name: string;
  code?: string | null;
  hoursPerWeek: number;
  courseId: string;
  course: {
    id: string;
    name: string;
    educationLevel?: { name: string } | null;
  };
  teacherProfileId?: string | null;
}

interface AssignSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolSlug: string;
  teacher: TeacherItem | null;
  courses: CourseOption[];
  availableSubjects: AvailableSubjectOption[];
  onAssignmentUpdated: () => void;
}

export function AssignSubjectModal({
  isOpen,
  onClose,
  schoolSlug,
  teacher,
  courses,
  availableSubjects,
  onAssignmentUpdated,
}: AssignSubjectModalProps) {
  const [activeTab, setActiveTab] = useState<"link_existing" | "create_new">("link_existing");
  const [isLoading, setIsLoading] = useState(false);
  const [isUnassigning, setIsUnassigning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states for Link Existing
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [customHours, setCustomHours] = useState<number>(4);

  // Form states for Create New
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectCourseId, setNewSubjectCourseId] = useState("");
  const [newSubjectHours, setNewSubjectHours] = useState(4);

  if (!teacher) return null;

  // Calculate current weekly load
  const totalWeeklyHours = teacher.subjects.reduce(
    (acc, sub) => acc + (sub.hoursPerWeek || 0),
    0
  );

  // Filter available subjects not currently assigned to THIS teacher
  const unassignedOrOtherSubjects = availableSubjects.filter(
    (s) => !teacher.subjects.some((ts) => ts.id === s.id)
  );

  const handleLinkSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) {
      setError("Por favor selecciona una asignatura para asignar.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiClient.post(`/api/schools/${schoolSlug}/teachers/${teacher.id}/assign`, {
        subjectId: selectedSubjectId,
        hoursPerWeek: customHours,
      });

      setSuccess("Asignatura vinculada correctamente al profesor.");
      setSelectedSubjectId("");
      onAssignmentUpdated();

      setTimeout(() => {
        setSuccess(null);
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Error al asignar la asignatura.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAndAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim() || !newSubjectCourseId) {
      setError("El nombre de la asignatura y el curso son requeridos.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await apiClient.post(`/api/schools/${schoolSlug}/teachers/${teacher.id}/assign`, {
        hoursPerWeek: newSubjectHours,
        createNewSubject: {
          name: newSubjectName.trim(),
          code: newSubjectCode.trim() || undefined,
          courseId: newSubjectCourseId,
        },
      });

      setSuccess("Nueva asignatura creada y asignada con éxito.");
      setNewSubjectName("");
      setNewSubjectCode("");
      setNewSubjectCourseId("");
      setNewSubjectHours(4);
      onAssignmentUpdated();

      setTimeout(() => {
        setSuccess(null);
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Error al crear la asignatura.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnassignSubject = async (subjectId: string) => {
    setIsUnassigning(subjectId);
    setError(null);

    try {
      await apiClient.delete(`/api/schools/${schoolSlug}/teachers/${teacher.id}/assign`, {
        body: { subjectId },
      });

      setSuccess("Asignatura desvinculada exitosamente.");
      onAssignmentUpdated();

      setTimeout(() => {
        setSuccess(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al desvincular la asignatura.");
    } finally {
      setIsUnassigning(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <ModalTitle>Asignación de Asignaturas y Cursos</ModalTitle>
            <ModalDescription>
              Gestiona la carga horaria y las materias asignadas al docente.
            </ModalDescription>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-5">
        {/* Cabecera del Docente & Resumen de Horas */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-sm shadow-sm">
              {teacher.membership.user.firstName[0]}
              {teacher.membership.user.lastName[0]}
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Prof. {teacher.membership.user.firstName} {teacher.membership.user.lastName}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {teacher.specialty || "Especialidad General"} • {teacher.membership.user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span className="text-slate-600 dark:text-slate-300">Carga Semanal:</span>
            <span className="text-brand-600 dark:text-brand-400 font-bold text-sm">
              {totalWeeklyHours} hrs
            </span>
          </div>
        </div>

        {/* Feedback visual */}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Lista de asignaturas actualmente asignadas */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              Asignaturas Asignadas ({teacher.subjects.length})
            </span>
            <span className="text-[11px] text-slate-400">
              {teacher.subjects.length === 0 ? "Sin asignaciones actuales" : "En curso lectivo"}
            </span>
          </div>

          {teacher.subjects.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {teacher.subjects.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="space-y-0.5 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900 dark:text-white text-xs truncate">
                        {sub.name}
                      </span>
                      {sub.code && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono text-slate-500">
                          {sub.code}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2">
                      <span>Curso: <strong className="text-slate-600 dark:text-slate-300">{sub.course?.name || "Sin curso"}</strong></span>
                      <span>•</span>
                      <span>{sub.hoursPerWeek || 4} hrs/sem</span>
                    </div>
                  </div>

                  <Button
                    id={`btn-unassign-subject-${sub.id}`}
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnassignSubject(sub.id)}
                    disabled={isUnassigning === sub.id}
                    className="text-slate-400 hover:text-red-600 dark:hover:text-red-400 p-1.5 h-auto"
                    title="Desvincular asignatura"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              Este profesor aún no tiene asignaturas a cargo. Utiliza el formulario inferior para asignarle una.
            </div>
          )}
        </div>

        {/* Sección para Añadir/Vincular Asignatura */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Nueva Asignación
            </span>
            <div className="flex rounded-lg bg-slate-100 dark:bg-slate-800 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("link_existing")}
                className={`px-3 py-1 rounded-md transition font-medium ${
                  activeTab === "link_existing"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Vincular Existente
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("create_new")}
                className={`px-3 py-1 rounded-md transition font-medium ${
                  activeTab === "create_new"
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Crear Asignatura
              </button>
            </div>
          </div>

          {activeTab === "link_existing" ? (
            <form onSubmit={handleLinkSubject} className="space-y-3 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Seleccionar Asignatura del Colegio
                  </label>
                  <select
                    id="select-existing-subject"
                    value={selectedSubjectId}
                    onChange={(e) => {
                      setSelectedSubjectId(e.target.value);
                      const found = availableSubjects.find((s) => s.id === e.target.value);
                      if (found) setCustomHours(found.hoursPerWeek || 4);
                    }}
                    className="w-full text-xs rounded-xl py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  >
                    <option value="">-- Selecciona una asignatura --</option>
                    {unassignedOrOtherSubjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.course?.name || "Sin curso"}) - {s.hoursPerWeek || 4} hrs/sem
                        {s.teacherProfileId ? " (Reasignar)" : " (Disponible)"}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Horas Semanales
                  </label>
                  <input
                    id="input-assign-hours"
                    type="number"
                    min={1}
                    max={44}
                    value={customHours}
                    onChange={(e) => setCustomHours(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs rounded-xl py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  id="btn-submit-link-subject"
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isLoading}
                  disabled={!selectedSubjectId}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                >
                  Vincular Asignatura
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleCreateAndAssign} className="space-y-3 bg-slate-50/70 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  id="input-new-subject-name"
                  label="Nombre de la Asignatura"
                  placeholder="Ej: Física Avanzada"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  required
                />
                <Input
                  id="input-new-subject-code"
                  label="Código Curricular (Opcional)"
                  placeholder="Ej: FIS-301"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Curso Destino
                  </label>
                  <select
                    id="select-new-subject-course"
                    value={newSubjectCourseId}
                    onChange={(e) => setNewSubjectCourseId(e.target.value)}
                    className="w-full text-xs rounded-xl py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  >
                    <option value="">-- Selecciona el curso --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.educationLevel ? `(${c.educationLevel.name})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    Horas Pedagógicas Semanales
                  </label>
                  <input
                    id="input-new-subject-hours"
                    type="number"
                    min={1}
                    max={44}
                    value={newSubjectHours}
                    onChange={(e) => setNewSubjectHours(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-xs rounded-xl py-2 px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <Button
                  id="btn-submit-create-assign-subject"
                  type="submit"
                  variant="primary"
                  size="sm"
                  isLoading={isLoading}
                  disabled={!newSubjectName.trim() || !newSubjectCourseId}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Crear y Asignar
                </Button>
              </div>
            </form>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button id="btn-close-assign-modal" type="button" variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
