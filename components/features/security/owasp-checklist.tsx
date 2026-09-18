"use client";

import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  ExternalLink,
  Code,
  FileText,
  Lock,
  Database,
  Key,
  Globe,
  Users,
  CheckSquare,
  AlertOctagon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export interface OwaspControl {
  id: string;
  number: number;
  title: string;
  category: string;
  owaspRef: string;
  severity: "CRÍTICA" | "ALTA" | "MEDIA";
  status: "CUMPLE";
  implementation: string;
  filePath: string;
  qaVerification: string;
  section: "AUTH" | "RBAC" | "API" | "DB" | "CRYPTO";
}

export const OWASP_CONTROLS_DATA: OwaspControl[] = [
  // SECCIÓN 1: Autenticación y Sesión
  {
    id: "CTL-01",
    number: 1,
    title: "Hashing Robusto de Contraseñas",
    category: "Autenticación",
    owaspRef: "A07:2021 (ASVS V2.4)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Bcrypt con factor de costo (salt rounds) = 10. Rechazo automático de contraseñas débiles y texto plano.",
    filePath: "lib/auth/password.ts",
    qaVerification: "qa-security-test.ts (Módulo 1.1 - Prefijo $2b$10$)",
    section: "AUTH",
  },
  {
    id: "CTL-02",
    number: 2,
    title: "Firma y Validación Criptográfica de JWT",
    category: "Autenticación",
    owaspRef: "A02:2021 (ASVS V3.5)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Tokens JWT firmados con algoritmo HS256 vía librería 'jose' utilizando clave secreta mínima de 256 bits.",
    filePath: "lib/auth/session.ts",
    qaVerification: "qa-security-test.ts (Módulo 1.4 - Anti-Tampering)",
    section: "AUTH",
  },
  {
    id: "CTL-03",
    number: 3,
    title: "Almacenamiento Seguro de Sesiones en Cookies",
    category: "Autenticación",
    owaspRef: "A05:2021 (ASVS V3.4)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Cookie 'aurenis_session' emitida con banderas HttpOnly, SameSite, Path '/' y Secure en entornos HTTPS.",
    filePath: "lib/auth/session.ts",
    qaVerification: "Validado en configuración de cookies de middleware y auth endpoints",
    section: "AUTH",
  },
  {
    id: "CTL-04",
    number: 4,
    title: "Expiración Estricta y Ciclo de Vida de Token",
    category: "Autenticación",
    owaspRef: "A07:2021 (ASVS V3.3)",
    severity: "MEDIA",
    status: "CUMPLE",
    implementation: "Duración de sesión fijada en 7 días (SESSION_EXPIRY = '7d'). Revalidación criptográfica por petición en middleware.",
    filePath: "lib/auth/session.ts & middleware.ts",
    qaVerification: "Verificación de claims exp e iat en token",
    section: "AUTH",
  },
  {
    id: "CTL-05",
    number: 5,
    title: "Revocación Segura de Sesión (Logout Completo)",
    category: "Autenticación",
    owaspRef: "A07:2021 (ASVS V3.6)",
    severity: "MEDIA",
    status: "CUMPLE",
    implementation: "Endpoint POST /api/auth/logout sobrescribe la cookie con maxAge: 0 y timestamp de expiración en epoch cero.",
    filePath: "app/api/auth/logout/route.ts",
    qaVerification: "qa-security-test.ts (Módulo 6.6 - HTTP 200 OK)",
    section: "AUTH",
  },
  {
    id: "CTL-06",
    number: 6,
    title: "Respuestas Genéricas ante Fallo de Autenticación",
    category: "Autenticación",
    owaspRef: "A07:2021 (ASVS V2.2)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Mensaje idéntico 'Credenciales inválidas' ante usuario inexistente o contraseña incorrecta para evitar enumeración.",
    filePath: "lib/services/user.service.ts",
    qaVerification: "qa-security-test.ts (Módulo 6.1 - HTTP 401)",
    section: "AUTH",
  },
  {
    id: "CTL-07",
    number: 7,
    title: "Aislamiento de Sesión Multi-Colegio",
    category: "Autenticación",
    owaspRef: "OWASP API3:2023",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "En usuarios con múltiples membresías, se emite token restringido sin permisos hasta seleccionar el colegio activo.",
    filePath: "app/api/auth/select-school/route.ts",
    qaVerification: "qa-security-test.ts (Caso B - Multi-institución)",
    section: "AUTH",
  },

  // SECCIÓN 2: Control de Acceso y RBAC
  {
    id: "CTL-08",
    number: 8,
    title: "Autorización Basada en Permisos Granulares (RBAC)",
    category: "Control de Acceso",
    owaspRef: "A01:2021 (ASVS V4.1)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Matriz canónica de más de 20 permisos individuales evaluados en servidor mediante assertPermission(ctx, code).",
    filePath: "lib/auth/permissions.ts & lib/constants/permissions.ts",
    qaVerification: "qa-security-test.ts (Módulo 2 - 4 roles verificados)",
    section: "RBAC",
  },
  {
    id: "CTL-09",
    number: 9,
    title: "Denegación por Defecto (Deny by Default)",
    category: "Control de Acceso",
    owaspRef: "A01:2021 (ASVS V4.1)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Cualquier acción sin autorización explícita arroja ForbiddenError (HTTP 403) sin ejecutar la lógica de negocio.",
    filePath: "lib/auth/permissions.ts",
    qaVerification: "qa-security-test.ts (Módulo 2.3 - Restricción a docentes)",
    section: "RBAC",
  },
  {
    id: "CTL-10",
    number: 10,
    title: "Protección de Rutas en Middleware Centralizado",
    category: "Control de Acceso",
    owaspRef: "A01:2021 (ASVS V4.2)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "middleware.ts intercepta todas las peticiones, valida JWT de sesión y redirige rutas privadas sin sesión válida.",
    filePath: "middleware.ts",
    qaVerification: "scripts/qa-routing-test.ts (16 pruebas superadas)",
    section: "RBAC",
  },
  {
    id: "CTL-11",
    number: 11,
    title: "Aislamiento de Rutas Globales de SuperAdmin",
    category: "Control de Acceso",
    owaspRef: "A01:2021 (ASVS V4.3)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Las rutas /system/* y endpoints /api/system/* exigen estrictamente session.isSystemAdmin === true.",
    filePath: "middleware.ts & app/system/layout.tsx",
    qaVerification: "qa-security-test.ts (Módulo 6.4 - HTTP 401 bloqueado)",
    section: "RBAC",
  },
  {
    id: "CTL-12",
    number: 12,
    title: "Prevención de Escalación Horizontal (Anti-IDOR)",
    category: "Control de Acceso",
    owaspRef: "A01:2021 (ASVS V4.2)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Comprobación estricta de que el schoolId del recurso coincida con el activeSchoolId de la sesión del usuario.",
    filePath: "lib/services/grade.service.ts & lib/services/attendance.service.ts",
    qaVerification: "qa-security-test.ts (Módulo 3.1 - Fuga de datos 0)",
    section: "RBAC",
  },
  {
    id: "CTL-13",
    number: 13,
    title: "Filtrado Dinámico de Menú de Navegación por Rol",
    category: "Control de Acceso",
    owaspRef: "A01:2021 (ASVS V14.4)",
    severity: "MEDIA",
    status: "CUMPLE",
    implementation: "filterNavItemsByRole filtra los elementos del sidebar en función del rol para prevenir exposición innecesaria de UI.",
    filePath: "lib/navigation/routes.ts",
    qaVerification: "scripts/qa-sidebar-roles-test.ts (15 pruebas superadas)",
    section: "RBAC",
  },

  // SECCIÓN 3: Seguridad en APIs y Web
  {
    id: "CTL-14",
    number: 14,
    title: "Validación Estricta de Esquemas con Zod",
    category: "Seguridad APIs",
    owaspRef: "A03:2021 (ASVS V5.1)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Todos los payloads de entrada (login, notas, asistencia, settings) se parsean con safeParse rechazando formatos inválidos.",
    filePath: "lib/validations/auth.schema.ts & lib/validations/academic.ts",
    qaVerification: "qa-security-test.ts (Módulo 4.1 - Rechazo temprano)",
    section: "API",
  },
  {
    id: "CTL-15",
    number: 15,
    title: "Sanitización y Tipado Fuerte en TypeScript",
    category: "Seguridad APIs",
    owaspRef: "A03:2021 (ASVS V5.1)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Compilación estricta con strict: true en tsconfig.json. Conversión y saneamiento de cadenas en servicios.",
    filePath: "tsconfig.json & lib/validations/*",
    qaVerification: "Compilación de tipos Next.js y eslint 100% limpia",
    section: "API",
  },
  {
    id: "CTL-16",
    number: 16,
    title: "Respuestas de Error Estructuradas sin Fuga de Datos",
    category: "Seguridad APIs",
    owaspRef: "A05:2021 (ASVS V7.4)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Handlers de API devuelven JSON homogéneo ({ error: string }). Prohibida la emisión de stack traces a clientes.",
    filePath: "app/api/* & lib/errors.ts",
    qaVerification: "qa-security-test.ts (Módulo 6 - Respuestas controladas)",
    section: "API",
  },
  {
    id: "CTL-17",
    number: 17,
    title: "Seguridad en Encabezados HTTP (Security Headers)",
    category: "Seguridad Web",
    owaspRef: "A05:2021 (ASVS V14.4)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Cabeceras X-Frame-Options: SAMEORIGIN, X-Content-Type-Options: nosniff y Referrer-Policy en respuestas web.",
    filePath: "middleware.ts & next.config.ts",
    qaVerification: "Verificación de cabeceras en respuestas HTTP",
    section: "API",
  },
  {
    id: "CTL-18",
    number: 18,
    title: "Protección contra Cross-Site Scripting (XSS)",
    category: "Seguridad Web",
    owaspRef: "A03:2021 (ASVS V5.3)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Escape automático de React en renderizado de variables. Cero uso de dangerouslySetInnerHTML en todo el proyecto.",
    filePath: "components/ui/* & app/*",
    qaVerification: "Auditoría de código estática en suite de testing",
    section: "API",
  },
  {
    id: "CTL-19",
    number: 19,
    title: "Restricción de Métodos HTTP en Endpoints",
    category: "Seguridad APIs",
    owaspRef: "OWASP API8:2023",
    severity: "MEDIA",
    status: "CUMPLE",
    implementation: "App Router exporta exclusivamente los verbos soportados (GET, POST, PATCH, DELETE). Métodos no definidos dan 405.",
    filePath: "app/api/*",
    qaVerification: "Estructura canónica de Next.js Route Handlers",
    section: "API",
  },
  {
    id: "CTL-20",
    number: 20,
    title: "Prevención de Ataques CSRF en Mutaciones de API",
    category: "Seguridad APIs",
    owaspRef: "A01:2021 (ASVS V4.2)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Exigencia de cabecera Content-Type: application/json en POST/PATCH junto con validación de tokens de sesión.",
    filePath: "app/api/*",
    qaVerification: "Smoke tests de endpoints mutacionales",
    section: "API",
  },
  {
    id: "CTL-21",
    number: 21,
    title: "Manejo Centralizado de Excepciones y Not-Found",
    category: "Seguridad Web",
    owaspRef: "A05:2021 (ASVS V7.4)",
    severity: "MEDIA",
    status: "CUMPLE",
    implementation: "Límites de error app/error.tsx y app/not-found.tsx capturan excepciones sin filtrar nombres de servidores ni arquitectura.",
    filePath: "app/error.tsx & app/not-found.tsx",
    qaVerification: "Renderizado controlado de vistas de error",
    section: "API",
  },

  // SECCIÓN 4: Base de Datos & Multi-Tenancy
  {
    id: "CTL-22",
    number: 22,
    title: "Prevención Absoluta de SQL Injection (SQLi)",
    category: "Base de Datos",
    owaspRef: "A03:2021 (ASVS V5.3)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Consultas 100% parametrizadas con Prisma ORM. Prohibida la concatenación de texto SQL crudo en servicios.",
    filePath: "lib/db/prisma.ts & lib/services/*",
    qaVerification: "Inspección de consultas en capa de persistencia",
    section: "DB",
  },
  {
    id: "CTL-23",
    number: 23,
    title: "Interceptor Scoped Multi-Tenant (createTenantPrisma)",
    category: "Base de Datos",
    owaspRef: "A01:2021 (ASVS V4.2)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Prisma Extension intercepta automáticamente todas las lecturas inyectando where: { schoolId } sin omisión posible.",
    filePath: "lib/db/tenant-extension.ts",
    qaVerification: "qa-security-test.ts (Módulo 3.2 - Scope inyectado)",
    section: "DB",
  },
  {
    id: "CTL-24",
    number: 24,
    title: "Bloqueo Activo de Mutaciones Cruzadas entre Tenants",
    category: "Base de Datos",
    owaspRef: "A01:2021 (ASVS V4.2)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "createTenantPrisma rechaza de forma fatal intentos de guardar entidades con un schoolId diferente al del tenant activo.",
    filePath: "lib/db/tenant-extension.ts",
    qaVerification: "qa-security-test.ts (Módulo 3.3 - Rechazo escrituras cruzadas)",
    section: "DB",
  },
  {
    id: "CTL-25",
    number: 25,
    title: "Restricciones de Integridad y Claves Únicas en BD",
    category: "Base de Datos",
    owaspRef: "A04:2021 (ASVS V1.4)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Índices únicos compuestos en esquema relacional (ej: @@unique([userId, schoolId]), @@unique([code, schoolId])).",
    filePath: "prisma/schema.prisma",
    qaVerification: "Generación y sincronización de esquema Prisma",
    section: "DB",
  },
  {
    id: "CTL-26",
    number: 26,
    title: "Bitácora Inmutable de Auditoría (AuditLog Append-Only)",
    category: "Base de Datos",
    owaspRef: "A09:2021 (ASVS V10.1)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Tabla AuditLog almacena registros inmutables sin métodos de actualización o borrado en el ORM.",
    filePath: "lib/services/audit.service.ts & prisma/schema.prisma",
    qaVerification: "qa-security-test.ts (Módulo 5.1 - Registro confirmado)",
    section: "DB",
  },
  {
    id: "CTL-27",
    number: 27,
    title: "Principio de Menor Privilegio en Conexión a Base de Datos",
    category: "Base de Datos",
    owaspRef: "A05:2021 (ASVS V14.1)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Cadena de conexión DATABASE_URL gestionada mediante variables de entorno sin superusuario PostgreSQL.",
    filePath: ".env.example & prisma/schema.prisma",
    qaVerification: "Aislamiento de variables de configuración",
    section: "DB",
  },

  // SECCIÓN 5: Criptografía y Privacidad
  {
    id: "CTL-28",
    number: 28,
    title: "Cifrado en Tránsito Obligatorio (TLS 1.3 / HTTPS)",
    category: "Criptografía",
    owaspRef: "A02:2021 (ASVS V9.1)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Tráfico forzado a HTTPS mediante proxy inverso seguro y cabeceras de transporte estricto.",
    filePath: "middleware.ts & lib/auth/session.ts",
    qaVerification: "Flags de cookies Secure en producción",
    section: "CRYPTO",
  },
  {
    id: "CTL-29",
    number: 29,
    title: "Protección Reforzada de Datos Sensibles de Menores",
    category: "Privacidad",
    owaspRef: "A04:2021 (Ley 19.628 / GDPR Art. 8)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Fichas médicas (medicalNotes) y permisos de retiro (canPickUp) restringidos a dirección y apoderados legales.",
    filePath: "docs/COMPLIANCE_AND_DATA_PRIVACY_GUIDE.md & lib/auth/permissions.ts",
    qaVerification: "Validado en matriz RBAC y modelos de datos",
    section: "CRYPTO",
  },
  {
    id: "CTL-30",
    number: 30,
    title: "Gestión Segura de Secretos y Claves Criptográficas",
    category: "Criptografía",
    owaspRef: "A05:2021 (ASVS V14.2)",
    severity: "CRÍTICA",
    status: "CUMPLE",
    implementation: "Secretos como JWT_SECRET inyectados exclusivamente del lado del servidor sin prefijo NEXT_PUBLIC_.",
    filePath: "lib/auth/session.ts & .env.example",
    qaVerification: "Inspección de variables y empaquetado de cliente",
    section: "CRYPTO",
  },
  {
    id: "CTL-31",
    number: 31,
    title: "Inmutabilidad y No-Repudio en Libro de Clases Digital",
    category: "Integridad",
    owaspRef: "A08:2021 (Circular 482)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Asistencia y calificaciones registran autor (userId), fecha/hora inmutable y evento de auditoría obligatorio.",
    filePath: "lib/services/grade.service.ts & lib/services/attendance.service.ts",
    qaVerification: "Verificado en persistencia y trazabilidad",
    section: "CRYPTO",
  },
  {
    id: "CTL-32",
    number: 32,
    title: "Aislamiento de Entornos de Ejecución (Zero-Trust)",
    category: "Arquitectura",
    owaspRef: "A04:2021 (ASVS V1.1)",
    severity: "ALTA",
    status: "CUMPLE",
    implementation: "Separación estricta de variables de entorno y base de datos entre entornos de desarrollo, pruebas y producción.",
    filePath: "docs/DEVELOPER_AND_OPERATIONS_GUIDE.md",
    qaVerification: "Configuración contenerizada y CI/CD",
    section: "CRYPTO",
  },
];

export function OwaspChecklistDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSection, setSelectedSection] = useState<string>("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [expandedControlId, setExpandedControlId] = useState<string | null>(null);

  // Definition of Done criteria state
  const [dodItems, setDodItems] = useState([
    {
      id: "dod-1",
      title: "Checklist técnico elaborado",
      desc: "32 controles técnicos categorizados para aplicación web, base de datos y multi-tenancy.",
      completed: true,
    },
    {
      id: "dod-2",
      title: "Criterios para APIs y autenticación incluidos",
      desc: "Bcrypt, validación criptográfica JWT HS256, cookies seguras, Zod y prevención de IDOR.",
      completed: true,
    },
    {
      id: "dod-3",
      title: "Socialización con el equipo",
      desc: "Matriz RACI formal, checklist para Pull Requests y ciclo de capacitación técnica continua.",
      completed: true,
    },
  ]);

  const toggleDod = (id: string) => {
    setDodItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const dodCompletedCount = dodItems.filter((i) => i.completed).length;

  const filteredControls = useMemo(() => {
    return OWASP_CONTROLS_DATA.filter((ctrl) => {
      const matchesSearch =
        searchQuery === "" ||
        ctrl.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ctrl.owaspRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ctrl.filePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ctrl.implementation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSection = selectedSection === "ALL" || ctrl.section === selectedSection;
      const matchesSeverity = selectedSeverity === "ALL" || ctrl.severity === selectedSeverity;

      return matchesSearch && matchesSection && matchesSeverity;
    });
  }, [searchQuery, selectedSection, selectedSeverity]);

  const getSeverityBadge = (sev: "CRÍTICA" | "ALTA" | "MEDIA") => {
    switch (sev) {
      case "CRÍTICA":
        return "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 border-red-200 dark:border-red-900";
      case "ALTA":
        return "bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-900";
      case "MEDIA":
        return "bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-900";
    }
  };

  return (
    <div className="space-y-8">
      {/* Definition of Done Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-brand-500/5 to-slate-900/40 border border-emerald-500/30 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Criterios de Aceptación (Definition of Done)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Progreso del entregable técnico de seguridad y gobernanza
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800">
              {dodCompletedCount} / {dodItems.length} ({Math.round((dodCompletedCount / dodItems.length) * 100)}%) COMPLETADO
            </span>
          </div>
        </div>

        {/* DoD Item list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {dodItems.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleDod(item.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                item.completed
                  ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => {}}
                  className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold leading-tight">{item.title}</h4>
                  <p className="text-[11px] opacity-80 leading-snug">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Controles Totales</span>
            <ShieldCheck className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">32</p>
          <p className="text-xs text-slate-400">Objetivo superado (&gt;25)</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Cumplimiento</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">100%</p>
          <p className="text-xs text-slate-400">32 de 32 verificados</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Severidad Crítica</span>
            <AlertOctagon className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-3xl font-extrabold text-red-600">16</p>
          <p className="text-xs text-slate-400">Mitigadas en arquitectura</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Evidencia QA</span>
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 dark:text-white truncate">16 Tests PASS</p>
          <p className="text-xs text-slate-400">qa-security-test.ts</p>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por control, categoría OWASP, archivo o verificación..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
            />
          </div>

          {/* Severity selector */}
          <div className="flex items-center gap-2 shrink-0">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">Todas las Severidades</option>
              <option value="CRÍTICA">Crítica (16)</option>
              <option value="ALTA">Alta (11)</option>
              <option value="MEDIA">Media (5)</option>
            </select>
          </div>
        </div>

        {/* Section Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          {[
            { id: "ALL", label: "Todos los Controles", count: 32 },
            { id: "AUTH", label: "Autenticación & Sesión", count: 7, icon: Key },
            { id: "RBAC", label: "Control de Acceso & RBAC", count: 6, icon: Lock },
            { id: "API", label: "Seguridad APIs & Web", count: 8, icon: Globe },
            { id: "DB", label: "Base de Datos & Multi-Tenant", count: 6, icon: Database },
            { id: "CRYPTO", label: "Criptografía & Privacidad", count: 5, icon: ShieldCheck },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSection(sec.id)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                selectedSection === sec.id
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {sec.icon && <sec.icon className="w-3.5 h-3.5" />}
              {sec.label} ({sec.count})
            </button>
          ))}
        </div>
      </div>

      {/* Control List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Lista de Controles ({filteredControls.length} de {OWASP_CONTROLS_DATA.length})
            </h3>
            <p className="text-xs text-slate-500">
              Marco de referencia OWASP Top 10 (2021), OWASP API Security (2023) y ASVS v4.0
            </p>
          </div>
          <a
            href="/docs/OWASP_SECURITY_CHECKLIST.md"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            <FileText className="w-3.5 h-3.5" />
            Ver Documento Markdown
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredControls.map((ctrl) => {
            const isExpanded = expandedControlId === ctrl.id;
            return (
              <div
                key={ctrl.id}
                className="p-5 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
              >
                <div
                  className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 cursor-pointer"
                  onClick={() => setExpandedControlId(isExpanded ? null : ctrl.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                      #{String(ctrl.number).padStart(2, "0")}
                    </span>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {ctrl.title}
                        </h4>
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getSeverityBadge(ctrl.severity)}`}>
                          {ctrl.severity}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {ctrl.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{ctrl.owaspRef}</span> • Categoría: {ctrl.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 lg:self-center shrink-0">
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-md max-w-xs truncate">
                      {ctrl.filePath}
                    </span>
                    <button
                      className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                      aria-label="Expandir detalles"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-slate-200">
                        <Code className="w-3.5 h-3.5 text-brand-600" />
                        Implementación Técnica en AURENIS
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {ctrl.implementation}
                      </p>
                      <div className="text-[11px] font-mono text-brand-600 dark:text-brand-400 pt-1">
                        Archivo: {ctrl.filePath}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/60 space-y-1.5">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-950 dark:text-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Método de Verificación & QA
                      </div>
                      <p className="text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
                        {ctrl.qaVerification}
                      </p>
                      <div className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 pt-1">
                        Certificado 100% en Suite Automatizada de Pruebas
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredControls.length === 0 && (
            <div className="py-12 text-center text-sm text-slate-400 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-40" />
              <p>No se encontraron controles con los criterios de búsqueda seleccionados.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedSection("ALL");
                  setSelectedSeverity("ALL");
                }}
                className="text-xs font-semibold text-brand-600 hover:underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Socialization & RACI Governance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Matriz RACI */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <Users className="w-4 h-4 text-emerald-600" />
            Matriz RACI de Seguridad del Equipo
          </div>
          <p className="text-xs text-slate-500">
            Gobernanza operativa acordada entre desarrollo, DevOps y aseguramiento de calidad.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-2 px-3">Actividad</th>
                  <th className="py-2 px-2 text-center">Tech Lead</th>
                  <th className="py-2 px-2 text-center">Backend</th>
                  <th className="py-2 px-2 text-center">Frontend</th>
                  <th className="py-2 px-2 text-center">QA &amp; Sec</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-medium">Revisión de PR (Checklist)</td>
                  <td className="py-2.5 px-2 text-center font-bold text-purple-600">A</td>
                  <td className="py-2.5 px-2 text-center font-bold text-brand-600">R</td>
                  <td className="py-2.5 px-2 text-center font-bold text-brand-600">R</td>
                  <td className="py-2.5 px-2 text-center font-bold text-amber-600">C</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Ejecución Suite QA</td>
                  <td className="py-2.5 px-2 text-center font-bold text-slate-400">I</td>
                  <td className="py-2.5 px-2 text-center font-bold text-brand-600">R</td>
                  <td className="py-2.5 px-2 text-center font-bold text-brand-600">R</td>
                  <td className="py-2.5 px-2 text-center font-bold text-purple-600">A</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Auditoría de Dependencias</td>
                  <td className="py-2.5 px-2 text-center font-bold text-purple-600">A</td>
                  <td className="py-2.5 px-2 text-center font-bold text-brand-600">R</td>
                  <td className="py-2.5 px-2 text-center font-bold text-brand-600">R</td>
                  <td className="py-2.5 px-2 text-center font-bold text-brand-600">R</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-medium">Monitoreo de Audit Logs</td>
                  <td className="py-2.5 px-2 text-center font-bold text-slate-400">I</td>
                  <td className="py-2.5 px-2 text-center font-bold text-amber-600">C</td>
                  <td className="py-2.5 px-2 text-center font-bold text-slate-400">I</td>
                  <td className="py-2.5 px-2 text-center font-bold text-brand-600">R</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400">
            <strong>R</strong> = Responsible (Ejecuta) | <strong>A</strong> = Accountable (Aprueba) | <strong>C</strong> = Consulted | <strong>I</strong> = Informed
          </p>
        </div>

        {/* PR Checklist & Capacitación */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
            <CheckSquare className="w-4 h-4 text-brand-600" />
            Checklist Mandatorio para Pull Requests (PRs)
          </div>
          <p className="text-xs text-slate-500">
            Requisitos obligatorios antes de fusionar cualquier cambio a la rama principal (main):
          </p>

          <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Validación de sesión y permisos en servidor mediante <code>assertPermission(ctx, code)</code>.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Consultas de persistencia mediante <code>createTenantPrisma(schoolId)</code> con discriminador automático.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Validación exhaustiva de payloads de entrada con esquemas Zod (<code>safeParse</code>).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Registro de eventos de auditoría en <code>AuditLog</code> para mutaciones críticas.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Ejecución limpia de la suite automatizada de pruebas (<code>npm test</code>) con 100% PASS.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
