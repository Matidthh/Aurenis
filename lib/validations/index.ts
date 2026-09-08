/**
 * Utilidades de Validación y Sanitización
 * Sistema robusto para validar y sanitizar datos antes de llegar a la base de datos
 */

import { z } from 'zod';

/**
 * Sanitiza cadenas de texto
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/\s+/g, ' ') // Eliminar espacios múltiples
    .replace(/[<>]/g, '') // Eliminar caracteres potencialmente peligrosos
    .substring(0, 1000); // Limitar longitud
}

/**
 * Valida formato de RUT chileno
 */
export function validateRUT(rut: string): boolean {
  // Limpiar RUT
  const cleanRut = rut.replace(/[^0-9kK-]/g, '');
  
  // Verificar formato básico
  if (!/^\d{7,8}-[0-9kK]$/.test(cleanRut)) {
    return false;
  }

  const [number, verifier] = cleanRut.split('-');
  const rutNumber = parseInt(number, 10);
  
  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;
  
  for (let i = rutNumber.toString().length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber.toString()[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const calculatedVerifier = 11 - (sum % 11);
  const expectedVerifier = calculatedVerifier === 11 ? '0' : 
                          calculatedVerifier === 10 ? 'K' : 
                          calculatedVerifier.toString();
  
  return expectedVerifier.toUpperCase() === verifier.toUpperCase();
}

/**
 * Formatea RUT chileno
 */
export function formatRUT(rut: string): string {
  const cleanRut = rut.replace(/[^0-9kK]/g, '');
  if (cleanRut.length < 8) return rut;
  
  const number = cleanRut.slice(0, -1);
  const verifier = cleanRut.slice(-1);
  
  // Formatear con puntos
  let formattedNumber = '';
  for (let i = number.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) {
      formattedNumber = '.' + formattedNumber;
    }
    formattedNumber = number[i] + formattedNumber;
  }
  
  return `${formattedNumber}-${verifier}`;
}

/**
 * Sanitiza email
 */
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

/**
 * Valida email con formato estricto
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

/**
 * Sanitiza número telefónico chileno
 */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, '');
}

/**
 * Valida número telefónico chileno
 */
export function validatePhone(phone: string): boolean {
  const cleanPhone = sanitizePhone(phone);
  // Chile: +569XXXXXXXX o 9XXXXXXXX (8-9 dígitos después del 9)
  return /^\+569\d{8}$/.test(cleanPhone) || /^9\d{8}$/.test(cleanPhone);
}

/**
 * Valida que un número esté en un rango específico
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  inclusive: boolean = true
): boolean {
  if (inclusive) {
    return value >= min && value <= max;
  }
  return value > min && value < max;
}

/**
 * Sanitiza texto para prevenir XSS
 */
export function sanitizeXSS(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Valida que una fecha sea futura
 */
export function validateFutureDate(date: Date): boolean {
  return date > new Date();
}

/**
 * Valida que una fecha sea pasada
 */
export function validatePastDate(date: Date): boolean {
  return date < new Date();
}

/**
 * Valida edad mínima y máxima
 */
export function validateAge(birthDate: Date, minAge: number = 0, maxAge: number = 120): boolean {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    return age - 1 >= minAge && age - 1 <= maxAge;
  }
  
  return age >= minAge && age <= maxAge;
}

/**
 * Sanitiza nombre propio
 */
export function sanitizeName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, '')
    .replace(/\b\w/g, l => l.toUpperCase())
    .substring(0, 100);
}

/**
 * Valida longitud de contraseña
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número');
  }

  if (!/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Debe contener al menos un carácter especial');
  }

  if (errors.length === 0) {
    strength = 'strong';
  } else if (errors.length <= 2) {
    strength = 'medium';
  }

  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

/**
 * Genera mensajes de error descriptivos para Zod
 */
export function getZodErrorMessage(error: z.ZodError): string {
  const firstError = error.errors[0];
  
  const fieldPath = firstError.path.join('.');
  const message = firstError.message;

  // Mapear errores comunes a mensajes amigables
  const errorMessages: Record<string, string> = {
    'email': 'El correo electrónico no tiene un formato válido',
    'email_invalid': 'Por favor ingresa un correo electrónico válido',
    'too_small': 'Este campo es requerido',
    'too_big': 'Este campo excede el límite de caracteres permitido',
    'invalid_type': 'El formato de este campo no es válido',
  };

  // Mensajes específicos por campo
  const fieldMessages: Record<string, string> = {
    'email': 'Por favor ingresa un correo electrónico válido',
    'password': 'La contraseña debe tener al menos 8 caracteres',
    'firstName': 'El nombre es obligatorio',
    'lastName': 'El apellido es obligatorio',
    'rutOrNationalId': 'El RUT no tiene un formato válido',
    'phone': 'El número telefónico no tiene un formato válido',
  };

  // Buscar mensaje específico del campo
  if (fieldMessages[fieldPath]) {
    return fieldMessages[fieldPath];
  }

  // Buscar mensaje genérico del tipo de error
  if (errorMessages[message]) {
    return errorMessages[message];
  }

  // Mensaje por defecto
  return message;
}

/**
 * Transforma errores de Zod a formato amigable para la UI
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const formattedErrors: Record<string, string> = {};

  for (const err of error.errors) {
    const fieldPath = err.path.join('.');
    formattedErrors[fieldPath] = getZodErrorMessage(error);
  }

  return formattedErrors;
}