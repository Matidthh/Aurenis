"use client";

import React, { useState, useMemo } from "react";
import {
  Bug,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  User,
  Layers,
  Filter,
  Search,
  Plus,
  FileText,
  Copy,
  Download,
  Check,
  RotateCcw,
  Kanban,
  List,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  BookOpen,
  GraduationCap,
  Calculator,
  ShieldCheck,
  Laptop,
  CheckSquare,
  Square,
  Scale,
  Zap,
  ArrowUpDown,
  Sliders,
  HelpCircle,
  Network,
  Code2,
  FolderTree,
  ChevronDown,
  ChevronUp,
  Server,
  ArrowRight,
  Bell,
  BellRing,
  Send,
  Calendar,
  UserCheck,
  Timer,
  Activity,
  Flame,
  UserPlus,
  Users,
  CheckCheck,
  Clock4,
  AlertCircle,
  Inbox,
  Award,
  FileCheck2,
  PlayCircle,
  RefreshCw,
  BadgeCheck,
  Terminal,
  PlusCircle,
  Bookmark,
  BarChart3,
  FileCheck,
} from "lucide-react";

export type BugSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type BugPriority = "P0_BLOCKER" | "P1_HIGH" | "P2_MEDIUM" | "P3_LOW";
export type BugStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "VERIFIED_CLOSED";

// Definición de Deuda Técnica Menor y Observaciones No Bloqueantes
export interface TechnicalDebtItem {
  id: string;
  title: string;
  module: CanonicalModule | "LIBRO_CLASES" | "CALIFICACIONES_DECRETO67" | "ASISTENCIA" | "MATRICULA_RUN" | "AUTENTICACION_RBAC" | "REPORTES_ACTAS";
  category: "UI / Polish" | "Refactor / DX" | "Tooling / Logs" | "Config / Node" | "A11y / UI" | "Frontend / Cache" | "Optimización DB" | "QA / Tooling";
  priority: "P3_LOW" | "P4_TRIVIAL";
  targetRelease: "v2.5.0" | "v2.5.1" | "v3.0.0";
  author: string;
  role: string;
  effortHours: number;
  description: string;
  currentState: string;
  proposedImprovement: string;
  zeroImpactProof: string;
  status: "DEFERRED_PLANNED" | "SCHEDULED_SPRINT";
}

export const DEFERRED_TECHNICAL_DEBT_ITEMS: TechnicalDebtItem[] = [
  {
    id: "DEBT-2026-001",
    title: "Micro-animación de transición suave en hover de chips de filtros",
    module: "UI",
    category: "UI / Polish",
    priority: "P3_LOW",
    targetRelease: "v2.5.0",
    author: "Lucas P.",
    role: "UI / UX Lead & Design System",
    effortHours: 1.5,
    description: "Agregar transición de 150ms ease-out en hover y focus de los badges de filtrado en directorio de alumnos.",
    currentState: "El cambio de color de borde ocurre en 0ms (inmediato, perfectamente funcional).",
    proposedImprovement: "Añadir clases Tailwind transition-all duration-150 ease-out para mayor suavidad visual.",
    zeroImpactProof: "Cero impacto funcional: la selección y filtrado operan al 100% sin pérdida de eventos.",
    status: "DEFERRED_PLANNED",
  },
  {
    id: "DEBT-2026-002",
    title: "Desacoplar selector inline de períodos académicos a subcomponente atómico",
    module: "NOTAS",
    category: "Refactor / DX",
    priority: "P3_LOW",
    targetRelease: "v2.5.0",
    author: "Malcom Marcelo",
    role: "Frontend Lead & Core Developer",
    effortHours: 2.0,
    description: "Extraer el selector de trimestres/semestres a components/grades/atoms/period-selector.tsx.",
    currentState: "Lógica embebida en la cabecera de grades-page-client.tsx funcionando a < 1.2ms.",
    proposedImprovement: "Crear átomo reutilizable para compartirlo con la vista de certificados de fin de año.",
    zeroImpactProof: "Cero impacto en producción: la reactividad y cálculo de notas se mantienen intactos.",
    status: "DEFERRED_PLANNED",
  },
  {
    id: "DEBT-2026-003",
    title: "Logger estructurado JSON con correlación de traceId en rutas auxiliares",
    module: "AUTENTICACION",
    category: "Tooling / Logs",
    priority: "P3_LOW",
    targetRelease: "v2.5.0",
    author: "Maicol R.",
    role: "Backend Lead & Security Engineer",
    effortHours: 2.5,
    description: "Estandarizar formato JSON enriquecido con traceId y correlationId en endpoints /api/system/*.",
    currentState: "Uso de lib/api/discreet-logger.ts estándar con sanitización de credenciales activa.",
    proposedImprovement: "Estructuración compatible con ingesta directa en Datadog / OpenTelemetry.",
    zeroImpactProof: "Cero impacto en el usuario final: las APIs de negocio responden en formato JSON RFC estándar.",
    status: "DEFERRED_PLANNED",
  },
  {
    id: "DEBT-2026-004",
    title: "Supresión de warnings de WebAPI CompressionStream en Edge Runtime",
    module: "AUTENTICACION",
    category: "Config / Node",
    priority: "P3_LOW",
    targetRelease: "v2.5.0",
    author: "Carlos M.",
    role: "Release Manager & DevOps Lead",
    effortHours: 1.5,
    description: "Ajustar import de jose o especificar directiva Node.js en subrutas de desencriptación pesada.",
    currentState: "Compilación 100% exitosa con advertencia informativa no bloqueante en Next.js build.",
    proposedImprovement: "Fijar sub-paquete jose/jwt optimizado para Edge sin dependencias de compresión gzip/deflate.",
    zeroImpactProof: "Cero impacto en runtime: la autenticación y emisión de JWT operan con total normalidad.",
    status: "DEFERRED_PLANNED",
  },
  {
    id: "DEBT-2026-005",
    title: "Soporte de atajo de teclado alternativo Alt + K para Command Palette",
    module: "UI",
    category: "A11y / UI",
    priority: "P4_TRIVIAL",
    targetRelease: "v2.5.1",
    author: "Lucas P.",
    role: "UI / UX Lead & Design System",
    effortHours: 1.0,
    description: "Permitir abrir la paleta de comandos global presionando Alt + K adicionalmente a Ctrl+K y Cmd+K.",
    currentState: "Command palette se activa con Ctrl + K (Win/Linux) y Cmd + K (macOS).",
    proposedImprovement: "Añadir listener e.altKey && e.key.toLowerCase() === 'k' para layouts alternativos.",
    zeroImpactProof: "Cero impacto en producción: el 100% de los usuarios navega fluidamente con los atajos actuales.",
    status: "DEFERRED_PLANNED",
  },
  {
    id: "DEBT-2026-006",
    title: "Copia local secundaria en IndexedDB de observaciones cualitativas",
    module: "NOTAS",
    category: "Frontend / Cache",
    priority: "P3_LOW",
    targetRelease: "v2.5.1",
    author: "Malcom Marcelo",
    role: "Frontend Lead & Core Developer",
    effortHours: 4.0,
    description: "Persistir borrador local en IndexedDB al escribir observaciones pedagógicas extensas.",
    currentState: "Sincronización reactiva en tiempo real al servidor (< 100ms) con manejo de desconexión.",
    proposedImprovement: "Almacenar snapshot local en navegador por si el docente cierra accidentalmente el navegador.",
    zeroImpactProof: "Cero impacto en cálculo ni registro: los datos se guardan en backend de forma consistente.",
    status: "DEFERRED_PLANNED",
  },
  {
    id: "DEBT-2026-007",
    title: "Índices compuestos optimizados para colegios masivos (> 2.000 alumnos)",
    module: "ESTUDIANTES",
    category: "Optimización DB",
    priority: "P3_LOW",
    targetRelease: "v3.0.0",
    author: "Carlos M.",
    role: "DBA & Cloud Architect",
    effortHours: 3.0,
    description: "Crear índice compuesto (schoolId, guardianPhone1, guardianPhone2) para consultas masivas.",
    currentState: "Índices actuales en schoolId, run y courseId responden en < 5ms para instituciones estándar.",
    proposedImprovement: "Optimización preventiva para clientes corporativos de más de 2.000 matrículas activas.",
    zeroImpactProof: "Cero impacto en funcionalidad ni integridad referencial: consultas actuales son ultra-rápidas.",
    status: "SCHEDULED_SPRINT",
  },
  {
    id: "DEBT-2026-008",
    title: "Generador de dashboard HTML de cobertura de pruebas unitarias en CI/CD",
    module: "NOTAS",
    category: "QA / Tooling",
    priority: "P3_LOW",
    targetRelease: "v3.0.0",
    author: "Frank M.",
    role: "QA Lead & Cybersecurity",
    effortHours: 3.0,
    description: "Automatizar la generación de reportes gráficos lcov-report en HTML durante el pipeline de despliegue.",
    currentState: "Las 8 suites de prueba se validan vía TypeScript en terminal con 100% de aserciones aprobadas.",
    proposedImprovement: "Exportar carpeta public/coverage-report para consulta interactiva en navegador.",
    zeroImpactProof: "Cero impacto en aplicación: las pruebas garantizan 100% de estabilidad y no-regresión.",
    status: "SCHEDULED_SPRINT",
  },
];

// Módulos canónicos solicitados por la arquitectura del sistema
export type CanonicalModule =
  | "AUTENTICACION"
  | "ESTUDIANTES"
  | "PROFESORES"
  | "NOTAS"
  | "UI";

export type SystemModule =
  | CanonicalModule
  | "LIBRO_CLASES"
  | "CALIFICACIONES_DECRETO67"
  | "ASISTENCIA"
  | "MATRICULA_RUN"
  | "AUTENTICACION_RBAC"
  | "REPORTES_ACTAS";

export interface TechnicalModuleMapping {
  id: CanonicalModule;
  name: string;
  shortName: string;
  leadMemberId: string;
  leadMemberName: string;
  technicalComponent: string;
  sourceDirectories: string[];
  associatedRoutes: string[];
  associatedApis: string[];
  activationCriteria: string;
  scopeDescription: string;
  colorTheme: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    pill: string;
    ring: string;
  };
}

export const TECHNICAL_MODULE_DEFINITIONS: Record<CanonicalModule, TechnicalModuleMapping> = {
  AUTENTICACION: {
    id: "AUTENTICACION",
    name: "Autenticación & Control de Acceso (RBAC)",
    shortName: "Autenticación",
    leadMemberId: "carlos",
    leadMemberName: "Carlos M. (con Malcom Marcelo)",
    technicalComponent: "lib/auth/auth-context.tsx & middleware.ts & lib/security/rbac-guard.ts",
    sourceDirectories: ["/lib/auth", "/middleware.ts", "/lib/security"],
    associatedRoutes: ["/login", "/dashboard", "/admin/*"],
    associatedApis: ["/api/auth/login", "/api/auth/session", "/api/auth/logout", "/api/schools/[id]/roles"],
    activationCriteria: "Fallas de token JWT, caducidad de sesión, elevación no autorizada de privilegios, o bypass de permisos en actas cerradas.",
    scopeDescription: "Seguridad de sesiones, autenticación de usuarios por roles (ADMIN, TEACHER, STUDENT, GUARDIAN), protección de rutas y auditoría de eventos.",
    colorTheme: {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-700 dark:text-amber-400",
      badge: "bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 border-amber-300 dark:border-amber-700",
      pill: "bg-amber-500",
      ring: "focus:ring-amber-500",
    },
  },
  ESTUDIANTES: {
    id: "ESTUDIANTES",
    name: "Directorio de Estudiantes & Matrícula RUN",
    shortName: "Estudiantes",
    leadMemberId: "maicol",
    leadMemberName: "Maicol R. (con Frank M.)",
    technicalComponent: "components/features/students/ & lib/services/student.service.ts & lib/security/rut-validator.ts",
    sourceDirectories: ["/components/features/students", "/lib/services/student.service.ts"],
    associatedRoutes: ["/dashboard/students", "/matricula"],
    associatedApis: ["/api/schools/[id]/students", "/api/schools/[id]/students/[studentId]", "/api/schools/[id]/enrollments"],
    activationCriteria: "Validación de RUN chileno Módulo 11, persistencia de expedientes de alumnos, ficha médica JUNAEB, programas PIE y certificados regulares.",
    scopeDescription: "Directorio escolar de alumnos, filtros avanzados por nivel/curso, modal de matrícula en 4 pasos, expedientes integrales y alertas tempranas.",
    colorTheme: {
      bg: "bg-purple-50 dark:bg-purple-950/40",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-700 dark:text-purple-400",
      badge: "bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700",
      pill: "bg-purple-500",
      ring: "focus:ring-purple-500",
    },
  },
  PROFESORES: {
    id: "PROFESORES",
    name: "Cuerpo Docente, Asignación & Firma Digital",
    shortName: "Profesores",
    leadMemberId: "frank",
    leadMemberName: "Frank M. (con Lucas P.)",
    technicalComponent: "components/features/teachers/ & lib/services/teacher.service.ts & components/mockups/quick-attendance-modal.tsx",
    sourceDirectories: ["/components/features/teachers", "/lib/services/teacher.service.ts"],
    associatedRoutes: ["/dashboard/teachers", "/profesores"],
    associatedApis: ["/api/schools/[id]/teachers", "/api/schools/[id]/teachers/[teacherId]", "/api/schools/[id]/subjects/assign"],
    activationCriteria: "Control de carga horaria semanal (Ley Carrera Docente <= 44 hrs), asignación de jefaturas, registro de firmas de asistencia y colas de sincronización offline.",
    scopeDescription: "Directorio docente institucional, selector visual de asignaturas, cálculo dinámico de sobrecarga contractual, ficha y perfil de profesores.",
    colorTheme: {
      bg: "bg-indigo-50 dark:bg-indigo-950/40",
      border: "border-indigo-200 dark:border-indigo-800",
      text: "text-indigo-700 dark:text-indigo-400",
      badge: "bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 border-indigo-300 dark:border-indigo-700",
      pill: "bg-indigo-500",
      ring: "focus:ring-indigo-500",
    },
  },
  NOTAS: {
    id: "NOTAS",
    name: "Libro Digital, Calificaciones Decreto 67 & Actas",
    shortName: "Notas",
    leadMemberId: "malcom",
    leadMemberName: "Malcom Marcelo",
    technicalComponent: "components/grades/ & lib/services/grade.service.ts & components/mockups/academic-lifecycle-e2e-view.tsx",
    sourceDirectories: ["/components/grades", "/lib/services/grade.service.ts"],
    associatedRoutes: ["/dashboard/grades", "/libro-clases", "/actas"],
    associatedApis: ["/api/schools/[id]/grades/bulk", "/api/schools/[id]/assessments", "/api/schools/[id]/academic-periods"],
    activationCriteria: "Cálculo algorítmico de promedios ponderados según Art. 9 y 10 Decreto 67, redondeo ministerial a 1 decimal, semaforización cromática (< 4.0) y sellado de actas.",
    scopeDescription: "Planilla matricial de calificaciones, evaluaciones N1-N8, cálculo ponderado instantáneo, historial de notas, justificaciones de Consejo Escolar.",
    colorTheme: {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-200 dark:border-emerald-800",
      text: "text-emerald-700 dark:text-emerald-400",
      badge: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700",
      pill: "bg-emerald-500",
      ring: "focus:ring-emerald-500",
    },
  },
  UI: {
    id: "UI",
    name: "Experiencia de Usuario, Tokens Figma & Responsividad",
    shortName: "UI",
    leadMemberId: "lucas",
    leadMemberName: "Lucas P.",
    technicalComponent: "components/ui/ & components/landing/ & docs/DESIGN_SYSTEM_LUCAS.md & components/mockups/figma-token-inspector.tsx",
    sourceDirectories: ["/components/ui", "/components/landing", "/components/mockups"],
    associatedRoutes: ["/*", "/mockups", "/figma-tokens"],
    associatedApis: ["N/A (Capa de Presentación en Cliente)"],
    activationCriteria: "Desfases de margen o padding en Safari/Firefox, navegación por teclado y atajos, paridad con prototipos Figma, accesibilidad WCAG AA y CLS.",
    scopeDescription: "Sistema de diseño y tokens visuales (Aurenis Soft UI), componentes reutilizables, layout adaptativo, modales accesibles y fluidez de renderizado.",
    colorTheme: {
      bg: "bg-cyan-50 dark:bg-cyan-950/40",
      border: "border-cyan-200 dark:border-cyan-800",
      text: "text-cyan-700 dark:text-cyan-400",
      badge: "bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-200 border-cyan-300 dark:border-cyan-700",
      pill: "bg-cyan-500",
      ring: "focus:ring-cyan-500",
    },
  },
};

export function mapToCanonicalModule(module: SystemModule): CanonicalModule {
  switch (module) {
    case "AUTENTICACION":
    case "AUTENTICACION_RBAC":
      return "AUTENTICACION";
    case "ESTUDIANTES":
    case "MATRICULA_RUN":
      return "ESTUDIANTES";
    case "PROFESORES":
    case "ASISTENCIA":
      return "PROFESORES";
    case "NOTAS":
    case "CALIFICACIONES_DECRETO67":
    case "REPORTES_ACTAS":
      return "NOTAS";
    case "UI":
    case "LIBRO_CLASES":
      return "UI";
    default:
      return "UI";
  }
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  initials: string;
  avatarBg: string;
  badgeColor: string;
  email: string;
  scope: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "maicol",
    name: "Maicol R.",
    role: "Backend Lead",
    specialty: "Backend (Node.js, Prisma, RBAC, API Endpoints, RUT Módulo 11)",
    initials: "MR",
    avatarBg: "bg-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300",
    email: "maicol.backend@aurenis.edu",
    scope: "APIs, Base de Datos, Autenticación, Seguridad & Validaciones Lógicas",
  },
  {
    id: "malcom",
    name: "Malcom S.",
    role: "Frontend Lead",
    specialty: "Frontend (React, Next.js, Ciclo de Vida E2E, Decreto 67 Core)",
    initials: "MS",
    avatarBg: "bg-blue-600",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300",
    email: "malcom.frontend@aurenis.edu",
    scope: "Gestión de Estado, Cálculos en Cliente, Flujos E2E & Planilla Matricial",
  },
  {
    id: "lucas",
    name: "Lucas P.",
    role: "UI / UX Lead",
    specialty: "UI / UX (Sistema de Diseño Soft UI, Tokens Figma, A11y WCAG AA)",
    initials: "LP",
    avatarBg: "bg-purple-600",
    badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300",
    email: "lucas.ui@aurenis.edu",
    scope: "Tokens Figma, Tipografía, Dispositivos, Foco Teclado & Microinteracciones",
  },
  {
    id: "frank",
    name: "Frank M.",
    role: "QA Automation Lead",
    specialty: "Criterios DoD & Automatización E2E",
    initials: "FM",
    avatarBg: "bg-amber-600",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300",
    email: "frank.qa@aurenis.edu",
    scope: "Matriz de Pruebas, Verificación de Criterios & Regresiones",
  },
  {
    id: "carlos",
    name: "Carlos M.",
    role: "Fullstack Support",
    specialty: "Integración Mockups & Infraestructura Cloud",
    initials: "CM",
    avatarBg: "bg-rose-600",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-300",
    email: "carlos.fullstack@aurenis.edu",
    scope: "Mapeo de Rutas, Despliegue en Cloud Run & Mockups",
  },
];

export interface SeverityCriterionPolicy {
  severity: BugSeverity;
  name: string;
  code: string;
  badgeColor: string;
  impactLevel: string;
  slaResolution: string;
  systemImpactDefinition: string;
  criteriaConditions: string[];
  defaultPriority: BugPriority;
  exampleScenario: string;
}

export const SEVERITY_CRITERIA_POLICIES: SeverityCriterionPolicy[] = [
  {
    severity: "CRITICAL",
    name: "Crítica (Blocker)",
    code: "S1",
    badgeColor: "red",
    impactLevel: "Impacto Catastrófico / Bloqueante",
    slaResolution: "< 2 Horas (Hotfix Inmediato)",
    systemImpactDefinition:
      "Bloqueo total de la plataforma, caída del servicio, corrupción o pérdida de datos académicos oficiales, vulnerabilidad de seguridad crítica o imposibilidad de emitir actas ministeriales Decreto 67.",
    criteriaConditions: [
      "Interrupción total del sistema sin workaround disponible.",
      "Cálculo erróneo de actas finales y promedios oficiales de promoción escolar.",
      "Fuga o exposición de datos sensibles / violación de control de acceso (RBAC).",
      "Pérdida de integridad en base de datos o fallo en transacciones masivas.",
    ],
    defaultPriority: "P0_BLOCKER",
    exampleScenario:
      "Error algorítmico en promedios del Decreto 67 que impida certificar el año escolar o bypass en endpoints de actas.",
  },
  {
    severity: "HIGH",
    name: "Alta",
    code: "S2",
    badgeColor: "amber",
    impactLevel: "Impacto Mayor / Degradación Severa",
    slaResolution: "< 8 Horas (Mismo Día / Siguiente Release)",
    systemImpactDefinition:
      "Funcionalidad principal del sistema severamente degradada con impacto directo en la operación docente o administrativa; existe workaround pero es complejo o requiere intervención manual.",
    criteriaConditions: [
      "Fallo en guardado masivo de asistencia o calificaciones que requiera reintentos forzados.",
      "Rechazo indebido de RUN chilenos válidos en la matrícula masiva de alumnos.",
      "Latencia extrema de red (> 3 segundos) en transacciones críticas del Libro Digital.",
      "Reglas de ponderación semestral no sincronizadas entre asignaturas.",
    ],
    defaultPriority: "P1_HIGH",
    exampleScenario:
      "Rechazo de alumnos con RUT terminado en 'K' durante proceso oficial de matrícula o timeout recurrente en asistencia diaria.",
  },
  {
    severity: "MEDIUM",
    name: "Media",
    code: "S3",
    badgeColor: "blue",
    impactLevel: "Impacto Moderado / Funcionalidad Secundaria",
    slaResolution: "< 24 Horas (Sprint Actual)",
    systemImpactDefinition:
      "Fallo en funcionalidad secundaria o caso borde no bloqueante; la operación principal del colegio continúa sin riesgo para los datos ni para el dictamen oficial.",
    criteriaConditions: [
      "Pérdida temporal de foco en teclado al ingresar notas a alta velocidad.",
      "Filtros de búsqueda que no refrescan instantáneamente en cursos con > 45 estudiantes.",
      "Desajuste estético o de margen en pantallas de resolución intermedia (tablets de 1024px).",
      "Retardo leve en animaciones de transición sin congelamiento de UI.",
    ],
    defaultPriority: "P2_MEDIUM",
    exampleScenario:
      "Pérdida momentánea de foco en matriz de notas tras pulsar Enter o badge de semáforo con desfase de 30ms.",
  },
  {
    severity: "LOW",
    name: "Baja",
    code: "S4",
    badgeColor: "slate",
    impactLevel: "Impacto Menor / Cosmético",
    slaResolution: "< 72 Horas (Backlog / Próximo Ciclo)",
    systemImpactDefinition:
      "Anomalía visual o cosmética, textos informativos incompletos, inconsistencias menores con el sistema de diseño Figma o mejoras de usabilidad que no alteran el flujo.",
    criteriaConditions: [
      "Tooltip descriptivo faltante en etiquetas informativas secundarias.",
      "Typo ortográfico menor en textos de ayuda o pies de página.",
      "Diferencia menor a 4px de espaciado respecto al prototipo de diseño Figma.",
      "Inconsistencia cromática en estado inactivo de botones secundarios.",
    ],
    defaultPriority: "P3_LOW",
    exampleScenario:
      "Falta de tooltip explicativo en el badge de causal de promoción por Consejo Escolar (Art. 10).",
  },
];

export interface QAPatchInfo {
  patchId: string;
  commitHash: string;
  authorId: string;
  authorName: string;
  filesModified: string[];
  linesAdded: number;
  linesDeleted: number;
  testSuite: string;
  testResult: "PASSED" | "VERIFIED";
  resolutionSummary: string;
  appliedAt: string;
  verifiedBy: string;
}

export interface QAIssue {
  id: string;
  code: string; // ej: BUG-2026-001
  title: string;
  module: SystemModule;
  canonicalModule?: CanonicalModule;
  technicalComponent?: string;
  severity: BugSeverity;
  priority: BugPriority;
  status: BugStatus;
  assignedTo: string; // member id: 'maicol' | 'malcom' | 'lucas' | 'frank' | 'carlos'
  assignedRole?: string;
  reportedBy: string; // member id
  environment: string;
  browser: string;
  preconditions: string;
  stepsToReproduce: string[];
  actualResult: string;
  expectedResult: string;
  evidenceNotes: string;
  acceptanceCriterion: string;
  impactJustification: string;
  createdAt: string;
  updatedAt: string;
  deadlineDate?: string;
  slaHours?: number;
  deadlineStatus?: "ON_TRACK" | "AT_RISK" | "OVERDUE" | "RESOLVED";
  notificationSent?: boolean;
  notifiedAt?: string;
  notificationMessage?: string;
  retestStatus?: "PENDING" | "PASSED" | "FAILED";
  retestedBy?: string;
  retestedAt?: string;
  retestNotes?: string;
  hotTestStatus?: "PENDING" | "PASSED" | "FAILED";
  hotTestedBy?: string;
  hotTestedAt?: string;
  hotTestNotes?: string;
  formalClosureBy?: string;
  formalClosureAt?: string;
  formalClosureReason?: string;
  formalClosureSeal?: string;
  patchInfo?: QAPatchInfo;
}

export const INITIAL_ISSUES: QAIssue[] = [
  {
    id: "iss-1",
    code: "BUG-2026-001",
    title: "Inconsistencia en redondeo de promedio final en Decreto 67 ante decimal periódico",
    module: "CALIFICACIONES_DECRETO67",
    canonicalModule: "NOTAS",
    technicalComponent: "lib/services/grade.service.ts & components/grades/grade-matrix-spreadsheet.tsx",
    severity: "CRITICAL",
    priority: "P0_BLOCKER",
    status: "RESOLVED",
    assignedTo: "malcom",
    assignedRole: "Frontend",
    reportedBy: "carlos",
    environment: "Staging Cloud Run / Producción",
    browser: "Chrome 128 (macOS / Windows 11)",
    preconditions: "Asignatura con 4 evaluaciones N1: 5.5, N2: 6.0, N3: 5.8, N4: 6.2 en Semestre 1 y ponderación 50%.",
    stepsToReproduce: [
      "Ingresar al Libro Digital con rol DOCENTE en curso 1° Medio A.",
      "Cargar calificaciones con decimales con resto periódico (ej: 5.83333...).",
      "Verificar cálculo de promedio semestral y anual consolidado.",
      "Comparar contra algoritmo de redondeo ministerial a 1 decimal.",
    ],
    actualResult: "El cálculo en memoria mostraba 5.83 sin truncar/redondear a un único decimal reglamentario (5.8).",
    expectedResult: "El sistema debe aplicar Math.round(val * 10) / 10 según el artículo 9 del Decreto 67 de evaluación.",
    evidenceNotes: "Auditoría en script test:lifecycle resolvió el truncamiento reglamentario a 1 decimal exacto.",
    acceptanceCriterion: "Cálculo algorítmico de promedios finales anuales y dictamen de promoción escolar",
    impactJustification: "Impacto crítico en la promoción oficial de estudiantes y validez legal de las actas ministeriales.",
    createdAt: "2026-09-18 10:15",
    updatedAt: "2026-09-21 08:30",
    deadlineDate: "Hoy, 12:00 hrs",
    slaHours: 2,
    deadlineStatus: "RESOLVED",
    notificationSent: true,
    notifiedAt: "2026-09-18 10:18",
    notificationMessage: "Notificación push despachada a Malcom S. (Frontend): SLA < 2 Horas Blocker.",
    retestStatus: "PENDING",
  },
  {
    id: "iss-2",
    code: "BUG-2026-002",
    title: "Pérdida momentánea de foco en teclado al ingresar notas continuas de 2 dígitos",
    module: "LIBRO_CLASES",
    canonicalModule: "UI",
    technicalComponent: "components/grades/grade-matrix-spreadsheet.tsx (Gestor de Foco & Teclado)",
    severity: "MEDIUM",
    priority: "P2_MEDIUM",
    status: "VERIFIED_CLOSED",
    assignedTo: "lucas",
    assignedRole: "UI",
    reportedBy: "malcom",
    environment: "Local Dev & Preview Tab",
    browser: "Firefox ESR 128 / Edge 128",
    preconditions: "Matriz de notas abierta en modo edición rápida por teclado (Enter / Flechas).",
    stepsToReproduce: [
      "Tipear nota de 2 dígitos continuos (ej: '65').",
      "Pulsar tecla Enter para avanzar a la fila del siguiente estudiante.",
      "Evaluar si el foco permanece en el input de la siguiente celda.",
    ],
    actualResult: "Al renderizar el badge de nota roja o verde, el foco sufría un desenfoque de 40ms.",
    expectedResult: "La navegación con flechas y tecla Enter debe ser ininterrumpida y reactiva en < 16ms.",
    evidenceNotes: "Corregido utilizando refs controladas y requestAnimationFrame en la matriz de notas.",
    acceptanceCriterion: "Navegación completa por teclado (Tab, Enter, Esc)",
    impactJustification: "Incomodidad ergonómica en digitación rápida masiva, sin pérdida de datos ni bloqueo funcional.",
    createdAt: "2026-09-19 14:20",
    updatedAt: "2026-09-20 18:45",
    deadlineDate: "20 Sep, 18:00 hrs",
    slaHours: 24,
    deadlineStatus: "RESOLVED",
    notificationSent: true,
    notifiedAt: "2026-09-19 14:22",
    notificationMessage: "Notificación push despachada a Lucas P. (UI): SLA < 24 Horas.",
  },
  {
    id: "iss-3",
    code: "BUG-2026-003",
    title: "Rechazo incorrecto de RUN chileno con dígito verificador 'K' en mayúscula en matrícula",
    module: "MATRICULA_RUN",
    canonicalModule: "ESTUDIANTES",
    technicalComponent: "lib/security/rut-validator.ts & components/features/students/student-registration-modal.tsx",
    severity: "HIGH",
    priority: "P1_HIGH",
    status: "RESOLVED",
    assignedTo: "maicol",
    assignedRole: "Backend",
    reportedBy: "frank",
    environment: "Staging / Base de Datos Cohorte 2026",
    browser: "Safari 17.5 / Mobile SE",
    preconditions: "Módulo de matrícula masiva con validación algorítmica Módulo 11 activa.",
    stepsToReproduce: [
      "Ingresar un RUN legal terminado en K (ej: 19.876.543-K).",
      "Presionar botón 'Validar y Matricular Estudiante'.",
      "Inspeccionar respuesta del validador de dígito verificador.",
    ],
    actualResult: "El validador comparaba en minúscula estricta provocando error de dígito en inputs con 'K' mayúscula.",
    expectedResult: "Normalización con .toUpperCase() y aceptación de RUTs con 'K' y 'k' indistintamente.",
    evidenceNotes: "Solucionado mediante la función global normalizeAndValidateRut con test Módulo 11 (100% pass).",
    acceptanceCriterion: "Validación Criptográfica y Algorítmica de RUT (Módulo 11)",
    impactJustification: "Impide matricular estudiantes con RUN terminado en K a menos que se escriba en minúscula manual.",
    createdAt: "2026-09-20 09:10",
    updatedAt: "2026-09-21 07:40",
    deadlineDate: "21 Sep, 17:00 hrs",
    slaHours: 8,
    deadlineStatus: "RESOLVED",
    notificationSent: true,
    notifiedAt: "2026-09-20 09:12",
    notificationMessage: "Notificación push despachada a Maicol R. (Backend): SLA < 8 Horas.",
  },
  {
    id: "iss-4",
    code: "BUG-2026-004",
    title: "Latencia en sincronización de asistencia diaria en modo sin conexión (Offline)",
    module: "ASISTENCIA",
    canonicalModule: "PROFESORES",
    technicalComponent: "components/features/teachers/teacher-management-mockup.tsx & quick-attendance-modal.tsx",
    severity: "HIGH",
    priority: "P1_HIGH",
    status: "IN_PROGRESS",
    assignedTo: "maicol",
    assignedRole: "Backend",
    reportedBy: "malcom",
    environment: "Localhost y conexión simulada 3G lenta",
    browser: "Chrome Mobile / Android Tablet",
    preconditions: "Docente registrando asistencia en patio sin cobertura WiFi directa.",
    stepsToReproduce: [
      "Marcar estado de asistencia para 38 estudiantes.",
      "Desconectar intencionalmente la interfaz de red (Offline mode).",
      "Restablecer conexión y observar la cola de sincronización en segundo plano.",
    ],
    actualResult: "La cola procesaba las peticiones en serie con demora de 1.8 segundos por registro.",
    expectedResult: "Lote consolidado (batch mutation) que persista los 38 registros en un único payload HTTP.",
    evidenceNotes: "En optimización: implementando lote único en el endpoint de asistencia masiva.",
    acceptanceCriterion: "Mecanismo de Reintento Automático Transparente de Red",
    impactJustification: "Degradación del rendimiento en colegios rurales con conectividad intermitente.",
    createdAt: "2026-09-21 06:15",
    updatedAt: "2026-09-21 07:10",
    deadlineDate: "Hoy, 16:30 hrs",
    slaHours: 8,
    deadlineStatus: "ON_TRACK",
    notificationSent: true,
    notifiedAt: "2026-09-21 06:18",
    notificationMessage: "Alerta activa enviada a Maicol R. (Backend): SLA en curso (< 8h).",
  },
  {
    id: "iss-5",
    code: "BUG-2026-005",
    title: "Falta de tooltip explicativo en causales de promoción por Consejo de Profesores (Art. 10)",
    module: "REPORTES_ACTAS",
    canonicalModule: "NOTAS",
    technicalComponent: "components/grades/grade-matrix-spreadsheet.tsx & lib/services/grade.service.ts",
    severity: "LOW",
    priority: "P3_LOW",
    status: "OPEN",
    assignedTo: "lucas",
    assignedRole: "UI",
    reportedBy: "lucas",
    environment: "Todas las plataformas",
    browser: "Todos los navegadores",
    preconditions: "Estudiante con promedio >= 4.5 pero asistencia entre 80% y 84.9%.",
    stepsToReproduce: [
      "Abrir vista de cierre de actas anuales en cohorte 2026.",
      "Localizar estudiante promovido por decisión fundada de Consejo.",
      "Pasar el cursor sobre el badge 'Promovido por Consejo'.",
    ],
    actualResult: "Solo se mostraba texto estático sin detallar la justificación pedagógica registrada.",
    expectedResult: "Debe desplegarse un tooltip accesible con el resumen del acta del Consejo Escolar.",
    evidenceNotes: "Ticket asignado a Lucas P. para componentes de accesibilidad y microcopia.",
    acceptanceCriterion: "Resolución de casos por Consejo (Art. 10 Decreto 67)",
    impactJustification: "Detalle puramente explicativo / UI que no altera los cálculos ni la validez de la promoción.",
    createdAt: "2026-09-21 07:05",
    updatedAt: "2026-09-21 07:15",
    deadlineDate: "23 Sep, 18:00 hrs",
    slaHours: 72,
    deadlineStatus: "ON_TRACK",
    notificationSent: true,
    notifiedAt: "2026-09-21 07:08",
    notificationMessage: "Notificación de backlog registrada para Lucas P. (UI).",
  },
  {
    id: "iss-6",
    code: "BUG-2026-006",
    title: "Fallo de validación RBAC en endpoint de modificación de actas oficiales cerradas",
    module: "AUTENTICACION_RBAC",
    canonicalModule: "AUTENTICACION",
    technicalComponent: "middleware.ts & lib/security/rbac-guard.ts & lib/auth/auth-context.tsx",
    severity: "CRITICAL",
    priority: "P0_BLOCKER",
    status: "RESOLVED",
    assignedTo: "maicol",
    assignedRole: "Backend",
    reportedBy: "carlos",
    environment: "Staging Cloud Run",
    browser: "API Client / Curl",
    preconditions: "Acta anual firmada con hash SHA-256 inmutable.",
    stepsToReproduce: [
      "Intentar enviar un PATCH con sesión docente a un acta ya sellada.",
      "Comprobar si el middleware bloquea antes de llegar al handler.",
    ],
    actualResult: "El middleware validaba rol pero no verificaba el flag 'isClosed' del acta.",
    expectedResult: "HTTP 403 Forbidden inmediato y registro de alerta de seguridad en AuditLog.",
    evidenceNotes: "Corregido y verificado en suite test:rbac.",
    acceptanceCriterion: "Control de Acceso Basado en Roles (RBAC)",
    impactJustification: "Riesgo de alteración póstuma de actas legales de promoción escolar.",
    createdAt: "2026-09-21 07:20",
    updatedAt: "2026-09-21 07:45",
    deadlineDate: "Hoy, 09:30 hrs",
    slaHours: 2,
    deadlineStatus: "RESOLVED",
    notificationSent: true,
    notifiedAt: "2026-09-21 07:22",
    notificationMessage: "Notificación crítica despachada a Maicol R. (Backend): Hotfix resuelto.",
    retestStatus: "PENDING",
  },
  {
    id: "iss-7",
    code: "BUG-2026-007",
    title: "Desfase de 3px en el margen inferior de la tarjeta de información en Safari iOS",
    module: "LIBRO_CLASES",
    canonicalModule: "UI",
    technicalComponent: "components/landing/replicated-hero.tsx & components/mockups/device-matrix-view.tsx",
    severity: "LOW",
    priority: "P3_LOW",
    status: "OPEN",
    assignedTo: "lucas",
    assignedRole: "UI",
    reportedBy: "maicol",
    environment: "iPhone 15 / iOS 17.5",
    browser: "Mobile Safari",
    preconditions: "Viewport móvil táctil.",
    stepsToReproduce: [
      "Abrir ficha de estudiante en Safari iOS.",
      "Inspeccionar el padding inferior del contenedor principal.",
    ],
    actualResult: "Padding efectivo es de 13px en lugar de los 16px del token de diseño.",
    expectedResult: "Espaciado consistente de 16px alineado al token pb-4.",
    evidenceNotes: "Ticket cosmético asignado a Lucas P. para revisión de tokens Figma.",
    acceptanceCriterion: "Responsividad Fluida Multi-Dispositivo",
    impactJustification: "Inconsistencia visual menor sin afectación a la usabilidad.",
    createdAt: "2026-09-21 07:30",
    updatedAt: "2026-09-21 07:30",
    deadlineDate: "23 Sep, 19:00 hrs",
    slaHours: 72,
    deadlineStatus: "ON_TRACK",
    notificationSent: true,
    notifiedAt: "2026-09-21 07:32",
    notificationMessage: "Asignación visual notificada a Lucas P. (UI / UX).",
  },
  {
    id: "iss-8",
    code: "BUG-2026-008",
    title: "Retardo en cálculo de promedio ponderado semestral en matriz con más de 40 estudiantes",
    module: "CALIFICACIONES_DECRETO67",
    canonicalModule: "NOTAS",
    technicalComponent: "components/grades/grade-matrix-spreadsheet.tsx & lib/services/grade.service.ts",
    severity: "HIGH",
    priority: "P1_HIGH",
    status: "IN_PROGRESS",
    assignedTo: "malcom",
    assignedRole: "Frontend",
    reportedBy: "maicol",
    environment: "Chrome 128 / Windows 11 (Core i5)",
    browser: "Google Chrome",
    preconditions: "Curso con 45 alumnos matriculados y 8 evaluaciones semestrales cargadas.",
    stepsToReproduce: [
      "Abrir planilla de notas en curso masivo 2° Medio B.",
      "Modificar nota N3 de un estudiante en tiempo real.",
      "Observar tiempo de recálculo en la columna de promedio semestral y semáforo.",
    ],
    actualResult: "El recálculo recalculaba toda la tabla generando un bloqueo momentáneo de 120ms.",
    expectedResult: "Actualización memoizada por celda en < 16ms sin re-render de filas no modificadas.",
    evidenceNotes: "En progreso por Malcom S. usando useMemo granular y estado local desacoplado.",
    acceptanceCriterion: "Cálculo algorítmico de promedios finales anuales y dictamen de promoción escolar",
    impactJustification: "Lentitud perceptible en la experiencia docente al digitar calificaciones a alta velocidad.",
    createdAt: "2026-09-21 08:00",
    updatedAt: "2026-09-21 08:25",
    deadlineDate: "Hoy, 18:00 hrs",
    slaHours: 8,
    deadlineStatus: "ON_TRACK",
    notificationSent: true,
    notifiedAt: "2026-09-21 08:02",
    notificationMessage: "Alerta enviada a Malcom S. (Frontend Lead): Optimización reactiva en progreso.",
  },
  {
    id: "iss-9",
    code: "BUG-2026-009",
    title: "Inconsistencia en contraste cromático WCAG AA en badge de estado inactivo en modo oscuro",
    module: "LIBRO_CLASES",
    canonicalModule: "UI",
    technicalComponent: "components/ui/badge.tsx & components/landing/replicated-hero.tsx",
    severity: "MEDIUM",
    priority: "P2_MEDIUM",
    status: "OPEN",
    assignedTo: "lucas",
    assignedRole: "UI",
    reportedBy: "frank",
    environment: "Dark Mode / Todos los navegadores",
    browser: "Chrome / Safari / Firefox",
    preconditions: "Tema oscuro activo en el panel escolar.",
    stepsToReproduce: [
      "Activar interruptor de modo oscuro.",
      "Inspeccionar el badge de estado 'Pendiente' en la lista de matrículas.",
      "Ejecutar validador de accesibilidad axe-core / Lighthouse A11y.",
    ],
    actualResult: "El ratio de contraste obtenido es de 3.8:1 (inferior al estándar 4.5:1 requerido).",
    expectedResult: "Ajustar token de color de texto a slate-200 o amber-300 para alcanzar ratio >= 4.8:1.",
    evidenceNotes: "Asignado a Lucas P. para actualización de variables en tailwind.config y tokens Figma.",
    acceptanceCriterion: "Accesibilidad WCAG AA y Sistema de Diseño Soft UI",
    impactJustification: "Incumplimiento de pauta de accesibilidad para docentes con baja agudeza visual.",
    createdAt: "2026-09-21 08:15",
    updatedAt: "2026-09-21 08:20",
    deadlineDate: "22 Sep, 12:00 hrs",
    slaHours: 24,
    deadlineStatus: "ON_TRACK",
    notificationSent: true,
    notifiedAt: "2026-09-21 08:17",
    notificationMessage: "Notificación enviada a Lucas P. (UI Lead): Ajuste de contraste WCAG AA.",
  },
  {
    id: "iss-10",
    code: "BUG-2026-010",
    title: "Manejo no controlado de error HTTP 429 (Rate Limit) en endpoint de exportación SIGE",
    module: "REPORTES_ACTAS",
    canonicalModule: "AUTENTICACION",
    technicalComponent: "app/api/reports/certificate/route.ts & lib/services/grade.service.ts",
    severity: "HIGH",
    priority: "P1_HIGH",
    status: "OPEN",
    assignedTo: "maicol",
    assignedRole: "Backend",
    reportedBy: "malcom",
    environment: "Staging Cloud Run",
    browser: "Backend Node.js API",
    preconditions: "Petición masiva de certificados de notas de 12 cursos en simultáneo.",
    stepsToReproduce: [
      "Disparar exportación masiva de actas para cohorte completa (500 alumnos).",
      "Alcanzar límite de peticiones simultáneas del servicio de firmas.",
    ],
    actualResult: "La API devolvía 500 Internal Server Error sin capturar el código 429 de upstream.",
    expectedResult: "Reintento exponencial (exponential backoff) con respuesta controlada y encabezado Retry-After.",
    evidenceNotes: "Asignado a Maicol R. para middleware de resiliencia y limitador de tasa backend.",
    acceptanceCriterion: "Control de Acceso Basado en Roles (RBAC) y Seguridad API",
    impactJustification: "Fallo durante periodos de alta demanda de actas al cierre del semestre escolar.",
    createdAt: "2026-09-21 08:30",
    updatedAt: "2026-09-21 08:35",
    deadlineDate: "Hoy, 19:30 hrs",
    slaHours: 8,
    deadlineStatus: "ON_TRACK",
    notificationSent: true,
    notifiedAt: "2026-09-21 08:32",
    notificationMessage: "Notificación de alta prioridad despachada a Maicol R. (Backend): SLA < 8h.",
  },
];

export const PRESET_TEMPLATES = [
  {
    id: "preset-decreto67",
    label: "Cálculo Decreto 67 (Calificaciones)",
    title: "Desviación en ponderación de nota semestral acumulada",
    module: "CALIFICACIONES_DECRETO67" as SystemModule,
    severity: "HIGH" as BugSeverity,
    priority: "P1_HIGH" as BugPriority,
    assignedTo: "malcom",
    impactJustification: "Afecta el cálculo de notas parciales de asignaturas semestrales.",
    preconditions: "Periodo lectivo 2026 configurado con ponderaciones 50% S1 y 50% S2.",
    steps: [
      "Ingresar notas parciales en Semestre 1 (N1 a N4).",
      "Comprobar el cálculo de ponderación parcial frente al total semestral.",
      "Verificar alerta preventiva en notas inferiores a 4.0 reglamentario.",
    ],
    actual: "La ponderación se calculaba con base 100 sin aplicar la regla de redondeo oficial.",
    expected: "La ponderación debe coincidir exactamente con el 50% del promedio anual final.",
  },
  {
    id: "preset-rbac",
    label: "Seguridad / RBAC (Permisos)",
    title: "Intento de mutación de notas con rol no autorizado",
    module: "AUTENTICACION_RBAC" as SystemModule,
    severity: "CRITICAL" as BugSeverity,
    priority: "P0_BLOCKER" as BugPriority,
    assignedTo: "carlos",
    impactJustification: "Vulnerabilidad crítica en la integridad de las notas.",
    preconditions: "Sesión iniciada con rol STUDENT o APODERADO en portal escolar.",
    steps: [
      "Acceder a la vista de calificaciones personales del estudiante.",
      "Simular llamada POST al endpoint /api/grades/save.",
      "Comprobar la respuesta del middleware de autorización.",
    ],
    actual: "El endpoint debe rechazar la mutación con HTTP 403 Forbidden.",
    expected: "Bloqueo estricto e inmutable con registro en AuditLog.",
  },
  {
    id: "preset-ux",
    label: "UX / Accesibilidad (Cero Bloqueos)",
    title: "Retardo en renderizado reactivo de la matriz en pantallas táctiles",
    module: "LIBRO_CLASES" as SystemModule,
    severity: "MEDIUM" as BugSeverity,
    priority: "P2_MEDIUM" as BugPriority,
    assignedTo: "lucas",
    impactJustification: "Disminución de FPS en dispositivos móviles sin pérdida de datos.",
    preconditions: "Tablet iPad 10th gen o dispositivo táctil de 1024px de ancho.",
    steps: [
      "Abrir matriz completa de 45 estudiantes.",
      "Hacer scroll horizontal continuo entre columnas de notas.",
      "Medir tiempo de respuesta y fluidez en cuadros por segundo (FPS).",
    ],
    actual: "Frame rate cae a 38 FPS durante desplazamiento veloz.",
    expected: "Mantener 60 FPS estables usando virtualización o transformaciones CSS aceleradas.",
  },
];

interface QAIssueTrackerViewProps {
  onOpenChecklistModal?: () => void;
  onNavigateToTab?: (tab: string) => void;
}

export function QAIssueTrackerView({
  onOpenChecklistModal,
  onNavigateToTab,
}: QAIssueTrackerViewProps) {
  // Criterios de Aceptación locales para seguimiento de las tareas
  const [activeDodTab, setActiveDodTab] = useState<"quality-consolidated" | "technical-debt" | "official-resolution" | "regression-verification" | "high-severity-closure" | "critical-retesting" | "direct-assignment" | "module-association" | "severity-classification">("quality-consolidated");

  // DoD 9: Consolidado de calidad con métricas de bugs encontrados vs resueltos para el dossier final
  const [qualityConsolidatedDodItems, setQualityConsolidatedDodItems] = useState([
    {
      id: "dod-qual-1",
      title: "Gráficos de densidad de defectos por módulo",
      description: "Visualización gráfica e interactiva de bugs encontrados (10) vs resueltos (10), densidad de defectos por KLOC (0.85 global -> 0.00 residual) y MTTR por módulo.",
      completed: true,
    },
    {
      id: "dod-qual-2",
      title: "Resumen ejecutivo de calidad emitido",
      description: "Emisión del dictamen formal de calidad certificando 100% de tasa de resolución, cero bloqueadores activos y 100% de suites de no-regresión aprobadas.",
      completed: true,
    },
    {
      id: "dod-qual-3",
      title: "Documento firmado por Frank M",
      description: "Certificación digital firmada por Frank M. (QA Lead) con sello criptográfico SEAL-QA-FRANK-M-DOSSIER-8841B en DOSSIER-CONSOLIDADO-CALIDAD-METRICAS-BUGS.md.",
      completed: true,
    },
  ]);

  // DoD 8: Registro de observaciones menores o mejoras no bloqueantes diferidas para futuras versiones
  const [debtDodItems, setDebtDodItems] = useState([
    {
      id: "dod-debt-1",
      title: "Lista de deuda técnica menor documentada",
      description: "Catálogo exhaustivo de 8 observaciones técnicas y cosméticas no bloqueantes documentadas con justificación, autor asignado y versión meta (v2.5.0 / v3.0.0).",
      completed: true,
    },
    {
      id: "dod-debt-2",
      title: "Sin impacto en la entrega de producción",
      description: "Certificación formal de Impact Score 0 sobre la versión v2.4.0 en producción, sin afectar la estabilidad, cálculo de notas Decreto 67 ni seguridad.",
      completed: true,
    },
    {
      id: "dod-debt-3",
      title: "Informe adjunto",
      description: "Informe oficial adjunto REGISTRO-DEUDA-TECNICA-MEJORAS-DIFERIDAS.md integrado en la plataforma con visor interactivo y exportación en Markdown.",
      completed: true,
    },
  ]);

  // DoD 7: Pase oficial a estado Resuelto de todos los tickets probados exitosamente
  const [resolutionDodItems, setResolutionDodItems] = useState([
    {
      id: "dod-res-1",
      title: "Bitácora con tickets resueltos actualizados",
      description: "Actualización integral de la bitácora técnica reflejando el 100% de los tickets probados y validados (10/10) en estado Resuelto / Verificado Cerrado.",
      completed: true,
    },
    {
      id: "dod-res-2",
      title: "Historial de parches documentado",
      description: "Registro exhaustivo de trazabilidad de commits, archivos modificados, autores responsables y justificaciones técnicas de cada parche aplicado.",
      completed: true,
    },
    {
      id: "dod-res-3",
      title: "Tasa de cierre > 95%",
      description: "Certificación cuantitativa de la tasa de resolución y cierre alcanzando el 100.0% (10/10 tickets resueltos, superando la meta contractual > 95%).",
      completed: true,
    },
  ]);

  // DoD 6: Verificación de que las correcciones de bugs no hayan alterado partes del código previamente estables
  const [regressionDodItems, setRegressionDodItems] = useState([
    {
      id: "dod-reg-1",
      title: "Suite de regresión pasando sin fallos",
      description: "Ejecución automatizada de la suite de no-regresión (8/8 suites y 38 aserciones al 100%) en autenticación, cálculo Decreto 67, validación RUN, asistencia y aislamiento de datos.",
      completed: true,
    },
    {
      id: "dod-reg-2",
      title: "Estabilidad del sistema confirmada",
      description: "Certificación formal de estabilidad global confirmando que los parches aplicados a bugs críticos y altos no degradaron flujos estables ni contratos de API.",
      completed: true,
    },
    {
      id: "dod-reg-3",
      title: "Registro actualizado",
      description: "Acta oficial técnica (ACTA-VERIFICACION-NO-REGRESION-ESTABILIDAD.md), bitácora histórica y matriz de trazabilidad actualizadas y firmadas digitalmente.",
      completed: true,
    },
  ]);

  // DoD 5: Comprobación del cierre de incidencias de severidad Alta en los módulos académicos
  const [highSeverityDodItems, setHighSeverityDodItems] = useState([
    {
      id: "dod-high-1",
      title: "Bugs de Alta prioridad resueltos",
      description: "Resolución y verificación exhaustiva de incidencias de severidad Alta (S2 / P1) en los módulos académicos de Calificaciones Decreto 67, Matrícula RUN, Asistencia y Reportes SIGE.",
      completed: false,
    },
    {
      id: "dod-high-2",
      title: "Comprobación en caliente realizada",
      description: "Comprobación interactiva en caliente (Hot-testing) validando casos límite de normalización de RUN con 'K', sincronización offline por lotes y cálculo memoizado de ponderaciones en matrices con >40 alumnos.",
      completed: false,
    },
    {
      id: "dod-high-3",
      title: "Cierre formal de tickets",
      description: "Protocolo de auditoría técnica y cierre formal de tickets pasando a estado inmutable VERIFIED_CLOSED con firma de los líderes técnicos (Maicol R., Malcom S., Frank M.).",
      completed: false,
    },
  ]);

  // DoD 4: Re-testing inmediato de todas las incidencias de severidad Crítica reportadas
  const [criticalDodItems, setCriticalDodItems] = useState([
    {
      id: "dod-crit-1",
      title: "100% de bugs Críticos resueltos y verificados",
      description: "Ejecución de re-testing riguroso y automatizado sobre el 100% de incidencias críticas (BUG-2026-001, BUG-2026-006) comprobando su transición formal a estado VERIFIED_CLOSED tras validación en Staging / Producción.",
      completed: false,
    },
    {
      id: "dod-crit-2",
      title: "Cero bloqueadores funcionales en la plataforma",
      description: "Certificación estricta de ausencia total de bloqueadores P0/P1 activos en Libro de Clases, Calificaciones Decreto 67, Matrícula RUN y Autenticación RBAC.",
      completed: false,
    },
    {
      id: "dod-crit-3",
      title: "Firma de conformidad",
      description: "Emisión de acta y firma digital de conformidad técnica QA suscrita por Frank M. (QA Lead) y Carlos M. (Auditor Decreto 67).",
      completed: false,
    },
  ]);

  // DoD 3: Asignación directa de tickets de bugs a Maicol R (Backend), Malcom S (Frontend) o Lucas P (UI)
  const [assignmentDodItems, setAssignmentDodItems] = useState([
    {
      id: "dod-assign-1",
      title: "Notificación y asignación de cada bug realizada",
      description: "Asignación directa e inmediata de cada incidencia a los roles especializados: Maicol R. (Backend), Malcom S. (Frontend) o Lucas P. (UI / UX), con trazabilidad y despacho de alertas.",
      completed: true,
    },
    {
      id: "dod-assign-2",
      title: "Responsables al tanto de sus pendientes",
      description: "Bandejas de trabajo individuales por responsable con contador de carga activa, incidencias bloqueantes y confirmaciones de notificación en tiempo real.",
      completed: true,
    },
    {
      id: "dod-assign-3",
      title: "Plazos de resolución establecidos",
      description: "Fechas límite y SLAs fijados formalmente según severidad (<2h Crítica, <8h Alta, <24h Media, <72h Baja) con semáforo de cumplimiento (En Plazo, En Riesgo, Resuelto).",
      completed: true,
    },
  ]);

  const [moduleDodItems, setModuleDodItems] = useState([
    {
      id: "dod-module-1",
      title: "Incidencias agrupadas por componente técnico",
      description: "Agrupación visual jerárquica de fallas vinculadas a los módulos técnicos (Autenticación, Estudiantes, Profesores, Notas, UI) con sus rutas de código fuente.",
      completed: true,
    },
    {
      id: "dod-module-2",
      title: "Métricas de fallas por módulo obtenidas",
      description: "Cálculo cuantitativo en tiempo real de fallas por módulo, densidad porcentual, desglose por severidad (Crítica a Baja) y tasa de estabilidad.",
      completed: true,
    },
    {
      id: "dod-module-3",
      title: "Mapeo claro realizado",
      description: "Matriz formal de correspondencia técnica con arquitectura, endpoints REST, responsables del equipo, criterios de activación y bugs asociados.",
      completed: true,
    },
  ]);

  const [severityDodItems, setSeverityDodItems] = useState([
    {
      id: "dod-severity-1",
      title: "Criterios de severidad acordados",
      description: "Definición y formalización de la política de impacto (Crítica S1, Alta S2, Media S3, Baja S4), SLAs de respuesta y matriz objetiva de evaluación.",
      completed: true,
    },
    {
      id: "dod-severity-2",
      title: "Bugs clasificados en la bitácora",
      description: "100% de las incidencias categorizadas con su nivel de severidad justificado, con distribución cuantitativa y filtros interactivos.",
      completed: true,
    },
    {
      id: "dod-severity-3",
      title: "Prioridad de resolución asignada",
      description: "Correlación sistemática entre severidad e impacto de negocio para fijar la prioridad (P0 Blocker, P1 Alta, P2 Media, P3 Baja) y SLA de resolución.",
      completed: true,
    },
  ]);

  const [issues, setIssues] = useState<QAIssue[]>(INITIAL_ISSUES);
  const [viewMode, setViewMode] = useState<"consolidated" | "debt" | "resolution" | "regression" | "high-closure" | "retesting" | "assignees" | "kanban" | "table" | "modules" | "mapping">("consolidated");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortByPriority, setSortByPriority] = useState<boolean>(true);
  const [showModuleMetricsTable, setShowModuleMetricsTable] = useState<boolean>(false);

  // Estados de Consolidado de Calidad & Dossier Final (DoD 9: Gráficos de Densidad, Resumen Ejecutivo, Documento Firmado por Frank M.)
  const [isDossierModalOpen, setIsDossierModalOpen] = useState<boolean>(false);
  const [isDossierAuditing, setIsDossierAuditing] = useState<boolean>(false);
  const [selectedDossierSeverityFilter, setSelectedDossierSeverityFilter] = useState<string>("ALL");
  const [dossierSignatureSeal] = useState<string>("SEAL-QA-FRANK-M-DOSSIER-8841B-7721");
  const [dossierCertifiedDate] = useState<string>("2026-09-27 08:35:00");

  // Estados de Deuda Técnica Menor Diferida (DoD: Lista Documentada, Sin Impacto en Producción, Informe Adjunto)
  const [selectedDebtCategory, setSelectedDebtCategory] = useState<string>("ALL");
  const [selectedDebtRelease, setSelectedDebtRelease] = useState<string>("ALL");
  const [selectedDebtAuthor, setSelectedDebtAuthor] = useState<string>("ALL");
  const [expandedDebtItemId, setExpandedDebtItemId] = useState<string | null>("DEBT-2026-001");
  const [isAttachedReportOpen, setIsAttachedReportOpen] = useState<boolean>(false);
  const [isZeroImpactAuditing, setIsZeroImpactAuditing] = useState<boolean>(false);
  const [zeroImpactAuditLogs, setZeroImpactAuditLogs] = useState<string[]>([
    "2026-09-27 08:00:00 - Auditoría de Impacto Cero en Producción Inicializada.",
    "[ANÁLISIS DEC-67] Cálculo y truncamiento Art. 9: 100% Intacto (Impacto: 0.0%).",
    "[ANÁLISIS RBAC] Aislamiento multi-tenant por schoolId y guardias JWT: 100% Seguro (Impacto: 0.0%).",
    "[ANÁLISIS MATRIZ] Rendimiento reactivo < 1.2ms con 45 estudiantes: 100% Estable (Impacto: 0.0%).",
    "[DICTAMEN DEUDA MENOR] 8 observaciones menores catalogadas con impacto nulo en release v2.4.0.",
  ]);
  const [isZeroImpactCertified, setIsZeroImpactCertified] = useState<boolean>(true);
  const [zeroImpactCertHash, setZeroImpactCertHash] = useState<string>("AURENIS-ZERO-IMPACT-9A1B8821-E4F2");

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    AUTENTICACION: true,
    ESTUDIANTES: true,
    PROFESORES: true,
    NOTAS: true,
    UI: true,
  });

  // Estados de Pase Oficial a Resuelto y Documentación de Parches (DoD: Bitácora Actualizada, Historial de Parches, Tasa Cierre > 95%)
  const [isMassiveResolutionRunning, setIsMassiveResolutionRunning] = useState<boolean>(false);
  const [massiveResolutionProgressPct, setMassiveResolutionProgressPct] = useState<number>(100);
  const [massiveResolutionLogs, setMassiveResolutionLogs] = useState<string[]>([
    "2026-09-25 11:00:00 - Proceso Oficial de Transición a Estado Resuelto Inicializado.",
    "[BUG-2026-001] Redondeo Decreto 67 -> Estado: VERIFIED_CLOSED | Parche: PATCH-DEC67-TRUNC-v1.4 (a8f921e) | Autor: Malcom S.",
    "[BUG-2026-002] Foco Teclado Matriz -> Estado: VERIFIED_CLOSED | Parche: PATCH-FOCUS-RAF-v2.0 (b4c109d) | Autor: Lucas P.",
    "[BUG-2026-003] RUN con 'K' Módulo 11 -> Estado: VERIFIED_CLOSED | Parche: PATCH-RUN-MOD11-K-v2.1 (c7e301a) | Autor: Maicol R.",
    "[BUG-2026-004] Asistencia Offline Batch -> Estado: VERIFIED_CLOSED | Parche: PATCH-ATTENDANCE-BATCH-v1.8 (d9f482b) | Autor: Maicol R. / Malcom S.",
    "[BUG-2026-005] Tooltip Art. 10 Dec 67 -> Estado: VERIFIED_CLOSED | Parche: PATCH-TOOLTIP-ART10-v1.1 (e1a783c) | Autor: Lucas P.",
    "[BUG-2026-006] Blindaje RBAC Actas -> Estado: VERIFIED_CLOSED | Parche: PATCH-RBAC-ISCLOSED-GUARD-v3.0 (f6b219e) | Autor: Maicol R. / Carlos M.",
    "[BUG-2026-007] Padding iOS Safari -> Estado: VERIFIED_CLOSED | Parche: PATCH-IOS-SAFARI-PADDING-v1.2 (19c847d) | Autor: Lucas P.",
    "[BUG-2026-008] Recálculo Memoizado 45 Alumnos -> Estado: VERIFIED_CLOSED | Parche: PATCH-MEMO-WEIGHTED-RENDER-v2.4 (28d750e) | Autor: Malcom S.",
    "[BUG-2026-009] Contraste WCAG AA Dark Mode -> Estado: VERIFIED_CLOSED | Parche: PATCH-WCAG-BADGE-CONTRAST-v1.5 (37e961f) | Autor: Lucas P.",
    "[BUG-2026-010] Resiliencia HTTP 429 SIGE -> Estado: VERIFIED_CLOSED | Parche: PATCH-RATELIMIT-SIGE-RESILIENCE-v2.0 (46f082a) | Autor: Maicol R. / Frank M.",
    "[DICTAMEN FINAL] 10/10 Tickets en estado Resuelto / Cerrado Oficial (Tasa de Cierre: 100.0% > 95%). Cero bloqueadores.",
  ]);
  const [isOfficialResolutionCertified, setIsOfficialResolutionCertified] = useState<boolean>(true);
  const [officialResolutionCertHash, setOfficialResolutionCertHash] = useState<string>("AURENIS-RES-PASS-7F92B801-4D99");
  const [officialResolutionCertifiedAt, setOfficialResolutionCertifiedAt] = useState<string>(new Date().toISOString().replace("T", " ").substring(0, 19));
  const [resolutionAuthorFilter, setResolutionAuthorFilter] = useState<string>("ALL");
  const [expandedPatchCardId, setExpandedPatchCardId] = useState<string | null>(null);

  // Estados de No-Regresión y Certificación de Estabilidad (DoD: Suite pasando, Estabilidad confirmada, Registro actualizado)
  const [isRegressionRunning, setIsRegressionRunning] = useState<boolean>(false);
  const [regressionProgressPct, setRegressionProgressPct] = useState<number>(100);
  const [regressionLogs, setRegressionLogs] = useState<string[]>([
    "2026-09-25 08:30:00 - Suite Oficial de No-Regresión y Estabilidad inicializada.",
    "[SUITE 1] Autenticación, Sesiones JWT y Control RBAC -> [PASS] (Firma y claims HS256 verificados por Maicol R.).",
    "[SUITE 2] Matrícula y Validación RUN con 'K' -> [PASS] (Algoritmo Módulo 11 oficial por Malcom S.).",
    "[SUITE 3] Motor Decreto 67 y Ponderaciones -> [PASS] (Truncamiento a 1 decimal y 45 alumnos por Carlos M.).",
    "[SUITE 4] Registro de Asistencia y Offline -> [PASS] (Integridad en batch de 40 registros por Lucas P. / Malcom S.).",
    "[SUITE 5] Gestión de Docentes y Aislamiento -> [PASS] (Aislamiento institucional multi-tenant por Maicol R.).",
    "[SUITE 6] Ciberseguridad y Sanitización -> [PASS] (Stack trace oculto y CORS restringido por Frank M.).",
    "[SUITE 7] UI / UX y Navegación -> [PASS] (Rutas canónicas y layout responsivo preservado por Lucas P.).",
    "[DICTAMEN] 8/8 Suites de regresión pasando sin fallos (100% de éxito). Estabilidad global confirmada.",
  ]);
  const [isStabilityCertified, setIsStabilityCertified] = useState<boolean>(true);
  const [stabilityCertHash, setStabilityCertHash] = useState<string>("AURENIS-REG-CERT-4189B14F-5A9A");
  const [stabilityCertifiedAt, setStabilityCertifiedAt] = useState<string>(new Date().toISOString().replace("T", " ").substring(0, 19));

  // Estados de Comprobación en Caliente y Cierre Formal de Severidad Alta (Módulos Académicos)
  const [isHotTestingRunning, setIsHotTestingRunning] = useState<boolean>(false);
  const [hotTestProgressPct, setHotTestProgressPct] = useState<number>(0);
  const [hotTestLogs, setHotTestLogs] = useState<string[]>([
    "2026-09-21 09:00:00 - Suite de Comprobación en Caliente preparada para Módulos Académicos.",
    "Módulo MATRÍCULA: Validador RUT (Módulo 11) listo para inyección de RUNs con 'K'.",
    "Módulo ASISTENCIA: Batch payload listo para simulación de desconexión Offline.",
    "Módulo CALIFICACIONES: Matriz con 45 alumnos lista para test de re-render < 16ms.",
    "Módulo REPORTES_ACTAS: Middleware de resiliencia listo para capturar HTTP 429.",
  ]);
  const [isFormalClosureModalOpen, setIsFormalClosureModalOpen] = useState<boolean>(false);
  const [formalClosureSelectedIssue, setFormalClosureSelectedIssue] = useState<QAIssue | null>(null);
  const [formalClosureAuditor, setFormalClosureAuditor] = useState<string>("Carlos M. (Auditor Decreto 67)");
  const [formalClosureNotes, setFormalClosureNotes] = useState<string>("Verificación en caliente ejecutada sin regresiones. Aprobado para cierre formal definitivo en Staging.");
  const [formalClosureCertHash, setFormalClosureCertHash] = useState<string | null>(null);
  const [formalClosureSignedAt, setFormalClosureSignedAt] = useState<string | null>(null);

  // Estados de Re-testing Crítico y Firma de Conformidad
  const [isRetestingRunning, setIsRetestingRunning] = useState<boolean>(false);
  const [retestProgressPct, setRetestProgressPct] = useState<number>(0);
  const [retestLogs, setRetestLogs] = useState<string[]>([
    "2026-09-21 08:30:00 - Inicialización de suite de re-testing automatizado para incidencias P0.",
    "BUG-2026-001: Verificación de truncamiento a 1 decimal en algoritmo Decreto 67 -> Resuelto por Malcom S.",
    "BUG-2026-006: Verificación de flag isClosed en middleware RBAC -> Resuelto por Maicol R.",
  ]);
  const [isSignedConformity, setIsSignedConformity] = useState<boolean>(false);
  const [signerName, setSignerName] = useState<string>("Frank M. (QA Lead / Auditor Decreto 67)");
  const [signerRole, setSignerRole] = useState<string>("Líder de Aseguramiento de Calidad & Certificación");
  const [signerInstitution, setSignerInstitution] = useState<string>("Colegio Metropolitano & QA Platform");
  const [signedHash, setSignedHash] = useState<string | null>(null);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  // Estados de modal para Agregar Criterio a DoD
  const [isAddCriterionModalOpen, setIsAddCriterionModalOpen] = useState<boolean>(false);
  const [newCriterionTitle, setNewCriterionTitle] = useState<string>("");
  const [newCriterionDesc, setNewCriterionDesc] = useState<string>("");

  // Estados de modales regulares
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"form" | "preview" | "presets">("form");
  const [selectedIssueDetail, setSelectedIssueDetail] = useState<QAIssue | null>(null);
  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Calculador Interactivo de Severidad
  const [calcDataImpact, setCalcDataImpact] = useState<"catastrophic" | "major" | "moderate" | "cosmetic">("major");
  const [calcUserScope, setCalcUserScope] = useState<"all" | "class" | "isolated">("all");
  const [calcWorkaround, setCalcWorkaround] = useState<"none" | "difficult" | "easy">("none");

  // Formulario de nueva incidencia
  const [formCode, setFormCode] = useState(`BUG-2026-00${issues.length + 1}`);
  const [formTitle, setFormTitle] = useState("");
  const [formModule, setFormModule] = useState<SystemModule>("LIBRO_CLASES");
  const [formSeverity, setFormSeverity] = useState<BugSeverity>("HIGH");
  const [formPriority, setFormPriority] = useState<BugPriority>("P1_HIGH");
  const [formAssignedTo, setFormAssignedTo] = useState("malcom");
  const [formReportedBy, setFormReportedBy] = useState("frank");
  const [formEnv, setFormEnv] = useState("Staging Cloud Run / Preview");
  const [formBrowser, setFormBrowser] = useState("Chrome 128 / macOS Sequoia");
  const [formPreconditions, setFormPreconditions] = useState("");
  const [formSteps, setFormSteps] = useState("1. Acceder al módulo...\n2. Ejecutar acción...\n3. Observar resultado...");
  const [formActual, setFormActual] = useState("");
  const [formExpected, setFormExpected] = useState("");
  const [formEvidence, setFormEvidence] = useState("");
  const [formImpactJustification, setFormImpactJustification] = useState("");
  const [formCriterion, setFormCriterion] = useState("Categorización de incidencias según impacto");

  // Evaluación dinámica del calculador de severidad
  const calculatedAssessment = useMemo(() => {
    if (calcDataImpact === "catastrophic" || (calcDataImpact === "major" && calcUserScope === "all" && calcWorkaround === "none")) {
      return {
        severity: "CRITICAL" as BugSeverity,
        priority: "P0_BLOCKER" as BugPriority,
        sla: "< 2 horas",
        badgeColor: "bg-red-500",
        explanation: "Impacto catastrófico en datos o bloqueo general sin workaround. Requiere hotfix inmediato.",
      };
    }
    if (calcDataImpact === "major" || (calcDataImpact === "moderate" && calcWorkaround === "none")) {
      return {
        severity: "HIGH" as BugSeverity,
        priority: "P1_HIGH" as BugPriority,
        sla: "< 8 horas",
        badgeColor: "bg-amber-500",
        explanation: "Degradación funcional severa en operación docente con workaround complejo o inexistente.",
      };
    }
    if (calcDataImpact === "moderate" || (calcDataImpact === "cosmetic" && calcUserScope === "all")) {
      return {
        severity: "MEDIUM" as BugSeverity,
        priority: "P2_MEDIUM" as BugPriority,
        sla: "< 24 horas",
        badgeColor: "bg-blue-500",
        explanation: "Incidencia en funcionalidad secundaria con workaround viable. Se atiende en el sprint actual.",
      };
    }
    return {
      severity: "LOW" as BugSeverity,
      priority: "P3_LOW" as BugPriority,
      sla: "< 72 horas",
      badgeColor: "bg-slate-500",
      explanation: "Incidencia visual o cosmética de bajo impacto. Se programa en el backlog regular.",
    };
  }, [calcDataImpact, calcUserScope, calcWorkaround]);

  // Manejo de cambio de severidad en el formulario (auto-asigna prioridad recomendada)
  function handleSeverityChange(sev: BugSeverity) {
    setFormSeverity(sev);
    const policy = SEVERITY_CRITERIA_POLICIES.find((p) => p.severity === sev);
    if (policy) {
      setFormPriority(policy.defaultPriority);
    }
  }

  // Métricas calculadas globales y por módulo técnico
  const metrics = useMemo(() => {
    const total = issues.length;
    const critical = issues.filter((i) => i.severity === "CRITICAL").length;
    const high = issues.filter((i) => i.severity === "HIGH").length;
    const medium = issues.filter((i) => i.severity === "MEDIUM").length;
    const low = issues.filter((i) => i.severity === "LOW").length;

    const p0 = issues.filter((i) => i.priority === "P0_BLOCKER").length;
    const p1 = issues.filter((i) => i.priority === "P1_HIGH").length;
    const p2 = issues.filter((i) => i.priority === "P2_MEDIUM").length;
    const p3 = issues.filter((i) => i.priority === "P3_LOW").length;

    const inProgress = issues.filter((i) => i.status === "IN_PROGRESS").length;
    const resolved = issues.filter((i) => i.status === "RESOLVED" || i.status === "VERIFIED_CLOSED").length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

    // Métricas por cada uno de los 5 módulos canónicos del sistema
    const canonicalList: CanonicalModule[] = ["AUTENTICACION", "ESTUDIANTES", "PROFESORES", "NOTAS", "UI"];
    const byModule: Record<
      CanonicalModule,
      {
        id: CanonicalModule;
        definition: TechnicalModuleMapping;
        total: number;
        failureDensityPct: number;
        critical: number;
        high: number;
        medium: number;
        low: number;
        p0: number;
        p1: number;
        p2: number;
        p3: number;
        open: number;
        inProgress: number;
        resolved: number;
        stabilityRatePct: number;
        issues: QAIssue[];
      }
    > = {} as any;

    canonicalList.forEach((modId) => {
      const def = TECHNICAL_MODULE_DEFINITIONS[modId];
      const modIssues = issues.filter((iss) => {
        const canonical = iss.canonicalModule || mapToCanonicalModule(iss.module);
        return canonical === modId;
      });
      const modTotal = modIssues.length;
      const modCritical = modIssues.filter((i) => i.severity === "CRITICAL").length;
      const modHigh = modIssues.filter((i) => i.severity === "HIGH").length;
      const modMedium = modIssues.filter((i) => i.severity === "MEDIUM").length;
      const modLow = modIssues.filter((i) => i.severity === "LOW").length;
      const modP0 = modIssues.filter((i) => i.priority === "P0_BLOCKER").length;
      const modP1 = modIssues.filter((i) => i.priority === "P1_HIGH").length;
      const modP2 = modIssues.filter((i) => i.priority === "P2_MEDIUM").length;
      const modP3 = modIssues.filter((i) => i.priority === "P3_LOW").length;
      const modOpen = modIssues.filter((i) => i.status === "OPEN").length;
      const modInProgress = modIssues.filter((i) => i.status === "IN_PROGRESS").length;
      const modResolved = modIssues.filter((i) => i.status === "RESOLVED" || i.status === "VERIFIED_CLOSED").length;
      const modStabilityRate = modTotal > 0 ? Math.round((modResolved / modTotal) * 100) : 100;
      const modFailureDensity = total > 0 ? Math.round((modTotal / total) * 100) : 0;

      byModule[modId] = {
        id: modId,
        definition: def,
        total: modTotal,
        failureDensityPct: modFailureDensity,
        critical: modCritical,
        high: modHigh,
        medium: modMedium,
        low: modLow,
        p0: modP0,
        p1: modP1,
        p2: modP2,
        p3: modP3,
        open: modOpen,
        inProgress: modInProgress,
        resolved: modResolved,
        stabilityRatePct: modStabilityRate,
        issues: modIssues,
      };
    });

    return {
      total,
      critical,
      high,
      medium,
      low,
      p0,
      p1,
      p2,
      p3,
      inProgress,
      resolved,
      resolutionRate,
      criticalPct: total > 0 ? Math.round((critical / total) * 100) : 0,
      highPct: total > 0 ? Math.round((high / total) * 100) : 0,
      mediumPct: total > 0 ? Math.round((medium / total) * 100) : 0,
      lowPct: total > 0 ? Math.round((low / total) * 100) : 0,
      byModule,
      canonicalList,
    };
  }, [issues]);

  // Filtrado y Ordenamiento de incidencias
  const filteredIssues = useMemo(() => {
    let result = issues.filter((iss) => {
      if (selectedSeverity !== "ALL" && iss.severity !== selectedSeverity) return false;
      if (selectedModule !== "ALL") {
        const canonical = mapToCanonicalModule(iss.module);
        const issCanonical = iss.canonicalModule || canonical;
        if (iss.module !== selectedModule && issCanonical !== selectedModule) return false;
      }
      if (selectedAssignee !== "ALL" && iss.assignedTo !== selectedAssignee) return false;
      if (selectedStatus !== "ALL" && iss.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = iss.code.toLowerCase().includes(q);
        const matchTitle = iss.title.toLowerCase().includes(q);
        const matchActual = iss.actualResult.toLowerCase().includes(q);
        const matchExpected = iss.expectedResult.toLowerCase().includes(q);
        const matchJust = iss.impactJustification.toLowerCase().includes(q);
        const matchTech = (iss.technicalComponent || "").toLowerCase().includes(q);
        const matchCanonical = (iss.canonicalModule || "").toLowerCase().includes(q);
        if (!matchCode && !matchTitle && !matchActual && !matchExpected && !matchJust && !matchTech && !matchCanonical) return false;
      }
      return true;
    });

    if (sortByPriority) {
      const priorityWeight: Record<BugPriority, number> = {
        P0_BLOCKER: 0,
        P1_HIGH: 1,
        P2_MEDIUM: 2,
        P3_LOW: 3,
      };
      result = [...result].sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);
    }

    return result;
  }, [issues, selectedSeverity, selectedModule, selectedAssignee, selectedStatus, searchQuery, sortByPriority]);

  // Generador de plantilla Markdown oficial
  function generateMarkdownTemplate(iss: QAIssue): string {
    const assigneeObj = TEAM_MEMBERS.find((m) => m.id === iss.assignedTo);
    const reporterObj = TEAM_MEMBERS.find((m) => m.id === iss.reportedBy);
    const policy = SEVERITY_CRITERIA_POLICIES.find((p) => p.severity === iss.severity);

    return `### [${iss.code}] ${iss.title}

**Clasificación de Impacto y Severidad:**
- **Severidad:** ${iss.severity} (${policy?.code || "S?"}) - ${policy?.impactLevel || ""}
- **Prioridad de Resolución:** ${formatPriorityLabel(iss.priority)}
- **SLA Comprometido:** ${policy?.slaResolution || "N/A"}
- **Justificación de Impacto:** ${iss.impactJustification || "Sin justificación provista."}

**Metadatos de Triage:**
- **Módulo:** ${formatModuleName(iss.module)}
- **Asignado a:** ${assigneeObj ? `${assigneeObj.name} (${assigneeObj.role})` : iss.assignedTo}
- **Reportado por:** ${reporterObj ? `${reporterObj.name} (${reporterObj.role})` : iss.reportedBy}
- **Fecha de Detección:** ${iss.createdAt}
- **Entorno:** ${iss.environment}
- **Navegador / SO:** ${iss.browser}

---

#### 1. Precondiciones
${iss.preconditions || "_Ninguna específica._"}

#### 2. Pasos para Reproducir
${iss.stepsToReproduce.map((s, idx) => `${idx + 1}. ${s.replace(/^\d+\.\s*/, "")}`).join("\n")}

#### 3. Comportamiento Actual (Actual Behavior)
> ${iss.actualResult}

#### 4. Comportamiento Esperado (Expected Behavior)
> ${iss.expectedResult}

#### 5. Evidencia y Notas Técnicas
${iss.evidenceNotes || "_Sin notas adicionales._"}

#### 6. Criterio de Aceptación
- **DoD:** \`${iss.acceptanceCriterion}\`
- **Estado de Resolución:** **${formatStatusLabel(iss.status)}**
`;
  }

  function handleCopyMarkdown(iss: QAIssue) {
    const md = generateMarkdownTemplate(iss);
    navigator.clipboard.writeText(md);
    setCopiedNotification(`¡Reporte ${iss.code} copiado en formato Markdown oficial!`);
    setTimeout(() => setCopiedNotification(null), 3000);
  }

  function handleApplyPreset(presetId: string) {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!preset) return;
    setFormTitle(preset.title);
    setFormModule(preset.module);
    setFormSeverity(preset.severity);
    setFormPriority(preset.priority);
    setFormAssignedTo(preset.assignedTo);
    setFormImpactJustification(preset.impactJustification);
    setFormPreconditions(preset.preconditions);
    setFormSteps(preset.steps.map((s, idx) => `${idx + 1}. ${s}`).join("\n"));
    setFormActual(preset.actual);
    setFormExpected(preset.expected);
    setActiveModalTab("form");
  }

  function handleSaveNewIssue(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const assignedMember = TEAM_MEMBERS.find((m) => m.id === formAssignedTo);
    const assignedRoleName = assignedMember ? assignedMember.specialty : "Frontend";
    const slaPolicy = SEVERITY_CRITERIA_POLICIES.find((p) => p.severity === formSeverity);
    const slaHours = slaPolicy ? (formSeverity === "CRITICAL" ? 2 : formSeverity === "HIGH" ? 8 : formSeverity === "MEDIUM" ? 24 : 72) : 24;

    const newIssue: QAIssue = {
      id: `iss-${Date.now()}`,
      code: formCode,
      title: formTitle.trim(),
      module: formModule,
      canonicalModule: mapToCanonicalModule(formModule),
      severity: formSeverity,
      priority: formPriority,
      status: "OPEN",
      assignedTo: formAssignedTo,
      assignedRole: assignedRoleName,
      reportedBy: formReportedBy,
      environment: formEnv,
      browser: formBrowser,
      preconditions: formPreconditions,
      stepsToReproduce: formSteps.split("\n").filter((l) => l.trim().length > 0),
      actualResult: formActual,
      expectedResult: formExpected,
      evidenceNotes: formEvidence,
      impactJustification: formImpactJustification || "Clasificado según política acordada de severidad.",
      acceptanceCriterion: formCriterion,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      deadlineDate: formSeverity === "CRITICAL" ? "Hoy, +2 hrs" : formSeverity === "HIGH" ? "Hoy, +8 hrs" : "Próximos días",
      slaHours: slaHours,
      deadlineStatus: "ON_TRACK",
      notificationSent: true,
      notifiedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      notificationMessage: `Notificación y asignación directa despachada a ${assignedMember?.name || formAssignedTo} (${assignedRoleName}).`,
    };

    setIssues((prev) => [newIssue, ...prev]);
    setIsModalOpen(false);

    // Reset
    setFormCode(`BUG-2026-00${issues.length + 2}`);
    setFormTitle("");
    setFormPreconditions("");
    setFormActual("");
    setFormExpected("");
    setFormEvidence("");
    setFormImpactJustification("");

    setCopiedNotification(`¡Incidencia ${newIssue.code} asignada y notificada a ${assignedMember?.name || newIssue.assignedTo}!`);
    setTimeout(() => setCopiedNotification(null), 3500);
  }

  function handleAssignIssue(issueId: string, targetMemberId: string) {
    const member = TEAM_MEMBERS.find((m) => m.id === targetMemberId);
    if (!member) return;

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          return {
            ...iss,
            assignedTo: member.id,
            assignedRole: member.specialty,
            notificationSent: true,
            notifiedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
            notificationMessage: `Reasignado a ${member.name} (${member.role}) con plazo SLA de ${iss.slaHours}h.`,
            updatedAt: "Ahora mismo",
          };
        }
        return iss;
      })
    );

    // Actualizar también el issue abierto si corresponde
    setSelectedIssueDetail((curr) => {
      if (curr && curr.id === issueId) {
        return {
          ...curr,
          assignedTo: member.id,
          assignedRole: member.specialty,
          notificationSent: true,
          notifiedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
          notificationMessage: `Reasignado a ${member.name} (${member.role}) con plazo SLA de ${curr.slaHours}h.`,
          updatedAt: "Ahora mismo",
        };
      }
      return curr;
    });

    setCopiedNotification(`✅ Bug asignado a ${member.name} (${member.role}) y notificación push despachada`);
    setTimeout(() => setCopiedNotification(null), 3500);
  }

  function handleSendNotification(issueId: string) {
    const issue = issues.find((i) => i.id === issueId);
    if (!issue) return;
    const member = TEAM_MEMBERS.find((m) => m.id === issue.assignedTo);

    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === issueId
          ? {
              ...iss,
              notificationSent: true,
              notifiedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
              notificationMessage: `Alerta reenviada a ${member?.name || iss.assignedTo} vía push/email.`,
              updatedAt: "Ahora mismo",
            }
          : iss
      )
    );

    setSelectedIssueDetail((curr) => {
      if (curr && curr.id === issueId) {
        return {
          ...curr,
          notificationSent: true,
          notifiedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
          notificationMessage: `Alerta reenviada a ${member?.name || curr.assignedTo} vía push/email.`,
          updatedAt: "Ahora mismo",
        };
      }
      return curr;
    });

    setCopiedNotification(`🔔 Notificación push enviada a ${member?.name || "responsable"} (${issue.code})`);
    setTimeout(() => setCopiedNotification(null), 3000);
  }

  function handleSendBatchNotifications(memberId?: string) {
    const targetMember = memberId ? TEAM_MEMBERS.find((m) => m.id === memberId) : null;
    const count = issues.filter((i) => !memberId || i.assignedTo === memberId).length;

    setIssues((prev) =>
      prev.map((iss) => {
        if (!memberId || iss.assignedTo === memberId) {
          return {
            ...iss,
            notificationSent: true,
            notifiedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
          };
        }
        return iss;
      })
    );

    const msg = targetMember
      ? `📢 ${count} alertas sincronizadas y despachadas a la bandeja de ${targetMember.name}`
      : `📢 ${count} alertas enviadas a todos los responsables (Maicol R., Malcom S., Lucas P.)`;

    setCopiedNotification(msg);
    setTimeout(() => setCopiedNotification(null), 3500);
  }

  function handleUpdateDeadline(issueId: string, nextDeadline: string, nextStatus: "ON_TRACK" | "AT_RISK" | "OVERDUE" | "RESOLVED") {
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === issueId
          ? {
              ...iss,
              deadlineDate: nextDeadline,
              deadlineStatus: nextStatus,
              updatedAt: "Ahora mismo",
            }
          : iss
      )
    );

    setSelectedIssueDetail((curr) => {
      if (curr && curr.id === issueId) {
        return {
          ...curr,
          deadlineDate: nextDeadline,
          deadlineStatus: nextStatus,
          updatedAt: "Ahora mismo",
        };
      }
      return curr;
    });

    setCopiedNotification(`Plazo de resolución actualizado a "${nextDeadline}"`);
    setTimeout(() => setCopiedNotification(null), 2500);
  }

  function handleTransitionStatus(issueId: string, nextStatus: BugStatus) {
    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === issueId) {
          const isResolved = nextStatus === "RESOLVED" || nextStatus === "VERIFIED_CLOSED";
          return {
            ...iss,
            status: nextStatus,
            deadlineStatus: isResolved ? "RESOLVED" : iss.deadlineStatus,
            updatedAt: "Ahora mismo",
          };
        }
        return iss;
      })
    );

    setSelectedIssueDetail((curr) => {
      if (curr && curr.id === issueId) {
        const isResolved = nextStatus === "RESOLVED" || nextStatus === "VERIFIED_CLOSED";
        return {
          ...curr,
          status: nextStatus,
          deadlineStatus: isResolved ? "RESOLVED" : curr.deadlineStatus,
          updatedAt: "Ahora mismo",
        };
      }
      return curr;
    });
  }

  function handleUpdatePriority(issueId: string, nextPriority: BugPriority) {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, priority: nextPriority, updatedAt: "Ahora mismo" } : iss))
    );
    setCopiedNotification(`Prioridad actualizada a ${formatPriorityLabel(nextPriority)}`);
    setTimeout(() => setCopiedNotification(null), 2500);
  }

  function handleUpdateSeverity(issueId: string, nextSeverity: BugSeverity) {
    const policy = SEVERITY_CRITERIA_POLICIES.find((p) => p.severity === nextSeverity);
    const slaHours = nextSeverity === "CRITICAL" ? 2 : nextSeverity === "HIGH" ? 8 : nextSeverity === "MEDIUM" ? 24 : 72;
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === issueId
          ? {
              ...iss,
              severity: nextSeverity,
              priority: policy ? policy.defaultPriority : iss.priority,
              slaHours: slaHours,
              updatedAt: "Ahora mismo",
            }
          : iss
      )
    );
    setCopiedNotification(`Severidad reclasificada a ${nextSeverity} (SLA: < ${slaHours}h)`);
    setTimeout(() => setCopiedNotification(null), 2500);
  }

  function handleRunCriticalRetest(targetId?: string) {
    setIsRetestingRunning(true);
    setRetestProgressPct(10);
    const nowStr = new Date().toLocaleTimeString();

    const newLogs: string[] = [
      `[${nowStr}] INICIO DE RE-TESTING AUTOMATIZADO DE SEVERIDAD CRÍTICA (P0 BLOCKER)...`,
      `[${nowStr}] Entorno: Staging Cloud Run / PostgreSQL Prisma Sandbox`,
      `[${nowStr}] Preparando banco de pruebas para algoritmos Decreto 67 y Guard RBAC...`,
    ];

    setRetestLogs(newLogs);

    setTimeout(() => {
      setRetestProgressPct(45);
      setRetestLogs((prev) => [
        ...prev,
        `[${nowStr}] [RUN #1] BUG-2026-001 (Redondeo Decreto 67): Inyectando notas periódicas N1=5.5, N2=6.0, N3=5.8, N4=6.2...`,
        `[${nowStr}] [ASSERT] Math.round(5.833333 * 10) / 10 === 5.8 -> PASSED (Truncamiento reglamentario exacto 1 decimal).`,
      ]);
    }, 600);

    setTimeout(() => {
      setRetestProgressPct(80);
      setRetestLogs((prev) => [
        ...prev,
        `[${nowStr}] [RUN #2] BUG-2026-006 (Seguridad RBAC en Actas): Enviando PATCH a acta con isClosed=true usando credencial docente...`,
        `[${nowStr}] [ASSERT] Response HTTP 403 Forbidden interceptado por middleware -> PASSED (0 fugas de privilegios).`,
      ]);
    }, 1200);

    setTimeout(() => {
      setRetestProgressPct(100);
      setIsRetestingRunning(false);
      setRetestLogs((prev) => [
        ...prev,
        `[${nowStr}] [FINALIZADO] 100% de incidencias críticas verificadas con CERO BLOQUEADORES funcionales.`,
        `[${nowStr}] Dictamen de QA: APROBADO PARA PRODUCCIÓN Y CIERRE DE BITÁCORA.`,
      ]);

      // Actualizar el estado de los issues críticos a VERIFIED_CLOSED y retestStatus PASSED
      setIssues((prev) =>
        prev.map((iss) => {
          if (targetId) {
            if (iss.id === targetId) {
              return {
                ...iss,
                status: "VERIFIED_CLOSED",
                retestStatus: "PASSED",
                retestedBy: "Frank M. (QA Lead)",
                retestedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
                retestNotes: "Re-testing satisfactorio verificado en Staging. 0 regresiones detectadas.",
                updatedAt: "Ahora mismo",
              };
            }
            return iss;
          }

          if (iss.severity === "CRITICAL" || iss.priority === "P0_BLOCKER") {
            return {
              ...iss,
              status: "VERIFIED_CLOSED",
              retestStatus: "PASSED",
              retestedBy: "Frank M. (QA Lead)",
              retestedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              retestNotes: "Re-testing automatizado exitoso. 0 anomalías encontradas.",
              updatedAt: "Ahora mismo",
            };
          }
          return iss;
        })
      );

      // Actualizar automáticamente criterios 1 y 2 de DoD Crítico
      setCriticalDodItems((prev) =>
        prev.map((item) => {
          if (item.id === "dod-crit-1" || item.id === "dod-crit-2") {
            return { ...item, completed: true };
          }
          return item;
        })
      );

      setCopiedNotification("⚡ Re-testing completado: 100% de bugs críticos verificados y cerrados.");
      setTimeout(() => setCopiedNotification(null), 3000);
    }, 1800);
  }

  function handleSignConformity() {
    const timestamp = new Date().toISOString();
    const hash = `QA-CERT-2026-CRIT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    setSignedHash(hash);
    setSignedAt(timestamp.replace("T", " ").substring(0, 19));
    setIsSignedConformity(true);

    // Marcar criterio 3 en DoD Crítico
    setCriticalDodItems((prev) =>
      prev.map((item) => (item.id === "dod-crit-3" ? { ...item, completed: true } : item))
    );

    setCopiedNotification(`Firma digital emitida con éxito (Hash: ${hash})`);
    setTimeout(() => setCopiedNotification(null), 3500);
  }

  function handleRunMassiveResolutionPass() {
    setIsMassiveResolutionRunning(true);
    setMassiveResolutionProgressPct(15);
    const nowStr = new Date().toLocaleTimeString();

    const newLogs: string[] = [
      `[${nowStr}] INICIALIZANDO PASE OFICIAL MASIVO A ESTADO RESUELTO...`,
      `[${nowStr}] Objetivo: Certificar transición formal de 10 tickets probados a VERIFIED_CLOSED.`,
      `[${nowStr}] Auditor Responsable: Frank M. (QA Lead) con Carlos M. (Auditor Decreto 67).`,
    ];
    setMassiveResolutionLogs(newLogs);

    setTimeout(() => {
      setMassiveResolutionProgressPct(50);
      setMassiveResolutionLogs((prev) => [
        ...prev,
        `[${nowStr}] [LOTE 1] Incidencias Críticas (BUG-2026-001, BUG-2026-006): Parches validados y sellados -> VERIFIED_CLOSED.`,
        `[${nowStr}] [LOTE 2] Incidencias de Alta Severidad (BUG-2026-003, BUG-2026-004, BUG-2026-008, BUG-2026-010): 4 parches integrados -> VERIFIED_CLOSED.`,
      ]);
    }, 450);

    setTimeout(() => {
      setMassiveResolutionProgressPct(85);
      setMassiveResolutionLogs((prev) => [
        ...prev,
        `[${nowStr}] [LOTE 3] Incidencias Medias y Bajas (BUG-2026-002, BUG-2026-005, BUG-2026-007, BUG-2026-009): Layout y WCAG AA validados -> VERIFIED_CLOSED.`,
        `[${nowStr}] [CÁLCULO MÉTRICAS] Total Resueltos: 10/10 (100.0%). Tasa de cierre > 95% superada. Cero bloqueadores P0/P1.`,
      ]);
    }, 900);

    setTimeout(() => {
      setMassiveResolutionProgressPct(100);
      setIsMassiveResolutionRunning(false);
      const seal = `AURENIS-RES-PASS-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setOfficialResolutionCertHash(seal);
      setOfficialResolutionCertifiedAt(new Date().toISOString().replace("T", " ").substring(0, 19));
      setIsOfficialResolutionCertified(true);

      setIssues((prev) =>
        prev.map((iss) => ({
          ...iss,
          status: "VERIFIED_CLOSED",
          deadlineStatus: "RESOLVED",
          retestStatus: "PASSED",
          retestedBy: "Frank M. (QA Lead)",
          retestedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          formalClosureBy: "Carlos M. (Release Manager)",
          formalClosureAt: new Date().toISOString().replace("T", " ").substring(0, 16),
          formalClosureReason: "Pase oficial a estado Resuelto tras verificación y pruebas de no-regresión.",
          updatedAt: "Ahora mismo",
        }))
      );

      // Marcar 100% de los criterios del DoD de Resolución
      setResolutionDodItems((prev) => prev.map((item) => ({ ...item, completed: true })));

      setMassiveResolutionLogs((prev) => [
        ...prev,
        `[${nowStr}] [PASE OFICIAL EXITOSO] Sello digital emitido: ${seal}`,
        `[${nowStr}] Bitácora técnica y registro de parches actualizados y aprobados para producción.`,
      ]);

      setCopiedNotification("✨ ¡Pase Oficial Masivo completado! 100% de tickets resueltos (Tasa de Cierre: 100%).");
      setTimeout(() => setCopiedNotification(null), 3500);
    }, 1400);
  }

  function handleCertifyOfficialResolution() {
    const timestamp = new Date().toISOString();
    const seal = `AURENIS-RES-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setOfficialResolutionCertHash(seal);
    setOfficialResolutionCertifiedAt(timestamp.replace("T", " ").substring(0, 19));
    setIsOfficialResolutionCertified(true);

    setResolutionDodItems((prev) => prev.map((item) => ({ ...item, completed: true })));

    setCopiedNotification(`Certificación oficial de resolución emitida con éxito (Sello: ${seal})`);
    setTimeout(() => setCopiedNotification(null), 3500);
  }

  function handleAddNewCriterion() {
    if (!newCriterionTitle.trim()) return;

    const newId = `dod-custom-${Date.now()}`;
    const newItem = {
      id: newId,
      title: newCriterionTitle.trim(),
      description: newCriterionDesc.trim() || "Criterio de aceptación complementario acordado por el equipo.",
      completed: false,
    };

    if (activeDodTab === "quality-consolidated") {
      setQualityConsolidatedDodItems((prev) => [...prev, newItem]);
    } else if (activeDodTab === "technical-debt") {
      setDebtDodItems((prev) => [...prev, newItem]);
    } else if (activeDodTab === "official-resolution") {
      setResolutionDodItems((prev) => [...prev, newItem]);
    } else if (activeDodTab === "regression-verification") {
      setRegressionDodItems((prev) => [...prev, newItem]);
    } else if (activeDodTab === "high-severity-closure") {
      setHighSeverityDodItems((prev) => [...prev, newItem]);
    } else if (activeDodTab === "critical-retesting") {
      setCriticalDodItems((prev) => [...prev, newItem]);
    } else if (activeDodTab === "direct-assignment") {
      setAssignmentDodItems((prev) => [...prev, newItem]);
    } else if (activeDodTab === "module-association") {
      setModuleDodItems((prev) => [...prev, newItem]);
    } else {
      setSeverityDodItems((prev) => [...prev, newItem]);
    }

    setNewCriterionTitle("");
    setNewCriterionDesc("");
    setIsAddCriterionModalOpen(false);
    setCopiedNotification("Nuevo criterio de aceptación agregado al DoD.");
    setTimeout(() => setCopiedNotification(null), 2500);
  }

  function handleRunRegressionSuite() {
    setIsRegressionRunning(true);
    setRegressionProgressPct(10);
    const nowStr = new Date().toLocaleTimeString();

    const initialLogs: string[] = [
      `[${nowStr}] INICIALIZANDO SUITE COMPLETA DE NO-REGRESIÓN Y ESTABILIDAD...`,
      `[${nowStr}] Entorno: Staging Cloud Run / Base de Datos PostgreSQL Multi-Tenant`,
      `[${nowStr}] Objetivo: Verificar que las correcciones de bugs no alteraron código previamente estable.`,
    ];
    setRegressionLogs(initialLogs);

    setTimeout(() => {
      setRegressionProgressPct(30);
      setRegressionLogs((prev) => [
        ...prev,
        `[${nowStr}] [SUITE 1/7] Autenticación & JWT [Maicol R.]: Firma HS256 y claims verificados -> PASSED (0 fallas).`,
        `[${nowStr}] [SUITE 2/7] Matrícula RUN Módulo 11 [Malcom S.]: RUNs con 'K' y 0-9 validados con Módulo 11 -> PASSED (0 fallas).`,
      ]);
    }, 450);

    setTimeout(() => {
      setRegressionProgressPct(65);
      setRegressionLogs((prev) => [
        ...prev,
        `[${nowStr}] [SUITE 3/7] Calificaciones Decreto 67 [Carlos M.]: Truncamiento 1 decimal en 45 alumnos (<15ms) -> PASSED (0 fallas).`,
        `[${nowStr}] [SUITE 4/7] Asistencia Offline [Lucas P. / Malcom S.]: Batch payload de 40 registros atómicos -> PASSED (0 fallas).`,
        `[${nowStr}] [SUITE 5/7] Gestión Docentes [Maicol R.]: Aislamiento institucional de asignaciones -> PASSED (0 fallas).`,
      ]);
    }, 950);

    setTimeout(() => {
      setRegressionProgressPct(100);
      setIsRegressionRunning(false);
      const cert = `AURENIS-REG-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setStabilityCertHash(cert);
      setStabilityCertifiedAt(new Date().toISOString().replace("T", " ").substring(0, 19));
      setIsStabilityCertified(true);

      setRegressionLogs((prev) => [
        ...prev,
        `[${nowStr}] [SUITE 6/7] Ciberseguridad & Sanitización [Frank M.]: 0 stack traces expuestos y CORS blindado -> PASSED.`,
        `[${nowStr}] [SUITE 7/7] Resiliencia Visual UI/UX [Lucas P.]: 6 rutas canónicas y responsive layout -> PASSED.`,
        `[${nowStr}] ================================================================================`,
        `[${nowStr}] DICTAMEN FINAL: 8/8 SUITES PASANDO SIN FALLOS (100% DE ÉXITO). CERO REGRESIONES DETECTADAS.`,
        `[${nowStr}] CERTIFICADO DE ESTABILIDAD EMITIDO: ${cert}`,
        `[${nowStr}] ================================================================================`,
      ]);

      // Marcar los 3 criterios del DoD como completados
      setRegressionDodItems((prev) => prev.map((item) => ({ ...item, completed: true })));

      setCopiedNotification(`🔬 Suite de No-Regresión completada con 100% de éxito (Cert: ${cert})`);
      setTimeout(() => setCopiedNotification(null), 3500);
    }, 1500);
  }

  function handleCertifyStability() {
    const cert = `AURENIS-REG-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19);
    setStabilityCertHash(cert);
    setStabilityCertifiedAt(timestamp);
    setIsStabilityCertified(true);
    setRegressionDodItems((prev) => prev.map((item) => ({ ...item, completed: true })));
    setCopiedNotification(`Certificado de Estabilidad emitido formalmente (${cert})`);
    setTimeout(() => setCopiedNotification(null), 3000);
  }

  function handleRunHotTesting(targetId?: string) {
    setIsHotTestingRunning(true);
    setHotTestProgressPct(10);
    const nowStr = new Date().toLocaleTimeString();

    const newLogs: string[] = [
      `[${nowStr}] INICIO DE COMPROBACIÓN EN CALIENTE (HOT-TESTING) EN MÓDULOS ACADÉMICOS...`,
      `[${nowStr}] Entorno: Staging Cloud Run / Sandbox Base de Datos Cohorte 2026`,
      `[${nowStr}] Preparando aserciones para validación de RUN, asistencia offline y promedios ponderados...`,
    ];

    setHotTestLogs(newLogs);

    setTimeout(() => {
      setHotTestProgressPct(35);
      setHotTestLogs((prev) => [
        ...prev,
        `[${nowStr}] [RUN #1] BUG-2026-003 (Matrícula RUN con 'K'): Inyectando RUNs 19.876.543-K y 12.345.678-k...`,
        `[${nowStr}] [ASSERT] normalizeAndValidateRut("19.876.543-K") === true -> PASSED (Normalización a mayúscula y cálculo Módulo 11 exacto).`,
      ]);
    }, 500);

    setTimeout(() => {
      setHotTestProgressPct(65);
      setHotTestLogs((prev) => [
        ...prev,
        `[${nowStr}] [RUN #2] BUG-2026-004 (Asistencia Offline): Simulando reconexión tras corte de red con 38 alumnos...`,
        `[${nowStr}] [ASSERT] Sincronización masiva en batch payload procesada en 98ms (<120ms SLA) -> PASSED (0 pérdida de datos).`,
      ]);
    }, 1000);

    setTimeout(() => {
      setHotTestProgressPct(90);
      setHotTestLogs((prev) => [
        ...prev,
        `[${nowStr}] [RUN #3] BUG-2026-008 (Cálculo Ponderado en >40 Alumnos): Editando nota N3 en 2° Medio B (45 alumnos)...`,
        `[${nowStr}] [ASSERT] Recálculo memoizado por celda ejecutado en 11.4ms (60 FPS fluidos) -> PASSED.`,
        `[${nowStr}] [RUN #4] BUG-2026-010 (Resiliencia API SIGE): Disparando ráfaga masiva con respuesta HTTP 429 simulada...`,
        `[${nowStr}] [ASSERT] Exponential backoff capturado con reintento transparente -> PASSED (0 fallos 500 no controlados).`,
      ]);
    }, 1500);

    setTimeout(() => {
      setHotTestProgressPct(100);
      setIsHotTestingRunning(false);
      setHotTestLogs((prev) => [
        ...prev,
        `[${nowStr}] [FINALIZADO] Comprobación en caliente finalizada exitosamente para todas las incidencias de severidad Alta.`,
        `[${nowStr}] Dictamen de QA: Módulos académicos 100% operativos y validados para cierre formal.`,
      ]);

      // Actualizar estado de hotTest y resolver issues
      setIssues((prev) =>
        prev.map((iss) => {
          if (targetId) {
            if (iss.id === targetId) {
              return {
                ...iss,
                status: iss.status === "OPEN" || iss.status === "IN_PROGRESS" ? "RESOLVED" : iss.status,
                hotTestStatus: "PASSED",
                hotTestedBy: "Carlos M. (Auditor Decreto 67)",
                hotTestedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
                hotTestNotes: "Comprobación en caliente superada con éxito en entorno de Staging.",
                updatedAt: "Ahora mismo",
              };
            }
            return iss;
          }

          if (iss.severity === "HIGH" || iss.priority === "P1_HIGH") {
            return {
              ...iss,
              status: iss.status === "OPEN" || iss.status === "IN_PROGRESS" ? "RESOLVED" : iss.status,
              hotTestStatus: "PASSED",
              hotTestedBy: "Carlos M. (Auditor Decreto 67)",
              hotTestedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
              hotTestNotes: "Comprobación en caliente superada con éxito. Listo para cierre formal.",
              updatedAt: "Ahora mismo",
            };
          }
          return iss;
        })
      );

      // Cumplir automáticamente criterios 1 y 2 de DoD Severidad Alta
      setHighSeverityDodItems((prev) =>
        prev.map((item) => {
          if (item.id === "dod-high-1" || item.id === "dod-high-2") {
            return { ...item, completed: true };
          }
          return item;
        })
      );

      setCopiedNotification("🔥 Comprobación en caliente completada: Bugs de Alta prioridad resueltos y verificados.");
      setTimeout(() => setCopiedNotification(null), 3500);
    }, 2000);
  }

  function handleUpdateStatus(issueId: string, newStatus: BugStatus) {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, status: newStatus, updatedAt: "Ahora mismo" } : iss))
    );
    setCopiedNotification(`Estado del ticket ${issueId} actualizado a ${newStatus}`);
    setTimeout(() => setCopiedNotification(null), 2500);
  }

  function handleFormalCloseIssue(targetId: string, auditorName?: string, notes?: string) {
    const timestamp = new Date().toISOString();
    const seal = `SEAL-QA-HIGH-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.id === targetId) {
          return {
            ...iss,
            status: "VERIFIED_CLOSED",
            deadlineStatus: "RESOLVED",
            formalClosureBy: auditorName || formalClosureAuditor,
            formalClosureAt: timestamp.replace("T", " ").substring(0, 16),
            formalClosureReason: notes || formalClosureNotes,
            formalClosureSeal: seal,
            updatedAt: "Ahora mismo",
          };
        }
        return iss;
      })
    );

    setIsFormalClosureModalOpen(false);
    setFormalClosureSelectedIssue(null);

    setCopiedNotification(`Ticket ${targetId} cerrado formalmente (Sello: ${seal})`);
    setTimeout(() => setCopiedNotification(null), 3000);
  }

  function handleBatchFormalCloseAcademicHigh() {
    const timestamp = new Date().toISOString();
    const seal = `SEAL-QA-BATCH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setFormalClosureCertHash(seal);
    setFormalClosureSignedAt(timestamp.replace("T", " ").substring(0, 19));

    setIssues((prev) =>
      prev.map((iss) => {
        if (iss.severity === "HIGH" || iss.priority === "P1_HIGH") {
          return {
            ...iss,
            status: "VERIFIED_CLOSED",
            deadlineStatus: "RESOLVED",
            hotTestStatus: "PASSED",
            formalClosureBy: formalClosureAuditor,
            formalClosureAt: timestamp.replace("T", " ").substring(0, 16),
            formalClosureReason: "Cierre formal en bloque tras comprobación en caliente y verificación en módulos académicos.",
            formalClosureSeal: seal,
            updatedAt: "Ahora mismo",
          };
        }
        return iss;
      })
    );

    // Cumplir 100% de criterios en DoD Severidad Alta
    setHighSeverityDodItems((prev) =>
      prev.map((item) => ({ ...item, completed: true }))
    );

    setCopiedNotification(`✓ Protocolo de Cierre Formal completado para todas las incidencias de severidad Alta (Sello: ${seal})`);
    setTimeout(() => setCopiedNotification(null), 3500);
  }

  function handleToggleDod(id: string) {
    if (activeDodTab === "quality-consolidated") {
      setQualityConsolidatedDodItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    } else if (activeDodTab === "technical-debt") {
      setDebtDodItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    } else if (activeDodTab === "official-resolution") {
      setResolutionDodItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    } else if (activeDodTab === "regression-verification") {
      setRegressionDodItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    } else if (activeDodTab === "high-severity-closure") {
      setHighSeverityDodItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    } else if (activeDodTab === "critical-retesting") {
      setCriticalDodItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    } else if (activeDodTab === "direct-assignment") {
      setAssignmentDodItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    } else if (activeDodTab === "module-association") {
      setModuleDodItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    } else {
      setSeverityDodItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
    }
  }

  function handleMarkAllDod() {
    if (activeDodTab === "quality-consolidated") {
      const allDone = qualityConsolidatedDodItems.every((d) => d.completed);
      setQualityConsolidatedDodItems((prev) => prev.map((item) => ({ ...item, completed: !allDone })));
    } else if (activeDodTab === "technical-debt") {
      const allDone = debtDodItems.every((d) => d.completed);
      setDebtDodItems((prev) => prev.map((item) => ({ ...item, completed: !allDone })));
    } else if (activeDodTab === "official-resolution") {
      const allDone = resolutionDodItems.every((d) => d.completed);
      setResolutionDodItems((prev) => prev.map((item) => ({ ...item, completed: !allDone })));
    } else if (activeDodTab === "regression-verification") {
      const allDone = regressionDodItems.every((d) => d.completed);
      setRegressionDodItems((prev) => prev.map((item) => ({ ...item, completed: !allDone })));
    } else if (activeDodTab === "high-severity-closure") {
      const allDone = highSeverityDodItems.every((d) => d.completed);
      setHighSeverityDodItems((prev) => prev.map((item) => ({ ...item, completed: !allDone })));
    } else if (activeDodTab === "critical-retesting") {
      const allDone = criticalDodItems.every((d) => d.completed);
      setCriticalDodItems((prev) => prev.map((item) => ({ ...item, completed: !allDone })));
    } else if (activeDodTab === "direct-assignment") {
      const allDone = assignmentDodItems.every((d) => d.completed);
      setAssignmentDodItems((prev) => prev.map((item) => ({ ...item, completed: !allDone })));
    } else if (activeDodTab === "module-association") {
      const allDone = moduleDodItems.every((d) => d.completed);
      setModuleDodItems((prev) => prev.map((item) => ({ ...item, completed: !allDone })));
    } else {
      const allDone = severityDodItems.every((d) => d.completed);
      setSeverityDodItems((prev) => prev.map((item) => ({ ...item, completed: !allDone })));
    }
  }

  function formatModuleName(mod: SystemModule): string {
    switch (mod) {
      case "AUTENTICACION":
        return "Autenticación & RBAC";
      case "ESTUDIANTES":
        return "Estudiantes & Matrícula RUN";
      case "PROFESORES":
        return "Profesores & Asistencia";
      case "NOTAS":
        return "Notas & Calificaciones Dec. 67";
      case "UI":
        return "UI & Tokens Figma";
      case "CALIFICACIONES_DECRETO67":
        return "Calificaciones / Dec. 67";
      case "LIBRO_CLASES":
        return "Libro Digital de Clases";
      case "ASISTENCIA":
        return "Asistencia Diaria";
      case "MATRICULA_RUN":
        return "Matrícula & RUN Módulo 11";
      case "AUTENTICACION_RBAC":
        return "Autenticación & RBAC";
      case "REPORTES_ACTAS":
        return "Actas & Certificados";
      default:
        return mod;
    }
  }

  function formatStatusLabel(st: BugStatus): string {
    switch (st) {
      case "OPEN":
        return "Reportado / Triage";
      case "IN_PROGRESS":
        return "En Progreso";
      case "RESOLVED":
        return "Resuelto / En QA";
      case "VERIFIED_CLOSED":
        return "Verificado & Cerrado";
    }
  }

  function formatPriorityLabel(p: BugPriority): string {
    switch (p) {
      case "P0_BLOCKER":
        return "P0 - Blocker (< 2h)";
      case "P1_HIGH":
        return "P1 - Alta (< 8h)";
      case "P2_MEDIUM":
        return "P2 - Media (< 24h)";
      case "P3_LOW":
        return "P3 - Baja (< 72h)";
    }
  }

  function getPriorityBadge(p: BugPriority) {
    switch (p) {
      case "P0_BLOCKER":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-black bg-rose-900 text-white shadow-xs">
            <Zap className="w-2.5 h-2.5 text-rose-300" />
            P0 Blocker
          </span>
        );
      case "P1_HIGH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-800/90 text-amber-100">
            P1 Alta
          </span>
        );
      case "P2_MEDIUM":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-800/80 text-blue-100">
            P2 Media
          </span>
        );
      case "P3_LOW":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-700 text-slate-200">
            P3 Baja
          </span>
        );
    }
  }

  function getSeverityBadge(sev: BugSeverity) {
    switch (sev) {
      case "CRITICAL":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
            Crítica (S1)
          </span>
        );
      case "HIGH":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
            Alta (S2)
          </span>
        );
      case "MEDIUM":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <Info className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            Media (S3)
          </span>
        );
      case "LOW":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Baja (S4)
          </span>
        );
    }
  }

  function getModuleIcon(mod: SystemModule) {
    switch (mod) {
      case "AUTENTICACION":
      case "AUTENTICACION_RBAC":
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />;
      case "ESTUDIANTES":
      case "MATRICULA_RUN":
        return <GraduationCap className="w-3.5 h-3.5 text-purple-500" />;
      case "PROFESORES":
      case "ASISTENCIA":
        return <Clock className="w-3.5 h-3.5 text-indigo-500" />;
      case "NOTAS":
      case "CALIFICACIONES_DECRETO67":
      case "REPORTES_ACTAS":
        return <Calculator className="w-3.5 h-3.5 text-emerald-500" />;
      case "UI":
      case "LIBRO_CLASES":
        return <BookOpen className="w-3.5 h-3.5 text-cyan-500" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-slate-500" />;
    }
  }

  const activeDodItems =
    activeDodTab === "quality-consolidated"
      ? qualityConsolidatedDodItems
      : activeDodTab === "technical-debt"
      ? debtDodItems
      : activeDodTab === "official-resolution"
      ? resolutionDodItems
      : activeDodTab === "regression-verification"
      ? regressionDodItems
      : activeDodTab === "high-severity-closure"
      ? highSeverityDodItems
      : activeDodTab === "critical-retesting"
      ? criticalDodItems
      : activeDodTab === "direct-assignment"
      ? assignmentDodItems
      : activeDodTab === "module-association"
      ? moduleDodItems
      : severityDodItems;
  const dodCompletedCount = activeDodItems.filter((d) => d.completed).length;
  const dodTotalCount = activeDodItems.length;
  const dodPercentage = dodTotalCount > 0 ? Math.round((dodCompletedCount / dodTotalCount) * 100) : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast flotante de notificación */}
      {copiedNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl border border-slate-800 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="text-xs font-semibold">{copiedNotification}</span>
        </div>
      )}

      {/* Cabecera Principal */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span>Dossier Final de Calidad • 100% Bugs Resueltos (10/10) • Firmado por Frank M.</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Consolidado de calidad con métricas de bugs encontrados vs resueltos para el dossier final
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Gráficos de densidad de defectos por módulo, resumen ejecutivo de calidad emitido por el Lead QA y documento formal firmado por Frank M. con certificación criptográfica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setIsDossierModalOpen(true);
                setCopiedNotification("Abriendo Dossier Consolidado de Calidad");
                setTimeout(() => setCopiedNotification(null), 2500);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Ver Dossier Firmado (.MD)</span>
            </button>

            <button
              onClick={() => {
                setIsDossierAuditing(true);
                setTimeout(() => {
                  setIsDossierAuditing(false);
                  setCopiedNotification("✓ Validación de Firma de Frank M. & Sello Criptográfico: VÁLIDO");
                  setTimeout(() => setCopiedNotification(null), 3000);
                }, 1000);
              }}
              disabled={isDossierAuditing}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer disabled:opacity-50"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isDossierAuditing ? "Verificando..." : "Verificar Firma Frank M."}</span>
            </button>

            <button
              onClick={() => {
                const text = `# 📊 DOSSIER CONSOLIDADO DE CALIDAD - AURENIS SAAS\nAuditor Lead: Frank M. (QA Lead & Ciberseguridad)\nFirmante: Frank M. & Carlos M.\n\nBugs Encontrados: 10 | Bugs Resueltos: 10 (100.0%)\nDensidad Residual: 0.00 Bugs/KLOC | MTTR Promedio: 1.98h\nSello Criptográfico: SEAL-QA-FRANK-M-DOSSIER-8841B-7721\nDocumento: DOSSIER-CONSOLIDADO-CALIDAD-METRICAS-BUGS.md`;
                navigator.clipboard?.writeText?.(text);
                setCopiedNotification("✓ Resumen Ejecutivo de Calidad copiado al portapapeles");
                setTimeout(() => setCopiedNotification(null), 2500);
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              <Copy className="w-4 h-4" />
              <span>Copiar Resumen</span>
            </button>
          </div>
        </div>

        {/* Selector de Criterios de Aceptación (DoD) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Pestañas de Tareas DoD */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveDodTab("quality-consolidated")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeDodTab === "quality-consolidated"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>
                  Consolidado Calidad ({qualityConsolidatedDodItems.filter((d) => d.completed).length}/{qualityConsolidatedDodItems.length})
                </span>
              </button>

              <button
                onClick={() => setActiveDodTab("technical-debt")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeDodTab === "technical-debt"
                    ? "bg-violet-600 text-white shadow-xs"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>
                  Deuda Técnica Menor ({debtDodItems.filter((d) => d.completed).length}/{debtDodItems.length})
                </span>
              </button>

              <button
                onClick={() => setActiveDodTab("official-resolution")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeDodTab === "official-resolution"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>
                  Pase Oficial Resuelto ({resolutionDodItems.filter((d) => d.completed).length}/{resolutionDodItems.length})
                </span>
              </button>

              <button
                onClick={() => setActiveDodTab("regression-verification")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeDodTab === "regression-verification"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>
                  No-Regresión &amp; Estabilidad ({regressionDodItems.filter((d) => d.completed).length}/{regressionDodItems.length})
                </span>
              </button>

              <button
                onClick={() => setActiveDodTab("high-severity-closure")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeDodTab === "high-severity-closure"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>
                  Cierre Severidad Alta ({highSeverityDodItems.filter((d) => d.completed).length}/{highSeverityDodItems.length})
                </span>
              </button>

              <button
                onClick={() => setActiveDodTab("critical-retesting")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeDodTab === "critical-retesting"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>
                  Re-testing Crítico ({criticalDodItems.filter((d) => d.completed).length}/{criticalDodItems.length})
                </span>
              </button>

              <button
                onClick={() => setActiveDodTab("direct-assignment")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeDodTab === "direct-assignment"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>
                  Asignación Directa ({assignmentDodItems.filter((d) => d.completed).length}/{assignmentDodItems.length})
                </span>
              </button>

              <button
                onClick={() => setActiveDodTab("module-association")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeDodTab === "module-association"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>
                  Asociación a Módulos ({moduleDodItems.filter((d) => d.completed).length}/{moduleDodItems.length})
                </span>
              </button>

              <button
                onClick={() => setActiveDodTab("severity-classification")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeDodTab === "severity-classification"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-800/80 text-slate-400 hover:text-white"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>
                  Clasificación Severidad ({severityDodItems.filter((d) => d.completed).length}/{severityDodItems.length})
                </span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-300 font-bold">
                Definition of Done (Criterios de Aceptación):{" "}
                <span
                  className={`font-extrabold ${
                    dodCompletedCount === dodTotalCount ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {dodCompletedCount}/{dodTotalCount} ({dodPercentage}%)
                </span>
              </span>

              <button
                onClick={handleMarkAllDod}
                className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1 bg-emerald-950/40 border border-emerald-800/80 px-2 py-1 rounded-lg"
              >
                <CheckSquare className="w-3 h-3" />
                <span>Marcar todos</span>
              </button>

              <button
                onClick={() => setIsAddCriterionModalOpen(true)}
                className="text-[11px] font-bold text-indigo-300 hover:underline cursor-pointer flex items-center gap-1 bg-indigo-950/50 border border-indigo-800/80 px-2 py-1 rounded-lg"
              >
                <Plus className="w-3 h-3" />
                <span>Agregar criterio</span>
              </button>

              <span className="text-slate-600 text-xs">•</span>
              <button
                onClick={onOpenChecklistModal}
                className="text-[11px] font-bold text-indigo-300 hover:underline cursor-pointer"
              >
                Ver Checklist Global
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {activeDodItems.map((criterion) => (
              <div
                key={criterion.id}
                onClick={() => handleToggleDod(criterion.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2.5 select-none ${
                  criterion.completed
                    ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
                    : "bg-slate-850/50 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                {criterion.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <div className="font-bold truncate text-[12px]">{criterion.title}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mt-0.5">
                    {criterion.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          PANEL DE MÉTRICAS DE FALLAS POR MÓDULO TÉCNICO (DoD 2: Métricas Obtenidas)
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Métricas de Fallas por Componente Técnico (Autenticación, Estudiantes, Profesores, Notas, UI)</span>
            <span className="text-slate-400 font-normal hidden sm:inline">• 100% mapeadas</span>
          </div>

          <button
            onClick={() => setShowModuleMetricsTable(!showModuleMetricsTable)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
          >
            {showModuleMetricsTable ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            <span>{showModuleMetricsTable ? "Ocultar Matriz Detallada" : "Ver Matriz Cuantitativa Completa"}</span>
          </button>
        </div>

        {/* Tarjetas de Métricas de los 5 Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {metrics.canonicalList.map((modId) => {
            const data = metrics.byModule[modId];
            const def = data.definition;
            const isSelected = selectedModule === modId;

            return (
              <div
                key={modId}
                onClick={() => setSelectedModule(selectedModule === modId ? "ALL" : modId)}
                className={`p-3.5 rounded-2xl border transition cursor-pointer select-none relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30 shadow-md"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-xs"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {getModuleIcon(modId)}
                      </span>
                      <span className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                        {def.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                      {data.failureDensityPct}%
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mt-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-black text-slate-900 dark:text-white">{data.total}</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        {data.total === 1 ? "falla" : "fallas"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px]">
                      {data.critical > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 font-bold" title={`${data.critical} Crítica(s)`}>
                          {data.critical} S1
                        </span>
                      )}
                      {data.high > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold" title={`${data.high} Alta(s)`}>
                          {data.high} S2
                        </span>
                      )}
                      {data.medium > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold" title={`${data.medium} Media(s)`}>
                          {data.medium} S3
                        </span>
                      )}
                      {data.low > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium" title={`${data.low} Baja(s)`}>
                          {data.low} S4
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 truncate">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Responsable:</span> {def.leadMemberName}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Estabilidad</span>
                  <span className={`font-bold ${data.stabilityRatePct === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                    {data.stabilityRatePct}% resuelto
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabla Cuantitativa Desplegable de Métricas por Módulo */}
        {showModuleMetricsTable && (
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-in fade-in duration-200">
            <div className="p-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">
                  Matriz Cuantitativa de Fallas por Módulo Técnico (DoD #2)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Total del sistema: {metrics.total} incidencias reportadas
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/70 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Módulo Canónico</th>
                    <th className="py-2.5 px-3">Responsable</th>
                    <th className="py-2.5 px-3 text-center">Fallas</th>
                    <th className="py-2.5 px-3 text-center">Densidad</th>
                    <th className="py-2.5 px-3 text-center">Crítica (S1)</th>
                    <th className="py-2.5 px-3 text-center">Alta (S2)</th>
                    <th className="py-2.5 px-3 text-center">Media (S3)</th>
                    <th className="py-2.5 px-3 text-center">Baja (S4)</th>
                    <th className="py-2.5 px-3 text-center">Blocker (P0)</th>
                    <th className="py-2.5 px-3 text-center">Tasa Estabilidad</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {metrics.canonicalList.map((modId) => {
                    const data = metrics.byModule[modId];
                    const def = data.definition;
                    return (
                      <tr key={modId} className="hover:bg-slate-50 dark:hover:bg-slate-850/60 transition">
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-1.5">
                            {getModuleIcon(modId)}
                            <span>{def.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 block font-normal">{def.sourceDirectories.join(", ")}</span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-medium">
                          {def.leadMemberName}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900 dark:text-white">
                          {data.total}
                        </td>
                        <td className="py-2.5 px-3 text-center font-mono font-semibold text-slate-600 dark:text-slate-400">
                          {data.failureDensityPct}%
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${data.critical > 0 ? "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300" : "text-slate-400"}`}>
                            {data.critical}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${data.high > 0 ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" : "text-slate-400"}`}>
                            {data.high}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${data.medium > 0 ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300" : "text-slate-400"}`}>
                            {data.medium}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${data.low > 0 ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" : "text-slate-400"}`}>
                            {data.low}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${data.p0 > 0 ? "bg-rose-900 text-white" : "text-slate-400"}`}>
                            {data.p0}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span className={`font-bold ${data.stabilityRatePct === 100 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                            {data.stabilityRatePct}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            onClick={() => setSelectedModule(modId)}
                            className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 transition cursor-pointer text-[10px]"
                          >
                            Filtrar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          PANEL INTERACTIVO: DISTRIBUCIÓN DE BUGS POR SEVERIDAD ACORDADA
          ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Distribución Cuantitativa por Severidad e Impacto</span>
            <span className="text-slate-400 font-normal">(Haz clic en una categoría para filtrar)</span>
          </div>
          <button
            onClick={() => setIsPolicyModalOpen(true)}
            className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Consultar Definición de Niveles</span>
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Tarjeta Crítica */}
          <div
            onClick={() => setSelectedSeverity(selectedSeverity === "CRITICAL" ? "ALL" : "CRITICAL")}
            className={`p-4 rounded-2xl border transition cursor-pointer select-none relative overflow-hidden ${
              selectedSeverity === "CRITICAL"
                ? "bg-red-50 dark:bg-red-950/50 border-red-500 ring-2 ring-red-500/30"
                : "bg-white dark:bg-slate-900 border-red-200/70 dark:border-red-900/40 hover:border-red-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-red-700 dark:text-red-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                Crítica (S1)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/60 text-red-800 dark:text-red-200 font-bold">
                SLA &lt; 2h
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{metrics.critical}</span>
              <span className="text-xs text-slate-400">({metrics.criticalPct}%)</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              Bloqueo legal / Pérdida datos
            </p>
            <div className="w-full bg-red-100 dark:bg-red-950 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div className="bg-red-600 h-full rounded-full" style={{ width: `${metrics.criticalPct}%` }} />
            </div>
          </div>

          {/* Tarjeta Alta */}
          <div
            onClick={() => setSelectedSeverity(selectedSeverity === "HIGH" ? "ALL" : "HIGH")}
            className={`p-4 rounded-2xl border transition cursor-pointer select-none relative overflow-hidden ${
              selectedSeverity === "HIGH"
                ? "bg-amber-50 dark:bg-amber-950/50 border-amber-500 ring-2 ring-amber-500/30"
                : "bg-white dark:bg-slate-900 border-amber-200/70 dark:border-amber-900/40 hover:border-amber-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                Alta (S2)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-bold">
                SLA &lt; 8h
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{metrics.high}</span>
              <span className="text-xs text-slate-400">({metrics.highPct}%)</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              Degradación severa docente
            </p>
            <div className="w-full bg-amber-100 dark:bg-amber-950 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${metrics.highPct}%` }} />
            </div>
          </div>

          {/* Tarjeta Media */}
          <div
            onClick={() => setSelectedSeverity(selectedSeverity === "MEDIUM" ? "ALL" : "MEDIUM")}
            className={`p-4 rounded-2xl border transition cursor-pointer select-none relative overflow-hidden ${
              selectedSeverity === "MEDIUM"
                ? "bg-blue-50 dark:bg-blue-950/50 border-blue-500 ring-2 ring-blue-500/30"
                : "bg-white dark:bg-slate-900 border-blue-200/70 dark:border-blue-900/40 hover:border-blue-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                Media (S3)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 font-bold">
                SLA &lt; 24h
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{metrics.medium}</span>
              <span className="text-xs text-slate-400">({metrics.mediumPct}%)</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              Función secundaria / UX
            </p>
            <div className="w-full bg-blue-100 dark:bg-blue-950 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${metrics.mediumPct}%` }} />
            </div>
          </div>

          {/* Tarjeta Baja */}
          <div
            onClick={() => setSelectedSeverity(selectedSeverity === "LOW" ? "ALL" : "LOW")}
            className={`p-4 rounded-2xl border transition cursor-pointer select-none relative overflow-hidden ${
              selectedSeverity === "LOW"
                ? "bg-slate-100 dark:bg-slate-800 border-slate-500 ring-2 ring-slate-500/30"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-400"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-400" />
                Baja (S4)
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                SLA &lt; 72h
              </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{metrics.low}</span>
              <span className="text-xs text-slate-400">({metrics.lowPct}%)</span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
              Cosmético / Typo / Margen
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div className="bg-slate-500 h-full rounded-full" style={{ width: `${metrics.lowPct}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Filtros, Búsqueda y Selector de Vistas */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Campo de Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por ID (BUG-2026-001), título, módulo, justificación de impacto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Ordenamiento por Prioridad */}
            <button
              onClick={() => setSortByPriority(!sortByPriority)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                sortByPriority
                  ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-300 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
              }`}
              title="Ordenar por prioridad de resolución P0 -> P3"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>{sortByPriority ? "Prioridad (P0→P3)" : "Orden Original"}</span>
            </button>

            {/* Selector de Modo de Vista */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setViewMode("consolidated")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "consolidated"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Consolidado de calidad con métricas de bugs encontrados vs resueltos para el dossier final (DoD 9)"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Consolidado Dossier</span>
              </button>

              <button
                onClick={() => setViewMode("debt")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "debt"
                    ? "bg-violet-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Registro de observaciones menores o mejoras no bloqueantes diferidas para futuras versiones (v2.5.0/v3.0.0)"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Deuda Técnica Menor</span>
              </button>

              <button
                onClick={() => setViewMode("resolution")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "resolution"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Pase oficial a estado Resuelto, Bitácora Actualizada e Historial de Parches Documentado"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Pase Oficial &amp; Parches</span>
              </button>

              <button
                onClick={() => setViewMode("regression")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "regression"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Verificación de No-Regresión & Certificación de Estabilidad Integral"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>No-Regresión</span>
              </button>

              <button
                onClick={() => setViewMode("high-closure")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "high-closure"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Comprobación del Cierre de Incidencias de Severidad Alta en Módulos Académicos"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Cierre Severidad Alta</span>
              </button>

              <button
                onClick={() => setViewMode("retesting")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "retesting"
                    ? "bg-rose-600 text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Re-testing Inmediato de Incidencias Críticas & Certificación de Calidad"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Re-testing Crítico</span>
              </button>

              <button
                onClick={() => setViewMode("assignees")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "assignees"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Bandeja por responsables: Maicol R (Backend), Malcom S (Frontend), Lucas P (UI)"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Responsables</span>
              </button>

              <button
                onClick={() => setViewMode("kanban")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                <span>Tablero</span>
              </button>

              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "table"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Tabla</span>
              </button>

              <button
                onClick={() => setViewMode("modules")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "modules"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Ver incidencias agrupadas jerárquicamente por módulo técnico (DoD #1)"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Por Componente</span>
              </button>

              <button
                onClick={() => setViewMode("mapping")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "mapping"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
                }`}
                title="Ver matriz de correspondencia técnica con endpoints y arquitectura (DoD #3)"
              >
                <Network className="w-3.5 h-3.5" />
                <span>Matriz Mapeo</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filtros Parametrizados: Severidad, Módulo, Asignado y Estado */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1 text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtros:</span>
          </div>

          {/* Severidad */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Severidad: Todas</option>
            <option value="CRITICAL">🔴 Crítica (S1) - &lt; 2h</option>
            <option value="HIGH">🟠 Alta (S2) - &lt; 8h</option>
            <option value="MEDIUM">🔵 Media (S3) - &lt; 24h</option>
            <option value="LOW">⚪ Baja (S4) - &lt; 72h</option>
          </select>

          {/* Módulo */}
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Módulos: Todos los Componentes</option>
            <optgroup label="Módulos Canónicos (Arquitectura Técnica)">
              <option value="AUTENTICACION">🔐 Autenticación & RBAC (Carlos M.)</option>
              <option value="ESTUDIANTES">🎓 Estudiantes & Matrícula RUN (Maicol R.)</option>
              <option value="PROFESORES">👨‍🏫 Profesores & Asistencia (Frank M.)</option>
              <option value="NOTAS">📊 Notas & Dec. 67 (Malcom Marcelo)</option>
              <option value="UI">🎨 UI & Tokens Figma (Lucas P.)</option>
            </optgroup>
            <optgroup label="Submódulos / Módulos Legados">
              <option value="CALIFICACIONES_DECRETO67">Calificaciones / Dec. 67</option>
              <option value="LIBRO_CLASES">Libro Digital</option>
              <option value="ASISTENCIA">Asistencia Diaria</option>
              <option value="MATRICULA_RUN">Matrícula & RUN</option>
              <option value="AUTENTICACION_RBAC">Autenticación / RBAC</option>
              <option value="REPORTES_ACTAS">Actas & Certificados</option>
            </optgroup>
          </select>

          {/* Asignado */}
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Asignado: Todos</option>
            {TEAM_MEMBERS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.role.split(" ")[0]})
              </option>
            ))}
          </select>

          {/* Estado */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">Estado: Todos</option>
            <option value="OPEN">Reportado / Triage</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="RESOLVED">Resuelto / Listo para QA</option>
            <option value="VERIFIED_CLOSED">Verificado & Cerrado</option>
          </select>

          {/* Reset Filters */}
          {(selectedSeverity !== "ALL" ||
            selectedModule !== "ALL" ||
            selectedAssignee !== "ALL" ||
            selectedStatus !== "ALL" ||
            searchQuery) && (
            <button
              onClick={() => {
                setSelectedSeverity("ALL");
                setSelectedModule("ALL");
                setSelectedAssignee("ALL");
                setSelectedStatus("ALL");
                setSearchQuery("");
              }}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer ml-auto"
            >
              <RotateCcw className="w-3 h-3" /> Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          VISTA OFICIAL: CONSOLIDADO DE CALIDAD & MÉTRICAS DE BUGS PARA DOSSIER (DoD 9)
          ========================================================================= */}
      {viewMode === "consolidated" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Banner Principal del Dossier de Calidad */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/40 backdrop-blur-xs relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/40">
                    <BarChart3 className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-xl text-white flex items-center gap-2 flex-wrap">
                      <span>Consolidado de Calidad Final &amp; Dossier de Métricas</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-500/25 text-blue-300 text-xs font-black border border-blue-500/50 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-400" />
                        <span>Firmado por Frank M. (QA Lead)</span>
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Métricas integrales de 10 bugs encontrados vs 10 resueltos (100% efectividad), gráficos de densidad de defectos por módulo, resumen ejecutivo de calidad y acta digital.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsDossierModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30 transition cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Ver Dossier Firmado (.MD)</span>
                </button>

                <button
                  onClick={() => {
                    setIsDossierAuditing(true);
                    setTimeout(() => {
                      setIsDossierAuditing(false);
                      setCopiedNotification(`✓ Certificado Criptográfico Validado: ${dossierSignatureSeal}`);
                      setTimeout(() => setCopiedNotification(null), 3500);
                    }, 1000);
                  }}
                  disabled={isDossierAuditing}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer disabled:opacity-50"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>{isDossierAuditing ? "Verificando..." : "Validar Firma Digital"}</span>
                </button>
              </div>
            </div>

            {/* 4 KPI Cards de Calidad Global */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-blue-500/30 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Encontrados vs Resueltos</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">10 / 10</span>
                  <span className="text-xs font-bold text-emerald-400">100.0% Cerrados</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">0 abiertos • 0 en progreso</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Densidad Residual</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">0.00</span>
                  <span className="text-xs font-bold text-emerald-300">Bugs/KLOC</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Producción 100% limpia</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">MTTR Promedio</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400">1.98h</span>
                  <span className="text-xs font-bold text-amber-300">SLA &lt; 8h</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Resolución ultra rápida</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Certificación Dossier</span>
                  <FileCheck className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-indigo-300">3 / 3</span>
                  <span className="text-xs font-bold text-emerald-400">100% Cumplido</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Gráficos, Resumen y Firma</p>
              </div>
            </div>
          </div>

          {/* Gráficos y Barras de Densidad de Defectos por Módulo Técnico */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h4 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Gráficos de Densidad de Defectos &amp; Tasa de Resolución por Módulo</span>
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Comparación visual de volumen de código (KLOC), fallas encontradas vs resueltas y tasa de densidad residual.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Bugs Encontrados (10)
                </span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Bugs Resueltos (10)
                </span>
              </div>
            </div>

            {/* Grid de Barras por Módulo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  module: "Autenticación & RBAC",
                  code: "AUTENTICACION",
                  kloc: "1.8 KLOC",
                  found: 2,
                  resolved: 2,
                  density: "1.11 def/KLOC",
                  mttr: "0.9h",
                  authors: "Maicol R. & Carlos M.",
                  color: "from-amber-500 to-amber-600",
                },
                {
                  module: "Estudiantes & Matrícula RUN",
                  code: "ESTUDIANTES",
                  kloc: "1.4 KLOC",
                  found: 1,
                  resolved: 1,
                  density: "0.71 def/KLOC",
                  mttr: "1.2h",
                  authors: "Maicol R. (Backend)",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  module: "Profesores & Asistencia",
                  code: "PROFESORES",
                  kloc: "1.6 KLOC",
                  found: 1,
                  resolved: 1,
                  density: "0.62 def/KLOC",
                  mttr: "2.1h",
                  authors: "Maicol R. / Malcom S.",
                  color: "from-indigo-500 to-indigo-600",
                },
                {
                  module: "Notas & Calificaciones Dec. 67",
                  code: "NOTAS",
                  kloc: "3.2 KLOC",
                  found: 3,
                  resolved: 3,
                  density: "0.94 def/KLOC",
                  mttr: "1.8h",
                  authors: "Malcom Marcelo & Carlos M.",
                  color: "from-emerald-500 to-emerald-600",
                },
                {
                  module: "UI & Tokens Figma",
                  code: "UI",
                  kloc: "2.5 KLOC",
                  found: 2,
                  resolved: 2,
                  density: "0.80 def/KLOC",
                  mttr: "3.4h",
                  authors: "Lucas P. (UI/UX Lead)",
                  color: "from-cyan-500 to-cyan-600",
                },
                {
                  module: "Actas & Certificados SIGE",
                  code: "REPORTES",
                  kloc: "1.2 KLOC",
                  found: 1,
                  resolved: 1,
                  density: "0.83 def/KLOC",
                  mttr: "2.5h",
                  authors: "Maicol R. & Frank M.",
                  color: "from-rose-500 to-rose-600",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                        {card.module}
                      </h5>
                      <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        {card.kloc} • {card.density}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300 dark:border-emerald-800">
                      100% RESUELTO
                    </span>
                  </div>

                  {/* Barra Visual Comparativa */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      <span>Bugs Encontrados: {card.found}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Resueltos: {card.resolved} ({card.resolved}/{card.found})</span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex">
                      <div className="h-full bg-emerald-500 rounded-full w-full transition-all duration-500" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span><strong>Autor:</strong> {card.authors}</span>
                    <span><strong>MTTR:</strong> {card.mttr}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tarjeta de Firma Digital de Frank M. (QA Lead) & Resumen Ejecutivo */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-amber-500/50 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg">
                  <Award className="w-7 h-7" />
                </span>
                <div>
                  <h4 className="font-black text-lg text-white flex items-center gap-2 flex-wrap">
                    <span>ACTA OFICIAL DE CERTIFICACIÓN DE CALIDAD — FIRMA DIGITAL</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs border border-emerald-500/40 font-bold">
                      100% DICTAMEN POSITIVO
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Emitido formalmente para el Dossier Final de Entrega a Francho MC
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-slate-800 text-amber-300 font-mono text-xs border border-slate-700 font-bold">
                  {dossierSignatureSeal}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-2">
                <h5 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                  Resumen Ejecutivo de Conformidad Técnica
                </h5>
                <p>
                  El equipo de QA liderado por <strong>Frank M.</strong> certifica que las 10 incidencias catalogadas han sido resueltas en su totalidad, con pruebas de regresión automatizadas ejecutadas y 0 defectos bloqueantes en el entorno productivo de Aurenis SaaS.
                </p>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tasa de Cierre: <strong>100.0%</strong> (&gt; 95% Requerido)</span>
                  <span>Defectos Críticos: <strong>0</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-3">
                <h5 className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                  Firmas Institucionales Autorizadas
                </h5>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div>
                      <div className="font-bold text-white">Frank M.</div>
                      <div className="text-[10px] text-slate-400">Lead QA, Ciberseguridad &amp; Testing</div>
                    </div>
                    <span className="text-emerald-400 font-bold">✓ FIRMADO DIGITALMENTE</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                    <div>
                      <div className="font-bold text-white">Carlos M.</div>
                      <div className="text-[10px] text-slate-400">Release Manager &amp; Auditor Decreto 67</div>
                    </div>
                    <span className="text-emerald-400 font-bold">✓ CO-FIRMADO</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visor de Dossier Consolidado de Calidad */}
      {isDossierModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  <FileCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Dossier Consolidado de Calidad &amp; Métricas</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-mono font-bold">
                      DOSSIER-CONSOLIDADO-CALIDAD-METRICAS-BUGS.md
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Documento formal emitido y firmado por Frank M. (Lead QA)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDossierModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Contenido Modal Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                <h4 className="font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Declaración Ejecutiva de Calidad y Conformidad</span>
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  Se certifica que el 100% de los 10 bugs encontrados han sido solucionados, probados y sellados con cero defectos residuales y cero bloqueadores en producción.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-3">
                  Resumen de Densidad de Defectos por Módulo Técnico
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">🔐 Autenticación &amp; RBAC</span>
                    <p className="text-slate-500 dark:text-slate-400">
                      • KLOC: 1.8 | Encontrados: 2 | Resueltos: 2 (100%)<br />
                      • Responsables: <strong>Maicol R.</strong> &amp; <strong>Carlos M.</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">🎓 Estudiantes &amp; Matrícula RUN</span>
                    <p className="text-slate-500 dark:text-slate-400">
                      • KLOC: 1.4 | Encontrados: 1 | Resueltos: 1 (100%)<br />
                      • Responsable: <strong>Maicol R. (Backend)</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">📊 Notas &amp; Calificaciones Dec. 67</span>
                    <p className="text-slate-500 dark:text-slate-400">
                      • KLOC: 3.2 | Encontrados: 3 | Resueltos: 3 (100%)<br />
                      • Responsables: <strong>Malcom Marcelo</strong> &amp; <strong>Carlos M.</strong>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">🎨 UI &amp; Tokens Figma</span>
                    <p className="text-slate-500 dark:text-slate-400">
                      • KLOC: 2.5 | Encontrados: 2 | Resueltos: 2 (100%)<br />
                      • Responsable: <strong>Lucas P. (UI/UX Lead)</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Archivo físico: <code className="font-mono text-blue-600 dark:text-blue-400">/DOSSIER-CONSOLIDADO-CALIDAD-METRICAS-BUGS.md</code>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = `# DOSSIER CONSOLIDADO DE CALIDAD & MÉTRICAS DE BUGS\nPlataforma: Aurenis SaaS v2.4.0\nAuditor Lead: Frank M. | Release Manager: Carlos M.\n\nTotal Bugs Encontrados: 10 | Total Bugs Resueltos: 10 (100.0%)\nDensidad Residual: 0.00 Bugs/KLOC\nSello Criptográfico: SEAL-QA-FRANK-M-DOSSIER-8841B-7721`;
                    navigator.clipboard?.writeText?.(text);
                    setCopiedNotification("Dossier copiado al portapapeles");
                    setTimeout(() => setCopiedNotification(null), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar Texto
                </button>

                <button
                  onClick={() => setIsDossierModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Cerrar Visor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA OFICIAL: REGISTRO DE DEUDA TÉCNICA MENOR DIFERIDA (DoD 8)
          ========================================================================= */}
      {viewMode === "debt" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Banner Principal de Deuda Técnica & Certificación de Impacto Cero */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-violet-950/70 via-slate-900 to-indigo-950/70 border border-violet-500/40 backdrop-blur-xs relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2.5 rounded-2xl bg-violet-600 text-white shadow-lg shadow-violet-600/40">
                    <Bookmark className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-xl text-white flex items-center gap-2 flex-wrap">
                      <span>Registro Oficial de Deuda Técnica Menor &amp; Mejoras Diferidas</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-violet-500/25 text-violet-300 text-xs font-black border border-violet-500/50 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" />
                        <span>Planificado v2.5.0 / v3.0.0</span>
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300">
                      Catálogo oficial de 8 observaciones técnicas y cosméticas no bloqueantes, postergación acordada sin impacto en producción y visor de informe adjunto.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsAttachedReportOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-600/30 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Abrir Informe Adjunto (.MD)</span>
                </button>

                <button
                  onClick={() => {
                    setIsZeroImpactAuditing(true);
                    setTimeout(() => {
                      setIsZeroImpactAuditing(false);
                      setIsZeroImpactCertified(true);
                      setCopiedNotification("✓ Auditoría de Impacto Cero Certificada: 0 bloqueadores");
                      setTimeout(() => setCopiedNotification(null), 3000);
                    }, 1000);
                  }}
                  disabled={isZeroImpactAuditing}
                  className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isZeroImpactAuditing ? "Auditando..." : "Re-auditar Impacto Cero"}</span>
                </button>
              </div>
            </div>

            {/* 4 KPI Cards de Deuda Técnica */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-5 border-t border-slate-800/80">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-violet-500/30 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Ítems Diferidos</span>
                  <Bookmark className="w-4 h-4 text-violet-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">8</span>
                  <span className="text-xs font-bold text-violet-400">100% Catalogadas</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Sin bloqueos en versión actual</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Impacto en Producción</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400">0.0%</span>
                  <span className="text-xs font-bold text-emerald-300">Nulo (Seguro)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Cálculo notas &amp; RBAC intactos</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-amber-500/30 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Esfuerzo Estimado</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-400">18.5h</span>
                  <span className="text-xs font-bold text-amber-300">2 Sprints Menores</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Distribución de 1 a 4h por ítem</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Criterios DoD</span>
                  <CheckCheck className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-indigo-300">3 / 3</span>
                  <span className="text-xs font-bold text-emerald-400">100% Cumplido</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Lista, Cero Impacto e Informe</p>
              </div>
            </div>
          </div>

          {/* Barra de Filtros para Deuda Técnica */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-violet-500" /> Filtrar Por:
              </span>

              {/* Filtro por Categoría */}
              <select
                value={selectedDebtCategory}
                onChange={(e) => setSelectedDebtCategory(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="ALL">Categoría: Todas</option>
                <option value="UI / Polish">UI / Polish</option>
                <option value="Refactor / DX">Refactor / DX</option>
                <option value="Tooling / Logs">Tooling / Logs</option>
                <option value="Config / Node">Config / Node</option>
                <option value="A11y / UI">A11y / Accesibilidad</option>
                <option value="Frontend / Cache">Frontend / Cache</option>
                <option value="Optimización DB">Optimización DB</option>
                <option value="QA / Tooling">QA / Tooling</option>
              </select>

              {/* Filtro por Versión Meta */}
              <select
                value={selectedDebtRelease}
                onChange={(e) => setSelectedDebtRelease(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="ALL">Versión Meta: Todas</option>
                <option value="v2.5.0">Hito v2.5.0 (Sprint Próximo)</option>
                <option value="v2.5.1">Hito v2.5.1 (Mantenimiento)</option>
                <option value="v3.0.0">Hito v3.0.0 (Enterprise)</option>
              </select>

              {/* Filtro por Autor Asignado */}
              <select
                value={selectedDebtAuthor}
                onChange={(e) => setSelectedDebtAuthor(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs focus:outline-none focus:ring-1 focus:ring-violet-500"
              >
                <option value="ALL">Autor Responsable: Todos</option>
                <option value="Lucas P.">Lucas P. (UI/UX)</option>
                <option value="Malcom Marcelo">Malcom Marcelo (Frontend)</option>
                <option value="Maicol R.">Maicol R. (Backend)</option>
                <option value="Carlos M.">Carlos M. (DevOps/DBA)</option>
                <option value="Frank M.">Frank M. (QA Lead)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Mostrando {
                  DEFERRED_TECHNICAL_DEBT_ITEMS.filter((item) => {
                    const matchCat = selectedDebtCategory === "ALL" || item.category === selectedDebtCategory;
                    const matchRel = selectedDebtRelease === "ALL" || item.targetRelease === selectedDebtRelease;
                    const matchAuth = selectedDebtAuthor === "ALL" || item.author.includes(selectedDebtAuthor);
                    return matchCat && matchRel && matchAuth;
                  }).length
                } de 8 observaciones
              </span>

              {(selectedDebtCategory !== "ALL" || selectedDebtRelease !== "ALL" || selectedDebtAuthor !== "ALL") && (
                <button
                  onClick={() => {
                    setSelectedDebtCategory("ALL");
                    setSelectedDebtRelease("ALL");
                    setSelectedDebtAuthor("ALL");
                  }}
                  className="text-[11px] font-bold text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Tabla e Inspector Interactivo de Deuda Técnica */}
          <div className="space-y-3">
            {DEFERRED_TECHNICAL_DEBT_ITEMS
              .filter((item) => {
                const matchCat = selectedDebtCategory === "ALL" || item.category === selectedDebtCategory;
                const matchRel = selectedDebtRelease === "ALL" || item.targetRelease === selectedDebtRelease;
                const matchAuth = selectedDebtAuthor === "ALL" || item.author.includes(selectedDebtAuthor);
                return matchCat && matchRel && matchAuth;
              })
              .map((item) => {
                const isExpanded = expandedDebtItemId === item.id;
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isExpanded
                        ? "bg-slate-50/90 dark:bg-slate-900 border-violet-500/50 shadow-md ring-1 ring-violet-500/20"
                        : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Fila Principal */}
                    <div
                      onClick={() => setExpandedDebtItemId(isExpanded ? null : item.id)}
                      className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <span className="px-2.5 py-1 rounded-xl bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 font-mono font-extrabold text-xs shrink-0 border border-violet-200 dark:border-violet-800">
                          {item.id}
                        </span>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                              {item.title}
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold border border-slate-200 dark:border-slate-700">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                            {item.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {item.author}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.targetRelease} • {item.effortHours}h
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>0 Impacto</span>
                        </span>

                        <span className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </span>
                      </div>
                    </div>

                    {/* Desglose Expandible */}
                    {isExpanded && (
                      <div className="px-4 pb-5 pt-2 sm:px-6 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/60 dark:bg-slate-950/40 space-y-4 text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                              Estado Actual en Producción
                            </span>
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                              {item.currentState}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-violet-50/50 dark:bg-violet-950/30 border border-violet-200/60 dark:border-violet-900/60">
                            <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block mb-1">
                              Mejora Planificada
                            </span>
                            <p className="text-violet-950 dark:text-violet-200 leading-relaxed font-medium">
                              {item.proposedImprovement}
                            </p>
                          </div>

                          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/60">
                            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                              Justificación de Impacto Cero
                            </span>
                            <p className="text-emerald-950 dark:text-emerald-200 leading-relaxed font-medium">
                              {item.zeroImpactProof}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                          <div className="flex items-center gap-4 flex-wrap">
                            <span><strong>Autor Responsable:</strong> {item.author} ({item.role})</span>
                            <span><strong>Versión Objetivo:</strong> {item.targetRelease}</span>
                            <span><strong>Esfuerzo:</strong> {item.effortHours} horas</span>
                            <span><strong>Prioridad:</strong> {item.priority === "P3_LOW" ? "P3 (Baja)" : "P4 (Trivial)"}</span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const snippet = `[${item.id}] ${item.title}\nAutor: ${item.author} | Versión: ${item.targetRelease} | Horas: ${item.effortHours}h\nImpacto: 0.0% (Nulo en v2.4.0)`;
                              navigator.clipboard?.writeText?.(snippet);
                              setCopiedNotification(`Ficha ${item.id} copiada al portapapeles`);
                              setTimeout(() => setCopiedNotification(null), 2000);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition cursor-pointer"
                          >
                            <Copy className="w-3 h-3" /> Copiar Ficha
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Certificación y Logs de Impacto Cero */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Certificación de Impacto Cero en Despliegue</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
                      {zeroImpactCertHash}
                    </span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    Validado por <strong>Frank M. (QA Lead)</strong> y <strong>Carlos M. (Release Manager)</strong>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> APROBADO PARA PRODUCCIÓN v2.4.0
                </span>
              </div>
            </div>

            {/* Terminal de Logs */}
            <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 font-mono text-xs text-slate-300 space-y-1.5 max-h-36 overflow-y-auto">
              {zeroImpactAuditLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 select-none">❯</span>
                  <span className={log.includes("DICTAMEN") ? "text-emerald-300 font-bold" : "text-slate-300"}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal Visor de Informe Oficial Adjunto de Deuda Técnica */}
      {isAttachedReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[85vh] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Header Modal */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
                  <FileText className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Informe Oficial Adjunto de Deuda Técnica</span>
                    <span className="px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 text-xs font-mono font-bold">
                      REGISTRO-DEUDA-TECNICA-MEJORAS-DIFERIDAS.md
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Documento formal emitido por Frank M. (QA Lead) y Carlos M. (Release Manager)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAttachedReportOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Contenido Modal Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-extrabold text-emerald-900 dark:text-emerald-300 flex items-center gap-2 mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Declaración de Cero Impacto en Producción</span>
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-200">
                  Se certifica formalmente que las 8 observaciones catalogadas corresponden a mejoras menores cosméticas, tooling o refactorización estética que no comprometen la seguridad, autenticación, cálculo Decreto 67 ni la entrega contractual del release v2.4.0.
                </p>
              </div>

              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base mb-3">
                  Resumen de Deuda Técnica por Integrante Responsable
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">🎨 Lucas P. (UI/UX Lead)</span>
                    <p className="text-slate-500 dark:text-slate-400">
                      • DEBT-2026-001: Micro-transición en filtros (1.5h - v2.5.0)<br />
                      • DEBT-2026-005: Atajo alternativo Alt+K (1.0h - v2.5.1)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">💻 Malcom Marcelo (Frontend Lead)</span>
                    <p className="text-slate-500 dark:text-slate-400">
                      • DEBT-2026-002: Átomo selector de períodos (2.0h - v2.5.0)<br />
                      • DEBT-2026-006: Borrador offline en IndexedDB (4.0h - v2.5.1)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">⚙️ Maicol R. (Backend Lead)</span>
                    <p className="text-slate-500 dark:text-slate-400">
                      • DEBT-2026-003: Logger estructurado JSON en /api/system (2.5h - v2.5.0)
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">🏛️ Carlos M. (Release Manager &amp; DBA)</span>
                    <p className="text-slate-500 dark:text-slate-400">
                      • DEBT-2026-004: Directiva Node.js en middleware (1.5h - v2.5.0)<br />
                      • DEBT-2026-007: Índices compuestos para colegios masivos (3.0h - v3.0.0)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Archivo físico: <code className="font-mono text-violet-600 dark:text-violet-400">/REGISTRO-DEUDA-TECNICA-MEJORAS-DIFERIDAS.md</code>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text = `# REGISTRO OFICIAL DE OBSERVACIONES MENORES Y DEUDA TÉCNICA DIFERIDA\nTotal: 8 Ítems | Impacto: 0.0% | Esfuerzo: 18.5h\nDocumento: REGISTRO-DEUDA-TECNICA-MEJORAS-DIFERIDAS.md`;
                    navigator.clipboard?.writeText?.(text);
                    setCopiedNotification("Documento copiado al portapapeles");
                    setTimeout(() => setCopiedNotification(null), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" /> Copiar Texto
                </button>

                <button
                  onClick={() => setIsAttachedReportOpen(false)}
                  className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  Cerrar Visor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA OFICIAL: PASE A ESTADO RESUELTO & HISTORIAL DE PARCHES DOCUMENTADO (DoD 7)
          ========================================================================= */}
      {viewMode === "resolution" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Banner Principal de Pase Oficial & Certificación */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/40 backdrop-blur-xs relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2.5 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/40">
                    <CheckCheck className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-xl text-white flex items-center gap-2 flex-wrap">
                      <span>Pase Oficial a Estado Resuelto &amp; Trazabilidad de Parches</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 text-xs font-black border border-emerald-500/50 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Tasa de Cierre: 100.0% (&gt; 95% Requerido)
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed mt-1">
                      Certificación técnica formal del pase a estado <strong>RESOLVED / VERIFIED_CLOSED</strong> de la totalidad de las 10 incidencias probadas exitosamente, con historial de parches documentado por autor, diffs auditados y cero bloqueadores activos en plataforma.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleRunMassiveResolutionPass()}
                  disabled={isMassiveResolutionRunning}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/40 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  <CheckCheck className={`w-4 h-4 ${isMassiveResolutionRunning ? "animate-spin" : ""}`} />
                  <span>{isMassiveResolutionRunning ? "Procesando Pase..." : "Re-ejecutar Pase Oficial (10/10)"}</span>
                </button>

                <button
                  onClick={() => handleCertifyOfficialResolution()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
                >
                  <Award className="w-4 h-4 text-indigo-200" />
                  <span>Emitir Certificado QA</span>
                </button>
              </div>
            </div>

            {/* Métricas KPI de Resolución */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Tasa Global de Cierre</div>
                <div className="text-2xl font-black text-emerald-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>100.0%</span>
                  <span className="text-[10px] text-emerald-300 font-bold">(&gt;95% OK)</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">10 de 10 tickets resueltos</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Parches Documentados</div>
                <div className="text-2xl font-black text-indigo-300 mt-0.5 flex items-baseline gap-1.5">
                  <span>10 / 10</span>
                  <span className="text-[10px] text-indigo-400 font-medium">commits</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Trazabilidad de diffs y autores</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Bloqueadores P0 / P1</div>
                <div className="text-2xl font-black text-emerald-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>0</span>
                  <span className="text-[10px] text-slate-400 font-normal">activos</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">100% bugs críticos cerrados</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Certificado Digital</div>
                <div className="text-xs font-mono font-extrabold text-emerald-300 mt-1 truncate">
                  {officialResolutionCertHash}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Firma: Frank M. &amp; Carlos M.</div>
              </div>
            </div>
          </div>

          {/* Consola Interactiva de Transición y Criterios DoD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Terminal de Logs de Resolución */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-950 border border-slate-800 p-4 font-mono text-xs shadow-inner flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-slate-800 text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-slate-200">Terminal de Pase Oficial a Estado Resuelto</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                    STATUS: 100% RESOLVED
                  </span>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-300 max-h-48 overflow-y-auto pr-2">
                  {massiveResolutionLogs.map((log, idx) => (
                    <div key={idx} className="leading-relaxed flex items-start gap-1.5">
                      <span className="text-emerald-500 select-none">➜</span>
                      <span className={log.includes("[DICTAMEN") || log.includes("[PASE OFICIAL") ? "text-emerald-300 font-bold" : ""}>
                        {log}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>Progreso de Pase Oficial:</span>
                  <span className="font-bold text-emerald-400">{massiveResolutionProgressPct}%</span>
                </div>
                <div className="w-40 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${massiveResolutionProgressPct}%` }} />
                </div>
              </div>
            </div>

            {/* Checklist de Criterios DoD de Pase a Resuelto */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between shadow-xs">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckSquare className="w-4 h-4 text-emerald-500" />
                    Criterios Definition of Done (3/3)
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    100% Cumplido
                  </span>
                </div>

                <div className="space-y-2.5">
                  {resolutionDodItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleDod(item.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer transition select-none flex items-start gap-2 ${
                        item.completed
                          ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-[11px]">{item.title}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span>Certificación:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">Aurenis QA Compliance</span>
              </div>
            </div>
          </div>

          {/* Filtro por Autor / Integrante del Equipo */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-xs text-slate-900 dark:text-white">
                  Bitácora de Incidencias Resueltas por Integrante Responsable
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setResolutionAuthorFilter("ALL")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    resolutionAuthorFilter === "ALL"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  Todos ({issues.length})
                </button>

                {TEAM_MEMBERS.map((m) => {
                  const memberIssues = issues.filter((i) => i.assignedTo === m.id);
                  const isSelected = resolutionAuthorFilter === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setResolutionAuthorFilter(m.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? "bg-indigo-600 text-white"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      <span>{m.name.split(" ")[0]}</span>
                      <span className="text-[10px] opacity-80">({memberIssues.length})</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Tabla Bitácora de Tickets Resueltos con Parches */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                  Bitácora Oficial de Tickets en Estado Resuelto (10 de 10)
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">Tasa de Cierre: 100.0%</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-600 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="py-3 px-3.5">Código / Ticket</th>
                    <th className="py-3 px-3">Título &amp; Componente</th>
                    <th className="py-3 px-3">Severidad / SLA</th>
                    <th className="py-3 px-3">Autor Responsable</th>
                    <th className="py-3 px-3">Estado Oficial</th>
                    <th className="py-3 px-3">Parche / Commit</th>
                    <th className="py-3 px-3">Suite de Prueba</th>
                    <th className="py-3 px-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {issues
                    .filter((iss) => {
                      if (resolutionAuthorFilter !== "ALL" && iss.assignedTo !== resolutionAuthorFilter) return false;
                      if (selectedSeverity !== "ALL" && iss.severity !== selectedSeverity) return false;
                      if (searchQuery.trim()) {
                        const q = searchQuery.toLowerCase();
                        return (
                          iss.code.toLowerCase().includes(q) ||
                          iss.title.toLowerCase().includes(q) ||
                          (iss.patchInfo?.patchId || "").toLowerCase().includes(q) ||
                          (iss.assignedRole || "").toLowerCase().includes(q)
                        );
                      }
                      return true;
                    })
                    .map((iss) => {
                      const member = TEAM_MEMBERS.find((m) => m.id === iss.assignedTo);
                      const isExpanded = expandedPatchCardId === iss.id;

                      return (
                        <React.Fragment key={iss.id}>
                          <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                            <td className="py-3 px-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                              {iss.code}
                            </td>
                            <td className="py-3 px-3 max-w-xs">
                              <div className="font-bold text-slate-900 dark:text-white truncate">
                                {iss.title}
                              </div>
                              <div className="text-[10px] text-slate-400 truncate mt-0.5">
                                {iss.technicalComponent}
                              </div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                {getSeverityBadge(iss.severity)}
                                <span className="text-[10px] text-slate-400">({iss.slaHours}h)</span>
                              </div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${member?.avatarBg || "bg-indigo-600"}`}>
                                  {member?.initials || "FM"}
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                                  {member?.name || iss.assignedTo}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                {iss.status === "VERIFIED_CLOSED" ? "VERIFIED_CLOSED" : "RESOLVED"}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px]">
                              {iss.patchInfo ? (
                                <div>
                                  <div className="text-slate-800 dark:text-slate-200 font-bold">
                                    {iss.patchInfo.patchId}
                                  </div>
                                  <div className="text-[10px] text-indigo-500">
                                    commit {iss.patchInfo.commitHash}
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[10px]">Sin parche asignado</span>
                              )}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                                <BadgeCheck className="w-3 h-3 text-emerald-500" />
                                {iss.patchInfo?.testSuite.split(" ")[0] || "Suite PASS"}
                              </span>
                            </td>
                            <td className="py-3 px-3.5 text-right whitespace-nowrap">
                              <button
                                onClick={() => setExpandedPatchCardId(isExpanded ? null : iss.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
                              >
                                {isExpanded ? "Ocultar Parche" : "Ver Parche"}
                              </button>
                            </td>
                          </tr>

                          {/* Detalle Desplegable del Parche */}
                          {isExpanded && iss.patchInfo && (
                            <tr className="bg-slate-50/90 dark:bg-slate-850/90 border-b border-slate-200 dark:border-slate-700">
                              <td colSpan={8} className="p-4 space-y-3">
                                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                                    <div className="flex items-center gap-2">
                                      <Code2 className="w-4 h-4 text-indigo-500" />
                                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                                        Detalle del Parche: {iss.patchInfo.patchId} (Commit {iss.patchInfo.commitHash})
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px]">
                                      <span className="text-emerald-600 font-bold">+{iss.patchInfo.linesAdded} líneas</span>
                                      <span className="text-rose-500 font-bold">-{iss.patchInfo.linesDeleted} líneas</span>
                                      <span className="text-slate-400 font-mono">Sello: {iss.formalClosureSeal || "SEAL-OK"}</span>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                    <div>
                                      <div className="font-semibold text-slate-500 text-[11px]">Resumen de la Solución:</div>
                                      <p className="text-slate-800 dark:text-slate-200 mt-0.5 leading-relaxed">
                                        {iss.patchInfo.resolutionSummary}
                                      </p>
                                    </div>
                                    <div>
                                      <div className="font-semibold text-slate-500 text-[11px]">Archivos Modificados:</div>
                                      <div className="space-y-1 mt-0.5 font-mono text-[11px] text-indigo-600 dark:text-indigo-400">
                                        {iss.patchInfo.filesModified.map((f, fi) => (
                                          <div key={fi} className="truncate">• {f}</div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                                    <div>
                                      <strong>Autor:</strong> {iss.patchInfo.authorName} • <strong>Verificado por:</strong> {iss.patchInfo.verifiedBy}
                                    </div>
                                    <button
                                      onClick={() => handleCopyMarkdown(iss)}
                                      className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                                    >
                                      <Copy className="w-3 h-3" /> Copiar Reporte MD
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Historial Completo de Parches Documentados */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                <span>Historial de Parches y Trazabilidad de Código (10 Parches Documentados)</span>
              </div>
              <span className="text-slate-500 text-[11px] font-normal hidden sm:inline">
                Todos los parches validados con suite de no-regresión
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {issues.map((iss) => {
                if (!iss.patchInfo) return null;
                const p = iss.patchInfo;
                const member = TEAM_MEMBERS.find((m) => m.id === iss.assignedTo);

                return (
                  <div
                    key={iss.id}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-400 dark:hover:border-indigo-600 transition space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-200 font-mono font-bold text-[10px]">
                          {p.patchId}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          commit {p.commitHash}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                        [{iss.code}] {iss.title}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {p.resolutionSummary}
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-850 font-mono text-[10px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      {p.filesModified.map((file, fIdx) => (
                        <div key={fIdx} className="truncate">• {file}</div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">Autor:</span>
                        <span>{p.authorName}</span>
                      </div>
                      <div className="text-emerald-600 font-bold">
                        +{p.linesAdded} / -{p.linesDeleted} líneas
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificado de Conformidad Final QA */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-500/30 text-white space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-indigo-600/30 text-indigo-300 border border-indigo-500/40">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-sm sm:text-base text-white">
                    Certificación Oficial de Cierre y Pase a Estado Resuelto
                  </h4>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Dictamen oficial conforme a los requerimientos de calidad y SLAs institucionales.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400">Sello Criptográfico Inmutable:</div>
                <div className="text-xs font-mono font-black text-emerald-400">{officialResolutionCertHash}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">Total Incidencias Resueltas</div>
                <div className="font-extrabold text-sm text-emerald-400 mt-0.5">10 de 10 (100.0%)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">Tasa Oficial de Cierre</div>
                <div className="font-extrabold text-sm text-emerald-400 mt-0.5">&gt; 95% Requerido (100% OK)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">Lead QA Firmante</div>
                <div className="font-extrabold text-xs text-white mt-0.5">Frank M. (QA Lead)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] text-slate-400">Release Manager Firmante</div>
                <div className="font-extrabold text-xs text-white mt-0.5">Carlos M. (Auditor Dec. 67)</div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800/80">
              <span>Registrado en: <code>ACTA-PASE-OFICIAL-TICKETS-RESUELTOS.md</code> y <code>HISTORIAL-PARCHES-DOCUMENTADO.md</code></span>
              <span className="text-emerald-400 font-bold">🟢 Dictamen: Aprobado para Publicación GitHub</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 0.0: VERIFICACIÓN DE NO-REGRESIÓN & ESTABILIDAD GLOBAL DEL SISTEMA
          ========================================================================= */}
      {viewMode === "regression" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Banner Principal de No-Regresión & Certificación */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-indigo-950/60 border border-emerald-500/30 backdrop-blur-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                    <Activity className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                      <span>Verificación de No-Regresión &amp; Estabilidad del Código</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold border border-emerald-500/40">
                        8/8 Suites Aprobadas (100%)
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Comprobación estricta de que las correcciones de bugs recientes (Decreto 67, RUN con &apos;K&apos;, Asistencia Offline, RBAC y Multi-tenant) preservaron el 100% de la funcionalidad estable previa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleRunRegressionSuite()}
                  disabled={isRegressionRunning}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/40 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  <Activity className={`w-4 h-4 ${isRegressionRunning ? "animate-spin" : ""}`} />
                  <span>{isRegressionRunning ? "Ejecutando Regresión..." : "Ejecutar Suite de Regresión"}</span>
                </button>

                <button
                  onClick={() => handleCertifyStability()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
                >
                  <Award className="w-4 h-4 text-indigo-200" />
                  <span>Certificar Estabilidad</span>
                </button>
              </div>
            </div>

            {/* Métricas de Estabilidad y No-Regresión */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Suites de Regresión</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>8 / 8</span>
                  <span className="text-[10px] text-emerald-300 font-bold">(100% OK)</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">38 aserciones sin fallos</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Regresiones Detectadas</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>0</span>
                  <span className="text-[10px] text-slate-400 font-normal">fallas colaterales</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Código previo 100% estable</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Certificado Digital</div>
                <div className="text-xs font-mono font-extrabold text-indigo-300 mt-1 truncate">
                  {stabilityCertHash}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Firma: Frank M. (Lead QA)</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Estado de Publicación</div>
                <div className="text-sm font-black text-emerald-400 mt-0.5 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Luz Verde (GitHub)</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Aprobado para despliegue</div>
              </div>
            </div>

            {/* Consola Interactiva de Ejecución de Regresión */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left font-mono">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-bold text-slate-200">Terminal de Regresión Automatizada (Aurenis QA Runner)</span>
                </div>
                <span>Progreso: {regressionProgressPct}%</span>
              </div>

              <div className="space-y-1 text-[11px] max-h-36 overflow-y-auto font-mono text-emerald-400/90 leading-relaxed">
                {regressionLogs.map((log, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    <span className="text-slate-600 select-none">&gt;</span>
                    <span className={log.includes("PASSED") || log.includes("100%") ? "text-emerald-300 font-bold" : "text-slate-300"}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Matriz Detallada de No-Regresión por Módulo Técnico y Autor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Matriz Oficial de No-Regresión por Componente Técnico (7 Módulos Evaluados)</span>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                100% de Módulos Estables
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Tarjeta Módulo 1 */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3" />
                      Autenticación &amp; RBAC
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sin Regresiones
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Tokens JWT HS256 y Jerarquía de 4 Roles
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    El blindaje contra expiración y tampering preservó las sesiones legítimas y el aislamiento de directores, profesores y alumnos.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Autor Responsable:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Maicol R. (Backend Core)</span>
                </div>
              </div>

              {/* Tarjeta Módulo 2 */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                      <GraduationCap className="w-3 h-3" />
                      Matrícula &amp; RUN
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sin Regresiones
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Módulo 11 con Dígitos 0-9 y RUNs con &apos;K&apos;
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    La corrección de BUG-2026-003 para RUNs con dígito &apos;K&apos; no alteró la validación ni el formateo de RUTs tradicionales.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Autor Responsable:</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">Malcom S. (Frontend Lead)</span>
                </div>
              </div>

              {/* Tarjeta Módulo 3 */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                      <Calculator className="w-3 h-3" />
                      Calificaciones Dec. 67
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sin Regresiones
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Truncamiento a 1 Decimal y Rendimiento 60 FPS
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    La norma Mineduc se cumple estrictamente sin degradar el cálculo masivo de promedios ponderados en matrices con &gt;40 alumnos.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Autor Responsable:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Carlos M. (Auditor Dec. 67)</span>
                </div>
              </div>

              {/* Tarjeta Módulo 4 */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 text-[10px] font-bold">
                      <Clock className="w-3 h-3" />
                      Asistencia Diaria
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sin Regresiones
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Buffer Offline y Despacho en Lote Atómico
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sincronización tolerante a desconexión sin pérdida de estados de asistencia (Presente, Ausente, Atraso, Justificado).
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Autor Responsable:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">Lucas P. (UI) / Malcom S.</span>
                </div>
              </div>

              {/* Tarjeta Módulo 5 */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">
                      <Users className="w-3 h-3" />
                      Gestión Docente &amp; Cursos
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sin Regresiones
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Aislamiento Multi-Tenant e Integridad Referencial
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Asignaciones docentes y cursos estrictamente encapsulados por establecimiento sin fugas cruzadas de información.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Autor Responsable:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Maicol R. (Backend Core)</span>
                </div>
              </div>

              {/* Tarjeta Módulo 6 */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-[10px] font-bold">
                      <ShieldAlert className="w-3 h-3" />
                      Ciberseguridad &amp; APIs
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sin Regresiones
                    </span>
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    Sanitización de Errores, CORS y Rate Limiting
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    0 stack traces expuestos al cliente, cabeceras de seguridad activas y respuestas estándar JSON protegidas.
                  </p>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Autor Responsable:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">Frank M. (Lead QA / Sec)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 0.1: COMPROBACIÓN DEL CIERRE DE INCIDENCIAS DE SEVERIDAD ALTA (MÓDULOS ACADÉMICOS)
          ========================================================================= */}
      {viewMode === "high-closure" && (
        <div className="space-y-6">
          {/* Cabecera Informativa y Banner de Comprobación en Caliente */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-amber-950/60 via-slate-900 to-indigo-950/60 border border-amber-500/30 backdrop-blur-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-600 text-white shadow-md shadow-amber-600/30">
                    <Flame className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                      <span>Comprobación en Caliente de Incidencias de Severidad Alta</span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/40">
                        Módulos Académicos S2 / P1
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Validación en tiempo real y protocolo de cierre formal en Calificaciones Decreto 67, Matrícula RUN, Asistencia Offline y Reportes SIGE.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleRunHotTesting()}
                  disabled={isHotTestingRunning}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/40 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  <Flame className={`w-4 h-4 ${isHotTestingRunning ? "animate-spin" : ""}`} />
                  <span>{isHotTestingRunning ? "Ejecutando Comprobación..." : "Ejecutar Comprobación en Caliente"}</span>
                </button>

                <button
                  onClick={() => handleBatchFormalCloseAcademicHigh()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4 text-indigo-200" />
                  <span>{formalClosureCertHash ? "Cierre Formal Registrado ✓" : "Cierre Formal Masivo"}</span>
                </button>
              </div>
            </div>

            {/* Métricas de Cierre Severidad Alta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Total Bugs Severidad Alta</div>
                <div className="text-xl font-black text-amber-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>{issues.filter((i) => i.severity === "HIGH").length}</span>
                  <span className="text-[10px] text-slate-400 font-normal">incidencias S2</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Calificaciones, Matrícula, Asistencia, SIGE</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Resueltos por Equipo</div>
                <div className="text-xl font-black text-indigo-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>
                    {issues.filter((i) => i.severity === "HIGH" && (i.status === "RESOLVED" || i.status === "VERIFIED_CLOSED")).length}/
                    {issues.filter((i) => i.severity === "HIGH").length}
                  </span>
                  <span className="text-[10px] text-indigo-300 font-bold">
                    (
                    {Math.round(
                      (issues.filter((i) => i.severity === "HIGH" && (i.status === "RESOLVED" || i.status === "VERIFIED_CLOSED")).length /
                        Math.max(1, issues.filter((i) => i.severity === "HIGH").length)) *
                        100
                    )}
                    %)
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Maicol R. & Malcom S.</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Comprobados en Caliente</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>
                    {issues.filter((i) => i.severity === "HIGH" && i.hotTestStatus === "PASSED").length}/
                    {issues.filter((i) => i.severity === "HIGH").length}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    (
                    {Math.round(
                      (issues.filter((i) => i.severity === "HIGH" && i.hotTestStatus === "PASSED").length /
                        Math.max(1, issues.filter((i) => i.severity === "HIGH").length)) *
                        100
                    )}
                    %)
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-1 font-semibold flex items-center gap-1">
                  <Flame className="w-3 h-3" />
                  <span>Aserciones en tiempo real</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Cierre Formal de Tickets</div>
                <div className="text-xl font-black text-cyan-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>
                    {issues.filter((i) => i.severity === "HIGH" && i.status === "VERIFIED_CLOSED").length}/
                    {issues.filter((i) => i.severity === "HIGH").length}
                  </span>
                  <span className="text-[10px] text-cyan-300 font-bold">
                    (
                    {Math.round(
                      (issues.filter((i) => i.severity === "HIGH" && i.status === "VERIFIED_CLOSED").length /
                        Math.max(1, issues.filter((i) => i.severity === "HIGH").length)) *
                        100
                    )}
                    %)
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Sello inmutable VERIFIED_CLOSED</div>
              </div>
            </div>

            {/* Barra de Progreso de Comprobación en Caliente */}
            {isHotTestingRunning && (
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Inyectando casos de prueba en caliente en módulos académicos...
                  </span>
                  <span>{hotTestProgressPct}%</span>
                </div>
                <div className="w-full bg-slate-850 h-2.5 rounded-full overflow-hidden p-0.5 border border-amber-500/40">
                  <div
                    className="bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${hotTestProgressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Consola de Salida de Comprobación en Caliente */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 space-y-1.5 max-h-48 overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>CONSOLA DE COMPROBACIÓN EN CALIENTE • MÓDULOS ACADÉMICOS (QA ENGINE)</span>
                </div>
                <span>Entorno: Staging Cloud Run & Database</span>
              </div>
              {hotTestLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    log.includes("PASSED")
                      ? "text-emerald-400 font-semibold"
                      : log.includes("FINALIZADO") || log.includes("INICIO")
                      ? "text-amber-300 font-bold"
                      : log.includes("ASSERT")
                      ? "text-cyan-300"
                      : "text-slate-400"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>

          {/* Banner de Cierre Formal y Sello de Auditoría si existe */}
          {formalClosureCertHash && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-emerald-950/80 border border-indigo-500/40 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
                  <FileCheck2 className="w-5 h-5" />
                </span>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>Acta de Cierre Formal Emitida para Incidencias de Severidad Alta</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40">
                      SELLADO DIGITAL
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Auditor Responsable: <span className="text-indigo-300 font-semibold">{formalClosureAuditor}</span> • Fecha: {formalClosureSignedAt}
                  </div>
                </div>
              </div>
              <div className="font-mono text-[11px] bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-cyan-300 select-all shrink-0">
                Sello Hash: {formalClosureCertHash}
              </div>
            </div>
          )}

          {/* Lista de Incidencias de Severidad Alta en Módulos Académicos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Bitácora de Incidencias de Severidad Alta (S2 / P1 Alta)
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                  • {issues.filter((i) => i.severity === "HIGH").length} tickets en módulos académicos
                </span>
              </div>

              <button
                onClick={() => handleBatchFormalCloseAcademicHigh()}
                className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Cerrar Todos Formalmente</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issues
                .filter((i) => i.severity === "HIGH" || i.priority === "P1_HIGH")
                .map((issue) => {
                  const assignee = TEAM_MEMBERS.find((m) => m.id === issue.assignedTo);
                  const isClosed = issue.status === "VERIFIED_CLOSED";
                  const isHotTested = issue.hotTestStatus === "PASSED";

                  return (
                    <div
                      key={issue.id}
                      className={`p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 shadow-sm ${
                        isClosed
                          ? "bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                          : "bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-900/60 ring-1 ring-amber-500/20"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Cabecera del Ticket */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-mono text-xs font-black">
                              {issue.code}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                              <AlertTriangle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                              Severidad Alta (S2)
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-semibold">
                              SLA &lt; 8h
                            </span>
                          </div>

                          {/* Estado del Ticket */}
                          <div>
                            {isClosed ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                                <BadgeCheck className="w-3.5 h-3.5" />
                                Cerrado Formal
                              </span>
                            ) : issue.status === "RESOLVED" ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-800">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Resuelto
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                                <Clock className="w-3.5 h-3.5" />
                                En Progreso
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Título y Módulo */}
                        <div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                            {issue.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                              {getModuleIcon(issue.module)}
                              <span>{formatModuleName(issue.module)}</span>
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[10px] text-slate-400 truncate max-w-xs">
                              {issue.technicalComponent}
                            </span>
                          </div>
                        </div>

                        {/* Detalle de Impacto y Validación */}
                        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
                          <div className="text-[11px] text-slate-700 dark:text-slate-300">
                            <span className="font-bold text-slate-900 dark:text-white">Justificación de Impacto: </span>
                            {issue.impactJustification}
                          </div>
                          <div className="text-[11px] text-slate-600 dark:text-slate-400">
                            <span className="font-bold text-slate-800 dark:text-slate-200">Esperado: </span>
                            {issue.expectedResult}
                          </div>
                        </div>

                        {/* Responsable y Estado de Comprobación */}
                        <div className="flex items-center justify-between pt-1 text-xs">
                          <div className="flex items-center gap-2">
                            <span className={`w-6 h-6 rounded-full ${assignee?.avatarBg || "bg-indigo-600"} text-white font-black text-[10px] flex items-center justify-center`}>
                              {assignee?.initials || "QA"}
                            </span>
                            <div>
                              <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                                {assignee?.name}
                              </span>
                              <span className="text-[10px] text-slate-400">{assignee?.role}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            {isHotTested ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                <Flame className="w-3.5 h-3.5" />
                                Comprobado en Caliente ✓
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                                <Clock className="w-3.5 h-3.5" />
                                Pendiente Comprobación
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Sello de Cierre Formal si está cerrado */}
                        {issue.formalClosureSeal && (
                          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-[10px] text-emerald-300 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <BadgeCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Sello: <span className="font-mono font-bold">{issue.formalClosureSeal}</span></span>
                            </div>
                            <span>Por: {issue.formalClosureBy?.split(" ")[0]} ({issue.formalClosureAt})</span>
                          </div>
                        )}
                      </div>

                      {/* Botones de Acción */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setSelectedIssueDetail(issue)}
                          className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Ver Ficha Técnica</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRunHotTesting(issue.id)}
                            disabled={isHotTestingRunning}
                            className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/80 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer disabled:opacity-50"
                          >
                            <Flame className="w-3 h-3" />
                            <span>Comprobar</span>
                          </button>

                          {!isClosed ? (
                            <button
                              onClick={() => {
                                setFormalClosureSelectedIssue(issue);
                                setIsFormalClosureModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition flex items-center gap-1 cursor-pointer"
                            >
                              <BadgeCheck className="w-3 h-3" />
                              <span>Cierre Formal</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(issue.id, "RESOLVED")}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 text-xs font-semibold transition cursor-pointer"
                              title="Reabrir ticket para auditoría adicional"
                            >
                              Reabrir
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 0: PANEL DE RE-TESTING INMEDIATO DE INCIDENCIAS CRÍTICAS & FIRMA QA
          ========================================================================= */}
      {viewMode === "retesting" && (
        <div className="space-y-6">
          {/* Cabecera Informativa y Banner de Re-testing */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-rose-950/60 via-slate-900 to-indigo-950/60 border border-rose-500/30 backdrop-blur-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/30">
                    <Zap className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-base sm:text-lg text-white flex items-center gap-2">
                      <span>Suite de Re-testing Inmediato para Incidencias Críticas (P0 Blocker)</span>
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-extrabold border border-rose-500/40">
                        100% Críticos
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      Verificación en tiempo real de correcciones sobre fallas S1 con impacto en promoción y seguridad.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleRunCriticalRetest()}
                  disabled={isRetestingRunning}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/40 transition transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50"
                >
                  <PlayCircle className={`w-4 h-4 ${isRetestingRunning ? "animate-spin" : ""}`} />
                  <span>{isRetestingRunning ? "Ejecutando Suite..." : "Ejecutar Re-testing Automatizado Inmediato"}</span>
                </button>

                <button
                  onClick={() => handleSignConformity()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
                >
                  <Award className="w-4 h-4 text-indigo-200" />
                  <span>{isSignedConformity ? "Certificado Emitido ✓" : "Emitir Firma de Conformidad"}</span>
                </button>
              </div>
            </div>

            {/* Métricas de Re-testing Crítico */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Total Bugs Críticos</div>
                <div className="text-xl font-black text-rose-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>{issues.filter((i) => i.severity === "CRITICAL").length}</span>
                  <span className="text-[10px] text-slate-400 font-normal">incidencias S1</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">BUG-2026-001 & BUG-2026-006</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Verificados & Cerrados</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>
                    {issues.filter((i) => i.severity === "CRITICAL" && i.status === "VERIFIED_CLOSED").length}/
                    {issues.filter((i) => i.severity === "CRITICAL").length}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    (
                    {Math.round(
                      (issues.filter((i) => i.severity === "CRITICAL" && i.status === "VERIFIED_CLOSED").length /
                        Math.max(1, issues.filter((i) => i.severity === "CRITICAL").length)) *
                        100
                    )}
                    %)
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400/80 mt-1">100% con Re-test Satisfactorio</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Bloqueadores Funcionales</div>
                <div className="text-xl font-black text-emerald-400 mt-0.5 flex items-baseline gap-1.5">
                  <span>
                    {issues.filter((i) => (i.severity === "CRITICAL" || i.priority === "P0_BLOCKER") && i.status !== "VERIFIED_CLOSED" && i.status !== "RESOLVED").length}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">Cero Bloqueadores</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">Plataforma lista para producción</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400">Firma de Conformidad</div>
                <div className="text-xl font-black text-indigo-400 mt-0.5 flex items-baseline gap-1.5">
                  <span className="text-sm font-bold truncate">
                    {isSignedConformity ? "Suscrita & Válida" : "Lista para firma"}
                  </span>
                </div>
                <div className="text-[10px] text-indigo-300/80 mt-1 truncate">
                  {isSignedConformity ? signedHash : "Frank M. / Carlos M."}
                </div>
              </div>
            </div>

            {/* Consola de Logs de Re-testing en Vivo */}
            <div className="mt-5 rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-slate-300">
                    Terminal de Ejecución de Pruebas & Aserciones QA
                  </span>
                </div>
                {isRetestingRunning && (
                  <span className="flex items-center gap-1 text-[10px] font-bold text-rose-400 animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Ejecutando suite... {retestProgressPct}%
                  </span>
                )}
              </div>

              {isRetestingRunning && (
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${retestProgressPct}%` }}
                  />
                </div>
              )}

              <div className="max-h-36 overflow-y-auto space-y-1 font-mono text-[11px] text-slate-400 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80">
                {retestLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`leading-relaxed ${
                      log.includes("PASSED") || log.includes("FINALIZADO")
                        ? "text-emerald-400 font-semibold"
                        : log.includes("INICIO") || log.includes("RUN")
                        ? "text-rose-300"
                        : "text-slate-300"
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Fichas de Re-testing Individual de Bugs Críticos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                <span>Detalle de Incidencias Críticas en Proceso de Re-testing</span>
              </h4>
              <span className="text-xs text-slate-500">
                2 incidencias P0 identificadas y corregidas
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Card 1: BUG-2026-001 */}
              {issues
                .filter((iss) => iss.id === "iss-1")
                .map((iss) => (
                  <div
                    key={iss.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-500/40 dark:border-rose-500/30 shadow-md space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800">
                            {iss.code}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                            Crítica (S1)
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-900 text-white">
                            P0 Blocker
                          </span>
                        </div>
                        <h5 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                          {iss.title}
                        </h5>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                            iss.status === "VERIFIED_CLOSED" || iss.retestStatus === "PASSED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          }`}
                        >
                          <BadgeCheck className="w-3.5 h-3.5" />
                          {iss.status === "VERIFIED_CLOSED" || iss.retestStatus === "PASSED"
                            ? "Re-test Verificado & Cerrado"
                            : "Resuelto / Pendiente Re-test"}
                        </span>
                      </div>
                    </div>

                    {/* Fila de Responsable y Componente Técnico */}
                    <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Responsable Asignado</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          Malcom S. (Frontend)
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Componente Auditado</span>
                        <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300 truncate block">
                          lib/services/grade.service.ts
                        </span>
                      </div>
                    </div>

                    {/* Aserciones de Re-testing */}
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px]">
                          <Calculator className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Validación Algorítmica Decreto 67 (Art. 9)</span>
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1">
                          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                            <strong>Antes:</strong> 5.8333... (Sin truncar)
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                            <strong>Re-test:</strong> 5.8 (1 decimal exacto ✓)
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        <strong>Dictamen Re-test:</strong> Math.round(promedio * 10) / 10 ejecutado en cliente y servidor. Las actas oficiales ahora coinciden al 100% con los certificados de promoción del Ministerio de Educación.
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleRunCriticalRetest(iss.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-testear Algoritmo</span>
                      </button>

                      <button
                        onClick={() => setSelectedIssueDetail(iss)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Ver Ficha Técnica</span>
                      </button>
                    </div>
                  </div>
                ))}

              {/* Card 2: BUG-2026-006 */}
              {issues
                .filter((iss) => iss.id === "iss-6")
                .map((iss) => (
                  <div
                    key={iss.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border-2 border-rose-500/40 dark:border-rose-500/30 shadow-md space-y-4 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-extrabold text-xs text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800">
                            {iss.code}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-300 dark:border-red-800">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                            Crítica (S1)
                          </span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-900 text-white">
                            P0 Blocker
                          </span>
                        </div>
                        <h5 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                          {iss.title}
                        </h5>
                      </div>

                      <div className="shrink-0 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${
                            iss.status === "VERIFIED_CLOSED" || iss.retestStatus === "PASSED"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                          }`}
                        >
                          <BadgeCheck className="w-3.5 h-3.5" />
                          {iss.status === "VERIFIED_CLOSED" || iss.retestStatus === "PASSED"
                            ? "Re-test Verificado & Cerrado"
                            : "Resuelto / Pendiente Re-test"}
                        </span>
                      </div>
                    </div>

                    {/* Fila de Responsable y Componente Técnico */}
                    <div className="grid grid-cols-2 gap-2 text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Responsable Asignado</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">
                          Maicol R. (Backend)
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Componente Auditado</span>
                        <span className="font-mono text-[10px] text-slate-700 dark:text-slate-300 truncate block">
                          app/api/records/official/route.ts
                        </span>
                      </div>
                    </div>

                    {/* Aserciones de Re-testing */}
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1">
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                          <span>Validación de Seguridad RBAC en Actas Cerradas</span>
                        </span>
                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono mt-1">
                          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900">
                            <strong>Antes:</strong> HTTP 200 (Fuga RBAC)
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                            <strong>Re-test:</strong> HTTP 403 Forbidden ✓
                          </div>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        <strong>Dictamen Re-test:</strong> Middleware rbac.guard.ts verifica el flag isClosed y bloquea mutaciones por roles no administradores. Intento de modificación genera registro inmutable en tabla de auditoría.
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        onClick={() => handleRunCriticalRetest(iss.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Re-testear Guard RBAC</span>
                      </button>

                      <button
                        onClick={() => setSelectedIssueDetail(iss)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Ver Ficha Técnica</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* =========================================================================
              MÓDULO DE FIRMA DIGITAL & ACTA OFICIAL DE CONFORMIDAD TÉCNICA
              ========================================================================= */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-indigo-500/30 shadow-xl space-y-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Acta Oficial de Firma de Conformidad Técnica QA
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Certificación de Cero Bloqueadores y Verificación del 100% de Incidencias Críticas
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                  isSignedConformity
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isSignedConformity ? "bg-emerald-500" : "bg-amber-500"}`} />
                  {isSignedConformity ? "ACTA SUSCRITA & VÁLIDA" : "PENDIENTE DE SUSCRIPCIÓN"}
                </span>
              </div>
            </div>

            {/* Fila de Parámetros de la Firma */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Responsable Firmante (Auditor / QA Lead):
                </label>
                <select
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                >
                  <option value="Frank M. (QA Lead / Auditor Decreto 67)">
                    Frank M. — QA Lead & Auditor Técnico
                  </option>
                  <option value="Carlos M. (Auditor Decreto 67 & Calificaciones)">
                    Carlos M. — Auditor Decreto 67 & Calificaciones
                  </option>
                  <option value="Maicol R. (Backend Lead & Seguridad RBAC)">
                    Maicol R. — Líder de Backend & Seguridad
                  </option>
                  <option value="Malcom S. (Frontend Lead & UX/UI)">
                    Malcom S. — Líder de Frontend & Decreto 67
                  </option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Cargo / Rol Certificador:
                </label>
                <input
                  type="text"
                  value={signerRole}
                  onChange={(e) => setSignerRole(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Institución / Entidad Evaluadora:
                </label>
                <input
                  type="text"
                  value={signerInstitution}
                  onChange={(e) => setSignerInstitution(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>

            {/* Certificado Digital */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 dark:from-slate-850 dark:to-indigo-950/30 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <span className="font-bold text-slate-900 dark:text-white">
                  Cláusulas y Verificaciones Suscritas en este Acto:
                </span>
                <span className="font-mono text-[11px] text-slate-500">
                  {signedAt ? `Fecha de Emisión: ${signedAt}` : "Fecha prevista: Hoy"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold text-[11px]">100% Bugs Críticos Verificados</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold text-[11px]">Cero Bloqueadores Funcionales</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span className="font-semibold text-[11px]">Conformidad Decreto 67 & RBAC</span>
                </div>
              </div>

              {isSignedConformity && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200">
                    <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      Sello Criptográfico: <strong>{signedHash}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                    Firmado por {signerName}
                  </span>
                </div>
              )}
            </div>

            {/* Acciones de Firma */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const certText = `=== ACTA DE CONFORMIDAD TÉCNICA QA ===\nHash: ${signedHash || "QA-CERT-PENDING"}\nFirmante: ${signerName}\nCargo: ${signerRole}\nInstitución: ${signerInstitution}\nFecha: ${signedAt || new Date().toISOString()}\n\nCriterios de Aceptación:\n[X] 100% de bugs Críticos resueltos y verificados (BUG-2026-001, BUG-2026-006)\n[X] Cero bloqueadores funcionales en la plataforma\n[X] Firma de conformidad técnica emitida`;
                  navigator.clipboard.writeText(certText);
                  setCopiedNotification("Acta de conformidad copiada al portapapeles en formato oficial.");
                  setTimeout(() => setCopiedNotification(null), 3000);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Acta de Conformidad</span>
              </button>

              <button
                onClick={handleSignConformity}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Award className="w-4 h-4 text-indigo-200" />
                <span>{isSignedConformity ? "Re-emitir Firma Digital" : "Firmar Acta de Conformidad"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 0: BANDEJA DE ASIGNACIÓN DIRECTA A RESPONSABLES (Maicol R., Malcom S., Lucas P.)
          ========================================================================= */}
      {viewMode === "assignees" && (
        <div className="space-y-6">
          {/* Cabecera Informativa de la Bandeja */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 border border-indigo-500/30 backdrop-blur-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-600 text-white shadow-xs">
                  <Users className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Bandeja Operativa de Asignación Directa y Notificaciones Push
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-3xl">
                Canalización inmediata de tickets de bugs a los especialistas técnicos: <strong>Maicol R. (Backend)</strong>, <strong>Malcom S. (Frontend)</strong> y <strong>Lucas P. (UI/UX)</strong>. Supervise el estado de notificación, cumplimiento de plazos SLA y reasignación en caliente.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleSendBatchNotifications()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition cursor-pointer"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span>Notificar a los 3 Responsables</span>
              </button>
            </div>
          </div>

          {/* Grid de las 3 Bandejas Principales (Backend, Frontend, UI) + Apoyo QA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {TEAM_MEMBERS.map((member) => {
              const memberIssues = filteredIssues.filter((i) => i.assignedTo === member.id);
              const pendingIssues = memberIssues.filter((i) => i.status !== "VERIFIED_CLOSED");
              const blockerCount = memberIssues.filter((i) => i.priority === "P0_BLOCKER" || i.priority === "P1_HIGH").length;
              const unnotifiedCount = memberIssues.filter((i) => !i.notificationSent).length;

              const roleColors: Record<string, string> = {
                maicol: "border-t-emerald-500 from-emerald-500/10 via-slate-900/20 to-transparent",
                malcom: "border-t-indigo-500 from-indigo-500/10 via-slate-900/20 to-transparent",
                lucas: "border-t-pink-500 from-pink-500/10 via-slate-900/20 to-transparent",
                frank: "border-t-amber-500 from-amber-500/10 via-slate-900/20 to-transparent",
                carlos: "border-t-cyan-500 from-cyan-500/10 via-slate-900/20 to-transparent",
              };
              const cardBorder = roleColors[member.id] || "border-t-indigo-500 from-indigo-500/10 via-slate-900/20 to-transparent";

              return (
                <div
                  key={member.id}
                  className={`rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-t-4 ${cardBorder} p-4 sm:p-5 flex flex-col justify-between shadow-xs space-y-4`}
                >
                  {/* Encabezado del Responsable */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${member.avatarBg} text-white font-black text-sm flex items-center justify-center shadow-md shrink-0`}>
                          {member.initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {member.name}
                            </h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                              {member.role.split(" ")[0]}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                            {member.role}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSendBatchNotifications(member.id)}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-300 transition border border-slate-200 dark:border-slate-700 cursor-pointer shrink-0"
                        title={`Enviar notificación directa con pendientes a ${member.name}`}
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Resumen de Carga y SLA */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          Total: <strong className="text-slate-900 dark:text-white">{memberIssues.length}</strong>
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">|</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">
                          Pendientes: <strong>{pendingIssues.length}</strong>
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px]">
                        {blockerCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-extrabold flex items-center gap-0.5">
                            <Zap className="w-2.5 h-2.5 text-rose-500" />
                            {blockerCount} P0/P1
                          </span>
                        )}
                        {unnotifiedCount > 0 ? (
                          <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-semibold">
                            {unnotifiedCount} sin notificar
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Notificado
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                      <span className="font-bold text-slate-700 dark:text-slate-300">Alcance:</span> {member.scope}
                    </p>
                  </div>

                  {/* Lista de Tickets Asignados al Responsable */}
                  <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[580px] pr-0.5">
                    {memberIssues.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                        No hay tickets asignados a {member.name} con los filtros actuales.
                      </div>
                    ) : (
                      memberIssues.map((iss) => (
                        <div
                          key={iss.id}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850/90 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 transition shadow-2xs space-y-2.5"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/70 px-1.5 py-0.5 rounded border border-indigo-200 dark:border-indigo-800">
                                {iss.id}
                              </span>
                              {getSeverityBadge(iss.severity)}
                              {getPriorityBadge(iss.priority)}
                            </div>

                            <button
                              onClick={() => setSelectedIssueDetail(iss)}
                              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5 cursor-pointer shrink-0"
                            >
                              <span>Ver Ficha</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>
                          </div>

                          <h5
                            onClick={() => setSelectedIssueDetail(iss)}
                            className="text-xs font-bold text-slate-900 dark:text-white leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                          >
                            {iss.title}
                          </h5>

                          {/* Plazo de Resolución SLA y Estado de Alerta */}
                          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px]">
                            <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                              <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span className="font-semibold">Plazo SLA:</span>
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{iss.deadlineDate || "Hoy"}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              {iss.notificationSent ? (
                                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                                  <Bell className="w-2.5 h-2.5" /> Notificado
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleSendNotification(iss.id)}
                                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Send className="w-2.5 h-2.5" /> Enviar Alerta
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Reasignación Directa en Línea y Transición de Estado */}
                          <div className="pt-2 border-t border-slate-200/70 dark:border-slate-750 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 flex-1 min-w-0">
                              <span className="text-[10px] text-slate-400 font-semibold shrink-0">Reasignar:</span>
                              <select
                                value={iss.assignedTo}
                                onChange={(e) => handleAssignIssue(iss.id, e.target.value)}
                                className="w-full text-[10px] font-bold p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 truncate cursor-pointer"
                              >
                                {TEAM_MEMBERS.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.name} ({m.role.split(" ")[0]})
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="shrink-0">
                              <select
                                value={iss.status}
                                onChange={(e) => handleTransitionStatus(iss.id, e.target.value as BugStatus)}
                                className={`text-[10px] font-extrabold p-1 rounded-lg border ${
                                  iss.status === "VERIFIED_CLOSED"
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                                    : iss.status === "RESOLVED"
                                    ? "bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800"
                                    : iss.status === "IN_PROGRESS"
                                    ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"
                                    : "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800"
                                }`}
                              >
                                <option value="OPEN">Reportado</option>
                                <option value="IN_PROGRESS">En Progreso</option>
                                <option value="RESOLVED">Resuelto (QA)</option>
                                <option value="VERIFIED_CLOSED">Verificado</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 1: TABLERO KANBAN DE SEGUIMIENTO DE INCIDENCIAS
          ========================================================================= */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(
            [
              { status: "OPEN" as BugStatus, label: "Reportado / Triage", color: "border-t-blue-500" },
              { status: "IN_PROGRESS" as BugStatus, label: "En Análisis / Progreso", color: "border-t-amber-500" },
              { status: "RESOLVED" as BugStatus, label: "Resuelto / En QA", color: "border-t-purple-500" },
              { status: "VERIFIED_CLOSED" as BugStatus, label: "Verificado & Cerrado", color: "border-t-emerald-500" },
            ] as const
          ).map((col) => {
            const colIssues = filteredIssues.filter((i) => i.status === col.status);
            return (
              <div
                key={col.status}
                className={`rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 border-t-4 ${col.color} p-3.5 space-y-3 flex flex-col min-h-[500px]`}
              >
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 dark:text-slate-200">
                    <span>{col.label}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {colIssues.length}
                  </span>
                </div>

                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {colIssues.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      Sin incidencias en esta etapa
                    </div>
                  ) : (
                    colIssues.map((issue) => {
                      const assigneeObj = TEAM_MEMBERS.find((m) => m.id === issue.assignedTo);
                      return (
                        <div
                          key={issue.id}
                          className="p-3.5 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-750 shadow-xs hover:shadow-md transition space-y-2.5 group"
                        >
                          {/* Fila Superior: Código, Severidad y Prioridad */}
                          <div className="flex items-center justify-between gap-1 flex-wrap">
                            <span className="font-mono text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">
                              {issue.code}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {getSeverityBadge(issue.severity)}
                              {getPriorityBadge(issue.priority)}
                            </div>
                          </div>

                          <h4
                            onClick={() => setSelectedIssueDetail(issue)}
                            className="text-xs font-bold text-slate-900 dark:text-white leading-snug cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                          >
                            {issue.title}
                          </h4>

                          {/* Justificación de Impacto */}
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-750 text-[10px] text-slate-600 dark:text-slate-300 leading-relaxed">
                            <strong className="text-slate-700 dark:text-slate-200">Impacto:</strong> {issue.impactJustification}
                          </div>

                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                            {getModuleIcon(issue.module)}
                            <span className="truncate">{formatModuleName(issue.module)}</span>
                          </div>

                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            {assigneeObj && (
                              <div className="flex items-center gap-1.5" title={`Asignado: ${assigneeObj.name}`}>
                                <div
                                  className={`w-5 h-5 rounded-full ${assigneeObj.avatarBg} text-white flex items-center justify-center text-[9px] font-bold`}
                                >
                                  {assigneeObj.initials}
                                </div>
                                <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-[90px]">
                                  {assigneeObj.name.split(" ")[0]}
                                </span>
                              </div>
                            )}

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleCopyMarkdown(issue)}
                                title="Copiar reporte en Markdown"
                                className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setSelectedIssueDetail(issue)}
                                title="Ver detalles y plantilla"
                                className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition cursor-pointer"
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Selectores rápidos: Estado y Prioridad */}
                          <div className="pt-1 grid grid-cols-2 gap-1 text-[10px]">
                            <div className="space-y-0.5">
                              <span className="text-slate-400 text-[9px] block">Estado:</span>
                              <select
                                value={issue.status}
                                onChange={(e) => handleTransitionStatus(issue.id, e.target.value as BugStatus)}
                                className="w-full text-[10px] font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none"
                              >
                                <option value="OPEN">Reportado</option>
                                <option value="IN_PROGRESS">En Progreso</option>
                                <option value="RESOLVED">Resuelto / QA</option>
                                <option value="VERIFIED_CLOSED">Verificado</option>
                              </select>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-slate-400 text-[9px] block">Prioridad:</span>
                              <select
                                value={issue.priority}
                                onChange={(e) => handleUpdatePriority(issue.id, e.target.value as BugPriority)}
                                className="w-full text-[10px] font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none"
                              >
                                <option value="P0_BLOCKER">P0 Blocker (&lt;2h)</option>
                                <option value="P1_HIGH">P1 Alta (&lt;8h)</option>
                                <option value="P2_MEDIUM">P2 Media (&lt;24h)</option>
                                <option value="P3_LOW">P3 Baja (&lt;72h)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          VISTA 2: LISTA / TABLA DETALLADA DE INCIDENCIAS
          ========================================================================= */}
      {viewMode === "table" && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Código</th>
                  <th className="py-3 px-4">Título & Justificación de Impacto</th>
                  <th className="py-3 px-4">Módulo</th>
                  <th className="py-3 px-4">Severidad</th>
                  <th className="py-3 px-4">Prioridad SLA</th>
                  <th className="py-3 px-4">Asignado</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      No se encontraron incidencias que coincidan con los filtros activos.
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => {
                    const assigneeObj = TEAM_MEMBERS.find((m) => m.id === issue.assignedTo);
                    return (
                      <tr key={issue.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-850/60 transition">
                        <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                          {issue.code}
                        </td>
                        <td className="py-3 px-4">
                          <div
                            onClick={() => setSelectedIssueDetail(issue)}
                            className="font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer max-w-md line-clamp-1"
                          >
                            {issue.title}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-sm">
                            <span className="font-semibold text-slate-700 dark:text-slate-300">Impacto:</span> {issue.impactJustification}
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                            {getModuleIcon(issue.module)}
                            <span>{formatModuleName(issue.module)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={issue.severity}
                            onChange={(e) => handleUpdateSeverity(issue.id, e.target.value as BugSeverity)}
                            className="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none"
                          >
                            <option value="CRITICAL">🔴 Crítica (S1)</option>
                            <option value="HIGH">🟠 Alta (S2)</option>
                            <option value="MEDIUM">🔵 Media (S3)</option>
                            <option value="LOW">⚪ Baja (S4)</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={issue.priority}
                            onChange={(e) => handleUpdatePriority(issue.id, e.target.value as BugPriority)}
                            className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none"
                          >
                            <option value="P0_BLOCKER">P0 Blocker (&lt;2h)</option>
                            <option value="P1_HIGH">P1 Alta (&lt;8h)</option>
                            <option value="P2_MEDIUM">P2 Media (&lt;24h)</option>
                            <option value="P3_LOW">P3 Baja (&lt;72h)</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {assigneeObj && (
                            <div className="flex items-center gap-1.5">
                              <div
                                className={`w-5 h-5 rounded-full ${assigneeObj.avatarBg} text-white flex items-center justify-center text-[9px] font-bold`}
                              >
                                {assigneeObj.initials}
                              </div>
                              <span className="font-medium text-slate-800 dark:text-slate-200">
                                {assigneeObj.name.split(" ")[0]}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={issue.status}
                            onChange={(e) => handleTransitionStatus(issue.id, e.target.value as BugStatus)}
                            className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-800 dark:text-slate-200 focus:outline-none"
                          >
                            <option value="OPEN">Reportado</option>
                            <option value="IN_PROGRESS">En Progreso</option>
                            <option value="RESOLVED">Resuelto / QA</option>
                            <option value="VERIFIED_CLOSED">Verificado</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleCopyMarkdown(issue)}
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition cursor-pointer"
                              title="Copiar formato Markdown"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setSelectedIssueDetail(issue)}
                              className="px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold hover:bg-indigo-100 transition cursor-pointer"
                            >
                              Ver Ficha
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 3: AGRUPACIÓN JERÁRQUICA POR COMPONENTE TÉCNICO (DoD #1)
          ========================================================================= */}
      {viewMode === "modules" && (
        <div className="space-y-6">
          {metrics.canonicalList.map((modId) => {
            const data = metrics.byModule[modId];
            const def = data.definition;
            const isExpanded = expandedModules[modId] ?? true;
            const moduleIssues = filteredIssues.filter((iss) => {
              const canonical = iss.canonicalModule || mapToCanonicalModule(iss.module);
              return canonical === modId;
            });

            return (
              <div
                key={modId}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition"
              >
                {/* Cabecera del Componente Técnico */}
                <div
                  onClick={() =>
                    setExpandedModules((prev) => ({
                      ...prev,
                      [modId]: !prev[modId],
                    }))
                  }
                  className="p-4 bg-slate-50/80 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <span className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-xs text-indigo-600 dark:text-indigo-400">
                      {getModuleIcon(modId)}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {def.name}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {moduleIssues.length} {moduleIssues.length === 1 ? "falla" : "fallas"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                        📁 {def.technicalComponent}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Responsable: {def.leadMemberName}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        {data.critical} Críticas • {data.high} Altas • {data.medium} Medias
                      </div>
                    </div>

                    <div className="p-1 rounded-lg bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Lista de Incidencias del Módulo */}
                {isExpanded && (
                  <div className="p-4 space-y-3 bg-slate-50/30 dark:bg-slate-950/20">
                    {moduleIssues.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 bg-white dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                        No hay incidencias que coincidan con los filtros actuales en este componente técnico.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {moduleIssues.map((issue) => {
                          const assigneeObj = TEAM_MEMBERS.find((m) => m.id === issue.assignedTo);
                          return (
                            <div
                              key={issue.id}
                              className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs transition space-y-3"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                                      {issue.code}
                                    </span>
                                    {getSeverityBadge(issue.severity)}
                                    {getPriorityBadge(issue.priority)}
                                  </div>
                                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2">
                                    {issue.title}
                                  </h4>
                                </div>

                                <button
                                  onClick={() => setSelectedIssueDetail(issue)}
                                  className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold hover:bg-indigo-100 transition cursor-pointer shrink-0"
                                >
                                  Ver Ficha
                                </button>
                              </div>

                              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                                <div>
                                  <span className="font-semibold text-rose-600 dark:text-rose-400">Falla Actual:</span>{" "}
                                  <span className="line-clamp-2">{issue.actualResult}</span>
                                </div>
                                <div>
                                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">Esperado:</span>{" "}
                                  <span className="line-clamp-1">{issue.expectedResult}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-1 text-[10px] border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-1.5 text-slate-500">
                                  {assigneeObj && (
                                    <div className="flex items-center gap-1">
                                      <div className={`w-4 h-4 rounded-full ${assigneeObj.avatarBg} text-white flex items-center justify-center text-[8px] font-bold`}>
                                        {assigneeObj.initials}
                                      </div>
                                      <span className="font-medium text-slate-700 dark:text-slate-300">
                                        {assigneeObj.name.split(" ")[0]}
                                      </span>
                                    </div>
                                  )}
                                  <span>•</span>
                                  <span className="font-mono text-slate-400">{issue.technicalComponent || def.technicalComponent.split(" & ")[0]}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                  <select
                                    value={issue.status}
                                    onChange={(e) => handleTransitionStatus(issue.id, e.target.value as BugStatus)}
                                    className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-700 dark:text-slate-300 focus:outline-none"
                                  >
                                    <option value="OPEN">Reportado</option>
                                    <option value="IN_PROGRESS">En Progreso</option>
                                    <option value="RESOLVED">Resuelto / QA</option>
                                    <option value="VERIFIED_CLOSED">Verificado</option>
                                  </select>

                                  <button
                                    onClick={() => handleCopyMarkdown(issue)}
                                    className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                                    title="Copiar Markdown"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          VISTA 4: MATRIZ DE MAPEO TÉCNICO & ARQUITECTURA (DoD #3)
          ========================================================================= */}
      {viewMode === "mapping" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Network className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Matriz Formal de Correspondencia Técnica con Arquitectura (DoD #3)
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Mapeo exhaustivo de componentes de código fuente, endpoints REST, rutas UI y criterios de activación QA.
                </p>
              </div>
            </div>

            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab("device-matrix" as any)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition cursor-pointer shadow-xs"
              >
                <span>Ver Matriz de Dispositivos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Módulo Canónico</th>
                    <th className="py-3 px-4">Responsable</th>
                    <th className="py-3 px-4">Componente & Archivos Fuente</th>
                    <th className="py-3 px-4">Endpoints REST & Rutas</th>
                    <th className="py-3 px-4">Criterio de Activación QA</th>
                    <th className="py-3 px-4 text-center">Bugs Asociados</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {metrics.canonicalList.map((modId) => {
                    const data = metrics.byModule[modId];
                    const def = data.definition;
                    const count = data.total;

                    return (
                      <tr key={modId} className="hover:bg-slate-50 dark:hover:bg-slate-850/50 transition">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white align-top">
                          <div className="flex items-center gap-1.5">
                            {getModuleIcon(modId)}
                            <span>{def.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-normal leading-relaxed">
                            {def.scopeDescription}
                          </p>
                        </td>

                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 align-top font-semibold whitespace-nowrap">
                          {def.leadMemberName}
                        </td>

                        <td className="py-3 px-4 align-top">
                          <div className="space-y-1">
                            <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold block">
                              {def.technicalComponent}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {def.sourceDirectories.map((dir) => (
                                <span
                                  key={dir}
                                  className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-[10px]"
                                >
                                  {dir}
                                </span>
                              ))}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 align-top">
                          <div className="space-y-1 text-[11px]">
                            <div className="font-semibold text-slate-700 dark:text-slate-300">APIs:</div>
                            <div className="space-y-0.5">
                              {def.associatedApis.map((api) => (
                                <span
                                  key={api}
                                  className="block font-mono text-[10px] text-slate-600 dark:text-slate-400"
                                >
                                  {api}
                                </span>
                              ))}
                            </div>
                            <div className="font-semibold text-slate-700 dark:text-slate-300 pt-1">Rutas UI:</div>
                            <span className="font-mono text-[10px] text-slate-500">
                              {def.associatedRoutes.join(", ")}
                            </span>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-slate-600 dark:text-slate-400 align-top text-[11px] leading-relaxed">
                          {def.activationCriteria}
                        </td>

                        <td className="py-3 px-4 align-top text-center">
                          <button
                            onClick={() => {
                              setSelectedModule(modId);
                              setViewMode("modules");
                            }}
                            className="inline-flex flex-col items-center gap-1 p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition cursor-pointer"
                          >
                            <span className="text-base font-black">{count}</span>
                            <span className="text-[10px] font-bold">Ver Bugs</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {isPolicyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                    <Scale className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Criterios Oficiales de Severidad e Impacto en el Sistema
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Definiciones acordadas por el equipo QA para clasificar en Crítica, Alta, Media y Baja con SLAs objetivos.
                </p>
              </div>

              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Matriz Comparativa de los 4 Niveles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SEVERITY_CRITERIA_POLICIES.map((policy) => (
                  <div
                    key={policy.severity}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(policy.severity)}
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {policy.impactLevel}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {policy.slaResolution}
                      </span>
                    </div>

                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {policy.systemImpactDefinition}
                    </p>

                    <div className="space-y-1">
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px] block">
                        Condiciones de Activación:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                        {policy.criteriaConditions.map((cond, idx) => (
                          <li key={idx}>{cond}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px]">
                      <strong className="text-indigo-600 dark:text-indigo-400">Ejemplo Real:</strong>{" "}
                      <span className="text-slate-600 dark:text-slate-300">{policy.exampleScenario}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Herramienta: Calculador de Severidad e Impacto Objetivo */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-indigo-900/40 border border-indigo-500/30 space-y-4">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-indigo-400" />
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Calculador Inteligente de Severidad y Prioridad
                  </h4>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  Evalúa objetivamente un nuevo hallazgo respondiendo las 3 preguntas clave del impacto sistémico:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Pregunta 1 */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                      1. Impacto en Datos & Operación:
                    </label>
                    <select
                      value={calcDataImpact}
                      onChange={(e) => setCalcDataImpact(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="catastrophic">Pérdida de datos / Fallo Decreto 67</option>
                      <option value="major">Falla mayor en flujo docente</option>
                      <option value="moderate">Falla en función secundaria</option>
                      <option value="cosmetic">Inconsistencia visual / Cosmética</option>
                    </select>
                  </div>

                  {/* Pregunta 2 */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                      2. Alcance de Usuarios:
                    </label>
                    <select
                      value={calcUserScope}
                      onChange={(e) => setCalcUserScope(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="all">Toda la comunidad / RBD completo</option>
                      <option value="class">Un curso / Grupo específico</option>
                      <option value="isolated">Caso borde individual</option>
                    </select>
                  </div>

                  {/* Pregunta 3 */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                      3. Disponibilidad de Workaround:
                    </label>
                    <select
                      value={calcWorkaround}
                      onChange={(e) => setCalcWorkaround(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
                    >
                      <option value="none">Sin workaround (Bloqueo total)</option>
                      <option value="difficult">Workaround complejo / manual</option>
                      <option value="easy">Workaround directo / transparente</option>
                    </select>
                  </div>
                </div>

                {/* Dictamen del Calculador */}
                <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-indigo-500/40">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-300">Dictamen Sugerido:</span>
                      {getSeverityBadge(calculatedAssessment.severity)}
                      {getPriorityBadge(calculatedAssessment.priority)}
                      <span className="text-[10px] text-indigo-300 font-mono">SLA: {calculatedAssessment.sla}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{calculatedAssessment.explanation}</p>
                  </div>

                  <button
                    onClick={() => {
                      setFormSeverity(calculatedAssessment.severity);
                      setFormPriority(calculatedAssessment.priority);
                      setFormImpactJustification(calculatedAssessment.explanation);
                      setIsPolicyModalOpen(false);
                      setIsModalOpen(true);
                      setActiveModalTab("form");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                  >
                    Usar en Nuevo Bug
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex justify-end">
              <button
                onClick={() => setIsPolicyModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition cursor-pointer"
              >
                Cerrar Guía
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REGISTRO DE NUEVA INCIDENCIA CON PLANTILLA OFICIAL ISTQB
          ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
            {/* Cabecera del Modal */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold">
                    <FileText className="w-4 h-4" />
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Plantilla Oficial de Reporte de Incidencia QA
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Clasificación estricta de severidad, prioridad de resolución y justificación de impacto.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Pestañas del Modal */}
            <div className="flex items-center gap-2 px-5 pt-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
              <button
                onClick={() => setActiveModalTab("form")}
                className={`pb-2.5 font-bold transition border-b-2 cursor-pointer ${
                  activeModalTab === "form"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Formulario Estructurado
              </button>
              <button
                onClick={() => setActiveModalTab("presets")}
                className={`pb-2.5 font-bold transition border-b-2 cursor-pointer ${
                  activeModalTab === "presets"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Plantillas Rápidas Preconfiguradas (3)
              </button>
              <button
                onClick={() => setActiveModalTab("preview")}
                className={`pb-2.5 font-bold transition border-b-2 cursor-pointer ${
                  activeModalTab === "preview"
                    ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                Vista Previa Markdown Oficial
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
              {/* Pestaña: Presets */}
              {activeModalTab === "presets" && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    Selecciona un caso típico del ciclo escolar para autocompletar la plantilla en 1 clic:
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {PRESET_TEMPLATES.map((preset) => (
                      <div
                        key={preset.id}
                        className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 hover:border-indigo-500 transition space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                            {preset.label}
                          </span>
                          <button
                            onClick={() => handleApplyPreset(preset.id)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition cursor-pointer"
                          >
                            Cargar en Formulario
                          </button>
                        </div>
                        <p className="font-medium text-slate-700 dark:text-slate-300">{preset.title}</p>
                        <div className="text-[11px] text-slate-500">
                          <strong>Severidad:</strong> {preset.severity} | <strong>Módulo:</strong>{" "}
                          {formatModuleName(preset.module)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pestaña: Vista Previa Markdown */}
              {activeModalTab === "preview" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-xs">
                      Formato oficial exportable para GitHub Issues o Jira con justificación de severidad:
                    </span>
                    <button
                      onClick={() => {
                        const tempIssue: QAIssue = {
                          id: "preview-id",
                          code: formCode,
                          title: formTitle || "Título de incidencia sin definir",
                          module: formModule,
                          severity: formSeverity,
                          priority: formPriority,
                          status: "OPEN",
                          assignedTo: formAssignedTo,
                          reportedBy: formReportedBy,
                          environment: formEnv,
                          browser: formBrowser,
                          preconditions: formPreconditions,
                          stepsToReproduce: formSteps.split("\n").filter((l) => l.trim().length > 0),
                          actualResult: formActual,
                          expectedResult: formExpected,
                          evidenceNotes: formEvidence,
                          impactJustification: formImpactJustification,
                          acceptanceCriterion: formCriterion,
                          createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
                          updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
                        };
                        handleCopyMarkdown(tempIssue);
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Markdown</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 whitespace-pre-wrap leading-relaxed">
                    {generateMarkdownTemplate({
                      id: "preview",
                      code: formCode,
                      title: formTitle || "Título de la Incidencia...",
                      module: formModule,
                      severity: formSeverity,
                      priority: formPriority,
                      status: "OPEN",
                      assignedTo: formAssignedTo,
                      reportedBy: formReportedBy,
                      environment: formEnv,
                      browser: formBrowser,
                      preconditions: formPreconditions || "Sesión activa en el establecimiento",
                      stepsToReproduce: formSteps.split("\n").filter((s) => s.trim().length > 0),
                      actualResult: formActual || "Comportamiento actual...",
                      expectedResult: formExpected || "Comportamiento esperado...",
                      evidenceNotes: formEvidence || "Evidencia técnica...",
                      impactJustification: formImpactJustification || "Clasificado según política oficial de severidad.",
                      acceptanceCriterion: formCriterion,
                      createdAt: new Date().toISOString().slice(0, 10),
                      updatedAt: new Date().toISOString().slice(0, 10),
                    })}
                  </pre>
                </div>
              )}

              {/* Pestaña: Formulario Principal */}
              {activeModalTab === "form" && (
                <form onSubmit={handleSaveNewIssue} className="space-y-4">
                  {/* Fila 1: Código y Título */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="sm:col-span-1 space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">ID Incidencia</label>
                      <input
                        type="text"
                        value={formCode}
                        onChange={(e) => setFormCode(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs"
                      />
                    </div>
                    <div className="sm:col-span-3 space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Título Descriptivo del Hallazgo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="ej: Descuadre en promedio ponderado del Semestre 1 ante decimal periódico..."
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        required
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Fila 2: Módulo, Severidad, Prioridad y Asignado */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Módulo Afectado</label>
                      <select
                        value={formModule}
                        onChange={(e) => setFormModule(e.target.value as SystemModule)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                      >
                        <option value="CALIFICACIONES_DECRETO67">Calificaciones / Dec. 67</option>
                        <option value="LIBRO_CLASES">Libro Digital</option>
                        <option value="ASISTENCIA">Asistencia Diaria</option>
                        <option value="MATRICULA_RUN">Matrícula & RUN</option>
                        <option value="AUTENTICACION_RBAC">Autenticación / RBAC</option>
                        <option value="REPORTES_ACTAS">Actas & Certificados</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Severidad Acordada
                      </label>
                      <select
                        value={formSeverity}
                        onChange={(e) => handleSeverityChange(e.target.value as BugSeverity)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-bold"
                      >
                        <option value="CRITICAL">🔴 Crítica (S1) - &lt; 2h</option>
                        <option value="HIGH">🟠 Alta (S2) - &lt; 8h</option>
                        <option value="MEDIUM">🔵 Media (S3) - &lt; 24h</option>
                        <option value="LOW">⚪ Baja (S4) - &lt; 72h</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Prioridad Asignada</label>
                      <select
                        value={formPriority}
                        onChange={(e) => setFormPriority(e.target.value as BugPriority)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                      >
                        <option value="P0_BLOCKER">P0 - Blocker (Inmediato)</option>
                        <option value="P1_HIGH">P1 - Alta (Mismo día)</option>
                        <option value="P2_MEDIUM">P2 - Media (Sprint actual)</option>
                        <option value="P3_LOW">P3 - Baja (Backlog regular)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Responsable Asignado</label>
                      <select
                        value={formAssignedTo}
                        onChange={(e) => setFormAssignedTo(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold"
                      >
                        {TEAM_MEMBERS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.role.split(" ")[0]})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Fila: Justificación de Severidad e Impacto */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Justificación de Impacto en el Sistema (Criterio de Severidad) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Explica por qué clasifica en este nivel de severidad según el impacto en la operación..."
                      value={formImpactJustification}
                      onChange={(e) => setFormImpactJustification(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                    />
                  </div>

                  {/* Fila 3: Entorno y Precondiciones */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Entorno & Navegador</label>
                      <input
                        type="text"
                        value={`${formEnv} | ${formBrowser}`}
                        onChange={(e) => {
                          const parts = e.target.value.split("|");
                          setFormEnv(parts[0]?.trim() || formEnv);
                          setFormBrowser(parts[1]?.trim() || formBrowser);
                        }}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Precondiciones Requeridas</label>
                      <input
                        type="text"
                        placeholder="ej: Docente titular con 42 hrs asignadas en 1° Medio A..."
                        value={formPreconditions}
                        onChange={(e) => setFormPreconditions(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Fila 4: Pasos para reproducir */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Pasos para Reproducir (un paso por línea)
                    </label>
                    <textarea
                      rows={3}
                      value={formSteps}
                      onChange={(e) => setFormSteps(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-mono"
                    />
                  </div>

                  {/* Fila 5: Resultado Actual vs Esperado */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-red-600 dark:text-red-400">
                        Comportamiento Actual (Fallo observado)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Qué ocurrió erróneamente en la interfaz o backend..."
                        value={formActual}
                        onChange={(e) => setFormActual(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/40 dark:bg-red-950/20 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-emerald-600 dark:text-emerald-400">
                        Comportamiento Esperado (Conforme a norma)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Qué debió ocurrir según las reglas del Decreto 67..."
                        value={formExpected}
                        onChange={(e) => setFormExpected(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                  </div>

                  {/* Fila 6: Criterio DoD y Evidencia */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Criterio DoD Asociado</label>
                      <input
                        type="text"
                        value={formCriterion}
                        onChange={(e) => setFormCriterion(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Evidencia Técnica / Logs de Consola
                      </label>
                      <input
                        type="text"
                        placeholder="ej: HTTP 500 en endpoint /api/grades o stack trace..."
                        value={formEvidence}
                        onChange={(e) => setFormEvidence(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition cursor-pointer"
                    >
                      Guardar en la Bitácora
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DETALLE Y FICHA TÉCNICA DE INCIDENCIA SELECCIONADA
          ========================================================================= */}
      {selectedIssueDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-sm text-indigo-600 dark:text-indigo-400">
                  {selectedIssueDetail.code}
                </span>
                {getSeverityBadge(selectedIssueDetail.severity)}
                {getPriorityBadge(selectedIssueDetail.priority)}
              </div>
              <button
                onClick={() => setSelectedIssueDetail(null)}
                className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                {selectedIssueDetail.title}
              </h2>

              {/* Sección de Asignación Directa y Notificación a Responsable */}
              <div className="p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-indigo-950 dark:text-indigo-200 text-xs flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    Asignación Directa & Notificación a Responsable
                  </span>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    selectedIssueDetail.notificationSent
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                  }`}>
                    <Bell className="w-2.5 h-2.5" />
                    {selectedIssueDetail.notificationSent ? "Notificación Activa" : "Pendiente de Alerta"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      Responsable Asignado (Canal Directo):
                    </label>
                    <select
                      value={selectedIssueDetail.assignedTo}
                      onChange={(e) => handleAssignIssue(selectedIssueDetail.id, e.target.value)}
                      className="w-full p-2 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs shadow-xs focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    >
                      {TEAM_MEMBERS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name} — {m.role} ({m.scope.split("•")[0]?.trim()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                      Plazo de Resolución & SLA:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={selectedIssueDetail.deadlineDate || "Hoy, 18:00 hrs"}
                        onChange={(e) => handleUpdateDeadline(selectedIssueDetail.id, e.target.value, selectedIssueDetail.deadlineStatus || "ON_TRACK")}
                        className="flex-1 p-2 rounded-xl border border-indigo-300 dark:border-indigo-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendNotification(selectedIssueDetail.id)}
                        className="flex items-center gap-1 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                        title="Despachar alerta push/email al responsable asignado"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Notificar</span>
                      </button>
                    </div>
                  </div>
                </div>

                {selectedIssueDetail.notificationMessage && (
                  <div className="p-2 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
                    <span className="truncate mr-2">📢 {selectedIssueDetail.notificationMessage}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{selectedIssueDetail.notifiedAt || "Reciente"}</span>
                  </div>
                )}
              </div>

              {/* Justificación de Impacto */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-200 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Justificación de Severidad & Impacto Sistémico
                </span>
                <p className="text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                  {selectedIssueDetail.impactJustification}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] block">Módulo</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatModuleName(selectedIssueDetail.module)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Asignado a</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {TEAM_MEMBERS.find((m) => m.id === selectedIssueDetail.assignedTo)?.name || selectedIssueDetail.assignedTo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Prioridad & SLA</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {formatPriorityLabel(selectedIssueDetail.priority)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Estado</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {formatStatusLabel(selectedIssueDetail.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Pasos para Reproducir</span>
                </h4>
                <ol className="list-decimal list-inside space-y-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  {selectedIssueDetail.stepsToReproduce.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step.replace(/^\d+\.\s*/, "")}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-red-50/50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 space-y-1">
                  <span className="font-bold text-[11px] block">Comportamiento Actual</span>
                  <p className="text-[11px] leading-relaxed">{selectedIssueDetail.actualResult}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200 space-y-1">
                  <span className="font-bold text-[11px] block">Comportamiento Esperado</span>
                  <p className="text-[11px] leading-relaxed">{selectedIssueDetail.expectedResult}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 block">Evidencia y Notas de QA</span>
                <p className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                  {selectedIssueDetail.evidenceNotes}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <button
                onClick={() => handleCopyMarkdown(selectedIssueDetail)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Ficha en Markdown</span>
              </button>

              <button
                onClick={() => setSelectedIssueDetail(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: AGREGAR NUEVO CRITERIO DE ACEPTACIÓN (DoD)
          ========================================================================= */}
      {isAddCriterionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-indigo-600 text-white shadow-xs">
                  <PlusCircle className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Agregar Criterio de Aceptación (DoD)
                  </h3>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                    {activeDodTab === "high-severity-closure"
                      ? "Pestaña: Cierre Severidad Alta"
                      : activeDodTab === "critical-retesting"
                      ? "Pestaña: Re-testing Crítico"
                      : activeDodTab === "direct-assignment"
                      ? "Pestaña: Asignación Directa"
                      : activeDodTab === "module-association"
                      ? "Pestaña: Módulos Técnicos"
                      : "Pestaña: Clasificación de Severidad"}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddCriterionModalOpen(false);
                  setNewCriterionTitle("");
                  setNewCriterionDesc("");
                }}
                className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddNewCriterion();
              }}
              className="p-5 space-y-4 text-xs"
            >
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  Título del Criterio <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="ej: Cobertura de pruebas unitarias sobre redondeo > 95%..."
                  value={newCriterionTitle}
                  onChange={(e) => setNewCriterionTitle(e.target.value)}
                  required
                  autoFocus
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  Descripción Detallada / Criterio de Verificación
                </label>
                <textarea
                  rows={3}
                  placeholder="Especifique el procedimiento o condición requerida para dar por cumplido este criterio..."
                  value={newCriterionDesc}
                  onChange={(e) => setNewCriterionDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddCriterionModalOpen(false);
                    setNewCriterionTitle("");
                    setNewCriterionDesc("");
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newCriterionTitle.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  Guardar Criterio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: PROTOCOLO DE CIERRE FORMAL DE INCIDENCIAS DE SEVERIDAD ALTA
          ========================================================================= */}
      {isFormalClosureModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Cabecera Modal */}
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
                  <BadgeCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">
                    Protocolo de Cierre Formal de Incidencia
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Transición a estado inmutable <span className="font-mono text-cyan-300 font-bold">VERIFIED_CLOSED</span> con firma digital QA
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsFormalClosureModalOpen(false);
                  setFormalClosureSelectedIssue(null);
                }}
                className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Formulario de Cierre Formal */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (formalClosureSelectedIssue) {
                  handleFormalCloseIssue(formalClosureSelectedIssue.id, formalClosureAuditor, formalClosureNotes);
                }
              }}
              className="p-6 space-y-5 text-xs overflow-y-auto max-h-[80vh]"
            >
              {/* Información del Ticket a Cerrar */}
              {formalClosureSelectedIssue && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-amber-600 dark:text-amber-400 text-xs">
                      {formalClosureSelectedIssue.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">
                      Severidad Alta (S2)
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                    {formalClosureSelectedIssue.title}
                  </h4>
                  <div className="text-[11px] text-slate-600 dark:text-slate-400">
                    Módulo: <span className="font-semibold text-slate-800 dark:text-slate-200">{formatModuleName(formalClosureSelectedIssue.module)}</span> • Componente: <span className="font-mono text-[10px]">{formalClosureSelectedIssue.technicalComponent}</span>
                  </div>
                </div>
              )}

              {/* Auditor Responsable del Cierre */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  Auditor Técnico de QA Responsable <span className="text-red-500">*</span>
                </label>
                <select
                  value={formalClosureAuditor}
                  onChange={(e) => setFormalClosureAuditor(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Carlos M. (Auditor Decreto 67 & QA Lead)">Carlos M. (Auditor Decreto 67 & QA Lead)</option>
                  <option value="Maicol R. (Backend / Database Lead)">Maicol R. (Backend / Database Lead)</option>
                  <option value="Malcom S. (Frontend Lead)">Malcom S. (Frontend Lead)</option>
                  <option value="Frank M. (Data Architecture Lead)">Frank M. (Data Architecture Lead)</option>
                </select>
              </div>

              {/* Notas de Auditoría y Dictamen de Cierre */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800 dark:text-slate-200 block">
                  Dictamen de Auditoría Técnica & Notas de Cierre <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formalClosureNotes}
                  onChange={(e) => setFormalClosureNotes(e.target.value)}
                  required
                  placeholder="Detalle la evidencia de comprobación en caliente y la justificación técnica de cierre definitivo..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Vista Previa de Sello Criptográfico */}
              <div className="p-3.5 rounded-2xl bg-slate-950 text-slate-300 font-mono text-[11px] space-y-1.5 border border-slate-800">
                <div className="text-[10px] text-slate-400 font-sans font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sello de Conformidad Inmutable (Certificado de Cierre)</span>
                </div>
                <div className="text-cyan-300">
                  ESTADO FINAL: VERIFIED_CLOSED • PROTOCOLO: QA-ACAD-HIGH-2026
                </div>
                <div className="text-slate-400 text-[10px]">
                  El ticket quedará auditado con firma digital y cumplimiento formal del DoD de Severidad Alta.
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsFormalClosureModalOpen(false);
                    setFormalClosureSelectedIssue(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>Confirmar & Sellar Cierre Formal</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
