/**
 * Unique source of JWT_SECRET for Node (Route Handlers / Server Components)
 * and Edge (middleware). Uses only Web APIs + process.env.
 */

export const JWT_SECRET_MIN_LENGTH = 32;

export class JwtSecretError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JwtSecretError";
    Object.setPrototypeOf(this, JwtSecretError.prototype);
  }
}

/**
 * Reads and validates JWT_SECRET. No default value is ever used.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new JwtSecretError(
      "JWT_SECRET no está configurado. Define la variable de entorno JWT_SECRET con al menos 32 caracteres."
    );
  }

  if (secret.length < JWT_SECRET_MIN_LENGTH) {
    throw new JwtSecretError(
      `JWT_SECRET es demasiado corto (${secret.length} caracteres). Para HS256 debe tener al menos ${JWT_SECRET_MIN_LENGTH} caracteres.`
    );
  }

  return secret;
}

export function getJwtSecretKey(): Uint8Array {
  return new TextEncoder().encode(getJwtSecret());
}
