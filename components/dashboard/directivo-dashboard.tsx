"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  GraduationCap,
  CalendarCheck,
  TrendingUp,
  AlertTriangle,
  Award,
  BookOpen,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  FileSpreadsheet,
  Settings,
  Bell,
  Search,
  ChevronRight,
  Activity,
  Layers,
  Sparkles,
  Download,
  Filter,
} from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";
import { AdaptiveTable } from "./adaptive-table";
import { DashboardEmptyState } from "./dashboard-empty-state";

interface DirectivoDashboardProps {
  schoolSlug: string;
  schoolName?: string;
  totalStudents?: number;
  totalTeachers?: number;
  averageAttendance?: number;
  overallGradeAvg?: number;
}

interface CriticalCourseItem {
  id: string;
  name: string;
  level: string;
  attendance: number;
  avgGrade: number;
  alertType: "attendance" | "grades" | "tp" | "ok";
  alertText: string;
  teacherLead: string;
}

export function DirectivoDashboard({
  schoolSlug,
  schoolName = "Liceo Politécnico Marga Marga",
  totalStudents = 640,
  totalTeachers = 42,
  averageAttendance = 94.2,
  overallGradeAvg = 5.8,
}: DirectivoDashboardProps) {
  const [activeTab, setActiveTab] = useState<"general" | "academic" | "staff" | "alerts">("general");

  const coursesData: CriticalCourseItem[] = [
    {
      id: "c1",
      name: "3° Medio C - Telecomunicaciones",
      level: "Técnico Profesional",
      attendance: 82.4,
      avgGrade: 4.8,
      alertType: "attendance",
      alertText: "Asistencia en riesgo (<85%)",
      teacherLead: "Prof. Rodrigo Castro",
    },
    {
      id: "c2",
      name: "2° Medio B - Científico Humanista",
      level: "Enseñanza Media",
      attendance: 88.1,
      avgGrade: 4.3,
      alertType: "grades",
      alertText: "Promedio limítrofe Decreto 67",
      teacherLead: "Prof. Marcela Soto",
    },
    {
      id: "c3",
      name: "4° Medio E - Electricidad Industrial",
      level: "Técnico Profesional",
      attendance: 91.5,
      avgGrade: 5.9,
      alertType: "tp",
      alertText: "Próximo a titulación y práctica",
      teacherLead: "Prof. Alejandro Morales",
    },
    {
      id: "c4",
      name: "1° Medio A - General",
      level: "Enseñanza Media",
      attendance: 95.8,
      avgGrade: 6.1,
      alertType: "ok",
      alertText: "Rendimiento óptimo",
      teacherLead: "Prof. Claudia Vega",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header Contextual para Directivos & UTP */}
      <ContextualHeader
        schoolName={schoolName}
        institutionalCode="RBD 10240 (Quilpué)"
        academicYear="2026"
        term="1er Semestre"
        roleTitle="Equipo Directivo & UTP"
        roleBadgeColor="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
        userName="Dirección del Establecimiento"
        greeting="Panel de Supervisión Ejecutiva y Normativa"
        quickActions={
          <>
            <Link
              href={`/${schoolSlug}/students`}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5 shadow-2xs min-h-[44px]"
            >
              <Users className="w-3.5 h-3.5 text-blue-500" />
              <span>Matrícula General</span>
            </Link>
            <button
              type="button"
              onClick={() => alert("Generando reporte oficial MINEDUC / SIGE...")}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm min-h-[44px] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar Reporte SIGE</span>
            </button>
          </>
        }
      />

      {/* 2. Tarjetas de Resumen Académico con Modo Oscuro Premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AcademicSummaryCard
          title="Matrícula Total"
          value={totalStudents}
          subtitle={`${totalTeachers} docentes activos en planta`}
          badgeLabel="RBD 10240"
          icon={Users}
          accentColor="blue"
          trend={{ value: "+2.4%", isPositive: true }}
          href={`/${schoolSlug}/students`}
        />

        <AcademicSummaryCard
          title="Asistencia Global"
          value={`${averageAttendance}%`}
          subtitle="Meta MINEDUC: 85.0%"
          badgeLabel="Hoy"
          icon={CalendarCheck}
          accentColor="emerald"
          trend={{ value: "+1.1%", isPositive: true }}
          href={`/${schoolSlug}/attendance`}
        />

        <AcademicSummaryCard
          title="Promedio General"
          value={overallGradeAvg.toFixed(1)}
          subtitle="Escala nacional 1.0 a 7.0"
          badgeLabel="Decreto 67"
          icon={Award}
          accentColor="purple"
          trend={{ value: "+0.2", isPositive: true }}
          href={`/${schoolSlug}/grades`}
        />

        <AcademicSummaryCard
          title="Alertas de Retención"
          value="2 cursos"
          subtitle="Monitoreo prioritario UTP"
          badgeLabel="Preventivo"
          icon={AlertTriangle}
          accentColor="amber"
          thresholdAlert={{
            isCritical: true,
            message: "1 curso con asistencia bajo 85%",
          }}
        />
      </div>

      {/* 3. Selector de Pestañas de Gestión (Sin Pills Estáticas) */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
        {[
          { id: "general", label: "Supervisión Curricular" },
          { id: "academic", label: "Decreto 67 & Calificaciones" },
          { id: "staff", label: "Cuerpo Docente & Jefaturas" },
          { id: "alerts", label: "Alertas Tempranas" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Tabla Adaptativa de Cursos en Seguimiento */}
      {activeTab === "alerts" ? (
        <DashboardEmptyState
          type="coexistence"
          title="Sin alertas críticas sin resolver"
          description="Todas las situaciones pedagógicas de riesgo se encuentran con planes de remediación activos por UTP."
          actionLabel="Revisar Actas de Remediación"
          onAction={() => setActiveTab("general")}
        />
      ) : (
        <AdaptiveTable<CriticalCourseItem>
          title="Monitoreo y Desempeño por Curso"
          description="Seguimiento en tiempo real de asistencia, rendimiento Decreto 67 y alertas de retención escolar."
          data={coursesData}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Filtrar por curso o profesor jefe..."
          searchFilter={(item, q) =>
            item.name.toLowerCase().includes(q.toLowerCase()) ||
            item.teacherLead.toLowerCase().includes(q.toLowerCase())
          }
          columns={[
            {
              key: "name",
              header: "Curso / Especialidad",
              render: (item) => (
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{item.name}</span>
                  <span className="text-[11px] text-slate-400">{item.level} · Jefe: {item.teacherLead}</span>
                </div>
              ),
            },
            {
              key: "attendance",
              header: "Asistencia",
              align: "center",
              sortable: true,
              render: (item) => (
                <span
                  className={`font-mono font-bold text-xs ${
                    item.attendance < 85
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {item.attendance.toFixed(1)}%
                </span>
              ),
            },
            {
              key: "avgGrade",
              header: "Promedio Notas",
              align: "center",
              sortable: true,
              render: (item) => (
                <span
                  className={`font-mono font-bold text-xs ${
                    item.avgGrade < 4.0
                      ? "text-rose-600 dark:text-rose-400"
                      : item.avgGrade >= 5.5
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {item.avgGrade.toFixed(1)}
                </span>
              ),
            },
            {
              key: "alertText",
              header: "Diagnóstico UTP",
              render: (item) => (
                <span
                  className={`text-[11px] font-semibold ${
                    item.alertType === "attendance"
                      ? "text-rose-600 dark:text-rose-400"
                      : item.alertType === "grades"
                      ? "text-amber-600 dark:text-amber-400"
                      : item.alertType === "tp"
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {item.alertText}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Acción",
              align: "right",
              render: (item) => (
                <Link
                  href={`/${schoolSlug}/courses`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  <span>Ver Libro</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
