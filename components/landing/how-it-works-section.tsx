"use client";

import React from "react";
import { Building2, UserCog, Rocket, CheckCircle2, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      timeline: "Día 1: Configuración Inicial",
      icon: Building2,
      title: "Parametrización Institucional & RBD",
      description: "Registramos tu colegio o red educativa: sedes, niveles académicos, periodos semestrales y asignaturas alineadas al marco curricular del Mineduc.",
      deliverables: [
        "Homologación de decretos y planes de estudio",
        "Configuración de ponderaciones Decreto 67",
        "Identidad visual y logotipo oficial en actas",
      ],
      tag: "Fase 1",
    },
    {
      number: "02",
      timeline: "Día 2-3: Carga y Validación",
      icon: UserCog,
      title: "Migración de Matrícula & Roles Seguros",
      description: "Carga masiva asistida de estudiantes, docentes y apoderados mediante plantillas Excel estandarizadas o integración directa con tus bases de datos.",
      deliverables: [
        "Verificación de RUN y asignación de cursos",
        "Generación automática de accesos y credenciales",
        "Aislamiento de permisos por rol (RBAC)",
      ],
      tag: "Fase 2",
    },
    {
      number: "03",
      timeline: "Día 4: Marcha Blanca & Salida",
      icon: Rocket,
      title: "Operación en Vivo & Soporte Dedicado",
      description: "Tu comunidad educativa comienza a usar el Libro Digital, pasar lista en 1 clic y publicar notas con respaldo y acompañamiento pedagógico permanente.",
      deliverables: [
        "Capacitación guiada para docentes y directivos",
        "Activación del portal de apoderados en smartphones",
        "Mesa de ayuda técnica prioritaria vía chat y WhatsApp",
      ],
      tag: "Fase 3",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 sm:py-28 bg-[#F8F8F5] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-14 sm:mb-18">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Implementación Acompañada
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Transición fluida en 3 simples pasos
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Migrar a AURENIS no interrumpe tus clases. Nuestro equipo técnico acompaña a tu institución en cada etapa con garantía de continuidad operacional.
          </p>
        </div>

        {/* 3 Steps Grid con Timeline Conectora */}
        <div className="relative">
          {/* Línea horizontal conectora (visible en desktop) */}
          <div className="hidden lg:block absolute top-28 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 -z-0" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 relative flex flex-col justify-between group"
                >
                  <div className="space-y-6">
                    {/* Badge Superior y Número Grande */}
                    <div className="flex items-center justify-between">
                      <span className="text-4xl font-black text-slate-200 group-hover:text-blue-600/30 transition-colors">
                        {step.number}
                      </span>
                      <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/70">
                        {step.timeline}
                      </span>
                    </div>

                    {/* Ícono Neumórfico Suave */}
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-7 h-7" />
                    </div>

                    {/* Título & Descripción */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                        {step.description}
                      </p>
                    </div>

                    {/* Entregables Clave */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      {step.deliverables.map((deliv, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{deliv}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
                    <span className="text-blue-600 font-extrabold">{step.tag}</span>
                    <span className="flex items-center gap-1 text-slate-400">
                      Garantía Cero Fricción
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
