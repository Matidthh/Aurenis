"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  QrCode,
  GraduationCap,
  ArrowRight,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Building2,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth/auth-context";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

function AttendanceScanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const token = searchParams.get("token") || "";
  const schoolParam = searchParams.get("school") || "";

  const [scanStatus, setScanStatus] = useState<
    "VERIFYING_AUTH" | "REGISTERING" | "SUCCESS" | "EXPIRED" | "ERROR"
  >("VERIFYING_AUTH");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<{
    status?: string;
    studentName?: string;
    courseName?: string;
    recordedAt?: string;
    method?: string;
  } | null>(null);

  // 1. Verificación de Autenticación del Estudiante
  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setScanStatus("ERROR");
      setErrorMessage("No se proporcionó ningún token de asistencia en el código QR.");
      return;
    }

    // Caso B: El estudiante no ha iniciado sesión en su teléfono móvil
    if (!isAuthenticated || !user) {
      setScanStatus("VERIFYING_AUTH");
      const currentFullUrl =
        typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : `/asistencia/scan?token=${encodeURIComponent(token)}`;

      const schoolQuery = schoolParam ? `&school=${encodeURIComponent(schoolParam)}` : "";
      const loginUrl = `/login?returnUrl=${encodeURIComponent(currentFullUrl)}${schoolQuery}`;

      // Redirigir al inicio de sesión institucional preservando la URL de escaneo
      router.replace(loginUrl);
      return;
    }

    // Caso A: El estudiante está logeado -> Registrar presencia automáticamente
    async function executeScanRegistration() {
      setScanStatus("REGISTERING");
      setErrorMessage(null);

      try {
        const res = await fetch("/api/attendance/session/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            qrToken: token,
            schoolSlug: schoolParam || user?.activeSchoolSlug || "lpmm",
          }),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          const errText = data?.error || "Error al procesar el código de asistencia.";
          if (
            errText.toLowerCase().includes("expir") ||
            errText.toLowerCase().includes("jwt expired") ||
            errText.toLowerCase().includes("caduc")
          ) {
            setScanStatus("EXPIRED");
            setErrorMessage(
              "El código QR ha expirado. Por seguridad se regenera cada 15 segundos para evitar capturas o reenvíos. Por favor escanea el código actual en la pantalla del profesor."
            );
          } else {
            setScanStatus("ERROR");
            setErrorMessage(errText);
          }
          return;
        }

        // Éxito: Presencia registrada en el Libro de Clases
        const now = new Date();
        const timeStr = now.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });

        setAttendanceData({
          status: data?.status || data?.record?.status || "PRESENT",
          studentName: data?.studentName || `${user.firstName} ${user.lastName}`,
          courseName: data?.courseName || "Tu Curso",
          recordedAt: timeStr,
          method: "QR",
        });

        setScanStatus("SUCCESS");
      } catch (err: any) {
        setScanStatus("ERROR");
        setErrorMessage(
          err.message || "No fue posible conectar con el servidor de asistencia escolar."
        );
      }
    }

    executeScanRegistration();
  }, [authLoading, isAuthenticated, user, token, schoolParam, router]);

  const dashboardTarget = user?.activeSchoolSlug
    ? `/${user.activeSchoolSlug}/dashboard/estudiante`
    : "/dashboard/estudiante";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-[#0B1528] to-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 text-white text-center">
      {/* Cabecera / Logotipo */}
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <AurenisLogo
            className="w-10 h-10"
            textClassName="text-white text-2xl font-bold tracking-tight"
            showText={true}
            preferSvg={true}
          />
        </Link>
        <p className="text-xs text-blue-300 font-medium uppercase tracking-wider mt-2">
          Control de Asistencia Digital en Vivo
        </p>
      </div>

      {/* Contenedor Principal */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 text-slate-800 shadow-2xl border border-white/20 text-center relative overflow-hidden">
        {/* Barra superior de acento decorativa */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

        <AnimatePresence mode="wait">
          {/* ESTADO 1: VERIFICANDO O REDIRIGIENDO AL LOGIN */}
          {scanStatus === "VERIFYING_AUTH" && (
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Verificando tu cuenta escolar...
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                Para identificarte y registrarte como presente, te estamos conectando con el portal de tu establecimiento.
              </p>
            </motion.div>
          )}

          {/* ESTADO 2: REGISTRANDO PRESENCIA */}
          {scanStatus === "REGISTERING" && (
            <motion.div
              key="registering"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-8 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Registrando tu asistencia...
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Firmando tu presencia en el Libro de Clases Digital oficial.
              </p>
            </motion.div>
          )}

          {/* ESTADO 3: ÉXITO - ASISTENCIA REGISTRADA */}
          {scanStatus === "SUCCESS" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="py-4 space-y-5"
            >
              {/* Icono de Check Gigante */}
              <div
                className={cn(
                  "w-20 h-20 rounded-full border-4 flex items-center justify-center mx-auto shadow-inner",
                  attendanceData?.status === "LATE"
                    ? "bg-amber-100 border-amber-200 text-amber-600"
                    : "bg-emerald-100 border-emerald-200 text-emerald-600"
                )}
              >
                {attendanceData?.status === "LATE" ? (
                  <Clock className="w-10 h-10" />
                ) : (
                  <CheckCircle2 className="w-10 h-10" />
                )}
              </div>

              <div>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border",
                    attendanceData?.status === "LATE"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  )}
                >
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      attendanceData?.status === "LATE" ? "bg-amber-500" : "bg-emerald-500"
                    )}
                  />
                  {attendanceData?.status === "LATE" ? "Llegada con Atraso" : "Quedaste Presente"}
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-2">
                  {attendanceData?.status === "LATE" ? "¡Atraso Registrado!" : "¡Asistencia Registrada!"}
                </h2>
                <p className="text-sm text-slate-600 font-medium mt-1">
                  {attendanceData?.studentName}
                </p>
                {attendanceData?.status === "LATE" && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 mt-2 max-w-xs mx-auto">
                    Marcaste fuera del margen de tolerancia inicial. Tu presencia y minutos de retraso han quedado consignados.
                  </p>
                )}
              </div>

              {/* Ficha de Detalles de la Asistencia */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Hora de Marcaje:</span>
                  <span className="font-bold font-mono text-slate-900">
                    {attendanceData?.recordedAt} hrs
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Método de Validación:</span>
                  <span className="font-semibold text-emerald-700 inline-flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5" />
                    Código QR Dinámico (15s)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Normativa MINEDUC:</span>
                  <span className="font-mono text-[11px] text-slate-600">
                    Circular 482 · Libro Digital
                  </span>
                </div>
              </div>

              {/* Botón de Retorno al Panel */}
              <div className="pt-2">
                <Button
                  variant="primary"
                  className="w-full h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  onClick={() => router.push(dashboardTarget)}
                >
                  <span>Ir a mi Portal de Estudiante</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* ESTADO 4: CÓDIGO EXPIRADO (> 15 SEGUNDOS) */}
          {scanStatus === "EXPIRED" && (
            <motion.div
              key="expired"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-4 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
                <Clock className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                Código QR Expirado
              </h2>
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 text-left leading-relaxed">
                <p className="font-semibold mb-1">Rotación cada 15 segundos:</p>
                {errorMessage}
              </div>
              <p className="text-xs text-slate-500">
                Por favor, apunta nuevamente tu cámara hacia la proyección o pantalla del profesor para capturar el código actual.
              </p>
              <div className="pt-2">
                <Button
                  variant="secondary"
                  className="w-full h-11 rounded-xl text-xs font-semibold"
                  onClick={() => router.push(dashboardTarget)}
                >
                  Volver a mi panel
                </Button>
              </div>
            </motion.div>
          )}

          {/* ESTADO 5: ERROR DE VALIDACIÓN O CURSO */}
          {scanStatus === "ERROR" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-4 space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                No se pudo registrar asistencia
              </h2>
              <p className="text-xs sm:text-sm text-red-600 font-medium bg-red-50 p-3 rounded-xl border border-red-200 leading-relaxed">
                {errorMessage}
              </p>
              <div className="pt-2 space-y-2">
                <Button
                  variant="primary"
                  className="w-full h-11 rounded-xl text-xs font-semibold"
                  onClick={() => router.push(dashboardTarget)}
                >
                  Ir al panel escolar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer de Resguardo */}
      <div className="mt-8 text-center text-xs text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400" />
        <span>Firma criptográfica HMAC-SHA256 · AURENIS Attendance Engine</span>
      </div>
    </div>
  );
}

export default function AttendanceScanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AttendanceScanContent />
    </Suspense>
  );
}
