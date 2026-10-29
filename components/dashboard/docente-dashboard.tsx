"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  QrCode,
  Award,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileEdit,
  Send,
  CalendarCheck,
  ChevronRight,
  Plus,
  Sparkles,
  Search,
  MessageSquare,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  GraduationCap,
  Mail,
  UserCheck,
  Laptop,
  Check,
  Bell,
  FileText,
} from "lucide-react";
import { ContextualHeader } from "./contextual-header";
import { AcademicSummaryCard } from "./academic-summary-card";
import { AdaptiveTable } from "./adaptive-table";
import { AnnouncementModal } from "./announcement-modal";
import { BoletinDeNotas } from "./boletin-de-notas";
import { TeacherDirectoryManager } from "@/components/features/teachers/teacher-directory-manager";
import { cn } from "@/lib/utils/cn";

export interface DocenteDashboardProps {
  schoolSlug: string;
  teacherName?: string;
  myCoursesCount?: number;
}

export function DocenteDashboard({
  schoolSlug,
  teacherName = "Prof. Julio Molina",
}: DocenteDashboardProps) {
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState<boolean>(false);
  const [activeTeacherTab, setActiveTeacherTab] = useState<"resumen" | "cursos" | "notas" | "boletin" | "docentes">("resumen");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        authorName={teacherName}
        schoolName="Liceo Politécnico Marga Marga (LPMM)"
      />

      {/* Header Contextual */}
      <ContextualHeader
        schoolName="Liceo Politécnico Marga Marga (LPMM)"
        institutionalCode="RBD 10240"
        academicYear="2026"
        term="1er Semestre"
        roleTitle="Docente de Especialidad · Programación"
        roleBadgeColor="text-indigo-400 bg-indigo-500/10 border-indigo-500/30"
        userName={teacherName}
        greeting="Libro de Clases Digital & Gestión Pedagógica"
        quickActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-500/20 min-h-[44px] cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              <span>Enviar Anuncio</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTeacherTab("boletin")}
              className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs transition flex items-center gap-2 shadow-md min-h-[44px] cursor-pointer"
            >
              <FileText className="w-4 h-4 text-slate-950" />
              <span>Boletín de Notas</span>
            </button>
          </div>
        }
      />

      {/* Selector de Pestañas Interactivas para Docentes */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: "resumen", label: "Panel Principal", icon: BookOpen },
          { id: "cursos", label: "Mis Cursos (3° Medio E)", icon: Users, badge: "Programación" },
          { id: "notas", label: "Ingreso de Notas (Decreto 67)", icon: FileEdit },
          { id: "boletin", label: "Boletines de Alumnos", icon: FileText, badge: "Oficial" },
          { id: "docentes", label: "Plantel Docente", icon: GraduationCap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTeacherTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTeacherTab(tab.id as any)}
              className={cn(
                "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shrink-0 cursor-pointer border",
                isActive
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-md text-[10px] font-extrabold",
                  isActive ? "bg-white/20 text-white" : "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* RENDERIZADO DE CONTENIDO SEGÚN PESTAÑA DOCENTE */}
      {activeTeacherTab === "boletin" ? (
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 p-4 rounded-2xl text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between">
            <span>
              <strong>Generador de Boletines de Notas por Curso:</strong> Selecciona un estudiante de la nómina de 3.º Medio E para revisar y generar su boletín oficial Decreto 67.
            </span>
          </div>
          <BoletinDeNotas
            schoolName="Liceo Politécnico Marga Marga (LPMM)"
            rbdCode="RBD 10240"
            studentKey="3E-01"
            allowStudentSelect={true}
          />
        </div>
      ) : activeTeacherTab === "docentes" ? (
        <div className="space-y-4">
          <TeacherDirectoryManager schoolSlug={schoolSlug} />
        </div>
      ) : activeTeacherTab === "cursos" ? (
        <div className="bg-white dark:bg-[#0C1425] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Nómina Oficial de Estudiantes — 3.º Medio E (Especialidad Programación)
              </h3>
              <p className="text-xs text-slate-500">Profesor Jefe / Docente de Módulo: Prof. Julio Molina</p>
            </div>
            <span className="px-3 py-1 rounded-xl text-xs font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              17 Estudiantes Asignados
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-[10px] font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3">N°</th>
                  <th className="p-3">Estudiante</th>
                  <th className="p-3">Correo Electrónico</th>
                  <th className="p-3 text-center">Promedio</th>
                  <th className="p-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {[
                  { id: 1, name: "Alejandra López", email: "lopezalecco@gmail.com", avg: "6.8" },
                  { id: 2, name: "Miguel Sanhueza", email: "miguel2+sanhueza@gmail.com", avg: "6.5" },
                  { id: 3, name: "Maithe Lobos", email: "Xulimai.lobos@gmail.com", avg: "6.4" },
                  { id: 4, name: "Matias V.", email: "matiarelano602@gmail.com", avg: "6.3" },
                  { id: 5, name: "Benjamín Ramírez", email: "benjaminramirez821292@gmail.com", avg: "6.5" },
                  { id: 6, name: "Elias Schiller", email: "treintiseisytreintiseisanny8@gmail.com", avg: "6.1" },
                  { id: 7, name: "María Figueroa", email: "Bunnyfunnytravel@gmail.com", avg: "6.6" },
                  { id: 8, name: "Jessy Labraña", email: "jessylabraña5@gmail.com", avg: "6.2" },
                  { id: 9, name: "Martín Ruiz", email: "marvizgasparcabrales@gmail.com", avg: "6.0" },
                  { id: 10, name: "Christopher Ruiz", email: "niamexdxd@gmail.com", avg: "6.4" },
                ].map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-400">{s.id}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{s.name}</td>
                    <td className="p-3 font-mono text-blue-600 dark:text-blue-400">{s.email}</td>
                    <td className="p-3 text-center font-mono font-black text-blue-600 dark:text-blue-400">{s.avg}</td>
                    <td className="p-3 text-center">
                      <button
                        type="button"
                        onClick={() => setActiveTeacherTab("boletin")}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 text-[11px] font-bold hover:bg-blue-100 cursor-pointer"
                      >
                        Ver Boletín
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTeacherTab === "notas" ? (
        <div className="bg-white dark:bg-[#0C1425] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileEdit className="w-5 h-5 text-amber-500" />
              <span>Matriz de Ingreso de Calificaciones — Decreto 67 MINEDUC</span>
            </h3>
            <span className="text-xs font-bold text-slate-500">1er Semestre 2026</span>
          </div>
          <p className="text-xs text-slate-500">
            Ingresa y modifica las notas parciales N1..N5 para los estudiantes de 3.º Medio E en los módulos de Programación Backend y Bases de Datos.
          </p>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-300 font-medium">
            ✔ Cálculo automático de promedios ponderados y semáforo de aprobación en tiempo real.
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <AcademicSummaryCard
              title="Módulos Asignados"
              value="3"
              subtitle="4° Medio E y 3° Medio E (Programación)"
              badgeLabel="Plan Especialidad TP"
              icon={BookOpen}
              accentColor="blue"
            />
            <AcademicSummaryCard
              title="Promedio General Módulos"
              value="6.4"
              subtitle="Cumplimiento Decreto 67 MINEDUC"
              badgeLabel="1er Semestre"
              icon={Award}
              accentColor="indigo"
            />
            <AcademicSummaryCard
              title="Asistencia Módulos"
              value="93.8%"
              subtitle="Registro diario en regla"
              badgeLabel="Semana Actual"
              icon={CalendarCheck}
              accentColor="emerald"
            />
            <AcademicSummaryCard
              title="Evaluaciones Registradas"
              value="100%"
              subtitle="Sin pendientes de corrección"
              badgeLabel="Al Día"
              icon={Clock}
              accentColor="purple"
            />
          </div>

          {/* Accesos Rápidos a Módulos Docentes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setActiveTeacherTab("cursos")}
              className="p-5 rounded-3xl bg-white dark:bg-[#0C1425] border border-slate-200 dark:border-slate-800 text-left hover:border-blue-500 transition shadow-sm cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-blue-600 transition">
                Mis Cursos & Lista 3.º Medio E
              </h4>
              <p className="text-xs text-slate-500 mt-1">Revisa estudiantes y correos actualizados</p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTeacherTab("boletin")}
              className="p-5 rounded-3xl bg-white dark:bg-[#0C1425] border border-slate-200 dark:border-slate-800 text-left hover:border-amber-500 transition shadow-sm cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 transition">
                Boletines de Notas Decreto 67
              </h4>
              <p className="text-xs text-slate-500 mt-1">Visualiza e imprime informes por estudiante</p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTeacherTab("docentes")}
              className="p-5 rounded-3xl bg-white dark:bg-[#0C1425] border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 transition shadow-sm cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                Directorio Docente LPMM
              </h4>
              <p className="text-xs text-slate-500 mt-1">Directorio de profesores y asignaciones</p>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
