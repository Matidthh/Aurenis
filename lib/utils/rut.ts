/**
 * Utilidades de validación y formateo para RUN/RUT chileno, correos y rangos numéricos.
 * Algoritmo oficial Módulo 11 para la República de Chile.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  formatted?: string;
}

/**
 * Validador oficial de RUT (Rol Único Tributario / RUN) chileno con algoritmo Módulo 11.
 * Admite formatos: "12.345.678-9", "12345678-9", "123456789", "12.345.678-K", "12345678-k"
 */
export function validateRut(rutStr: string): boolean {
  return validateRutWithReason(rutStr).isValid;
}

/**
 * Validador de RUT chileno con explicación del motivo de fallo.
 */
export function validateRutWithReason(rutStr: string): ValidationResult {
  if (!rutStr || typeof rutStr !== "string") {
    return { isValid: false, error: "El RUN es obligatorio." };
  }

  const trimmed = rutStr.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: "El RUN no puede estar vacío." };
  }

  // Limpiar puntos, espacios y normalizar mayúsculas
  const clean = trimmed.replace(/\./g, "").replace(/\s/g, "").toUpperCase();

  let body = "";
  let dv = "";

  if (clean.includes("-")) {
    const parts = clean.split("-");
    if (parts.length !== 2) {
      return { isValid: false, error: "Formato de RUN inválido (solo debe contener un guion)." };
    }
    body = parts[0];
    dv = parts[1];
  } else {
    // Si no contiene guion, el último carácter es el DV
    if (clean.length < 2) {
      return { isValid: false, error: "El RUN ingresado es demasiado corto." };
    }
    body = clean.slice(0, -1);
    dv = clean.slice(-1);
  }

  // Validar que el cuerpo sean solo dígitos (entre 6 y 8 dígitos para personas naturales y personas jurídicas)
  if (!/^\d{6,9}$/.test(body)) {
    return { isValid: false, error: "El cuerpo del RUN debe contener entre 6 y 9 dígitos numéricos." };
  }

  // Validar que el DV sea un dígito o 'K'
  if (!/^[0-9K]$/.test(dv)) {
    return { isValid: false, error: "El dígito verificador debe ser un número del 0 al 9 o la letra K." };
  }

  // Algoritmo Módulo 11
  let sum = 0;
  let multiplier = 2;

  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body.charAt(i), 10) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const calculatedDvNum = 11 - remainder;

  let calculatedDv = "";
  if (calculatedDvNum === 11) {
    calculatedDv = "0";
  } else if (calculatedDvNum === 10) {
    calculatedDv = "K";
  } else {
    calculatedDv = calculatedDvNum.toString();
  }

  if (calculatedDv !== dv) {
    return {
      isValid: false,
      error: `Dígito verificador incorrecto (se esperaba "${calculatedDv}" para el cuerpo ${body}).`,
    };
  }

  return {
    isValid: true,
    formatted: formatRut(clean),
  };
}

/**
 * Validador estricto de formato de correo electrónico
 * Rechaza: strings sin @, sin dominio, con caracteres inválidos, espacios o puntos consecutivos.
 */
export function validateEmail(email: string): boolean {
  return validateEmailWithReason(email).isValid;
}

export function validateEmailWithReason(email: string): ValidationResult {
  if (!email || typeof email !== "string") {
    return { isValid: false, error: "El correo electrónico es obligatorio." };
  }

  const trimmed = email.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: "El correo electrónico no puede estar vacío." };
  }

  // RFC 5322 simplificado y seguro
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Formato de correo electrónico inválido (ej: usuario@colegio.cl)." };
  }

  return { isValid: true };
}

/**
 * Validador de rangos numéricos con límites mínimo y máximo.
 */
export function validateNumberRange(
  val: number | string,
  min: number,
  max: number,
  fieldLabel = "El valor"
): ValidationResult {
  if (val === "" || val === null || val === undefined) {
    return { isValid: false, error: `${fieldLabel} es obligatorio.` };
  }

  const num = typeof val === "number" ? val : parseFloat(String(val).replace(",", "."));

  if (isNaN(num) || !isFinite(num)) {
    return { isValid: false, error: `${fieldLabel} debe ser un número válido.` };
  }

  if (num < min) {
    return { isValid: false, error: `${fieldLabel} no puede ser menor a ${min}.` };
  }

  if (num > max) {
    return { isValid: false, error: `${fieldLabel} no puede superar el máximo permitido de ${max}.` };
  }

  return { isValid: true };
}

/**
 * Formateador automático de RUT (ej: 12.345.678-9)
 */
export function formatRut(rutStr: string): string {
  if (!rutStr) return "";
  const clean = rutStr.replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length <= 1) return clean;

  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);

  let formattedBody = "";
  let count = 0;
  for (let i = body.length - 1; i >= 0; i--) {
    formattedBody = body.charAt(i) + formattedBody;
    count++;
    if (count === 3 && i > 0) {
      formattedBody = "." + formattedBody;
      count = 0;
    }
  }

  return `${formattedBody}-${dv}`;
}
