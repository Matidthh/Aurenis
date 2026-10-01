/**
 * ============================================================================
 * AURENIS — GUARD DE STEP-UP AUTHENTICATION PARA OPERACIONES CRÍTICAS
 * ============================================================================
 * Protege endpoints administrativos destructivos o de alta sensibilidad:
 * - Creación/Eliminación de SuperAdmins.
 * - Desactivación de MFA.
 * - Suspensión global de colegios / Tenants.
 * - Exportación masiva de backups del sistema.
 * 
 * Autores: Maicol R. (Backend/Arquitectura) & Frank M. (QA/Seguridad)
 * ============================================================================
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { verifyStepUpToken } from "@/lib/auth/challenge-token";
import { apiError } from "@/lib/api/response";
import { logAuditEvent } from "@/lib/services/audit.service";
import { AuditAction } from "@prisma/client";

export interface StepUpGuardResult {
  allowed: boolean;
  userId?: string;
  response?: NextResponse;
}

/**
 * Valida que la solicitud provenga de un System Admin y cuente con un token de Step-Up válido.
 */
export async function requireSystemAdminStepUp(
  req: NextRequest,
  actionName: string
): Promise<StepUpGuardResult> {
  const session = await getSession();

  // 1. Validar autenticación base
  if (!session) {
    return {
      allowed: false,
      response: apiError("No autenticado. Inicie sesión para continuar.", "UNAUTHORIZED", {
        statusCode: 401,
      }) as unknown as NextResponse,
    };
  }

  // 2. Validar rol SuperAdmin
  if (!session.isSystemAdmin) {
    return {
      allowed: false,
      response: apiError("Acceso denegado. Se requieren privilegios de SuperAdmin.", "FORBIDDEN", {
        statusCode: 403,
      }) as unknown as NextResponse,
    };
  }

  // 3. Extraer token de Step-Up (desde cabecera x-step-up-token o query param)
  const stepUpToken =
    req.headers.get("x-step-up-token") ||
    req.nextUrl.searchParams.get("stepUpToken");

  if (!stepUpToken) {
    await logAuditEvent({
      userId: session.userId,
      action: AuditAction.SECURITY_EVENT,
      entityType: "STEP_UP_AUTH",
      entityId: session.userId,
      details: {
        action: "STEP_UP_REQUIRED",
        targetAction: actionName,
        reason: "Operación sensible requiere re-autenticación MFA reciente",
      },
    });

    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: "Esta operación sensible requiere re-autenticación MFA reciente (Step-Up Token).",
          code: "STEP_UP_REQUIRED",
          action: actionName,
        },
        { status: 403 }
      ),
    };
  }

  // 4. Validar validez criptográfica y expiración del Step-Up token
  const verification = await verifyStepUpToken(stepUpToken, session.userId, actionName);

  if (!verification.allowed) {
    await logAuditEvent({
      userId: session.userId,
      action: AuditAction.SECURITY_EVENT,
      entityType: "STEP_UP_AUTH",
      entityId: session.userId,
      details: {
        action: "STEP_UP_FAILED",
        targetAction: actionName,
        reason: verification.reason,
      },
    });

    return {
      allowed: false,
      response: NextResponse.json(
        {
          error: verification.reason || "Token de Step-Up inválido o expirado.",
          code: "STEP_UP_INVALID",
          action: actionName,
        },
        { status: 403 }
      ),
    };
  }

  return { allowed: true, userId: session.userId };
}
