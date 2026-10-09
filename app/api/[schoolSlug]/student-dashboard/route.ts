export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getStudentDashboardData, listAvailableDemoStudents } from "@/lib/services/student-dashboard.service";
import { apiSuccess, apiError } from "@/lib/api/response";

/**
 * ============================================================================
 * ENDPOINT DE DATOS DEL DASHBOARD DEL ESTUDIANTE (`/[schoolSlug]/student-dashboard`)
 * ============================================================================
 * Autores:
 * - 👑 Maicol R. (Arquitectura, Backend & Autorización de Sesión)
 * - 💻 Malcom Marcelo (Consumo Frontend React)
 * - 🛡️ Frank M. (Seguridad, Decreto 67 & Control de Acceso)
 * ============================================================================
 */

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ schoolSlug: string }> }
) {
  try {
    const session = await getSession();
    const { schoolSlug } = await params;
    const requestedEmail = req.nextUrl.searchParams.get("email");

    // Si hay un usuario en sesión que es alumno, su correo tiene prioridad absoluta
    let identifier = session?.email;

    // Si es directivo, profesor o admin, puede consultar a otro estudiante
    if (requestedEmail && (session?.isSystemAdmin || session?.roleName !== "STUDENT")) {
      identifier = requestedEmail;
    }

    const data = getStudentDashboardData(identifier || requestedEmail || undefined);
    const availableStudents = listAvailableDemoStudents();

    return NextResponse.json({
      success: true,
      data,
      availableStudents,
    });
  } catch (error: any) {
    return apiError(error.message || "Error al obtener datos del estudiante.", "INTERNAL_ERROR", {
      statusCode: 500,
    });
  }
}
