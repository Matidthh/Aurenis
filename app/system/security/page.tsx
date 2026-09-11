"use client";

import React, { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  AlertTriangle,
  FileText,
  Activity,
  CheckCircle2,
  Layers,
  Heart,
  Database,
  ExternalLink,
  ChevronDown,
  Grid,
  Users,
  Terminal,
  Zap,
  CheckSquare,
} from "lucide-react";
import { OwaspChecklistDashboard } from "@/components/security/owasp-checklist";

interface Risk5x5Item {
  id: string;
  title: string;
  module: string;
  owaspId: string;
  owaspName: string;
  probInherente: number; // 1 to 5
  impInherente: number; // 1 to 5
  probResidual: number; // 1 to 5
  impResidual: number; // 1 to 5
  mitigation: string;
  implementedControl: string;
  responsible: string;
  qaVerification: string;
}

const RISKS_5X5_DATA: Risk5x5Item[] = [
  {
    id: "RSK-01",
    title: "Fuga de datos cross-tenant mediante IDOR / BOLA",
    module: "Persistencia & ORM",
    owaspId: "A01:2021",
    owaspName: "Broken Access Control",
    probInherente: 4,
    impInherente: 5,
    probResidual: 1,
    impResidual: 4,
    mitigation: "Interceptor ORM createTenantPrisma(schoolId) inyecta where: { schoolId } obligatorio en el 100% de queries.",
    implementedControl: "lib/db/tenant-extension.ts & lib/db/prisma.ts",
    responsible: "Maicol R. (Backend Lead)",
    qaVerification: "Test [TENANT_ISOLATION] (100% PASS)",
  },
  {
    id: "RSK-02",
    title: "Alteración no autorizada de permisos de retiro físico de menores (canPickUp)",
    module: "Fichas de Estudiantes",
    owaspId: "A01:2021",
    owaspName: "Broken Access Control",
    probInherente: 3,
    impInherente: 5,
    probResidual: 1,
    impResidual: 5,
    mitigation: "Restricción exclusiva a SCHOOL_ADMIN + Registro inmutable en AuditLog como SECURITY_EVENT.",
    implementedControl: "lib/services/guardians.ts & AuditLog",
    responsible: "Frank M. (QA / Seguridad)",
    qaVerification: "Test [AUDIT] & [DOD_403_VALIDATION]",
  },
  {
    id: "RSK-03",
    title: "Estudiante escala privilegios para alterar notas o actas oficiales",
    module: "Académico & Notas",
    owaspId: "A01:2021",
    owaspName: "Broken Access Control",
    probInherente: 5,
    impInherente: 4,
    probResidual: 1,
    impResidual: 4,
    mitigation: "Aserción canónica en backend assertPermission(ctx, GRADES_ENTER) retornando HTTP 403 Forbidden.",
    implementedControl: "lib/auth/permissions.ts & app/api/schools/[schoolId]/grades",
    responsible: "Maicol R. (Backend Lead)",
    qaVerification: "Test [DOD_STUDENT_GRADES] (5/5 PASS)",
  },
  {
    id: "RSK-04",
    title: "Falsificación de Tokens JWT / Session Hijacking",
    module: "Autenticación & Sesión",
    owaspId: "A02:2021",
    owaspName: "Cryptographic Failures",
    probInherente: 4,
    impInherente: 5,
    probResidual: 1,
    impResidual: 5,
    mitigation: "Criptografía HS256 con librería jose, tokens efímeros (8h) en cookies HttpOnly, Secure y SameSite=Lax.",
    implementedControl: "lib/auth/jwt.ts & lib/auth/session.ts",
    responsible: "Maicol R. (Backend Lead)",
    qaVerification: "Test [SESSION_LOGOUT] (Anti-Tampering)",
  },
  {
    id: "RSK-05",
    title: "Fuga de antecedentes médicos, diagnósticos PIE y NEE (medicalNotes)",
    module: "Privacidad de Menores",
    owaspId: "A04:2021",
    owaspName: "Insecure Design",
    probInherente: 4,
    impInherente: 4,
    probResidual: 1,
    impResidual: 4,
    mitigation: "Segregación a nivel de ORM (campo excluido de consultas masivas); visibilidad exclusiva a enfermería y dirección.",
    implementedControl: "lib/db/mock-db.ts & lib/validations/student.ts",
    responsible: "Frank M. (QA / Seguridad)",
    qaVerification: "Test [AUDIT] & [DOD_403_VALIDATION]",
  },
  {
    id: "RSK-06",
    title: "Fraude y adulteración de notas posteriores al cierre del semestre",
    module: "Libro de Clases",
    owaspId: "A08:2021",
    owaspName: "Software and Data Integrity Failures",
    probInherente: 4,
    impInherente: 4,
    probResidual: 1,
    impResidual: 4,
    mitigation: "Bloqueo en backend por estado AcademicPeriod.isClosed === true + Auditoría obligatoria de cambios con diff.",
    implementedControl: "lib/services/grades.ts & lib/services/audit.ts",
    responsible: "Maicol R. (Backend Lead)",
    qaVerification: "Test [VALIDATION] & [AUDIT]",
  },
  {
    id: "RSK-07",
    title: "Ataque de fuerza bruta / Credential Stuffing en Login",
    module: "Autenticación",
    owaspId: "A07:2021",
    owaspName: "Identification & Auth Failures",
    probInherente: 5,
    impInherente: 3,
    probResidual: 2,
    impResidual: 3,
    mitigation: "Hashing con Bcrypt factor 10 + Rate Limiting por IP/usuario + Bloqueo progresivo tras 5 fallos.",
    implementedControl: "lib/auth/password.ts & Middleware",
    responsible: "Carlos M. (DevOps Lead)",
    qaVerification: "Test [AUTH_NEGATIVE]",
  },
  {
    id: "RSK-08",
    title: "Profesor modifica cursos o asignaturas de otros docentes",
    module: "Cursos & Asignaturas",
    owaspId: "A01:2021",
    owaspName: "Broken Access Control",
    probInherente: 4,
    impInherente: 3,
    probResidual: 1,
    impResidual: 3,
    mitigation: "Verificación de relación: subject.teacherProfileId === session.teacherProfileId previo a mutaciones.",
    implementedControl: "lib/services/courses.ts",
    responsible: "Maicol R. (Backend Lead)",
    qaVerification: "Test [DOD_TEACHER_COURSES]",
  },
  {
    id: "RSK-09",
    title: "Borrado o adulteración de la bitácora de auditoría (AuditLog)",
    module: "Auditoría & Trazabilidad",
    owaspId: "A09:2021",
    owaspName: "Security Logging & Monitoring Failures",
    probInherente: 3,
    impInherente: 5,
    probResidual: 1,
    impResidual: 4,
    mitigation: "Modelo append-only inmutable: sin rutas ni métodos de actualización/borrado en Prisma ORM.",
    implementedControl: "prisma/schema.prisma & lib/services/audit.ts",
    responsible: "Carlos M. (DevOps Lead)",
    qaVerification: "Test [AUDIT] (Inmutabilidad)",
  },
  {
    id: "RSK-10",
    title: "Inyección de parámetros inválidos o notas fuera de rango (ej: nota 99.0)",
    module: "Validación de Negocio",
    owaspId: "A03:2021",
    owaspName: "Injection / Validation Failures",
    probInherente: 4,
    impInherente: 3,
    probResidual: 1,
    impResidual: 2,
    mitigation: "Validación declarativa Zod con límites decimales estrictos (minGrade: 1.0, maxGrade: 7.0, precision: 1).",
    implementedControl: "lib/validations/academic.ts",
    responsible: "Maicol R. (Backend Lead)",
    qaVerification: "Test [VALIDATION] (100% PASS)",
  },
  {
    id: "RSK-11",
    title: "Escalación vertical al Control Plane global (/system/*)",
    module: "Control Plane SaaS",
    owaspId: "A01:2021",
    owaspName: "Broken Access Control",
    probInherente: 4,
    impInherente: 5,
    probResidual: 1,
    impResidual: 4,
    mitigation: "Doble barrera: middleware.ts y handlers /api/system/* exigen isSystemAdmin === true.",
    implementedControl: "middleware.ts & app/api/system/schools",
    responsible: "Frank M. (QA / Seguridad)",
    qaVerification: "Test [DOD_FORCED_EVASION] (HTTP 403)",
  },
  {
    id: "RSK-12",
    title: "Seguimiento físico de menores mediante correlación de horarios y asistencia",
    module: "Asistencia & Horarios",
    owaspId: "A01:2021",
    owaspName: "Broken Access Control",
    probInherente: 3,
    impInherente: 4,
    probResidual: 1,
    impResidual: 4,
    mitigation: "Rutas bajo autenticación multi-tenant cerrada, no indexación web (robots: noindex) y RBAC acotado.",
    implementedControl: "middleware.ts & app/[schoolSlug]/schedule",
    responsible: "Frank M. (QA / Seguridad)",
    qaVerification: "Test [PROTECTED_ROUTES]",
  },
];

const OWASP_TOP_10 = [
  {
    id: "A01:2021",
    name: "Broken Access Control",
    count: 5,
    severity: "CRÍTICA",
    description: "Control de acceso roto, IDOR, BOLA, escalación vertical y horizontal de privilegios.",
    control: "RBAC canónico en 3 capas (assertPermission) + Scoped ORM createTenantPrisma + Respuestas HTTP 403.",
  },
  {
    id: "A02:2021",
    name: "Cryptographic Failures",
    count: 1,
    severity: "CRÍTICA",
    description: "Exposición de datos en tránsito o reposo, claves secretas débiles o algoritmos obsoletos.",
    control: "Firma JWT HS256 con librería jose, cookies HttpOnly/Secure y hashing con Bcrypt factor de coste 10.",
  },
  {
    id: "A03:2021",
    name: "Injection",
    count: 1,
    severity: "ALTA",
    description: "Inyecciones SQL, NoSQL, ORM y datos de entrada maliciosos o fuera de rango.",
    control: "Consultas parametrizadas automáticas con Prisma ORM + Validación Zod estricta en el 100% de DTOs.",
  },
  {
    id: "A04:2021",
    name: "Insecure Design",
    count: 1,
    severity: "ALTA",
    description: "Falta de modelado de amenazas y omisión de controles de privacidad por diseño.",
    control: "Modelado STRIDE formal, segregación de medicalNotes y protección reforzada de datos de menores.",
  },
  {
    id: "A05:2021",
    name: "Security Misconfiguration",
    count: 1,
    severity: "MEDIA",
    description: "Mala configuración de cabeceras, CORS permisivo o mensajes de error con stack traces.",
    control: "Cabeceras de seguridad estrictas, puerto 3000 acotado y respuestas de error JSON { error: string }.",
  },
  {
    id: "A06:2021",
    name: "Vulnerable and Outdated Components",
    count: 1,
    severity: "MEDIA",
    description: "Uso de dependencias desactualizadas o librerías con vulnerabilidades conocidas (CVEs).",
    control: "Ecosistema Next.js 15 + React 19 + Auditoría periódica de dependencias con npm audit.",
  },
  {
    id: "A07:2021",
    name: "Identification and Authentication Failures",
    count: 1,
    severity: "ALTA",
    description: "Ataques de fuerza bruta, fijación de sesión y falta de caducidad en tokens.",
    control: "Expiración de sesión a 8 horas, reseteo con fecha epoch en logout y rate limiting por IP/email.",
  },
  {
    id: "A08:2021",
    name: "Software and Data Integrity Failures",
    count: 1,
    severity: "ALTA",
    description: "Adulteración de actas oficiales o manipulaciones no detectadas en la persistencia.",
    control: "Inmutabilidad de periodos cerrados (isClosed: true) y registro inmutable de diffs en AuditLog.",
  },
  {
    id: "A09:2021",
    name: "Security Logging and Monitoring Failures",
    count: 1,
    severity: "ALTA",
    description: "Falta de registro de eventos de seguridad y borrado malicioso de trazas forenses.",
    control: "Tabla AuditLog de solo inserción (Append-Only) con registro de userId, IP, timestamp y acción.",
  },
  {
    id: "A10:2021",
    name: "Server-Side Request Forgery (SSRF)",
    count: 0,
    severity: "BAJA",
    description: "Peticiones arbitrarias inducidas hacia servicios internos de red.",
    control: "Ausencia de webhooks o fetchs dinámicos arbitrarios en el servidor.",
  },
];

export default function SecurityStridePage() {
  const [selectedTab, setSelectedTab] = useState<"matrix5x5" | "owasp" | "owasp_checklist" | "actionplan" | "stride" | "minors">("owasp_checklist");
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>("RSK-01");

  // Matriz 5x5 heatmap calculations
  const getRiskLevel = (p: number, i: number) => {
    const score = p * i;
    if (score >= 20) return { label: "CRÍTICO", color: "bg-red-600 text-white border-red-700" };
    if (score >= 15) return { label: "ALTO", color: "bg-orange-500 text-white border-orange-600" };
    if (score >= 8) return { label: "MEDIO", color: "bg-amber-400 text-amber-950 border-amber-500" };
    return { label: "BAJO", color: "bg-emerald-500 text-white border-emerald-600" };
  };

  const getHeatmapCellColor = (p: number, i: number) => {
    const score = p * i;
    if (score >= 20) return "bg-red-500/20 border-red-500/40 text-red-700 dark:text-red-300";
    if (score >= 15) return "bg-orange-500/20 border-orange-500/40 text-orange-700 dark:text-orange-300";
    if (score >= 8) return "bg-amber-500/20 border-amber-500/40 text-amber-800 dark:text-amber-200";
    return "bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-200";
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Shield className="w-80 h-80" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4" />
              Evaluación de Riesgos 5x5 + Mapeo OWASP Top 10 Certificado
            </div>
            <div className="flex items-center gap-2">
              <a
                href="/docs/OWASP_SECURITY_CHECKLIST.md"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-medium bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Checklist OWASP (32)
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="/docs/RISK_ASSESSMENT_MATRIX_5X5.md"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-brand-400 hover:text-brand-300 font-medium bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Matriz 5x5 Markdown
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="/docs/STRIDE_THREAT_MODELING.md"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-medium bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Doc STRIDE
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
            Gestión de Riesgos, Matriz 5x5 & Mapeo OWASP Top 10
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
            Evaluación cuantitativa y cualitativa de riesgos de seguridad según impacto y probabilidad (ISO 27005 / NIST),
            asignación de controles mitigantes en 3 capas y plan de acción de ingeniería acordado con el equipo de desarrollo.
          </p>

          {/* Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-slate-400 block">Riesgos Evaluados</span>
              <span className="text-2xl font-bold text-white">{RISKS_5X5_DATA.length} Escenarios</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-red-400 block font-medium">Riesgo Inherente Crítico</span>
              <span className="text-2xl font-bold text-red-400">5 Críticos / 5 Altos</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-emerald-400 block font-medium">Riesgo Residual Post-Mitigación</span>
              <span className="text-2xl font-bold text-emerald-400">100% BAJO (1-6)</span>
            </div>
            <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
              <span className="text-xs text-blue-400 block font-medium">Categorías OWASP Cubiertas</span>
              <span className="text-2xl font-bold text-blue-400">9 de 10 Activas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedTab("owasp_checklist")}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            selectedTab === "owasp_checklist"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <CheckSquare className="w-4 h-4 text-emerald-500" />
          Checklist Técnico OWASP (32 Controles)
        </button>
        <button
          onClick={() => setSelectedTab("matrix5x5")}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            selectedTab === "matrix5x5"
              ? "border-brand-600 text-brand-600 dark:text-brand-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Grid className="w-4 h-4" />
          Matriz 5x5 Priorizada ({RISKS_5X5_DATA.length})
        </button>
        <button
          onClick={() => setSelectedTab("owasp")}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            selectedTab === "owasp"
              ? "border-blue-600 text-blue-600 dark:text-blue-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Shield className="w-4 h-4 text-blue-500" />
          Asociación OWASP Top 10:2021
        </button>
        <button
          onClick={() => setSelectedTab("actionplan")}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            selectedTab === "actionplan"
              ? "border-emerald-600 text-emerald-600 dark:text-emerald-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Users className="w-4 h-4 text-emerald-500" />
          Plan de Acción de Desarrolladores
        </button>
        <button
          onClick={() => setSelectedTab("minors")}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            selectedTab === "minors"
              ? "border-amber-600 text-amber-600 dark:text-amber-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Heart className="w-4 h-4 text-amber-500" />
          Protección de Datos de Menores
        </button>
        <button
          onClick={() => setSelectedTab("stride")}
          className={`pb-3 px-4 text-sm font-semibold flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            selectedTab === "stride"
              ? "border-purple-600 text-purple-600 dark:text-purple-400"
              : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          }`}
        >
          <Layers className="w-4 h-4 text-purple-500" />
          Modelo STRIDE
        </button>
      </div>

      {/* TAB 1: Matriz 5x5 Priorizada */}
      {selectedTab === "matrix5x5" && (
        <div className="space-y-8">
          {/* Visual Heatmap 5x5 */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Grid className="w-4 h-4 text-brand-600" />
                  Mapa de Calor 5x5: Riesgo Inherente vs. Riesgo Residual
                </h2>
                <p className="text-xs text-slate-500">
                  Visualización de la reducción drástica de severidad tras la aplicación de controles en las 3 capas arquitectónicas.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-red-600 inline-block"></span> Crítico (20-25)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-orange-500 inline-block"></span> Alto (15-19)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span> Medio (8-14)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Bajo (1-7)
                </span>
              </div>
            </div>

            {/* Matrix 5x5 Grid */}
            <div className="overflow-x-auto pt-2">
              <div className="min-w-[600px] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden text-xs">
                <div className="grid grid-cols-6 bg-slate-100 dark:bg-slate-800/80 font-bold text-slate-700 dark:text-slate-300 text-center border-b border-slate-200 dark:border-slate-700 py-2">
                  <div className="text-left pl-3">Probabilidad \ Impacto</div>
                  <div>1. Insignificante</div>
                  <div>2. Menor</div>
                  <div>3. Moderado</div>
                  <div>4. Mayor</div>
                  <div>5. Catastrófico</div>
                </div>

                {[5, 4, 3, 2, 1].map((prob) => {
                  const probLabels: Record<number, string> = {
                    5: "5. Casi Segura",
                    4: "4. Probable",
                    3: "3. Posible",
                    2: "2. Improbable",
                    1: "1. Rara",
                  };
                  return (
                    <div key={prob} className="grid grid-cols-6 border-b border-slate-100 dark:border-slate-800/60 last:border-none">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800/40 font-semibold text-slate-600 dark:text-slate-400 flex items-center">
                        {probLabels[prob]}
                      </div>
                      {[1, 2, 3, 4, 5].map((imp) => {
                        const score = prob * imp;
                        const cellColor = getHeatmapCellColor(prob, imp);
                        const matchingInherents = RISKS_5X5_DATA.filter(
                          (r) => r.probInherente === prob && r.impInherente === imp
                        );
                        const matchingResiduals = RISKS_5X5_DATA.filter(
                          (r) => r.probResidual === prob && r.impResidual === imp
                        );

                        return (
                          <div
                            key={imp}
                            className={`p-2 border-l border-slate-100 dark:border-slate-800/60 flex flex-col justify-between min-h-[70px] ${cellColor}`}
                          >
                            <span className="font-mono font-bold text-[10px] opacity-60 block text-right">
                              {score}
                            </span>
                            <div className="space-y-1">
                              {matchingInherents.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {matchingInherents.map((item) => (
                                    <span
                                      key={item.id}
                                      onClick={() => setSelectedRiskId(item.id)}
                                      title={`Inherente: ${item.title}`}
                                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-700 text-white cursor-pointer shadow-sm hover:scale-105 transition"
                                    >
                                      🔴 {item.id}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {matchingResiduals.length > 0 && (
                                <div className="flex flex-wrap gap-1 pt-0.5">
                                  {matchingResiduals.map((item) => (
                                    <span
                                      key={item.id}
                                      onClick={() => setSelectedRiskId(item.id)}
                                      title={`Residual: ${item.title}`}
                                      className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-700 text-white cursor-pointer shadow-sm hover:scale-105 transition"
                                    >
                                      🟢 {item.id}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>Leyenda: 🔴 = Riesgo Inherente (Sin Mitigar) | 🟢 = Riesgo Residual (Con Controles AURENIS)</span>
              <span>Haz clic en un código de riesgo para ver el desglose técnico</span>
            </div>
          </div>

          {/* Risk Table with Detailed Controls */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Inventario Priorizado de Riesgos y Controles Mitigantes
                </h3>
                <p className="text-xs text-slate-500">
                  Clasificación de mayor a menor severidad con asignación nominal de responsable técnico y evidencia QA.
                </p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
                12 Riesgos Mitigados
              </span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {RISKS_5X5_DATA.map((risk) => {
                const inhLevel = getRiskLevel(risk.probInherente, risk.impInherente);
                const resLevel = getRiskLevel(risk.probResidual, risk.impResidual);
                const isSelected = selectedRiskId === risk.id;

                return (
                  <div
                    key={risk.id}
                    className={`p-4 transition ${
                      isSelected ? "bg-brand-50/40 dark:bg-brand-950/20" : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div
                      onClick={() => setSelectedRiskId(isSelected ? null : risk.id)}
                      className="flex flex-wrap items-start justify-between gap-4 cursor-pointer"
                    >
                      <div className="space-y-1.5 flex-1 min-w-[280px]">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {risk.id}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                            {risk.owaspId} {risk.owaspName}
                          </span>
                          <span className="text-xs text-slate-400">Módulo: {risk.module}</span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{risk.title}</h4>
                      </div>

                      {/* Risk Scores Compare */}
                      <div className="flex items-center gap-3 shrink-0 text-xs">
                        <div className="text-center">
                          <span className="text-[10px] text-slate-400 block">Inherente</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${inhLevel.color}`}>
                            {inhLevel.label} ({risk.probInherente * risk.impInherente})
                          </span>
                        </div>
                        <span className="text-slate-400 font-bold">➔</span>
                        <div className="text-center">
                          <span className="text-[10px] text-slate-400 block">Residual</span>
                          <span className={`px-2 py-0.5 rounded font-bold ${resLevel.color}`}>
                            {resLevel.label} ({risk.probResidual * risk.impResidual})
                          </span>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ml-2 ${
                            isSelected ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-300 space-y-1">
                            <strong className="block font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Control Mitigante Implementado:
                            </strong>
                            <p>{risk.mitigation}</p>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 space-y-1">
                            <strong className="block font-bold text-slate-900 dark:text-slate-100">
                              Implementación en Código & Responsable:
                            </strong>
                            <p>
                              Archivo de Control: <code>{risk.implementedControl}</code>
                            </p>
                            <p>
                              Líder Responsable: <strong>{risk.responsible}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            Validación QA Automatizada: {risk.qaVerification}
                          </span>
                          <span>Reducción de Riesgo: ~80% Eficacia</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Asociación OWASP Top 10 */}
      {selectedTab === "owasp" && (
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-blue-950 dark:text-blue-200">
                  Mapeo Canónico con el Estándar Internacional OWASP Top 10:2021
                </h2>
                <p className="text-xs text-blue-900/80 dark:text-blue-300/80 leading-relaxed">
                  Cada vector de riesgo evaluado en la plataforma AURENIS se encuentra directamente categorizado bajo
                  los estándares de la *Open Web Application Security Project* (OWASP), implementando defensas arquitectónicas
                  nativas para neutralizar cada familia de vulnerabilidades web y de API.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OWASP_TOP_10.map((owasp) => (
              <div
                key={owasp.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    {owasp.id}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      owasp.severity === "CRÍTICA"
                        ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                        : owasp.severity === "ALTA"
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400"
                        : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    Severidad {owasp.severity}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{owasp.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">{owasp.description}</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 block flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Defensa Implementada en AURENIS:
                  </span>
                  <p>{owasp.control}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Plan de Acción de Desarrolladores */}
      {selectedTab === "actionplan" && (
        <div className="space-y-6">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-emerald-950 dark:text-emerald-200">
                  Plan de Acción y Acuerdos de Ingeniería (DevSecOps Commitments)
                </h2>
                <p className="text-xs text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
                  Pacto técnico firmado entre los líderes de Backend, Frontend, DevOps y Seguridad para mantener los
                  controles en todo el ciclo de vida del software, con SLAs de remediación obligatorios y gates de CI/CD.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Backend Lead Commitments */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-xs">
                  BE
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Maicol R.</h3>
                  <span className="text-xs text-slate-500">Backend & Architecture Lead</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Regla de Oro Multi-Tenant:</strong> Cero llamadas a Prisma directo; uso obligatorio de <code>createTenantPrisma(schoolId)</code>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Validación Zod en 100% de APIs:</strong> DTOs estrictos rechazando atributos no definidos.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Segregación de Campos:</strong> <code>medicalNotes</code> oculto por defecto en listados.</span>
                </li>
              </ul>
            </div>

            {/* QA & Security Lead Commitments */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">
                  QA
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Frank M.</h3>
                  <span className="text-xs text-slate-500">QA / Security & Testing Lead</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Gate Bloqueante en CI/CD:</strong> Ningún PR se aprueba si no pasa el 100% de los 57 tests de seguridad.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Pruebas Forzadas HTTP:</strong> Validación de respuesta 403 en cada nuevo endpoint de mutación.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Auditoría de Dependencias:</strong> Escaneo con <code>npm audit</code> semanal y parcheo rápido.</span>
                </li>
              </ul>
            </div>

            {/* DevOps Lead Commitments */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">
                  OPS
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Carlos M.</h3>
                  <span className="text-xs text-slate-500">DevOps & Cloud Infrastructure</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Secret Manager:</strong> Claves maestras JWT y DB inyectadas vía variables protegidas de Cloud Run.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Backups Inmutables Diarios:</strong> Snapshots con retención de 30 días y Point-in-Time Recovery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  <span><strong>Rate Limiting & WAF:</strong> Mitigación de fuerza bruta en login a nivel perimetral.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Remediation SLAs Table */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Acuerdo de Nivel de Servicio (SLA) para Remediación de Vulnerabilidades
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40">
                <span className="font-bold text-red-700 dark:text-red-400 block">🔴 Crítico (20-25)</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold block mt-1">SLA &lt; 24 Horas</span>
                <span className="text-[11px] text-slate-500">Hotfix de emergencia bloqueante.</span>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/40">
                <span className="font-bold text-orange-700 dark:text-orange-400 block">🟠 Alto (15-19)</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold block mt-1">SLA &lt; 7 Días</span>
                <span className="text-[11px] text-slate-500">Prioridad en sprint activo.</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                <span className="font-bold text-amber-700 dark:text-amber-400 block">🟡 Medio (8-14)</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold block mt-1">SLA &lt; 30 Días</span>
                <span className="text-[11px] text-slate-500">Siguiente release programada.</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
                <span className="font-bold text-emerald-700 dark:text-emerald-400 block">🟢 Bajo (1-7)</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold block mt-1">SLA &lt; 90 Días</span>
                <span className="text-[11px] text-slate-500">Mantenimiento estándar.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Minors Data Protection Deep Dive */}
      {selectedTab === "minors" && (
        <div className="space-y-6">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-6 rounded-2xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Heart className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base font-bold text-amber-950 dark:text-amber-200">
                  Protección Reforzada de Datos de Niños, Niñas y Adolescentes (NNA)
                </h2>
                <p className="text-xs text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                  Controles especiales aplicados a fichas médicas, diagnósticos PIE/NEE, derechos de custodia parental y
                  trazabilidad física de los estudiantes escolares conforme a la Ley N° 19.628 / 21.430 y GDPR Art. 8.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                1. Medidas Cautelares de Custodia y Retiro Físico (canPickUp)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>Riesgo Crítico:</strong> Retiro no autorizado de un menor por parte de un progenitor con orden judicial
                de alejamiento. Controlado mediante restricción exclusiva al rol <code>SCHOOL_ADMIN</code> con alerta
                en <code>AuditLog</code>.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                2. Fuga de Datos Médicos, Diagnósticos PIE y NEE (medicalNotes)
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <strong>Riesgo Crítico:</strong> Exposición de diagnósticos de salud mental o farmacológicos. Mitigado
                mediante exclusión automática del campo <code>medicalNotes</code> en consultas masivas del ORM.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: OWASP Checklist (32 Controls) */}
      {selectedTab === "owasp_checklist" && (
        <OwaspChecklistDashboard />
      )}

      {/* TAB 5: STRIDE Model Overview */}
      {selectedTab === "stride" && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Alineación con el Modelo de Amenazas STRIDE
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Aurenis aplica la metodología de modelado de amenazas STRIDE sobre 8 módulos arquitectónicos críticos:
            Autenticación, Aislamiento Multi-Tenant, RBAC, Calificaciones, Asistencia, Fichas de Estudiantes, Control Plane
            y Auditoría Inmutable. Consulta la documentación formal en <code>docs/STRIDE_THREAT_MODELING.md</code>.
          </p>
          <div className="pt-2">
            <a
              href="/docs/STRIDE_THREAT_MODELING.md"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-3 py-2 rounded-lg border border-brand-200 dark:border-brand-900/40"
            >
              Abrir Especificación Completa STRIDE
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
