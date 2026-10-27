"use client";

/**
 * AURENIS - Componente de Generación de Código QR Dinámico para Docentes
 * 
 * Responsabilidades de Equipo:
 * 👑 Maicol R. (Arquitectura & Backend):
 *    - Integración con endpoints de sesión: /api/attendance/session/start, /api/attendance/session/live, /api/attendance/session/close
 *    - Consumo y validación del endpoint /api/attendance/session/scan con tokens firmados y aislamiento multi-tenant
 * 💻 Malcom Marcelo (Frontend Developer & Lógica React):
 *    - Hook de rotación reactiva de tokens, polling en vivo cada 4s, cronómetro de seguridad y simulación de escaneo
 * 🎨 Lucas P. (Diseño UI/UX & Design System):
 *    - Modo Proyector de alta legibilidad (WCAG 2.1 AA), animaciones con motion, micro-estados y feedback visual inmediato
 * 🛡️ Frank M. (QA, Testing & Seguridad):
 *    - Prevención de suplantación mediante tokens rotativos con TTL corto (anti-captura de pantalla), validación de respuestas de auditoría
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  QrCode,
  RefreshCw,
  Clock,
  Users,
  CheckCircle2,
  AlertTriangle,
  X,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Play,
  Square,
  ShieldCheck,
  Sparkles,
  Smartphone,
  ExternalLink,
  ChevronDown,
  UserCheck,
  AlertCircle,
  HelpCircle,
  KeyRound,
  Download,
} from "lucide-react";
import { generateQRMatrix, generateQRSvgPath } from "@/lib/utils/qr-generator";
import { cn } from "@/lib/utils/cn";

export interface DynamicQRAttendanceModalProps {
  schoolSlug: string;
  teacherName?: string;
  isOpen: boolean;
  onClose: () => void;
  defaultCourseId?: string;
  defaultCourseName?: string;
  defaultSubjectId?: string;
}

interface StudentItem {
  studentProfileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  rut: string;
  recordId?: string | null;
  status: "PRESENT" | "LATE" | "ABSENT_JUSTIFIED" | "ABSENT_UNJUSTIFIED" | "PENDING";
  method?: "QR" | "MANUAL" | null;
  recordedAt?: string | null;
}

interface SessionLiveState {
  sessionId: string;
  schoolId: string;
  courseId: string;
  courseName: string;
  subjectId?: string | null;
  teacherUserId: string;
  teacherName: string;
  date: string;
  status: "ACTIVE" | "CLOSED";
  qrToken: string;
  qrExpiresInSeconds: number;
  totalStudents: number;
  registeredCount: number;
  pendingCount: number;
  qrCount: number;
  manualCount: number;
  students: StudentItem[];
}

export const AVAILABLE_COURSES = [
  {
    id: "course-lpmm-4e",
    name: "4° Medio E - Técnico Profesional (Programación)",
    subject: "Diseño de Bases de Datos Relacionales (DBDR)",
    subjectCode: "DBDR-4E",
    studentsTotal: 24,
  },
  {
    id: "course-lpmm-4e-poo",
    name: "4° Medio E - Técnico Profesional (Programación)",
    subject: "Programación Orientada a Objetos (POO)",
    subjectCode: "POO-4E",
    studentsTotal: 24,
  },
  {
    id: "course-lpmm-4e-daw",
    name: "4° Medio E - Técnico Profesional (Programación)",
    subject: "Desarrollo de Aplicaciones Web (DAW)",
    subjectCode: "DAW-4E",
    studentsTotal: 24,
  },
  {
    id: "course-lpmm-3a",
    name: "3° Medio A - Formación General",
    subject: "Matemática Aplicada",
    subjectCode: "MAT-3A",
    studentsTotal: 28,
  },
];

export function DynamicQRAttendanceModal({
  schoolSlug,
  teacherName = "Prof. Eduardo Soto",
  isOpen,
  onClose,
  defaultCourseId = "course-lpmm-4e",
  defaultCourseName = "4° Medio E - Técnico Profesional",
  defaultSubjectId = "DBDR-4E",
}: DynamicQRAttendanceModalProps) {
  // Estado de configuración de la sesión
  const [selectedCourseId, setSelectedCourseId] = useState(defaultCourseId);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Estado de la sesión viva
  const [isStarting, setIsStarting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [sessionState, setSessionState] = useState<SessionLiveState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Temporizador de rotación de token (30 segundos)
  const [secondsLeft, setSecondsLeft] = useState(30);

  // Estado del simulador de escaneo estudiantil (para pruebas y verificación técnica)
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [simulatedResult, setSimulatedResult] = useState<any | null>(null);
  const [selectedStudentForSim, setSelectedStudentForSim] = useState<string>("");

  const modalContainerRef = useRef<HTMLDivElement>(null);

  // Información del curso seleccionado
  const currentCourse = useMemo(() => {
    return (
      AVAILABLE_COURSES.find((c) => c.id === selectedCourseId) || AVAILABLE_COURSES[0]
    );
  }, [selectedCourseId]);

  // URL generada que el QR codifica para los estudiantes
  const scanTargetUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const origin = window.location.origin;
    const token = sessionState?.qrToken || "TOKEN_PENDIENTE";
    return `${origin}/${schoolSlug}/asistencia/escanear?token=${encodeURIComponent(token)}`;
  }, [schoolSlug, sessionState?.qrToken]);

  // Código PIN numérico de respaldo (extraído determinísticamente del token)
  const fallbackPin = useMemo(() => {
    if (!sessionState?.qrToken) return "829-410";
    let hash = 0;
    for (let i = 0; i < sessionState.qrToken.length; i++) {
      hash = (hash * 31 + sessionState.qrToken.charCodeAt(i)) >>> 0;
    }
    const pinNum = (hash % 900000) + 100000;
    return `${pinNum.toString().slice(0, 3)}-${pinNum.toString().slice(3)}`;
  }, [sessionState?.qrToken]);

  // Generación SVG del código QR
  const { svgPaths, viewBoxSize } = useMemo(() => {
    const payload = scanTargetUrl || `AURENIS:ATTENDANCE:${schoolSlug}:${selectedCourseId}`;
    try {
      const matrix = generateQRMatrix(payload);
      return generateQRSvgPath(matrix, 9);
    } catch (e) {
      // Fallback
      const matrix = generateQRMatrix(`AURENIS:${Date.now()}`);
      return generateQRSvgPath(matrix, 9);
    }
  }, [scanTargetUrl, schoolSlug, selectedCourseId]);

  // 1. Iniciar sesión de asistencia
  const handleStartSession = useCallback(async () => {
    try {
      setIsStarting(true);
      setErrorMsg(null);
      setSuccessNotice(null);

      const res = await fetch("/api/attendance/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolSlug,
          courseId: selectedCourseId,
          subjectId: currentCourse.subjectCode,
          date: selectedDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "No se pudo iniciar la sesión de asistencia.");
      }

      setSessionState(data.sessionState);
      setSecondsLeft(30);
      setSuccessNotice("¡Sesión de asistencia QR iniciada y activa!");
    } catch (err: any) {
      console.error("[handleStartSession] Error:", err);
      setErrorMsg(err.message || "Error al iniciar sesión.");
    } finally {
      setIsStarting(false);
    }
  }, [schoolSlug, selectedCourseId, currentCourse.subjectCode, selectedDate]);

  // 2. Refrescar estado en vivo (polling y rotación de token)
  const fetchLiveState = useCallback(async () => {
    if (!sessionState || sessionState.status === "CLOSED") return;

    try {
      const url = `/api/attendance/session/live?schoolSlug=${encodeURIComponent(
        schoolSlug
      )}&courseId=${encodeURIComponent(
        selectedCourseId
      )}&sessionId=${encodeURIComponent(sessionState.sessionId)}&date=${encodeURIComponent(
        selectedDate
      )}`;

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok && data.sessionState) {
        setSessionState(data.sessionState);
      }
    } catch (err) {
      console.warn("[fetchLiveState] Fallo en polling en vivo:", err);
    }
  }, [sessionState, schoolSlug, selectedCourseId, selectedDate]);

  // 3. Finalizar sesión
  const handleCloseSession = async () => {
    if (!sessionState) return;
    try {
      setIsClosing(true);
      setErrorMsg(null);

      const res = await fetch("/api/attendance/session/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionState.sessionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Error al cerrar la sesión.");
      }

      setSessionState((prev) => (prev ? { ...prev, status: "CLOSED" } : null));
      setSuccessNotice("Sesión de asistencia finalizada y guardada en el Libro de Clases.");
    } catch (err: any) {
      setErrorMsg(err.message || "Error al cerrar la sesión.");
    } finally {
      setIsClosing(false);
    }
  };

  // 4. Temporizador de rotación de token (30s) y Polling en vivo cada 3s
  useEffect(() => {
    if (!isOpen || !sessionState || sessionState.status === "CLOSED") return;

    // Intervalo de segundo a segundo para cuenta regresiva
    const timerInterval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          // Token expira, pedir nuevo estado
          fetchLiveState();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    // Polling regular cada 3.5 segundos para reflejar escaneos en vivo
    const pollingInterval = setInterval(() => {
      fetchLiveState();
    }, 3500);

    return () => {
      clearInterval(timerInterval);
      clearInterval(pollingInterval);
    };
  }, [isOpen, sessionState, fetchLiveState]);

  // Iniciar automáticamente la sesión si se abre y no hay una activa
  useEffect(() => {
    if (isOpen && !sessionState) {
      handleStartSession();
    }
  }, [isOpen, sessionState, handleStartSession]);

  // 5. Simular escaneo de estudiante (Verificación del endpoint /api/attendance/session/scan)
  const handleSimulateScan = async (studentId?: string) => {
    if (!sessionState?.qrToken) return;

    try {
      setIsSimulatingScan(true);
      setSimulatedResult(null);
      setErrorMsg(null);

      // Enviamos exactamente el payload que el escáner del estudiante envía a /api/attendance/session/scan
      const res = await fetch("/api/attendance/session/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolSlug,
          qrToken: sessionState.qrToken,
          studentId: studentId || selectedStudentForSim || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Fallo al registrar asistencia mediante QR.");
      }

      setSimulatedResult(data);
      setSuccessNotice(data.message || "¡Asistencia registrada con éxito!");

      // Forzar actualización inmediata de la lista de estudiantes
      await fetchLiveState();
    } catch (err: any) {
      console.error("[handleSimulateScan] Error:", err);
      setErrorMsg(err.message || "Error al procesar escaneo QR.");
    } finally {
      setIsSimulatingScan(false);
    }
  };

  // Copiar URL al portapapeles
  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && scanTargetUrl) {
      navigator.clipboard.writeText(scanTargetUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Toggle de pantalla completa
  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  if (!isOpen) return null;

  const total = sessionState?.totalStudents || currentCourse.studentsTotal;
  const registered = sessionState?.registeredCount || 0;
  const pending = sessionState?.pendingCount ?? total;
  const percentage = Math.round((registered / (total || 1)) * 100);

  return (
    <div
      ref={modalContainerRef}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto transition-all backdrop-blur-md bg-slate-950/80",
        isFullscreen && "p-0 bg-slate-950"
      )}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "w-full max-w-5xl bg-white dark:bg-[#0B132B] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto",
          isFullscreen && "max-w-none h-screen rounded-none border-none"
        )}
      >
        {/* Header de la Modal */}
        <div className="px-5 py-4 sm:px-6 sm:py-5 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300">
                  Libro Digital AURENIS
                </span>
                <span className="text-xs font-mono text-slate-500">
                  RBD 10240 · 2026
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                Asistencia QR Dinámica en Vivo
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
              title={isFullscreen ? "Salir de pantalla completa" : "Modo Proyector de Aula"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
              title="Cerrar ventana"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notificaciones y Errores */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successNotice && (
          <div className="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessNotice(null)}
              className="text-xs hover:underline opacity-80"
            >
              Entendido
            </button>
          </div>
        )}

        {/* Selector de Curso y Parámetros */}
        <div className="px-5 py-3 sm:px-6 sm:py-3.5 bg-slate-100/60 dark:bg-slate-900/40 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-600 dark:text-slate-400">
                Curso / Módulo:
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setSessionState(null); // Reiniciar estado al cambiar de curso
                }}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-1.5 font-bold text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {AVAILABLE_COURSES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} · {c.subjectCode}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-600 dark:text-slate-400">
                Fecha:
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSessionState(null);
                }}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-2.5 py-1.5 font-mono text-slate-900 dark:text-white text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              Docente: <strong className="text-slate-900 dark:text-white">{teacherName}</strong>
            </span>
            {sessionState?.status === "ACTIVE" ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping mr-1" />
                Sesión Activa
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                Inactiva
              </span>
            )}
          </div>
        </div>

        {/* Cuerpo Principal: Dos Columnas (QR Dinámico + Nómina en Vivo) */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-y-auto">
          {/* Columna Izquierda: Código QR Dinámico & Controles de Seguridad (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between gap-5 bg-slate-50/80 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 text-center">
            {/* Header del QR */}
            <div className="w-full space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-wider border border-indigo-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Anti-Fraude · Token Rotativo JWT</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {currentCourse.subject}
              </h3>
              <p className="text-xs text-slate-500">
                Los alumnos deben escanear este código desde la app AURENIS
              </p>
            </div>

            {/* Visualizador del Código QR Vectorial */}
            <div className="relative p-4 sm:p-5 bg-white rounded-3xl shadow-xl border-4 border-slate-900 dark:border-indigo-500/40 flex flex-col items-center justify-center">
              <svg
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                className="w-56 h-56 sm:w-64 sm:h-64 transition-all duration-300"
                shapeRendering="crispEdges"
              >
                <path d={svgPaths} fill="#0F172A" />
              </svg>

              {/* Insignia central AURENIS */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-lg font-black text-xs">
                  AU
                </div>
              </div>
            </div>

            {/* Indicador de Rotación de Token & Cuenta Regresiva */}
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold px-2 text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  Rotación de Seguridad:
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">
                  {secondsLeft}s restantes
                </span>
              </div>

              {/* Barra de progreso de cuenta regresiva */}
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500"
                  animate={{ width: `${(secondsLeft / 30) * 100}%` }}
                  transition={{ ease: "linear", duration: 1 }}
                />
              </div>

              {/* Código PIN de Respaldo */}
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-left">
                  <KeyRound className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Código PIN de Respaldo:
                    </span>
                    <span className="font-mono font-black text-slate-900 dark:text-white tracking-widest text-sm">
                      {fallbackPin}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 max-w-[130px] text-right">
                  Para alumnos con fallas de cámara
                </span>
              </div>

              {/* Botón para Copiar Enlace Directo */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span>¡Enlace de Escaneo Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>Copiar Enlace Directo para Alumnos</span>
                  </>
                )}
              </button>
            </div>

            {/* Controles de la Sesión: Iniciar / Finalizar */}
            <div className="w-full pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-3">
              {sessionState?.status === "ACTIVE" ? (
                <button
                  type="button"
                  onClick={handleCloseSession}
                  disabled={isClosing}
                  className="w-full py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-rose-600/20 disabled:opacity-50"
                >
                  <Square className="w-4 h-4" />
                  <span>{isClosing ? "Guardando..." : "Cerrar y Finalizar Asistencia"}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStartSession}
                  disabled={isStarting}
                  className="w-full py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  <Play className="w-4 h-4" />
                  <span>{isStarting ? "Iniciando..." : "Iniciar Asistencia QR"}</span>
                </button>
              )}
            </div>
          </div>

          {/* Columna Derecha: Panel de Estadísticas en Vivo y Nómina (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-5">
            {/* Tarjetas de Métricas Rápidas */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 text-center">
                <span className="text-[10px] font-black uppercase text-slate-500 block">
                  Matriculados
                </span>
                <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                  {total}
                </span>
                <span className="text-[11px] text-slate-500 block">en nómina</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">
                  Presentes (QR)
                </span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {registered}
                </span>
                <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 block">
                  {percentage}% asistencia
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
                <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 block">
                  Pendientes
                </span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                  {pending}
                </span>
                <span className="text-[11px] text-amber-600/80 dark:text-amber-400/80 block">
                  por escanear
                </span>
              </div>
            </div>

            {/* Barra de Progreso de Asistencia */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  Progreso de Asistencia del Bloque
                </span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 font-black">
                  {percentage}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500"
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Simulador Técnico de Escaneo (Prueba activa del endpoint /api/attendance/session/scan) */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-indigo-900 dark:text-indigo-200">
                    Simulador de Escaneo · /api/attendance/session/scan
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-200/60 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                  Prueba Técnica
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Permite enviar una petición real de escaneo al endpoint del backend para registrar la presencia de un estudiante seleccionado.
              </p>

              <div className="flex items-center gap-2 pt-1">
                <select
                  value={selectedStudentForSim}
                  onChange={(e) => setSelectedStudentForSim(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none"
                >
                  <option value="">-- Seleccionar Alumno para Simular Escaneo --</option>
                  {(sessionState?.students || []).map((stu) => (
                    <option key={stu.studentProfileId} value={stu.userId}>
                      {stu.lastName}, {stu.firstName} ({stu.status === "PRESENT" ? "Ya Presente" : "Pendiente"})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleSimulateScan()}
                  disabled={isSimulatingScan || !sessionState?.qrToken}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm disabled:opacity-50 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSimulatingScan ? "Escaneando..." : "Simular Escaneo"}</span>
                </button>
              </div>

              {simulatedResult && (
                <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
                  <span>✔ Servidor: {simulatedResult.message}</span>
                  <span className="text-[10px] text-slate-400">
                    Hora: {simulatedResult.recordedAt || "Ahora"}
                  </span>
                </div>
              )}
            </div>

            {/* Nómina de Alumnos en Vivo */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden flex flex-col flex-1">
              <div className="px-4 py-3 bg-slate-100/70 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-500" />
                  Nómina del Curso · Registro en Tiempo Real
                </h4>
                <button
                  type="button"
                  onClick={fetchLiveState}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Actualizar</span>
                </button>
              </div>

              <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900/40">
                {(sessionState?.students || []).length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Inicia la sesión para cargar la nómina de estudiantes matriculados.
                  </div>
                ) : (
                  (sessionState?.students || []).map((stu, idx) => {
                    const isPresent = stu.status === "PRESENT";
                    const isLate = stu.status === "LATE";
                    const isPending = stu.status === "PENDING" || !stu.status;

                    return (
                      <div
                        key={stu.studentProfileId || idx}
                        className="px-4 py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 text-slate-400 font-mono text-[11px] text-right">
                            {idx + 1}.
                          </span>
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">
                              {stu.lastName}, {stu.firstName}
                            </span>
                            <span className="text-[11px] font-mono text-slate-500">
                              {stu.rut}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {isPresent ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>Presente (QR)</span>
                              {stu.recordedAt && (
                                <span className="font-mono text-[10px] text-emerald-600/80 ml-1">
                                  {stu.recordedAt}
                                </span>
                              )}
                            </span>
                          ) : isLate ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              <span>Atraso ({stu.recordedAt})</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>Pendiente</span>
                            </span>
                          )}

                          {isPending && (
                            <button
                              type="button"
                              onClick={() => handleSimulateScan(stu.userId)}
                              title="Simular escaneo QR de este estudiante"
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-indigo-950/60 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-[10px] font-bold transition"
                            >
                              Escanear
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Informativo de Cumplimiento Normativo */}
        <div className="px-5 py-3 sm:px-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>
              Cumple con Circular 482 MINEDUC y Decreto 67: Asistencia Digital Auditada con Hash Criptográfico.
            </span>
          </div>
          <div className="font-mono text-[10px] text-slate-400">
            AURENIS Multi-Tenant Engine · School ID: {schoolSlug}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
