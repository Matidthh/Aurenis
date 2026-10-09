/**
 * ============================================================================
 * SUITE DE PRUEBAS AUTOMATIZADAS: VALIDACIÓN ZOD EN REGISTRO DE ESTUDIANTES
 * ============================================================================
 * Responsables:
 * - Frank M. (QA, Testing & Auditoría de Seguridad / Circular 482)
 * - Maicol R. (Backend, Arquitectura Zod & Integridad Módulo 11)
 * ============================================================================
 */

import {
  StudentRutSchema,
  GuardianRutSchema,
  StudentIdentificationSchema,
  StudentMedicalRecordSchema,
  diagnoseRut,
  validateFieldWithZod,
  validateStepWithZod,
} from "../lib/validations/student.schema";

console.log("================================================================================");
console.log("   TEST DE VALIDACIÓN ZOD: RUT Y FICHA MÉDICA EN REGISTRO DE ESTUDIANTES");
console.log("================================================================================");

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, failureDetails?: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    if (failureDetails) console.error(`    Detalle: ${failureDetails}`);
    process.exit(1);
  }
}

// ----------------------------------------------------------------------------
// SECCIÓN 1: VALIDACIÓN GRANULAR DE RUT CON ZOD Y DIAGNÓSTICO POR CAMPO
// ----------------------------------------------------------------------------
console.log("\n[1] Probando validaciones específicas por campo del RUN/RUT...");

// 1.1 RUN Vacío
const emptyRutResult = StudentRutSchema.safeParse("");
assert(
  !emptyRutResult.success &&
    emptyRutResult.error.issues[0].message.includes("obligatorio"),
  "RUN vacío detectado con mensaje específico de obligatoriedad"
);

// 1.2 Formato con múltiples guiones
const formatDiag = diagnoseRut("21-491-028-4", "student");
assert(
  !formatDiag.isValid &&
    formatDiag.errorField === "format" &&
    formatDiag.error!.includes("solo debe contener un guion separador"),
  "RUN con múltiples guiones detectado con error de formato"
);

// 1.3 RUN demasiado corto
const shortDiag = diagnoseRut("1-9", "student");
assert(
  !shortDiag.isValid &&
    shortDiag.errorField === "length" &&
    shortDiag.error!.includes("demasiado corto"),
  "RUN demasiado corto detectado con error específico de longitud"
);

// 1.4 Cuerpo no numérico
const nonNumericDiag = diagnoseRut("2149A028-4", "student");
assert(
  !nonNumericDiag.isValid &&
    nonNumericDiag.errorField === "body" &&
    nonNumericDiag.error!.includes("solo debe contener dígitos numéricos"),
  "Cuerpo con letras detectado con error específico de dígitos numéricos"
);

// 1.5 Dígito Verificador con carácter inválido
const invalidDvDiag = diagnoseRut("21491028-Z", "student");
assert(
  !invalidDvDiag.isValid &&
    invalidDvDiag.errorField === "dv" &&
    invalidDvDiag.error!.toLowerCase().includes("debe ser un dígito del 0 al 9 o la letra k"),
  "Dígito verificador inválido ('Z') detectado con error de rango 0-9/K"
);

// 1.6 Módulo 11: Dígito Verificador Mismatch
const mismatchDiag = diagnoseRut("21491028-9", "student"); // El cálculo real para 21491028 es 4
assert(
  !mismatchDiag.isValid &&
    mismatchDiag.errorField === "algorithm" &&
    mismatchDiag.expectedDv === "4" &&
    mismatchDiag.error!.includes("el dígito calculado es \"4\"") &&
    mismatchDiag.error!.includes("se ingresó \"9\""),
  "Error de Módulo 11 muestra claramente el dígito esperado ('4') vs el ingresado ('9')"
);

// 1.7 RUN Válido formateado con puntos y guion
const validRutParsed = StudentRutSchema.safeParse("21.491.028-4");
assert(validRutParsed.success, "RUN chileno oficial formateado (21.491.028-4) aceptado con éxito");

// 1.8 RUN Válido sin puntos ni guion
const validCleanParsed = StudentRutSchema.safeParse("214910284");
assert(validCleanParsed.success, "RUN sin formato (214910284) normalizado y aceptado por Zod");

// 1.9 RUN con DV 'K' (Apoderado)
const guardianRutParsed = GuardianRutSchema.safeParse("14.892.404-K");
assert(guardianRutParsed.success, "RUN con dígito verificador 'K' (14.892.404-K) aceptado por Zod");

// ----------------------------------------------------------------------------
// SECCIÓN 2: VALIDACIÓN DE FICHA MÉDICA ESCOLAR (CIRCULAR 482)
// ----------------------------------------------------------------------------
console.log("\n[2] Probando validaciones específicas de Ficha Médica con Zod...");

// 2.1 Grupo sanguíneo inválido
const invalidBloodResult = StudentMedicalRecordSchema.safeParse({
  bloodGroup: "INVALIDO",
  healthSystem: "FONASA",
});
assert(
  !invalidBloodResult.success &&
    invalidBloodResult.error.issues.some((i) => i.path[0] === "bloodGroup"),
  "Grupo sanguíneo no válido rechazado por Zod con mensaje explícito"
);

// 2.2 Sistema de salud inválido
const invalidHealthResult = StudentMedicalRecordSchema.safeParse({
  bloodGroup: "O+",
  healthSystem: "NO_EXISTE",
});
assert(
  !invalidHealthResult.success &&
    invalidHealthResult.error.issues.some((i) => i.path[0] === "healthSystem"),
  "Sistema de salud no reconocido rechazado por Zod"
);

// 2.3 Alergias activadas sin detalle
const emptyAllergyResult = StudentMedicalRecordSchema.safeParse({
  bloodGroup: "O+",
  healthSystem: "FONASA",
  hasAllergies: true,
  allergyDetails: "",
});
assert(
  !emptyAllergyResult.success &&
    emptyAllergyResult.error.issues.some(
      (i) => i.path[0] === "allergyDetails" && i.message.includes("Debe especificar los alérgenos")
    ),
  "Alergias activadas sin detalle rechazadas por superRefine de Zod"
);

// 2.4 Alergias con detalle demasiado corto (< 3 caracteres)
const shortAllergyResult = StudentMedicalRecordSchema.safeParse({
  bloodGroup: "O+",
  healthSystem: "FONASA",
  hasAllergies: true,
  allergyDetails: "ab",
});
assert(
  !shortAllergyResult.success &&
    shortAllergyResult.error.issues.some(
      (i) => i.path[0] === "allergyDetails" && i.message.includes("al menos 3 caracteres")
    ),
  "Detalle de alergias menor a 3 caracteres rechazado"
);

// 2.5 Alergias con texto placeholder ('ninguna')
const placeholderAllergyResult = StudentMedicalRecordSchema.safeParse({
  bloodGroup: "O+",
  healthSystem: "FONASA",
  hasAllergies: true,
  allergyDetails: "ninguna",
});
assert(
  !placeholderAllergyResult.success &&
    placeholderAllergyResult.error.issues.some(
      (i) => i.path[0] === "allergyDetails" && i.message.includes("desmarque la casilla")
    ),
  "Placeholder 'ninguna' en alergias rechazado solicitando desmarcar casilla"
);

// 2.6 Alergias válidas con protocolo
const validAllergyResult = StudentMedicalRecordSchema.safeParse({
  bloodGroup: "O+",
  healthSystem: "FONASA",
  hasAllergies: true,
  allergyDetails: "Alergia severa a Penicilina. Requiere antihistamínico de rescate.",
});
assert(validAllergyResult.success, "Detalle válido de alergia con protocolo aceptado por Zod");

// 2.7 Condición crónica activada sin detalle
const emptyChronicResult = StudentMedicalRecordSchema.safeParse({
  bloodGroup: "O+",
  healthSystem: "FONASA",
  hasChronicCondition: true,
  chronicConditionDetails: "",
});
assert(
  !emptyChronicResult.success &&
    emptyChronicResult.error.issues.some(
      (i) => i.path[0] === "chronicConditionDetails" && i.message.includes("Debe detallar el diagnóstico")
    ),
  "Condición médica crónica sin diagnóstico rechazada por Zod"
);

// 2.8 Condición crónica válida
const validChronicResult = StudentMedicalRecordSchema.safeParse({
  bloodGroup: "O+",
  healthSystem: "FONASA",
  hasChronicCondition: true,
  chronicConditionDetails: "Asma bronquial con inhalador Salbutamol antes de Educación Física.",
});
assert(validChronicResult.success, "Diagnóstico crónico y cuidados en aula aceptados por Zod");

// 2.9 Teléfono de urgencia con formato erróneo
const invalidPhoneResult = StudentMedicalRecordSchema.safeParse({
  bloodGroup: "O+",
  healthSystem: "FONASA",
  emergencyPhone: "123",
});
assert(
  !invalidPhoneResult.success &&
    invalidPhoneResult.error.issues.some(
      (i) => i.path[0] === "emergencyPhone" && i.message.includes("formato chileno válido")
    ),
  "Teléfono de urgencia inválido rechazado con mensaje específico de formato chileno"
);

// 2.10 Teléfono de urgencia válido
const validPhoneResult = StudentMedicalRecordSchema.safeParse({
  bloodGroup: "O+",
  healthSystem: "FONASA",
  emergencyPhone: "+56 9 1122 3344",
});
assert(validPhoneResult.success, "Teléfono de urgencia en formato chileno (+56 9 1122 3344) aceptado");

// ----------------------------------------------------------------------------
// SECCIÓN 3: HELPER DE VALIDACIÓN REACTIVA POR CAMPO (validateFieldWithZod)
// ----------------------------------------------------------------------------
console.log("\n[3] Probando helper reactivo de validación en tiempo real (validateFieldWithZod)...");

const realTimeRutErr = validateFieldWithZod(1, "rut", { rut: "12345" });
assert(
  !realTimeRutErr.isValid && Boolean(realTimeRutErr.error),
  "validateFieldWithZod detecta RUN inválido en tiempo real para Step 1"
);

const realTimeAllergyErr = validateFieldWithZod(4, "allergyDetails", {
  bloodGroup: "O+",
  healthSystem: "FONASA",
  hasAllergies: true,
  allergyDetails: "",
});
assert(
  !realTimeAllergyErr.isValid && Boolean(realTimeAllergyErr.error),
  "validateFieldWithZod detecta campo condicional incompleto en Step 4 (Ficha Médica)"
);

const realTimeStepValid = validateStepWithZod(4, {
  bloodGroup: "A+",
  healthSystem: "ISAPRE",
  hasAllergies: false,
  hasChronicCondition: false,
  emergencyPhone: "",
  medicalNotes: "Sin observaciones médicas relevantes.",
  isJunaebBeneficiary: false,
});
assert(realTimeStepValid.isValid, "validateStepWithZod aprueba Ficha Médica completa y válida");

console.log("\n================================================================================");
console.log(`   RESULTADO DE PRUEBAS ZOD: ${passedTests}/${totalTests} CASOS EXITOSOS (100%)`);
console.log("   INTEGRACIÓN ZOD PARA RUT Y FICHA MÉDICA: COMPLETA Y VERIFICADA");
console.log("================================================================================");
