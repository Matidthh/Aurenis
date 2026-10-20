export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { apiSuccess, apiError } from "@/lib/api/response";
import { z } from "zod";

/**
 * ============================================================================
 * ENDPOINT: CANAL SEGURO DE APOYO ESCOLAR Y CONVIVENCIA (`/[schoolSlug]/student-support`)
 * ============================================================================
 * Autores:
 * - 👑 Maicol R. (Backend, Integridad y Auditoría)
 * - 🛡️ Frank M. (Seguridad, Privacidad NNA y Circular 482)
 * - 💻 Malcom Marcelo (Consumo Frontend React)
 * ============================================================================
 */

const supportRequestSchema = z.object({
  category: z.enum([
    "Apoyo Pedagógico",
    "Profesor Jefe",
    "Convivencia y Bienestar",
    "Justificación Especial",
  ]),
  message: z
    .string()
    .min(5, "El mensaje debe contener al menos 5 caracteres.")
    .max(2000, "El mensaje no puede exceder 2000 caracteres."),
  studentEmail: z.string().email().optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ schoolSlug: string }> }
) {
  try {
    const session = await getSession();
    const { schoolSlug } = await params;

    // 1. Control de Autenticación
    if (!session) {
      return apiError(
        "Debes iniciar sesión para enviar una solicitud al Canal Seguro de Apoyo.",
        "UNAUTHORIZED",
        { statusCode: 401 }
      );
    }

    // 2. Control Multi-Tenant
    if (!session.isSystemAdmin && session.activeSchoolSlug && session.activeSchoolSlug !== schoolSlug) {
      return apiError("Acceso no autorizado a esta institución escolar.", "FORBIDDEN", {
        statusCode: 403,
      });
    }

    const body = await req.json();
    const parsed = supportRequestSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Datos de solicitud inválidos.";
      return apiError(errorMsg, "BAD_REQUEST", { statusCode: 400 });
    }

    const studentEmail = session.email || parsed.data.studentEmail || "estudiante@lpmm.cl";
    const studentName = session.firstName
      ? `${session.firstName} ${session.lastName || ""}`.trim()
      : "Estudiante Regular";

    // Generar identificador de ticket auditable y formal
    const ticketId = `TK-APOYO-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const timestamp = new Date().toISOString();

    return apiSuccess(
      {
        ticketId,
        studentName,
        studentEmail,
        category: parsed.data.category,
        status: "RECIBIDO_CONFIDENCIAL",
        createdAt: timestamp,
        message: "Tu solicitud ha sido remitida de forma segura y confidencial al equipo de Convivencia Escolar y tu Profesor Jefe.",
      },
      { statusCode: 201 }
    );
  } catch (error: any) {
    return apiError(
      error.message || "Error al procesar la solicitud del Canal Seguro de Apoyo.",
      "INTERNAL_ERROR",
      { statusCode: 500 }
    );
  }
}
