import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { TenantContext } from "@/types/tenant";

export class UnauthorizedError extends Error {
  constructor(message = "No estás autenticado.") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class TenantAccessError extends Error {
  constructor(message = "No tienes acceso a esta institución.") {
    super(message);
    this.name = "TenantAccessError";
  }
}

/**
 * Obtiene y valida el TenantContext de la institución actual.
 * Si el usuario no tiene acceso o no está autenticado, maneja la redirección o error.
 */
export async function requireTenantContext(schoolSlug: string): Promise<TenantContext> {
  const session = await getSession();

  if (!session) {
    redirect(`/login?returnUrl=/${encodeURIComponent(schoolSlug)}`);
  }

  // Si el usuario es SystemAdmin, tiene acceso irrestricto de inspección
  if (session.isSystemAdmin) {
    const school = await prisma.school.findUnique({
      where: { slug: schoolSlug },
      include: { settings: true },
    });

    if (!school) {
      redirect("/system/schools");
    }

    return {
      schoolId: school.id,
      schoolSlug: school.slug,
      schoolName: school.name,
      userId: session.userId,
      membershipId: "system-admin-bypass",
      roleName: "SYSTEM_ADMIN",
      permissions: ["*"], // Todos los permisos
      timezone: school.timezone,
    };
  }

  // Buscar la institución por slug
  const school = await prisma.school.findUnique({
    where: { slug: schoolSlug },
    include: {
      settings: true,
      memberships: {
        where: {
          userId: session.userId,
          isActive: true,
        },
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!school) {
    throw new TenantAccessError(`La institución '${schoolSlug}' no existe.`);
  }

  const membership = school.memberships[0];
  if (!membership) {
    // El usuario está logueado pero no tiene membresía en este colegio
    redirect("/select-school");
  }

  const permissions = membership.role.permissions.map((rp) => rp.permission.code);

  return {
    schoolId: school.id,
    schoolSlug: school.slug,
    schoolName: school.name,
    userId: session.userId,
    membershipId: membership.id,
    roleName: membership.role.name,
    permissions,
    timezone: school.timezone,
  };
}
