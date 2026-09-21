"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  SlidersHorizontal,
  GraduationCap,
  BookOpen,
  Clock,
  Mail,
  Phone,
  CheckCircle2,
  AlertTriangle,
  Layers,
  LayoutGrid,
  List,
  UserCheck,
  ChevronRight,
  MoreVertical,
  Download,
  Calendar,
  Sparkles,
  Award,
  ShieldCheck,
  Building2,
  RefreshCw,
  Loader2,
} from "lucide-react";

export interface TeacherData {
  id: string;
  rut: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  department: "Matemática & Ciencias" | "Lenguaje & Humanidades" | "Idiomas" | "Artes & Ed. Física" | "Tecnología & Formación";
  contractHours: number;
  assignedHours: number;
  status: "Activo" | "Licencia Médica" | "Perfeccionamiento";
  headTeacherOf?: string; // Curso que tiene jefatura (ej: "1° Medio B")
  subjects: {
    id: string;
    name: string;
    course: string;
    weeklyHours: number;
    room?: string;
  }[];
  planningProgress: number; // Porcentaje de planificaciones al día
  digitalSignatureActive: boolean;
}

export const MOCK_TEACHERS: TeacherData[] = [
  {
    id: "tch-1",
    rut: "14.892.401-2",
    name: "Rodrigo Valdés Morales",
    email: "r.valdes@colegiosanjose.cl",
    phone: "+56 9 8472 1092",
    specialty: "Licenciado en Matemáticas y Física (PUC)",
    department: "Matemática & Ciencias",
    contractHours: 44,
    assignedHours: 36,
    status: "Activo",
    headTeacherOf: "1° Medio B",
    planningProgress: 95,
    digitalSignatureActive: true,
    subjects: [
      { id: "sub-1", name: "Matemática", course: "1° Medio B", weeklyHours: 6, room: "Sala 12" },
      { id: "sub-2", name: "Física", course: "1° Medio B", weeklyHours: 4, room: "Lab Ciencias" },
      { id: "sub-3", name: "Matemática", course: "2° Medio A", weeklyHours: 6, room: "Sala 14" },
      { id: "sub-4", name: "Electivo Límites y Derivadas", course: "4° Medio A", weeklyHours: 4, room: "Sala 18" },
    ],
  },
  {
    id: "tch-2",
    rut: "15.304.912-K",
    name: "Marcela Soto Henríquez",
    email: "m.soto@colegiosanjose.cl",
    phone: "+56 9 7619 4021",
    specialty: "Profesora de Castellano y Literatura (U. de Chile)",
    department: "Lenguaje & Humanidades",
    contractHours: 40,
    assignedHours: 32,
    status: "Activo",
    headTeacherOf: "2° Medio A",
    planningProgress: 100,
    digitalSignatureActive: true,
    subjects: [
      { id: "sub-5", name: "Lengua y Literatura", course: "1° Medio A", weeklyHours: 6, room: "Sala 11" },
      { id: "sub-6", name: "Lengua y Literatura", course: "2° Medio A", weeklyHours: 6, room: "Sala 14" },
      { id: "sub-7", name: "Taller de Debate y Argumentación", course: "3° Medio B", weeklyHours: 4, room: "Biblioteca" },
    ],
  },
  {
    id: "tch-3",
    rut: "16.120.485-8",
    name: "Andrea Silva Castillo",
    email: "a.silva@colegiosanjose.cl",
    phone: "+56 9 6501 9382",
    specialty: "Pedagogía en Biología y Cs. Naturales (UMCE)",
    department: "Matemática & Ciencias",
    contractHours: 30,
    assignedHours: 24,
    status: "Activo",
    headTeacherOf: "8° Básico A",
    planningProgress: 88,
    digitalSignatureActive: true,
    subjects: [
      { id: "sub-8", name: "Ciencias Naturales", course: "7° Básico B", weeklyHours: 4, room: "Lab Ciencias" },
      { id: "sub-9", name: "Ciencias Naturales", course: "8° Básico A", weeklyHours: 4, room: "Sala 8" },
      { id: "sub-10", name: "Biología Celular", course: "3° Medio B", weeklyHours: 4, room: "Lab Ciencias" },
    ],
  },
  {
    id: "tch-4",
    rut: "13.784.992-3",
    name: "Fernando Castro Parra",
    email: "f.castro@colegiosanjose.cl",
    phone: "+56 9 5410 8820",
    specialty: "Profesor de Historia, Geografía y Educación Cívica (UdeC)",
    department: "Lenguaje & Humanidades",
    contractHours: 44,
    assignedHours: 38,
    status: "Activo",
    planningProgress: 92,
    digitalSignatureActive: true,
    subjects: [
      { id: "sub-11", name: "Historia y Cs. Sociales", course: "1° Medio B", weeklyHours: 4, room: "Sala 12" },
      { id: "sub-12", name: "Historia y Cs. Sociales", course: "2° Medio A", weeklyHours: 4, room: "Sala 14" },
      { id: "sub-13", name: "Educación Ciudadana", course: "3° Medio B", weeklyHours: 2, room: "Auditorio" },
      { id: "sub-14", name: "Educación Ciudadana", course: "4° Medio A", weeklyHours: 2, room: "Sala 18" },
    ],
  },
  {
    id: "tch-5",
    rut: "17.409.118-1",
    name: "John Miller O'Connor",
    email: "j.miller@colegiosanjose.cl",
    phone: "+56 9 4329 0019",
    specialty: "Licenciado en Idioma Inglés y Lingüística Aplicada (Cambridge CELTA)",
    department: "Idiomas",
    contractHours: 36,
    assignedHours: 28,
    status: "Activo",
    headTeacherOf: "3° Medio B",
    planningProgress: 96,
    digitalSignatureActive: true,
    subjects: [
      { id: "sub-15", name: "Idioma Extranjero Inglés", course: "1° Medio B", weeklyHours: 4, room: "Sala 12" },
      { id: "sub-16", name: "Idioma Extranjero Inglés", course: "2° Medio A", weeklyHours: 4, room: "Sala 14" },
      { id: "sub-17", name: "Inglés Avanzado Cambridge", course: "4° Medio A", weeklyHours: 4, room: "Sala Idiomas" },
    ],
  },
  {
    id: "tch-6",
    rut: "15.992.831-7",
    name: "Carolina Méndez Tapia",
    email: "c.mendez@colegiosanjose.cl",
    phone: "+56 9 3218 7744",
    specialty: "Profesora de Educación Física y Salud (U. de Playa Ancha)",
    department: "Artes & Ed. Física",
    contractHours: 32,
    assignedHours: 26,
    status: "Activo",
    planningProgress: 90,
    digitalSignatureActive: true,
    subjects: [
      { id: "sub-18", name: "Educación Física y Salud", course: "7° Básico B", weeklyHours: 2, room: "Gimnasio" },
      { id: "sub-19", name: "Educación Física y Salud", course: "1° Medio B", weeklyHours: 2, room: "Cancha Central" },
      { id: "sub-20", name: "Acondicionamiento Físico", course: "3° Medio B", weeklyHours: 2, room: "Gimnasio" },
    ],
  },
];

interface TeacherManagementMockupProps {
  showHotspots?: boolean;
  onSelectTeacherForEdit: (teacher: TeacherData) => void;
  onOpenSubjectAssignment: (teacher: TeacherData) => void;
  onOpenNewTeacherModal: () => void;
  teachers?: TeacherData[];
  isLoading?: boolean;
  onRefresh?: () => void;
  isLive?: boolean;
}

export function TeacherManagementMockup({
  showHotspots = false,
  onSelectTeacherForEdit,
  onOpenSubjectAssignment,
  onOpenNewTeacherModal,
  teachers,
  isLoading = false,
  onRefresh,
  isLive = false,
}: TeacherManagementMockupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [onlyHeadTeachers, setOnlyHeadTeachers] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const effectiveTeachers = useMemo(() => {
    return teachers && teachers.length > 0 ? teachers : MOCK_TEACHERS;
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    return effectiveTeachers.filter((tch) => {
      const matchSearch =
        tch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tch.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tch.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tch.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tch.subjects.some((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchDept = selectedDepartment === "all" || tch.department === selectedDepartment;
      const matchStatus = selectedStatus === "all" || tch.status === selectedStatus;
      const matchHead = !onlyHeadTeachers || !!tch.headTeacherOf;

      return matchSearch && matchDept && matchStatus && matchHead;
    });
  }, [effectiveTeachers, searchTerm, selectedDepartment, selectedStatus, onlyHeadTeachers]);

  // Resumen de Métricas del Plantel
  const totalContractHours = effectiveTeachers.reduce((acc, t) => acc + t.contractHours, 0);
  const totalAssignedHours = effectiveTeachers.reduce((acc, t) => acc + t.assignedHours, 0);
  const avgPlanning = Math.round(
    effectiveTeachers.reduce((acc, t) => acc + t.planningProgress, 0) / (effectiveTeachers.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* 1. Header del Módulo de Profesores & Acciones */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Nómina del Cuerpo Docente y Asignación Académica
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-extrabold text-xs border border-brand-200 dark:border-brand-800">
              {filteredTeachers.length} profesores
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[11px] border border-emerald-200 dark:border-emerald-800 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                REST En Vivo (Bearer)
              </span>
            )}
            {isLoading && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-semibold">
                <Loader2 className="w-3 h-3 animate-spin text-blue-600 dark:text-blue-400" />
                Sincronizando...
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Control de carga horaria (Ley Carrera Docente), jefaturas de curso, especialidades y asignación de materias.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Recargar docentes desde la API REST"
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-brand-600" : ""}`} />
              <span className="hidden sm:inline">Actualizar</span>
            </button>
          )}

          <button
            onClick={() => {
              alert("Exportando nómina docente y carga horaria oficial para SIGE/MINEDUC...");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Nómina SIGE</span>
          </button>

          <button
            onClick={onOpenNewTeacherModal}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition ${
              showHotspots ? "ring-4 ring-purple-400 animate-pulse" : ""
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Incorporar Nuevo Docente</span>
          </button>
        </div>
      </div>

      {/* 2. Tarjetas de Resumen de Carga Docente Institucional */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Cuerpo Docente</span>
            <GraduationCap className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {MOCK_TEACHERS.length} Titulares
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">100% con Firma Digital Habilitada</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Horas de Contrato</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalContractHours} hrs/sem
          </div>
          <p className="text-[11px] text-slate-500">Promedio 39.3 hrs por profesor</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Horas Lectivas Asignadas</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalAssignedHours} hrs ({Math.round((totalAssignedHours / totalContractHours) * 100)}%)
          </div>
          <p className="text-[11px] text-slate-500">Margen legal de horas no lectivas respetado</p>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] font-bold uppercase tracking-wider">Planificaciones al Día</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {avgPlanning}%
          </div>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">Cumplimiento UTP Alto</p>
        </div>
      </div>

      {/* 3. Barra de Búsqueda y Filtros */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Búsqueda */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar profesor por Nombre, RUN, Especialidad o Ramo..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Filtros Dropdown */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
            >
              <option value="all">Todos los Departamentos</option>
              <option value="Matemática & Ciencias">Matemática & Ciencias</option>
              <option value="Lenguaje & Humanidades">Lenguaje & Humanidades</option>
              <option value="Idiomas">Idiomas</option>
              <option value="Artes & Ed. Física">Artes & Ed. Física</option>
            </select>

            <button
              onClick={() => setOnlyHeadTeachers(!onlyHeadTeachers)}
              className={`px-3 py-2 rounded-xl border font-semibold transition ${
                onlyHeadTeachers
                  ? "bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border-brand-300"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              }`}
            >
              Solo Profesores Jefes
            </button>

            {/* Alternar Vista Tarjetas / Tabla */}
            <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 transition ${
                  viewMode === "cards"
                    ? "bg-brand-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700"
                }`}
                title="Vista Tarjetas de Perfil"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 transition ${
                  viewMode === "table"
                    ? "bg-brand-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700"
                }`}
                title="Vista Lista Tabla"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Renderizado: Tarjetas vs Tabla */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => {
            const utilizationPercent = Math.round(
              (teacher.assignedHours / teacher.contractHours) * 100
            );

            return (
              <div
                key={teacher.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:border-brand-400 dark:hover:border-brand-600 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top: Avatar, Nombre y Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-black text-base shadow-md shadow-brand-500/20 shrink-0">
                        {teacher.name
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-tight">
                          {teacher.name}
                        </h3>
                        <p className="font-mono text-[11px] text-slate-400 mt-0.5">{teacher.rut}</p>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200">
                      {teacher.status}
                    </span>
                  </div>

                  {/* Especialidad y Depto */}
                  <div className="text-xs space-y-1">
                    <p className="text-slate-600 dark:text-slate-300 font-medium">
                      {teacher.specialty}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap text-[11px]">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                        {teacher.department}
                      </span>
                      {teacher.headTeacherOf && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold border border-purple-200">
                          Jefe: {teacher.headTeacherOf}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Barra de Carga Horaria */}
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-500">Carga Horaria Semanal</span>
                      <span className="text-slate-900 dark:text-white">
                        {teacher.assignedHours} / {teacher.contractHours} hrs ({utilizationPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          utilizationPercent > 90
                            ? "bg-amber-500"
                            : utilizationPercent > 70
                            ? "bg-brand-600"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${utilizationPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Asignaturas Asignadas Chips */}
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[11px] font-bold uppercase text-slate-400 flex items-center justify-between">
                      <span>Materias a Cargo ({teacher.subjects.length})</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {teacher.subjects.reduce((a, s) => a + s.weeklyHours, 0)} hrs lectivas
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {teacher.subjects.map((sub) => (
                        <span
                          key={sub.id}
                          className="px-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-semibold border border-slate-200 dark:border-slate-700 flex items-center gap-1"
                        >
                          <span>{sub.name}</span>
                          <span className="text-[10px] font-bold text-brand-600 dark:text-brand-400">
                            ({sub.course})
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Botones de Acción */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    onClick={() => onOpenSubjectAssignment(teacher)}
                    className="py-2 px-3 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800 flex items-center justify-center gap-1.5 transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Asignar Materias</span>
                  </button>

                  <button
                    onClick={() => onSelectTeacherForEdit(teacher)}
                    className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 transition"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar Perfil</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Vista Tabla */
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Docente</th>
                  <th className="py-3.5 px-4">Especialidad & Depto</th>
                  <th className="py-3.5 px-4 text-center">Jefatura</th>
                  <th className="py-3.5 px-4 text-center">Carga Horaria</th>
                  <th className="py-3.5 px-4">Asignaturas</th>
                  <th className="py-3.5 px-4 text-center">Planificación</th>
                  <th className="py-3.5 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTeachers.map((tch) => (
                  <tr key={tch.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{tch.name}</div>
                      <div className="font-mono text-[11px] text-slate-400">{tch.rut} • {tch.email}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">{tch.specialty}</span>
                      <span className="text-[11px] text-slate-400">{tch.department}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {tch.headTeacherOf ? (
                        <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold text-[10px]">
                          {tch.headTeacherOf}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {tch.assignedHours} / {tch.contractHours} hrs
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {tch.subjects.map((s) => (
                          <span
                            key={s.id}
                            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-medium"
                          >
                            {s.name} ({s.course})
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-bold text-emerald-600">{tch.planningProgress}%</span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenSubjectAssignment(tch)}
                          className="p-1.5 rounded-lg hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-800 text-slate-400 transition"
                          title="Asignar Materias"
                        >
                          <BookOpen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSelectTeacherForEdit(tch)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 hover:text-slate-800 dark:hover:bg-slate-800 text-slate-400 transition"
                          title="Editar Perfil"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
