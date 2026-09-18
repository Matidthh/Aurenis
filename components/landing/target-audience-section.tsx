"use client";

import React from "react";
import { School, Building, Network, GraduationCap, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";

export function TargetAudienceSection() {
  const audiences = [
    {
      icon: School,
      title: "Colegios Particulares & Subvencionados",
      subtitle: "Excelencia académica y cercanía familiar",
      description: "Establecimientos que buscan modernizar su gestión académica, eliminar planillas dispersas y ofrecer un portal de prestigio a los apoderados.",
      features: [
        "Planilla de calificaciones rápida Decreto 67",
        "Portal y app móvil oficial para apoderados",
        "Soporte prioritario e inducción personalizada",
      ],
      badge: "Alta Adopción",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/80",
    },
    {
      icon: Network,
      title: "Redes Educativas, Fundaciones & SLEP",
      subtitle: "Consolidación multi-colegio y gobierno de datos",
      description: "Servicios Locales de Educación Pública y corporaciones que administran múltiples RBDs y requieren supervisión unificada en tiempo real.",
      features: [
        "Cuadro de mando ejecutivo centralizado multi-RBD",
        "Alerta de deserción escolar consolidada",
        "Homologación ministerial y exportación SIGE",
      ],
      badge: "Multi-RBD",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/80",
    },
    {
      icon: GraduationCap,
      title: "Liceos Bicentenario, TP & Polivalentes",
      subtitle: "Gestión por especialidades y módulos técnicos",
      description: "Instituciones de educación media técnico-profesional que necesitan control por especialidades, módulos de taller y seguimiento de prácticas.",
      features: [
        "Asistencia horaria por talleres y laboratorios",
        "Rúbricas analíticas para evaluación de competencias",
        "Ficha vocacional y convenios de práctica",
      ],
      badge: "Técnico Profesional",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
  ];

  return (
    <section id="audiencia" className="py-20 sm:py-28 bg-[#F8F8F5] relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-14 sm:mb-18">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            Para Toda la Educación Nacional
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Diseñado para adaptarse a la realidad de tu institución
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Desde un colegio autónomo hasta redes públicas con miles de estudiantes, AURENIS escala con estabilidad garantizada.
          </p>
        </div>

        {/* 3 Columnas Especializadas */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {audiences.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-3xl p-7 sm:p-9 space-y-6 hover:border-blue-400 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <div className="text-xs font-bold text-blue-600">
                      {item.subtitle}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium pt-1">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    {item.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                  <span>Planes a medida disponibles</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
