import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { getMockStore } from "@/lib/db/mock-db";
import { generateQRSessionToken, verifyQRSessionToken } from "@/lib/auth/qr-session";
import { checkAtraso } from "./attendance.service";
import { logAuditEvent } from "./audit.service";
import { AuditAction, AttendanceStatus } from "@prisma/client";

export interface StudentAttendanceItem {
  studentProfileId: string;
  userId: string;
  firstName: string;
  lastName: string;
  rut: string;
  recordId?: string | null;
  status: "PRESENT" | "LATE" | "ABSENT_JUSTIFIED" | "ABSENT_UNJUSTIFIED" | "PENDING";
  method?: "QR" | "MANUAL" | null;
  justification?: string | null;
  recordedAt?: string | null;
}

export interface AttendanceSessionLiveState {
  sessionId: string;
  schoolId: string;
  courseId: string;
  courseName: string;
  subjectId?: string | null;
  teacherUserId: string;
  teacherName: string;
  date: string;
  status: "ACTIVE" | "CLOSED";
  qrToken: string;
  qrExpiresInSeconds: number;
  totalStudents: number;
  registeredCount: number;
  pendingCount: number;
  qrCount: number;
  manualCount: number;
  students: StudentAttendanceItem[];
}

/**
 * Inicia una nueva sesión de asistencia para un docente y curso
 */
export async function startAttendanceSession(params: {
  schoolId: string;
  courseId: string;
  subjectId?: string | null;
  teacherUserId: string;
  teacherName?: string;
  dateStr?: string;
}): Promise<AttendanceSessionLiveState> {
  const dateStr = params.dateStr || new Date().toISOString().split("T")[0];
  const dateObj = new Date(dateStr + "T00:00:00.000Z");

  let sessionId = `session_${params.courseId}_${dateStr}`;
  let status: "ACTIVE" | "CLOSED" = "ACTIVE";

  if (isDatabaseConfigured()) {
    try {
      // Buscar sesión activa existente o crear una nueva
      let session = await prisma.attendanceSession.findFirst({
        where: {
          schoolId: params.schoolId,
          courseId: params.courseId,
          date: dateObj,
          status: "ACTIVE",
        },
      });

      if (!session) {
        session = await prisma.attendanceSession.create({
          data: {
            schoolId: params.schoolId,
            courseId: params.courseId,
            subjectId: params.subjectId || null,
            teacherUserId: params.teacherUserId,
            date: dateObj,
            status: "ACTIVE",
          },
        });
      }

      sessionId = session.id;
      status = session.status as "ACTIVE" | "CLOSED";
    } catch (err) {
      console.warn("[AttendanceSessionService] Error gestionando sesión en BD, usando fallback:", err);
    }
  } else {
    // Mock store
    const store = getMockStore();
    if (!store.attendanceSessions) {
      (store as any).attendanceSessions = new Map();
    }
    const sessionMap = (store as any).attendanceSessions;
    let mockSession = sessionMap.get(sessionId);
    if (!mockSession) {
      mockSession = {
        id: sessionId,
        schoolId: params.schoolId,
        courseId: params.courseId,
        subjectId: params.subjectId || null,
        teacherUserId: params.teacherUserId,
        date: dateStr,
        status: "ACTIVE",
      };
      sessionMap.set(sessionId, mockSession);
    }
    status = mockSession.status;
  }

  // Generar token QR dinámico firmado con expiración de 30s
  const qrToken = await generateQRSessionToken({
    sessionId,
    schoolId: params.schoolId,
    courseId: params.courseId,
    subjectId: params.subjectId,
    date: dateStr,
    ttlSeconds: 30,
  });

  return getAttendanceSessionLiveState({
    sessionId,
    schoolId: params.schoolId,
    courseId: params.courseId,
    dateStr,
    qrToken,
  });
}

/**
 * Obtiene el estado en tiempo real de la sesión de asistencia (estudiantes, registrados, pendientes, token QR)
 */
export async function getAttendanceSessionLiveState(params: {
  sessionId: string;
  schoolId: string;
  courseId: string;
  dateStr: string;
  qrToken?: string;
}): Promise<AttendanceSessionLiveState> {
  const dateObj = new Date(params.dateStr + "T00:00:00.000Z");
  let courseName = "Curso General";
  let teacherUserId = "user-teacher";
  let teacherName = "Docente AURENIS";
  let sessionStatus: "ACTIVE" | "CLOSED" = "ACTIVE";
  let subjectId: string | null = null;

  let enrolledStudents: Array<{
    studentProfileId: string;
    userId: string;
    firstName: string;
    lastName: string;
    rut: string;
  }> = [];

  let attendanceRecords: Array<{
    id: string;
    studentProfileId: string;
    status: string;
    method?: string | null;
    justification?: string | null;
    updatedAt?: Date | string;
  }> = [];

  if (isDatabaseConfigured()) {
    try {
      // 1. Obtener datos del curso y sus matriculados
      const course = await prisma.course.findUnique({
        where: { id: params.courseId },
        include: {
          enrollments: {
            where: { deletedAt: null },
            include: {
              student: {
                include: {
                  membership: {
                    include: { user: true },
                  },
                },
              },
            },
          },
        },
      });

      if (course) {
        courseName = course.name;
        enrolledStudents = course.enrollments.map((e) => {
          const user = e.student?.membership?.user;
          return {
            studentProfileId: e.studentProfileId,
            userId: user?.id || e.studentProfileId,
            firstName: user?.firstName || "Estudiante",
            lastName: user?.lastName || "Aurenis",
            rut: user?.rutOrNationalId || "N/A",
          };
        });
      }

      // 2. Obtener sesión
      const session = await prisma.attendanceSession.findUnique({
        where: { id: params.sessionId },
        include: { teacher: true },
      });

      if (session) {
        sessionStatus = session.status as "ACTIVE" | "CLOSED";
        subjectId = session.subjectId;
        teacherUserId = session.teacherUserId;
        if (session.teacher) {
          teacherName = `${session.teacher.firstName} ${session.teacher.lastName}`;
        }
      }

      // 3. Obtener registros de asistencia ya guardados para este curso y fecha
      const records = await prisma.attendanceRecord.findMany({
        where: {
          schoolId: params.schoolId,
          courseId: params.courseId,
          date: dateObj,
        },
      });

      attendanceRecords = records.map((r) => ({
        id: r.id,
        studentProfileId: r.studentProfileId,
        status: r.status,
        method: r.method,
        justification: r.justification,
        updatedAt: r.updatedAt,
      }));
    } catch (err) {
      console.warn("[AttendanceSessionService] Error leyendo datos BD:", err);
    }
  }

  // Fallback Mock Store si no hay datos BD
  if (enrolledStudents.length === 0) {
    const store = getMockStore();
    const course = store.courses.get(params.courseId);
    if (course) {
      courseName = course.name;
    }

    // Filtrar matrículas del curso
    const enrollments = Array.from(store.enrollments.values()).filter(
      (e) => e.courseId === params.courseId && e.schoolId === params.schoolId
    );

    enrolledStudents = enrollments.map((e) => {
      const studentProf = store.studentProfiles.get(e.studentProfileId);
      const mem = studentProf?.membershipId ? store.memberships.get(studentProf.membershipId) : null;
      const user = mem?.userId
        ? store.users.get(mem.userId)
        : studentProf?.userId
        ? store.users.get(studentProf.userId)
        : null;

      return {
        studentProfileId: e.studentProfileId,
        userId: user?.id || e.studentProfileId,
        firstName: user?.firstName || "Estudiante",
        lastName: user?.lastName || "LPMM",
        rut: user?.rutOrNationalId || "22.469.001-K",
      };
    });

    // Registros mock
    if (!store.attendanceRecords) {
      store.attendanceRecords = new Map();
    }
    attendanceRecords = Array.from(store.attendanceRecords.values()).filter(
      (r: any) => r.courseId === params.courseId && r.dateStr === params.dateStr
    );
  }

  // Mapear el estado combinado de cada estudiante
  const recordsMap = new Map<string, typeof attendanceRecords[0]>();
  attendanceRecords.forEach((r) => recordsMap.set(r.studentProfileId, r));

  let registeredCount = 0;
  let qrCount = 0;
  let manualCount = 0;

  const studentsList: StudentAttendanceItem[] = enrolledStudents
    .map((stu) => {
      const rec = recordsMap.get(stu.studentProfileId);
      const isRecorded = !!rec;
      if (isRecorded) {
        registeredCount++;
        if (rec?.method === "QR") qrCount++;
        else manualCount++;
      }

      return {
        studentProfileId: stu.studentProfileId,
        userId: stu.userId,
        firstName: stu.firstName,
        lastName: stu.lastName,
        rut: stu.rut,
        recordId: rec?.id || null,
        status: (rec?.status as any) || "PENDING",
        method: (rec?.method as any) || null,
        justification: rec?.justification || null,
        recordedAt: rec?.updatedAt ? new Date(rec.updatedAt).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }) : null,
      };
    })
    .sort((a, b) => a.lastName.localeCompare(b.lastName, "es"));

  const totalStudents = studentsList.length;
  const pendingCount = totalStudents - registeredCount;

  const activeQrToken =
    params.qrToken ||
    (await generateQRSessionToken({
      sessionId: params.sessionId,
      schoolId: params.schoolId,
      courseId: params.courseId,
      subjectId,
      date: params.dateStr,
      ttlSeconds: 30,
    }));

  return {
    sessionId: params.sessionId,
    schoolId: params.schoolId,
    courseId: params.courseId,
    courseName,
    subjectId,
    teacherUserId,
    teacherName,
    date: params.dateStr,
    status: sessionStatus,
    qrToken: activeQrToken,
    qrExpiresInSeconds: 30,
    totalStudents,
    registeredCount,
    pendingCount,
    qrCount,
    manualCount,
    students: studentsList,
  };
}

/**
 * Registra asistencia enviada por un estudiante al escanear el código QR
 */
export async function recordAttendanceViaQR(params: {
  schoolSlug: string;
  qrToken: string;
  studentUserId: string;
}): Promise<{
  success: boolean;
  message: string;
  courseName?: string;
  studentName?: string;
  recordedAt?: string;
}> {
  // 1. Verificar firma y expiración del JWT
  const payload = await verifyQRSessionToken(params.qrToken);

  const dateObj = new Date(payload.date + "T00:00:00.000Z");

  // 2. Verificar que la sesión esté activa en BD/Mock
  let studentProfileId: string | null = null;
  let studentName = "";
  let courseName = "Curso";

  if (isDatabaseConfigured()) {
    // Verificar sesión
    const session = await prisma.attendanceSession.findUnique({
      where: { id: payload.sessionId },
    });

    if (session && session.status === "CLOSED") {
      throw new Error("Esta sesión de asistencia ya fue finalizada por el docente.");
    }

    // Buscar perfil de estudiante para el usuario actual en esta escuela y curso
    const membership = await prisma.membership.findFirst({
      where: {
        userId: params.studentUserId,
        schoolId: payload.schoolId,
        isActive: true,
      },
      include: {
        user: true,
        studentProfile: {
          include: {
            enrollments: {
              where: {
                courseId: payload.courseId,
                deletedAt: null,
              },
            },
          },
        },
      },
    });

    if (!membership || !membership.studentProfile) {
      throw new Error("No tienes un perfil de estudiante activo en esta institución.");
    }

    const isEnrolled = membership.studentProfile.enrollments.length > 0;
    if (!isEnrolled) {
      throw new Error("No estás matriculado en el curso al cual corresponde esta sesión de asistencia.");
    }

    studentProfileId = membership.studentProfile.id;
    studentName = `${membership.user.firstName} ${membership.user.lastName}`;

    const course = await prisma.course.findUnique({ where: { id: payload.courseId } });
    if (course) courseName = course.name;

    // Evaluar si el estudiante está en tolerancia o atrasado mediante checkAtraso
    const atrasoCheck = checkAtraso({
      sessionStartTime: session?.createdAt || new Date(payload.iat * 1000),
      toleranceMinutes: 15, // Tolerancia institucional de 15 minutos
    });
    const calculatedStatus = atrasoCheck.status;

    // 3. Upsert registro con estado calculado (PRESENT o LATE) y método QR
    await prisma.attendanceRecord.upsert({
      where: {
        schoolId_courseId_studentProfileId_date: {
          schoolId: payload.schoolId,
          courseId: payload.courseId,
          studentProfileId,
          date: dateObj,
        },
      },
      update: {
        status: calculatedStatus,
        method: "QR",
        sessionId: payload.sessionId,
      },
      create: {
        schoolId: payload.schoolId,
        courseId: payload.courseId,
        studentProfileId,
        date: dateObj,
        status: calculatedStatus,
        method: "QR",
        sessionId: payload.sessionId,
      },
    });

    // Auditoría de seguridad
    logAuditEvent({
      schoolId: payload.schoolId,
      userId: params.studentUserId,
      action: AuditAction.UPDATE,
      entityType: "ATTENDANCE_RECORD",
      details: {
        method: "QR",
        sessionId: payload.sessionId,
        courseId: payload.courseId,
        status: "PRESENT",
      },
    }).catch(() => {});
  } else {
    // Mock Store
    const store = getMockStore();

    // Verificar si la sesión mock existe y si está cerrada
    if ((store as any).attendanceSessions) {
      const mockSession = (store as any).attendanceSessions.get(payload.sessionId);
      if (mockSession && mockSession.status === "CLOSED") {
        throw new Error("Esta sesión de asistencia ya fue finalizada por el docente.");
      }
    }

    let studentProf = Array.from(store.studentProfiles.values()).find(
      (sp) => sp.userId === params.studentUserId
    );

    if (!studentProf) {
      studentProf = Array.from(store.studentProfiles.values()).find((sp) => {
        const mem = store.memberships.get(sp.membershipId);
        return mem && mem.userId === params.studentUserId;
      });
    }

    if (!studentProf) {
      // Si el usuario es un estudiante del dataset (ej: user-lpmm-4e-std-1 o user-lpmm-student-16), asignarle el primer studentProfile
      const firstProf = Array.from(store.studentProfiles.values())[0];
      if (firstProf) {
        studentProf = firstProf;
      } else {
        throw new Error("Perfil de estudiante no encontrado.");
      }
    }

    studentProfileId = studentProf.id;
    const user = store.users.get(params.studentUserId);
    studentName = user ? `${user.firstName} ${user.lastName}` : "Estudiante";

    const course = store.courses.get(payload.courseId);
    if (course) courseName = course.name;

    if (!store.attendanceRecords) {
      store.attendanceRecords = new Map();
    }

    const recKey = `${payload.courseId}_${studentProfileId}_${payload.date}`;
    store.attendanceRecords.set(recKey, {
      id: `rec_${recKey}`,
      schoolId: payload.schoolId,
      courseId: payload.courseId,
      studentProfileId,
      dateStr: payload.date,
      status: "PRESENT",
      method: "QR",
      sessionId: payload.sessionId,
      updatedAt: new Date(),
    });
  }

  const recordedAtStr = new Date().toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return {
    success: true,
    message: `¡Asistencia registrada correctamente mediante QR para ${studentName}!`,
    courseName,
    studentName,
    recordedAt: recordedAtStr,
  };
}

/**
 * Registra o modifica manualmente la asistencia de un estudiante o lote por parte del docente
 */
export async function saveBulkManualAttendance(params: {
  schoolId: string;
  courseId: string;
  dateStr: string;
  teacherUserId: string;
  records: Array<{
    studentProfileId: string;
    status: "PRESENT" | "LATE" | "ABSENT_JUSTIFIED" | "ABSENT_UNJUSTIFIED";
    justification?: string | null;
    method?: "QR" | "MANUAL";
  }>;
}) {
  const dateObj = new Date(params.dateStr + "T00:00:00.000Z");

  if (isDatabaseConfigured()) {
    // Usar transacción para persistir todos los registros de forma atómica
    await prisma.$transaction(
      params.records.map((r) =>
        prisma.attendanceRecord.upsert({
          where: {
            schoolId_courseId_studentProfileId_date: {
              schoolId: params.schoolId,
              courseId: params.courseId,
              studentProfileId: r.studentProfileId,
              date: dateObj,
            },
          },
          update: {
            status: r.status as AttendanceStatus,
            justification: r.justification || null,
            method: r.method || "MANUAL",
            recordedByUserId: params.teacherUserId,
          },
          create: {
            schoolId: params.schoolId,
            courseId: params.courseId,
            studentProfileId: r.studentProfileId,
            date: dateObj,
            status: r.status as AttendanceStatus,
            justification: r.justification || null,
            method: r.method || "MANUAL",
            recordedByUserId: params.teacherUserId,
          },
        })
      )
    );

    logAuditEvent({
      schoolId: params.schoolId,
      userId: params.teacherUserId,
      action: AuditAction.UPDATE,
      entityType: "ATTENDANCE_RECORD_BULK",
      details: {
        courseId: params.courseId,
        date: params.dateStr,
        totalRecords: params.records.length,
      },
    }).catch(() => {});
  } else {
    // Mock Store
    const store = getMockStore();
    if (!store.attendanceRecords) store.attendanceRecords = new Map();

    params.records.forEach((r) => {
      const recKey = `${params.courseId}_${r.studentProfileId}_${params.dateStr}`;
      store.attendanceRecords.set(recKey, {
        id: `rec_${recKey}`,
        schoolId: params.schoolId,
        courseId: params.courseId,
        studentProfileId: r.studentProfileId,
        dateStr: params.dateStr,
        status: r.status,
        justification: r.justification || null,
        method: r.method || "MANUAL",
        recordedByUserId: params.teacherUserId,
        updatedAt: new Date(),
      });
    });
  }

  return { success: true, count: params.records.length };
}

/**
 * Cierra la sesión activa de asistencia
 */
export async function closeAttendanceSession(params: {
  sessionId: string;
  teacherUserId: string;
}) {
  if (isDatabaseConfigured()) {
    await prisma.attendanceSession.update({
      where: { id: params.sessionId },
      data: { status: "CLOSED" },
    });
  } else {
    const store = getMockStore();
    if ((store as any).attendanceSessions) {
      const session = (store as any).attendanceSessions.get(params.sessionId);
      if (session) {
        session.status = "CLOSED";
      }
    }
  }

  return { success: true, message: "Sesión de asistencia finalizada." };
}
