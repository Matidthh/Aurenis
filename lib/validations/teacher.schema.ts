/**
 * Esquemas de Validación para Profesores
 * Validaciones robustas para datos de profesores
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
 * Schema para crear profesor
 */
export const CreateTeacherSchema = z.object({
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

  // Información del perfil de profesor
  specialty: z.string()
    .min(2, 'La especialidad debe tener al menos 2 caracteres')
    .max(200, 'La especialidad excede el límite de caracteres')
    .transform(sanitizeString),

  // Información de membresía
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  // Validación de unicidad (se verificará en el servicio)
  checkEmailUnique: z.boolean().optional().default(true),
  checkRutUnique: z.boolean().optional().default(true),
});

/**
 * Schema para actualizar profesor
 */
export const UpdateTeacherSchema = z.object({
  email: z.string()
    .max(255, 'El correo electrónico excede el límite de caracteres')
    .refine(email => !email || validateEmail(sanitizeEmail(email)), {
      message: 'Por favor ingresa un correo electrónico válido',
    })
    .transform(email => email ? sanitizeEmail(email) : undefined)
    .optional(),

  firstName: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre excede el límite de caracteres')
    .transform(name => name ? sanitizeName(name) : undefined)
    .optional(),

  lastName: z.string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(100, 'El apellido excede el límite de caracteres')
    .transform(name => name ? sanitizeName(name) : undefined)
    .optional(),

  rutOrNationalId: z.string()
    .refine(rut => !rut || validateRUT(rut), {
      message: 'El RUT no tiene un formato válido',
    })
    .transform(rut => rut ? rut.toUpperCase() : undefined)
    .optional(),

  phone: z.string()
    .refine(phone => !phone || validatePhone(phone), {
      message: 'El número telefónico no tiene un formato válido',
    })
    .transform(phone => phone ? sanitizePhone(phone) : undefined)
    .optional(),

  specialty: z.string()
    .min(2, 'La especialidad debe tener al menos 2 caracteres')
    .max(200, 'La especialidad excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined)
    .optional(),
});

/**
 * Schema para asignar profesor a asignatura
 */
export const AssignTeacherToSubjectSchema = z.object({
  teacherId: z.string()
    .min(1, 'El ID del profesor es obligatorio')
    .uuid('El ID del profesor no tiene un formato válido'),

  subjectId: z.string()
    .min(1, 'El ID de la asignatura es obligatorio')
    .uuid('El ID de la asignatura no tiene un formato válido'),

  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),
});

/**
 * Schema para crear asignatura con profesor
 */
export const CreateSubjectWithTeacherSchema = z.object({
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  courseId: z.string()
    .min(1, 'El ID del curso es obligatorio')
    .uuid('El ID del curso no tiene un formato válido'),

  name: z.string()
    .min(2, 'El nombre de la asignatura es obligatorio')
    .max(100, 'El nombre de la asignatura excede el límite de caracteres')
    .transform(sanitizeString),

  code: z.string()
    .max(20, 'El código excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined)
    .optional(),

  hoursPerWeek: z.number()
    .int('Las horas semanales deben ser un número entero')
    .min(1, 'Debe tener al menos 1 hora semanal')
    .max(40, 'No puede exceder 40 horas semanales')
    .default(4),

  teacherId: z.string()
    .uuid('El ID del profesor no tiene un formato válido')
    .optional(),
});

/**
 * Schema para buscar profesores
 */
export const SearchTeachersSchema = z.object({
  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),

  specialty: z.string()
    .max(100, 'La especialidad excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined)
    .optional(),

  courseId: z.string()
    .uuid('El ID del curso no tiene un formato válido')
    .optional(),

  search: z.string()
    .max(100, 'El término de búsqueda excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined)
    .optional(),

  limit: z.number()
    .int('El límite debe ser un número entero')
    .min(1, 'El límite debe ser al menos 1')
    .max(100, 'El límite no puede exceder 100')
    .default(20),

  offset: z.number()
    .int('El offset debe ser un número entero')
    .min(0, 'El offset no puede ser negativo')
    .default(0),
});

/**
 * Schema para actualizar perfil de profesor
 */
export const UpdateTeacherProfileSchema = z.object({
  specialty: z.string()
    .min(2, 'La especialidad debe tener al menos 2 caracteres')
    .max(200, 'La especialidad excede el límite de caracteres')
    .transform(val => val ? sanitizeString(val) : undefined)
    .optional(),
});

/**
 * Schema para asignar múltiples asignaturas a profesor
 */
export const AssignMultipleSubjectsSchema = z.object({
  teacherId: z.string()
    .min(1, 'El ID del profesor es obligatorio')
    .uuid('El ID del profesor no tiene un formato válido'),

  subjectIds: z.array(z.string().uuid('El ID de la asignatura no tiene un formato válido'))
    .min(1, 'Debe seleccionar al menos una asignatura')
    .max(10, 'No se pueden asignar más de 10 asignaturas a la vez'),

  schoolId: z.string()
    .min(1, 'El ID del colegio es obligatorio')
    .uuid('El ID del colegio no tiene un formato válido'),
});

/**
 * Schema para actualizar especialidad de profesor
 */
export const UpdateTeacherSpecialtySchema = z.object({
  teacherId: z.string()
    .min(1, 'El ID del profesor es obligatorio')
    .uuid('El ID del profesor no tiene un formato válido'),

  specialty: z.string()
    .min(2, 'La especialidad debe tener al menos 2 caracteres')
    .max(200, 'La especialidad excede el límite de caracteres')
    .transform(sanitizeString),
});

// Tipos TypeScript exportados
export type CreateTeacherInput = z.infer<typeof CreateTeacherSchema>;
export type UpdateTeacherInput = z.infer<typeof UpdateTeacherSchema>;
export type AssignTeacherToSubjectInput = z.infer<typeof AssignTeacherToSubjectSchema>;
export type CreateSubjectWithTeacherInput = z.infer<typeof CreateSubjectWithTeacherSchema>;
export type SearchTeachersInput = z.infer<typeof SearchTeachersSchema>;
export type UpdateTeacherProfileInput = z.infer<typeof UpdateTeacherProfileSchema>;
export type AssignMultipleSubjectsInput = z.infer<typeof AssignMultipleSubjectsSchema>;
export type UpdateTeacherSpecialtyInput = z.infer<typeof UpdateTeacherSpecialtySchema>;