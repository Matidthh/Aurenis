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
} from "lucide-react";

export type BugSeverity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
export type BugPriority = "P0_BLOCKER" | "P1_HIGH" | "P2_MEDIUM" | "P3_LOW";
export type BugStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "VERIFIED_CLOSED";
export type SystemModule =
  | "LIBRO_CLASES"
  | "CALIFICACIONES_DECRETO67"
  | "ASISTENCIA"
  | "MATRICULA_RUN"
  | "AUTENTICACION_RBAC"
  | "REPORTES_ACTAS";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  avatarBg: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "malcom", name: "Malcom Marcelo", role: "QA Lead & Arquitectura E2E", initials: "MM", avatarBg: "bg-blue-600" },
  { id: "lucas", name: "Lucas P.", role: "Frontend UI & Diseñador Figma", initials: "LP", avatarBg: "bg-purple-600" },
  { id: "maicol", name: "Maicol R.", role: "QA Automation & Configuración", initials: "MR", avatarBg: "bg-emerald-600" },
  { id: "frank", name: "Frank M.", role: "Criterios DoD & Componentes", initials: "FM", avatarBg: "bg-amber-600" },
  { id: "carlos", name: "Carlos M.", role: "Integración Mockups & Backend", initials: "CM", avatarBg: "bg-rose-600" },
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

export interface QAIssue {
  id: string;
  code: string; // ej: BUG-2026-001
  title: string;
  module: SystemModule;
  severity: BugSeverity;
  priority: BugPriority;
  status: BugStatus;
  assignedTo: string; // member id
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
}

export const INITIAL_ISSUES: QAIssue[] = [
  {
    id: "iss-1",
    code: "BUG-2026-001",
    title: "Inconsistencia en redondeo de promedio final en Decreto 67 ante decimal periódico",
    module: "CALIFICACIONES_DECRETO67",
    severity: "CRITICAL",
    priority: "P0_BLOCKER",
    status: "RESOLVED",
    assignedTo: "malcom",
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
  },
  {
    id: "iss-2",
    code: "BUG-2026-002",
    title: "Pérdida momentánea de foco en teclado al ingresar notas continuas de 2 dígitos",
    module: "LIBRO_CLASES",
    severity: "MEDIUM",
    priority: "P2_MEDIUM",
    status: "VERIFIED_CLOSED",
    assignedTo: "lucas",
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
  },
  {
    id: "iss-3",
    code: "BUG-2026-003",
    title: "Rechazo incorrecto de RUN chileno con dígito verificador 'K' en mayúscula en matrícula",
    module: "MATRICULA_RUN",
    severity: "HIGH",
    priority: "P1_HIGH",
    status: "RESOLVED",
    assignedTo: "carlos",
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
  },
  {
    id: "iss-4",
    code: "BUG-2026-004",
    title: "Latencia en sincronización de asistencia diaria en modo sin conexión (Offline)",
    module: "ASISTENCIA",
    severity: "HIGH",
    priority: "P1_HIGH",
    status: "IN_PROGRESS",
    assignedTo: "maicol",
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
  },
  {
    id: "iss-5",
    code: "BUG-2026-005",
    title: "Falta de tooltip explicativo en causales de promoción por Consejo de Profesores (Art. 10)",
    module: "REPORTES_ACTAS",
    severity: "LOW",
    priority: "P3_LOW",
    status: "OPEN",
    assignedTo: "frank",
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
    evidenceNotes: "Ticket asignado a Frank M. para componentes de accesibilidad en modales.",
    acceptanceCriterion: "Resolución de casos por Consejo (Art. 10 Decreto 67)",
    impactJustification: "Detalle puramente explicativo / UI que no altera los cálculos ni la validez de la promoción.",
    createdAt: "2026-09-21 07:05",
    updatedAt: "2026-09-21 07:15",
  },
  {
    id: "iss-6",
    code: "BUG-2026-006",
    title: "Fallo de validación RBAC en endpoint de modificación de actas oficiales cerradas",
    module: "AUTENTICACION_RBAC",
    severity: "CRITICAL",
    priority: "P0_BLOCKER",
    status: "RESOLVED",
    assignedTo: "malcom",
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
  },
  {
    id: "iss-7",
    code: "BUG-2026-007",
    title: "Desfase de 3px en el margen inferior de la tarjeta de información en Safari iOS",
    module: "LIBRO_CLASES",
    severity: "LOW",
    priority: "P3_LOW",
    status: "OPEN",
    assignedTo: "lucas",
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
  // Criterios de Aceptación locales para seguimiento de la tarea actual
  const [dodItems, setDodItems] = useState([
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
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("ALL");
  const [selectedModule, setSelectedModule] = useState<string>("ALL");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [sortByPriority, setSortByPriority] = useState<boolean>(true);

  // Estados de modales
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

  // Métricas calculadas
  const metrics = useMemo(() => {
    const total = issues.length;
    const critical = issues.filter((i) => i.severity === "CRITICAL").length;
    const high = issues.filter((i) => i.severity === "HIGH").length;
    const medium = issues.filter((i) => i.severity === "MEDIUM").length;
    const low = issues.filter((i) => i.severity === "LOW").length;

    const p0 = issues.filter((i) => i.priority === "P0_BLOCKER").length;
    const p1 = issues.filter((i) => i.priority === "P1_HIGH").length;
    const inProgress = issues.filter((i) => i.status === "IN_PROGRESS").length;
    const resolved = issues.filter((i) => i.status === "RESOLVED" || i.status === "VERIFIED_CLOSED").length;
    const resolutionRate = total > 0 ? Math.round((resolved / total) * 100) : 100;

    return {
      total,
      critical,
      high,
      medium,
      low,
      p0,
      p1,
      inProgress,
      resolved,
      resolutionRate,
      criticalPct: total > 0 ? Math.round((critical / total) * 100) : 0,
      highPct: total > 0 ? Math.round((high / total) * 100) : 0,
      mediumPct: total > 0 ? Math.round((medium / total) * 100) : 0,
      lowPct: total > 0 ? Math.round((low / total) * 100) : 0,
    };
  }, [issues]);

  // Filtrado y Ordenamiento de incidencias
  const filteredIssues = useMemo(() => {
    let result = issues.filter((iss) => {
      if (selectedSeverity !== "ALL" && iss.severity !== selectedSeverity) return false;
      if (selectedModule !== "ALL" && iss.module !== selectedModule) return false;
      if (selectedAssignee !== "ALL" && iss.assignedTo !== selectedAssignee) return false;
      if (selectedStatus !== "ALL" && iss.status !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = iss.code.toLowerCase().includes(q);
        const matchTitle = iss.title.toLowerCase().includes(q);
        const matchActual = iss.actualResult.toLowerCase().includes(q);
        const matchExpected = iss.expectedResult.toLowerCase().includes(q);
        const matchJust = iss.impactJustification.toLowerCase().includes(q);
        if (!matchCode && !matchTitle && !matchActual && !matchExpected && !matchJust) return false;
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

    const newIssue: QAIssue = {
      id: `iss-${Date.now()}`,
      code: formCode,
      title: formTitle.trim(),
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
      impactJustification: formImpactJustification || "Clasificado según política acordada de severidad.",
      acceptanceCriterion: formCriterion,
      createdAt: new Date().toISOString().slice(0, 16).replace("T", " "),
      updatedAt: new Date().toISOString().slice(0, 16).replace("T", " "),
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

    setCopiedNotification(`¡Nueva incidencia ${newIssue.code} registrada con severidad ${newIssue.severity}!`);
    setTimeout(() => setCopiedNotification(null), 3000);
  }

  function handleTransitionStatus(issueId: string, nextStatus: BugStatus) {
    setIssues((prev) =>
      prev.map((iss) => (iss.id === issueId ? { ...iss, status: nextStatus, updatedAt: "Ahora mismo" } : iss))
    );
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
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === issueId
          ? {
              ...iss,
              severity: nextSeverity,
              priority: policy ? policy.defaultPriority : iss.priority,
              updatedAt: "Ahora mismo",
            }
          : iss
      )
    );
    setCopiedNotification(`Severidad reclasificada a ${nextSeverity}`);
    setTimeout(() => setCopiedNotification(null), 2500);
  }

  function handleToggleDod(id: string) {
    setDodItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  }

  function handleMarkAllDod() {
    setDodItems((prev) => prev.map((item) => ({ ...item, completed: true })));
  }

  function formatModuleName(mod: SystemModule): string {
    switch (mod) {
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
      case "CALIFICACIONES_DECRETO67":
        return <Calculator className="w-3.5 h-3.5 text-emerald-500" />;
      case "LIBRO_CLASES":
        return <BookOpen className="w-3.5 h-3.5 text-blue-500" />;
      case "ASISTENCIA":
        return <Clock className="w-3.5 h-3.5 text-indigo-500" />;
      case "MATRICULA_RUN":
        return <GraduationCap className="w-3.5 h-3.5 text-purple-500" />;
      case "AUTENTICACION_RBAC":
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />;
      case "REPORTES_ACTAS":
        return <FileText className="w-3.5 h-3.5 text-rose-500" />;
    }
  }

  const dodCompletedCount = dodItems.filter((d) => d.completed).length;
  const dodTotalCount = dodItems.length;
  const dodPercentage = Math.round((dodCompletedCount / dodTotalCount) * 100);

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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              <span>Matriz de Severidad e Impacto • QA Governance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Categorización y Clasificación de Incidencias
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Políticas formales acordadas de severidad (Crítica, Alta, Media, Baja) basadas en el impacto sistémico, continuidad del servicio escolar, validez del Decreto 67 y asignación estricta de prioridad de resolución.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPolicyModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-indigo-200 border border-indigo-500/40 text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Scale className="w-4 h-4 text-indigo-400" />
              <span>Ver Criterios Acordados & Calculador</span>
            </button>

            <button
              onClick={() => {
                setSelectedIssueDetail(null);
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30 transition transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Reportar Nueva Incidencia</span>
            </button>
          </div>
        </div>

        {/* Barra de Criterios de Aceptación (DoD) */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4 space-y-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
                Definition of Done: Severidad & Prioridad
              </span>
              <span className="text-emerald-400 font-extrabold">{dodCompletedCount}/{dodTotalCount} ({dodPercentage}%)</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300"
                style={{ width: `${dodPercentage}%` }}
              />
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleMarkAllDod}
                className="text-[11px] font-bold text-emerald-400 hover:underline cursor-pointer"
              >
                Marcar todos
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

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {dodItems.map((criterion) => (
              <div
                key={criterion.id}
                onClick={() => handleToggleDod(criterion.id)}
                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-start gap-2 select-none ${
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
                  <div className="font-bold truncate text-[11px]">{criterion.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{criterion.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

            {/* Selector de Modo de Vista (Kanban vs Tabla) */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
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
                <span>Tabla Detallada</span>
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
            <option value="ALL">Módulo: Todos</option>
            <option value="CALIFICACIONES_DECRETO67">Calificaciones / Dec. 67</option>
            <option value="LIBRO_CLASES">Libro Digital</option>
            <option value="ASISTENCIA">Asistencia Diaria</option>
            <option value="MATRICULA_RUN">Matrícula & RUN</option>
            <option value="AUTENTICACION_RBAC">Autenticación / RBAC</option>
            <option value="REPORTES_ACTAS">Actas & Certificados</option>
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
          MODAL: CRITERIOS DE SEVERIDAD ACORDADOS & CALCULADOR DE IMPACTO
          ========================================================================= */}
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

              {/* Justificación de Impacto */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-1">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  Justificación de Severidad & Impacto Sistémico
                </span>
                <p className="text-indigo-950 dark:text-indigo-200 text-xs leading-relaxed">
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
                  <span className="text-slate-400 text-[10px] block">Asignado</span>
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
    </div>
  );
}
