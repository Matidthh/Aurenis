"use client";

import React from "react";
import { ShieldCheck, Lock, KeyRound, Server, FileCheck2, CheckCircle2, Shield } from "lucide-react";

export function SecuritySection() {
  const securityItems = [
    {
      icon: Lock,
      title: "Sesiones JWT Criptográficas & Hashing",
      badge: "Autenticación Segura",
      description: "Tokens firmados con jose (algoritmo HS256/RS256) y almacenamiento seguro de contraseñas mediante hashing criptográfico bcrypt.",
      spec: "Cookies HTTP-Only & SameSite",
    },
    {
      icon: KeyRound,
      title: "Control de Acceso Basado en Roles (RBAC)",
      badge: "Aislamiento por Rol",
      description: "Segmentación estricta de permisos. Directores, Jefes UTP, Docentes y Estudiantes acceden exclusivamente a las vistas y acciones autorizadas.",
      spec: "Principio de menor privilegio",
    },
    {
      icon: Server,
      title: "Base de Datos Relacional PostgreSQL",
      badge: "Integridad Estricta",
      description: "Esquema estructurado con Prisma ORM, transacciones atómicas y restricciones de clave foránea que previenen inconsistencias o pérdida de datos.",
      spec: "Multi-tenant por establecimiento",
    },
    {
      icon: FileCheck2,
      title: "Validación de Esquema & Trazabilidad",
      badge: "Validación Zod",
      description: "Validación exhaustiva de tipos en cada endpoint API con Zod y registro de auditoría en cambios críticos de calificaciones y asistencia.",
      spec: "Estructurado para auditoría escolar",
    },
  ];

  const complianceBadges = [
    "Diseñado bajo Principios de Confidencialidad",
    "Estructurado para Registro Escolar y Asistencia",
    "Cálculo Automático según Ponderaciones (%)",
    "Protección de Sesiones y Control de Acceso RBAC",
  ];

  return (
    <section id="seguridad" className="py-20 sm:py-28 bg-[#F8F8F5] text-slate-900 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4 mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Seguridad & Arquitectura Técnica
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Seguridad y resguardo de la información escolar
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            La información académica y de asistencia está resguardada mediante una arquitectura moderna, modular y con control de acceso estricto.
          </p>
        </div>

        {/* Badges de Normativa Vigente */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 mb-12 sm:mb-16">
          {complianceBadges.map((badge, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 text-xs font-bold text-slate-700 shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{badge}</span>
            </div>
          ))}
        </div>

        {/* 4 Cards de Seguridad */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                      {item.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-slate-500">
                  <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{item.spec}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

