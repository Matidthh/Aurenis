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
  AlertCircle,
  Copy,
  Check,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface AttendanceQRCodeProps {
  schoolSlug: string;
  courseId: string;
  subjectId?: string | null;
  ttlSeconds?: number;
  title?: string;
  subtitle?: string;
  onTokenRefresh?: (token: string) => void;
  onTokenExpire?: () => void;
  className?: string;
}

export function AttendanceQRCode({
  schoolSlug,
  courseId,
  subjectId,
  ttlSeconds = 30,
  title = "Código QR de Asistencia",
  subtitle = "Muestre este código a sus estudiantes para registrar su asistencia en tiempo real.",
  onTokenRefresh,
  onTokenExpire,
  className = "",
}: AttendanceQRCodeProps) {
  const [token, setToken] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(ttlSeconds);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenStatus, setTokenStatus] = useState<"VALID" | "EXPIRED" | "ERROR" | "LOADING">("LOADING");
  const [copied, setCopied] = useState<boolean>(false);

  // Solicitar un nuevo token firmado a la API de sesión de asistencia
  const fetchSessionToken = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      setTokenStatus("LOADING");

      const res = await fetch(`/api/${schoolSlug}/attendance/session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          subjectId: subjectId || null,
          ttlSeconds,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "No se pudo generar el token de sesión.");
      }

      const signedToken = json.token || json.session?.token;
      if (!signedToken) {
        throw new Error("Token firmado no recibido desde el servidor.");
      }

      setToken(signedToken);
      setExpiresAt(json.expiresAt || json.session?.expiresAt || null);
      setTokenStatus("VALID");

      if (onTokenRefresh) {
        onTokenRefresh(signedToken);
      }

      // Renderizar el código QR en un Canvas/Base64 Data URL de alta definición
      const dataUrl = await QRCode.toDataURL(signedToken, {
        width: 320,
        margin: 2,
        color: { dark: "#0f172a", light: "#ffffff" },
        errorCorrectionLevel: "H",
      });

      setQrDataUrl(dataUrl);
      setCountdown(ttlSeconds);
    } catch (err: any) {
      console.error("[AttendanceQRCode] Error generando token:", err);
      setError(err.message || "Error al obtener el código QR de asistencia.");
      setTokenStatus("ERROR");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [schoolSlug, courseId, subjectId, ttlSeconds, onTokenRefresh]);

  // Obtener el primer token al montar o cuando cambien los parámetros del curso
  useEffect(() => {
    fetchSessionToken();
  }, [fetchSessionToken]);

  // Manejo de cuenta regresiva y expiración
  useEffect(() => {
    if (tokenStatus === "ERROR") return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setTokenStatus("EXPIRED");
          if (onTokenExpire) {
            onTokenExpire();
          }
          // Refrescar automáticamente antes de que caduque la sesión
          fetchSessionToken();
          return ttlSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchSessionToken, ttlSeconds, tokenStatus, onTokenExpire]);

  // Copiar token
  function handleCopyToken() {
    if (!token) return;
    navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const progressPercentage = Math.max(0, Math.min(100, (countdown / ttlSeconds) * 100));

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-md text-center space-y-5 relative overflow-hidden ${className}`}
    >
      {/* Encabezado e insignias de validez del token */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-1">
          <Badge variant="brand">
            <Sparkles className="w-3.5 h-3.5" /> Token Firmado (jose)
          </Badge>

          {tokenStatus === "VALID" && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Válido & Activo
            </span>
          )}

          {tokenStatus === "EXPIRED" && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Clock className="w-3.5 h-3.5" /> Expirado - Renovando...
            </span>
          )}

          {tokenStatus === "ERROR" && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
              <AlertCircle className="w-3.5 h-3.5" /> Error de Token
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Render del Código QR con manejo de Carga y Error */}
      <div className="relative inline-block mx-auto">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-inner relative mx-auto w-64 h-64 flex items-center justify-center overflow-hidden">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
              <span className="text-xs font-medium">Generando token QR...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center p-4 text-center space-y-2 text-rose-600">
              <AlertCircle className="w-8 h-8" />
              <span className="text-xs font-semibold">{error}</span>
              <Button
                onClick={fetchSessionToken}
                size="sm"
                variant="outline"
                className="text-xs mt-2 rounded-xl"
              >
                Reintentar Generar
              </Button>
            </div>
          ) : qrDataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Código QR Asistencia AURENIS"
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

      {/* Temporizador e indicador de Expiración */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-2 max-w-sm mx-auto">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Expiración del token
          </span>
          <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
            {countdown}s restantes
          </span>
        </div>

        {/* Barra de progreso de caducidad */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              countdown <= 5 ? "bg-rose-500" : "bg-blue-600 dark:bg-blue-500"
            }`}
            initial={false}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ ease: "linear", duration: 0.5 }}
          />
        </div>
      </div>

      {/* Botones de control manual */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <Button
          onClick={fetchSessionToken}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          className="rounded-xl border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refrescar Token</span>
        </Button>

        {token && (
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
                <span>Copiar Token JWT</span>
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}

export default AttendanceQRCode;
