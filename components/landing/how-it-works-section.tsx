"use client";

import React from "react";
import { Building2, UserCog, Rocket, CheckCircle2 } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      icon: Building2,
      title: "Configuración Institucional",
      description: "Registramos tu colegio, sedes, niveles educativos, años escolares y asignaturas alineadas al plan de estudio nacional.",
      badge: "Paso 1",
    },
    {
      number: "02",
      icon: UserCog,
      title: "Importación de Matrícula & Roles",
      description: "Carga masiva de estudiantes, docentes y apoderados mediante plantillas Excel o sincronización directa con bases previas.",
      badge: "Paso 2",
    },
    {
      number: "03",
      icon: Rocket,
      title: "¡Operación en Marcha en Minutos!",
      description: "Profesores registran asistencia y notas, directivos monitorean reportes en tiempo real y familias acceden a su portal.",
      badge: "Paso 3",
    },
  ];

  return (
    <section className="py-24 bg-[#F8F8F5] relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-100/60 text-blue-700 border border-blue-200 shadow-2xs">
            Proceso Simple & Rápido
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            ¿Cómo funciona AURENIS en tu colegio?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Implementar nuestra plataforma es un proceso guiado de tres pasos que no interrumpe la continuidad académica de tu institución.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-6">
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-blue-600/30 group-hover:text-blue-600 transition-colors">
                      {step.number}
                    </span>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                      {step.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-slate-900 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                      {step.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Soporte técnico dedicado incluido</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
