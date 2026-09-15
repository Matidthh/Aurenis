"use client";

import React from "react";
import { School, Building, Network, GraduationCap, Check } from "lucide-react";

export function TargetAudienceSection() {
  const audiences = [
    {
      icon: School,
      title: "Colegios Particulares & Subvencionados",
      description: "Establecimientos que buscan modernizar su gestión académica, ofrecer una plataforma de prestigio a las familias y optimizar el trabajo docente.",
      badge: "Alta Demanda",
    },
    {
      icon: Network,
      title: "Redes Educacionales & SLEP",
      description: "Corporaciones municipales y servicios locales que administran múltiples colegios y requieren consolidación de datos y reportes centralizados.",
      badge: "Multi-Sede",
    },
    {
      icon: GraduationCap,
      title: "Institutos & Centros de Formación",
      description: "Instituciones de educación superior técnica y profesional que necesitan control de asistencia por asignatura, actas y portales de alumnos.",
      badge: "Flexible",
    },
  ];

  return (
    <section className="py-24 bg-[#F8F8F5] relative">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
            Instituciones Protagonistas
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            ¿Para quién es AURENIS?
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">
            Nuestra plataforma escala perfectamente desde un colegio unipersonal hasta redes educativas con miles de estudiantes.
          </p>
        </div>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {audiences.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/85 rounded-3xl p-8 space-y-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-16 h-16 rounded-2xl bg-white text-blue-600 flex items-center justify-center shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-100/60 text-blue-700">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Adaptado a la normativa vigente</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
