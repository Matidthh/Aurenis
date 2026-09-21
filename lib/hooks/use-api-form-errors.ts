"use client";

import { useState, useCallback } from "react";
import { ApiHttpError, parseApiError } from "@/lib/api/api-error";
import { useToast } from "@/components/ui/toast";

/**
 * Hook para gestionar y visualizar errores de API y validación Zod en formularios.
 * Responsable de autoría: Lucas P. (Componentes de UI de Alerta y Validación Zod)
 */
export interface UseApiFormErrorsReturn {
  error: ApiHttpError | null;
  fieldErrors: Record<string, string[]>;
  formErrors: string[];
  hasErrors: boolean;
  getFieldError: (fieldName: string) => string | undefined;
  hasFieldError: (fieldName: string) => boolean;
  clearErrors: () => void;
  clearFieldError: (fieldName: string) => void;
  setManualFieldError: (fieldName: string, message: string) => void;
  handleApiError: (
    err: unknown,
    options?: { showToast?: boolean; customTitle?: string }
  ) => ApiHttpError;
}

export function useApiFormErrors(): UseApiFormErrorsReturn {
  const [error, setError] = useState<ApiHttpError | null>(null);
  const { toastError } = useToast();

  const clearErrors = useCallback(() => {
    setError(null);
  }, []);

  const clearFieldError = useCallback((fieldName: string) => {
    setError((prev) => {
      if (!prev) return null;
      const updated = { ...prev.fieldErrors };
      delete updated[fieldName];
      return new ApiHttpError({
        status: prev.status,
        code: prev.code,
        message: prev.message,
        details: {
          formErrors: prev.formErrors,
          fieldErrors: updated,
        },
        rawResponse: prev.rawResponse,
      });
    });
  }, []);

  const setManualFieldError = useCallback((fieldName: string, message: string) => {
    setError((prev) => {
      const currentFields = prev ? { ...prev.fieldErrors } : {};
      currentFields[fieldName] = [message];
      return new ApiHttpError({
        status: 400,
        code: "VALIDATION_ERROR",
        message: "Error de validación en el formulario",
        details: {
          formErrors: prev ? prev.formErrors : [],
          fieldErrors: currentFields,
        },
      });
    });
  }, []);

  const handleApiError = useCallback(
    (
      err: unknown,
      options: { showToast?: boolean; customTitle?: string } = { showToast: true }
    ): ApiHttpError => {
      const apiErr = parseApiError(err);
      setError(apiErr);

      if (options.showToast) {
        const title = options.customTitle || (
          apiErr.status === 400 ? "Error en formulario" :
          apiErr.status === 401 ? "Sesión no válida" :
          apiErr.status === 403 ? "Acceso denegado" :
          apiErr.status === 422 ? "Validación fallida" :
          "Error en la operación"
        );

        toastError(title, {
          description: apiErr.getFirstFieldError() || apiErr.userMessage,
        });
      }

      return apiErr;
    },
    [toastError]
  );

  const getFieldError = useCallback(
    (fieldName: string): string | undefined => {
      if (!error || !error.fieldErrors[fieldName]) return undefined;
      const msgs = error.fieldErrors[fieldName];
      return msgs && msgs.length > 0 ? msgs[0] : undefined;
    },
    [error]
  );

  const hasFieldError = useCallback(
    (fieldName: string): boolean => {
      return Boolean(error && error.fieldErrors[fieldName] && error.fieldErrors[fieldName].length > 0);
    },
    [error]
  );

  return {
    error,
    fieldErrors: error?.fieldErrors || {},
    formErrors: error?.formErrors || [],
    hasErrors: error !== null,
    getFieldError,
    hasFieldError,
    clearErrors,
    clearFieldError,
    setManualFieldError,
    handleApiError,
  };
}
