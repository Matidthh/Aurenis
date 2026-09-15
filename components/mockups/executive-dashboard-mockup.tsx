"use client";

import React, { useState } from "react";
import {
  School,
  Users,
  Award,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Filter,
  FileSpreadsheet,
  FileText,
  Clock,
  ChevronRight,
  BookOpen,
  Layers,
  GraduationCap,
  ShieldCheck,
  Search,
  ExternalLink,
  MessageCircle,
  Eye,
  Info,
} from "lucide-react";

interface ExecutiveDashboardMockupProps {
  showHotspots?: boolean;
  onSelectStudentRisk?: (student: {
    name: string;
    course: string;
    avgGrade: number;
    attendance: number;
    riskFactor: string;
    priority: "high" | "medium" | "low";
  }) => void;
  onExportReport?: (format: "pdf" | "excel") => void;
}

export function ExecutiveDashboardMockup({
  showHotspots = false,
  onSelectStudentRisk,
  onExportReport,
}: ExecutiveDashboardMockupProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"sem1" | "sem2" | "annual">("sem1");
  const [selectedLevel, setSelectedLevel] = useState<"all" | "basica" | "media">("all");
  const [selectedChartTab, setSelectedChartTab] = useState<"attendance" | "grades" | "curriculum">("attendance");
  const [metricDetailModal, setMetricDetailModal] = useState<string | null>(null);

  // Datos simulados de alta fidelidad ejecutivos
  const AT_RISK_STUDENTS = [
    {
      id: "s1",
      name: "Mateo Fernández Silva",
      course: "1° Medio A",
      avgGrade: 3.8,
      attendance: 78.5,
      riskFactor: "Ausentismo reiterado y reprobación en Matemáticas",
      priority: "high" as const,
      avatar: "MF",
    },
    {
      id: "s2",
      name: "Valentina Rojas Castro",
      course: "2° Medio B",
      avgGrade: 3.9,
      attendance: 81.2,
      riskFactor: "Bajo 4.0 en Lenguaje e Historia",
      priority: "high" as const,
      avatar: "VR",
    },
    {
      id: "s3",
      name: "Ignacio Carrasco Pérez",
      course: "8° Básico A",
      avgGrade: 4.1,
      attendance: 83.0,
      riskFactor: "Alerta preventiva de inasistencias en mayo",
      priority: "medium" as const,
      avatar: "IC",
    },
    {
      id: "s4",
      name: "Catalina Muñoz Vera",
      course: "3° Medio A",
      avgGrade: 4.2,
      attendance: 84.4,
      riskFactor: "Pendiente entrega de 2 evaluaciones",
      priority: "medium" as const,
      avatar: "CM",
    },
  ];

  const DEPARTMENT_PERFORMANCE = [
    { dept: "Matemática", head: "Prof. Roberto Gómez", avg: 5.4, passRate: 86.2, trend: "+0.3", status: "good" },
    { dept: "Lenguaje y Comunicación", head: "Prof. Carmen Gloria Díaz", avg: 5.9, passRate: 94.5, trend: "+0.1", status: "excellent" },
    { dept: "Ciencias Naturales / Biología", head: "Prof. Andrés Valdés", avg: 5.7, passRate: 91.0, trend: "-0.2", status: "good" },
    { dept: "Historia y Cs. Sociales", head: "Prof. Patricia Morales", avg: 6.1, passRate: 97.8, trend: "+0.4", status: "excellent" },
    { dept: "Idioma Extranjero Inglés", head: "Prof. John Miller", avg: 5.8, passRate: 90.4, trend: "+0.2", status: "good" },
  ];

  const ATTENDANCE_WEEKLY_DATA = [
    { week: "Semana 1", basica: 96.2, media: 94.1, total: 95.1 },
    { week: "Semana 2", basica: 95.8, media: 93.8, total: 94.8 },
    { week: "Semana 3", basica: 94.5, media: 92.5, total: 93.5 },
    { week: "Semana 4", basica: 96.0, media: 94.6, total: 95.3 },
    { week: "Semana 5", basica: 95.4, media: 94.2, total: 94.8 },
  ];

  const hotspotClass = showHotspots
    ? "relative outline-2 outline-dashed outline-blue-500/70 after:absolute after:inset-0 after:bg-blue-500/10 after:pointer-events-none hover:after:bg-blue-500/20"
    : "";

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 font-sans pb-10">
      {/* 1. Header Ejecutivo y Filtros Contextuales */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Dashboard Ejecutivo Institucional
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Datos en Vivo
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Colegio San José • RBD 10294-8 • Régimen Semestral 2026
          </p>
        </div>

        {/* Barra de Filtros Rápidos */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Selector de Periodo */}
          <div className={`flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold ${hotspotClass}`}>
            <button
              onClick={() => setSelectedPeriod("sem1")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedPeriod === "sem1"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              1° Semestre
            </button>
            <button
              onClick={() => setSelectedPeriod("sem2")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedPeriod === "sem2"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              2° Semestre
            </button>
            <button
              onClick={() => setSelectedPeriod("annual")}
              className={`px-3 py-1.5 rounded-lg transition ${
                selectedPeriod === "annual"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Anual 2026
            </button>
          </div>

          {/* Selector de Nivel */}
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value as any)}
            aria-label="Filtrar por nivel educativo"
            className={`text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${hotspotClass}`}
          >
            <option value="all">Todos los Niveles</option>
            <option value="basica">Enseñanza Básica (1°-8°)</option>
            <option value="media">Enseñanza Media (1°-4°)</option>
          </select>

          {/* Botones de Exportación Rápida */}
          <button
            onClick={() => onExportReport?.("pdf")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-brand-600 text-white dark:bg-slate-800 dark:hover:bg-brand-600 transition shadow-xs ${hotspotClass}`}
            title="Descargar Informe Ejecutivo Oficial"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reporte PDF</span>
          </button>
        </div>
      </div>

      {/* 2. Banner de Estado Situacional Ejecutivo (Zero Cognitive Overload) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-blue-800/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-brand-500/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/30 text-blue-200 text-[11px] font-bold uppercase tracking-wider border border-blue-400/20">
                Resumen de Jornada
              </span>
              <span className="text-xs text-blue-200/80">Lunes, 14 de Septiembre de 2026</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white">
              Institución operando al 94.8% de asistencia global con 0 incidentes graves
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed">
              El 91.2% de los libros de clases están al día con sus firmas digitales. 14 estudiantes están bajo
              seguimiento de alerta temprana por ausentismo preventivo.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Asistencia Hoy</span>
              <span className="text-xl font-black text-emerald-300">95.4%</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">En Alerta UTP</span>
              <span className="text-xl font-black text-amber-300">14 Casos</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/15 text-center min-w-[100px]">
              <span className="text-[10px] uppercase font-bold text-blue-200 block">Docentes Activos</span>
              <span className="text-xl font-black text-white">32 / 32</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Tarjetas de Resumen y Métricas Clave (Top KPIs con Micro-Tendencias) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Matrícula Total */}
        <div
          onClick={() => setMetricDetailModal("enrollment")}
          className={`cursor-pointer group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-brand-500 hover:shadow-md transition-all space-y-3 ${hotspotClass}`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Matrícula Total
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">842</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +3.8%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              98% capacidad utilizada (Capacidad: 860)
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <span>Básica: 480</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Media: 362</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-brand-600 dark:text-brand-400 flex items-center gap-0.5">
              Detalle <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* KPI 2: Asistencia Promedio Institucional */}
        <div
          onClick={() => setMetricDetailModal("attendance")}
          className={`cursor-pointer group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 hover:shadow-md transition-all space-y-3 ${hotspotClass}`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Asistencia Global
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">94.8%</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +1.2%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Meta MINEDUC: 90.0% (Subvención asegurada)
            </p>
          </div>

          {/* Barra de progreso visual */}
          <div className="space-y-1">
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "94.8%" }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Umbral: 85%</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">+4.8% sobre meta</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Promedio General de Notas */}
        <div
          onClick={() => setMetricDetailModal("grades")}
          className={`cursor-pointer group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500 hover:shadow-md transition-all space-y-3 ${hotspotClass}`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Promedio General
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition">
              <Award className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">5.8</span>
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500">/ 7.0</span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +0.2
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tasa de Aprobación: 88.4% de alumnos
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400">≥ 6.0: 42%</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-blue-600 dark:text-blue-400">5.0-5.9: 38%</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-rose-600 dark:text-rose-400">&lt; 4.0: 4.8%</span>
          </div>
        </div>

        {/* KPI 4: Cobertura y Planificación Curricular */}
        <div
          onClick={() => setMetricDetailModal("curriculum")}
          className={`cursor-pointer group bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-purple-500 hover:shadow-md transition-all space-y-3 ${hotspotClass}`}
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cobertura Curricular
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">91.2%</span>
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center">
                Meta Sem. 90%
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              1,420 de 1,556 OAs planificados registrados
            </p>
          </div>

          <div className="space-y-1">
            <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div className="h-full bg-purple-600 rounded-full" style={{ width: "91.2%" }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Libro Digital al día</span>
              <span className="text-purple-600 dark:text-purple-400 font-bold">Excelente</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bloque Principal: Gráficos de Tendencia & Alerta Temprana (Layout en 2 Columnas) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2/3): Análisis de Tendencias Visual */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Monitoreo de Asistencia y Rendimiento
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Evolución semana a semana por ciclo de enseñanza
              </p>
            </div>

            {/* Pestañas de Gráfico */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSelectedChartTab("attendance")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedChartTab === "attendance"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Asistencia (%)
              </button>
              <button
                onClick={() => setSelectedChartTab("grades")}
                className={`px-3 py-1.5 rounded-lg transition ${
                  selectedChartTab === "grades"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                Distribución Notas
              </button>
            </div>
          </div>

          {/* Gráfico / Visualización Limpia en SVG */}
          {selectedChartTab === "attendance" ? (
            <div className="space-y-4">
              <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-6 pt-6 px-2">
                {ATTENDANCE_WEEKLY_DATA.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full flex items-end justify-center gap-1.5 h-44">
                      {/* Barra Básica */}
                      <div
                        className="w-full max-w-[28px] bg-blue-500 hover:bg-blue-600 rounded-t-md transition-all relative group/bar"
                        style={{ height: `${(item.basica - 70) * 3.3}%` }}
                      >
                        <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20 pointer-events-none">
                          Básica: {item.basica}%
                        </div>
                      </div>

                      {/* Barra Media */}
                      <div
                        className="w-full max-w-[28px] bg-indigo-600 hover:bg-indigo-700 rounded-t-md transition-all relative group/bar"
                        style={{ height: `${(item.media - 70) * 3.3}%` }}
                      >
                        <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap z-20 pointer-events-none">
                          Media: {item.media}%
                        </div>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                      {item.week}
                    </span>
                  </div>
                ))}
              </div>

              {/* Leyenda del Gráfico */}
              <div className="flex items-center justify-center gap-6 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-500" />
                  <span>Enseñanza Básica (Prom. 95.6%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-indigo-600" />
                  <span>Enseñanza Media (Prom. 93.8%)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <div className="w-4 border-t-2 border-dashed border-emerald-500" />
                  <span>Meta MINEDUC (90%)</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Distribución de Notas */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase block">
                    Sobresaliente (6.0 - 7.0)
                  </span>
                  <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">42.1%</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400">354 estudiantes</p>
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 space-y-1">
                  <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase block">
                    Bueno (5.0 - 5.9)
                  </span>
                  <p className="text-2xl font-black text-blue-700 dark:text-blue-300">38.4%</p>
                  <p className="text-[11px] text-blue-600 dark:text-blue-400">323 estudiantes</p>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-1">
                  <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase block">
                    Suficiente (4.0 - 4.9)
                  </span>
                  <p className="text-2xl font-black text-amber-700 dark:text-amber-300">14.7%</p>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400">124 estudiantes</p>
                </div>

                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 space-y-1">
                  <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 uppercase block">
                    Insuficiente (&lt; 4.0)
                  </span>
                  <p className="text-2xl font-black text-rose-700 dark:text-rose-300">4.8%</p>
                  <p className="text-[11px] text-rose-600 dark:text-rose-400">41 estudiantes en alerta</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>Total de evaluaciones ingresadas en el semestre: <strong>4,820 calificaciones</strong></span>
                <span className="text-brand-600 dark:text-brand-400 font-bold">100% validadas</span>
              </div>
            </div>
          )}
        </div>

        {/* Columna Derecha (1/3): Alertas Tempranas & Estudiantes Prioritarios */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Alerta Temprana UTP</h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Casos que requieren intervención</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold">
              4 Prioritarios
            </span>
          </div>

          <div className="space-y-3">
            {AT_RISK_STUDENTS.map((student) => (
              <div
                key={student.id}
                onClick={() => onSelectStudentRisk?.(student)}
                className={`cursor-pointer p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 hover:border-brand-500 hover:bg-brand-50/30 dark:hover:bg-brand-950/20 transition space-y-2 ${hotspotClass}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs">
                      {student.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {student.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">{student.course}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      student.priority === "high"
                        ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900"
                    }`}
                  >
                    {student.priority === "high" ? "Crítico" : "Seguimiento"}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                  {student.riskFactor}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="font-semibold text-slate-500">
                    Promedio: <strong className={student.avgGrade < 4.0 ? "text-rose-600 font-bold" : "text-slate-900 dark:text-white"}>{student.avgGrade}</strong>
                  </span>
                  <span className="font-semibold text-slate-500">
                    Asistencia: <strong className={student.attendance < 85 ? "text-rose-600 font-bold" : "text-amber-600"}>{student.attendance}%</strong>
                  </span>
                  <span className="text-brand-600 dark:text-brand-400 font-bold flex items-center gap-0.5">
                    Ficha <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => onSelectStudentRisk?.(AT_RISK_STUDENTS[0])}
            className="w-full py-2 text-center text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 bg-brand-50 dark:bg-brand-950/40 rounded-xl transition"
          >
            Ver todos los 14 alumnos en riesgo →
          </button>
        </div>
      </div>

      {/* 5. Rendimiento por Departamentos / Asignaturas */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Desempeño Académico por Departamento
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Promedios institucionales y tasa de aprobación del semestre
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">5 Departamentos evaluados</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-3">Departamento</th>
                <th className="py-2.5 px-3">Jefe de Área</th>
                <th className="py-2.5 px-3 text-center">Promedio</th>
                <th className="py-2.5 px-3 text-center">Aprobación</th>
                <th className="py-2.5 px-3 text-center">Tendencia</th>
                <th className="py-2.5 px-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {DEPARTMENT_PERFORMANCE.map((dept, i) => (
                <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {dept.dept}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-300">
                    {dept.head}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-sm text-slate-900 dark:text-white">
                    {dept.avg}
                  </td>
                  <td className="py-3 px-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {dept.passRate}%
                  </td>
                  <td className="py-3 px-3 text-center font-semibold">
                    <span className={dept.trend.startsWith("+") ? "text-emerald-600" : "text-rose-600"}>
                      {dept.trend}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        dept.status === "excellent"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {dept.status === "excellent" ? "Sobresaliente" : "En Meta"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
