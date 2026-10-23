"use client";

import React from "react";
import { GraduationCap, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GradingSettingsProps {
  settingsData: {
    minGrade: number;
    maxGrade: number;
    minPassingGrade: number;
    gradeScalePrecision: number;
  };
  setSettingsData: React.Dispatch<React.SetStateAction<any>>;
  onSave: () => Promise<void>;
  isSaving: boolean;
}

export function GradingSettingsForm({ settingsData, setSettingsData, onSave, isSaving }: GradingSettingsProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-brand-600" />
          Escala de Calificaciones Personalizada
        </h3>
        <p className="text-xs text-slate-500">
          Define los parámetros oficiales para el cálculo de notas de tu institución.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nota Mínima</label>
          <input
            type="number"
            step="0.1"
            value={settingsData.minGrade}
            onChange={(e) => setSettingsData((prev: any) => ({ ...prev, minGrade: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nota de Aprobación</label>
          <input
            type="number"
            step="0.1"
            value={settingsData.minPassingGrade}
            onChange={(e) => setSettingsData((prev: any) => ({ ...prev, minPassingGrade: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 bg-white text-sm font-bold text-emerald-600"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Nota Máxima</label>
          <input
            type="number"
            step="0.1"
            value={settingsData.maxGrade}
            onChange={(e) => setSettingsData((prev: any) => ({ ...prev, maxGrade: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Precisión Decimal</label>
          <select
            value={settingsData.gradeScalePrecision}
            onChange={(e) => setSettingsData((prev: any) => ({ ...prev, gradeScalePrecision: parseInt(e.target.value) || 1 }))}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm"
          >
            <option value={0}>0 decimales</option>
            <option value={1}>1 decimal</option>
            <option value={2}>2 decimales</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onSave} disabled={isSaving} className="shadow-sm">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Guardando..." : "Guardar Escala"}
        </Button>
      </div>
    </div>
  );
}
