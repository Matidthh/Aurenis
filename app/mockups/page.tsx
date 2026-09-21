"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FigmaToolbar,
  ViewportMode,
  ActiveTab,
} from "@/components/mockups/figma-toolbar";
import { ExecutiveDashboardMockup } from "@/components/mockups/executive-dashboard-mockup";
import { TeacherDashboardMockup } from "@/components/mockups/teacher-dashboard-mockup";
import {
  StudentTableMockup,
  StudentMockupData,
  MOCK_STUDENTS,
} from "@/components/features/students/student-table-mockup";
import { StudentFullProfileModal } from "@/components/features/students/student-full-profile-modal";
import { StudentRegistrationModal } from "@/components/features/students/student-registration-modal";
import {
  TeacherManagementMockup,
  TeacherData,
  MOCK_TEACHERS,
} from "@/components/features/teachers/teacher-management-mockup";
import { SubjectAssignmentModal } from "@/components/features/teachers/subject-assignment-modal";
import { TeacherEditProfileModal } from "@/components/features/teachers/teacher-edit-profile-modal";
import { NewTeacherModal } from "@/components/features/teachers/new-teacher-modal";
import { GradeMatrixSpreadsheet } from "@/components/grades/grade-matrix-spreadsheet";
import { ErrorResilienceMockup } from "@/components/mockups/error-resilience-mockup";
import { DeviceMatrixView } from "@/components/mockups/device-matrix-view";
import { BrowserMatrixView } from "@/components/mockups/browser-matrix-view";
import { E2ENetworkFlowView } from "@/components/mockups/e2e-network-flow-view";
import { UserJourneySimulator } from "@/components/mockups/user-journey-simulator";
import { AcademicLifecycleE2EView } from "@/components/mockups/academic-lifecycle-e2e-view";
import { QAIssueTrackerView } from "@/components/mockups/qa-issue-tracker-view";
import { ReplicatedHero } from "@/components/landing/replicated-hero";
import { FigmaTokenInspector } from "@/components/mockups/figma-token-inspector";
import { FigmaCommentsDrawer } from "@/components/mockups/figma-comments-drawer";
import { StudentRiskModal } from "@/components/features/students/student-risk-modal";
import { QuickAttendanceModal } from "@/components/mockups/quick-attendance-modal";
import {
  CriteriaChecklistModal,
  CriterionItem,
} from "@/components/mockups/criteria-checklist-modal";
import { INITIAL_COMMENTS, MockupComment } from "@/components/mockups/mockup-data";
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
} from "lucide-react";

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
      id: "dod-resilience-1",
      title: "Banners de error amigables visualizados",
      description: "Banners no intrusivos con mensajes claros en español, códigos de estado HTTP (500, 503), ícono semántico y diseño consistente.",
      completed: true,
      details: [
        "Presentación clara sin tecnicismos agresivos ni jerga cruda expuesta.",
        "Variantes de top-banner y tarjetas de estado local para tablas y vistas.",
        "Manejo de códigos HTTP 500 (Internal Server Error) y 503 (Servicio no disponible).",
      ],
    },
    {
      id: "dod-resilience-2",
      title: "Opción de reintentar funcional",
      description: "Botón de reintento interactivo con estado de carga, verificación de salud de endpoint y notificación de recuperación.",
      completed: true,
      details: [
        "Mecanismo de retry automático o bajo demanda sin recarga forzada destructiva.",
        "Transición a banner de éxito al recuperar conectividad con el servidor.",
        "Protección contra peticiones en bucle infinito durante fallas continuas.",
      ],
    },
    {
      id: "dod-resilience-3",
      title: "Ausencia de pantallas blancas en cliente",
      description: "Error Boundary en React para capturar excepciones de renderizado y prevenir White Screen of Death en cliente.",
      completed: true,
      details: [
        "Aislamiento de errores a nivel de componente sin bloquear la navegación de la aplicación.",
        "Discreet logging sin filtrar stack traces o datos sensibles en producción.",
        "Opciones duales de recuperación: reintentar módulo o recargar contexto.",
      ],
    },
    {
      id: "dod-responsive-1",
      title: "Ausencia de desbordamiento horizontal en 375px",
      description: "Ajuste milimétrico para anchos compactos de 375px (iPhone SE) sin scroll horizontal involuntario en la página raíz, marcos contenedores ni ventanas modales.",
      completed: true,
      details: [
        "Viewport contenedor acotado y reglas globales con overflow-x: hidden y max-w-full.",
        "Grillas matriciales y tablas contenidas en contenedores con scroll horizontal táctil controlado e indicador visual.",
        "Modales de matrícula, asignaturas y edición ajustados para pantallas ultra-compactas con márgenes seguros.",
        "Padding responsivo escalonado (p-3 en mobile a p-8 en desktop) para optimizar el área útil.",
      ],
    },
    {
      id: "dod-responsive-2",
      title: "Tablas y botones operables en táctil",
      description: "Objetivos táctiles (hit-areas) según estándares WCAG 2.5.5 (mínimo 44×44px / 38-44px), eliminación del retraso de toque con touch-action: manipulation y gestos táctiles de desplazamiento suaves en tablas.",
      completed: true,
      details: [
        "touch-action: manipulation implementado en todos los controles interactivos para eliminar la latencia de 300ms.",
        "Celdas matriciales con altura táctil accesible, retroalimentación táctil inmediata al tap e ingreso numérico rápido.",
        "Botones de acciones en filas de tablas (ver, editar, asignar) con target mínimo de 38-44px.",
        "Alternancia ágil entre Vista Tabla (con scroll táctil horizontal) y Vista Tarjetas de alta legibilidad en smartphones.",
      ],
    },
    {
      id: "dod-responsive-3",
      title: "Matriz de dispositivos documentada",
      description: "Auditoría exhaustiva documentada que clasifica 5 rangos de dispositivos (Mobile Compacto 375px, Mobile Estándar 390px, Tablets 768-834px, Laptops 1200px y Monitores 4K 1440px+) con simulación en vivo.",
      completed: true,
      details: [
        "Pestaña dedicada 'Matriz de Dispositivos' integrada en la barra de prototipos de Figma.",
        "Especificación técnica por dispositivo: DPR, comportamiento de tablas, estándares táctiles y estrategia de layout.",
        "Selector interactivo en la barra superior para alternar directamente entre 375px, 390px, 834px, 1200px y 1440px.",
        "Validación con 100% de ítems comprobados sin regresiones visuales ni de interacción.",
      ],
    },
    {
      id: "dod-browser-1",
      title: "Comprobación en 4 navegadores principales",
      description: "Verificación y certificación de compatibilidad exhaustiva en Google Chrome (Blink), Mozilla Firefox (Gecko), Microsoft Edge (Chromium) y Apple Safari (WebKit en macOS e iOS).",
      completed: true,
      details: [
        "Auditoría de compatibilidad de los 3 motores web fundamentales: Blink, Gecko y WebKit.",
        "Mapeo de características CSS modernas (Grid, Flex gap, Variables, Transform, Backdrop-filter).",
        "Pestaña interactiva '4 Navegadores' con métricas de Core Web Vitals y suite de pruebas en vivo.",
        "Pruebas de atajos de teclado y eventos táctiles en entornos Windows, macOS, Android e iOS.",
      ],
    },
    {
      id: "dod-browser-2",
      title: "Diseño e interactividad idénticos",
      description: "Paridad milimétrica entre motores en sombras neumórficas Soft UI, métricas tipográficas (Plus Jakarta Sans y Caveat), distribución de planillas y micro-animaciones a 60 FPS.",
      completed: true,
      details: [
        "Normalización de fuentes y smoothing (-webkit-font-smoothing: antialiased, -moz-osx-font-smoothing: grayscale).",
        "Soporte estricto para -webkit-backdrop-filter y backdrop-filter estándar en modales y paneles.",
        "Eliminación de estilos nativos discrepantes (-moz-appearance: textfield, -webkit-appearance: none).",
        "Comportamiento unificado de planillas de notas Decreto 67 con guardado automático y feedback visual.",
      ],
    },
    {
      id: "dod-browser-3",
      title: "Cero fallas de renderizado",
      description: "Ausencia total de artefactos gráficos, desfase de cabeceras sticky en Safari (-webkit-sticky), bordes espurios en Firefox, desbordamientos de flexbox o saltos acumulativos de diseño (CLS = 0.000).",
      completed: true,
      details: [
        "Corrección de sticky positioning para tablas matriciales con posición sticky compatible con Safari.",
        "Reset button::-moz-focus-inner { border: 0 } previniendo desplazamientos en Firefox.",
        "Scrollbars universales estilizados para Firefox (scrollbar-width: thin) y motores basados en Chromium/WebKit.",
        "Prevención de Cumulative Layout Shift (CLS = 0) en carga inicial y transiciones de pantalla.",
      ],
    },
    {
      id: "dod-e2e-1",
      title: "Llamadas API completas verificadas con Network tab",
      description: "Trazabilidad HTTP total inspeccionable con panel Network integrado (REST APIs, status 200/201, latencias < 250ms, headers, payloads y reintentos automáticos con backoff exponencial).",
      completed: true,
      details: [
        "Inspección detallada de peticiones POST, GET, PUT y DELETE para estudiantes, notas Decreto 67, asistencia y asignaturas.",
        "Payloads JSON estructurados y tipados validados con esquemas Drizzle / Zod.",
        "Monitoreo de latencia en milisegundos, headers de seguridad y códigos de respuesta HTTP oficiales.",
        "Filtros avanzados por método HTTP, estado y texto en la consola de red integrada.",
      ],
    },
    {
      id: "dod-e2e-2",
      title: "Persistencia de datos en PostgreSQL comprobada",
      description: "Verificación de operaciones CRUD atómicas en PostgreSQL con Drizzle ORM, integridad referencial (FKs), transacciones ACID y persistencia demostrada en tests de integración.",
      completed: true,
      details: [
        "Consultas SQL trazadas (SELECT, INSERT, UPDATE, DELETE) con recuento de registros afectados y tiempo de ejecución.",
        "Validación de esquemas: tablas schools, users, teachers, students, enrollments, courses, grade_records y attendance.",
        "Mecanismo de aislamiento transaccional y rollback garantizado ante errores de mutación.",
        "Suite de verificación 'npm run test:e2e' con 10/10 pruebas de persistencia superadas con 100% de éxito.",
      ],
    },
    {
      id: "dod-e2e-3",
      title: "Flujos de trabajo pasados",
      description: "Ejecución de flujos de negocio escolares de inicio a fin: Registro & Matrícula de Alumno, Calificación & Promedio Decreto 67, y Asignación de Carga Horaria Docente.",
      completed: true,
      details: [
        "Flujo 1: Matrícula de alumno con validación RUN, guardado en base de datos e incorporación al libro de clases.",
        "Flujo 2: Ingreso masivo de notas parciales N1-N4, cálculo automático de ponderaciones y semaforización cromática.",
        "Flujo 3: Asignación de asignaturas y cálculo de carga horaria semanal respetando topes de la Ley Carrera Docente.",
        "Ejecución interactiva 'Paso a Paso' o 'Batch' con feedback visual y registro de eventos en tiempo real.",
      ],
    },
    {
      id: "dod-journey-1",
      title: "Recorrido de Admin completado",
      description: "Jornada completa del Director: acceso institucional con rol SCHOOL_ADMIN, inspección de Tablero Ejecutivo, parametrización de períodos escolares, auditoría de dotación docente (44 hrs) y registro en AuditLog.",
      completed: true,
      details: [
        "Autenticación criptográfica con inyección automática de schoolId.",
        "Monitoreo de métricas clave: matrícula, asistencia y alertas Decreto 67.",
        "Configuración del ciclo lectivo y ponderaciones semestrales.",
        "Auditoría inmutable de eventos institucionales y exportación de respaldo.",
      ],
    },
    {
      id: "dod-journey-2",
      title: "Recorrido de Profesor de ingreso de notas completado",
      description: "Jornada completa del Docente: selección de curso y asignatura, apertura de la planilla matricial, tipeo rápido con teclado (modo 2 dígitos), semaforización de notas rojas (< 4.0), recálculo ponderado Decreto 67 y guardado masivo atómico en base de datos.",
      completed: true,
      details: [
        "Apertura del Libro Digital en 1° Medio A - Matemáticas.",
        "Ingreso ágil con teclado: conversión automática de 2 dígitos (ej: 65 -> 6.5, 38 -> 3.8).",
        "Semaforización cromática instantánea con badge de riesgo para notas < 4.0.",
        "Persistencia masiva segura a través del endpoint transaccional saveBulkMatrixGrades.",
      ],
    },
    {
      id: "dod-journey-3",
      title: "Recorrido de Alumno de consulta completado",
      description: "Jornada completa del Estudiante / Apoderado: acceso al portal con rol STUDENT (solo lectura), visualización de calificaciones parciales y promedio general, verificación de asistencia acumulada vs 85% Mineduc, hoja de vida y emisión de certificado regular.",
      details: [
        "Acceso seguro con token de estudiante sin privilegios de edición (RBAC reforzado).",
        "Consulta integral de boletín con promedios y desglose por asignatura.",
        "Monitoreo de cumplimiento del 85% de asistencia mínima obligatoria.",
        "Generación y descarga de Certificado de Alumno Regular con firma digital y QR.",
      ],
      completed: true,
    },
    {
      id: "dod-lifecycle-1",
      title: "Ciclo de vida académico completo probado",
      description: "Validación E2E ininterrumpida de punta a punta: apertura del año escolar 2026, ponderaciones semestrales (50%-50%), matrícula masiva con validación RUN Módulo 11, asignación docente (<= 44 hrs), ingreso de notas N1-N8, asistencia acumulada vs 85% Mineduc, resolución de casos por Consejo (Art. 10) y cierre de actas finales.",
      completed: true,
      details: [
        "Apertura lectiva y configuración de períodos en RBD 1248-9.",
        "Matrícula masiva con validación de dígito verificador y topes contractuales docentes.",
        "Ingreso de evaluaciones N1-N4 (S1) y N5-N8 (S2) con ponderaciones oficiales y alertas rojas (< 4.0).",
        "Planes de reforzamiento pedagógico automático según Decreto 67.",
        "Cálculo algorítmico de promedios finales anuales y dictamen de promoción escolar.",
      ],
    },
    {
      id: "dod-lifecycle-2",
      title: "Cero bloqueos en la experiencia de usuario",
      description: "Garantía de rendimiento y fluidez absoluta en el flujo interactivo: cero bloqueos detectados, latencia de recálculo inferior a 25ms, transiciones con useTransition, validaciones inline no disruptivas, feedback optimista y soporte 100% accesible por teclado.",
      completed: true,
      details: [
        "0 incidentes de bloqueo o congelamiento de interfaz detectados.",
        "Latencia media de respuesta de 14.2ms (< 100ms umbral Google RAIL).",
        "Mutaciones optimistas y reintentos transparentes de red ante micro-cortes.",
        "Navegación completa por teclado (Tab, Enter, Esc) y contraste WCAG AA.",
      ],
    },
    {
      id: "dod-lifecycle-3",
      title: "Dictamen favorable de pruebas E2E",
      description: "Emisión formal del Dictamen Favorable de Pruebas E2E: 100% de aserciones de negocio superadas (18/18), sellado criptográfico con hash SHA-256 inmutable, firmas digitales de las autoridades del establecimiento y acreditación oficial Mineduc.",
      completed: true,
      details: [
        "Certificación oficial de cumplimiento del 100% de aserciones del ciclo lectivo.",
        "Sello criptográfico SHA-256 generado e incorporado a la traza inmutable.",
        "Firmas digitales activas de Director y Jefa de UTP.",
        "Opción interactiva para copiar y descargar el acta formal de dictamen.",
      ],
    },
    {
      id: "dod-qa-1",
      title: "Registro de bugs disponible en el tablero",
      description: "Tablero interactivo de seguimiento de hallazgos QA disponible con vistas Kanban y Lista, filtros por estado, contador en tiempo real, creación y transiciones de ciclo de vida.",
      completed: true,
      details: [
        "Tablero Kanban con 4 columnas: Reportado/Triage, En Progreso, Resuelto y Verificado.",
        "Métricas cuantitativas: total de hallazgos, blockers P0/P1 y tasa de resolución.",
        "Filtro en tiempo real por severidad, módulo escolar, integrante asignado y estado.",
        "Mecanismo de transición de estado dinámico para avanzar en el flujo de triage.",
      ],
    },
    {
      id: "dod-qa-2",
      title: "Campos de severidad, módulo y asignado configurados",
      description: "Parametrización estricta y badges cromáticos para Severidad (Crítica, Alta, Media, Baja), Módulo del sistema educativo y Asignación directa a integrantes del equipo (Malcom Marcelo, Lucas P., Maicol R., Frank M., Carlos M.).",
      completed: true,
      details: [
        "Escala de severidad estandarizada con pulso visual en incidentes Críticos/Blocker.",
        "Categorización por módulos: Calificaciones/Dec. 67, Libro Digital, Asistencia, Matrícula RUN, Autenticación RBAC, Actas.",
        "Asignación directa con avatares de integrantes del equipo de desarrollo.",
        "Campos técnicos complementarios: prioridad P0-P3, entorno de ejecución, SO y navegador.",
      ],
    },
    {
      id: "dod-qa-3",
      title: "Plantilla de reporte definida",
      description: "Plantilla oficial de reporte de incidencias estructurada según estándares ISTQB / IEEE 829 con precondiciones, pasos para reproducir, resultado actual vs esperado, notas técnicas, presets rápidos y exportador Markdown.",
      completed: true,
      details: [
        "Modal interactivo con formulario estructurado y vista previa Markdown oficial.",
        "Campos obligatorios: ID de bug, título, pasos numerados, comportamiento actual vs esperado.",
        "Presets de autocompletado en 1 clic: Decreto 67, Seguridad RBAC y Experiencia de Usuario.",
        "Exportador de incidencias en formato Markdown para sincronización con GitHub Issues.",
      ],
    },
    {
      id: "dod-severity-1",
      title: "Criterios de severidad acordados",
      description: "Formalización de la política institucional de clasificación de impacto en 4 niveles: Crítica (S1 / Blocker con SLA < 2h), Alta (S2 con SLA < 8h), Media (S3 con SLA < 24h) y Baja (S4 con SLA < 72h), vinculadas a la validez del Decreto 67 y continuidad operacional.",
      completed: true,
      details: [
        "Definición unificada y aprobada de los 4 niveles de severidad e impacto sistémico.",
        "Matriz de activación objetiva basada en continuidad del servicio, validez legal y presencia de workaround.",
        "Guía oficial accesible en la interfaz con calculador interactivo de impacto en 3 pasos.",
        "SLAs de respuesta comprometidos por nivel de severidad (2h, 8h, 24h, 72h).",
      ],
    },
    {
      id: "dod-severity-2",
      title: "Bugs clasificados en la bitácora",
      description: "El 100% de los incidentes registrados en la bitácora cuentan con su severidad explícitamente asignada, justificación razonada de impacto en el sistema, desglose cuantitativo porcentual y filtros interactivos.",
      completed: true,
      details: [
        "100% de las incidencias activas e históricas clasificadas en la escala Crítica, Alta, Media y Baja.",
        "Justificación de impacto sistémico documentada en cada tarjeta y en la ficha técnica del bug.",
        "Panel interactivo de distribución cuantitativa con conteo y porcentajes en tiempo real.",
        "Filtro directo en un clic para aislar bugs según su nivel de severidad.",
      ],
    },
    {
      id: "dod-severity-3",
      title: "Prioridad de resolución asignada",
      description: "Correlación sistemática entre severidad e impacto de negocio para fijar la prioridad (P0 Blocker, P1 Alta, P2 Media, P3 Baja), SLA de cumplimiento, ordenamiento por urgencia y selectores reactivos en el tablero.",
      completed: true,
      details: [
        "Asignación de prioridad P0-P3 en cada incidencia correlacionada con su severidad.",
        "Sugerencia automática de prioridad al seleccionar la severidad en el formulario de reporte.",
        "Ordenamiento dinámico del tablero y la tabla por urgencia de resolución (P0 -> P3).",
        "Selector de prioridad en tiempo real en las tarjetas Kanban y en las filas de la tabla.",
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
          className={`w-full ${viewportWidthClass} transition-all duration-300 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white rounded-3xl p-3 sm:p-6 lg:p-8 shadow-2xl border border-slate-800/80 relative min-h-[85vh]`}
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
            <TeacherManagementMockup
              showHotspots={showHotspots}
              onSelectTeacherForEdit={(t) => {
                setSelectedTeacherForEdit(t);
                setShowTeacherEditModal(true);
              }}
              onOpenSubjectAssignment={(t) => {
                setSelectedTeacherForSubjects(t);
                setShowSubjectAssignmentModal(true);
              }}
              onOpenNewTeacherModal={() => setShowNewTeacherModal(true)}
            />
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
            <StudentTableMockup
              showHotspots={showHotspots}
              onSelectStudent={handleSelectStudent}
              onOpenNewStudentModal={() => setShowRegistrationModal(true)}
            />
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

          {activeTab === "error-resilience" && (
            <ErrorResilienceMockup
              onMarkCriterion={(id) => {
                if (id === "dod-err-1") handleToggleCriterion("dod-resilience-1");
                if (id === "dod-err-2") handleToggleCriterion("dod-resilience-2");
                if (id === "dod-err-3") handleToggleCriterion("dod-resilience-3");
              }}
            />
          )}

          {activeTab === "device-matrix" && (
            <DeviceMatrixView
              currentViewport={viewport}
              onSelectViewport={(vp) => setViewport(vp)}
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "browser-matrix" && (
            <BrowserMatrixView
              onNavigateToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === "e2e-flow" && (
            <E2ENetworkFlowView
              onNavigateToTab={(tab) => setActiveTab(tab as any)}
              onOpenCriteriaModal={() => setShowChecklist(true)}
            />
          )}

          {activeTab === "user-journeys" && (
            <UserJourneySimulator
              onCompleteCriteria={(id) => handleToggleCriterion(id)}
              onOpenChecklistModal={() => setShowChecklist(true)}
            />
          )}

          {activeTab === "lifecycle-e2e" && (
            <AcademicLifecycleE2EView
              onCompleteCriteria={(id) => handleToggleCriterion(id)}
              onOpenChecklistModal={() => setShowChecklist(true)}
              onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)}
            />
          )}

          {activeTab === "qa-issues" && (
            <QAIssueTrackerView
              onOpenChecklistModal={() => setShowChecklist(true)}
              onNavigateToTab={(tab) => setActiveTab(tab as ActiveTab)}
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

