"use client";

import React from "react";
import Link from "next/link";
import { AurenisLogo } from "../ui/aurenis-logo";
import { Rocket, ArrowRight, ShieldCheck } from "lucide-react";

export const LandingFooter = () => {
  return (
    <footer className="w-full bg-[#030711] text-slate-300 pt-32 pb-8 relative overflow-hidden">
      {/* Wave Curve at the top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-full pointer-events-none">
        <svg
          className="relative block w-full h-24 sm:h-32 text-[#030711]"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,120 C300,0 1140,0 1440,120 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-16">
          
          {/* Left Column: Brand & Social */}
          <div className="lg:col-span-3 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <AurenisLogo className="w-10 h-10" textClassName="text-white text-xl font-black" />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
              La solución para una gestión académica más simple, organizada y segura.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-[#1e293b]/50 hover:bg-[#1e293b] transition text-slate-400 hover:text-white"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-lg bg-[#1e293b]/50 hover:bg-[#1e293b] transition text-slate-400 hover:text-white"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="p-2 rounded-lg bg-[#1e293b]/50 hover:bg-[#1e293b] transition text-slate-400 hover:text-white"><Youtube className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-white text-sm">Producto</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white transition">Inicio</Link></li>
              <li><Link href="#" className="hover:text-white transition">Dashboard</Link></li>
              <li><Link href="#" className="hover:text-white transition">Gestión académica</Link></li>
              <li><Link href="#" className="hover:text-white transition">Funcionalidades</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-white text-sm">Recursos</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white transition">Centro de ayuda</Link></li>
              <li><Link href="#" className="hover:text-white transition">Documentación</Link></li>
              <li><Link href="#" className="hover:text-white transition">Preguntas frecuentes</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-bold text-white text-sm">Empresa</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white transition">Sobre AURENIS</Link></li>
              <li><Link href="#" className="hover:text-white transition">Contacto</Link></li>
            </ul>
          </div>

          {/* Right Column: CTA Card */}
          <div className="lg:col-span-3">
            <div className="bg-[#1e293b]/30 p-6 rounded-2xl border border-[#334155] space-y-4">
              <div className="w-10 h-10 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center">
                <Rocket className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">¿Listo para transformar tu gestión académica?</h4>
              <p className="text-xs text-slate-400">Agenda una videollamada y descubre cómo AURENIS puede ayudarte.</p>
              <Link href="/login" className="w-full justify-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold flex items-center gap-2 transition">
                Solicitar Demo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-[#334155] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 AURENIS. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2 bg-[#1e293b]/50 px-3 py-1 rounded-full text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            Plataforma de gestión académica
          </div>
        </div>
      </div>
    </footer>
  );
}
