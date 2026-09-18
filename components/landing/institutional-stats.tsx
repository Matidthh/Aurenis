"use client";

import React from "react";
import { Zap, ShieldCheck, Award, Lock } from "lucide-react";

export function InstitutionalStats() {
  const stats = [
    {
      value: "0.1s",
      label: "Respuesta en Digitación",
      subtext: "Ingreso de calificaciones y asistencia sin latencia",
      icon: Zap,
      tag: "Rendimiento",
    },
    {
      value: "100%",
      label: "Alineación Circular N° 30",
      subtext: "Registro estandarizado según directrices SuperEduc",
      icon: ShieldCheck,
      tag: "Normativa",
    },
    {
      value: "Dual",
      label: "Motor Decreto 67",
      subtext: "Cálculo en modo Simple o Ponderado por porcentaje",
      icon: Award,
      tag: "Evaluación",
    },
    {
      value: "RBAC",
      label: "Control de Acceso y Datos",
      subtext: "PostgreSQL, sesiones JWT y permisos por rol",
      icon: Lock,
      tag: "Seguridad",
    },
  ];

  return (
    <section id="metricas" className="relative w-full bg-[#F8F8F5] text-slate-900 py-16 sm:py-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        
        {/* Subtitle pill */}
        <div className="flex items-center justify-center mb-10">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Capacidades Técnicas y Normativas Verificables
          </span>
        </div>

        {/* 4 Elevated Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-blue-400 transition-all duration-300 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 border border-slate-200/80">
                      {st.tag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                      {st.value}
                    </div>
                    <div className="text-sm font-black text-slate-900">
                      {st.label}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 font-medium">
                  {st.subtext}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
