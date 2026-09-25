export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth/session";
import { apiSuccess, apiError } from "@/lib/api/response";
import {
  getUserPreferences,
  saveUserPreferences,
} from "@/lib/services/user-preference.service";
import { z } from "zod";

const UserPreferencesUpdateSchema = z.object({
  theme: z.enum(["light", "dark", "system"]).optional(),
  sidebarCollapsed: z.boolean().optional(),
  notificationsEnabled: z.boolean().optional(),
  language: z.string().max(10).optional(),
});

/**
 * GET /api/user/preferences
 * Obtiene las preferencias del usuario persistidas en la BBDD.
 * Autores: Carlos M. & Lucas P.
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const preferences = await getUserPreferences(session.userId);
    return apiSuccess({ preferences });
  } catch (error: unknown) {
    return apiError(
      error instanceof Error ? error.message : "Error al obtener preferencias de la base de datos",
      "INTERNAL_ERROR",
      { statusCode: 500 }
    );
  }
}

/**
 * PUT /api/user/preferences
 * Guarda de forma persistente las preferencias del usuario en la BBDD.
 * Autores: Carlos M. & Lucas P.
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return apiError("No autenticado", "UNAUTHORIZED", { statusCode: 401 });
    }

    const body = await req.json();
    const parsed = UserPreferencesUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("Parámetros de preferencias inválidos", "VALIDATION_ERROR", {
        statusCode: 400,
        details: parsed.error.flatten(),
      });
    }

    const updated = await saveUserPreferences(session.userId, parsed.data);
    return apiSuccess({ preferences: updated }, { message: "Preferencias actualizadas en base de datos." });
  } catch (error: unknown) {
    return apiError(
      error instanceof Error ? error.message : "Error al guardar preferencias en la base de datos",
      "INTERNAL_ERROR",
      { statusCode: 500 }
    );
  }
}
