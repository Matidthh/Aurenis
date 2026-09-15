"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Users,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Plus,
  Play,
  ArrowRight,
  UserCheck,
  UserX,
  AlertTriangle,
  FileText,
  Search,
  MessageSquare,
  BadgeCheck,
} from "lucide-react";

interface TeacherDashboardMockupProps {
  showHotspots?: boolean;
  onOpenQuickAttendance?: (courseName: string) => void;
  onSelectStudentRisk?: (student: {
    name: string;
    course: string;
    avgGrade: number;
    attendance: number;
    riskFactor: string;
    priority: "high" | "medium" | "low";
  }) => void;
}

export function TeacherDashboardMockup({
  showHotspots = false,
  onOpenQuickAttendance,
  onSelectStudentRisk,
}: TeacherDashboardMockupProps) {
  const [selectedCourseId, setSelectedCourseId] = useState("c1");

  const COURSES = [
    { id: "c1", name: "1° Medio A", subject: "Matemática", students: 38, avgGrade: 5.4, attendanceToday: "97.4%", status: "done" },
    { id: "c2", name: "1° Medio B", subject: "Matemática", students: 36, avgGrade: 5.6, attendanceToday: "Pendiente", status: "pending" },
    { id: "c3", name: "2° Medio A", subject: "Geometría y Álgebra", students: 34, avgGrade: 5.8, attendanceToday: "94.1%", status: "done" },
    { id: "c4", name: "4° Medio Electivo", subject: "Límites y Derivadas", students: 34, avgGrade: 6.1, attendanceToday: "98.0%", status: "done" },
  ];

  const currentCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];

  const TODAY_SCHEDULE = [
    { time: "08:15 - 09:45", course: "1° Medio A", subject: "Matemática", room: "Sala 104", status: "completed" },
    { time: "10:00 - 11:30", course: "1° Medio B", subject: "Matemática", room: "Sala 105", status: "current" },
    { time: "11:45 - 13:15", course: "2° Medio A", subject: "Geometría", room: "Laboratorio 2", status: "upcoming" },
    { time: "14:15 - 15:45", course: "4° Medio Electivo", subject: "Límites", room: "Sala 204", status: "upcoming" },
  ];

  const PENDING_EVALUATIONS = [
    {
      id: "ev1",
      title: "Prueba Unidad 2: Ecuaciones Cuadráticas",
      course: "1° Medio B",
      date: "12 Sep 2026",
      status: "pending_grading",
      progress: "0/36 corregidas",
      deadline: "En 2 días",
    },
    {
      id: "ev2",
      title: "Control Sumativo: Funciones Lineales",
      course: "1° Medio A",
      date: "05 Sep 2026",
      status: "graded",
      progress: "38/38 calificadas",
      deadline: "Completado",
    },
    {
      id: "ev3",
      title: "Proyecto Grupal: Cónicas en la Vida Real",
      course: "2° Medio A",
      date: "25 Sep 2026",
      status: "scheduled",
      progress: "Programada",
      deadline: "En 11 días",
    },
  ];

  const STUDENTS_NEED_SUPPORT = [
    {
      id: "st1",
      name: "Mateo Fernández Silva",
      course: "1° Medio A",
      avgGrade: 3.4,
      attendance: 78.5,
      riskFactor: "Nota 2.8 en Prueba 1 • 3 inasistencias en el mes",
      priority: "high" as const,
      avatar: "MF",
    },
    {
      id: "st2",
      name: "Camila Andrea Sepúlveda",
      course: "1° Medio A",
      avgGrade: 3.9,
      attendance: 92.0,
      riskFactor: "Promedio rojo por entrega pendiente de taller",
      priority: "medium" as const,
      avatar: "CS",
    },
    {
      id: "st3",
      name: "Diego Ignacio Morales",
      course: "1° Medio A",
      avgGrade: 4.1,
      attendance: 82.5,
      riskFactor: "Inasistencia recurrente los días lunes",
      priority: "medium" as const,
      avatar: "DM",
    },
  ];

  const hotspotClass = showHotspots
    ? "relative outline-2 outline-dashed outline-blue-500/70 after:absolute after:inset-0 after:bg-blue-500/10 after:pointer-events-none hover:after:bg-blue-500/20"
    : "";

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 font-sans pb-10">
      {/* 1. Header Docente & Perfil Activo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-600/20">
            RG
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Prof. Roberto Gómez
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Docente Titular
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Departamento de Matemática • Profesor Jefe 1° Medio A
            </p>
          </div>
        </div>

        {/* Acciones directas docentes */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onOpenQuickAttendance?.("1° Medio B")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition ${hotspotClass}`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Pase de Lista Rápido</span>
          </button>
        </div>
      </div>

      {/* 2. Banner de Próxima Clase Activa (Reducción de carga cognitiva en el aula) */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-indigo-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[11px] font-bold uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Clase en Desarrollo
            </span>
            <span className="text-xs text-slate-300">Bloque 10:00 - 11:30 hrs</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            1° Medio B — Matemática (Sala 105)
          </h2>
          <p className="text-xs text-slate-300">
            Unidad 2: Resolución de Ecuaciones Cuadráticas por Factorización
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenQuickAttendance?.("1° Medio B")}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-950 shadow-md transition flex items-center gap-2 ${hotspotClass}`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Registrar Asistencia del Bloque</span>
          </button>
        </div>
      </div>

      {/* 3. Selector de Curso Activo (Pestañas de Contexto) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {COURSES.map((course) => (
          <button
            key={course.id}
            onClick={() => setSelectedCourseId(course.id)}
            className={`flex-1 min-w-[200px] p-3.5 rounded-2xl border text-left transition-all ${
              selectedCourseId === course.id
                ? "bg-white dark:bg-slate-900 border-brand-500 shadow-md ring-2 ring-brand-500/20"
                : "bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 opacity-80"
            } ${hotspotClass}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-slate-900 dark:text-white">{course.name}</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  course.status === "done"
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                }`}
              >
                {course.status === "done" ? "Asistencia OK" : "Pendiente"}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{course.subject}</p>
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
              <span>{course.students} Alumnos</span>
              <span>Prom. {course.avgGrade}</span>
            </div>
          </button>
        ))}
      </div>

      {/* 4. Tarjetas de Resumen del Curso Seleccionado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Métrica 1: Promedio del Curso */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Promedio Curso</span>
            <Award className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">{currentCourse.avgGrade}</span>
            <span className="text-xs font-bold text-emerald-600">+0.2 vs Mes Anterior</span>
          </div>
          <p className="text-xs text-slate-400">Escala de 1.0 a 7.0 (89% aprobados)</p>
        </div>

        {/* Métrica 2: Asistencia de Hoy */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Asistencia Hoy</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">{currentCourse.attendanceToday}</span>
          </div>
          <p className="text-xs text-slate-400">37 de 38 estudiantes presentes</p>
        </div>

        {/* Métrica 3: Evaluaciones Ingresadas */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Avance Evaluaciones</span>
            <FileCheck className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">3 / 5</span>
            <span className="text-xs font-bold text-indigo-600">60% Ponderado</span>
          </div>
          <p className="text-xs text-slate-400">Semestre 1 • 2 pruebas restantes</p>
        </div>

        {/* Métrica 4: Alumnos en Refuerzo */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Riesgo Académico</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-600">3</span>
            <span className="text-xs font-bold text-slate-400">Alumnos &lt; 4.0</span>
          </div>
          <p className="text-xs text-slate-400">Plan de apoyo pedagógico activo</p>
        </div>
      </div>

      {/* 5. Bloque Central Docente: Horario del Día + Evaluaciones + Casos de Refuerzo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda (2/3): Evaluaciones & Libro de Clases */}
        <div className="lg:col-span-2 space-y-6">
          {/* Calificaciones y Pruebas Pendientes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Cronograma de Evaluaciones Semestrales
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {currentCourse.name} • {currentCourse.subject}
                </p>
              </div>
              <button className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700">
                <Plus className="w-3.5 h-3.5" />
                <span>Nueva Evaluación</span>
              </button>
            </div>

            <div className="space-y-3">
              {PENDING_EVALUATIONS.map((ev) => (
                <div
                  key={ev.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ev.title}</h4>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ev.status === "graded"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : ev.status === "pending_grading"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {ev.deadline}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Fecha: {ev.date} • {ev.progress}
                    </p>
                  </div>

                  <button
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                      ev.status === "pending_grading"
                        ? "bg-brand-600 hover:bg-brand-700 text-white"
                        : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                    } ${hotspotClass}`}
                  >
                    {ev.status === "pending_grading" ? "Ingresar Notas" : "Ver Planilla"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Horario de Clases del Día */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Agenda de Clases de Hoy (Lunes)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TODAY_SCHEDULE.map((sch, i) => (
                <div
                  key={i}
                  className={`p-3.5 rounded-xl border transition ${
                    sch.status === "current"
                      ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-800 ring-2 ring-indigo-500/20"
                      : "bg-slate-50/50 dark:bg-slate-850/40 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {sch.time}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        sch.status === "completed"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : sch.status === "current"
                          ? "bg-indigo-600 text-white font-bold"
                          : "bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {sch.status === "completed" ? "Finalizado" : sch.status === "current" ? "En curso" : "Próximo"}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5">
                    {sch.course} • {sch.subject}
                  </h4>
                  <p className="text-[11px] text-slate-500">{sch.room}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha (1/3): Alumnos que Requieren Refuerzo */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Alumnos en Refuerzo</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{currentCourse.name}</p>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs font-bold">
              3 Casos
            </span>
          </div>

          <div className="space-y-3">
            {STUDENTS_NEED_SUPPORT.map((st) => (
              <div
                key={st.id}
                onClick={() => onSelectStudentRisk?.(st)}
                className={`cursor-pointer p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/40 hover:border-brand-500 hover:bg-brand-50/30 transition space-y-2 ${hotspotClass}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xs">
                      {st.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{st.name}</h4>
                      <p className="text-[10px] text-slate-400">{st.course}</p>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md border border-rose-200">
                    {st.avgGrade}
                  </span>
                </div>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2">
                  {st.riskFactor}
                </p>

                <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500">Asistencia: <strong>{st.attendance}%</strong></span>
                  <span className="text-brand-600 dark:text-brand-400 font-bold flex items-center gap-0.5">
                    Ver Bitácora <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-200 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300 space-y-1">
            <span className="font-bold block">Acción Pedagógica Sugerida:</span>
            <p className="text-[11px] leading-relaxed">
              Taller de reforzamiento programado para el jueves a las 16:00 hrs en Sala de Matemáticas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
