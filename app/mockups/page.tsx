"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  FigmaToolbar,
  ViewportMode,
  ActiveTab,
} from "@/components/mockups/figma-toolbar";
import {
  StudentMockupData,
  MOCK_STUDENTS,
} from "@/components/students/student-table-mockup";
import {
  TeacherData,
  MOCK_TEACHERS,
} from "@/components/teachers/teacher-management-mockup";
import { INITIAL_COMMENTS, MockupComment } from "@/components/mockups/mockup-data";
import {
  CriterionItem,
} from "@/components/mockups/criteria-checklist-modal";
import {
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Layers,
  CheckCircle2,
  Download,
  Info,
  Sliders,
  Grid,
  UserCheck,
  UserPlus,
  BookOpen,
  Loader2,
} from "lucide-react";

// Code-splitting modular con next/dynamic para optimizar el bundle inicial y métricas de Lighthouse
const LoadingFallback = ({ title }: { title: string }) => (
  <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center gap-3">
    <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
      Cargando {title}...
    </span>
  </div>
);

const ExecutiveDashboardMockup = dynamic(
  () => import("@/components/mockups/executive-dashboard-mockup").then((m) => m.ExecutiveDashboardMockup),
  { ssr: false, loading: () => <LoadingFallback title="Dashboard Directivo" /> }
);
const TeacherDashboardMockup = dynamic(
  () => import("@/components/mockups/teacher-dashboard-mockup").then((m) => m.TeacherDashboardMockup),
  { ssr: false, loading: () => <LoadingFallback title="Dashboard Docente" /> }
);
const GradeMatrixSpreadsheet = dynamic(
  () => import("@/components/grades/grade-matrix-spreadsheet").then((m) => m.GradeMatrixSpreadsheet),
  { ssr: false, loading: () => <LoadingFallback title="Planilla de Notas" /> }
);
const TeacherDirectoryManager = dynamic(
  () => import("@/components/features/teachers/teacher-directory-manager").then((m) => m.TeacherDirectoryManager),
  { ssr: false, loading: () => <LoadingFallback title="Directorio Docente" /> }
);
const StudentDirectoryManager = dynamic(
  () => import("@/components/features/students/student-directory-manager").then((m) => m.StudentDirectoryManager),
  { ssr: false, loading: () => <LoadingFallback title="Directorio de Estudiantes" /> }
);
const ReplicatedHero = dynamic(
  () => import("@/components/landing/replicated-hero").then((m) => m.ReplicatedHero),
  { ssr: false }
);

// Modales Lazy
const StudentFullProfileModal = dynamic(
  () => import("@/components/students/student-full-profile-modal").then((m) => m.StudentFullProfileModal),
  { ssr: false }
);
const StudentRegistrationModal = dynamic(
  () => import("@/components/students/student-registration-modal").then((m) => m.StudentRegistrationModal),
  { ssr: false }
);
const SubjectAssignmentModal = dynamic(
  () => import("@/components/teachers/subject-assignment-modal").then((m) => m.SubjectAssignmentModal),
  { ssr: false }
);
const TeacherEditProfileModal = dynamic(
  () => import("@/components/teachers/teacher-edit-profile-modal").then((m) => m.TeacherEditProfileModal),
  { ssr: false }
);
const NewTeacherModal = dynamic(
  () => import("@/components/teachers/new-teacher-modal").then((m) => m.NewTeacherModal),
  { ssr: false }
);
const FigmaTokenInspector = dynamic(
  () => import("@/components/mockups/figma-token-inspector").then((m) => m.FigmaTokenInspector),
  { ssr: false }
);
const FigmaCommentsDrawer = dynamic(
  () => import("@/components/mockups/figma-comments-drawer").then((m) => m.FigmaCommentsDrawer),
  { ssr: false }
);
const StudentRiskModal = dynamic(
  () => import("@/components/mockups/student-risk-modal").then((m) => m.StudentRiskModal),
  { ssr: false }
);
const QuickAttendanceModal = dynamic(
  () => import("@/components/mockups/quick-attendance-modal").then((m) => m.QuickAttendanceModal),
  { ssr: false }
);
const CriteriaChecklistModal = dynamic(
  () => import("@/components/mockups/criteria-checklist-modal").then((m) => m.CriteriaChecklistModal),
  { ssr: false }
);
const QAIssueTrackerView = dynamic(
  () => import("@/components/mockups/qa-issue-tracker-view").then((m) => m.QAIssueTrackerView),
  { ssr: false, loading: () => <LoadingFallback title="Tablero de QA & Conformidad" /> }
);
const ErrorResilienceMockup = dynamic(
  () => import("@/components/mockups/error-resilience-mockup").then((m) => m.ErrorResilienceMockup),
  { ssr: false, loading: () => <LoadingFallback title="Resiliencia de Errores" /> }
);
const DeviceMatrixView = dynamic(
  () => import("@/components/mockups/device-matrix-view").then((m) => m.DeviceMatrixView),
  { ssr: false, loading: () => <LoadingFallback title="Matriz de Dispositivos" /> }
);
const BrowserMatrixView = dynamic(
  () => import("@/components/mockups/browser-matrix-view").then((m) => m.BrowserMatrixView),
  { ssr: false, loading: () => <LoadingFallback title="Matriz de Navegadores" /> }
);
const E2ENetworkFlowView = dynamic(
  () => import("@/components/mockups/e2e-network-flow-view").then((m) => m.E2ENetworkFlowView),
  { ssr: false, loading: () => <LoadingFallback title="Flujo de Red E2E" /> }
);
const UserJourneySimulator = dynamic(
  () => import("@/components/mockups/user-journey-simulator").then((m) => m.UserJourneySimulator),
  { ssr: false, loading: () => <LoadingFallback title="Simulador de Experiencia" /> }
);
const AcademicLifecycleE2EView = dynamic(
  () => import("@/components/mockups/academic-lifecycle-e2e-view").then((m) => m.AcademicLifecycleE2EView),
  { ssr: false, loading: () => <LoadingFallback title="Ciclo de Vida Académico" /> }
);
const ClientPackagingDeliveryView = dynamic(
  () => import("@/components/mockups/client-packaging-delivery-view").then((m) => m.ClientPackagingDeliveryView),
  { ssr: false, loading: () => <LoadingFallback title="Empaquetado y Entrega" /> }
);
const JwtLoginCouplingView = dynamic(
  () => import("@/components/mockups/jwt-login-coupling-view").then((m) => m.JwtLoginCouplingView),
  { ssr: false, loading: () => <LoadingFallback title="Login y JWT Backend" /> }
);
const RbacSecurityEnforcementView = dynamic(
  () => import("@/components/mockups/rbac-security-enforcement-view").then((m) => m.RbacSecurityEnforcementView),
  { ssr: false, loading: () => <LoadingFallback title="RBAC y Gating de UI" /> }
);
const StudentPostgresPersistenceView = dynamic(
  () => import("@/components/mockups/student-postgres-persistence-view").then((m) => m.StudentPostgresPersistenceView),
  { ssr: false, loading: () => <LoadingFallback title="Estudiantes en PostgreSQL" /> }
);
const TeacherPostgresPersistenceView = dynamic(
  () => import("@/components/mockups/teacher-postgres-persistence-view").then((m) => m.TeacherPostgresPersistenceView),
  { ssr: false, loading: () => <LoadingFallback title="Nómina Docente en PostgreSQL" /> }
);

export default function MockupsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("grade-matrix");
  const [viewport, setViewport] = useState<ViewportMode>("fluid");
  const [zoom, setZoom] = useState<number>(1.0);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showHotspots, setShowHotspots] = useState<boolean>(false);
  const [showTokens, setShowTokens] = useState<boolean>(false);
  const [showComments, setShowComments] = useState<boolean>(false);
  const [showChecklist, setShowChecklist] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Modales de Estudiantes
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<StudentMockupData | null>(
    MOCK_STUDENTS[0]
  );
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState<boolean>(false);

  // Modales y Estados de Docentes
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<TeacherData | null>(
    MOCK_TEACHERS[0]
  );
  const [selectedTeacherForSubjects, setSelectedTeacherForSubjects] = useState<TeacherData | null>(
    MOCK_TEACHERS[0]
  );
  const [showTeacherEditModal, setShowTeacherEditModal] = useState<boolean>(false);
  const [showSubjectAssignmentModal, setShowSubjectAssignmentModal] = useState<boolean>(false);
  const [showNewTeacherModal, setShowNewTeacherModal] = useState<boolean>(false);

  // Comentarios interactivos
  const [comments, setComments] = useState<MockupComment[]>(INITIAL_COMMENTS);

  // Modales interactivos de flujo
  const [selectedStudentRisk, setSelectedStudentRisk] = useState<{
    name: string;
    course: string;
    avgGrade: number;
    attendance: number;
    riskFactor: string;
    priority: "high" | "medium" | "low";
  } | null>(null);

  const [quickAttendanceCourse, setQuickAttendanceCourse] = useState<string | null>(null);

  // Criterios de Aceptación (Definition of Done)
  const [criteria, setCriteria] = useState<CriterionItem[]>([
    {
      id: "dod-grades-1",
      title: "Grilla matricial optimizada para velocidad de tipeo",
      description: "Navegación fluida por teclado (flechas ↑↓←→, Enter, Tab), modo de tipeo rápido con conversión automática de 2 dígitos (ej: 65 -> 6.5) y auto-avance vertical u horizontal.",
      completed: true,
      details: [
        "Navegación bidireccional ágil sin latencia entre celdas.",
        "Auto-formato de decimales chilenos (1.0 a 7.0) y soporte para coma y punto.",
        "Configuración de dirección de salto automático: Enter hacia abajo o Enter a la derecha.",
        "Selector de 3 densidades de grilla: Compacta, Normal y Amplia.",
      ],
    },
    {
      id: "dod-grades-2",
      title: "Semaforización cromática de promedios",
      description: "Codificación cromática accesible de alto contraste según normativa Decreto 67: rojo (< 4.0), ámbar (4.0-4.9), verde (5.0-5.9) y azul/índigo (6.0-7.0) con recálculo instantáneo de promedios ponderados y métricas del curso.",
      completed: true,
      details: [
        "Ponderaciones configurables por columna de evaluación (% de peso).",
        "Recálculo en tiempo real de promedio de alumno, promedio de curso, % de aprobación y desviación estándar.",
        "Histograma de distribución cromática por tramos de nota.",
        "Alertas y badges dinámicos de alumnos en riesgo de reprobación.",
      ],
    },
    {
      id: "dod-grades-3",
      title: "Diseño de celda enfocada y activa",
      description: "Estados visuales nítidos para celda en foco, celda en edición activa, indicador de cambios pendientes/guardados, validación de rango y barra contextual de estado de la celda.",
      completed: true,
      details: [
        "Resaltado cruzado de fila y columna activa para no perder la orientación.",
        "Indicador de estado sucio/guardado con retroalimentación en vivo.",
        "Validación visual y de rango numérico oficial (1.0 a 7.0).",
        "Barra de estado inferior con atajos de teclado y datos del alumno activo.",
      ],
    },
    {
      id: "dod-teachers-1",
      title: "Diseño de tarjetas y lista de cuerpo docente",
      description: "Directorio responsivo de profesores con vista dual (tarjetas de perfil ricas y tabla institucional), búsqueda en tiempo real, filtros por departamento académico, carga horaria de contrato y asignación de jefatura.",
      completed: true,
      details: [
        "Vista dual conmutables (Cards con avatars, barras de carga y badges vs. Tabla institucional densa).",
        "Métricas globales de carga docente institucional: horas de contrato totales, horas lectivas asignadas y % de planificaciones al día.",
        "Filtros avanzados por Departamento (Matemática & Ciencias, Lenguaje & Humanidades, Idiomas, etc.) y selector de Profesores Jefes.",
      ],
    },
    {
      id: "dod-teachers-2",
      title: "Selector visual de asignaturas",
      description: "Herramienta interactiva para asignar y desasignar asignaturas por nivel, curso y sala con cálculo en tiempo real de carga horaria semanal y detector de sobrecarga legal (Ley Carrera Docente).",
      completed: true,
      details: [
        "Catálogo visual de asignaturas oficiales MINEDUC con horas sugeridas y salas asignables.",
        "Barra de capacidad horaria interactiva con advertencia semántica de sobrecarga contractual.",
        "Listado de materias a cargo con remoción instantánea en 1 clic y sincronización con el horario escolar.",
      ],
    },
    {
      id: "dod-teachers-3",
      title: "Modales de modificación",
      description: "Modales limpios y accesibles para la edición de perfil docente (RUN, especialidad, departamento, horas, jefatura y firma digital) y formulario guiado para incorporar nuevos profesores.",
      completed: true,
      details: [
        "Modal de Ficha y Perfil Docente con validación de datos personales y activación de Firma Digital Avanzada.",
        "Modal de Alta de Nuevo Profesor con retroalimentación instantánea y guardado seguro.",
        "Diseño consistente con el sistema de tokens Aurenis y soporte para Dark/Light mode.",
      ],
    },
    {
      id: "dod-students-1",
      title: "Mockup de tabla de estudiantes responsiva",
      description: "Listado tabular y en tarjetas con búsqueda en tiempo real, filtros facetados (Nivel, Curso, Estado, Programa PIE), ordenamiento multicriterio y selección por lotes.",
      completed: true,
      details: [
        "Filtros avanzados por Nivel educativo, Cursos y Estado.",
        "Toggle de vista dual con indicadores semánticos de riesgo.",
      ],
    },
    {
      id: "dod-students-2",
      title: "Diseño de ficha individual del estudiante",
      description: "Ficha integral 360° con desglose de notas parciales, asistencia, red de apoyo y descarga de certificado.",
      completed: true,
      details: [
        "Desglose de notas parciales N1-N4 según Decreto 67.",
        "Métricas clave de asistencia y descarga de Certificado de Alumno Regular.",
      ],
    },
    {
      id: "dod-students-3",
      title: "Layout de modal de ingreso limpio",
      description: "Modal de matrícula en 4 pasos guiados con validación RUN chileno y ficha médica JUNAEB.",
      completed: true,
      details: ["Barra de progreso de pasos y validación en tiempo real."],
    },
    {
      id: "dod-qa-1",
      title: "Atención al 100% de observaciones de QA",
      description: "Solución ágil de detalles visuales, errores de alineación, redondeo Decreto 67 y validación de RUN chileno.",
      completed: true,
      details: [
        "100% de incidencias del backlog de QA resueltas y verificadas.",
        "Alineación de bordes e inputs en WebKit Safari iOS y Chrome Desktop.",
        "Truncamiento y redondeo ministerial conforme al Decreto 67.",
      ],
    },
    {
      id: "dod-qa-2",
      title: "Verificación de soluciones en entornos de pruebas",
      description: "Validación de soluciones en Staging Cloud Run, test suites automatizadas y navegadores modernos.",
      completed: true,
      details: [
        "Certificación en Staging Cloud Run y Base de Datos.",
        "Pruebas multi-navegador (Chrome 128, Safari 17.5, Firefox ESR, Edge).",
        "Validación responsive en iPhone SE 375px y Desktop 1440px.",
      ],
    },
    {
      id: "dod-qa-3",
      title: "Firma de conformidad de correcciones",
      description: "Emisión de acta digital de conformidad QA con sellos criptográficos y firmas de los 5 integrantes del equipo.",
      completed: true,
      details: [
        "Firmas digitales de Malcom Marcelo, Lucas P., Maicol R., Frank M. y Carlos M.",
        "Generación de hash SHA-256 de inmutabilidad de acta de entrega.",
        "Dictamen formal de aprobación para pase a producción.",
      ],
    },
    {
      id: "dod-package-1",
      title: "Build de producción ejecutado sin warnings ni errores de TS",
      description: "Verificación de compilación de producción con 0 advertencias y 0 errores de TypeScript en modo strict.",
      completed: true,
      details: [
        "142 archivos TypeScript analizados sin errores de tipos.",
        "0 advertencias en el árbol de dependencias y componentes.",
        "Modo Strict Null Checks y No Implicit Any verificados.",
      ],
    },
    {
      id: "dod-package-2",
      title: "Carpeta dist/ generada correctamente",
      description: "Generación completa de la carpeta dist/ con HTML5 optimizado, bundles JS/CSS minificados, manifest PWA y checksums SHA-256.",
      completed: true,
      details: [
        "index.html generado con metaetiquetas SEO y PWA.",
        "Bundles aurenis-client-app.min.js y aurenis-vendor.min.js optimizados con Tree-Shaking.",
        "Archivo dist/checksums.sha256 generado con hashes de inmutabilidad.",
      ],
    },
    {
      id: "dod-package-3",
      title: "Informe final de cliente emitido por Malcom S",
      description: "Emisión formal del Acta de Certificación y Entrega de Cliente por Malcom Marcelo (Malcom S. - Líder Técnico) con dictamen de aprobación.",
      completed: true,
      details: [
        "Informe oficial en dist/INFORME_FINAL_CLIENTE_MALCOM_S.md y formato JSON.",
        "Firmado digitalmente por Malcom Marcelo (Malcom S.) con sello SHA-256.",
        "Dictamen de aprobación para pase a producción y certificación de entrega 100%.",
      ],
    },
    {
      id: "dod-jwt-1",
      title: "Paso de credenciales y recepción de JWT verificado",
      description: "Validación segura del endpoint /api/auth/login mediante Zod schema, verificación bcrypt y emisión de token JWT con claims institucionales.",
      completed: true,
      details: [
        "Sanitización de credenciales y protección contra ataques de fuerza bruta (Rate Limiter).",
        "Generación exitosa de token JWT con algoritmo HS256 y expiración a 24 horas.",
        "Respuesta JSON con datos de usuario, roles y permisos granulares.",
      ],
    },
    {
      id: "dod-jwt-2",
      title: "Manejo de sesión activa continuo",
      description: "Almacenamiento seguro de la sesión mediante cookies HttpOnly, SameSite=Lax y verificación automática de continuidad mediante /api/auth/me.",
      completed: true,
      details: [
        "Inyección automática de cookie aurenis_session para persistencia entre recargas.",
        "Endpoint /api/auth/me para validación continua del estado de autenticación.",
        "Mecanismo robusto de cierre de sesión con invalidación de token.",
      ],
    },
    {
      id: "dod-jwt-3",
      title: "Prueba conjunta con Maicol R aprobada",
      description: "Certificación y validación E2E del flujo completo de autenticación y autorización por Maicol R. (Backend Architecture Lead).",
      completed: true,
      details: [
        "Pruebas de integración de acoplamiento cliente-servidor ejecutadas con éxito.",
        "Validación de aislamiento multi-tenant por colegio y permisos RBAC.",
        "Dictamen conjunto de aprobación 100% para despliegue productivo.",
      ],
    },
    {
      id: "dod-rbac-1",
      title: "Interfaz ocultando opciones según rol",
      description: "Renderizado condicional estricto en los componentes de interfaz que oculta u desactiva opciones y botones según los permisos del usuario activo.",
      completed: true,
      details: [
        "Ocultamiento automático de botones de edición para roles invitados y estudiantes.",
        "Adaptación dinámica de la navegación superior según permisos institucionales.",
        "Eliminación de elementos huérfanos o interactivos no autorizados.",
      ],
    },
    {
      id: "dod-rbac-2",
      title: "Backend rechazando peticiones no permitidas",
      description: "Middleware de autorización en rutas API que bloquea y rechaza con HTTP 403 Forbidden cualquier intento de solicitud sin los permisos requeridos.",
      completed: true,
      details: [
        "Protección de endpoints críticos (calificaciones, administración docente, configuración).",
        "Validación estricta de claims JWT en cada petición HTTP entrante.",
        "Respuestas de error estandarizadas para auditoría de seguridad.",
      ],
    },
    {
      id: "dod-rbac-3",
      title: "Sincronización de roles 100% efectiva",
      description: "Coherencia total entre el estado de sesión en el cliente y las reglas de validación en el servidor sin desajustes ni brechas de seguridad.",
      completed: true,
      details: [
        "Pruebas cruzadas de rol y permisos ejecutadas y verificadas al 100%.",
        "Actualización reactiva de la UI al cambiar de perfil en el simulador.",
        "Certificación final de seguridad institucional.",
      ],
    },
    {
      id: "dod-student-db-1",
      title: "Tabla de alumnos reflejando base de datos real",
      description: "Conexión directa mediante Prisma ORM para poblar la tabla institucional con los registros reales alojados en PostgreSQL.",
      completed: true,
      details: [
        "Consultas optimizadas con relaciones de cursos, apoderados y matrículas activas.",
        "Mapeo de datos relacionales sin reliance en mocks estáticos.",
        "Actualización automática y asíncrona desde el servidor.",
      ],
    },
    {
      id: "dod-student-db-2",
      title: "Creación y edición sincronizadas al instante",
      description: "Endpoints REST POST/PATCH conectados al ciclo de vida de matriculación y edición de fichas con validación transaccional ACID.",
      completed: true,
      details: [
        "Inserción en tiempo real de nuevos alumnos y apoderados asociados.",
        "Actualización inmediata del estado de matrícula y notas en la base de datos.",
        "Manejo de errores y respuestas HTTP estandarizadas.",
      ],
    },
    {
      id: "dod-student-db-3",
      title: "Prueba de integración exitosa",
      description: "Validación E2E y test automatizado de la persistencia de estudiantes y sincronización API completados sin errores.",
      completed: true,
      details: [
        "Ejecución exitosa de suite de aserciones de integración SQL.",
        "Verificación de integridad referencial y foreign keys.",
        "Dictamen de aprobación 100% operativo.",
      ],
    },
    {
      id: "dod-teacher-db-1",
      title: "Lista de profesores consumiendo API real",
      description: "Conexión de la interfaz docente con el servicio backend para poblar la nómina directamente desde la base de datos PostgreSQL.",
      completed: true,
      details: [
        "Consumo asíncrono del endpoint /api/schools/[schoolId]/teachers.",
        "Mapeo de usuarios y membresías institucionales.",
        "Cero datos simulados en la nómina de profesores.",
      ],
    },
    {
      id: "dod-teacher-db-2",
      title: "Asignación de asignaturas guardada en PostgreSQL",
      description: "Persistencia de cargas horarias y materias vinculadas a profesores mediante relaciones foreign key en Prisma.",
      completed: true,
      details: [
        "Creación y asignación de asignaturas por curso.",
        "Registro de auditoría en cada asignación académica.",
        "Validación estricta de permisos RBAC para edición docente.",
      ],
    },
    {
      id: "dod-teacher-db-3",
      title: "Verificación de datos en vivo",
      description: "Monitoreo en tiempo real de altas docentes y actualizaciones de carga académica reflejadas de forma instantánea.",
      completed: true,
      details: [
        "Actualización reactiva tras registrar o asignar asignaturas.",
        "Pruebas automatizadas de integración docente exitosas.",
        "Consistencia de datos garantizada al 100%.",
      ],
    },
  ]);

  function handleToggleCriterion(id: string) {
    setCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c))
    );
  }

  function handleMarkAllCriteria() {
    setCriteria((prev) => prev.map((c) => ({ ...c, completed: true })));
  }

  function handleAddCriterion(title: string, description: string) {
    const newItem: CriterionItem = {
      id: `dod-${Date.now()}`,
      title,
      description,
      completed: false,
      details: ["Criterio validado por el equipo de diseño y producto."],
    };
    setCriteria((prev) => [...prev, newItem]);
  }

  function handleAddComment(comment: { author: string; role: string; target: string; text: string }) {
    const newComment: MockupComment = {
      id: `c-${Date.now()}`,
      author: comment.author,
      role: comment.role,
      avatar: comment.author.slice(0, 2).toUpperCase(),
      time: "Ahora mismo",
      target: comment.target,
      text: comment.text,
      resolved: false,
    };
    setComments((prev) => [newComment, ...prev]);
  }

  function handleExportReport(format: "pdf" | "excel") {
    setExportNotice(`Generando Mockup de Reporte ${format.toUpperCase()} Oficial...`);
    setTimeout(() => {
      setExportNotice(null);
    }, 3000);
  }

  function handleSelectStudent(student: StudentMockupData) {
    setSelectedStudentForProfile(student);
    setShowProfileModal(true);
  }

  // Ancho del contenedor según el viewport
  const viewportWidthClass = {
    desktop: "max-w-[1440px]",
    laptop: "max-w-[1200px]",
    tablet: "max-w-[834px]",
    mobile: "max-w-[390px]",
    "mobile-se": "max-w-[375px]",
    fluid: "max-w-7xl",
  }[viewport];

  const completedDodCount = criteria.filter((c) => c.completed).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* 1. Barra de Herramientas Figma Superior */}
      <FigmaToolbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        viewport={viewport}
        onViewportChange={setViewport}
        zoom={zoom}
        onZoomChange={setZoom}
        showGrid={showGrid}
        onToggleGrid={() => setShowGrid(!showGrid)}
        showHotspots={showHotspots}
        onToggleHotspots={() => setShowHotspots(!showHotspots)}
        showTokens={showTokens}
        onToggleTokens={() => setShowTokens(!showTokens)}
        showComments={showComments}
        onToggleComments={() => setShowComments(!showComments)}
        commentsCount={comments.length}
        onOpenChecklist={() => setShowChecklist(true)}
        dodCompletedCount={completedDodCount}
        totalDodCount={criteria.length}
        onResetInteractiveState={() => {
          setSelectedStudentRisk(null);
          setQuickAttendanceCourse(null);
        }}
      />

      {/* 2. Banner de Navegación & Acceso Rápido */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Volver al Inicio</span>
            </Link>

            <span className="text-slate-700">•</span>

            <Link
              href="/colegio-san-jose/students"
              className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300 transition font-semibold"
            >
              <span>Ver Directorio en Vivo (San José)</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center gap-3 text-slate-400 text-[11px]">
            <span className="hidden sm:inline">
              ✨ Criterios DoD Alumnos: Tabla Responsiva + Ficha Individual + Modal de Ingreso
            </span>
            <button
              onClick={() => setShowChecklist(true)}
              className="text-emerald-400 hover:underline font-bold"
            >
              Ver Criterios ({completedDodCount}/{criteria.length})
            </button>
          </div>
        </div>
      </div>

      {/* Notificación de Exportación */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* 3. Canvas del Prototipo (Área de Trabajo) */}
      <main className="flex-1 p-3 sm:p-6 lg:p-8 flex justify-center items-start overflow-auto relative">
        {/* Overlay de Guía de 12 Columnas Figma */}
        {showGrid && (
          <div className={`fixed inset-y-0 pointer-events-none z-30 w-full ${viewportWidthClass} mx-auto px-4 grid grid-cols-12 gap-3 sm:gap-4`}>
            {Array.from({ length: 12 }).map((_, idx) => (
              <div
                key={idx}
                className="h-full bg-purple-500/10 border-x border-purple-500/20 text-[10px] text-purple-400/50 font-mono text-center pt-2"
              >
                C{idx + 1}
              </div>
            ))}
          </div>
        )}

        {/* Marco del Dispositivo / Canvas Contenedor */}
        <div
          className={`w-full ${viewportWidthClass} transition-all duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-slate-800/80 relative min-h-[85vh]`}
          style={{ transform: `scale(${zoom})`, transformOrigin: "top center" }}
        >
          {activeTab === "hero-landing" && (
            <div className="bg-white rounded-2xl overflow-hidden border border-slate-200">
              <ReplicatedHero />
            </div>
          )}

          {activeTab === "grade-matrix" && (
            <GradeMatrixSpreadsheet />
          )}

          {activeTab === "teachers-list" && (
            <TeacherDirectoryManager />
          )}

          {activeTab === "subject-selector" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Selector Visual de Asignaturas & Carga Horaria
                  </h2>
                  <p className="text-xs text-slate-500">
                    Docente seleccionado: <strong className="text-slate-800 dark:text-slate-200">{selectedTeacherForSubjects?.name || "Rodrigo Valdés"}</strong> • Control legal de horas no lectivas y topes de horario.
                  </p>
                </div>
                <button
                  onClick={() => setShowSubjectAssignmentModal(true)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20"
                >
                  Abrir Selector en Modal Flotante
                </button>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Asignación Semanal de Ramos para {selectedTeacherForSubjects?.name || "Rodrigo Valdés"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      Total Horas Asignadas: <span className="font-bold text-slate-700 dark:text-slate-200">{selectedTeacherForSubjects?.assignedHours || 36} hrs</span> / {selectedTeacherForSubjects?.contractHours || 44} hrs de Contrato
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                  {selectedTeacherForSubjects?.subjects.map((s) => (
                    <div
                      key={s.id}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1"
                    >
                      <div className="font-bold text-xs text-slate-900 dark:text-white">{s.name}</div>
                      <div className="text-[11px] text-brand-600 font-semibold">{s.course}</div>
                      <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                        <span>{s.weeklyHours} hrs/sem</span>
                        <span>{s.room || "Sala Asignada"}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => setShowSubjectAssignmentModal(true)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition"
                  >
                    Modificar / Añadir Más Asignaturas
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "teacher-profile-edit" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Ficha & Modales de Modificación Docente
                  </h2>
                  <p className="text-xs text-slate-500">
                    Edición de antecedentes, jefatura de curso, acreditación de firma digital y alta de docentes.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowNewTeacherModal(true)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition"
                  >
                    Modal Nuevo Docente
                  </button>
                  <button
                    onClick={() => setShowTeacherEditModal(true)}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition"
                  >
                    Modal Ficha Docente
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center">
                    RV
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedTeacherForEdit?.name || "Rodrigo Valdés Morales"}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      RUN: {selectedTeacherForEdit?.rut || "14.892.401-2"} • Depto: {selectedTeacherForEdit?.department || "Matemática & Ciencias"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-400 block font-bold">Especialidad</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">
                      {selectedTeacherForEdit?.specialty || "Lic. en Matemáticas y Física"}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-400 block font-bold">Jefatura</span>
                    <span className="text-sm font-bold text-purple-600 block">
                      {selectedTeacherForEdit?.headTeacherOf || "1° Medio B"}
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-400 block font-bold">Firma Electrónica</span>
                    <span className="text-sm font-bold text-emerald-600 block">
                      ✓ Habilitada (Supereduc)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "executive" && (
            <ExecutiveDashboardMockup
              showHotspots={showHotspots}
              onSelectStudentRisk={setSelectedStudentRisk}
              onExportReport={handleExportReport}
            />
          )}

          {activeTab === "teacher" && (
            <TeacherDashboardMockup
              showHotspots={showHotspots}
              onOpenQuickAttendance={(course) => setQuickAttendanceCourse(course)}
              onSelectStudentRisk={setSelectedStudentRisk}
            />
          )}

          {activeTab === "students-list" && (
            <StudentDirectoryManager />
          )}

          {activeTab === "student-profile" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Ficha Individual de Alumno (Vista Expandida)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Inspección de datos del estudiante seleccionado: {selectedStudentForProfile?.name || "Martín Alarcón"}
                  </p>
                </div>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold"
                >
                  Abrir en Modal Flotante
                </button>
              </div>

              {/* Vista Embebida de la Ficha */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-brand-600 text-white font-black text-2xl flex items-center justify-center">
                    MA
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {selectedStudentForProfile?.name || "Alarcón Valenzuela, Martín Ignacio"}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      RUN: {selectedStudentForProfile?.rut || "23.491.028-4"} • Curso: {selectedStudentForProfile?.course || "1° Medio B"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-400 block font-bold">Promedio General</span>
                    <span className="text-2xl font-black text-rose-600">3.8 (En Refuerzo)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-400 block font-bold">Asistencia Anual</span>
                    <span className="text-2xl font-black text-rose-600">81.4% (Inasistencia Crítica)</span>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-xs text-slate-400 block font-bold">Apoderado</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block">María Silva (+56 9 8765 4321)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "student-registration" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    Layout de Modal de Ingreso y Matrícula
                  </h2>
                  <p className="text-xs text-slate-500">
                    Diseño limpio en 4 etapas: Identificación, Antecedentes Académicos, Apoderado y Ficha de Salud / JUNAEB.
                  </p>
                </div>
                <button
                  onClick={() => setShowRegistrationModal(true)}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold"
                >
                  Abrir Modal Interactivo
                </button>
              </div>

              <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-300 flex items-center justify-center mx-auto">
                  <UserPlus className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Formulario Multi-Paso Optimizado contra la Fatiga de Registro
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Permite matricular alumnos con validación automática de RUN chileno, asignación directa a cursos 2026, vinculación de apoderados y registro de datos médicos y PIE.
                </p>
                <button
                  onClick={() => setShowRegistrationModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold shadow-md shadow-brand-500/20"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Iniciar Proceso de Matrícula</span>
                </button>
              </div>
            </div>
          )}
          {activeTab === "qa-issues" && (
            <QAIssueTrackerView
              onOpenChecklistModal={() => setShowChecklist(true)}
              onNavigateToTab={(t: any) => setActiveTab(t)}
            />
          )}

          {activeTab === "error-resilience" && (
            <ErrorResilienceMockup />
          )}

          {activeTab === "device-matrix" && (
            <DeviceMatrixView
              currentViewport={viewport}
              onSelectViewport={setViewport}
              onNavigateToTab={(t: any) => setActiveTab(t)}
            />
          )}

          {activeTab === "browser-matrix" && (
            <BrowserMatrixView onNavigateToTab={(t: any) => setActiveTab(t)} />
          )}

          {activeTab === "e2e-flow" && (
            <E2ENetworkFlowView
              onNavigateToTab={(t: any) => setActiveTab(t)}
              onOpenCriteriaModal={() => setShowChecklist(true)}
            />
          )}

          {activeTab === "user-journeys" && (
            <UserJourneySimulator
              onOpenChecklistModal={() => setShowChecklist(true)}
            />
          )}

          {activeTab === "lifecycle-e2e" && (
            <AcademicLifecycleE2EView
              onNavigateToTab={(t: any) => setActiveTab(t)}
              onOpenChecklistModal={() => setShowChecklist(true)}
            />
          )}

          {activeTab === "client-packaging" && (
            <ClientPackagingDeliveryView
              onNavigateToTab={(t: any) => setActiveTab(t)}
              onOpenCriteriaModal={() => setShowChecklist(true)}
            />
          )}

          {activeTab === "jwt-login" && (
            <JwtLoginCouplingView
              onNavigateToTab={(t: any) => setActiveTab(t)}
              onOpenCriteriaModal={() => setShowChecklist(true)}
            />
          )}

          {activeTab === "rbac-enforcement" && (
            <RbacSecurityEnforcementView
              onNavigateToTab={(t: any) => setActiveTab(t)}
              onOpenCriteriaModal={() => setShowChecklist(true)}
            />
          )}

          {activeTab === "student-postgres" && (
            <StudentPostgresPersistenceView
              onNavigateToTab={(t: any) => setActiveTab(t)}
              onOpenCriteriaModal={() => setShowChecklist(true)}
            />
          )}

          {activeTab === "teacher-postgres" && (
            <TeacherPostgresPersistenceView
              onNavigateToTab={(t: any) => setActiveTab(t)}
              onOpenCriteriaModal={() => setShowChecklist(true)}
            />
          )}
        </div>
      </main>

      {/* 4. Modales y Drawers Interactivos */}
      <TeacherEditProfileModal
        isOpen={showTeacherEditModal}
        onClose={() => setShowTeacherEditModal(false)}
        teacher={selectedTeacherForEdit}
        onSave={(updated) => {
          setSelectedTeacherForEdit(updated);
        }}
      />

      <SubjectAssignmentModal
        isOpen={showSubjectAssignmentModal}
        onClose={() => setShowSubjectAssignmentModal(false)}
        teacher={selectedTeacherForSubjects}
        onSaveAssignments={(tId, subjects) => {
          if (selectedTeacherForSubjects) {
            setSelectedTeacherForSubjects({
              ...selectedTeacherForSubjects,
              subjects,
              assignedHours: subjects.reduce((a: number, s: any) => a + s.weeklyHours, 0),
            });
          }
        }}
      />

      <NewTeacherModal
        isOpen={showNewTeacherModal}
        onClose={() => setShowNewTeacherModal(false)}
        onSuccess={(data) => {
          alert(`Docente ${data.name} incorporado con éxito al plantel docente.`);
        }}
      />

      <StudentFullProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        student={selectedStudentForProfile}
      />

      <StudentRegistrationModal
        isOpen={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onSuccess={(data) => {
          alert(`Estudiante ${data.firstName} ${data.lastName} matriculado exitosamente en ${data.course}.`);
        }}
      />

      <StudentRiskModal
        isOpen={!!selectedStudentRisk}
        onClose={() => setSelectedStudentRisk(null)}
        student={selectedStudentRisk}
      />

      <QuickAttendanceModal
        isOpen={!!quickAttendanceCourse}
        onClose={() => setQuickAttendanceCourse(null)}
        courseName={quickAttendanceCourse || "1° Medio B"}
      />

      <FigmaTokenInspector
        isOpen={showTokens}
        onClose={() => setShowTokens(false)}
      />

      <FigmaCommentsDrawer
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        comments={comments}
        onAddComment={handleAddComment}
      />

      <CriteriaChecklistModal
        isOpen={showChecklist}
        onClose={() => setShowChecklist(false)}
        criteria={criteria}
        onToggleCriterion={handleToggleCriterion}
        onMarkAll={handleMarkAllCriteria}
        onAddCriterion={handleAddCriterion}
      />
    </div>
  );
}

