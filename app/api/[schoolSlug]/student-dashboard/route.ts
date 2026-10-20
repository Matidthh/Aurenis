export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getStudentDashboardData, listAvailableDemoStudents } from "@/lib/services/student-dashboard.service";
import { apiSuccess, apiError } from "@/lib/api/response";

/**
 * ============================================================================
 * ENDPOINT SEGURO: DATOS DEL DASHBOARD DEL ESTUDIANTE (`/[schoolSlug]/student-dashboard`)
 * ============================================================================
 * Autores:
 * - 👑 Maicol R. (Arquitectura, Backend & Control de Sesión)
 * - 💻 Malcom Marcelo (Consumo Frontend React)
 * - 🛡️ Frank M. (Seguridad, Prevención BOLA/IDOR & Protección de Datos NNA)
 * ============================================================================
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ schoolSlug: string }> }
) {
  try {
    const session = await getSession();
    const { schoolSlug } = await params;

    // 1. Control de Autenticación Obligatorio
    if (!session) {
      return apiError(
        "No autenticado. Inicie sesión para acceder al portal del estudiante.",
        "UNAUTHORIZED",
        { statusCode: 401 }
      );
    }

    // 2. Control de Aislamiento Multi-Tenant (Horizontal Access Control)
    if (!session.isSystemAdmin && session.activeSchoolSlug && session.activeSchoolSlug !== schoolSlug) {
      return apiError(
        "No tienes autorización para acceder a los registros de esta institución.",
        "FORBIDDEN",
        { statusCode: 403 }
      );
    }

    const requestedEmail = req.nextUrl.searchParams.get("email");

    // 3. Prevención de Ataques BOLA/IDOR (Vertical Access Control)
    // Si el usuario autenticado tiene rol de estudiante, solo puede consultar su propio perfil
    let identifier: string | undefined = session.email;

    const isStaffOrAdmin =
      session.isSystemAdmin ||
      ["DIRECTOR", "TEACHER", "INSPECTOR", "SUPERVISOR", "STAFF"].includes(session.roleName || "");

    if (isStaffOrAdmin && requestedEmail) {
      // Personal docente y directivo autorizado puede inspeccionar fichas académicas
      identifier = requestedEmail;
    } else if (session.roleName === "STUDENT") {
      // Garantizar que un estudiante jamás consulte notas ajenas por manipulación de URL
      identifier = session.email;
    }

    const data = getStudentDashboardData(identifier);
    const availableStudents = isStaffOrAdmin ? listAvailableDemoStudents() : [];

    return apiSuccess({
      data,
      availableStudents,
      isStudentSelf: session.roleName === "STUDENT",
    });
  } catch (error: any) {
    return apiError(error.message || "Error al obtener datos académicos del estudiante.", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}
