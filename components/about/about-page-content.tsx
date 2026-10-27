"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import {
  Shield,
  Code2,
  Palette,
  CheckCircle,
  FileText,
  Download,
  ExternalLink,
  Award,
  GraduationCap,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
  Lock,
  Users,
  Building,
  Check,
  Mail,
  ArrowRight,
  BookOpen,
  X,
  Server,
  Database,
  Globe,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

export function AboutPageContent() {
  const [selectedMember, setSelectedMember] = useState<string | null>("maicol");
  const [isCvModalOpen, setIsCvModalOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const cvPdfUrl = "/assets/aistudio/Maicol_Recabarren_CV_9e390711.pdf";

  function handleCopyEmail() {
    navigator.clipboard.writeText("contact@aurenis.app");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#F8F8F5] text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Header con Navbar Global */}
      <LandingNavbar />

      {/* 2. Hero Section: Identidad, Misión y Origen Técnico Chileno */}
      <section className="pt-28 pb-16 sm:pt-36 sm:pb-20 bg-gradient-to-b from-white via-[#F8F8F5] to-[#F1F3F9] border-b border-slate-200/70 relative overflow-hidden">
        {/* Glow de fondo */}
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-blue-400/15 via-indigo-400/10 to-sky-300/15 blur-3xl pointer-events-none rounded-full"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
            <Link href="/" className="hover:text-blue-600 transition">
              Inicio
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">Sobre Nosotros</span>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Equipo Técnico &amp; Fundadores de AURENIS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-5">
              Construyendo el nuevo estándar para la educación chilena.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8">
              Somos un equipo de cuatro desarrolladores formados en la educación técnico-profesional chilena
              (Liceo Politécnico Marga Marga, Quilpué). Creamos <strong className="text-slate-900 font-bold">AURENIS</strong> con un propósito claro: desterrar la burocracia, la lentitud y el software anticuado de las salas de clases, entregando una plataforma moderna, 100% conforme a Decreto 67 y protegida bajo Circular 482.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#equipo"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition hover:shadow-md flex items-center gap-2"
              >
                <span>Conocer al Equipo</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                type="button"
                onClick={() => setIsCvModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 text-slate-700 font-semibold text-sm transition shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Ver CV de Maicol Recabarren</span>
              </button>
            </div>
          </div>

          {/* Métricas / Principios Clave */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-200/80">
            <div className="p-4 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-blue-600">4</div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1">Especialistas</div>
              <div className="text-xs text-slate-500 mt-0.5">Roles delimitados y sinérgicos</div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">Decreto 67</div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1">Cumplimiento MINEDUC</div>
              <div className="text-xs text-slate-500 mt-0.5">Evaluación formativa y promedios reales</div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-slate-900">Circular 482</div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1">Protección de Datos NNA</div>
              <div className="text-xs text-slate-500 mt-0.5">Seguridad y no comercialización</div>
            </div>

            <div className="p-4 rounded-xl bg-white/80 border border-slate-200/70 shadow-2xs">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600">0% Mocks</div>
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mt-1">Ingeniería Real</div>
              <div className="text-xs text-slate-500 mt-0.5">Persistencia y aislamiento multi-tenant</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Sección: Nuestra Historia y Filosofía Institucional */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                <GraduationCap className="w-4 h-4" />
                <span>Origen &amp; Visión</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Nacidos en el aula, diseñados para la realidad de los colegios chilenos.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Durante años hemos sido testigos directos del agotamiento docente: profesores llenando planillas duplicadas, libros digitales inestables con caídas a fin de semestre y sistemas con tarifas abusivas que no responden a las necesidades pedagógicas de Chile.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                AURENIS fue concebido desde el <strong className="text-slate-900 font-semibold">Liceo Politécnico Marga Marga</strong> con una meta inquebrantable: dotar a directores, profesores y familias de una plataforma robusta, veloz y confiable, sin trampas de diseño ni intermediarios burocráticos.
              </p>
              
              <div className="pt-2">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/80 text-blue-900 text-xs sm:text-sm">
                  <p className="font-semibold mb-1 flex items-center gap-1.5 text-blue-700">
                    <Shield className="w-4 h-4" /> Compromiso Inviolable de Privacidad
                  </p>
                  <p className="text-blue-800/90 leading-relaxed">
                    La información de niños, niñas y adolescentes (NNA) pertenece única y exclusivamente al establecimiento escolar. No vendemos datos, no incrustamos publicidad ni comerciamos con historiales académicos.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-slate-200 hover:border-blue-400 transition shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                  <Server className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Aislamiento Multi-Tenant</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Defensa integral contra vulnerabilidades BOLA e IDOR. Cada colegio opera en su propio espacio lógico verificado rigurosamente en servidor.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-slate-200 hover:border-blue-400 transition shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Ergonomía &amp; Accesibilidad</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Design System consistente bajo estándares WCAG 2.1 AA. Contraste óptimo, navegación por teclado y cero saltos visuales en pantalla.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-slate-200 hover:border-blue-400 transition shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Foco Pedagógico Real</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Libro de clases digital, asistencia en un clic y registro ágil de calificaciones. Menos tiempo de digitación, más tiempo para enseñar.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-slate-200 hover:border-blue-400 transition shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-4 shadow-sm">
                  <Lock className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">Auditoría &amp; Inmutabilidad</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Trazabilidad criptográfica de cada calificación y asistencia ingresada para auditorías de la Superintendencia de Educación.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Sección: El Equipo de Desarrollo (4 Integrantes con Fichas de Alta Fidelidad) */}
      <section id="equipo" className="py-16 sm:py-24 bg-[#F8F8F5] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">
              <Users className="w-4 h-4" />
              <span>Equipo Multidisciplinario</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Los 4 Desarrolladores de AURENIS
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-3">
              Cada integrante lidera un frente técnico crítico para garantizar que AURENIS sea una solución de nivel empresarial, estable y segura.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* INTEGRANTE 1: Maicol Recabarren (Lead del Proyecto, Arquitectura & Backend) */}
            <div className="rounded-3xl bg-white border-2 border-blue-500/40 p-6 sm:p-8 shadow-md relative overflow-hidden flex flex-col justify-between hover:border-blue-600 transition duration-200">
              {/* Badge Destacado */}
              <div className="absolute top-5 right-5">
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-black uppercase tracking-wider border border-blue-200 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-blue-600" />
                  Project Lead &amp; Architect
                </span>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-500/20">
                    MR
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Maicol Matías Recabarren Cerda
                    </h3>
                    <p className="text-sm font-semibold text-blue-600">
                      Project Lead · Arquitectura de Sistemas &amp; Backend
                    </p>
                    <p className="text-xs text-slate-500">
                      Founder de Softium Studios · Liceo Politécnico Marga Marga
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Líder general y arquitecto del sistema AURENIS. Responsable de la coherencia de software, modelado de base de datos relacional PostgreSQL con Prisma, middleware de autenticación por cookies seguras, validación estricta de esquemas Zod en API Routes y aislamiento estricto multi-tenant para impedir ataques BOLA/IDOR.
                </p>

                {/* Hitos & Certificaciones Oficiales del CV */}
                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Certificaciones &amp; Formación Oficial</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Microsoft × freeCodeCamp:</strong> Certificado Fundacional C#.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>IBM:</strong> Fundamentos de Ciberseguridad.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Microsoft &amp; Founderz:</strong> Master AI with Responsible Prompting.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong>Softium Technician Suite (STS):</strong> Creador de suite de escritorio en Rust y Tauri v2.</span>
                    </li>
                  </ul>
                </div>

                {/* Tags de Tecnologías */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Rust", "Docker", "Linux", "OWASP"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-[11px] font-semibold border border-blue-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Botones de Acción para el CV de Maicol */}
              <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
                <a
                  href={cvPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver CV Oficial (PDF)</span>
                </a>

                <a
                  href={cvPdfUrl}
                  download="Maicol_Recabarren_CV.pdf"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar CV</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsCvModalOpen(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline underline-offset-4 cursor-pointer ml-auto"
                >
                  Detalles Completos
                </button>
              </div>
            </div>

            {/* INTEGRANTE 2: Malcom Marcelo (Frontend & Lógica de Cliente) */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-sky-300 transition duration-200">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-sky-500/20">
                    MM
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Malcom Marcelo
                    </h3>
                    <p className="text-sm font-semibold text-sky-600">
                      Frontend Developer &amp; Lógica de Cliente
                    </p>
                    <p className="text-xs text-slate-500">
                      Arquitecto de componentes interactivos y estados reactivos.
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Malcom lidera la experiencia interactiva de AURENIS. Su enfoque se centra en crear interfaces de usuario fluidas, formularios con validación robusta y una gestión de estado del cliente eficiente que minimiza la latencia percibida. Se asegura de que la paridad entre el renderizado del servidor y el cliente sea impecable, eliminando errores de hidratación y garantizando una experiencia de usuario consistente en cualquier dispositivo.
                </p>

                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-sky-600" />
                    <span>Áreas Críticas de Frontend</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Implementación de formularios complejos con validación Zod en tiempo real.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Optimización del consumo de APIs y Server Actions.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Patrones avanzados de React (Composition, Custom Hooks).</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {["React 19", "Next.js", "TypeScript", "Tailwind CSS", "Zod", "App Router"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-[11px] font-semibold border border-sky-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Especialidad: Reactividad &amp; Interacción</span>
                <span className="font-semibold text-slate-700">AURENIS Client Engine</span>
              </div>
            </div>

            {/* INTEGRANTE 3: Lucas P. (UI/UX Designer & Design System) */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-purple-300 transition duration-200">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-purple-500/20">
                    LP
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Lucas P.
                    </h3>
                    <p className="text-sm font-semibold text-purple-600">
                      UI / UX Designer &amp; Design System Lead
                    </p>
                    <p className="text-xs text-slate-500">
                      Arquitecto de interfaces y fidelidad visual.
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Lucas es el responsable de que AURENIS no solo funcione, sino que sea un placer de usar. Diseñó nuestro sistema de diseño desde cero: una paleta de colores profesional, tipografía jerárquica y componentes reutilizables. Su enfoque obsesivo por los estándares WCAG 2.1 AA asegura que AURENIS sea accesible para todos los docentes, sin sacrificar elegancia ni modernidad visual.
                </p>

                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-purple-600" />
                    <span>Áreas Críticas de Diseño &amp; UX</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Desarrollo de Design System (Tokens, Tipografía, Espaciado).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Cumplimiento riguroso de accesibilidad (WCAG 2.1 AA).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Animaciones sutiles y micro-interacciones (Framer Motion).</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {["Design System", "WCAG 2.1", "Tailwind CSS", "Motion", "Figma", "UI/UX"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-semibold border border-purple-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Especialidad: Estética &amp; Accesibilidad</span>
                <span className="font-semibold text-slate-700">AURENIS Design System</span>
              </div>
            </div>

            {/* INTEGRANTE 4: Frank M. (QA, Testing & Seguridad) */}
            <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col justify-between hover:border-emerald-300 transition duration-200">
              <div>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-emerald-500/20">
                    FM
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Frank M.
                    </h3>
                    <p className="text-sm font-semibold text-emerald-600">
                      QA Lead, Testing Automatizado &amp; Ciberseguridad
                    </p>
                    <p className="text-xs text-slate-500">
                      Auditor de seguridad y guardián de calidad.
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                  Frank es el filtro final de calidad. Diseña y ejecuta una suite completa de pruebas automatizadas (unitarias, integración, E2E), garantizando que no se introduzcan regresiones. Su enfoque es la ciberseguridad defensiva: realiza pruebas de penetración internas (pentesting) basándose en el estándar OWASP para prevenir ataques como IDOR o BOLA, garantizando la inmutabilidad de los datos académicos.
                </p>

                <div className="space-y-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Áreas Críticas de QA &amp; Seguridad</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Estrategia de testing automatizado (Unit, Int, E2E).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Auditoría de seguridad (OWASP Top 10, IDOR, BOLA).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Gestión de matrices de riesgo (STRIDE, CVSS).</span>
                    </li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-6">
                  {["QA Automation", "OWASP", "STRIDE", "Pentesting", "TypeScript", "Jest/Vitest"].map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Especialidad: Calidad &amp; Defensa</span>
                <span className="font-semibold text-slate-700">AURENIS Defense</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Sección: Compromiso Institucional con la Educación Chilena */}
      <section className="py-16 bg-white border-y border-slate-200/70">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
            <Building className="w-4 h-4 text-blue-600" />
            <span>Compromiso de País</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tecnología creada en Chile, para los colegios de Chile.
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-3xl mx-auto">
            AURENIS no es una adaptación de software extranjero ni una solución genérica de oficina. Cada cálculo de promedio responde al <strong className="text-slate-900 font-semibold">Decreto N° 67 de Evaluación</strong>, cada registro de asistencia protege la subvención escolar y cada política de datos se ciñe a la <strong className="text-slate-900 font-semibold">Circular N° 482</strong> de la Superintendencia de Educación.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition hover:shadow-lg flex items-center gap-2"
            >
              <span>Ingresar al Portal Institucional</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="mailto:contact@aurenis.app"
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-blue-600" />
              <span>Contactar al Equipo: contact@aurenis.app</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. Footer Unificado */}
      <LandingFooter />

      {/* Modal / Visor de Ficha y CV de Maicol Recabarren */}
      {isCvModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsCvModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl bg-white border border-slate-300 rounded-3xl shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-[#0A1933] text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  MR
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">
                    Maicol Matías Recabarren Cerda
                  </h3>
                  <p className="text-xs text-blue-300">
                    Estudiante Técnico en Programación · Founder de Softium Studios · Project Lead
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCvModalOpen(false)}
                aria-label="Cerrar modal"
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-700">
              
              {/* Resumen */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4" />
                  Perfil Profesional
                </h4>
                <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  Estudiante de 4° medio Técnico en Programación (Liceo Politécnico Marga Marga, Quilpué, Chile), con aproximadamente 4 años de experiencia práctica en desarrollo de software adquirida mediante proyectos reales, aprendizaje autónomo y formación técnica especializada. Founder &amp; Lead Developer de Softium Studios.
                </p>
              </div>

              {/* Experiencia Destacada */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4" />
                  Experiencia &amp; Proyectos Clave
                </h4>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 text-sm">Founder &amp; Lead Developer / Arquitecto de Sistemas</span>
                      <span className="text-xs font-semibold text-blue-600">Softium Studios (2026 - Actualidad)</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Diseño de arquitecturas de software escalables, desarrollo Full Stack con React, TypeScript, Next.js, PostgreSQL y Docker. Implementación de paneles administrativos y APIs seguras.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 text-sm">Softium Technician Suite (STS)</span>
                      <span className="text-xs font-semibold text-blue-600">Proyecto Activo</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Aplicación de escritorio para gestión de herramientas técnicas construida con Rust, Tauri v2, React, TypeScript y SQLite.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900 text-sm">Arquitectura &amp; Ciberseguridad en Comunidades</span>
                      <span className="text-xs font-semibold text-blue-600">Escala: 1.300 a 2.000+ usuarios</span>
                    </div>
                    <p className="text-xs text-slate-600">
                      Mantenimiento de sistemas en producción, control de accesos, corrección de vulnerabilidades y coordinación técnica en proyectos de alta concurrencia.
                    </p>
                  </div>
                </div>
              </div>

              {/* Certificaciones Oficiales */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-3 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Certificaciones Oficiales
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80">
                    <p className="font-bold text-slate-900 text-xs">Microsoft × freeCodeCamp</p>
                    <p className="text-[11px] text-blue-700 mt-0.5">Certificado Fundacional C#</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80">
                    <p className="font-bold text-slate-900 text-xs">IBM</p>
                    <p className="text-[11px] text-blue-700 mt-0.5">Fundamentos de Ciberseguridad</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/80">
                    <p className="font-bold text-slate-900 text-xs">Microsoft &amp; Founderz</p>
                    <p className="text-[11px] text-blue-700 mt-0.5">Master AI with Responsible Prompting</p>
                  </div>
                </div>
              </div>

              {/* Stack Técnico */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  Stack Técnico Dominado
                </h4>
                <p className="text-xs text-slate-600 mb-2">
                  TypeScript, JavaScript, C#, Python, SQL, Rust, C/C++ (Arduino), React, Next.js, Node.js, PostgreSQL, MongoDB, SQLite, Redis, Linux, Docker, Cloudflare, OWASP.
                </p>
              </div>

            </div>

            {/* Footer del Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
              <span className="text-xs text-slate-500">
                Documento adjunto: Maicol_Recabarren_CV_9e390711.pdf
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={cvPdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-2xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Abrir Documento PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setIsCvModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs transition hover:bg-slate-100 cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
