import { PrismaClient, UserStatus, SchoolStatus, AcademicTermType } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { ALL_PERMISSIONS } from "../lib/constants/permissions";
import { DEFAULT_SCHOOL_ROLES, ROLE_PRESETS } from "../lib/constants/roles";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de la base de datos de Aurenis...");

  // 1. Sembrar todos los permisos en la tabla Permission
  console.log("1️⃣ Sembrando catálogo de permisos...");
  for (const perm of ALL_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: { description: perm.description, module: perm.module },
      create: {
        code: perm.code,
        module: perm.module,
        description: perm.description,
      },
    });
  }

  // 2. Crear o actualizar el SuperAdmin del Sistema (SYSTEM_ADMIN)
  console.log("2️⃣ Creando SuperAdmin del sistema...");
  const superAdminPassword = await bcrypt.hash("AurenisSuperAdmin2026!", 10);
  const systemAdmin = await prisma.user.upsert({
    where: { email: "admin@aurenis.com" },
    update: { isSystemAdmin: true },
    create: {
      email: "admin@aurenis.com",
      firstName: "SuperAdmin",
      lastName: "Aurenis",
      passwordHash: superAdminPassword,
      isSystemAdmin: true,
      status: UserStatus.ACTIVE,
    },
  });
  console.log(`   ✅ SuperAdmin configurado: ${systemAdmin.email}`);

  // 3. Crear Escuela de Demostración: "Colegio San José"
  console.log("3️⃣ Creando colegio de demostración: 'Colegio San José'...");
  const demoSchool = await prisma.school.upsert({
    where: { slug: "colegio-san-jose" },
    update: {},
    create: {
      name: "Colegio San José",
      slug: "colegio-san-jose",
      institutionalCode: "CSJ-001",
      city: "Santiago",
      country: "Chile",
      timezone: "America/Santiago",
      status: SchoolStatus.ACTIVE,
      settings: {
        create: {
          termType: AcademicTermType.SEMESTER,
          minPassingGrade: 4.0,
          minGrade: 1.0,
          maxGrade: 7.0,
          gradeScalePrecision: 1,
          primaryColor: "#0284c7",
        },
      },
    },
  });

  // 4. Sembrar los roles institucionales para el colegio demo
  console.log("4️⃣ Sembrando roles y permisos para 'Colegio San José'...");
  const allDbPermissions = await prisma.permission.findMany();
  const permMap = new Map(allDbPermissions.map((p) => [p.code, p.id]));

  for (const [roleKey, preset] of Object.entries(ROLE_PRESETS)) {
    const role = await prisma.role.upsert({
      where: {
        schoolId_name: {
          schoolId: demoSchool.id,
          name: preset.name,
        },
      },
      update: {
        displayName: preset.displayName,
        description: preset.description,
      },
      create: {
        schoolId: demoSchool.id,
        name: preset.name,
        displayName: preset.displayName,
        description: preset.description,
        isSystem: true,
      },
    });

    // Asociar permisos al rol
    for (const code of preset.permissions) {
      const permId = permMap.get(code);
      if (permId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permId,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permId,
          },
        });
      }
    }
  }

  // 5. Crear usuario School Admin para el Colegio San José
  console.log("5️⃣ Creando Administrador del Colegio...");
  const schoolAdminRole = await prisma.role.findFirstOrThrow({
    where: { schoolId: demoSchool.id, name: DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN },
  });

  const adminPassword = await bcrypt.hash("AdminCSJ2026!", 10);
  const schoolAdminUser = await prisma.user.upsert({
    where: { email: "director@sanjose.cl" },
    update: {},
    create: {
      email: "director@sanjose.cl",
      firstName: "Carlos",
      lastName: "Mendoza",
      rutOrNationalId: "12345678-9",
      passwordHash: adminPassword,
      status: UserStatus.ACTIVE,
    },
  });

  await prisma.membership.upsert({
    where: {
      userId_schoolId: {
        userId: schoolAdminUser.id,
        schoolId: demoSchool.id,
      },
    },
    update: {
      roleId: schoolAdminRole.id,
      isActive: true,
    },
    create: {
      userId: schoolAdminUser.id,
      schoolId: demoSchool.id,
      roleId: schoolAdminRole.id,
      isActive: true,
    },
  });
  console.log(`   ✅ Director del colegio configurado: ${schoolAdminUser.email}`);

  // 6. Crear un Profesor de demostración
  console.log("6️⃣ Creando Profesor demo...");
  const teacherRole = await prisma.role.findFirstOrThrow({
    where: { schoolId: demoSchool.id, name: DEFAULT_SCHOOL_ROLES.TEACHER },
  });

  const teacherPassword = await bcrypt.hash("Profesor2026!", 10);
  const teacherUser = await prisma.user.upsert({
    where: { email: "profesor.matematica@sanjose.cl" },
    update: {},
    create: {
      email: "profesor.matematica@sanjose.cl",
      firstName: "Roberto",
      lastName: "Gómez",
      rutOrNationalId: "15432198-7",
      passwordHash: teacherPassword,
      status: UserStatus.ACTIVE,
    },
  });

  const teacherMembership = await prisma.membership.upsert({
    where: {
      userId_schoolId: {
        userId: teacherUser.id,
        schoolId: demoSchool.id,
      },
    },
    update: {
      roleId: teacherRole.id,
      isActive: true,
    },
    create: {
      userId: teacherUser.id,
      schoolId: demoSchool.id,
      roleId: teacherRole.id,
      isActive: true,
    },
  });

  await prisma.teacherProfile.upsert({
    where: { membershipId: teacherMembership.id },
    update: {},
    create: {
      membershipId: teacherMembership.id,
      specialty: "Licenciado en Matemáticas y Física",
    },
  });
  console.log(`   ✅ Profesor configurado: ${teacherUser.email}`);

  // 7. Crear Periodo Académico actual (2026)
  console.log("7️⃣ Creando Periodos Académicos 2026...");
  await prisma.academicPeriod.upsert({
    where: { id: "period-csj-2026-s1" },
    update: {},
    create: {
      id: "period-csj-2026-s1",
      schoolId: demoSchool.id,
      name: "Primer Semestre 2026",
      year: 2026,
      startDate: new Date("2026-03-01"),
      endDate: new Date("2026-07-15"),
      isCurrent: true,
      isClosed: false,
    },
  });

  // 8. Crear Nivel Educativo y Curso
  console.log("8️⃣ Creando Nivel y Curso de prueba...");
  const levelMedia = await prisma.educationLevel.upsert({
    where: {
      schoolId_name: {
        schoolId: demoSchool.id,
        name: "Enseñanza Media",
      },
    },
    update: {},
    create: {
      schoolId: demoSchool.id,
      name: "Enseñanza Media",
      shortCode: "EM",
      orderIndex: 2,
    },
  });

  const course1MA = await prisma.course.upsert({
    where: {
      schoolId_year_name: {
        schoolId: demoSchool.id,
        year: 2026,
        name: "1° Medio A",
      },
    },
    update: {},
    create: {
      schoolId: demoSchool.id,
      educationLevelId: levelMedia.id,
      name: "1° Medio A",
      letter: "A",
      gradeNumber: 1,
      year: 2026,
    },
  });

  // 9. Crear Asignatura
  const teacherProf = await prisma.teacherProfile.findUnique({
    where: { membershipId: teacherMembership.id },
  });

  await prisma.subject.upsert({
    where: { id: "subj-csj-1ma-mat" },
    update: {},
    create: {
      id: "subj-csj-1ma-mat",
      schoolId: demoSchool.id,
      courseId: course1MA.id,
      teacherProfileId: teacherProf?.id,
      name: "Matemáticas",
      code: "MAT-1MA",
      hoursPerWeek: 6,
    },
  });

  console.log("✨ Seed completado exitosamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
