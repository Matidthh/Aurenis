import { generateQRSessionToken, verifyQRSessionToken } from "@/lib/auth/qr-session";
import { getSchoolBySlug } from "@/lib/services/school.service";
import { startAttendanceSession } from "@/lib/services/attendance-session.service";

export interface ClassSessionTokenResponse {
  token: string;
  sessionId: string;
  schoolId: string;
  courseId: string;
  subjectId?: string | null;
  date: string;
  ttlSeconds: number;
  expiresAt: string;
}

/**
 * Genera un token temporal de sesión de corta duración asociado a una clase específica
 */
export async function generateClassSessionToken(params: {
  schoolSlug: string;
  courseId: string;
  subjectId?: string | null;
  teacherUserId: string;
  teacherName?: string;
  dateStr?: string;
  ttlSeconds?: number;
}): Promise<ClassSessionTokenResponse> {
  const school = await getSchoolBySlug(params.schoolSlug);
  if (!school) {
    throw new Error(`Institución '${params.schoolSlug}' no encontrada.`);
  }

  const dateStr = params.dateStr || new Date().toISOString().split("T")[0];
  const ttlSeconds = params.ttlSeconds || 30;

  // Garantizar que la sesión de asistencia para el curso exista
  const sessionState = await startAttendanceSession({
    schoolId: school.id,
    courseId: params.courseId,
    subjectId: params.subjectId,
    teacherUserId: params.teacherUserId,
    teacherName: params.teacherName,
    dateStr,
  });

  // Generar token JWT con firma criptográfica HS256 y TTL corto
  const token = await generateQRSessionToken({
    sessionId: sessionState.sessionId,
    schoolId: school.id,
    courseId: params.courseId,
    subjectId: params.subjectId,
    date: dateStr,
    ttlSeconds,
  });

  const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

  return {
    token,
    sessionId: sessionState.sessionId,
    schoolId: school.id,
    courseId: params.courseId,
    subjectId: params.subjectId || null,
    date: dateStr,
    ttlSeconds,
    expiresAt,
  };
}

/**
 * Valida un token temporal de sesión de clase
 */
export async function validateClassSessionToken(token: string) {
  return await verifyQRSessionToken(token);
}
