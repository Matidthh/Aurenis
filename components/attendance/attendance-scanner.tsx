"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Camera,
  CameraOff,
  QrCode,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  KeyRound,
  Video,
  VideoOff,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCameraPermissions } from "@/lib/hooks/use-camera-permissions";
import jsQR from "jsqr";

interface AttendanceScannerProps {
  schoolSlug: string;
}

export function AttendanceScanner({ schoolSlug }: AttendanceScannerProps) {
  const { status: cameraStatus, error: cameraError, requestPermission } = useCameraPermissions();
  
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [manualToken, setManualToken] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    courseName?: string;
    studentName?: string;
    recordedAt?: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Función para enviar token al backend para validación y registro de asistencia
  const registerAttendance = useCallback(async (token: string) => {
    if (!token.trim()) return;

    try {
      setIsLoading(true);
      setScanResult(null);

      const res = await fetch("/api/attendance/session/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolSlug,
          qrToken: token.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Código QR no válido o expirado");
      }

      setScanResult({
        success: true,
        message: data.message || "¡Asistencia registrada correctamente!",
        courseName: data.courseName,
        studentName: data.studentName,
        recordedAt: data.recordedAt,
      });
      setManualToken("");
      stopCamera();
    } catch (err: any) {
      setScanResult({
        success: false,
        message: err.message || "Error al procesar el código de asistencia",
      });
    } finally {
      setIsLoading(false);
    }
  }, [schoolSlug]);

  // Detener la cámara y liberar recursos de vídeo
  const stopCamera = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  // Iniciar la cámara y bucle de lectura de QR
  const startCamera = async () => {
    setScanResult(null);
    const granted = await requestPermission();
    if (!granted) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute("playsinline", "true");
        await videoRef.current.play();
      }
      setIsScanning(true);
      requestAnimationFrame(scanTick);
    } catch (err: any) {
      console.error("Error starting camera stream:", err);
    }
  };

  // Bucle de escaneo de fotogramas con jsQR
  const scanTick = () => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          // QR detectado con éxito
          stopCamera();
          registerAttendance(code.data);
          return;
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(scanTick);
  };

  // Limpiar recursos al desmontar el componente
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-6">
        
        {/* Cabecera */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto">
            <QrCode className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Escáner de Asistencia QR
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Usa la cámara de tu dispositivo para escanear el código QR dinámico proyectado por el docente en el aula.
          </p>
        </div>

        {/* Sección de Vista de Cámara o Controles */}
        <div className="space-y-4">
          {cameraStatus === "unsupported" ? (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs text-center">
              Tu navegador o dispositivo no soporta el acceso a la cámara. Utiliza el campo de entrada manual inferior.
            </div>
          ) : cameraStatus === "denied" ? (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs space-y-2 text-center">
              <p className="font-semibold">El acceso a la cámara está bloqueado.</p>
              <p className="opacity-90">
                {cameraError || "Por favor habilita los permisos de cámara en la configuración de tu navegador para poder escanear."}
              </p>
              <Button
                onClick={() => requestPermission()}
                size="sm"
                variant="outline"
                className="mt-2 text-xs rounded-xl"
              >
                Solicitar Permiso Nuevamente
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Visor de vídeo de la cámara */}
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover ${isScanning ? "block" : "hidden"}`}
                />
                <canvas ref={canvasRef} className="hidden" />

                {!isScanning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 p-6 text-center text-slate-400 bg-slate-900/80 backdrop-blur-xs">
                    <Camera className="w-10 h-10 text-blue-500 animate-pulse" />
                    <div>
                      <p className="text-sm font-semibold text-white">Cámara inactiva</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Pulsa el botón para iniciar el escáner de asistencia
                      </p>
                    </div>
                  </div>
                )}

                {isScanning && (
                  <div className="absolute inset-0 border-2 border-blue-500/60 pointer-events-none rounded-2xl flex items-center justify-center">
                    <div className="w-48 h-48 border border-dashed border-blue-400/80 rounded-xl flex items-center justify-center">
                      <span className="text-[10px] font-mono tracking-wider bg-black/60 text-blue-300 px-2 py-1 rounded">
                        ENFOCANDO QR...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de control de cámara */}
              <div className="flex gap-2">
                {!isScanning ? (
                  <Button
                    onClick={startCamera}
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl py-3 text-sm shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Iniciar Cámara y Escanear QR</span>
                  </Button>
                ) : (
                  <Button
                    onClick={stopCamera}
                    variant="destructive"
                    className="w-full rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <VideoOff className="w-4 h-4" />
                    <span>Detener Cámara</span>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Divisor */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              O ingreso manual
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          {/* Formulario de Token Manual como alternativa robusta */}
          <div className="space-y-3">
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Ingresar token de clase manualmente..."
                value={manualToken}
                onChange={(e) => setManualToken(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm font-mono text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
              onClick={() => registerAttendance(manualToken)}
              disabled={isLoading || !manualToken.trim()}
              variant="outline"
              className="w-full rounded-xl py-3 text-xs font-semibold border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span>Validando en servidor...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Validar Token Manualmente</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Tarjeta de Resultado */}
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
                  {scanResult.success ? "¡Asistencia Registrada!" : "Error de Validación"}
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
