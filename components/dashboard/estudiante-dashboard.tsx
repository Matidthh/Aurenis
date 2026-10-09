"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
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
  RefreshCw,
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
  HelpCircle,
  HeartHandshake,
  BookMarked,
  Scale,
  MessageSquare,
  Send,
  IdCard,
  Printer,
  Shield,
  FileCheck,
} from "lucide-react";
import { AcademicSummaryCard } from "./academic-summary-card";
import { cn } from "@/lib/utils/cn";
import {
  getStudentAcademicRecord,
  StudentAcademicRecord,
  DetailedSubjectGrade,
  getAllStudentsDirectory,
  StudentDirectoryItem,
} from "@/lib/db/lpmm-curriculum-and-grades";

/**
 * ============================================================================
 * AURENIS — DASHBOARD INTEGRAL DEL ESTUDIANTE (PORTAL DEL ALUMNO)
 * ============================================================================
 * Autores:
 * - 👑 Maicol R. (Arquitectura, Restricciones RBAC, Autorización de Datos)
 * - 💻 Malcom Marcelo (Frontend React, Estado Reactivo, App Router)
 * - 🎨 Lucas P. (Diseño UI/UX, Design System, Accesibilidad WCAG AA)
 * - 🛡️ Frank M. (Seguridad, Bloqueo de Modificación de Notas, Decreto 67 y RICE)
 *
 * Misión del Componente:
 * 1. Proporcionar un portal integral para el estudiante escolar:
 *    - Pestaña 'resumen': Vista holística del día a día escolar.
 *    - Pestaña 'notas': Registro de calificaciones oficiales 100% SOLO LECTURA (Decreto 67).
 *    - Pestaña 'asistencia': Registro global, umbral MINEDUC 85%, desglose y escaneo QR.
 *    - Pestaña 'comunicados': Avisos de Dirección, UTP, profesores y citaciones.
 *    - Pestaña 'asignaturas': Plan curricular oficial correspondiente a su nivel (1° Medio TP).
 *    - Pestaña 'reglamento': Reglamento Interno y de Convivencia Escolar (RICE) y Decreto 67.
 *    - Pestaña 'horario': Horario escolar semanal completo con bloques pedagógicos y salas.
 * 2. SEGURIDAD ESTRICTA: Ningún estudiante puede alterar, simular o modificar sus notas.
 * ============================================================================
 */

export interface EstudianteDashboardProps {
  schoolSlug: string;
  studentName?: string;
  studentEmail?: string;
  courseName?: string;
  studentRut?: string;
  initialRecord?: StudentAcademicRecord;
  isStudentSelf?: boolean;
}

type TabType =
  | "resumen"
  | "notas"
  | "asistencia"
  | "comunicados"
  | "asignaturas"
  | "reglamento"
  | "horario";

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
  time?: string;
  type: "Prueba Sumativa" | "Guía de Ejercicios" | "Trabajo Práctico" | "Taller";
  status: "Pendiente" | "Próxima a vencer" | "Entregada" | "Vencida";
  priority?: "Alta" | "Media" | "Normal";
  syllabus?: string;
}

// DetailedSubjectGrade se importa desde @/lib/db/lpmm-curriculum-and-grades

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
  category: "Derechos" | "Deberes" | "Evaluación" | "Convivencia" | "Laboratorios";
  title: string;
  articleNumber: string;
  summary: string;
  details: string;
}

// Comunicados oficiales institucionales por defecto
const DEFAULT_COMMUNICATIONS: InstitutionalCommunication[] = [
  {
    id: "c1",
    title: "Autorización y Protocolo para Salidas Pedagógicas y Prácticas TP",
    sender: "Prof. Rodrigo Castro Díaz",
    senderRole: "Coordinación de Especialidades Técnico Profesionales",
    department: "Profesor",
    date: "Hoy, 10:30 hrs",
    isUnread: true,
    priority: "Alta",
    preview: "Estimados estudiantes, se publican las directrices de salidas a terreno y alternancia formativa institucional.",
    fullBody: "Estimada comunidad estudiantil:\n\nDurante este semestre realizaremos salidas pedagógicas y actividades prácticas según cada especialidad (Atención de Párvulos, Enfermería, Electricidad y Programación). Es requisito obligatorio presentar la autorización debidamente firmada por su apoderado titular.\n\nRequisitos de asistencia:\n- Uniforme institucional completo o indumentaria técnica según corresponda.\n- Elementos de protección y seguridad en talleres y laboratorios.\n- Credencial de estudiante con código QR para control de acceso.\n\nCoordinación de Especialidades TP LPMM.",
    hasAttachment: true,
  },
  {
    id: "c2",
    title: "Calendario Oficial de Talleres de Reforzamiento Académico",
    sender: "Unidad Técnica Pedagógica (UTP)",
    senderRole: "Coordinación UTP LPMM",
    department: "UTP",
    date: "Ayer, 16:15 hrs",
    isUnread: false,
    priority: "Normal",
    preview: "Se publican los horarios de tutorías extracurriculares de Matemática e Inglés para el segundo período.",
    fullBody: "La Dirección y Unidad Técnica Pedagógica informan a la comunidad estudiantil que a contar del próximo lunes inician los talleres de apoyo pedagógico en horario vespertino (15:45 a 17:00 hrs). Las inscripciones son coordinadas con su profesor jefe.",
  },
  {
    id: "c3",
    title: "Recordatorio Protocolo de Convivencia Escolar y Uso de Dispositivos",
    sender: "Equipo de Convivencia Escolar",
    senderRole: "Encargado de Convivencia (Circular 482)",
    department: "Convivencia",
    date: "05 de Octubre",
    isUnread: false,
    priority: "Normal",
    preview: "Se recuerda la normativa sobre el uso de teléfonos móviles en aula y cuidado de espacios comunes.",
    fullBody: "Estimados alumnos y alumnas:\n\nReiteramos que el uso de teléfonos celulares durante los bloques de clase está autorizado exclusivamente para fines pedagógicos indicados por el docente. Cuidemos los ambientes de aprendizaje y respeto mutuo según lo estipulado en nuestro RICE.",
  },
  {
    id: "c4",
    title: "Inscripciones para Ferias Tecnológicas y Torneo de Robótica 2026",
    sender: "Dirección de Establecimiento",
    senderRole: "Dirección Liceo Marga Marga",
    department: "Dirección",
    date: "01 de Octubre",
    isUnread: false,
    priority: "Normal",
    preview: "Convocatoria abierta para representar al liceo en la Expo Técnica Regional de Valparaíso.",
    fullBody: "Felicitamos a todos los estudiantes con vocación técnica e invitamos a inscribirse con sus profesores de taller para integrar la delegación del liceo en el torneo inter-escolar.",
  },
];

// Artículos y extractos oficiales del RICE por defecto
const DEFAULT_RICE_ARTICLES: RiceArticle[] = [
  {
    id: "r1",
    category: "Derechos",
    articleNumber: "Art. 12",
    title: "Derecho a una Evaluación Justa y Oportuna (Decreto 67)",
    summary: "Todo estudiante tiene derecho a conocer las pautas de evaluación y recibir retroalimentación formativa oportuna.",
    details: "De conformidad con el Decreto Supremo N° 67/2018 del MINEDUC, los estudiantes tienen derecho a:\n1. Conocer con al menos 5 días hábiles de anticipación los criterios, pautas e instrumentos de evaluación sumativa.\n2. Recibir los resultados y retroalimentación de cada evaluación en un plazo no superior a 10 días hábiles y siempre antes de la siguiente evaluación sumativa de la misma unidad.\n3. Solicitar revisión fundada de calificaciones con su docente o mediación de UTP en caso de discrepancias pedagógicas.",
  },
  {
    id: "r2",
    category: "Deberes",
    articleNumber: "Art. 18",
    title: "Asistencia Regular y Umbral Mínimo Legal MINEDUC",
    summary: "La asistencia mínima obligatoria para la promoción de curso es del 85% del año escolar.",
    details: "Para ser promovidos de curso, los alumnos deberán asistir a lo menos al 85% de las clases establecidas en el calendario escolar anual. Toda inasistencia por razones de salud debe ser justificada por el apoderado dentro de las 48 horas hábiles mediante certificado médico en Inspectoría General.",
  },
  {
    id: "r3",
    category: "Evaluación",
    articleNumber: "Art. 24",
    title: "Escala Oficial y Criterios de Aprobación",
    summary: "Escala de 1.0 a 7.0 con un decimal. La nota mínima de aprobación institucional es 4.0 con 60% de exigencia.",
    details: "1. La calificación final de cada asignatura se expresará en escala numérica de 1.0 a 7.0 con un decimal.\n2. La nota mínima de aprobación es 4.0, calculada con un nivel de exigencia institucional del 60%.\n3. Se contempla un mínimo de 4 calificaciones sumativas por semestre en asignaturas de 4 o más horas semanales.",
  },
  {
    id: "r4",
    category: "Convivencia",
    articleNumber: "Art. 35",
    title: "Protocolo de Mediación y Buena Convivencia (Circular 482)",
    summary: "Garantía de debido proceso, escucha activa, mediación formativa y no discriminación.",
    details: "Todo procedimiento disciplinario garantizará el derecho a ser escuchado del estudiante, la presunción de inocencia, el acompañamiento de su apoderado y el principio formativo de las medidas según la Circular N° 482 de la Superintendencia de Educación.",
  },
  {
    id: "r5",
    category: "Laboratorios",
    articleNumber: "Art. 51",
    title: "Normas de Seguridad en Laboratorios y Talleres TP",
    summary: "Obligatoriedad de uso de EPP, cuidado de instrumental técnico y prohibición de alimentos.",
    details: "En los talleres y laboratorios de especialidad (Atención de Párvulos, Enfermería, Electricidad y Programación), los estudiantes deberán acatar estrictamente las normas de bioseguridad, cuidado de hardware, protocolos sanitarios y uso adecuado de equipamiento institucional.",
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
}: EstudianteDashboardProps) {
  // Inicialización limpia del correo del estudiante
  const initialEmail = studentEmail || initialRecord?.email || "yamir.ahumada@lpmm.cl";
  const [selectedStudentEmail, setSelectedStudentEmail] = useState<string>(initialEmail);

  // Sincronizar si cambia la prop de correo
  React.useEffect(() => {
    if (studentEmail && studentEmail !== selectedStudentEmail) {
      setSelectedStudentEmail(studentEmail);
    }
  }, [studentEmail]);

  // Directorio completo con los 312 estudiantes reales de los 14 cursos
  const allStudents = useMemo(() => getAllStudentsDirectory(), []);
  const coursesList = useMemo(
    () => Array.from(new Set(allStudents.map((s) => s.courseName))),
    [allStudents]
  );

  // Registro Académico Real obtenido de las planillas oficiales del LPMM
  const currentStudent: StudentAcademicRecord = useMemo(() => {
    if (initialRecord && initialRecord.email.toLowerCase() === selectedStudentEmail.toLowerCase()) {
      return initialRecord;
    }
    return (
      getStudentAcademicRecord(selectedStudentEmail) ||
      (studentEmail ? getStudentAcademicRecord(studentEmail) : null) ||
      (studentName ? getStudentAcademicRecord(studentName) : null) ||
      getStudentAcademicRecord("yamir.ahumada@lpmm.cl")!
    );
  }, [initialRecord, selectedStudentEmail, studentEmail, studentName]);

  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>(
    currentStudent?.courseName || "1° Medio A"
  );

  React.useEffect(() => {
    if (currentStudent?.courseName && currentStudent.courseName !== selectedCourseFilter) {
      setSelectedCourseFilter(currentStudent.courseName);
    }
  }, [currentStudent?.courseName]);

  const studentsInCourse = useMemo(
    () => allStudents.filter((s) => s.courseName === selectedCourseFilter),
    [allStudents, selectedCourseFilter]
  );

  const activeStudentName = currentStudent.fullName;
  const activeStudentRut = currentStudent.rut;
  const activeCourseName = `${currentStudent.courseName} — ${currentStudent.specialty}`;
  const subjectsData: DetailedSubjectGrade[] = currentStudent.subjects;

  // Pestaña activa principal
  const [activeTab, setActiveTab] = useState<TabType>("resumen");

  // Modales interactivos
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrScanned, setQrScanned] = useState(false);
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<InstitutionalCommunication | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<DetailedSubjectGrade | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Filtros de búsqueda
  const [commsFilter, setCommsFilter] = useState<"all" | "unread" | "urgent">("all");
  const [riceSearch, setRiceSearch] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [supportSent, setSupportSent] = useState(false);

  // Determinar saludo según hora actual
  const currentHour = new Date().getHours();
  const greetingTime =
    currentHour < 12 ? "Buenos días" : currentHour < 19 ? "Buenas tardes" : "Buenas noches";

  // Promedio ponderado acumulado oficial (Decreto 67)
  const overallAverage = useMemo(() => {
    if (currentStudent.overallGpa > 0) return currentStudent.overallGpa.toFixed(1);
    const validSubs = subjectsData.filter((s) => s.grades.length > 0);
    const sum = validSubs.reduce((acc, curr) => acc + curr.currentAvg, 0);
    return validSubs.length > 0 ? (sum / validSubs.length).toFixed(1) : "6.0";
  }, [currentStudent, subjectsData]);

  // Horario pedagógico dinámico según asignaturas reales del curso del alumno
  const scheduleToday: ScheduleBlock[] = useMemo(() => {
    const slots = [
      { id: "b1", timeRange: "08:00 - 09:30", isCurrent: false, isPast: true },
      { id: "b2", timeRange: "09:45 - 11:15", isCurrent: true, isPast: false },
      { id: "b3", timeRange: "11:30 - 13:00", isCurrent: false, isPast: false },
      { id: "b4", timeRange: "14:00 - 15:30", isCurrent: false, isPast: false },
    ];
    return slots.map((slot, idx) => {
      const sub = subjectsData[idx % subjectsData.length] || subjectsData[0];
      return {
        ...slot,
        subject: sub.name,
        teacher: sub.teacher,
        room: sub.room,
      };
    });
  }, [subjectsData]);

  // Evaluaciones y actividades próximas vinculadas a sus asignaturas reales
  const upcomingActivities: UpcomingActivity[] = useMemo(() => {
    const sampleSubs = subjectsData.slice(0, 3);
    return sampleSubs.map((sub, idx) => {
      const pendingGrade = sub.grades.find((g) => g.value === null);
      return {
        id: `act-${idx + 1}`,
        title: pendingGrade ? `${pendingGrade.label} (${sub.code})` : `Evaluación Sumativa N°${idx + 2}`,
        subject: sub.name,
        date: pendingGrade?.date ? `Noviembre ${pendingGrade.date}` : `Octubre ${18 + idx * 4}`,
        time: "09:45 hrs",
        type: (idx === 0 ? "Prueba Sumativa" : idx === 1 ? "Guía de Ejercicios" : "Trabajo Práctico") as any,
        status: (idx === 0 ? "Próxima a vencer" : "Pendiente") as any,
        priority: (idx === 0 ? "Alta" : idx === 1 ? "Media" : "Normal") as any,
        syllabus: `Unidad de aprendizaje oficial: ${sub.name}. Consulta rúbrica con ${sub.teacher}.`,
      };
    });
  }, [subjectsData]);

  const communications = DEFAULT_COMMUNICATIONS;
  const riceArticles = DEFAULT_RICE_ARTICLES;

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
    if (commsFilter === "urgent") return DEFAULT_COMMUNICATIONS.filter((c) => c.priority === "Alta");
    return DEFAULT_COMMUNICATIONS;
  }, [commsFilter]);

  return (
    <div className="space-y-6 sm:space-y-8 select-none">
      {/* ========================================================================= */}
      {/* 1. HEADER CONTEXTUAL CON IDENTIDAD Y CREDENCIAL DEL ESTUDIANTE */}
      {/* ========================================================================= */}
      <header className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Identidad del Alumno */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                Portal del Estudiante
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                RUN: {activeStudentRut}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                Año Lectivo 2026 (Semestre 1)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {greetingTime},{" "}
              <span className="text-indigo-600 dark:text-indigo-400">
                {activeStudentName.split(" ")[0]}
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Matriculado en: <strong className="text-slate-800 dark:text-slate-200">{activeCourseName}</strong> · Liceo Politécnico Marga Marga (RBD 10240)
            </p>

            {/* Selector de verificación de estudiantes de LPMM */}
            <div className="pt-2 flex items-center gap-2.5 flex-wrap">
              {isStudentSelf ? (
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1.5 rounded-2xl text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="font-bold text-emerald-800 dark:text-emerald-200">
                    Sesión Alumno Oficial: <strong className="font-extrabold">{activeStudentName}</strong> ({activeCourseName})
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
                    <Users className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Verificar Curso & Alumno:</span>
                  </div>

                  {/* Selector de Curso de los 14 cursos oficiales */}
                  <select
                    value={selectedCourseFilter}
                    onChange={(e) => {
                      const newCourse = e.target.value;
                      setSelectedCourseFilter(newCourse);
                      const firstStudent = allStudents.find((s) => s.courseName === newCourse);
                      if (firstStudent) {
                        setSelectedStudentEmail(firstStudent.email);
                      }
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {coursesList.map((c) => (
                      <option key={c} value={c}>
                        Curso: {c}
                      </option>
                    ))}
                  </select>

                  {/* Selector de Estudiante en ese Curso */}
                  <select
                    value={selectedStudentEmail}
                    onChange={(e) => setSelectedStudentEmail(e.target.value)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 max-w-[320px] truncate"
                  >
                    {studentsInCourse.map((st) => (
                      <option key={st.email} value={st.email}>
                        {st.fullName} (Prom: {st.overallGpa.toFixed(1)})
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          </div>

          {/* Acciones Rápidas del Estudiante */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap self-start md:self-auto">
            {/* Botón QR Asistencia Rápida */}
            <button
              type="button"
              onClick={() => {
                setIsQrModalOpen(true);
                setTimeout(() => setQrScanned(true), 1200);
              }}
              className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-sm min-h-[44px] cursor-pointer"
            >
              <QrCode className="w-4 h-4" />
              <span>Marcar Asistencia QR</span>
            </button>

            {/* Credencial Digital */}
            <button
              type="button"
              onClick={() => setIsCredentialModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer"
              title="Ver Credencial Estudiantil Oficial"
            >
              <IdCard className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">Credencial</span>
            </button>

            {/* Canal de Apoyo Psicosocial / Convivencia */}
            <button
              type="button"
              onClick={() => setIsSupportModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold transition flex items-center gap-2 min-h-[44px] cursor-pointer"
              title="Contactar a Convivencia Escolar o Profesor Jefe"
            >
              <HeartHandshake className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Ayuda & Convivencia</span>
            </button>

            {/* Centro de Notificaciones */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative min-h-[44px] min-w-[44px] p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition flex items-center justify-center cursor-pointer"
                aria-label="Abrir centro de notificaciones"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>

              {/* Panel Desplegable de Notificaciones */}
              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                      Notificaciones Académicas (3)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsNotificationsOpen(false)}
                      className="text-slate-400 hover:text-slate-600 text-xs"
                    >
                      Cerrar
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>Prueba Próxima</span>
                        <span className="text-[10px] text-slate-400 font-normal">Hace 1 h</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Redes de Conectividad: Viernes 17 de Octubre a las 09:45 hrs.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>Asistencia Confirmada</span>
                        <span className="text-[10px] text-slate-400 font-normal">Hoy 08:05</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Presente registrado en bloque de Matemática Aplicada.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60 space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                        <span>Circular de Dirección</span>
                        <span className="text-[10px] text-slate-400 font-normal">Ayer</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400">
                        Autorización salida a Data Center Entel disponible para firma.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Menú de Perfil de Alumno */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 min-h-[44px] cursor-pointer hover:bg-slate-100 transition"
                aria-label="Abrir menú de perfil"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black text-xs flex items-center justify-center">
                  {activeStudentName.split(" ").map(w => w[0]).slice(0, 2).join("")}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <span className="font-bold text-slate-900 dark:text-white block leading-tight">
                    {activeStudentName.split(" ")[0]}
                  </span>
                  <span className="text-[10px] text-slate-500 leading-tight block">Alumno</span>
                </div>
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-30 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                      {activeStudentName}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">{activeCourseName}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsCredentialModalOpen(true);
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left cursor-pointer"
                  >
                    <IdCard className="w-4 h-4 text-slate-400" />
                    <span>Ver Credencial Digital</span>
                  </button>

                  <Link
                    href={`/${schoolSlug}/settings`}
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Configuración de Cuenta</span>
                  </Link>

                  <Link
                    href="/login"
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition font-bold"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Cerrar Sesión</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. BARRA DE NAVEGACIÓN POR PESTAÑAS (TABS DEL ESTUDIANTE) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-2xl p-1.5 shadow-xs flex items-center gap-1 overflow-x-auto no-scrollbar">
        {[
          { id: "resumen", label: "Resumen General", icon: Layers },
          { id: "notas", label: "Mis Notas", icon: Award, badge: "Decreto 67" },
          { id: "asistencia", label: "Asistencia", icon: CalendarCheck, badge: "97.2%" },
          { id: "comunicados", label: "Comunicados", icon: Inbox, badge: "1 Nuevo" },
          { id: "asignaturas", label: "Mis Asignaturas", icon: BookOpen },
          { id: "reglamento", label: "Reglamento Escolar", icon: BookMarked },
          { id: "horario", label: "Horario Semanal", icon: Clock },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as TabType)}
              className={cn(
                "px-3.5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap cursor-pointer shrink-0",
                isActive
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={cn(
                    "text-[10px] font-black px-1.5 py-0.2 rounded-md",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. AVISO INFORMATIVO DE SEGURIDAD (PROTECCIÓN DE CALIFICACIONES DE ALUMNOS) */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 text-indigo-950 dark:text-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-slate-900 dark:text-white block">
              Plataforma Oficial Segura Decreto 67 / Circular 30
            </span>
            <span className="text-slate-600 dark:text-slate-400">
              Las calificaciones son ingresadas y firmadas digitalmente por los docentes de asignatura. Los estudiantes tienen acceso exclusivo de consulta para resguardar la fe pública del libro digital.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-500/20">
            <Lock className="w-3 h-3" />
            Notas en Solo Lectura
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. CONTENIDO SEGÚN LA PESTAÑA SELECCIONADA */}
      {/* ========================================================================= */}

      {/* 4.1. PESTAÑA: RESUMEN GENERAL (DASHBOARD COMPLETO) */}
      {activeTab === "resumen" && (
        <div className="space-y-6 sm:space-y-8">
          {/* Tarjetas de Resumen Académico */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <AcademicSummaryCard
              title="Mi Promedio General"
              value={overallAverage}
              subtitle="Rendimiento Oficial Decreto 67"
              badgeLabel={`Nivel: ${currentStudent.courseName}`}
              icon={Award}
              accentColor="purple"
              trend={{ value: "+0.2", isPositive: true }}
              onClick={() => setActiveTab("notas")}
            />

            <AcademicSummaryCard
              title="Asistencia Semestral"
              value={`${currentStudent.overallAttendance}%`}
              subtitle="Meta MINEDUC (85%) cumplida"
              badgeLabel="Registro Oficial SIGE"
              icon={CalendarCheck}
              accentColor="emerald"
              trend={{ value: "+0.5%", isPositive: true }}
              onClick={() => setActiveTab("asistencia")}
            />

            <AcademicSummaryCard
              title="Mis Asignaturas"
              value={subjectsData.length.toString()}
              subtitle={`${subjectsData.filter((s) => s.currentAvg >= 4.0).length} asignaturas al día`}
              badgeLabel="Plan Aprobado"
              icon={BookOpen}
              accentColor="blue"
              onClick={() => setActiveTab("asignaturas")}
            />

            <AcademicSummaryCard
              title="Próxima Evaluación"
              value={upcomingActivities[0]?.date ? upcomingActivities[0].date.split(" ")[0] : "Noviembre"}
              subtitle={upcomingActivities[0]?.subject || subjectsData[0]?.name}
              badgeLabel={upcomingActivities[0]?.time || "09:45 hrs"}
              icon={Calendar}
              accentColor="indigo"
              onClick={() => setActiveTab("notas")}
            />
          </div>

          {/* Cuadrícula Principal: Horario + Evaluaciones + Asignaturas Rápidas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Columna Izquierda (8 cols): Horario de hoy + Próximas actividades */}
            <div className="lg:col-span-8 space-y-6 sm:space-y-8">
              {/* Horario del Día */}
              <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        Horario de Clases de Hoy
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Bloque actual en curso y asignaturas programadas
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("horario")}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ver Semana Completa</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {scheduleToday.map((block) => (
                    <div
                      key={block.id}
                      className={cn(
                        "p-3.5 sm:p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3",
                        block.isCurrent
                          ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 shadow-xs ring-1 ring-indigo-400/30"
                          : block.isPast
                          ? "bg-slate-50/60 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800/60 opacity-60"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                      )}
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div className="text-left shrink-0 font-mono text-xs font-black text-slate-700 dark:text-slate-300 w-28">
                          {block.timeRange}
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                              {block.subject}
                            </span>
                            {block.isCurrent && (
                              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-600 text-white animate-pulse">
                                En Curso
                              </span>
                            )}
                            {block.isPast && (
                              <span className="text-[10px] font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                Finalizado
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                            <span>{block.teacher}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {block.room}
                            </span>
                          </div>
                        </div>
                      </div>

                      {block.isCurrent && (
                        <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 shrink-0 self-start sm:self-auto">
                          Bloque 2 de 4
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Próximas Evaluaciones y Tareas */}
              <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        Próximas Evaluaciones y Entregas
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Fechas fijadas en el calendario oficial de UTP
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-500">
                    {upcomingActivities.length} programadas
                  </span>
                </div>

                <div className="space-y-3">
                  {upcomingActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-extrabold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/60">
                            {act.subject}
                          </span>
                          <span className="text-[11px] font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200">
                            {act.type}
                          </span>
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200">
                            {act.status}
                          </span>
                        </div>

                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          {act.title}
                        </h3>

                        {act.syllabus && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            <strong>Temario:</strong> {act.syllabus}
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{act.date}</span>
                          {act.time && <span>· {act.time}</span>}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveTab("notas")}
                        className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
                      >
                        <span>Ver en Notas</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Columna Derecha (4 cols): Asistencia rápida + Comunicados + Credencial */}
            <div className="lg:col-span-4 space-y-6 sm:space-y-8">
              {/* Tarjeta de Asistencia */}
              <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <CalendarCheck className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      Asistencia Acumulada
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("asistencia")}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Ver Detalle
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                        {currentStudent.overallAttendance}%
                      </span>
                      <span className="text-xs text-slate-400 ml-1.5 font-medium">del semestre</span>
                    </div>
                    <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {currentStudent.overallAttendance >= 85 ? "Meta 85% OK" : "Bajo Umbral 85%"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="relative w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${currentStudent.overallAttendance}%` }} />
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-rose-500 z-10"
                        style={{ left: "85%" }}
                        title="Mínimo legal de aprobación MINEDUC (85%)"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                      <span>0%</span>
                      <span className="text-rose-500 font-black">85% Mínimo</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Presentes</span>
                      <span className="text-base font-black text-emerald-600 font-mono block">46</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Ausencias</span>
                      <span className="text-base font-black text-rose-600 font-mono block">2</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Atrasos</span>
                      <span className="text-base font-black text-amber-600 font-mono block">1</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Comunicados Recientes */}
              <section className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Inbox className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">
                      Comunicados Recientes
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("comunicados")}
                    className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Ver Todos
                  </button>
                </div>

                <div className="space-y-2.5">
                  {communications.slice(0, 2).map((comm) => (
                    <div
                      key={comm.id}
                      onClick={() => {
                        setSelectedCommunication(comm);
                        setActiveTab("comunicados");
                      }}
                      className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 bg-slate-50/50 dark:bg-slate-800/40 transition cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{comm.senderRole}</span>
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

              {/* Acceso Directo a Reglamento Escolar RICE */}
              <section className="p-5 rounded-3xl bg-slate-900 text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-indigo-400">
                  <BookMarked className="w-5 h-5" />
                  <span className="text-xs font-black uppercase tracking-wider">Reglamento Institucional</span>
                </div>
                <h4 className="text-sm font-black">
                  Conoce tus Derechos & Deberes (RICE 2026)
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Consulta las normas de evaluación (Decreto 67), protocolos de mediación formativa y uso de laboratorios técnicos.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("reglamento")}
                  className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Explorar Reglamento RICE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </section>
            </div>
          </div>
        </div>
      )}

      {/* 4.2. PESTAÑA: MIS NOTAS (100% SOLO LECTURA, SEGÚN DECRETO 67) */}
      {activeTab === "notas" && (
        <div className="space-y-6">
          {/* Banner de Sello de Fe Pública y Solo Lectura */}
          <div className="p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-white">
                      Libro de Calificaciones Oficial — Planilla del Estudiante
                    </h2>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Vigente 2026
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Plan de Estudios {currentStudent.courseName} · {currentStudent.specialty} · Escala oficial MINEDUC (1.0 a 7.0) con nota de aprobación 4.0
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-slate-400 font-semibold block">Promedio Semestral</span>
                <span className="text-2xl font-black text-indigo-400 font-mono">{overallAverage}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5 text-xs text-slate-300">
              <Lock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Modo Solo Lectura Verificado:</strong> Los alumnos tienen acceso exclusivo de visualización y consulta. La edición de calificaciones es potestad exclusiva de los profesores acreditados ante el MINEDUC (Decreto 67/2018).
              </span>
            </div>
          </div>

          {/* Tabla de Calificaciones Detalladas por Asignatura */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Desglose por Asignatura (1er Semestre 2026)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Notas parciales sumativas y formativas según ponderación institucional
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Boletín</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-50/50 dark:bg-slate-850/50">
                    <th className="py-3 px-3">Asignatura & Docente</th>
                    <th className="py-3 px-2 text-center">Tipo</th>
                    {["N1", "N2", "N3", "N4", "N5", "N6", "N7"].slice(0, Math.max(4, Math.min(7, Math.max(...subjectsData.map(s => s.grades.length))))).map((colCode) => (
                      <th key={colCode} className="py-3 px-2 text-center">{colCode}</th>
                    ))}
                    <th className="py-3 px-3 text-center">Promedio</th>
                    <th className="py-3 px-2 text-center">Asist.</th>
                    <th className="py-3 px-3 text-right">Situación D.67</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {subjectsData.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                    >
                      {/* Asignatura y Docente */}
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-900 dark:text-white block text-xs sm:text-sm">
                          {sub.name}
                        </span>
                        <span className="text-[11px] text-slate-500 block">
                          {sub.teacher} · {sub.weeklyHours} hrs/sem
                        </span>
                      </td>

                      {/* Tipo de Plan */}
                      <td className="py-3.5 px-2 text-center">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded",
                            sub.category === "Especialidad TP"
                              ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200"
                              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                          )}
                        >
                          {sub.category === "Especialidad TP" ? "TP" : "Común"}
                        </span>
                      </td>

                      {/* Celdas de evaluaciones dinámicas (SOLO LECTURA, SIN INPUTS NI EDICIÓN) */}
                      {["N1", "N2", "N3", "N4", "N5", "N6", "N7"].slice(0, Math.max(4, Math.min(7, Math.max(...subjectsData.map(s => s.grades.length))))).map((colCode) => {
                        const gradeObj = sub.grades.find((g) => g.code === colCode);
                        const val = gradeObj?.value;
                        return (
                          <td
                            key={colCode}
                            className="py-3.5 px-2 text-center font-mono font-bold"
                            title={gradeObj?.label || "Sin evaluación"}
                          >
                            {val !== undefined && val !== null ? (
                              <span
                                className={cn(
                                  "inline-block px-2 py-0.5 rounded font-black text-xs",
                                  val >= 6.0
                                    ? "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/50"
                                    : val >= 5.0
                                    ? "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/50"
                                    : val >= 4.0
                                    ? "text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/50"
                                    : "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/50"
                                )}
                              >
                                {val.toFixed(1)}
                              </span>
                            ) : (
                              <span className="text-slate-300 dark:text-slate-600 font-normal">
                                —
                              </span>
                            )}
                          </td>
                        );
                      })}

                      {/* Promedio Oficial Ponderado */}
                      <td className="py-3.5 px-3 text-center">
                        <span
                          className={cn(
                            "font-mono font-black text-xs px-2.5 py-1 rounded-lg border",
                            sub.currentAvg >= 6.0
                              ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-700"
                              : sub.currentAvg >= 4.0
                              ? "bg-blue-50 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-700"
                              : "bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-700"
                          )}
                        >
                          {sub.currentAvg.toFixed(1)}
                        </span>
                      </td>

                      {/* Asistencia de Asignatura */}
                      <td className="py-3.5 px-2 text-center font-mono text-slate-600 dark:text-slate-400">
                        {sub.attendanceRate.toFixed(1)}%
                      </td>

                      {/* Situación D.67 */}
                      <td className="py-3.5 px-3 text-right">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded",
                            sub.status === "Destacado"
                              ? "text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60"
                              : sub.status === "Aprobando"
                              ? "text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/60"
                              : "text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/60"
                          )}
                        >
                          {sub.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Leyenda y Políticas de Evaluación */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-bold text-slate-700 dark:text-slate-300">Escala de Logro:</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>6.0 - 7.0 Destacado</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>5.0 - 5.9 Adecuado</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>4.0 - 4.9 Elemental</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>&lt; 4.0 Insuficiente</span>
                </span>
              </div>

              <div className="font-semibold text-slate-400">
                Aprobación con promedio ≥ 4.0 y asistencia ≥ 85%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.3. PESTAÑA: ASISTENCIA Y PUNTUALIDAD */}
      {activeTab === "asistencia" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Tarjeta 1: Asistencia Global */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Asistencia Global</span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-black">
                  Sobre la Meta
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-slate-900 dark:text-white font-mono">97.2%</span>
                <span className="text-xs text-slate-400">acumulada</span>
              </div>
              <p className="text-xs text-slate-500">
                Superas con holgura el umbral mínimo del 85% exigido por la normativa MINEDUC para promoción.
              </p>
            </div>

            {/* Tarjeta 2: Días Asistidos */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Días del Semestre</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-emerald-600 font-mono">46</span>
                <span className="text-xs text-slate-400">de 48 jornadas hábiles</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>· 2 inasistencias justificadas</span>
                <span>· 0 injustificadas</span>
              </div>
            </div>

            {/* Tarjeta 3: Puntualidad & Atrasos */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Puntualidad</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-amber-600 font-mono">1</span>
                <span className="text-xs text-slate-400">atraso registrado</span>
              </div>
              <p className="text-xs text-slate-500">
                Hora límite de ingreso a jornada de mañana: 08:00 hrs.
              </p>
            </div>
          </div>

          {/* Módulo de Escaneo QR y Registro por Materias */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda (7 cols): Asistencia por Materia */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    Asistencia Desglosada por Asignatura
                  </h3>
                  <p className="text-xs text-slate-500">
                    Control de presencialidad por bloque pedagógico oficial
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {subjectsData.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-850 border border-slate-200/70 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-0.5">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white block">
                        {sub.name}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {sub.teacher} · {sub.weeklyHours} hrs
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${sub.attendanceRate}%` }}
                        />
                      </div>
                      <span className="font-mono font-black text-xs text-slate-800 dark:text-slate-200 w-12 text-right">
                        {sub.attendanceRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Columna Derecha (5 cols): Escaneo QR & Justificación */}
            <div className="lg:col-span-5 space-y-6">
              {/* Bloque QR de Sala */}
              <div className="p-6 rounded-3xl bg-indigo-600 text-white space-y-4 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                    <QrCode className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="text-base font-black">Escaneo de Asistencia en Sala</h4>
                    <p className="text-xs text-indigo-100">
                      Escanea el código QR proyectado por el profesor en clase
                    </p>
                  </div>
                </div>

                <p className="text-xs text-indigo-100 leading-relaxed">
                  El sistema geolocaliza y valida el aula para asentar tu presencia en el libro de clases digital instantáneamente.
                </p>

                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="w-full py-3 px-4 rounded-xl bg-white text-indigo-900 font-extrabold text-xs hover:bg-indigo-50 transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Abrir Escáner de Aula</span>
                </button>
              </div>

              {/* Justificación de Inasistencias */}
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs space-y-3">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                  <FileCheck2 className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-sm font-black">¿Faltaste a clases?</h4>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Recuerda que tu apoderado debe presentar la justificación o certificado médico dentro de las 48 horas en Inspectoría General para no afectar tu porcentaje de promoción.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab("reglamento")}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver Protocolo de Inasistencias</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4.4. PESTAÑA: COMUNICADOS ESCOLARES */}
      {activeTab === "comunicados" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Comunicaciones & Circulares Oficiales
                </h3>
                <p className="text-xs text-slate-500">
                  Avisos emanados de Dirección, UTP, Convivencia Escolar y Jefatura de Curso
                </p>
              </div>

              {/* Filtros */}
              <div className="flex items-center gap-2">
                {[
                  { id: "all", label: "Todos" },
                  { id: "unread", label: "No Leídos" },
                  { id: "urgent", label: "Urgentes / Circulares" },
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

            {/* Listado de Comunicados */}
            <div className="space-y-3">
              {filteredComms.map((comm) => (
                <div
                  key={comm.id}
                  onClick={() => setSelectedCommunication(comm)}
                  className={cn(
                    "p-4 sm:p-5 rounded-2xl border transition cursor-pointer space-y-2",
                    comm.isUnread
                      ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60"
                      : "bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "text-[10px] font-black uppercase px-2 py-0.5 rounded",
                          comm.department === "Dirección"
                            ? "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200"
                            : comm.department === "UTP"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"
                            : comm.department === "Convivencia"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200"
                        )}
                      >
                        {comm.department}
                      </span>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {comm.sender}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{comm.senderRole}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {comm.isUnread && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      )}
                      <span className="text-xs text-slate-400">{comm.date}</span>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {comm.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {comm.preview}
                  </p>

                  <div className="pt-1 flex items-center justify-between text-xs">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                      <span>Leer Comunicado Completo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                    {comm.hasAttachment && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        <span>Contiene Documento Adjunto</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4.5. PESTAÑA: MIS ASIGNATURAS (NIVEL 1° MEDIO COMPLETO) */}
      {activeTab === "asignaturas" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Plan de Estudios Oficial — {currentStudent.courseName}
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200">
                  {currentStudent.specialty}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {subjectsData.length} asignaturas oficiales distribuidas entre Plan General MINEDUC y Módulos de Especialidad Técnico Profesional
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectsData.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-400 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200">
                          {sub.code}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded",
                            sub.category === "Especialidad TP"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          )}
                        >
                          {sub.category}
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {sub.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-semibold block">Promedio</span>
                      <span className="text-base font-black text-slate-900 dark:text-white font-mono">
                        {sub.currentAvg.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{sub.teacher}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{sub.room} · {sub.weeklyHours} horas semanales</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500">
                      Asistencia: <strong>{sub.attendanceRate.toFixed(1)}%</strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("notas")}
                      className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ver Notas Parciales</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4.6. PESTAÑA: REGLAMENTO ESCOLAR (RICE & DECRETO 67) */}
      {activeTab === "reglamento" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    Reglamento Interno y Convivencia Escolar (RICE 2026)
                  </h3>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Oficial MINEDUC
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Normas de convivencia, evaluación (Decreto 67), deberes, derechos y protocolos escolares
                </p>
              </div>

              {/* Buscador de Artículos */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={riceSearch}
                  onChange={(e) => setRiceSearch(e.target.value)}
                  placeholder="Buscar en el reglamento..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Listado de Artículos */}
            <div className="space-y-4">
              {filteredRice.map((art) => (
                <div
                  key={art.id}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-200/60">
                        {art.articleNumber}
                      </span>
                      <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                        {art.category}
                      </span>
                    </div>
                  </div>

                  <h4 className="text-sm font-black text-slate-900 dark:text-white">
                    {art.title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {art.summary}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/60 dark:border-slate-800 whitespace-pre-line leading-relaxed font-sans">
                    {art.details}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón de Descarga Documento Completo */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-750 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                <div>
                  <span className="font-bold text-xs text-slate-900 dark:text-white block">
                    Documento RICE Institucional Completo (Edición 2026)
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Aprobado por el Consejo Escolar y registrado ante la Superintendencia de Educación.
                  </span>
                </div>
              </div>

              <a
                href="#download-rice"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Descargando Reglamento Interno de Convivencia Escolar LPMM 2026 (PDF)");
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Descargar PDF</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 4.7. PESTAÑA: HORARIO SEMANAL */}
      {activeTab === "horario" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Horario Semanal de Clases (1° Medio A TP)
              </h3>
              <p className="text-xs text-slate-500">
                Jornada Escolar Completa (JEC) · Lunes a Viernes de 08:00 a 16:30 hrs
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-300">
                    <th className="py-2.5 px-2 w-28 text-left">Bloque</th>
                    <th className="py-2.5 px-2">Lunes</th>
                    <th className="py-2.5 px-2">Martes</th>
                    <th className="py-2.5 px-2">Miércoles</th>
                    <th className="py-2.5 px-2">Jueves</th>
                    <th className="py-2.5 px-2">Viernes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {/* Bloque 1 */}
                  <tr>
                    <td className="py-3 px-2 font-mono text-[11px] text-slate-500 text-left">
                      08:00 - 09:30
                    </td>
                    {[0, 1, 2, 3, 4].map((dayIdx) => {
                      const sub = subjectsData[dayIdx % subjectsData.length];
                      return (
                        <td key={dayIdx} className="p-2 bg-blue-50/40 dark:bg-blue-950/20 font-bold text-slate-800 dark:text-slate-200 rounded">
                          {sub.name}<br /><span className="text-[10px] text-slate-400 font-normal">{sub.room}</span>
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] text-slate-400 font-bold">
                    <td colSpan={6} className="py-1">Recreo 15 min (09:30 - 09:45)</td>
                  </tr>

                  {/* Bloque 2 */}
                  <tr>
                    <td className="py-3 px-2 font-mono text-[11px] text-slate-500 text-left">
                      09:45 - 11:15
                    </td>
                    {[5, 6, 7, 8, 9].map((dayIdx) => {
                      const sub = subjectsData[dayIdx % subjectsData.length];
                      return (
                        <td key={dayIdx} className="p-2 bg-purple-50/40 dark:bg-purple-950/20 font-bold text-slate-800 dark:text-slate-200 rounded">
                          {sub.name}<br /><span className="text-[10px] text-slate-400 font-normal">{sub.room}</span>
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="bg-slate-50/50 dark:bg-slate-800/30 text-[10px] text-slate-400 font-bold">
                    <td colSpan={6} className="py-1">Recreo 15 min (11:15 - 11:30)</td>
                  </tr>

                  {/* Bloque 3 */}
                  <tr>
                    <td className="py-3 px-2 font-mono text-[11px] text-slate-500 text-left">
                      11:30 - 13:00
                    </td>
                    {[2, 4, 1, 3, 0].map((dayIdx, i) => {
                      const sub = subjectsData[(dayIdx + 2) % subjectsData.length];
                      return (
                        <td key={i} className="p-2 bg-emerald-50/40 dark:bg-emerald-950/20 font-bold text-slate-800 dark:text-slate-200 rounded">
                          {sub.name}<br /><span className="text-[10px] text-slate-400 font-normal">{sub.room}</span>
                        </td>
                      );
                    })}
                  </tr>

                  <tr className="bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-black">
                    <td colSpan={6} className="py-1.5">Almuerzo Escolar (13:00 - 14:00)</td>
                  </tr>

                  {/* Bloque 4 */}
                  <tr>
                    <td className="py-3 px-2 font-mono text-[11px] text-slate-500 text-left">
                      14:00 - 15:30
                    </td>
                    {[1, 3, 5, 7, 0].map((dayIdx, i) => {
                      const sub = subjectsData[(dayIdx + 4) % subjectsData.length];
                      return (
                        <td key={i} className="p-2 bg-amber-50/40 dark:bg-amber-950/20 font-bold text-slate-800 dark:text-slate-200 rounded">
                          {sub.name}<br /><span className="text-[10px] text-slate-400 font-normal">{sub.room}</span>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODALES INTERACTIVOS DEL ESTUDIANTE */}
      {/* ========================================================================= */}

      {/* 5.1. MODAL: ESCÁNER QR DE ASISTENCIA */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 flex items-center justify-center mx-auto mb-2">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Escáner de Asistencia de Aula
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Apunta la cámara de tu teléfono hacia el código QR de asistencia proyectado en la pizarra del aula:
              </p>
            </div>

            <div className="h-48 rounded-2xl bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden border border-slate-800">
              <div className="w-36 h-36 border-2 border-dashed border-indigo-400 rounded-xl flex items-center justify-center animate-pulse">
                <QrCode className="w-16 h-16 text-indigo-400/80" />
              </div>
              <span className="text-[11px] font-mono text-indigo-300 mt-2">
                Buscando sesión de clase activa en Sala 204...
              </span>
            </div>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setQrScanned(true);
                  setIsQrModalOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Confirmar Presencia en Aula
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5.2. MODAL: CREDENCIAL ESTUDIANTIL OFICIAL */}
      {isCredentialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-sm bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-indigo-500/30 space-y-5">
            <button
              type="button"
              onClick={() => setIsCredentialModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-3 border-b border-indigo-500/30">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span className="text-xs font-black uppercase tracking-wider text-indigo-300">
                  Liceo Politécnico Marga Marga
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">RBD 10240</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-md">
                {activeStudentName.split(" ").map(w => w[0]).slice(0, 2).join("")}
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-indigo-300 uppercase block">Estudiante Regular</span>
                <h4 className="text-sm font-black text-white leading-tight">{activeStudentName}</h4>
                <p className="text-xs text-slate-300 font-mono">RUN: {activeStudentRut}</p>
                <p className="text-[11px] text-slate-400">{activeCourseName}</p>
              </div>
            </div>

            {/* Código QR de la Credencial */}
            <div className="p-3 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center space-y-1">
              <QrCode className="w-24 h-24 text-slate-900" />
              <span className="text-[9px] font-mono text-slate-500 tracking-wider">
                AUTH-LPMM-STD-2026-9481
              </span>
            </div>

            <div className="text-center text-[10px] text-slate-400 font-medium">
              Válida para el año lectivo 2026 · Acreditación oficial ante MINEDUC y JUNAEB
            </div>
          </div>
        </div>
      )}

      {/* 5.3. MODAL: LECTURA COMPLETA DE COMUNICADO */}
      {selectedCommunication && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <button
              type="button"
              onClick={() => setSelectedCommunication(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
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
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5.4. MODAL: CONTACTAR A CONVIVENCIA ESCOLAR / PROFESOR JEFE */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
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
                  Canal Seguro de Convivencia Escolar
                </h3>
                <p className="text-xs text-slate-500">
                  Espacio confidencial para alumnos (Circular 482)
                </p>
              </div>
            </div>

            {supportSent ? (
              <div className="py-6 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  ¡Mensaje Enviado con Confidencialidad!
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  El equipo de Convivencia Escolar y tu Profesor Jefe se contactarán contigo de manera discreta y oportuna.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSupportModalOpen(false);
                      setSupportSent(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                  >
                    Aceptar
                  </button>
                </div>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!supportMessage.trim()) return;
                  setSupportSent(true);
                  setSupportMessage("");
                }}
                className="space-y-4"
              >
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Puedes escribirnos si necesitas apoyo pedagógico, mediación con compañeros, justificación especial o conversar con la psicóloga o trabajadora social del liceo.
                </p>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Mensaje para el Equipo de Convivencia o Profesor Jefe:
                  </label>
                  <textarea
                    rows={4}
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                    placeholder="Cuéntanos brevemente en qué podemos apoyarte..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Enviar Mensaje Confidencial</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
