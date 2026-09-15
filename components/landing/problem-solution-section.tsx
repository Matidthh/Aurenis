"use client";

import React, { useState } from "react";
import { XCircle, CheckCircle2, AlertOctagon, Sparkles, ArrowRight } from "lucide-react";

export function ProblemSolutionSection() {
  const [activeTab, setActiveTab] = useState<"notas" | "asistencia" | "comunicacion" | "reportes">("notas");

  const comparisonData = {
    notas: {
      problemTitle: "Planillas de cálculo dispersas y lentas",
      problemDesc: "Docentes perdiendo horas tipeando notas en archivos de Excel locales, con errores de fórmula y sin respaldo centralizado.",
      solutionTitle: "Matriz de Calificaciones de Alta Densidad",
      solutionDesc: "Carga ultrarrápida con navegación por teclado, cálculo automático de promedios según Decreto 67 y validación en tiempo real.",
    },
    asistencia: {
      problemTitle: "Libros de papel y registros en mora",
      problemDesc: "Pérdida de asistencia horaria, atrasos no notificados a apoderados y demoras crónicas en el consolidado mensual.",
      solutionTitle: "Libro de Clases Digital & Asistencia 1-Click",
      solutionDesc: "Registro biométrico o digital por hora de clase, notificación automática vía app al apoderado y cierre de actas instantáneo.",
    },
    comunicacion: {
      problemTitle: "Circulares impresas extraviadas y llamadas perdidas",
      problemDesc: "Falta de canal directo entre colegio y familia, enterándose de notas rojas o anotaciones meses tarde.",
      solutionTitle: "Canal Directo & Portal de Apoderados",
      solutionDesc: "Mensajería oficial encriptada, avisos de notas y asistencia push directo al celular del apoderado con trazabilidad de lectura.",
    },
    reportes: {
      problemTitle: "Cálculos manuales para el Mineduc y SIGE",
      problemDesc: "Semanas de trabajo administrativo estresante para preparar informes de rendimiento y actas de término de año.",
      solutionTitle: "Sincronización Ministerial Automática",
      solutionDesc: "Generación de informes estandarizados listos para la plataforma SIGE con un solo clic y cero errores humanos.",
    },
  };

  return (
    <section className="py-24 bg-[#F8F8F5] text-slate-900 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
            Problema vs Solución
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            El fin del caos administrativo en tu colegio
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">
            Descubre cómo Aurenis transforma los procesos escolares obsoletos en una experiencia digital fluida, rápida y transparente.
          </p>
        </div>

        {/* Category selector buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {[
            { id: "notas", label: "Calificaciones & Notas" },
            { id: "asistencia", label: "Asistencia & Libro de Clases" },
            { id: "comunicacion", label: "Comunicación con Familias" },
            { id: "reportes", label: "Reportes & SIGE" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition shadow-2xs ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 scale-105"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Side-by-side Comparison Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Problema / Tradicional */}
          <div className="bg-rose-50/60 border border-rose-200/80 rounded-3xl p-8 space-y-6 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/40 rounded-full blur-2xl -z-10 pointer-events-none" />
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-extrabold">
                <AlertOctagon className="w-4 h-4" />
                <span>La Realidad Tradicional (Sin Aurenis)</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {comparisonData[activeTab].problemTitle}
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                {comparisonData[activeTab].problemDesc}
              </p>
            </div>

            <div className="pt-6 border-t border-rose-200/60 flex items-center gap-3 text-rose-700 font-bold text-sm">
              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span>Pérdida de tiempo, estrés docente y opacidad con los padres</span>
            </div>
          </div>

          {/* Solución / Aurenis */}
          <div className="bg-blue-900 text-white border border-blue-800 rounded-3xl p-8 space-y-6 relative overflow-hidden shadow-2xl flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/30 rounded-full blur-3xl -z-10 pointer-events-none" />
            
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-extrabold">
                <Sparkles className="w-4 h-4 text-blue-300" />
                <span>La Solución Inteligente con AURENIS</span>
              </div>
              <h3 className="text-2xl font-black text-white">
                {comparisonData[activeTab].solutionTitle}
              </h3>
              <p className="text-blue-100/90 text-base leading-relaxed">
                {comparisonData[activeTab].solutionDesc}
              </p>
            </div>

            <div className="pt-6 border-t border-blue-800 flex items-center justify-between text-blue-200 font-bold text-sm">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                <span>Automatización, precisión y tranquilidad institucional</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
