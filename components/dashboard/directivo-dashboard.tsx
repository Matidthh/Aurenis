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
import { AnnouncementModal } from "./announcement-modal";
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
  schoolName = "Colegio Bicentenario Aurenis",
  totalStudents = 640,
  totalTeachers = 42,
  averageAttendance = 94.2,
  overallGradeAvg = 5.8,
}: DirectivoDashboardProps) {
  const [activeTab, setActiveTab] = useState<"general" | "academic" | "tp" | "alerts">("general");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("all");
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState<boolean>(false);

  const tpSpecialties = [
    { name: "Telecomunicaciones", code: "TEL", students: 165, avgAttendance: 91.8, avgGrade: 5.6, color: "from-blue-600 to-cyan-500", icon: Activity },
    { name: "Electricidad Industrial", code: "ELE", students: 172, avgAttendance: 93.4, avgGrade: 5.9, color: "from-amber-500 to-yellow-400", icon: Sparkles },
    { name: "Gastronomía", code: "GAS", students: 154, avgAttendance: 95.1, avgGrade: 6.2, color: "from-emerald-500 to-teal-400", icon: Sparkles },
    { name: "Científico Humanista (1° y 2°)", code: "CH", students: 149, avgAttendance: 96.0, avgGrade: 5.7, color: "from-purple-600 to-indigo-500", icon: BookOpen },
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
      name: "3° Medio E - Programación (LPMM)",
      level: "Técnico Profesional",
      specialty: "Programación",
      attendance: 93.8,
      avgGrade: 6.1,
      alertType: "ok",
      alertText: "Correos actualizados y rendimiento óptimo",
      teacherLead: "Prof. Julio Molina",
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
  ];

  return (
    <div className="space-y-6">
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        authorName="Dirección Ejecutiva LPMM"
        schoolName={schoolName}
      />

      {/* Header Contextual */}
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
            <button
              type="button"
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 min-h-[44px] cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Enviar Anuncio</span>
            </button>
            <Link
              href={`/${schoolSlug}/grades`}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-blue-500/20 min-h-[44px]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Matriz Decreto 67</span>
            </Link>
          </>
        }
      />

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <AcademicSummaryCard
          title="Matrícula Total"
          value={totalStudents}
          subtitle={`${totalTeachers} docentes activos · 18 cursos`}
          badgeLabel="RBD 10240"
          icon={Users}
          accentColor="blue"
          trend={{ value: "+2.4%", isPositive: true }}
        />
        <AcademicSummaryCard
          title="Asistencia Global"
          value={`${averageAttendance}%`}
          subtitle="Meta MINEDUC: 85.0% cumplida"
          badgeLabel="Semana Actual"
          icon={CalendarCheck}
          accentColor="emerald"
          trend={{ value: "+1.1%", isPositive: true }}
        />
        <AcademicSummaryCard
          title="Promedio General"
          value={overallGradeAvg.toFixed(1)}
          subtitle="Cumplimiento Decreto 67/2018"
          badgeLabel="1er Semestre"
          icon={Award}
          accentColor="indigo"
        />
        <AcademicSummaryCard
          title="Alertas Académicas"
          value="2"
          subtitle="1 Cursos en riesgo asistencia (<85%)"
          badgeLabel="Atención UTP"
          icon={AlertTriangle}
          accentColor="rose"
        />
      </div>

      {/* Table */}
      <div className="space-y-3">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
          Cursos en Monitoreo Curricular y Especialidades LPMM
        </h3>
        <AdaptiveTable
          columns={[
            {
              key: "name",
              header: "Curso y Especialidad",
              render: (item) => (
                <div>
                  <span className="font-extrabold block text-slate-900 dark:text-white">{item.name}</span>
                  <span className="text-[10px] text-slate-400">{item.level} · {item.teacherLead}</span>
                </div>
              ),
            },
            {
              key: "attendance",
              header: "Asistencia",
              render: (item) => (
                <span className={cn("font-bold text-xs", item.attendance < 85 ? "text-rose-600" : "text-emerald-600")}>
                  {item.attendance}%
                </span>
              ),
            },
            {
              key: "avgGrade",
              header: "Promedio",
              render: (item) => (
                <span className="font-bold text-xs text-blue-600">{item.avgGrade.toFixed(1)}</span>
              ),
            },
            {
              key: "alertText",
              header: "Diagnóstico UTP",
              render: (item) => <span className="text-xs font-semibold">{item.alertText}</span>,
            },
          ]}
          data={coursesData}
          keyExtractor={(item) => item.id}
        />
      </div>
    </div>
  );
}
