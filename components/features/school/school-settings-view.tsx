"use client";

import { useState, useMemo } from "react";
import {
  Building2,
  Calendar,
  GraduationCap,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Palette,
  Percent,
  Plus,
  Edit2,
  Lock,
  Unlock,
  Sparkles,
  ShieldCheck,
  Check,
  Layers,
  Award,
  BookOpen,
  Download,
  FileArchive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreatePeriodModal } from "./create-period-modal";
import { EditPeriodModal } from "./edit-period-modal";
import { SchoolBackupCard } from "./school-backup-card";
import { apiClient } from "@/lib/api";

export interface AcademicPeriodItem {
  id: string;
  name: string;
  year: number;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isClosed: boolean;
  weightPercentage?: number;
  assessmentsCount?: number;
}

export interface SchoolFullDetails {
  school: {
    id: string;
    name: string;
    slug: string;
    institutionalCode: string;
    address: string;
    city: string;
    country: string;
    timezone: string;
    contactEmail: string;
    contactPhone: string;
    motto: string;
    status: string;
  };
  settings: {
    termType: string;
    minPassingGrade: number;
    minGrade: number;
    maxGrade: number;
    gradeScalePrecision: number;
    primaryColor: string;
    requireAttendanceNote: boolean;
    minAttendancePercentage?: number;
    defaultAssessmentWeight?: number;
  };
  academicPeriods: AcademicPeriodItem[];
}

interface SchoolSettingsViewProps {
  initialData: SchoolFullDetails;
  schoolId: string;
  schoolSlug: string;
}

export function SchoolSettingsView({ initialData, schoolId, schoolSlug }: SchoolSettingsViewProps) {
  // Tabs: "INSTITUTIONAL" | "GRADING" | "PERIODS" | "BACKUP"
  const [activeTab, setActiveTab] = useState<"INSTITUTIONAL" | "GRADING" | "PERIODS" | "BACKUP">("INSTITUTIONAL");

  // State for form data
  const [schoolData, setSchoolData] = useState(initialData.school);
  const [settingsData, setSettingsData] = useState(initialData.settings);
  const [periods, setPeriods] = useState<AcademicPeriodItem[]>(initialData.academicPeriods);

  // Initial snapshot to track pending changes
  const [initialSnapshot] = useState({
    school: initialData.school,
    settings: initialData.settings,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Modals state
  const [isCreatePeriodOpen, setIsCreatePeriodOpen] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<AcademicPeriodItem | null>(null);

  // Calculate if there are unsaved changes in general settings
  const hasUnsavedChanges = useMemo(() => {
    return (
      JSON.stringify(schoolData) !== JSON.stringify(initialSnapshot.school) ||
      JSON.stringify(settingsData) !== JSON.stringify(initialSnapshot.settings)
    );
  }, [schoolData, settingsData, initialSnapshot]);

  // Calculate sum of period weights
  const totalWeight = useMemo(() => {
    return periods.reduce((acc, p) => acc + (p.weightPercentage || 0), 0);
  }, [periods]);

  // Current active period
  const currentPeriod = useMemo(() => {
    return periods.find((p) => p.isCurrent) || periods[0];
  }, [periods]);

  // Save General & Grading Settings
  const handleSaveGeneralSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setToastMessage(null);

    // Basic frontend validations
    if (settingsData.minGrade >= settingsData.maxGrade) {
      setToastMessage({
        type: "error",
        text: "La nota mínima debe ser estrictamente menor que la nota máxima.",
      });
      setIsSaving(false);
      return;
    }

    if (
      settingsData.minPassingGrade < settingsData.minGrade ||
      settingsData.minPassingGrade > settingsData.maxGrade
    ) {
      setToastMessage({
        type: "error",
        text: "La nota de aprobación debe estar comprendida entre la nota mínima y máxima.",
      });
      setIsSaving(false);
      return;
    }

    try {
      const payload = {
        name: schoolData.name,
        institutionalCode: schoolData.institutionalCode,
        address: schoolData.address,
        city: schoolData.city,
        country: schoolData.country,
        timezone: schoolData.timezone,
        contactEmail: schoolData.contactEmail,
        contactPhone: schoolData.contactPhone,
        motto: schoolData.motto,
        termType: settingsData.termType,
        minGrade: settingsData.minGrade,
        maxGrade: settingsData.maxGrade,
        minPassingGrade: settingsData.minPassingGrade,
        gradeScalePrecision: settingsData.gradeScalePrecision,
        primaryColor: settingsData.primaryColor,
        requireAttendanceNote: settingsData.requireAttendanceNote,
        minAttendancePercentage: settingsData.minAttendancePercentage,
        defaultAssessmentWeight: settingsData.defaultAssessmentWeight,
      };

      await apiClient.patch(`/api/schools/${schoolId}/settings`, payload);

      setToastMessage({
        type: "success",
        text: "Configuración institucional guardada exitosamente.",
      });
    } catch (err: any) {
      setToastMessage({
        type: "error",
        text: err.message || "No se pudo guardar la configuración.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscardGeneralChanges = () => {
    setSchoolData(initialSnapshot.school);
    setSettingsData(initialSnapshot.settings);
    setToastMessage(null);
  };

  // Quick toggle active period
  const handleToggleCurrentPeriod = async (periodId: string) => {
    try {
      await apiClient.patch(`/api/schools/${schoolId}/academic-periods/${periodId}`, {
        isCurrent: true,
      });

      setPeriods((prev) =>
        prev.map((p) => ({
          ...p,
          isCurrent: p.id === periodId,
        }))
      );

      setToastMessage({
        type: "success",
        text: "Periodo lectivo activo actualizado con éxito.",
      });
    } catch (err: any) {
      setToastMessage({ type: "error", text: err.message });
    }
  };

  // Quick toggle closed state
  const handleToggleClosedPeriod = async (periodId: string, currentClosed: boolean) => {
    try {
      await apiClient.patch(`/api/schools/${schoolId}/academic-periods/${periodId}`, {
        isClosed: !currentClosed,
      });

      setPeriods((prev) =>
        prev.map((p) => (p.id === periodId ? { ...p, isClosed: !currentClosed } : p))
      );

      setToastMessage({
        type: "success",
        text: !currentClosed ? "Actas de calificaciones bloqueadas (solo lectura)." : "Actas de calificaciones desbloqueadas para edición.",
      });
    } catch (err: any) {
      setToastMessage({ type: "error", text: err.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast / Alertas reactivas */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl text-sm border flex items-center justify-between transition-all animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
              : "bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800/60"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toastMessage.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span className="font-medium">{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs opacity-70 hover:opacity-100 font-semibold px-2 py-1 rounded"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Resumen Ejecutivo de Métricas de Configuración */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider truncate">
              RBD Institucional
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
              {schoolData.institutionalCode || "Sin código"}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider truncate">
              Periodo Activo
            </span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 truncate block">
              {currentPeriod ? currentPeriod.name : "No asignado"}
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider truncate">
              Escala de Notas
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
              {settingsData.minGrade.toFixed(1)} a {settingsData.maxGrade.toFixed(1)} (Aprob: {settingsData.minPassingGrade.toFixed(1)})
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider truncate">
              Régimen Lectivo
            </span>
            <span className="text-sm font-bold text-slate-900 dark:text-white truncate block">
              {settingsData.termType === "SEMESTER"
                ? "Semestral (2)"
                : settingsData.termType === "TRIMESTER"
                ? "Trimestral (3)"
                : "Anual Continuo"}
            </span>
          </div>
        </div>
      </div>

      {/* Barra de Pestañas de Parametrización */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab("INSTITUTIONAL")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "INSTITUTIONAL"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Datos Institucionales
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("GRADING")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "GRADING"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Régimen y Calificaciones
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("PERIODS")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "PERIODS"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            Períodos y Ponderaciones ({periods.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("BACKUP")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "BACKUP"
                ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            Respaldo de Datos (.ZIP)
          </button>
        </div>

        {/* Botones de Acción Global */}
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 animate-in fade-in">
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Cambios pendientes
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDiscardGeneralChanges}
              disabled={isSaving}
              className="text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Descartar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleSaveGeneralSettings()}
              disabled={isSaving}
              className="shadow-sm"
            >
              <Save className="w-3.5 h-3.5 mr-1.5" />
              {isSaving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        )}
      </div>

      {/* CONTENIDO DE PESTAÑAS */}

      {/* 1. DATOS INSTITUCIONALES */}
      {activeTab === "INSTITUTIONAL" && (
        <form onSubmit={handleSaveGeneralSettings} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-600" />
                  Identidad y Ficha Institucional
                </h3>
                <p className="text-xs text-slate-500">
                  Información legal, oficial y datos de contacto de la institución educativa.
                </p>
              </div>
              <Badge variant="brand" className="text-xs font-mono">
                /{schoolSlug}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Nombre Oficial del Establecimiento *
                </label>
                <input
                  type="text"
                  required
                  value={schoolData.name}
                  onChange={(e) => setSchoolData({ ...schoolData, name: e.target.value })}
                  placeholder="Ej: Colegio San José"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Código Institucional / RBD *
                </label>
                <input
                  type="text"
                  value={schoolData.institutionalCode}
                  onChange={(e) => setSchoolData({ ...schoolData, institutionalCode: e.target.value })}
                  placeholder="Ej: CSJ-001 o 12345-6"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Dirección y Sede
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={schoolData.address}
                    onChange={(e) => setSchoolData({ ...schoolData, address: e.target.value })}
                    placeholder="Ej: Av. Libertador Bernardo O'Higgins 1234"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    value={schoolData.city}
                    onChange={(e) => setSchoolData({ ...schoolData, city: e.target.value })}
                    placeholder="Ej: Santiago"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    País
                  </label>
                  <input
                    type="text"
                    value={schoolData.country}
                    onChange={(e) => setSchoolData({ ...schoolData, country: e.target.value })}
                    placeholder="Chile"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Correo Electrónico de Contacto
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={schoolData.contactEmail}
                    onChange={(e) => setSchoolData({ ...schoolData, contactEmail: e.target.value })}
                    placeholder="contacto@sanjose.cl"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Teléfono de Contacto
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={schoolData.contactPhone}
                    onChange={(e) => setSchoolData({ ...schoolData, contactPhone: e.target.value })}
                    placeholder="+56 2 2345 6789"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                  Lema / Misión Institucional
                </label>
                <input
                  type="text"
                  value={schoolData.motto}
                  onChange={(e) => setSchoolData({ ...schoolData, motto: e.target.value })}
                  placeholder="Ej: Excelencia académica, formación valórica y compromiso comunitario"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Zona Horaria Institucional
                  </label>
                  <div className="relative">
                    <select
                      value={schoolData.timezone}
                      onChange={(e) => setSchoolData({ ...schoolData, timezone: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none appearance-none"
                    >
                      <option value="America/Santiago">America/Santiago (Chile Continental, UTC-3 / UTC-4)</option>
                      <option value="Pacific/Easter">Pacific/Easter (Isla de Pascua, UTC-5 / UTC-6)</option>
                      <option value="America/Punta_Arenas">America/Punta_Arenas (Magallanes, UTC-3 permanente)</option>
                      <option value="America/Lima">America/Lima (Perú, UTC-5)</option>
                      <option value="America/Bogota">America/Bogota (Colombia, UTC-5)</option>
                      <option value="America/Buenos_Aires">America/Buenos_Aires (Argentina, UTC-3)</option>
                    </select>
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                    Color de Identidad Institucional
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={settingsData.primaryColor}
                      onChange={(e) => setSettingsData({ ...settingsData, primaryColor: e.target.value })}
                      className="w-10 h-10 rounded-xl border border-slate-300 dark:border-slate-700 cursor-pointer p-0.5 bg-white shrink-0"
                    />
                    <div className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-mono text-xs uppercase font-bold text-slate-700 dark:text-slate-300">
                        {settingsData.primaryColor}
                      </span>
                      <div
                        className="w-5 h-5 rounded-full shadow-inner border border-white/20"
                        style={{ backgroundColor: settingsData.primaryColor }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSaving}
              className="px-6 shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Guardando..." : "Guardar Datos Institucionales"}
            </Button>
          </div>
        </form>
      )}

      {/* 2. RÉGIMEN Y CALIFICACIONES */}
      {activeTab === "GRADING" && (
        <form onSubmit={handleSaveGeneralSettings} className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-brand-600" />
                  Régimen Académico y Escala de Calificaciones
                </h3>
                <p className="text-xs text-slate-500">
                  Ajusta los rangos de notas, nota de corte para aprobación y requerimientos de asistencia.
                </p>
              </div>
            </div>

            {/* Estructura del Periodo */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-2">
                Estructura del Régimen Lectivo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                    settingsData.termType === "SEMESTER"
                      ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Semestral</span>
                    <input
                      type="radio"
                      name="termType"
                      value="SEMESTER"
                      checked={settingsData.termType === "SEMESTER"}
                      onChange={(e) => setSettingsData({ ...settingsData, termType: e.target.value })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    2 periodos académicos por año lectivo (1° y 2° Semestre). Ponderación estándar 50% / 50%.
                  </span>
                </label>

                <label
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                    settingsData.termType === "TRIMESTER"
                      ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Trimestral</span>
                    <input
                      type="radio"
                      name="termType"
                      value="TRIMESTER"
                      checked={settingsData.termType === "TRIMESTER"}
                      onChange={(e) => setSettingsData({ ...settingsData, termType: e.target.value })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    3 periodos académicos por año lectivo (1°, 2° y 3° Trimestre). Ponderación 33.3% cada uno.
                  </span>
                </label>

                <label
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col gap-1.5 ${
                    settingsData.termType === "ANNUAL"
                      ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/20"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">Anual Continuo</span>
                    <input
                      type="radio"
                      name="termType"
                      value="ANNUAL"
                      checked={settingsData.termType === "ANNUAL"}
                      onChange={(e) => setSettingsData({ ...settingsData, termType: e.target.value })}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    1 solo periodo continuo durante todo el ciclo lectivo con cierre único anual (100%).
                  </span>
                </label>
              </div>
            </div>

            {/* Escala de Calificaciones */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Parámetros de la Escala de Calificaciones
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Nota Mínima
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={100}
                    value={settingsData.minGrade}
                    onChange={(e) =>
                      setSettingsData({ ...settingsData, minGrade: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Escala estándar: 1.0</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Nota de Aprobación *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    max={100}
                    value={settingsData.minPassingGrade}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        minPassingGrade: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-emerald-600"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Notas inferiores se marcarán rojas
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Nota Máxima
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={1}
                    max={100}
                    value={settingsData.maxGrade}
                    onChange={(e) =>
                      setSettingsData({ ...settingsData, maxGrade: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">Escala estándar: 7.0</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Precisión Decimal
                  </label>
                  <select
                    value={settingsData.gradeScalePrecision}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        gradeScalePrecision: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                  >
                    <option value={0}>0 decimales (ej. 4)</option>
                    <option value={1}>1 decimal (ej. 4.5)</option>
                    <option value={2}>2 decimales (ej. 4.55)</option>
                  </select>
                  <span className="text-[11px] text-slate-500 mt-1 block">Redondeo automático</span>
                </div>
              </div>
            </div>

            {/* Asistencia y Promoción */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                  Asistencia Mínima para Promoción (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={settingsData.minAttendancePercentage ?? 85}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        minAttendancePercentage: parseFloat(e.target.value) || 85,
                      })
                    }
                    className="w-full px-3.5 py-2 pr-8 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Mineduc exige un 85% de asistencia mínima para la promoción regular de curso.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400">
                  Ponderación sugerida por Evaluación (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={settingsData.defaultAssessmentWeight ?? 20}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        defaultAssessmentWeight: parseFloat(e.target.value) || 20,
                      })
                    }
                    className="w-full px-3.5 py-2 pr-8 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none font-bold"
                  />
                  <Percent className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Porcentaje por defecto que se autocompletará al crear una nueva evaluación en la planilla.
                </p>
              </div>
            </div>

            {/* Opciones Adicionales */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settingsData.requireAttendanceNote}
                  onChange={(e) =>
                    setSettingsData({ ...settingsData, requireAttendanceNote: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300"
                />
                <div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 block">
                    Exigir justificación obligatoria en inasistencias y atrasos
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Requiere que el inspector o profesor agregue un motivo al registrar un alumno ausente.
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isSaving}
              className="px-6 shadow-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Guardando..." : "Guardar Régimen y Calificaciones"}
            </Button>
          </div>
        </form>
      )}

      {/* 3. PERIODOS Y PONDERACIONES */}
      {activeTab === "PERIODS" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  Gestión de Períodos Académicos y Semestres
                </h3>
                <p className="text-xs text-slate-500">
                  Administra las fechas de inicio, término, ponderación en el promedio final y el estado de actas.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreatePeriodOpen(true)}
                className="shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 mr-1.5" />
                Nuevo Período
              </Button>
            </div>

            {/* Barra de Distribución de Ponderaciones */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Distribución de Ponderación Anual
                </span>
                <span
                  className={`font-bold font-mono ${
                    totalWeight === 100
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-amber-600 dark:text-amber-400"
                  }`}
                >
                  Total: {totalWeight}% {totalWeight !== 100 && "(Debe sumar 100%)"}
                </span>
              </div>

              <div className="w-full h-3 bg-slate-200 dark:bg-slate-750 rounded-full overflow-hidden flex">
                {periods.map((p, idx) => {
                  const colors = ["bg-brand-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500"];
                  const color = colors[idx % colors.length];
                  const w = p.weightPercentage || 0;
                  return (
                    <div
                      key={p.id}
                      style={{ width: `${w}%` }}
                      title={`${p.name}: ${w}%`}
                      className={`${color} h-full transition-all duration-300 relative group`}
                    />
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                {periods.map((p, idx) => {
                  const colors = ["bg-brand-500", "bg-emerald-500", "bg-purple-500", "bg-amber-500"];
                  const color = colors[idx % colors.length];
                  return (
                    <div key={p.id} className="flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
                      <span>
                        {p.name}: <strong>{p.weightPercentage}%</strong>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tabla de Periodos */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-850/80 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                    <th className="py-3 px-4 font-semibold uppercase text-[11px]">Período Académico</th>
                    <th className="py-3 px-3 font-semibold uppercase text-[11px]">Año</th>
                    <th className="py-3 px-3 font-semibold uppercase text-[11px]">Fecha Inicio</th>
                    <th className="py-3 px-3 font-semibold uppercase text-[11px]">Fecha Término</th>
                    <th className="py-3 px-3 font-semibold uppercase text-[11px] text-center">Ponderación</th>
                    <th className="py-3 px-3 font-semibold uppercase text-[11px] text-center">Estado Activo</th>
                    <th className="py-3 px-3 font-semibold uppercase text-[11px] text-center">Actas</th>
                    <th className="py-3 px-4 font-semibold uppercase text-[11px] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {periods.map((p) => (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/70 dark:hover:bg-slate-850/50 transition-colors ${
                        p.isCurrent ? "bg-brand-50/30 dark:bg-brand-950/20" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-brand-600 shrink-0" />
                          <span>{p.name}</span>
                          {p.isCurrent && (
                            <Badge variant="brand" size="sm" dot dotPulse>
                              Vigente
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300 font-mono">
                        {p.year}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                        {p.startDate}
                      </td>
                      <td className="py-3.5 px-3 text-slate-600 dark:text-slate-300">
                        {p.endDate}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {p.weightPercentage ?? 50}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        {p.isCurrent ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Activo
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleCurrentPeriod(p.id)}
                            className="text-xs text-brand-600 hover:text-brand-700 hover:underline font-semibold"
                          >
                            Hacer Activo
                          </button>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleClosedPeriod(p.id, p.isClosed)}
                          className="inline-flex items-center gap-1 cursor-pointer transition"
                          title={p.isClosed ? "Click para desbloquear actas" : "Click para bloquear actas"}
                        >
                          {p.isClosed ? (
                            <Badge variant="danger" size="sm">
                              <Lock className="w-3 h-3 mr-1" />
                              Cerradas
                            </Badge>
                          ) : (
                            <Badge variant="success" size="sm">
                              <Unlock className="w-3 h-3 mr-1" />
                              Abiertas
                            </Badge>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingPeriod(p)}
                          className="h-8 px-2.5 text-slate-600 hover:text-slate-900"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1" />
                          Editar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. EXPORTACIÓN & RESPALDO OFICIAL */}
      {activeTab === "BACKUP" && (
        <SchoolBackupCard
          schoolId={schoolId}
          schoolSlug={schoolSlug}
          schoolName={schoolData.name}
        />
      )}

      {/* Modales de Periodos */}
      {isCreatePeriodOpen && (
        <CreatePeriodModal
          isOpen={isCreatePeriodOpen}
          onClose={() => setIsCreatePeriodOpen(false)}
          schoolId={schoolId}
          termType={settingsData.termType}
          existingPeriodsCount={periods.length}
          onPeriodCreated={(newPeriod) => {
            setPeriods((prev) => [...prev, newPeriod]);
            setToastMessage({
              type: "success",
              text: `Período "${newPeriod.name}" creado con éxito.`,
            });
          }}
        />
      )}

      {editingPeriod && (
        <EditPeriodModal
          isOpen={!!editingPeriod}
          period={editingPeriod}
          schoolId={schoolId}
          onClose={() => setEditingPeriod(null)}
          onPeriodUpdated={(updated) => {
            setPeriods((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setToastMessage({
              type: "success",
              text: `Período "${updated.name}" actualizado con éxito.`,
            });
          }}
          onPeriodDeleted={(periodId) => {
            setPeriods((prev) => prev.filter((p) => p.id !== periodId));
            setToastMessage({
              type: "success",
              text: "Período eliminado exitosamente.",
            });
          }}
        />
      )}
    </div>
  );
}
