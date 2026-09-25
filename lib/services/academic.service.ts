import { TenantPrismaClient } from "@/lib/db/tenant-extension";
import { isDatabaseConfigured } from "@/lib/db/prisma";
import { CreateCourseSchema, UpdateCourseSchema } from "@/lib/validations";
import { z } from "zod";

export async function getSchoolAcademicOverview(tenantDb: TenantPrismaClient, schoolId: string) {
  const currentYear = new Date().getFullYear();

  if (isDatabaseConfigured()) {
    try {
      const [totalCourses, totalSubjects, activePeriod, totalStudents, totalAssessments] = await Promise.all([
        tenantDb.course.count({
          where: { schoolId, year: currentYear, deletedAt: null },
        }),
        tenantDb.subject.count({
          where: { schoolId },
        }),
        tenantDb.academicPeriod.findFirst({
          where: { schoolId, isCurrent: true },
        }),
        tenantDb.enrollment.count({
          where: { schoolId, year: currentYear, status: "ACTIVE", deletedAt: null },
        }),
        tenantDb.assessment.count({
          where: { schoolId },
        }),
      ]);

      return {
        currentYear,
        totalCourses,
        totalSubjects,
        activePeriod,
        totalStudents,
        totalAssessments,
      };
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  return {
    currentYear,
    totalCourses: 8,
    totalSubjects: 24,
    activePeriod: { id: "per_sem1_demo", name: "Primer Semestre 2026", startDate: new Date("2026-03-01"), endDate: new Date("2026-07-15") },
    totalStudents: 145,
    totalAssessments: 32,
  };
}

export interface ActivityItem {
  id: string;
  action: string;
  description: string;
  timestamp: Date;
  user?: string;
  type: "academic" | "security" | "attendance" | "system";
}

export async function getRecentActivities(tenantDb: TenantPrismaClient, schoolId: string): Promise<ActivityItem[]> {
  if (isDatabaseConfigured()) {
    try {
      const logs = await tenantDb.auditLog.findMany({
        where: { schoolId },
        take: 6,
        orderBy: { timestamp: "desc" },
        include: { user: true },
      });

      if (logs.length > 0) {
        return logs.map((log) => {
          let type: ActivityItem["type"] = "system";
          if (log.entityType === "Grade" || log.entityType === "Assessment" || log.entityType === "Course") {
            type = "academic";
          } else if (log.entityType === "Attendance") {
            type = "attendance";
          } else if (log.action === "SECURITY_EVENT" || log.action === "LOGIN") {
            type = "security";
          }

          const userName = log.user ? `${log.user.firstName} ${log.user.lastName}` : "Sistema";
          let description = `${log.action} en ${log.entityType}`;
          if (log.details && typeof log.details === "object" && "message" in log.details) {
            description = String((log.details as any).message);
          }

          return {
            id: log.id,
            action: log.action,
            description,
            timestamp: log.timestamp,
            user: userName,
            type,
          };
        });
      }
    } catch {
      // Fallback
    }
  }

  return [
    {
      id: "act-1",
      action: "UPDATE",
      description: "Publicación de calificaciones Parcial 1 en Matemáticas (1° Medio A)",
      timestamp: new Date(Date.now() - 1000 * 60 * 35),
      user: "Prof. Andrea Morales",
      type: "academic",
    },
    {
      id: "act-2",
      action: "CREATE",
      description: "Registro de asistencia completado para 2° Básico B (26 presentes)",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      user: "Prof. Carlos Fuenzalida",
      type: "attendance",
    },
    {
      id: "act-3",
      action: "CREATE",
      description: "Matrícula de nuevo estudiante en 3° Medio B (Registro regular)",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
      user: "Admin Secretaría",
      type: "academic",
    },
    {
      id: "act-4",
      action: "UPDATE",
      description: "Actualización de ponderaciones semestrales en Consejo Académico",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      user: "Dirección Académica",
      type: "system",
    },
  ];
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  category: "Urgente" | "Académico" | "Institucional" | "Circular";
  date: string;
  author: string;
}

export function getSchoolAnnouncements(): AnnouncementItem[] {
  return [
    {
      id: "ann-1",
      title: "Cierre de actas primer trimestre / periodo",
      content: "Recordatorio: El ingreso formal de todas las evaluaciones parciales culmina el próximo viernes a las 18:00 hrs.",
      category: "Urgente",
      date: "Hoy, 09:00",
      author: "Unidad Técnica Pedagógica (UTP)",
    },
    {
      id: "ann-2",
      title: "Reunión general de apoderados y entrega de informes",
      content: "Se han habilitado las descargas de informes de asistencia y rendimiento para la jornada de apoderados del jueves.",
      category: "Institucional",
      date: "Ayer",
      author: "Dirección General",
    },
    {
      id: "ann-3",
      title: "Actualización de horarios de talleres extraprogramáticos",
      content: "Los nuevos bloques de laboratorios de ciencias y deportes están disponibles en la sección de horarios.",
      category: "Académico",
      date: "Hace 2 días",
      author: "Coordinación de Talleres",
    },
  ];
}

export interface CourseItem {
  id: string;
  name: string;
  gradeNumber: number;
  letter: string;
  year: number;
  educationLevel: { id: string; name: string };
  subjects: { id: string; name: string; teacher?: any }[];
  _count: { enrollments: number };
}

export async function listCoursesByYear(tenantDb: TenantPrismaClient, schoolId: string, year: number): Promise<CourseItem[]> {
  if (isDatabaseConfigured()) {
    try {
      const courses = await tenantDb.course.findMany({
        where: { schoolId, year, deletedAt: null },
        include: {
          educationLevel: true,
          subjects: {
            where: { schoolId },
            include: {
              teacher: {
                include: {
                  membership: {
                    include: { user: true },
                  },
                },
              },
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
        orderBy: [{ gradeNumber: "asc" }, { letter: "asc" }],
      });

      if (courses.length > 0) return courses as unknown as CourseItem[];
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  // Fallback demo courses
  return [
    {
      id: "course_1a_demo",
      name: "1° Básico A",
      gradeNumber: 1,
      letter: "A",
      year: year,
      educationLevel: { id: "lvl_basica", name: "Educación Básica" },
      subjects: [
        { id: "sub_mat_1", name: "Matemáticas", teacher: null },
        { id: "sub_len_1", name: "Lenguaje y Comunicación", teacher: null },
        { id: "sub_cie_1", name: "Ciencias Naturales", teacher: null },
      ],
      _count: { enrollments: 28 },
    },
    {
      id: "course_1b_demo",
      name: "1° Básico B",
      gradeNumber: 1,
      letter: "B",
      year: year,
      educationLevel: { id: "lvl_basica", name: "Educación Básica" },
      subjects: [
        { id: "sub_mat_2", name: "Matemáticas", teacher: null },
        { id: "sub_len_2", name: "Lenguaje y Comunicación", teacher: null },
      ],
      _count: { enrollments: 26 },
    },
    {
      id: "course_2a_demo",
      name: "2° Básico A",
      gradeNumber: 2,
      letter: "A",
      year: year,
      educationLevel: { id: "lvl_basica", name: "Educación Básica" },
      subjects: [
        { id: "sub_mat_3", name: "Matemáticas", teacher: null },
        { id: "sub_his_1", name: "Historia y Geografía", teacher: null },
      ],
      _count: { enrollments: 30 },
    },
  ];
}

export interface AcademicPeriodItem {
  id: string;
  name: string;
  isCurrent?: boolean;
  startDate: Date;
  endDate: Date;
}

export async function listAcademicPeriods(tenantDb: TenantPrismaClient, schoolId: string): Promise<AcademicPeriodItem[]> {
  if (isDatabaseConfigured()) {
    try {
      const periods = await tenantDb.academicPeriod.findMany({
        where: { schoolId },
        orderBy: { startDate: "desc" },
      });
      if (periods.length > 0) return periods as unknown as AcademicPeriodItem[];
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  return [
    { id: "per_sem1_demo", name: "Primer Semestre 2026", isCurrent: true, startDate: new Date("2026-03-01"), endDate: new Date("2026-07-15") },
    { id: "per_sem2_demo", name: "Segundo Semestre 2026", isCurrent: false, startDate: new Date("2026-08-01"), endDate: new Date("2026-12-15") },
  ];
}

export async function createCourse(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  input: {
    name: string;
    educationLevelId: string;
    gradeNumber: number;
    letter?: string;
    year: number;
  },
  userId?: string
) {
  if (!schoolId || typeof schoolId !== "string" || schoolId.trim() === "") {
    throw new Error("ID de institución (tenant) inválido.");
  }
  const validated = CreateCourseSchema.parse(input);

  if (isDatabaseConfigured()) {
    const level = await tenantDb.educationLevel.findFirst({
      where: { id: validated.educationLevelId, schoolId },
    });
    if (!level) {
      throw new Error("El nivel educativo especificado no existe o no pertenece a la institución.");
    }
  }

  const course = await tenantDb.course.create({
    data: {
      schoolId,
      name: validated.name,
      educationLevelId: validated.educationLevelId,
      gradeNumber: validated.gradeNumber,
      letter: validated.letter || null,
      year: validated.year,
    },
  });

  return course;
}

export async function updateCourse(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  courseId: string,
  input: {
    name?: string;
    educationLevelId?: string;
    gradeNumber?: number;
    letter?: string;
    year?: number;
  },
  userId?: string
) {
  if (!schoolId || !courseId) {
    throw new Error("IDs de institución o curso inválidos.");
  }
  const validated = UpdateCourseSchema.parse(input);

  const existing = await tenantDb.course.findFirst({
    where: { id: courseId, schoolId },
  });

  if (!existing) {
    throw new Error(`Curso '${courseId}' no encontrado en la institución.`);
  }

  if (validated.educationLevelId && isDatabaseConfigured()) {
    const level = await tenantDb.educationLevel.findFirst({
      where: { id: validated.educationLevelId, schoolId },
    });
    if (!level) {
      throw new Error("El nivel educativo especificado no existe o no pertenece a la institución.");
    }
  }

  const updated = await tenantDb.course.update({
    where: { id: courseId },
    data: {
      ...(validated.name !== undefined ? { name: validated.name } : {}),
      ...(validated.educationLevelId !== undefined ? { educationLevelId: validated.educationLevelId } : {}),
      ...(validated.gradeNumber !== undefined ? { gradeNumber: validated.gradeNumber } : {}),
      ...(validated.letter !== undefined ? { letter: validated.letter } : {}),
      ...(validated.year !== undefined ? { year: validated.year } : {}),
    },
  });

  return updated;
}

export async function deleteCourse(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  courseId: string,
  userId?: string
) {
  if (!schoolId || !courseId) {
    throw new Error("IDs de institución o curso inválidos.");
  }

  const existing = await tenantDb.course.findFirst({
    where: { id: courseId, schoolId, deletedAt: null },
  });

  if (!existing) {
    throw new Error(`Curso '${courseId}' no encontrado en la institución.`);
  }

  // Borrado lógico (soft delete) para proteger historial académico
  await tenantDb.course.update({
    where: { id: courseId },
    data: { deletedAt: new Date() },
  });

  return { success: true };
}
