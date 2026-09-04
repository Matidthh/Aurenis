import { prisma } from "./prisma";

// Lista de modelos que pertenecen directamente a una institución y deben filtrar por schoolId
export const TENANT_SCOPED_MODELS = [
  "SchoolSettings",
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
  "AuditLog",
  "FileRecord",
] as const;

export type TenantScopedModel = (typeof TENANT_SCOPED_MODELS)[number];

/**
 * Crea una instancia de Prisma con contexto de tenant forzado.
 * Previene accesos cruzados inyectando `schoolId` en lecturas y escrituras.
 */
export function createTenantPrisma(schoolId: string) {
  if (!schoolId) {
    throw new Error("TenantPrisma requiere un schoolId válido para operar de manera segura.");
  }

  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const operationArgs = (args || {}) as Record<string, any>;

          // Si el modelo es institucional, forzamos el aislamiento
          if (TENANT_SCOPED_MODELS.includes(model as TenantScopedModel)) {
            // Inyección en filtros where para búsquedas y conteos
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

            // Inyección en creación de registros
            if (operation === "create" && operationArgs.data) {
              if (!operationArgs.data.schoolId) {
                operationArgs.data.schoolId = schoolId;
              } else if (operationArgs.data.schoolId !== schoolId) {
                throw new Error(
                  `Violación de aislamiento multi-tenant: intento de crear datos para schoolId=${operationArgs.data.schoolId} en contexto schoolId=${schoolId}`
                );
              }
            }

            // Inyección en creación masiva (createMany)
            if (operation === "createMany" && operationArgs.data) {
              if (Array.isArray(operationArgs.data)) {
                operationArgs.data = operationArgs.data.map((item: Record<string, any>) => ({
                  ...item,
                  schoolId,
                }));
              }
            }
          }

          return query(operationArgs as any);
        },
      },
    },
  });
}

export type TenantPrismaClient = ReturnType<typeof createTenantPrisma>;
