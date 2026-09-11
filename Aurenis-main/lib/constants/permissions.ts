export const PERMISSIONS = {
  // Permisos de Sistema (System Admin)
  SYSTEM_SCHOOLS_MANAGE: "system:schools:manage",
  SYSTEM_USERS_MANAGE: "system:users:manage",
  SYSTEM_AUDIT_VIEW: "system:audit:view",

  // Permisos Institucionales (Colegio)
  SCHOOL_SETTINGS_VIEW: "school:settings:view",
  SCHOOL_SETTINGS_UPDATE: "school:settings:update",
  SCHOOL_ROLES_MANAGE: "school:roles:manage",
  SCHOOL_AUDIT_VIEW: "school:audit:view",

  // Académico (Periodos, Cursos, Asignaturas)
  ACADEMIC_PERIODS_MANAGE: "academic:periods:manage",
  ACADEMIC_LEVELS_MANAGE: "academic:levels:manage",
  ACADEMIC_COURSES_MANAGE: "academic:courses:manage",
  ACADEMIC_SUBJECTS_MANAGE: "academic:subjects:manage",
  ACADEMIC_SCHEDULE_MANAGE: "academic:schedule:manage",

  // Personas (Profesores, Estudiantes, Apoderados)
  PEOPLE_TEACHERS_MANAGE: "people:teachers:manage",
  PEOPLE_STUDENTS_MANAGE: "people:students:manage",
  PEOPLE_GUARDIANS_MANAGE: "people:guardians:manage",
  PEOPLE_ENROLLMENT_MANAGE: "people:enrollment:manage",

  // Calificaciones
  GRADES_VIEW: "grades:view",
  GRADES_ENTER: "grades:enter",
  GRADES_MODIFY: "grades:modify",
  GRADES_PUBLISH: "grades:publish",

  // Asistencia
  ATTENDANCE_VIEW: "attendance:view",
  ATTENDANCE_RECORD: "attendance:record",
  ATTENDANCE_JUSTIFY: "attendance:justify",
} as const;

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export interface PermissionDefinition {
  code: PermissionCode;
  module: "SYSTEM" | "SCHOOL" | "ACADEMIC" | "PEOPLE" | "GRADES" | "ATTENDANCE";
  description: string;
}

export const ALL_PERMISSIONS: PermissionDefinition[] = [
  // System
  { code: PERMISSIONS.SYSTEM_SCHOOLS_MANAGE, module: "SYSTEM", description: "Crear y gestionar instituciones en la plataforma" },
  { code: PERMISSIONS.SYSTEM_USERS_MANAGE, module: "SYSTEM", description: "Gestionar usuarios a nivel global" },
  { code: PERMISSIONS.SYSTEM_AUDIT_VIEW, module: "SYSTEM", description: "Ver registros de auditoría global" },

  // School
  { code: PERMISSIONS.SCHOOL_SETTINGS_VIEW, module: "SCHOOL", description: "Ver configuración institucional" },
  { code: PERMISSIONS.SCHOOL_SETTINGS_UPDATE, module: "SCHOOL", description: "Modificar configuración de la institución" },
  { code: PERMISSIONS.SCHOOL_ROLES_MANAGE, module: "SCHOOL", description: "Crear y editar roles institucionales" },
  { code: PERMISSIONS.SCHOOL_AUDIT_VIEW, module: "SCHOOL", description: "Consultar auditoría de la institución" },

  // Academic
  { code: PERMISSIONS.ACADEMIC_PERIODS_MANAGE, module: "ACADEMIC", description: "Gestionar periodos lectivos (semestres, trimestres)" },
  { code: PERMISSIONS.ACADEMIC_LEVELS_MANAGE, module: "ACADEMIC", description: "Gestionar niveles educativos" },
  { code: PERMISSIONS.ACADEMIC_COURSES_MANAGE, module: "ACADEMIC", description: "Crear y organizar cursos" },
  { code: PERMISSIONS.ACADEMIC_SUBJECTS_MANAGE, module: "ACADEMIC", description: "Gestionar asignaturas y mallas curriculares" },
  { code: PERMISSIONS.ACADEMIC_SCHEDULE_MANAGE, module: "ACADEMIC", description: "Configurar horarios y bloques de clases" },

  // People
  { code: PERMISSIONS.PEOPLE_TEACHERS_MANAGE, module: "PEOPLE", description: "Registrar y asignar profesores" },
  { code: PERMISSIONS.PEOPLE_STUDENTS_MANAGE, module: "PEOPLE", description: "Gestionar fichas de estudiantes" },
  { code: PERMISSIONS.PEOPLE_GUARDIANS_MANAGE, module: "PEOPLE", description: "Vincular apoderados y contactos" },
  { code: PERMISSIONS.PEOPLE_ENROLLMENT_MANAGE, module: "PEOPLE", description: "Matricular estudiantes en cursos y años" },

  // Grades
  { code: PERMISSIONS.GRADES_VIEW, module: "GRADES", description: "Ver calificaciones y promedios" },
  { code: PERMISSIONS.GRADES_ENTER, module: "GRADES", description: "Ingresar calificaciones en evaluaciones" },
  { code: PERMISSIONS.GRADES_MODIFY, module: "GRADES", description: "Modificar calificaciones previamente ingresadas" },
  { code: PERMISSIONS.GRADES_PUBLISH, module: "GRADES", description: "Cerrar periodos y publicar actas finales" },

  // Attendance
  { code: PERMISSIONS.ATTENDANCE_VIEW, module: "ATTENDANCE", description: "Consultar registros y estadísticas de asistencia" },
  { code: PERMISSIONS.ATTENDANCE_RECORD, module: "ATTENDANCE", description: "Tomar asistencia diaria o por bloque de clase" },
  { code: PERMISSIONS.ATTENDANCE_JUSTIFY, module: "ATTENDANCE", description: "Ingresar justificaciones médicas o administrativas" },
];
