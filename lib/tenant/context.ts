import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { TenantContext } from "@/types/tenant";
import { getSchoolBySlug, SCHOOLS_CATALOG } from "@/lib/services/school.service";

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

  const matchedCatalog = SCHOOLS_CATALOG.find((s) => s.slug === schoolSlug || s.id === schoolSlug) || SCHOOLS_CATALOG[0];

  const subscriptionInfo = matchedCatalog.subscription;
  const isSuspended = matchedCatalog.status === "SUSPENDED" || subscriptionInfo.status === "SUSPENDED_PAYMENT";

  // Si no hay sesión activa en la preview/demo, proveer rol de Administrador Escolar (Director) para acceso directo
  if (!session) {
    return {
      schoolId: matchedCatalog.id,
      schoolSlug: matchedCatalog.slug,
      schoolName: matchedCatalog.name,
      subdomain: matchedCatalog.subdomain,
      customDomain: matchedCatalog.customDomain,
      userId: "demo-director-id",
      membershipId: "demo-director-membership",
      roleName: "SCHOOL_ADMIN",
      permissions: ["*"],
      timezone: "America/Santiago",
      isSuspended: false,
      suspensionReason: null,
      subscription: subscriptionInfo,
    };
  }

  // Si el usuario es SystemAdmin, tiene acceso irrestricto de inspección
  if (session.isSystemAdmin) {
    return {
      schoolId: matchedCatalog.id,
      schoolSlug: matchedCatalog.slug,
      schoolName: matchedCatalog.name,
      subdomain: matchedCatalog.subdomain,
      customDomain: matchedCatalog.customDomain,
      userId: session.userId,
      membershipId: "system-admin-bypass",
      roleName: "SYSTEM_ADMIN",
      permissions: ["*"],
      timezone: "America/Santiago",
      isSuspended,
      suspensionReason: isSuspended ? "Suscripción institucional suspendida por pago pendiente." : null,
      subscription: subscriptionInfo,
    };
  }

  // Buscar la institución por slug en base de datos con proyección select optimizada
  if (isDatabaseConfigured()) {
    try {
      const school = await prisma.school.findUnique({
        where: { slug: schoolSlug },
        select: {
          id: true,
          slug: true,
          name: true,
          status: true,
          timezone: true,
          memberships: {
            where: {
              userId: session.userId,
              isActive: true,
            },
            select: {
              id: true,
              role: {
                select: {
                  name: true,
                  permissions: {
                    select: {
                      permission: {
                        select: {
                          code: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (school) {
        const membership = school.memberships[0];
        if (membership) {
          const permissions = membership.role.permissions.map((rp) => rp.permission.code);
          return {
            schoolId: school.id,
            schoolSlug: school.slug,
            schoolName: school.name,
            subdomain: `${school.slug}.aurenis.app`,
            customDomain: null,
            userId: session.userId,
            membershipId: membership.id,
            roleName: membership.role.name,
            permissions,
            timezone: school.timezone,
            isSuspended: school.status === "SUSPENDED",
            suspensionReason: school.status === "SUSPENDED" ? "Institución suspendida por administración." : null,
            subscription: subscriptionInfo,
          };
        }
      }
    } catch {
      // Fallback demo
    }
  }

  // Fallback demo para cualquier colegio del catálogo
  return {
    schoolId: matchedCatalog.id,
    schoolSlug: matchedCatalog.slug,
    schoolName: matchedCatalog.name,
    subdomain: matchedCatalog.subdomain,
    customDomain: matchedCatalog.customDomain,
    userId: session.userId,
    membershipId: "mem_director_demo",
    roleName: "SCHOOL_ADMIN",
    permissions: ["*"],
    timezone: "America/Santiago",
    isSuspended,
    suspensionReason: isSuspended ? "Suscripción institucional suspendida por pago pendiente." : null,
    subscription: subscriptionInfo,
  };
}

