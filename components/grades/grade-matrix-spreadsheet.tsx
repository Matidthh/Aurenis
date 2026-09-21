"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import {
  Table,
  Calculator,
  Save,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  ArrowDown,
  ArrowRight,
  Download,
  Upload,
  RefreshCw,
  Sparkles,
  HelpCircle,
  Eye,
  Settings2,
  Sliders,
  ChevronDown,
  Search,
  Filter,
  Users,
  Award,
  BookOpen,
  FileSpreadsheet,
  Zap,
  RotateCcw,
  X,
} from "lucide-react";
import { TableEmptyState } from "@/components/ui/table";

export interface StudentRow {
  id: string;
  rut: string;
  name: string;
  lastName: string;
  attendancePct: number;
  pie: boolean;
  grades: { [assessmentId: string]: number | null };
}

export interface AssessmentCol {
  id: string;
  code: string;
  title: string;
  type: "formativa" | "sumativa" | "coef2";
  weightPct: number; // Porcentaje de ponderación
  date: string;
}

export const INITIAL_ASSESSMENTS: AssessmentCol[] = [
  { id: "eval_1", code: "N1", title: "Control 1: Números y Álgebra", type: "sumativa", weightPct: 20, date: "12 Mar" },
  { id: "eval_2", code: "N2", title: "Taller Grupal Geometría", type: "formativa", weightPct: 15, date: "26 Mar" },
  { id: "eval_3", code: "N3", title: "Evaluación Parcial Funciones", type: "sumativa", weightPct: 25, date: "15 Abr" },
  { id: "eval_4", code: "N4", title: "Laboratorio Geogebra", type: "formativa", weightPct: 15, date: "30 Abr" },
  { id: "eval_5", code: "N5", title: "Examen Síntesis Semestral (Coef 2)", type: "coef2", weightPct: 25, date: "20 May" },
];

export const INITIAL_STUDENTS: StudentRow[] = [
  {
    id: "std_1",
    rut: "21.458.912-3",
    lastName: "Álvarez Morales",
    name: "Valentina Sofía",
    attendancePct: 96,
    pie: false,
    grades: { eval_1: 6.8, eval_2: 6.5, eval_3: 7.0, eval_4: 6.2, eval_5: 6.9 },
  },
  {
    id: "std_2",
    rut: "22.109.843-K",
    lastName: "Bravo Sepúlveda",
    name: "Matías Ignacio",
    attendancePct: 91,
    pie: false,
    grades: { eval_1: 5.4, eval_2: 6.0, eval_3: 5.2, eval_4: 5.8, eval_5: 5.5 },
  },
  {
    id: "std_3",
    rut: "21.890.342-1",
    lastName: "Cáceres Muñoz",
    name: "Isidora Paz",
    attendancePct: 84,
    pie: true,
    grades: { eval_1: 3.8, eval_2: 4.5, eval_3: 3.5, eval_4: 4.2, eval_5: 3.9 },
  },
  {
    id: "std_4",
    rut: "22.341.678-4",
    lastName: "Donoso Fuenzalida",
    name: "Joaquín Andrés",
    attendancePct: 98,
    pie: false,
    grades: { eval_1: 6.2, eval_2: 5.9, eval_3: 6.5, eval_4: 6.0, eval_5: 6.4 },
  },
  {
    id: "std_5",
    rut: "21.675.291-7",
    lastName: "Espinoza Valenzuela",
    name: "Catalina Belén",
    attendancePct: 88,
    pie: false,
    grades: { eval_1: 4.2, eval_2: 5.0, eval_3: 4.5, eval_4: 4.8, eval_5: 4.6 },
  },
  {
    id: "std_6",
    rut: "22.564.120-9",
    lastName: "Fuentes Carrasco",
    name: "Lucas Gabriel",
    attendancePct: 76,
    pie: true,
    grades: { eval_1: 3.2, eval_2: 3.8, eval_3: 2.9, eval_4: 4.0, eval_5: 3.4 },
  },
  {
    id: "std_7",
    rut: "21.982.431-0",
    lastName: "Gómez Henríquez",
    name: "Florencia Ignacia",
    attendancePct: 95,
    pie: false,
    grades: { eval_1: 6.7, eval_2: 7.0, eval_3: 6.8, eval_4: 6.5, eval_5: 6.9 },
  },
  {
    id: "std_8",
    rut: "22.781.905-2",
    lastName: "Herrera Pizarro",
    name: "Martín Alonso",
    attendancePct: 92,
    pie: false,
    grades: { eval_1: 5.1, eval_2: 5.5, eval_3: 5.0, eval_4: 5.7, eval_5: 5.3 },
  },
  {
    id: "std_9",
    rut: "21.320.198-6",
    lastName: "Iturra San Martín",
    name: "Emilia Francisca",
    attendancePct: 90,
    pie: false,
    grades: { eval_1: 5.9, eval_2: 6.2, eval_3: 6.0, eval_4: 5.8, eval_5: 6.1 },
  },
  {
    id: "std_10",
    rut: "22.456.789-8",
    lastName: "Jara Olave",
    name: "Diego Alejandro",
    attendancePct: 82,
    pie: true,
    grades: { eval_1: 3.9, eval_2: 4.1, eval_3: 3.7, eval_4: 4.0, eval_5: 3.8 },
  },
  {
    id: "std_11",
    rut: "21.567.890-1",
    lastName: "Lagos Navarrete",
    name: "Constanza Paz",
    attendancePct: 97,
    pie: false,
    grades: { eval_1: 6.5, eval_2: 6.8, eval_3: 6.4, eval_4: 6.6, eval_5: 6.7 },
  },
  {
    id: "std_12",
    rut: "22.678.901-2",
    lastName: "Maldonado Castro",
    name: "Vicente Tomás",
    attendancePct: 89,
    pie: false,
    grades: { eval_1: 4.8, eval_2: 5.2, eval_3: 4.9, eval_4: 5.1, eval_5: 5.0 },
  },
];

export type DensityMode = "compact" | "normal" | "spacious";
export type AutoAdvanceDirection = "down" | "right";

interface CellCoordinate {
  studentIndex: number;
  assessmentIndex: number;
}

export function GradeMatrixSpreadsheet() {
  const [assessments, setAssessments] = useState<AssessmentCol[]>(INITIAL_ASSESSMENTS);
  const [students, setStudents] = useState<StudentRow[]>(INITIAL_STUDENTS);
  
  // Configuración de visualización y velocidad
  const [density, setDensity] = useState<DensityMode>("normal");
  const [advanceDirection, setAdvanceDirection] = useState<AutoAdvanceDirection>("down");
  const [rapidTypeMode, setRapidTypeMode] = useState<boolean>(true); // Escribir '65' convierte a '6.5' y avanza
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pieFilter, setPieFilter] = useState<"all" | "pie_only" | "non_pie">("all");
  const [riskFilter, setRiskFilter] = useState<"all" | "at_risk" | "passing">("all");

  // Estado de foco y edición
  const [focusedCell, setFocusedCell] = useState<CellCoordinate | null>({ studentIndex: 0, assessmentIndex: 0 });
  const [editingValue, setEditingValue] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [dirtyCells, setDirtyCells] = useState<{ [key: string]: boolean }>({});
  const [saveStatus, setSaveStatus] = useState<"synced" | "saving" | "unsaved">("synced");
  const [lastSavedTime, setLastSavedTime] = useState<string>("Recién guardado");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Referencia a input activo
  const inputRef = useRef<HTMLInputElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Alumnos filtrados
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const fullName = `${s.lastName} ${s.name}`.toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || s.rut.includes(searchQuery);
      if (!matchesSearch) return false;

      if (pieFilter === "pie_only" && !s.pie) return false;
      if (pieFilter === "non_pie" && s.pie) return false;

      // Calcular promedio
      const validGrades = Object.values(s.grades).filter((g): g is number => g !== null);
      const avg = validGrades.length > 0 ? validGrades.reduce((a, b) => a + b, 0) / validGrades.length : 0;

      if (riskFilter === "at_risk" && avg >= 4.0) return false;
      if (riskFilter === "passing" && avg < 4.0) return false;

      return true;
    });
  }, [students, searchQuery, pieFilter, riskFilter]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    riskFilter !== "all" ||
    pieFilter !== "all";

  const activeFilterCount =
    (searchQuery ? 1 : 0) +
    (riskFilter !== "all" ? 1 : 0) +
    (pieFilter !== "all" ? 1 : 0);

  const handleClearFilters = () => {
    setSearchQuery("");
    setRiskFilter("all");
    setPieFilter("all");
  };

  // Función de cálculo de promedio ponderado por alumno
  const calculateStudentAverage = useCallback(
    (student: StudentRow) => {
      let totalWeight = 0;
      let weightedSum = 0;

      assessments.forEach((ass) => {
        const val = student.grades[ass.id];
        if (val !== null && val !== undefined) {
          weightedSum += val * (ass.weightPct / 100);
          totalWeight += ass.weightPct / 100;
        }
      });

      if (totalWeight === 0) return null;
      return weightedSum / totalWeight;
    },
    [assessments]
  );

  // Estadísticas globales de curso
  const courseStats = useMemo(() => {
    const studentAverages = students
      .map((s) => calculateStudentAverage(s))
      .filter((avg): avg is number => avg !== null);

    const totalStudents = students.length;
    const avgOverall =
      studentAverages.length > 0
        ? studentAverages.reduce((sum, v) => sum + v, 0) / studentAverages.length
        : 0;

    const passingCount = studentAverages.filter((v) => v >= 4.0).length;
    const failingCount = studentAverages.filter((v) => v < 4.0).length;
    const passingPct = totalStudents > 0 ? (passingCount / totalStudents) * 100 : 0;

    // Desviación estándar
    const variance =
      studentAverages.length > 0
        ? studentAverages.reduce((acc, v) => acc + Math.pow(v - avgOverall, 2), 0) /
          studentAverages.length
        : 0;
    const stdDev = Math.sqrt(variance);

    // Distribución por tramos
    const distUnder4 = studentAverages.filter((v) => v < 4.0).length;
    const dist4to5 = studentAverages.filter((v) => v >= 4.0 && v < 5.0).length;
    const dist5to6 = studentAverages.filter((v) => v >= 5.0 && v < 6.0).length;
    const dist6to7 = studentAverages.filter((v) => v >= 6.0).length;

    return {
      avgOverall,
      passingCount,
      failingCount,
      passingPct,
      stdDev,
      distUnder4,
      dist4to5,
      dist5to6,
      dist6to7,
    };
  }, [students, calculateStudentAverage]);

  // Cálculo de estadísticas por columna de evaluación
  const assessmentStats = useMemo(() => {
    return assessments.map((ass) => {
      const grades = students
        .map((s) => s.grades[ass.id])
        .filter((g): g is number => g !== null && g !== undefined);
      
      const count = grades.length;
      const avg = count > 0 ? grades.reduce((sum, g) => sum + g, 0) / count : null;
      const passing = grades.filter((g) => g >= 4.0).length;
      const passingRate = count > 0 ? (passing / count) * 100 : 0;

      return {
        id: ass.id,
        count,
        avg,
        passingRate,
      };
    });
  }, [assessments, students]);

  // Parser y normalizador inteligente de notas chilenas (1.0 a 7.0)
  const parseGradeInput = (raw: string): number | null => {
    const clean = raw.trim().replace(",", ".");
    if (!clean) return null;

    const num = parseFloat(clean);
    if (isNaN(num)) return null;

    // Si el usuario teclea 2 dígitos seguidos como "65", convertir a 6.5
    if (num >= 10 && num <= 70) {
      return parseFloat((num / 10).toFixed(1));
    }

    if (num >= 1.0 && num <= 7.0) {
      return parseFloat(num.toFixed(1));
    }

    return null;
  };

  // Función para obtener clase semafórica según la nota
  const getGradeChromaticClasses = (
    grade: number | null | undefined,
    isAverage: boolean = false
  ) => {
    if (grade === null || grade === undefined) {
      return "text-slate-300 dark:text-slate-600 bg-transparent";
    }

    if (grade < 4.0) {
      // Reprobado / Alerta Crítica (Rojo de alto contraste)
      return isAverage
        ? "bg-red-500/15 text-red-600 dark:text-red-400 font-black border border-red-500/30"
        : "text-red-600 dark:text-red-400 font-bold bg-red-50/70 dark:bg-red-950/30";
    } else if (grade < 5.0) {
      // Suficiente / Aceptable (Ámbar)
      return isAverage
        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-black border border-amber-500/30"
        : "text-amber-600 dark:text-amber-400 font-semibold bg-amber-50/50 dark:bg-amber-950/20";
    } else if (grade < 6.0) {
      // Bueno / Sólido (Verde esmeralda)
      return isAverage
        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black border border-emerald-500/30"
        : "text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/40 dark:bg-emerald-950/15";
    } else {
      // Sobresaliente / Destacado (Azul - Índigo)
      return isAverage
        ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 font-black border border-blue-500/30"
        : "text-blue-600 dark:text-blue-400 font-bold bg-blue-50/40 dark:bg-blue-950/15";
    }
  };

  // Manejo de actualización de nota individual
  const updateGrade = (studentId: string, assessmentId: string, value: number | null) => {
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === studentId) {
          return {
            ...st,
            grades: {
              ...st.grades,
              [assessmentId]: value,
            },
          };
        }
        return st;
      })
    );

    const cellKey = `${studentId}_${assessmentId}`;
    setDirtyCells((prev) => ({ ...prev, [cellKey]: true }));
    setSaveStatus("unsaved");
  };

  // Mover foco en la matriz
  const moveFocus = (dStudent: number, dAssessment: number) => {
    if (!focusedCell) return;
    const maxStudents = filteredStudents.length;
    const maxAssessments = assessments.length;

    let nextStudent = focusedCell.studentIndex + dStudent;
    let nextAssessment = focusedCell.assessmentIndex + dAssessment;

    // Wrap o contención
    if (nextStudent < 0) nextStudent = 0;
    if (nextStudent >= maxStudents) nextStudent = maxStudents - 1;
    if (nextAssessment < 0) nextAssessment = 0;
    if (nextAssessment >= maxAssessments) nextAssessment = maxAssessments - 1;

    setFocusedCell({ studentIndex: nextStudent, assessmentIndex: nextAssessment });
    setIsEditing(false);
  };

  // Auto avanzar según la dirección configurada
  const autoAdvance = () => {
    if (advanceDirection === "down") {
      moveFocus(1, 0);
    } else {
      moveFocus(0, 1);
    }
  };

  // Guardar cambios masivos (Simulación ultra rápida)
  const handleSaveGrades = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      setDirtyCells({});
      setSaveStatus("synced");
      setLastSavedTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      setFeedbackMessage("Calificaciones sincronizadas con el libro digital.");
      setTimeout(() => setFeedbackMessage(null), 3000);
    }, 450);
  };

  // Rellenar notas aleatorias realistas para demostración
  const handleQuickDemoFill = () => {
    const demoGrades = [6.8, 5.5, 4.2, 6.0, 7.0, 3.8, 5.9, 6.3, 4.8, 5.2, 6.6, 3.5];
    setStudents((prev) =>
      prev.map((st, i) => {
        const newGrades = { ...st.grades };
        assessments.forEach((ass, j) => {
          const sample = demoGrades[(i * 3 + j) % demoGrades.length];
          newGrades[ass.id] = sample;
        });
        return { ...st, grades: newGrades };
      })
    );
    setSaveStatus("unsaved");
    setFeedbackMessage("Datos de prueba cargados en toda la matriz.");
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  // Manejo de eventos de teclado en celda
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!focusedCell) return;
    const currentStudent = filteredStudents[focusedCell.studentIndex];
    const currentAssessment = assessments[focusedCell.assessmentIndex];

    if (e.key === "Enter") {
      e.preventDefault();
      const parsed = parseGradeInput(editingValue);
      updateGrade(currentStudent.id, currentAssessment.id, parsed);
      autoAdvance();
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parsed = parseGradeInput(editingValue);
      updateGrade(currentStudent.id, currentAssessment.id, parsed);
      if (e.shiftKey) {
        moveFocus(0, -1);
      } else {
        moveFocus(0, 1);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const parsed = parseGradeInput(editingValue);
      updateGrade(currentStudent.id, currentAssessment.id, parsed);
      moveFocus(1, 0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const parsed = parseGradeInput(editingValue);
      updateGrade(currentStudent.id, currentAssessment.id, parsed);
      moveFocus(-1, 0);
    } else if (e.key === "ArrowRight" && inputRef.current?.selectionStart === editingValue.length) {
      e.preventDefault();
      const parsed = parseGradeInput(editingValue);
      updateGrade(currentStudent.id, currentAssessment.id, parsed);
      moveFocus(0, 1);
    } else if (e.key === "ArrowLeft" && inputRef.current?.selectionStart === 0) {
      e.preventDefault();
      const parsed = parseGradeInput(editingValue);
      updateGrade(currentStudent.id, currentAssessment.id, parsed);
      moveFocus(0, -1);
    } else if (e.key === "Escape") {
      e.preventDefault();
      setIsEditing(false);
    }
  };

  // Sincronizar input cuando cambia la celda enfocada
  useEffect(() => {
    if (focusedCell) {
      const student = filteredStudents[focusedCell.studentIndex];
      const assessment = assessments[focusedCell.assessmentIndex];
      if (student && assessment) {
        const val = student.grades[assessment.id];
        setEditingValue(val !== null && val !== undefined ? val.toFixed(1) : "");
        setIsEditing(true);
      }
    }
  }, [focusedCell, filteredStudents, assessments]);

  // Enfocar input automáticamente
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing, focusedCell]);

  // Manejo de tipeo rápido con 2 dígitos (ej: "6" y "5" -> 6.5)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setEditingValue(raw);

    if (rapidTypeMode && focusedCell) {
      const currentStudent = filteredStudents[focusedCell.studentIndex];
      const currentAssessment = assessments[focusedCell.assessmentIndex];

      // Si el usuario escribe 2 dígitos seguidos como "68", aplicar 6.8 y auto-avanzar
      if (/^[1-7][0-9]$/.test(raw)) {
        const calculated = parseFloat((parseInt(raw, 10) / 10).toFixed(1));
        if (calculated >= 1.0 && calculated <= 7.0) {
          updateGrade(currentStudent.id, currentAssessment.id, calculated);
          autoAdvance();
        }
      }
    }
  };

  // Densidad de altura de celdas
  const densityRowClasses = {
    compact: "py-1 px-2 text-xs",
    normal: "py-2 px-3 text-xs sm:text-sm",
    spacious: "py-3.5 px-4 text-sm",
  }[density];

  return (
    <div className="space-y-6 w-full">
      {/* 1. Barra Superior Informativa y Acciones Rápidas */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300 border border-brand-200/50">
              1° Medio A • Matemáticas
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Primer Semestre 2026 (Decreto 67)
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              <Zap className="w-3 h-3 text-emerald-500" />
              Tipeo Rápido Activo
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Planilla Matricial de Alta Densidad para Calificaciones
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ingreso rápido con teclado numérico, semaforización cromática oficial y navegación por flechas.
          </p>
        </div>

        {/* Acciones de Guardado, Estado y Controles Rápidos */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {feedbackMessage && (
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-200/60 flex items-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{feedbackMessage}</span>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs text-slate-400 font-medium px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <div
              className={`w-2 h-2 rounded-full ${
                saveStatus === "synced"
                  ? "bg-emerald-500"
                  : saveStatus === "saving"
                  ? "bg-amber-500 animate-ping"
                  : "bg-amber-500"
              }`}
            />
            <span>
              {saveStatus === "synced"
                ? "Sincronizado"
                : saveStatus === "saving"
                ? "Guardando..."
                : "Cambios pendientes"}
            </span>
          </div>

          <button
            onClick={handleQuickDemoFill}
            title="Llenar datos de ejemplo realistas"
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Datos Demo</span>
          </button>

          <button
            onClick={handleSaveGrades}
            disabled={saveStatus === "saving"}
            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Guardar Planilla</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Métricas Globales del Curso & Semaforización */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Promedio Curso</div>
          <div
            className={`text-2xl font-black mt-1 ${
              courseStats.avgOverall >= 4.0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {courseStats.avgOverall > 0 ? courseStats.avgOverall.toFixed(1) : "—"}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Escala Oficial 1.0 - 7.0</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">% Aprobación</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {courseStats.passingPct.toFixed(0)}%
          </div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
            {courseStats.passingCount} de {students.length} alumnos
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">En Riesgo (&lt; 4.0)</div>
          <div
            className={`text-2xl font-black mt-1 ${
              courseStats.failingCount > 0 ? "text-red-600 dark:text-red-400" : "text-slate-400"
            }`}
          >
            {courseStats.failingCount}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Alumnos bajo nota 4.0</div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Desv. Estándar (σ)</div>
          <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            ±{courseStats.stdDev.toFixed(2)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Dispersión de notas</div>
        </div>

        {/* Distribución de Notas Cromática */}
        <div className="col-span-2 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Distribución Cromática</span>
            <span className="text-[10px] lowercase text-slate-400">según rendimiento</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 pt-2 text-center">
            <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200/50">
              <span className="text-[10px] font-bold text-red-600 block">&lt; 4.0</span>
              <span className="text-xs font-extrabold text-red-700 dark:text-red-300">{courseStats.distUnder4}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50">
              <span className="text-[10px] font-bold text-amber-600 block">4.0-4.9</span>
              <span className="text-xs font-extrabold text-amber-700 dark:text-amber-300">{courseStats.dist4to5}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50">
              <span className="text-[10px] font-bold text-emerald-600 block">5.0-5.9</span>
              <span className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">{courseStats.dist5to6}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50">
              <span className="text-[10px] font-bold text-blue-600 block">6.0-7.0</span>
              <span className="text-xs font-extrabold text-blue-700 dark:text-blue-300">{courseStats.dist6to7}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Barra de Filtros, Configuración de Tipeo y Densidad */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 flex-1 max-w-2xl flex-wrap">
          <div className="relative min-w-[200px] flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por apellido, nombre o RUN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                title="Limpiar búsqueda"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">Todos los Estados</option>
            <option value="at_risk">Solo en Riesgo (&lt; 4.0)</option>
            <option value="passing">Solo Aprobados (≥ 4.0)</option>
          </select>

          <select
            value={pieFilter}
            onChange={(e) => setPieFilter(e.target.value as any)}
            className="px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="all">Todos los Alumnos</option>
            <option value="pie_only">Solo PIE</option>
            <option value="non_pie">Sin PIE</option>
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-1.5 transition shrink-0"
              title="Limpiar filtros y búsqueda"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpiar Filtros</span>
            </button>
          )}
        </div>

        {/* Toggles de Velocidad y Densidad */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          {/* Tipeo Rápido 2 dígitos */}
          <button
            onClick={() => setRapidTypeMode(!rapidTypeMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border ${
              rapidTypeMode
                ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
                : "bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
            title="Auto-formato: Escribir '65' guarda 6.5 y salta a la siguiente celda"
          >
            <Zap className={`w-3.5 h-3.5 ${rapidTypeMode ? "text-amber-500" : "text-slate-400"}`} />
            <span>Tipeo Rápido (2 Dígitos)</span>
          </button>

          {/* Dirección de Avance con Enter */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setAdvanceDirection("down")}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                advanceDirection === "down"
                  ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              title="Avanzar hacia abajo (siguiente alumno)"
            >
              <ArrowDown className="w-3 h-3" />
              <span>Enter ↓</span>
            </button>
            <button
              onClick={() => setAdvanceDirection("right")}
              className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                advanceDirection === "right"
                  ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
              title="Avanzar a la derecha (siguiente evaluación)"
            >
              <ArrowRight className="w-3 h-3" />
              <span>Enter →</span>
            </button>
          </div>

          {/* Selector de Densidad */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setDensity("compact")}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                density === "compact"
                  ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                  : "text-slate-500"
              }`}
              title="Vista Compacta de Alta Densidad"
            >
              Compacta
            </button>
            <button
              onClick={() => setDensity("normal")}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                density === "normal"
                  ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                  : "text-slate-500"
              }`}
              title="Vista Normal Equilibrada"
            >
              Normal
            </button>
            <button
              onClick={() => setDensity("spacious")}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                density === "spacious"
                  ? "bg-white dark:bg-slate-700 text-brand-600 dark:text-brand-300 shadow-xs"
                  : "text-slate-500"
              }`}
              title="Vista Espaciosa"
            >
              Amplia
            </button>
          </div>
        </div>
      </div>

      {/* Indicador táctil para móviles y tablets */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1 xl:hidden">
        <span className="flex items-center gap-1 font-medium">
          ↔️ Desliza horizontalmente la tabla para revisar todas las evaluaciones
        </span>
        <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">
          Touch Scroll
        </span>
      </div>

      {/* 4. Planilla Matricial Principal (Grilla de Alta Densidad) */}
      <div
        ref={gridContainerRef}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-x-auto relative w-full"
      >
        <table className="w-full text-left border-collapse select-none">
          {/* Encabezado Matricial con Ponderaciones & Tipos de Evaluación */}
          <thead>
            <tr className="bg-slate-100/90 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
              <th className="py-2.5 px-3 font-bold text-xs sticky left-0 z-20 bg-slate-100 dark:bg-slate-850 w-12 text-center border-r border-slate-200 dark:border-slate-800">
                #
              </th>
              <th className="py-2.5 px-3 font-bold text-xs sticky left-12 z-20 bg-slate-100 dark:bg-slate-850 min-w-[200px] border-r border-slate-200 dark:border-slate-800">
                Estudiante
              </th>

              {/* Columnas de Evaluaciones */}
              {assessments.map((ass, assIdx) => {
                const stat = assessmentStats.find((s) => s.id === ass.id);
                const isColumnFocused = focusedCell?.assessmentIndex === assIdx;

                return (
                  <th
                    key={ass.id}
                    className={`py-2.5 px-3 font-bold text-xs text-center border-r border-slate-200 dark:border-slate-800 min-w-[110px] max-w-[140px] transition-colors ${
                      isColumnFocused
                        ? "bg-brand-50/70 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300"
                        : ""
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span className="font-mono font-extrabold text-sm text-brand-600 dark:text-brand-400">
                        {ass.code}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {ass.weightPct}%
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold truncate text-slate-700 dark:text-slate-200 mt-0.5" title={ass.title}>
                      {ass.title}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1 border-t border-slate-200/60 dark:border-slate-750">
                      <span>Prom: <strong className={stat?.avg && stat.avg >= 4.0 ? "text-emerald-600" : "text-red-600"}>{stat?.avg ? stat.avg.toFixed(1) : "—"}</strong></span>
                      <span>{stat?.passingRate.toFixed(0)}% apr</span>
                    </div>
                  </th>
                );
              })}

              {/* Columna de Promedio Ponderado Final */}
              <th className="py-2.5 px-3 font-black text-xs text-center bg-slate-100 dark:bg-slate-850 w-28 text-slate-900 dark:text-white border-l-2 border-slate-300 dark:border-slate-700">
                Promedio Final
              </th>

              {/* Columna de Estado / Alerta */}
              <th className="py-2.5 px-3 font-bold text-xs text-center bg-slate-100 dark:bg-slate-850 w-24">
                Situación
              </th>
            </tr>
          </thead>

          {/* Cuerpo Matricial de Alumnos & Celdas Activas */}
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
            {filteredStudents.length === 0 ? (
              <TableEmptyState
                colSpan={assessments.length + 4}
                title="No se encontraron estudiantes"
                description="No hay alumnos en la planilla que coincidan con los criterios de búsqueda o filtros seleccionados."
                searchTerm={searchQuery}
                activeFilterCount={activeFilterCount}
                onClearFilters={hasActiveFilters ? handleClearFilters : undefined}
                clearButtonText="Limpiar filtros"
              />
            ) : (
              filteredStudents.map((student, stIdx) => {
              const studentAvg = calculateStudentAverage(student);
              const isPassing = studentAvg !== null && studentAvg >= 4.0;
              const isRowFocused = focusedCell?.studentIndex === stIdx;

              return (
                <tr
                  key={student.id}
                  className={`transition-colors ${
                    isRowFocused
                      ? "bg-brand-50/40 dark:bg-brand-950/20"
                      : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {/* Número de Lista */}
                  <td className="sticky left-0 z-10 bg-inherit text-center text-xs font-bold text-slate-400 border-r border-slate-200 dark:border-slate-800">
                    {stIdx + 1}
                  </td>

                  {/* Nombre y Datos del Estudiante */}
                  <td className="sticky left-12 z-10 bg-inherit px-3 border-r border-slate-200 dark:border-slate-800 font-sans">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {student.lastName}, {student.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {student.rut} • Asist: {student.attendancePct}%
                        </div>
                      </div>
                      {student.pie && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                          PIE
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Celdas de Calificaciones con foco visual interactivo */}
                  {assessments.map((ass, assIdx) => {
                    const isCellFocused =
                      focusedCell?.studentIndex === stIdx &&
                      focusedCell?.assessmentIndex === assIdx;
                    const val = student.grades[ass.id];
                    const cellKey = `${student.id}_${ass.id}`;
                    const isDirty = dirtyCells[cellKey];
                    const chromaticClass = getGradeChromaticClasses(val, false);

                    return (
                      <td
                        key={ass.id}
                        onClick={() => {
                          setFocusedCell({ studentIndex: stIdx, assessmentIndex: assIdx });
                        }}
                        className={`text-center p-0 border-r border-slate-200 dark:border-slate-800 relative cursor-pointer transition-all ${
                          isCellFocused
                            ? "ring-2 ring-brand-500 dark:ring-brand-400 z-20 bg-white dark:bg-slate-850 shadow-md font-black"
                            : ""
                        }`}
                      >
                        {isCellFocused ? (
                          <div className="relative w-full h-full flex items-center justify-center p-1">
                            <input
                              ref={inputRef}
                              type="text"
                              maxLength={4}
                              value={editingValue}
                              onChange={handleInputChange}
                              onKeyDown={handleKeyDown}
                              className={`w-full text-center py-1.5 px-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-extrabold text-sm rounded-lg border-2 border-brand-500 dark:border-brand-400 focus:outline-hidden shadow-inner tracking-wider ${
                                editingValue && parseFloat(editingValue) < 4.0
                                  ? "text-red-600 dark:text-red-400 bg-red-50/50"
                                  : ""
                              }`}
                              placeholder="—"
                            />
                            {isDirty && (
                              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            )}
                          </div>
                        ) : (
                          <div
                            className={`${densityRowClasses} flex items-center justify-center relative font-mono tracking-tight transition-colors ${chromaticClass}`}
                          >
                            <span className="text-xs sm:text-sm">
                              {val !== null && val !== undefined ? val.toFixed(1) : "—"}
                            </span>
                            {isDirty && (
                              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-500" />
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}

                  {/* Promedio Ponderado Final del Alumno con Semaforización */}
                  <td className="text-center px-2 py-2 border-l-2 border-slate-300 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-850/60">
                    <div
                      className={`inline-block px-2.5 py-1 rounded-lg text-xs sm:text-sm font-black tracking-wide ${getGradeChromaticClasses(
                        studentAvg,
                        true
                      )}`}
                    >
                      {studentAvg !== null ? studentAvg.toFixed(1) : "S/N"}
                    </div>
                  </td>

                  {/* Situación / Alerta */}
                  <td className="text-center px-2 py-2">
                    {studentAvg === null ? (
                      <span className="text-[10px] text-slate-400 font-sans">Sin Datos</span>
                    ) : isPassing ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-sans">
                        <CheckCircle2 className="w-3 h-3" />
                        Aprobado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full font-sans animate-pulse">
                        <AlertCircle className="w-3 h-3" />
                        Reprobando
                      </span>
                    )}
                  </td>
                </tr>
              );
            })
          )}
          </tbody>
        </table>
      </div>

      {/* 5. Barra Inferior de Estado & Atajos de Teclado */}
      <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-lg">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
            <span className="font-bold text-white">Celda Activa:</span>
            {focusedCell ? (
              <span className="text-slate-300 font-mono">
                {filteredStudents[focusedCell.studentIndex]?.lastName} •{" "}
                {assessments[focusedCell.assessmentIndex]?.code} (
                {assessments[focusedCell.assessmentIndex]?.weightPct}%)
              </span>
            ) : (
              <span className="text-slate-500">Ninguna seleccionada</span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400 border-l border-slate-700 pl-4">
            <Calculator className="w-3.5 h-3.5 text-brand-400" />
            <span>Fórmula: Promedio Ponderado Decreto 67</span>
          </div>
        </div>

        {/* Guía Rápida de Teclas */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 flex-wrap">
          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono font-bold">
              Flechas ↑↓←→
            </kbd>
            <span>Mover foco</span>
          </div>

          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono font-bold">
              Enter / Tab
            </kbd>
            <span>Confirmar & avanzar</span>
          </div>

          <div className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded border border-slate-700 font-mono font-bold">
              65 = 6.5
            </kbd>
            <span className="text-amber-300 font-semibold">Tipeo Rápido</span>
          </div>
        </div>
      </div>
    </div>
  );
}
