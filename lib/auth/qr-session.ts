import { SignJWT, jwtVerify } from "jose";
import crypto from "crypto";

const HMAC_SECRET = process.env.JWT_SECRET || "aurenis_qr_hmac_secret_key_2026_super_secure_protection";
const QR_SECRET = new TextEncoder().encode(HMAC_SECRET);

export interface QRSessionJWTPayload {
  sessionId: string;
  schoolId: string;
  courseId: string;
  subjectId?: string | null;
  date: string;
  nonce: string;
  hmacSig: string;
  iat: number;
  exp: number;
}

/**
 * Genera una firma digital HMAC SHA-256 sobre los parámetros del token QR para prevenir la manipulación de parámetros
 */
export function generateAttendanceHMAC(params: {
  sessionId: string;
  schoolId: string;
  courseId: string;
  date: string;
  nonce: string;
}): string {
  const rawData = `aurenis:qr:${params.sessionId}:${params.schoolId}:${params.courseId}:${params.date}:${params.nonce}`;
  return crypto.createHmac("sha256", HMAC_SECRET).update(rawData).digest("hex");
}

/**
 * Verifica la firma HMAC SHA-256 utilizando comparación en tiempo constante (timingSafeEqual)
 */
export function verifyAttendanceHMAC(params: {
  sessionId: string;
  schoolId: string;
  courseId: string;
  date: string;
  nonce: string;
  hmacSig: string;
}): boolean {
  if (!params.hmacSig) return false;
  const expectedSig = generateAttendanceHMAC(params);

  try {
    const sigBuffer = Buffer.from(params.hmacSig, "hex");
    const expectedBuffer = Buffer.from(expectedSig, "hex");
    if (sigBuffer.length !== expectedBuffer.length) return false;
    return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
  } catch {
    return false;
  }
}

/**
 * Genera un token JWT firmado de corta duración (30 segundos) e incluye una firma digital HMAC en el payload
 */
export async function generateQRSessionToken(params: {
  sessionId: string;
  schoolId: string;
  courseId: string;
  subjectId?: string | null;
  date: string;
  ttlSeconds?: number;
}): Promise<string> {
  const nonce = Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const ttl = params.ttlSeconds || 30; // 30 segundos por defecto

  const hmacSig = generateAttendanceHMAC({
    sessionId: params.sessionId,
    schoolId: params.schoolId,
    courseId: params.courseId,
    date: params.date,
    nonce,
  });

  return await new SignJWT({
    sessionId: params.sessionId,
    schoolId: params.schoolId,
    courseId: params.courseId,
    subjectId: params.subjectId || null,
    date: params.date,
    nonce,
    hmacSig,
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime(`${ttl}s`)
    .sign(QR_SECRET);
}

/**
 * Verifica y decodifica un token QR firmado.
 * Valida tanto la firma JWT como la firma digital HMAC interna antes de permitir cualquier registro.
 */
export async function verifyQRSessionToken(token: string): Promise<QRSessionJWTPayload> {
  try {
    const { payload } = await jwtVerify(token, QR_SECRET, {
      algorithms: ["HS256"],
    });

    const qrPayload = payload as unknown as QRSessionJWTPayload;

    // Verificar firma digital HMAC integrada en el payload para prevenir manipulación de parámetros
    const isHMACValid = verifyAttendanceHMAC({
      sessionId: qrPayload.sessionId,
      schoolId: qrPayload.schoolId,
      courseId: qrPayload.courseId,
      date: qrPayload.date,
      nonce: qrPayload.nonce,
      hmacSig: qrPayload.hmacSig,
    });

    if (!isHMACValid) {
      throw new Error("Firma digital HMAC inválida. Se detectó un intento de manipulación de parámetros en el código QR.");
    }

    return qrPayload;
  } catch (err: any) {
    if (err.code === "ERR_JWT_EXPIRED") {
      throw new Error("El código QR ha expirado. Por favor solicite al docente un nuevo código QR.");
    }
    throw new Error(err.message || "Código QR inválido o alterado de forma no autorizada.");
  }
}
