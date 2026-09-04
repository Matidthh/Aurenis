import { AuditAction, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { logAuditEvent } from "./audit.service";
import { SchoolSummary } from "@/types/tenant";

export class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserServiceError";
  }
}

/**
 * Autentica un usuario con email y contraseña.
 * Retorna el usuario y sus membresías activas.
 */
export async function authenticateUser(email: string, plainPassword: string) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      memberships: {
        where: { isActive: true },
        include: {
          school: {
            include: { settings: true },
          },
          role: {
            include: {
              permissions: {
                include: { permission: true },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new UserServiceError("Credenciales inválidas.");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new UserServiceError("Tu cuenta se encuentra suspendida o inactiva.");
  }

  const isValidPassword = await verifyPassword(plainPassword, user.passwordHash);
  if (!isValidPassword) {
    throw new UserServiceError("Credenciales inválidas.");
  }

  // Registrar login en auditoría
  await logAuditEvent({
    userId: user.id,
    action: AuditAction.LOGIN,
    entityType: "USER",
    entityId: user.id,
    details: { email: user.email },
  });

  return user;
}

/**
 * Obtiene el resumen de instituciones a las que un usuario tiene acceso
 */
export async function getUserSchools(userId: string): Promise<SchoolSummary[]> {
  const memberships = await prisma.membership.findMany({
    where: {
      userId,
      isActive: true,
      school: {
        status: "ACTIVE",
      },
    },
    include: {
      school: true,
      role: true,
    },
  });

  return memberships.map((m) => ({
    id: m.school.id,
    slug: m.school.slug,
    name: m.school.name,
    logoUrl: m.school.logoUrl,
    roleName: m.role.name,
    roleDisplayName: m.role.displayName,
  }));
}
