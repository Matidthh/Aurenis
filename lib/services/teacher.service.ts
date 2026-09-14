import { TenantPrismaClient } from "@/lib/db/tenant-extension";
import { isDatabaseConfigured } from "@/lib/db/prisma";

export interface TeacherItem {
  id: string;
  specialty?: string | null;
  membership: {
    id: string;
    isActive: boolean;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      rutOrNationalId?: string | null;
      phone?: string | null;
      avatarUrl?: string | null;
    };
  };
  subjects: {
    id: string;
    name: string;
    code?: string | null;
    hoursPerWeek: number;
    courseId: string;
    course: {
      id: string;
      name: string;
      gradeNumber?: number;
      educationLevel?: { id: string; name: string } | null;
    };
  }[];
}

export async function listTeachersBySchool(tenantDb: TenantPrismaClient, schoolId: string): Promise<TeacherItem[]> {
  if (isDatabaseConfigured()) {
    try {
      const teachers = await tenantDb.teacherProfile.findMany({
        where: {
          membership: { schoolId },
        },
        include: {
          membership: {
            include: { user: true },
          },
          subjects: {
            where: { schoolId },
            include: {
              course: {
                include: { educationLevel: true },
              },
            },
            orderBy: { name: "asc" },
          },
        },
        orderBy: {
          membership: {
            user: { lastName: "asc" },
          },
        },
      });

      if (teachers.length > 0) return teachers as unknown as TeacherItem[];
    } catch {
      // Fallback a demo si falla la conexión
    }
  }

  return [
    {
      id: "tp_1_demo",
      specialty: "Matemáticas y Física",
      membership: {
        id: "mem_1_demo",
        isActive: true,
        user: {
          id: "u_tch_1",
          firstName: "Roberto",
          lastName: "Navarro",
          email: "roberto.navarro@sanjose.cl",
          rutOrNationalId: "15.456.789-0",
          phone: "+56 9 8765 4321",
        },
      },
      subjects: [
        {
          id: "sub_1",
          name: "Matemáticas",
          code: "MAT-101",
          hoursPerWeek: 6,
          courseId: "course_1a_demo",
          course: { id: "course_1a_demo", name: "1° Básico A", gradeNumber: 1, educationLevel: { id: "lvl_basica", name: "Básica" } },
        },
        {
          id: "sub_2",
          name: "Matemáticas",
          code: "MAT-201",
          hoursPerWeek: 6,
          courseId: "course_2a_demo",
          course: { id: "course_2a_demo", name: "2° Básico A", gradeNumber: 2, educationLevel: { id: "lvl_basica", name: "Básica" } },
        },
      ],
    },
    {
      id: "tp_2_demo",
      specialty: "Lenguaje y Literatura",
      membership: {
        id: "mem_2_demo",
        isActive: true,
        user: {
          id: "u_tch_2",
          firstName: "Valeria",
          lastName: "Castro",
          email: "valeria.castro@sanjose.cl",
          rutOrNationalId: "16.567.890-1",
          phone: "+56 9 7654 3210",
        },
      },
      subjects: [
        {
          id: "sub_3",
          name: "Lenguaje y Comunicación",
          code: "LEN-101",
          hoursPerWeek: 8,
          courseId: "course_1a_demo",
          course: { id: "course_1a_demo", name: "1° Básico A", gradeNumber: 1, educationLevel: { id: "lvl_basica", name: "Básica" } },
        },
      ],
    },
    {
      id: "tp_3_demo",
      specialty: "Ciencias Naturales y Biología",
      membership: {
        id: "mem_3_demo",
        isActive: true,
        user: {
          id: "u_tch_3",
          firstName: "Esteban",
          lastName: "Morales",
          email: "esteban.morales@sanjose.cl",
          rutOrNationalId: "14.321.654-7",
          phone: "+56 9 6543 2109",
        },
      },
      subjects: [
        {
          id: "sub_4",
          name: "Ciencias Naturales",
          code: "CIE-101",
          hoursPerWeek: 4,
          courseId: "course_1a_demo",
          course: { id: "course_1a_demo", name: "1° Básico A", gradeNumber: 1, educationLevel: { id: "lvl_basica", name: "Básica" } },
        },
      ],
    },
  ];
}

export async function getTeacherDetails(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  teacherProfileId: string
) {
  if (isDatabaseConfigured()) {
    try {
      return await tenantDb.teacherProfile.findFirst({
        where: {
          id: teacherProfileId,
          membership: { schoolId },
        },
        include: {
          membership: {
            include: { user: true },
          },
          subjects: {
            where: { schoolId },
            include: {
              course: true,
              assessments: true,
            },
          },
        },
      });
    } catch {
      // Fallback a demo
    }
  }

  return null;
}
