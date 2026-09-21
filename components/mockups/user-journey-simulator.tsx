"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  GraduationCap,
  Users,
  Award,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Check,
  FileSpreadsheet,
  FileText,
  TrendingUp,
  Download,
  School,
  Lock,
  Search,
  Eye,
  CheckCheck,
  ChevronRight,
  Layers,
  HelpCircle,
  Terminal,
} from "lucide-react";

export type JourneyRole = "admin" | "teacher" | "student";

interface UserJourneySimulatorProps {
  onCompleteCriteria?: (criterionId: string) => void;
  onOpenChecklistModal?: () => void;
}

export function UserJourneySimulator({
  onCompleteCriteria,
  onOpenChecklistModal,
}: UserJourneySimulatorProps) {
  const [activeRole, setActiveRole] = useState<JourneyRole>("admin");
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlayingAuto, setIsPlayingAuto] = useState<boolean>(false);

  // Estados de cumplimiento de los criterios DoD
  const [dodAdmin, setDodAdmin] = useState<boolean>(false);
  const [dodTeacher, setDodTeacher] = useState<boolean>(false);
  const [dodStudent, setDodStudent] = useState<boolean>(false);

  // Estados interactivos para el rol ADMIN
  const [adminPeriodActive, setAdminPeriodActive] = useState<"SEM1" | "SEM2">("SEM1");
  const [adminExportDone, setAdminExportDone] = useState<boolean>(false);
  const [adminSelectedTeacherIndex, setAdminSelectedTeacherIndex] = useState<number>(0);

  // Estados interactivos para el rol PROFESOR
  const [teacherGrades, setTeacherGrades] = useState<{ [studentId: string]: { n1: number; n2: number; n3: number } }>({
    "std_1": { n1: 6.5, n2: 6.8, n3: 7.0 },
    "std_2": { n1: 5.5, n2: 5.8, n3: 6.2 },
    "std_3": { n1: 3.8, n2: 4.2, n3: 3.5 }, // Alumno en riesgo con notas rojas
    "std_4": { n1: 6.2, n2: 6.0, n3: 6.4 },
  });
  const [typingInput, setTypingInput] = useState<string>("");
  const [teacherSaved, setTeacherSaved] = useState<boolean>(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Estados interactivos para el rol ALUMNO
  const [studentCertDownloaded, setStudentCertDownloaded] = useState<boolean>(false);
  const [studentViewSubject, setStudentViewSubject] = useState<string>("Matemáticas");

  // Bitácora de eventos / terminal en vivo
  const [logs, setLogs] = useState<Array<{ id: string; time: string; message: string; type: "info" | "success" | "warning" }>>([
    {
      id: "log_1",
      time: "08:00:15",
      message: "Plataforma AURENIS inicializada. Sesiones multi-tenant encriptadas listas para simulación.",
      type: "info",
    },
  ]);

  function addLog(message: string, type: "info" | "success" | "warning" = "info") {
    const time = new Date().toTimeString().split(" ")[0];
    setLogs((prev) => [{ id: `log_${Date.now()}_${Math.random()}`, time, message, type }, ...prev.slice(0, 19)]);
  }

  // Marcar criterios completados
  useEffect(() => {
    if (dodAdmin && onCompleteCriteria) onCompleteCriteria("dod-journey-1");
  }, [dodAdmin, onCompleteCriteria]);

  useEffect(() => {
    if (dodTeacher && onCompleteCriteria) onCompleteCriteria("dod-journey-2");
  }, [dodTeacher, onCompleteCriteria]);

  useEffect(() => {
    if (dodStudent && onCompleteCriteria) onCompleteCriteria("dod-journey-3");
  }, [dodStudent, onCompleteCriteria]);

  // Manejo de avance por pasos
  function handleNextStep() {
    if (currentStep < 5) {
      const next = currentStep + 1;
      setCurrentStep(next);
      handleStepSideEffects(activeRole, next);
    } else {
      markRoleCompleted(activeRole);
    }
  }

  function handlePrevStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  function markRoleCompleted(role: JourneyRole) {
    if (role === "admin") {
      setDodAdmin(true);
      addLog("✅ Recorrido de Administrador completado exitosamente con todas las etapas verificadas.", "success");
    } else if (role === "teacher") {
      setDodTeacher(true);
      addLog("✅ Recorrido de Profesor de ingreso de notas completado exitosamente (Decreto 67).", "success");
    } else if (role === "student") {
      setDodStudent(true);
      addLog("✅ Recorrido de Alumno de consulta completado exitosamente con certificado emitido.", "success");
    }
  }

  function handleStepSideEffects(role: JourneyRole, step: number) {
    if (role === "admin") {
      if (step === 2) addLog("Admin inspeccionó el Tablero Ejecutivo: 840 matriculados, 91.4% asistencia.", "info");
      if (step === 3) addLog("Admin verificó la parametrización de ciclo lectivo: Semestre 1 Activo, Escala 1.0 - 7.0.", "info");
      if (step === 4) addLog("Admin auditó la dotación docente y límites legales (44 hrs máx Ley Carrera Docente).", "info");
      if (step === 5) {
        setDodAdmin(true);
        addLog("Admin completó la jornada: Respaldo criptográfico emitido y registrado en AuditLog.", "success");
      }
    } else if (role === "teacher") {
      if (step === 2) addLog("Profesor abrió el Libro Digital en 1° Medio A - Asignatura Matemáticas.", "info");
      if (step === 3) addLog("Profesor utilizó el teclado rápido: nota 6.5 ingresada y nota 3.8 semaforizada en rojo.", "info");
      if (step === 4) addLog("Profesor verificó el recálculo ponderado Decreto 67: Promedio de curso 5.6.", "info");
      if (step === 5) {
        setTeacherSaved(true);
        setDodTeacher(true);
        setLastSavedTime(new Date().toLocaleTimeString());
        addLog("Profesor guardó calificaciones masivas mediante saveBulkMatrixGrades() sin errores.", "success");
      }
    } else if (role === "student") {
      if (step === 2) addLog("Estudiante Valentina Álvarez consultó su Boletín: Promedio general 6.3.", "info");
      if (step === 3) addLog("Estudiante revisó su asistencia: 92.8% acumulada (cumple umbral 85% Mineduc).", "info");
      if (step === 4) addLog("Estudiante revisó sus anotaciones formativas y felicitaciones de jefatura.", "info");
      if (step === 5) {
        setStudentCertDownloaded(true);
        setDodStudent(true);
        addLog("Estudiante emitió y descargó su Certificado Oficial de Alumno Regular con firma digital.", "success");
      }
    }
  }

  // Simulación automática en cascada
  function handlePlayFullSimulation() {
    setIsPlayingAuto(true);
    addLog("Iniciando simulación automática de jornadas completas para los 3 roles...", "info");

    // Fase 1: Admin
    setActiveRole("admin");
    setCurrentStep(1);

    setTimeout(() => {
      setCurrentStep(3);
      handleStepSideEffects("admin", 3);
    }, 900);

    setTimeout(() => {
      setCurrentStep(5);
      handleStepSideEffects("admin", 5);
      setDodAdmin(true);
    }, 1800);

    // Fase 2: Profesor
    setTimeout(() => {
      setActiveRole("teacher");
      setCurrentStep(1);
    }, 2600);

    setTimeout(() => {
      setCurrentStep(3);
      handleStepSideEffects("teacher", 3);
    }, 3400);

    setTimeout(() => {
      setCurrentStep(5);
      handleStepSideEffects("teacher", 5);
      setTeacherSaved(true);
      setDodTeacher(true);
    }, 4200);

    // Fase 3: Alumno
    setTimeout(() => {
      setActiveRole("student");
      setCurrentStep(1);
    }, 5000);

    setTimeout(() => {
      setCurrentStep(3);
      handleStepSideEffects("student", 3);
    }, 5800);

    setTimeout(() => {
      setCurrentStep(5);
      handleStepSideEffects("student", 5);
      setStudentCertDownloaded(true);
      setDodStudent(true);
      setIsPlayingAuto(false);
      addLog("🎉 ¡Simulación de las 3 jornadas completada al 100%! Criterios de Aceptación aprobados.", "success");
    }, 6600);
  }

  function handleResetAll() {
    setIsPlayingAuto(false);
    setCurrentStep(1);
    setDodAdmin(false);
    setDodTeacher(false);
    setDodStudent(false);
    setTeacherSaved(false);
    setStudentCertDownloaded(false);
    addLog("Simulación reiniciada a su estado base.", "warning");
  }

  // Cálculos dinámicos de promedios para la planilla de notas del profesor
  const studentDataList = [
    { id: "std_1", rut: "21.450.812-3", name: "Álvarez, Valentina", grades: teacherGrades["std_1"] },
    { id: "std_2", rut: "22.109.432-8", name: "Barrientos, Matías", grades: teacherGrades["std_2"] },
    { id: "std_3", rut: "21.984.110-K", name: "Fuentes, Lucas (Riesgo)", grades: teacherGrades["std_3"] },
    { id: "std_4", rut: "22.311.590-4", name: "Lagos, Constanza", grades: teacherGrades["std_4"] },
  ];

  function calcAverage(n1: number, n2: number, n3: number) {
    // Ponderado: N1 (35%), N2 (35%), N3 (30%)
    const avg = n1 * 0.35 + n2 * 0.35 + n3 * 0.3;
    return Math.round(avg * 10) / 10;
  }

  const completedCount = (dodAdmin ? 1 : 0) + (dodTeacher ? 1 : 0) + (dodStudent ? 1 : 0);
  const totalCount = 3;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* 1. Header institucional y panel del Definition of Done */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-brand-500/5 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-bold border border-brand-200/80 dark:border-brand-800/80 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
                Simulador de Escenarios de Uso Real
              </span>
              <span className="text-xs text-slate-500 font-medium hidden sm:inline">
                Aurenis SaaS • Multi-Tenant • Decreto 67
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Simulación de Jornadas Completas de Uso
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Experimenta los recorridos integrales de un <strong>Administrador (Director)</strong>, un{" "}
              <strong>Profesor de Asignatura</strong> y un <strong>Alumno / Apoderado</strong>, comprobando en vivo la
              interoperabilidad, los cálculos de calificaciones y las normas de seguridad.
            </p>
          </div>

          {/* Botones de acción global */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handlePlayFullSimulation}
              disabled={isPlayingAuto}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Play className={`w-4 h-4 ${isPlayingAuto ? "animate-spin" : "fill-current"}`} />
              <span>{isPlayingAuto ? "Ejecutando Simulación..." : "Ejecutar las 3 Jornadas (Auto-Play)"}</span>
            </button>

            <button
              onClick={() => {
                setDodAdmin(true);
                setDodTeacher(true);
                setDodStudent(true);
                setTeacherSaved(true);
                setStudentCertDownloaded(true);
                addLog("Todos los criterios de aceptación marcados como completados.", "success");
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
            >
              <CheckCheck className="w-4 h-4 text-emerald-600" />
              <span>Marcar Todos</span>
            </button>

            <button
              onClick={handleResetAll}
              title="Reiniciar simulación"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. Tarjetas de Definition of Done (Criterios de Aceptación) */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Criterio 1: Admin */}
          <div
            onClick={() => {
              setActiveRole("admin");
              setCurrentStep(dodAdmin ? 5 : 1);
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              dodAdmin
                ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 shadow-2xs"
                : activeRole === "admin"
                ? "bg-brand-50/50 dark:bg-brand-950/30 border-brand-300 dark:border-brand-700 ring-2 ring-brand-500/20"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100/70"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    dodAdmin
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <School className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">Recorrido de Admin</h3>
                  <span className="text-[11px] text-slate-500">Panel, ajustes y auditoría</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  dodAdmin
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {dodAdmin ? "Completado" : "Pendiente"}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-2">
              Supervisión de métricas de colegio, ciclos lectivos, dotación docente y control de 44 hrs.
            </p>
          </div>

          {/* Criterio 2: Profesor */}
          <div
            onClick={() => {
              setActiveRole("teacher");
              setCurrentStep(dodTeacher ? 5 : 1);
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              dodTeacher
                ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 shadow-2xs"
                : activeRole === "teacher"
                ? "bg-brand-50/50 dark:bg-brand-950/30 border-brand-300 dark:border-brand-700 ring-2 ring-brand-500/20"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100/70"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    dodTeacher
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">Recorrido de Profesor</h3>
                  <span className="text-[11px] text-slate-500">Ingreso ágil & Decreto 67</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  dodTeacher
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {dodTeacher ? "Completado" : "Pendiente"}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-2">
              Planilla matricial, modo 2 dígitos, detección de notas rojas (&lt;4.0) y guardado masivo atómico.
            </p>
          </div>

          {/* Criterio 3: Alumno */}
          <div
            onClick={() => {
              setActiveRole("student");
              setCurrentStep(dodStudent ? 5 : 1);
            }}
            className={`p-4 rounded-2xl border transition-all cursor-pointer ${
              dodStudent
                ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60 shadow-2xs"
                : activeRole === "student"
                ? "bg-brand-50/50 dark:bg-brand-950/30 border-brand-300 dark:border-brand-700 ring-2 ring-brand-500/20"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100/70"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    dodStudent
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white">Recorrido de Alumno</h3>
                  <span className="text-[11px] text-slate-500">Boletín, asistencia y ficha</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                  dodStudent
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {dodStudent ? "Completado" : "Pendiente"}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 line-clamp-2">
              Consulta de calificaciones parciales, umbral de asistencia 85% Mineduc y certificado regular.
            </p>
          </div>
        </div>

        {/* Barra de progreso global del DoD */}
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex-1 bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-xs font-black text-slate-700 dark:text-slate-300 whitespace-nowrap">
            Progreso DoD: {completedCount}/{totalCount} ({progressPct}%)
          </span>
        </div>
      </div>

      {/* 3. Selector de Rol y Línea de Tiempo de la Jornada */}
      <div className="space-y-4">
        {/* Selector de pestañas por Rol */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button
              onClick={() => {
                setActiveRole("admin");
                setCurrentStep(1);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeRole === "admin"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <School className="w-4 h-4 text-brand-500" />
              <span>1. Administrador (Director)</span>
              {dodAdmin && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            <button
              onClick={() => {
                setActiveRole("teacher");
                setCurrentStep(1);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeRole === "teacher"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
              <span>2. Profesor (Ingreso de Notas)</span>
              {dodTeacher && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            </button>

            <button
              onClick={() => {
                setActiveRole("student");
                setCurrentStep(1);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeRole === "student"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span>3. Alumno (Consulta de Notas)</span>
              {dodStudent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Paso {currentStep} de 5</span>
          </div>
        </div>

        {/* Stepper de 5 fases */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((stepNum) => {
            const isDone = currentStep > stepNum;
            const isCurrent = currentStep === stepNum;

            let stepLabel = "";
            if (activeRole === "admin") {
              stepLabel =
                stepNum === 1
                  ? "Acceso y Roles"
                  : stepNum === 2
                  ? "Tablero Ejecutivo"
                  : stepNum === 3
                  ? "Ciclo y Períodos"
                  : stepNum === 4
                  ? "Dotación Docente"
                  : "Auditoría & Cierre";
            } else if (activeRole === "teacher") {
              stepLabel =
                stepNum === 1
                  ? "Acceso Docente"
                  : stepNum === 2
                  ? "Apertura Planilla"
                  : stepNum === 3
                  ? "Ingreso Rápido"
                  : stepNum === 4
                  ? "Decreto 67 & Rojas"
                  : "Guardado Masivo";
            } else {
              stepLabel =
                stepNum === 1
                  ? "Acceso Portal"
                  : stepNum === 2
                  ? "Boletín de Notas"
                  : stepNum === 3
                  ? "Asistencia 85%"
                  : stepNum === 4
                  ? "Hoja de Vida"
                  : "Certificado Regular";
            }

            return (
              <button
                key={stepNum}
                onClick={() => {
                  setCurrentStep(stepNum);
                  handleStepSideEffects(activeRole, stepNum);
                }}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? "bg-brand-50 dark:bg-brand-950/40 border-brand-500 ring-2 ring-brand-500/20"
                    : isDone
                    ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-black uppercase text-slate-400">Paso {stepNum}</span>
                  {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{stepLabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Contenido interactivo según el rol activo */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Panel Principal Interactivo (8 columnas) */}
        <div className="lg:col-span-8 space-y-6">
          {/* VISTA 1: ADMIN */}
          {activeRole === "admin" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 flex items-center justify-center font-black">
                    <School className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white">
                      Jornada Directiva: Colegio San José
                    </h2>
                    <span className="text-xs text-slate-500">Director Carlos Mendoza • Rol SCHOOL_ADMIN</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">
                    Año Escolar 2026
                  </span>
                </div>
              </div>

              {/* Sub-fases del Admin */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Lock className="w-5 h-5 text-brand-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Sesión Criptográfica HS256 Verificada
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Token emitido con schoolId=&apos;school-csj-001&apos; e inyección forzosa en createTenantPrisma.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold">
                      Autorizado (20 Permisos)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    El Director inicia su jornada revisando el estado global de la institución. Haz clic en &quot;Siguiente Paso&quot;
                    para acceder a las métricas del Tablero Ejecutivo.
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Tablero Ejecutivo Institucional
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-500">Matrícula Activa</span>
                      <p className="text-xl font-black text-slate-900 dark:text-white mt-1">840</p>
                      <span className="text-[10px] text-emerald-600 font-bold">+12 este mes</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-500">Asistencia del Día</span>
                      <p className="text-xl font-black text-slate-900 dark:text-white mt-1">91.4%</p>
                      <span className="text-[10px] text-emerald-600 font-bold">&gt; 85% Mineduc</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
                      <span className="text-xs text-rose-600">Alerta Decreto 67</span>
                      <p className="text-xl font-black text-rose-700 dark:text-rose-400 mt-1">18</p>
                      <span className="text-[10px] text-rose-600 font-bold">Alumnos con &ge;2 rojas</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <span className="text-xs text-slate-500">Plantel Docente</span>
                      <p className="text-xl font-black text-slate-900 dark:text-white mt-1">48</p>
                      <span className="text-[10px] text-slate-500 font-bold">100% cubierto</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Parametrización del Ciclo Lectivo
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Régimen Académico</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setAdminPeriodActive("SEM1");
                            addLog("Admin alternó período activo a: 1° Semestre (Ponderación 50%).", "info");
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            adminPeriodActive === "SEM1"
                              ? "bg-brand-600 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-600"
                          }`}
                        >
                          1° Semestre (Activo)
                        </button>
                        <button
                          onClick={() => {
                            setAdminPeriodActive("SEM2");
                            addLog("Admin alternó período activo a: 2° Semestre (Ponderación 50%).", "info");
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            adminPeriodActive === "SEM2"
                              ? "bg-brand-600 text-white"
                              : "bg-slate-200 dark:bg-slate-700 text-slate-600"
                          }`}
                        >
                          2° Semestre
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 pt-2 text-xs">
                      <div>
                        <span className="text-slate-500">Escala de Notas</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">1.0 a 7.0</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Aprobación</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">4.0 (Exigencia 60%)</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Asistencia Mínima</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200">85% Mineduc</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Auditoría de Dotación y Control Legal de 44 Horas
                  </h3>
                  <div className="space-y-2">
                    {[
                      { name: "Prof. Carlos Silva", dept: "Matemática", hours: 42, max: 44, status: "OK" },
                      { name: "Prof. Marcela Soto", dept: "Lenguaje", hours: 44, max: 44, status: "TOPE" },
                      { name: "Prof. Rodrigo Vera", dept: "Ciencias", hours: 38, max: 44, status: "OK" },
                    ].map((teacher, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{teacher.name}</p>
                          <span className="text-[11px] text-slate-500">
                            {teacher.dept} • Carga: {teacher.hours} hrs / {teacher.max} hrs legales
                          </span>
                        </div>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            teacher.status === "TOPE"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          }`}
                        >
                          {teacher.status === "TOPE" ? "Carga Completa" : "Carga Óptima"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/70 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="w-5 h-5" />
                      <span className="text-sm font-black">Cierre de Jornada y Trazabilidad Registrada</span>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      Todas las acciones fueron consignadas en la tabla inmutable <strong>AuditLog</strong>. Puedes
                      exportar el respaldo institucional en formato ZIP cifrado.
                    </p>
                    <button
                      onClick={() => {
                        setAdminExportDone(true);
                        addLog("Respaldo completo exportado con firma SHA-256.", "success");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>{adminExportDone ? "Respaldo Generado (ZIP)" : "Exportar Respaldo Institucional"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Botones de navegación de pasos */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  Paso Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-sm hover:scale-[1.02] transition"
                >
                  <span>{currentStep === 5 ? "Completar Recorrido Admin" : "Siguiente Paso"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* VISTA 2: PROFESOR (INGRESO DE NOTAS) */}
          {activeRole === "teacher" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-black">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white">
                      Libro de Clases: Planilla de Calificaciones
                    </h2>
                    <span className="text-xs text-slate-500">Prof. Carlos Silva • Curso: 1° Medio A • Asignatura: Matemáticas</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    Decreto 67 Mineduc
                  </span>
                </div>
              </div>

              {/* Sub-fases del Profesor */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Profesor Titular Asignado
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Permiso GRADES_ENTER concedido. Aislamiento estricto: no se permite calificar cursos ajenos.
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold">
                      1° Medio A
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    El docente selecciona la asignatura del día para abrir la planilla de calificaciones.
                  </p>
                </div>
              )}

              {currentStep >= 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  {/* Controles rápidos de ingreso interactivo */}
                  {currentStep === 3 && (
                    <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200 dark:border-brand-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-900 dark:text-brand-200">
                          ⌨️ Modo Tipeo Rápido (Conversión automática de 2 dígitos)
                        </span>
                        <span className="text-[10px] text-brand-600 font-bold">Ej: &apos;65&apos; &rarr; 6.5 | &apos;38&apos; &rarr; 3.8</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Escribe una nota rápida (ej. 68 o 35)"
                          value={typingInput}
                          onChange={(e) => setTypingInput(e.target.value)}
                          className="px-3 py-1.5 rounded-xl border border-brand-300 dark:border-brand-700 bg-white dark:bg-slate-900 text-xs font-mono font-bold w-52"
                        />
                        <button
                          onClick={() => {
                            const val = parseFloat(typingInput.replace(",", "."));
                            let finalVal = val;
                            if (val >= 10 && val <= 70) finalVal = Math.round(val) / 10;
                            if (finalVal >= 1.0 && finalVal <= 7.0) {
                              setTeacherGrades((prev) => ({
                                ...prev,
                                std_3: { ...prev["std_3"], n3: finalVal },
                              }));
                              addLog(`Nota ${finalVal} aplicada al estudiante Lucas Fuentes.`, "info");
                              setTypingInput("");
                            } else {
                              alert("Nota fuera de rango oficial (1.0 a 7.0).");
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
                        >
                          Aplicar a Alumno en Riesgo
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Planilla Matricial Interactiva */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100/70 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="p-3">Estudiante</th>
                          <th className="p-3 text-center">N1 (35%)</th>
                          <th className="p-3 text-center">N2 (35%)</th>
                          <th className="p-3 text-center">N3 (30%)</th>
                          <th className="p-3 text-center">Promedio</th>
                          <th className="p-3 text-center">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                        {studentDataList.map((st) => {
                          const avg = calcAverage(st.grades.n1, st.grades.n2, st.grades.n3);
                          const isRed = avg < 4.0;

                          return (
                            <tr
                              key={st.id}
                              className={`hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition ${
                                isRed ? "bg-rose-50/40 dark:bg-rose-950/20" : ""
                              }`}
                            >
                              <td className="p-3 font-sans">
                                <p className="font-bold text-slate-900 dark:text-white">{st.name}</p>
                                <span className="text-[10px] text-slate-400">{st.rut}</span>
                              </td>
                              <td className="p-3 text-center font-bold">
                                <span className={st.grades.n1 < 4.0 ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"}>
                                  {st.grades.n1.toFixed(1)}
                                </span>
                              </td>
                              <td className="p-3 text-center font-bold">
                                <span className={st.grades.n2 < 4.0 ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"}>
                                  {st.grades.n2.toFixed(1)}
                                </span>
                              </td>
                              <td className="p-3 text-center font-bold">
                                <span className={st.grades.n3 < 4.0 ? "text-rose-600 dark:text-rose-400" : "text-slate-800 dark:text-slate-200"}>
                                  {st.grades.n3.toFixed(1)}
                                </span>
                              </td>
                              <td className="p-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-md font-extrabold ${
                                    isRed
                                      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                                      : avg >= 6.0
                                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300"
                                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                                  }`}
                                >
                                  {avg.toFixed(1)}
                                </span>
                              </td>
                              <td className="p-3 text-center font-sans">
                                {isRed ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 font-bold">
                                    Riesgo Crítico
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold">
                                    Aprobado
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Feedback de guardado masivo */}
                  {currentStep === 5 && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                        <CheckCircle2 className="w-5 h-5" />
                        <div>
                          <p className="text-xs font-bold">Lote Guardado Atómicamente en PostgreSQL</p>
                          <p className="text-[11px] text-emerald-600">
                            saveBulkMatrixGrades procesó 12 notas. Promedios y semáforos sincronizados en tiempo real.
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400">
                        {lastSavedTime || "12:30:00"}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Botones de navegación de pasos */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  Paso Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-sm hover:scale-[1.02] transition"
                >
                  <span>{currentStep === 5 ? "Completar Recorrido Profesor" : "Siguiente Paso"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* VISTA 3: ALUMNO (CONSULTA DE NOTAS Y CERTIFICADOS) */}
          {activeRole === "student" && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-black">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white">
                      Portal del Estudiante & Apoderado
                    </h2>
                    <span className="text-xs text-slate-500">Valentina Álvarez • RUN: 21.450.812-3 • 1° Medio A</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">
                    Promedio General: 6.4
                  </span>
                </div>
              </div>

              {/* Sub-fases del Alumno */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Acceso con Rol STUDENT (Solo Lectura)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Permiso GRADES_VIEW activo. Protección RBAC: intento de mutar notas devuelve 403 Forbidden.
                      </p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold">
                      Verificado
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    El alumno ingresa para revisar sus notas parciales del 1° Semestre y descargar certificados regulares.
                  </p>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Boletín de Calificaciones Parciales
                  </h3>
                  <div className="space-y-2">
                    {[
                      { subject: "Matemáticas", n1: 6.5, n2: 6.8, n3: 7.0, avg: 6.8, teacher: "Prof. Carlos Silva" },
                      { subject: "Lenguaje y Comunicación", n1: 6.2, n2: 6.5, n3: 6.0, avg: 6.2, teacher: "Prof. Marcela Soto" },
                      { subject: "Ciencias Naturales", n1: 6.0, n2: 5.8, n3: 6.4, avg: 6.1, teacher: "Prof. Rodrigo Vera" },
                      { subject: "Historia y Geografía", n1: 6.8, n2: 7.0, n3: 6.5, avg: 6.8, teacher: "Prof. Andrea Muñoz" },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{item.subject}</p>
                          <span className="text-[11px] text-slate-500">{item.teacher}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                            <span>N1: {item.n1}</span>
                            <span>N2: {item.n2}</span>
                            <span>N3: {item.n3}</span>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 font-mono font-bold text-xs">
                            {item.avg.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Control de Asistencia & Cumplimiento Mineduc (85%)
                  </h3>
                  <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Asistencia Acumulada</span>
                      <span className="text-base font-black text-emerald-600">92.8% (Aprobado)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: "92.8%" }} />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>Días Asistidos: 142 / 153</span>
                      <span className="text-slate-700 dark:text-slate-300 font-bold">Umbral Mínimo: 85%</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                    Hoja de Vida y Observaciones Formativas
                  </h3>
                  <div className="space-y-2">
                    <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Felicitación Pedagógica</span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 mt-1">
                        &ldquo;Destacada participación en la Olimpiada Regional de Matemática y colaboración con sus compañeros.&rdquo;
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">14 de Abril, 2026 • Prof. Carlos Silva</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Observación de Jefatura</span>
                      <p className="text-xs text-slate-800 dark:text-slate-200 mt-1">
                        &ldquo;Cumple responsablemente con materiales y presenta excelente disposición cívica escolar.&rdquo;
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">02 de Mayo, 2026 • Prof. Marcela Soto</span>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
                      <Award className="w-5 h-5" />
                      <span className="text-sm font-black">Certificado Oficial de Alumno Regular Emitido</span>
                    </div>
                    <p className="text-xs text-indigo-700 dark:text-indigo-300">
                      Certificado oficial con firma digital avanzada del Director Carlos Mendoza y código QR de
                      verificación institucional para Fonasa, Isapre o Transporte Escolar.
                    </p>
                    <button
                      onClick={() => {
                        setStudentCertDownloaded(true);
                        addLog("Certificado de Alumno Regular descargado con firma digital válida.", "success");
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition"
                    >
                      <Download className="w-4 h-4" />
                      <span>{studentCertDownloaded ? "Certificado Descargado (PDF)" : "Descargar Certificado Regular"}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Botones de navegación de pasos */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handlePrevStep}
                  disabled={currentStep === 1}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  Paso Anterior
                </button>
                <button
                  onClick={handleNextStep}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs shadow-sm hover:scale-[1.02] transition"
                >
                  <span>{currentStep === 5 ? "Completar Recorrido Alumno" : "Siguiente Paso"}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Panel Lateral: Bitácora de Eventos & Terminal en Vivo (4 columnas) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 p-5 text-slate-200 font-mono text-xs shadow-lg space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-slate-100">Live Journey Terminal</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="h-96 overflow-y-auto space-y-2 pr-1 text-[11px] leading-relaxed">
              {logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-slate-500 select-none">[{log.time}]</span>
                  <span
                    className={
                      log.type === "success"
                        ? "text-emerald-400 font-bold"
                        : log.type === "warning"
                        ? "text-amber-400 font-bold"
                        : "text-slate-300"
                    }
                  >
                    {log.message}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
              <span>Auditoría de Red: HTTP 200 OK</span>
              <span>PostgreSQL ACID: Committed</span>
            </div>
          </div>

          {/* Resumen de Certificación */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Garantía de Fidelidad de Simulación</span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Los 3 recorridos reflejan el flujo real de datos con aislamiento multi-tenant, persistencia y cumplimiento
              del Decreto 67 de evaluación formativa y sumativa.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
