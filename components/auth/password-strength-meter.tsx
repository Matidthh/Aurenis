/**
 * ============================================================================
 * AURENIS — MEDIDOR DE FORTALEZA DE CONTRASEÑA EN TIEMPO REAL
 * ============================================================================
 * Autores: Malcom Marcelo (Frontend) & Frank M. (Seguridad & UX)
 * 
 * Misión:
 * 1. Evalúa en tiempo real la complejidad de la contraseña (longitud, mayúsculas,
 *    minúsculas, números, caracteres especiales y patrones comunes débiles).
 * 2. Proporciona retroalimentación visual clara con barra de progreso y criterios.
 * ============================================================================
 */

import React, { useMemo } from "react";
import { Check, X, ShieldAlert, ShieldCheck } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const strengthData = useMemo(() => {
    if (!password) {
      return {
        score: 0,
        maxScore: 5,
        label: "Vacía",
        color: "bg-slate-200 dark:bg-slate-700",
        textColor: "text-slate-400",
        isCommon: false,
        checks: [],
      };
    }

    let score = 0;
    const hasLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    // Patrones comunes débiles
    const commonPatterns = ["123456", "password", "admin", "lpmm", "aurenis", "12345678", "qwerty", "abc123"];
    const isCommon = commonPatterns.some((pattern) => password.toLowerCase().includes(pattern));

    if (hasLength) score++;
    if (hasLowercase) score++;
    if (hasUppercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    if (isCommon) score = Math.max(0, score - 2);

    let label = "Muy débil";
    let color = "bg-red-500";
    let textColor = "text-red-600 dark:text-red-400";

    if (score >= 5 && !isCommon) {
      label = "Excelente (Muy Segura)";
      color = "bg-emerald-500";
      textColor = "text-emerald-600 dark:text-emerald-400";
    } else if (score >= 4) {
      label = "Fuerte";
      color = "bg-blue-500";
      textColor = "text-blue-600 dark:text-blue-400";
    } else if (score >= 3) {
      label = "Moderada";
      color = "bg-amber-500";
      textColor = "text-amber-600 dark:text-amber-400";
    } else if (score >= 2) {
      label = "Débil";
      color = "bg-orange-500";
      textColor = "text-orange-600 dark:text-orange-400";
    }

    return {
      score,
      maxScore: 5,
      label,
      color,
      textColor,
      isCommon,
      checks: [
        { label: "Al menos 8 caracteres", met: hasLength },
        { label: "Letra minúscula (a-z)", met: hasLowercase },
        { label: "Letra mayúscula (A-Z)", met: hasUppercase },
        { label: "Número (0-9)", met: hasNumber },
        { label: "Caracter especial (!@#$...)", met: hasSpecial },
      ],
    };
  }, [password]);

  if (!password) return null;

  const percentage = Math.min(100, (strengthData.score / strengthData.maxScore) * 100);

  return (
    <div className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-700 dark:text-slate-300">
          Fortaleza de contraseña:{" "}
          <span className={`font-bold ${strengthData.textColor}`}>{strengthData.label}</span>
        </span>
        <span className="text-[11px] text-slate-500">{Math.round(percentage)}%</span>
      </div>

      {/* Barra de progreso visual */}
      <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${strengthData.color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Advertencia si contiene patrones comunes */}
      {strengthData.isCommon && (
        <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400 font-medium text-[11px]">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>Advertencia: Contiene patrones o secuencias comunes fáciles de adivinar.</span>
        </div>
      )}

      {/* Lista de criterios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
        {strengthData.checks.map((chk, idx) => (
          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
            {chk.met ? (
              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={chk.met ? "text-emerald-700 dark:text-emerald-300 font-medium" : "text-slate-500"}>
              {chk.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
