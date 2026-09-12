import { TenantPrismaClient } from "@/lib/db/tenant-extension";
import { isDatabaseConfigured } from "@/lib/db/prisma";

export interface TeacherItem {
  id: string;
  specialty?: string | null;
  membership: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      rutOrNationalId?: string | null;
    };
  };
  subjects: {
    id: string;
    name: string;
    course: {
      name: string;
      educationLevel?: { name: string } | null;
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
      membership: {
        user: {
          id: "u_tch_1",
          firstName: "Roberto",
          lastName: "Navarro",
          email: "profesor@sanjose.cl",
          rutOrNationalId: "15.456.789-0",
        },
      },
      subjects: [
        { id: "sub_1", name: "Matemáticas", course: { name: "1° Básico A", educationLevel: { name: "Básica" } } },
        { id: "sub_2", name: "Matemáticas", course: { name: "2° Básico A", educationLevel: { name: "Básica" } } },
      ],
    },
    {
      id: "tp_2_demo",
      membership: {
        user: {
          id: "u_tch_2",
          firstName: "Valeria",
          lastName: "Castro",
          email: "valeria.castro@sanjose.cl",
          rutOrNationalId: "16.567.890-1",
        },
      },
      subjects: [
        { id: "sub_3", name: "Lenguaje y Comunicación", course: { name: "1° Básico A", educationLevel: { name: "Básica" } } },
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
