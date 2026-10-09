"use client";

import React from "react";
import {
  BookOpen,
  CalendarCheck,
  Users,
  FileSpreadsheet,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronRight,
} from "lucide-react";

interface ProblemSolutionSectionProps {
  onOpenQuoteModal?: (source?: string) => void;
  onOpenDemoModal?: (source?: string) => void;
}

export function ProblemSolutionSection({
  onOpenQuoteModal,
  onOpenDemoModal,
}: ProblemSolutionSectionProps) {
  function scrollToSimulator() {
    const el = document.getElementById("simulador");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    } else if (onOpenDemoModal) {
      onOpenDemoModal("Simulador desde Características");
    }
  }

  const pillars = [
    {
      id: "notas",
      title: "Calificaciones & Decreto 67",
      regulationBadge: "Decreto 67 Mineduc",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
      iconBg: "bg-blue-100 text-blue-600",
      icon: BookOpen,
      desc: "Ponderaciones reglamentarias automáticas, atajos de teclado rápido y generación de actas en 1 clic sin fórmulas rotas.",
      highlight: "Ahorro de ~4 hrs/semana por docente",
    },
    {
      id: "asistencia",
      title: "Libro Digital & Asistencia",
      regulationBadge: "Circular N° 30 SuperEduc",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      iconBg: "bg-emerald-100 text-emerald-600",
      icon: CalendarCheck,
      desc: "Pase de lista por bloque en segundos, firmas electrónicas con validez legal y bitácora de aula 100% auditable.",
      highlight: "100% de trazabilidad oficial",
    },
    {
      id: "comunicacion",
      title: "Portal Escolar & Familias",
      regulationBadge: "Acceso con RUN",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      iconBg: "bg-indigo-100 text-indigo-600",
      icon: Users,
      desc: "Informes de notas, alertas tempranas y citaciones en tiempo real para apoderados con estricta privacidad de datos NNA.",
      highlight: "Comunicación fluida y segura",
    },
    {
      id: "reportes",
      title: "Exportación & SIGE Mineduc",
      regulationBadge: "Compatible SIGE",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
      iconBg: "bg-purple-100 text-purple-600",
      icon: FileSpreadsheet,
      desc: "Consolidación de matrículas, asistencias y actas finales en formatos oficiales listos para carga ministerial.",
      highlight: "Subvenciones 100% protegidas",
    },
  ];

  return (
    <section
      id="problema-solucion"
      className="py-12 sm:py-16 bg-[#F8F8F5] text-slate-900 relative overflow-hidden border-b border-slate-200/70"
    >
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Encabezado compacto y directo */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Gestión Académica Integral</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-snug">
            Todo lo que tu colegio necesita, sin complicaciones
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed">
            Reemplaza planillas desincronizadas y libros físicos con una plataforma ágil,
            conforme a la normativa ministerial chilena y diseñada para el ritmo real del aula.
          </p>
        </div>

        {/* Grid de 4 pilares compactos y de alto impacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${pillar.iconBg}`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${pillar.badgeColor}`}
                    >
                      {pillar.regulationBadge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed mt-1 font-normal">
                      {pillar.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{pillar.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tira compacta de comparativa y llamado directo a la acción */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-5 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              Arquitectura Multi-Tenant Aislada
            </span>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">
              ·
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Cero pérdida de notas por fórmulas rotas
            </span>
            <span className="hidden sm:inline text-slate-300" aria-hidden="true">
              ·
            </span>
            <span>Respaldo inmutable auditado</span>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={scrollToSimulator}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span>Ver Simulador</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            </button>

            <button
              type="button"
              onClick={() =>
                onOpenDemoModal
                  ? onOpenDemoModal("Agendar Demostración")
                  : onOpenQuoteModal
                  ? onOpenQuoteModal("Cotización")
                  : scrollToSimulator()
              }
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer min-h-[40px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span>Agendar Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
