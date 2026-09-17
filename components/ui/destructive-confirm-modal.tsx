"use client";

import React, { useState, useEffect, useCallback } from "react";
import { AlertTriangle, Trash2, Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export interface DestructiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  /**
   * Texto exacto que el usuario debe tipear para habilitar la confirmación.
   * Por ejemplo: "ELIMINAR", "DESVINCULAR", "CERRAR ACTAS" o el RUT/Nombre del recurso.
   */
  requiredConfirmationText?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isLoading?: boolean;
  /**
   * Detalles o advertencias secundarias (ej: "Esta acción no se puede deshacer").
   */
  warningDetails?: string[];
  /**
   * Nombre del elemento a eliminar o cerrar para mostrarlo destacado.
   */
  entityName?: string;
  /**
   * Tipo de icono descriptivo
   */
  iconType?: "delete" | "lock" | "warning";
}

/**
 * Modal de Diálogo Destructivo Accesible (Color Rojo)
 * 
 * Cumple con los 3 Criterios de Aceptación:
 * 1. Modal de diálogo destructivo en color rojo (Header y acentos en rojo/rose de alta visibilidad y contraste).
 * 2. Requisito de escribir confirmación para acciones críticas (deshabilita el botón destructivo hasta que coincide exactamente).
 * 3. Opción de cancelar limpia (cierra el modal y restablece inmediatamente el estado del input).
 */
export function DestructiveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  requiredConfirmationText,
  confirmButtonText = "Confirmar y Eliminar",
  cancelButtonText = "Cancelar",
  isLoading = false,
  warningDetails,
  entityName,
  iconType = "delete",
}: DestructiveConfirmModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cada vez que se abre o cierra, reseteamos el input a limpio
  useEffect(() => {
    if (!isOpen) {
      setConfirmationInput("");
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleCleanCancel = useCallback(() => {
    setConfirmationInput("");
    setIsSubmitting(false);
    onClose();
  }, [onClose]);

  // Manejo de Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading && !isSubmitting) {
        handleCleanCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, isSubmitting, handleCleanCancel]);

  if (!isOpen) return null;

  // Si se especificó confirmación escrita requerida, validar igualdad estricta
  const isConfirmationSatisfied = requiredConfirmationText
    ? confirmationInput.trim() === requiredConfirmationText.trim()
    : true;

  const handleExecuteConfirm = async () => {
    if (!isConfirmationSatisfied || isLoading || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onConfirm();
      handleCleanCancel();
    } catch {
      setIsSubmitting(false);
    }
  };

  const IconComponent =
    iconType === "lock" ? Lock : iconType === "warning" ? AlertTriangle : Trash2;

  return (
    <div
      id="destructive-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="destructive-modal-title"
      aria-describedby="destructive-modal-description"
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoading && !isSubmitting) {
          handleCleanCancel();
        }
      }}
    >
      <div
        id="destructive-modal-panel"
        className={cn(
          "w-full max-w-lg bg-white dark:bg-slate-900 border-t sm:border border-red-200 dark:border-red-900/50 shadow-2xl shadow-red-950/10 rounded-t-3xl sm:rounded-2xl overflow-hidden transform transition-all animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        )}
      >
        {/* Cabecera destructiva con halo rojo */}
        <div className="p-5 sm:p-6 bg-red-50/70 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900/40 flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/80 text-red-600 dark:text-red-200 flex items-center justify-center shrink-0 shadow-inner border border-red-200 dark:border-red-700/50">
            <IconComponent className="w-6 h-6 stroke-[2.2]" />
          </div>

          <div className="flex-1 min-w-0 pr-2">
            <h3
              id="destructive-modal-title"
              className="text-lg font-bold text-red-950 dark:text-red-100 tracking-tight leading-snug"
            >
              {title}
            </h3>
            <p className="text-xs text-red-700/90 dark:text-red-300/90 mt-1 font-medium">
              Acción crítica e irreversible
            </p>
          </div>

          <button
            type="button"
            onClick={handleCleanCancel}
            disabled={isLoading || isSubmitting}
            aria-label="Cerrar modal y cancelar"
            className="p-1.5 -mr-1 -mt-1 rounded-xl text-red-400 hover:text-red-700 dark:hover:text-red-200 hover:bg-red-100/60 dark:hover:bg-red-900/40 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Entidad destacada si aplica */}
          {entityName && (
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                Elemento Afectado
              </span>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {entityName}
              </p>
            </div>
          )}

          {/* Descripción */}
          <p
            id="destructive-modal-description"
            className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            {description}
          </p>

          {/* Lista de advertencias secundarias */}
          {warningDetails && warningDetails.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                Consideraciones importantes:
              </div>
              <ul className="text-xs text-amber-800 dark:text-amber-300/90 space-y-1 list-disc pl-5">
                {warningDetails.map((warn, i) => (
                  <li key={i}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Requisito de confirmación escrita si aplica */}
          {requiredConfirmationText && (
            <div className="pt-2 space-y-2">
              <label
                htmlFor="destructive-confirm-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Para confirmar esta acción, escribe{" "}
                <span className="font-mono font-bold text-red-600 dark:text-red-400 px-1.5 py-0.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded">
                  {requiredConfirmationText}
                </span>{" "}
                a continuación:
              </label>

              <Input
                id="destructive-confirm-input"
                type="text"
                autoComplete="off"
                spellCheck={false}
                value={confirmationInput}
                onChange={(e) => setConfirmationInput(e.target.value)}
                placeholder={`Escribe "${requiredConfirmationText}" para habilitar`}
                className="font-mono text-sm border-red-200 dark:border-red-900/60 focus:border-red-500 focus:ring-red-500"
                disabled={isLoading || isSubmitting}
              />
            </div>
          )}
        </div>

        {/* Footer con opción limpia de cancelar y botón destructivo rojo */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            id="btn-destructive-cancel"
            onClick={handleCleanCancel}
            disabled={isLoading || isSubmitting}
            className="w-full sm:w-auto"
          >
            {cancelButtonText}
          </Button>

          <Button
            type="button"
            id="btn-destructive-confirm"
            variant="danger"
            onClick={handleExecuteConfirm}
            disabled={!isConfirmationSatisfied || isLoading || isSubmitting}
            isLoading={isLoading || isSubmitting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-md shadow-red-950/10 focus:ring-red-500"
          >
            <IconComponent className="w-4 h-4 mr-1.5" />
            {confirmButtonText}
          </Button>
        </div>
      </div>
    </div>
  );
}
