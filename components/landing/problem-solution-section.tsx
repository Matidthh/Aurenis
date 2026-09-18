"use client";

import React, { useState } from "react";
import { XCircle, CheckCircle2, AlertOctagon, Sparkles, Clock, ShieldCheck, ArrowRight, TrendingUp } from "lucide-react";

export function ProblemSolutionSection() {
  const [activeTab, setActiveTab] = useState<"notas" | "asistencia" | "comunicacion" | "reportes">("notas");

  const comparisonData = {
    notas: {
      problemTitle: "Planillas de cálculo dispersas, fórmulas rotas y estrés",
      problemDesc: "Docentes perdiendo fines de semana ingresando notas en archivos Excel no sincronizados, con riesgo de alteración no autorizada y cálculo manual propenso a errores.",
      problemPoints: [
        "Fórmulas modificables accidentalmente",
        "Sin respaldo ministerial centralizado",
        "Retraso de semanas en entrega de informes",
      ],
      solutionTitle: "Matriz Matricial de Alta Densidad con Decreto 67",
      solutionDesc: "Carga ultrarrápida con atajos de teclado numérico (ej: 65 = 6.5), semaforización cromática automática, cálculo de promedios ponderados y validación en tiempo real.",
      solutionPoints: [
        "Navegación fluida por flechas y teclado numérico",
        "Auditoría inmutable de cada cambio por docente",
        "Actas listas para firma electrónica y SIGE",
      ],
      metricOld: "4.5 hrs / semana",
      metricNew: "15 seg / clase",
    },
    asistencia: {
      problemTitle: "Libros de papel, registros tardíos y atrasos no informados",
      problemDesc: "Toma de asistencia en papel que se traspasa días después, sin trazabilidad por bloque horario y dejando a apoderados desinformados ante ausencias críticas.",
      problemPoints: [
        "Libro físico propenso a extravío o daño",
        "Atrasos no informados a la familia el mismo día",
        "Cálculo manual del porcentaje de subvención",
      ],
      solutionTitle: "Libro Digital Oficial con Asistencia en 1 Clic",
      solutionDesc: "Pase de lista instantáneo por bloque horario según Circular 30 de la Superintendencia, notificación automática al apoderado y consolidación en vivo.",
      solutionPoints: [
        "Conforme a Circular N° 30 Superintendencia",
        "Alerta de Inasistencia Crítica proactiva",
        "Cierre y registro de firmas trazables",
      ],
      metricOld: "Descuadre crónico",
      metricNew: "100% en tiempo real",
    },
    comunicacion: {
      problemTitle: "Circulares impresas extraviadas y llamadas telefónicas en mora",
      problemDesc: "Comunicación fragmentada por cuadernos de comunicaciones, circulares que nunca llegan a destino y familias enterándose de notas rojas al final del semestre.",
      problemPoints: [
        "Papelería costosa y con bajo retorno de lectura",
        "Falta de canal oficial institucional seguro",
        "Citaciones a apoderados no confirmadas",
      ],
      solutionTitle: "Portal Móvil para Apoderados & Notificaciones Push",
      solutionDesc: "Canal oficial directo y encriptado donde las familias consultan notas, asistencia del día, citaciones y observaciones con trazabilidad de lectura confirmada.",
      solutionPoints: [
        "Acceso seguro con RUN y clave institucional",
        "Historial completo de observaciones positivas y de mejora",
        "Trazabilidad de confirmación de lectura en línea",
      ],
      metricOld: "30% tasa de lectura",
      metricNew: "98% familias conectadas",
    },
    reportes: {
      problemTitle: "Cálculos manuales angustiantes para SIGE y Superintendencia",
      problemDesc: "Equipos directivos y secretaría académica colapsados en periodos de cierre de actas, compilando datos heterogéneos bajo riesgo de multas ministeriales.",
      problemPoints: [
        "Días enteros cuadrando actas semestrales",
        "Duplicación de trabajo al cargar a plataformas Mineduc",
        "Riesgo de sanciones por inconsistencias",
      ],
      solutionTitle: "Sincronización Ministerial & Reportes en 1 Clic",
      solutionDesc: "Generación automática de concentraciones de notas, certificados de alumno regular y exportaciones estructuradas compatibles con SIGE.",
      solutionPoints: [
        "Formatos estandarizados validados",
        "Exportación masiva a Excel y PDF con sello institucional",
        "Dashboard ejecutivo para directores y sostenedores",
      ],
      metricOld: "Semanas de cierre",
      metricNew: "1 Clic automático",
    },
  };

  const current = comparisonData[activeTab];

  return (
    <section id="problema-solucion" className="py-20 sm:py-24 bg-[#F8F8F5] text-slate-900 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        {/* Encabezado Superior */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Problema vs Solución
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            El fin de la fricción administrativa escolar
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Compara cómo cambia la rutina diaria de tu colegio al sustituir libros físicos y planillas aisladas por la arquitectura integral de AURENIS.
          </p>
        </div>

        {/* Selector de Categorías (Pills con acabado táctil) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-10 sm:mb-14">
          {[
            { id: "notas", label: "Calificaciones & Decreto 67" },
            { id: "asistencia", label: "Libro Digital & Asistencia" },
            { id: "comunicacion", label: "Familias & Portal Apoderados" },
            { id: "reportes", label: "Reportes & Sincronización SIGE" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20 scale-[1.02]"
                    : "neumo-button text-slate-700 hover:text-blue-600 hover:scale-[1.01]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tarjetas de Comparación Lado a Lado */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* LADO A: El Enfoque Tradicional */}
          <div className="bg-white/90 rounded-3xl p-7 sm:p-9 border border-rose-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                  <span>Método Tradicional / Fragmentado</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Impacto</div>
                  <div className="text-xs font-bold text-rose-600">{current.metricOld}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                  {current.problemTitle}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {current.problemDesc}
                </p>
              </div>

              {/* Lista de Fricciones */}
              <div className="space-y-2.5 pt-2">
                {current.problemPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-700">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-rose-100 flex items-center gap-2.5 text-xs font-bold text-rose-700">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Causa principal de fuga horaria y reprocesos administrativos</span>
            </div>
          </div>

          {/* LADO B: La Solución AURENIS */}
          <div className="bg-slate-900 text-white rounded-3xl p-7 sm:p-9 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between">
            {/* Soft Ambient Light inside card */}
            <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -z-0" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Con Plataforma AURENIS</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Rendimiento</div>
                  <div className="text-xs font-bold text-emerald-400">{current.metricNew}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {current.solutionTitle}
                </h3>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {current.solutionDesc}
                </p>
              </div>

              {/* Lista de Ventajas */}
              <div className="space-y-2.5 pt-2">
                {current.solutionPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm font-medium text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Alineado a Circular 30 y Decreto 67</span>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
                100% Conforme
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
