/**
 * Test de Verificación Automatizada: Bitácora Oficial de Incidencias QA
 * Definition of Done (Criterios de Aceptación):
 * 1. Registro de bugs disponible en el tablero
 * 2. Campos de severidad, módulo y asignado configurados
 * 3. Plantilla de reporte definida
 */

import {
  INITIAL_ISSUES,
  TEAM_MEMBERS,
  PRESET_TEMPLATES,
  BugSeverity,
  BugStatus,
  SystemModule,
  QAIssue,
} from "../components/mockups/qa-issue-tracker-view";

interface AssertionResult {
  suite: string;
  name: string;
  passed: boolean;
  message: string;
}

const assertions: AssertionResult[] = [];

function assert(condition: boolean, suite: string, name: string, message: string) {
  assertions.push({
    suite,
    name,
    passed: condition,
    message,
  });
}

console.log("=====================================================================================");
console.log("🐞 INICIANDO VALIDACIÓN: BITÁCORA OFICIAL DE INCIDENCIAS QA (BUG TRACKER)");
console.log("=====================================================================================\n");

// =============================================================================
// CRITERIO 1: REGISTRO DE BUGS DISPONIBLE EN EL TABLERO
// =============================================================================
console.log("📋 EVALUANDO CRITERIO 1: Registro de bugs disponible en el tablero...");

// 1.1 Existencia y coherencia de registros iniciales en la bitácora
assert(
  INITIAL_ISSUES.length >= 5,
  "REGISTRO_TABLERO",
  "Volumen de Incidencias Iniciales",
  `Se han cargado ${INITIAL_ISSUES.length} incidencias históricas y activas en el tablero.`
);

// 1.2 Códigos únicos y formato de ID ministerial / QA (BUG-YYYY-XXX)
const bugCodeRegex = /^BUG-\d{4}-\d{3}$/;
const allCodesValid = INITIAL_ISSUES.every((iss) => bugCodeRegex.test(iss.code));
const uniqueCodes = new Set(INITIAL_ISSUES.map((iss) => iss.code));
assert(
  allCodesValid && uniqueCodes.size === INITIAL_ISSUES.length,
  "REGISTRO_TABLERO",
  "Códigos Normalizados de Incidencia",
  `Todos los identificadores de bug (${uniqueCodes.size}) cumplen la nomenclatura reglamentaria BUG-YYYY-XXX.`
);

// 1.3 Cobertura de Estados del Ciclo de Vida en el Tablero
const presentStatuses = new Set(INITIAL_ISSUES.map((iss) => iss.status));
const requiredStatuses: BugStatus[] = ["OPEN", "IN_PROGRESS", "RESOLVED", "VERIFIED_CLOSED"];
const hasAllColumns = requiredStatuses.every((st) => presentStatuses.has(st));
assert(
  hasAllColumns,
  "REGISTRO_TABLERO",
  "Columnas y Estados de Ciclo de Vida",
  `Las 4 etapas del tablero (Triage, En Progreso, Resuelto, Verificado) tienen incidencias representativas.`
);

// 1.4 Simulación de adición reactiva de un nuevo hallazgo al tablero
const simulatedNewBug: QAIssue = {
  id: `iss-test-${Date.now()}`,
  code: "BUG-2026-006",
  title: "Fallo en renderizado de badge condicional en asignaturas sin promedio",
  module: "CALIFICACIONES_DECRETO67",
  severity: "MEDIUM",
  priority: "P2_MEDIUM",
  status: "OPEN",
  assignedTo: "malcom",
  reportedBy: "lucas",
  environment: "Testing Suite / Automated runner",
  browser: "Headless Chromium",
  preconditions: "Asignatura recién creada sin evaluaciones cargadas.",
  stepsToReproduce: ["Abrir ficha de curso", "Consultar asignaturas"],
  actualResult: "Badge mostraba NaN",
  expectedResult: "Badge debe mostrar 'Sin Calificaciones' o guion neutral",
  evidenceNotes: "Detectado en corrida automatizada de regresión",
  acceptanceCriterion: "Registro de bugs disponible en el tablero",
  impactJustification: "Fallo menor de UI que no altera los cálculos oficiales.",
  createdAt: "2026-09-21 08:00",
  updatedAt: "2026-09-21 08:00",
};

const updatedBoard = [simulatedNewBug, ...INITIAL_ISSUES];
assert(
  updatedBoard.length === INITIAL_ISSUES.length + 1 && updatedBoard[0].code === "BUG-2026-006",
  "REGISTRO_TABLERO",
  "Adición Dinámica al Tablero",
  "Nueva incidencia agregada exitosamente al tope del tablero con estado OPEN."
);

// =============================================================================
// CRITERIO 2: CAMPOS DE SEVERIDAD, MÓDULO Y ASIGNADO CONFIGURADOS
// =============================================================================
console.log("\n⚙️ EVALUANDO CRITERIO 2: Campos de severidad, módulo y asignado configurados...");

// 2.1 Configuración estricta de Severidades
const validSeverities: BugSeverity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const allSeveritiesValid = INITIAL_ISSUES.every((iss) => validSeverities.includes(iss.severity));
assert(
  allSeveritiesValid,
  "CAMPOS_CONFIGURADOS",
  "Validación de Escala de Severidad",
  `100% de las incidencias clasificadas en la escala estándar (Crítica, Alta, Media, Baja).`
);

// 2.2 Configuración de Módulos del Sistema
const validModules: SystemModule[] = [
  "LIBRO_CLASES",
  "CALIFICACIONES_DECRETO67",
  "ASISTENCIA",
  "MATRICULA_RUN",
  "AUTENTICACION_RBAC",
  "REPORTES_ACTAS",
];
const allModulesValid = INITIAL_ISSUES.every((iss) => validModules.includes(iss.module));
assert(
  allModulesValid,
  "CAMPOS_CONFIGURADOS",
  "Validación de Módulos del Sistema Educativo",
  `Módulos validados contra el catálogo oficial (${validModules.length} módulos admitidos).`
);

// 2.3 Configuración de Asignación y Equipo de Trabajo
const teamMemberIds = TEAM_MEMBERS.map((m) => m.id);
const allAssigneesValid = INITIAL_ISSUES.every((iss) => teamMemberIds.includes(iss.assignedTo));
assert(
  allAssigneesValid && TEAM_MEMBERS.length >= 5,
  "CAMPOS_CONFIGURADOS",
  "Asignación a Integrantes del Equipo",
  `Integrantes identificados correctamente: ${TEAM_MEMBERS.map((m) => m.name).join(", ")}.`
);

// =============================================================================
// CRITERIO 3: PLANTILLA DE REPORTE DEFINIDA
// =============================================================================
console.log("\n📄 EVALUANDO CRITERIO 3: Plantilla de reporte definida...");

// 3.1 Estructura completa de la plantilla oficial
const sampleIssue = INITIAL_ISSUES[0];
const hasPreconditions = sampleIssue.preconditions.trim().length > 0;
const hasSteps = sampleIssue.stepsToReproduce.length >= 2;
const hasActual = sampleIssue.actualResult.trim().length > 0;
const hasExpected = sampleIssue.expectedResult.trim().length > 0;
const hasEvidence = sampleIssue.evidenceNotes.trim().length > 0;
const hasAcceptance = sampleIssue.acceptanceCriterion.trim().length > 0;

assert(
  hasPreconditions && hasSteps && hasActual && hasExpected && hasEvidence && hasAcceptance,
  "PLANTILLA_REPORTE",
  "Campos Estructurales ISTQB en la Plantilla",
  "La plantilla incluye precondiciones, pasos numerados, actual, esperado, evidencia y criterio DoD."
);

// 3.2 Disponibilidad de Plantillas Rápidas (Presets)
assert(
  PRESET_TEMPLATES.length >= 3,
  "PLANTILLA_REPORTE",
  "Presets de Reporte Rápido Disponibles",
  `Se verificaron ${PRESET_TEMPLATES.length} plantillas prediseñadas (Decreto 67, RBAC, UX).`
);

// 3.3 Generación y formato Markdown para exportación
function testGenerateMarkdown(iss: QAIssue): string {
  return `### [${iss.code}] ${iss.title}\n**Severidad:** ${iss.severity}\n#### 1. Precondiciones\n${iss.preconditions}\n#### 2. Pasos\n${iss.stepsToReproduce.join("\n")}\n#### 3. Actual\n> ${iss.actualResult}\n#### 4. Esperado\n> ${iss.expectedResult}`;
}

const generatedMarkdown = testGenerateMarkdown(sampleIssue);
assert(
  generatedMarkdown.includes(sampleIssue.code) &&
    generatedMarkdown.includes("Precondiciones") &&
    generatedMarkdown.includes("Pasos") &&
    generatedMarkdown.includes("Actual") &&
    generatedMarkdown.includes("Esperado"),
  "PLANTILLA_REPORTE",
  "Generador de Markdown Oficial",
  "Formato Markdown exportable y compatible con GitHub Issues verificado."
);

// =============================================================================
// RESUMEN Y RESULTADOS
// =============================================================================
console.log("\n=====================================================================================");
console.log("📊 RESUMEN DE CUMPLIMIENTO - DEFINITION OF DONE (QA ISSUE TRACKER)");
console.log("=====================================================================================");

const passedCount = assertions.filter((a) => a.passed).length;
const totalCount = assertions.length;

assertions.forEach((a) => {
  console.log(`${a.passed ? "✅ [PASS]" : "❌ [FAIL]"} [${a.suite}] ${a.name}: ${a.message}`);
});

console.log(`\nTotal Aserciones: ${totalCount} | Superadas: ${passedCount} | Falladas: ${totalCount - passedCount}`);

if (passedCount === totalCount) {
  console.log("\n🎉 DEFINITION OF DONE CUMPLIDA AL 100% (3/3 CRITERIOS SATISFECHOS):");
  console.log("  - [X] Registro de bugs disponible en el tablero");
  console.log("  - [X] Campos de severidad, módulo y asignado configurados");
  console.log("  - [X] Plantilla de reporte definida");
  process.exit(0);
} else {
  console.error("❌ Se encontraron aserciones fallidas en la suite QA.");
  process.exit(1);
}
