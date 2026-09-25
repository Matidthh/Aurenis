import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string | null | undefined): Promise<boolean> {
  // Guarda de seguridad: Si no hay contraseña o el hash es nulo, indefinido o vacío, rechazar inmediatamente (Autor: Malcom Marcelo)
  if (!password || !hash || typeof hash !== "string" || hash.trim() === "") {
    return false;
  }
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

export const comparePassword = verifyPassword;
