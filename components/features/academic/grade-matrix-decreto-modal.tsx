"use client";

import React, { memo } from "react";
import { BookOpen, CheckCircle2, Award, Users } from "lucide-react";
import {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

/**
 * Modal Normativo y Guía de Ponderaciones Decreto 67 / Mineduc
 * Responsable de autoría: Frank M. (Gestión Curricular y Estructura Académica)
 * Optimizado con React.memo para evitar re-renderizados innecesarios durante el tipeo de calificaciones.
 */

interface GradeMatrixDecretoModalProps {
  isOpen: boolean;
  onClose: () => void;
  calcMode: "simple" | "weighted";
  onSelectCalcMode: (mode: "simple" | "weighted") => void;
}

export const GradeMatrixDecretoModal = memo(function GradeMatrixDecretoModal({
  isOpen,
  onClose,
  calcMode,
  onSelectCalcMode,
}: GradeMatrixDecretoModalProps) {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader>
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <ModalTitle>Marco Normativo de Evaluación (Decreto 67/2018)</ModalTitle>
            <ModalDescription>
              Guía oficial de ponderaciones, criterios de eximición y promoción escolar MINEDUC.
            </ModalDescription>
          </div>
        </div>
      </ModalHeader>

      <ModalBody className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Modos de Cálculo Disponibles */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
              1. Selección de Modo de Cálculo para la Planilla
            </h4>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
              Modo Activo: {calcMode === "simple" ? "Promedio Simple" : "Ponderado (%)"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Tarjeta Promedio Simple */}
            <div
              onClick={() => onSelectCalcMode("simple")}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                calcMode === "simple"
                  ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Promedio Simple (Aritmético)
                  </span>
                  {calcMode === "simple" && (
                    <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Todas las notas ingresadas tienen exactamente el mismo valor (1:1).
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                Fórmula: (N1 + N2 + ... + Nk) / k
              </div>
            </div>

            {/* Tarjeta Promedio Ponderado */}
            <div
              onClick={() => onSelectCalcMode("weighted")}
              className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                calcMode === "weighted"
                  ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 ring-2 ring-brand-500/20"
                  : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Ponderado por Porcentajes (%)
                  </span>
                  {calcMode === "weighted" && (
                    <CheckCircle2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Cada evaluación aporta a la nota final según su porcentaje oficial configurado.
                </p>
              </div>
              <div className="text-[10px] font-mono text-slate-600 dark:text-slate-400 mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700">
                Fórmula: Σ(Nota_i × Peso_i) / Σ(Pesos)
              </div>
            </div>
          </div>
        </div>

        {/* Artículos Clave del Decreto 67 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold">
              <Award className="w-4 h-4" />
              <span>Criterio de Promoción y Aprobación</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Para ser promovido de curso, el estudiante debe alcanzar un promedio final mínimo de{" "}
              <strong>4.0 (escala 1.0 a 7.0)</strong> en todas las asignaturas y una asistencia igual o superior al 85%.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold">
              <Users className="w-4 h-4" />
              <span>Acompañamiento PIE y Diversificación</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Los estudiantes del Programa de Integración Escolar (PIE) cuentan con adecuaciones curriculares
              y criterios de evaluación formativa sin alterar la escala numérica oficial.
            </p>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <Button variant="primary" onClick={onClose}>
          Entendido, Volver a la Planilla
        </Button>
      </ModalFooter>
    </Modal>
  );
});
