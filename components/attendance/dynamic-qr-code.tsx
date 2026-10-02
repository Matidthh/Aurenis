"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import QRCode from "qrcode";
import { motion, AnimatePresence } from "motion/react";
import {
  QrCode,
  RefreshCw,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DynamicQRCodeProps {
  schoolSlug: string;
  courseId: string;
  subjectId?: string | null;
  ttlSeconds?: number;
  title?: string;
  subtitle?: string;
  onTokenChange?: (token: string) => void;
  className?: string;
}

export function DynamicQRCode({
  schoolSlug,
  courseId,
  subjectId,
  ttlSeconds = 30,
  title = "Código QR Dinámico de Clase",
  subtitle = "Escanea este código desde la app AURENIS para registrar asistencia.",
  onTokenChange,
  className = "",
}: DynamicQRCodeProps) {
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(ttlSeconds);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const countdownRef = useRef<number>(ttlSeconds);
  countdownRef.current = countdown;

  // Función para solicitar un nuevo token de sesión de clase al backend
  const fetchFreshToken = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      const res = await fetch("/api/class-session/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolSlug,
          courseId,
          subjectId: subjectId || null,
          ttlSeconds,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "No se pudo generar el token de clase.");
      }

      const newToken = json.data.token;
      setQrToken(newToken);
      if (onTokenChange) {
        onTokenChange(newToken);
      }

      // Renderizar código QR en Base64 Data URL
      const dataUrl = await QRCode.toDataURL(newToken, {
        width: 300,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });

      setQrDataUrl(dataUrl);
      setCountdown(ttlSeconds);
    } catch (err: any) {
      console.error("[DynamicQRCode] Error obteniendo token:", err);
      setError(err.message || "Error al generar código QR.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [schoolSlug, courseId, subjectId, ttlSeconds, onTokenChange]);

  // Primer fetch al montar o cuando cambia el curso
  useEffect(() => {
    fetchFreshToken();
  }, [fetchFreshToken]);

  // Temporizador regresivo de refresco dinámico
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchFreshToken();
          return ttlSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchFreshToken, ttlSeconds]);

  // Copiar token al portapapeles
  function handleCopyToken() {
    if (!qrToken) return;
    navigator.clipboard.writeText(qrToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const progressPercentage = (countdown / ttlSeconds) * 100;

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md text-center space-y-5 relative overflow-hidden ${className}`}
    >
      {/* Encabezado e insignias */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Badge variant="brand">
            <Sparkles className="w-3.5 h-3.5" /> Sesión Dinámica
          </Badge>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3" /> Anti-Fraude HS256
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Render del Código QR con Skeleton y Estado de Carga */}
      <div className="relative inline-block mx-auto">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-inner relative mx-auto w-64 h-64 flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-xs font-medium">Generando QR...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 text-rose-600">
              <AlertCircle className="w-8 h-8" />
              <span className="text-xs font-semibold">{error}</span>
              <Button
                onClick={fetchFreshToken}
                size="sm"
                variant="outline"
                className="text-xs mt-2 rounded-xl"
              >
                Reintentar
              </Button>
            </div>
          ) : qrDataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Código QR Dinámico de Clase"
                className="w-full h-full object-contain"
              />
              <AnimatePresence>
                {isRefreshing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center"
                  >
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : null}
        </div>
      </div>

      {/* Barra de progreso y cuenta regresiva de refresco */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 max-w-sm mx-auto">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Refresco automático
          </span>
          <span className="font-mono text-blue-600 dark:text-blue-400">
            {countdown}s restantes
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <motion.div
            className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
            initial={false}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ ease: "linear", duration: 0.5 }}
          />
        </div>
      </div>

      {/* Botones de acción manual */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <Button
          onClick={fetchFreshToken}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refrescar Código Ahora</span>
        </Button>

        {qrToken && (
          <Button
            onClick={handleCopyToken}
            variant="outline"
            size="sm"
            className="rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Token</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
