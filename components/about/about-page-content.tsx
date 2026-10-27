"use client";

import React from "react";
import { motion } from "motion/react";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { 
  Users, 
  ShieldCheck, 
  Server, 
  Code2, 
  Palette, 
  Lock, 
  Sparkles,
  Award,
  Terminal,
  BookOpen
} from "lucide-react";

export function AboutPageContent() {
  const teamMembers = [
    {
      name: "Maicol Recabarren",
      role: "Project Lead & Backend Architect",
      icon: Server,
      description: "Líder General del Proyecto. Responsable de la arquitectura sistémica, backend en Next.js, modelado de base de datos PostgreSQL/Prisma y seguridad crítica.",
      highlights: ["Arquitectura Multi-tenant", "Seguridad RBAC & Autenticación", "Integridad de Datos & Migraciones"],
    },
    {
      name: "Malcom Marcelo",
      role: "Frontend Developer",
      icon: Code2,
      description: "Especialista en la interfaz interactiva. Enfocado en la paridad SSR/Cliente, estados complejos y sincronización de aplicaciones React 19 de alto rendimiento.",
      highlights: ["React Hooks & Custom Hooks", "Consumo Seguro de Server Actions", "Diseño Responsive Adaptativo"],
    },
    {
      name: "Lucas P.",
      role: "UI/UX Designer & Frontend Architecture",
      icon: Palette,
      description: "Arquitecto de la interfaz y Design System. Garantiza la consistencia visual, accesibilidad WCAG y la experiencia de usuario inmersiva en todas las pantallas.",
      highlights: ["Design System & Tokens", "Accesibilidad WCAG 2.1 AA", "Arquitectura de Componentes"],
    },
    {
      name: "Frank M.",
      role: "QA, Testing & Security",
      icon: ShieldCheck,
      description: "Auditor técnico y aseguramiento de calidad. Responsable de la estrategia de testing, auditorías de seguridad OWASP y cumplimiento normativo escolar.",
      highlights: ["Pentesting & Auditoría (BOLA/IDOR)", "Compliance Ley de Protección de Datos", "Estrategia de Pruebas Automatizadas"],
    },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <LandingNavbar />

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-[#F8F8F5] -z-10" />
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto px-4 text-center"
          >
            <span className="inline-block px-3 py-1 mb-6 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full">
              Nuestro Equipo Técnico
            </span>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-8 text-slate-950">
              Arquitectura humana <br /> 
              <span className="text-blue-600">para la educación.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              AURENIS no es producto de una máquina; es la síntesis del esfuerzo técnico, pedagógico y de seguridad de cuatro profesionales dedicados a la excelencia escolar en Chile.
            </p>
          </motion.div>
        </section>

        {/* Team Grid */}
        <section className="py-24 max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24 bg-slate-950 text-white px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-8" />
            <h2 className="text-4xl font-black mb-8 tracking-tight">Cero Placeholders, 100% Funcional</h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Nuestro desarrollo se basa en la integridad técnica. No entregamos demos, entregamos software de grado productivo. Seguridad de punta a punta, aislamiento de tenants y validación estricta de datos.
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

function TeamCard({ name, role, icon: Icon, description, highlights }: any) {
  return (
    <motion.div 
      className="p-8 bg-slate-50 border border-slate-100 rounded-3xl hover:border-blue-200 transition-colors"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-600/10 text-blue-700 p-4 rounded-2xl">
          <Icon className="w-8 h-8" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-950">{name}</h3>
          <p className="text-blue-700 font-semibold">{role}</p>
        </div>
      </div>
      
      <p className="text-slate-600 mb-6 leading-relaxed">
        {description}
      </p>

      <div className="space-y-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Responsabilidades clave</p>
        {highlights.map((h: string) => (
          <div key={h} className="flex items-center gap-2 text-sm text-slate-800">
            <Award className="w-4 h-4 text-emerald-500" />
            {h}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
