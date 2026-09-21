"use client";

import React, { useState } from "react";
import {
  ServerCrash,
  WifiOff,
  Wrench,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Play,
  Sparkles,
  Layers,
  Info,
  Bug,
  Activity,
  Check,
} from "lucide-react";
import { useNetworkStatus, ConnectionErrorType, setGlobalNetworkError, clearGlobalNetworkError } from "@/lib/api/network-status";
import { NetworkErrorBanner } from "@/components/ui/network-error-banner";
import { NetworkErrorState } from "@/components/ui/network-error-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/**
 * Componente que lanza una excepción en tiempo de render para validar
 * el comportamiento del ErrorBoundary y la ausencia de pantallas blancas.
 */
function BuggyComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Excepción simulada en componente React (Crash Test para ErrorBoundary)");
  }

  return (
    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div>
          <h4 className="text-xs font-bold">Componente Operativo</h4>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
            Renderizado normal y protegido por Error Boundary.
          </p>
        </div>
      </div>
      <Badge variant="success" size="sm">
        Saludable
      </Badge>
    </div>
  );
}

interface ErrorResilienceMockupProps {
  onMarkCriterion?: (id: string) => void;
}

export function ErrorResilienceMockup({ onMarkCriterion }: ErrorResilienceMockupProps) {
  const {
    isOnline,
    activeError,
    isRetrying,
    isSuccessRecovered,
    retryLastRequest,
    dismissError,
    simulateError,
  } = useNetworkStatus();

  // Estados locales para simular fallos específicos en línea
  const [inlineSimulatedType, setInlineSimulatedType] = useState<ConnectionErrorType | null>("server_500");
  const [isInlineRetrying, setIsInlineRetrying] = useState(false);
  const [inlineRecovered, setInlineRecovered] = useState(false);
  const [shouldCrashBoundary, setShouldCrashBoundary] = useState(false);

  // Lista local de criterios para verificación inmediata
  const [dodCriteria, setDodCriteria] = useState([
    {
      id: "dod-err-1",
      title: "Banners de error amigables visualizados",
      desc: "Mensajes claros en español, sin tecnicismos agresivos, con código HTTP (500, 503), ícono semántico y estado no invasivo.",
      checked: true,
    },
    {
      id: "dod-err-2",
      title: "Opción de reintentar funcional",
      desc: "Botón 'Reintentar' interactivo con estado de carga, verificación de salud/endpoint y banner de éxito al restablecer servicio.",
      checked: true,
    },
    {
      id: "dod-err-3",
      title: "Ausencia de pantallas blancas en cliente",
      desc: "Protección con Error Boundary en layouts y componentes que previene pantallas en blanco (White Screen of Death) ante errores de render.",
      checked: true,
    },
  ]);

  const toggleCriterion = (id: string) => {
    setDodCriteria((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
    if (onMarkCriterion) onMarkCriterion(id);
  };

  const markAll = () => {
    setDodCriteria((prev) => prev.map((c) => ({ ...c, checked: true })));
  };

  const handleInlineRetry = async () => {
    setIsInlineRetrying(true);
    await new Promise((r) => setTimeout(r, 900));
    setIsInlineRetrying(false);
    setInlineSimulatedType(null);
    setInlineRecovered(true);
    setTimeout(() => setInlineRecovered(false), 3500);
  };

  const completedCount = dodCriteria.filter((c) => c.checked).length;
  const percentage = Math.round((completedCount / dodCriteria.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header de Verificación y Criterios */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                <ServerCrash className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Verificación de Respuesta UI: Caídas de Servidor y Errores 500
              </h2>
              <Badge variant={completedCount === 3 ? "success" : "warning"} size="sm">
                DoD: {completedCount}/3 ({percentage}%)
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl">
              Suite de pruebas para validar la resiliencia de la interfaz ante caídas HTTP 500, mantenimiento 503, pérdidas de conexión de red y prevención de pantallas blancas en cliente.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={markAll}
              className="text-xs font-bold"
            >
              Marcar todos
            </Button>
          </div>
        </div>

        {/* Tarjetas de Criterios de Aceptación (DoD) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          {dodCriteria.map((crit) => (
            <div
              key={crit.id}
              onClick={() => toggleCriterion(crit.id)}
              className={`p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between gap-2 select-none ${
                crit.checked
                  ? "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800"
                  : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                      crit.checked
                        ? "bg-emerald-600 text-white"
                        : "border-2 border-slate-400 dark:border-slate-500"
                    }`}
                  >
                    {crit.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white leading-snug">
                      {crit.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                      {crit.desc}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                <span className={crit.checked ? "text-emerald-700 dark:text-emerald-400 font-bold" : "text-slate-400"}>
                  {crit.checked ? "Criterio Aprobado" : "Pendiente de verificación"}
                </span>
                <span className="font-mono text-slate-400">{crit.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Panel de Control de Simulación de Servidor */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Simulador de Escenarios de Falla (Global Banner & Eventos de Red)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Haz clic en cualquiera para disparar el banner interactivo:
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => simulateError("server_500")}
            className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-left transition flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-rose-600 text-white shrink-0 group-hover:scale-105 transition">
              <ServerCrash className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-rose-900 dark:text-rose-100">Error HTTP 500</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-rose-200 dark:bg-rose-800 text-rose-900 dark:text-rose-100 font-extrabold">
                  CRITICAL
                </span>
              </div>
              <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-snug">
                Caída imprevista del servidor backend o base de datos.
              </p>
            </div>
          </button>

          <button
            onClick={() => simulateError("service_503")}
            className="p-3.5 rounded-xl border border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-left transition flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-orange-600 text-white shrink-0 group-hover:scale-105 transition">
              <Wrench className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-orange-900 dark:text-orange-100">Error HTTP 503</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100 font-extrabold">
                  MANTENIMIENTO
                </span>
              </div>
              <p className="text-[11px] text-orange-700 dark:text-orange-300 mt-0.5 leading-snug">
                Servicio temporalmente en mantenimiento o con alta carga.
              </p>
            </div>
          </button>

          <button
            onClick={() => simulateError("offline")}
            className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-left transition flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-amber-600 text-white shrink-0 group-hover:scale-105 transition">
              <WifiOff className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-amber-900 dark:text-amber-100">Modo Offline</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 font-extrabold">
                  NETWORK
                </span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 leading-snug">
                Pérdida de enlace Wi-Fi o datos móviles en el cliente.
              </p>
            </div>
          </button>

          <button
            onClick={() => simulateError("network_timeout")}
            className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition flex items-start gap-3 group"
          >
            <div className="p-2 rounded-lg bg-slate-700 text-white shrink-0 group-hover:scale-105 transition">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100">Timeout de Red</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold">
                  15s
                </span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug">
                Excedido el límite de tiempo de respuesta de la API.
              </p>
            </div>
          </button>
        </div>

        {/* Estado en vivo del banner global */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-brand-500" />
              Vista Previa en Vivo del Banner de Fallas Global:
            </span>
            {activeError && (
              <button
                onClick={dismissError}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium underline"
              >
                Limpiar estado global
              </button>
            )}
          </div>

          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <NetworkErrorBanner variant="top-banner" />
            {!activeError && !isSuccessRecovered && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Sin incidentes activos. Selecciona una opción arriba para simular la caída.</span>
                </div>
                <Badge variant="outline" className="border-emerald-300 text-emerald-700 dark:text-emerald-300 text-[10px]">
                  Sistema Operativo
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Validación de Componentes Inline y Reintento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lado A: Error State Inline dentro de Módulos */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-rose-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Manejo de Error 500 a Nivel de Módulo (Inline State)
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setInlineSimulatedType("server_500")}
                className="px-2 py-0.5 text-[11px] rounded bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-bold"
              >
                500
              </button>
              <button
                onClick={() => setInlineSimulatedType("service_503")}
                className="px-2 py-0.5 text-[11px] rounded bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 font-bold"
              >
                503
              </button>
              <button
                onClick={() => setInlineSimulatedType("offline")}
                className="px-2 py-0.5 text-[11px] rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold"
              >
                Offline
              </button>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Demuestra cómo una tarjeta o tabla específica muestra su propio estado de contingencia sin romper el resto del dashboard ni provocar parpadeos.
          </p>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 min-h-[220px] flex items-center justify-center">
            {inlineSimulatedType ? (
              <NetworkErrorState
                type={inlineSimulatedType}
                onRetry={handleInlineRetry}
                isRetrying={isInlineRetrying}
                compact={false}
              />
            ) : inlineRecovered ? (
              <div className="text-center p-6 space-y-2 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  ¡Datos recargados exitosamente!
                </h4>
                <p className="text-xs text-slate-500">
                  La opción de reintentar conectó con el backend y restauró la vista.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInlineSimulatedType("server_500")}
                  className="mt-2 text-xs"
                >
                  Volver a simular fallo
                </Button>
              </div>
            ) : (
              <div className="text-center p-6 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold">Módulo cargado con normalidad</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setInlineSimulatedType("server_500")}
                >
                  Simular caída del servicio
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Lado B: Prueba de Error Boundary (Ausencia de Pantallas Blancas) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Prueba de Error Boundary (Cero Pantallas Blancas)
              </h3>
            </div>
            <Badge variant="outline" size="sm">
              React Boundary
            </Badge>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Forzar una excepción en JavaScript en el componente secundario. El Error Boundary encapsula la falla, evitando que la aplicación quede en blanco.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Disparar excepción de render:
              </span>
              <Button
                size="sm"
                variant={shouldCrashBoundary ? "outline" : "danger"}
                onClick={() => setShouldCrashBoundary(!shouldCrashBoundary)}
                leftIcon={<Bug className="w-3.5 h-3.5" />}
                className="text-xs font-bold"
              >
                {shouldCrashBoundary ? "Restablecer Componente" : "Crash Test (Lanzar Error)"}
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 min-h-[160px] flex items-center justify-center">
              <ErrorBoundary
                boundaryName="MockupTestBoundary"
                onReset={() => setShouldCrashBoundary(false)}
                title="Error de Renderizado Atrapado"
                description="El Error Boundary contuvo la excepción y protegió la interfaz de usuario."
              >
                <BuggyComponent shouldThrow={shouldCrashBoundary} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
