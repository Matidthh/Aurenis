/**
 * Esquemas de Validación para Estudiantes
 * Validaciones robustas para datos de estudiantes
 */

import { z } from 'zod';
import {
  sanitizeString,
  sanitizeName,
  sanitizeEmail,
  validateEmail,
  validateRUT,
  validatePhone,
  sanitizePhone,
  validateAge,
} from './index';

/**
 * Schema para crear estudiante
 */
export const CreateStudentSchema = z.object({
  // Información básica del usuario
  email: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .max(255, 'El correo electrónico excede el límite de caracteres')
    .refine(email => validateEmail(sanitizeEmail(email)), {
      message: 'Por favor ingresa un correo electrónico válido',
    })
    .transform(sanitizeEmail),

  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(100, 'La contraseña excede el límite de caracteres')
    .regex(/[a-z]/, 'Debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'Debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número'),

  firstName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre excede el límite de caracteres')
    .transform(sanitizeName),

  lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido excede el límite de caracteres')
    .transform(sanitizeName),

  // Información opcional
  rutOrNationalId: z.string()
    .optional()
    .refine(rut => !rut || validateRUT(rut), {
      message: 'El RUT no tiene un formato válido (ej: 12.345.678-9)',
    })
    .transform(rut => rut ? rut.toUpperCase() : null),

  phone: z.string()
    .optional()
    .refine(phone => !phone || validatePhone(phone), {
      message: 'El número telefónico no tiene un formato válido (ej: +56912345678)',
    })
    .transform(phone => phone ? sanitizePhone(phone) : null),

  // Información del perfil de estudiante
  enrollmentNumber: z.string()
    .optional()
    .max(50, 'El número de matrícula excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : null),

  birthDate: z.string()
    .optional()
    .refine(date => {
      if (!date) return true;
      const birthDate = new Date(date);
      return validateAge(birthDate, 5, 25); // Entre 5 y 25 años
    }, {
      message: 'La edad del estudiante debe estar entre 5 y 25 años',
    })
    .transform(date => date ? new Date(date) : null),

  medicalNotes: z.string()
    .optional()
    .max(2000, 'Las notas médicas exceden el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : null),

  // Información de membresía
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  courseId: z.string()
    .min(1, 'El ID del curso es obligatorio')
    .uuid('El ID del curso no tiene un formato válido'),

  year: z.number()
    .int('El año debe ser un número entero')
    .min(2020, 'El año debe ser 2020 o posterior')
    .max(2100, 'El año no puede ser posterior a 2100'),
});

/**
 * Schema para actualizar estudiante
 */
export const UpdateStudentSchema = z.object({
  email: z.string()
    .optional()
    .max(255, 'El correo electrónico excede el límite de caracteres')
    .refine(email => !email || validateEmail(sanitizeEmail(email)), {
      message: 'Por favor ingresa un correo electrónico válido',
    })
    .transform(email => email ? sanitizeEmail(email) : undefined),

  firstName: z.string()
    .optional()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre excede el límite de caracteres')
    .transform(name => name ? sanitizeName(name) : undefined),

  lastName: z.string()
    .optional()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido excede el límite de caracteres')
    .transform(name => name ? sanitizeName(name) : undefined),

  rutOrNationalId: z.string()
    .optional()
    .refine(rut => !rut || validateRUT(rut), {
      message: 'El RUT no tiene un formato válido',
    })
    .transform(rut => rut ? rut.toUpperCase() : undefined),

  phone: z.string()
    .optional()
    .refine(phone => !phone || validatePhone(phone), {
      message: 'El número telefónico no tiene un formato válido',
    })
    .transform(phone => phone ? sanitizePhone(phone) : undefined),

  enrollmentNumber: z.string()
    .optional()
    .max(50, 'El número de matrícula excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),

  birthDate: z.string()
    .optional()
    .refine(date => {
      if (!date) return true;
      const birthDate = new Date(date);
      return validateAge(birthDate, 5, 25);
    }, {
      message: 'La edad del estudiante debe estar entre 5 y 25 años',
    })
    .transform(date => date ? new Date(date) : undefined),

  medicalNotes: z.string()
    .optional()
    .max(2000, 'Las notas médicas exceden el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),
});

/**
 * Schema para matricular estudiante
 */
export const EnrollStudentSchema = z.object({
  studentId: z.string()
    .min(1, 'El ID del estudiante es obligatorio')
    .uuid('El ID del estudiante no tiene un formato válido'),

  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  courseId: z.string()
    .min(1, 'El ID del curso es obligatorio')
    .uuid('El ID del curso no tiene un formato válido'),

  year: z.number()
    .int('El año debe ser un número entero')
    .min(2020, 'El año debe ser 2020 o posterior')
    .max(2100, 'El año no puede ser posterior a 2100'),
});

/**
 * Schema para agregar apoderado a estudiante
 */
export const AddGuardianSchema = z.object({
  studentId: z.string()
    .min(1, 'El ID del estudiante es obligatorio')
    .uuid('El ID del estudiante no tiene un formato válido'),

  guardianEmail: z.string()
    .min(1, 'El correo del apoderado es obligatorio')
    .max(255, 'El correo electrónico excede el límite de caracteres')
    .refine(email => validateEmail(sanitizeEmail(email)), {
      message: 'Por favor ingresa un correo electrónico válido',
    })
    .transform(sanitizeEmail),

  guardianFirstName: z.string()
    .min(2, 'El nombre del apoderado es obligatorio')
    .max(100, 'El nombre excede el límite de caracteres')
    .transform(sanitizeName),

  guardianLastName: z.string()
    .min(2, 'El apellido del apoderado es obligatorio')
    .max(100, 'El apellido excede el límite de caracteres')
    .transform(sanitizeName),

  relationship: z.string()
    .min(1, 'El parentesco es obligatorio')
    .max(50, 'El parentesco excede el límite de caracteres')
    .transform(sanitizeString),

  isEmergencyContact: z.boolean()
    .default(false),

  canPickUp: z.boolean()
    .default(true),
});

/**
 * Schema para buscar estudiantes
 */
export const SearchStudentsSchema = z.object({
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  courseId: z.string()
    .optional()
    .uuid('El ID del curso no tiene un formato válido'),

  year: z.number()
    .optional()
    .int('El año debe ser un número entero'),

  search: z.string()
    .optional()
    .max(100, 'El término de búsqueda excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),

  limit: z.number()
    .optional()
    .int('El límite debe ser un número entero')
    .min(1, 'El límite debe ser al menos 1')
    .max(100, 'El límite no puede exceder 100')
    .default(20),

  offset: z.number()
    .optional()
    .int('El offset debe ser un número entero')
    .min(0, 'El offset no puede ser negativo')
    .default(0),
});

/**
 * Schema para actualizar perfil de estudiante
 */
export const UpdateStudentProfileSchema = z.object({
  enrollmentNumber: z.string()
    .optional()
    .max(50, 'El número de matrícula excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),

  birthDate: z.string()
    .optional()
    .refine(date => {
      if (!date) return true;
      const birthDate = new Date(date);
      return validateAge(birthDate, 5, 25);
    }, {
      message: 'La edad del estudiante debe estar entre 5 y 25 años',
    })
    .transform(date => date ? new Date(date) : undefined),

  medicalNotes: z.string()
    .optional()
    .max(2000, 'Las notas médicas excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined),
});

// Tipos TypeScript exportados
export type CreateStudentInput = z.infer<typeof CreateStudentSchema>;
export type UpdateStudentInput = z.infer<typeof UpdateStudentSchema>;
export type EnrollStudentInput = z.infer<typeof EnrollStudentSchema>;
export type AddGuardianInput = z.infer<typeof AddGuardianSchema>;
export type SearchStudentsInput = z.infer<typeof SearchStudentsSchema>;
export type UpdateStudentProfileInput = z.infer<typeof UpdateStudentProfileSchema>;