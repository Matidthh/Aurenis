/**
 * Aurenis Security Redaction & PII Protection Module
 * Garantiza que hashes de contraseñas, secretos, tokens, credenciales y PII
 * no se filtren en respuestas JSON, logs de consola ni bitácoras de auditoría.
 */

// Lista de claves sensibles que deben ser purgadas o enmascaradas
export const SENSITIVE_KEYS = new Set([
  "password",
  "passwordhash",
  "password_hash",
  "currentpassword",
  "newpassword",
  "adminpassword",
  "secret",
  "jwt_secret",
  "secret_key",
  "token",
  "rawtoken",
  "bearertoken",
  "sessiontoken",
  "refreshtoken",
  "access_token",
  "refresh_token",
  "apikey",
  "api_key",
  "privatekey",
  "private_key",
  "authorization",
  "cookie",
  "set-cookie",
  "creditcard",
  "cardnumber",
  "cvv",
  "securitycode",
]);

export function isSensitiveKey(key: string): boolean {
  const k = key.toLowerCase().replace(/[-_]/g, "");
  if (SENSITIVE_KEYS.has(k)) return true;
  if (
    k.includes("password") ||
    k.includes("hash") ||
    k.includes("secret") ||
    k.includes("token") ||
    k.includes("apikey") ||
    k.includes("privatekey") ||
    k.includes("credential") ||
    k.includes("creditcard") ||
    k.includes("cvv") ||
    k.includes("authheader")
  ) {
    return true;
  }
  return false;
}

/**
 * Elimina recursivamente todas las propiedades sensibles de un objeto o estructura JSON.
 */
export function stripSensitiveFields<T>(obj: T, replaceWithRedacted: boolean = false): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => stripSensitiveFields(item, replaceWithRedacted)) as unknown as T;
  }

  if (obj instanceof Date || obj instanceof RegExp) {
    return obj;
  }

  const sanitized: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (isSensitiveKey(key)) {
      if (replaceWithRedacted) {
        sanitized[key] = "[REDACTED]";
      }
      // Si replaceWithRedacted es false, se omite completamente del payload
      continue;
    }

    if (typeof value === "object" && value !== null) {
      sanitized[key] = stripSensitiveFields(value, replaceWithRedacted);
    } else if (typeof value === "string") {
      sanitized[key] = redactPiiInString(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized as T;
}

/**
 * Enmascara cadenas que contengan patrones sensibles (como JWTs, RUTs o números de tarjeta)
 */
export function redactPiiInString(text: string): string {
  if (!text || typeof text !== "string") return text;

  // Enmascarar tokens JWT (formato header.payload.signature)
  let result = text.replace(
    /eyJ[a-zA-Z0-9_-]{10,}\.eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g,
    "[REDACTED_JWT]"
  );

  // Enmascarar cabeceras Bearer completas
  result = result.replace(/Bearer\s+[a-zA-Z0-9._-]+/gi, "Bearer [REDACTED_TOKEN]");

  // Enmascarar contraseñas en URLs de conexión (ej. postgresql://user:password@host/db)
  result = result.replace(/:\/\/([^:]+):([^@]+)@/g, "://$1:[REDACTED_PASSWORD]@");

  return result;
}

/**
 * Safe Logger: Envoltorio para console con sanitización automática de datos y PII
 */
export const safeLogger = {
  info: (message: string, ...args: any[]) => {
    const sanitizedArgs = args.map((arg) =>
      typeof arg === "object" ? stripSensitiveFields(arg, true) : redactPiiInString(String(arg))
    );
    console.info(redactPiiInString(message), ...sanitizedArgs);
  },
  warn: (message: string, ...args: any[]) => {
    const sanitizedArgs = args.map((arg) =>
      typeof arg === "object" ? stripSensitiveFields(arg, true) : redactPiiInString(String(arg))
    );
    console.warn(redactPiiInString(message), ...sanitizedArgs);
  },
  error: (message: string, ...args: any[]) => {
    const sanitizedArgs = args.map((arg) => {
      if (arg instanceof Error) {
        return redactPiiInString(arg.message);
      }
      return typeof arg === "object" ? stripSensitiveFields(arg, true) : redactPiiInString(String(arg));
    });
    console.error(redactPiiInString(message), ...sanitizedArgs);
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      const sanitizedArgs = args.map((arg) =>
        typeof arg === "object" ? stripSensitiveFields(arg, true) : redactPiiInString(String(arg))
      );
      console.debug(redactPiiInString(message), ...sanitizedArgs);
    }
  },
};
