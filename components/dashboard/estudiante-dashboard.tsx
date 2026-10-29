"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Award,
  CalendarCheck,
  QrCode,
  BookOpen,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  AlertTriangle,
  Bell,
  User,
  GraduationCap,
  Building2,
  Check,
  HeartHandshake,
  UserCheck,
  Inbox,
  BookMarked,
} from "lucide-react";
import { AcademicSummaryCard } from "./academic-summary-card";
import { ContextualHeader } from "./contextual-header";
import { AdaptiveTable } from "./adaptive-table";
import { BoletinDeNotas } from "./boletin-de-notas";
import { cn } from "@/lib/utils/cn";

export interface EstudianteDashboardProps {
  schoolSlug: string;
  studentName?: string;
  studentEmail?: string;
  courseName?: string;
  studentRut?: string;
  isStudentSelf?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  initialRecord?: any;
  availableDemoStudents?: any[];
}

export function EstudianteDashboard({
  schoolSlug,
  studentName = "Alejandra López (3.º Medio E)",
  studentEmail = "lopezalecco@gmail.com",
  courseName = "3° Medio E",
  activeTab: propActiveTab,
  onTabChange,
}: EstudianteDashboardProps) {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (propActiveTab) return propActiveTab;
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aurenis_student_active_tab");
        if (saved) return saved;
        const search = window.location.search;
        if (search.includes("tab=")) {
          return search.split("tab=")[1]?.split("&")[0] || "resumen";
        }
      } catch {
        // ignore
      }
    }
    return "resumen";
  });

  useEffect(() => {
    if (propActiveTab) {
      setCurrentTab(propActiveTab);
    }
  }, [propActiveTab]);

  useEffect(() => {
    const handleTabSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab: string }>;
      if (customEvent.detail?.tab) {
        setCurrentTab(customEvent.detail.tab);
      }
    };
    window.addEventListener("aurenis:student-tab-change", handleTabSync);
    return () => {
      window.removeEventListener("aurenis:student-tab-change", handleTabSync);
    };
  }, []);

  const handleTabSelect = (tabKey: string) => {
    setCurrentTab(tabKey);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("aurenis_student_active_tab", tabKey);
      } catch {
        // ignore
      }
    }
    if (onTabChange) {
      onTabChange(tabKey);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Contextual */}
      <ContextualHeader
        schoolName="Liceo Politécnico Marga Marga (LPMM)"
        institutionalCode="RBD 10240"
        academicYear="2026"
        term="1er Semestre"
        roleTitle="Estudiante LPMM"
        roleBadgeColor="text-purple-400 bg-purple-500/10 border-purple-500/30"
        userName={studentName}
        greeting={`¡Hola, ${studentName.split(" ")[0]}! 👋`}
        quickActions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTabSelect("boletin")}
              className={cn(
                "px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer",
                currentTab === "boletin"
                  ? "bg-amber-500 text-slate-950 font-black"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
              )}
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Ver Boletín Oficial</span>
            </button>
            <button
              type="button"
              onClick={() => { window.location.hash = "notifications"; }}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Bell className="w-4 h-4 text-cyan-300" />
              <span>Anuncios</span>
            </button>
          </div>
        }
      />

      {/* Selector de Pestañas Interactivas del Estudiante */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: "resumen", label: "Inicio", icon: GraduationCap },
          { id: "boletin", label: "Boletín de Notas", icon: FileText, badge: "Decreto 67" },
          { id: "notas", label: "Mis Calificaciones", icon: Award },
          { id: "asistencia", label: "Mi Asistencia", icon: CalendarCheck, badge: "91.1%" },
          { id: "horario", label: "Mi Horario", icon: Clock },
          { id: "asignaturas", label: "Mis Ramos", icon: BookOpen },
          { id: "apoyo", label: "Apoyo Escolar", icon: HeartHandshake },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id || (tab.id === "boletin" && currentTab === "notas");

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSelect(tab.id)}
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

      {/* RENDERIZADO DINÁMICO DE PESTAÑAS */}
      {currentTab === "boletin" || currentTab === "notas" ? (
        <BoletinDeNotas
          schoolName="Liceo Politécnico Marga Marga (LPMM)"
          rbdCode="RBD 10240"
          studentKey="3E-01"
          allowStudentSelect={true}
        />
      ) : currentTab === "asistencia" ? (
        <div className="bg-white dark:bg-[#0C1425] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-emerald-500" />
                <span>Registro Oficial de Asistencia Individual</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cumplimiento de la norma legal MINEDUC (mínimo 85% de asistencia presencial)
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
              91.1% Acumulado Anual
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-bold">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300">
              <span className="block text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Días Presente</span>
              <span className="text-2xl font-black mt-1 block">142 Días</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-300">
              <span className="block text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400">Inasistencias Justificadas</span>
              <span className="text-2xl font-black mt-1 block">8 Días</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
              <span className="block text-[10px] uppercase tracking-wider text-slate-500">Atrasos Registrados</span>
              <span className="text-2xl font-black mt-1 block">2 Registro(s)</span>
            </div>
          </div>
        </div>
      ) : currentTab === "horario" ? (
        <div className="bg-white dark:bg-[#0C1425] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span>Horario Semanal de Clases — 3.º Medio E</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((day, idx) => (
              <div key={day} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-extrabold text-blue-600 dark:text-blue-400 block border-b border-slate-200 dark:border-slate-700 pb-1">{day}</span>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold block text-slate-900 dark:text-white">08:15 - 09:45</span>
                  <span className="text-[11px] text-slate-500 block">Programación Backend</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">Sala Lab TP 2</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold block text-slate-900 dark:text-white">10:00 - 11:30</span>
                  <span className="text-[11px] text-slate-500 block">Bases de Datos SQL</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">Lab Redes</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Summary Cards General */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <AcademicSummaryCard
              title="Promedio General"
              value="6.5"
              subtitle="Rendimiento Destacado"
              badgeLabel="1er Semestre"
              icon={Award}
              accentColor="indigo"
            />
            <AcademicSummaryCard
              title="Asistencia Acumulada"
              value="91.1%"
              subtitle="Meta MINEDUC cumplida (>85%)"
              badgeLabel="Anual 2026"
              icon={CalendarCheck}
              accentColor="emerald"
            />
            <AcademicSummaryCard
              title="Asignaturas al Día"
              value="15 / 15"
              subtitle="Sin asignaturas reprobadas"
              badgeLabel="Decreto 67"
              icon={CheckCircle2}
              accentColor="blue"
            />
            <AcademicSummaryCard
              title="Curso / Especialidad"
              value={courseName}
              subtitle="Programación LPMM"
              badgeLabel="Especialidad TP"
              icon={GraduationCap}
              accentColor="purple"
            />
          </div>

          {/* Acceso Rápido a Boletín Oficial */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-white/20 text-white uppercase tracking-wider">
                Documento Oficial
              </span>
              <h3 className="text-base font-black">
                Boletín Oficial de Notas y Promedios (3.º Medio E)
              </h3>
              <p className="text-xs text-blue-100 max-w-xl">
                Revisa el desglose completo de notas parciales N1..N5, promedios semestrales y estado de promoción según el Reglamento Decreto 67.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleTabSelect("boletin")}
              className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition shadow-md shrink-0 cursor-pointer flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>Abrir Boletín de Notas</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
