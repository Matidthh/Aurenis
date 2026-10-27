"use client";

import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { 
  Users, 
  ShieldCheck, 
  Server, 
  Code2, 
  Palette, 
  Lock, 
  Sparkles 
} from "lucide-react";

export function AboutPageContent() {
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
              Nuestra Historia
            </span>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-8">
              Innovación educativa <br /> 
              <span className="text-blue-600">desde el aula.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              AURENIS nace de la necesidad de transformar el caos administrativo escolar 
              en claridad pedagógica. Somos desarrolladores, pero ante todo, 
              somos aliados de la educación chilena.
            </p>
          </motion.div>
        </section>

        {/* Team Grid */}
        <section className="py-24 max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-black text-center mb-16 tracking-tight">El Corazón de AURENIS</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <TeamCard name="Maicol Recabarren" role="Project Lead & Architect" icon={Server} color="blue" />
            <TeamCard name="Malcom Marcelo" role="Frontend Developer" icon={Code2} color="sky" />
            <TeamCard name="Lucas P." role="UI/UX Designer" icon={Palette} color="purple" />
            <TeamCard name="Frank M." role="QA & Security" icon={ShieldCheck} color="emerald" />
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-24 bg-slate-950 text-white px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-8" />
            <h2 className="text-4xl font-black mb-8 tracking-tight">Privacidad Innegociable</h2>
            <p className="text-xl text-slate-400 leading-relaxed">
              Desarrollamos bajo estrictos estándares de seguridad. Cada byte de información 
              escolar está cifrado y aislado, garantizando que el foco permanezca donde 
              siempre debe estar: en la enseñanza.
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

function TeamCard({ name, role, icon: Icon, color }: { name: string, role: string, icon: any, color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-600",
    sky: "bg-sky-500",
    purple: "bg-purple-500",
    emerald: "bg-emerald-500"
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-shadow"
    >
      <div className={`${colors[color]} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-1">{name}</h3>
      <p className="text-sm text-slate-500 font-semibold">{role}</p>
    </motion.div>
  );
}
