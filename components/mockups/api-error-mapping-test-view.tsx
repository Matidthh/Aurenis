"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  Lock,
  ServerCrash,
  WifiOff,
  Sparkles,
  RefreshCw,
  Send,
} from "lucide-react";
import { ApiErrorAlert } from "@/components/ui/api-error-alert";
import { FormFieldError } from "@/components/ui/form-field-error";
import { useApiFormErrors } from "@/lib/hooks/use-api-form-errors";
import { ApiHttpError, parseApiError } from "@/lib/api/api-error";
import { apiClient } from "@/lib/api";
import { useToast } from "@/components/ui/toast";

/**
 * Vista de Auditoría y Verificación Interactiva del Mapeo de Errores de API (400, 401, 403, 422, 500)
 * Responsable de autoría: Lucas P. (Componentes de UI de Alerta y Validación Zod) & Malcom Marcelo (Arquitectura Core)
 */
export function ApiErrorMappingTestView() {
  const { error, fieldErrors, getFieldError, hasFieldError, clearErrors, handleApiError } =
    useApiFormErrors();
  const { toastSuccess, toastInfo } = useToast();

  const [activeScenario, setActiveScenario] = useState<string>("422_zod");
  const [isSimulating, setIsSimulating] = useState(false);
  const [retrying, setRetrying] = useState(false);

  // Form State simulado
  const [testForm, setTestForm] = useState({
    name: "",
    email: "correo-invalido",
    minGrade: -2,
    maxGrade: 5,
    role: "ESTUDIANTE",
  });

  const simulateError = (scenario: string) => {
    setActiveScenario(scenario);
    clearErrors();

    if (scenario === "400_bad_request") {
      const err = new ApiHttpError({
        status: 400,
        code: "BAD_REQUEST",
        message: "Los parámetros de la solicitud son incongruentes o están mal formados.",
        details: {
          formErrors: ["El rango de ponderaciones excede el límite anual permitido (100%)."],
        },
      });
      handleApiError(err);
    } else if (scenario === "401_unauthorized") {
      const err = new ApiHttpError({
        status: 401,
        code: "UNAUTHORIZED",
        message: "Tu token de sesión JWT ha expirado o no es válido. Por favor vuelve a iniciar sesión.",
      });
      handleApiError(err);
    } else if (scenario === "403_forbidden") {
      const err = new ApiHttpError({
        status: 403,
        code: "FORBIDDEN",
        message: "No tienes los permisos requeridos (DIRECTOR/ADMIN) para modificar la configuración de este establecimiento escolar.",
      });
      handleApiError(err);
    } else if (scenario === "422_zod") {
      const err = new ApiHttpError({
        status: 422,
        code: "VALIDATION_ERROR",
        message: "Error de validación de datos según el esquema Zod de la API.",
        details: {
          formErrors: ["El formulario contiene inconsistencias en sus campos obligatorios."],
          fieldErrors: {
            name: ["El nombre del periodo es requerido y debe tener al menos 3 caracteres."],
            email: ["El formato del correo electrónico ingresado no es válido."],
            minGrade: ["La nota mínima no puede ser inferior a 1.0."],
            maxGrade: ["La nota máxima debe ser estrictamente mayor a la nota de aprobación."],
          },
        },
      });
      handleApiError(err);
    } else if (scenario === "500_internal") {
      const err = new ApiHttpError({
        status: 500,
        code: "INTERNAL_SERVER_ERROR",
        message: "Ocurrió una falla crítica inesperada en el motor de base de datos PostgreSQL.",
      });
      handleApiError(err);
    } else if (scenario === "network_offline") {
      const err = new ApiHttpError({
        status: 0,
        code: "NETWORK_ERROR",
        message: "No se pudo establecer conexión con el servidor. Revisa tu conexión a internet o cortafuegos.",
      });
      handleApiError(err);
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setRetrying(false);
      clearErrors();
      toastSuccess("Recuperación Exitosa", {
        description: "La solicitud reintentada se procesó correctamente.",
      });
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 sm:p-6">
      {/* Cabecera */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Panel de Verificación: Mapeo de Errores JSON de API a Alertas
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Validación de capturas de respuestas 400, 401, 403, 422 (Zod), 500 y prevención de fallos críticos.
            </p>
          </div>
        </div>

        {/* Botones de Escenarios */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => simulateError("422_zod")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
              activeScenario === "422_zod" && error
                ? "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-200 ring-2 ring-amber-400"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>422 Zod Error</span>
          </button>

          <button
            type="button"
            onClick={() => simulateError("400_bad_request")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
              activeScenario === "400_bad_request" && error
                ? "bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/60 dark:border-amber-700 dark:text-amber-200 ring-2 ring-amber-400"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>400 Bad Request</span>
          </button>

          <button
            type="button"
            onClick={() => simulateError("401_unauthorized")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
              activeScenario === "401_unauthorized" && error
                ? "bg-purple-50 border-purple-300 text-purple-900 dark:bg-purple-950/60 dark:border-purple-700 dark:text-purple-200 ring-2 ring-purple-400"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            <Lock className="w-4 h-4 text-purple-500" />
            <span>401 Auth JWT</span>
          </button>

          <button
            type="button"
            onClick={() => simulateError("403_forbidden")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
              activeScenario === "403_forbidden" && error
                ? "bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/60 dark:border-rose-700 dark:text-rose-200 ring-2 ring-rose-400"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>403 Forbidden</span>
          </button>

          <button
            type="button"
            onClick={() => simulateError("500_internal")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
              activeScenario === "500_internal" && error
                ? "bg-red-50 border-red-300 text-red-900 dark:bg-red-950/60 dark:border-red-700 dark:text-red-200 ring-2 ring-red-400"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            <ServerCrash className="w-4 h-4 text-red-500" />
            <span>500 Server</span>
          </button>

          <button
            type="button"
            onClick={() => simulateError("network_offline")}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex flex-col items-center gap-1 border ${
              activeScenario === "network_offline" && error
                ? "bg-slate-200 border-slate-400 text-slate-900 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-100 ring-2 ring-slate-400"
                : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            <WifiOff className="w-4 h-4 text-slate-500" />
            <span>Network Fail</span>
          </button>
        </div>
      </div>

      {/* Banner de Alerta Visual */}
      <ApiErrorAlert
        error={error}
        onDismiss={clearErrors}
        onRetry={handleRetry}
        isRetrying={retrying}
      />

      {/* Formulario de Demostración con Validación de Campos en Línea */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Formulario Demostrativo con FormFieldError Zod
          </h2>
          {error && (
            <button
              type="button"
              onClick={clearErrors}
              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
            >
              Limpiar Errores
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Nombre de la Entidad *
            </label>
            <input
              type="text"
              value={testForm.name}
              onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
              placeholder="Ej: Periodo 2026"
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                hasFieldError("name")
                  ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />
            <FormFieldError error={getFieldError("name")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Correo Electrónico Institucional *
            </label>
            <input
              type="email"
              value={testForm.email}
              onChange={(e) => setTestForm({ ...testForm, email: e.target.value })}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                hasFieldError("email")
                  ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />
            <FormFieldError error={getFieldError("email")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Nota Mínima *
            </label>
            <input
              type="number"
              value={testForm.minGrade}
              onChange={(e) => setTestForm({ ...testForm, minGrade: parseFloat(e.target.value) || 0 })}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                hasFieldError("minGrade")
                  ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />
            <FormFieldError error={getFieldError("minGrade")} />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Nota Máxima *
            </label>
            <input
              type="number"
              value={testForm.maxGrade}
              onChange={(e) => setTestForm({ ...testForm, maxGrade: parseFloat(e.target.value) || 0 })}
              className={`w-full px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-brand-500 outline-none ${
                hasFieldError("maxGrade")
                  ? "border-rose-400 dark:border-rose-700 ring-1 ring-rose-400"
                  : "border-slate-300 dark:border-slate-700"
              }`}
            />
            <FormFieldError error={getFieldError("maxGrade")} />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Manejo de excepciones controlado con cero cierres inesperados.</span>
          </div>

          <button
            type="button"
            onClick={() => simulateError("422_zod")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simular Envío de Formulario</span>
          </button>
        </div>
      </div>
    </div>
  );
}
