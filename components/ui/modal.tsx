"use client";

import React, { useEffect, useId } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  className?: string;
  closeOnBackdrop?: boolean;
}

// Contexto para comunicar IDs accesibles entre componentes del Modal
interface ModalContextType {
  titleId: string;
  descriptionId: string;
  onClose: () => void;
}

const ModalContext = React.createContext<ModalContextType | null>(null);

export function Modal({
  isOpen,
  onClose,
  children,
  size = "md",
  className,
  closeOnBackdrop = true,
}: ModalProps) {
  const baseId = useId();
  const titleId = `modal-title-${baseId}`;
  const descriptionId = `modal-desc-${baseId}`;

  // Manejo de tecla Escape y bloqueo de scroll del body
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[95vw] h-[90vh]",
  };

  return (
    <ModalContext.Provider value={{ titleId, descriptionId, onClose }}>
      {/* Backdrop con desenfoque accesible */}
      <div
        id="modal-backdrop"
        className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-150"
        onClick={(e) => {
          if (closeOnBackdrop && e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Contenedor del Diálogo (Bottom Sheet en móvil, Modal centrado en Desktop) */}
        <div
          id="modal-dialog-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className={cn(
            "w-full bg-white dark:bg-slate-900 border-t sm:border border-slate-200 dark:border-slate-800 shadow-2xl rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200",
            sizeClasses[size],
            className
          )}
        >
          {children}
        </div>
      </div>
    </ModalContext.Provider>
  );
}

// 1. Modal Header
export interface ModalHeaderProps {
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export function ModalHeader({
  children,
  showCloseButton = true,
  className,
}: ModalHeaderProps) {
  const context = React.useContext(ModalContext);

  return (
    <div
      className={cn(
        "flex items-start justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0 gap-4",
        className
      )}
    >
      <div className="space-y-1 min-w-0 flex-1">{children}</div>
      {showCloseButton && context && (
        <button
          type="button"
          onClick={context.onClose}
          className="p-1.5 -mr-1 -mt-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// 2. Modal Title
export function ModalTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(ModalContext);
  return (
    <h2
      id={context?.titleId}
      className={cn("text-lg font-bold text-slate-900 dark:text-white tracking-tight", className)}
    >
      {children}
    </h2>
  );
}

// 3. Modal Description
export function ModalDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(ModalContext);
  return (
    <p
      id={context?.descriptionId}
      className={cn("text-xs text-slate-500 dark:text-slate-400", className)}
    >
      {children}
    </p>
  );
}

// 4. Modal Body
export function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("p-5 overflow-y-auto flex-1 space-y-4 text-sm", className)}>
      {children}
    </div>
  );
}

// 5. Modal Footer
export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "p-4 bg-slate-50 dark:bg-slate-850/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5 shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
}
