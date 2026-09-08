import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { ForbiddenError, UnauthorizedError } from "@/lib/middleware/error-handler";
import { prisma } from "@/lib/db/prisma";
import { PERMISSIONS } from "@/lib/constants/permissions";

export interface AuthContext {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  isSystemAdmin: boolean;
  activeSchoolId?: string;
  activeSchoolSlug?: string;
  activeMembershipId?: string;
  roleName?: string;
  permissions: string[];
}

export interface SchoolAuthContext extends AuthContext {
  schoolId: string;
  schoolSlug: string;
  membershipId: string;
}

/**
 * Middleware para verificar autenticación en rutas de API
 */
export async function requireAuth(req: NextRequest): Promise<AuthContext> {
  const session = await getSession();
  
  if (!session) {
    throw new UnauthorizedError("No autenticado");
  }

  return {
    userId: session.userId,
    email: session.email,
    firstName: session.firstName,
    lastName: session.lastName,
    isSystemAdmin: session.isSystemAdmin,
    activeSchoolId: session.activeSchoolId,
    activeSchoolSlug: session.activeSchoolSlug,
    activeMembershipId: session.activeMembershipId,
    roleName: session.roleName,
    permissions: session.permissions,
  };
}

/**
 * Middleware para verificar que el usuario tiene permisos específicos
 */
export function requirePermissions(requiredPermissions: string[]) {
  return async (req: NextRequest): Promise<AuthContext> => {
    const context = await requireAuth(req);
    
    // System admins tienen todos los permisos
    if (context.isSystemAdmin) {
      return context;
    }

    const hasAllPermissions = requiredPermissions.every(perm => 
      context.permissions.includes(perm) || context.permissions.includes("*")
    );

    if (!hasAllPermissions) {
      throw new ForbiddenError(
        `Permisos requeridos: ${requiredPermissions.join(", ")}`
      );
    }

    return context;
  };
}

/**
 * Middleware para verificar acceso a una escuela específica
 */
export async function requireSchoolAccess(
  req: NextRequest,
  schoolId: string
): Promise<SchoolAuthContext> {
  const context = await requireAuth(req);

  // System admins tienen acceso a todas las escuelas
  if (context.isSystemAdmin) {
    if (!context.activeSchoolId) {
      // System admin sin contexto escolar
      const school = await prisma.school.findUnique({
        where: { id: schoolId },
      });
      
      if (!school) {
        throw new ForbiddenError("Escuela no encontrada");
      }

      return {
        ...context,
        schoolId: school.id,
        schoolSlug: school.slug,
        membershipId: "", // System admin no tiene membership
      };
    }
  }

  // Verificar que el usuario tiene membresía activa en esta escuela
  if (context.activeSchoolId !== schoolId) {
    // Verificar si tiene alguna membresía en esta escuela
    const membership = await prisma.membership.findFirst({
      where: {
        userId: context.userId,
        schoolId: schoolId,
        isActive: true,
      },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });

    if (!membership) {
      throw new ForbiddenError("No tienes acceso a esta institución");
    }

    // Actualizar contexto con permisos de esta escuela
    const permissions = membership.role.permissions.map(rp => rp.permission.code);

    return {
      ...context,
      schoolId: membership.schoolId,
      schoolSlug: "", // Se puede cargar si es necesario
      membershipId: membership.id,
      roleName: membership.role.name,
      permissions,
    };
  }

  // Ya tiene el contexto correcto
  return {
    ...context,
    schoolId: context.activeSchoolId!,
    schoolSlug: context.activeSchoolSlug!,
    membershipId: context.activeMembershipId!,
  };
}

/**
 * Middleware para verificar permisos específicos en una escuela
 */
export function requireSchoolPermissions(
  schoolId: string,
  requiredPermissions: string[]
) {
  return async (req: NextRequest): Promise<SchoolAuthContext> => {
    const context = await requireSchoolAccess(req, schoolId);

    // System admins tienen todos los permisos
    if (context.isSystemAdmin) {
      return context;
    }

    const hasAllPermissions = requiredPermissions.every(perm => 
      context.permissions.includes(perm) || context.permissions.includes("*")
    );

    if (!hasAllPermissions) {
      throw new ForbiddenError(
        `Permisos requeridos: ${requiredPermissions.join(", ")}`
      );
    }

    return context;
  };
}

/**
 * Helper para crear respuestas de error de autorización consistentes
 */
export function createAuthErrorResponse(error: Error) {
  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      { error: error.message },
      { status: 403 }
    );
  }

  return NextResponse.json(
    { error: "Error de autorización" },
    { status: 401 }
  );
}

/**
 * Wrapper para handlers de API con autenticación
 */
export function withAuth(handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    try {
      const context = await requireAuth(req);
      return await handler(req, context);
    } catch (error: any) {
      return createAuthErrorResponse(error);
    }
  };
}

/**
 * Wrapper para handlers de API con permisos específicos
 */
export function withPermissions(requiredPermissions: string[]) {
  return (handler: (req: NextRequest, context: AuthContext) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      try {
        const context = await requirePermissions(requiredPermissions)(req);
        return await handler(req, context);
      } catch (error: any) {
        return createAuthErrorResponse(error);
      }
    };
  };
}

/**
 * Wrapper para handlers de API con acceso a escuela específica
 */
export function withSchoolAccess(schoolId: string) {
  return (handler: (req: NextRequest, context: SchoolAuthContext) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      try {
        const context = await requireSchoolAccess(req, schoolId);
        return await handler(req, context);
      } catch (error: any) {
        return createAuthErrorResponse(error);
      }
    };
  };
}

/**
 * Wrapper para handlers de API con permisos en escuela específica
 */
export function withSchoolPermissions(schoolId: string, requiredPermissions: string[]) {
  return (handler: (req: NextRequest, context: SchoolAuthContext) => Promise<NextResponse>) => {
    return async (req: NextRequest) => {
      try {
        const context = await requireSchoolPermissions(schoolId, requiredPermissions)(req);
        return await handler(req, context);
      } catch (error: any) {
        return createAuthErrorResponse(error);
      }
    };
  };
}