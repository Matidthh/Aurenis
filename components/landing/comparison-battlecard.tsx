"use client";

import React from "react";
import { Check, X, Sparkles, Zap, Shield, ArrowRight } from "lucide-react";

interface ComparisonBattlecardProps {
  onOpenQuoteModal: () => void;
}

export function ComparisonBattlecard({ onOpenQuoteModal }: ComparisonBattlecardProps) {
  const comparisonRows = [
    {
      feature: "Estabilidad y velocidad en cierres semestrales",
      excel: "Fórmulas rotas y archivos desincronizados",
      traditional: "Recargas continuas de página y lentitud",
      aurenis: "Plataforma web reactiva sin recargas",
      highlight: true,
    },
    {
      feature: "Canales de soporte técnico y orientación",
      excel: "Sin soporte",
      traditional: "Tickets lentos y respuesta diferida",
      aurenis: "Canal directo con equipo técnico",
      highlight: true,
    },
    {
      feature: "Cumplimiento Circular 30 y Decreto 67",
      excel: "Riesgo alto de inconsistencias de cálculo",
      traditional: "Configuraciones rígidas o complejas",
      aurenis: "Cálculo nativo Simple y Ponderado (%)",
      highlight: false,
    },
    {
      feature: "Velocidad de carga de notas y asistencia",
      excel: "Manual y propenso a errores de digitación",
      traditional: "Formularios lentos con recarga",
      aurenis: "Tipeo continuo con teclado numérico",
      highlight: false,
    },
    {
      feature: "Trazabilidad y control de accesos",
      excel: "Archivos editables sin registro de autor",
      traditional: "Permisos genéricos difíciles de auditar",
      aurenis: "Roles RBAC (Director, UTP, Docente)",
      highlight: false,
    },
    {
      feature: "Puesta en marcha y carga de datos",
      excel: "Manual",
      traditional: "Procesos largos y desatendidos",
      aurenis: "Importación asistida de nóminas y cursos",
      highlight: true,
    },
  ];

  return (
    <section id="comparativa" className="py-20 sm:py-28 bg-[#F8F8F5] text-slate-900 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Comparativa de Mercado
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            ¿Por qué los colegios eligen <span className="text-blue-600">AURENIS</span>?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Compara objetivamente lo que ocurre cuando un colegio trabaja con planillas dispersas, con software tradicional o con la arquitectura moderna de AURENIS.
          </p>
        </div>

        {/* Table Container */}
        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-4 px-4 sm:px-6 font-bold text-slate-700 w-1/3">
                    Capacidad Crítica
                  </th>
                  <th className="py-4 px-3 sm:px-4 font-semibold text-slate-400 text-center w-1/5">
                    Planillas Excel
                  </th>
                  <th className="py-4 px-3 sm:px-4 font-semibold text-slate-400 text-center w-1/4">
                    Software Tradicional
                  </th>
                  <th className="py-4 px-4 sm:px-6 font-black text-blue-600 bg-blue-50/80 text-center w-1/4 border-l border-r border-blue-100">
                    <div className="flex items-center justify-center gap-1.5">
                      <Zap className="w-4 h-4 fill-blue-600" />
                      <span>AURENIS</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonRows.map((row, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-slate-50/60 transition ${
                      row.highlight ? "bg-slate-50/30" : ""
                    }`}
                  >
                    <td className="py-4 px-4 sm:px-6 font-bold text-slate-800">
                      {row.feature}
                    </td>

                    <td className="py-4 px-3 sm:px-4 text-slate-500 text-center text-xs">
                      <div className="flex items-center justify-center gap-1.5 text-rose-500 font-medium">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">{row.excel}</span>
                      </div>
                      <span className="sm:hidden text-[10px] text-slate-400 block mt-0.5">{row.excel}</span>
                    </td>

                    <td className="py-4 px-3 sm:px-4 text-slate-500 text-center text-xs">
                      <div className="flex items-center justify-center gap-1.5 text-amber-600 font-medium">
                        <X className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">{row.traditional}</span>
                      </div>
                      <span className="sm:hidden text-[10px] text-slate-400 block mt-0.5">{row.traditional}</span>
                    </td>

                    <td className="py-4 px-4 sm:px-6 bg-blue-50/40 border-l border-r border-blue-100 text-center">
                      <div className="flex items-center justify-center gap-1.5 font-bold text-blue-700">
                        <Check className="w-4 h-4 stroke-[3] text-emerald-600 shrink-0" />
                        <span>{row.aurenis}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Bottom Call to Action inside the battlecard */}
          <div className="p-6 sm:p-8 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-sm font-black text-slate-900">
                ¿Tu colegio sufre con sistemas lentos o planillas desactualizadas?
              </div>
              <div className="text-xs text-slate-500">
                Acompañamos a tu equipo en la configuración inicial y carga de nóminas para una transición ordenada.
              </div>
            </div>

            <button
              onClick={onOpenQuoteModal}
              className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <span>Solicitar Información y Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
