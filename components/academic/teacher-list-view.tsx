"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  GraduationCap,
  BookOpen,
  Mail,
  Phone,
  Clock,
  Eye,
  Edit3,
  Trash2,
  Plus,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { TeacherItem } from "@/lib/services/teacher.service";
import { CreateTeacherModal } from "./create-teacher-modal";
import { AssignSubjectModal, CourseOption, AvailableSubjectOption } from "./assign-subject-modal";
import { EditTeacherModal } from "./edit-teacher-modal";
import { TeacherProfileModal } from "./teacher-profile-modal";

interface TeacherListViewProps {
  schoolSlug: string;
  initialTeachers: TeacherItem[];
  courses: CourseOption[];
  availableSubjects: AvailableSubjectOption[];
}

export function TeacherListView({
  schoolSlug,
  initialTeachers,
  courses,
  availableSubjects,
}: TeacherListViewProps) {
  const router = useRouter();

  // State Management
  const [teachers, setTeachers] = useState<TeacherItem[]>(initialTeachers);
  const [subjectsList, setSubjectsList] = useState<AvailableSubjectOption[]>(availableSubjects);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("ALL");
  const [selectedAssignmentStatus, setSelectedAssignmentStatus] = useState<string>("ALL");

  // Active Modals state
  const [assignModalTeacher, setAssignModalTeacher] = useState<TeacherItem | null>(null);
  const [editModalTeacher, setEditModalTeacher] = useState<TeacherItem | null>(null);
  const [profileModalTeacher, setProfileModalTeacher] = useState<TeacherItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state if initialTeachers prop changes
  useEffect(() => {
    setTeachers(initialTeachers);
  }, [initialTeachers]);

  // Read view mode preference from localStorage
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem("school_teacher_view_mode");
      if (savedMode === "grid" || savedMode === "table") {
        setViewMode(savedMode);
      }
    } catch {
      // Ignore if localStorage is restricted
    }
  }, []);

  const handleToggleViewMode = (mode: "grid" | "table") => {
    setViewMode(mode);
    try {
      localStorage.setItem("school_teacher_view_mode", mode);
    } catch {
      // Ignore
    }
  };

  // Re-fetch teachers & subjects to maintain global reactivity
  const refreshTeachersData = async () => {
    try {
      const [resTeachers, resSubjects] = await Promise.all([
        fetch(`/api/schools/${schoolSlug}/teachers`),
        fetch(`/api/schools/${schoolSlug}/subjects`),
      ]);

      if (resTeachers.ok) {
        const dTeachers = await resTeachers.json();
        if (dTeachers.teachers) {
          setTeachers(dTeachers.teachers);

          // If a modal is open, keep its teacher updated
          if (assignModalTeacher) {
            const updated = dTeachers.teachers.find((t: TeacherItem) => t.id === assignModalTeacher.id);
            if (updated) setAssignModalTeacher(updated);
          }
          if (profileModalTeacher) {
            const updated = dTeachers.teachers.find((t: TeacherItem) => t.id === profileModalTeacher.id);
            if (updated) setProfileModalTeacher(updated);
          }
        }
      }

      if (resSubjects.ok) {
        const dSubjects = await resSubjects.json();
        if (dSubjects.subjects) {
          setSubjectsList(dSubjects.subjects);
        }
      }

      router.refresh();
    } catch {
      // Ignore error
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Extract unique specialties
  const uniqueSpecialties = useMemo(() => {
    const specs = teachers
      .map((t) => t.specialty?.trim())
      .filter((s): s is string => Boolean(s && s.length > 0));
    return Array.from(new Set(specs)).sort();
  }, [teachers]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalTeachers = teachers.length;
    const totalAssignments = teachers.reduce((acc, t) => acc + (t.subjects?.length || 0), 0);
    const totalWeeklyHours = teachers.reduce(
      (acc, t) => acc + (t.subjects?.reduce((h, s) => h + (s.hoursPerWeek || 0), 0) || 0),
      0
    );
    const totalSpecialties = uniqueSpecialties.length;

    return {
      totalTeachers,
      totalAssignments,
      totalWeeklyHours,
      totalSpecialties,
    };
  }, [teachers, uniqueSpecialties]);

  // Filtered teachers list
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const user = t.membership?.user;
      const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.toLowerCase();
      const email = (user?.email || "").toLowerCase();
      const rut = (user?.rutOrNationalId || "").toLowerCase();
      const specialty = (t.specialty || "").toLowerCase();
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        fullName.includes(term) ||
        email.includes(term) ||
        rut.includes(term) ||
        specialty.includes(term);

      const matchesSpecialty =
        selectedSpecialty === "ALL" ||
        (t.specialty && t.specialty.trim() === selectedSpecialty);

      const matchesAssignment =
        selectedAssignmentStatus === "ALL" ||
        (selectedAssignmentStatus === "ASSIGNED" && (t.subjects?.length || 0) > 0) ||
        (selectedAssignmentStatus === "UNASSIGNED" && (t.subjects?.length || 0) === 0);

      return matchesSearch && matchesSpecialty && matchesAssignment;
    });
  }, [teachers, searchTerm, selectedSpecialty, selectedAssignmentStatus]);

  // Delete / Unlink Teacher
  const handleDeleteTeacher = async (teacher: TeacherItem) => {
    const teacherName = `${teacher.membership.user.firstName} ${teacher.membership.user.lastName}`;
    if (!confirm(`¿Estás seguro de desvincular al docente ${teacherName}? Se removerán también sus asignaciones de asignaturas.`)) {
      return;
    }

    setIsDeleting(teacher.id);
    try {
      const res = await fetch(`/api/schools/${schoolSlug}/teachers/${teacher.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "No se pudo desvincular al docente");
      }

      showToast(`Docente ${teacherName} desvinculado con éxito.`);
      await refreshTeachersData();
    } catch (err: any) {
      alert(err.message || "Error al comunicarse con el servidor.");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast de Notificación Reactiva */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Métricas e Indicadores Cuantitativos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Cuerpo Docente</span>
            <GraduationCap className="w-4 h-4 text-brand-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.totalTeachers}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Profesores registrados
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Asignaciones</span>
            <BookOpen className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.totalAssignments}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Asignaturas a cargo
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Carga Horaria</span>
            <Clock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.totalWeeklyHours} hrs
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Pedagógicas semanales
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Especialidades</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {metrics.totalSpecialties}
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Áreas de enseñanza activas
          </div>
        </div>
      </div>

      {/* 2. Barra de Filtros, Búsqueda y Switcher Lista/Tarjetas */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Búsqueda */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="teacher-search-input"
              type="text"
              placeholder="Buscar profesor, especialidad, RUN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm rounded-xl pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Filtros Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              id="filter-teacher-specialty"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl py-2 px-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">Todas las Especialidades</option>
              {uniqueSpecialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>

            <select
              id="filter-teacher-assignment-status"
              value={selectedAssignmentStatus}
              onChange={(e) => setSelectedAssignmentStatus(e.target.value)}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl py-2 px-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="ASSIGNED">Con Asignaturas</option>
              <option value="UNASSIGNED">Sin Asignación</option>
            </select>
          </div>
        </div>

        {/* Switcher Vista Tarjetas / Vista Lista y Botón Crear */}
        <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
          <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              id="btn-view-mode-grid"
              type="button"
              onClick={() => handleToggleViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Vista en Tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Tarjetas</span>
            </button>

            <button
              id="btn-view-mode-table"
              type="button"
              onClick={() => handleToggleViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
              title="Vista en Lista / Tabla"
            >
              <List className="w-4 h-4" />
              <span className="hidden md:inline">Lista</span>
            </button>
          </div>

          <CreateTeacherModal
            schoolSlug={schoolSlug}
            onTeacherCreated={async () => {
              showToast("Nuevo profesor registrado con éxito.");
              await refreshTeachersData();
            }}
          />
        </div>
      </div>

      {/* Indicador de resultados */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Mostrando <strong className="text-slate-900 dark:text-white">{filteredTeachers.length}</strong> de{" "}
          <strong className="text-slate-900 dark:text-white">{teachers.length}</strong> docentes
        </span>
        {(searchTerm || selectedSpecialty !== "ALL" || selectedAssignmentStatus !== "ALL") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedSpecialty("ALL");
              setSelectedAssignmentStatus("ALL");
            }}
            className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* 3. Vistas: Tarjetas (Grid) o Tabla (Lista) */}
      {viewMode === "grid" ? (
        /* VISTA EN TARJETAS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => {
            const user = teacher.membership?.user;
            const teacherWeeklyHours = teacher.subjects.reduce(
              (acc, sub) => acc + (sub.hoursPerWeek || 0),
              0
            );

            return (
              <div
                key={teacher.id}
                id={`teacher-card-${teacher.id}`}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-500 dark:hover:border-brand-500 transition group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Bar Card */}
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold text-lg border border-brand-100 dark:border-brand-900 shrink-0">
                      {user?.firstName?.[0] || "P"}
                      {user?.lastName?.[0] || "D"}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Badge variant="brand">
                        {teacherWeeklyHours} hrs/sem
                      </Badge>
                    </div>
                  </div>

                  {/* Nombre y Especialidad */}
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                      {user?.firstName} {user?.lastName}
                    </h3>
                    <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-0.5">
                      {teacher.specialty || "Especialidad General"}
                    </p>

                    <div className="space-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{user?.email}</span>
                      </div>
                      {user?.phone && (
                        <div className="flex items-center gap-1.5 truncate">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Asignaturas a cargo */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="text-[11px] font-semibold uppercase text-slate-400 mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        Asignaturas ({teacher.subjects.length})
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {teacher.subjects.map((s) => (
                        <span
                          key={s.id}
                          className="px-2 py-1 rounded-lg text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200/60 dark:border-slate-700/60"
                        >
                          {s.name} <strong className="text-brand-600 dark:text-brand-400 font-normal">({s.course?.name})</strong>
                        </span>
                      ))}

                      {teacher.subjects.length === 0 && (
                        <span className="text-xs text-slate-400 italic">
                          Sin asignaturas vinculadas
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones de la Tarjeta */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Button
                    id={`btn-assign-subjects-card-${teacher.id}`}
                    variant="outline"
                    size="sm"
                    onClick={() => setAssignModalTeacher(teacher)}
                    leftIcon={<Layers className="w-3.5 h-3.5 text-brand-500" />}
                    className="text-xs flex-1"
                  >
                    Asignar
                  </Button>

                  <div className="flex items-center gap-1">
                    <Button
                      id={`btn-profile-teacher-card-${teacher.id}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => setProfileModalTeacher(teacher)}
                      className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
                      title="Ver Ficha Completa"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      id={`btn-edit-teacher-card-${teacher.id}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditModalTeacher(teacher)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                      title="Editar Datos"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>

                    <Button
                      id={`btn-delete-teacher-card-${teacher.id}`}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTeacher(teacher)}
                      disabled={isDeleting === teacher.id}
                      className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                      title="Desvincular Docente"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* VISTA EN TABLA / LISTA */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-850/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Docente</th>
                  <th className="px-6 py-4">Especialidad</th>
                  <th className="px-6 py-4">Identificación / RUN</th>
                  <th className="px-6 py-4">Asignaturas & Cursos</th>
                  <th className="px-6 py-4">Carga Horaria</th>
                  <th className="px-6 py-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTeachers.map((teacher) => {
                  const user = teacher.membership?.user;
                  const teacherWeeklyHours = teacher.subjects.reduce(
                    (acc, sub) => acc + (sub.hoursPerWeek || 0),
                    0
                  );

                  return (
                    <tr
                      key={teacher.id}
                      id={`teacher-table-row-${teacher.id}`}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                      onClick={() => setProfileModalTeacher(teacher)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs shrink-0 border border-brand-100 dark:border-brand-900">
                            {user?.firstName?.[0] || "P"}
                            {user?.lastName?.[0] || "D"}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                              {user?.firstName} {user?.lastName}
                            </div>
                            <div className="text-xs text-slate-400 truncate">{user?.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-900 dark:text-white text-xs">
                          {teacher.specialty || "Docente General"}
                        </span>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                        {user?.rutOrNationalId || (
                          <span className="text-slate-400 italic">No registrado</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {teacher.subjects.map((s) => (
                            <span
                              key={s.id}
                              className="px-2 py-0.5 rounded text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                            >
                              {s.name} ({s.course?.name})
                            </span>
                          ))}
                          {teacher.subjects.length === 0 && (
                            <span className="text-xs text-slate-400 italic">Sin asignaturas</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <Badge variant="brand">
                          <Clock className="w-3 h-3" />
                          {teacherWeeklyHours} hrs/sem
                        </Badge>
                      </td>

                      <td
                        className="px-6 py-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            id={`btn-assign-subjects-table-${teacher.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setAssignModalTeacher(teacher)}
                            className="text-brand-600 hover:text-brand-700 dark:text-brand-400 text-xs"
                            title="Asignar Asignaturas"
                          >
                            <Layers className="w-4 h-4" />
                            <span className="hidden lg:inline ml-1">Asignar</span>
                          </Button>

                          <Button
                            id={`btn-profile-teacher-table-${teacher.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setProfileModalTeacher(teacher)}
                            className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400"
                            title="Ver Ficha"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>

                          <Button
                            id={`btn-edit-teacher-table-${teacher.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditModalTeacher(teacher)}
                            className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                            title="Editar Datos"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>

                          <Button
                            id={`btn-delete-teacher-table-${teacher.id}`}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTeacher(teacher)}
                            disabled={isDeleting === teacher.id}
                            className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                            title="Desvincular Docente"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estado vacío cuando no hay resultados */}
      {filteredTeachers.length === 0 && (
        <div className="py-12 px-6 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <p className="font-semibold text-slate-900 dark:text-white text-base">
            No se encontraron docentes con los criterios seleccionados
          </p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Prueba ajustando los filtros de búsqueda o especialidad, o registra un nuevo profesor en el cuerpo docente.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchTerm("");
              setSelectedSpecialty("ALL");
              setSelectedAssignmentStatus("ALL");
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      )}

      {/* Modal de Asignación de Asignaturas */}
      {assignModalTeacher && (
        <AssignSubjectModal
          isOpen={Boolean(assignModalTeacher)}
          onClose={() => setAssignModalTeacher(null)}
          schoolSlug={schoolSlug}
          teacher={assignModalTeacher}
          courses={courses}
          availableSubjects={subjectsList}
          onAssignmentUpdated={async () => {
            showToast("Asignaciones actualizadas correctamente.");
            await refreshTeachersData();
          }}
        />
      )}

      {/* Modal de Edición de Docente */}
      {editModalTeacher && (
        <EditTeacherModal
          isOpen={Boolean(editModalTeacher)}
          onClose={() => setEditModalTeacher(null)}
          schoolSlug={schoolSlug}
          teacher={editModalTeacher}
          onSuccess={async () => {
            showToast("Datos del docente actualizados.");
            await refreshTeachersData();
          }}
        />
      )}

      {/* Modal de Ficha Docente */}
      {profileModalTeacher && (
        <TeacherProfileModal
          isOpen={Boolean(profileModalTeacher)}
          onClose={() => setProfileModalTeacher(null)}
          teacher={profileModalTeacher}
          onOpenAssignModal={(t) => setAssignModalTeacher(t)}
          onOpenEditModal={(t) => setEditModalTeacher(t)}
        />
      )}
    </div>
  );
}
