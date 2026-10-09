/**
 * ============================================================================
 * AURENIS — SERVICIO DE CIFRADO A NIVEL DE COLUMNA PARA DATOS SENSIBLES (PII)
 * ============================================================================
 * Autores: Maicol R. (Lead Backend) & Frank M. (Seguridad de Datos NNA)
 * 
 * Misión:
 * 1. Proporciona encriptación AES-256-GCM transparente para información personal
 *    sensible de estudiantes y apoderados (RUN, teléfonos, direcciones, salud/PIE).
 * 2. Garantiza el cumplimiento normativo de protección de datos personales de NNA.
 * ============================================================================
 */

import { encryptField, decryptField } from "@/lib/security/encryption";

export interface SensitiveStudentData {
  rut?: string | null;
  address?: string | null;
  phone?: string | null;
  medicalInfo?: string | null;
}

/**
 * Cifra los campos sensibles de un estudiante antes de almacenarlos en PostgreSQL.
 */
export function encryptStudentPII<T extends SensitiveStudentData>(data: T): T {
  return {
    ...data,
    ...(data.rut !== undefined ? { rut: encryptField(data.rut) } : {}),
    ...(data.address !== undefined ? { address: encryptField(data.address) } : {}),
    ...(data.phone !== undefined ? { phone: encryptField(data.phone) } : {}),
    ...(data.medicalInfo !== undefined ? { medicalInfo: encryptField(data.medicalInfo) } : {}),
  };
}

/**
 * Descifra los campos sensibles de un estudiante al recuperarlos desde PostgreSQL.
 */
export function decryptStudentPII<T extends SensitiveStudentData>(data: T): T {
  return {
    ...data,
    ...(data.rut !== undefined ? { rut: decryptField(data.rut) } : {}),
    ...(data.address !== undefined ? { address: decryptField(data.address) } : {}),
    ...(data.phone !== undefined ? { phone: decryptField(data.phone) } : {}),
    ...(data.medicalInfo !== undefined ? { medicalInfo: decryptField(data.medicalInfo) } : {}),
  };
}
