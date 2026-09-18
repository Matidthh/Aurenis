"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Award, Users, BookOpen, Layers } from "lucide-react";

export function TestimonialsSocialProof() {
  const useCases = [
    {
      title: "Consolidación de Actas y Cierre Semestral",
      role: "Dirección Académica & Rectoría",
      category: "Gestión Directiva",
      description:
        "Centraliza el cálculo de promedios anuales y semestrales sin recurrir a planillas dispersas. El motor de evaluación calcula automáticamente las situaciones finales conforme al reglamento de evaluación del establecimiento.",
      impact: "Cálculo instantáneo de promedios finales",
      icon: Layers,
    },
    {
      title: "Control Curricular y Alerta de Asistencia",
      role: "Jefatura Técnica Pedagógica (UTP)",
      category: "Supervisión Técnico-Pedagógica",
      description:
        "Monitoreo continuo de cobertura curricular, leccionario digital y detección temprana de estudiantes en riesgo de inasistencia crítica para intervención oportuna antes del cierre de año.",
      impact: "Trazabilidad de asistencia y leccionario",
      icon: BookOpen,
    },
    {
      title: "Digitación Continua de Notas en Aula",
      role: "Cuerpo Docente",
      category: "Experiencia en Sala",
      description:
        "Planilla matricial optimizada para ingreso rápido mediante teclado numérico estándar. Transición fluida entre celdas y validación en tiempo real de escala de 1.0 a 7.0.",
      impact: "Ingreso ágil sin recarga de páginas",
      icon: Users,
    },
  ];

  return (
    <section id="testimonios" className="py-20 sm:py-28 bg-[#F8F8F5] text-slate-900 relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Fase de Implementación & Validación
          </span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Programa de Marcha Blanca 2026
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            Aurenis se encuentra actualmente en fase de implementación piloto con establecimientos educativos seleccionados en Chile. Si deseas postular a tu colegio para acceder a condiciones preferenciales de marcha blanca durante este semestre, contáctanos directamente.
          </p>
        </div>

        {/* 3 Use Case Cards - Structured for Educational Workflows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {useCases.map((uc, idx) => {
            const Icon = uc.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-blue-300 transition duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {uc.category}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {uc.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {uc.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-100 mt-6 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-100">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>{uc.impact}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    Perfil: <span className="text-slate-800 font-bold">{uc.role}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges Bar - Verifiable Standards */}
        <div className="mt-16 pt-10 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-5xl mx-auto">
          <div className="space-y-1.5">
            <ShieldCheck className="w-6 h-6 text-blue-600 mx-auto" />
            <div className="font-bold text-xs text-slate-900">Registro Estructurado</div>
            <div className="text-[11px] text-slate-500">Asistencia y Leccionario</div>
          </div>

          <div className="space-y-1.5">
            <Award className="w-6 h-6 text-purple-600 mx-auto" />
            <div className="font-bold text-xs text-slate-900">Cálculo Ponderado</div>
            <div className="text-[11px] text-slate-500">Evaluación Simple y Ponderada (%)</div>
          </div>

          <div className="space-y-1.5">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
            <div className="font-bold text-xs text-slate-900">Exportación de Datos</div>
            <div className="text-[11px] text-slate-500">Descarga completa en Excel y ZIP</div>
          </div>

          <div className="space-y-1.5">
            <Layers className="w-6 h-6 text-blue-600 mx-auto" />
            <div className="font-bold text-xs text-slate-900">Carga Masiva Asistida</div>
            <div className="text-[11px] text-slate-500">Importación de nóminas escolares</div>
          </div>
        </div>

      </div>
    </section>
  );
}

