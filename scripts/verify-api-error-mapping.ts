/**
 * Script de Auditoría Automatizada: Verificación de Mapeo de Errores JSON de la API
 * Responsable de autoría: Malcom Marcelo (Arquitectura Core & Conexión HTTP REST)
 * 
 * Criterios de Aceptación Evaluados:
 * 1. Captura de errores 400/401/403/422
 * 2. Visualización de mensajes de validación Zod en formularios
 * 3. Evitar cierres inesperados por excepciones
 */

import {
  ApiHttpError,
  parseApiError,
  extractZodFieldErrors,
  getHumanReadableErrorMessage,
  formatFieldLabel,
} from "../lib/api/api-error";

interface TestResult {
  suite: string;
  test: string;
  passed: boolean;
  message?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, suite: string, test: string, message?: string) {
  results.push({
    suite,
    test,
    passed: Boolean(condition),
    message: condition ? undefined : message || "Assertion failed",
  });
}

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log("🛡️ AUDITORÍA AUTOMATIZADA: MAPEO DE ERRORES API & ZOD");
  console.log("=======================================================\n");

  // SUITE 1: Captura de Códigos HTTP (400, 401, 403, 422, 500)
  const suite1 = "Captura de Errores HTTP (400/401/403/422/500)";

  // Test 400
  const err400 = parseApiError({
    status: 400,
    message: "Bad request payload",
  });
  assert(err400.status === 400, suite1, "Parseo de error 400");
  assert(err400.userMessage.includes("Solicitud incorrecta") || err400.userMessage.includes("parámetros"), suite1, "Mensaje amigable en español para 400");

  // Test 401
  const err401 = parseApiError({
    status: 401,
    message: "Unauthorized token",
  });
  assert(err401.status === 401, suite1, "Parseo de error 401");
  assert(err401.userMessage.includes("Sesión expirada") || err401.userMessage.includes("iniciar sesión"), suite1, "Mensaje amigable en español para 401");

  // Test 403
  const err403 = parseApiError({
    status: 403,
    message: "Forbidden access to school",
  });
  assert(err403.status === 403, suite1, "Parseo de error 403");
  assert(
    err403.userMessage.toLowerCase().includes("permisos") ||
      err403.userMessage.toLowerCase().includes("acceso denegado"),
    suite1,
    "Mensaje amigable en español para 403"
  );

  // Test 422
  const err422 = parseApiError({
    status: 422,
    details: {
      fieldErrors: {
        email: ["El correo no es válido"],
        minGrade: ["La nota mínima no puede ser negativa"],
      },
    },
  });
  assert(err422.status === 422, suite1, "Parseo de error 422");
  assert(err422.isValidationError === true, suite1, "Identificación de isValidationError en 422");
  assert(err422.hasFieldErrors === true, suite1, "Detección de hasFieldErrors en 422");

  // SUITE 2: Extracción y Formateo de Errores de Validación Zod
  const suite2 = "Visualización de Mensajes de Validación Zod";

  const rawZodPayload = {
    error: "Validation failed",
    details: {
      formErrors: ["Formulario con campos obligatorios vacíos"],
      fieldErrors: {
        termType: ["Debe seleccionar una estructura válida"],
        minPassingGrade: ["La nota de aprobación debe estar entre 1.0 y 7.0"],
      },
    },
  };

  const parsedZod = parseApiError(rawZodPayload);
  assert(parsedZod.formErrors.length === 1, suite2, "Extracción de formErrors globales");
  assert(Boolean(parsedZod.fieldErrors.termType), suite2, "Extracción de error en campo termType");
  assert(Boolean(parsedZod.fieldErrors.minPassingGrade), suite2, "Extracción de error en campo minPassingGrade");

  const formattedFields = parsedZod.getFormattedFieldErrors();
  assert(formattedFields.length === 2, suite2, "Conversión de fieldErrors a lista formateada");
  assert(formattedFields[0].label.length > 0, suite2, "Etiqueta en español generada para el campo");

  // Test Zod Issues array format
  const rawZodIssues = {
    details: {
      issues: [
        { path: ["school", "primaryColor"], message: "Color hexadecimal inválido" },
        { path: ["year"], message: "El año debe estar entre 2020 y 2030" },
      ],
    },
  };
  const extractedFromIssues = extractZodFieldErrors(rawZodIssues.details);
  assert(Boolean(extractedFromIssues.fieldErrors["school.primaryColor"] || extractedFromIssues.fieldErrors["primaryColor"]), suite2, "Normalización de array de issues Zod a fieldErrors");

  // SUITE 3: Resiliencia y Prevención de Cierres Inesperados
  const suite3 = "Prevención de Cierres Inesperados (Safe Exceptions)";

  // Test parsing undefined/null/primitives without crashing
  const errNull = parseApiError(null);
  assert(errNull instanceof ApiHttpError, suite3, "Parseo seguro de null");
  assert(errNull.status === 500, suite3, "Fallback a status 500 para null");

  const errString = parseApiError("Failed to fetch server response");
  assert(errString instanceof ApiHttpError, suite3, "Parseo seguro de string primitivo");
  assert(errString.isNetworkError === true, suite3, "Detección de NetworkError en string");

  const errCircular: any = { message: "Circular error" };
  errCircular.self = errCircular;
  const errCircParsed = parseApiError(errCircular);
  assert(errCircParsed instanceof ApiHttpError, suite3, "Parseo seguro de objeto con referencia circular");

  // Reporte de Resultados
  let passedCount = 0;
  let failedCount = 0;

  console.log("Resultados de las Pruebas:");
  results.forEach((r, i) => {
    if (r.passed) {
      passedCount++;
      console.log(`  ✅ [${r.suite}] ${r.test}`);
    } else {
      failedCount++;
      console.error(`  ❌ [${r.suite}] ${r.test}: ${r.message}`);
    }
  });

  console.log("\n-------------------------------------------------------");
  console.log(`Resumen: ${passedCount} pasadas, ${failedCount} fallidas. Total: ${results.length}`);
  console.log("-------------------------------------------------------\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Error fatal en suite de pruebas:", err);
  process.exit(1);
});
