/**
 * ============================================================================
 * PRUEBA DE REGRESIÓN Y VALIDACIÓN QA: MIDDLEWARE DE INTEGRIDAD ACADÉMICA
 * ============================================================================
 * Autor: Frank M. (QA, Auditoría de Seguridad & Testing) & Maicol R. (Backend Lead)
 * 
 * Verifica que el middleware de escala intercepte y rechace notas inválidas
 * ANTES de cualquier inserción o mutación en la base de datos PostgreSQL.
 * ============================================================================
 */

import { validateGradeAgainstScale, executeGradeScaleMiddleware, SchoolGradingConfig } from "../lib/security/grade-scale-validator";

async function runGradeScaleMiddlewareTests() {
  console.log("================================================================================");
  console.log("🛡️ VERIFICACIÓN DEL MIDDLEWARE DE INTEGRIDAD ACADÉMICA (ESCALA DE NOTAS)");
  console.log("================================================================================\n");

  const standardChileanConfig: SchoolGradingConfig = {
    minGrade: 1.0,
    maxGrade: 7.0,
    precision: 1,
    minPassingGrade: 4.0,
    termType: "SEMESTER",
  };

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`  ✅ [PASS] ${testName}`);
    } else {
      console.error(`  ❌ [FAIL] ${testName}${detail ? ` -> ${detail}` : ""}`);
    }
  }

  // 1. Caso Nota Válida Estándar
  const check1 = validateGradeAgainstScale(5.8, standardChileanConfig);
  assert(check1.isValid && check1.value === 5.8, "Nota válida 5.8 es aceptada correctamente");

  // 2. Caso Nota Límite Inferior (1.0)
  const check2 = validateGradeAgainstScale(1.0, standardChileanConfig);
  assert(check2.isValid && check2.value === 1.0, "Nota límite inferior 1.0 es aceptada");

  // 3. Caso Nota Límite Superior (7.0)
  const check3 = validateGradeAgainstScale(7.0, standardChileanConfig);
  assert(check3.isValid && check3.value === 7.0, "Nota límite superior 7.0 es aceptada");

  // 4. Caso Nota Menor a minGrade (0.8)
  const check4 = validateGradeAgainstScale(0.8, standardChileanConfig);
  assert(!check4.isValid && check4.code === "GRADE_OUT_OF_RANGE", "Nota 0.8 (< 1.0) es rechazada con GRADE_OUT_OF_RANGE");

  // 5. Caso Nota Negativa (-2.5)
  const check5 = validateGradeAgainstScale(-2.5, standardChileanConfig);
  assert(!check5.isValid && check4.code === "GRADE_OUT_OF_RANGE", "Nota negativa -2.5 es rechazada inmediatamente");

  // 6. Caso Nota Superior a maxGrade (7.5)
  const check6 = validateGradeAgainstScale(7.5, standardChileanConfig);
  assert(!check6.isValid && check6.code === "GRADE_OUT_OF_RANGE", "Nota 7.5 (> 7.0) es rechazada con GRADE_OUT_OF_RANGE");

  // 7. Caso Nota Desorbitada (100.0)
  const check7 = validateGradeAgainstScale(100.0, standardChileanConfig);
  assert(!check7.isValid && check7.code === "GRADE_OUT_OF_RANGE", "Nota fuera de escala 100.0 es bloqueada");

  // 8. Caso NaN o Tipo Inválido ("abc")
  const check8 = validateGradeAgainstScale("abc", standardChileanConfig);
  assert(!check8.isValid && check8.code === "GRADE_IS_NAN", "Entrada no numérica ('abc') es rechazada con GRADE_IS_NAN");

  // 9. Caso Exceso de Precisión Decimal (6.845 en escala de 1 decimal)
  const check9 = validateGradeAgainstScale(6.845, standardChileanConfig);
  assert(!check9.isValid && check9.code === "GRADE_PRECISION_EXCEEDED", "Nota con exceso de decimales (6.845) es rechazada con GRADE_PRECISION_EXCEEDED");

  // 10. Prueba del Middleware en Lote (Bulk) con Entrada Inválida
  const bulkPayloadWithViolations = {
    type: "bulk" as const,
    grades: [
      { enrollmentId: "enr-1", value: 6.5 },
      { enrollmentId: "enr-2", value: 8.2 }, // VIOLACIÓN: > 7.0
      { enrollmentId: "enr-3", value: 5.0 },
    ],
  };

  const bulkMiddlewareResult = await executeGradeScaleMiddleware({
    schoolId: "sch_sanjose_demo",
    payload: bulkPayloadWithViolations,
    userId: "test-user-id",
    pathName: "POST /api/schools/sch_sanjose_demo/grades/bulk",
  });

  assert(
    !bulkMiddlewareResult.allowed && bulkMiddlewareResult.errorResponse !== undefined,
    "Middleware en lote bloquea todo el conjunto si una nota viola la escala (8.2)",
    `Estado allowed: ${bulkMiddlewareResult.allowed}`
  );

  console.log("\n================================================================================");
  console.log(`📊 RESULTADOS: ${passedTests}/${totalTests} PRUEBAS SUPERADAS (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log("🛡️ PROTECCIÓN DE INTEGRIDAD ACADÉMICA PRE-POSTGRESQL VERIFICADA");
  console.log("================================================================================");

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runGradeScaleMiddlewareTests().catch((err) => {
  console.error("Error al ejecutar suite de pruebas:", err);
  process.exit(1);
});
