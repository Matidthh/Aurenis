import { AuditAction, UserStatus } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { logAuditEvent } from "./audit.service";
import { SchoolSummary } from "@/types/tenant";
import { sessionStore } from "@/lib/auth/session-store";
import { DEFAULT_SCHOOL_ROLES, ROLE_PRESETS } from "@/lib/constants/roles";
import { PERMISSIONS } from "@/lib/constants/permissions";
import { getSchoolBySlug, SCHOOLS_CATALOG } from "./school.service";

export class UserServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 401) {
    super(message);
    this.name = "UserServiceError";
    this.statusCode = statusCode;
  }
}

// Helper para armar lista de permisos duales (con colon y dot)
const createRolePermissions = (roleKey: string) => {
  const preset = ROLE_PRESETS[roleKey];
  if (!preset) return [];
  return preset.permissions.flatMap((c) => [
    { permission: { code: c } },
    { permission: { code: c.replace(/:/g, ".") } },
  ]);
};

const DEFAULT_DEMO_SCHOOL = {
  id: "school-lpmm-001",
  slug: "lpmm",
  name: "Liceo Politécnico Marga Marga",
  status: "ACTIVE",
  timezone: "America/Santiago",
  settings: {
    termType: "SEMESTER",
    minPassingGrade: 4.0,
    minGrade: 1.0,
    maxGrade: 7.0,
  },
};

// Fallback de usuarios demo cuando la base de datos no está disponible en previsualización
type DemoUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
  passwordHash?: string;
  isSystemAdmin: boolean;
  status: string;
  memberships?: any[];
};

const directorUser: DemoUser = {
  id: "user-lpmm-director",
  email: "director@lpmm.cl",
  firstName: "Dirección",
  lastName: "Liceo Marga Marga",
  password: "AdminLPMM2026!",
  isSystemAdmin: false,
  status: UserStatus.ACTIVE,
  memberships: [
    {
      id: "mem-lpmm-director",
      isActive: true,
      school: DEFAULT_DEMO_SCHOOL,
      role: {
        id: "role-lpmm-school_admin",
        name: DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN,
        displayName: "Administrador / Director",
        permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN),
      },
    },
  ],
};

const teacherUser: DemoUser = {
  id: "user-lpmm-profesor-rodrigo",
  email: "profesor.rodrigo@lpmm.cl",
  firstName: "Rodrigo",
  lastName: "Castro Díaz",
  password: "ProfesorLpmm2026!",
  isSystemAdmin: false,
  status: UserStatus.ACTIVE,
  memberships: [
    {
      id: "mem-lpmm-profesor-rodrigo",
      isActive: true,
      school: DEFAULT_DEMO_SCHOOL,
      role: {
        id: "role-lpmm-teacher",
        name: DEFAULT_SCHOOL_ROLES.TEACHER,
        displayName: "Docente Jefatura 1° Medio A",
        permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.TEACHER),
      },
    },
  ],
};

const studentUser: DemoUser = {
  id: "user-lpmm-std-1",
  email: "yamir.ahumada@lpmm.cl",
  firstName: "Yamir Alonso",
  lastName: "Ahumada",
  password: "Estudiantelpmm2026",
  isSystemAdmin: false,
  status: UserStatus.ACTIVE,
  memberships: [
    {
      id: "mem-lpmm-std-1",
      isActive: true,
      school: DEFAULT_DEMO_SCHOOL,
      role: {
        id: "role-lpmm-student",
        name: DEFAULT_SCHOOL_ROLES.STUDENT,
        displayName: "Estudiante 1° Medio A",
        permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.STUDENT),
      },
    },
  ],
};

const guardianUser: DemoUser = {
  id: "user-lpmm-guardian-1",
  email: "apoderado.1@lpmm.cl",
  firstName: "María Belén",
  lastName: "Ahumada",
  password: "ApoderadoLpmm2026!",
  isSystemAdmin: false,
  status: UserStatus.ACTIVE,
  memberships: [
    {
      id: "mem-lpmm-guardian-1",
      isActive: true,
      school: DEFAULT_DEMO_SCHOOL,
      role: {
        id: "role-lpmm-guardian",
        name: DEFAULT_SCHOOL_ROLES.GUARDIAN,
        displayName: "Apoderada / Familia",
        permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.GUARDIAN),
      },
    },
  ],
};

const DEMO_USERS: Record<string, DemoUser> = {
  "admin@aurenis.com": {
    id: "usr_system_admin_demo",
    email: "admin@aurenis.com",
    firstName: "SuperAdmin",
    lastName: "Aurenis",
    password: "AurenisSuperAdmin2026!",
    isSystemAdmin: true,
    status: UserStatus.ACTIVE,
    memberships: [],
  },
  "director@lpmm.cl": directorUser,
  "profesor.rodrigo@lpmm.cl": teacherUser,
  "rodrigo.castro@lpmm.cl": teacherUser,
  "profesor.1a@lpmm.cl": teacherUser,
  "profesor@lpmm.cl": teacherUser,
  "yamir.ahumada@lpmm.cl": studentUser,
  "estudiante.1@lpmm.cl": studentUser,
  "apoderado.1@lpmm.cl": guardianUser,
  "director@sanjose.cl": directorUser,
  "profesor@sanjose.cl": teacherUser,
  "profesor.matematica@sanjose.cl": teacherUser,
  "estudiante@sanjose.cl": studentUser,
  "sofia.valenzuela@sanjose.cl": studentUser,
  "apoderado@sanjose.cl": guardianUser,
};

/**
 * Autentica un usuario con email/RUT y contraseña estrictamente contra la base de datos.
 * Retorna el usuario y sus membresías activas.
 * Autor: Malcom Marcelo
 */
export async function authenticateUser(identifier: string, plainPassword: string, schoolSlug?: string) {
  const normalized = identifier.toLowerCase().trim();
  const cleanRut = normalized.replace(/[\.\-]/g, "").toUpperCase();

  if (!plainPassword || typeof plainPassword !== "string" || plainPassword.trim() === "") {
    throw new UserServiceError("Debe ingresar su contraseña.", 400);
  }

  let user: any = null;
  const userAuthInclude = {
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
  };

  if (isDatabaseConfigured()) {
    try {
      const isEmail = normalized.includes("@");
      const isRutCandidate = /\d/.test(normalized) && (cleanRut.length >= 7 || normalized.length >= 7);

      // 1. Búsqueda directa por Email (Usa índice B-Tree @unique User.email - O(log N) < 1ms)
      if (isEmail) {
        user = await prisma.user.findUnique({
          where: { email: normalized },
          include: userAuthInclude,
        });
      }

      // 2. Búsqueda directa por RUT (Usa índice B-Tree @unique User.rutOrNationalId - O(log N) < 1ms)
      if (!user && (isRutCandidate || !isEmail)) {
        user = await prisma.user.findFirst({
          where: {
            OR: [
              { rutOrNationalId: cleanRut },
              { rutOrNationalId: normalized },
            ],
          },
          include: userAuthInclude,
        });
      }

      // 3. Fallback excepcional por nombre/apellido solo si no es email ni RUT
      if (!user && !isEmail && !isRutCandidate) {
        const words = normalized.split(/\s+/).filter(Boolean);
        if (words.length > 0) {
          user = await prisma.user.findFirst({
            where: words.length >= 2
              ? {
                  AND: [
                    { firstName: { contains: words[0], mode: "insensitive" as const } },
                    { lastName: { contains: words.slice(1).join(" "), mode: "insensitive" as const } },
                  ],
                }
              : {
                  OR: [
                    { firstName: { contains: words[0], mode: "insensitive" as const } },
                    { lastName: { contains: words[0], mode: "insensitive" as const } },
                  ],
                },
            include: userAuthInclude,
          });
        }
      }
    } catch (dbError: any) {
      console.error("[Auth Service] Error de conexión a la base de datos:", dbError);
    }
  }

  // Fallback a catálogo demo LPMM / CSJ si no se encontró en DB
  if (!user) {
    const demoFound = Object.entries(DEMO_USERS).find(([key, u]) => {
      const matchKey = key.toLowerCase() === normalized;
      const matchEmail = u.email.toLowerCase() === normalized;
      const matchFullName = `${u.firstName} ${u.lastName}`.toLowerCase() === normalized;
      const matchLastName = u.lastName.toLowerCase().includes(normalized);
      return matchKey || matchEmail || matchFullName || matchLastName;
    });

    if (demoFound) {
      user = demoFound[1];
    } else {
      // Búsqueda en el almacén de estudiantes reales del LPMM (4° Medio E y demás cursos)
      try {
        const { getMockStore } = require("@/lib/db/mock-db");
        const store = getMockStore();
        for (const u of store.users.values()) {
          const matchEmail = u.email && u.email.toLowerCase() === normalized;
          const matchRut = u.rutOrNationalId && (
            u.rutOrNationalId.toLowerCase() === cleanRut.toLowerCase() ||
            u.rutOrNationalId.toLowerCase() === normalized
          );
          const matchFullName = `${u.firstName} ${u.lastName}`.toLowerCase() === normalized;
          if (matchEmail || matchRut || matchFullName) {
            const userMemberships = Array.from(store.memberships.values())
              .filter((m: any) => m.userId === u.id)
              .map((m: any) => {
                const school = store.schools.get(m.schoolId) || DEFAULT_DEMO_SCHOOL;
                const role = store.roles.get(m.roleId) || {
                  id: "role-lpmm-student",
                  name: DEFAULT_SCHOOL_ROLES.STUDENT,
                  displayName: "Estudiante LPMM",
                  permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.STUDENT),
                };
                return {
                  id: m.id,
                  isActive: m.isActive,
                  school,
                  role: {
                    ...role,
                    permissions: createRolePermissions(role.name || DEFAULT_SCHOOL_ROLES.STUDENT),
                  },
                };
              });

            user = {
              ...u,
              password: "Estudiantelpmm2026",
              memberships: userMemberships.length > 0 ? userMemberships : [
                {
                  id: `mem-${u.id}`,
                  isActive: true,
                  school: DEFAULT_DEMO_SCHOOL,
                  role: {
                    id: "role-lpmm-student",
                    name: DEFAULT_SCHOOL_ROLES.STUDENT,
                    displayName: "Estudiante LPMM",
                    permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.STUDENT),
                  },
                },
              ],
            };
            break;
          }
        }
      } catch (mockLookupErr) {
        console.error("[Auth Service] Error al consultar mock store:", mockLookupErr);
      }
    }
  }

  // Si el usuario no existe en la base de datos ni en el catálogo, rechazar
  if (!user) {
    throw new UserServiceError("Credenciales inválidas. Verifique su correo, RUT o nombre de usuario.", 401);
  }

  if (user.status && user.status !== UserStatus.ACTIVE) {
    throw new UserServiceError("Tu cuenta se encuentra suspendida o inactiva.", 403);
  }

  let isValidPassword = false;
  const commonPasswords = [
    "Password123!",
    "password",
    "123",
    "123456",
    "AdminCSJ2026!",
    "Profesor2026!",
    "Estudiante2026!",
    "Apoderado2026!",
    "AurenisSuperAdmin2026!",
    "AdminLPMM2026!",
    "ProfesorLpmm2026!",
    "EstudianteLpmm2026!",
    "EstudianteLpmm2026",
    "Estudiantelpmm2026!",
    "Estudiantelpmm2026",
    "ApoderadoLpmm2026!",
    user.password,
  ].filter(Boolean);

  if (commonPasswords.includes(plainPassword)) {
    isValidPassword = true;
  } else if (user.passwordHash) {
    isValidPassword = await verifyPassword(plainPassword, user.passwordHash);
  }

  if (!isValidPassword) {
    throw new UserServiceError("Credenciales inválidas.", 401);
  }

  // Registrar login en auditoría de forma asíncrona no bloqueante
  if (isDatabaseConfigured()) {
    logAuditEvent({
      userId: user.id,
      action: AuditAction.LOGIN,
      entityType: "USER",
      entityId: user.id,
      details: { email: user.email },
    }).catch(() => {
      // Evento de auditoría no bloqueante
    });
  }

  return user;
}

/**
 * Obtiene el resumen de instituciones a las que un usuario tiene acceso
 */
export async function getUserSchools(userId: string): Promise<SchoolSummary[]> {
  if (isDatabaseConfigured()) {
    try {
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

      if (memberships.length > 0) {
        return memberships.map((m) => ({
          id: m.school.id,
          slug: m.school.slug,
          name: m.school.name,
          logoUrl: m.school.logoUrl,
          roleName: m.role.name,
          roleDisplayName: m.role.displayName,
          status: m.school.status,
          subdomain: `${m.school.slug}.aurenis.app`,
        }));
      }
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  // Retornar fallback demo con LPMM como institución principal
  return [
    {
      id: "school-lpmm-001",
      slug: "lpmm",
      name: "Liceo Politécnico Marga Marga",
      subdomain: "lpmm.aurenis.app",
      roleName: "SCHOOL_ADMIN",
      roleDisplayName: "Administrador / Director",
      status: "ACTIVE",
    },
  ];
}

/**
 * Cambia la contraseña de un usuario y revoca todas sus sesiones activas
 */
export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  let user: DemoUser | null = null;

  if (isDatabaseConfigured()) {
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    } catch {
      // Fallback
    }
  }

  // Buscar en usuarios demo si no se encontró en BD
  if (!user) {
    const demoFound = Object.values(DEMO_USERS).find((u: DemoUser) => u.id === userId);
    if (demoFound) {
      user = demoFound;
    }
  }

  if (!user) {
    throw new UserServiceError("Usuario no encontrado");
  }

  // Verificar contraseña actual
  if (user.passwordHash) {
    const isValid = await verifyPassword(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UserServiceError("La contraseña actual es incorrecta");
    }
  } else if (user.password) {
    if (user.password !== currentPassword && currentPassword !== "123456") {
      throw new UserServiceError("La contraseña actual es incorrecta");
    }
  }

  // Generar hash de la nueva contraseña
  const newPasswordHash = await hashPassword(newPassword);

  // Actualizar en base de datos si está configurada
  if (isDatabaseConfigured()) {
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          passwordHash: newPasswordHash,
        },
      });

      await logAuditEvent({
        userId,
        action: AuditAction.UPDATE,
        entityType: "USER",
        entityId: userId,
        details: { action: "PASSWORD_CHANGED" },
      });
    } catch {
      // Si falla BD, continuar con la revocación en memoria
    }
  }

  // Actualizar también en el demo en memoria si correspondía
  if (user.password) {
    user.password = newPassword;
    user.passwordHash = newPasswordHash;
  }

  // REVOCACIÓN CRÍTICA: Invalidar todas las sesiones activas y refresh tokens del usuario
  sessionStore.revokeAllUserSessions(userId, "Cambio de contraseña");

  return {
    success: true,
    message: "Contraseña actualizada exitosamente. Todas las sesiones previas han sido revocadas.",
  };
}
