"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import {
  Rocket,
  ArrowRight,
  ShieldCheck,
  Package,
  BookOpen,
  Building2,
  Mail,
  Scale,
  FileText,
  X,
  Lock,
  CheckCircle2,
  Copy,
  Check,
} from "lucide-react";

type LegalTab = "terms" | "privacy";

export function LandingFooter() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [activeLegalTab, setActiveLegalTab] = useState<LegalTab>("terms");
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Cerrar modal al presionar tecla Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setLegalModalOpen(false);
      }
    }
    if (legalModalOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [legalModalOpen]);

  function openLegalModal(tab: LegalTab) {
    setActiveLegalTab(tab);
    setLegalModalOpen(true);
  }

  function handleCopyEmail() {
    navigator.clipboard.writeText("contact@aurenis.app");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  return (
    <>
      <footer className="w-full relative bg-[#F8F8F5] overflow-hidden">
        {/* 
          Onda SVG superior fluida que hace la transición orgánica
          desde el fondo claro (#F8F8F5) hacia el fondo azul oscuro profundo (#071329).
          Se utiliza solapamiento vertical (-mb-3.5 translate-y-[2px]) para garantizar 
          cero separaciones o líneas blancas subpixel en cualquier resolución o pantalla.
        */}
        <div className="w-full overflow-hidden leading-none select-none pointer-events-none -mb-2 sm:-mb-3.5 relative z-10">
          <svg
            className="relative block w-full h-16 sm:h-24 md:h-32 lg:h-40 text-[#071329] fill-current translate-y-[2px]"
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* Capa de onda secundaria sutil */}
            <path
              d="M0,80 C320,160 520,30 840,90 C1140,150 1340,45 1440,65 L1440,210 L0,210 Z"
              fill="#0c1d38"
              opacity="0.5"
            />
            {/* Capa de onda frontal principal que se funde con el fondo */}
            <path
              d="M0,55 C260,140 480,15 800,65 C1100,115 1320,20 1440,45 L1440,210 L0,210 Z"
              fill="#071329"
            />
          </svg>
        </div>

        {/* Contenedor principal con fondo azul oscuro profundo y gradiente sutil */}
        <div className="w-full bg-gradient-to-b from-[#071329] via-[#050E20] to-[#030814] text-slate-300 pt-8 pb-12 px-6 sm:px-8 lg:px-12 relative z-0">
          <div className="max-w-7xl mx-auto">
            {/* Main Footer Grid: 12 columnas exactas para la distribución */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12 items-start">
              
              {/* Columna 1: Brand, Descripción y Canal Único de Contacto (3 cols) */}
              <div className="lg:col-span-3 space-y-4">
                <Link href="/" className="inline-flex items-center gap-3 group">
                  <AurenisLogo
                    className="w-10 h-10"
                    textClassName="text-white text-xl font-bold tracking-tight"
                  />
                </Link>
                <p className="text-slate-400 text-sm leading-relaxed max-w-[280px]">
                  La solución integral para una gestión académica más simple, organizada y segura en establecimientos educacionales de Chile.
                </p>

                {/* Canal de Contacto Oficial Exclusivo por Correo */}
                <div className="pt-2 space-y-2">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Contacto Oficial
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="mailto:contact@aurenis.app"
                      aria-label="Escribir a contact@aurenis.app"
                      className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0E1A33] border border-blue-900/50 hover:border-blue-500/70 hover:bg-blue-600/20 text-slate-200 hover:text-white transition-all duration-200 text-xs font-medium shadow-sm group"
                    >
                      <Mail className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>contact@aurenis.app</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      title="Copiar correo al portapapeles"
                      aria-label="Copiar correo al portapapeles"
                      className="p-2 rounded-xl bg-[#0E1A33] border border-blue-900/50 hover:border-blue-500/70 hover:bg-blue-600/20 text-slate-400 hover:text-white transition-all text-xs"
                    >
                      {copiedEmail ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Columna 2: Producto (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-blue-400 shrink-0" />
                  <h4 className="font-semibold text-white text-sm tracking-wide">Producto</h4>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors duration-150">
                      Inicio
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="hover:text-white transition-colors duration-150">
                      Portal y Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/#problema-solucion" className="hover:text-white transition-colors duration-150">
                      Gestión académica
                    </Link>
                  </li>
                  <li>
                    <Link href="/#capacidades" className="hover:text-white transition-colors duration-150">
                      Funcionalidades
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Columna 3: Recursos (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400 shrink-0" />
                  <h4 className="font-semibold text-white text-sm tracking-wide">Recursos</h4>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  <li>
                    <Link href="/#faq" className="hover:text-white transition-colors duration-150">
                      Centro de ayuda
                    </Link>
                  </li>
                  <li>
                    <Link href="/#faq" className="hover:text-white transition-colors duration-150">
                      Documentación
                    </Link>
                  </li>
                  <li>
                    <Link href="/#faq" className="hover:text-white transition-colors duration-150">
                      Preguntas frecuentes
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openLegalModal("privacy")}
                      className="hover:text-white transition-colors duration-150 text-left cursor-pointer"
                    >
                      Circular 482 &amp; SIGE
                    </button>
                  </li>
                </ul>
              </div>

              {/* Columna 4: Legal & Empresa (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-400 shrink-0" />
                  <h4 className="font-semibold text-white text-sm tracking-wide">Legal &amp; Empresa</h4>
                </div>
                <ul className="space-y-2.5 text-sm text-slate-400">
                  <li>
                    <Link href="/sobre-nosotros" className="hover:text-white transition-colors duration-150">
                      Sobre Nosotros
                    </Link>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openLegalModal("terms")}
                      className="hover:text-white transition-colors duration-150 text-left cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Términos y Condiciones</span>
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => openLegalModal("privacy")}
                      className="hover:text-white transition-colors duration-150 text-left cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>Política de Privacidad</span>
                    </button>
                  </li>
                  <li>
                    <a
                      href="mailto:contact@aurenis.app"
                      className="hover:text-white transition-colors duration-150"
                    >
                      Soporte y Contacto
                    </a>
                  </li>
                </ul>
              </div>

              {/* Columna 5: Tarjeta CTA Destacada (3 cols) */}
              <div className="lg:col-span-3">
                <div className="relative rounded-2xl bg-[#0B172E]/90 border border-blue-500/25 p-5 sm:p-6 shadow-xl shadow-black/30 backdrop-blur-sm space-y-4 overflow-hidden">
                  {/* Resplandor sutil ambiental */}
                  <div
                    className="absolute -top-10 -right-10 w-28 h-28 bg-blue-500/15 rounded-full blur-2xl pointer-events-none"
                    aria-hidden="true"
                  />

                  {/* Badge Cohete en gradiente azul-indigo */}
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-blue-500 to-sky-400 text-white flex items-center justify-center shadow-md shadow-blue-500/25">
                    <Rocket className="w-5 h-5" />
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-bold text-white text-sm leading-snug">
                      ¿Listo para transformar tu gestión académica?
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Coordina una videollamada y descubre cómo AURENIS optimiza la labor de tu colegio.
                    </p>
                  </div>

                  <Link
                    href="/login"
                    className="w-full justify-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-blue-600/30 transition-all duration-200 hover:shadow-blue-500/40 cursor-pointer"
                  >
                    <span>Solicitar Demo</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>

            {/* Barra Inferior: Menú legal interactivo y Derechos reservados */}
            <div className="pt-6 border-t border-[#0e2348]/70 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <p>© 2026 AURENIS. Todos los derechos reservados.</p>
                <span className="hidden sm:inline text-slate-700" aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => openLegalModal("terms")}
                  className="hover:text-slate-200 transition-colors underline-offset-2 hover:underline cursor-pointer"
                >
                  Términos y Condiciones
                </button>
                <span className="text-slate-700" aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => openLegalModal("privacy")}
                  className="hover:text-slate-200 transition-colors underline-offset-2 hover:underline cursor-pointer"
                >
                  Política de Privacidad
                </button>
              </div>

              <div className="flex items-center gap-2 text-slate-400">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Plataforma de gestión académica conforme Decreto 67.</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal / Menú Interactivo Legal (Términos & Privacidad) sin redirecciones */}
      {legalModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setLegalModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-[#09152C] border border-blue-500/30 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden text-slate-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B1A38]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="legal-modal-title" className="text-base font-bold text-white tracking-tight">
                    Marco Legal y Normativo — AURENIS
                  </h3>
                  <p className="text-xs text-slate-400">
                    Garantía institucional para establecimientos educacionales de Chile
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLegalModalOpen(false)}
                aria-label="Cerrar ventana"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas de Navegación del Menú Legal */}
            <div className="flex items-center px-6 pt-3 border-b border-slate-800/80 bg-[#09152C] gap-2">
              <button
                type="button"
                onClick={() => setActiveLegalTab("terms")}
                className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeLegalTab === "terms"
                    ? "border-blue-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Términos y Condiciones</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveLegalTab("privacy")}
                className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                  activeLegalTab === "privacy"
                    ? "border-blue-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Privacidad &amp; Circular 482</span>
              </button>
            </div>

            {/* Contenido con scroll independiente */}
            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {activeLegalTab === "terms" ? (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      1. Aceptación y Naturaleza del Servicio
                    </h4>
                    <p className="text-slate-300">
                      AURENIS es una plataforma de software como servicio (SaaS) multi-tenant diseñada para la administración académica, libro de clases digital, registro de asistencia y comunicación institucional de establecimientos educacionales de educación básica, media y técnico-profesional en la República de Chile.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      2. Cumplimiento con Decreto N° 67 y Normativa MINEDUC
                    </h4>
                    <p className="text-slate-300">
                      El módulo de calificaciones opera bajo las disposiciones del Decreto N° 67 de 2018 del Ministerio de Educación. Todos los cálculos de promedios, escalas y ponderaciones son computados de forma centralizada por el motor del servidor, impidiendo adulteraciones de fórmulas locales o inconsistencias aritméticas.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      3. Perfiles, Roles y Seguridad de Acceso (RBAC)
                    </h4>
                    <p className="text-slate-300">
                      El acceso está gobernado por una estricta jerarquía de roles (Super Admin, Directores, Profesores, Apoderados y Estudiantes). Cada cuenta es intransferible y las contraseñas se almacenan mediante algoritmos criptográficos unidireccionales (bcryptjs).
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      4. Inmutabilidad y Auditoría de Datos Escolares
                    </h4>
                    <p className="text-slate-300">
                      El sistema mantiene bitácoras de auditoría de cada registro de asistencia y calificación ingresada. Queda prohibida cualquier tentativa de modificación forzada de registros fuera del procedimiento pedagógico oficial.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                      5. Soporte y Canales Oficiales
                    </h4>
                    <p className="text-slate-300">
                      Las consultas técnicas, solicitudes de soporte y aclaraciones contractuales se canalizan exclusivamente a través de <strong className="text-white">contact@aurenis.app</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-blue-200 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed">
                      AURENIS (desarrollado por <strong>Softium Studios</strong>) cumple los lineamientos de la <strong>Circular N° 482</strong> de la Superintendencia de Educación y las exigencias de la <strong>Ley N° 19.628</strong> sobre Protección de la Vida Privada en Chile.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      1. Nuestro Compromiso
                    </h4>
                    <p className="text-slate-300">
                      Tratamos la información personal de forma responsable, transparente y limitada a finalidades autorizadas. La protección de los datos de estudiantes, docentes y apoderados forma parte indivisible del diseño arquitectónico de AURENIS.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      2. Información que Puede Tratarse
                    </h4>
                    <p className="text-slate-300">
                      Datos de identificación (nombre, identificador institucional), datos de acceso (credenciales criptográficas bcryptjs), registros académicos bajo Decreto 67 (calificaciones, asistencia) y datos técnicos de sesión estrictamente operacionales.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      3. Finalidades del Tratamiento
                    </h4>
                    <p className="text-slate-300">
                      Uso exclusivo para la gestión académica escolar contratada. Prohibición estricta de publicidad personalizada, comercialización o venta de datos de menores de edad (NNA).
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      4. Responsabilidades: Establecimiento y AURENIS / Softium Studios
                    </h4>
                    <p className="text-slate-300">
                      El colegio define las finalidades legítimas como Responsable del Tratamiento. AURENIS y el equipo técnico de Softium Studios actúan como Encargados del Tratamiento (Data Processor) bajo directrices oficiales.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      5. Acceso RBAC, Aislamiento Multi-Tenant y Seguridad
                    </h4>
                    <p className="text-slate-300">
                      Aislamiento lógico por colegio (schoolId) contra vulnerabilidades BOLA/IDOR, cifrado de comunicaciones TLS/HTTPS, control riguroso de roles y auditoría inmutable de calificaciones.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1.5 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      6. Derechos, Solicitudes y Contacto
                    </h4>
                    <p className="text-slate-300">
                      Titulares y apoderados pueden ejercer derechos de acceso y rectificación directamente a través del colegio o al correo oficial: <strong className="text-white">contact@aurenis.app</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer del Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-[#0B1A38]/90">
              <Link
                href="/privacidad"
                onClick={() => setLegalModalOpen(false)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4"
              >
                Ver texto legal completo de la política (12 puntos)
              </Link>
              <button
                type="button"
                onClick={() => setLegalModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition cursor-pointer shadow-sm"
              >
                Cerrar Menú
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default LandingFooter;
