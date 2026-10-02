"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Camera,
  KeyRound,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentQRScannerProps {
  schoolSlug: string;
}

export function StudentQRScanner({ schoolSlug }: StudentQRScannerProps) {
  const [qrInputToken, setQrInputToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    courseName?: string;
    studentName?: string;
    recordedAt?: string;
  } | null>(null);

  async function handleRegisterQR(tokenToSubmit?: string) {
    const token = tokenToSubmit || qrInputToken.trim();
    if (!token) return;

    try {
      setIsLoading(true);
      setScanResult(null);

      const res = await fetch("/api/attendance/session/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolSlug,
          qrToken: token,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Código QR no válido");
      }

      setScanResult({
        success: true,
        message: data.message || "¡Asistencia registrada exitosamente!",
        courseName: data.courseName,
        studentName: data.studentName,
        recordedAt: data.recordedAt,
      });
      setQrInputToken("");
    } catch (err: any) {
      setScanResult({
        success: false,
        message: err.message || "Error al escanear código QR",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6 text-center">
        <div className="w-14 h-14 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
          <QrCode className="w-7 h-7" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Registro de Asistencia Estudiantil
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Escanea o ingresa el código generado en la pantalla del docente para marcar tu asistencia en la clase actual.
          </p>
        </div>

        {/* Formulario de ingreso / Pegado del token QR */}
        <div className="space-y-3">
          <div className="relative">
            <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Pegar o ingresar token del código QR..."
              value={qrInputToken}
              onChange={(e) => setQrInputToken(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <Button
            onClick={() => handleRegisterQR()}
            disabled={isLoading || !qrInputToken.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 text-sm shadow-md transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span>Validando token QR...</span>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Registrar Mi Asistencia con QR</span>
              </>
            )}
          </Button>
        </div>

        {/* Resultado del Escaneo */}
        {scanResult && (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-5 rounded-2xl border text-left space-y-3 ${
              scanResult.success
                ? "bg-emerald-50/80 border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200"
                : "bg-rose-50/80 border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200"
            }`}
          >
            <div className="flex items-center gap-3">
              {scanResult.success ? (
                <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 bg-rose-500 text-white rounded-xl flex items-center justify-center shrink-0">
                  <AlertCircle className="w-6 h-6" />
                </div>
              )}

              <div>
                <h4 className="font-bold text-sm">
                  {scanResult.success ? "¡Asistencia Confirmada!" : "Error en el Registro"}
                </h4>
                <p className="text-xs font-medium opacity-90">{scanResult.message}</p>
              </div>
            </div>

            {scanResult.success && (
              <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 text-xs grid grid-cols-2 gap-2 opacity-90">
                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Estudiante
                  </span>
                  <span className="font-bold">{scanResult.studentName}</span>
                </div>

                <div>
                  <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Hora de Registro
                  </span>
                  <span className="font-bold">{scanResult.recordedAt} hrs</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
