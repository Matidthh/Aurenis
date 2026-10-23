import { prisma } from "@/lib/db/prisma";
import { CreateGradingScaleInput, UpdateGradingScaleInput } from "@/lib/validations/grading.schema";

export async function getGradingScales(schoolId: string) {
  return await prisma.gradingScale.findMany({
    where: { schoolId },
    orderBy: { name: "asc" },
  });
}

export async function createGradingScale(schoolId: string, data: CreateGradingScaleInput) {
  return await prisma.gradingScale.create({
    data: {
      ...data,
      schoolId,
    },
  });
}

export async function updateGradingScale(id: string, data: UpdateGradingScaleInput) {
  return await prisma.gradingScale.update({
    where: { id },
    data,
  });
}

export async function deleteGradingScale(id: string) {
  return await prisma.gradingScale.delete({
    where: { id },
  });
}
