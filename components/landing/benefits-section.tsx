"use client";

import React from "react";
import { CheckCircle2, TrendingUp, Clock, HeartHandshake, Smile, Award, Sparkles } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      metric: "15+ hrs",
      metricLabel: "Ahorro Semanal",
      icon: Clock,
      title: "Tiempo recuperado por docente",
      description: "Eliminación de planillas de cálculo dispersas, cálculo automático de promedios según Decreto 67 y pase de lista en 1 clic.",
      subtext: "Menos burocracia, más tiempo de aula",
    },
    {
      metric: "98.4%",
      metricLabel: "Familias Conectadas",
      icon: Smile,
      title: "Tranquilidad y cercanía en el hogar",
      description: "Los apoderados acceden a notas, atrasos y avisos institucionales desde su smartphone, reduciendo llamadas a secretaría.",
      subtext: "Canal oficial directo y verificado",
    },
    {
      metric: "48 hrs",
      metricLabel: "Detección Precoz",
      icon: TrendingUp,
      title: "Alerta temprana de deserción",
      description: "El motor SAT identifica alertas de inasistencia crítica (< 85%) y variaciones bruscas de notas antes del cierre semestral.",
      subtext: "Protocolos preventivos automáticos",
    },
    {
      metric: "100%",
      metricLabel: "Alineación Mineduc",
      icon: Award,
      title: "Cero inconsistencias en actas",
      description: "Generación de concentraciones de notas, reportes ministeriales e informes para la Superintendencia sin errores humanos.",
      subtext: "Validación estricta Circular 30",
    },
  ];

  return (
    <section id="beneficios" className="py-20 sm:py-28 bg-[#F8F8F5] relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-14 sm:mb-18">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Impacto Comprobado en la Comunidad
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Resultados medibles desde el primer mes
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Aurenis genera beneficios inmediatos y cuantificables para profesores, directivos, equipos de convivencia y familias.
          </p>
        </div>

        {/* 4 Cards con Métricas Destacadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 space-y-5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top bar with icon and metric */}
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                        {item.metric}
                      </div>
                      <div className="text-[10px] uppercase font-bold text-blue-600">
                        {item.metricLabel}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{item.subtext}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
