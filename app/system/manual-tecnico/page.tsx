"use client";

import React, { useState } from "react";
import {
  Printer,
  FileText,
  Terminal,
  Database,
  ShieldCheck,
  Server,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers,
  KeyRound,
  Download,
  Flame,
  Activity,
  HardDrive
} from "lucide-react";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default function ManualTecnicoPage() {
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "commands" | "db" | "ops" | "security">("all");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Page>
      {/* Estilos específicos para impresión @media print */}
      <style jsx global>{`
        @media print {
          nav, aside, header, footer, .no-print, button {
            display: none !important;
          }
          body {
            background: white !important;
            color: black !important;
            font-size: 11pt !important;
          }
          .print-container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .page-break {
            page-break-before: always;
          }
          pre {
            background-color: #f1f5f9 !important;
            color: #0f172a !important;
            border: 1px solid #cbd5e1 !important;
            white-space: pre-wrap !important;
          }
        }
      `}</style>

      {/* Header Web */}
      <div className="no-print">
        <PageHeader
          title="Manual Técnico de Mantenimiento y Operaciones"
          description="Guía oficial para Administradores de Sistemas, DevOps y Desarrolladores — AURENIS SaaS v2.4.0."
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: "Panel General", href: "/system/dashboard" },
                { label: "Manual Técnico & Ops" },
              ]}
            />
          }
          action={
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Imprimir / Guardar PDF Oficial
              </button>
            </div>
          }
        />

        {/* Filtro Rápido por Categorías */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800 w-fit mb-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "all"
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Vista Completa (Oficial)
          </button>
          <button
            onClick={() => setActiveTab("commands")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "commands"
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Comandos de Ciclo de Vida
          </button>
          <button
            onClick={() => setActiveTab("ops")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "ops"
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Scripts de Mantención
          </button>
          <button
            onClick={() => setActiveTab("db")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "db"
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Base de Datos & Backup
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === "security"
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            Seguridad & Contingencias
          </button>
        </div>
      </div>

      {/* Contenedor del Documento Oficial Imprimible */}
      <div className="print-container space-y-10 max-w-5xl mx-auto bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* PORTADA INSTITUCIONAL OFICIAL */}
        <div className="border-b-2 border-slate-200 dark:border-slate-800 pb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-2xl shadow-md">
                A
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  AURENIS SAAS
                </h1>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Plataforma Integral de Gestión Escolar Multi-Tenant
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                VERSIÓN CERTIFICADA v2.4.0
              </span>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">Doc ID: AUR-MAN-OPS-2026-v2.4</p>
            </div>
          </div>

          <div className="pt-4">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Manual Técnico Oficial de Mantenimiento de Software y DevOps
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Estándar IEEE/ISO/IEC 26514 & ISO/IEC 25010 — Guía de Operaciones, Scripts de Mantenimiento Preventivo, Backups de PostgreSQL, Contingencias y Monitoreo.
            </p>
          </div>
        </div>

        {/* 1. CONTROL DE VERSIONES Y RESPONSABLES */}
        {(activeTab === "all" || activeTab === "commands") && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-lg">
              <Layers className="w-5 h-5" />
              <h3>1. Ficha Técnica y Responsabilidad del Equipo AURENIS</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Conforme al protocolo institucional obligatorio (`AGENTS.md` / `TEAM_ROLES_AND_AI_PROTOCOL.md`), cada módulo técnico y script cuenta con un responsable directo asignado:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-brand-600 dark:text-brand-400">👑 Maicol R.</span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Lead & Arquitectura / Backend</p>
                <p className="text-[11px] text-slate-500">PostgreSQL, Prisma, Multi-Tenant, APIs, Zod, Scripts de Mantenimiento.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">💻 Malcom Marcelo</span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Frontend Developer</p>
                <p className="text-[11px] text-slate-500">React 19, Next.js App Router, SSR/CSR, Hooks, Manejo de Red & Build.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-pink-600 dark:text-pink-400">🎨 Lucas P.</span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">UI / UX & Design System</p>
                <p className="text-[11px] text-slate-500">Design System, WCAG 2.1 AA, Layouts de Impresión, Responsive Design.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400">🛡️ Frank M.</span>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">QA, Testing & Seguridad</p>
                <p className="text-[11px] text-slate-500">OWASP Top 10, Pentest, Circular 482, Healthchecks, Runbooks.</p>
              </div>
            </div>
          </section>
        )}

        {/* 2. COMANDOS DE CICLO DE VIDA Y DESARROLLO */}
        {(activeTab === "all" || activeTab === "commands") && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-lg">
              <Terminal className="w-5 h-5" />
              <h3>2. Catálogo de Comandos de Ciclo de Vida y Desarrollo</h3>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "cmd-ci",
                  title: "Instalación de Dependencias Determinista",
                  cmd: "npm ci",
                  desc: "Instala exactamente las versiones fijadas en package-lock.json sin alterar el árbol de dependencias.",
                },
                {
                  id: "cmd-dev",
                  title: "Servidor de Desarrollo Local",
                  cmd: "npm run dev",
                  desc: "Inicia el servidor Next.js en puerto 3000 con soporte Hot Module Replacement (HMR).",
                },
                {
                  id: "cmd-build",
                  title: "Generación de Cliente Prisma & Compilación de Producción",
                  cmd: "npm run build",
                  desc: "Ejecuta 'prisma generate' y compila todos los bundles de producción optimizados.",
                },
                {
                  id: "cmd-lint",
                  title: "Validación de Calidad de Código (ESLint)",
                  cmd: "npm run lint",
                  desc: "Audita sintaxis, tipos y reglas estrictas de Next.js/React.",
                },
                {
                  id: "cmd-test",
                  title: "Suite Integral de QA y Pruebas Automatizadas",
                  cmd: "npm test",
                  desc: "Ejecuta los tests de seguridad RBAC, validación multi-tenant, sanitización y persistencia.",
                },
              ].map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</span>
                    <button
                      onClick={() => copyToClipboard(item.cmd, item.id)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 no-print"
                    >
                      {copiedIndex === item.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedIndex === item.id ? "Copiado" : "Copiar"}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{item.desc}</p>
                  <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                    <code>{item.cmd}</code>
                  </pre>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3. SECCIÓN OFICIAL DE SCRIPTS Y COMANDOS DE MANTENCIÓN */}
        {(activeTab === "all" || activeTab === "ops") && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-lg">
              <RefreshCw className="w-5 h-5" />
              <h3>3. Scripts y Comandos Oficiales de Mantenimiento Preventivo / Correctivo</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Scripts especializados integrados en el pipeline de ingeniería para garantizar alta disponibilidad y salud del clúster:
            </p>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Diagnóstico y Healthcheck en Vivo (SysAdmins)
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("npm run maint:healthcheck", "maint-health")}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 no-print"
                  >
                    {copiedIndex === "maint-health" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copiar comando
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Verifica conectividad y latencia con PostgreSQL, evalúa variables de entorno críticas, valida consistencia de la bitácora `AuditLog` y audita uso de memoria del proceso.
                </p>
                <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                  <code>npm run maint:healthcheck</code>
                </pre>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Rutina de Mantenimiento y Optimización de Base de Datos
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("npm run maint:db-ops", "maint-db")}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-brand-600 no-print"
                  >
                    {copiedIndex === "maint-db" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copiar comando
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Analiza cardinalidad de registros, valida ausencia de entidades huérfanas y emite recomendaciones de `VACUUM ANALYZE` según umbrales de tuplas.
                </p>
                <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                  <code>npm run maint:db-ops</code>
                </pre>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Respaldo Automatizado de Base de Datos con Checksum SHA-256
                    </span>
                  </div>
                  <button
                    onClick={() => copyToClipboard("npm run maint:backup", "maint-backup")}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-brand-600 no-print"
                  >
                    {copiedIndex === "maint-backup" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copiar comando
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Genera volcado binario comprimido (`pg_dump -Fc`), calcula suma de verificación criptográfica SHA-256 y depura respaldos que excedan 30 días de antigüedad.
                </p>
                <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto">
                  <code>npm run maint:backup</code>
                </pre>
              </div>
            </div>
          </section>
        )}

        {/* 4. BASE DE DATOS Y GESTIÓN DE MIGRACIONES */}
        {(activeTab === "all" || activeTab === "db") && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-lg">
              <Database className="w-5 h-5" />
              <h3>4. Operaciones de Migración y Mantenimiento de PostgreSQL</h3>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3">Comando</th>
                    <th className="p-3">Script</th>
                    <th className="p-3">Propósito y Acción Operativa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">npm run db:migrate:status</td>
                    <td className="p-3 text-brand-600">scripts/migrate-status.ts</td>
                    <td className="p-3 font-sans">Consulta el estado de sincronización entre esquema Prisma y base de datos.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">npm run db:migrate:deploy</td>
                    <td className="p-3 text-brand-600">scripts/migrate-deploy.ts</td>
                    <td className="p-3 font-sans">Aplica migraciones pendientes en producción de forma no interactiva (CI/CD).</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">npm run db:migrate:rollback</td>
                    <td className="p-3 text-amber-600">scripts/migrate-rollback.ts</td>
                    <td className="p-3 font-sans">Reversión asistida de esquemas en caso de fallo de despliegue.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">npm run db:verify:indexes</td>
                    <td className="p-3 text-emerald-600">scripts/verify-indexes.ts</td>
                    <td className="p-3 font-sans">Verifica la existencia y salud de índices B-Tree en `schoolId`, `email` y `rut`.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SQL Runbook Snippets */}
            <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 space-y-2">
              <span className="text-xs font-bold text-brand-400">SQL Runbook: Mantenimiento Semanal de PostgreSQL</span>
              <pre className="font-mono text-xs overflow-x-auto text-slate-300">
{`-- 1. Actualización de estadísticas del planificador de consultas
ANALYZE VERBOSE;

-- 2. Limpieza de tuplas muertas sin bloqueo de lectura
VACUUM (VERBOSE, ANALYZE);

-- 3. Reindexación concurrente de tablas principales
REINDEX TABLE CONCURRENTLY "User";
REINDEX TABLE CONCURRENTLY "Student";
REINDEX TABLE CONCURRENTLY "Grade";
REINDEX TABLE CONCURRENTLY "AuditLog";`}
              </pre>
            </div>
          </section>
        )}

        {/* 5. SEGURIDAD OPERATIVA Y ROTACIÓN DE SECRETOS */}
        {(activeTab === "all" || activeTab === "security") && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-lg">
              <KeyRound className="w-5 h-5" />
              <h3>5. Seguridad Operativa, Rotación de Secretos y Cumplimiento Normativo</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Rotación de Clave Maestra JWT (Zero-Downtime)
                </span>
                <p className="text-xs text-slate-500">
                  1. Generar token criptográfico: <code className="text-brand-600 font-mono">{"crypto.randomBytes(64).toString('hex')"}</code><br/>
                  2. Asignar clave anterior a <code className="text-brand-600 font-mono">JWT_SECRET_PREVIOUS</code>.<br/>
                  3. Inyectar nueva clave en <code className="text-brand-600 font-mono">JWT_SECRET</code> (Ventana de gracia de 8 horas).<br/>
                  4. Purgar variable de gracia tras cumplirse el ciclo de expiración.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" />
                  Retención de Datos y Circular 482
                </span>
                <p className="text-xs text-slate-500">
                  - Los registros en `AuditLog` deben preservarse mínimo 365 días para fines de auditoría escolar.<br/>
                  - En depuración de incidentes, nunca escribir datos de identificación de menores (NNA) en stdout/stderr.<br/>
                  - Los volcados de auditoría mayores a 1 año se exportan a almacenamiento cifrado en frío (GCS Archive).
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 6. DICTAMEN FINAL Y FIRMAS DE APROBACIÓN */}
        <section className="border-t-2 border-slate-200 dark:border-slate-800 pt-8 space-y-6">
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400 font-extrabold text-sm">
              <CheckCircle2 className="w-5 h-5" />
              <span>DICTAMEN DE REVISIÓN FINAL: HOMOLOGADO Y APROBADO ✅</span>
            </div>
            <p className="text-xs text-emerald-900/80 dark:text-emerald-300">
              El Manual Técnico de Mantenimiento y Operaciones de AURENIS v2.4.0 cumple con todos los criterios de aceptación del estándar institucional. Toda la suite de comandos, scripts de mantención de base de datos, healthchecks y runbooks de contingencia se encuentran probados y documentados.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 text-center">
            <div className="space-y-1">
              <div className="h-0.5 bg-slate-300 dark:bg-slate-700 w-full mb-3" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Maicol R.</p>
              <p className="text-[10px] text-slate-500">Lead & Arquitectura</p>
            </div>
            <div className="space-y-1">
              <div className="h-0.5 bg-slate-300 dark:bg-slate-700 w-full mb-3" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Malcom Marcelo</p>
              <p className="text-[10px] text-slate-500">Frontend Developer</p>
            </div>
            <div className="space-y-1">
              <div className="h-0.5 bg-slate-300 dark:bg-slate-700 w-full mb-3" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Lucas P.</p>
              <p className="text-[10px] text-slate-500">UI / UX Designer</p>
            </div>
            <div className="space-y-1">
              <div className="h-0.5 bg-slate-300 dark:bg-slate-700 w-full mb-3" />
              <p className="text-xs font-bold text-slate-900 dark:text-white">Frank M.</p>
              <p className="text-[10px] text-slate-500">QA & Seguridad</p>
            </div>
          </div>
        </section>

      </div>
    </Page>
  );
}
