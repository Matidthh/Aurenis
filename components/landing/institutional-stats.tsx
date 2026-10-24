"use client";

import React from "react";
import { Zap, FileCheck, Scale, ShieldCheck } from "lucide-react";

export function InstitutionalStats() {
  const stats = [
    {
      tag: "Rendimiento",
      value: "0.1s",
      title: "Respuesta en Digitación",
      description: "Ingreso de calificaciones y asistencia sin latencia.",
      icon: Zap,
      color: "blue",
    },
    {
      tag: "Normativa",
      value: "100%",
      title: "Alineación Circular N° 30",
      description: "Registro estandarizado según directrices SuperEduc.",
      icon: FileCheck,
      color: "emerald",
    },
    {
      tag: "Evaluación",
      value: "Dual",
      title: "Motor Decreto 67",
      description: "Cálculo en modo Simple o Ponderado por porcentaje.",
      icon: Scale,
      color: "indigo",
    },
    {
      tag: "Seguridad",
      value: "RBAC",
      title: "Control de Acceso y Datos",
      description: "PostgreSQL, sesiones JWT y permisos por rol.",
      icon: ShieldCheck,
      color: "purple",
    },
  ];

  return (
    <section id="metricas" className="relative w-full bg-[#F8F8F5] text-slate-900 py-12 sm:py-16 overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
        
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
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100/90 text-slate-700 border border-slate-200/80">
                      {st.tag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                      {st.value}
                    </div>
                    <div className="text-sm font-bold text-slate-800">
                      {st.title}
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pt-0.5">
                      {st.description}
                    </p>
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

