"use client";

import React from "react";
import Link from "next/link";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import { Heart, Mail, MapPin } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 pt-32 pb-12 border-t border-slate-900">
      {/* SVG Curve - Pronounced "U" shape downward */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-0 -translate-y-full">
        <svg className="relative block w-full h-32" viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,0 C300,150 1140,150 1440,0 L1440,120 L0,120 Z" className="fill-slate-950" />
        </svg>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-slate-900">
          {/* Columna 1: Marca y Misión */}
          <div className="space-y-6">
            <Link href="/" className="inline-block hover:opacity-90 transition">
              <AurenisLogo className="w-14 h-14" textClassName="text-white text-2xl font-black tracking-tight" />
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              AURENIS es la solución líder para la gestión escolar en Chile. 
              Modernizamos la administración pedagógica con tecnología de alta velocidad.
            </p>
            <div className="flex gap-4">
               <a href="mailto:contacto@aurenis.app" className="hover:text-white transition"><Mail className="w-5 h-5" /></a>
               <a href="#" className="hover:text-white transition"><MapPin className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Columna 2: Plataforma */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Plataforma</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/select-school" className="hover:text-white transition">Libro de Clases Digital</Link></li>
              <li><Link href="/select-school" className="hover:text-white transition">Asistencia</Link></li>
              <li><Link href="/select-school" className="hover:text-white transition">Gestión de Notas</Link></li>
              <li><Link href="/select-school" className="hover:text-white transition">Reportes SAT</Link></li>
            </ul>
          </div>

          {/* Columna 3: Compañía */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Compañía</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/login" className="hover:text-white transition">Soporte Técnico</Link></li>
              <li><Link href="/login" className="hover:text-white transition">Portal de Ayuda</Link></li>
              <li><Link href="/privacidad" className="hover:text-white transition">Política de Privacidad</Link></li>
              <li><Link href="/terminos" className="hover:text-white transition">Términos de Servicio</Link></li>
            </ul>
          </div>

          {/* Columna 4: Suscripción / Acción */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Comunidad</h4>
            <p className="text-sm">¿Interesado en modernizar tu colegio?</p>
            <Link href="/login" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg text-sm transition">
              Solicitar Demostración
            </Link>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-500">
          <p>© 2026 AURENIS. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-red-500 fill-red-500" /> en Chile.
          </p>
        </div>
      </div>
    </footer>
  );
}
