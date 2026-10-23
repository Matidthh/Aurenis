"use client";

import React from "react";
import { Users, GraduationCap, BookOpen, BarChart } from "lucide-react";

export function InstitutionalStats() {
  const stats = [
    {
      value: "248+",
      label: "Estudiantes activos",
      icon: Users,
      tag: "Comunidad",
    },
    {
      value: "18",
      label: "Docentes registrados",
      icon: GraduationCap,
      tag: "Docencia",
    },
    {
      value: "32",
      label: "Cursos disponibles",
      icon: BookOpen,
      tag: "Académico",
    },
    {
      value: "6.7",
      label: "Promedio general",
      icon: BarChart,
      tag: "Rendimiento",
    },
  ];

  return (
    <section id="metricas" className="relative w-full bg-[#F8F8F5] text-slate-900 py-12 sm:py-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
        {/* Píldora de Título */}
        <div className="flex items-center justify-center mb-8">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Indicadores Institucionales
          </span>
        </div>

        {/* Rejilla de Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-slate-100/80 text-slate-600 border border-slate-200/60">
                      {st.tag}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                      {st.value}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-800">
                      {st.label}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

