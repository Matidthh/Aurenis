"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  Award,
  CalendarCheck,
  Clock,
  HeartHandshake,
  AlertCircle,
  FileText,
  Calendar,
  ChevronRight,
  Sparkles,
  Phone,
  MessageCircle,
  BookOpen,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";
import { AdaptiveTable } from "./adaptive-table";
import { DashboardEmptyState } from "./dashboard-empty-state";

interface ApoderadoDashboardProps {
  schoolSlug: string;
  guardianName?: string;
  studentName?: string;
  studentCourse?: string;
}

interface SubjectGradeItem {
  id: string;
  subject: string;
  teacher: string;
  avgGrade: number;
  lastGrade: number;
  attendancePercent: number;
  status: "SOBRESALIENTE" | "BUENO" | "REGULAR";
}

export function ApoderadoDashboard({
  schoolSlug,
  guardianName = "Sra. María Belén Ahumada",
  studentName = "Yamir Alonso Ahumada",
  studentCourse = "1° Medio A (Técnico Profesional)",
}: ApoderadoDashboardProps) {
  const [hasJustified, setHasJustified] = useState(false);

  const subjectGrades: SubjectGradeItem[] = [
    {
      id: "s1",
      subject: "Matemática Aplicada",
      teacher: "Prof. Claudia Vega",
      avgGrade: 6.2,
      lastGrade: 6.5,
      attendancePercent: 96.8,
      status: "SOBRESALIENTE",
    },
    {
      id: "s2",
      subject: "Lengua y Literatura",
      teacher: "Prof. Marcela Soto",
      avgGrade: 5.8,
      lastGrade: 5.5,
      attendancePercent: 94.2,
      status: "BUENO",
    },
    {
      id: "s3",
      subject: "Tecnología & Redes Básicas",
      teacher: "Prof. Rodrigo Castro",
      avgGrade: 6.7,
      lastGrade: 7.0,
      attendancePercent: 98.5,
      status: "SOBRESALIENTE",
    },
    {
      id: "s4",
      subject: "Ciencias Naturales",
      teacher: "Prof. Roberto Palma",
      avgGrade: 5.4,
      lastGrade: 5.0,
      attendancePercent: 92.0,
      status: "BUENO",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Contextual para Familias & Apoderados */}
      <ContextualHeader
        schoolName="Liceo Politécnico Marga Marga"
        institutionalCode="RBD 10240"
        academicYear="2026"
        term="1er Semestre"
        roleTitle="Portal de la Familia & Apoderados"
        roleBadgeColor="text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
        userName={guardianName}
        greeting={`Ficha de Seguimiento Escolar de ${studentName}`}
        quickActions={
          <>
            <button
              type="button"
              onClick={() => alert("Abriendo canal de comunicación oficial con Inspectoría General...")}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm min-h-[44px] cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Contactar al Profesor Jefe</span>
            </button>
          </>
        }
      />

      {/* 2. Tarjetas de Resumen del Estudiante */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AcademicSummaryCard
          title="Promedio General"
          value="6.0"
          subtitle="Escala 1.0 a 7.0 (Decreto 67)"
          badgeLabel={studentCourse}
          icon={Award}
          accentColor="purple"
          trend={{ value: "+0.3", isPositive: true }}
        />

        <AcademicSummaryCard
          title="Asistencia Acumulada"
          value="95.4%"
          subtitle="Cumple meta ministerial (85%)"
          badgeLabel="Semestre 1"
          icon={CalendarCheck}
          accentColor="emerald"
          trend={{ value: "+1.0%", isPositive: true }}
        />

        <AcademicSummaryCard
          title="Inasistencias Pendientes"
          value={hasJustified ? "0" : "1"}
          subtitle={hasJustified ? "Al día sin pendientes" : "Martes 24 de Septiembre"}
          badgeLabel="Justificaciones"
          icon={Clock}
          accentColor={hasJustified ? "emerald" : "amber"}
          thresholdAlert={
            hasJustified
              ? undefined
              : {
                  isCritical: false,
                  message: "1 día sin justificar formalmente",
                }
          }
        />

        <AcademicSummaryCard
          title="Próxima Citación"
          value="15 Oct"
          subtitle="Reunión general de apoderados"
          badgeLabel="18:30 hrs"
          icon={Calendar}
          accentColor="blue"
        />
      </div>

      {/* 3. Módulo de Justificación de Inasistencia si existe pendiente */}
      {!hasJustified ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 block">
              Inasistencia Registrada por el Docente
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              {studentName} registró inasistencia el <strong>Martes 24 de Septiembre</strong> en jornada completa.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setHasJustified(true);
              alert("¡Certificado médico recepcionado con éxito en Inspectoría General!");
            }}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer min-h-[44px]"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Adjuntar Justificación Médica</span>
          </button>
        </div>
      ) : (
        <DashboardEmptyState
          type="justifications"
          title="Inasistencias justificadas correctamente"
          description="Todos los registros de inasistencia cuentan con certificado validado por Inspectoría General."
          actionLabel="Ver Registro Completo de Asistencia"
          onAction={() => alert("Visualizando historial anual de asistencia...")}
        />
      )}

      {/* 4. Tabla Adaptativa de Rendimiento por Asignatura */}
      <AdaptiveTable<SubjectGradeItem>
        title="Informe de Notas por Asignatura (Decreto 67)"
        description="Calificaciones parciales y promedio ponderado registrado en el libro de clases digital."
        data={subjectGrades}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Buscar por asignatura o docente..."
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
            key: "lastGrade",
            header: "Última Nota",
            align: "center",
            render: (item) => (
              <span className="font-mono font-bold text-xs text-slate-900 dark:text-white">
                {item.lastGrade.toFixed(1)}
              </span>
            ),
          },
          {
            key: "avgGrade",
            header: "Promedio Parcial",
            align: "center",
            render: (item) => (
              <span
                className={`font-mono font-bold text-xs ${
                  item.avgGrade >= 6.0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : item.avgGrade >= 4.0
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {item.avgGrade.toFixed(1)}
              </span>
            ),
          },
          {
            key: "attendancePercent",
            header: "Asistencia en Ramo",
            align: "center",
            render: (item) => (
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                {item.attendancePercent.toFixed(1)}%
              </span>
            ),
          },
          {
            key: "status",
            header: "Rendimiento",
            align: "right",
            render: (item) => (
              <span
                className={`text-[11px] font-bold ${
                  item.status === "SOBRESALIENTE"
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {item.status}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
