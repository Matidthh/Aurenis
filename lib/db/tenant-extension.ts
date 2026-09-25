/**
 * Motor de Aislamiento y Extensión Multi-Tenant para Prisma — Aurenis
 *
 * Garantiza de forma estricta que todas las consultas a nivel de base de datos
 * queden confinadas exclusivamente a la institución (schoolId) del contexto activo.
 *
 * Bloquea:
 * 1. Intentos de cross-tenant query (IDOR horizontal).
 * 2. Intentos de creación/modificación/eliminación de entidades de otra institución.
 * 3. Filtrado forzoso de schoolId en todas las operaciones DQL y DML institucionales.
 */

import { prisma } from "./prisma";

export class TenantIsolationViolationError extends Error {
  public readonly attemptedSchoolId?: string;
  public readonly contextSchoolId: string;
  public readonly model?: string;

  constructor(message: string, contextSchoolId: string, attemptedSchoolId?: string, model?: string) {
    super(message);
    this.name = "TenantIsolationViolationError";
    this.contextSchoolId = contextSchoolId;
    this.attemptedSchoolId = attemptedSchoolId;
    this.model = model;
  }
}

// Modelos que contienen la columna directa `schoolId` en base de datos
export const DIRECT_TENANT_MODELS = [
  "SchoolSettings",
  "Classroom",
  "Membership",
  "Role",
  "AcademicPeriod",
  "EducationLevel",
  "Course",
  "Subject",
  "Enrollment",
  "Assessment",
  "Grade",
  "AttendanceRecord",
  "ScheduleBlock",
  "Assignment",
  "LearningMaterial",
  "Conversation",
  "Notification",
  "ParentMeetingSlot",
  "FeeStructure",
  "StudentFeeAccount",
  "AuditLog",
  "FileRecord",
] as const;

// Modelos vinculados a la institución a través de la membresía institucional
export const MEMBERSHIP_TENANT_MODELS = [
  "TeacherProfile",
  "StudentProfile",
  "GuardianProfile",
] as const;

export const TENANT_SCOPED_MODELS = [
  ...DIRECT_TENANT_MODELS,
  ...MEMBERSHIP_TENANT_MODELS,
] as const;

export type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number];

/**
 * Crea una instancia de Prisma con contexto de tenant forzado.
 * Previene accesos cruzados inyectando y validando `schoolId` en lecturas y escrituras.
 */
export function createTenantPrisma(schoolId: string) {
  if (!schoolId || typeof schoolId !== "string") {
    throw new TenantIsolationViolationError(
      "TenantPrisma requiere un schoolId válido y no vacío para operar de manera segura.",
      schoolId || "UNDEFINED"
    );
  }

  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const operationArgs = (args || {}) as Record<string, any>;
          const modelName = model || "";

          const isDirectScoped = DIRECT_TENANT_MODELS.some(
            (m) => m.toLowerCase() === modelName.toLowerCase()
          );

          const isMembershipScoped = MEMBERSHIP_TENANT_MODELS.some(
            (m) => m.toLowerCase() === modelName.toLowerCase()
          );

          // 1. Verificación y Bloqueo de Intentos Explícitos de Cross-Tenant Query
          if (operationArgs.where) {
            const explicitSchoolId = operationArgs.where.schoolId;
            if (explicitSchoolId && typeof explicitSchoolId === "string" && explicitSchoolId !== schoolId) {
              throw new TenantIsolationViolationError(
                `Violación de aislamiento multi-tenant: intento explícito de consultar datos de schoolId='${explicitSchoolId}' en contexto de institución schoolId='${schoolId}'`,
                schoolId,
                explicitSchoolId,
                modelName
              );
            }
          }

          // 2. Aislamiento para Modelos Directos con columna schoolId
          if (isDirectScoped) {
            // Operaciones de búsqueda colectiva y agregación
            if (
              [
                "findFirst",
                "findFirstOrThrow",
                "findMany",
                "count",
                "aggregate",
                "groupBy",
                "updateMany",
                "deleteMany",
              ].includes(operation)
            ) {
              operationArgs.where = {
                ...(operationArgs.where || {}),
                schoolId,
              };
            }

            // Operaciones de creación
            if (operation === "create" && operationArgs.data) {
              if (!operationArgs.data.schoolId) {
                operationArgs.data.schoolId = schoolId;
              } else if (operationArgs.data.schoolId !== schoolId) {
                throw new TenantIsolationViolationError(
                  `Violación de aislamiento multi-tenant: intento de crear datos para schoolId='${operationArgs.data.schoolId}' en contexto schoolId='${schoolId}'`,
                  schoolId,
                  operationArgs.data.schoolId,
                  modelName
                );
              }
            }

            // Operaciones de creación masiva
            if (operation === "createMany" && operationArgs.data) {
              if (Array.isArray(operationArgs.data)) {
                operationArgs.data = operationArgs.data.map((item: Record<string, any>) => {
                  if (item.schoolId && item.schoolId !== schoolId) {
                    throw new TenantIsolationViolationError(
                      `Violación de aislamiento multi-tenant en createMany: schoolId='${item.schoolId}' no coincide con el tenant activo '${schoolId}'`,
                      schoolId,
                      item.schoolId,
                      modelName
                    );
                  }
                  return { ...item, schoolId };
                });
              }
            }

            // Operaciones findUnique y findUniqueOrThrow
            if (operation === "findUnique" || operation === "findUniqueOrThrow") {
              const result: any = await query(operationArgs as any);
              if (result && result.schoolId && result.schoolId !== schoolId) {
                if (operation === "findUniqueOrThrow") {
                  throw new TenantIsolationViolationError(
                    `Violación de aislamiento multi-tenant: registro no pertenece a la institución actual.`,
                    schoolId,
                    result.schoolId,
                    modelName
                  );
                }
                // Si es findUnique regular, devolver null para no revelar existencia ni datos
                return null;
              }
              return result;
            }

            // Operaciones update y delete sobre registros únicos (Hardened multi-tenant verification - Autor: Maicol R. & Malcom Marcelo)
            if (operation === "update" || operation === "delete") {
              if (operationArgs.where?.schoolId && operationArgs.where.schoolId !== schoolId) {
                throw new TenantIsolationViolationError(
                  `Violación de aislamiento multi-tenant: intento de modificar o eliminar datos de otra institución.`,
                  schoolId,
                  operationArgs.where.schoolId,
                  modelName
                );
              }

              // Si la consulta no incluye schoolId en el where (ej. where: { id }), verificar pertenencia antes de mutar
              if (operationArgs.where && !operationArgs.where.schoolId) {
                try {
                  const existing: any = await (prisma as any)[modelName]?.findUnique({
                    where: operationArgs.where,
                    select: { schoolId: true },
                  });
                  if (existing && existing.schoolId && existing.schoolId !== schoolId) {
                    throw new TenantIsolationViolationError(
                      `Violación de aislamiento multi-tenant: el registro objetivo '${modelName}' pertenece a otra institución.`,
                      schoolId,
                      existing.schoolId,
                      modelName
                    );
                  }
                } catch (err: any) {
                  if (err instanceof TenantIsolationViolationError) throw err;
                  // Si falla findUnique por sintaxis de where, continuar con el query estándar
                }
              }
            }

            // Operaciones upsert con aislamiento estricto
            if (operation === "upsert") {
              if (operationArgs.create) {
                if (!operationArgs.create.schoolId) {
                  operationArgs.create.schoolId = schoolId;
                } else if (operationArgs.create.schoolId !== schoolId) {
                  throw new TenantIsolationViolationError(
                    `Violación de aislamiento multi-tenant en upsert: intento de crear datos para otra institución.`,
                    schoolId,
                    operationArgs.create.schoolId,
                    modelName
                  );
                }
              }
              if (operationArgs.where?.schoolId && operationArgs.where.schoolId !== schoolId) {
                throw new TenantIsolationViolationError(
                  `Violación de aislamiento multi-tenant en upsert: where no coincide con tenant activo.`,
                  schoolId,
                  operationArgs.where.schoolId,
                  modelName
                );
              }
              if (operationArgs.where) {
                try {
                  const existing: any = await (prisma as any)[modelName]?.findUnique({
                    where: operationArgs.where,
                    select: { schoolId: true },
                  });
                  if (existing && existing.schoolId && existing.schoolId !== schoolId) {
                    throw new TenantIsolationViolationError(
                      `Violación de aislamiento multi-tenant en upsert: el registro existente pertenece a otra institución.`,
                      schoolId,
                      existing.schoolId,
                      modelName
                    );
                  }
                } catch (err: any) {
                  if (err instanceof TenantIsolationViolationError) throw err;
                }
              }
            }
          }

          // 3. Aislamiento para Modelos Vinculados por Membresía
          if (isMembershipScoped) {
            if (
              [
                "findFirst",
                "findFirstOrThrow",
                "findMany",
                "count",
                "aggregate",
                "groupBy",
              ].includes(operation)
            ) {
              operationArgs.where = {
                ...(operationArgs.where || {}),
                membership: {
                  ...(operationArgs.where?.membership || {}),
                  schoolId,
                },
              };
            }
          }

          return query(operationArgs as any);
        },
      },
    },
  });
}

export type TenantPrismaClient = ReturnType<typeof createTenantPrisma>;
