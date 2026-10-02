"use client";

import React, { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "motion/react";
import {
  QrCode,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Filter,
  CheckCheck,
  Save,
  Lock,
  Sparkles,
  Calendar,
  Building2,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  FileSpreadsheet,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Student {
  studentProfileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  rut: string;
  recordId?: string | null;
  status: "PRESENT" | "LATE" | "ABSENT_JUSTIFIED" | "ABSENT_UNJUSTIFIED" | "PENDING";
  method?: "QR" | "MANUAL" | null;
  justification?: string | null;
  recordedAt?: string | null;
}

interface TeacherAttendancePanelProps {
  schoolSlug: string;
  courses: Array<{ id: string; name: string }>;
  defaultCourseId?: string;
}

export function TeacherAttendancePanel({
  schoolSlug,
  courses,
  defaultCourseId,
}: TeacherAttendancePanelProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    defaultCourseId || courses[0]?.id || "course-lpmm-4e"
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(30);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "REGISTERED">("ALL");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [stats, setStats] = useState({
    total: 0,
    registered: 0,
    pending: 0,
    qrCount: 0,
    manualCount: 0,
  });

  // Modal para ver el QR grande
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  // Iniciar o recuperar sesión
  async function handleStartSession() {
    try {
      setIsLoading(true);
      setMessage(null);
      const res = await fetch("/api/attendance/session/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolSlug,
          courseId: selectedCourseId,
          date: selectedDate,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al iniciar sesión");

      const state = data.sessionState;
      setSessionId(state.sessionId);
      setIsSessionActive(state.status === "ACTIVE");
      setStudents(state.students);
      setStats({
        total: state.totalStudents,
        registered: state.registeredCount,
        pending: state.pendingCount,
        qrCount: state.qrCount,
        manualCount: state.manualCount,
      });

      if (state.qrToken) {
        setQrToken(state.qrToken);
        const url = await QRCode.toDataURL(state.qrToken, {
          width: 320,
          margin: 2,
          color: { dark: "#0f172a", light: "#ffffff" },
        });
        setQrDataUrl(url);
      }
      setCountdown(30);
      setIsQrModalOpen(true);
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Error de conexión" });
    } finally {
      setIsLoading(false);
    }
  }

  // Polling para refrescar la lista de asistencia en tiempo real cuando la sesión está activa
  useEffect(() => {
    if (!isSessionActive || !sessionId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/attendance/session/live?schoolSlug=${schoolSlug}&courseId=${selectedCourseId}&sessionId=${sessionId}&date=${selectedDate}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.sessionState) {
          const state = data.sessionState;
          setStudents(state.students);
          setStats({
            total: state.totalStudents,
            registered: state.registeredCount,
            pending: state.pendingCount,
            qrCount: state.qrCount,
            manualCount: state.manualCount,
          });

          if (state.qrToken) {
            setQrToken(state.qrToken);
            const url = await QRCode.toDataURL(state.qrToken, {
              width: 320,
              margin: 2,
              color: { dark: "#0f172a", light: "#ffffff" },
            });
            setQrDataUrl(url);
          }
        }
      } catch {
        // Silencioso en polling
      }
    }, 5000); // Polling cada 5 segundos

    return () => clearInterval(interval);
  }, [isSessionActive, sessionId, schoolSlug, selectedCourseId, selectedDate]);

  // Temporizador de refresco del QR (cada 30s)
  useEffect(() => {
    if (!isSessionActive) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isSessionActive]);

  // Modificar estado manual de un alumno
  function handleStudentStatusChange(
    studentProfileId: string,
    newStatus: "PRESENT" | "LATE" | "ABSENT_JUSTIFIED" | "ABSENT_UNJUSTIFIED"
  ) {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.studentProfileId === studentProfileId) {
          return {
            ...s,
            status: newStatus,
            method: "MANUAL",
            recordedAt: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
          };
        }
        return s;
      })
    );
  }

  // Marcar todos los pendientes como Presente
  function handleMarkAllPendingPresent() {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.status === "PENDING") {
          return {
            ...s,
            status: "PRESENT",
            method: "MANUAL",
            recordedAt: new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
          };
        }
        return s;
      })
    );
  }

  // Guardar cambios manuales en el servidor
  async function handleSaveManual() {
    try {
      setIsSaving(true);
      setMessage(null);

      const recordsToSave = students
        .filter((s) => s.status !== "PENDING")
        .map((s) => ({
          studentProfileId: s.studentProfileId,
          status: s.status as "PRESENT" | "LATE" | "ABSENT_JUSTIFIED" | "ABSENT_UNJUSTIFIED",
          justification: s.justification || null,
          method: (s.method as "QR" | "MANUAL") || "MANUAL",
        }));

      const res = await fetch("/api/attendance/session/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolSlug,
          courseId: selectedCourseId,
          date: selectedDate,
          records: recordsToSave,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar asistencia");

      setMessage({
        type: "success",
        text: `¡Asistencia guardada exitosamente! ${recordsToSave.length} registros sincronizados.`,
      });

      // Recargar stats
      const regCount = students.filter((s) => s.status !== "PENDING").length;
      const pendCount = students.length - regCount;
      setStats((prev) => ({
        ...prev,
        registered: regCount,
        pending: pendCount,
      }));
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Error al guardar" });
    } finally {
      setIsSaving(false);
    }
  }

  // Finalizar Sesión
  async function handleCloseSession() {
    if (!sessionId) return;
    try {
      setIsLoading(true);
      const res = await fetch("/api/attendance/session/close", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schoolSlug, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al cerrar sesión");

      setIsSessionActive(false);
      setIsQrModalOpen(false);
      setMessage({
        type: "success",
        text: "Sesión de asistencia finalizada correctamente.",
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setIsLoading(false);
    }
  }

  // Filtrar estudiantes para la tabla
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rut.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterStatus === "PENDING") return s.status === "PENDING";
    if (filterStatus === "REGISTERED") return s.status !== "PENDING";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Mensaje de alerta */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl border flex items-center justify-between text-sm font-medium ${
            message.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800/60 dark:text-emerald-300"
              : "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800/60 dark:text-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
            )}
            <span>{message.text}</span>
          </div>
          <button
            onClick={() => setMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </motion.div>
      )}

      {/* Control de Selección de Clase y Controles Principales */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Curso / Asignatura
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                disabled={isSessionActive}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Fecha
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                disabled={isSessionActive}
                className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isSessionActive ? (
              <Button
                onClick={handleStartSession}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-5 py-2.5 shadow-md transition flex items-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Iniciar Asistencia (QR + Manual)</span>
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setIsQrModalOpen(true)}
                  variant="outline"
                  className="rounded-xl border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 flex items-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Ver Código QR</span>
                </Button>

                <Button
                  onClick={handleCloseSession}
                  disabled={isLoading}
                  variant="outline"
                  className="rounded-xl border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Finalizar Sesión</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Métrica de Estado de la Sesión en tiempo real */}
        {isSessionActive && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 block">Total Estudiantes</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {stats.total}
              </span>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/40">
              <span className="text-emerald-700 dark:text-emerald-400 block font-medium">Registrados</span>
              <span className="text-lg font-bold text-emerald-800 dark:text-emerald-300">
                {stats.registered} / {stats.total}
              </span>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-100 dark:border-amber-800/40">
              <span className="text-amber-700 dark:text-amber-400 block font-medium">Pendientes</span>
              <span className="text-lg font-bold text-amber-800 dark:text-amber-300">
                {stats.pending}
              </span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-800/40">
              <span className="text-blue-700 dark:text-blue-400 block font-medium">Escanearon QR</span>
              <span className="text-lg font-bold text-blue-800 dark:text-blue-300">
                {stats.qrCount}
              </span>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800/40">
              <span className="text-indigo-700 dark:text-indigo-400 block font-medium">Registro Manual</span>
              <span className="text-lg font-bold text-indigo-800 dark:text-indigo-300">
                {stats.manualCount}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Card del Código QR para proyectar */}
      <AnimatePresence>
        {isQrModalOpen && qrDataUrl && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center relative"
            >
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2"
              >
                ✕
              </button>

              <div>
                <Badge variant="brand" className="mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Sesión de Asistencia Activa
                </Badge>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Escanea para Asistencia
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Los estudiantes deben abrir AURENIS y escanear este código desde su celular.
                </p>
              </div>

              {/* QR Image */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-inner inline-block relative mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl} alt="Código QR Asistencia" className="w-64 h-64 object-contain" />
              </div>

              {/* Indicadores de seguridad y refresco */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl text-xs space-y-1.5 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Token Anti-Fraude Dinámico
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    Refresco en {countdown}s
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${(countdown / 30) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <span>Registrados: {stats.registered} / {stats.total}</span>
                <span>Pendientes: {stats.pending}</span>
              </div>

              <Button
                onClick={() => setIsQrModalOpen(false)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 font-semibold rounded-xl py-2.5"
              >
                Continuar a la Lista Manual
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tabla de Asistencia Estudiantil (Pase de lista manual + QR integrado) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Lista de Estudiantes — Pase de Lista
            </h3>
            <p className="text-xs text-slate-500">
              Modifica individualmente el estado o registra manualmente a los pendientes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              onClick={handleMarkAllPendingPresent}
              variant="outline"
              size="sm"
              className="rounded-xl border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-xs font-semibold flex items-center gap-1.5"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Marcar Pendientes como Presentes
            </Button>

            <Button
              onClick={handleSaveManual}
              disabled={isSaving}
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl px-4 text-xs shadow-sm flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? "Guardando..." : "Guardar Asistencia"}</span>
            </Button>
          </div>
        </div>

        {/* Búsqueda y Filtros */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por alumno o RUT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setFilterStatus("ALL")}
              className={`px-3 py-1 rounded-lg transition ${
                filterStatus === "ALL"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Todos ({students.length})
            </button>
            <button
              onClick={() => setFilterStatus("PENDING")}
              className={`px-3 py-1 rounded-lg transition ${
                filterStatus === "PENDING"
                  ? "bg-white dark:bg-slate-700 text-amber-700 dark:text-amber-300 shadow-xs font-bold"
                  : "text-slate-500 hover:text-amber-600"
              }`}
            >
              Pendientes ({stats.pending})
            </button>
            <button
              onClick={() => setFilterStatus("REGISTERED")}
              className={`px-3 py-1 rounded-lg transition ${
                filterStatus === "REGISTERED"
                  ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold"
                  : "text-slate-500 hover:text-emerald-600"
              }`}
            >
              Registrados ({stats.registered})
            </button>
          </div>
        </div>

        {/* Tabla Estudiantes */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 py-3">Estudiante</th>
                <th className="px-4 py-3">RUT</th>
                <th className="px-4 py-3">Método</th>
                <th className="px-4 py-3 text-center">Estado de Asistencia</th>
                <th className="px-4 py-3">Hora / Justificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                    No se encontraron estudiantes en este filtro.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((stu) => {
                  return (
                    <tr
                      key={stu.studentProfileId}
                      className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {stu.lastName}, {stu.firstName}
                      </td>
                      <td className="px-4 py-3 text-slate-500 font-mono">{stu.rut}</td>
                      <td className="px-4 py-3">
                        {stu.method === "QR" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <QrCode className="w-3 h-3" /> QR ✓
                          </span>
                        ) : stu.method === "MANUAL" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                            Manual
                          </span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">Sin registro</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleStudentStatusChange(stu.studentProfileId, "PRESENT")}
                            className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition border ${
                              stu.status === "PRESENT"
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                          >
                            Presente
                          </button>

                          <button
                            onClick={() => handleStudentStatusChange(stu.studentProfileId, "LATE")}
                            className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition border ${
                              stu.status === "LATE"
                                ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                                : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-amber-50 hover:text-amber-700"
                            }`}
                          >
                            Atraso
                          </button>

                          <button
                            onClick={() => handleStudentStatusChange(stu.studentProfileId, "ABSENT_JUSTIFIED")}
                            className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition border ${
                              stu.status === "ABSENT_JUSTIFIED"
                                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                                : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-blue-50 hover:text-blue-700"
                            }`}
                          >
                            Justificado
                          </button>

                          <button
                            onClick={() => handleStudentStatusChange(stu.studentProfileId, "ABSENT_UNJUSTIFIED")}
                            className={`px-2.5 py-1 rounded-lg font-semibold text-xs transition border ${
                              stu.status === "ABSENT_UNJUSTIFIED"
                                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                                : "bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-700"
                            }`}
                          >
                            Ausente
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {stu.recordedAt ? (
                          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-300">
                            {stu.recordedAt} hrs
                          </span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
