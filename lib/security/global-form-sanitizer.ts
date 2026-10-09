/**
 * ============================================================================
 * AURENIS — GLOBAL FORM & PAYLOAD INJECTION PREVENTION MIDDLEWARE
 * ============================================================================
 * Autores: Maicol R. (Backend Lead) & Frank M. (Seguridad & Prevención de Inyecciones)
 * 
 * Misión:
 * 1. Intercepta y sanitiza recursivamente todos los cuerpos JSON de formularios (POST, PUT, PATCH).
 * 2. Neutraliza ataques XSS, inyecciones de comandos, null bytes y Prototype Pollution.
 * 3. Garantiza que ningún formulario en toda la aplicación procese entradas maliciosas.
 * ============================================================================
 */

import { NextRequest } from "next/server";
import { sanitizeObject, isAnomalousPayload } from "@/lib/security/sanitization";

export interface SanitizedPayloadResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Sanitiza y valida globalmente el cuerpo JSON de cualquier petición de formulario.
 */
export async function parseAndSanitizeBody<T>(req: NextRequest): Promise<SanitizedPayloadResult<T>> {
  try {
    const rawBody = await req.json().catch(() => null);
    if (rawBody === null || rawBody === undefined) {
      return { success: true, data: {} as T };
    }

    // Comprobación preliminar de cargas anómalas o ataques de denegación de servicio por tamaño
    const stringified = JSON.stringify(rawBody);
    if (isAnomalousPayload(stringified)) {
      return {
        success: false,
        error: "Se detectó una carga útil anómala o potencialmente maliciosa en el formulario. Solicitud rechazada.",
      };
    }

    // Sanitización recursiva anti-XSS, anti-prototype pollution y normalización de strings
    const sanitizedData = sanitizeObject(rawBody);

    return {
      success: true,
      data: sanitizedData as T,
    };
  } catch (err) {
    return {
      success: false,
      error: "Error al procesar y sanitizar el cuerpo de la solicitud.",
    };
  }
}
