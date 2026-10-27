"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { 
  Users, 
  ShieldCheck, 
  Award, 
  Terminal, 
  Check, 
  ArrowRight,
  Code2,
  Palette,
  Server,
  Lock,
  Cpu
} from "lucide-react";

export function AboutPageContent() {
  return (
    <div className="min-h-screen bg-[#F8F8F5] text-slate-900 font-sans">
      <LandingNavbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-4xl sm:text-6xl font-black text-slate-950 tracking-tighter leading-tight mb-6">
          Más que código: <br className="hidden sm:block" />
          <span className="text-blue-600">tecnología al servicio de la educación</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Somos AURENIS. Un equipo enfocado en simplificar la gestión académica en Chile, 
          creando soluciones robustas, seguras y conformes a la normativa vigente.
        </p>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-center mb-16 tracking-tight">El Equipo Técnico</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TeamMember 
              name="Maicol Recabarren" 
              role="Project Lead & Architect" 
              icon={Server}
              color="bg-blue-600"
            />
            <TeamMember 
              name="Malcom Marcelo" 
              role="Frontend Developer" 
              icon={Code2}
              color="bg-sky-500"
            />
            <TeamMember 
              name="Lucas P." 
              role="UI/UX Designer" 
              icon={Palette}
              color="bg-purple-500"
            />
            <TeamMember 
              name="Frank M." 
              role="QA & Security" 
              icon={ShieldCheck}
              color="bg-emerald-500"
            />
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <Lock className="w-12 h-12 text-blue-600 mx-auto mb-6" />
        <h2 className="text-3xl font-black mb-6">Compromiso con la Seguridad</h2>
        <p className="text-slate-600 leading-relaxed text-lg">
          En AURENIS, la seguridad no es una característica, es el cimiento. 
          Protegemos la información de estudiantes y docentes con estándares de nivel bancario, 
          cumpliendo estrictamente con la normativa MINEDUC y la protección de datos personales.
        </p>
      </section>

      <LandingFooter />
    </div>
  );
}

function TeamMember({ name, role, icon: Icon, color }: { name: string, role: string, icon: any, color: string }) {
  return (
    <div className="bg-[#F8F8F5] p-8 rounded-3xl border border-slate-200 transition-all hover:shadow-lg">
      <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-md`}>
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-sm text-slate-500 font-semibold">{role}</p>
    </div>
  );
}
