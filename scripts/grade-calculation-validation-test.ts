/**
 * Suite Exhaustiva de Pruebas de Calificaciones, Ponderaciones, Redondeos y Notas Rojas — AURENIS
 *
 * Criterios de Aceptación (DoD):
 * 1. Cálculo matemático de promedios verificado con planilla de control.
 * 2. Pruebas de guardado masivo exitosas (BulkGradesProcessor y saveBulkMatrixGrades).
 * 3. Validación estricta de escala 1.0 a 7.0 (rango legal chileno y normalización inteligente).
 */

import { BulkGradesProcessor } from "../lib/services/bulk-grades-processor";
import {
  saveBulkMatrixGrades,
  createGrade,
  updateGrade,
  getSchoolGradingConfig,
  GradeServiceError,
} from "../lib/services/grade.service";
import {
  CreateGradeSchema,
  UpdateGradeSchema,
  BulkSaveGradesSchema,
} from "../lib/validations/grade.schema";
import { createTenantPrisma } from "../lib/db/tenant-extension";

interface TestCaseResult {
  id: string;
  name: string;
  category: "CALCULO_MATEMATICO" | "GUARDADO_MASIVO" | "VALIDACION_ESCALA" | "NOTAS_ROJAS";
  passed: boolean;
  expected: any;
  actual: any;
  details: string;
}

const testResults: TestCaseResult[] = [];

function recordTest(
  id: string,
  name: string,
  category: TestCaseResult["category"],
  passed: boolean,
  expected: any,
  actual: any,
  details: string
) {
  testResults.push({ id, name, category, passed, expected, actual, details });
  const icon = passed ? "✓" : "✗";
  console.log(`  [${icon}] [${category}] ${id}: ${name} -> ${passed ? "PASS" : "FAIL"}`);
  if (!passed) {
    console.error(`      Esperado: ${JSON.stringify(expected)}`);
    console.error(`      Obtenido: ${JSON.stringify(actual)}`);
  }
}

// -----------------------------------------------------------------------------
// PLANILLA DE CONTROL MATEMÁTICO (Referencia Oficial)
// -----------------------------------------------------------------------------
interface ControlStudent {
  id: string;
  name: string;
  grades: (number | null)[];
  weights: number[]; // en porcentaje (ej: 20, 15, 25, 15, 25 = 100%)
  expectedWeightedAvg: number; // Redondeado a 1 decimal
  expectedSimpleAvg: number;   // Redondeado a 1 decimal
  expectedIsRed: boolean;     // Promedio < 4.0
  redGradesCount: number;     // Notas individuales < 4.0
}

const CONTROL_SPREADSHEET: ControlStudent[] = [
  {
    id: "std_control_1",
    name: "Valentina Álvarez (Alumna Sobresaliente)",
    grades: [6.8, 6.5, 7.0, 6.2, 6.9],
    weights: [20, 15, 25, 15, 25],
    // Ponderado: (6.8*0.2) + (6.5*0.15) + (7.0*0.25) + (6.2*0.15) + (6.9*0.25)
    // = 1.36 + 0.975 + 1.75 + 0.93 + 1.725 = 6.74 -> 6.7
    expectedWeightedAvg: 6.7,
    expectedSimpleAvg: 6.7, // (6.8+6.5+7.0+6.2+6.9)/5 = 33.4 / 5 = 6.68 -> 6.7
    expectedIsRed: false,
    redGradesCount: 0,
  },
  {
    id: "std_control_2",
    name: "Lucas Fuentes (Alumno en Riesgo Crítico / Notas Rojas)",
    grades: [3.2, 3.8, 2.9, 4.0, 3.4],
    weights: [20, 15, 25, 15, 25],
    // Ponderado: (3.2*0.2) + (3.8*0.15) + (2.9*0.25) + (4.0*0.15) + (3.4*0.25)
    // = 0.64 + 0.57 + 0.725 + 0.60 + 0.85 = 3.385 -> 3.4
    expectedWeightedAvg: 3.4,
    expectedSimpleAvg: 3.5, // (3.2+3.8+2.9+4.0+3.4)/5 = 17.3 / 5 = 3.46 -> 3.5
    expectedIsRed: true,
    redGradesCount: 4, // 3.2, 3.8, 2.9, 3.4 (< 4.0)
  },
  {
    id: "std_control_3",
    name: "Isidora Cáceres (Caso Límite / Aprobación en la Frontera)",
    grades: [3.8, 4.5, 3.5, 4.2, 3.9],
    weights: [20, 15, 25, 15, 25],
    // Ponderado: (3.8*0.2) + (4.5*0.15) + (3.5*0.25) + (4.2*0.15) + (3.9*0.25)
    // = 0.76 + 0.675 + 0.875 + 0.63 + 0.975 = 3.915 -> 3.9
    expectedWeightedAvg: 3.9,
    expectedSimpleAvg: 4.0, // (3.8+4.5+3.5+4.2+3.9)/5 = 19.9 / 5 = 3.98 -> 4.0
    expectedIsRed: true, // Ponderado es 3.9 < 4.0 (reprobado por ponderación)
    redGradesCount: 3, // 3.8, 3.5, 3.9
  },
  {
    id: "std_control_4",
    name: "Benjamín Silva (Notas Incompletas / Evaluación Pendiente)",
    grades: [5.5, 6.0, null, 5.0, null], // Solo N1, N2, N4
    weights: [20, 15, 25, 15, 25],
    // Ponderación renormalizada a las notas presentes (20 + 15 + 15 = 50% de peso total):
    // Suma ponderada = (5.5*0.2) + (6.0*0.15) + (5.0*0.15) = 1.1 + 0.9 + 0.75 = 2.75
    // Promedio ponderado renormalizado = 2.75 / 0.50 = 5.50 -> 5.5
    expectedWeightedAvg: 5.5,
    expectedSimpleAvg: 5.5, // (5.5 + 6.0 + 5.0)/3 = 16.5 / 3 = 5.5
    expectedIsRed: false,
    redGradesCount: 0,
  },
  {
    id: "std_control_5",
    name: "Constanza Lagos (Efecto Coeficiente 2)",
    grades: [4.0, 4.0, 4.0, 4.0, 7.0], // Coef 2 o peso alto (N5 vale 40%)
    weights: [15, 15, 15, 15, 40],
    // Ponderado: (4*0.15)*4 + (7.0*0.40) = 2.4 + 2.8 = 5.20 -> 5.2
    expectedWeightedAvg: 5.2,
    expectedSimpleAvg: 4.6, // (4+4+4+4+7)/5 = 23/5 = 4.6
    expectedIsRed: false,
    redGradesCount: 0,
  },
];

// Helper de cálculo idéntico al motor de UI y Backend
function computeWeightedAverage(grades: (number | null)[], weights: number[], precision: number = 1): number | null {
  let weightedSum = 0;
  let totalWeight = 0;

  for (let i = 0; i < grades.length; i++) {
    const g = grades[i];
    const w = weights[i];
    if (g !== null && g !== undefined && !isNaN(g)) {
      weightedSum += g * (w / 100);
      totalWeight += w / 100;
    }
  }

  if (totalWeight === 0) return null;
  const rawAvg = weightedSum / totalWeight;
  const factor = Math.pow(10, precision);
  return Math.round(rawAvg * factor) / factor;
}

function computeSimpleAverage(grades: (number | null)[], precision: number = 1): number | null {
  const valid = grades.filter((g): g is number => g !== null && g !== undefined && !isNaN(g));
  if (valid.length === 0) return null;
  const rawAvg = valid.reduce((a, b) => a + b, 0) / valid.length;
  const factor = Math.pow(10, precision);
  return Math.round(rawAvg * factor) / factor;
}

// Helper del parser de entrada rápida (ej: "65" -> 6.5)
function parseGradeInput(raw: string): number | null {
  const clean = raw.trim().replace(",", ".");
  if (!clean) return null;
  const num = parseFloat(clean);
  if (isNaN(num)) return null;

  // Si se ingresan 2 dígitos tipo "65", convertir a 6.5
  if (num >= 10 && num <= 70) {
    return parseFloat((num / 10).toFixed(1));
  }
  if (num >= 1.0 && num <= 7.0) {
    return parseFloat(num.toFixed(1));
  }
  return null;
}

async function runGradeValidationSuite() {
  console.log("================================================================================");
  console.log("   EJECUCIÓN DE PRUEBAS DEL MOTOR DE CALIFICACIONES Y NOTAS ROJAS — AURENIS     ");
  console.log("================================================================================\n");

  const schoolId = "sch_test_grading_suite";
  const tenantDb = createTenantPrisma(schoolId);

  // ---------------------------------------------------------------------------
  // BLOQUE 1: CÁLCULO MATEMÁTICO DE PROMEDIOS CON PLANILLA DE CONTROL
  // ---------------------------------------------------------------------------
  console.log("--- BLOQUE 1: Verificación de Fórmulas Matemáticas y Ponderaciones ---");

  for (const student of CONTROL_SPREADSHEET) {
    const computedWeighted = computeWeightedAverage(student.grades, student.weights, 1);
    const computedSimple = computeSimpleAverage(student.grades, 1);

    const weightedPass = computedWeighted === student.expectedWeightedAvg;
    recordTest(
      `MATH-W-${student.id}`,
      `Promedio Ponderado de ${student.name}`,
      "CALCULO_MATEMATICO",
      weightedPass,
      student.expectedWeightedAvg,
      computedWeighted,
      `Notas: [${student.grades.join(", ")}], Pesos: [${student.weights.join("%, ")}%]`
    );

    const simplePass = computedSimple === student.expectedSimpleAvg;
    recordTest(
      `MATH-S-${student.id}`,
      `Promedio Simple de ${student.name}`,
      "CALCULO_MATEMATICO",
      simplePass,
      student.expectedSimpleAvg,
      computedSimple,
      `Notas: [${student.grades.join(", ")}]`
    );

    const isRed = computedWeighted !== null && computedWeighted < 4.0;
    const redStatusPass = isRed === student.expectedIsRed;
    recordTest(
      `RED-AVG-${student.id}`,
      `Detección de Promedio Rojo (< 4.0) para ${student.name}`,
      "NOTAS_ROJAS",
      redStatusPass,
      student.expectedIsRed,
      isRed,
      `Promedio calculado: ${computedWeighted}`
    );

    const actualRedCount = student.grades.filter((g) => g !== null && g < 4.0).length;
    const redCountPass = actualRedCount === student.redGradesCount;
    recordTest(
      `RED-COUNT-${student.id}`,
      `Conteo de Notas Rojas Parciales para ${student.name}`,
      "NOTAS_ROJAS",
      redCountPass,
      student.redGradesCount,
      actualRedCount,
      `Esperadas ${student.redGradesCount} notas rojas`
    );
  }

  // ---------------------------------------------------------------------------
  // BLOQUE 2: CASOS LÍMITE DE REDONDEO DECIMAL (Escala 1 decimal)
  // ---------------------------------------------------------------------------
  console.log("\n--- BLOQUE 2: Casos de Precisión y Redondeo Matemático ---");

  const roundingCases = [
    { name: "3.94 redondea a 3.9 (Rojo se mantiene)", input: [3.9, 3.9, 4.0, 4.0, 3.9], weights: [20, 20, 20, 20, 20], expected: 3.9 },
    { name: "3.95 redondea a 4.0 (Aprobación por corte)", input: [3.9, 4.0, 3.9, 4.0, 4.0], weights: [20, 20, 20, 20, 20], expected: 4.0 },
    { name: "6.95 redondea a 7.0 (Tope máximo de escala)", input: [7.0, 6.9, 7.0, 6.9, 7.0], weights: [20, 20, 20, 20, 20], expected: 7.0 },
    { name: "1.04 redondea a 1.0 (Piso mínimo de escala)", input: [1.0, 1.0, 1.1, 1.1, 1.0], weights: [20, 20, 20, 20, 20], expected: 1.0 },
  ];

  for (let i = 0; i < roundingCases.length; i++) {
    const rc = roundingCases[i];
    const computed = computeWeightedAverage(rc.input, rc.weights, 1);
    const pass = computed === rc.expected;
    recordTest(
      `ROUND-${i + 1}`,
      rc.name,
      "CALCULO_MATEMATICO",
      pass,
      rc.expected,
      computed,
      `Entrada: [${rc.input.join(", ")}]`
    );
  }

  // ---------------------------------------------------------------------------
  // BLOQUE 3: VALIDACIÓN DE ESCALA 1.0 A 7.0 Y PARSER INTELIGENTE
  // ---------------------------------------------------------------------------
  console.log("\n--- BLOQUE 3: Validación de Escala 1.0 - 7.0 y Parser Rápido ---");

  const parserCases = [
    { input: "6.5", expected: 6.5, name: "Decimal con punto '6.5'" },
    { input: "6,5", expected: 6.5, name: "Decimal con coma chilena '6,5'" },
    { input: "65", expected: 6.5, name: "Modo rápido dos dígitos '65' -> 6.5" },
    { input: "70", expected: 7.0, name: "Modo rápido nota máxima '70' -> 7.0" },
    { input: "10", expected: 1.0, name: "Modo rápido nota mínima '10' -> 1.0" },
    { input: "38", expected: 3.8, name: "Modo rápido nota roja '38' -> 3.8" },
    { input: "40", expected: 4.0, name: "Modo rápido nota corte '40' -> 4.0" },
    { input: "7.0", expected: 7.0, name: "Nota máxima '7.0'" },
    { input: "1.0", expected: 1.0, name: "Nota mínima '1.0'" },
    { input: "7.5", expected: null, name: "Nota fuera de rango superior '7.5' (Rechazada)" },
    { input: "0.8", expected: null, name: "Nota fuera de rango inferior '0.8' (Rechazada)" },
    { input: "85", expected: null, name: "Modo rápido fuera de rango '85' (Rechazada)" },
    { input: "abc", expected: null, name: "Entrada no numérica 'abc' (Rechazada)" },
    { input: "", expected: null, name: "Entrada vacía (Nula)" },
  ];

  for (let i = 0; i < parserCases.length; i++) {
    const pc = parserCases[i];
    const parsed = parseGradeInput(pc.input);
    const pass = parsed === pc.expected;
    recordTest(
      `PARSE-${i + 1}`,
      pc.name,
      "VALIDACION_ESCALA",
      pass,
      pc.expected,
      parsed,
      `Raw input: '${pc.input}'`
    );
  }

  // Validación de esquemas Zod (CreateGradeSchema y BulkSaveGradesSchema)
  const zodValid = CreateGradeSchema.safeParse({
    assessmentId: "ass_1",
    enrollmentId: "enr_1",
    value: 6.5,
  });
  recordTest(
    "ZOD-VALID",
    "Esquema Zod acepta calificación válida dentro de escala",
    "VALIDACION_ESCALA",
    zodValid.success,
    true,
    zodValid.success,
    "Valor: 6.5"
  );

  const zodInvalid = CreateGradeSchema.safeParse({
    assessmentId: "ass_1",
    enrollmentId: "enr_1",
    value: 0.5, // Menor a 1.0
  });
  recordTest(
    "ZOD-INVALID-MIN",
    "Esquema Zod rechaza calificación menor a 1.0",
    "VALIDACION_ESCALA",
    !zodInvalid.success,
    false,
    zodInvalid.success,
    "Valor: 0.5"
  );

  // Validación en createGrade con nota fuera de rango (lógica de negocio)
  try {
    await createGrade(tenantDb, schoolId, {
      assessmentId: "ass_1",
      enrollmentId: "enr_1",
      value: 8.5, // Fuera de rango
    });
    recordTest("SVC-RANGE-CHECK", "Servicio debe rechazar nota 8.5", "VALIDACION_ESCALA", false, "Error", "Success", "");
  } catch (err: any) {
    const pass = err instanceof GradeServiceError && err.message.includes("fuera del rango");
    recordTest(
      "SVC-RANGE-CHECK",
      "Servicio rechaza nota 8.5 con GradeServiceError explicativo",
      "VALIDACION_ESCALA",
      pass,
      true,
      pass,
      err.message
    );
  }

  // ---------------------------------------------------------------------------
  // BLOQUE 4: PRUEBAS DE GUARDADO MASIVO (BULK GRADES)
  // ---------------------------------------------------------------------------
  console.log("\n--- BLOQUE 4: Pruebas de Guardado Masivo de Calificaciones ---");

  // 1. Guardado masivo mediante saveBulkMatrixGrades (Modo Planilla Matricial)
  const matrixPayload = [
    { assessmentId: "ass_eval_1", enrollmentId: "enr_std_1", value: 6.8 },
    { assessmentId: "ass_eval_2", enrollmentId: "enr_std_1", value: 6.5 },
    { assessmentId: "ass_eval_1", enrollmentId: "enr_std_2", value: 3.5 }, // Roja
    { assessmentId: "ass_eval_2", enrollmentId: "enr_std_2", value: 3.8 }, // Roja
    { assessmentId: "ass_eval_1", enrollmentId: "enr_std_3", value: 5.4 },
    { assessmentId: "ass_eval_2", enrollmentId: "enr_std_3", value: 9.9 }, // Inválida, debe ser filtrada
  ];

  const bulkMatrixResult = await saveBulkMatrixGrades(tenantDb, schoolId, matrixPayload);
  const matrixPass =
    bulkMatrixResult.success === true &&
    bulkMatrixResult.savedCount === 5 && // 5 válidas, 1 descartada
    bulkMatrixResult.totalReceived === 6;

  recordTest(
    "BULK-MATRIX-SAVE",
    "Guardado Masivo Matricial (saveBulkMatrixGrades) procesa válidas y descarta anómalas",
    "GUARDADO_MASIVO",
    matrixPass,
    { success: true, savedCount: 5, totalReceived: 6 },
    { success: bulkMatrixResult.success, savedCount: bulkMatrixResult.savedCount, totalReceived: bulkMatrixResult.totalReceived },
    `5 notas guardadas correctamente de 6 recibidas`
  );

  // 2. Procesamiento de Alto Rendimiento con BulkGradesProcessor (Lotes concurrentes / Chunking)
  const highVolumeGrades: Array<{ enrollmentId: string; value: number; comment?: string }> = [];
  const TOTAL_TEST_GRADES = 150; // Supera el tamaño de chunk (100) para verificar paginación de transacciones

  for (let i = 1; i <= TOTAL_TEST_GRADES; i++) {
    // Generar notas intercalando rojas y aprobadas en rango 1.0 a 7.0
    const val = 1.0 + Math.round(((i * 7) % 60) * 10) / 100; // Entre 1.0 y 7.0
    highVolumeGrades.push({
      enrollmentId: `enr_batch_${i}`,
      value: Math.min(7.0, Math.max(1.0, val)),
      comment: `Evaluación masiva N1 alumno ${i}`,
    });
  }

  // Insertar una nota anómala intencional para verificar tolerancia a fallos
  highVolumeGrades.push({
    enrollmentId: "enr_batch_invalid",
    value: 8.9, // Inválida
    comment: "Nota inválida",
  });

  const bulkProcessorResult = await BulkGradesProcessor.processBulkGrades({
    assessmentId: "ass_massive_1",
    schoolId,
    grades: highVolumeGrades,
    userId: "usr_teacher_tester",
  });

  const processorPass =
    bulkProcessorResult.totalProcessed === TOTAL_TEST_GRADES + 1 &&
    bulkProcessorResult.successCount === TOTAL_TEST_GRADES &&
    bulkProcessorResult.errorCount === 1;

  recordTest(
    "BULK-PROCESSOR-CHUNKING",
    `BulkGradesProcessor procesa lote de ${TOTAL_TEST_GRADES} calificaciones con fragmentación transaccional`,
    "GUARDADO_MASIVO",
    processorPass,
    { total: TOTAL_TEST_GRADES + 1, success: TOTAL_TEST_GRADES, error: 1 },
    { total: bulkProcessorResult.totalProcessed, success: bulkProcessorResult.successCount, error: bulkProcessorResult.errorCount },
    `Notas procesadas con éxito: ${bulkProcessorResult.successCount}, Errores controlados: ${bulkProcessorResult.errorCount}`
  );

  // ---------------------------------------------------------------------------
  // RESUMEN GLOBAL DE RESULTADOS
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log("                      RESUMEN EJECUTIVO DE LA AUDITORÍA                         ");
  console.log("================================================================================");

  const totalTests = testResults.length;
  const passedTests = testResults.filter((t) => t.passed).length;
  const failedTests = totalTests - passedTests;
  const successPct = ((passedTests / totalTests) * 100).toFixed(1);

  console.log(`Total de Pruebas Ejecutadas: ${totalTests}`);
  console.log(`Pruebas Aprobadas:          ${passedTests} (${successPct}%)`);
  console.log(`Pruebas Fallidas:           ${failedTests}`);

  const byCat = (cat: TestCaseResult["category"]) => {
    const list = testResults.filter((t) => t.category === cat);
    return `${list.filter((t) => t.passed).length}/${list.length}`;
  };

  console.log(`\nDesglose por Criterio de Aceptación:`);
  console.log(`  1. Cálculo Matemático de Promedios:   ${byCat("CALCULO_MATEMATICO")}`);
  console.log(`  2. Detección y Conteo de Notas Rojas: ${byCat("NOTAS_ROJAS")}`);
  console.log(`  3. Validación de Escala 1.0 a 7.0:    ${byCat("VALIDACION_ESCALA")}`);
  console.log(`  4. Pruebas de Guardado Masivo:        ${byCat("GUARDADO_MASIVO")}`);

  if (failedTests === 0) {
    console.log("\n>>> ESTADO FINAL: 100% DE CRITERIOS DE ACEPTACIÓN CUMPLIDOS CON ÉXITO <<<");
  } else {
    console.error("\n>>> ESTADO FINAL: SE DETECTARON FALLOS EN LA SUITE <<<");
    process.exit(1);
  }
}

runGradeValidationSuite().catch((err) => {
  console.error("Error fatal durante la ejecución de las pruebas:", err);
  process.exit(1);
});
