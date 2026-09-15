"use client";

import React from "react";
import { CheckCircle2, TrendingUp, Clock, HeartHandshake, Smile, Award } from "lucide-react";

export function BenefitsSection() {
  const benefits = [
    {
      icon: Clock,
      title: "Ahorro de 15+ horas semanales por docente",
      description: "Eliminación de la burocracia en papel, cálculo automático de promedios y registro instantáneo de asistencia.",
    },
    {
      icon: Smile,
      title: "Familias informadas y tranquilas",
      description: "Los apoderados acceden a notas, asistencia y avisos directamente en su celular sin necesidad de ir al colegio.",
    },
    {
      icon: TrendingUp,
      title: "Detección temprana de deserción",
      description: "El Sistema de Alerta Temprana (SAT) identifica bajas de asistencia antes de que se conviertan en fracaso escolar.",
    },
    {
      icon: Award,
      title: "Cero errores en informes ministeriales",
      description: "Sincronización impecable con los requerimientos del Mineduc y formatos exigidos por la superintendencia.",
    },
  ];

  return (
    <section className="py-24 bg-[#F8F8F5] relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200 shadow-2xs">
            Beneficios Comprobados
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            ¿Por qué los colegios eligen AURENIS?
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Resultados tangibles desde el primer mes de implementación en la comunidad educativa.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-blue-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Impacto garantizado</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
