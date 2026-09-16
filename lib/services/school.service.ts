import { AuditAction, SchoolStatus, UserStatus } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { SELECT_SCHOOL_SUMMARY } from "@/lib/db/query-projections";
import { hashPassword } from "@/lib/auth/password";
import { logAuditEvent } from "./audit.service";
import { DEFAULT_SCHOOL_ROLES, ROLE_PRESETS } from "@/lib/constants/roles";
import {
  CreateSchoolInput,
  UpdateSchoolSettingsInput,
  CreateAcademicPeriodInput,
  UpdateAcademicPeriodInput,
} from "@/lib/validations/school.schema";

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
  address?: string;
  city: string;
  country: string;
  timezone?: string;
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
    termType: "SEMESTER" | "TRIMESTER" | "ANNUAL";
    minPassingGrade: number;
    minGrade: number;
    maxGrade: number;
    primaryColor: string;
    gradeScalePrecision?: number;
    requireAttendanceNote?: boolean;
    minAttendancePercentage?: number;
    defaultAssessmentWeight?: number;
  };
  customConfig?: {
    contactEmail?: string;
    contactPhone?: string;
    motto?: string;
    minAttendancePercentage?: number;
    defaultAssessmentWeight?: number;
    periodWeights?: Record<string, number>;
  };
  academicPeriods?: Array<{
    id: string;
    name: string;
    year: number;
    startDate: string;
    endDate: string;
    isCurrent: boolean;
    isClosed: boolean;
    weightPercentage?: number;
    assessmentsCount?: number;
  }>;
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
 * Actualizar configuración de la institución y datos institucionales
 */
export async function updateSchoolSettings(
  schoolId: string,
  data: UpdateSchoolSettingsInput,
  userId?: string
) {
  try {
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
      include: { settings: true },
    });

    if (school) {
      const current = school.settings;
      const targetMin = data.minGrade !== undefined ? data.minGrade : Number(current?.minGrade ?? 1.0);
      const targetMax = data.maxGrade !== undefined ? data.maxGrade : Number(current?.maxGrade ?? 7.0);
      const targetPass = data.minPassingGrade !== undefined ? data.minPassingGrade : Number(current?.minPassingGrade ?? 4.0);

      if (targetMin >= targetMax) {
        throw new SchoolServiceError("La nota mínima debe ser estrictamente menor que la nota máxima.");
      }
      if (targetPass < targetMin || targetPass > targetMax) {
        throw new SchoolServiceError("La nota de aprobación debe estar dentro del rango permitido entre nota mínima y máxima.");
      }

      // Actualizar campos institucionales de School si están presentes
      const schoolUpdateData: Record<string, any> = {};
      if (data.name) schoolUpdateData.name = data.name;
      if (data.institutionalCode !== undefined) schoolUpdateData.institutionalCode = data.institutionalCode || null;
      if (data.address !== undefined) schoolUpdateData.address = data.address || null;
      if (data.city) schoolUpdateData.city = data.city;
      if (data.country) schoolUpdateData.country = data.country;
      if (data.timezone) schoolUpdateData.timezone = data.timezone;

      if (Object.keys(schoolUpdateData).length > 0) {
        await prisma.school.update({
          where: { id: school.id },
          data: schoolUpdateData,
        });
      }

      // Preparar customConfig para atributos adicionales
      const currentCustomConfig = (current?.customConfig as Record<string, any>) || {};
      const updatedCustomConfig = {
        ...currentCustomConfig,
        ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
        ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone }),
        ...(data.motto !== undefined && { motto: data.motto }),
        ...(data.minAttendancePercentage !== undefined && { minAttendancePercentage: data.minAttendancePercentage }),
        ...(data.defaultAssessmentWeight !== undefined && { defaultAssessmentWeight: data.defaultAssessmentWeight }),
      };

      const updatedSettings = await prisma.schoolSettings.upsert({
        where: { schoolId: school.id },
        update: {
          ...(data.termType && { termType: data.termType }),
          ...(data.minPassingGrade !== undefined && { minPassingGrade: data.minPassingGrade }),
          ...(data.minGrade !== undefined && { minGrade: data.minGrade }),
          ...(data.maxGrade !== undefined && { maxGrade: data.maxGrade }),
          ...(data.gradeScalePrecision !== undefined && { gradeScalePrecision: data.gradeScalePrecision }),
          ...(data.primaryColor && { primaryColor: data.primaryColor }),
          ...(data.requireAttendanceNote !== undefined && { requireAttendanceNote: data.requireAttendanceNote }),
          customConfig: updatedCustomConfig,
        },
        create: {
          schoolId: school.id,
          termType: data.termType || "SEMESTER",
          minPassingGrade: data.minPassingGrade ?? 4.0,
          minGrade: data.minGrade ?? 1.0,
          maxGrade: data.maxGrade ?? 7.0,
          gradeScalePrecision: data.gradeScalePrecision ?? 1,
          primaryColor: data.primaryColor ?? "#0284c7",
          requireAttendanceNote: data.requireAttendanceNote ?? false,
          customConfig: updatedCustomConfig,
        },
      });

      await logAuditEvent({
        schoolId: school.id,
        userId: userId || null,
        action: AuditAction.UPDATE,
        entityType: "SCHOOL_SETTINGS",
        entityId: updatedSettings.id,
        details: data as Record<string, unknown>,
      });

      // Sincronizar también catálogo en memoria
      const catalogSchool = SCHOOLS_CATALOG.find((s) => s.id === school.id || s.slug === school.slug);
      if (catalogSchool) {
        if (data.name) catalogSchool.name = data.name;
        if (data.institutionalCode !== undefined) catalogSchool.institutionalCode = data.institutionalCode;
        if (data.address !== undefined) catalogSchool.address = data.address;
        if (data.city) catalogSchool.city = data.city;
        if (data.country) catalogSchool.country = data.country;
        if (data.timezone) catalogSchool.timezone = data.timezone;
        if (data.termType) catalogSchool.settings.termType = data.termType as any;
        if (data.minGrade !== undefined) catalogSchool.settings.minGrade = data.minGrade;
        if (data.maxGrade !== undefined) catalogSchool.settings.maxGrade = data.maxGrade;
        if (data.minPassingGrade !== undefined) catalogSchool.settings.minPassingGrade = data.minPassingGrade;
        if (data.gradeScalePrecision !== undefined) catalogSchool.settings.gradeScalePrecision = data.gradeScalePrecision;
        if (data.primaryColor) catalogSchool.settings.primaryColor = data.primaryColor;
        if (data.requireAttendanceNote !== undefined) catalogSchool.settings.requireAttendanceNote = data.requireAttendanceNote;
        if (data.minAttendancePercentage !== undefined) catalogSchool.settings.minAttendancePercentage = data.minAttendancePercentage;
        if (data.defaultAssessmentWeight !== undefined) catalogSchool.settings.defaultAssessmentWeight = data.defaultAssessmentWeight;

        catalogSchool.customConfig = updatedCustomConfig;
      }

      return updatedSettings;
    }
  } catch (err: any) {
    if (err instanceof SchoolServiceError) throw err;
  }

  // Fallback en memoria si DB no está conectada
  const catalogSchool = SCHOOLS_CATALOG.find((s) => s.id === schoolId || s.slug === schoolId);
  if (catalogSchool) {
    if (data.name) catalogSchool.name = data.name;
    if (data.institutionalCode !== undefined) catalogSchool.institutionalCode = data.institutionalCode;
    if (data.address !== undefined) catalogSchool.address = data.address;
    if (data.city) catalogSchool.city = data.city;
    if (data.country) catalogSchool.country = data.country;
    if (data.timezone) catalogSchool.timezone = data.timezone;
    if (data.termType) catalogSchool.settings.termType = data.termType as any;
    if (data.minGrade !== undefined) catalogSchool.settings.minGrade = data.minGrade;
    if (data.maxGrade !== undefined) catalogSchool.settings.maxGrade = data.maxGrade;
    if (data.minPassingGrade !== undefined) catalogSchool.settings.minPassingGrade = data.minPassingGrade;
    if (data.gradeScalePrecision !== undefined) catalogSchool.settings.gradeScalePrecision = data.gradeScalePrecision;
    if (data.primaryColor) catalogSchool.settings.primaryColor = data.primaryColor;
    if (data.requireAttendanceNote !== undefined) catalogSchool.settings.requireAttendanceNote = data.requireAttendanceNote;
    if (data.minAttendancePercentage !== undefined) catalogSchool.settings.minAttendancePercentage = data.minAttendancePercentage;
    if (data.defaultAssessmentWeight !== undefined) catalogSchool.settings.defaultAssessmentWeight = data.defaultAssessmentWeight;

    catalogSchool.customConfig = {
      ...(catalogSchool.customConfig || {}),
      ...(data.contactEmail !== undefined && { contactEmail: data.contactEmail }),
      ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone }),
      ...(data.motto !== undefined && { motto: data.motto }),
      ...(data.minAttendancePercentage !== undefined && { minAttendancePercentage: data.minAttendancePercentage }),
      ...(data.defaultAssessmentWeight !== undefined && { defaultAssessmentWeight: data.defaultAssessmentWeight }),
    };
  }

  return {
    id: `set_${schoolId}`,
    schoolId,
    termType: data.termType || (catalogSchool ? catalogSchool.settings.termType : "SEMESTER"),
    minPassingGrade: data.minPassingGrade ?? (catalogSchool ? catalogSchool.settings.minPassingGrade : 4.0),
    minGrade: data.minGrade ?? (catalogSchool ? catalogSchool.settings.minGrade : 1.0),
    maxGrade: data.maxGrade ?? (catalogSchool ? catalogSchool.settings.maxGrade : 7.0),
    gradeScalePrecision: data.gradeScalePrecision ?? (catalogSchool ? (catalogSchool.settings.gradeScalePrecision ?? 1) : 1),
    primaryColor: data.primaryColor ?? (catalogSchool ? catalogSchool.settings.primaryColor : "#0284c7"),
    requireAttendanceNote: data.requireAttendanceNote ?? (catalogSchool?.settings?.requireAttendanceNote ?? false),
    customConfig: catalogSchool?.customConfig || null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Obtener detalles completos de la institución, su configuración y periodos académicos
 */
export async function getSchoolFullDetails(schoolId: string) {
  try {
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
      include: {
        settings: true,
        academicPeriods: {
          orderBy: { startDate: "asc" },
          include: {
            _count: { select: { assessments: true } },
          },
        },
      },
    });

    if (school) {
      const customConfig = (school.settings?.customConfig as Record<string, any>) || {};
      const periods = school.academicPeriods || [];
      return {
        school: {
          id: school.id,
          name: school.name,
          slug: school.slug,
          institutionalCode: school.institutionalCode || "",
          address: school.address || "",
          city: school.city || "",
          country: school.country,
          timezone: school.timezone,
          contactEmail: customConfig.contactEmail || "",
          contactPhone: customConfig.contactPhone || "",
          motto: customConfig.motto || "",
          status: school.status,
        },
        settings: {
          termType: school.settings?.termType || "SEMESTER",
          minPassingGrade: Number(school.settings?.minPassingGrade ?? 4.0),
          minGrade: Number(school.settings?.minGrade ?? 1.0),
          maxGrade: Number(school.settings?.maxGrade ?? 7.0),
          gradeScalePrecision: school.settings?.gradeScalePrecision ?? 1,
          primaryColor: school.settings?.primaryColor || "#0284c7",
          requireAttendanceNote: school.settings?.requireAttendanceNote ?? false,
          minAttendancePercentage: customConfig.minAttendancePercentage ?? 85,
          defaultAssessmentWeight: customConfig.defaultAssessmentWeight ?? 20,
        },
        academicPeriods: periods.map((p, idx) => ({
          id: p.id,
          name: p.name,
          year: p.year,
          startDate: (p.startDate instanceof Date ? p.startDate.toISOString().split("T")[0] : String(p.startDate)),
          endDate: (p.endDate instanceof Date ? p.endDate.toISOString().split("T")[0] : String(p.endDate)),
          isCurrent: p.isCurrent,
          isClosed: p.isClosed,
          weightPercentage: (customConfig.periodWeights?.[p.id]) ?? (school.settings?.termType === "TRIMESTER" ? 33 : 50),
          assessmentsCount: p._count?.assessments ?? 0,
        })),
      };
    }
  } catch (err) {
    // Fallback if error occurs
  }

  // Fallback demo
  const demoSchool = SCHOOLS_CATALOG.find((s) => s.id === schoolId || s.slug === schoolId) || SCHOOLS_CATALOG[0];
  const customConfig = demoSchool.customConfig || {};
  return {
    school: {
      id: demoSchool.id,
      name: demoSchool.name,
      slug: demoSchool.slug,
      institutionalCode: demoSchool.institutionalCode,
      address: demoSchool.address || "Av. Libertador Bernardo O'Higgins 1234",
      city: demoSchool.city,
      country: demoSchool.country,
      timezone: demoSchool.timezone || "America/Santiago",
      contactEmail: customConfig.contactEmail || "contacto@sanjose.cl",
      contactPhone: customConfig.contactPhone || "+56 2 2345 6789",
      motto: customConfig.motto || "Excelencia académica, formación valórica y compromiso comunitario",
      status: demoSchool.status,
    },
    settings: {
      termType: demoSchool.settings.termType,
      minPassingGrade: demoSchool.settings.minPassingGrade,
      minGrade: demoSchool.settings.minGrade,
      maxGrade: demoSchool.settings.maxGrade,
      gradeScalePrecision: demoSchool.settings.gradeScalePrecision ?? 1,
      primaryColor: demoSchool.settings.primaryColor,
      requireAttendanceNote: demoSchool.settings.requireAttendanceNote ?? false,
      minAttendancePercentage: demoSchool.settings.minAttendancePercentage ?? customConfig.minAttendancePercentage ?? 85,
      defaultAssessmentWeight: demoSchool.settings.defaultAssessmentWeight ?? customConfig.defaultAssessmentWeight ?? 20,
    },
    academicPeriods: (demoSchool.academicPeriods && demoSchool.academicPeriods.length > 0)
      ? demoSchool.academicPeriods
      : [
          {
            id: "period-csj-2026-s1",
            name: "Primer Semestre 2026",
            year: 2026,
            startDate: "2026-03-01",
            endDate: "2026-07-15",
            isCurrent: true,
            isClosed: false,
            weightPercentage: 50,
            assessmentsCount: 14,
          },
          {
            id: "period-csj-2026-s2",
            name: "Segundo Semestre 2026",
            year: 2026,
            startDate: "2026-07-28",
            endDate: "2026-12-18",
            isCurrent: false,
            isClosed: false,
            weightPercentage: 50,
            assessmentsCount: 0,
          },
        ],
  };
}

/**
 * Gestión de Periodos Académicos
 */
export async function listAcademicPeriods(schoolId: string) {
  if (isDatabaseConfigured()) {
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });
    if (!school) throw new SchoolServiceError("Institución no encontrada.");

    const periods = await prisma.academicPeriod.findMany({
      where: { schoolId: school.id },
      orderBy: { startDate: "asc" },
      include: {
        _count: { select: { assessments: true } },
      },
    });

    return periods.map((p) => ({
      id: p.id,
      name: p.name,
      year: p.year,
      startDate: p.startDate.toISOString().split("T")[0],
      endDate: p.endDate.toISOString().split("T")[0],
      isCurrent: p.isCurrent,
      isClosed: p.isClosed,
      assessmentsCount: p._count.assessments,
    }));
  }

  const demoSchool = SCHOOLS_CATALOG.find((s) => s.id === schoolId || s.slug === schoolId) || SCHOOLS_CATALOG[0];
  if (demoSchool.academicPeriods && demoSchool.academicPeriods.length > 0) {
    return demoSchool.academicPeriods;
  }

  return [
    {
      id: "period-csj-2026-s1",
      name: "Primer Semestre 2026",
      year: 2026,
      startDate: "2026-03-01",
      endDate: "2026-07-15",
      isCurrent: true,
      isClosed: false,
      weightPercentage: 50,
      assessmentsCount: 14,
    },
    {
      id: "period-csj-2026-s2",
      name: "Segundo Semestre 2026",
      year: 2026,
      startDate: "2026-07-28",
      endDate: "2026-12-18",
      isCurrent: false,
      isClosed: false,
      weightPercentage: 50,
      assessmentsCount: 0,
    },
  ];
}

export async function createAcademicPeriod(
  schoolId: string,
  data: CreateAcademicPeriodInput,
  userId?: string
) {
  if (isDatabaseConfigured()) {
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });
    if (!school) throw new SchoolServiceError("Institución no encontrada.");

    // Si se marca como isCurrent, desmarcar los demás periodos de la escuela
    if (data.isCurrent) {
      await prisma.academicPeriod.updateMany({
        where: { schoolId: school.id },
        data: { isCurrent: false },
      });
    }

    const newPeriod = await prisma.academicPeriod.create({
      data: {
        schoolId: school.id,
        name: data.name,
        year: data.year,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        isCurrent: data.isCurrent ?? false,
        isClosed: data.isClosed ?? false,
      },
    });

    await logAuditEvent({
      schoolId: school.id,
      userId: userId || null,
      action: AuditAction.CREATE,
      entityType: "ACADEMIC_PERIOD",
      entityId: newPeriod.id,
      details: { name: newPeriod.name, year: newPeriod.year },
    });

    return {
      ...newPeriod,
      startDate: newPeriod.startDate.toISOString().split("T")[0],
      endDate: newPeriod.endDate.toISOString().split("T")[0],
      weightPercentage: data.weightPercentage ?? 50,
      assessmentsCount: 0,
    };
  }

  const demoSchool = SCHOOLS_CATALOG.find((s) => s.id === schoolId || s.slug === schoolId) || SCHOOLS_CATALOG[0];
  if (!demoSchool.academicPeriods) {
    demoSchool.academicPeriods = [
      {
        id: "period-csj-2026-s1",
        name: "Primer Semestre 2026",
        year: 2026,
        startDate: "2026-03-01",
        endDate: "2026-07-15",
        isCurrent: true,
        isClosed: false,
        weightPercentage: 50,
        assessmentsCount: 14,
      },
      {
        id: "period-csj-2026-s2",
        name: "Segundo Semestre 2026",
        year: 2026,
        startDate: "2026-07-28",
        endDate: "2026-12-18",
        isCurrent: false,
        isClosed: false,
        weightPercentage: 50,
        assessmentsCount: 0,
      },
    ];
  }

  if (data.isCurrent) {
    demoSchool.academicPeriods.forEach((p) => {
      p.isCurrent = false;
    });
  }

  const newPeriod = {
    id: `period_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: data.name,
    year: data.year,
    startDate: data.startDate,
    endDate: data.endDate,
    isCurrent: data.isCurrent ?? false,
    isClosed: data.isClosed ?? false,
    weightPercentage: data.weightPercentage ?? 50,
    assessmentsCount: 0,
  };

  demoSchool.academicPeriods.push(newPeriod);
  return newPeriod;
}

export async function updateAcademicPeriod(
  schoolId: string,
  periodId: string,
  data: UpdateAcademicPeriodInput,
  userId?: string
) {
  if (isDatabaseConfigured()) {
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });
    if (!school) throw new SchoolServiceError("Institución no encontrada.");

    if (data.isCurrent) {
      await prisma.academicPeriod.updateMany({
        where: { schoolId: school.id, id: { not: periodId } },
        data: { isCurrent: false },
      });
    }

    const updated = await prisma.academicPeriod.update({
      where: { id: periodId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.year !== undefined && { year: data.year }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.isCurrent !== undefined && { isCurrent: data.isCurrent }),
        ...(data.isClosed !== undefined && { isClosed: data.isClosed }),
      },
      include: {
        _count: { select: { assessments: true } },
      },
    });

    await logAuditEvent({
      schoolId: school.id,
      userId: userId || null,
      action: AuditAction.UPDATE,
      entityType: "ACADEMIC_PERIOD",
      entityId: updated.id,
      details: data as Record<string, unknown>,
    });

    return {
      ...updated,
      startDate: updated.startDate.toISOString().split("T")[0],
      endDate: updated.endDate.toISOString().split("T")[0],
      weightPercentage: data.weightPercentage ?? 50,
      assessmentsCount: updated._count.assessments,
    };
  }

  const demoSchool = SCHOOLS_CATALOG.find((s) => s.id === schoolId || s.slug === schoolId) || SCHOOLS_CATALOG[0];
  if (!demoSchool.academicPeriods) {
    demoSchool.academicPeriods = [
      {
        id: "period-csj-2026-s1",
        name: "Primer Semestre 2026",
        year: 2026,
        startDate: "2026-03-01",
        endDate: "2026-07-15",
        isCurrent: true,
        isClosed: false,
        weightPercentage: 50,
        assessmentsCount: 14,
      },
      {
        id: "period-csj-2026-s2",
        name: "Segundo Semestre 2026",
        year: 2026,
        startDate: "2026-07-28",
        endDate: "2026-12-18",
        isCurrent: false,
        isClosed: false,
        weightPercentage: 50,
        assessmentsCount: 0,
      },
    ];
  }

  if (data.isCurrent) {
    demoSchool.academicPeriods.forEach((p) => {
      if (p.id !== periodId) {
        p.isCurrent = false;
      }
    });
  }

  const target = demoSchool.academicPeriods.find((p) => p.id === periodId);
  if (target) {
    if (data.name) target.name = data.name;
    if (data.year !== undefined) target.year = data.year;
    if (data.startDate) target.startDate = data.startDate;
    if (data.endDate) target.endDate = data.endDate;
    if (data.isCurrent !== undefined) target.isCurrent = data.isCurrent;
    if (data.isClosed !== undefined) target.isClosed = data.isClosed;
    if (data.weightPercentage !== undefined) target.weightPercentage = data.weightPercentage;
    return target;
  }

  return {
    id: periodId,
    name: data.name || "Periodo Actualizado",
    year: data.year || 2026,
    startDate: data.startDate || "2026-03-01",
    endDate: data.endDate || "2026-07-15",
    isCurrent: data.isCurrent ?? true,
    isClosed: data.isClosed ?? false,
    weightPercentage: data.weightPercentage ?? 50,
    assessmentsCount: 0,
  };
}

export async function deleteAcademicPeriod(
  schoolId: string,
  periodId: string,
  userId?: string
) {
  if (isDatabaseConfigured()) {
    const school = await prisma.school.findFirst({
      where: { OR: [{ id: schoolId }, { slug: schoolId }] },
    });
    if (!school) throw new SchoolServiceError("Institución no encontrada.");

    // Verificar si tiene evaluaciones vinculadas
    const count = await prisma.assessment.count({
      where: { academicPeriodId: periodId },
    });

    if (count > 0) {
      throw new SchoolServiceError(
        `No se puede eliminar el periodo porque tiene ${count} evaluaciones registradas en el libro de clases. Primero elimina o reasigna dichas evaluaciones.`
      );
    }

    await prisma.academicPeriod.delete({
      where: { id: periodId },
    });

    await logAuditEvent({
      schoolId: school.id,
      userId: userId || null,
      action: AuditAction.DELETE,
      entityType: "ACADEMIC_PERIOD",
      entityId: periodId,
      details: { periodId },
    });

    return { success: true, id: periodId };
  }

  const demoSchool = SCHOOLS_CATALOG.find((s) => s.id === schoolId || s.slug === schoolId) || SCHOOLS_CATALOG[0];
  if (demoSchool.academicPeriods) {
    demoSchool.academicPeriods = demoSchool.academicPeriods.filter((p) => p.id !== periodId);
  }

  return { success: true, id: periodId };
}

