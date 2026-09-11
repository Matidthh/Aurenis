import { AuditAction, SchoolStatus, UserStatus } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
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

/**
 * Obtener detalles institucionales por slug
 */
export async function getSchoolBySlug(slug: string) {
  return prisma.school.findUnique({
    where: { slug },
    include: {
      settings: true,
      _count: {
        select: {
          memberships: true,
          courses: true,
          subjects: true,
        },
      },
    },
  });
}

/**
 * Listado global de colegios para el System Admin
 */
export async function listAllSchools() {
  return prisma.school.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      settings: true,
      _count: {
        select: {
          memberships: true,
          courses: true,
        },
      },
    },
  });
}

/**
 * Actualizar configuración de la institución
 */
export async function updateSchoolSettings(
  schoolId: string,
  data: UpdateSchoolSettingsInput,
  userId?: string
) {
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
