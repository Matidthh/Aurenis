"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  Calendar,
  HeartPulse,
  Award,
  CalendarCheck,
  ShieldCheck,
  Edit3,
  BookOpen,
  AlertCircle,
  Clock,
  IdCard,
} from "lucide-react";

export interface StudentProfileData {
  enrollmentId: string;
  studentProfileId: string;
  courseId: string;
  courseName: string;
  educationLevelName: string;
  enrollmentNumber?: string | null;
  status: string;
  year: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    rutOrNationalId?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
  };
  birthDate?: string | null;
  medicalNotes?: string | null;
  guardians: Array<{
    id: string;
    relationship: string;
    isEmergencyContact: boolean;
    canPickUp: boolean;
    name: string;
    email: string;
    phone?: string | null;
    occupation?: string | null;
  }>;
  attendances?: Array<{
    id: string;
    date: string | Date;
    status: string;
    justification?: string | null;
  }>;
  grades?: Array<{
    id: string;
    value: number | string;
    subjectName: string;
    assessmentTitle: string;
    date: string | Date;
    feedback?: string | null;
  }>;
}

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfileData | null;
  onEdit: (student: StudentProfileData) => void;
}

export function StudentProfileModal({
  isOpen,
  onClose,
  student,
  onEdit,
}: StudentProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"general" | "guardians" | "grades" | "attendance">("general");

  if (!student) return null;

  const initials = `${student.user.firstName[0] || ""}${student.user.lastName[0] || ""}`.toUpperCase();

  const attendanceCount = {
    present: student.attendances?.filter((a) => a.status === "PRESENT").length || 0,
    late: student.attendances?.filter((a) => a.status === "LATE").length || 0,
    absent: student.attendances?.filter((a) => a.status.startsWith("ABSENT")).length || 0,
  };

  const totalAttendances = (student.attendances?.length || 0);
  const attendancePercentage = totalAttendances > 0
    ? Math.round((attendanceCount.present / totalAttendances) * 100)
    : 100;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <div className="flex flex-col h-full">
        <ModalHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <ModalTitle className="text-lg">
                    {student.user.firstName} {student.user.lastName}
                  </ModalTitle>
                  <Badge variant={student.status === "ACTIVE" ? "success" : "neutral"}>
                    {student.status === "ACTIVE" ? "Matrícula Activa" : student.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                  <span>{student.courseName} ({student.educationLevelName})</span>
                  <span>•</span>
                  <span>N° Matrícula: {student.enrollmentNumber || "Sin asignar"}</span>
                </p>
              </div>
            </div>

            <Button
              id="btn-edit-student-profile"
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              leftIcon={<Edit3 className="w-3.5 h-3.5 text-brand-600" />}
            >
              Editar Ficha
            </Button>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 mt-4 gap-1">
            <button
              id="tab-general"
              onClick={() => setActiveTab("general")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition -mb-px flex items-center gap-1.5 ${
                activeTab === "general"
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Datos Personales
            </button>

            <button
              id="tab-guardians"
              onClick={() => setActiveTab("guardians")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition -mb-px flex items-center gap-1.5 ${
                activeTab === "guardians"
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Apoderados ({student.guardians.length})
            </button>

            <button
              id="tab-grades"
              onClick={() => setActiveTab("grades")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition -mb-px flex items-center gap-1.5 ${
                activeTab === "grades"
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              Calificaciones
            </button>

            <button
              id="tab-attendance"
              onClick={() => setActiveTab("attendance")}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition -mb-px flex items-center gap-1.5 ${
                activeTab === "attendance"
                  ? "border-brand-600 text-brand-600 dark:text-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <CalendarCheck className="w-3.5 h-3.5" />
              Asistencia ({attendancePercentage}%)
            </button>
          </div>
        </ModalHeader>

        <ModalBody className="max-h-[65vh] overflow-y-auto space-y-4 py-2">
          {/* TAB 1: DATOS PERSONALES */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <IdCard className="w-3.5 h-3.5 text-brand-600" />
                    RUN / Identificación Nacional
                  </span>
                  <p className="text-sm font-semibold font-mono text-slate-900 dark:text-white">
                    {student.user.rutOrNationalId || "No registrado"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-600" />
                    Correo Electrónico Institucional
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {student.user.email}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    Teléfono del Alumno
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {student.user.phone || "Sin teléfono registrado"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-600" />
                    Fecha de Nacimiento
                  </span>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {student.birthDate ? new Date(student.birthDate).toLocaleDateString() : "No registrada"}
                  </p>
                </div>
              </div>

              {/* Ficha Médica y Cuidados Especiales */}
              <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                  <HeartPulse className="w-4 h-4" />
                  <span>Ficha de Salud y Observaciones Pedagógicas</span>
                </div>
                <p className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                  {student.medicalNotes || "El estudiante no registra antecedentes médicos, alergias o adaptaciones curriculares específicas."}
                </p>
              </div>

              {/* Resumen de Asignación */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                  Régimen Escolar Actual
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Año Lectivo:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{student.year}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Nivel Educativo:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{student.educationLevelName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Curso:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{student.courseName}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: APODERADOS */}
          {activeTab === "guardians" && (
            <div className="space-y-3">
              {student.guardians.map((g) => (
                <div
                  key={g.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{g.name}</h4>
                      <p className="text-xs text-brand-600 dark:text-brand-400 font-medium">{g.relationship}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {g.isEmergencyContact && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800">
                          Contacto de Emergencia
                        </span>
                      )}
                      {g.canPickUp && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          Autorizado Retiro
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{g.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{g.phone || "Sin teléfono registrado"}</span>
                    </div>
                  </div>
                </div>
              ))}

              {student.guardians.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  No hay apoderados registrados para este estudiante. Puedes agregarlos haciendo clic en &ldquo;Editar Ficha&rdquo;.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CALIFICACIONES */}
          {activeTab === "grades" && (
            <div className="space-y-3">
              {student.grades && student.grades.length > 0 ? (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 font-semibold text-slate-500">
                      <tr>
                        <th className="p-3">Asignatura</th>
                        <th className="p-3">Evaluación</th>
                        <th className="p-3 text-right">Nota</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {student.grades.map((grade) => (
                        <tr key={grade.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-3 font-semibold text-slate-900 dark:text-white">{grade.subjectName}</td>
                          <td className="p-3 text-slate-600 dark:text-slate-300">{grade.assessmentTitle}</td>
                          <td className="p-3 text-right font-bold text-slate-900 dark:text-white">
                            <span className={`px-2 py-0.5 rounded ${
                              Number(grade.value) >= 4.0
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                            }`}>
                              {Number(grade.value).toFixed(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl space-y-1">
                  <Award className="w-6 h-6 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="font-semibold text-slate-700 dark:text-slate-300">Sin calificaciones ingresadas</p>
                  <p>Aún no se registran notas para las evaluaciones vigentes.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ASISTENCIA */}
          {activeTab === "attendance" && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{attendanceCount.present}</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Presentes</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                  <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{attendanceCount.late}</p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Atrasos</p>
                </div>
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
                  <p className="text-xl font-bold text-red-700 dark:text-red-300">{attendanceCount.absent}</p>
                  <p className="text-[11px] text-red-600 dark:text-red-400 font-semibold">Inasistencias</p>
                </div>
              </div>

              {student.attendances && student.attendances.length > 0 ? (
                <div className="space-y-1.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Últimos registros de asistencia</h4>
                  <div className="space-y-1.5">
                    {student.attendances.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 text-xs"
                      >
                        <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(att.date).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          att.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : att.status === "LATE"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300"
                        }`}>
                          {att.status === "PRESENT" ? "Presente" : att.status === "LATE" ? "Atraso" : "Ausente"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  Sin registros de asistencia acumulados.
                </div>
              )}
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onClick={onClose}>
            Cerrar Ficha
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  );
}
