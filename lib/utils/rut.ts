/**
 * Validador oficial de RUT (Rol Único Tributario / RUN) chileno con algoritmo Módulo 11.
 */
export function validateRut(rutStr: string): boolean {
  if (!rutStr || typeof rutStr !== "string") return false;

  // Limpiar puntos, espacios y guion
  const cleanRut = rutStr.trim().replace(/\./g, "").toUpperCase();
  if (!cleanRut.includes("-")) return false;

  const parts = cleanRut.split("-");
  if (parts.length !== 2) return false;

  const body = parts[0];
  const dv = parts[1];

  if (!/^\d+$/.test(body)) return false;
  if (!/^[0-9K]$/.test(dv)) return false;

  // Calcular Dígito Verificador Módulo 11
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

  return calculatedDv === dv;
}

/**
 * Validador de formato de correo electrónico
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
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
