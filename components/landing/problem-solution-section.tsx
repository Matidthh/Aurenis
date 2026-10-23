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
} from "lucide-react";

interface ProblemSolutionSectionProps {
  onOpenQuoteModal?: (source?: string) => void;
  onOpenDemoModal?: (source?: string) => void;
}

export function ProblemSolutionSection({
  onOpenQuoteModal,
  onOpenDemoModal,
}: ProblemSolutionSectionProps) {


  const pillars = [
    {
      id: "notas",
      title: "Adiós a los Excel rotos",
      regulationBadge: "Decreto 67 Mineduc",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
      iconBg: "bg-blue-100 text-blue-600",
      icon: BookOpen,
      desc: "Ingresa notas con atajos de teclado rápidos. El sistema calcula los promedios y ponderaciones por ti, sin errores de fórmulas.",
      highlight: "Recupera tus tardes de domingo",
    },
    {
      id: "asistencia",
      title: "Asistencia en un pestañeo",
      regulationBadge: "Circular N° 30 SuperEduc",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
      iconBg: "bg-emerald-100 text-emerald-600",
      icon: CalendarCheck,
      desc: "Pasa la lista desde tu celular o deja que los alumnos escaneen un QR. Firma digitalmente en segundos y olvida el papel.",
      highlight: "100% legal, 0% estrés",
    },
    {
      id: "comunicacion",
      title: "Familias felices y al día",
      regulationBadge: "Transparencia Total",
      badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      iconBg: "bg-indigo-100 text-indigo-600",
      icon: Users,
      desc: "Apoderados reciben notificaciones automáticas. No más llamadas por notas perdidas o dudas sobre el promedio.",
      highlight: "Comunicación fluida (de verdad)",
    },
    {
      id: "reportes",
      title: "Reportes sin dolor de cabeza",
      regulationBadge: "Carga SIGE Fácil",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
      iconBg: "bg-purple-100 text-purple-600",
      icon: FileSpreadsheet,
      desc: "Genera actas finales y informes de personalidad en un clic. Todo listo para subir al SIGE sin transformar archivos.",
      highlight: "El botón mágico existe",
    },
  ];

  return (
    <section
      id="problema-solucion"
      className="py-12 sm:py-20 bg-[#F8F8F5] text-slate-900 relative overflow-hidden border-b border-slate-200/70"
    >
      <div className="max-w-[1340px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* Encabezado compacto y directo */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Diseñado por y para docentes</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Menos papeleo, <span className="text-blue-600">más pedagogía</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Sabemos que el tiempo en el aula es oro. Aurenis elimina la carga administrativa 
            para que te enfoques en lo que realmente importa: enseñar.
          </p>
        </div>

        {/* Grid de 4 pilares compactos y de alto impacto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${pillar.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${pillar.badgeColor}`}
                    >
                      {pillar.regulationBadge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-2 font-medium">
                      {pillar.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
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
              onClick={() => {
                if (onOpenDemoModal) onOpenDemoModal("Agendar Demostración");
                else if (onOpenQuoteModal) onOpenQuoteModal("Cotización");
              }}
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
