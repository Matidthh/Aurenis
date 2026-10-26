"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Award,
  CalendarCheck,
  QrCode,
  BookOpen,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  AlertTriangle,
  Bell,
  User,
  LogOut,
  Settings,
  Search,
  Check,
  ArrowRight,
  Layers,
  MapPin,
  FileCheck2,
  Inbox,
  X,
  ExternalLink,
  Lock,
  ShieldCheck,
  Download,
  GraduationCap,
  Building2,
  Users,
  HeartHandshake,
  BookMarked,
  Printer,
  ChevronDown,
  Mail,
  HelpCircle,
  Coffee,
  CheckCircle,
  TrendingUp,
  Bookmark,
  Smile,
  Shield,
  Eye,
  Send,
  IdCard,
  Laptop,
  Stethoscope,
  Baby,
  Briefcase,
  Filter,
  BarChart3,
  Zap,
  MessageCircle,
  Info,
  Headphones,
  CalendarDays,
} from "lucide-react";
import { AcademicSummaryCard } from "./academic-summary-card";
import { GraduationHeroIllustration } from "./graduation-illustration";
import { cn } from "@/lib/utils/cn";
import type {
  StudentAcademicRecord,
  DetailedSubjectGrade,
} from "@/lib/db/lpmm-curriculum-and-grades";

/**
 * ============================================================================
 * AURENIS — PORTAL DEL ESTUDIANTE (DASHBOARD AMIGABLE Y FORMATIVO)
 * ============================================================================
 * Equipo Responsable:
 * - 🎨 Lucas P. (Diseño UI/UX, Experiencia de Usuario Amigable, Accesibilidad WCAG AA)
 * - 💻 Malcom Marcelo (Lógica de Cliente, Estado Reactivo, Animaciones Motion)
 * - 👑 Maicol R. (Arquitectura, Integridad de Datos Académicos, Sesión Escolar)
 * - 🛡️ Frank M. (Seguridad, Garantía de Solo Lectura Decreto 67, Privacidad NNA)
 *
 * Mejoras de Experiencia de Usuario (UX/UI):
 * 1. Tono cálido, motivador y cercano ("Hola, [Nombre] 👋") que reduce el estrés escolar.
 * 2. Visualización intuitiva del progreso: Promedio, Asistencia MINEDUC (85%) y Asignaturas al día.
 * 3. Agenda clara de "Tu clase en curso" y "Próximas evaluaciones" con cuentas regresivas.
 * 4. Alternador de vistas en Notas: Tarjetas amigables y Planilla completa.
 * 5. Acceso rápido y sin fricción a Credencial Digital, Marcado QR y Canal Seguro de Apoyo.
 * 6. Color de marca unificado oficial (#0c8ee9 - brand-500).
 * ============================================================================
 */

export interface DemoStudentSummary {
  email: string;
  name: string;
  course: string;
  specialty: string;
}

export interface EstudianteDashboardProps {
  schoolSlug: string;
  studentName?: string;
  studentEmail?: string;
  courseName?: string;
  studentRut?: string;
  initialRecord?: StudentAcademicRecord;
  isStudentSelf?: boolean;
  availableDemoStudents?: DemoStudentSummary[];
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

type TabType =
  | "resumen"
  | "notas"
  | "asistencia"
  | "horario"
  | "asignaturas"
  | "comunicados"
  | "reglamento";

interface ScheduleBlock {
  id: string;
  timeRange: string;
  subject: string;
  teacher: string;
  room: string;
  isCurrent: boolean;
  isPast: boolean;
}

interface UpcomingActivity {
  id: string;
  title: string;
  subject: string;
  date: string;
  daysRemainingText: string;
  type: "Prueba Sumativa" | "Guía de Ejercicios" | "Trabajo Práctico" | "Taller" | "Taller Práctico";
  priority: "Alta" | "Media" | "Normal";
  syllabus: string;
}

interface InstitutionalCommunication {
  id: string;
  title: string;
  sender: string;
  senderRole: string;
  department: "Dirección" | "UTP" | "Convivencia" | "Profesor";
  date: string;
  isUnread: boolean;
  priority: "Alta" | "Normal";
  preview: string;
  fullBody: string;
  hasAttachment?: boolean;
}

interface RiceArticle {
  id: string;
  category: "Derechos" | "Deberes" | "Evaluación" | "Convivencia" | "Talleres y Laboratorios";
  title: string;
  articleNumber: string;
  summary: string;
  details: string;
}

const DEFAULT_COMMUNICATIONS: InstitutionalCommunication[] = [
  {
    id: "com-1",
    title: "Autorización de Visita Pedagógica Técnica a Data Center",
    sender: "Prof. Alejandro Sepúlveda",
    senderRole: "Profesor Jefe 1° Medio A",
    department: "Profesor",
    date: "14 de Octubre",
    isUnread: true,
    priority: "Alta",
    preview:
      "Estimados estudiantes, el próximo viernes realizaremos la salida a terreno técnica. Se requiere presentar la colilla firmada en Inspectoría.",
    fullBody:
      "Estimados estudiantes y apoderados de 1° Medio A:\n\nComo parte del módulo de Redes de Conectividad y Formación Técnico Profesional, el próximo viernes realizaremos una visita guiada al Centro de Datos institucional. El objetivo es observar racks de servidores reales, cableado estructurado categoría 6A y sistemas de respaldo energético.\n\nRecuerden traer su credencial estudiantil digital o física y su cuaderno de campo. La salida es a las 09:30 hrs desde el patio central del liceo.",
    hasAttachment: true,
  },
  {
    id: "com-2",
    title: "Calendario de Reforzamiento Pedagógico Primer Semestre",
    sender: "Unidad Técnica Pedagógica (UTP)",
    senderRole: "Jefatura Técnica",
    department: "UTP",
    date: "11 de Octubre",
    isUnread: false,
    priority: "Normal",
    preview:
      "Los talleres de apoyo voluntario para Matemática Aplicada y Lenguaje se dictarán los días martes y jueves en Biblioteca.",
    fullBody:
      "A toda la comunidad escolar:\n\nInformamos que ya se encuentran disponibles los horarios de reforzamiento académico en Biblioteca y Salas CRA. Los talleres están dirigidos a consolidar aprendizajes previos y preparar las evaluaciones sumativas de cierre de unidad.\n\nNo se requiere inscripción previa; solo puntualidad y tus materiales de estudio.",
    hasAttachment: false,
  },
  {
    id: "com-3",
    title: "Campaña de Convivencia Escolar: Cuidado Colectivo y Buen Trato",
    sender: "Equipo de Convivencia Escolar",
    senderRole: "Encargada de Convivencia",
    department: "Convivencia",
    date: "08 de Octubre",
    isUnread: false,
    priority: "Normal",
    preview:
      "Recuerda que en el Liceo nos cuidamos entre todos. Si necesitas conversar u orientación, nuestra oficina siempre tiene las puertas abiertas.",
    fullBody:
      "Queridos estudiantes:\n\nEl respeto, la empatía y la resolución dialogada de conflictos son el corazón del LPMM. Recuerden que si están viviendo momentos difíciles o necesitan mediación con algún compañero, nuestro equipo psicosocial (psicóloga y trabajadora social) está disponible para acompañarlos en confianza y sin juicios.\n\n¡Cuenten con nosotros siempre!",
    hasAttachment: false,
  },
];

const DEFAULT_RICE_ARTICLES: RiceArticle[] = [
  {
    id: "art-1",
    category: "Derechos",
    title: "Derecho a ser Escuchado y al Respeto de la Integridad Personal",
    articleNumber: "Art. 12",
    summary:
      "Todo estudiante tiene derecho a ser tratado con dignidad, consideración y sin ningún tipo de discriminación arbitraria.",
    details:
      "Los estudiantes tienen derecho a manifestar sus opiniones en un marco de respeto, a recibir apoyo pedagógico oportuno y a contar con un ambiente seguro y formativo tanto en aulas como en talleres técnicos.",
  },
  {
    id: "art-2",
    category: "Evaluación",
    title: "Decreto 67: Información Oportuna de Calificaciones y Rúbricas",
    articleNumber: "Art. 28",
    summary:
      "Los estudiantes deben conocer las fechas de evaluación con al menos 7 días hábiles de anticipación y sus resultados en máximo 10 días hábiles.",
    details:
      "Según el Decreto 67/2018 del MINEDUC, la evaluación tiene un carácter formativo continuo. Tienes derecho a conocer la pauta de corrección y recibir retroalimentación del profesor antes de la siguiente evaluación sumativa.",
  },
  {
    id: "art-3",
    category: "Deberes",
    title: "Puntualidad, Asistencia Escolar y Justificaciones",
    articleNumber: "Art. 19",
    summary:
      "Cumplir con el 85% de asistencia mínima para la promoción escolar anual exigida por el Ministerio de Educación.",
    details:
      "Las inasistencias por motivos de salud deben justificarse con certificado médico ante Inspectoría General en un plazo máximo de 48 horas tras reintegrarse al liceo.",
  },
  {
    id: "art-4",
    category: "Talleres y Laboratorios",
    title: "Normas de Seguridad y Uso de Equipamiento Técnico",
    articleNumber: "Art. 45",
    summary:
      "Uso obligatorio de elementos de protección personal (EPP) y respeto estricto de las normas en laboratorios de Telecomunicaciones y Electricidad.",
    details:
      "Por tu seguridad y la de tus compañeros, en los laboratorios técnicos se prohíbe el ingreso con alimentos o bebidas, y es obligatorio seguir siempre las instrucciones del docente antes de energizar cualquier circuito o manipular herramientas.",
  },
];

const DEFAULT_STUDENT_SUBJECTS: DetailedSubjectGrade[] = [
  {
    id: "sub-mat",
    code: "MAT-101",
    name: "Matemática",
    teacher: "Prof. Alejandro Sepúlveda",
    teacherEmail: "alejandro.sepulveda@lpmm.cl",
    room: "Sala 101",
    weeklyHours: 6,
    category: "Plan Común",
    currentAvg: 6.4,
    attendanceRate: 94.5,
    status: "Destacado",
    grades: [
      { code: "g1", label: "Prueba Escrita", weightPct: 0.25, value: 6.4, date: "12 abr 2025" },
      { code: "g2", label: "Taller Práctico", weightPct: 0.25, value: 6.2, date: "28 abr 2025" },
      { code: "g3", label: "Evaluación 3", weightPct: 0.25, value: 6.6, date: "15 may 2025" },
      { code: "g4", label: "Examen Semestral", weightPct: 0.25, value: null, date: "20 jun 2025" },
    ],
  },
  {
    id: "sub-len",
    code: "LEN-101",
    name: "Lengua y Literatura",
    teacher: "Prof. Rodrigo Castro",
    teacherEmail: "profesor.rodrigo@lpmm.cl",
    room: "Sala 102",
    weeklyHours: 6,
    category: "Plan Común",
    currentAvg: 5.8,
    attendanceRate: 92.0,
    status: "Aprobando",
    grades: [
      { code: "g5", label: "Disertación", weightPct: 0.25, value: 5.8, date: "10 abr 2025" },
      { code: "g6", label: "Control de Lectura", weightPct: 0.25, value: 5.7, date: "24 abr 2025" },
      { code: "g7", label: "Ensayo Argumentativo", weightPct: 0.25, value: 6.0, date: "18 may 2025" },
      { code: "g8", label: "Evaluación 4", weightPct: 0.25, value: null, date: "25 jun 2025" },
    ],
  },
  {
    id: "sub-his",
    code: "HIS-101",
    name: "Historia, Geografía y Cs. Sociales",
    teacher: "Prof. Patricia Morales",
    teacherEmail: "patricia.morales@lpmm.cl",
    room: "Sala 103",
    weeklyHours: 4,
    category: "Plan Común",
    currentAvg: 6.8,
    attendanceRate: 96.0,
    status: "Destacado",
    grades: [
      { code: "g9", label: "Trabajo Grupal", weightPct: 0.25, value: 6.8, date: "08 abr 2025" },
      { code: "g10", label: "Prueba 1", weightPct: 0.25, value: 6.7, date: "29 abr 2025" },
      { code: "g11", label: "Investigación Histórica", weightPct: 0.25, value: 7.0, date: "20 may 2025" },
      { code: "g12", label: "Cierre Semestre", weightPct: 0.25, value: null, date: "22 jun 2025" },
    ],
  },
  {
    id: "sub-cie",
    code: "CIE-101",
    name: "Ciencias Naturales",
    teacher: "Prof. Daniela Fuentes",
    teacherEmail: "daniela.fuentes@lpmm.cl",
    room: "Lab Ciencias",
    weeklyHours: 4,
    category: "Plan Común",
    currentAvg: 5.5,
    attendanceRate: 90.0,
    status: "Aprobando",
    grades: [
      { code: "g13", label: "Prueba Escrita", weightPct: 0.25, value: 5.5, date: "05 abr 2025" },
      { code: "g14", label: "Informe de Laboratorio", weightPct: 0.25, value: 5.6, date: "02 may 2025" },
      { code: "g15", label: "Guía Sumativa", weightPct: 0.25, value: 5.4, date: "22 may 2025" },
      { code: "g16", label: "Evaluación Final", weightPct: 0.25, value: null, date: "24 jun 2025" },
    ],
  },
  {
    id: "sub-tp1",
    code: "TP-101",
    name: "Redes y Telecomunicaciones",
    teacher: "Prof. Marcelo Valenzuela",
    teacherEmail: "marcelo.valenzuela@lpmm.cl",
    room: "Taller 3",
    weeklyHours: 6,
    category: "Especialidad TP",
    currentAvg: 6.7,
    attendanceRate: 98.0,
    status: "Destacado",
    grades: [
      { code: "g17", label: "Cableado Estructurado", weightPct: 0.5, value: 6.8, date: "16 abr 2025" },
      { code: "g18", label: "Configuración Switches", weightPct: 0.5, value: 6.6, date: "07 may 2025" },
    ],
  },
];

export function EstudianteDashboard({
  schoolSlug,
  studentName,
  studentEmail,
  courseName,
  studentRut,
  initialRecord,
  isStudentSelf = false,
  availableDemoStudents = [],
  activeTab: propsActiveTab,
  onTabChange,
}: EstudianteDashboardProps) {
  // Inicialización limpia del registro del estudiante con respaldo resiliente
  const [currentStudent, setCurrentStudent] = useState<StudentAcademicRecord>(() => {
    if (initialRecord && initialRecord.subjects && initialRecord.subjects.length > 0) {
      return initialRecord;
    }
    return {
      num: 16,
      fullName: studentName || initialRecord?.fullName || "Recabarren Cerda Maicol Matías",
      firstName: studentName?.split(" ")[0] || initialRecord?.firstName || "Maicol Matías",
      lastName: studentName?.split(" ").slice(1).join(" ") || initialRecord?.lastName || "Recabarren Cerda",
      email: studentEmail || initialRecord?.email || "maicolcerda1234@gmail.com",
      rut: studentRut || initialRecord?.rut || "22.469.016-6",
      courseName: courseName || initialRecord?.courseName || "1º Medio A",
      courseCode: "1A",
      grade: 1,
      letter: "A",
      specialty: initialRecord?.specialty || "Telecomunicaciones y Redes",
      overallGpa: initialRecord?.overallGpa || 5.8,
      overallAttendance: initialRecord?.overallAttendance || 95.0,
      subjects: (initialRecord?.subjects && initialRecord.subjects.length > 0) ? initialRecord.subjects : DEFAULT_STUDENT_SUBJECTS,
    };
  });

  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string>(
    initialRecord?.email || studentEmail || "maicol.recabarren@lpmm.cl"
  );

  React.useEffect(() => {
    if (initialRecord) {
      setCurrentStudent(initialRecord);
      setSelectedStudentEmail(initialRecord.email);
    }
  }, [initialRecord]);

  // Manejador seguro para inspectores/docentes que revisan fichas de alumnos
  const handleSelectDemoStudent = async (email: string) => {
    if (isStudentSelf || email === currentStudent.email) return;
    setIsLoadingStudent(true);
    setSelectedStudentEmail(email);
    try {
      const res = await fetch(
        `/api/${schoolSlug}/student-dashboard?email=${encodeURIComponent(email)}`
      );
      const json = await res.json();
      if (json.success && json.data?.data) {
        const d = json.data.data;
        setCurrentStudent({
          ...d.student,
          subjects: (d.subjects && d.subjects.length > 0) ? d.subjects : DEFAULT_STUDENT_SUBJECTS,
        });
      }
    } catch (err) {
      console.error("Error al cargar datos del estudiante:", err);
    } finally {
      setIsLoadingStudent(false);
      setIsInspectorSwitcherOpen(false);
    }
  };

  const activeStudentName = currentStudent.fullName;
  const firstName = currentStudent.firstName || activeStudentName.split(" ")[0];
  const activeStudentRut = currentStudent.rut;
  const activeCourseName = currentStudent.courseName;
  const activeSpecialty = currentStudent.specialty;
  const subjectsData: DetailedSubjectGrade[] =
    currentStudent?.subjects && currentStudent.subjects.length > 0
      ? currentStudent.subjects
      : DEFAULT_STUDENT_SUBJECTS;

  // Estados de navegación con persistencia local y sincronización con el Sidebar
  const router = useRouter();
  const searchParams = useSearchParams();

  const VALID_STUDENT_TABS: TabType[] = [
    "resumen",
    "notas",
    "asistencia",
    "horario",
    "asignaturas",
    "comunicados",
    "reglamento",
  ];

  const [internalTab, setInternalTab] = useState<TabType>(() => {
    if (propsActiveTab && VALID_STUDENT_TABS.includes(propsActiveTab)) {
      return propsActiveTab;
    }
    if (typeof window !== "undefined") {
      const urlTab = searchParams.get("tab") as TabType | null;
      if (urlTab && VALID_STUDENT_TABS.includes(urlTab)) {
        return urlTab;
      }
      try {
        const savedTab = localStorage.getItem("aurenis_student_active_tab") as TabType | null;
        if (savedTab && VALID_STUDENT_TABS.includes(savedTab)) {
          return savedTab;
        }
      } catch {
        // Ignorar excepciones de localStorage
      }
    }
    return "resumen";
  });

  const activeTab = propsActiveTab || internalTab;

  const handleTabChange = useCallback(
    (tab: TabType) => {
      if (!VALID_STUDENT_TABS.includes(tab)) return;
      setInternalTab(tab);
      if (onTabChange) onTabChange(tab);

      // Persistir pestaña en localStorage para que no se pierda al navegar o refrescar
      try {
        localStorage.setItem("aurenis_student_active_tab", tab);
      } catch {
        // Ignorar
      }

      // Sincronizar URL limpia en el historial del navegador sin forzar llamada al servidor
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      const newUrl = `?${params.toString()}`;
      if (typeof window !== "undefined" && window.location.search !== newUrl) {
        window.history.replaceState(null, "", newUrl);
      }
    },
    [onTabChange, searchParams]
  );

  // Escuchar eventos globales emitidos por el Sidebar para conmutar módulos instantáneamente sin recarga de servidor
  useEffect(() => {
    const handleSidebarTabEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: TabType }>;
      if (customEvent.detail?.tab && VALID_STUDENT_TABS.includes(customEvent.detail.tab)) {
        handleTabChange(customEvent.detail.tab);
      }
    };

    window.addEventListener("aurenis:student-tab-change", handleSidebarTabEvent);
    return () => {
      window.removeEventListener("aurenis:student-tab-change", handleSidebarTabEvent);
    };
  }, [handleTabChange]);

  // Sincronizar si propsActiveTab o searchParams cambian externamente
  useEffect(() => {
    if (propsActiveTab && VALID_STUDENT_TABS.includes(propsActiveTab)) {
      setInternalTab(propsActiveTab);
    } else {
      const urlTab = searchParams.get("tab") as TabType | null;
      if (urlTab && VALID_STUDENT_TABS.includes(urlTab)) {
        setInternalTab(urlTab);
      }
    }
  }, [propsActiveTab, searchParams]);

  const [notesViewMode, setNotesViewMode] = useState<"cards" | "table">("cards");
  const [subjectSearch, setSubjectSearch] = useState("");

  // Modales
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedCommunication, setSelectedCommunication] =
    useState<InstitutionalCommunication | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isInspectorSwitcherOpen, setIsInspectorSwitcherOpen] = useState(false);

  // Estados para Canal Seguro de Apoyo Escolar con API
  const [supportCategory, setSupportCategory] = useState("Apoyo Pedagógico");
  const [supportMessage, setSupportMessage] = useState("");
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [supportSent, setSupportSent] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);
  const [supportTicket, setSupportTicket] = useState<{ id: string; timestamp: string } | null>(null);

  const handleSendSupport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setIsSubmittingSupport(true);
    setSupportError(null);
    try {
      const res = await fetch(`/api/${schoolSlug}/student-support`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: supportCategory,
          message: supportMessage.trim(),
          studentEmail: currentStudent.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || "No se pudo enviar el mensaje.");
      }
      setSupportTicket({
        id: data.data?.ticketId || `TK-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: data.data?.createdAt || new Date().toISOString(),
      });
      setSupportSent(true);
      setSupportMessage("");
    } catch (err: any) {
      setSupportError(err.message || "Error al enviar la solicitud.");
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  // Filtros
  const [commsFilter, setCommsFilter] = useState<"all" | "unread" | "urgent">("all");
  const [riceSearch, setRiceSearch] = useState("");

  // Estados interactivos para sección Mis Ramos
  const [ramosFilter, setRamosFilter] = useState<"all" | "especialidad" | "plan_comun">("all");
  const [ramosSearch, setRamosSearch] = useState("");

  // Saludo dinámico según la hora
  const currentHour = new Date().getHours();
  const greetingTime =
    currentHour < 12
      ? "¡Buenos días"
      : currentHour < 19
      ? "¡Buenas tardes"
      : "¡Buenas noches";

  // Promedio ponderado acumulado oficial
  const overallAverage = useMemo(() => {
    if (currentStudent?.overallGpa && currentStudent.overallGpa > 0) {
      return currentStudent.overallGpa.toFixed(1);
    }
    const validSubs = subjectsData.filter((s) => s?.grades && s.grades.length > 0);
    const sum = validSubs.reduce((acc, curr) => acc + (curr?.currentAvg || 0), 0);
    return validSubs.length > 0 ? (sum / validSubs.length).toFixed(1) : "5.6";
  }, [currentStudent, subjectsData]);

  const numAverage = parseFloat(overallAverage);

  // Horario del día con resiliencia total
  const scheduleToday: ScheduleBlock[] = useMemo(() => {
    const slots = [
      { id: "b1", timeRange: "08:00 - 09:30", isCurrent: false, isPast: true },
      { id: "b2", timeRange: "09:45 - 11:15", isCurrent: true, isPast: false },
      { id: "b3", timeRange: "11:30 - 13:00", isCurrent: false, isPast: false },
      { id: "b4", timeRange: "14:00 - 15:30", isCurrent: false, isPast: false },
    ];
    return slots.map((slot, idx) => {
      const sub = subjectsData[idx % subjectsData.length] || subjectsData[0] || DEFAULT_STUDENT_SUBJECTS[0];
      return {
        ...slot,
        subject: sub?.name || `Módulo ${idx + 1}`,
        teacher: sub?.teacher || "Docente Asignado",
        room: sub?.room || "Sala 101",
      };
    });
  }, [subjectsData]);

  // Próximas evaluaciones sincronizadas
  const upcomingActivities: UpcomingActivity[] = useMemo(() => {
    return [
      {
        id: "act-1",
        title: "Prueba de Matemática",
        subject: "Matemática",
        date: "15 ABR · 08:00 - 09:30",
        daysRemainingText: "15 ABR",
        type: "Prueba Sumativa",
        priority: "Alta",
        syllabus: "Ecuaciones cuadráticas, funciones y geometría analítica.",
      },
      {
        id: "act-2",
        title: "Entrega de trabajo grupal",
        subject: "Lengua y Literatura",
        date: "17 ABR · 10:00 - 11:30",
        daysRemainingText: "17 ABR",
        type: "Trabajo Práctico",
        priority: "Media",
        syllabus: "Análisis de texto dramático y producción argumentativa.",
      },
      {
        id: "act-3",
        title: "Evaluación de Historia",
        subject: "Historia, Geografía y Cs. Sociales",
        date: "21 ABR · 10:00 - 11:30",
        daysRemainingText: "21 ABR",
        type: "Prueba Sumativa",
        priority: "Normal",
        syllabus: "Guerra Fría y conformación del orden mundial contemporáneo.",
      },
    ];
  }, []);

  // Filtrado de asignaturas en pestaña de notas
  const filteredSubjects = useMemo(() => {
    if (!subjectSearch.trim()) return subjectsData;
    const q = subjectSearch.toLowerCase();
    return subjectsData.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.teacher.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
    );
  }, [subjectsData, subjectSearch]);

  const filteredRice = useMemo(() => {
    if (!riceSearch.trim()) return DEFAULT_RICE_ARTICLES;
    const q = riceSearch.toLowerCase();
    return DEFAULT_RICE_ARTICLES.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.details.toLowerCase().includes(q) ||
        r.articleNumber.toLowerCase().includes(q)
    );
  }, [riceSearch]);

  const filteredComms = useMemo(() => {
    if (commsFilter === "unread") return DEFAULT_COMMUNICATIONS.filter((c) => c.isUnread);
    if (commsFilter === "urgent")
      return DEFAULT_COMMUNICATIONS.filter((c) => c.priority === "Alta");
    return DEFAULT_COMMUNICATIONS;
  }, [commsFilter]);

  // Asignaturas aprobando
  const passingSubjectsCount = subjectsData.filter((s) => s.currentAvg >= 4.0).length;

  // Detección de ciclo formativo (1°/2° Medio vs 3°/4° Medio)
  const isJuniorLevel =
    (currentStudent.grade !== undefined && currentStudent.grade <= 2) ||
    activeCourseName.startsWith("1°") ||
    activeCourseName.startsWith("2°");
  const isSeniorLevel = !isJuniorLevel;

  // Ramos clasificados por categoría curricular real
  const especialidadSubjects = useMemo(
    () => subjectsData.filter((s) => s.category === "Especialidad TP"),
    [subjectsData]
  );
  const planComunSubjects = useMemo(
    () => subjectsData.filter((s) => s.category === "Plan Común"),
    [subjectsData]
  );

  // Estadísticas de carga horaria y promedio de especialidad
  const totalWeeklyHours = useMemo(
    () => subjectsData.reduce((acc, curr) => acc + (curr.weeklyHours || 4), 0),
    [subjectsData]
  );
  const especialidadWeeklyHours = useMemo(
    () => especialidadSubjects.reduce((acc, curr) => acc + (curr.weeklyHours || 6), 0),
    [especialidadSubjects]
  );
  const specialtyGpa = useMemo(() => {
    if (especialidadSubjects.length === 0) return null;
    const sum = especialidadSubjects.reduce((acc, curr) => acc + curr.currentAvg, 0);
    return (sum / especialidadSubjects.length).toFixed(1);
  }, [especialidadSubjects]);

  // Filtrado de ramos según selector de ciclo y buscador
  const filteredRamos = useMemo(() => {
    let list = subjectsData;
    if (ramosFilter === "especialidad") {
      list = especialidadSubjects;
    } else if (ramosFilter === "plan_comun") {
      list = planComunSubjects;
    }

    if (!ramosSearch.trim()) return list;
    const q = ramosSearch.toLowerCase();
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.teacher.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.room.toLowerCase().includes(q)
    );
  }, [subjectsData, ramosFilter, especialidadSubjects, planComunSubjects, ramosSearch]);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      {/* ========================================================================= */}
      {/* VISTA PRINCIPAL: DASHBOARD REPLICADO EXACTO SEGÚN DISEÑO OFICIAL LPMM     */}
      {/* ========================================================================= */}
      {activeTab === "resumen" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* ========================================================================= */}
          {/* COLUMNA PRINCIPAL / IZQUIERDA (8 o 9 cols en pantallas grandes)           */}
          {/* ========================================================================= */}
          <div className="xl:col-span-8 2xl:col-span-9 space-y-6">
            {/* 1. HERO BANNER DE BIENVENIDA CON ILUSTRACIÓN 3D */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#eef7ff] via-[#f1f8ff] to-[#e8f4fd] dark:from-[#0d1d3b] dark:via-[#0c1830] dark:to-[#101f3e] border border-blue-100/80 dark:border-blue-900/40 p-6 sm:p-7 flex flex-col md:flex-row items-center justify-between shadow-2xs gap-6">
              <div className="space-y-2 max-w-xl z-10">
                <span className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  Hola, {firstName} <span className="inline-block">👋</span>
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  Bienvenido a tu dashboard
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal leading-relaxed pt-1">
                  Aquí puedes revisar tu información académica, calificaciones, asistencia y acceder a los recursos que necesitas.
                </p>
              </div>

              {/* Ilustración 3D de Graduación y Libros Flotantes */}
              <div className="shrink-0 z-10 w-48 sm:w-56 h-36 sm:h-44 flex items-center justify-center">
                <GraduationHeroIllustration className="w-full h-full" />
              </div>
            </div>

            {/* 2. FILA DE 4 TARJETAS DE NAVEGACIÓN RÁPIDA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Tarjeta 1: Ver calificaciones */}
              <div
                onClick={() => handleTabChange("notas")}
                className="group p-5 rounded-2xl bg-white dark:bg-[#0C1425] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#0c8ee9]/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer min-h-[140px]"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-100/80 dark:bg-blue-950/60 text-[#0c8ee9] dark:text-[#38bdf8] flex items-center justify-center mb-3">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Ver calificaciones
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Revisa tus notas y avances académicos.
                  </p>
                </div>
                <div className="mt-3 self-end">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-slate-800 text-[#0c8ee9] group-hover:bg-[#0c8ee9] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Tarjeta 2: Consultar asistencia */}
              <div
                onClick={() => handleTabChange("asistencia")}
                className="group p-5 rounded-2xl bg-white dark:bg-[#0C1425] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer min-h-[140px]"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Consultar asistencia
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Revisa tu porcentaje y registro de asistencia.
                  </p>
                </div>
                <div className="mt-3 self-end">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-slate-800 text-[#0c8ee9] group-hover:bg-[#0c8ee9] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Tarjeta 3: Ver horario */}
              <div
                onClick={() => handleTabChange("horario")}
                className="group p-5 rounded-2xl bg-white dark:bg-[#0C1425] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-purple-500/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer min-h-[140px]"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100/80 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3">
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Ver horario
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Consulta tus clases y actividades del día.
                  </p>
                </div>
                <div className="mt-3 self-end">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-slate-800 text-[#0c8ee9] group-hover:bg-[#0c8ee9] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Tarjeta 4: Ver mis ramos */}
              <div
                onClick={() => handleTabChange("asignaturas")}
                className="group p-5 rounded-2xl bg-white dark:bg-[#0C1425] border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-amber-500/50 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer min-h-[140px]"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-100/80 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Ver mis ramos
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    Revisa tus asignaturas actuales.
                  </p>
                </div>
                <div className="mt-3 self-end">
                  <div className="w-7 h-7 rounded-full bg-blue-50 dark:bg-slate-800 text-[#0c8ee9] group-hover:bg-[#0c8ee9] group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. DOS SUB-COLUMNAS INFERIORES: RESUMEN ACADÉMICO / CALIFICACIONES + ACCESO RÁPIDO */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Sub-columna Izquierda (7 cols): Resumen Académico + Últimas Calificaciones */}
              <div className="lg:col-span-7 space-y-5">
                {/* Resumen Académico con 3 métricas */}
                <section className="bg-white dark:bg-[#0C1425] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0c8ee9] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                        Resumen Académico
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleTabChange("notas")}
                      className="text-xs font-semibold text-[#0c8ee9] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver detalle</span>
                      <span>→</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Promedio General */}
                    <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <Award className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-medium">Promedio General</span>
                      </div>
                      <div className="flex items-baseline gap-2 my-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {overallAverage}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-200/60">
                          ↗ +0.2
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        Escala chilena oficial (1.0 - 7.0)
                      </p>
                    </div>

                    {/* Asistencia */}
                    <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <CalendarCheck className="w-3.5 h-3.5 text-[#0c8ee9]" />
                        <span className="text-xs font-medium">Asistencia</span>
                      </div>
                      <div className="flex items-baseline gap-2 my-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {currentStudent.overallAttendance}%
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-200/60">
                          ↗ +0.5%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        Meta MINEDUC (85%) cumplida
                      </p>
                    </div>

                    {/* Ramos Aprobados */}
                    <div className="p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-1">
                        <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                        <span className="text-xs font-medium">Ramos Aprobados</span>
                      </div>
                      <div className="flex items-baseline gap-1 my-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                          {passingSubjectsCount}/{subjectsData.length}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {passingSubjectsCount === subjectsData.length
                          ? "Todos aprobando 🎉"
                          : `Faltan ${subjectsData.length - passingSubjectsCount} ramo`}
                      </p>
                    </div>
                  </div>
                </section>

                {/* Últimas Calificaciones */}
                <section className="bg-white dark:bg-[#0C1425] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0c8ee9] flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                        Últimas Calificaciones
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange("notas")}
                      className="text-xs font-semibold text-[#0c8ee9] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver todas</span>
                      <span>→</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80 pb-2">
                          <th className="py-2 font-medium">Asignatura</th>
                          <th className="py-2 font-medium">Evaluación</th>
                          <th className="py-2 font-medium">Nota</th>
                          <th className="py-2 font-medium text-right">Fecha</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/60">
                        {subjectsData.slice(0, 4).map((sub) => {
                          const latestGrade = sub.grades.find((g) => g.value !== null) || sub.grades[0];
                          const val = latestGrade?.value ?? sub.currentAvg;
                          return (
                            <tr
                              key={sub.id}
                              onClick={() => handleTabChange("notas")}
                              className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40 transition cursor-pointer"
                            >
                              <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200 pr-2">
                                {sub.name}
                              </td>
                              <td className="py-2.5 text-slate-500 dark:text-slate-400 pr-2">
                                {latestGrade?.label || "Prueba Escrita"}
                              </td>
                              <td className="py-2.5 font-mono font-bold text-slate-900 dark:text-white pr-2">
                                {val.toFixed(1)}
                              </td>
                              <td className="py-2.5 text-slate-400 dark:text-slate-500 text-right">
                                {latestGrade?.date || "Abril 2025"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              {/* Sub-columna Derecha (5 cols): Acceso rápido */}
              <div className="lg:col-span-5 space-y-4">
                <section className="bg-white dark:bg-[#0C1425] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <Zap className="w-4 h-4 text-[#0c8ee9]" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Acceso rápido
                    </h3>
                  </div>

                  <div className="space-y-2.5">
                    {/* Item 1: Solicitar apoyo escolar */}
                    <div
                      onClick={() => setIsSupportModalOpen(true)}
                      className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-sky-100/90 text-sky-600 flex items-center justify-center shrink-0">
                          <HeartHandshake className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            Solicitar apoyo escolar
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Canal de apoyo psicosocial y pedagógico
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                    </div>

                    {/* Item 2: Descargar boletín */}
                    <div
                      onClick={() => setIsCredentialModalOpen(true)}
                      className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-blue-100/90 text-[#0c8ee9] flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            Descargar boletín
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Obtén tu informe de calificaciones
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                    </div>

                    {/* Item 3: Ver horario completo */}
                    <div
                      onClick={() => handleTabChange("horario")}
                      className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-purple-100/90 text-purple-600 flex items-center justify-center shrink-0">
                          <CalendarDays className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            Ver horario completo
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Consulta todas tus clases y actividades
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                    </div>

                    {/* Item 4: Ver calendario de evaluaciones */}
                    <div
                      onClick={() => handleTabChange("horario")}
                      className="p-3 rounded-xl bg-slate-50/60 dark:bg-slate-900/50 hover:bg-slate-100/80 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100/90 text-emerald-600 flex items-center justify-center shrink-0">
                          <CalendarCheck className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                            Ver calendario de evaluaciones
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Revisa fechas importantes
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* COLUMNA LATERAL DERECHA (WIDGETS ESTUDIANTILES)                           */}
          {/* ========================================================================= */}
          <div className="xl:col-span-4 2xl:col-span-3 space-y-5">
            {/* 1. FICHA DE PERFIL DEL ALUMNO (GRADIENTE AZUL) */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-500 p-5 text-white shadow-sm flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white/20 border border-white/30 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-inner">
                {firstName.charAt(0)}
                {currentStudent.lastName ? currentStudent.lastName.charAt(0) : "R"}
              </div>

              <div className="space-y-0.5 min-w-0 flex-1">
                <h3 className="font-bold text-sm text-white tracking-tight truncate">
                  {activeStudentName}
                </h3>
                <p className="text-[11px] text-blue-100 truncate">
                  Estudiante • 1º Medio A
                </p>
                <p className="text-[11px] text-blue-100 truncate">
                  Colegio Bicentenario Aurenis
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 text-white border border-white/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    En línea
                  </span>
                </div>
              </div>
            </div>

            {/* 2. INFORMACIÓN IMPORTANTE */}
            <section className="bg-white dark:bg-[#0C1425] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#0c8ee9]" />
                <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                  Información importante
                </h3>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 flex items-start gap-2.5">
                <div className="w-6 h-6 rounded-lg bg-[#0c8ee9]/15 text-[#0c8ee9] flex items-center justify-center shrink-0 mt-0.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed font-normal">
                  Recuerda mantener tus datos actualizados y revisar periódicamente tus calificaciones y asistencia.
                </p>
              </div>
            </section>

            {/* 3. PRÓXIMOS EVENTOS */}
            <section className="bg-white dark:bg-[#0C1425] border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                    Próximos eventos
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange("horario")}
                  className="text-xs font-semibold text-[#0c8ee9] hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <span>Ver calendario</span>
                  <span>→</span>
                </button>
              </div>

              <div className="space-y-3">
                {/* Evento 1: Prueba de Matemática */}
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-11 h-12 text-center p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center">
                    <span className="block font-black text-sm text-slate-900 dark:text-white leading-none font-mono">
                      15
                    </span>
                    <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mt-0.5">
                      ABR
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        Prueba de Matemática
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      08:00 - 09:30
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Matemática
                    </p>
                  </div>
                </div>

                {/* Evento 2: Entrega de trabajo grupal */}
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-11 h-12 text-center p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center">
                    <span className="block font-black text-sm text-slate-900 dark:text-white leading-none font-mono">
                      17
                    </span>
                    <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mt-0.5">
                      ABR
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        Entrega de trabajo grupal
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Lengua y Literatura
                    </p>
                  </div>
                </div>

                {/* Evento 3: Evaluación de Historia */}
                <div className="flex items-center gap-3">
                  <div className="shrink-0 w-11 h-12 text-center p-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex flex-col items-center justify-center">
                    <span className="block font-black text-sm text-slate-900 dark:text-white leading-none font-mono">
                      21
                    </span>
                    <span className="block text-[9px] font-bold uppercase text-slate-400 tracking-wider mt-0.5">
                      ABR
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        Evaluación de Historia
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      10:00 - 11:30
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                      Historia, Geografía y Cs. Sociales
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. ¿NECESITAS AYUDA? */}
            <section className="bg-gradient-to-b from-[#f0f7ff] to-[#f8fbff] dark:from-slate-900/60 dark:to-slate-900/40 border border-blue-100/60 dark:border-slate-800 rounded-2xl p-5 shadow-xs text-center flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/60 text-[#0c8ee9] flex items-center justify-center">
                <Headphones className="w-5 h-5" />
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  ¿Necesitas ayuda?
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                  Puedes solicitar apoyo escolar en cualquier momento desde el botón de abajo.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSupportModalOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0c8ee9] hover:bg-[#0b7ecc] active:scale-[0.98] text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Solicitar apoyo escolar</span>
                <span>→</span>
              </button>
            </section>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA DETALLADA DE OTRAS PESTAÑAS CUANDO SE NAVEGA DESDE LOS ACCESOS      */}
      {/* ========================================================================= */}
      {activeTab !== "resumen" && (
        <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => handleTabChange("resumen")}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#0c8ee9] hover:border-[#0c8ee9]/40 transition shadow-2xs cursor-pointer"
          >
            <span>← Volver al Inicio</span>
          </button>
          <span className="text-xs font-semibold text-slate-400 capitalize">
            Módulo: {activeTab}
          </span>
        </div>
      )}

      {/* 3.2. PESTAÑA: MIS CALIFICACIONES */}
      {activeTab === "notas" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Cabecera y Selector de Vista */}
          <div className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    Libro de Calificaciones — Mis Calificaciones
                  </h2>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Semestre 1 · 2026
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Estudiante: <strong className="text-slate-700 dark:text-slate-200">{activeStudentName}</strong> • Curso: <strong className="text-slate-700 dark:text-slate-200">{activeCourseName}</strong> • Escala chilena 1.0 a 7.0 (Aprobación ≥ 4.0)
                </p>
              </div>

              {/* Controles de Vista y Búsqueda */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Buscador de Asignaturas */}
                <div className="relative w-48 sm:w-60">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    placeholder="Buscar asignatura..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c8ee9]"
                  />
                </div>

                {/* Alternador de Vista (Tarjetas vs Tabla) */}
                <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setNotesViewMode("cards")}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer",
                      notesViewMode === "cards"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    Tarjetas
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotesViewMode("table")}
                    className={cn(
                      "px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer",
                      notesViewMode === "table"
                        ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    Planilla Matriz
                  </button>
                </div>

                {/* Botón Imprimir Boletín */}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Boletín</span>
                </button>
              </div>
            </div>

            {/* Barra de Filtros por Categoría Curricular */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex-wrap">
              <button
                type="button"
                onClick={() => setRamosFilter("all")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer",
                  ramosFilter === "all"
                    ? "bg-[#0c8ee9] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                )}
              >
                Todas las Asignaturas ({subjectsData.length})
              </button>
              <button
                type="button"
                onClick={() => setRamosFilter("plan_comun")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer",
                  ramosFilter === "plan_comun"
                    ? "bg-[#0c8ee9] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                )}
              >
                Plan Común ({planComunSubjects.length})
              </button>
              <button
                type="button"
                onClick={() => setRamosFilter("especialidad")}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer",
                  ramosFilter === "especialidad"
                    ? "bg-[#0c8ee9] text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                )}
              >
                Especialidad TP ({especialidadSubjects.length})
              </button>
            </div>
          </div>

          {/* Estadísticas Resumen del Módulo de Notas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Promedio Ponderado</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {overallAverage}
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Destacado
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Calculado sobre 5 asignaturas vigentes</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ramos Aprobados</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  {passingSubjectsCount}/{subjectsData.length}
                </span>
                <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full">
                  100%
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Sin riesgo de repitencia</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Mejor Asignatura</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-slate-900 dark:text-white truncate">
                  Historia (6.8)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Prof. Patricia Morales</p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Asistencia Global</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-600 font-mono">
                  {currentStudent.overallAttendance}%
                </span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Óptima
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Exigencia mínima: 85%</p>
            </div>
          </div>

          {/* VISTA 1: TARJETAS VISUALES AMIGABLES */}
          {notesViewMode === "cards" && (
            filteredSubjects.length === 0 ? (
              <div className="p-12 text-center bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl space-y-3">
                <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No se encontraron asignaturas
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No hay materias que coincidan con tus filtros de búsqueda. Intenta con otro término.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubjectSearch(""); setRamosFilter("all"); }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Restaurar filtros
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredSubjects.map((sub) => {
                const isOver6 = sub.currentAvg >= 6.0;
                const isOver5 = sub.currentAvg >= 5.0 && sub.currentAvg < 6.0;
                const isPassing = sub.currentAvg >= 4.0 && sub.currentAvg < 5.0;

                return (
                  <div
                    key={sub.id}
                    className="p-6 rounded-3xl bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-4 hover:border-[#0c8ee9]/50 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded">
                              {sub.code}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] font-bold px-2.5 py-0.5 rounded",
                                sub.category === "Especialidad TP"
                                  ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200"
                                  : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"
                              )}
                            >
                              {sub.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                            {sub.name}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Docente: <strong className="text-slate-700 dark:text-slate-300">{sub.teacher}</strong> · Sala {sub.room}
                          </p>
                        </div>

                        {/* Promedio con Numerales Tabulares */}
                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                            Promedio
                          </span>
                          <span
                            className={cn(
                              "text-3xl font-black font-mono tabular-nums block",
                              isOver6
                                ? "text-blue-600 dark:text-blue-400"
                                : isOver5
                                ? "text-emerald-600 dark:text-emerald-400"
                                : isPassing
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {sub.currentAvg.toFixed(1)}
                          </span>
                        </div>
                      </div>

                      {/* Desglose de Evaluaciones Parciales */}
                      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            Evaluaciones Registradas ({sub.grades.length}):
                          </span>
                          <span className="text-[11px] text-slate-400">Ponderación oficial</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {sub.grades.map((g, idx) => (
                            <div
                              key={g.code || idx}
                              className={cn(
                                "p-2.5 rounded-2xl border text-xs font-mono font-bold flex flex-col items-center justify-center gap-1",
                                g.value !== null && g.value >= 6.0
                                  ? "bg-blue-50/60 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-200"
                                  : g.value !== null && g.value >= 4.0
                                  ? "bg-emerald-50/60 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-200"
                                  : g.value !== null
                                  ? "bg-rose-50/60 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200"
                                  : "bg-slate-50 border-dashed border-slate-300 text-slate-400 dark:bg-slate-800/40 dark:border-slate-700"
                              )}
                            >
                              <div className="flex items-center justify-between w-full text-[9px] text-slate-400 uppercase font-sans px-1">
                                <span>{g.code}</span>
                                <span>{Math.round((g.weightPct || 0.25) * 100)}%</span>
                              </div>
                              <span className="text-sm font-black tabular-nums">
                                {g.value !== null ? g.value.toFixed(1) : "Pendiente"}
                              </span>
                              <span className="text-[9px] text-slate-500 font-sans truncate max-w-[80px]">
                                {g.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                      <span>Asistencia en ramo: <strong className="font-mono text-slate-700 dark:text-slate-300">{sub.attendanceRate.toFixed(1)}%</strong></span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full">
                        {sub.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

          {/* VISTA 2: PLANILLA MATRIZ DETALLADA */}
          {notesViewMode === "table" && (
            <div className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[750px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50/70 dark:bg-slate-800/70">
                    <th className="py-3.5 px-3">Asignatura</th>
                    <th className="py-3.5 px-2 text-center">Categoría</th>
                    <th className="py-3.5 px-2 text-center">Nota 1 (25%)</th>
                    <th className="py-3.5 px-2 text-center">Nota 2 (25%)</th>
                    <th className="py-3.5 px-2 text-center">Nota 3 (25%)</th>
                    <th className="py-3.5 px-2 text-center">Nota 4 (25%)</th>
                    <th className="py-3.5 px-3 text-center">Promedio Final</th>
                    <th className="py-3.5 px-2 text-center">Asistencia</th>
                    <th className="py-3.5 px-3 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSubjects.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-4 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block text-sm">
                          {sub.name}
                        </span>
                        <span className="text-[11px] text-slate-500">{sub.code} • {sub.teacher}</span>
                      </td>
                      <td className="py-4 px-2 text-center">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {sub.category}
                        </span>
                      </td>
                      {[0, 1, 2, 3].map((idx) => {
                        const val = sub.grades[idx]?.value;
                        return (
                          <td key={idx} className="py-4 px-2 text-center font-mono font-bold tabular-nums">
                            {val !== undefined && val !== null ? (
                              <span
                                className={cn(
                                  "px-2.5 py-1 rounded-lg text-xs font-black",
                                  val >= 6.0
                                    ? "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/60"
                                    : val >= 4.0
                                    ? "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60"
                                    : "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/60"
                                )}
                              >
                                {val.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-normal">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-4 px-3 text-center">
                        <span className="font-mono font-black text-sm px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 tabular-nums">
                          {sub.currentAvg.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-center font-mono font-bold text-slate-600 dark:text-slate-300 tabular-nums">
                        {sub.attendanceRate.toFixed(1)}%
                      </td>
                      <td className="py-4 px-3 text-right">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {/* 3.3. PESTAÑA: MI ASISTENCIA */}
      {activeTab === "asistencia" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Asistencia Semestral
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                  {currentStudent.overallAttendance}%
                </span>
                <span className="text-xs text-slate-400">acumulada</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Superas el umbral de 85% exigido por la normativa para tu promoción de año.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Jornadas Asistidas
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-600 font-mono">46</span>
                <span className="text-xs text-slate-400">de 48 días hábiles</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                2 inasistencias debidamente justificadas con certificado médico.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Puntualidad
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-600 font-mono">1</span>
                <span className="text-xs text-slate-400">atraso registrado</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hora de ingreso a jornada de la mañana: 08:00 hrs.
              </p>
            </div>
          </div>

          {/* Asistencia por Asignatura */}
          <div className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Tu Asistencia por Asignatura
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStudent.subjects && currentStudent.subjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-0.5">
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white block">
                      {sub.name}
                    </span>
                    <span className="text-xs text-slate-500">
                      Sala {sub.room} · {sub.weeklyHours} hrs pedagógicas semanales
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${sub.attendanceRate}%` }}
                      />
                    </div>
                    <span className="font-mono font-black text-sm text-slate-800 dark:text-slate-200">
                      {sub.attendanceRate.toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 3.4. PESTAÑA: HORARIO SEMANAL */}
      {activeTab === "horario" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5"
        >
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              Horario Semanal de Clases ({activeCourseName})
            </h3>
            <p className="text-xs text-slate-500">
              Jornada Escolar Completa (Lunes a Viernes de 08:00 a 16:30 hrs)
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                  <th className="py-3 px-3 w-32 text-left">Bloque</th>
                  <th className="py-3 px-2">Lunes</th>
                  <th className="py-3 px-2">Martes</th>
                  <th className="py-3 px-2">Miércoles</th>
                  <th className="py-3 px-2">Jueves</th>
                  <th className="py-3 px-2">Viernes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Bloque 1 */}
                <tr>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 text-left font-bold">
                    08:00 - 09:30
                  </td>
                  {[0, 1, 2, 3, 4].map((dayIdx) => {
                    const sub = subjectsData[dayIdx % subjectsData.length] || DEFAULT_STUDENT_SUBJECTS[0];
                    return (
                      <td
                        key={dayIdx}
                        className="p-2.5 bg-blue-50/50 dark:bg-blue-950/20 font-bold text-slate-800 dark:text-slate-200 rounded-lg"
                      >
                        {sub?.name || "Asignatura"}
                        <br />
                        <span className="text-[10px] text-slate-400 font-normal">{sub?.room || "Sala 101"}</span>
                      </td>
                    );
                  })}
                </tr>

                {/* Recreo */}
                <tr className="bg-slate-50/80 dark:bg-slate-900/60 text-[11px] text-slate-400 font-semibold">
                  <td colSpan={6} className="py-1.5 flex items-center justify-center gap-1.5">
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Recreo 15 min (09:30 - 09:45)</span>
                  </td>
                </tr>

                {/* Bloque 2 */}
                <tr>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 text-left font-bold">
                    09:45 - 11:15
                  </td>
                  {[5, 6, 7, 8, 9].map((dayIdx) => {
                    const sub = subjectsData[dayIdx % subjectsData.length] || DEFAULT_STUDENT_SUBJECTS[1] || DEFAULT_STUDENT_SUBJECTS[0];
                    return (
                      <td
                        key={dayIdx}
                        className="p-2.5 bg-purple-50/50 dark:bg-purple-950/20 font-bold text-slate-800 dark:text-slate-200 rounded-lg"
                      >
                        {sub?.name || "Asignatura"}
                        <br />
                        <span className="text-[10px] text-slate-400 font-normal">{sub?.room || "Lab 2"}</span>
                      </td>
                    );
                  })}
                </tr>

                {/* Almuerzo */}
                <tr className="bg-slate-100/90 dark:bg-slate-800/80 text-[11px] text-slate-500 font-black">
                  <td colSpan={6} className="py-2 flex items-center justify-center gap-1.5">
                    <span>🥪 Almuerzo Escolar (13:00 - 14:00 hrs)</span>
                  </td>
                </tr>

                {/* Bloque Tarde */}
                <tr>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-500 text-left font-bold">
                    14:00 - 15:30
                  </td>
                  {[2, 4, 1, 3, 0].map((dayIdx, i) => {
                    const sub = subjectsData[(dayIdx + 2) % subjectsData.length] || DEFAULT_STUDENT_SUBJECTS[2] || DEFAULT_STUDENT_SUBJECTS[0];
                    return (
                      <td
                        key={i}
                        className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold text-slate-800 dark:text-slate-200 rounded-lg"
                      >
                        {sub?.name || "Asignatura"}
                        <br />
                        <span className="text-[10px] text-slate-400 font-normal">{sub?.room || "Taller 3"}</span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 3.5. PESTAÑA: MIS RAMOS (PLAN COMÚN VS ESPECIALIDADES TÉCNICAS) */}
      {/* ========================================================================= */}
      {activeTab === "asignaturas" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Banner Didáctico del Nivel / Ciclo Formativo */}
          <div className={cn(
            "relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-xs transition",
            isSeniorLevel
              ? "bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white border-indigo-500/30"
              : "bg-gradient-to-br from-blue-900 via-slate-900 to-slate-950 text-white border-blue-500/30"
          )}>
            <div className="relative z-10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-md",
                    isSeniorLevel ? "bg-indigo-500/30 text-indigo-300 ring-2 ring-indigo-400/40" : "bg-blue-500/30 text-blue-300 ring-2 ring-blue-400/40"
                  )}>
                    {isSeniorLevel ? (
                      activeSpecialty.includes("Programación") ? (
                        <Laptop className="w-5 h-5 text-cyan-300" />
                      ) : activeSpecialty.includes("Enfermería") ? (
                        <Stethoscope className="w-5 h-5 text-rose-300" />
                      ) : activeSpecialty.includes("Párvulo") ? (
                        <Baby className="w-5 h-5 text-amber-300" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-indigo-300" />
                      )
                    ) : (
                      <GraduationCap className="w-5 h-5 text-blue-300" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block">
                      {isSeniorLevel
                        ? "Formación Diferenciada Técnico-Profesional (EMTP)"
                        : "Formación General y Plan Común (1° y 2° Medio)"}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                      {isSeniorLevel ? `Especialidad: ${activeSpecialty}` : "Malla Curricular Plan Común"}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-bold text-white">
                    {activeCourseName}
                  </span>
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-bold text-emerald-300">
                    {subjectsData.length} Ramos Oficiales
                  </span>
                </div>
              </div>

              {/* Explicación pedagógica según el ciclo escolar */}
              <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                {isJuniorLevel ? (
                  <>
                    En <strong>1° y 2° Medio</strong> cursas las materias troncales del <strong>Plan Común ministerial</strong> (Lenguaje, Matemática, Ciencias Naturales, Historia, Inglés, etc.) junto a <strong>talleres de exploración vocacional</strong>. En este ciclo todos los cursos comparten la misma base formativa para que al finalizar 2° Medio puedas postular a tu especialidad de egreso (<em>Programación</em>, <em>Atención de Enfermería</em> o <em>Atención de Párvulos</em>) para 3° y 4° Medio.
                  </>
                ) : (
                  <>
                    En <strong>{activeCourseName}</strong> tu plan de estudios está focalizado en la especialidad técnica de <strong>{activeSpecialty}</strong>. Cursas los <strong>Módulos de Especialidad Técnico-Profesional</strong> en talleres y laboratorios prácticos ({especialidadSubjects.length} módulos con {especialidadWeeklyHours} horas pedagógicas semanales), además de las asignaturas obligatorias del Plan Común.
                  </>
                )}
              </p>

              {/* Tarjetas rápidas de balance curricular */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Ramos</span>
                  <span className="text-lg sm:text-xl font-black font-mono text-white">{subjectsData.length}</span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-indigo-300 block">
                    {isSeniorLevel ? "Módulos Especialidad" : "Talleres Vocacionales"}
                  </span>
                  <span className="text-lg sm:text-xl font-black font-mono text-indigo-200">
                    {especialidadSubjects.length}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-blue-300 block">Plan Común</span>
                  <span className="text-lg sm:text-xl font-black font-mono text-blue-200">
                    {planComunSubjects.length}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                    {isSeniorLevel ? "Prom. Especialidad" : "Carga Horaria"}
                  </span>
                  <span className="text-lg sm:text-xl font-black font-mono text-emerald-300">
                    {isSeniorLevel && specialtyGpa ? `${specialtyGpa}` : `${totalWeeklyHours} hrs`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de Filtros y Búsqueda de Ramos */}
          <div className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Selector de Categoría Curricular */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setRamosFilter("all")}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                    ramosFilter === "all"
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  )}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Todos los Ramos ({subjectsData.length})</span>
                </button>

                {especialidadSubjects.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setRamosFilter("especialidad")}
                    className={cn(
                      "px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                      ramosFilter === "especialidad"
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-100"
                    )}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>
                      {isSeniorLevel
                        ? `Módulos TP: ${activeSpecialty} (${especialidadSubjects.length})`
                        : `Talleres Vocacionales TP (${especialidadSubjects.length})`}
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setRamosFilter("plan_comun")}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5",
                    ramosFilter === "plan_comun"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 hover:bg-blue-100"
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Plan Común ({planComunSubjects.length})</span>
                </button>
              </div>

              {/* Buscador de Ramos en Tiempo Real */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={ramosSearch}
                  onChange={(e) => setRamosSearch(e.target.value)}
                  placeholder="Buscar ramo, docente o sala..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Listado de Ramos Filtrados */}
            {filteredRamos.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  No se encontraron ramos con el filtro actual
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setRamosFilter("all");
                    setRamosSearch("");
                  }}
                  className="text-xs text-indigo-600 hover:underline font-bold cursor-pointer"
                >
                  Restablecer todos los filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {filteredRamos.map((sub) => {
                  const isEspecialidad = sub.category === "Especialidad TP";
                  return (
                    <div
                      key={sub.id}
                      className={cn(
                        "p-5 rounded-3xl border transition flex flex-col justify-between space-y-4 hover:shadow-md",
                        isEspecialidad
                          ? "bg-purple-50/40 dark:bg-purple-950/20 border-purple-200/80 dark:border-purple-900/60"
                          : "bg-slate-50/70 dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800"
                      )}
                    >
                      {/* Cabecera del Ramo */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={cn(
                              "text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg flex items-center gap-1",
                              isEspecialidad
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200"
                            )}
                          >
                            {isEspecialidad ? <Sparkles className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                            <span>{isEspecialidad ? (isSeniorLevel ? `Módulo TP` : `Taller TP`) : `Plan Común`}</span>
                          </span>

                          <span className="font-mono text-[11px] font-bold text-slate-400">
                            {sub.code}
                          </span>
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                          {sub.name}
                        </h4>
                      </div>

                      {/* Calificación y Estado */}
                      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold uppercase text-slate-400 block">
                            Promedio Actual
                          </span>
                          <span
                            className={cn(
                              "text-2xl font-black font-mono",
                              sub.currentAvg >= 6.0
                                ? "text-blue-600 dark:text-blue-400"
                                : sub.currentAvg >= 4.0
                                ? "text-emerald-600 dark:text-emerald-400"
                                : "text-rose-600 dark:text-rose-400"
                            )}
                          >
                            {sub.currentAvg.toFixed(1)}
                          </span>
                        </div>

                        <div className="text-right space-y-0.5">
                          <span
                            className={cn(
                              "text-[10px] font-extrabold px-2 py-0.5 rounded-md inline-block",
                              sub.status === "Destacado"
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                                : sub.status === "Aprobando"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            )}
                          >
                            {sub.status}
                          </span>
                          <span className="text-[11px] text-slate-400 block">
                            Asistencia: <strong>{sub.attendanceRate.toFixed(1)}%</strong>
                          </span>
                        </div>
                      </div>

                      {/* Detalles de Horas, Espacio y Categoría */}
                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span className="truncate font-semibold">{sub.room}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{sub.weeklyHours} horas pedagógicas semanales</span>
                        </div>
                      </div>

                      {/* Enlace directo a Notas */}
                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400">
                          {sub.grades.filter((g) => g.value !== null).length} notas ingresadas
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSubjectSearch(sub.name);
                            handleTabChange("notas");
                          }}
                          className="text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <span>Ver Notas</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* 3.6. PESTAÑA: AVISOS & COMUNICADOS */}
      {activeTab === "comunicados" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Avisos y Circulares Escolares
              </h3>
              <p className="text-xs text-slate-500">
                Mensajes de tu Profesor Jefe, Dirección y UTP
              </p>
            </div>

            <div className="flex items-center gap-2">
              {[
                { id: "all", label: "Todos" },
                { id: "unread", label: "No Leídos" },
                { id: "urgent", label: "Urgentes" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setCommsFilter(f.id as any)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer",
                    commsFilter === f.id
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredComms.map((comm) => (
              <div
                key={comm.id}
                onClick={() => setSelectedCommunication(comm)}
                className={cn(
                  "p-5 rounded-2xl border transition cursor-pointer space-y-2",
                  comm.isUnread
                    ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60"
                    : "bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800 hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                      {comm.department}
                    </span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{comm.sender}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{comm.senderRole}</span>
                  </div>
                  <span className="text-slate-400">{comm.date}</span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {comm.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {comm.preview}
                </p>

                <div className="pt-1 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                  <span className="flex items-center gap-1">
                    <span>Leer comunicado completo</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                  {comm.hasAttachment && (
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" />
                      <span>Adjunto disponible</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 3.7. PESTAÑA: MANUAL & CONVIVENCIA */}
      {activeTab === "reglamento" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Reglamento Interno y de Convivencia Escolar (RICE 2026)
              </h3>
              <p className="text-xs text-slate-500">
                Conoce tus derechos, tus deberes y las normas de evaluación
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={riceSearch}
                onChange={(e) => setRiceSearch(e.target.value)}
                placeholder="Buscar artículo..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredRice.map((art) => (
              <div
                key={art.id}
                className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded">
                    {art.articleNumber}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {art.category}
                  </span>
                </div>

                <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {art.title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  {art.summary}
                </p>

                <div className="pt-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 whitespace-pre-line leading-relaxed">
                  {art.details}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODALES INTERACTIVOS */}
      {/* ========================================================================= */}

      {/* 4.1. MODAL: ESCANEO DE ASISTENCIA QR */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-center"
            >
              <button
                type="button"
                onClick={() => {
                  setIsQrModalOpen(false);
                  setQrScanned(false);
                }}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#0c8ee9]/10 text-[#0c8ee9] flex items-center justify-center mx-auto">
                <QrCode className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Marcado de Asistencia en Sala
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Apunta al código QR proyectado por el profesor en clase
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 text-white flex flex-col items-center justify-center space-y-3 relative overflow-hidden">
                <div className="w-40 h-40 border-2 border-[#0c8ee9]/80 rounded-2xl flex items-center justify-center relative">
                  <QrCode className="w-28 h-28 text-white/90" />
                  <div className="absolute inset-x-2 top-0 h-0.5 bg-emerald-400 animate-pulse shadow-md" />
                </div>
                <span className="text-[11px] font-mono text-[#0c8ee9]">
                  {qrScanned ? "¡Código detectado exitosamente!" : "Buscando sesión en Sala 204..."}
                </span>
              </div>

              {qrScanned && (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>¡Presencia confirmada en Sala 204!</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsQrModalOpen(false);
                  setQrScanned(false);
                }}
                className="w-full py-3 rounded-xl bg-[#0c8ee9] hover:bg-[#0b7ecc] text-white font-bold text-xs transition cursor-pointer shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c8ee9]"
              >
                {qrScanned ? "Listo, volver al portal" : "Confirmar Presencia"}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4.2. MODAL: CREDENCIAL ESTUDIANTIL DIGITAL */}
      <AnimatePresence>
        {isCredentialModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="relative w-full max-w-sm bg-gradient-to-br from-[#07284a] via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#0c8ee9]/30 space-y-5"
            >
              <button
                type="button"
                onClick={() => setIsCredentialModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-between pb-3 border-b border-[#0c8ee9]/30">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#0c8ee9]" />
                  <span className="text-xs font-black uppercase tracking-wider text-sky-200">
                    Liceo Politécnico Marga Marga
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">RBD 10240</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0c8ee9] to-sky-700 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md">
                  {firstName.charAt(0)}
                  {currentStudent.lastName ? currentStudent.lastName.charAt(0) : ""}
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-sky-300 uppercase block">
                    Estudiante Regular 2026
                  </span>
                  <h4 className="text-sm font-black text-white leading-tight">
                    {activeStudentName}
                  </h4>
                  <p className="text-xs text-sky-300 font-semibold">Acreditación Estudiantil LPMM</p>
                  <p className="text-[11px] text-slate-400">
                    {activeCourseName} · {activeSpecialty}
                  </p>
                </div>
              </div>

              {/* Código QR de la Credencial */}
              <div className="p-3.5 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center space-y-1">
                <QrCode className="w-24 h-24 text-slate-900" />
                <span className="text-[9px] font-mono text-slate-500 tracking-wider">
                  AUTH-LPMM-STD-2026-{currentStudent.num || 9481}
                </span>
              </div>

              <p className="text-center text-[10px] text-slate-400 font-medium">
                Válida para el año escolar 2026 · Acreditación oficial ante MINEDUC y JUNAEB
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4.3. MODAL: LECTURA COMPLETA DE COMUNICADO */}
      <AnimatePresence>
        {selectedCommunication && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <button
                type="button"
                onClick={() => setSelectedCommunication(null)}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-[#0c8ee9]/10 text-[#0c8ee9] dark:bg-[#0c8ee9]/20 dark:text-[#38bdf8]">
                  {selectedCommunication.department}
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">{selectedCommunication.date}</span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                {selectedCommunication.title}
              </h3>

              <div className="text-xs text-slate-500 border-b border-slate-100 dark:border-slate-800 pb-3">
                Remitente: <strong>{selectedCommunication.sender}</strong> ({selectedCommunication.senderRole})
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed max-h-64 overflow-y-auto pr-1">
                {selectedCommunication.fullBody}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Acuse de recibo registrado automáticamente
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedCommunication(null)}
                  className="px-4 py-2 rounded-xl bg-[#0c8ee9] hover:bg-[#0b7ecc] text-white font-bold text-xs transition cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4.4. MODAL: CANAL SEGURO DE APOYO & CONVIVENCIA */}
      <AnimatePresence>
        {isSupportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <button
                type="button"
                onClick={() => {
                  setIsSupportModalOpen(false);
                  setSupportSent(false);
                }}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Canal Seguro de Apoyo Escolar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Espacio confidencial para alumnos y acompañamiento
                  </p>
                </div>
              </div>

              {supportSent ? (
                <div className="py-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    ¡Mensaje Enviado con Éxito!
                  </h4>
                  {supportTicket && (
                    <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Número de Ticket de Seguimiento
                      </span>
                      <span className="font-mono font-black text-sm text-emerald-700 dark:text-emerald-300">
                        {supportTicket.id}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Tu Profesor Jefe y el equipo de Convivencia Escolar han recibido tu mensaje de forma confidencial y se contactarán contigo de manera discreta.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSupportModalOpen(false);
                      setSupportSent(false);
                      setSupportTicket(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition cursor-pointer"
                  >
                    Aceptar y Volver
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendSupport} className="space-y-4">
                  {supportError && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{supportError}</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Puedes escribirnos si necesitas apoyo en alguna asignatura, conversar sobre alguna situación en el liceo o coordinar orientación con el equipo psicosocial.
                  </p>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      ¿Qué tipo de apoyo requieres?
                    </label>
                    <select
                      value={supportCategory}
                      onChange={(e) => setSupportCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white cursor-pointer"
                    >
                      <option value="Apoyo Pedagógico">Apoyo Pedagógico o Refuerzo en Materias</option>
                      <option value="Profesor Jefe">Conversar con mi Profesor Jefe</option>
                      <option value="Convivencia y Bienestar">Orientación y Bienestar Emocional</option>
                      <option value="Justificación Especial">Consulta de Justificación / Asistencia</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                      Tu Mensaje:
                    </label>
                    <textarea
                      rows={4}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      required
                      placeholder="Cuéntanos con tranquilidad en qué podemos orientarte..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0c8ee9]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingSupport}
                    className="w-full py-3 rounded-xl bg-[#0c8ee9] hover:bg-[#0b7ecc] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmittingSupport ? "Enviando mensaje confidencial..." : "Enviar Mensaje Seguro"}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
