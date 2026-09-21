/**
 * Motor de Mapeo de Errores de API y Validación Zod para Aurenis
 * Responsable de autoría: Malcom Marcelo (Arquitectura Core & Estandarización de Errores HTTP)
 *
 * Mapea respuestas de error JSON de la API (400, 401, 403, 422, 500, etc.)
 * a estructuras tipadas y alertas legibles en pantalla para el usuario.
 */

export interface ZodFlattenedError {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
}

export interface ZodIssueItem {
  path?: (string | number)[];
  message?: string;
  code?: string;
}

/**
 * Diccionario de etiquetas legibles en español para campos comunes del sistema educativo.
 */
export const FIELD_NAME_TRANSLATIONS: Record<string, string> = {
  // Institución & Configuración
  name: "Nombre",
  slug: "Identificador (Slug)",
  institutionalCode: "Código Institucional (RBD)",
  address: "Dirección",
  city: "Ciudad",
  country: "País",
  timezone: "Zona Horaria",
  contactEmail: "Correo de Contacto",
  contactPhone: "Teléfono de Contacto",
  motto: "Lema Institucional",
  termType: "Régimen Lectivo",
  minPassingGrade: "Nota Mínima de Aprobación",
  minGrade: "Nota Mínima de la Escala",
  maxGrade: "Nota Máxima de la Escala",
  gradeScalePrecision: "Precisión Decimal de Notas",
  primaryColor: "Color Institucional",
  requireAttendanceNote: "Justificación de Inasistencias",
  minAttendancePercentage: "Porcentaje Mínimo de Asistencia",
  defaultAssessmentWeight: "Ponderación por Defecto",

  // Periodos Académicos
  year: "Año Lectivo",
  startDate: "Fecha de Inicio",
  endDate: "Fecha de Término",
  weightPercentage: "Porcentaje de Ponderación",
  isCurrent: "Periodo Vigente",
  isClosed: "Periodo Cerrado",

  // Cursos & Asignaturas
  code: "Código",
  level: "Nivel / Grado",
  section: "Sección / Letra",
  shift: "Jornada",
  capacity: "Capacidad Máxima",
  academicPeriodId: "Periodo Académico",
  courseId: "Curso",
  subjectId: "Asignatura",
  teacherId: "Profesor Asignado",
  hoursPerWeek: "Horas Semanales",

  // Evaluaciones & Calificaciones
  title: "Título de la Evaluación",
  description: "Descripción",
  date: "Fecha de Aplicación",
  weight: "Ponderación (%)",
  gradeValue: "Calificación",
  studentId: "Estudiante",

  // Usuarios, Profesores, Estudiantes
  email: "Correo Electrónico",
  password: "Contraseña",
  confirmPassword: "Confirmación de Contraseña",
  rut: "RUT / Identificación",
  firstName: "Nombres",
  lastName: "Apellidos",
  birthDate: "Fecha de Nacimiento",
  gender: "Género",
  phone: "Teléfono",
  emergencyContact: "Contacto de Emergencia",
  specialization: "Especialidad",
  hireDate: "Fecha de Contratación",
};

/**
 * Traduce o formatea el nombre técnico de un campo a una etiqueta humana amigable.
 */
export function formatFieldLabel(fieldName: string): string {
  if (FIELD_NAME_TRANSLATIONS[fieldName]) {
    return FIELD_NAME_TRANSLATIONS[fieldName];
  }
  // Convertir camelCase o snake_case a Title Case
  return fieldName
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

/**
 * Extrae y normaliza los errores de campo generados por esquemas Zod o respuestas de la API.
 */
export function extractZodFieldErrors(details: any): {
  formErrors: string[];
  fieldErrors: Record<string, string[]>;
} {
  const result: { formErrors: string[]; fieldErrors: Record<string, string[]> } = {
    formErrors: [],
    fieldErrors: {},
  };

  if (!details) return result;

  // 1. Si es formato Zod flatten ({ formErrors: string[], fieldErrors: { [k]: string[] } })
  if (typeof details === "object") {
    if (Array.isArray(details.formErrors)) {
      result.formErrors.push(...details.formErrors.filter((e: any) => typeof e === "string"));
    }

    if (details.fieldErrors && typeof details.fieldErrors === "object") {
      Object.entries(details.fieldErrors).forEach(([field, errors]) => {
        if (Array.isArray(errors)) {
          result.fieldErrors[field] = errors.filter((e) => typeof e === "string");
        } else if (typeof errors === "string") {
          result.fieldErrors[field] = [errors];
        }
      });
    }

    // 2. Si es array de issues de Zod (o details es directamente un array)
    const issuesArray = Array.isArray(details)
      ? details
      : Array.isArray(details.issues)
      ? details.issues
      : Array.isArray(details.errors)
      ? details.errors
      : null;

    if (issuesArray) {
      issuesArray.forEach((issue: any) => {
        if (issue && typeof issue === "object") {
          const msg = typeof issue.message === "string" ? issue.message : "Dato inválido";
          const path = Array.isArray(issue.path) && issue.path.length > 0 ? String(issue.path[issue.path.length - 1]) : "";

          if (path) {
            if (!result.fieldErrors[path]) {
              result.fieldErrors[path] = [];
            }
            if (!result.fieldErrors[path].includes(msg)) {
              result.fieldErrors[path].push(msg);
            }
          } else {
            if (!result.formErrors.includes(msg)) {
              result.formErrors.push(msg);
            }
          }
        }
      });
    }

    // 3. Si details es un mapa plano de strings { field: "error" } o { field: ["error"] }
    if (
      !details.formErrors &&
      !details.fieldErrors &&
      !details.issues &&
      !details.errors &&
      !Array.isArray(details)
    ) {
      Object.entries(details).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          result.fieldErrors[key] = val.filter((e) => typeof e === "string");
        } else if (typeof val === "string") {
          result.fieldErrors[key] = [val];
        }
      });
    }
  } else if (typeof details === "string") {
    result.formErrors.push(details);
  }

  return result;
}

/**
 * Traduce códigos de estado HTTP a explicaciones semánticas en español para el usuario escolar.
 */
export function getHumanReadableErrorMessage(
  status: number,
  code?: string,
  rawMessage?: string,
  fieldErrorsCount = 0
): string {
  // Comprobar si el mensaje es un mensaje en español explícito o un texto técnico genérico en inglés
  const isGenericEnglish =
    !rawMessage ||
    /^(bad request|unauthorized|forbidden|not found|internal server error|failed to fetch|networkerror|http error)/i.test(
      rawMessage.trim()
    );

  if (status === 400) {
    if (code === "VALIDATION_ERROR" || fieldErrorsCount > 0) {
      return fieldErrorsCount > 0
        ? `Se detectaron ${fieldErrorsCount} dato(s) inválido(s) en el formulario. Por favor revise los campos destacados.`
        : "La información enviada no cumple con las reglas requeridas. Por favor verifique el formulario.";
    }
    return !isGenericEnglish
      ? rawMessage!
      : "Solicitud incorrecta o parámetros inválidos. Verifique los datos ingresados e intente nuevamente.";
  }

  if (status === 401) {
    return !isGenericEnglish
      ? rawMessage!
      : "Sesión expirada o no autenticado. Por favor vuelva a iniciar sesión para continuar.";
  }

  if (status === 403) {
    return !isGenericEnglish
      ? rawMessage!
      : "Acceso denegado o permisos insuficientes en la institución para ejecutar esta acción.";
  }

  if (status === 404) {
    return !isGenericEnglish
      ? rawMessage!
      : "El registro o recurso solicitado no fue encontrado en la institución.";
  }

  if (status === 409) {
    return !isGenericEnglish
      ? rawMessage!
      : "Existe un conflicto con los datos existentes (ej. código, RUT o correo ya registrado).";
  }

  if (status === 422) {
    return fieldErrorsCount > 0
      ? `Error de validación Zod: ${fieldErrorsCount} campo(s) no cumplen los criterios de negocio.`
      : !isGenericEnglish
      ? rawMessage!
      : "Los datos enviados son semánticamente incorrectos para el estado actual del sistema.";
  }

  if (status === 429) {
    return "Ha enviado demasiadas solicitudes en poco tiempo. Por favor espere unos segundos.";
  }

  if (status === 500) {
    return !isGenericEnglish
      ? rawMessage!
      : "Ocurrió un error inesperado en el servidor. El equipo técnico ha sido notificado.";
  }

  if (status === 503) {
    return "El servicio se encuentra temporalmente en mantenimiento. Reintente en unos instantes.";
  }

  if (status === 0 || code === "NETWORK_ERROR") {
    return "Sin comunicación con el servidor. Verifique su conexión de red o internet.";
  }

  return !isGenericEnglish
    ? rawMessage!
    : `Se produjo un error al procesar la solicitud (Código ${status}).`;
}

/**
 * Clase enriquecida de Error para respuestas HTTP de API.
 * Proporciona acceso directo a códigos de estado, mensajes amigables y errores de validación Zod.
 */
export class ApiHttpError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: any;
  readonly userMessage: string;
  readonly formErrors: string[];
  readonly fieldErrors: Record<string, string[]>;
  readonly rawResponse?: Response;
  readonly timestamp: string;

  constructor(params: {
    message?: string;
    status?: number;
    code?: string;
    details?: any;
    rawResponse?: Response;
  }) {
    const status = params.status || 500;
    const code = params.code || (status >= 500 ? "INTERNAL_ERROR" : "HTTP_ERROR");
    const { formErrors, fieldErrors } = extractZodFieldErrors(params.details);
    const fieldCount = Object.keys(fieldErrors).length;

    const userMessage = getHumanReadableErrorMessage(
      status,
      code,
      params.message,
      fieldCount
    );

    super(params.message || userMessage);
    this.name = "ApiHttpError";
    this.status = status;
    this.code = code;
    this.details = params.details;
    this.userMessage = userMessage;
    this.formErrors = formErrors;
    this.fieldErrors = fieldErrors;
    this.rawResponse = params.rawResponse;
    this.timestamp = new Date().toISOString();

    // Mantener prototipo correcto
    Object.setPrototypeOf(this, ApiHttpError.prototype);
  }

  /**
   * Helper booleano: ¿Es error de validación (400 / 422)?
   */
  get isValidationError(): boolean {
    return (
      this.status === 400 ||
      this.status === 422 ||
      this.code === "VALIDATION_ERROR" ||
      Object.keys(this.fieldErrors).length > 0
    );
  }

  /**
   * Helper booleano: ¿Es error de no autenticado (401)?
   */
  get isAuthError(): boolean {
    return this.status === 401 || this.code === "UNAUTHORIZED";
  }

  /**
   * Helper booleano: ¿Es error de permisos/prohibido (403)?
   */
  get isForbiddenError(): boolean {
    return this.status === 403 || this.code === "FORBIDDEN";
  }

  /**
   * Helper booleano: ¿Es error de no encontrado (404)?
   */
  get isNotFoundError(): boolean {
    return this.status === 404 || this.code === "NOT_FOUND";
  }

  /**
   * Helper booleano: ¿Es error de servidor (500, 503)?
   */
  get isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Helper booleano: ¿Contiene errores específicos por campo?
   */
  get hasFieldErrors(): boolean {
    return Object.keys(this.fieldErrors).length > 0;
  }

  /**
   * Helper booleano: ¿Es error de red / offline?
   */
  get isNetworkError(): boolean {
    return this.status === 0 || this.code === "NETWORK_ERROR";
  }

  /**
   * Devuelve un arreglo plano con todos los errores de campos con sus etiquetas traducidas.
   */
  getFormattedFieldErrors(): { field: string; label: string; message: string }[] {
    const list: { field: string; label: string; message: string }[] = [];
    Object.entries(this.fieldErrors).forEach(([field, errors]) => {
      const label = formatFieldLabel(field);
      errors.forEach((message) => {
        list.push({ field, label, message });
      });
    });
    return list;
  }

  /**
   * Devuelve el primer error de validación disponible como string.
   */
  getFirstFieldError(): string | null {
    if (this.formErrors.length > 0) return this.formErrors[0];
    const keys = Object.keys(this.fieldErrors);
    if (keys.length > 0) {
      const firstField = keys[0];
      const msgs = this.fieldErrors[firstField];
      if (msgs && msgs.length > 0) {
        return `${formatFieldLabel(firstField)}: ${msgs[0]}`;
      }
    }
    return null;
  }
}

/**
 * Parsea con total seguridad cualquier excepción o payload hacia una instancia de ApiHttpError.
 * Nunca lanza excepciones (Zero Uncaught Exceptions).
 */
export function parseApiError(error: unknown, fallbackMessage?: string): ApiHttpError {
  if (error instanceof ApiHttpError) {
    return error;
  }

  if (error && typeof error === "object") {
    const errObj = error as any;

    // Si tiene status o code
    const status = typeof errObj.status === "number" ? errObj.status : 500;
    const code = typeof errObj.code === "string" ? errObj.code : undefined;
    const message =
      typeof errObj.message === "string"
        ? errObj.message
        : typeof errObj.error === "string"
        ? errObj.error
        : fallbackMessage;
    const details = errObj.details || errObj.body?.details || (errObj.fieldErrors ? errObj : undefined);
    const rawResponse = errObj.rawResponse || errObj.response;

    return new ApiHttpError({
      status,
      code,
      message,
      details,
      rawResponse,
    });
  }

  if (typeof error === "string") {
    const isNetwork =
      error.toLowerCase().includes("failed to fetch") ||
      error.toLowerCase().includes("networkerror") ||
      error.toLowerCase().includes("sin conexión") ||
      error.toLowerCase().includes("offline");

    return new ApiHttpError({
      message: error,
      status: isNetwork ? 0 : 500,
      code: isNetwork ? "NETWORK_ERROR" : "UNKNOWN_ERROR",
    });
  }

  return new ApiHttpError({
    message: fallbackMessage || "Ha ocurrido un error inesperado.",
    status: 500,
  });
}
