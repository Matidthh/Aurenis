/**
 * Aurenis - Optimización de Consultas y Proyecciones Select
 * Define proyecciones de campos granulares (SELECT) para evitar sobrecarga
 * de red, eliminar sobre-extracción de datos (over-fetching) y prevenir problemas N+1.
 */

/**
 * Proyección de cursos con nivel educativo y conteo de matrículas
 */
export const SELECT_COURSE_WITH_LEVEL = {
  id: true,
  code: true,
  name: true,
  year: true,
  section: true,
  educationLevelId: true,
  shift: true,
  classroom: true,
  capacity: true,
  educationLevel: {
    select: {
      id: true,
      name: true,
      code: true,
    },
  },
  _count: {
    select: {
      enrollments: true,
    },
  },
} as const;

/**
 * Proyección ligera de cursos para listados académicos anuales
 */
export const SELECT_COURSE_ACADEMIC_LIST = {
  id: true,
  name: true,
  gradeNumber: true,
  letter: true,
  year: true,
  educationLevel: {
    select: {
      id: true,
      name: true,
    },
  },
  subjects: {
    select: {
      id: true,
      name: true,
      teacher: {
        select: {
          id: true,
          membership: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
    },
  },
  _count: {
    select: {
      enrollments: true,
    },
  },
} as const;

/**
 * Proyección de notas y calificaciones detalladas para API y reportes
 */
export const SELECT_GRADE_DETAILED = {
  id: true,
  value: true,
  feedback: true,
  enrollmentId: true,
  assessmentId: true,
  schoolId: true,
  createdAt: true,
  updatedAt: true,
  enrollment: {
    select: {
      id: true,
      studentProfileId: true,
      schoolId: true,
      student: {
        select: {
          id: true,
          enrollmentNumber: true,
          membership: {
            select: {
              id: true,
              userId: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  rutOrNationalId: true,
                },
              },
            },
          },
        },
      },
      course: {
        select: {
          id: true,
          name: true,
          gradeNumber: true,
          letter: true,
        },
      },
    },
  },
  assessment: {
    select: {
      id: true,
      title: true,
      type: true,
      weightPercentage: true,
      subjectId: true,
      subject: {
        select: {
          id: true,
          name: true,
        },
      },
      academicPeriodId: true,
      academicPeriod: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
} as const;

/**
 * Proyección de evaluaciones con calificaciones y datos de alumnos
 */
export const SELECT_ASSESSMENT_WITH_GRADES = {
  id: true,
  title: true,
  description: true,
  date: true,
  type: true,
  weightPercentage: true,
  isPublished: true,
  subjectId: true,
  subject: {
    select: {
      id: true,
      name: true,
      course: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  academicPeriodId: true,
  academicPeriod: {
    select: {
      id: true,
      name: true,
    },
  },
  grades: {
    select: {
      id: true,
      value: true,
      feedback: true,
      enrollment: {
        select: {
          id: true,
          student: {
            select: {
              id: true,
              enrollmentNumber: true,
              membership: {
                select: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

/**
 * Proyección de estudiantes con datos de perfil y apoderados
 */
export const SELECT_STUDENT_DETAILED = {
  id: true,
  enrollmentNumber: true,
  birthDate: true,
  medicalNotes: true,
  emergencyContactName: true,
  emergencyContactPhone: true,
  createdAt: true,
  updatedAt: true,
  membership: {
    select: {
      id: true,
      schoolId: true,
      isActive: true,
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          rutOrNationalId: true,
          phone: true,
          avatarUrl: true,
          status: true,
        },
      },
    },
  },
  guardians: {
    select: {
      relationship: true,
      isEmergencyContact: true,
      isFinancialResponsible: true,
      guardian: {
        select: {
          id: true,
          membership: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  email: true,
                  phone: true,
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

/**
 * Proyección de matrícula de estudiante con datos de curso y usuario
 */
export const SELECT_ENROLLMENT_STUDENT = {
  id: true,
  schoolId: true,
  year: true,
  status: true,
  courseId: true,
  course: {
    select: {
      id: true,
      name: true,
      gradeNumber: true,
      letter: true,
      educationLevel: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },
  student: {
    select: {
      id: true,
      enrollmentNumber: true,
      birthDate: true,
      medicalNotes: true,
      emergencyContactName: true,
      emergencyContactPhone: true,
      membership: {
        select: {
          id: true,
          schoolId: true,
          isActive: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              rutOrNationalId: true,
              phone: true,
              avatarUrl: true,
              status: true,
            },
          },
        },
      },
      guardians: {
        select: {
          relationship: true,
          isEmergencyContact: true,
          isFinancialResponsible: true,
          guardian: {
            select: {
              id: true,
              membership: {
                select: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                      email: true,
                      phone: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

/**
 * Proyección de registros de asistencia
 */
export const SELECT_ATTENDANCE_RECORD = {
  id: true,
  date: true,
  status: true,
  schoolId: true,
  createdAt: true,
  course: {
    select: {
      id: true,
      name: true,
    },
  },
  student: {
    select: {
      id: true,
      enrollmentNumber: true,
      membership: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  },
  justification: {
    select: {
      id: true,
      reason: true,
      status: true,
    },
  },
} as const;

/**
 * Proyección para verificación de membresía y permisos (Auth & Guardas)
 */
export const SELECT_MEMBERSHIP_AUTH = {
  id: true,
  userId: true,
  schoolId: true,
  isActive: true,
  role: {
    select: {
      name: true,
      permissions: {
        select: {
          permission: {
            select: {
              code: true,
            },
          },
        },
      },
    },
  },
} as const;

/**
 * Proyección para selección institucional de usuario
 */
export const SELECT_MEMBERSHIP_SCHOOL_SELECT = {
  id: true,
  isActive: true,
  school: {
    select: {
      id: true,
      slug: true,
      status: true,
    },
  },
  role: {
    select: {
      name: true,
      permissions: {
        select: {
          permission: {
            select: {
              code: true,
            },
          },
        },
      },
    },
  },
} as const;

/**
 * Proyección de configuración escolar
 */
export const SELECT_SCHOOL_CONFIG = {
  id: true,
  name: true,
  slug: true,
  institutionalCode: true,
  logoUrl: true,
  address: true,
  city: true,
  country: true,
  timezone: true,
  status: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  settings: {
    select: {
      id: true,
      termType: true,
      minPassingGrade: true,
      minGrade: true,
      maxGrade: true,
      gradeScalePrecision: true,
      primaryColor: true,
      requireAttendanceNote: true,
      customConfig: true,
    },
  },
} as const;

/**
 * Proyección para dashboard global de instituciones
 */
export const SELECT_SCHOOL_DASHBOARD_ITEM = {
  id: true,
  name: true,
  slug: true,
  status: true,
  city: true,
  country: true,
  createdAt: true,
  _count: {
    select: {
      memberships: true,
    },
  },
} as const;

/**
 * Proyección de resumen institucional con settings y conteos
 */
export const SELECT_SCHOOL_SUMMARY = {
  id: true,
  name: true,
  slug: true,
  institutionalCode: true,
  city: true,
  country: true,
  timezone: true,
  status: true,
  createdAt: true,
  settings: {
    select: {
      termType: true,
      minPassingGrade: true,
      minGrade: true,
      maxGrade: true,
      primaryColor: true,
      gradeScalePrecision: true,
    },
  },
  _count: {
    select: {
      memberships: true,
      courses: true,
      subjects: true,
    },
  },
} as const;

