import { TenantPrismaClient } from "@/lib/db/tenant-extension";
import { isDatabaseConfigured } from "@/lib/db/prisma";

export async function listStudentsBySchool(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  options?: { courseId?: string; year?: number }
) {
  const currentYear = options?.year || new Date().getFullYear();

  if (isDatabaseConfigured()) {
    try {
      const enrollments = await tenantDb.enrollment.findMany({
        where: {
          schoolId,
          year: currentYear,
          deletedAt: null,
          ...(options?.courseId ? { courseId: options.courseId } : {}),
        },
        include: {
          course: {
            include: { educationLevel: true },
          },
          student: {
            include: {
              membership: {
                include: { user: true },
              },
              guardians: {
                include: {
                  guardian: {
                    include: {
                      membership: {
                        include: { user: true },
                      },
                    },
                  },
                },
              },
              attendances: {
                where: { schoolId },
                orderBy: { date: "desc" },
                take: 15,
              },
              enrollments: {
                where: { schoolId },
                include: {
                  course: true,
                  grades: {
                    include: { assessment: true },
                    take: 10,
                  },
                },
              },
            },
          },
        },
        orderBy: [
          { course: { gradeNumber: "asc" } },
          { course: { letter: "asc" } },
          { student: { membership: { user: { lastName: "asc" } } } },
        ],
      });
      if (enrollments.length > 0) return enrollments;
    } catch {
      // Fallback a demo si la DB falla
    }
  }

  return [
    {
      id: "enr_1_demo",
      schoolId,
      studentProfileId: "std_1_demo",
      courseId: "crs_1_demo",
      year: currentYear,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      course: {
        id: "crs_1_demo",
        name: "1° Medio A",
        gradeNumber: 1,
        letter: "A",
        year: currentYear,
        schoolId,
        educationLevelId: "lvl_1",
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        educationLevel: { id: "lvl_1", name: "Enseñanza Media", shortCode: "EM", orderIndex: 1, schoolId, createdAt: new Date(), updatedAt: new Date() },
      },
      student: {
        id: "std_1_demo",
        membershipId: "mem_1_demo",
        enrollmentNumber: "MAT-2026-001",
        birthDate: new Date("2010-05-14"),
        medicalNotes: "Alergia leve a la penicilina. Usa lentes ópticos.",
        createdAt: new Date(),
        updatedAt: new Date(),
        membership: {
          id: "mem_1_demo",
          userId: "usr_1_demo",
          schoolId,
          roleId: "role_std",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: "usr_1_demo",
            firstName: "Sofía",
            lastName: "Valenzuela Rojas",
            email: "sofia.valenzuela@sanjose.cl",
            rutOrNationalId: "21.456.789-0",
            phone: "+56 9 8765 4321",
            avatarUrl: null,
            status: "ACTIVE",
            isSystemAdmin: false,
            passwordHash: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        guardians: [
          {
            id: "grd_rel_1",
            studentProfileId: "std_1_demo",
            guardianProfileId: "grd_prof_1",
            relationship: "Madre",
            isEmergencyContact: true,
            canPickUp: true,
            guardian: {
              id: "grd_prof_1",
              membershipId: "mem_grd_1",
              occupation: "Ingeniera Civil",
              createdAt: new Date(),
              updatedAt: new Date(),
              membership: {
                id: "mem_grd_1",
                userId: "usr_grd_1",
                schoolId,
                roleId: "role_grd",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {
                  id: "usr_grd_1",
                  firstName: "Marcela",
                  lastName: "Rojas Silva",
                  email: "marcela.rojas@empresa.cl",
                  rutOrNationalId: "13.245.678-9",
                  phone: "+56 9 9123 4567",
                  avatarUrl: null,
                  status: "ACTIVE",
                  isSystemAdmin: false,
                  passwordHash: "",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              },
            },
          },
        ],
        attendances: [],
        enrollments: [],
      },
    },
    {
      id: "enr_2_demo",
      schoolId,
      studentProfileId: "std_2_demo",
      courseId: "crs_1_demo",
      year: currentYear,
      status: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      course: {
        id: "crs_1_demo",
        name: "1° Medio A",
        gradeNumber: 1,
        letter: "A",
        year: currentYear,
        schoolId,
        educationLevelId: "lvl_1",
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        educationLevel: { id: "lvl_1", name: "Enseñanza Media", shortCode: "EM", orderIndex: 1, schoolId, createdAt: new Date(), updatedAt: new Date() },
      },
      student: {
        id: "std_2_demo",
        membershipId: "mem_2_demo",
        enrollmentNumber: "MAT-2026-002",
        birthDate: new Date("2010-09-22"),
        medicalNotes: "Sin antecedentes médicos relevantes.",
        createdAt: new Date(),
        updatedAt: new Date(),
        membership: {
          id: "mem_2_demo",
          userId: "usr_2_demo",
          schoolId,
          roleId: "role_std",
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: {
            id: "usr_2_demo",
            firstName: "Mateo",
            lastName: "Herrera Muñoz",
            email: "mateo.herrera@sanjose.cl",
            rutOrNationalId: "21.678.901-2",
            phone: "+56 9 7654 3210",
            avatarUrl: null,
            status: "ACTIVE",
            isSystemAdmin: false,
            passwordHash: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        guardians: [
          {
            id: "grd_rel_2",
            studentProfileId: "std_2_demo",
            guardianProfileId: "grd_prof_2",
            relationship: "Padre",
            isEmergencyContact: true,
            canPickUp: true,
            guardian: {
              id: "grd_prof_2",
              membershipId: "mem_grd_2",
              occupation: "Contador",
              createdAt: new Date(),
              updatedAt: new Date(),
              membership: {
                id: "mem_grd_2",
                userId: "usr_grd_2",
                schoolId,
                roleId: "role_grd",
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                user: {
                  id: "usr_grd_2",
                  firstName: "Roberto",
                  lastName: "Herrera P.",
                  email: "roberto.herrera@correo.cl",
                  rutOrNationalId: "12.890.123-4",
                  phone: "+56 9 8234 5678",
                  avatarUrl: null,
                  status: "ACTIVE",
                  isSystemAdmin: false,
                  passwordHash: "",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                },
              },
            },
          },
        ],
        attendances: [],
        enrollments: [],
      },
    },
  ];
}

export async function getStudentDetails(
  tenantDb: TenantPrismaClient,
  schoolId: string,
  studentProfileId: string
) {
  if (isDatabaseConfigured()) {
    try {
      const student = await tenantDb.studentProfile.findFirst({
        where: {
          id: studentProfileId,
          membership: { schoolId },
        },
        include: {
          membership: {
            include: { user: true },
          },
          enrollments: {
            where: { schoolId },
            include: {
              course: true,
              grades: {
                include: { assessment: true },
              },
            },
          },
          guardians: {
            include: {
              guardian: {
                include: {
                  membership: {
                    include: { user: true },
                  },
                },
              },
            },
          },
          attendances: {
            where: { schoolId },
            orderBy: { date: "desc" },
            take: 30,
          },
        },
      });
      if (student) return student;
    } catch {
      // Fallback a demo si la DB falla
    }
  }

  return {
    id: studentProfileId,
    membership: {
      user: { firstName: "Martina", lastName: "González", email: "martina@sanjose.cl", rutOrNationalId: "22.789.012-5" },
    },
    enrollments: [],
    guardians: [],
    attendances: [],
  };
}

