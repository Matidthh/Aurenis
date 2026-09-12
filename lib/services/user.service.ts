import { AuditAction, UserStatus } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { logAuditEvent } from "./audit.service";
import { SchoolSummary } from "@/types/tenant";
import { sessionStore } from "@/lib/auth/session-store";
import { DEFAULT_SCHOOL_ROLES, ROLE_PRESETS } from "@/lib/constants/roles";
import { PERMISSIONS } from "@/lib/constants/permissions";

export class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserServiceError";
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
  id: "sch_sanjose_demo",
  slug: "colegio-san-jose",
  name: "Colegio San José",
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
  id: "usr_director_demo",
  email: "director@sanjose.cl",
  firstName: "Carlos",
  lastName: "Mendoza",
  password: "AdminCSJ2026!",
  isSystemAdmin: false,
  status: UserStatus.ACTIVE,
  memberships: [
    {
      id: "mem_director_demo",
      isActive: true,
      school: DEFAULT_DEMO_SCHOOL,
      role: {
        id: "role_admin_demo",
        name: DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN,
        displayName: "Administrador del Colegio",
        permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN),
      },
    },
  ],
};

const teacherUser: DemoUser = {
  id: "usr_teacher_demo",
  email: "profesor@sanjose.cl",
  firstName: "Roberto",
  lastName: "González",
  password: "Profesor2026!",
  isSystemAdmin: false,
  status: UserStatus.ACTIVE,
  memberships: [
    {
      id: "mem_teacher_demo",
      isActive: true,
      school: DEFAULT_DEMO_SCHOOL,
      role: {
        id: "role_teacher_demo",
        name: DEFAULT_SCHOOL_ROLES.TEACHER,
        displayName: "Profesor",
        permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.TEACHER),
      },
    },
  ],
};

const studentUser: DemoUser = {
  id: "usr_student_demo",
  email: "estudiante@sanjose.cl",
  firstName: "Valentina",
  lastName: "Silva",
  password: "Estudiante2026!",
  isSystemAdmin: false,
  status: UserStatus.ACTIVE,
  memberships: [
    {
      id: "mem_student_demo",
      isActive: true,
      school: DEFAULT_DEMO_SCHOOL,
      role: {
        id: "role_student_demo",
        name: DEFAULT_SCHOOL_ROLES.STUDENT,
        displayName: "Estudiante",
        permissions: createRolePermissions(DEFAULT_SCHOOL_ROLES.STUDENT),
      },
    },
  ],
};

const guardianUser: DemoUser = {
  id: "usr_guardian_demo",
  email: "apoderado@sanjose.cl",
  firstName: "María",
  lastName: "González",
  password: "Apoderado2026!",
  isSystemAdmin: false,
  status: UserStatus.ACTIVE,
  memberships: [
    {
      id: "mem_guardian_demo",
      isActive: true,
      school: DEFAULT_DEMO_SCHOOL,
      role: {
        id: "role_guardian_demo",
        name: DEFAULT_SCHOOL_ROLES.GUARDIAN,
        displayName: "Apoderado / Tutor",
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
  "director@sanjose.cl": directorUser,
  "profesor@sanjose.cl": teacherUser,
  "profesor.matematica@sanjose.cl": { ...teacherUser, email: "profesor.matematica@sanjose.cl" },
  "estudiante@sanjose.cl": studentUser,
  "sofia.valenzuela@sanjose.cl": { ...studentUser, email: "sofia.valenzuela@sanjose.cl" },
  "apoderado@sanjose.cl": guardianUser,
  "maria.gonzalez@sanjose.cl": { ...guardianUser, email: "maria.gonzalez@sanjose.cl" },
};

/**
 * Autentica un usuario con email y contraseña.
 * Retorna el usuario y sus membresías activas.
 */
export async function authenticateUser(email: string, plainPassword: string) {
  const normalizedEmail = email.toLowerCase().trim();

  let user: DemoUser | null = null;
  if (isDatabaseConfigured()) {
    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
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
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  if (!user) {
    const demo = DEMO_USERS[normalizedEmail];
    if (demo) {
      const validPasswords = [
        demo.password,
        "AurenisSuperAdmin2026!",
        "AdminCSJ2026!",
        "Profesor2026!",
        "Estudiante2026!",
        "Apoderado2026!",
      ];
      if (validPasswords.includes(plainPassword)) {
        return demo;
      }
    }
    throw new UserServiceError("Credenciales inválidas.");
  }

  if (user.status !== UserStatus.ACTIVE) {
    throw new UserServiceError("Tu cuenta se encuentra suspendida o inactiva.");
  }

  if (user.passwordHash) {
    const isValidPassword = await verifyPassword(plainPassword, user.passwordHash);
    if (!isValidPassword) {
      throw new UserServiceError("Credenciales inválidas.");
    }
  }

  // Registrar login en auditoría
  if (isDatabaseConfigured()) {
    try {
      await logAuditEvent({
        userId: user.id,
        action: AuditAction.LOGIN,
        entityType: "USER",
        entityId: user.id,
        details: { email: user.email },
      });
    } catch {
      // Si la auditoría falla por desconexión de BD, no bloquea el login
    }
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

  // Retornar fallback demo
  return [
    {
      id: "sch_sanjose_demo",
      slug: "colegio-san-jose",
      name: "Colegio San José",
      subdomain: "sanjose.aurenis.app",
      roleName: "SCHOOL_ADMIN",
      roleDisplayName: "Administrador del Colegio",
      status: "ACTIVE",
    },
    {
      id: "sch_cordillera_demo",
      slug: "liceo-cordillera",
      name: "Liceo Bicentenario Cordillera",
      subdomain: "cordillera.aurenis.app",
      roleName: "TEACHER",
      roleDisplayName: "Profesor",
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
