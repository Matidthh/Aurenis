/**
 * ============================================================================
 * AURENIS — SERVICIO DE HUELLA DIGITAL DE DISPOSITIVO Y DETECCIÓN DE ANOMALÍAS
 * ============================================================================
 * Autores: Maicol R. (Backend Lead) & Frank M. (Seguridad & Detección de Fraude)
 * 
 * Misión:
 * 1. Genera una huella digital (Device Fingerprint) basada en headers HTTP (User-Agent, Accept-Language, IP).
 * 2. Detecta accesos desde dispositivos nuevos o no reconocidos para alertar al usuario y directores.
 * ============================================================================
 */

import crypto from "crypto";

export interface DeviceFingerprintInput {
  userAgent: string;
  acceptLanguage?: string;
  ipAddress?: string;
}

export interface DeviceCheckResult {
  deviceHash: string;
  isTrustedDevice: boolean;
  riskScore: number; // 0 (seguro) a 100 (alto riesgo / anomalía)
}

/**
 * Calcula un hash criptográfico único para identificar el dispositivo del usuario.
 */
export function generateDeviceFingerprint(input: DeviceFingerprintInput): string {
  const rawData = `${input.userAgent || "unknown-ua"}|${input.acceptLanguage || "unknown-lang"}|${input.ipAddress || "unknown-ip"}`;
  return crypto.createHash("sha256").update(rawData).digest("hex");
}

/**
 * Analiza la legitimidad del dispositivo comparándolo con registros previos.
 */
export async function analyzeDeviceAnomaly(
  currentFingerprint: string,
  knownFingerprints: string[]
): Promise<DeviceCheckResult> {
  const isTrusted = knownFingerprints.includes(currentFingerprint);

  return {
    deviceHash: currentFingerprint,
    isTrustedDevice: isTrusted,
    riskScore: isTrusted ? 0 : 35, // Dispositivos nuevos generan un puntaje de riesgo moderado pero permitido con MFA
  };
}
