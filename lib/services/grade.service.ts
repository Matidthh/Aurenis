import { TenantPrismaClient } from "@/lib/db/tenant-extension";
import { CreateGradeInput, UpdateGradeInput } from "@/lib/validations/grade.schema";
import { logAuditEvent } from "./audit.service";
import { AuditAction } from "@prisma/client";

export async function listAssessmentsWithGrades(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  options?: { subjectId?: string; periodId?: string }
) {
  return tenantDb.assessment.findMany({
    where: {
      schoolId,
      ...(options?.subjectId ? { subjectId: options.subjectId } : {}),
      ...(options?.periodId ? { academicPeriodId: options.periodId } : {}),
    },
    include: {
      subject: {
        include: {
          course: true,
          teacher: {
            include: {
              membership: {
                include: { user: true },
              },
            },
          },
        },
      },
      academicPeriod: true,
      grades: {
        include: {
          enrollment: {
            include: {
              student: {
                include: {
                  membership: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { date: "desc" },
  });
}

export async function getSchoolGradingConfig(tenantDb: TenantPrismaClient, schoolId: string) {
  const settings = await tenantDb.schoolSettings.findUnique({
    where: { schoolId },
  });

  return {
    minPassingGrade: Number(settings?.minPassingGrade || 4.0),
    minGrade: Number(settings?.minGrade || 1.0),
    maxGrade: Number(settings?.maxGrade || 7.0),
    precision: settings?.gradeScalePrecision || 1,
    termType: settings?.termType || "SEMESTER",
  };
}

export async function createGrade(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  input: CreateGradeInput,
  userId?: string
) {
  const grade = await tenantDb.grade.create({
    data: {
      schoolId,
      assessmentId: input.assessmentId,
      enrollmentId: input.enrollmentId,
      value: input.value,
      feedback: input.feedback || null,
    },
  });

  await logAuditEvent({
    schoolId,
    userId,
    action: AuditAction.CREATE,
    entityType: "GRADE",
    entityId: grade.id,
    details: {
      assessmentId: input.assessmentId,
      enrollmentId: input.enrollmentId,
      value: input.value,
    },
  });

  return grade;
}

export async function updateGrade(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  gradeId: string,
  input: UpdateGradeInput,
  userId?: string
) {
  const existing = await tenantDb.grade.findFirst({
    where: { id: gradeId, schoolId },
  });

  if (!existing) {
    throw new Error(`Calificación '${gradeId}' no encontrada en la institución.`);
  }

  const updated = await tenantDb.grade.update({
    where: { id: gradeId },
    data: {
      ...(input.value !== undefined ? { value: input.value } : {}),
      ...(input.feedback !== undefined ? { feedback: input.feedback } : {}),
    },
  });

  await logAuditEvent({
    schoolId,
    userId,
    action: AuditAction.UPDATE,
    entityType: "GRADE",
    entityId: gradeId,
    details: {
      previousValue: Number(existing.value),
      newValue: input.value !== undefined ? input.value : Number(existing.value),
    },
  });

  return updated;
}

export async function deleteGrade(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  gradeId: string,
  userId?: string
) {
  const existing = await tenantDb.grade.findFirst({
    where: { id: gradeId, schoolId },
  });

  if (!existing) {
    throw new Error(`Calificación '${gradeId}' no encontrada en la institución.`);
  }

  await tenantDb.grade.delete({
    where: { id: gradeId },
  });

  await logAuditEvent({
    schoolId,
    userId,
    action: AuditAction.DELETE,
    entityType: "GRADE",
    entityId: gradeId,
    details: {
      deletedValue: Number(existing.value),
      assessmentId: existing.assessmentId,
    },
  });

  return { success: true };
}
