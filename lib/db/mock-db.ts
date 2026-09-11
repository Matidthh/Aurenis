import * as bcrypt from "bcryptjs";
import { ALL_PERMISSIONS } from "../constants/permissions";
import { DEFAULT_SCHOOL_ROLES, ROLE_PRESETS } from "../constants/roles";

// In-memory data store for Aurenis
interface MockStore {
  users: Map<string, any>;
  schools: Map<string, any>;
  schoolSettings: Map<string, any>;
  memberships: Map<string, any>;
  roles: Map<string, any>;
  permissions: Map<string, any>;
  rolePermissions: Map<string, any>;
  academicPeriods: Map<string, any>;
  educationLevels: Map<string, any>;
  courses: Map<string, any>;
  subjects: Map<string, any>;
  teacherProfiles: Map<string, any>;
  studentProfiles: Map<string, any>;
  guardianProfiles: Map<string, any>;
  studentGuardians: Map<string, any>;
  enrollments: Map<string, any>;
  assessments: Map<string, any>;
  grades: Map<string, any>;
  attendanceRecords: Map<string, any>;
  auditLogs: any[];
}

function initStore(): MockStore {
  const store: MockStore = {
    users: new Map(),
    schools: new Map(),
    schoolSettings: new Map(),
    memberships: new Map(),
    roles: new Map(),
    permissions: new Map(),
    rolePermissions: new Map(),
    academicPeriods: new Map(),
    educationLevels: new Map(),
    courses: new Map(),
    subjects: new Map(),
    teacherProfiles: new Map(),
    studentProfiles: new Map(),
    guardianProfiles: new Map(),
    studentGuardians: new Map(),
    enrollments: new Map(),
    assessments: new Map(),
    grades: new Map(),
    attendanceRecords: new Map(),
    auditLogs: [],
  };

  // 1. Permissions
  ALL_PERMISSIONS.forEach((p, idx) => {
    const perm = { id: `perm-${idx + 1}`, code: p.code, module: p.module, description: p.description };
    store.permissions.set(perm.id, perm);
  });

  // 2. SuperAdmin User
  const adminPasswordHash = bcrypt.hashSync("AurenisSuperAdmin2026!", 10);
  const superAdmin = {
    id: "user-super-admin",
    email: "admin@aurenis.com",
    firstName: "SuperAdmin",
    lastName: "Aurenis",
    passwordHash: adminPasswordHash,
    rutOrNationalId: "1-9",
    status: "ACTIVE",
    isSystemAdmin: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.users.set(superAdmin.id, superAdmin);

  // 3. School: Colegio San José
  const school = {
    id: "school-csj-001",
    slug: "colegio-san-jose",
    name: "Colegio San José",
    institutionalCode: "CSJ-001",
    city: "Santiago",
    country: "Chile",
    timezone: "America/Santiago",
    status: "ACTIVE",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.schools.set(school.id, school);

  // School Settings
  const settings = {
    id: "settings-csj-001",
    schoolId: school.id,
    termType: "SEMESTER",
    minPassingGrade: 4.0,
    minGrade: 1.0,
    maxGrade: 7.0,
    gradeScalePrecision: 1,
    primaryColor: "#0284c7",
    requireAttendanceNote: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.schoolSettings.set(settings.id, settings);

  // 4. Roles for Colegio San José
  const roleMap: Record<string, any> = {};
  for (const preset of Object.values(ROLE_PRESETS)) {
    const role = {
      id: `role-${preset.name.toLowerCase()}`,
      schoolId: school.id,
      name: preset.name,
      displayName: preset.displayName,
      description: preset.description,
      isSystem: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.roles.set(role.id, role);
    roleMap[preset.name] = role;

    // Associate permissions
    for (const code of preset.permissions) {
      const perm = Array.from(store.permissions.values()).find((p) => p.code === code);
      if (perm) {
        const rp = {
          id: `rp-${role.id}-${perm.id}`,
          roleId: role.id,
          permissionId: perm.id,
        };
        store.rolePermissions.set(rp.id, rp);
      }
    }
  }

  // 5. School Admin User: Carlos Mendoza
  const directorPassword = bcrypt.hashSync("AdminCSJ2026!", 10);
  const director = {
    id: "user-director",
    email: "director@sanjose.cl",
    firstName: "Carlos",
    lastName: "Mendoza",
    rutOrNationalId: "12345678-9",
    passwordHash: directorPassword,
    status: "ACTIVE",
    isSystemAdmin: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.users.set(director.id, director);

  const directorMem = {
    id: "mem-director",
    userId: director.id,
    schoolId: school.id,
    roleId: roleMap[DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN].id,
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.memberships.set(directorMem.id, directorMem);

  // 6. Teacher User: Roberto Gómez
  const teacherPassword = bcrypt.hashSync("Profesor2026!", 10);
  const teacher = {
    id: "user-teacher-roberto",
    email: "profesor.matematica@sanjose.cl",
    firstName: "Roberto",
    lastName: "Gómez",
    rutOrNationalId: "15432198-7",
    passwordHash: teacherPassword,
    status: "ACTIVE",
    isSystemAdmin: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.users.set(teacher.id, teacher);

  const teacherMem = {
    id: "mem-teacher-roberto",
    userId: teacher.id,
    schoolId: school.id,
    roleId: roleMap[DEFAULT_SCHOOL_ROLES.TEACHER].id,
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.memberships.set(teacherMem.id, teacherMem);

  const teacherProfile = {
    id: "tp-roberto",
    membershipId: teacherMem.id,
    specialty: "Licenciado en Matemáticas y Física",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.teacherProfiles.set(teacherProfile.id, teacherProfile);

  // 7. Academic Period (Current 2026)
  const currentYear = new Date().getFullYear();
  const period = {
    id: "period-csj-2026-s1",
    schoolId: school.id,
    name: `Primer Semestre ${currentYear}`,
    year: currentYear,
    startDate: new Date(`${currentYear}-03-01`),
    endDate: new Date(`${currentYear}-07-15`),
    isCurrent: true,
    isClosed: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.academicPeriods.set(period.id, period);

  // 8. Education Level & Courses
  const levelMedia = {
    id: "level-media",
    schoolId: school.id,
    name: "Enseñanza Media",
    shortCode: "EM",
    orderIndex: 2,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.educationLevels.set(levelMedia.id, levelMedia);

  const course1MA = {
    id: "course-1ma",
    schoolId: school.id,
    educationLevelId: levelMedia.id,
    name: "1° Medio A",
    letter: "A",
    gradeNumber: 1,
    year: currentYear,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.courses.set(course1MA.id, course1MA);

  const course2MA = {
    id: "course-2ma",
    schoolId: school.id,
    educationLevelId: levelMedia.id,
    name: "2° Medio A",
    letter: "A",
    gradeNumber: 2,
    year: currentYear,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.courses.set(course2MA.id, course2MA);

  // 9. Subjects
  const subjectMath = {
    id: "subj-csj-1ma-mat",
    schoolId: school.id,
    courseId: course1MA.id,
    teacherProfileId: teacherProfile.id,
    name: "Matemáticas",
    code: "MAT-1MA",
    hoursPerWeek: 6,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.subjects.set(subjectMath.id, subjectMath);

  const subjectLanguage = {
    id: "subj-csj-1ma-len",
    schoolId: school.id,
    courseId: course1MA.id,
    teacherProfileId: null,
    name: "Lenguaje y Comunicación",
    code: "LEN-1MA",
    hoursPerWeek: 6,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.subjects.set(subjectLanguage.id, subjectLanguage);

  const subjectHistory = {
    id: "subj-csj-1ma-his",
    schoolId: school.id,
    courseId: course1MA.id,
    teacherProfileId: null,
    name: "Historia y Geografía",
    code: "HIS-1MA",
    hoursPerWeek: 4,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.subjects.set(subjectHistory.id, subjectHistory);

  // 10. Demo Students & Enrollments
  const demoStudents = [
    { id: "std-1", first: "Sofía", last: "Valenzuela", email: "sofia.valenzuela@sanjose.cl", rut: "22345678-1" },
    { id: "std-2", first: "Mateo", last: "Silva", email: "mateo.silva@sanjose.cl", rut: "22456789-2" },
    { id: "std-3", first: "Valentina", last: "Rojas", email: "valentina.rojas@sanjose.cl", rut: "22567890-3" },
    { id: "std-4", first: "Lucas", last: "Muñoz", email: "lucas.munoz@sanjose.cl", rut: "22678901-4" },
    { id: "std-5", first: "Isidora", last: "Castro", email: "isidora.castro@sanjose.cl", rut: "22789012-5" },
  ];

  // Guardian for Sofia
  const guardianUser = {
    id: "user-guardian-1",
    email: "maria.gonzalez@sanjose.cl",
    firstName: "María",
    lastName: "González",
    phone: "+56 9 8765 4321",
    passwordHash: bcrypt.hashSync("Apoderado2026!", 10),
    status: "ACTIVE",
    isSystemAdmin: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.users.set(guardianUser.id, guardianUser);

  const guardianMem = {
    id: "mem-guardian-1",
    userId: guardianUser.id,
    schoolId: school.id,
    roleId: roleMap[DEFAULT_SCHOOL_ROLES.GUARDIAN].id,
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.memberships.set(guardianMem.id, guardianMem);

  const guardianProfile = {
    id: "gp-maria",
    membershipId: guardianMem.id,
    occupation: "Contadora",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.guardianProfiles.set(guardianProfile.id, guardianProfile);

  const studentEnrollments: any[] = [];

  demoStudents.forEach((st, idx) => {
    const studentUser = {
      id: `user-student-${idx + 1}`,
      email: st.email,
      firstName: st.first,
      lastName: st.last,
      rutOrNationalId: st.rut,
      passwordHash: bcrypt.hashSync("Estudiante2026!", 10),
      status: "ACTIVE",
      isSystemAdmin: false,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.users.set(studentUser.id, studentUser);

    const mem = {
      id: `mem-student-${idx + 1}`,
      userId: studentUser.id,
      schoolId: school.id,
      roleId: roleMap[DEFAULT_SCHOOL_ROLES.STUDENT].id,
      isActive: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.memberships.set(mem.id, mem);

    const sp = {
      id: `sp-${idx + 1}`,
      membershipId: mem.id,
      enrollmentNumber: `MAT-2026-00${idx + 1}`,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.studentProfiles.set(sp.id, sp);

    if (idx === 0) {
      const sg = {
        id: "sg-1",
        studentProfileId: sp.id,
        guardianProfileId: guardianProfile.id,
        relationship: "Madre",
        isEmergencyContact: true,
        canPickUp: true,
      };
      store.studentGuardians.set(sg.id, sg);
    }

    const enr = {
      id: `enr-${idx + 1}`,
      schoolId: school.id,
      courseId: course1MA.id,
      studentProfileId: sp.id,
      year: currentYear,
      status: "ACTIVE",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.enrollments.set(enr.id, enr);
    studentEnrollments.push(enr);
  });

  // 11. Assessments & Grades
  const assessment1 = {
    id: "ass-1",
    schoolId: school.id,
    subjectId: subjectMath.id,
    academicPeriodId: period.id,
    title: "Control N°1: Álgebra y Ecuaciones Lineales",
    description: "Evaluación formativa de resolución de ecuaciones de primer grado y sistemas lineales.",
    date: new Date(),
    weightPercentage: 25.0,
    isPublished: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.assessments.set(assessment1.id, assessment1);

  const sampleGrades = [6.5, 5.8, 4.2, 6.9, 3.5];
  studentEnrollments.forEach((enr, idx) => {
    const grade = {
      id: `grade-1-${idx + 1}`,
      schoolId: school.id,
      assessmentId: assessment1.id,
      enrollmentId: enr.id,
      value: sampleGrades[idx] ?? 5.0,
      feedback: idx === 4 ? "Requiere reforzamiento en despeje de variables" : "Buen desempeño",
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.grades.set(grade.id, grade);
  });

  // 12. Attendance Records
  const today = new Date();
  const statuses = ["PRESENT", "PRESENT", "LATE", "ABSENT_JUSTIFIED", "PRESENT"];
  const justifications = [null, null, "Atraso de 15 minutos por congestión", "Licencia médica adjunta", null];

  studentEnrollments.forEach((enr, idx) => {
    const att = {
      id: `att-${idx + 1}`,
      schoolId: school.id,
      courseId: course1MA.id,
      studentProfileId: enr.studentProfileId,
      date: today,
      status: statuses[idx] ?? "PRESENT",
      justification: justifications[idx] ?? null,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.attendanceRecords.set(att.id, att);
  });

  return store;
}

// Global store instance
const globalStore = (globalThis as any).__aurenis_mock_store ?? initStore();
if (process.env.NODE_ENV !== "production") {
  (globalThis as any).__aurenis_mock_store = globalStore;
}

export function getMockStore(): MockStore {
  return globalStore;
}

// Model handler builders
export function createMockPrisma() {
  const store = getMockStore();

  function matchWhere(item: any, where?: Record<string, any>): boolean {
    if (!where) return true;
    for (const [key, val] of Object.entries(where)) {
      if (val === undefined) continue;
      if (key === "NOT") {
        if (matchWhere(item, val)) return false;
        continue;
      }
      if (key === "OR") {
        if (Array.isArray(val)) {
          if (!val.some((sub) => matchWhere(item, sub))) return false;
        }
        continue;
      }
      if (key === "AND") {
        if (Array.isArray(val)) {
          if (!val.every((sub) => matchWhere(item, sub))) return false;
        }
        continue;
      }
      if (val !== null && typeof val === "object" && !Array.isArray(val) && !(val instanceof Date)) {
        // Nested relation check or operators (equals, in, etc.)
        if ("equals" in val) {
          if (item[key] !== val.equals) return false;
        } else if ("in" in val) {
          if (!Array.isArray(val.in) || !val.in.includes(item[key])) return false;
        } else if (item[key] !== null && typeof item[key] === "object") {
          if (!matchWhere(item[key], val)) return false;
        }
      } else {
        if (item[key] !== val) return false;
      }
    }
    return true;
  }

  // Model implementations
  return {
    user: {
      async findUnique(args: any) {
        const where = args?.where;
        for (const user of store.users.values()) {
          if (where.id && user.id === where.id) return hydrateUser(user, args?.include);
          if (where.email && user.email.toLowerCase() === where.email.toLowerCase()) {
            return hydrateUser(user, args?.include);
          }
        }
        return null;
      },
      async findFirst(args: any) {
        for (const user of store.users.values()) {
          if (matchWhere(user, args?.where)) return hydrateUser(user, args?.include);
        }
        return null;
      },
      async findMany(args?: any) {
        const result: any[] = [];
        for (const user of store.users.values()) {
          if (matchWhere(user, args?.where)) result.push(hydrateUser(user, args?.include));
        }
        return result;
      },
      async count(args?: any) {
        let cnt = 0;
        for (const user of store.users.values()) {
          if (matchWhere(user, args?.where)) cnt++;
        }
        return cnt;
      },
      async create(args: any) {
        const id = args.data.id || `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const user = { ...args.data, id, createdAt: new Date(), updatedAt: new Date() };
        store.users.set(id, user);
        return hydrateUser(user, args.include);
      },
      async upsert(args: any) {
        const found = await this.findUnique({ where: args.where });
        if (found) {
          Object.assign(found, args.update || {});
          store.users.set(found.id, found);
          return hydrateUser(found, args.include);
        }
        return this.create({ data: args.create, include: args.include });
      },
    },

    school: {
      async findUnique(args: any) {
        const where = args?.where;
        for (const school of store.schools.values()) {
          if (where.id && school.id === where.id) return hydrateSchool(school, args?.include);
          if (where.slug && school.slug === where.slug) return hydrateSchool(school, args?.include);
        }
        return null;
      },
      async findUniqueOrThrow(args: any) {
        const res = await this.findUnique(args);
        if (!res) throw new Error("School not found");
        return res;
      },
      async findFirst(args: any) {
        for (const school of store.schools.values()) {
          if (matchWhere(school, args?.where)) return hydrateSchool(school, args?.include);
        }
        return null;
      },
      async findMany(args?: any) {
        let result: any[] = [];
        for (const s of store.schools.values()) {
          if (matchWhere(s, args?.where)) result.push(hydrateSchool(s, args?.include));
        }
        if (args?.orderBy?.createdAt === "desc") {
          result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        if (args?.take) {
          result = result.slice(0, args.take);
        }
        return result;
      },
      async count(args?: any) {
        let cnt = 0;
        for (const s of store.schools.values()) {
          if (matchWhere(s, args?.where)) cnt++;
        }
        return cnt;
      },
      async create(args: any) {
        const id = args.data.id || `school-${Date.now()}`;
        const { settings, ...rest } = args.data;
        const school = { ...rest, id, createdAt: new Date(), updatedAt: new Date() };
        store.schools.set(id, school);

        if (settings?.create) {
          const settingsId = `settings-${Date.now()}`;
          const s = { ...settings.create, id: settingsId, schoolId: id, createdAt: new Date(), updatedAt: new Date() };
          store.schoolSettings.set(settingsId, s);
        }
        return hydrateSchool(school, args.include);
      },
      async upsert(args: any) {
        const found = await this.findUnique({ where: args.where });
        if (found) {
          Object.assign(found, args.update || {});
          store.schools.set(found.id, found);
          return hydrateSchool(found, args.include);
        }
        return this.create({ data: args.create, include: args.include });
      },
    },

    schoolSettings: {
      async findUnique(args: any) {
        const where = args?.where;
        for (const s of store.schoolSettings.values()) {
          if (where.schoolId && s.schoolId === where.schoolId) return s;
          if (where.id && s.id === where.id) return s;
        }
        return null;
      },
      async update(args: any) {
        const where = args?.where;
        let target: any = null;
        for (const s of store.schoolSettings.values()) {
          if (where.schoolId && s.schoolId === where.schoolId) {
            target = s;
            break;
          }
        }
        if (!target) {
          target = { id: `settings-${Date.now()}`, schoolId: where.schoolId, createdAt: new Date(), updatedAt: new Date() };
          store.schoolSettings.set(target.id, target);
        }
        Object.assign(target, args.data || {}, { updatedAt: new Date() });
        return target;
      },
      async upsert(args: any) {
        let found = await this.findUnique({ where: args.where });
        if (found) {
          Object.assign(found, args.update || {});
          return found;
        }
        const id = `settings-${Date.now()}`;
        const item = { ...args.create, id };
        store.schoolSettings.set(id, item);
        return item;
      },
    },

    membership: {
      async findUnique(args: any) {
        const where = args?.where;
        if (where.userId_schoolId) {
          for (const m of store.memberships.values()) {
            if (m.userId === where.userId_schoolId.userId && m.schoolId === where.userId_schoolId.schoolId) {
              return hydrateMembership(m, args.include);
            }
          }
        }
        if (where.id) {
          const m = store.memberships.get(where.id);
          return m ? hydrateMembership(m, args.include) : null;
        }
        return null;
      },
      async findFirst(args: any) {
        for (const m of store.memberships.values()) {
          if (matchWhere(m, args?.where)) return hydrateMembership(m, args?.include);
        }
        return null;
      },
      async findMany(args?: any) {
        const result: any[] = [];
        for (const m of store.memberships.values()) {
          if (matchWhere(m, args?.where)) result.push(hydrateMembership(m, args?.include));
        }
        return result;
      },
      async count(args?: any) {
        let cnt = 0;
        for (const m of store.memberships.values()) {
          if (matchWhere(m, args?.where)) cnt++;
        }
        return cnt;
      },
      async create(args: any) {
        const id = args.data.id || `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const item = { ...args.data, id, createdAt: new Date(), updatedAt: new Date() };
        store.memberships.set(id, item);
        return hydrateMembership(item, args.include);
      },
      async upsert(args: any) {
        const found = await this.findUnique({ where: args.where });
        if (found) {
          Object.assign(found, args.update || {});
          store.memberships.set(found.id, found);
          return hydrateMembership(found, args.include);
        }
        return this.create({ data: args.create, include: args.include });
      },
    },

    role: {
      async findUnique(args: any) {
        const where = args?.where;
        if (where.schoolId_name) {
          for (const r of store.roles.values()) {
            if (r.schoolId === where.schoolId_name.schoolId && r.name === where.schoolId_name.name) {
              return hydrateRole(r, args?.include);
            }
          }
        }
        if (where.id) {
          const r = store.roles.get(where.id);
          return r ? hydrateRole(r, args?.include) : null;
        }
        return null;
      },
      async findFirst(args: any) {
        for (const r of store.roles.values()) {
          if (matchWhere(r, args?.where)) return hydrateRole(r, args?.include);
        }
        return null;
      },
      async findFirstOrThrow(args: any) {
        const r = await this.findFirst(args);
        if (!r) throw new Error("Role not found");
        return r;
      },
      async findMany(args?: any) {
        const result: any[] = [];
        for (const r of store.roles.values()) {
          if (matchWhere(r, args?.where)) result.push(hydrateRole(r, args?.include));
        }
        return result;
      },
      async create(args: any) {
        const id = args.data.id || `role-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const role = { ...args.data, id, createdAt: new Date(), updatedAt: new Date() };
        store.roles.set(id, role);
        return hydrateRole(role, args.include);
      },
      async upsert(args: any) {
        const found = await this.findUnique({ where: args.where });
        if (found) {
          Object.assign(found, args.update || {});
          store.roles.set(found.id, found);
          return hydrateRole(found, args.include);
        }
        return this.create({ data: args.create, include: args.include });
      },
    },

    permission: {
      async findMany() {
        return Array.from(store.permissions.values());
      },
      async upsert(args: any) {
        const found = Array.from(store.permissions.values()).find((p) => p.code === args.where.code);
        if (found) {
          Object.assign(found, args.update || {});
          return found;
        }
        const id = `perm-${Date.now()}`;
        const item = { ...args.create, id };
        store.permissions.set(id, item);
        return item;
      },
    },

    rolePermission: {
      async createMany(args: any) {
        const data = Array.isArray(args.data) ? args.data : [args.data];
        for (const item of data) {
          const id = `rp-${item.roleId}-${item.permissionId}`;
          store.rolePermissions.set(id, { ...item, id });
        }
        return { count: data.length };
      },
      async upsert(args: any) {
        const id = `rp-${args.where.roleId_permissionId.roleId}-${args.where.roleId_permissionId.permissionId}`;
        const item = { ...args.create, id };
        store.rolePermissions.set(id, item);
        return item;
      },
    },

    academicPeriod: {
      async findFirst(args: any) {
        for (const p of store.academicPeriods.values()) {
          if (matchWhere(p, args?.where)) return p;
        }
        return null;
      },
      async findMany(args?: any) {
        const res = Array.from(store.academicPeriods.values()).filter((p) => matchWhere(p, args?.where));
        return res;
      },
      async upsert(args: any) {
        const id = args.where.id || `period-${Date.now()}`;
        const found = store.academicPeriods.get(id);
        if (found) {
          Object.assign(found, args.update || {});
          return found;
        }
        const item = { ...args.create, id };
        store.academicPeriods.set(id, item);
        return item;
      },
    },

    educationLevel: {
      async findMany(args?: any) {
        return Array.from(store.educationLevels.values()).filter((el) => matchWhere(el, args?.where));
      },
      async upsert(args: any) {
        const item = { ...args.create, id: args.create.id || `level-${Date.now()}` };
        store.educationLevels.set(item.id, item);
        return item;
      },
    },

    course: {
      async findMany(args?: any) {
        const result: any[] = [];
        for (const c of store.courses.values()) {
          if (matchWhere(c, args?.where)) {
            result.push(hydrateCourse(c, args?.include));
          }
        }
        if (args?.orderBy) {
          result.sort((a, b) => a.gradeNumber - b.gradeNumber || (a.name || "").localeCompare(b.name || ""));
        }
        return result;
      },
      async count(args?: any) {
        let cnt = 0;
        for (const c of store.courses.values()) {
          if (matchWhere(c, args?.where)) cnt++;
        }
        return cnt;
      },
      async create(args: any) {
        const id = args.data.id || `course-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const item = { ...args.data, id, createdAt: new Date(), updatedAt: new Date() };
        store.courses.set(id, item);
        return hydrateCourse(item, args.include);
      },
      async upsert(args: any) {
        const item = { ...args.create, id: args.create.id || `course-${Date.now()}` };
        store.courses.set(item.id, item);
        return item;
      },
    },

    subject: {
      async findMany(args?: any) {
        const result: any[] = [];
        for (const s of store.subjects.values()) {
          if (matchWhere(s, args?.where)) {
            result.push(hydrateSubject(s, args?.include));
          }
        }
        return result;
      },
      async count(args?: any) {
        let cnt = 0;
        for (const s of store.subjects.values()) {
          if (matchWhere(s, args?.where)) cnt++;
        }
        return cnt;
      },
      async create(args: any) {
        const id = args.data.id || `subj-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const item = { ...args.data, id, createdAt: new Date(), updatedAt: new Date() };
        store.subjects.set(id, item);
        return hydrateSubject(item, args.include);
      },
      async upsert(args: any) {
        const id = args.where.id || `subj-${Date.now()}`;
        const item = { ...args.create, id };
        store.subjects.set(id, item);
        return item;
      },
    },

    teacherProfile: {
      async findMany(args?: any) {
        const result: any[] = [];
        for (const tp of store.teacherProfiles.values()) {
          if (matchWhere(tp, args?.where)) {
            result.push(hydrateTeacherProfile(tp, args?.include));
          }
        }
        return result;
      },
      async findUnique(args: any) {
        const where = args?.where;
        if (where.membershipId) {
          for (const tp of store.teacherProfiles.values()) {
            if (tp.membershipId === where.membershipId) return hydrateTeacherProfile(tp, args?.include);
          }
        }
        if (where.id) {
          const tp = store.teacherProfiles.get(where.id);
          return tp ? hydrateTeacherProfile(tp, args?.include) : null;
        }
        return null;
      },
      async findFirst(args: any) {
        for (const tp of store.teacherProfiles.values()) {
          if (matchWhere(tp, args?.where)) return hydrateTeacherProfile(tp, args?.include);
        }
        return null;
      },
      async upsert(args: any) {
        const id = `tp-${Date.now()}`;
        const item = { ...args.create, id };
        store.teacherProfiles.set(id, item);
        return item;
      },
    },

    studentProfile: {
      async findFirst(args: any) {
        for (const sp of store.studentProfiles.values()) {
          if (matchWhere(sp, args?.where)) return hydrateStudentProfile(sp, args?.include);
        }
        return null;
      },
    },

    enrollment: {
      async findMany(args?: any) {
        const result: any[] = [];
        for (const e of store.enrollments.values()) {
          if (matchWhere(e, args?.where)) {
            result.push(hydrateEnrollment(e, args?.include));
          }
        }
        return result;
      },
      async count(args?: any) {
        let cnt = 0;
        for (const e of store.enrollments.values()) {
          if (matchWhere(e, args?.where)) cnt++;
        }
        return cnt;
      },
    },

    assessment: {
      async findMany(args?: any) {
        const result: any[] = [];
        for (const a of store.assessments.values()) {
          if (matchWhere(a, args?.where)) {
            result.push(hydrateAssessment(a, args?.include));
          }
        }
        return result;
      },
      async create(args: any) {
        const id = args.data.id || `ass-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const item = { ...args.data, id, createdAt: new Date(), updatedAt: new Date() };
        store.assessments.set(id, item);
        return hydrateAssessment(item, args.include);
      },
    },

    attendanceRecord: {
      async findMany(args?: any) {
        const result: any[] = [];
        for (const a of store.attendanceRecords.values()) {
          if (matchWhere(a, args?.where)) {
            result.push(hydrateAttendanceRecord(a, args?.include));
          }
        }
        return result;
      },
      async count(args?: any) {
        let cnt = 0;
        for (const a of store.attendanceRecords.values()) {
          if (matchWhere(a, args?.where)) cnt++;
        }
        return cnt;
      },
      async create(args: any) {
        const id = args.data.id || `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const item = { ...args.data, id, createdAt: new Date(), updatedAt: new Date() };
        store.attendanceRecords.set(id, item);
        return hydrateAttendanceRecord(item, args.include);
      },
    },

    auditLog: {
      async create(args: any) {
        const item = { ...args.data, id: `audit-${Date.now()}`, timestamp: new Date() };
        store.auditLogs.push(item);
        return item;
      },
      async findMany(args?: any) {
        let result = [...store.auditLogs];
        if (args?.where) {
          result = result.filter((a) => matchWhere(a, args.where));
        }
        if (args?.orderBy?.timestamp === "desc") {
          result.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        if (args?.take) {
          result = result.slice(0, args.take);
        }
        return result;
      },
      async count(args?: any) {
        let result = [...store.auditLogs];
        if (args?.where) {
          result = result.filter((a) => matchWhere(a, args.where));
        }
        return result.length;
      },
    },

    // Transaction support
    async $transaction(cb: (tx: any) => Promise<any>) {
      return cb(this);
    },

    // Extension support
    $extends(extension: any) {
      const basePrisma = this;
      const allOps = extension?.query?.$allModels?.$allOperations;
      if (!allOps) {
        return basePrisma;
      }

      return new Proxy(basePrisma, {
        get(target: any, modelProp: string) {
          if (modelProp === "$extends") return basePrisma.$extends;
          if (modelProp === "$transaction") return basePrisma.$transaction;

          const modelObj = target[modelProp];
          if (!modelObj || typeof modelObj !== "object") {
            return modelObj;
          }

          return new Proxy(modelObj, {
            get(modelTarget: any, opProp: string) {
              const originalOp = modelTarget[opProp];
              if (typeof originalOp !== "function") {
                return originalOp;
              }

              return async function (args?: any) {
                return allOps({
                  model: modelProp,
                  operation: opProp,
                  args,
                  query: async (modifiedArgs: any) => {
                    return originalOp.call(modelTarget, modifiedArgs);
                  },
                });
              };
            },
          });
        },
      });
    },
  };

  // Hydration helpers
  function hydrateUser(user: any, include?: any) {
    if (!include) return { ...user };
    const res = { ...user };
    if (include.memberships) {
      res.memberships = Array.from(store.memberships.values())
        .filter((m) => m.userId === user.id && (!include.memberships.where || matchWhere(m, include.memberships.where)))
        .map((m) => hydrateMembership(m, include.memberships.include));
    }
    return res;
  }

  function hydrateSchool(school: any, include?: any) {
    if (!include) return { ...school };
    const res = { ...school };
    if (include.settings) {
      res.settings = Array.from(store.schoolSettings.values()).find((s) => s.schoolId === school.id) || null;
    }
    if (include.memberships) {
      res.memberships = Array.from(store.memberships.values())
        .filter((m) => m.schoolId === school.id && (!include.memberships.where || matchWhere(m, include.memberships.where)))
        .map((m) => hydrateMembership(m, include.memberships.include));
    }
    if (include._count) {
      res._count = {
        memberships: Array.from(store.memberships.values()).filter((m) => m.schoolId === school.id).length,
        courses: Array.from(store.courses.values()).filter((c) => c.schoolId === school.id).length,
        subjects: Array.from(store.subjects.values()).filter((s) => s.schoolId === school.id).length,
      };
    }
    return res;
  }

  function hydrateMembership(m: any, include?: any) {
    if (!include) return { ...m };
    const res = { ...m };
    if (include.user) res.user = store.users.get(m.userId) || null;
    if (include.school) {
      const s = store.schools.get(m.schoolId);
      res.school = s ? hydrateSchool(s, include.school.include) : null;
    }
    if (include.role) {
      const r = store.roles.get(m.roleId);
      res.role = r ? hydrateRole(r, include.role.include) : null;
    }
    return res;
  }

  function hydrateRole(role: any, include?: any) {
    if (!include) return { ...role };
    const res = { ...role };
    if (include.permissions) {
      const rps = Array.from(store.rolePermissions.values()).filter((rp) => rp.roleId === role.id);
      res.permissions = rps.map((rp) => ({
        permission: store.permissions.get(rp.permissionId) || null,
      }));
    }
    return res;
  }

  function hydrateCourse(course: any, include?: any) {
    if (!include) return { ...course };
    const res = { ...course };
    if (include.educationLevel) {
      res.educationLevel = store.educationLevels.get(course.educationLevelId) || null;
    }
    if (include.subjects) {
      res.subjects = Array.from(store.subjects.values())
        .filter((s) => s.courseId === course.id)
        .map((s) => hydrateSubject(s, include.subjects.include));
    }
    if (include._count) {
      res._count = {
        enrollments: Array.from(store.enrollments.values()).filter((e) => e.courseId === course.id).length,
      };
    }
    return res;
  }

  function hydrateSubject(subject: any, include?: any) {
    if (!include) return { ...subject };
    const res = { ...subject };
    if (include.course) {
      const c = store.courses.get(subject.courseId);
      res.course = c ? hydrateCourse(c, include.course.include) : null;
    }
    if (include.teacher) {
      const tp = subject.teacherProfileId ? store.teacherProfiles.get(subject.teacherProfileId) : null;
      res.teacher = tp ? hydrateTeacherProfile(tp, include.teacher.include) : null;
    }
    if (include._count) {
      res._count = {
        assessments: Array.from(store.assessments.values()).filter((a) => a.subjectId === subject.id).length,
      };
    }
    return res;
  }

  function hydrateTeacherProfile(tp: any, include?: any) {
    if (!include) return { ...tp };
    const res = { ...tp };
    if (include.membership) {
      const m = store.memberships.get(tp.membershipId);
      res.membership = m ? hydrateMembership(m, include.membership.include) : null;
    }
    if (include.subjects) {
      res.subjects = Array.from(store.subjects.values())
        .filter((s) => s.teacherProfileId === tp.id)
        .map((s) => hydrateSubject(s, include.subjects.include));
    }
    return res;
  }

  function hydrateStudentProfile(sp: any, include?: any) {
    if (!include) return { ...sp };
    const res = { ...sp };
    if (include.membership) {
      const m = store.memberships.get(sp.membershipId);
      res.membership = m ? hydrateMembership(m, include.membership.include) : null;
    }
    if (include.guardians) {
      res.guardians = Array.from(store.studentGuardians.values())
        .filter((sg) => sg.studentProfileId === sp.id)
        .map((sg) => {
          const gp = store.guardianProfiles.get(sg.guardianProfileId);
          return {
            ...sg,
            guardian: gp
              ? {
                  ...gp,
                  membership: store.memberships.get(gp.membershipId)
                    ? hydrateMembership(store.memberships.get(gp.membershipId), { user: true })
                    : null,
                }
              : null,
          };
        });
    }
    return res;
  }

  function hydrateEnrollment(enr: any, include?: any) {
    if (!include) return { ...enr };
    const res = { ...enr };
    if (include.course) {
      const c = store.courses.get(enr.courseId);
      res.course = c ? hydrateCourse(c, include.course.include) : null;
    }
    if (include.student) {
      const sp = store.studentProfiles.get(enr.studentProfileId);
      res.student = sp ? hydrateStudentProfile(sp, include.student.include) : null;
    }
    return res;
  }

  function hydrateAssessment(ass: any, include?: any) {
    if (!include) return { ...ass };
    const res = { ...ass };
    if (include.subject) {
      const s = store.subjects.get(ass.subjectId);
      res.subject = s ? hydrateSubject(s, include.subject.include) : null;
    }
    if (include.academicPeriod) {
      res.academicPeriod = store.academicPeriods.get(ass.academicPeriodId) || null;
    }
    if (include.grades) {
      res.grades = Array.from(store.grades.values())
        .filter((g) => g.assessmentId === ass.id)
        .map((g) => {
          const enr = store.enrollments.get(g.enrollmentId);
          return {
            ...g,
            enrollment: enr ? hydrateEnrollment(enr, include.grades.include?.enrollment?.include) : null,
          };
        });
    }
    return res;
  }

  function hydrateAttendanceRecord(att: any, include?: any) {
    if (!include) return { ...att };
    const res = { ...att };
    if (include.course) {
      const c = store.courses.get(att.courseId);
      res.course = c ? hydrateCourse(c, include.course.include) : null;
    }
    if (include.student) {
      const sp = store.studentProfiles.get(att.studentProfileId);
      res.student = sp ? hydrateStudentProfile(sp, include.student.include) : null;
    }
    return res;
  }
}
