"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Award,
  CalendarCheck,
  QrCode,
  BookOpen,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileCheck2,
} from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";
import { AdaptiveTable } from "./adaptive-table";
import { DashboardEmptyState } from "./dashboard-empty-state";

interface EstudianteDashboardProps {
  schoolSlug: string;
  studentName?: string;
  courseName?: string;
}

interface StudentCourseSubject {
  id: string;
  subject: string;
  teacher: string;
  currentAvg: number;
  attendanceRate: number;
  nextExamDate: string;
}

interface UpcomingExamItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  format: string;
}

export function EstudianteDashboard({
  schoolSlug,
  studentName = "Yamir Alonso Ahumada",
  courseName = "1° Medio A - Telecomunicaciones TP",
}: EstudianteDashboardProps) {
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [scannedSuccess, setScannedSuccess] = useState(false);

  const subjects: StudentCourseSubject[] = [
    {
      id: "s1",
      subject: "Redes de Conectividad & Datos",
      teacher: "Prof. Rodrigo Castro",
      currentAvg: 6.8,
      attendanceRate: 98.2,
      nextExamDate: "Viernes 09:45",
    },
    {
      id: "s2",
      subject: "Matemática Aplicada",
      teacher: "Prof. Claudia Vega",
      currentAvg: 6.2,
      attendanceRate: 96.5,
      nextExamDate: "Lunes 08:00",
    },
    {
      id: "s3",
      subject: "Lengua y Comunicación",
      teacher: "Prof. Marcela Soto",
      currentAvg: 5.9,
      attendanceRate: 95.0,
      nextExamDate: "Próxima Semana",
    },
    {
      id: "s4",
      subject: "Ciencias para la Ciudadanía",
      teacher: "Prof. Roberto Palma",
      currentAvg: 6.4,
      attendanceRate: 98.0,
      nextExamDate: "En 10 días",
    },
  ];

  const upcomingExams: UpcomingExamItem[] = [
    {
      id: "e1",
      title: "Prueba Teórica N°1: Arquitectura Modelo OSI",
      subject: "Redes de Conectividad",
      date: "Viernes 04 de Octubre, 09:45",
      format: "Evaluación Sumativa (Decreto 67)",
    },
    {
      id: "e2",
      title: "Guía Práctica N°3: Álgebra y Ecuaciones",
      subject: "Matemática Aplicada",
      date: "Lunes 07 de Octubre, 08:00",
      format: "Taller Grupal en Sala",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Contextual para Estudiantes */}
      <ContextualHeader
        schoolName="Liceo Politécnico Marga Marga"
        institutionalCode="RBD 10240"
        academicYear="2026"
        term="1er Semestre"
        roleTitle="Estudiante Regular"
        roleBadgeColor="text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20"
        userName={studentName}
        greeting={`Portal Académico del Alumno — ${courseName}`}
        quickActions={
          <>
            <button
              type="button"
              onClick={() => {
                setIsQrModalOpen(true);
                setTimeout(() => {
                  setScannedSuccess(true);
                }, 1200);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md min-h-[44px] cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Escanear QR de Asistencia</span>
            </button>
          </>
        }
      />

      {/* 2. Tarjetas de Resumen del Estudiante */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AcademicSummaryCard
          title="Mi Promedio General"
          value="6.3"
          subtitle="Aprobación destacada en TP"
          badgeLabel="Decreto 67"
          icon={Award}
          accentColor="purple"
          trend={{ value: "+0.4", isPositive: true }}
        />

        <AcademicSummaryCard
          title="Asistencia Global"
          value="97.2%"
          subtitle="Meta exigida MINEDUC: 85%"
          badgeLabel="Semestre 1"
          icon={CalendarCheck}
          accentColor="emerald"
          trend={{ value: "+0.8%", isPositive: true }}
        />

        <AcademicSummaryCard
          title="Próxima Evaluación"
          value="Viernes"
          subtitle="Redes de Conectividad (OSI)"
          badgeLabel="09:45 hrs"
          icon={Calendar}
          accentColor="blue"
        />

        <AcademicSummaryCard
          title="Asistencia Hoy"
          value={scannedSuccess ? "Registrada" : "Lista para Escanear"}
          subtitle={scannedSuccess ? "Clase iniciada a tiempo" : "Código QR emitido por el docente"}
          badgeLabel="En Vivo"
          icon={QrCode}
          accentColor={scannedSuccess ? "emerald" : "indigo"}
        />
      </div>

      {/* Banner de Feedback si escaneó el QR */}
      {scannedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-xs block">¡Asistencia registrada con éxito en el Libro Digital!</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Tu presencia quedó asentada para el bloque de Redes de Datos con el Prof. Rodrigo Castro.
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setScannedSuccess(false)}
            className="text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline cursor-pointer"
          >
            Entendido
          </button>
        </div>
      )}

      {/* 3. Tabla Adaptativa de Mis Asignaturas */}
      <AdaptiveTable<StudentCourseSubject>
        title="Mis Asignaturas y Calificaciones"
        description="Detalle de promedios parciales calculados según el reglamento evaluativo institucional."
        data={subjects}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Buscar asignatura o profesor..."
        searchFilter={(item, q) =>
          item.subject.toLowerCase().includes(q.toLowerCase()) ||
          item.teacher.toLowerCase().includes(q.toLowerCase())
        }
        columns={[
          {
            key: "subject",
            header: "Asignatura",
            render: (item) => (
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{item.subject}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.teacher}</span>
              </div>
            ),
          },
          {
            key: "currentAvg",
            header: "Promedio Actual",
            align: "center",
            sortable: true,
            render: (item) => (
              <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                {item.currentAvg.toFixed(1)}
              </span>
            ),
          },
          {
            key: "attendanceRate",
            header: "Asistencia",
            align: "center",
            sortable: true,
            render: (item) => (
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                {item.attendanceRate.toFixed(1)}%
              </span>
            ),
          },
          {
            key: "nextExamDate",
            header: "Próxima Prueba",
            align: "right",
            render: (item) => (
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                {item.nextExamDate}
              </span>
            ),
          },
        ]}
      />

      {/* 4. Próximas Evaluaciones Programadas */}
      <AdaptiveTable<UpcomingExamItem>
        title="Calendario de Evaluaciones Programadas"
        description="Fechas fijadas en UTP para el cumplimiento del calendario académico semestral."
        data={upcomingExams}
        keyExtractor={(item) => item.id}
        columns={[
          {
            key: "title",
            header: "Evaluación",
            render: (item) => (
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{item.title}</span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.subject}</span>
              </div>
            ),
          },
          {
            key: "date",
            header: "Fecha y Horario",
            render: (item) => (
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                {item.date}
              </span>
            ),
          },
          {
            key: "format",
            header: "Modalidad",
            align: "right",
            render: (item) => (
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {item.format}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
