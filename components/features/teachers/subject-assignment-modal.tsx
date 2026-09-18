"use client";

import React, { useState } from "react";
import {
  X,
  BookOpen,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Save,
  Sliders,
  Sparkles,
  Layers,
  GraduationCap,
  Building,
} from "lucide-react";
import { TeacherData } from "./teacher-management-mockup";

interface SubjectAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherData | null;
  onSaveAssignments?: (teacherId: string, updatedSubjects: any[]) => void;
}

const AVAILABLE_SUBJECTS_CATALOG = [
  { name: "Matemática", defaultHours: 6, dept: "Matemática & Ciencias", color: "blue" },
  { name: "Física", defaultHours: 4, dept: "Matemática & Ciencias", color: "cyan" },
  { name: "Química", defaultHours: 4, dept: "Matemática & Ciencias", color: "teal" },
  { name: "Biología Celular", defaultHours: 4, dept: "Matemática & Ciencias", color: "emerald" },
  { name: "Lengua y Literatura", defaultHours: 6, dept: "Lenguaje & Humanidades", color: "amber" },
  { name: "Historia y Cs. Sociales", defaultHours: 4, dept: "Lenguaje & Humanidades", color: "orange" },
  { name: "Educación Ciudadana", defaultHours: 2, dept: "Lenguaje & Humanidades", color: "yellow" },
  { name: "Idioma Extranjero Inglés", defaultHours: 4, dept: "Idiomas", color: "indigo" },
  { name: "Educación Física y Salud", defaultHours: 2, dept: "Artes & Ed. Física", color: "rose" },
  { name: "Artes Visuales", defaultHours: 2, dept: "Artes & Ed. Física", color: "purple" },
  { name: "Música", defaultHours: 2, dept: "Artes & Ed. Física", color: "violet" },
  { name: "Tecnología & Robótica", defaultHours: 2, dept: "Tecnología & Formación", color: "sky" },
];

const AVAILABLE_COURSES = [
  "7° Básico A",
  "7° Básico B",
  "8° Básico A",
  "8° Básico B",
  "1° Medio A",
  "1° Medio B",
  "2° Medio A",
  "2° Medio B",
  "3° Medio A",
  "3° Medio B",
  "4° Medio A",
  "4° Medio B",
];

const ROOMS = ["Sala 10", "Sala 11", "Sala 12", "Sala 14", "Sala 18", "Lab Ciencias", "Lab Computación", "Gimnasio", "Auditorio"];

export function SubjectAssignmentModal({
  isOpen,
  onClose,
  teacher,
  onSaveAssignments,
}: SubjectAssignmentModalProps) {
  const [assignedSubjects, setAssignedSubjects] = useState<any[]>([]);
  const [selectedSubjectName, setSelectedSubjectName] = useState(AVAILABLE_SUBJECTS_CATALOG[0].name);
  const [selectedCourse, setSelectedCourse] = useState(AVAILABLE_COURSES[0]);
  const [selectedWeeklyHours, setSelectedWeeklyHours] = useState(4);
  const [selectedRoom, setSelectedRoom] = useState(ROOMS[0]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (teacher) {
      setAssignedSubjects(teacher.subjects || []);
    }
  }, [teacher]);

  if (!isOpen || !teacher) return null;

  // Cálculo de Carga Horaria
  const currentTotalHours = assignedSubjects.reduce((acc, s) => acc + s.weeklyHours, 0);
  const maxLegalHours = teacher.contractHours;
  const isOverloaded = currentTotalHours > maxLegalHours;

  function handleAddSubject() {
    // Validar si ya existe exactamente esa asignatura para ese curso
    const alreadyExists = assignedSubjects.some(
      (s) => s.name === selectedSubjectName && s.course === selectedCourse
    );

    if (alreadyExists) {
      alert(`El profesor ya tiene asignada la materia "${selectedSubjectName}" en el curso "${selectedCourse}".`);
      return;
    }

    const newSub = {
      id: `sub-${Date.now()}`,
      name: selectedSubjectName,
      course: selectedCourse,
      weeklyHours: Number(selectedWeeklyHours),
      room: selectedRoom,
    };

    setAssignedSubjects([...assignedSubjects, newSub]);
  }

  function handleRemoveSubject(id: string) {
    setAssignedSubjects(assignedSubjects.filter((s) => s.id !== id));
  }

  function handleSave() {
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      if (onSaveAssignments && teacher) {
        onSaveAssignments(teacher.id, assignedSubjects);
      }
      onClose();
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-brand-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Selector Visual de Asignaturas & Carga Horaria
              </h3>
              <p className="text-xs text-slate-500">
                Docente: <strong className="text-slate-800 dark:text-slate-200">{teacher.name}</strong> • Contrato {teacher.contractHours} hrs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Capacidad y Alerta de Carga Legal */}
        <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-600" />
              <span className="text-slate-700 dark:text-slate-200">
                Carga Lectiva Asignada: {currentTotalHours} hrs de {maxLegalHours} hrs de contrato
              </span>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] ${
                isOverloaded
                  ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-black border border-rose-300"
                  : currentTotalHours === maxLegalHours
                  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold"
                  : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold"
              }`}
            >
              {isOverloaded
                ? `¡Sobrecarga! (+${currentTotalHours - maxLegalHours} hrs)`
                : `${maxLegalHours - currentTotalHours} hrs disponibles`}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                isOverloaded
                  ? "bg-rose-500"
                  : currentTotalHours > maxLegalHours * 0.85
                  ? "bg-amber-500"
                  : "bg-brand-600"
              }`}
              style={{
                width: `${Math.min(100, (currentTotalHours / maxLegalHours) * 100)}%`,
              }}
            />
          </div>

          {isOverloaded && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                Atención: La carga lectiva supera las horas de contrato docente estipuladas por la Ley de Carrera Docente.
              </span>
            </div>
          )}
        </div>

        {/* Cuerpo Principal del Selector */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 dark:text-slate-300">
          {/* Formulario Rápido de Adición Visual */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                Asignar Nueva Materia y Curso
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Asignatura</label>
                <select
                  value={selectedSubjectName}
                  onChange={(e) => {
                    setSelectedSubjectName(e.target.value);
                    const catalogItem = AVAILABLE_SUBJECTS_CATALOG.find(
                      (c) => c.name === e.target.value
                    );
                    if (catalogItem) setSelectedWeeklyHours(catalogItem.defaultHours);
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-hidden"
                >
                  {AVAILABLE_SUBJECTS_CATALOG.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                      {cat.name} ({cat.dept})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Curso</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-hidden"
                >
                  {AVAILABLE_COURSES.map((crs) => (
                    <option key={crs} value={crs}>
                      {crs}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Horas Semanales</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={selectedWeeklyHours}
                  onChange={(e) => setSelectedWeeklyHours(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold focus:outline-hidden"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">Sala / Espacio</label>
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold focus:outline-hidden"
                >
                  {ROOMS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddSubject}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir a la Carga del Docente</span>
            </button>
          </div>

          {/* Lista de Asignaturas Asignadas Actualmente */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Materias Actualmente Asignadas ({assignedSubjects.length})
              </h4>
              <span className="text-slate-400 text-xs">
                Sincronizado automáticamente con el Horario y Libro Digital
              </span>
            </div>

            <div className="space-y-2">
              {assignedSubjects.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {sub.weeklyHours}h
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-xs">
                        {sub.name}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Curso: <strong className="text-slate-700 dark:text-slate-300">{sub.course}</strong> • Ubicación: {sub.room || "Sala Asignada"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-semibold">
                      {sub.weeklyHours} hrs pedagógicas
                    </span>
                    <button
                      onClick={() => handleRemoveSubject(sub.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition"
                      title="Quitar Asignación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {assignedSubjects.length === 0 && (
                <div className="py-8 text-center text-slate-400 italic">
                  No hay materias asignadas para este docente. Utiliza el selector superior para agregar asignaturas.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Asignaciones Guardadas</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Asignación Académica</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
