"use client";

import React, { useState } from "react";
import {
  FileSpreadsheet,
  BookOpen,
  AlertTriangle,
  Building2,
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Lock,
  Layers,
  ArrowRight,
  Check,
  Smartphone,
} from "lucide-react";

export function SystemFeaturesGrid() {
  const [selectedPill, setSelectedPill] = useState<string>("todos");

  const corePillars = [
    {
      id: "matricial",
      tag: "FLAGSHIP DOCENTE",
      icon: FileSpreadsheet,
      title: "Planilla Matricial de Alta Densidad",
      badge: "Decreto 67 Mineduc",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      description:
        "Diseñada para el flujo real del profesor: ingreso por teclado numérico con salto automático (ej: escribir '65' guarda 6.5), semáforo cromático configurable y ponderaciones porcentuales automáticas por asignatura.",
      highlights: [
        "Navegación tipo hoja de cálculo con flechas y Tab",
        "Validación de notas instantánea y recálculo automático",
        "Historial de auditoría por celda con firma del docente",
      ],
      previewSnippet: {
        alumno: "González, Camila",
        p1: "6.8",
        p2: "5.9",
        p3: "7.0",
        promedio: "6.6",
      },
    },
    {
      id: "libro-digital",
      tag: "NORMATIVA OFICIAL",
      icon: BookOpen,
      title: "Libro de Clases Digital & Leccionario",
      badge: "Circular 30 Superintendencia",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
      description:
        "Cumple al 100% las directrices oficiales de la Superintendencia: registro por bloques de clases, banco integrado de Objetivos de Aprendizaje (OA), firma electrónica y respaldo cifrado inmutable.",
      highlights: [
        "Asistencia por bloque con estados: Presente, Ausente, Justificado, Atraso",
        "Leccionario sincronizado con el currículum Mineduc",
        "Actas de cierre listas para validación de inspectoría general",
      ],
      previewSnippet: {
        bloque: "08:00 - 09:30 (2 hrs)",
        asignatura: "Historia, Geografía y Cs. Sociales",
        presentes: "38 / 40 (95%)",
        estado: "Firma Pendiente",
      },
    },
  ];

  const gridFeatures = [
    {
      icon: AlertTriangle,
      title: "Sistema de Alerta Temprana (SAT)",
      badge: "Prevención Deserción",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      description:
        "Algoritmos de monitoreo continuo que detectan bajas en asistencia (< 85%) o caídas de rendimiento antes del cierre de actas.",
      kpi: "Alerta en 48 hrs",
    },
    {
      icon: Building2,
      title: "Multi-Sede & Sostenedores SLEP",
      badge: "Redes Escolares",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      description:
        "Cuadro de mando consolidado para corporaciones y fundaciones que administran múltiples colegios y liceos con aislamiento estricto de datos.",
      kpi: "Hasta 50+ colegios",
    },
    {
      icon: Layers,
      title: "Módulo PIE & NEE Especiales",
      badge: "Decreto 83 & 170",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      description:
        "Gestión de adecuaciones curriculares (PACI), registro psicopedagógico confidencial y trabajo colaborativo entre educadoras diferenciales y docentes.",
      kpi: "PACI Digital",
    },
    {
      icon: BrainCircuit,
      title: "Copiloto IA Pedagógico Aurenis",
      badge: "Asistencia al Docente",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
      description:
        "Generación asistida de rúbricas analíticas, sugerencias pedagógicas formativas y análisis de cobertura curricular alineado a las bases nacionales.",
      kpi: "Ahorro 3 hrs/plan",
    },
    {
      icon: ShieldCheck,
      title: "Sincronización Ministerial SIGE",
      badge: "Mineduc Oficial",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      description:
        "Formatos preconfigurados para exportar matrículas, actas de notas finales y resúmenes de asistencia sin reprocesar datos en secretaría.",
      kpi: "100% Compatible",
    },
    {
      icon: Smartphone,
      title: "Portal Apoderados & PWA Móvil",
      badge: "Comunidad 24/7",
      badgeColor: "bg-sky-50 text-sky-700 border-sky-200",
      description:
        "Las familias revisan calificaciones, atrasos y comunicaciones oficiales en su celular en tiempo real, reduciendo reclamos y visitas presenciales.",
      kpi: "PWA Offline-ready",
    },
  ];

  return (
    <section id="caracteristicas" className="relative w-full py-20 sm:py-28 bg-[#F8F8F5] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        
        {/* Header Principal */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-14 sm:mb-18">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Ecosistema Integral Escolar
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Tecnología construida para la normativa chilena
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Cada módulo de AURENIS está diseñado para resolver las exigencias concretas de docentes, equipos UTP, directores y familias.
          </p>
        </div>

        {/* 1. SECCIÓN BENTO HERO: Las 2 Capacidades Insignia (Planilla & Libro Digital) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {corePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-7 sm:p-9 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Micro glow corner */}
                <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 bg-blue-50/80 rounded-full blur-2xl group-hover:bg-blue-100/60 transition-colors" />

                <div className="space-y-6 relative z-10">
                  {/* Top bar with tag & badge */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-600">
                      {pillar.tag}
                    </span>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${pillar.badgeColor}`}>
                      {pillar.badge}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                        {pillar.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {pillar.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 font-medium">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>

                  {/* Micro Preview Box */}
                  <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/80 text-xs font-mono">
                    {pillar.id === "matricial" && pillar.previewSnippet && (
                      <div className="flex items-center justify-between text-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-sans font-semibold text-slate-900">{pillar.previewSnippet.alumno}</span>
                        </div>
                        <div className="flex items-center gap-2 font-bold">
                          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800">{pillar.previewSnippet.p1}</span>
                          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-800">{pillar.previewSnippet.p2}</span>
                          <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-blue-700">{pillar.previewSnippet.p3}</span>
                          <span className="px-2.5 py-0.5 bg-blue-600 text-white rounded font-sans font-black">
                            Prom: {pillar.previewSnippet.promedio}
                          </span>
                        </div>
                      </div>
                    )}

                    {pillar.id === "libro-digital" && pillar.previewSnippet && (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-700 font-sans">
                        <div>
                          <div className="text-[11px] text-slate-500">{pillar.previewSnippet.bloque}</div>
                          <div className="font-bold text-slate-900 text-xs">{pillar.previewSnippet.asignatura}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                            {pillar.previewSnippet.presentes}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold">
                            {pillar.previewSnippet.estado}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                  <span>Ver funcionamiento en demo interactiva</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* 2. GRID SECUNDARIO DE 6 CAPACIDADES (3 Columnas con Alto Contraste) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gridFeatures.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-7 space-y-4 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200/80 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-base sm:text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-500">Métrica clave:</span>
                  <span className="font-extrabold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/70">
                    {item.kpi}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
