/**
 * Servicio Centralizado de Preferencias de Usuario persistidas en Base de Datos (PostgreSQL)
 * Autores: Carlos M. & Lucas P.
 *
 * Elimina cualquier dependencia de localStorage / sessionStorage en el cliente,
 * sincronizando el tema (light/dark), colapso de sidebar y configuración del usuario
 * directamente en la base de datos institucional.
 */

import { prisma } from "@/lib/db/prisma";

export interface UserPreferencesDto {
  theme: "light" | "dark" | "system";
  sidebarCollapsed: boolean;
  notificationsEnabled: boolean;
  language: string;
}

export const DEFAULT_USER_PREFERENCES: UserPreferencesDto = {
  theme: "light",
  sidebarCollapsed: false,
  notificationsEnabled: true,
  language: "es",
};

/**
 * Obtiene las preferencias persistidas en la BBDD para un usuario.
 */
export async function getUserPreferences(userId: string): Promise<UserPreferencesDto> {
  if (!userId) return DEFAULT_USER_PREFERENCES;

  try {
    const record = await (prisma as any).userPreference.findUnique({
      where: { userId },
    });

    if (!record) {
      return DEFAULT_USER_PREFERENCES;
    }

    return {
      theme: (record.theme === "dark" || record.theme === "system" ? record.theme : "light") as "light" | "dark" | "system",
      sidebarCollapsed: Boolean(record.sidebarCollapsed),
      notificationsEnabled: record.notificationsEnabled !== undefined ? Boolean(record.notificationsEnabled) : true,
      language: record.language || "es",
    };
  } catch (error) {
    console.error("[UserPreferenceService] Error al leer preferencias de la BBDD:", error);
    return DEFAULT_USER_PREFERENCES;
  }
}

/**
 * Actualiza o crea las preferencias del usuario directamente en la BBDD.
 */
export async function saveUserPreferences(
  userId: string,
  updates: Partial<UserPreferencesDto>
): Promise<UserPreferencesDto> {
  if (!userId) {
    throw new Error("Se requiere un userId válido para persistir preferencias en la BBDD.");
  }

  const cleanUpdates: Record<string, any> = {};
  if (updates.theme && ["light", "dark", "system"].includes(updates.theme)) {
    cleanUpdates.theme = updates.theme;
  }
  if (typeof updates.sidebarCollapsed === "boolean") {
    cleanUpdates.sidebarCollapsed = updates.sidebarCollapsed;
  }
  if (typeof updates.notificationsEnabled === "boolean") {
    cleanUpdates.notificationsEnabled = updates.notificationsEnabled;
  }
  if (typeof updates.language === "string") {
    cleanUpdates.language = updates.language.slice(0, 10);
  }

  try {
    const result = await (prisma as any).userPreference.upsert({
      where: { userId },
      update: cleanUpdates,
      create: {
        userId,
        theme: cleanUpdates.theme || DEFAULT_USER_PREFERENCES.theme,
        sidebarCollapsed: cleanUpdates.sidebarCollapsed ?? DEFAULT_USER_PREFERENCES.sidebarCollapsed,
        notificationsEnabled: cleanUpdates.notificationsEnabled ?? DEFAULT_USER_PREFERENCES.notificationsEnabled,
        language: cleanUpdates.language || DEFAULT_USER_PREFERENCES.language,
      },
    });

    return {
      theme: result.theme as "light" | "dark" | "system",
      sidebarCollapsed: Boolean(result.sidebarCollapsed),
      notificationsEnabled: Boolean(result.notificationsEnabled),
      language: result.language,
    };
  } catch (error) {
    console.error("[UserPreferenceService] Error al guardar preferencias en la BBDD:", error);
    throw error;
  }
}
