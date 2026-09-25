"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Plus,
  MoreVertical,
  UserCheck,
  AlertTriangle,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
  SlidersHorizontal,
  GraduationCap,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  User,
  LayoutGrid,
  List,
  RefreshCw,
} from "lucide-react";

export interface StudentMockupData {
  id: string;
  rut: string;
  name: string;
  course: string;
  level: "Básica" | "Media" | "Parvularia";
  avgGrade: number;
  attendance: number;
  status: "Activo" | "Condicional" | "Retirado" | "En Refuerzo";
  guardianName: string;
  guardianPhone: string;
  guardianEmail: string;
  riskFactor?: string;
  pie: boolean;
  scholarship: boolean;
}

export const MOCK_STUDENTS: StudentMockupData[] = [
  {
    id: "st-1",
    rut: "23.491.028-4",
    name: "Alarcón Valenzuela, Martín Ignacio",
    course: "1° Medio B",
    level: "Media",
    avgGrade: 3.8,
    attendance: 81.4,
    status: "En Refuerzo",
    guardianName: "María Silva",
    guardianPhone: "+56 9 8765 4321",
    guardianEmail: "maria.silva@gmail.com",
    riskFactor: "Inasistencia crítica y 2 notas rojas en Matemática",
    pie: false,
    scholarship: true,
  },
  {
    id: "st-2",
    rut: "23.812.390-1",
    name: "Barraza Figueroa, Constanza Paz",
    course: "8° Básico A",
    level: "Básica",
    avgGrade: 6.4,
    attendance: 98.2,
    status: "Activo",
    guardianName: "Carlos Barraza",
    guardianPhone: "+56 9 7654 3210",
    guardianEmail: "c.barraza@empresa.cl",
    pie: false,
    scholarship: false,
  },
  {
    id: "st-3",
    rut: "24.102.948-K",
    name: "Carrasco Morales, Joaquín Andrés",
    course: "2° Medio A",
    level: "Media",
    avgGrade: 4.1,
    attendance: 84.0,
    status: "Condicional",
    guardianName: "Verónica Morales",
    guardianPhone: "+56 9 6543 2109",
    guardianEmail: "vero.morales@outlook.com",
    riskFactor: "Bajo 85% asistencia por licencias no regularizadas",
    pie: true,
    scholarship: true,
  },
  {
    id: "st-4",
    rut: "23.945.109-7",
    name: "Donoso Espinoza, Sofía Ignacia",
    course: "3° Medio B",
    level: "Media",
    avgGrade: 5.9,
    attendance: 95.0,
    status: "Activo",
    guardianName: "Raúl Donoso",
    guardianPhone: "+56 9 5432 1098",
    guardianEmail: "raul.donoso@gmail.com",
    pie: false,
    scholarship: false,
  },
  {
    id: "st-5",
    rut: "24.512.003-8",
    name: "Escobar Muñoz, Mateo Vicente",
    course: "7° Básico B",
    level: "Básica",
    avgGrade: 5.2,
    attendance: 92.6,
    status: "Activo",
    guardianName: "Claudia Muñoz",
    guardianPhone: "+56 9 4321 0987",
    guardianEmail: "claudia.m@gmail.com",
    pie: true,
    scholarship: false,
  },
  {
    id: "st-6",
    rut: "23.701.884-2",
    name: "Fuentes Garrido, Antonia Belén",
    course: "1° Medio B",
    level: "Media",
    avgGrade: 3.6,
    attendance: 79.5,
    status: "En Refuerzo",
    guardianName: "Jorge Fuentes",
    guardianPhone: "+56 9 3210 9876",
    guardianEmail: "jorge.fuentes@mineria.cl",
    riskFactor: "Riesgo de repitencia: 3 asignaturas con promedio bajo 4.0",
    pie: false,
    scholarship: true,
  },
  {
    id: "st-7",
    rut: "25.019.221-5",
    name: "Gómez Saavedra, Lucas Emilio",
    course: "6° Básico A",
    level: "Básica",
    avgGrade: 6.8,
    attendance: 99.1,
    status: "Activo",
    guardianName: "Patricia Saavedra",
    guardianPhone: "+56 9 2109 8765",
    guardianEmail: "patricia.saavedra@gmail.com",
    pie: false,
    scholarship: false,
  },
  {
    id: "st-8",
    rut: "23.332.901-3",
    name: "Herrera Pavez, Isidora Andrea",
    course: "4° Medio A",
    level: "Media",
    avgGrade: 6.2,
    attendance: 96.4,
    status: "Activo",
    guardianName: "Manuel Herrera",
    guardianPhone: "+56 9 1098 7654",
    guardianEmail: "m.herrera@servicios.cl",
    pie: false,
    scholarship: true,
  },
];

interface StudentTableMockupProps {
  students?: StudentMockupData[];
  isLoading?: boolean;
  isLive?: boolean;
  onRefresh?: () => Promise<void> | void;
  showHotspots?: boolean;
  onSelectStudent: (student: StudentMockupData) => void;
  onOpenNewStudentModal: () => void;
}

export function StudentTableMockup({
  students,
  isLoading = false,
  isLive = false,
  onRefresh,
  showHotspots = false,
  onSelectStudent,
  onOpenNewStudentModal,
}: StudentTableMockupProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [onlyPie, setOnlyPie] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"name" | "avgGrade" | "attendance">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sourceStudents = students && students.length > 0 ? students : MOCK_STUDENTS;

  // Filtros aplicados
  const filteredStudents = useMemo(() => {
    return sourceStudents.filter((st) => {
      const matchSearch =
        st.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
        st.guardianName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCourse = selectedCourse === "all" || st.course === selectedCourse;
      const matchLevel = selectedLevel === "all" || st.level === selectedLevel;
      const matchStatus = selectedStatus === "all" || st.status === selectedStatus;
      const matchPie = !onlyPie || st.pie;

      return matchSearch && matchCourse && matchLevel && matchStatus && matchPie;
    }).sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortBy === "avgGrade") {
        return sortOrder === "asc" ? a.avgGrade - b.avgGrade : b.avgGrade - a.avgGrade;
      }
      if (sortBy === "attendance") {
        return sortOrder === "asc" ? a.attendance - b.attendance : b.attendance - a.attendance;
      }
      return 0;
    });
  }, [sourceStudents, searchTerm, selectedCourse, selectedLevel, selectedStatus, onlyPie, sortBy, sortOrder]);

  function toggleSelectAll() {
    if (selectedRowIds.length === filteredStudents.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredStudents.map((s) => s.id));
    }
  }

  function toggleSelectRow(id: string) {
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }

  function toggleSort(field: "name" | "avgGrade" | "attendance") {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Header del Módulo & Barra de Acciones Principales */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Directorio de Estudiantes y Matrícula
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 font-extrabold text-xs border border-brand-200 dark:border-brand-800">
              {filteredStudents.length} alumnos
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Control de asistencia, rendimiento académico, información de apoderados y gestión de alertas tempranas.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => {
              alert("Exportando nómina oficial MINEDUC en formato Excel/CSV...");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 text-slate-700 dark:text-slate-200 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Nómina</span>
          </button>

          <button
            onClick={onOpenNewStudentModal}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/20 transition ${
              showHotspots ? "ring-4 ring-purple-400 animate-pulse" : ""
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Matricular Nuevo Alumno</span>
          </button>
        </div>
      </div>

      {/* 2. Barra de Búsqueda & Filtros Facetados */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Campo Búsqueda */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por Nombre, RUN o Apoderado..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Filtros Dropdown */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
            >
              <option value="all">Todos los Niveles</option>
              <option value="Básica">Enseñanza Básica</option>
              <option value="Media">Enseñanza Media</option>
              <option value="Parvularia">Parvularia</option>
            </select>

            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
            >
              <option value="all">Todos los Cursos</option>
              <option value="1° Medio B">1° Medio B</option>
              <option value="2° Medio A">2° Medio A</option>
              <option value="3° Medio B">3° Medio B</option>
              <option value="4° Medio A">4° Medio A</option>
              <option value="6° Básico A">6° Básico A</option>
              <option value="7° Básico B">7° Básico B</option>
              <option value="8° Básico A">8° Básico A</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-hidden font-medium"
            >
              <option value="all">Todos los Estados</option>
              <option value="Activo">Activo</option>
              <option value="En Refuerzo">En Refuerzo (&lt; 4.0)</option>
              <option value="Condicional">Condicional</option>
            </select>

            <button
              onClick={() => setOnlyPie(!onlyPie)}
              className={`px-3 py-2 rounded-xl border font-semibold transition ${
                onlyPie
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-300"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              }`}
            >
              Programa PIE
            </button>

            {/* Alternar Vista Tabla / Tarjetas */}
            <div className="flex border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 transition ${
                  viewMode === "table"
                    ? "bg-brand-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700"
                }`}
                title="Vista Tabla"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode("cards")}
                className={`p-2 transition ${
                  viewMode === "cards"
                    ? "bg-brand-600 text-white"
                    : "bg-white dark:bg-slate-800 text-slate-400 hover:text-slate-700"
                }`}
                title="Vista Tarjetas"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Acciones en Lote (cuando hay seleccionados) */}
        {selectedRowIds.length > 0 && (
          <div className="p-2.5 rounded-xl bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 flex items-center justify-between text-xs animate-in fade-in">
            <span className="font-bold text-brand-900 dark:text-brand-200">
              {selectedRowIds.length} alumnos seleccionados
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => alert(`Enviando comunicado a ${selectedRowIds.length} apoderados...`)}
                className="px-2.5 py-1 rounded-lg bg-brand-600 text-white font-bold hover:bg-brand-700"
              >
                Enviar Comunicado Grupal
              </button>
              <button
                onClick={() => setSelectedRowIds([])}
                className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium"
              >
                Deseleccionar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Renderizado: Tabla Responsiva de Estudiantes */}
      {viewMode === "table" ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-850 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
                <tr>
                  <th className="py-3.5 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        filteredStudents.length > 0 &&
                        selectedRowIds.length === filteredStudents.length
                      }
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                  </th>
                  <th
                    className="py-3.5 px-4 cursor-pointer hover:text-slate-800"
                    onClick={() => toggleSort("name")}
                  >
                    <div className="flex items-center gap-1">
                      <span>Estudiante / RUN</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Curso & Nivel</th>
                  <th
                    className="py-3.5 px-4 text-center cursor-pointer hover:text-slate-800"
                    onClick={() => toggleSort("avgGrade")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Promedio</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th
                    className="py-3.5 px-4 text-center cursor-pointer hover:text-slate-800"
                    onClick={() => toggleSort("attendance")}
                  >
                    <div className="flex items-center justify-center gap-1">
                      <span>Asistencia</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                  <th className="py-3.5 px-4">Apoderado Titular</th>
                  <th className="py-3.5 px-4 text-center">Estado</th>
                  <th className="py-3.5 px-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredStudents.map((st) => (
                  <tr
                    key={st.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => onSelectStudent(st)}
                  >
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedRowIds.includes(st.id)}
                        onChange={() => toggleSelectRow(st.id)}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-brand-600 group-hover:text-white transition">
                          {(st?.name || "")
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{st.name}</span>
                            {st.pie && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                                PIE
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-slate-400">{st.rut}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {st.course}
                      </span>
                      <span className="text-[11px] text-slate-400">{st.level}</span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded-md ${
                          st.avgGrade < 4.0
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300"
                            : st.avgGrade < 5.0
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300"
                        }`}
                      >
                        {st.avgGrade.toFixed(1)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span
                          className={`font-extrabold ${
                            st.attendance < 85 ? "text-rose-600" : "text-slate-700 dark:text-slate-300"
                          }`}
                        >
                          {st.attendance}%
                        </span>
                        <div className="w-12 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-0.5">
                          <div
                            className={`h-full ${
                              st.attendance < 85 ? "bg-rose-500" : "bg-emerald-500"
                            }`}
                            style={{ width: `${st.attendance}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {st.guardianName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{st.guardianPhone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          st.status === "Activo"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200"
                            : st.status === "En Refuerzo"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200"
                        }`}
                      >
                        {st.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectStudent(st)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-brand-600 transition"
                        title="Ver Ficha Completa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Vista en Cuadrícula de Tarjetas Responsiva */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStudents.map((st) => (
            <div
              key={st.id}
              onClick={() => onSelectStudent(st)}
              className="cursor-pointer p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-sm">
                  {(st?.name || "")
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    st.status === "Activo"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                  }`}
                >
                  {st.status}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                  {st.name}
                </h3>
                <p className="text-xs text-slate-400 font-mono">{st.rut}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Promedio</span>
                  <span className={`text-sm font-black ${st.avgGrade < 4.0 ? "text-rose-600" : "text-slate-900 dark:text-white"}`}>
                    {st.avgGrade.toFixed(1)}
                  </span>
                </div>

                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Asistencia</span>
                  <span className={`text-sm font-black ${st.attendance < 85 ? "text-rose-600" : "text-slate-900 dark:text-white"}`}>
                    {st.attendance}%
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>{st.course}</span>
                <span className="text-brand-600 font-semibold hover:underline">Ver Ficha →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginador Mockup */}
      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        <span>Mostrando {filteredStudents.length} de 842 estudiantes matriculados</span>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-bold text-slate-800 dark:text-slate-200">Página 1 de 1</span>
          <button className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
