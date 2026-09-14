import { TenantPrismaClient } from "@/lib/db/tenant-extension";
import { isDatabaseConfigured } from "@/lib/db/prisma";
import { SELECT_ASSESSMENT_WITH_GRADES } from "@/lib/db/query-projections";

export class GradeServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GradeServiceError";
  }
}

export interface AssessmentWithGradesItem {
  id: string;
  title: string;
  description?: string | null;
  isPublished: boolean;
  subject: {
    name: string;
    course: { name: string };
  };
  academicPeriod: { name: string };
  grades: {
    id: string;
    value: number;
    enrollment: {
      id: string;
      student: {
        membership: {
          user: { firstName: string; lastName: string };
        };
      };
    };
  }[];
}

export async function listAssessmentsWithGrades(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  options?: { subjectId?: string; periodId?: string }
): Promise<AssessmentWithGradesItem[]> {
  if (isDatabaseConfigured()) {
    try {
      const assessments = await tenantDb.assessment.findMany({
        where: {
          schoolId,
          ...(options?.subjectId ? { subjectId: options.subjectId } : {}),
          ...(options?.periodId ? { academicPeriodId: options.periodId } : {}),
        },
        select: SELECT_ASSESSMENT_WITH_GRADES,
        orderBy: { date: "desc" },
      });

      if (assessments.length > 0) return assessments as unknown as AssessmentWithGradesItem[];
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  return [
    {
      id: "ass_1_demo",
      title: "Control Parcial 1: Álgebra y Ecuaciones",
      description: "Evaluación acumulativa sobre resolución de problemas.",
      isPublished: true,
      subject: {
        name: "Matemáticas",
        course: { name: "1° Básico A" },
      },
      academicPeriod: { name: "Primer Semestre 2026" },
      grades: [
        {
          id: "gr_1",
          value: 6.5,
          enrollment: {
            id: "enr_1_demo",
            student: {
              membership: {
                user: { firstName: "Martina", lastName: "González" },
              },
            },
          },
        },
        {
          id: "gr_2",
          value: 5.8,
          enrollment: {
            id: "enr_2_demo",
            student: {
              membership: {
                user: { firstName: "Benjamín", lastName: "Silva" },
              },
            },
          },
        },
        {
          id: "gr_3",
          value: 6.0,
          enrollment: {
            id: "enr_3_demo",
            student: {
              membership: {
                user: { firstName: "Sofía", lastName: "Rojas" },
              },
            },
          },
        },
      ],
    },
  ];
}

export async function getSchoolGradingConfig(tenantDb: TenantPrismaClient, schoolId: string) {
  if (isDatabaseConfigured()) {
    try {
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
    } catch {
      // Fallback a demo
    }
  }

  return {
    minPassingGrade: 4.0,
    minGrade: 1.0,
    maxGrade: 7.0,
    precision: 1,
    termType: "SEMESTER",
  };
}

export interface CreateGradeData {
  assessmentId: string;
  enrollmentId: string;
  value: number;
  comment?: string;
  feedback?: string;
}

export async function createGrade(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  data: CreateGradeData,
  userId?: string
) {
  const config = await getSchoolGradingConfig(tenantDb, schoolId);

  const val = Number(data.value);
  if (isNaN(val) || val < config.minGrade || val > config.maxGrade) {
    throw new GradeServiceError(
      `La calificación (${data.value}) está fuera del rango permitido por la institución (${config.minGrade} a ${config.maxGrade}).`
    );
  }

  const factor = Math.pow(10, config.precision);
  const roundedValue = Math.round(val * factor) / factor;

  if (isDatabaseConfigured()) {
    return await tenantDb.grade.upsert({
      where: {
        assessmentId_enrollmentId: {
          assessmentId: data.assessmentId,
          enrollmentId: data.enrollmentId,
        },
      },
      update: {
        value: roundedValue,
      },
      create: {
        schoolId,
        assessmentId: data.assessmentId,
        enrollmentId: data.enrollmentId,
        value: roundedValue,
      },
    });
  }

  return {
    id: `gr_demo_${Date.now()}`,
    schoolId,
    assessmentId: data.assessmentId,
    enrollmentId: data.enrollmentId,
    value: roundedValue,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export interface UpdateGradeData {
  value?: number;
  comment?: string;
  feedback?: string;
}

export async function updateGrade(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  gradeId: string,
  data: UpdateGradeData,
  userId: string
) {
  const config = await getSchoolGradingConfig(tenantDb, schoolId);

  let roundedValue: number | undefined = undefined;
  if (data.value !== undefined) {
    const val = Number(data.value);
    if (isNaN(val) || val < config.minGrade || val > config.maxGrade) {
      throw new GradeServiceError(
        `La calificación (${data.value}) está fuera del rango permitido por la institución (${config.minGrade} a ${config.maxGrade}).`
      );
    }
    const factor = Math.pow(10, config.precision);
    roundedValue = Math.round(val * factor) / factor;
  }

  if (isDatabaseConfigured()) {
    return await tenantDb.grade.update({
      where: { id: gradeId, schoolId },
      data: {
        ...(roundedValue !== undefined ? { value: roundedValue } : {}),
      },
    });
  }

  return {
    id: gradeId,
    schoolId,
    value: roundedValue ?? 6.0,
    updatedAt: new Date(),
  };
}

export async function deleteGrade(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  gradeId: string,
  userId: string
) {
  if (isDatabaseConfigured()) {
    const deleted = await tenantDb.grade.delete({
      where: { id: gradeId, schoolId },
    });
    return { ...deleted, success: true };
  }
  return { id: gradeId, deleted: true, success: true };
}

export interface GradeMatrixStudent {
  enrollmentId: string;
  studentProfileId: string;
  listNumber: number;
  firstName: string;
  lastName: string;
  rut: string;
  avatarUrl: string | null;
  grades: Record<string, { gradeId?: string; value: number | null; feedback?: string }>;
}

export interface GradeMatrixAssessment {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  date: string | Date;
  weightPercentage: number;
  isPublished: boolean;
}

export interface GradeMatrixData {
  courses: Array<{
    id: string;
    name: string;
    subjects: Array<{ id: string; name: string; teacherName?: string | null }>;
  }>;
  periods: Array<{ id: string; name: string; isCurrent: boolean }>;
  selectedCourseId: string;
  selectedSubjectId: string;
  selectedPeriodId: string;
  gradingConfig: {
    minGrade: number;
    maxGrade: number;
    minPassingGrade: number;
    precision: number;
    termType: string;
  };
  assessments: GradeMatrixAssessment[];
  students: GradeMatrixStudent[];
}

export async function getGradeMatrixData(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  options?: { courseId?: string; subjectId?: string; periodId?: string }
): Promise<GradeMatrixData> {
  const config = await getSchoolGradingConfig(tenantDb, schoolId);

  if (isDatabaseConfigured()) {
    try {
      const [coursesDb, periodsDb] = await Promise.all([
        tenantDb.course.findMany({
          where: { schoolId, deletedAt: null },
          include: {
            subjects: {
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
          },
          orderBy: [{ gradeNumber: "asc" }, { letter: "asc" }],
        }),
        tenantDb.academicPeriod.findMany({
          where: { schoolId },
          orderBy: { startDate: "asc" },
        }),
      ]);

      const formattedCourses = coursesDb.map((c) => ({
        id: c.id,
        name: c.name,
        subjects: c.subjects.map((s) => ({
          id: s.id,
          name: s.name,
          teacherName: s.teacher?.membership?.user
            ? `${s.teacher.membership.user.firstName} ${s.teacher.membership.user.lastName}`
            : null,
        })),
      }));

      const formattedPeriods = periodsDb.map((p) => ({
        id: p.id,
        name: p.name,
        isCurrent: p.isCurrent,
      }));

      const selectedCourseId =
        options?.courseId || (formattedCourses.length > 0 ? formattedCourses[0].id : "crs_1_demo");
      const currentCourse = formattedCourses.find((c) => c.id === selectedCourseId) || formattedCourses[0];

      const selectedSubjectId =
        options?.subjectId || (currentCourse?.subjects?.length > 0 ? currentCourse.subjects[0].id : "sub_1_demo");

      const selectedPeriodId =
        options?.periodId ||
        (formattedPeriods.find((p) => p.isCurrent)?.id || (formattedPeriods.length > 0 ? formattedPeriods[0].id : "per_1_demo"));

      if (selectedSubjectId && selectedPeriodId) {
        // Cargar alumnos matriculados en el curso
        const [enrollments, assessmentsDb] = await Promise.all([
          tenantDb.enrollment.findMany({
            where: {
              schoolId,
              courseId: selectedCourseId,
              status: "ACTIVE",
              deletedAt: null,
            },
            include: {
              student: {
                include: {
                  membership: {
                    include: { user: true },
                  },
                },
              },
              grades: {
                where: {
                  assessment: {
                    subjectId: selectedSubjectId,
                    academicPeriodId: selectedPeriodId,
                  },
                },
              },
            },
            orderBy: [
              { student: { membership: { user: { lastName: "asc" } } } },
              { student: { membership: { user: { firstName: "asc" } } } },
            ],
          }),
          tenantDb.assessment.findMany({
            where: {
              schoolId,
              subjectId: selectedSubjectId,
              academicPeriodId: selectedPeriodId,
            },
            orderBy: { date: "asc" },
          }),
        ]);

        const assessments: GradeMatrixAssessment[] = assessmentsDb.map((ass, idx) => ({
          id: ass.id,
          code: `N${idx + 1}`,
          title: ass.title,
          description: ass.description,
          date: ass.date,
          weightPercentage: Number(ass.weightPercentage || 100),
          isPublished: ass.isPublished,
        }));

        const students: GradeMatrixStudent[] = enrollments.map((enr, index) => {
          const user = enr.student.membership.user;
          const gradesMap: Record<string, { gradeId?: string; value: number | null; feedback?: string }> = {};

          enr.grades.forEach((g) => {
            gradesMap[g.assessmentId] = {
              gradeId: g.id,
              value: Number(g.value),
              feedback: g.feedback || undefined,
            };
          });

          return {
            enrollmentId: enr.id,
            studentProfileId: enr.studentProfileId,
            listNumber: index + 1,
            firstName: user.firstName,
            lastName: user.lastName,
            rut: user.rutOrNationalId || `MAT-${2026}-${String(index + 1).padStart(3, "0")}`,
            avatarUrl: user.avatarUrl,
            grades: gradesMap,
          };
        });

        return {
          courses: formattedCourses,
          periods: formattedPeriods,
          selectedCourseId,
          selectedSubjectId,
          selectedPeriodId,
          gradingConfig: config,
          assessments,
          students,
        };
      }
    } catch {
      // Fallback a demo con datos ricos
    }
  }

  // Fallback demo data
  const demoCourses = [
    {
      id: "crs_1_demo",
      name: "1° Medio A",
      subjects: [
        { id: "sub_mat_1", name: "Matemáticas", teacherName: "Prof. Andrea Morales" },
        { id: "sub_len_1", name: "Lenguaje y Literatura", teacherName: "Prof. Carlos Fuenzalida" },
        { id: "sub_cie_1", name: "Ciencias Naturales - Física", teacherName: "Prof. Daniela Soto" },
        { id: "sub_his_1", name: "Historia, Geografía y CC.SS.", teacherName: "Prof. Roberto Vidal" },
      ],
    },
    {
      id: "crs_1b_demo",
      name: "1° Medio B",
      subjects: [
        { id: "sub_mat_2", name: "Matemáticas", teacherName: "Prof. Andrea Morales" },
        { id: "sub_len_2", name: "Lenguaje y Literatura", teacherName: "Prof. Carlos Fuenzalida" },
        { id: "sub_cie_2", name: "Ciencias Naturales - Química", teacherName: "Prof. Daniela Soto" },
      ],
    },
    {
      id: "crs_2a_demo",
      name: "2° Medio A",
      subjects: [
        { id: "sub_mat_3", name: "Matemáticas", teacherName: "Prof. Andrea Morales" },
        { id: "sub_len_3", name: "Lenguaje y Literatura", teacherName: "Prof. Carlos Fuenzalida" },
      ],
    },
  ];

  const demoPeriods = [
    { id: "per_sem1_demo", name: "Primer Semestre 2026", isCurrent: true },
    { id: "per_sem2_demo", name: "Segundo Semestre 2026", isCurrent: false },
  ];

  const selectedCourseId = options?.courseId || demoCourses[0].id;
  const currentCourse = demoCourses.find((c) => c.id === selectedCourseId) || demoCourses[0];
  const selectedSubjectId = options?.subjectId || currentCourse.subjects[0].id;
  const selectedPeriodId = options?.periodId || demoPeriods[0].id;

  const demoAssessments: GradeMatrixAssessment[] = [
    {
      id: "ass_1",
      code: "N1",
      title: "Control 1: Ecuaciones de 1° Grado",
      description: "Evaluación formativa de resolución y modelamiento algebraico.",
      date: "2026-03-24",
      weightPercentage: 20,
      isPublished: true,
    },
    {
      id: "ass_2",
      code: "N2",
      title: "Prueba de Unidad: Álgebra y Funciones",
      description: "Prueba sumativa con desarrollo y selección múltiple.",
      date: "2026-04-18",
      weightPercentage: 30,
      isPublished: true,
    },
    {
      id: "ass_3",
      code: "N3",
      title: "Guía de Ejercicios y Trabajo Grupal",
      description: "Resolución colaborativa de problemas aplicados.",
      date: "2026-05-12",
      weightPercentage: 15,
      isPublished: true,
    },
    {
      id: "ass_4",
      code: "N4",
      title: "Control 2: Geometría y Teorema de Pitágoras",
      description: "Cálculo de áreas, perímetros y congruencia de triángulos.",
      date: "2026-06-04",
      weightPercentage: 20,
      isPublished: true,
    },
    {
      id: "ass_5",
      code: "N5",
      title: "Examen Semestral / Proyecto Síntesis",
      description: "Evaluación integral de los contenidos semestrales.",
      date: "2026-06-26",
      weightPercentage: 15,
      isPublished: false,
    },
  ];

  const demoStudents: GradeMatrixStudent[] = [
    {
      enrollmentId: "enr_1",
      studentProfileId: "std_1",
      listNumber: 1,
      firstName: "Martina Paz",
      lastName: "Álvarez González",
      rut: "21.456.789-0",
      avatarUrl: null,
      grades: {
        ass_1: { gradeId: "g_1_1", value: 6.8 },
        ass_2: { gradeId: "g_1_2", value: 6.5 },
        ass_3: { gradeId: "g_1_3", value: 7.0 },
        ass_4: { gradeId: "g_1_4", value: 6.2 },
        ass_5: { gradeId: "g_1_5", value: 6.7 },
      },
    },
    {
      enrollmentId: "enr_2",
      studentProfileId: "std_2",
      listNumber: 2,
      firstName: "Benjamín Ignacio",
      lastName: "Castro Silva",
      rut: "21.678.901-2",
      avatarUrl: null,
      grades: {
        ass_1: { gradeId: "g_2_1", value: 3.5 }, // ROJA
        ass_2: { gradeId: "g_2_2", value: 3.8 }, // ROJA
        ass_3: { gradeId: "g_2_3", value: 4.5 },
        ass_4: { gradeId: "g_2_4", value: 3.2 }, // ROJA
        ass_5: { gradeId: "g_2_5", value: 4.0 },
      },
    },
    {
      enrollmentId: "enr_3",
      studentProfileId: "std_3",
      listNumber: 3,
      firstName: "Valentina Isidora",
      lastName: "Díaz Morales",
      rut: "21.890.123-4",
      avatarUrl: null,
      grades: {
        ass_1: { gradeId: "g_3_1", value: 5.4 },
        ass_2: { gradeId: "g_3_2", value: 5.8 },
        ass_3: { gradeId: "g_3_3", value: 6.0 },
        ass_4: { gradeId: "g_3_4", value: 5.2 },
        ass_5: { gradeId: "g_3_5", value: null },
      },
    },
    {
      enrollmentId: "enr_4",
      studentProfileId: "std_4",
      listNumber: 4,
      firstName: "Lucas Matías",
      lastName: "Fuenzalida Reyes",
      rut: "21.901.234-5",
      avatarUrl: null,
      grades: {
        ass_1: { gradeId: "g_4_1", value: 4.2 },
        ass_2: { gradeId: "g_4_2", value: 3.6 }, // ROJA
        ass_3: { gradeId: "g_4_3", value: 5.0 },
        ass_4: { gradeId: "g_4_4", value: 4.8 },
        ass_5: { gradeId: "g_4_5", value: null },
      },
    },
    {
      enrollmentId: "enr_5",
      studentProfileId: "std_5",
      listNumber: 5,
      firstName: "Sofía Antonia",
      lastName: "Herrera Muñoz",
      rut: "21.012.345-6",
      avatarUrl: null,
      grades: {
        ass_1: { gradeId: "g_5_1", value: 6.2 },
        ass_2: { gradeId: "g_5_2", value: 6.0 },
        ass_3: { gradeId: "g_5_3", value: 6.8 },
        ass_4: { gradeId: "g_5_4", value: 5.9 },
        ass_5: { gradeId: "g_5_5", value: 6.4 },
      },
    },
    {
      enrollmentId: "enr_6",
      studentProfileId: "std_6",
      listNumber: 6,
      firstName: "Gabriel Esteban",
      lastName: "López Navarro",
      rut: "21.123.456-7",
      avatarUrl: null,
      grades: {
        ass_1: { gradeId: "g_6_1", value: 3.1 }, // ROJA
        ass_2: { gradeId: "g_6_2", value: 2.8 }, // ROJA
        ass_3: { gradeId: "g_6_3", value: 4.0 },
        ass_4: { gradeId: "g_6_4", value: 3.4 }, // ROJA
        ass_5: { gradeId: "g_6_5", value: null },
      },
    },
    {
      enrollmentId: "enr_7",
      studentProfileId: "std_7",
      listNumber: 7,
      firstName: "Camila Belén",
      lastName: "Muñoz Contreras",
      rut: "21.234.567-8",
      avatarUrl: null,
      grades: {
        ass_1: { gradeId: "g_7_1", value: 5.7 },
        ass_2: { gradeId: "g_7_2", value: 6.1 },
        ass_3: { gradeId: "g_7_3", value: 5.5 },
        ass_4: { gradeId: "g_7_4", value: 6.3 },
        ass_5: { gradeId: "g_7_5", value: null },
      },
    },
    {
      enrollmentId: "enr_8",
      studentProfileId: "std_8",
      listNumber: 8,
      firstName: "Diego Alonso",
      lastName: "Rojas Silva",
      rut: "21.345.678-9",
      avatarUrl: null,
      grades: {
        ass_1: { gradeId: "g_8_1", value: 4.8 },
        ass_2: { gradeId: "g_8_2", value: 5.2 },
        ass_3: { gradeId: "g_8_3", value: 4.9 },
        ass_4: { gradeId: "g_8_4", value: 5.1 },
        ass_5: { gradeId: "g_8_5", value: 5.3 },
      },
    },
  ];

  return {
    courses: demoCourses,
    periods: demoPeriods,
    selectedCourseId,
    selectedSubjectId,
    selectedPeriodId,
    gradingConfig: config,
    assessments: demoAssessments,
    students: demoStudents,
  };
}

export interface CreateAssessmentData {
  subjectId: string;
  academicPeriodId: string;
  title: string;
  description?: string;
  date?: string | Date;
  weightPercentage?: number;
  isPublished?: boolean;
}

export async function createAssessment(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  data: CreateAssessmentData,
  userId?: string
) {
  const assDate = data.date ? new Date(data.date) : new Date();

  if (isDatabaseConfigured()) {
    return await tenantDb.assessment.create({
      data: {
        schoolId,
        subjectId: data.subjectId,
        academicPeriodId: data.academicPeriodId,
        title: data.title,
        description: data.description || null,
        date: assDate,
        weightPercentage: data.weightPercentage ?? 100,
        isPublished: data.isPublished ?? true,
      },
    });
  }

  return {
    id: `ass_custom_${Date.now()}`,
    schoolId,
    subjectId: data.subjectId,
    academicPeriodId: data.academicPeriodId,
    title: data.title,
    description: data.description || null,
    date: assDate,
    weightPercentage: data.weightPercentage ?? 100,
    isPublished: data.isPublished ?? true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

export interface UpdateAssessmentData {
  title?: string;
  description?: string;
  date?: string | Date;
  weightPercentage?: number;
  isPublished?: boolean;
}

export async function updateAssessment(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  assessmentId: string,
  data: UpdateAssessmentData,
  userId?: string
) {
  if (isDatabaseConfigured()) {
    return await tenantDb.assessment.update({
      where: { id: assessmentId, schoolId },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.date !== undefined ? { date: new Date(data.date) } : {}),
        ...(data.weightPercentage !== undefined ? { weightPercentage: data.weightPercentage } : {}),
        ...(data.isPublished !== undefined ? { isPublished: data.isPublished } : {}),
      },
    });
  }

  return {
    id: assessmentId,
    schoolId,
    title: data.title,
    description: data.description,
    weightPercentage: data.weightPercentage,
    isPublished: data.isPublished,
    updatedAt: new Date(),
  };
}

export async function deleteAssessment(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  assessmentId: string,
  userId?: string
) {
  if (isDatabaseConfigured()) {
    await tenantDb.assessment.delete({
      where: { id: assessmentId, schoolId },
    });
    return { success: true, id: assessmentId };
  }

  return { success: true, id: assessmentId, deleted: true };
}

export async function saveBulkMatrixGrades(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  grades: Array<{ assessmentId: string; enrollmentId: string; value: number; feedback?: string }>,
  userId?: string
) {
  const config = await getSchoolGradingConfig(tenantDb, schoolId);
  const factor = Math.pow(10, config.precision);

  const results: any[] = [];
  let savedCount = 0;

  for (const item of grades) {
    const val = Number(item.value);
    if (isNaN(val) || val < config.minGrade || val > config.maxGrade) {
      continue;
    }
    const roundedValue = Math.round(val * factor) / factor;

    if (isDatabaseConfigured()) {
      const g = await tenantDb.grade.upsert({
        where: {
          assessmentId_enrollmentId: {
            assessmentId: item.assessmentId,
            enrollmentId: item.enrollmentId,
          },
        },
        update: {
          value: roundedValue,
          ...(item.feedback !== undefined ? { feedback: item.feedback } : {}),
        },
        create: {
          schoolId,
          assessmentId: item.assessmentId,
          enrollmentId: item.enrollmentId,
          value: roundedValue,
          feedback: item.feedback,
        },
      });
      results.push(g);
    } else {
      results.push({
        id: `gr_${item.assessmentId}_${item.enrollmentId}`,
        schoolId,
        assessmentId: item.assessmentId,
        enrollmentId: item.enrollmentId,
        value: roundedValue,
      });
    }
    savedCount++;
  }

  return {
    success: true,
    savedCount,
    totalReceived: grades.length,
    grades: results,
  };
}
