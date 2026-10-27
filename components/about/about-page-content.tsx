"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import {
  Server,
  Code2,
  Palette,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  Layers,
  FileCheck2,
  Lock,
  Cpu,
  Terminal,
  Award,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Building2,
  Briefcase,
  BookOpen,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  tagline: string;
  category: "Liderazgo & Backend" | "Frontend & Cliente" | "Diseño & UX" | "QA & Seguridad";
  icon: React.ElementType;
  accentColor: {
    badgeBg: string;
    badgeText: string;
    border: string;
    glow: string;
    iconBg: string;
    iconColor: string;
  };
  education: string;
  summary: string;
  responsibilities: string[];
  builtModules: string[];
  techStack: string[];
  defenseTopic: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "maicol-recabarren",
    name: "Maicol Recabarren Cerda",
    role: "Project Lead & Arquitecto de Software / Backend",
    tagline: "Responsable supremo de la coherencia arquitectónica, modelo de datos relacional y seguridad multi-tenant de AURENIS.",
    category: "Liderazgo & Backend",
    icon: Server,
    accentColor: {
      badgeBg: "bg-blue-500/10 dark:bg-blue-900/30",
      badgeText: "text-blue-600 dark:text-blue-400",
      border: "border-blue-500/30",
      glow: "from-blue-600/20 to-indigo-600/10",
      iconBg: "bg-blue-600",
      iconColor: "text-white",
    },
    education:
      "Técnico en Programación — Liceo Politécnico Marga Marga (Quilpué, Región de Valparaíso). Especialización autodidacta en sistemas distribuidos, bases de datos ACID y seguridad perimetral.",
    summary:
      "Diseñó la arquitectura de software completa de AURENIS desde los cimientos. Estableció el modelo relacional en PostgreSQL mediante Prisma ORM, el pipeline de autorización estricta en servidor (RBAC) y la estrategia de aislamiento criptográfico multi-tenant para impedir cualquier fuga de datos entre colegios independientes.",
    responsibilities: [
      "Definición y gobierno de la arquitectura sistémica del proyecto (App Router, Server Actions, Route Handlers).",
      "Modelado de datos en PostgreSQL con Prisma ORM (migraciones deterministas, índices compuestos y transacciones ACID).",
      "Autenticación segura con cookies httpOnly, firmas HS256 (jose) y hashing criptográfico de contraseñas.",
      "Control de acceso basado en roles (RBAC) verificado exclusivamente en backend (sin confiar en el cliente).",
      "Blindaje anti-BOLA/IDOR forzando la validación del discriminador schoolId en cada query y mutación.",
      "Diseño de contratos de API REST uniformes basados en el estándar RFC 7807 (Problem Details).",
    ],
    builtModules: [
      "Middleware perimetral de autenticación y enrutamiento con soporte de subdominios institucionales (*.aurenis.app).",
      "Motor transaccional de registro de notas bajo normativa Decreto 67 de 2018.",
      "Servicio de revocación y auditoría de sesiones activas (JTI blacklist / DB session revocation).",
      "Pipeline de migración e importación masiva de datos escolares desde planillas oficiales.",
    ],
    techStack: [
      "Next.js 15 (App Router)",
      "PostgreSQL",
      "Prisma ORM",
      "TypeScript 5",
      "Zod (Runtime Validation)",
      "JWT (jose HS256)",
      "bcryptjs",
      "Docker & Cloud Run",
    ],
    defenseTopic:
      "Defensa integral de la arquitectura en capas y demostración en vivo de la mitigación de ataques BOLA/IDOR ante intentos de manipulación de identificadores escolares.",
  },
  {
    id: "malcom-marcelo",
    name: "Malcom Marcelo",
    role: "Frontend Developer & Lógica Interactiva de Cliente",
    tagline: "Especialista en interfaces reactivas de alto rendimiento, gestión de estado y sincronización bidireccional cliente-servidor.",
    category: "Frontend & Cliente",
    icon: Code2,
    accentColor: {
      badgeBg: "bg-sky-500/10 dark:bg-sky-900/30",
      badgeText: "text-sky-600 dark:text-sky-400",
      border: "border-sky-500/30",
      glow: "from-sky-600/20 to-blue-600/10",
      iconBg: "bg-sky-600",
      iconColor: "text-white",
    },
    education:
      "Formación Técnico-Profesional en Desarrollo de Software — Liceo Politécnico Marga Marga. Formación continua en ecosistema moderno de React, patrones de renderizado y Web Performance.",
    summary:
      "Encargado de convertir las reglas de negocio pedagógicas y los requerimientos del backend en una experiencia web reactiva, fluida y sin desfase de hidratación. Diseñó los flujos de interacción para docentes en el aula y apoderados, garantizando tiempos de respuesta instantáneos y control riguroso de errores de red.",
    responsibilities: [
      "Construcción modular de páginas y componentes interactivos en Next.js (Server Components vs. Client Components).",
      "Gestión de estados locales y globales, custom hooks reutilizables y sincronización reactiva en tiempo real.",
      "Formularios dinámicos con validación instantánea de cliente y prevención de envíos duplicados (submitting state).",
      "Consumo resiliente de APIs y Server Actions con manejo de loading skeletons y estados de error con Error Boundaries.",
      "Garantía de paridad estricta entre Server-Side Rendering (SSR) y cliente (cero advertencias de hidratación).",
      "Diseño 100% responsivo probado en resoluciones de teléfonos inteligentes, tablets y computadores de escritorio.",
    ],
    builtModules: [
      "Interfaz interactiva del Libro de Clases Digital para ingreso rápido de firmas y observaciones de aula.",
      "Planilla interactiva de asistencia por bloque horario con cálculo automático de porcentajes de presencia.",
      "Panel de calificaciones con cálculo dinámico en tiempo real y soporte para escala chilena 1.0 a 7.0.",
      "Modal interactivo de cotización comercial y asistente de incorporación institucional.",
    ],
    techStack: [
      "React 19",
      "Next.js App Router",
      "TypeScript Estricto",
      "Tailwind CSS v4",
      "Zod Client Validation",
      "Lucide Icons",
      "React Hooks",
    ],
    defenseTopic:
      "Demostración de resiliencia de la interfaz ante cortes de red, concurrencia de mutaciones y optimización del bundle de cliente para carga rápida en conexiones 3G/4G rurales.",
  },
  {
    id: "lucas-p",
    name: "Lucas P.",
    role: "UI/UX Designer & Arquitectura de Interfaz / Design System",
    tagline: "Custodio de la experiencia de usuario, consistencia visual y accesibilidad universal (WCAG 2.1 AA) de la plataforma.",
    category: "Diseño & UX",
    icon: Palette,
    accentColor: {
      badgeBg: "bg-purple-500/10 dark:bg-purple-900/30",
      badgeText: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500/30",
      glow: "from-purple-600/20 to-fuchsia-600/10",
      iconBg: "bg-purple-600",
      iconColor: "text-white",
    },
    education:
      "Especialista en Diseño de Interfaces y Experiencia de Usuario (UI/UX) — Liceo Politécnico Marga Marga. Especialización en sistemas de diseño escalables, accesibilidad cognitiva y ergonomía visual para entornos de trabajo prolongado.",
    summary:
      "Creó el Design System unificado de AURENIS para erradicar las interfaces saturadas y hostiles tradicionales del software escolar chileno. Diseñó cada flujo de pantalla centrándose en reducir la carga cognitiva de docentes que pasan horas digitando calificaciones y directivos que necesitan tomar decisiones estratégicas de un vistazo.",
    responsibilities: [
      "Diseño y mantención del Design System unificado de AURENIS (paleta cromática, espaciados, tipografía y sombras).",
      "Arquitectura de información para portales multi-rol: Directorio, UTP, Docentes, Estudiantes y Apoderados.",
      "Cumplimiento riguroso de accesibilidad visual WCAG 2.1 nivel AA (contraste tipográfico ≥ 4.5:1 y touch targets ≥ 44px).",
      "Micro-interacciones y transiciones refinadas con motion para guiar la atención sin generar distracciones.",
      "Prevención absoluta de Cumulative Layout Shift (CLS = 0) y eliminación de scroll horizontal involuntario.",
      "Documentación y auditoría estética continua plasmada en el manual oficial docs/DESIGN_SYSTEM_LUCAS.md.",
    ],
    builtModules: [
      "Dashboard directivo con visualización ejecutiva de matrícula, retención escolar y asistencia diaria.",
      "Ficha del Estudiante 360° con historial pedagógico, alertas tempranas de repitencia y antecedentes médicos.",
      "Módulo de diseño para Libro de Clases conforme al Decreto 67 y distribución visual del leccionario.",
      "Catálogo vivo de componentes del sistema (/system/design-system) para verificación de tokens.",
    ],
    techStack: [
      "Figma Enterprise",
      "Tailwind CSS",
      "Motion (framer-motion)",
      "Tokens de Diseño Semánticos",
      "WCAG 2.1 AA",
      "Tipografía Inter & Geist",
    ],
    defenseTopic:
      "Justificación pedagógica de las decisiones de composición visual, minimización de clics en la labor docente de aula y certificación de accesibilidad inclusiva.",
  },
  {
    id: "frank-m",
    name: "Frank M.",
    role: "QA Engineer, Testing Automatizado & Ciberseguridad",
    tagline: "Auditor técnico encargado de pentesting continuo, auditoría de vulnerabilidades y resguardo normativo de datos de menores (NNA).",
    category: "QA & Seguridad",
    icon: ShieldCheck,
    accentColor: {
      badgeBg: "bg-emerald-500/10 dark:bg-emerald-900/30",
      badgeText: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-500/30",
      glow: "from-emerald-600/20 to-teal-600/10",
      iconBg: "bg-emerald-600",
      iconColor: "text-white",
    },
    education:
      "Formación en Aseguramiento de Calidad y Ciberseguridad de Software — Liceo Politécnico Marga Marga. Formación técnica en metodologías de pentesting web, estándares OWASP Top 10 y normativas chilenas de protección de datos personales.",
    summary:
      "Actúa como el atacante interno del sistema. Su misión es detectar, reproducir y documentar cualquier falla de seguridad o error de lógica antes de que el código llegue a producción. Vela especialmente por el cumplimiento estricto de la Circular 482 de la Superintendencia de Educación y la Ley 19.628 sobre protección de datos de niños, niñas y adolescentes.",
    responsibilities: [
      "Diseño y ejecución del plan maestro de pruebas: unitarias, integración de endpoints y pruebas E2E de flujos críticos.",
      "Auditoría técnica contra vulnerabilidades OWASP Top 10 (Inyecciones SQL, XSS, CSRF, desbordamientos).",
      "Verificación de control de acceso vertical (prevención de escalamiento a privilegios de SuperAdmin o Sostenedor).",
      "Verificación de control de acceso horizontal (verificación empírica de aislamiento entre colegios distintos).",
      "Mantenimiento de la bitácora técnica de seguridad SECURITY-FINDINGS-LOG.md con evaluación cuantitativa CVSS v3.1.",
      "Auditoría de cabeceras HTTP de seguridad (Content-Security-Policy con nonce criptográfico, HSTS, X-Frame-Options).",
    ],
    builtModules: [
      "Firewall perimetral a nivel de middleware (WAF de aplicación) con detección de patrones de inyección.",
      "Matriz de pruebas de regresión automatizadas para ingreso de calificaciones y asistencia sin pérdida de datos.",
      "Protocolo de verificación de retiro seguro de estudiantes (autorización validada de apoderados y terceros).",
      "Reportes formales de aseguramiento de calidad (CVSS-V31-SCORING-MATRIX.md y BOLA-IDOR-SECURITY-REPORT.md).",
    ],
    techStack: [
      "OWASP ZAP & Pentesting",
      "CVSS v3.1 Scoring",
      "STRIDE Threat Modeling",
      "HTTP Security Headers (CSP Nonce)",
      "Playwright / Integration Tests",
      "Auditoría Normativa Circular 482",
    ],
    defenseTopic:
      "Acreditación empírica de seguridad técnica: demostración de ataques controlados de inyección y suplantación de identidad rechazados satisfactoriamente por el sistema.",
  },
];

export function AboutPageContent() {
  const [activeTab, setActiveTab] = useState<string>("todos");

  const filteredMembers =
    activeTab === "todos"
      ? TEAM_MEMBERS
      : TEAM_MEMBERS.filter((m) => m.category.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#070E1A] text-slate-900 dark:text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Barra de Navegación Institucional */}
      <LandingNavbar />

      <main className="pt-24 sm:pt-28 pb-20">
        {/* 2. Hero Section de Alta Fidelidad */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800/80 bg-gradient-to-b from-[#F5F8FC] via-white to-white dark:from-[#09152C] dark:via-[#070E1A] dark:to-[#070E1A]">
          {/* Elementos ambientales de fondo */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-80 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-sky-500/10 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            {/* Badge Institucional Oficial */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-xs sm:text-sm font-semibold mb-6">
              <GraduationCap className="w-4 h-4" />
              <span>Equipo Técnico &amp; Autores de AURENIS</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-950 dark:text-white leading-[1.08] mb-6">
              Ingeniería de software real, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500">
                comprometida con la educación.
              </span>
            </h1>

            <p className="max-w-3xl mx-auto text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal mb-8">
              AURENIS fue concebido, diseñado y construido por un equipo de cuatro desarrolladores y especialistas formados en la educación técnico-profesional chilena (
              <strong className="text-slate-900 dark:text-white font-semibold">Liceo Politécnico Marga Marga</strong>, Quilpué).
              Sin intermediarios ni código simulado: aquí está el currículum, la especialidad técnica y los módulos construidos por cada responsable.
            </p>

            {/* Métricas y Credenciales Clave del Equipo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 text-left">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">4 Roles</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Especialidades delimitadas con DoD</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">100% Real</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Cero placeholders o mocks falsos</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400">Decreto 67</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Conforme a normativa escolar de Chile</div>
              </div>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400">Quilpué, CL</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Región de Valparaíso, Chile</div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Filtros de Especialidad */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-950 dark:text-white">
                Fichas Técnicas &amp; Hojas de Vida
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Conoce a fondo las credenciales, tecnologías y áreas de defensa de cada integrante.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: "todos", label: "Equipo Completo" },
                { id: "liderazgo", label: "Lead & Backend" },
                { id: "frontend", label: "Frontend" },
                { id: "diseño", label: "UI / UX" },
                { id: "qa", label: "QA & Seguridad" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white dark:bg-blue-600 dark:text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Lista Extensa y Profesional de Perfiles de Equipo (CV Profesional) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
          {filteredMembers.map((member, idx) => {
            const IconComponent = member.icon;
            return (
              <motion.article
                key={member.id}
                id={member.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative rounded-3xl bg-white dark:bg-[#0B1528] border border-slate-200 dark:border-slate-800 shadow-md shadow-slate-200/40 dark:shadow-black/40 overflow-hidden"
              >
                {/* Cabecera del Perfil */}
                <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800/80 bg-gradient-to-r from-slate-50 via-white to-slate-50/50 dark:from-[#0D1A33] dark:via-[#0B1528] dark:to-[#0D1A33]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-2xl ${member.accentColor.iconBg} ${member.accentColor.iconColor} flex items-center justify-center shrink-0 shadow-md`}
                      >
                        <IconComponent className="w-7 h-7" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                            {member.name}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${member.accentColor.badgeBg} ${member.accentColor.badgeText}`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Verificado AURENIS</span>
                          </span>
                        </div>
                        <p className="text-sm sm:text-base font-bold text-blue-600 dark:text-blue-400 mt-1">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {member.category}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                    {member.tagline}
                  </p>
                </div>

                {/* Contenido en 2 Columnas: Trayectoria / Educación vs Módulos y Responsabilidades */}
                <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Columna Izquierda: Formación & Resumen de Carrera (5 cols) */}
                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        <span>Formación Técnico-Profesional</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-800/80 leading-relaxed font-medium">
                        {member.education}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-emerald-500" />
                        <span>Perfil Técnico &amp; Alcance</span>
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {member.summary}
                      </p>
                    </div>

                    {/* Tecnologías Dominadas */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-purple-500" />
                        <span>Stack Técnico Especializado</span>
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {member.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60 font-semibold"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Tema de Defensa Técnica Oral */}
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>Defensa Técnica Obligatoria</span>
                      </div>
                      <p className="text-xs leading-relaxed font-medium">
                        {member.defenseTopic}
                      </p>
                    </div>
                  </div>

                  {/* Columna Derecha: Responsabilidades y Módulos Construidos (7 cols) */}
                  <div className="lg:col-span-7 space-y-6">
                    {/* Responsabilidades de Cargo */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-blue-500" />
                        <span>Áreas bajo su Responsabilidad Directa</span>
                      </h4>
                      <ul className="space-y-2">
                        {member.responsibilities.map((resp, rIdx) => (
                          <li
                            key={rIdx}
                            className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-snug"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Módulos Construidos en AURENIS */}
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 flex items-center gap-1.5">
                        <FileCheck2 className="w-4 h-4 text-emerald-500" />
                        <span>Módulos y Entregables Programados en AURENIS</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {member.builtModules.map((mod, mIdx) => (
                          <div
                            key={mIdx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 font-medium flex items-start gap-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{mod}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </section>

        {/* 5. Sección Institucional: Origen, Proyecto ABP y Compromiso Normativo */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0B1528] to-[#070E1A] text-white p-8 sm:p-12 border border-blue-500/30 shadow-2xl relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-4xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/30 border border-blue-400/40 text-blue-300 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Origen del Proyecto &amp; Contexto Institucional</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Nacido en las aulas del Liceo Politécnico Marga Marga para transformar la gestión escolar de Chile.
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                AURENIS no es una plantilla importada ni un desarrollo apresurado. Es el resultado de un riguroso proceso de Aprendizaje Basado en Proyectos (ABP) de la especialidad de Programación en Quilpué. Observamos de primera mano la sobrecarga administrativa que sufren los profesores chilenos al lidiar con plataformas lentas, libros de clases en papel duplicados y sistemas que no respetan el Decreto 67 de evaluación.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-blue-400 uppercase tracking-wider">Decreto 67 / 2018</div>
                  <p className="text-xs text-slate-400">
                    Cálculo centralizado en servidor, ponderaciones formativas y sumativas, y eliminación de distorsiones aritméticas locales.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Circular N° 30</div>
                  <p className="text-xs text-slate-400">
                    Garantía de firma digital de leccionario, control de presencia horaria y respaldo para auditorías de subvenciones.
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-bold text-purple-400 uppercase tracking-wider">Circular N° 482 &amp; Ley 19.628</div>
                  <p className="text-xs text-slate-400">
                    Protección absoluta de datos sensibles de niños, niñas y adolescentes con aislamiento lógico por colegio (BOLA-proof).
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="mailto:contact@aurenis.app"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-blue-600/30"
                >
                  <span>Contactar al Equipo Técnico</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                <Link
                  href="/libro-de-clases-digital"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm border border-white/20 transition-all"
                >
                  <span>Explorar Libro de Clases Digital</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 6. Footer Oficial */}
      <LandingFooter />
    </div>
  );
}
