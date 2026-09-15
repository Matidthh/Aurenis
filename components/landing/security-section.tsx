"use client";

import React from "react";
import { ShieldCheck, Lock, KeyRound, Server, FileCheck2, UserCheck } from "lucide-react";

export function SecuritySection() {
  const securityItems = [
    {
      icon: Lock,
      title: "Cifrado de Extremo a Extremo",
      description: "Todos los datos sensibles (notas, fichas médicas, antecedentes) están cifrados en tránsito y en reposo mediante protocolos TLS 1.3 y AES-256.",
    },
    {
      icon: KeyRound,
      title: "Control de Acceso Basado en Roles (RBAC)",
      description: "Permisos granulares estrictos. Los estudiantes solo ven sus calificaciones, los docentes su curso y los directivos toda la red escolar.",
    },
    {
      icon: Server,
      title: "Respaldos Automáticos Diarios",
      description: "Copias de seguridad cifradas con retención histórica y recuperación ante desastres en servidores redundantes de alta disponibilidad.",
    },
    {
      icon: FileCheck2,
      title: "Trazabilidad & Auditoría Inmutable",
      description: "Cada modificación de calificación o asistencia genera un registro de auditoría con fecha, hora y usuario responsable.",
    },
  ];

  return (
    <section className="py-24 bg-[#F8F8F5] text-slate-900 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 shadow-2xs">
            Seguridad & Privacidad de Grado Bancario
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Tus datos institucionales protegidos sin concesiones
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-medium">
            Cumplimos con los más altos estándares de ciberseguridad y protección de datos personales de menores de edad y normativas vigentes.
          </p>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-4 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
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
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Certificado y auditado</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
