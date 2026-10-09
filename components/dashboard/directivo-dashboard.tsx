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
  BarChart3,
  PieChart,
  Calendar,
  Clock,
  QrCode,
  FileText,
  UserCheck,
} from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";
import { AdaptiveTable } from "./adaptive-table";
import { DashboardEmptyState } from "./dashboard-empty-state";
import { cn } from "@/lib/utils/cn";

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
  specialty?: string;
}

export function DirectivoDashboard({
  schoolSlug,
  schoolName = "Liceo Politécnico Marga Marga",
  totalStudents = 640,
  totalTeachers = 42,
  averageAttendance = 94.2,
  overallGradeAvg = 5.8,
}: DirectivoDashboardProps) {
  const [activeTab, setActiveTab] = useState<"general" | "academic" | "tp" | "alerts">("general");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");

  const tpSpecialties = [
    { name: "Telecomunicaciones", code: "TEL", students: 165, avgAttendance: 91.8, avgGrade: 5.6, color: "from-blue-600 to-cyan-500", icon: Activity },
    { name: "Electricidad Industrial", code: "ELE", students: 172, avgAttendance: 93.4, avgGrade: 5.9, color: "from-amber-500 to-yellow-400", icon: ZapIcon },
    { name: "Gastronomía", code: "GAS", students: 154, avgAttendance: 95.1, avgGrade: 6.2, color: "from-emerald-500 to-teal-400", icon: Sparkles },
    { name: "Científico Humanista (1° y 2°)", code: "CH", students: 149, avgAttendance: 96.0, avgGrade: 5.7, color: "from-purple-600 to-indigo-500", icon: BookOpen },
  ];

  const weeklyAttendanceDays = [
    { day: "Lun 02", rate: 95.4, present: 611 },
    { day: "Mar 03", rate: 96.1, present: 615 },
    { day: "Mié 04", rate: 93.8, present: 600 },
    { day: "Jue 05", rate: 94.7, present: 606 },
    { day: "Vie 06", rate: 91.2, present: 584 },
  ];

  const gradeDistribution = [
    { range: "6.0 - 7.0 (Sobresaliente)", count: 288, percentage: 45, color: "bg-emerald-500 text-emerald-400" },
    { range: "5.0 - 5.9 (Bueno)", count: 224, percentage: 35, color: "bg-blue-500 text-blue-400" },
    { range: "4.0 - 4.9 (Suficiente)", count: 96, percentage: 15, color: "bg-amber-500 text-amber-400" },
    { range: "1.0 - 3.9 (Insuficiente)", count: 32, percentage: 5, color: "bg-rose-500 text-rose-400" },
  ];

  const upcomingEvents = [
    { title: "Evaluación Coef. 2 Telecomunicaciones", date: "Mañana 08:30", course: "4° Medio C", type: "academic" },
    { title: "Consejo de Profesores y UTP", date: "Jueves 16:00", course: "Cuerpo Docente", type: "staff" },
    { title: "Entrega de Informes Parciales 1er Semestre", date: "Viernes 14:00", course: "Todos los cursos", type: "report" },
  ];

  const coursesData: CriticalCourseItem[] = [
    {
      id: "c1",
      name: "3° Medio C - Telecomunicaciones",
      level: "Técnico Profesional",
      specialty: "Telecomunicaciones",
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
      specialty: "Científico Humanista",
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
      specialty: "Electricidad Industrial",
      attendance: 91.5,
      avgGrade: 5.9,
      alertType: "tp",
      alertText: "Próximo a titulación y práctica profesional",
      teacherLead: "Prof. Alejandro Morales",
    },
    {
      id: "c4",
      name: "1° Medio A - Plan Común",
      level: "Enseñanza Media",
      specialty: "Científico Humanista",
      attendance: 95.8,
      avgGrade: 6.1,
      alertType: "ok",
      alertText: "Rendimiento académico destacado",
      teacherLead: "Prof. Claudia Vega",
    },
    {
      id: "c5",
      name: "3° Medio A - Gastronomía",
      level: "Técnico Profesional",
      specialty: "Gastronomía",
      attendance: 94.6,
      avgGrade: 6.3,
      alertType: "ok",
      alertText: "Excelente asistencia a talleres prácticos",
      teacherLead: "Prof. Patricia Fuentes",
    },
  ];

  const filteredCourses = selectedSpecialty === "all"
    ? coursesData
    : coursesData.filter((c) => c.specialty?.toLowerCase().includes(selectedSpecialty.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* 1. Header Contextual para Directivos & UTP */}
      <ContextualHeader
        schoolName={schoolName}
        institutionalCode="RBD 10240 (Quilpué)"
        academicYear="2026"
        term="1er Semestre"
        roleTitle="Equipo Directivo & UTP"
        roleBadgeColor="text-blue-400 bg-blue-500/10 border-blue-500/30"
        userName="Dirección del Establecimiento"
        greeting="Panel de Supervisión Ejecutiva, Normativa y UTP"
        quickActions={
          <>
            <Link
              href={`/${schoolSlug}/grades`}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20 min-h-[44px]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Matriz Decreto 67</span>
            </Link>
            <Link
              href={`/${schoolSlug}/attendance`}
              className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition flex items-center gap-2 backdrop-blur-md min-h-[44px]"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Pase Asistencia QR</span>
            </Link>
          </>
        }
      />

      {/* 2. Tarjetas de Resumen Académico con Modo Oscuro Premium */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AcademicSummaryCard
          title="Matrícula Total"
          value={totalStudents}
          subtitle={`${totalTeachers} docentes activos · 18 cursos`}
          badgeLabel="RBD 10240"
          icon={Users}
          accentColor="blue"
          trend={{ value: "+2.4%", isPositive: true }}
          href={`/${schoolSlug}/students`}
        />

        <AcademicSummaryCard
          title="Asistencia Global"
          value={`${averageAttendance}%`}
          subtitle="Meta MINEDUC: 85.0% cumplida"
          badgeLabel="Semana Actual"
          icon={CalendarCheck}
          accentColor="emerald"
          trend={{ value: "+1.1%", isPositive: true }}
          href={`/${schoolSlug}/attendance`}
        />

        <AcademicSummaryCard
          title="Promedio General"
          value={overallGradeAvg.toFixed(1)}
          subtitle="Escala nacional 1.0 a 7.0 (Decreto 67)"
          badgeLabel="1er Semestre"
          icon={Award}
          accentColor="purple"
          trend={{ value: "+0.2", isPositive: true }}
          href={`/${schoolSlug}/grades`}
        />

        <AcademicSummaryCard
          title="Alertas de Retención"
          value="2 cursos"
          subtitle="Plan preventivo UTP activo"
          badgeLabel="Prioritario"
          icon={AlertTriangle}
          accentColor="amber"
          thresholdAlert={{
            isCritical: true,
            message: "3° Medio C: Asistencia 82.4%",
          }}
          href={`/${schoolSlug}/courses`}
        />
      </div>

      {/* 3. Panel de Análisis Gráfico y Especialidades TP */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Asistencia Semanal */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0C1425]/90 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Asistencia Diaria del Establecimiento
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Comparativa de la semana en curso respecto al 85% umbral MINEDUC
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800/60">
              Promedio: {averageAttendance}%
            </span>
          </div>

          {/* Barras Visuales de Asistencia Semanal */}
          <div className="grid grid-cols-5 gap-3 pt-2">
            {weeklyAttendanceDays.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 group">
                <div className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300">
                  {item.rate}%
                </div>
                <div className="w-full h-32 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-1.5 flex flex-col justify-end relative overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                  {/* Línea del 85% MINEDUC */}
                  <div
                    className="absolute left-0 right-0 border-t border-dashed border-amber-400/80 z-10 pointer-events-none"
                    style={{ bottom: "85%" }}
                    title="Meta MINEDUC 85%"
                  />
                  <div
                    className={cn(
                      "w-full rounded-xl transition-all duration-500 group-hover:brightness-110",
                      item.rate >= 95
                        ? "bg-gradient-to-t from-emerald-600 to-teal-400"
                        : item.rate >= 90
                        ? "bg-gradient-to-t from-blue-600 to-cyan-400"
                        : "bg-gradient-to-t from-amber-600 to-yellow-400"
                    )}
                    style={{ height: `${item.rate}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                  {item.day}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  {item.present} pres.
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-amber-400 inline-block border-t border-dashed" />
              Línea de corte subvención MINEDUC (85%)
            </span>
            <Link href={`/${schoolSlug}/attendance`} className="font-bold text-blue-600 dark:text-blue-400 hover:underline">
              Ver reporte histórico completo →
            </Link>
          </div>
        </div>

        {/* Distribución de Calificaciones Decreto 67 */}
        <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0C1425]/90 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/30">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  Rendimiento Decreto 67
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Distribución de 640 estudiantes evaluados
                </p>
              </div>
            </div>

            {/* Barras de Rango de Notas */}
            <div className="space-y-3 mt-4">
              {gradeDistribution.map((grade, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-700 dark:text-slate-300">{grade.range}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400">
                      {grade.count} ({grade.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", grade.color.split(" ")[0])}
                      style={{ width: `${grade.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Tasa de Aprobación Global</span>
              <span className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">95.0%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Especialidades Técnico Profesionales (LPMM) */}
      <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#0C1425]/90 backdrop-blur-md p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                Especialidades y Ramas Formativas
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Liceo Politécnico Marga Marga · Módulos de Formación Diferenciada
              </p>
            </div>
          </div>

          {/* Filtro rápido */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedSpecialty("all")}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer",
                selectedSpecialty === "all"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              )}
            >
              Todas (4)
            </button>
            {tpSpecialties.map((spec) => (
              <button
                key={spec.code}
                type="button"
                onClick={() => setSelectedSpecialty(spec.name)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap",
                  selectedSpecialty === spec.name
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {spec.code}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          {tpSpecialties.map((spec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/40 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 font-mono">
                  {spec.code}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300">
                  {spec.students} alumnos
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white mb-3">
                {spec.name}
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Asistencia:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{spec.avgAttendance}%</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                  <span>Promedio D67:</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{spec.avgGrade.toFixed(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Tabla Adaptativa de Cursos en Seguimiento con Estilo Mejorado */}
      <AdaptiveTable<CriticalCourseItem>
        title="Monitoreo y Desempeño por Curso"
        description="Seguimiento en tiempo real de asistencia, rendimiento Decreto 67 y alertas de retención escolar."
        data={filteredCourses}
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
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/20">
                  {item.name.slice(0, 2)}
                </div>
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Jefe: {item.teacherLead}
                  </span>
                </div>
              </div>
            ),
          },
          {
            key: "attendance",
            header: "Asistencia",
            align: "center",
            sortable: true,
            render: (item) => (
              <div className="flex flex-col items-center gap-1">
                <span
                  className={cn(
                    "font-mono font-bold text-xs px-2 py-0.5 rounded-md",
                    item.attendance < 85
                      ? "text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900"
                      : "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-900"
                  )}
                >
                  {item.attendance.toFixed(1)}%
                </span>
              </div>
            ),
          },
          {
            key: "avgGrade",
            header: "Promedio Notas",
            align: "center",
            sortable: true,
            render: (item) => (
              <span
                className={cn(
                  "font-mono font-extrabold text-xs px-2.5 py-0.5 rounded-lg border",
                  item.avgGrade < 4.0
                    ? "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
                    : item.avgGrade >= 5.5
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20"
                )}
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
                className={cn(
                  "text-xs font-semibold flex items-center gap-1.5",
                  item.alertType === "attendance"
                    ? "text-rose-600 dark:text-rose-400"
                    : item.alertType === "grades"
                    ? "text-amber-600 dark:text-amber-400"
                    : item.alertType === "tp"
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-emerald-600 dark:text-emerald-400"
                )}
              >
                {item.alertType === "attendance" && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                {item.alertType === "ok" && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
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
                href={`/${schoolSlug}/grades`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition"
              >
                <span>Libro</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            ),
          },
        ]}
      />
    </div>
  );
}

function ZapIcon(props: { className?: string }) {
  return <Sparkles {...props} />;
}
