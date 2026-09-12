import { PERMISSIONS, PermissionCode } from "./permissions";

export const SYSTEM_ROLE_NAME = "SYSTEM_ADMIN";

export const DEFAULT_SCHOOL_ROLES = {
  SCHOOL_ADMIN: "SCHOOL_ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  GUARDIAN: "GUARDIAN",
} as const;

export interface RolePreset {
  name: string;
  displayName: string;
  description: string;
  permissions: PermissionCode[];
}

export const ROLE_PRESETS: Record<string, RolePreset> = {
  [DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN]: {
    name: DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN,
    displayName: "Administrador del Colegio",
    description: "Acceso total a la administración institucional, académica y usuarios del colegio.",
    permissions: [
      PERMISSIONS.SCHOOL_SETTINGS_VIEW,
      PERMISSIONS.SCHOOL_SETTINGS_UPDATE,
      PERMISSIONS.SCHOOL_ROLES_MANAGE,
      PERMISSIONS.SCHOOL_AUDIT_VIEW,
      PERMISSIONS.ACADEMIC_PERIODS_MANAGE,
      PERMISSIONS.ACADEMIC_LEVELS_MANAGE,
      PERMISSIONS.ACADEMIC_COURSES_MANAGE,
      PERMISSIONS.ACADEMIC_SUBJECTS_MANAGE,
      PERMISSIONS.ACADEMIC_SCHEDULE_MANAGE,
      PERMISSIONS.PEOPLE_TEACHERS_MANAGE,
      PERMISSIONS.PEOPLE_STUDENTS_MANAGE,
      PERMISSIONS.PEOPLE_GUARDIANS_MANAGE,
      PERMISSIONS.PEOPLE_ENROLLMENT_MANAGE,
      PERMISSIONS.GRADES_VIEW,
      PERMISSIONS.GRADES_ENTER,
      PERMISSIONS.GRADES_MODIFY,
      PERMISSIONS.GRADES_PUBLISH,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.ATTENDANCE_RECORD,
      PERMISSIONS.ATTENDANCE_JUSTIFY,
    ],
  },
  [DEFAULT_SCHOOL_ROLES.TEACHER]: {
    name: DEFAULT_SCHOOL_ROLES.TEACHER,
    displayName: "Profesor",
    description: "Docente con asignación a cursos, registro de calificaciones y toma de asistencia.",
    permissions: [
      PERMISSIONS.GRADES_VIEW,
      PERMISSIONS.GRADES_ENTER,
      PERMISSIONS.GRADES_MODIFY,
      PERMISSIONS.ATTENDANCE_VIEW,
      PERMISSIONS.ATTENDANCE_RECORD,
    ],
  },
  [DEFAULT_SCHOOL_ROLES.STUDENT]: {
    name: DEFAULT_SCHOOL_ROLES.STUDENT,
    displayName: "Estudiante",
    description: "Alumno con acceso a sus calificaciones, horarios, asistencia y comunicaciones.",
    permissions: [
      PERMISSIONS.GRADES_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
    ],
  },
  [DEFAULT_SCHOOL_ROLES.GUARDIAN]: {
    name: DEFAULT_SCHOOL_ROLES.GUARDIAN,
    displayName: "Apoderado / Tutor",
    description: "Padre o apoderado con acceso al seguimiento de sus pupilos.",
    permissions: [
      PERMISSIONS.GRADES_VIEW,
      PERMISSIONS.ATTENDANCE_VIEW,
    ],
  },
};

export function getRoleDisplayName(roleName: string): string {
  if (roleName === SYSTEM_ROLE_NAME) return "Administrador del Sistema";
  if (ROLE_PRESETS[roleName]) return ROLE_PRESETS[roleName].displayName;
  return roleName;
}
