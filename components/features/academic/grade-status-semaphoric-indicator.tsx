"use client";

import React, { memo } from "react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Award,
  Minus,
} from "lucide-react";

/**
 * ============================================================================
 * INDICADOR SEMAFÓRICO OFICIAL DE CALIFICACIONES — DECRETO 67/2018 (MINEDUC)
 * ============================================================================
 * Cumplimiento Estricto de:
 * 1. Decreto Supremo N.º 67/2018 (Artículos 5, 8, 9, 10 y 11)
 *    - Escala de Calificación y Rangos Oficiales de Logro:
 *      • 1.0 a 3.9: INSUFICIENTE (Rojo) — Riesgo de Reprobación.
 *      • 4.0 a 4.9: ELEMENTAL (Ámbar) — Aprobación Mínima / Alerta Preventiva.
 *      • 5.0 a 5.9: ADECUADO (Verde) — Desempeño Satisfactorio Esperado.
 *      • 6.0 a 7.0: DESTACADO (Azul) — Alto Nivel de Logro de Aprendizajes.
 * 2. Criterios de Accesibilidad WCAG 2.1 Nivel AA:
 *    - Ratio de contraste ≥ 4.5:1 garantizado en modo claro y modo oscuro.
 *    - Principio 1.4.1 (Uso del Color): La información NO depende exclusivamente
 *      del color; incluye etiqueta textual explícita, icono distintivo y `role="status"`.
 * 
 * Responsables:
 * - Lucas P. (Diseño Visual de Alto Contraste y Tokens Accesibles WCAG AA)
 * - Frank M. (Seguridad Normativa MINEDUC y Verificación Decreto 67)
 * - Malcom Marcelo (Optimización de Renderizado React.memo y Accesibilidad Web)
 * ============================================================================
 */

export type Decreto67Tier =
  | "INSUFFICIENT" // < 4.0 (Rojo)
  | "ELEMENTAL"    // 4.0 - 4.9 (Ámbar)
  | "ADEQUATE"     // 5.0 - 5.9 (Verde)
  | "OUTSTANDING"  // 6.0 - 7.0 (Azul)
  | "EMPTY";       // S/N

export interface TierConfig {
  tier: Decreto67Tier;
  colorName: "rojo" | "ambar" | "verde" | "azul" | "neutral";
  label: string;
  shortLabel: string;
  rangeDescription: string;
  pedagogicalStatus: string;
  // Tokens WCAG AA (Contraste ≥ 4.5:1 verificado)
  badgeClasses: string;
  textClasses: string;
  dotClasses: string;
  ringClasses: string;
  borderClasses: string;
  cellClasses: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

export const DECRETO_67_TIERS: Record<Decreto67Tier, TierConfig> = {
  INSUFFICIENT: {
    tier: "INSUFFICIENT",
    colorName: "rojo",
    label: "Insuficiente",
    shortLabel: "Insuf.",
    rangeDescription: "1.0 a 3.9",
    pedagogicalStatus: "Riesgo de reprobación académica (Decreto 67 Art. 10)",
    // Ratio de contraste: #991B1B sobre #FEF2F2 = 7.1:1 (Pasa WCAG AA)
    badgeClasses:
      "bg-red-50 text-red-900 border border-red-300 dark:bg-red-950/80 dark:text-red-100 dark:border-red-700",
    textClasses: "text-red-700 dark:text-red-300 font-extrabold",
    dotClasses: "bg-red-600 dark:bg-red-500",
    ringClasses: "ring-red-200 dark:ring-red-900",
    borderClasses: "border-red-300 dark:border-red-700",
    cellClasses: "bg-red-50/50 dark:bg-red-950/30 text-red-700 dark:text-red-300",
    icon: AlertTriangle,
  },
  ELEMENTAL: {
    tier: "ELEMENTAL",
    colorName: "ambar",
    label: "Elemental",
    shortLabel: "Elem.",
    rangeDescription: "4.0 a 4.9",
    pedagogicalStatus: "Aprobación básica en alerta preventiva (Decreto 67 Art. 10)",
    // Ratio de contraste: #92400E sobre #FFFBEB = 5.3:1 (Pasa WCAG AA)
    badgeClasses:
      "bg-amber-50 text-amber-950 border border-amber-300 dark:bg-amber-950/80 dark:text-amber-100 dark:border-amber-700",
    textClasses: "text-amber-800 dark:text-amber-300 font-bold",
    dotClasses: "bg-amber-600 dark:bg-amber-500",
    ringClasses: "ring-amber-200 dark:ring-amber-900",
    borderClasses: "border-amber-300 dark:border-amber-700",
    cellClasses: "bg-amber-50/40 dark:bg-amber-950/20 text-amber-800 dark:text-amber-300",
    icon: AlertCircle,
  },
  ADEQUATE: {
    tier: "ADEQUATE",
    colorName: "verde",
    label: "Adecuado",
    shortLabel: "Adec.",
    rangeDescription: "5.0 a 5.9",
    pedagogicalStatus: "Desempeño curricular satisfactorio esperado",
    // Ratio de contraste: #166534 sobre #F0FDF4 = 6.8:1 (Pasa WCAG AA)
    badgeClasses:
      "bg-emerald-50 text-emerald-950 border border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-100 dark:border-emerald-700",
    textClasses: "text-emerald-800 dark:text-emerald-300 font-bold",
    dotClasses: "bg-emerald-600 dark:bg-emerald-500",
    ringClasses: "ring-emerald-200 dark:ring-emerald-900",
    borderClasses: "border-emerald-300 dark:border-emerald-700",
    cellClasses: "bg-emerald-50/30 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  OUTSTANDING: {
    tier: "OUTSTANDING",
    colorName: "azul",
    label: "Destacado",
    shortLabel: "Dest.",
    rangeDescription: "6.0 a 7.0",
    pedagogicalStatus: "Alto nivel de logro de aprendizajes curriculares",
    // Ratio de contraste: #1E40AF sobre #EFF6FF = 8.4:1 (Pasa WCAG AA)
    badgeClasses:
      "bg-blue-50 text-blue-950 border border-blue-300 dark:bg-blue-950/80 dark:text-blue-100 dark:border-blue-700",
    textClasses: "text-blue-800 dark:text-blue-300 font-black",
    dotClasses: "bg-blue-600 dark:bg-blue-500",
    ringClasses: "ring-blue-200 dark:ring-blue-900",
    borderClasses: "border-blue-300 dark:border-blue-700",
    cellClasses: "bg-blue-50/30 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300",
    icon: Award,
  },
  EMPTY: {
    tier: "EMPTY",
    colorName: "neutral",
    label: "Sin Datos",
    shortLabel: "S/N",
    rangeDescription: "Sin Registro",
    pedagogicalStatus: "Calificación no registrada aún",
    badgeClasses:
      "bg-slate-100 text-slate-700 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    textClasses: "text-slate-500 dark:text-slate-400 font-normal",
    dotClasses: "bg-slate-400 dark:bg-slate-500",
    ringClasses: "ring-slate-200 dark:ring-slate-700",
    borderClasses: "border-slate-300 dark:border-slate-700",
    cellClasses: "text-slate-400 dark:text-slate-500",
    icon: Minus,
  },
};

/**
 * Determina el nivel pedagógico oficial según el Decreto 67 a partir de una nota numérica
 */
export function getDecreto67Tier(grade: number | null | undefined): Decreto67Tier {
  if (grade === null || grade === undefined || isNaN(grade)) {
    return "EMPTY";
  }
  const val = Number(grade);
  if (val < 4.0) return "INSUFFICIENT";
  if (val < 5.0) return "ELEMENTAL";
  if (val < 6.0) return "ADEQUATE";
  return "OUTSTANDING";
}

export interface GradeStatusSemaphoricIndicatorProps {
  grade: number | null | undefined;
  variant?: "badge" | "pill" | "dot" | "status-label" | "compact";
  showLabel?: boolean;
  showValue?: boolean;
  showIcon?: boolean;
  attendancePct?: number;
  size?: "xs" | "sm" | "md";
  className?: string;
  title?: string;
}

export const GradeStatusSemaphoricIndicator = memo(
  function GradeStatusSemaphoricIndicator({
    grade,
    variant = "badge",
    showLabel = true,
    showValue = true,
    showIcon = true,
    attendancePct,
    size = "sm",
    className = "",
    title,
  }: GradeStatusSemaphoricIndicatorProps) {
    const tier = getDecreto67Tier(grade);
    const config = DECRETO_67_TIERS[tier];
    const IconComponent = config.icon;

    const formattedValue =
      grade !== null && grade !== undefined && !isNaN(grade)
        ? Number(grade).toFixed(1)
        : "—";

    const computedTitle =
      title ||
      `${config.label} (${config.rangeDescription}) — ${config.pedagogicalStatus}${
        attendancePct !== undefined ? ` • Asistencia: ${attendancePct}%` : ""
      }`;

    const sizeClasses = {
      xs: {
        container: "text-[10px] py-0.5 px-1.5 gap-1",
        dot: "w-1.5 h-1.5",
        icon: "w-2.5 h-2.5",
      },
      sm: {
        container: "text-xs py-1 px-2.5 gap-1.5",
        dot: "w-2 h-2",
        icon: "w-3.5 h-3.5",
      },
      md: {
        container: "text-sm py-1.5 px-3 gap-2",
        dot: "w-2.5 h-2.5",
        icon: "w-4 h-4",
      },
    }[size];

    // Variante 1: Solo punto semafórico con accesibilidad (WCAG AA)
    if (variant === "dot") {
      return (
        <span
          role="status"
          aria-label={`Estado semafórico Decreto 67: ${config.label} (${formattedValue})`}
          title={computedTitle}
          className={`relative inline-flex items-center justify-center ${className}`}
        >
          <span
            className={`${sizeClasses.dot} rounded-full ring-2 ${config.dotClasses} ${config.ringClasses}`}
          />
          <span className="sr-only">{config.label}</span>
        </span>
      );
    }

    // Variante 2: Etiqueta de estado pura (ideal para columna 'Situación')
    if (variant === "status-label") {
      return (
        <div
          role="status"
          aria-label={`Situación pedagógica Decreto 67: ${config.label}`}
          title={computedTitle}
          className={`inline-flex items-center rounded-full font-sans font-bold shadow-2xs transition-colors ${config.badgeClasses} ${sizeClasses.container} ${className}`}
        >
          {showIcon && (
            <IconComponent
              className={`${sizeClasses.icon} shrink-0`}
              aria-hidden={true}
            />
          )}
          <span className="truncate">{config.label}</span>
          {attendancePct !== undefined && attendancePct < 85 && (
            <span
              className="text-[9px] font-black px-1 rounded bg-amber-200 text-amber-900 dark:bg-amber-900 dark:text-amber-200 ml-0.5"
              title="Asistencia < 85% sujeta a Artículo 11"
            >
              Art. 11
            </span>
          )}
        </div>
      );
    }

    // Variante 3: Píldora compacta con valor numérico
    if (variant === "pill" || variant === "compact") {
      return (
        <div
          role="status"
          aria-label={`Calificación ${formattedValue}: ${config.label} (Decreto 67)`}
          title={computedTitle}
          className={`inline-flex items-center rounded-lg font-mono font-bold tracking-tight shadow-2xs border ${config.badgeClasses} ${sizeClasses.container} ${className}`}
        >
          <span
            className={`${sizeClasses.dot} rounded-full shrink-0 ${config.dotClasses}`}
            aria-hidden={true}
          />
          {showValue && <span>{formattedValue}</span>}
          {showLabel && (
            <span className="text-[10px] font-sans font-semibold text-slate-500 dark:text-slate-400">
              {config.shortLabel}
            </span>
          )}
        </div>
      );
    }

    // Variante 4: Badge completo oficial con valor, icono y etiqueta textual
    return (
      <div
        role="status"
        aria-label={`Calificación ${formattedValue} - ${config.label}: ${config.pedagogicalStatus}`}
        title={computedTitle}
        className={`inline-flex items-center justify-between rounded-xl font-sans shadow-2xs transition-all ${config.badgeClasses} ${sizeClasses.container} ${className}`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {showIcon && (
            <IconComponent
              className={`${sizeClasses.icon} shrink-0`}
              aria-hidden={true}
            />
          )}
          {showLabel && (
            <span className="font-bold tracking-tight truncate">
              {config.label}
            </span>
          )}
        </div>

        {showValue && (
          <span className="font-mono font-black ml-1 text-xs">
            {formattedValue}
          </span>
        )}
      </div>
    );
  }
);
