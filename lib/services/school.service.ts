import { AuditAction, SchoolStatus, UserStatus } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { SELECT_SCHOOL_SUMMARY } from "@/lib/db/query-projections";
import { hashPassword } from "@/lib/auth/password";
import { logAuditEvent } from "./audit.service";
import { DEFAULT_SCHOOL_ROLES, ROLE_PRESETS } from "@/lib/constants/roles";
import { CreateSchoolInput, UpdateSchoolSettingsInput } from "@/lib/validations/school.schema";

export class SchoolServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchoolServiceError";
  }
}

/**
 * Onboarding completo de una institución educativa en Aurenis.
 * Ejecuta una transacción ACID que inicializa la escuela, su configuración,
 * roles predeterminados con permisos, y crea al administrador escolar inicial.
 */
export async function createSchoolWithOnboarding(
  input: CreateSchoolInput,
  creatorUserId?: string
) {
  // 1. Validar que el slug no esté en uso
  const existingSchool = await prisma.school.findUnique({
    where: { slug: input.slug },
  });

  if (existingSchool) {
    throw new SchoolServiceError(`El identificador de URL (slug) '${input.slug}' ya está registrado.`);
  }

  // 2. Obtener el catálogo de permisos disponibles en la plataforma
  const systemPermissions = await prisma.permission.findMany();
  const permCodeToId = new Map(systemPermissions.map((p) => [p.code, p.id]));

  // 3. Ejecutar transacción de onboarding
  const result = await prisma.$transaction(async (tx) => {
    // A. Crear la entidad School
    const school = await tx.school.create({
      data: {
        name: input.name,
        slug: input.slug,
        institutionalCode: input.institutionalCode || null,
        city: input.city,
        country: input.country,
        timezone: input.timezone,
        status: SchoolStatus.ACTIVE,
        settings: {
          create: {
            termType: input.termType,
            minPassingGrade: 4.0,
            minGrade: 1.0,
            maxGrade: 7.0,
            gradeScalePrecision: 1,
            primaryColor: "#0284c7",
          },
        },
      },
      include: {
        settings: true,
      },
    });

    // B. Crear roles institucionales base a partir de los presets
    const createdRoles: Record<string, string> = {};

    for (const [key, preset] of Object.entries(ROLE_PRESETS)) {
      const role = await tx.role.create({
        data: {
          schoolId: school.id,
          name: preset.name,
          displayName: preset.displayName,
          description: preset.description,
          isSystem: true,
        },
      });

      createdRoles[preset.name] = role.id;

      // Asociar permisos al rol
      const rolePermissionData = preset.permissions
        .map((code) => {
          const permId = permCodeToId.get(code);
          return permId ? { roleId: role.id, permissionId: permId } : null;
        })
        .filter(Boolean) as { roleId: string; permissionId: string }[];

      if (rolePermissionData.length > 0) {
        await tx.rolePermission.createMany({
          data: rolePermissionData,
        });
      }
    }

    // C. Crear o vincular el usuario Administrador del Colegio
    const hashedPassword = await hashPassword(input.adminPassword);
    const adminUser = await tx.user.upsert({
      where: { email: input.adminEmail },
      update: {
        firstName: input.adminFirstName,
        lastName: input.adminLastName,
      },
      create: {
        email: input.adminEmail,
        firstName: input.adminFirstName,
        lastName: input.adminLastName,
        rutOrNationalId: input.adminRut || null,
        passwordHash: hashedPassword,
        status: UserStatus.ACTIVE,
      },
    });

    // D. Crear membresía del Administrador en el Colegio con rol SCHOOL_ADMIN
    const adminRoleId = createdRoles[DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN];
    const membership = await tx.membership.create({
      data: {
        userId: adminUser.id,
        schoolId: school.id,
        roleId: adminRoleId,
        isActive: true,
      },
    });

    return {
      school,
      adminUser,
      membership,
    };
  });

  // 4. Registrar auditoría
  await logAuditEvent({
    schoolId: result.school.id,
    userId: creatorUserId || null,
    action: AuditAction.CREATE,
    entityType: "SCHOOL",
    entityId: result.school.id,
    details: {
      name: result.school.name,
      slug: result.school.slug,
      adminEmail: result.adminUser.email,
    },
  });

  return result;
}

export interface SchoolDataWithSubscription {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  customDomain?: string | null;
  institutionalCode: string;
  city: string;
  country: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  subscription: {
    plan: "BASIC" | "PRO" | "ENTERPRISE";
    status: "ACTIVE" | "TRIAL" | "SUSPENDED_PAYMENT" | "EXPIRED" | "CANCELLED";
    maxStudents: number;
    currentStudents: number;
    monthlyFeeClp: number;
    billingCycle: "MONTHLY" | "ANNUAL";
    renewalDate: string;
    isPaymentUpToDate: boolean;
    lastPaymentDate: string;
  };
  settings: {
    termType: "SEMESTER" | "TRIMESTER";
    minPassingGrade: number;
    minGrade: number;
    maxGrade: number;
    primaryColor: string;
    gradeScalePrecision?: number;
  };
  _count: {
    memberships: number;
    courses: number;
    subjects: number;
  };
}

// Catálogo enriquecido de instituciones con gestión de suscripciones SaaS
export const SCHOOLS_CATALOG: SchoolDataWithSubscription[] = [
  {
    id: "sch_sanjose_demo",
    name: "Colegio San José",
    slug: "colegio-san-jose",
    subdomain: "sanjose.aurenis.app",
    customDomain: "portal.sanjose.cl",
    institutionalCode: "CSJ-001",
    city: "Santiago",
    country: "Chile",
    status: "ACTIVE",
    subscription: {
      plan: "ENTERPRISE",
      status: "ACTIVE",
      maxStudents: 1500,
      currentStudents: 145,
      monthlyFeeClp: 450000,
      billingCycle: "ANNUAL",
      renewalDate: "2027-03-01",
      isPaymentUpToDate: true,
      lastPaymentDate: "2026-03-01",
    },
    settings: {
      termType: "SEMESTER",
      minPassingGrade: 4.0,
      minGrade: 1.0,
      maxGrade: 7.0,
      primaryColor: "#0284c7",
      gradeScalePrecision: 1,
    },
    _count: {
      memberships: 14,
      courses: 8,
      subjects: 24,
    },
  },
  {
    id: "sch_cordillera_demo",
    name: "Liceo Bicentenario Cordillera",
    slug: "liceo-cordillera",
    subdomain: "cordillera.aurenis.app",
    customDomain: null,
    institutionalCode: "LBC-042",
    city: "San Bernardo",
    country: "Chile",
    status: "ACTIVE",
    subscription: {
      plan: "PRO",
      status: "ACTIVE",
      maxStudents: 800,
      currentStudents: 780,
      monthlyFeeClp: 280000,
      billingCycle: "MONTHLY",
      renewalDate: "2026-10-05",
      isPaymentUpToDate: true,
      lastPaymentDate: "2026-09-05",
    },
    settings: {
      termType: "SEMESTER",
      minPassingGrade: 4.0,
      minGrade: 1.0,
      maxGrade: 7.0,
      primaryColor: "#4f46e5",
      gradeScalePrecision: 1,
    },
    _count: {
      memberships: 28,
      courses: 14,
      subjects: 32,
    },
  },
  {
    id: "sch_santa_maria_demo",
    name: "Instituto Santa María",
    slug: "instituto-santa-maria",
    subdomain: "santamaria.aurenis.app",
    customDomain: null,
    institutionalCode: "ISM-002",
    city: "Viña del Mar",
    country: "Chile",
    status: "ACTIVE",
    subscription: {
      plan: "BASIC",
      status: "ACTIVE",
      maxStudents: 300,
      currentStudents: 290,
      monthlyFeeClp: 140000,
      billingCycle: "MONTHLY",
      renewalDate: "2026-09-30",
      isPaymentUpToDate: true,
      lastPaymentDate: "2026-08-30",
    },
    settings: {
      termType: "TRIMESTER",
      minPassingGrade: 4.0,
      minGrade: 1.0,
      maxGrade: 7.0,
      primaryColor: "#059669",
      gradeScalePrecision: 1,
    },
    _count: {
      memberships: 12,
      courses: 6,
      subjects: 18,
    },
  },
  {
    id: "sch_los_robles_demo",
    name: "Colegio Los Robles",
    slug: "colegio-los-robles",
    subdomain: "losrobles.aurenis.app",
    customDomain: null,
    institutionalCode: "CLR-099",
    city: "Concepción",
    country: "Chile",
    status: "SUSPENDED",
    subscription: {
      plan: "PRO",
      status: "SUSPENDED_PAYMENT",
      maxStudents: 800,
      currentStudents: 520,
      monthlyFeeClp: 280000,
      billingCycle: "MONTHLY",
      renewalDate: "2026-08-15",
      isPaymentUpToDate: false,
      lastPaymentDate: "2026-07-15",
    },
    settings: {
      termType: "SEMESTER",
      minPassingGrade: 4.0,
      minGrade: 1.0,
      maxGrade: 7.0,
      primaryColor: "#d97706",
      gradeScalePrecision: 1,
    },
    _count: {
      memberships: 16,
      courses: 10,
      subjects: 22,
    },
  },
];

/**
 * Obtener detalles institucionales por slug o subdominio
 */
export async function getSchoolBySlug(slugOrSubdomain: string) {
  // Limpiar slug o subdominio (ej: cordillera.aurenis.app -> cordillera o liceo-cordillera)
  const cleanKey = slugOrSubdomain.toLowerCase().replace(".aurenis.app", "").replace(".aurenis.com", "");

  if (isDatabaseConfigured()) {
    try {
      const school = await prisma.school.findFirst({
        where: {
          OR: [{ slug: cleanKey }, { slug: slugOrSubdomain }],
        },
        select: SELECT_SCHOOL_SUMMARY,
      });
      if (school) return school as unknown as SchoolDataWithSubscription;
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  const found = SCHOOLS_CATALOG.find(
    (s) =>
      s.slug === cleanKey ||
      s.slug === slugOrSubdomain ||
      s.subdomain.startsWith(cleanKey) ||
      s.id === slugOrSubdomain
  );

  return found || null;
}

/**
 * Listado global de colegios para el System Admin con datos de suscripción
 */
export async function listAllSchools(): Promise<SchoolDataWithSubscription[]> {
  if (isDatabaseConfigured()) {
    try {
      const schools = await prisma.school.findMany({
        orderBy: { createdAt: "desc" },
        select: SELECT_SCHOOL_SUMMARY,
      });
      if (schools.length > 0) return schools as unknown as SchoolDataWithSubscription[];
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  return SCHOOLS_CATALOG;
}

/**
 * Cambiar estado de suscripción (ej: Suspender por no pago o Reactivar)
 */
export async function toggleSchoolSubscription(
  schoolId: string,
  newStatus: "ACTIVE" | "SUSPENDED" | "INACTIVE"
) {
  const school = SCHOOLS_CATALOG.find((s) => s.id === schoolId || s.slug === schoolId);
  if (school) {
    school.status = newStatus;
    school.subscription.status = newStatus === "ACTIVE" ? "ACTIVE" : "SUSPENDED_PAYMENT";
    school.subscription.isPaymentUpToDate = newStatus === "ACTIVE";
    return school;
  }
  return null;
}

/**
 * Actualizar configuración de la institución
 */
export async function updateSchoolSettings(
  schoolId: string,
  data: UpdateSchoolSettingsInput,
  userId?: string
) {
  const current = await prisma.schoolSettings.findUnique({
    where: { schoolId },
  });

  const targetMin = data.minGrade !== undefined ? data.minGrade : Number(current?.minGrade ?? 1.0);
  const targetMax = data.maxGrade !== undefined ? data.maxGrade : Number(current?.maxGrade ?? 7.0);
  const targetPass = data.minPassingGrade !== undefined ? data.minPassingGrade : Number(current?.minPassingGrade ?? 4.0);

  if (targetMin >= targetMax) {
    throw new SchoolServiceError("La nota mínima debe ser estrictamente menor que la nota máxima.");
  }
  if (targetPass < targetMin || targetPass > targetMax) {
    throw new SchoolServiceError("La nota de aprobación debe estar dentro del rango permitido entre nota mínima y máxima.");
  }

  const updatedSettings = await prisma.schoolSettings.update({
    where: { schoolId },
    data: {
      ...(data.termType && { termType: data.termType }),
      ...(data.minPassingGrade !== undefined && { minPassingGrade: data.minPassingGrade }),
      ...(data.minGrade !== undefined && { minGrade: data.minGrade }),
      ...(data.maxGrade !== undefined && { maxGrade: data.maxGrade }),
      ...(data.gradeScalePrecision !== undefined && { gradeScalePrecision: data.gradeScalePrecision }),
      ...(data.primaryColor && { primaryColor: data.primaryColor }),
      ...(data.requireAttendanceNote !== undefined && { requireAttendanceNote: data.requireAttendanceNote }),
    },
  });

  await logAuditEvent({
    schoolId,
    userId: userId || null,
    action: AuditAction.UPDATE,
    entityType: "SCHOOL_SETTINGS",
    entityId: updatedSettings.id,
    details: data as Record<string, unknown>,
  });

  return updatedSettings;
}

