"use client";

import { useState, useMemo, useRef, useCallback } from "react";
import {
  GradeMatrixData,
  GradeMatrixStudent,
  GradeMatrixAssessment,
} from "@/lib/services/grade.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CreateAssessmentModal } from "./create-assessment-modal";
import { EditAssessmentModal } from "./edit-assessment-modal";
import {
  Award,
  Search,
  Filter,
  Plus,
  Save,
  Download,
  AlertTriangle,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  BookOpen,
  Users,
  Percent,
  Sparkles,
  Info,
  Calendar,
  RotateCcw,
} from "lucide-react";

interface GradeMatrixViewProps {
  initialData: GradeMatrixData;
  schoolSlug: string;
  schoolId: string;
}

export function GradeMatrixView({
  initialData,
  schoolSlug,
  schoolId,
}: GradeMatrixViewProps) {
  // Estado de filtros y selectores
  const [selectedCourseId, setSelectedCourseId] = useState<string>(initialData.selectedCourseId);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialData.selectedSubjectId);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(initialData.selectedPeriodId);

  // Datos dinámicos de la matriz
  const [assessments, setAssessments] = useState<GradeMatrixAssessment[]>(initialData.assessments);
  const [students, setStudents] = useState<GradeMatrixStudent[]>(initialData.students);
  const [gradingConfig] = useState(initialData.gradingConfig);

  // Estado de edición en vivo (almacena cambios pendientes en memoria: key = `${enrollmentId}_${assessmentId}`)
  const [editedGrades, setEditedGrades] = useState<Record<string, number | null>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [saveErrorMsg, setSaveErrorMsg] = useState<string | null>(null);

  // Controles de visualización y filtrado
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "AT_RISK" | "PENDING">("ALL");
  const [useWeightedAverage, setUseWeightedAverage] = useState(true);

  // Modales
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<GradeMatrixAssessment | null>(null);

  // Referencias para navegación por teclado
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Cursos y asignaturas disponibles
  const currentCourse = useMemo(() => {
    return initialData.courses.find((c) => c.id === selectedCourseId) || initialData.courses[0];
  }, [initialData.courses, selectedCourseId]);

  const currentSubject = useMemo(() => {
    return currentCourse?.subjects.find((s) => s.id === selectedSubjectId) || currentCourse?.subjects[0];
  }, [currentCourse, selectedSubjectId]);

  const currentPeriod = useMemo(() => {
    return initialData.periods.find((p) => p.id === selectedPeriodId) || initialData.periods[0];
  }, [initialData.periods, selectedPeriodId]);

  // Manejar cambio de curso (actualiza asignaturas vinculadas)
  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    const newCourse = initialData.courses.find((c) => c.id === courseId);
    if (newCourse && newCourse.subjects.length > 0) {
      setSelectedSubjectId(newCourse.subjects[0].id);
    }
  };

  // Obtener valor actual de una nota (editado o original)
  const getGradeValue = useCallback(
    (enrollmentId: string, assessmentId: string): number | null => {
      const key = `${enrollmentId}_${assessmentId}`;
      if (key in editedGrades) {
        return editedGrades[key];
      }
      const student = students.find((s) => s.enrollmentId === enrollmentId);
      const gradeObj = student?.grades[assessmentId];
      return gradeObj?.value !== undefined ? gradeObj.value : null;
    },
    [editedGrades, students]
  );

  // Manejar cambio en celda de calificación
  const handleGradeCellChange = (
    enrollmentId: string,
    assessmentId: string,
    rawText: string
  ) => {
    const key = `${enrollmentId}_${assessmentId}`;
    if (rawText.trim() === "") {
      setEditedGrades((prev) => ({ ...prev, [key]: null }));
      return;
    }

    const normalized = rawText.replace(",", ".");
    const num = parseFloat(normalized);

    if (isNaN(num)) return;

    // Acotar según configuración institucional
    if (num > gradingConfig.maxGrade) return;

    setEditedGrades((prev) => ({ ...prev, [key]: num }));
  };

  // Cálculo en vivo del promedio del alumno
  const calculateStudentAverage = useCallback(
    (student: GradeMatrixStudent) => {
      let totalWeightedSum = 0;
      let totalWeight = 0;
      let validCount = 0;
      let simpleSum = 0;
      let redCount = 0;

      assessments.forEach((ass) => {
        const val = getGradeValue(student.enrollmentId, ass.id);
        if (val !== null && !isNaN(val)) {
          validCount++;
          simpleSum += val;
          if (val < gradingConfig.minPassingGrade) {
            redCount++;
          }
          const weight = ass.weightPercentage || 100;
          totalWeightedSum += val * weight;
          totalWeight += weight;
        }
      });

      if (validCount === 0) {
        return { average: null, redCount: 0, validCount: 0, status: "SIN_NOTAS" as const };
      }

      let finalAvg: number;
      if (useWeightedAverage && totalWeight > 0) {
        finalAvg = totalWeightedSum / totalWeight;
      } else {
        finalAvg = simpleSum / validCount;
      }

      const factor = Math.pow(10, gradingConfig.precision);
      const roundedAvg = Math.round(finalAvg * factor) / factor;
      const isPassing = roundedAvg >= gradingConfig.minPassingGrade;

      let status: "APROBADO" | "REPROBANDO" | "EN_RIESGO" = "APROBADO";
      if (!isPassing) {
        status = "REPROBANDO";
      } else if (roundedAvg < gradingConfig.minPassingGrade + 0.5 || redCount >= 2) {
        status = "EN_RIESGO";
      }

      return {
        average: roundedAvg,
        redCount,
        validCount,
        status,
      };
    },
    [assessments, getGradeValue, gradingConfig, useWeightedAverage]
  );

  // Estadísticas globales del curso en vivo
  const matrixStats = useMemo(() => {
    let totalGrades = 0;
    let totalRedGrades = 0;
    let studentSum = 0;
    let evaluatedStudents = 0;
    let passingStudents = 0;
    let failingStudents = 0;

    students.forEach((student) => {
      const { average, validCount, redCount } = calculateStudentAverage(student);
      totalRedGrades += redCount;
      totalGrades += validCount;

      if (average !== null) {
        studentSum += average;
        evaluatedStudents++;
        if (average >= gradingConfig.minPassingGrade) {
          passingStudents++;
        } else {
          failingStudents++;
        }
      }
    });

    const courseAverage =
      evaluatedStudents > 0
        ? Math.round((studentSum / evaluatedStudents) * Math.pow(10, gradingConfig.precision)) /
          Math.pow(10, gradingConfig.precision)
        : null;

    const passingRate =
      evaluatedStudents > 0 ? Math.round((passingStudents / evaluatedStudents) * 100) : 0;

    return {
      courseAverage,
      passingRate,
      totalRedGrades,
      totalGrades,
      evaluatedStudents,
      failingStudents,
      passingStudents,
      totalStudents: students.length,
    };
  }, [students, calculateStudentAverage, gradingConfig]);

  // Estadísticas por columna de evaluación (para la fila resumen al pie)
  const assessmentStats = useMemo(() => {
    const stats: Record<
      string,
      { average: number | null; count: number; redCount: number; passingRate: number }
    > = {};

    assessments.forEach((ass) => {
      let sum = 0;
      let count = 0;
      let redCount = 0;

      students.forEach((std) => {
        const val = getGradeValue(std.enrollmentId, ass.id);
        if (val !== null && !isNaN(val)) {
          sum += val;
          count++;
          if (val < gradingConfig.minPassingGrade) {
            redCount++;
          }
        }
      });

      const avg =
        count > 0
          ? Math.round((sum / count) * Math.pow(10, gradingConfig.precision)) /
            Math.pow(10, gradingConfig.precision)
          : null;

      const passingRate = count > 0 ? Math.round(((count - redCount) / count) * 100) : 0;

      stats[ass.id] = { average: avg, count, redCount, passingRate };
    });

    return stats;
  }, [assessments, students, getGradeValue, gradingConfig]);

  // Filtrar estudiantes por búsqueda y semáforo
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = `${student.lastName} ${student.firstName}`.toLowerCase();
      const rut = student.rut.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) || rut.includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === "AT_RISK") {
        const { status, redCount } = calculateStudentAverage(student);
        return status === "REPROBANDO" || status === "EN_RIESGO" || redCount > 0;
      }

      if (statusFilter === "PENDING") {
        const { validCount } = calculateStudentAverage(student);
        return validCount < assessments.length;
      }

      return true;
    });
  }, [students, searchQuery, statusFilter, calculateStudentAverage, assessments.length]);

  // Conteo de cambios pendientes
  const pendingChangesCount = Object.keys(editedGrades).length;

  // Guardar cambios masivos en el servidor
  const handleSaveAllGrades = async () => {
    if (pendingChangesCount === 0) return;

    try {
      setIsSaving(true);
      setSaveErrorMsg(null);
      setSaveSuccessMsg(null);

      const payloadGrades = Object.entries(editedGrades)
        .filter(([_, val]) => val !== null && !isNaN(val))
        .map(([key, value]) => {
          const [enrollmentId, assessmentId] = key.split("_");
          return {
            assessmentId,
            enrollmentId,
            value: Number(value),
          };
        });

      const res = await fetch(`/api/schools/${schoolId}/grades/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grades: payloadGrades }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Error al guardar calificaciones masivas");
      }

      // Actualizar estado local base de estudiantes con las nuevas notas
      setStudents((prev) =>
        prev.map((std) => {
          const updatedGrades = { ...std.grades };
          assessments.forEach((ass) => {
            const key = `${std.enrollmentId}_${ass.id}`;
            if (key in editedGrades) {
              const val = editedGrades[key];
              if (val !== null) {
                updatedGrades[ass.id] = {
                  ...updatedGrades[ass.id],
                  value: val,
                };
              }
            }
          });
          return { ...std, grades: updatedGrades };
        })
      );

      setEditedGrades({});
      setSaveSuccessMsg(`¡Planilla actualizada exitosamente! (${payloadGrades.length} notas guardadas)`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (err: any) {
      setSaveErrorMsg(err.message || "Error al guardar las calificaciones");
    } finally {
      setIsSaving(false);
    }
  };

  // Descartar cambios pendientes
  const handleDiscardChanges = () => {
    if (confirm("¿Descartar todos los cambios no guardados en la planilla?")) {
      setEditedGrades({});
      setSaveErrorMsg(null);
    }
  };

  // Navegación rápida por teclado entre celdas (flechas, enter, tab)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      const nextKey = `${rowIndex + 1}_${colIndex}`;
      inputRefs.current[nextKey]?.focus();
      inputRefs.current[nextKey]?.select();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevKey = `${rowIndex - 1}_${colIndex}`;
      inputRefs.current[prevKey]?.focus();
      inputRefs.current[prevKey]?.select();
    } else if (e.key === "ArrowRight") {
      const input = e.currentTarget;
      if (input.selectionEnd === input.value.length) {
        e.preventDefault();
        const nextColKey = `${rowIndex}_${colIndex + 1}`;
        inputRefs.current[nextColKey]?.focus();
        inputRefs.current[nextColKey]?.select();
      }
    } else if (e.key === "ArrowLeft") {
      const input = e.currentTarget;
      if (input.selectionStart === 0) {
        e.preventDefault();
        const prevColKey = `${rowIndex}_${colIndex - 1}`;
        inputRefs.current[prevColKey]?.focus();
        inputRefs.current[prevColKey]?.select();
      }
    }
  };

  // Exportar matriz a archivo CSV para Excel
  const handleExportCSV = () => {
    const headers = [
      "N°",
      "RUT / Identificación",
      "Apellidos",
      "Nombres",
      ...assessments.map((a) => `${a.code} - ${a.title} (${a.weightPercentage}%)`),
      "Promedio Final",
      "Estado",
      "Notas Rojas (<4.0)",
    ];

    const rows = students.map((std, idx) => {
      const { average, status, redCount } = calculateStudentAverage(std);
      const gradeValues = assessments.map((a) => {
        const v = getGradeValue(std.enrollmentId, a.id);
        return v !== null ? v.toFixed(gradingConfig.precision) : "";
      });

      return [
        idx + 1,
        `"${std.rut}"`,
        `"${std.lastName}"`,
        `"${std.firstName}"`,
        ...gradeValues,
        average !== null ? average.toFixed(gradingConfig.precision) : "",
        `"${status}"`,
        redCount,
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Planilla_${currentCourse?.name || "Curso"}_${currentSubject?.name || "Asignatura"}_${currentPeriod?.name || "Periodo"}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Barra Superior de Contexto y Selectores */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Selectores de Curso, Asignatura y Periodo */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
            {/* Selector de Curso */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Curso
              </label>
              <div className="relative">
                <select
                  value={selectedCourseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none appearance-none cursor-pointer pr-8"
                >
                  {initialData.courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Selector de Asignatura */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Asignatura
              </label>
              <div className="relative">
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none appearance-none cursor-pointer pr-8"
                >
                  {currentCourse?.subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Selector de Periodo */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Periodo Académico
              </label>
              <div className="relative">
                <select
                  value={selectedPeriodId}
                  onChange={(e) => setSelectedPeriodId(e.target.value)}
                  className="w-full h-10 px-3 py-2 text-sm font-semibold rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none appearance-none cursor-pointer pr-8"
                >
                  {initialData.periods.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.isCurrent ? "(Vigente)" : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Acciones principales de cabecera */}
          <div className="flex items-center gap-2.5 self-end lg:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              title="Descargar acta en formato CSV / Excel"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Exportar CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Nueva Evaluación (N+)
            </Button>
          </div>
        </div>

        {/* Fila de información rápida de la asignatura */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {currentSubject?.name}
            </span>
            {currentSubject?.teacherName && (
              <span className="text-slate-400">• Docente: {currentSubject.teacherName}</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-medium text-slate-600 dark:text-slate-400">Modo promedio:</span>
              <button
                type="button"
                onClick={() => setUseWeightedAverage(!useWeightedAverage)}
                className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-brand-600 dark:text-brand-400 transition-colors"
              >
                {useWeightedAverage ? "Ponderado (%)" : "Aritmético Simple"}
              </button>
            </div>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span>Escala: {gradingConfig.minGrade.toFixed(1)} a {gradingConfig.maxGrade.toFixed(1)}</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              Aprobación: {gradingConfig.minPassingGrade.toFixed(1)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Tarjetas de Resumen & Semáforo General del Curso */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        {/* Promedio General del Curso */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Promedio Curso</span>
            <Award className="w-4 h-4 text-brand-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={`text-2xl font-black ${
                matrixStats.courseAverage !== null
                  ? matrixStats.courseAverage >= gradingConfig.minPassingGrade
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
                  : "text-slate-400"
              }`}
            >
              {matrixStats.courseAverage !== null
                ? matrixStats.courseAverage.toFixed(gradingConfig.precision)
                : "S/N"}
            </span>
            <span className="text-xs text-slate-400">/ {gradingConfig.maxGrade.toFixed(1)}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {matrixStats.evaluatedStudents} de {matrixStats.totalStudents} evaluados
          </div>
        </div>

        {/* Tasa de Aprobación */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Aprobación</span>
            <Percent className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {matrixStats.passingRate}%
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              ({matrixStats.passingStudents} alumnos)
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Promedio ≥ {gradingConfig.minPassingGrade.toFixed(1)}
          </div>
        </div>

        {/* Semáforo: Total Notas Rojas en el Curso */}
        <div className={`p-4 rounded-2xl border shadow-xs flex flex-col justify-between ${
          matrixStats.totalRedGrades > 0
            ? "bg-red-50/40 dark:bg-red-950/20 border-red-200 dark:border-red-900/60"
            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
        }`}>
          <div className="text-[11px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center justify-between">
            <span>Notas Rojas (&lt; 4.0)</span>
            <AlertTriangle className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600 dark:text-red-400">
              {matrixStats.totalRedGrades}
            </span>
            <span className="text-xs text-red-600/80 font-medium">calificaciones</span>
          </div>
          <div className="text-[11px] text-red-500/80 mt-1 font-medium">
            Semáforo de alerta académica
          </div>
        </div>

        {/* Estudiantes en Riesgo */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>En Riesgo / Reprobando</span>
            <Users className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-2xl font-black ${
              matrixStats.failingStudents > 0 ? "text-amber-600 dark:text-amber-400" : "text-slate-900 dark:text-white"
            }`}>
              {matrixStats.failingStudents}
            </span>
            <span className="text-xs text-slate-400">alumnos</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Promedio acumulado &lt; {gradingConfig.minPassingGrade.toFixed(1)}
          </div>
        </div>
      </div>

      {/* 3. Mensajes de Guardado / Feedback */}
      {saveSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {saveErrorMsg && (
        <div className="p-3.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{saveErrorMsg}</span>
        </div>
      )}

      {/* 4. Barra de Herramientas de la Grilla (Búsqueda, Filtros y Guardado Flotante) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          {/* Búsqueda */}
          <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar estudiante o RUN..."
              className="pl-9 h-9 text-xs"
            />
          </div>

          {/* Filtros de Semáforo */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === "ALL"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Todos ({students.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("AT_RISK")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                statusFilter === "AT_RISK"
                  ? "bg-red-500 text-white shadow-xs"
                  : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              En Riesgo / Rojas
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("PENDING")}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                statusFilter === "PENDING"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Pendientes
            </button>
          </div>
        </div>

        {/* Botones de Guardar / Descartar */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          {pendingChangesCount > 0 && (
            <>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                {pendingChangesCount} cambio(s) sin guardar
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscardChanges}
                disabled={isSaving}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Descartar
              </Button>
            </>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={handleSaveAllGrades}
            disabled={pendingChangesCount === 0 || isSaving}
            className={pendingChangesCount > 0 ? "ring-2 ring-brand-500/50 shadow-md" : ""}
          >
            <Save className="w-4 h-4 mr-1.5" />
            {isSaving ? "Guardando..." : "Guardar Calificaciones"}
          </Button>
        </div>
      </div>

      {/* 5. PLANILLA MATRICIAL INTERACTIVA DE CALIFICACIONES */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto max-h-[650px] relative">
          <table className="w-full text-left border-collapse text-xs">
            {/* Cabecera de la matriz */}
            <thead className="bg-slate-50 dark:bg-slate-850/80 sticky top-0 z-20 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
              <tr>
                {/* Columna N° de lista */}
                <th className="py-3 px-3 w-12 text-center font-bold text-slate-400 uppercase tracking-wider sticky left-0 z-30 bg-slate-50 dark:bg-slate-850">
                  #
                </th>

                {/* Columna Estudiante */}
                <th className="py-3 px-3 min-w-[220px] max-w-[260px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider sticky left-12 z-30 bg-slate-50 dark:bg-slate-850 border-r border-slate-200 dark:border-slate-800">
                  Estudiante ({filteredStudents.length})
                </th>

                {/* Columnas dinámicas de Evaluación */}
                {assessments.map((assessment, colIndex) => (
                  <th
                    key={assessment.id}
                    className="py-2.5 px-2 min-w-[110px] text-center border-r border-slate-200 dark:border-slate-800 group hover:bg-slate-100/60 dark:hover:bg-slate-800/60 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-between gap-1">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-extrabold text-brand-600 dark:text-brand-400 text-sm">
                          {assessment.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingAssessment(assessment)}
                          title="Editar detalles y ponderación de esta evaluación"
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-slate-700 dark:hover:text-white transition-opacity"
                        >
                          <SlidersHorizontal className="w-3 h-3" />
                        </button>
                      </div>

                      <div
                        className="font-semibold text-slate-800 dark:text-slate-200 truncate w-full text-center"
                        title={assessment.title}
                      >
                        {assessment.title}
                      </div>

                      <div className="flex items-center gap-1.5 text-[10px]">
                        <span className="px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-750 text-slate-600 dark:text-slate-300 font-medium">
                          {assessment.weightPercentage}%
                        </span>
                        {assessment.isPublished ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Publicada" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" title="Borrador" />
                        )}
                      </div>
                    </div>
                  </th>
                ))}

                {/* Botón rápido para agregar columna en cabecera */}
                <th className="py-3 px-2 w-14 text-center border-r border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    title="Agregar nueva columna de evaluación"
                    className="w-8 h-8 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 flex items-center justify-center mx-auto transition-colors font-bold text-xs"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </th>

                {/* Columna Promedio Acumulado */}
                <th className="py-3 px-3 min-w-[90px] text-center font-extrabold text-slate-900 dark:text-white uppercase tracking-wider bg-slate-100/70 dark:bg-slate-800/80 sticky right-[120px] z-20 border-l border-slate-200 dark:border-slate-750">
                  Promedio
                </th>

                {/* Columna Semáforo & Estado */}
                <th className="py-3 px-3 min-w-[120px] text-center font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider sticky right-0 z-20 bg-slate-100/70 dark:bg-slate-850 border-l border-slate-200 dark:border-slate-750">
                  Semáforo
                </th>
              </tr>
            </thead>

            {/* Filas de estudiantes */}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {filteredStudents.map((student, rowIndex) => {
                const { average, redCount, status } = calculateStudentAverage(student);
                const isStudentAtRisk = status === "REPROBANDO" || redCount > 0;

                return (
                  <tr
                    key={student.enrollmentId}
                    className={`hover:bg-brand-50/20 dark:hover:bg-brand-950/10 transition-colors ${
                      isStudentAtRisk ? "bg-red-50/15 dark:bg-red-950/10" : ""
                    }`}
                  >
                    {/* N° de lista */}
                    <td className="py-2.5 px-3 text-center font-bold text-slate-400 sticky left-0 z-10 bg-white dark:bg-slate-900">
                      {student.listNumber}
                    </td>

                    {/* Ficha rápida de estudiante */}
                    <td className="py-2.5 px-3 sticky left-12 z-10 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-white truncate">
                          {student.lastName}, {student.firstName}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                          <span>{student.rut}</span>
                          {redCount > 0 && (
                            <span className="px-1 py-0.2 rounded bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 font-bold">
                              {redCount} {redCount === 1 ? "roja" : "rojas"}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Celdas de Notas Interactivas */}
                    {assessments.map((assessment, colIndex) => {
                      const gradeVal = getGradeValue(student.enrollmentId, assessment.id);
                      const key = `${student.enrollmentId}_${assessment.id}`;
                      const isModified = key in editedGrades;
                      const hasValue = gradeVal !== null && !isNaN(gradeVal);
                      const isRed = hasValue && gradeVal < gradingConfig.minPassingGrade;
                      const isExcellent = hasValue && gradeVal >= 6.0;

                      return (
                        <td
                          key={assessment.id}
                          className="py-1.5 px-1.5 text-center border-r border-slate-100 dark:border-slate-800/60"
                        >
                          <div className="relative">
                            <input
                              ref={(el) => {
                                inputRefs.current[`${rowIndex}_${colIndex}`] = el;
                              }}
                              type="text"
                              inputMode="decimal"
                              value={
                                gradeVal !== null && !isNaN(gradeVal)
                                  ? isModified
                                    ? String(gradeVal)
                                    : gradeVal.toFixed(gradingConfig.precision)
                                  : ""
                              }
                              placeholder="-.-"
                              onChange={(e) =>
                                handleGradeCellChange(
                                  student.enrollmentId,
                                  assessment.id,
                                  e.target.value
                                )
                              }
                              onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                              onFocus={(e) => e.target.select()}
                              className={`w-16 h-8 text-center text-xs font-bold rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 z-10 ${
                                isRed
                                  ? "bg-red-50 text-red-600 border-red-300 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800 shadow-xs ring-1 ring-red-400/20"
                                  : isExcellent
                                  ? "bg-emerald-50/70 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800"
                                  : hasValue
                                  ? "bg-white text-slate-900 border-slate-200 dark:bg-slate-850 dark:text-slate-100 dark:border-slate-700"
                                  : "bg-slate-50/40 text-slate-400 border-dashed border-slate-200 dark:bg-slate-900 dark:text-slate-600 dark:border-slate-800"
                              } ${isModified ? "ring-2 ring-amber-400 border-amber-400" : ""}`}
                            />
                            {isModified && (
                              <span
                                className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500"
                                title="Cambio no guardado"
                              />
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Espaciador de columna de agregar */}
                    <td className="py-1 px-1 border-r border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/20" />

                    {/* Promedio Acumulado Calculado en Vivo */}
                    <td className="py-2 px-3 text-center sticky right-[120px] z-10 bg-slate-50/90 dark:bg-slate-850/90 border-l border-slate-200 dark:border-slate-750">
                      {average !== null ? (
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-xs font-black ${
                            average >= gradingConfig.minPassingGrade
                              ? average >= 6.0
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                                : "bg-blue-50 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300"
                              : "bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 font-extrabold ring-1 ring-red-400/40"
                          }`}
                        >
                          {average.toFixed(gradingConfig.precision)}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">S/N</span>
                      )}
                    </td>

                    {/* Semáforo & Estado Visual */}
                    <td className="py-2 px-3 text-center sticky right-0 z-10 bg-slate-50/90 dark:bg-slate-850/90 border-l border-slate-200 dark:border-slate-750">
                      {status === "REPROBANDO" ? (
                        <Badge variant="danger" className="text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3 mr-0.5" />
                          Reprobando
                        </Badge>
                      ) : status === "EN_RIESGO" ? (
                        <Badge variant="warning" className="text-[10px] font-bold">
                          En Riesgo
                        </Badge>
                      ) : status === "APROBADO" ? (
                        <Badge variant="success" className="text-[10px] font-bold">
                          Aprobado
                        </Badge>
                      ) : (
                        <Badge variant="neutral" className="text-[10px]">
                          Sin Notas
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={assessments.length + 5}
                    className="p-8 text-center text-slate-400 italic"
                  >
                    No se encontraron estudiantes para los criterios seleccionados.
                  </td>
                </tr>
              )}
            </tbody>

            {/* FILA RESUMEN: ESTADÍSTICAS DEL CURSO EN VIVO (FOOTER) */}
            <tfoot className="bg-slate-100 dark:bg-slate-850 font-semibold border-t-2 border-slate-300 dark:border-slate-700 sticky bottom-0 z-20">
              <tr>
                <td className="py-3 px-3 text-center text-slate-400 font-bold sticky left-0 z-30 bg-slate-100 dark:bg-slate-850">
                  ∑
                </td>
                <td className="py-3 px-3 font-bold text-slate-800 dark:text-slate-200 sticky left-12 z-30 bg-slate-100 dark:bg-slate-850 border-r border-slate-200 dark:border-slate-800">
                  <div>Promedio por Evaluación</div>
                  <div className="text-[10px] text-slate-400 font-normal">% Aprobación por columna</div>
                </td>

                {/* Estadísticas de cada evaluación */}
                {assessments.map((ass) => {
                  const stat = assessmentStats[ass.id];
                  const avg = stat?.average;
                  const isPassing = avg !== null && avg >= gradingConfig.minPassingGrade;

                  return (
                    <td
                      key={ass.id}
                      className="py-2.5 px-2 text-center border-r border-slate-200 dark:border-slate-800"
                    >
                      <div
                        className={`font-black text-xs ${
                          avg !== null
                            ? isPassing
                              ? "text-emerald-700 dark:text-emerald-400"
                              : "text-red-600 dark:text-red-400"
                            : "text-slate-400"
                        }`}
                      >
                        {avg !== null ? avg.toFixed(gradingConfig.precision) : "-"}
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium">
                        {stat?.passingRate}% apr.
                      </div>
                      {stat?.redCount > 0 && (
                        <div className="text-[9px] text-red-500 font-bold">
                          {stat.redCount} {stat.redCount === 1 ? "roja" : "rojas"}
                        </div>
                      )}
                    </td>
                  );
                })}

                <td className="py-2 px-1 border-r border-slate-200 dark:border-slate-800" />

                {/* Promedio General del Curso */}
                <td className="py-3 px-3 text-center sticky right-[120px] z-30 bg-slate-200/80 dark:bg-slate-800 border-l border-slate-300 dark:border-slate-700">
                  <span
                    className={`font-black text-xs px-2 py-0.5 rounded ${
                      matrixStats.courseAverage !== null
                        ? matrixStats.courseAverage >= gradingConfig.minPassingGrade
                          ? "text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950"
                          : "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950"
                        : "text-slate-400"
                    }`}
                  >
                    {matrixStats.courseAverage !== null
                      ? matrixStats.courseAverage.toFixed(gradingConfig.precision)
                      : "S/N"}
                  </span>
                </td>

                {/* Tasa General de Aprobación */}
                <td className="py-3 px-3 text-center sticky right-0 z-30 bg-slate-200/80 dark:bg-slate-850 border-l border-slate-300 dark:border-slate-700">
                  <div className="font-black text-xs text-slate-800 dark:text-slate-200">
                    {matrixStats.passingRate}%
                  </div>
                  <div className="text-[9px] text-slate-400">Tasa Global</div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 6. Modales de Creación y Edición de Evaluaciones */}
      <CreateAssessmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        schoolSlug={schoolSlug}
        schoolId={schoolId}
        subjectId={selectedSubjectId}
        subjectName={currentSubject?.name || "Asignatura"}
        academicPeriodId={selectedPeriodId}
        periodName={currentPeriod?.name || "Periodo"}
        onCreated={(newAss) => {
          setAssessments((prev) => [
            ...prev,
            {
              id: newAss.id,
              code: `N${prev.length + 1}`,
              title: newAss.title,
              description: newAss.description,
              date: newAss.date,
              weightPercentage: newAss.weightPercentage,
              isPublished: newAss.isPublished,
            },
          ]);
          setSaveSuccessMsg(`¡Columna "${newAss.title}" agregada a la planilla!`);
          setTimeout(() => setSaveSuccessMsg(null), 3500);
        }}
      />

      <EditAssessmentModal
        isOpen={Boolean(editingAssessment)}
        onClose={() => setEditingAssessment(null)}
        schoolId={schoolId}
        assessment={editingAssessment}
        onUpdated={(updated) => {
          setAssessments((prev) =>
            prev.map((a) => (a.id === updated.id ? updated : a))
          );
          setSaveSuccessMsg(`¡Evaluación ${updated.code} actualizada correctamente!`);
          setTimeout(() => setSaveSuccessMsg(null), 3500);
        }}
        onDeleted={(deletedId) => {
          setAssessments((prev) => {
            const filtered = prev.filter((a) => a.id !== deletedId);
            return filtered.map((a, idx) => ({ ...a, code: `N${idx + 1}` }));
          });
          setSaveSuccessMsg("Evaluación y calificaciones asociadas eliminadas.");
          setTimeout(() => setSaveSuccessMsg(null), 3500);
        }}
      />
    </div>
  );
}
