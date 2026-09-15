"use client";

import React from "react";
import { School, Users, CheckCircle2, TrendingUp, ShieldCheck, Zap } from "lucide-react";

export function InstitutionalStats() {
  const stats = [
    {
      value: "+140",
      label: "Establecimientos en Chile",
      subtext: "Liceos Bicentenario, TP y Polivalentes",
      icon: School,
    },
    {
      value: "+65.000",
      label: "Estudiantes Matriculados",
      subtext: "Monitoreo académico en tiempo real",
      icon: Users,
    },
    {
      value: "98.4%",
      label: "Puntualidad en Asistencia",
      subtext: "Reportada en el primer bloque de clases",
      icon: TrendingUp,
    },
    {
      value: "100%",
      label: "Acreditado Circular 30",
      subtext: "Superintendencia & Mineduc",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="relative w-full bg-[#F8F8F5] text-slate-900 py-24 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
          {stats.map((st, i) => {
            const Icon = st.icon;
            return (
              <div key={i} className={`space-y-2 ${i > 0 ? "pt-6 lg:pt-0 lg:pl-8" : ""}`}>
                <div className="flex items-center gap-2 text-blue-600">
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Métrica Nacional
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900">
                  {st.value}
                </div>
                <div className="text-sm font-bold text-slate-800">
                  {st.label}
                </div>
                <div className="text-xs text-slate-500 font-medium">
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
