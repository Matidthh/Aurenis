"use client";

/**
 * ============================================================================
 * MODAL DE CONFIGURACIÓN DE UMBRALES DEL SEMÁFORO DE CALIFICACIONES
 * ============================================================================
 * Permite a los administradores institucionales ajustar los puntos de corte
 * para los colores del semáforo (Rojo, Ámbar, Verde, Azul) según el proyecto
 * educativo de cada colegio, guardando la configuración de forma persistente
 * en la base de datos PostgreSQL mediante API REST aislada por tenant.
 * 
 * Responsables:
 * - 🎨 Lucas P. (Diseño Visual, Accesibilidad WCAG AA y Simulación en Vivo)
 * - 💻 Malcom Marcelo (Lógica de Cliente, Validación Reactiva y Persistencia)
 * - 👑 Maicol R. (Contrato de Datos y Aislamiento Multi-Tenant)
 * - 🛡️ Frank M. (Seguridad Normativa Decreto 67 y Validación de Rangos)
 * ============================================================================
 */

import React, { useState, useEffect, useId } from "react";
import {
  X,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Loader2,
  Shield,
  HelpCircle,
  Sparkles,
  Info,
} from "lucide-react";
import type { GradeColorThresholds } from "@/lib/validations/school.schema";
import { DEFAULT_GRADE_THRESHOLDS } from "@/lib/constants/grade-thresholds";

export interface GradeThresholdsModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolSlug: string;
  currentThresholds?: GradeColorThresholds | null;
  minGrade?: number;
  maxGrade?: number;
  isAdmin?: boolean;
  onThresholdsSaved: (updated: GradeColorThresholds) => void;
}

export function GradeThresholdsModal({
  isOpen,
  onClose,
  schoolSlug,
  currentThresholds,
  minGrade = 1.0,
  maxGrade = 7.0,
  isAdmin = true,
  onThresholdsSaved,
}: GradeThresholdsModalProps) {
  const modalTitleId = useId();

  // Estado editable local de umbrales
  const [thresholds, setThresholds] = useState<GradeColorThresholds>(() => {
    return currentThresholds || DEFAULT_GRADE_THRESHOLDS;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sincronizar estado cuando se abre el modal o cambian los props
  useEffect(() => {
    if (isOpen) {
      setThresholds(currentThresholds || DEFAULT_GRADE_THRESHOLDS);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  }, [isOpen, currentThresholds]);

  // Manejo de tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSaving) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen) return null;

  // Validación de consistencia matemática de los umbrales
  const isRedValid = thresholds.redMax >= minGrade && thresholds.redMax < thresholds.yellowMax;
  const isYellowValid = thresholds.yellowMax > thresholds.redMax && thresholds.yellowMax < thresholds.greenMax;
  const isGreenValid = thresholds.greenMax > thresholds.yellowMax && thresholds.greenMax <= thresholds.blueMax;
  const isBlueValid = thresholds.blueMax >= thresholds.greenMax && thresholds.blueMax <= maxGrade;
  const isAscending = isRedValid && isYellowValid && isGreenValid && isBlueValid;

  // Manejador de cambio numérico con precisión de 1 decimal
  const handleThresholdChange = (key: keyof GradeColorThresholds, val: number) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setThresholds((prev) => ({
      ...prev,
      [key]: Math.round(val * 10) / 10,
    }));
  };

  const handleLabelChange = (key: keyof GradeColorThresholds, val: string) => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setThresholds((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Presets pedagógicos oficiales y de alta exigencia
  const applyPreset = (preset: "decreto67" | "alta_exigencia" | "aprobacion_flexible") => {
    setErrorMessage(null);
    setSuccessMessage(null);
    if (preset === "decreto67") {
      setThresholds({
        redMax: 4.0,
        yellowMax: 5.0,
        greenMax: 6.0,
        blueMax: maxGrade,
        redLabel: "Insuficiente",
        yellowLabel: "Elemental",
        greenLabel: "Adecuado",
        blueLabel: "Destacado",
      });
    } else if (preset === "alta_exigencia") {
      setThresholds({
        redMax: 4.5,
        yellowMax: 5.5,
        greenMax: 6.5,
        blueMax: maxGrade,
        redLabel: "Reprobado / Refuerzo",
        yellowLabel: "Aprobado Básico",
        greenLabel: "Bueno",
        blueLabel: "Sobresaliente",
      });
    } else if (preset === "aprobacion_flexible") {
      setThresholds({
        redMax: 3.8,
        yellowMax: 4.8,
        greenMax: 5.8,
        blueMax: maxGrade,
        redLabel: "En Riesgo",
        yellowLabel: "Suficiente",
        greenLabel: "Satisfactorio",
        blueLabel: "Excelente",
      });
    }
  };

  // Guardar en la base de datos vía API REST
  const handleSave = async () => {
    if (!isAdmin) return;

    if (!isAscending) {
      setErrorMessage(
        "Los umbrales deben ser estrictamente ascendentes: Rojo < Ámbar < Verde ≤ Azul y encontrarse dentro de la escala oficial."
      );
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/schools/${schoolSlug}/settings/thresholds`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(thresholds),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No fue posible guardar los umbrales en el servidor escolar.");
      }

      setSuccessMessage("Configuración guardada exitosamente en la base de datos.");
      onThresholdsSaved(data.data?.thresholds || thresholds);

      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error inesperado al persistir la configuración."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={modalTitleId}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Cabecera del Modal */}
        <header className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-850/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-500/20 shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 id={modalTitleId} className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Ajuste de Umbrales del Semáforo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Personalización institucional de rangos (Rojo, Ámbar, Verde, Azul) según Decreto 67.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            aria-label="Cerrar modal de configuración"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Contenido del Modal con Scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-sm">
          {/* Alerta de Modo de Permiso (RBAC) */}
          {!isAdmin && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-start gap-2.5 text-xs">
              <Shield className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Modo Consulta (Solo Lectura):</strong> Solo los administradores o el equipo directivo del colegio pueden guardar cambios en la base de datos institucional.
              </span>
            </div>
          )}

          {/* 1. Barra de Vista Previa del Semáforo en Tiempo Real */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-500" />
                <span>Simulación en Vivo de la Escala Oficial ({minGrade.toFixed(1)} - {maxGrade.toFixed(1)})</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Paso de aprobación: {thresholds.redMax.toFixed(1)}
              </span>
            </div>

            {/* Barra Segmentada */}
            <div className="h-6 rounded-xl overflow-hidden flex border border-slate-300 dark:border-slate-700 shadow-inner font-mono text-[11px] font-bold text-white text-center select-none">
              <div
                style={{
                  width: `${Math.max(15, ((thresholds.redMax - minGrade) / (maxGrade - minGrade)) * 100)}%`,
                }}
                className="bg-red-500 hover:bg-red-600 transition-all flex items-center justify-center truncate px-1"
                title={`Rojo: ${minGrade.toFixed(1)} a < ${thresholds.redMax.toFixed(1)}`}
              >
                🔴 &lt; {thresholds.redMax.toFixed(1)}
              </div>
              <div
                style={{
                  width: `${Math.max(15, ((thresholds.yellowMax - thresholds.redMax) / (maxGrade - minGrade)) * 100)}%`,
                }}
                className="bg-amber-500 hover:bg-amber-600 transition-all flex items-center justify-center truncate px-1 text-slate-900"
                title={`Ámbar: ${thresholds.redMax.toFixed(1)} a < ${thresholds.yellowMax.toFixed(1)}`}
              >
                🟡 {thresholds.redMax.toFixed(1)} - {(thresholds.yellowMax - 0.1).toFixed(1)}
              </div>
              <div
                style={{
                  width: `${Math.max(15, ((thresholds.greenMax - thresholds.yellowMax) / (maxGrade - minGrade)) * 100)}%`,
                }}
                className="bg-emerald-500 hover:bg-emerald-600 transition-all flex items-center justify-center truncate px-1"
                title={`Verde: ${thresholds.yellowMax.toFixed(1)} a < ${thresholds.greenMax.toFixed(1)}`}
              >
                🟢 {thresholds.yellowMax.toFixed(1)} - {(thresholds.greenMax - 0.1).toFixed(1)}
              </div>
              <div
                style={{
                  width: `${Math.max(15, ((maxGrade - thresholds.greenMax) / (maxGrade - minGrade)) * 100)}%`,
                }}
                className="bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center truncate px-1"
                title={`Azul: ${thresholds.greenMax.toFixed(1)} a ${thresholds.blueMax.toFixed(1)}`}
              >
                🔵 {thresholds.greenMax.toFixed(1)} - {thresholds.blueMax.toFixed(1)}
              </div>
            </div>
          </div>

          {/* 2. Botones de Presets Rápidos */}
          {isAdmin && (
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Plantillas Predeterminadas (1-Clic)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset("decreto67")}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-700 dark:text-slate-200 transition shadow-2xs hover:bg-slate-50 text-left flex flex-col justify-between"
                >
                  <span className="font-bold text-brand-600 dark:text-brand-400">Decreto 67 Oficial</span>
                  <span className="text-[10px] text-slate-400">4.0 / 5.0 / 6.0 / 7.0</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset("alta_exigencia")}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-700 dark:text-slate-200 transition shadow-2xs hover:bg-slate-50 text-left flex flex-col justify-between"
                >
                  <span className="font-bold text-purple-600 dark:text-purple-400">Alta Exigencia</span>
                  <span className="text-[10px] text-slate-400">4.5 / 5.5 / 6.5 / 7.0</span>
                </button>

                <button
                  type="button"
                  onClick={() => applyPreset("aprobacion_flexible")}
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 text-slate-700 dark:text-slate-200 transition shadow-2xs hover:bg-slate-50 text-left flex flex-col justify-between"
                >
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Tolerancia Inicial</span>
                  <span className="text-[10px] text-slate-400">3.8 / 4.8 / 5.8 / 7.0</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. Formulario de Ajuste de los 4 Rangos */}
          <div className="space-y-4">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Configuración Detallada por Segmento de Logro</span>
              <span className="text-[10px] lowercase font-normal text-slate-400">
                Puntos de corte estrictos
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Tarjeta 1: Rojo / Insuficiente */}
              <div className="p-3.5 rounded-2xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-red-900 dark:text-red-300 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                    <span>Rango Rojo (Riesgo)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-red-700 dark:text-red-400">
                    &lt; {thresholds.redMax.toFixed(1)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Nota de Aprobación Mínima (Corte Rojo / Ámbar)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={minGrade}
                    max={thresholds.yellowMax - 0.1}
                    disabled={!isAdmin || isSaving}
                    value={thresholds.redMax}
                    onChange={(e) => handleThresholdChange("redMax", parseFloat(e.target.value) || minGrade)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Etiqueta Pedagógica
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin || isSaving}
                    value={thresholds.redLabel || "Insuficiente"}
                    onChange={(e) => handleLabelChange("redLabel", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Tarjeta 2: Ámbar / Elemental */}
              <div className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-300 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Rango Ámbar (Alerta)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                    {thresholds.redMax.toFixed(1)} a &lt; {thresholds.yellowMax.toFixed(1)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Corte Superior Ámbar / Verde
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={thresholds.redMax + 0.1}
                    max={thresholds.greenMax - 0.1}
                    disabled={!isAdmin || isSaving}
                    value={thresholds.yellowMax}
                    onChange={(e) => handleThresholdChange("yellowMax", parseFloat(e.target.value) || 5.0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Etiqueta Pedagógica
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin || isSaving}
                    value={thresholds.yellowLabel || "Elemental"}
                    onChange={(e) => handleLabelChange("yellowLabel", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Tarjeta 3: Verde / Adecuado */}
              <div className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900 dark:text-emerald-300 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>Rango Verde (Adecuado)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {thresholds.yellowMax.toFixed(1)} a &lt; {thresholds.greenMax.toFixed(1)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Corte Superior Verde / Azul
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={thresholds.yellowMax + 0.1}
                    max={thresholds.blueMax}
                    disabled={!isAdmin || isSaving}
                    value={thresholds.greenMax}
                    onChange={(e) => handleThresholdChange("greenMax", parseFloat(e.target.value) || 6.0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Etiqueta Pedagógica
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin || isSaving}
                    value={thresholds.greenLabel || "Adecuado"}
                    onChange={(e) => handleLabelChange("greenLabel", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>

              {/* Tarjeta 4: Azul / Destacado */}
              <div className="p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900 dark:text-blue-300 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Rango Azul (Destacado)</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 dark:text-blue-400">
                    {thresholds.greenMax.toFixed(1)} a {thresholds.blueMax.toFixed(1)}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Nota Máxima de la Escala Oficial
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={thresholds.greenMax}
                    max={maxGrade}
                    disabled={!isAdmin || isSaving}
                    value={thresholds.blueMax}
                    onChange={(e) => handleThresholdChange("blueMax", parseFloat(e.target.value) || maxGrade)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Etiqueta Pedagógica
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin || isSaving}
                    value={thresholds.blueLabel || "Destacado"}
                    onChange={(e) => handleLabelChange("blueLabel", e.target.value)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mensajes de Retroalimentación */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Pie del Modal con Acciones */}
        <footer className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-850/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setThresholds(DEFAULT_GRADE_THRESHOLDS)}
            disabled={!isAdmin || isSaving}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              Cancelar
            </button>

            {isAdmin && (
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !isAscending}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Guardando en BD...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Guardar Umbrales</span>
                  </>
                )}
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}
