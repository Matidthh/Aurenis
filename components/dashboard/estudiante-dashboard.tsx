"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { AcademicSummaryCard } from "./academic-summary-card";
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

const DEFAULT_FALLBACK_SUBJECTS: DetailedSubjectGrade[] = [
  {
    id: "sub-len",
    code: "LEN-101",
    name: "Lengua y Literatura",
    category: "Plan Común",
    teacher: "Prof. Alejandro Sepúlveda",
    teacherEmail: "alejandro.sepulveda@lpmm.cl",
    room: "Sala 12",
    weeklyHours: 6,
    currentAvg: 6.2,
    attendanceRate: 95,
    status: "Destacado",
    grades: [
      { code: "N1", label: "Control de Lectura", weightPct: 25, value: 6.5, date: "15/03" },
      { code: "N2", label: "Ensayo Argumentativo", weightPct: 25, value: 5.9, date: "18/04" },
      { code: "N3", label: "Evaluación Sumativa", weightPct: 25, value: 6.2, date: "22/05" },
      { code: "N4", label: "Comprensión Crítica", weightPct: 25, value: null, date: "24/10" },
    ],
  },
  {
    id: "sub-mat",
    code: "MAT-101",
    name: "Matemática",
    category: "Plan Común",
    teacher: "Prof. Rodrigo Castro",
    teacherEmail: "profesor.rodrigo@lpmm.cl",
    room: "Laboratorio A",
    weeklyHours: 6,
    currentAvg: 5.8,
    attendanceRate: 92,
    status: "Aprobando",
    grades: [
      { code: "N1", label: "Álgebra y Funciones", weightPct: 25, value: 5.5, date: "12/03" },
      { code: "N2", label: "Geometría Analítica", weightPct: 25, value: 6.0, date: "14/04" },
      { code: "N3", label: "Probabilidades", weightPct: 25, value: 5.9, date: "19/05" },
      { code: "N4", label: "Evaluación Unidad 3", weightPct: 25, value: null, date: "28/10" },
    ],
  },
  {
    id: "sub-his",
    code: "HIS-101",
    name: "Historia, Geografía y Cs. Sociales",
    category: "Plan Común",
    teacher: "Prof. Marcela Silva",
    teacherEmail: "marcela.silva@lpmm.cl",
    room: "Sala 14",
    weeklyHours: 4,
    currentAvg: 6.4,
    attendanceRate: 96,
    status: "Destacado",
    grades: [
      { code: "N1", label: "Procesos Históricos", weightPct: 35, value: 6.5, date: "10/03" },
      { code: "N2", label: "Ciudadanía y Sociedad", weightPct: 35, value: 6.3, date: "12/04" },
      { code: "N3", label: "Informe de Investigación", weightPct: 30, value: null, date: "30/10" },
    ],
  },
  {
    id: "sub-cie",
    code: "CIE-101",
    name: "Ciencias Naturales (Biología/Física)",
    category: "Plan Común",
    teacher: "Prof. Carlos Gómez",
    teacherEmail: "carlos.gomez@lpmm.cl",
    room: "Lab Ciencias",
    weeklyHours: 4,
    currentAvg: 6.0,
    attendanceRate: 90,
    status: "Aprobando",
    grades: [
      { code: "N1", label: "Laboratorio Célula", weightPct: 50, value: 6.0, date: "20/03" },
      { code: "N2", label: "Evaluación Mecánica", weightPct: 50, value: 6.0, date: "25/04" },
    ],
  },
  {
    id: "sub-ing",
    code: "ING-101",
    name: "Idioma Extranjero Inglés",
    category: "Plan Común",
    teacher: "Prof. Evelyn Soto",
    teacherEmail: "evelyn.soto@lpmm.cl",
    room: "Sala Multimedia",
    weeklyHours: 3,
    currentAvg: 6.5,
    attendanceRate: 98,
    status: "Destacado",
    grades: [
      { code: "N1", label: "Oral Presentation", weightPct: 50, value: 6.8, date: "18/03" },
      { code: "N2", label: "Reading Comprehension", weightPct: 50, value: 6.2, date: "22/04" },
    ],
  },
  {
    id: "sub-tp1",
    code: "TP-101",
    name: "Redes de Datos y Conectividad",
    category: "Especialidad TP",
    teacher: "Prof. Marcos Valenzuela",
    teacherEmail: "marcos.valenzuela@lpmm.cl",
    room: "Taller Telecomunicaciones",
    weeklyHours: 8,
    currentAvg: 6.3,
    attendanceRate: 94,
    status: "Destacado",
    grades: [
      { code: "N1", label: "Configuración Switches", weightPct: 35, value: 6.5, date: "05/04" },
      { code: "N2", label: "Cableado Estructurado", weightPct: 35, value: 6.1, date: "15/05" },
      { code: "N3", label: "Topologías de Red", weightPct: 30, value: null, date: "04/11" },
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
}: EstudianteDashboardProps) {
  // Inicialización limpia del registro del estudiante con respaldo de seguridad
  const [currentStudent, setCurrentStudent] = useState<StudentAcademicRecord>(() => {
    if (initialRecord && initialRecord.subjects && initialRecord.subjects.length > 0) {
      return initialRecord;
    }
    return {
      num: initialRecord?.num || 1,
      fullName: initialRecord?.fullName || studentName || "Estudiante Aurenis",
      firstName: initialRecord?.firstName || studentName?.split(" ")[0] || "Estudiante",
      lastName: initialRecord?.lastName || studentName?.split(" ").slice(1).join(" ") || "",
      email: initialRecord?.email || studentEmail || "yamir.ahumada@lpmm.cl",
      rut: initialRecord?.rut || studentRut || "12.345.678-9",
      courseName: initialRecord?.courseName || courseName || "1° Medio A",
      courseCode: initialRecord?.courseCode || "1A",
      grade: initialRecord?.grade || 1,
      letter: initialRecord?.letter || "A",
      specialty: initialRecord?.specialty || "Plan Común",
      overallGpa: initialRecord?.overallGpa || 6.1,
      overallAttendance: initialRecord?.overallAttendance || 95.0,
      subjects: (initialRecord?.subjects && initialRecord.subjects.length > 0)
        ? initialRecord.subjects
        : DEFAULT_FALLBACK_SUBJECTS,
    };
  });

  const [isLoadingStudent, setIsLoadingStudent] = useState(false);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string>(
    initialRecord?.email || studentEmail || "yamir.ahumada@lpmm.cl"
  );

  React.useEffect(() => {
    if (initialRecord && initialRecord.subjects && initialRecord.subjects.length > 0) {
      setCurrentStudent(initialRecord);
      setSelectedStudentEmail(initialRecord.email);
      return;
    }

    let isCancelled = false;
    const loadStudentData = async () => {
      try {
        setIsLoadingStudent(true);
        const targetEmail = selectedStudentEmail || studentEmail || "yamir.ahumada@lpmm.cl";
        const res = await fetch(
          `/api/${schoolSlug}/student-dashboard?email=${encodeURIComponent(targetEmail)}`
        );
        if (!res.ok) return;
        const json = await res.json();
        if (!isCancelled && json.success && json.data?.data) {
          const d = json.data.data;
          setCurrentStudent({
            ...d.student,
            subjects: (d.subjects && d.subjects.length > 0) ? d.subjects : DEFAULT_FALLBACK_SUBJECTS,
          });
        }
      } catch (err) {
        // En caso de desconexión se conservan los ramos de respaldo
      } finally {
        if (!isCancelled) setIsLoadingStudent(false);
      }
    };

    loadStudentData();
    return () => {
      isCancelled = true;
    };
  }, [initialRecord, schoolSlug, selectedStudentEmail, studentEmail]);

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
          subjects: (d.subjects && d.subjects.length > 0) ? d.subjects : DEFAULT_FALLBACK_SUBJECTS,
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
    currentStudent.subjects && currentStudent.subjects.length > 0
      ? currentStudent.subjects
      : DEFAULT_FALLBACK_SUBJECTS;

  // Estados de navegación
  const [activeTab, setActiveTab] = useState<TabType>("resumen");
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
    if (currentStudent.overallGpa > 0) return currentStudent.overallGpa.toFixed(1);
    const validSubs = (subjectsData || []).filter((s) => s && s.grades && s.grades.length > 0);
    const sum = validSubs.reduce((acc, curr) => acc + (curr?.currentAvg || 0), 0);
    return validSubs.length > 0 ? (sum / validSubs.length).toFixed(1) : "6.0";
  }, [currentStudent, subjectsData]);

  const numAverage = parseFloat(overallAverage);

  // Horario del día
  const scheduleToday: ScheduleBlock[] = useMemo(() => {
    const slots = [
      { id: "b1", timeRange: "08:00 - 09:30", isCurrent: false, isPast: true },
      { id: "b2", timeRange: "09:45 - 11:15", isCurrent: true, isPast: false },
      { id: "b3", timeRange: "11:30 - 13:00", isCurrent: false, isPast: false },
      { id: "b4", timeRange: "14:00 - 15:30", isCurrent: false, isPast: false },
    ];
    if (!subjectsData || subjectsData.length === 0) {
      return slots.map((s) => ({
        ...s,
        subject: "Asignatura Escolar",
        teacher: "Docente Asignado",
        room: "Sala de Clases",
      }));
    }
    return slots.map((slot, idx) => {
      const sub = subjectsData[idx % subjectsData.length] || subjectsData[0];
      return {
        ...slot,
        subject: sub?.name || "Asignatura Escolar",
        teacher: sub?.teacher || "Docente Asignado",
        room: sub?.room || "Sala de Clases",
      };
    });
  }, [subjectsData]);

  // Próximas evaluaciones amigables
  const upcomingActivities: UpcomingActivity[] = useMemo(() => {
    if (!subjectsData || subjectsData.length === 0) return [];
    const countdowns = ["En 3 días", "Próximo Martes", "En 10 días"];
    const priorities: ("Alta" | "Media" | "Normal")[] = ["Alta", "Media", "Normal"];

    return (subjectsData || []).slice(0, 3).map((sub, idx) => {
      if (!sub) return null;
      const pendingGrade = sub.grades?.find((g) => g.value === null);
      return {
        id: `act-${idx + 1}`,
        title: pendingGrade?.label || `Evaluación de Unidad N°${idx + 1}`,
        subject: sub?.name || "Asignatura Escolar",
        date: pendingGrade?.date ? `Viernes ${pendingGrade.date}` : `Octubre ${18 + idx * 4}`,
        daysRemainingText: countdowns[idx] || "Próximamente",
        type: idx === 0 ? "Prueba Sumativa" : idx === 1 ? "Taller Práctico" : "Guía de Ejercicios",
        priority: priorities[idx] || "Normal",
        syllabus: `Contenidos prioritarios de ${sub?.name || "la asignatura"}. Recuerda repasar tus apuntes y guías de estudio para la evaluación.`,
      };
    }).filter(Boolean) as UpcomingActivity[];
  }, [subjectsData]);

  // Filtrado de asignaturas en pestaña de notas
  const filteredSubjects = useMemo(() => {
    if (!subjectsData || subjectsData.length === 0) return [];
    if (!subjectSearch.trim()) return subjectsData;
    const q = subjectSearch.toLowerCase();
    return subjectsData.filter(
      (s) =>
        (s?.name || "").toLowerCase().includes(q) ||
        (s?.teacher || "").toLowerCase().includes(q) ||
        (s?.code || "").toLowerCase().includes(q)
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
  const passingSubjectsCount = (subjectsData || []).filter((s) => (s?.currentAvg ?? 0) >= 4.0).length;

  // Detección de ciclo formativo (1°/2° Medio vs 3°/4° Medio)
  const isJuniorLevel =
    (currentStudent.grade !== undefined && currentStudent.grade <= 2) ||
    (activeCourseName || "").startsWith("1°") ||
    (activeCourseName || "").startsWith("2°");
  const isSeniorLevel = !isJuniorLevel;

  // Ramos clasificados por categoría curricular real
  const especialidadSubjects = useMemo(
    () => (subjectsData || []).filter((s) => s && s.category === "Especialidad TP"),
    [subjectsData]
  );
  const planComunSubjects = useMemo(
    () => (subjectsData || []).filter((s) => s && s.category !== "Especialidad TP"),
    [subjectsData]
  );

  // Estadísticas de carga horaria y promedio de especialidad
  const totalWeeklyHours = useMemo(
    () => (subjectsData || []).reduce((acc, curr) => acc + (curr?.weeklyHours || 4), 0),
    [subjectsData]
  );
  const especialidadWeeklyHours = useMemo(
    () => (especialidadSubjects || []).reduce((acc, curr) => acc + (curr?.weeklyHours || 6), 0),
    [especialidadSubjects]
  );
  const specialtyGpa = useMemo(() => {
    if (especialidadSubjects.length === 0) return null;
    const sum = especialidadSubjects.reduce((acc, curr) => acc + (curr?.currentAvg || 0), 0);
    return (sum / especialidadSubjects.length).toFixed(1);
  }, [especialidadSubjects]);

  // Filtrado de ramos según selector de ciclo y buscador
  const filteredRamos = useMemo(() => {
    let list = subjectsData || [];
    if (ramosFilter === "especialidad") {
      list = especialidadSubjects;
    } else if (ramosFilter === "plan_comun") {
      list = planComunSubjects;
    }

    if (!ramosSearch.trim()) return list;
    const q = ramosSearch.toLowerCase();
    return list.filter(
      (s) =>
        (s?.name || "").toLowerCase().includes(q) ||
        (s?.teacher || "").toLowerCase().includes(q) ||
        (s?.code || "").toLowerCase().includes(q) ||
        (s?.room || "").toLowerCase().includes(q)
    );
  }, [subjectsData, ramosFilter, especialidadSubjects, planComunSubjects, ramosSearch]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto pb-12">
      {/* Columna Principal: 2/3 del espacio (Izquierda y Centro) */}
      <div className="lg:col-span-2 space-y-6">
        {/* ========================================================================= */}
        {/* 1. HERO Y HEADER AMIGABLE DEL ESTUDIANTE */}
        {/* ========================================================================= */}
        <motion.header
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden bg-gradient-to-r from-white via-blue-50/40 to-indigo-50/40 dark:from-[#0C1425] dark:to-indigo-950/30 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          {/* Acento sutil en degradado superior */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            {/* Saludo y Bienvenida */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>{activeCourseName}</span>
                <span>·</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{activeSpecialty}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {greetingTime}, <span className="text-[#0c8ee9]">{firstName}</span>! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-lg leading-relaxed">
                Aquí puedes revisar tu información académica, calificaciones, asistencia, horario y acceder a los recursos que necesitas.
              </p>
            </div>

            {/* Ilustración o Símbolo decorativo sutil */}
            <div className="hidden sm:flex shrink-0 w-24 h-24 rounded-3xl bg-blue-500/10 dark:bg-blue-500/20 items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
              <BookOpen className="w-10 h-10" />
            </div>
          </div>
        </motion.header>

        {/* ========================================================================= */}
        {/* 2. TARJETAS DE ACCESOS RÁPIDOS SUPERIORES (5 ICONOS DEL BOCETO) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { id: "notas", label: "Mis Calificaciones", desc: "Revisa tus notas y promedios", icon: Award, color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60" },
            { id: "asistencia", label: "Mi Asistencia", desc: "Consulta tu asistencia y justificaciones", icon: CalendarCheck, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60" },
            { id: "horario", label: "Mi Horario", desc: "Revisa tus clases y actividades", icon: Clock, color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60" },
            { id: "asignaturas", label: "Mis Ramos", desc: "Accede a tus asignaturas", icon: BookOpen, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60" },
            { id: "comunicados", label: "Boletín de Notas", desc: "Descarga tu boletín en PDF", icon: Printer, color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id as TabType)}
                className="p-4 rounded-3xl bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition flex flex-col justify-between text-left cursor-pointer group shadow-2xs hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", item.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#0c8ee9] transition">
                      {item.label}
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="pt-3 flex justify-end text-slate-400 group-hover:text-[#0c8ee9]">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            );
          })}
        </div>

      {/* ========================================================================= */}
      {/* 2. PESTAÑAS PRINCIPALES DEL PORTAL DEL ALUMNO */}
      {/* ========================================================================= */}
      <nav
        aria-label="Navegación del portal escolar"
        className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar"
      >
        {[
          { id: "resumen", label: "Mi Día a Día", icon: Layers },
          { id: "notas", label: "Mis Calificaciones", icon: Award, badge: overallAverage },
          { id: "asistencia", label: "Mi Asistencia", icon: CalendarCheck, badge: `${currentStudent.overallAttendance}%` },
          { id: "horario", label: "Horario Semanal", icon: Clock },
          { id: "asignaturas", label: "Mis Ramos", icon: BookOpen, badge: `${subjectsData.length}` },
          { id: "comunicados", label: "Avisos Escolares", icon: Inbox, badge: "Nuevo" },
          { id: "reglamento", label: "Manual & Convivencia", icon: BookMarked },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0c8ee9]",
                isActive
                  ? "bg-[#0c8ee9] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={cn(
                    "text-[10px] font-black px-1.5 py-0.5 rounded-md",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-[#0c8ee9]/10 text-[#0c8ee9] dark:bg-[#0c8ee9]/20 dark:text-[#38bdf8]"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* ========================================================================= */}
      {/* 3. CONTENIDO SEGÚN LA PESTAÑA ACTIVA */}
      {/* ========================================================================= */}

      {/* 3.1. PESTAÑA: MI DÍA A DÍA (RESUMEN AMIGABLE) */}
      {activeTab === "resumen" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Tarjetas Resumen de Progreso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <AcademicSummaryCard
              title="Mi Promedio General"
              value={overallAverage}
              subtitle="Escala chilena oficial (1.0 - 7.0)"
              badgeLabel={numAverage >= 6.0 ? "¡Sobresaliente!" : "Aprobando"}
              icon={Award}
              accentColor="purple"
              trend={{ value: "+0.2 este semestre", isPositive: true }}
              onClick={() => setActiveTab("notas")}
            />

            <AcademicSummaryCard
              title="Mi Asistencia"
              value={`${currentStudent.overallAttendance}%`}
              subtitle="Meta MINEDUC (85%) cumplida"
              badgeLabel="Al día"
              icon={CalendarCheck}
              accentColor="emerald"
              trend={{ value: "+0.5%", isPositive: true }}
              onClick={() => setActiveTab("asistencia")}
            />

            <AcademicSummaryCard
              title="Mis Ramos Aprobados"
              value={`${passingSubjectsCount}/${(subjectsData || []).length}`}
              subtitle="Ramos oficiales sobre nota 4.0"
              badgeLabel="Plan Regular"
              icon={BookOpen}
              accentColor="blue"
              onClick={() => setActiveTab("asignaturas")}
            />

            <AcademicSummaryCard
              title="Próxima Evaluación"
              value={upcomingActivities.length > 0 ? upcomingActivities[0].daysRemainingText : "En 3 días"}
              subtitle={upcomingActivities.length > 0 ? upcomingActivities[0].subject : (subjectsData && subjectsData.length > 0 ? subjectsData[0]?.name : "Sin información")}
              badgeLabel={upcomingActivities.length > 0 ? upcomingActivities[0].type : "Prueba"}
              icon={Calendar}
              accentColor="indigo"
              onClick={() => setActiveTab("notas")}
            />
          </div>

          {/* Cuadrícula Principal: Horario de hoy + Agenda + Tarjeta de Asistencia */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Columna Izquierda (8 cols): Clase Actual + Agenda de Próximas Evaluaciones */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              {/* Bloque en Curso / Horario del Día */}
              <section className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0c8ee9]/10 text-[#0c8ee9] flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        Tu Horario de Hoy
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Bloques pedagógicos, asignaturas y salas programadas
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("horario")}
                    className="text-xs font-bold text-[#0c8ee9] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver Semana Completa</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {scheduleToday.map((block) => (
                    <div
                      key={block.id}
                      className={cn(
                        "p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                        block.isCurrent
                          ? "bg-[#0c8ee9]/5 border-[#0c8ee9]/40 dark:border-[#0c8ee9]/50 ring-2 ring-[#0c8ee9]/20"
                          : block.isPast
                          ? "bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60 opacity-60"
                          : "bg-white dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800"
                      )}
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <div className="shrink-0 font-mono text-xs font-black text-slate-700 dark:text-slate-300 w-28">
                          {block.timeRange}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {block.subject}
                            </span>
                            {block.isCurrent && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#0c8ee9] text-white">
                                Bloque en Curso
                              </span>
                            )}
                            {block.isPast && (
                              <span className="text-[10px] font-medium text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                Completado
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                            <span className="font-semibold text-[#0c8ee9]">Bloque Lectivo</span>
                            <span aria-hidden="true">·</span>
                            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-[#0c8ee9]" />
                              {block.room}
                            </span>
                          </div>
                        </div>
                      </div>

                      {block.isCurrent && (
                        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setIsQrModalOpen(true);
                              setTimeout(() => setQrScanned(true), 1200);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            <span>Marcar en Sala</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Agenda de Próximas Evaluaciones */}
              <section className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        Tus Próximas Evaluaciones
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Organízate con tiempo para repasar con tranquilidad
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("notas")}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver Todas las Asignaturas</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {upcomingActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3 flex flex-col justify-between hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            {act.daysRemainingText}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400">{act.type}</span>
                        </div>

                        <h3 className="text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2">
                          {act.subject}
                        </h3>

                        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                          {act.title}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <span className="font-semibold">{act.date}</span>
                        <button
                          type="button"
                          onClick={() => setActiveTab("notas")}
                          className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                        >
                          Temario
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Columna Derecha (4 cols): Asistencia Amigable + Mensajes + Consejo */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-8">
              {/* Tarjeta de Asistencia con Barra de Meta MINEDUC */}
              <section className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      Tu Meta de Asistencia
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("asistencia")}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Detalle
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">
                        {currentStudent.overallAttendance}%
                      </span>
                      <span className="text-xs text-slate-400 ml-1.5 font-medium">acumulada</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-200 dark:border-emerald-800">
                      Cumpliendo Meta 🎉
                    </span>
                  </div>

                  {/* Barra de progreso con marcador visual del 85% */}
                  <div className="space-y-1.5">
                    <div className="relative w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${currentStudent.overallAttendance}%` }}
                      />
                      <div
                        className="absolute top-0 bottom-0 w-1 bg-amber-500 z-10"
                        style={{ left: "85%" }}
                        title="Meta mínima de promoción escolar MINEDUC (85%)"
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                      <span>0%</span>
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        85% Meta Mínima
                      </span>
                      <span>100%</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                    ¡Excelente constancia! Tienes <strong>46 días presentes</strong> y solo 2 inasistencias justificadas.
                  </p>
                </div>
              </section>

              {/* Últimos Comunicados */}
              <section className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Inbox className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      Avisos Importantes
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("comunicados")}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Ver Todos
                  </button>
                </div>

                <div className="space-y-3">
                  {DEFAULT_COMMUNICATIONS.slice(0, 2).map((comm) => (
                    <div
                      key={comm.id}
                      onClick={() => {
                        setSelectedCommunication(comm);
                        setActiveTab("comunicados");
                      }}
                      className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 hover:border-indigo-300 dark:hover:border-indigo-800 bg-slate-50/60 dark:bg-slate-900/60 transition cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {comm.senderRole}
                        </span>
                        <span>{comm.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                        {comm.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {comm.preview}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tarjeta de Apoyo Emocional & Convivencia */}
              <section className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white space-y-3 shadow-md relative overflow-hidden">
                <div className="flex items-center gap-2 text-indigo-300">
                  <HeartHandshake className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-wider">
                    Espacio Seguro del Alumno
                  </span>
                </div>
                <h4 className="text-sm font-black leading-snug">
                  ¿Necesitas orientación o conversar con tu Profe Jefe?
                </h4>
                <p className="text-xs text-indigo-100/80 leading-relaxed">
                  Estamos aquí para apoyarte en cualquier inquietud académica, personal o de convivencia escolar.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Escribir Mensaje Seguro</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </section>
            </div>
          </div>
        </motion.div>
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
          <div className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                    Tus Calificaciones Oficiales
                  </h2>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Semestre 1 · 2026
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Escala chilena de 1.0 a 7.0 (aprobación con nota 4.0 o superior)
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
                    placeholder="Buscar materia..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                    Planilla
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

            {/* Guía Visual Amigable de Escala de Notas */}
            <div className="pt-2 flex items-center gap-3 sm:gap-6 flex-wrap text-xs text-slate-500 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300">Escala:</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>6.0 - 7.0 Sobresaliente</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>5.0 - 5.9 Bueno</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>4.0 - 4.9 Aprobando</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>&lt; 4.0 En Refuerzo</span>
              </span>
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
                  No hay materias que coincidan con &ldquo;{subjectSearch}&rdquo;. Intenta con otro término o limpia el buscador.
                </p>
                <button
                  type="button"
                  onClick={() => setSubjectSearch("")}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredSubjects.map((sub) => {
                const isOver6 = sub.currentAvg >= 6.0;
                const isOver5 = sub.currentAvg >= 5.0 && sub.currentAvg < 6.0;
                const isPassing = sub.currentAvg >= 4.0 && sub.currentAvg < 5.0;

                return (
                  <div
                    key={sub.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-4 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {sub.code}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded",
                              sub.category === "Especialidad TP"
                                ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200"
                                : "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"
                            )}
                          >
                            {sub.category}
                          </span>
                        </div>
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                          {sub.name}
                        </h3>
                        <p className="text-xs text-slate-500">
                          Sala {sub.room} · {sub.weeklyHours} hrs pedagógicas semanales
                        </p>
                      </div>

                      {/* Promedio Grande con Acento Visual */}
                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                          Promedio
                        </span>
                        <span
                          className={cn(
                            "text-2xl sm:text-3xl font-black font-mono block",
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

                    {/* Fila de Notas Parciales */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[11px] font-bold text-slate-500 block">
                        Calificaciones Parciales:
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        {sub.grades.map((g, idx) => (
                          <div
                            key={g.code || idx}
                            className={cn(
                              "px-2.5 py-1.5 rounded-xl border text-xs font-mono font-bold flex flex-col items-center min-w-[42px]",
                              g.value !== null && g.value >= 6.0
                                ? "bg-blue-50/70 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-900 dark:text-blue-200"
                                : g.value !== null && g.value >= 4.0
                                ? "bg-emerald-50/70 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-200"
                                : g.value !== null
                                ? "bg-rose-50/70 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-200"
                                : "bg-slate-50 border-dashed border-slate-300 text-slate-400 dark:bg-slate-800/40 dark:border-slate-700"
                            )}
                            title={g.label}
                          >
                            <span className="text-[9px] text-slate-400 uppercase font-sans">
                              {g.code}
                            </span>
                            <span>{g.value !== null ? g.value.toFixed(1) : "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Asistencia: <strong>{sub.attendanceRate.toFixed(1)}%</strong></span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {sub.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}

          {/* VISTA 2: PLANILLA DETALLADA */}
          {notesViewMode === "table" && (
            <div className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50/50 dark:bg-slate-800/50">
                    <th className="py-3 px-3">Asignatura</th>
                    <th className="py-3 px-2 text-center">Tipo</th>
                    <th className="py-3 px-2 text-center">N1</th>
                    <th className="py-3 px-2 text-center">N2</th>
                    <th className="py-3 px-2 text-center">N3</th>
                    <th className="py-3 px-2 text-center">N4</th>
                    <th className="py-3 px-3 text-center">Promedio</th>
                    <th className="py-3 px-2 text-center">Asistencia</th>
                    <th className="py-3 px-3 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSubjects.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {sub.name}
                        </span>
                        <span className="text-[11px] text-slate-500">{sub.code}</span>
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {sub.category}
                        </span>
                      </td>
                      {[0, 1, 2, 3].map((idx) => {
                        const val = sub.grades[idx]?.value;
                        return (
                          <td key={idx} className="py-3.5 px-2 text-center font-mono font-bold">
                            {val !== undefined && val !== null ? (
                              <span
                                className={cn(
                                  "px-2 py-0.5 rounded",
                                  val >= 6.0
                                    ? "text-blue-700 bg-blue-50 dark:text-blue-300"
                                    : val >= 4.0
                                    ? "text-emerald-700 bg-emerald-50 dark:text-emerald-300"
                                    : "text-rose-700 bg-rose-50 dark:text-rose-300"
                                )}
                              >
                                {val.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600">—</span>
                            )}
                          </td>
                        );
                      })}
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          {sub.currentAvg.toFixed(1)}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-center font-mono text-slate-600 dark:text-slate-300">
                        {sub.attendanceRate.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
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
                    const sub = subjectsData && subjectsData.length > 0
                      ? subjectsData[dayIdx % subjectsData.length]
                      : null;
                    return (
                      <td
                        key={dayIdx}
                        className="p-2.5 bg-blue-50/50 dark:bg-blue-950/20 font-bold text-slate-800 dark:text-slate-200 rounded-lg"
                      >
                        {sub?.name || "Taller de Aprendizaje"}
                        <br />
                        <span className="text-[10px] text-slate-400 font-normal">{sub?.room || "Sala 12"}</span>
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
                    const sub = subjectsData && subjectsData.length > 0
                      ? subjectsData[dayIdx % subjectsData.length]
                      : null;
                    return (
                      <td
                        key={dayIdx}
                        className="p-2.5 bg-purple-50/50 dark:bg-purple-950/20 font-bold text-slate-800 dark:text-slate-200 rounded-lg"
                      >
                        {sub?.name || "Asignatura Formativa"}
                        <br />
                        <span className="text-[10px] text-slate-400 font-normal">{sub?.room || "Laboratorio A"}</span>
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
                    const sub = subjectsData && subjectsData.length > 0
                      ? subjectsData[(dayIdx + 2) % subjectsData.length]
                      : null;
                    return (
                      <td
                        key={i}
                        className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/20 font-bold text-slate-800 dark:text-slate-200 rounded-lg"
                      >
                        {sub?.name || "Módulo Práctico"}
                        <br />
                        <span className="text-[10px] text-slate-400 font-normal">{sub?.room || "Taller Técnico"}</span>
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
                            setActiveTab("notas");
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

      {/* ========================================================================= */}
      {/* COLUMNA LATERAL DERECHA (1/3 DEL ESPACIO - LG:COL-SPAN-1)                  */}
      {/* ========================================================================= */}
      <div className="space-y-6">
        {/* 1. Tarjeta de Perfil del Estudiante */}
        <div className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 text-center">
          <div className="relative inline-block mx-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl flex items-center justify-center shadow-md mx-auto">
              {firstName.charAt(0)}
              {currentStudent.lastName ? currentStudent.lastName.charAt(0) : ""}
            </div>
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" title="En línea" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              {firstName} {currentStudent.lastName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Estudiante · {activeCourseName}
            </p>
            <p className="text-[11px] text-[#0c8ee9] font-bold">
              Liceo Politécnico Marga Marga
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 py-2 rounded-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>En línea</span>
          </div>
        </div>

        {/* 2. Próximos Eventos */}
        <div className="bg-white dark:bg-[#0C1425] border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0c8ee9]" />
              <h3 className="font-black text-sm text-slate-900 dark:text-white">
                Próximos Eventos
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab("notas")}
              className="text-xs font-bold text-[#0c8ee9] hover:underline cursor-pointer"
            >
              Ver calendario →
            </button>
          </div>

          <div className="space-y-3">
            {[
              { date: "15 ABR", title: "Prueba de Matemática", time: "08:00 - 09:30", type: "Evaluación" },
              { date: "17 ABR", title: "Entrega de trabajo grupal", time: "Lengua y Literatura", type: "Tarea" },
              { date: "21 ABR", title: "Evaluación de Historia", time: "10:00 - 11:30", type: "Evaluación" },
            ].map((ev, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 flex items-start gap-3">
                <div className="px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-center shrink-0 font-mono">
                  <span className="text-[10px] font-bold block uppercase">ABR</span>
                  <span className="text-sm font-black">{ev.date.split(" ")[0]}</span>
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {ev.title}
                    </h4>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {ev.type}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{ev.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Tarjeta ¿Necesitas ayuda? */}
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white rounded-3xl p-6 shadow-md space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-300">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-black">
              ¿Necesitas ayuda?
            </h3>
            <p className="text-xs text-indigo-100/80 leading-relaxed">
              Puedes solicitar apoyo escolar en cualquier momento desde el botón de abajo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSupportModalOpen(true)}
            className="w-full py-3 rounded-2xl bg-[#0c8ee9] hover:bg-[#0b7ecc] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Solicitar apoyo escolar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
