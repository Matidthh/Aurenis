"use client";

import React from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Mail,
  Phone,
  IdCard,
  Clock,
  BookOpen,
  Edit3,
  Layers,
  Calendar,
  Sparkles,
} from "lucide-react";
import { TeacherItem } from "@/lib/services/teacher.service";

interface TeacherProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherItem | null;
  onOpenAssignModal: (teacher: TeacherItem) => void;
  onOpenEditModal: (teacher: TeacherItem) => void;
}

export function TeacherProfileModal({
  isOpen,
  onClose,
  teacher,
  onOpenAssignModal,
  onOpenEditModal,
}: TeacherProfileModalProps) {
  if (!teacher) return null;

  const user = teacher.membership.user;
  const totalWeeklyHours = teacher.subjects.reduce(
    (acc, sub) => acc + (sub.hoursPerWeek || 0),
    0
  );

  // Group unique courses
  const uniqueCourses = Array.from(
    new Set(teacher.subjects.map((s) => s.course?.name).filter(Boolean))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg border border-brand-100 dark:border-brand-900 shrink-0 shadow-sm">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <ModalTitle>
                {user.firstName} {user.lastName}
              </ModalTitle>
              <Badge variant="brand">Cuerpo Docente</Badge>
            </div>
            <ModalDescription>
              Ficha académica del profesor y distribución horaria.
            </ModalDescription>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Tarjeta de Resumen / Indicadores Rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Especialidad
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {teacher.specialty || "General"}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Carga Semanal
            </span>
            <span className="font-bold text-brand-600 dark:text-brand-400 text-sm flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {totalWeeklyHours} hrs pedagógicas
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
              Cursos Asignados
            </span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">
              {uniqueCourses.length} {uniqueCourses.length === 1 ? "Curso" : "Cursos"}
            </span>
          </div>
        </div>

        {/* Datos Personales y Contacto */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <IdCard className="w-3.5 h-3.5 text-slate-400" />
            Información de Contacto y Registro
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <IdCard className="w-4 h-4 text-slate-400 shrink-0" />
              <span>RUN: <strong className="font-mono text-slate-900 dark:text-white">{user.rutOrNationalId || "No registrado"}</strong></span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{user.phone || "Teléfono no registrado"}</span>
            </div>

            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Estado: <Badge variant="success">Activo</Badge></span>
            </div>
          </div>
        </div>

        {/* Desglose de Asignaturas Impartidas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              Malla de Asignaturas a Cargo ({teacher.subjects.length})
            </h4>
            <Button
              id="btn-quick-manage-assignments"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onOpenAssignModal(teacher);
              }}
              leftIcon={<Layers className="w-3.5 h-3.5" />}
              className="text-xs h-7 py-0"
            >
              Gestionar Asignaturas
            </Button>
          </div>

          {teacher.subjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {teacher.subjects.map((s) => (
                <div
                  key={s.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-1 hover:border-brand-500/50 transition"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                      {s.name}
                    </span>
                    {s.code && (
                      <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500">
                        {s.code}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                    <span>Curso: <strong>{s.course?.name || "Sin curso"}</strong></span>
                    <span className="text-brand-600 dark:text-brand-400 font-medium">
                      {s.hoursPerWeek || 4} hrs/sem
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
              No tiene asignaturas registradas para este periodo lectivo.
            </div>
          )}
        </div>
      </ModalBody>

      <ModalFooter>
        <Button
          id="btn-edit-teacher-profile"
          type="button"
          variant="outline"
          onClick={() => {
            onClose();
            onOpenEditModal(teacher);
          }}
          leftIcon={<Edit3 className="w-3.5 h-3.5" />}
        >
          Editar Ficha
        </Button>
        <Button id="btn-close-teacher-profile" type="button" variant="primary" onClick={onClose}>
          Cerrar
        </Button>
      </ModalFooter>
    </Modal>
  );
}
