/**
 * ============================================================================
 * AURENIS — MIDDLEWARE Y MOTOR DE INTEGRIDAD ACADÉMICA (VALIDACIÓN DE ESCALA)
 * ============================================================================
 * Responsable de Autoría:
 * - Maicol R. (Lead Arquitectura, Backend & Integridad Relacional en PostgreSQL)
 * - Frank M. (QA, Auditoría de Seguridad & Mitigación de Manipulación de Parámetros)
 *
 * Misión Crítica:
 * 1. Interceptar peticiones de ingreso y modificación de notas en las API Routes
 *    antes de que cualquier dato llegue o intente insertarse en PostgreSQL.
 * 2. Consultar la configuración institucional oficial (`SchoolSettings`) para la
 *    escuela (`minGrade`, `maxGrade`, `gradeScalePrecision`, `minPassingGrade`).
 * 3. Rechazar categóricamente con HTTP 422 (Unprocessable Entity) cualquier nota
 *    que viole la escala institucional (ej: nota < 1.0 o > 7.0 en Chile, valores NaN,
 *    o exceso de decimales no permitidos).
 * 4. Registrar intentos de inyección anómala en la pista de auditoría inmutable
 *    para trazabilidad ante la Superintendencia de Educación (Circular 30).
 * ============================================================================
 */

import { NextResponse } from "next/server";
import { createTenantPrisma } from "@/lib/db/tenant-extension";
import { getSchoolGradingConfig } from "@/lib/services/grade.service";
import { resolveTargetSchoolId } from "@/lib/security/object-authorization";
import { apiError } from "@/lib/api/response";
import { logAuditEvent } from "@/lib/services/audit.service";

export interface SchoolGradingConfig {
  minGrade: number;
  maxGrade: number;
  precision: number;
  minPassingGrade: number;
  termType: string;
}

export interface GradeScaleValidationResult {
  isValid: boolean;
  value: number;
  code?:
    | "GRADE_OUT_OF_RANGE"
    | "GRADE_INVALID_TYPE"
    | "GRADE_PRECISION_EXCEEDED"
    | "GRADE_IS_NAN";
  message?: string;
  config: SchoolGradingConfig;
}

/**
 * Valida un valor numérico puntual contra la escala y precisión configurada en la institución.
 */
export function validateGradeAgainstScale(
  rawVal: unknown,
  config: SchoolGradingConfig
): GradeScaleValidationResult {
  if (rawVal === null || rawVal === undefined || rawVal === "") {
    return {
      isValid: false,
      value: NaN,
      code: "GRADE_INVALID_TYPE",
      message: "El valor de la calificación es obligatorio y no puede ser nulo o vacío.",
      config,
    };
  }

  const num = typeof rawVal === "number" ? rawVal : parseFloat(String(rawVal).replace(",", "."));

  if (isNaN(num) || !isFinite(num)) {
    return {
      isValid: false,
      value: NaN,
      code: "GRADE_IS_NAN",
      message: `El valor ingresado ('${rawVal}') no corresponde a un número decimal válido.`,
      config,
    };
  }

  // Validación 1: Rango Institucional [minGrade, maxGrade]
  if (num < config.minGrade || num > config.maxGrade) {
    return {
      isValid: false,
      value: num,
      code: "GRADE_OUT_OF_RANGE",
      message: `Violación de integridad académica: La calificación ${num} está fuera de la escala oficial configurada para la institución [${config.minGrade.toFixed(1)} - ${config.maxGrade.toFixed(1)}].`,
      config,
    };
  }

  // Validación 2: Precisión Decimal (ej: 1 decimal en escala chilena 1.0 - 7.0)
  const factor = Math.pow(10, config.precision);
  const rounded = Math.round(num * factor) / factor;
  const difference = Math.abs(num - rounded);

  if (difference > 0.0001) {
    return {
      isValid: false,
      value: num,
      code: "GRADE_PRECISION_EXCEEDED",
      message: `Violación de formato: La calificación ${num} excede la precisión decimal permitida (${config.precision} decimal${config.precision > 1 ? "es" : ""}).`,
      config,
    };
  }

  return {
    isValid: true,
    value: rounded,
    config,
  };
}

export type GradeValidationPayloadType =
  | { type: "single"; value: unknown }
  | { type: "patch"; value?: unknown }
  | { type: "bulk"; grades: Array<{ value: unknown; enrollmentId?: string; assessmentId?: string }> };

export interface GradeScaleMiddlewareOptions {
  schoolId: string;
  payload: GradeValidationPayloadType;
  userId?: string;
  pathName?: string;
}

export interface MiddlewareExecutionResult {
  allowed: boolean;
  targetSchoolId: string;
  config: SchoolGradingConfig;
  errorResponse?: NextResponse;
}

/**
 * Middleware que intercepta peticiones en rutas de calificaciones antes de la inserción en DB.
 * Si alguna nota viola las reglas de integridad académica, detiene la ejecución inmediatamente
 * y retorna un error HTTP 422 estructurado.
 */
export async function executeGradeScaleMiddleware(
  options: GradeScaleMiddlewareOptions
): Promise<MiddlewareExecutionResult> {
  const { schoolId, payload, userId, pathName } = options;

  // 1. Resolver el UUID canónico de la institución
  const targetSchoolId = await resolveTargetSchoolId(schoolId);
  const tenantDb = createTenantPrisma(targetSchoolId);

  // 2. Cargar configuración académica persistida en PostgreSQL
  const config = await getSchoolGradingConfig(tenantDb, targetSchoolId);

  // 3. Inspeccionar el payload según el tipo de operación
  if (payload.type === "single") {
    const check = validateGradeAgainstScale(payload.value, config);
    if (!check.isValid) {
      await logSecurityIntegrityViolation({
        schoolId: targetSchoolId,
        userId: userId || null,
        path: pathName || "POST /api/schools/[schoolId]/grades",
        reason: check.message || "Calificación fuera de escala",
        offendingValue: payload.value,
        config,
      });

      return {
        allowed: false,
        targetSchoolId,
        config,
        errorResponse: buildIntegrityErrorResponse(check),
      };
    }
  } else if (payload.type === "patch") {
    // En PATCH el valor puede ser opcional si solo se actualiza feedback/comentario
    if (payload.value !== undefined) {
      const check = validateGradeAgainstScale(payload.value, config);
      if (!check.isValid) {
        await logSecurityIntegrityViolation({
          schoolId: targetSchoolId,
          userId: userId || null,
          path: pathName || "PATCH /api/schools/[schoolId]/grades/[gradeId]",
          reason: check.message || "Calificación fuera de escala en actualización",
          offendingValue: payload.value,
          config,
        });

        return {
          allowed: false,
          targetSchoolId,
          config,
          errorResponse: buildIntegrityErrorResponse(check),
        };
      }
    }
  } else if (payload.type === "bulk") {
    if (!Array.isArray(payload.grades) || payload.grades.length === 0) {
      return {
        allowed: false,
        targetSchoolId,
        config,
        errorResponse: apiError(
          "Debe proporcionar al menos una calificación para procesar en lote.",
          "VALIDATION_ERROR",
          { statusCode: 400 }
        ),
      };
    }

    const invalidItems: Array<{ index: number; value: unknown; reason: string }> = [];

    payload.grades.forEach((item, index) => {
      const check = validateGradeAgainstScale(item.value, config);
      if (!check.isValid) {
        invalidItems.push({
          index,
          value: item.value,
          reason: check.message || "Fuera de escala",
        });
      }
    });

    if (invalidItems.length > 0) {
      await logSecurityIntegrityViolation({
        schoolId: targetSchoolId,
        userId: userId || null,
        path: pathName || "POST /api/schools/[schoolId]/grades/bulk",
        reason: `Rechazado guardado masivo: ${invalidItems.length} de ${payload.grades.length} notas violan la escala institucional`,
        offendingValue: invalidItems[0].value,
        config,
      });

      return {
        allowed: false,
        targetSchoolId,
        config,
        errorResponse: apiError(
          `Violación de integridad académica: Se detectaron ${invalidItems.length} calificaciones fuera de la escala institucional [${config.minGrade.toFixed(1)} - ${config.maxGrade.toFixed(1)}]. Inserción rechazada por control de integridad.`,
          "ACADEMIC_INTEGRITY_GRADE_OUT_OF_BOUNDS",
          {
            statusCode: 422,
            details: {
              allowedScale: {
                minGrade: config.minGrade,
                maxGrade: config.maxGrade,
                precision: config.precision,
                minPassingGrade: config.minPassingGrade,
              },
              totalSubmissions: payload.grades.length,
              invalidCount: invalidItems.length,
              invalidSamples: invalidItems.slice(0, 5),
            },
          }
        ),
      };
    }
  }

  return {
    allowed: true,
    targetSchoolId,
    config,
  };
}

/**
 * Genera la respuesta HTTP 422 estandarizada de violación de integridad académica
 */
function buildIntegrityErrorResponse(
  result: GradeScaleValidationResult
): NextResponse {
  return apiError(
    result.message || "Violación de integridad académica: Calificación fuera de la escala institucional.",
    result.code || "ACADEMIC_INTEGRITY_GRADE_OUT_OF_BOUNDS",
    {
      statusCode: 422,
      details: {
        offendingValue: result.value,
        allowedScale: {
          minGrade: result.config.minGrade,
          maxGrade: result.config.maxGrade,
          precision: result.config.precision,
          minPassingGrade: result.config.minPassingGrade,
          termType: result.config.termType,
        },
        remediation: `Ingrese una calificación entre ${result.config.minGrade.toFixed(1)} y ${result.config.maxGrade.toFixed(1)} respetando ${result.config.precision} decimal(es).`,
      },
    }
  );
}

/**
 * Registra un evento de seguridad de auditoría inmutable si se detecta un intento de manipulación
 */
async function logSecurityIntegrityViolation(data: {
  schoolId: string;
  userId: string | null;
  path: string;
  reason: string;
  offendingValue: unknown;
  config: SchoolGradingConfig;
}) {
  try {
    await logAuditEvent({
      schoolId: data.schoolId,
      userId: data.userId,
      action: "SECURITY_EVENT",
      entityType: "GRADE_INTEGRITY",
      entityId: "GRADE_OUT_OF_BOUNDS_PREVENTED",
      details: {
        path: data.path,
        reason: data.reason,
        offendingValue: data.offendingValue,
        allowedRange: [data.config.minGrade, data.config.maxGrade],
        precision: data.config.precision,
        timestamp: new Date().toISOString(),
        defenseAction: "BLOQUEADO_EN_MIDDLEWARE_PRE_POSTGRESQL",
        legalBasis: "Decreto Supremo N.º 67/2018 y Circular N.º 30 de la Superintendencia de Educación",
      },
    });
  } catch {
    // Si falla el log no detiene la respuesta de seguridad
  }
}
