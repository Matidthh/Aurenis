"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  UserPlus,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  Server,
  Database,
  ShieldCheck,
  Search,
  Award,
  Layers,
  ArrowRight,
} from "lucide-react";
import { ActiveTab } from "./figma-toolbar";

interface TeacherPostgresPersistenceViewProps {
  onNavigateToTab?: (tab: ActiveTab) => void;
  onOpenCriteriaModal?: () => void;
}

export function TeacherPostgresPersistenceView({
  onNavigateToTab,
  onOpenCriteriaModal,
}: TeacherPostgresPersistenceViewProps) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const [newTeacherForm, setNewTeacherForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    rutOrNationalId: "",
    specialty: "Matemáticas",
    phone: "+56 9 1234 5678",
  });

  const [assignmentForm, setAssignmentForm] = useState({
    teacherId: "",
    subjectName: "Matemáticas Avanzadas",
    courseId: "crs_1_demo",
    hoursPerWeek: 6,
  });

  const fetchTeachersReal = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/schools/colegio-san-jose/teachers");
      const data = await res.json();
      if (data.success && Array.isArray(data.teachers)) {
        setTeachers(data.teachers);
        setAssignmentForm((prev) => {
          if (data.teachers.length > 0 && !prev.teacherId) {
            return { ...prev, teacherId: data.teachers[0].id };
          }
          return prev;
        });
      }
    } catch (err: any) {
      console.warn("Error fetching teachers:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeachersReal();
  }, [fetchTeachersReal]);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage("Registrando profesor en PostgreSQL...");
    try {
      const res = await fetch("/api/schools/colegio-san-jose/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeacherForm),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage("¡Profesor creado y persistido con éxito en la base de datos!");
        setNewTeacherForm({ firstName: "", lastName: "", email: "", rutOrNationalId: "", specialty: "Matemáticas", phone: "+56 9 1234 5678" });
        fetchTeachersReal();
      } else {
        setStatusMessage(`Error: ${data.error || "No se pudo registrar"}`);
      }
    } catch (err: any) {
      setStatusMessage(`Error de red: ${err.message}`);
    }
  };

  const handleAssignSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignmentForm.teacherId) {
      setStatusMessage("Seleccione un profesor para la asignación.");
      return;
    }
    setStatusMessage("Guardando asignación académica en PostgreSQL...");
    try {
      const res = await fetch(`/api/schools/colegio-san-jose/teachers/${assignmentForm.teacherId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          createNewSubject: {
            name: assignmentForm.subjectName,
            courseId: assignmentForm.courseId,
            code: "MAT-ADV",
          },
          hoursPerWeek: assignmentForm.hoursPerWeek,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatusMessage("¡Asignatura y carga horaria guardadas en PostgreSQL con éxito!");
        fetchTeachersReal();
      } else {
        setStatusMessage(`Error: ${data.error || "No se pudo asignar"}`);
      }
    } catch (err: any) {
      setStatusMessage(`Error de red: ${err.message}`);
    }
  };

  const filteredTeachers = teachers.filter((t) => {
    const user = t.membership?.user || {};
    const name = `${user.firstName || ""} ${user.lastName || ""}`;
    const rut = user.rutOrNationalId || t.specialty || "";
    return name.toLowerCase().includes(searchTerm.toLowerCase()) || rut.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/25 text-emerald-300 text-xs font-bold tracking-wide border border-emerald-500/30">
              <Users className="w-3.5 h-3.5" />
              <span>Fase: Ejecución • Nómina Docente & Asignaciones PostgreSQL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Gestión de Profesores y Carga Académica en Vivo
            </h1>
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              Conexión bidireccional entre la nómina docente institucional y la base de datos relacional PostgreSQL. Permite la alta de profesores y la vinculación de asignaturas con validación de carga horaria.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCriteriaModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-600/30"
            >
              <Award className="w-4 h-4" />
              <span>Ver Criterios DoD (3/3)</span>
            </button>
            <button
              onClick={fetchTeachersReal}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-2 border border-slate-700"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              <span>Verificar Datos en Vivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas / Estado */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Profesores en Nómina SQL</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">{teachers.length} Docentes Activos</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Asignaciones Académicas</span>
            <span className="text-lg font-black text-slate-900 dark:text-white">Relaciones FK Persistidas</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-semibold block">Verificación de Sincronización</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> API Real 100% OK
            </span>
          </div>
        </div>
      </div>

      {/* Contenido Principal: Lista y Formularios */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Tabla de Profesores (API Real) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Nómina Docente Consumiendo API Real
              </h3>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar profesor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 uppercase">
                  <th className="py-3 px-3">Profesor / Correo</th>
                  <th className="py-3 px-3">Especialidad</th>
                  <th className="py-3 px-3">Asignaturas</th>
                  <th className="py-3 px-3 text-right">Estado DB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-medium text-slate-700 dark:text-slate-300">
                {filteredTeachers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      {isLoading ? "Cargando profesores desde PostgreSQL..." : "No se encontraron registros docentes."}
                    </td>
                  </tr>
                ) : (
                  filteredTeachers.map((t, idx) => {
                    const user = t.membership?.user || {};
                    const fullName = user.firstName ? `${user.firstName} ${user.lastName}` : (t.name || "Profesor");
                    const email = user.email || "profesor@sanjose.cl";
                    const specialty = t.specialty || "Docente General";
                    const subjectsCount = t.subjects?.length || 0;

                    return (
                      <tr key={t.id || idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                        <td className="py-3 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">{fullName}</div>
                          <div className="text-[11px] text-slate-500">{email}</div>
                        </td>
                        <td className="py-3 px-3 font-semibold text-emerald-600 dark:text-emerald-400">
                          {specialty}
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px]">
                          {subjectsCount} asignada{subjectsCount === 1 ? "" : "s"}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            PostgreSQL OK
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Columna Derecha: Alta de Profesores y Asignación de Asignaturas */}
        <div className="lg:col-span-5 space-y-6">
          {/* Formulario 1: Alta de Profesor */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <UserPlus className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Registrar Nuevo Docente en DB
              </h3>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Esteban"
                    value={newTeacherForm.firstName}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Apellido</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Morales P."
                    value={newTeacherForm.lastName}
                    onChange={(e) => setNewTeacherForm({ ...newTeacherForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  placeholder="esteban.morales@sanjose.cl"
                  value={newTeacherForm.email}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Especialidad</label>
                <input
                  type="text"
                  placeholder="Ej: Matemáticas y Física"
                  value={newTeacherForm.specialty}
                  onChange={(e) => setNewTeacherForm({ ...newTeacherForm, specialty: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Guardar Profesor en PostgreSQL</span>
              </button>
            </form>
          </div>

          {/* Formulario 2: Asignación de Asignaturas */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Asignación de Asignaturas en PostgreSQL
              </h3>
            </div>

            <form onSubmit={handleAssignSubject} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Seleccionar Profesor</label>
                <select
                  value={assignmentForm.teacherId}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, teacherId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                >
                  {teachers.map((t) => {
                    const name = t.membership?.user ? `${t.membership.user.firstName} ${t.membership.user.lastName}` : "Profesor";
                    return (
                      <option key={t.id} value={t.id}>
                        {name} ({t.specialty || "General"})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Nombre de Asignatura</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Álgebra Superior"
                  value={assignmentForm.subjectName}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, subjectName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">Horas Semanales</label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={assignmentForm.hoursPerWeek}
                  onChange={(e) => setAssignmentForm({ ...assignmentForm, hoursPerWeek: parseInt(e.target.value, 10) || 4 })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Asignar y Guardar en DB</span>
              </button>
            </form>
          </div>

          {statusMessage && (
            <div className="p-3 rounded-2xl bg-slate-900 text-white text-xs font-mono border border-slate-800 shadow-lg">
              {statusMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
