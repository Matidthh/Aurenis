import Link from "next/link";
import { prisma } from "@/lib/db/prisma";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge, BadgeVariant } from "@/components/ui/badge";
import {
  ShieldCheck,
  Lock,
  Database,
  Users,
  CheckCircle2,
  Clock,
  Terminal,
  Presentation,
  Flame,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SystemSecurityPage() {
  const [totalAuditLogs, totalUsers, totalSchools, recentLogs] = await Promise.all([
    prisma.auditLog.count(),
    prisma.user.count(),
    prisma.school.count(),
    prisma.auditLog.findMany({
      take: 20,
      orderBy: { timestamp: "desc" },
      include: {
        school: true,
        user: true,
      },
    }),
  ]);

  const getActionBadgeVariant = (action: string): BadgeVariant => {
    switch (action) {
      case "CREATE":
        return "success";
      case "UPDATE":
        return "brand";
      case "DELETE":
      case "SECURITY_EVENT":
        return "danger";
      case "LOGIN":
        return "warning";
      default:
        return "neutral";
    }
  };

  return (
    <Page>
      <PageHeader
        title="Seguridad y Pista de Auditoría"
        description="Supervisión técnica, bitácora de eventos administrativos, control criptográfico y aislamiento multi-tenant."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Panel General", href: "/system/dashboard" },
              { label: "Seguridad y Auditoría" },
            ]}
          />
        }
      />

      <div className="space-y-6">
        {/* BANNER DESTACADO: PRESENTACIÓN STRIDE & OWASP + DEMO EN VIVO */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-700/50 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="brand">Sustentación & Pentesting</Badge>
              <Badge variant="danger">Demo en Vivo</Badge>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Presentation className="w-5 h-5 text-indigo-400" />
              Defensa Técnica STRIDE, Controles OWASP & Hashing Seguro
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Consulte las 12 diapositivas oficiales de arquitectura Zero-Trust, el simulador de ataques en tiempo real (IDOR, BOLA, Fuerza Bruta, XSS) y el libreto de ensayo técnico para la comisión evaluadora.
            </p>
          </div>

          <Link
            href="/system/ciberseguridad-presentacion"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            Abrir Presentación & Demo
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Tarjetas de Métricas de Seguridad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Criptografía</span>
              <Lock className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">Argon2id + AES-GCM</p>
            <p className="text-xs text-slate-400">Tokens firmados HS256 (256-bit)</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">WAF & Rate Limit</span>
              <ShieldCheck className="w-4 h-4 text-brand-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">Token Bucket Activo</p>
            <p className="text-xs text-slate-400">Max 3 intentos login / 60s</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Multi-Tenant</span>
              <Database className="w-4 h-4 text-amber-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">Anti-IDOR Activo</p>
            <p className="text-xs text-slate-400">{totalSchools} colegios con scope forzado</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wider">Matriz de Roles</span>
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 dark:text-white">RBAC Estricto</p>
            <p className="text-xs text-slate-400">{totalUsers} cuentas de usuario verificadas</p>
          </div>
        </div>

        {/* Políticas de Seguridad de la Plataforma */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Controles Técnicos y Certificación QA
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Protección Anti-Tampering:</strong> Firma HS256 con clave simétrica en cookies HttpOnly y SameSite=Strict.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Prevención de Escrituras Cruzadas:</strong> Extensión Prisma bloquea transacciones con `schoolId` ajeno.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Seguridad de Endpoints:</strong> Rechazo RFC estándar 401/403 en endpoints /api/ sin fugas HTML.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-600" />
              Gobernanza y Trazabilidad Inmutable
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Registro Forense:</strong> Todo cambio en configuraciones escolares registra usuario, timestamp y diff.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Jerarquía de Permisos:</strong> Separación formal entre Administrador Global, Directores y Profesores.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <span><strong>Validaciones Zod:</strong> Esquemas de datos tipados en tiempo de ejecución para escalas académicas.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tabla de Eventos de Auditoría Recientes */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-4 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                Bitácora de Auditoría en Tiempo Real
              </h2>
              <p className="text-xs text-slate-400">
                Últimos 20 registros procesados por la infraestructura multi-tenant.
              </p>
            </div>
            <Badge variant="neutral">
              {totalAuditLogs} Registros Totales
            </Badge>
          </div>

          <div className="overflow-x-auto -mx-6 -mb-6">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Fecha y Hora</th>
                  <th className="px-6 py-3.5">Acción</th>
                  <th className="px-6 py-3.5">Entidad Afectada</th>
                  <th className="px-6 py-3.5">Usuario Responsable</th>
                  <th className="px-6 py-3.5">Ámbito Escolar</th>
                  <th className="px-6 py-3.5">Dirección IP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition text-xs">
                    <td className="px-6 py-3.5 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString("es-CL", {
                        dateStyle: "short",
                        timeStyle: "medium",
                      })}
                    </td>
                    <td className="px-6 py-3.5">
                      <Badge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 font-mono font-medium text-slate-900 dark:text-white">
                      {log.entityType}
                      {log.entityId && (
                        <span className="text-[10px] text-slate-400 block font-normal truncate max-w-[120px]">
                          ID: {log.entityId}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-slate-700 dark:text-slate-300">
                      {log.user ? (
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white">
                            {log.user.firstName} {log.user.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400">{log.user.email}</div>
                        </div>
                      ) : (
                        <span className="font-mono text-slate-400">UID: {log.userId || "Sistema"}</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      {log.school ? (
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {log.school.name}
                        </span>
                      ) : log.schoolId ? (
                        <span className="font-mono text-slate-400 text-[11px]">{log.schoolId}</span>
                      ) : (
                        <span className="text-slate-400 italic">Global</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-slate-400">
                      {log.ipAddress || "127.0.0.1"}
                    </td>
                  </tr>
                ))}
                {recentLogs.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">
                      No se registran eventos de auditoría en la base de datos todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Page>
  );
}
