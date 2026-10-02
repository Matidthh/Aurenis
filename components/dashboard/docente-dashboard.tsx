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
} from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";
import { AdaptiveTable } from "./adaptive-table";
import { DashboardEmptyState } from "./dashboard-empty-state";

interface DocenteDashboardProps {
  schoolSlug: string;
  teacherName?: string;
  myCoursesCount?: number;
}

interface ClassScheduleItem {
  id: string;
  time: string;
  course: string;
  subject: string;
  classroom: string;
  attendanceDone: boolean;
  studentsCount: number;
}

interface PendingAssessmentItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  pendingCount: number;
}

export function DocenteDashboard({
  schoolSlug,
  teacherName = "Prof. Rodrigo Castro Díaz",
  myCoursesCount = 4,
}: DocenteDashboardProps) {
  const [classes, setClasses] = useState<ClassScheduleItem[]>([
    {
      id: "cl1",
      time: "08:00 - 09:30",
      course: "4° Medio E - Electricidad",
      subject: "Sistemas Eléctricos Industriales",
      classroom: "Taller TP 2",
      attendanceDone: true,
      studentsCount: 30,
    },
    {
      id: "cl2",
      time: "09:45 - 11:15",
      course: "3° Medio C - Telecomunicaciones",
      subject: "Redes de Datos & Conectividad",
      classroom: "Laboratorio 4",
      attendanceDone: false,
      studentsCount: 28,
    },
    {
      id: "cl3",
      time: "11:30 - 13:00",
      course: "1° Medio A",
      subject: "Tecnología & Automatización",
      classroom: "Sala 12",
      attendanceDone: false,
      studentsCount: 34,
    },
  ]);

  const pendingAssessments: PendingAssessmentItem[] = [
    {
      id: "a1",
      title: "Evaluación Práctica N°2 - Tableros Trifásicos",
      course: "4° Medio E",
      dueDate: "Hoy 18:00",
      pendingCount: 12,
    },
    {
      id: "a2",
      title: "Prueba Teórica N°1 - Protocolos TCP/IP",
      course: "3° Medio C",
      dueDate: "Viernes 14:00",
      pendingCount: 28,
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Contextual para Docentes */}
      <ContextualHeader
        schoolName="Liceo Politécnico Marga Marga"
        institutionalCode="RBD 10240"
        academicYear="2026"
        term="1er Semestre"
        roleTitle="Docente de Asignatura & Jefatura"
        roleBadgeColor="text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20"
        userName={teacherName}
        greeting="Libro de Clases & Gestión Pedagógica"
        quickActions={
          <>
            <Link
              href={`/${schoolSlug}/attendance`}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm min-h-[44px]"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Nueva Sesión QR</span>
            </Link>
            <Link
              href={`/${schoolSlug}/grades`}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-2xs min-h-[44px]"
            >
              <FileEdit className="w-3.5 h-3.5 text-blue-500" />
              <span>Ingresar Calificaciones</span>
            </Link>
          </>
        }
      />

      {/* 2. Tarjetas de Resumen Docente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AcademicSummaryCard
          title="Cursos Asignados"
          value={myCoursesCount}
          subtitle="92 estudiantes en total"
          badgeLabel="Jefatura 1° Medio A"
          icon={BookOpen}
          accentColor="blue"
          href={`/${schoolSlug}/courses`}
        />

        <AcademicSummaryCard
          title="Asistencia de Hoy"
          value="1 / 3"
          subtitle="2 bloques pendientes de registro"
          badgeLabel="Horario Diario"
          icon={CalendarCheck}
          accentColor="emerald"
          href={`/${schoolSlug}/attendance`}
        />

        <AcademicSummaryCard
          title="Calificaciones Pendientes"
          value={pendingAssessments.length}
          subtitle="Actas abiertas bajo Decreto 67"
          badgeLabel="Por Evaluar"
          icon={Award}
          accentColor="amber"
          href={`/${schoolSlug}/grades`}
        />

        <AcademicSummaryCard
          title="Promedio de Asignatura"
          value="5.6"
          subtitle="Aprobación del 91.2%"
          badgeLabel="Semestre 1"
          icon={Sparkles}
          accentColor="purple"
        />
      </div>

      {/* 3. Bloques de Clases de la Jornada (Tabla Adaptativa) */}
      <AdaptiveTable<ClassScheduleItem>
        title="Agenda Pedagógica de Hoy"
        description="Bloques lectivos programados y estado de toma de asistencia digital o manual."
        data={classes}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Buscar por curso o asignatura..."
        searchFilter={(item, q) =>
          item.course.toLowerCase().includes(q.toLowerCase()) ||
          item.subject.toLowerCase().includes(q.toLowerCase())
        }
        columns={[
          {
            key: "time",
            header: "Horario",
            render: (item) => (
              <span className="font-mono font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {item.time}
              </span>
            ),
          },
          {
            key: "course",
            header: "Curso y Asignatura",
            render: (item) => (
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{item.course}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {item.subject} · {item.classroom}
                </span>
              </div>
            ),
          },
          {
            key: "studentsCount",
            header: "N° Estudiantes",
            align: "center",
            render: (item) => (
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {item.studentsCount} matriculados
              </span>
            ),
          },
          {
            key: "attendanceDone",
            header: "Asistencia",
            align: "center",
            render: (item) =>
              item.attendanceDone ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Registrada</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pendiente</span>
                </span>
              ),
          },
          {
            key: "actions",
            header: "Control",
            align: "right",
            render: (item) => (
              <Link
                href={`/${schoolSlug}/attendance`}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  item.attendanceDone
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                    : "bg-blue-600 text-white hover:bg-blue-500 shadow-2xs"
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{item.attendanceDone ? "Ver Registro" : "Iniciar QR"}</span>
              </Link>
            ),
          },
        ]}
      />

      {/* 4. Evaluaciones Pendientes de Calificación (Decreto 67) */}
      <AdaptiveTable<PendingAssessmentItem>
        title="Evaluaciones en Proceso de Corrección (Decreto 67)"
        description="Ingreso de calificaciones formativas y sumativas para el cierre del libro digital."
        data={pendingAssessments}
        keyExtractor={(item) => item.id}
        columns={[
          {
            key: "title",
            header: "Instrumento Evaluativo",
            render: (item) => (
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{item.title}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.course}</span>
              </div>
            ),
          },
          {
            key: "dueDate",
            header: "Plazo de Entrega",
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
              <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
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
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>Calificar Actas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}
