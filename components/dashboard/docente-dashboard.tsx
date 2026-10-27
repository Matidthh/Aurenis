"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  QrCode,
  Award,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Send,
  CalendarCheck,
  ChevronRight,
  Plus,
  Sparkles,
  Search,
  MessageSquare,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  GraduationCap,
  Mail,
  UserCheck,
  Laptop,
  Check,
} from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";
import { AdaptiveTable } from "./adaptive-table";
import { cn } from "@/lib/utils/cn";
import { DynamicQRAttendanceModal } from "@/components/attendance/dynamic-qr-attendance-modal";

export interface DocenteDashboardProps {
  schoolSlug: string;
  teacherName?: string;
  myCoursesCount?: number;
}

export interface ClassScheduleItem {
  id: string;
  time: string;
  course: string;
  subject: string;
  classroom: string;
  attendanceDone: boolean;
  studentsCount: number;
  isCurrentBlock?: boolean;
}

export interface PendingAssessmentItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  pendingCount: number;
  type: string;
}

export interface OfficialTeacherProfile {
  id: string;
  name: string;
  email: string;
  specialtyRole: string;
  modules: {
    code: string;
    name: string;
    course: string;
    room: string;
    weeklyHours: number;
    studentsCount: number;
    gpa: number;
  }[];
  classes: ClassScheduleItem[];
  pendingAssessments: PendingAssessmentItem[];
}

export const OFFICIAL_LPMM_TEACHERS: OfficialTeacherProfile[] = [
  {
    id: "t-eduardo-soto",
    name: "Prof. Eduardo Soto",
    email: "eduardo.soto@edumargamarga.gob.cl",
    specialtyRole: "Docente de Especialidad · Programación (POO, DBDR, DAW)",
    modules: [
      {
        code: "PROO-4E",
        name: "Programación Orientada a Objetos (POO)",
        course: "4° Medio E",
        room: "Laboratorio de Computación 2",
        weeklyHours: 6,
        studentsCount: 24,
        gpa: 5.9,
      },
      {
        code: "DBDR-4E",
        name: "Diseño de Bases de Datos Relacionales (DBDR)",
        course: "4° Medio E",
        room: "Laboratorio de Computación 2",
        weeklyHours: 6,
        studentsCount: 24,
        gpa: 6.1,
      },
      {
        code: "DAW-4E",
        name: "Desarrollo de Aplicaciones Web (DAW)",
        course: "4° Medio E",
        room: "Laboratorio de Computación 2",
        weeklyHours: 6,
        studentsCount: 24,
        gpa: 6.3,
      },
    ],
    classes: [
      {
        id: "cl-es-1",
        time: "08:00 - 09:30",
        course: "4° Medio E",
        subject: "Programación Orientada a Objetos (POO)",
        classroom: "Laboratorio de Computación 2",
        attendanceDone: true,
        studentsCount: 24,
        isCurrentBlock: false,
      },
      {
        id: "cl-es-2",
        time: "09:45 - 11:15",
        course: "4° Medio E",
        subject: "Diseño de Bases de Datos Relacionales (DBDR)",
        classroom: "Laboratorio de Computación 2",
        attendanceDone: false,
        studentsCount: 24,
        isCurrentBlock: true,
      },
      {
        id: "cl-es-3",
        time: "11:30 - 13:00",
        course: "4° Medio E",
        subject: "Desarrollo de Aplicaciones Web (DAW)",
        classroom: "Laboratorio de Computación 2",
        attendanceDone: false,
        studentsCount: 24,
        isCurrentBlock: false,
      },
    ],
    pendingAssessments: [
      {
        id: "pa-es-1",
        title: "Taller Práctico N°3 - Clases, Métodos y Herencia en POO",
        course: "4° Medio E",
        dueDate: "Hoy 17:00",
        pendingCount: 6,
        type: "Formativa D67",
      },
      {
        id: "pa-es-2",
        title: "Modelo Entidad-Relación y Normalización 3FN",
        course: "4° Medio E",
        dueDate: "Viernes 14:00",
        pendingCount: 24,
        type: "Sumativa Coef. 1",
      },
    ],
  },
  {
    id: "t-juan-gutierrez",
    name: "Prof. Juan Gutiérrez",
    email: "juan.gutierrez@edumargamarga.gob.cl",
    specialtyRole: "Docente de Especialidad · Hardware y Redes LAN",
    modules: [
      {
        code: "MANT-4E",
        name: "Mantenimiento y Actualización de Hardware en Redes LAN",
        course: "4° Medio E",
        room: "Laboratorio de Computación 2",
        weeklyHours: 6,
        studentsCount: 24,
        gpa: 5.7,
      },
    ],
    classes: [
      {
        id: "cl-jg-1",
        time: "08:00 - 09:30",
        course: "4° Medio E",
        subject: "Mantenimiento y Hardware en Redes LAN",
        classroom: "Laboratorio de Computación 2",
        attendanceDone: true,
        studentsCount: 24,
        isCurrentBlock: true,
      },
      {
        id: "cl-jg-2",
        time: "14:00 - 15:30",
        course: "4° Medio E",
        subject: "Taller de Conectividad y Cableado Estructurado",
        classroom: "Laboratorio de Computación 2",
        attendanceDone: false,
        studentsCount: 24,
        isCurrentBlock: false,
      },
    ],
    pendingAssessments: [
      {
        id: "pa-jg-1",
        title: "Pauta de Evaluación: Ponchado de Patch Cords Cat 6",
        course: "4° Medio E",
        dueDate: "Jueves 16:30",
        pendingCount: 14,
        type: "Práctica de Taller",
      },
    ],
  },
  {
    id: "t-julio-molina",
    name: "Prof. Julio Molina",
    email: "julio.molina@edumargamarga.gob.cl",
    specialtyRole: "Docente de Especialidad · Administración de Bases de Datos",
    modules: [
      {
        code: "ADMB-4E",
        name: "Administración y Seguridad de Bases de Datos (ADMIN BBDD)",
        course: "4° Medio E",
        room: "Laboratorio de Computación 2",
        weeklyHours: 6,
        studentsCount: 24,
        gpa: 6.0,
      },
    ],
    classes: [
      {
        id: "cl-jm-1",
        time: "11:30 - 13:00",
        course: "4° Medio E",
        subject: "Administración y Seguridad de Bases de Datos",
        classroom: "Laboratorio de Computación 2",
        attendanceDone: false,
        studentsCount: 24,
        isCurrentBlock: true,
      },
    ],
    pendingAssessments: [
      {
        id: "pa-jm-1",
        title: "Guía Sumativa: Backups y Roles de Usuario en PostgreSQL",
        course: "4° Medio E",
        dueDate: "Próximo Lunes",
        pendingCount: 24,
        type: "Sumativa Coef. 1",
      },
    ],
  },
  {
    id: "t-marisol-garcia",
    name: "Prof. Marisol García",
    email: "marisol.garcia@edumargamarga.gob.cl",
    specialtyRole: "Docente de Especialidad · Emprendimiento y Empleabilidad TP",
    modules: [
      {
        code: "EMPR-4E",
        name: "Emprendimiento y Empleabilidad TP",
        course: "4° Medio E",
        room: "Taller de Especialidad TP",
        weeklyHours: 6,
        studentsCount: 24,
        gpa: 6.4,
      },
    ],
    classes: [
      {
        id: "cl-mg-1",
        time: "14:00 - 15:30",
        course: "4° Medio E",
        subject: "Emprendimiento y Empleabilidad TP",
        classroom: "Taller de Especialidad TP",
        attendanceDone: false,
        studentsCount: 24,
        isCurrentBlock: false,
      },
    ],
    pendingAssessments: [
      {
        id: "pa-mg-1",
        title: "Modelo Canvas para Servicios de Desarrollo de Software",
        course: "4° Medio E",
        dueDate: "Viernes 18:00",
        pendingCount: 8,
        type: "Proyecto Formativo D67",
      },
    ],
  },
  {
    id: "t-mirka-herrera",
    name: "Prof. Mirka Herrera",
    email: "mirka.herrera@edumargamarga.gob.cl",
    specialtyRole: "Docente de Plan Común · Lengua y Literatura",
    modules: [
      {
        code: "LENG-4E",
        name: "Lengua y Literatura",
        course: "4° Medio E",
        room: "Sala 204",
        weeklyHours: 6,
        studentsCount: 24,
        gpa: 5.8,
      },
    ],
    classes: [
      {
        id: "cl-mh-1",
        time: "08:00 - 09:30",
        course: "4° Medio E",
        subject: "Lengua y Literatura - Ensayo Argumentativo",
        classroom: "Sala 204",
        attendanceDone: true,
        studentsCount: 24,
        isCurrentBlock: false,
      },
    ],
    pendingAssessments: [
      {
        id: "pa-mh-1",
        title: "Ensayo Crítico sobre Literatura y Sociedad",
        course: "4° Medio E",
        dueDate: "Miércoles 12:00",
        pendingCount: 19,
        type: "Sumativa Coef. 1",
      },
    ],
  },
];

export function DocenteDashboard({
  schoolSlug,
  teacherName = "Prof. Eduardo Soto",
}: DocenteDashboardProps) {
  // Selector interactivo de docentes de 4° Medio E para pruebas visuales
  const defaultMatching = OFFICIAL_LPMM_TEACHERS.find(
    (t) => t.name.toLowerCase().includes(teacherName.toLowerCase()) || t.email.toLowerCase() === teacherName.toLowerCase()
  )?.id || "t-eduardo-soto";

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(defaultMatching);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);

  const currentTeacher =
    OFFICIAL_LPMM_TEACHERS.find((t) => t.id === selectedTeacherId) ||
    OFFICIAL_LPMM_TEACHERS[0];

  const activeName = currentTeacher.name;
  const activeEmail = currentTeacher.email;
  const activeRole = currentTeacher.specialtyRole;
  const teacherModules = currentTeacher.modules;
  const classes = currentTeacher.classes;
  const pendingAssessments = currentTeacher.pendingAssessments;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Selector Rápido de Docente para Pruebas Visuales */}
      <div className="bg-white dark:bg-[#0C1425] border border-indigo-200/90 dark:border-indigo-900/60 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
              Pruebas Visuales · Docentes Oficiales 4° Medio E
            </span>
            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Seleccionar Profesor para la Demostración
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {OFFICIAL_LPMM_TEACHERS.map((t) => {
            const isSelected = t.id === selectedTeacherId;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedTeacherId(t.id)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
                  isSelected
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
                title={t.email}
              >
                <span>{t.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. Header Contextual para Docentes */}
      <ContextualHeader
        schoolName="Colegio Bicentenario Aurenis"
        institutionalCode="RBD 10240"
        academicYear="2026"
        term="1er Semestre"
        roleTitle={activeRole}
        roleBadgeColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/30"
        userName={activeName}
        greeting="Libro de Clases Digital & Gestión Pedagógica"
        quickActions={
          <>
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-slate-200 text-xs font-mono border border-white/10">
              <Mail className="w-3.5 h-3.5 text-indigo-300" />
              <span>{activeEmail}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsQRModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20 min-h-[44px] cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Pase Asistencia QR</span>
            </button>
            <Link
              href={`/${schoolSlug}/grades`}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-2 backdrop-blur-md min-h-[44px]"
            >
              <FileEdit className="w-4 h-4 text-amber-400" />
              <span>Ingresar Notas</span>
            </Link>
          </>
        }
      />

      {/* 2. Tarjetas de Resumen Docente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AcademicSummaryCard
          title="Módulos Asignados"
          value={teacherModules.length}
          subtitle="4° Medio E (Programación)"
          badgeLabel="Plan Especialidad TP"
          icon={BookOpen}
          accentColor="blue"
          href={`/${schoolSlug}/grades`}
        />

        <AcademicSummaryCard
          title="Bloque en Curso"
          value={classes.find((c) => c.isCurrentBlock)?.classroom || "Lab 2"}
          subtitle={classes.find((c) => c.isCurrentBlock)?.subject || "Taller Técnico"}
          badgeLabel="Activo"
          icon={Clock}
          accentColor="emerald"
          href={`/${schoolSlug}/attendance`}
        />

        <AcademicSummaryCard
          title="Evaluaciones D67"
          value={pendingAssessments.length}
          subtitle="Actas con notas pendientes"
          badgeLabel="Por Evaluar"
          icon={Award}
          accentColor="amber"
          href={`/${schoolSlug}/grades`}
        />

        <AcademicSummaryCard
          title="Promedio General Módulos"
          value={(
            teacherModules.reduce((acc, m) => acc + m.gpa, 0) / teacherModules.length
          ).toFixed(1)}
          subtitle="24 estudiantes en nómina"
          badgeLabel="Semestre 1"
          icon={Sparkles}
          accentColor="purple"
          href={`/${schoolSlug}/grades`}
        />
      </div>

      {/* 3. Módulos y Ramos del Docente en 4° Medio E */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1425] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Ramos y Módulos a Cargo · {activeName}
              </h3>
              <p className="text-xs text-slate-500">
                Carga pedagógica oficial asignada para el año escolar 2026
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            {activeEmail}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {teacherModules.map((m) => (
            <div
              key={m.code}
              className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200">
                    {m.code}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {m.course}
                  </span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                  {m.name}
                </h4>
                <p className="text-xs text-slate-500">
                  {m.room} · {m.weeklyHours} hrs pedagógicas
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  Promedio: <strong>{m.gpa.toFixed(1)}</strong>
                </span>
                <Link
                  href={`/${schoolSlug}/grades`}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Libro Digital</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Bloques de Clases de la Jornada (Agenda Pedagógica) */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#0C1425] p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Horario Pedagógico de Hoy
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Bloques lectivos programados y estado de pase de lista
              </p>
            </div>
          </div>
          <Link
            href={`/${schoolSlug}/attendance`}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            <span>Ver Registro Completo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {classes.map((c) => (
            <div
              key={c.id}
              className={cn(
                "p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between gap-3",
                c.isCurrentBlock
                  ? "bg-gradient-to-br from-indigo-900/40 via-blue-900/30 to-slate-900/80 border-indigo-500/60 shadow-md shadow-indigo-500/10 ring-2 ring-indigo-500/20"
                  : "bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              )}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    {c.time}
                  </span>
                  {c.isCurrentBlock ? (
                    <span className="text-[10px] font-extrabold uppercase bg-cyan-500 text-slate-950 px-2 py-0.5 rounded-md animate-pulse">
                      Bloque en Curso
                    </span>
                  ) : c.attendanceDone ? (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/60">
                      Asistencia Lista
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60">
                      Pendiente
                    </span>
                  )}
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {c.course}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {c.subject} · <span className="font-semibold text-slate-700 dark:text-slate-300">{c.classroom}</span>
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {c.studentsCount} estudiantes
                </span>
                <button
                  type="button"
                  onClick={() => setIsQRModalOpen(true)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer",
                    c.isCurrentBlock
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                      : "bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white"
                  )}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{c.attendanceDone ? "Ver Lista" : "Tomar QR"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Evaluaciones Pendientes de Calificación (Decreto 67) */}
      <AdaptiveTable<PendingAssessmentItem>
        title="Evaluaciones en Proceso de Calificación (Decreto 67)"
        description="Ingreso de calificaciones formativas y sumativas para el cierre del libro digital."
        data={pendingAssessments}
        keyExtractor={(item) => item.id}
        columns={[
          {
            key: "title",
            header: "Instrumento Evaluativo",
            render: (item) => (
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                  {item.title}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.course} · {item.type}
                </span>
              </div>
            ),
          },
          {
            key: "dueDate",
            header: "Plazo de Cierre",
            align: "center",
            render: (item) => (
              <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">
                {item.dueDate}
              </span>
            ),
          },
          {
            key: "pendingCount",
            header: "Notas Faltantes",
            align: "center",
            render: (item) => (
              <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800/60">
                {item.pendingCount} pendientes
              </span>
            ),
          },
          {
            key: "actions",
            header: "Acción",
            align: "right",
            render: (item) => (
              <Link
                href={`/${schoolSlug}/grades`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition shadow-xs"
              >
                <span>Calificar Actas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ),
          },
        ]}
      />

      {/* Modal de Asistencia QR Dinámica en Vivo */}
      <DynamicQRAttendanceModal
        schoolSlug={schoolSlug}
        teacherName={activeName}
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        defaultCourseId="course-lpmm-4e"
        defaultCourseName="4° Medio E - Técnico Profesional"
        defaultSubjectId="DBDR-4E"
      />
    </div>
  );
}
