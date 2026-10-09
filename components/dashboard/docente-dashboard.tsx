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
} from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";
import { AdaptiveTable } from "./adaptive-table";
import { DashboardEmptyState } from "./dashboard-empty-state";
import { cn } from "@/lib/utils/cn";

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
  isCurrentBlock?: boolean;
}

interface PendingAssessmentItem {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  pendingCount: number;
  type: string;
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
      isCurrentBlock: false,
    },
    {
      id: "cl2",
      time: "09:45 - 11:15",
      course: "3° Medio C - Telecomunicaciones",
      subject: "Redes de Datos & Conectividad",
      classroom: "Laboratorio 4",
      attendanceDone: false,
      studentsCount: 28,
      isCurrentBlock: true,
    },
    {
      id: "cl3",
      time: "11:30 - 13:00",
      course: "1° Medio A",
      subject: "Tecnología & Automatización",
      classroom: "Sala 12",
      attendanceDone: false,
      studentsCount: 34,
      isCurrentBlock: false,
    },
  ]);

  const pendingAssessments: PendingAssessmentItem[] = [
    {
      id: "a1",
      title: "Evaluación Práctica N°2 - Tableros Trifásicos",
      course: "4° Medio E",
      dueDate: "Hoy 18:00",
      pendingCount: 12,
      type: "Formativa D67",
    },
    {
      id: "a2",
      title: "Prueba Teórica N°1 - Protocolos TCP/IP",
      course: "3° Medio C",
      dueDate: "Viernes 14:00",
      pendingCount: 28,
      type: "Sumativa Coef. 1",
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
        roleTitle="Docente de Especialidad & Jefatura"
        roleBadgeColor="text-blue-400 bg-blue-500/10 border-blue-500/30"
        userName={teacherName}
        greeting="Libro de Clases Digital & Gestión Pedagógica"
        quickActions={
          <>
            <Link
              href={`/${schoolSlug}/attendance`}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20 min-h-[44px]"
            >
              <QrCode className="w-4 h-4" />
              <span>Pase Asistencia QR</span>
            </Link>
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
          title="Cursos Asignados"
          value={myCoursesCount}
          subtitle="92 alumnos en total"
          badgeLabel="Jefatura 1° Medio A"
          icon={BookOpen}
          accentColor="blue"
          href={`/${schoolSlug}/courses`}
        />

        <AcademicSummaryCard
          title="Bloque Actual"
          value="Lab 4"
          subtitle="3° Medio C · Telecomunicaciones"
          badgeLabel="En Curso"
          icon={Clock}
          accentColor="emerald"
          href={`/${schoolSlug}/attendance`}
        />

        <AcademicSummaryCard
          title="Notas por Ingresar"
          value={pendingAssessments.length}
          subtitle="Decreto 67 · 40 actas pendientes"
          badgeLabel="Por Evaluar"
          icon={Award}
          accentColor="amber"
          href={`/${schoolSlug}/grades`}
        />

        <AcademicSummaryCard
          title="Promedio General"
          value="5.8"
          subtitle="Tasa de aprobación 93.4%"
          badgeLabel="Semestre 1"
          icon={Sparkles}
          accentColor="purple"
          href={`/${schoolSlug}/grades`}
        />
      </div>

      {/* 3. Bloques de Clases de la Jornada (Agenda Pedagógica) */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0C1425]/90 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
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
                  ? "bg-gradient-to-br from-blue-900/40 via-indigo-900/30 to-slate-900/80 border-blue-500/60 shadow-md shadow-blue-500/10 ring-2 ring-blue-500/20"
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
                <Link
                  href={`/${schoolSlug}/attendance`}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5",
                    c.isCurrentBlock
                      ? "bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
                      : "bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white"
                  )}
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{c.attendanceDone ? "Ver Lista" : "Tomar QR"}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Evaluaciones Pendientes de Calificación (Decreto 67) */}
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
    </div>
  );
}
