"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  School,
  Users,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  FileSpreadsheet,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Zap,
  Sparkles,
  Smartphone,
  Eye,
  Check,
} from "lucide-react";

export function PortalsByRole() {
  const [activeTab, setActiveTab] = useState<"estudiante" | "docente" | "directivo" | "apoderado">("estudiante");

  const rolesContent = {
    estudiante: {
      title: "Portal del Estudiante",
      tagline: "Todo tu rendimiento académico, calificaciones Decreto 67 y asistencia en un solo lugar.",
      icon: GraduationCap,
      color: "bg-emerald-600 text-white",
      badge: "Para Alumnos",
      features: [
        "Planilla de calificaciones en tiempo real con ponderaciones y promedios oficiales.",
        "Historial y porcentaje de asistencia por asignatura con semáforo de aprobación (mínimo 85%).",
        "Acceso a rúbricas de evaluación, tareas y calendario de pruebas del curso.",
        "Solicitud y descarga instantánea de certificados de alumno regular.",
        "Visualización optimizada en smartphones sin necesidad de descargas pesadas.",
      ],
      previewStats: [
        { label: "Promedio General", value: "6.4", status: "Destacado", color: "text-emerald-600 dark:text-emerald-400" },
        { label: "Asistencia Total", value: "96.5%", status: "Aprobada", color: "text-blue-600 dark:text-blue-400" },
        { label: "Asignaturas Cursadas", value: "11", status: "Al día", color: "text-slate-900 dark:text-white" },
      ],
      ctaText: "Ver Vista de Alumno en Prototipo",
      ctaHref: "/mockups",
    },
    docente: {
      title: "Suite para Docentes y Profesores Jefes",
      tagline: "Libro de clases digital, planilla de notas de alta velocidad y gestión de jefatura.",
      icon: BookOpen,
      color: "bg-indigo-600 text-white",
      badge: "Para Profesores",
      features: [
        "Planilla matricial de notas ultra rápida: tipeo con teclado numérico (ej: 65 = 6.5) y auto-avance.",
        "Pase de asistencia 1-click con justificaciones médicas y registro de atrasos.",
        "Control de leccionario digital estructurado con objetivos de aprendizaje (OA) Mineduc.",
        "Ficha 360° del estudiante con historial socioemocional, notas y adecuaciones PIE.",
        "Firma de registros de clase y cálculo automático de promedios sin doble digitación.",
      ],
      previewStats: [
        { label: "Velocidad de Ingreso", value: "0.2s", status: "Por nota", color: "text-indigo-600 dark:text-indigo-400" },
        { label: "Libro Digital", value: "100%", status: "Circular 30", color: "text-emerald-600 dark:text-emerald-400" },
        { label: "Cursos Asignados", value: "6 Cursos", status: "32 hrs/sem", color: "text-slate-900 dark:text-white" },
      ],
      ctaText: "Probar Planilla de Notas",
      ctaHref: "/mockups",
    },
    directivo: {
      title: "Consola para Directivos, UTP y Sostenedores",
      tagline: "Visión panorámica del colegio, sistema de alerta temprana SAT y cumplimiento ministerial.",
      icon: School,
      color: "bg-blue-600 text-white",
      badge: "Para Equipos Directivos",
      features: [
        "Dashboard ejecutivo con semáforo de riesgo escolar y prevención de deserción temprana.",
        "Auditoría de cobertura curricular por asignatura, nivel y docente en tiempo real.",
        "Gestión multisede y soporte para redes de colegios o corporaciones municipales (SLEP).",
        "Generación automática de actas finales, nóminas de matrícula y reportes oficiales SIGE.",
        "Control de roles granulares (RBAC) con permisos específicos para inspectores, UTP y dirección.",
      ],
      previewStats: [
        { label: "Retención Escolar", value: "98.8%", status: "+2.4% vs 2025", color: "text-emerald-600 dark:text-emerald-400" },
        { label: "Casos en Alerta SAT", value: "14", status: "Bajo monitoreo", color: "text-amber-600 dark:text-amber-400" },
        { label: "Cobertura Curricular", value: "94.2%", status: "Objetivos Mineduc", color: "text-blue-600 dark:text-blue-400" },
      ],
      ctaText: "Ver Dashboard Ejecutivo",
      ctaHref: "/colegio-san-jose/dashboard",
    },
    apoderado: {
      title: "Portal de Apoderados y Familias",
      tagline: "Comunicación fluida y transparencia sobre el avance pedagógico de tus hijos.",
      icon: Users,
      color: "bg-purple-600 text-white",
      badge: "Para Apoderados",
      features: [
        "Notificaciones instantáneas al celular cuando el alumno ingresa atrasado o falta a clases.",
        "Visualización transparente de calificaciones, anotaciones positivas y observaciones de conducta.",
        "Citaciones a reuniones de apoderados y entrevistas individuales con el profesor jefe.",
        "Justificación de inasistencias en línea con carga de certificados médicos.",
        "Comunicaciones institucionales y circulares del colegio con acuse de recibo.",
      ],
      previewStats: [
        { label: "Notificaciones", value: "En Vivo", status: "WhatsApp / Email", color: "text-purple-600 dark:text-purple-400" },
        { label: "Hijos Vinculados", value: "1 o más", status: "Mismo portal", color: "text-slate-900 dark:text-white" },
        { label: "Satisfacción Familias", value: "97%", status: "Transparencia", color: "text-emerald-600 dark:text-emerald-400" },
      ],
      ctaText: "Explorar Portal de Familias",
      ctaHref: "/mockups",
    },
  };

  const current = rolesContent[activeTab];
  const Icon = current.icon;

  return (
    <section id="portales" className="relative w-full pt-16 pb-24 bg-[#F8F8F5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
            Una experiencia a la medida de cada persona
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Cada miembro del colegio ve exactamente lo que necesita
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Sin menús confusos ni opciones de más: los profesores registran clases sin perder tiempo, los apoderados reciben avisos en su celular y la dirección tiene el control total del colegio.
          </p>
        </div>

      {/* Tabs Selector */}
      <div className="flex items-center justify-center gap-2.5 flex-wrap mb-10">
        <button
          type="button"
          onClick={() => setActiveTab("estudiante")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "estudiante"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
              : "bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 shadow-2xs"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Alumnos y Estudiantes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("docente")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "docente"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 shadow-2xs"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Docentes y Profesores Jefes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("directivo")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "directivo"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 shadow-2xs"
          }`}
        >
          <School className="w-4 h-4" />
          <span>Directivos, UTP & Sostenedores</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("apoderado")}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "apoderado"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 shadow-2xs"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Apoderados y Familias</span>
        </button>
      </div>

      {/* Contenedor del Rol Activo */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 lg:p-12 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Lado Izquierdo: Descripción y Lista de Beneficios */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${current.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                {current.badge}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {current.title}
            </h3>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {current.tagline}
            </p>
          </div>

          <div className="space-y-3">
            {current.features.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm text-slate-700 leading-snug">
                  {feat}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center gap-4 flex-wrap">
            <Link
              href={current.ctaHref}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 hover:bg-blue-600 text-white transition shadow-md group"
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/colegio-san-jose/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Ejemplo en Vivo</span>
            </Link>
          </div>
        </div>

        {/* Lado Derecho: Tarjeta Interactiva de Métricas y Vista Previa */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Métricas Clave del Rol
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              <Zap className="w-3 h-3" />
              Sincronizado
            </span>
          </div>

          <div className="space-y-3">
            {current.previewStats.map((stat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between shadow-2xs"
              >
                <div>
                  <div className="text-xs text-slate-500">{stat.label}</div>
                  <div className={`text-xl font-black mt-0.5 ${stat.color}`}>{stat.value}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-600">
                    {stat.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/60 text-xs text-blue-800 space-y-1">
            <div className="font-extrabold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Privacidad Aislada por Institución</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              Cada usuario accede únicamente a los datos de su propio establecimiento mediante aislamiento multi-tenant estricto.
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
