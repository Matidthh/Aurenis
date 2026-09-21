/**
 * Test Automatizado de Aceptación (DoD):
 * "Categorización de incidencias en Crítica, Alta, Media y Baja según su impacto en el sistema"
 *
 * Criterios de Aceptación evaluados:
 * 1. Criterios de severidad acordados (Política formal, 4 niveles, SLAs, matriz de impacto)
 * 2. Bugs clasificados en la bitácora (100% de bugs clasificados, justificación de impacto, distribución)
 * 3. Prioridad de resolución asignada (P0-P3 asignada a cada bug, SLA, calculador de impacto)
 */

import {
  SEVERITY_CRITERIA_POLICIES,
  INITIAL_ISSUES,
  BugSeverity,
  BugPriority,
  PRESET_TEMPLATES,
  TEAM_MEMBERS,
} from "../components/mockups/qa-issue-tracker-view";

interface AssertionResult {
  code: string;
  description: string;
  passed: boolean;
  details: string;
}

const results: AssertionResult[] = [];

function assert(code: string, description: string, condition: boolean, details: string) {
  results.push({
    code,
    description,
    passed: condition,
    details,
  });
  const symbol = condition ? "✅ [PASS]" : "❌ [FAIL]";
  console.log(`${symbol} [${code}] ${description}: ${details}`);
}

console.log("=====================================================================================");
console.log("⚖️ INICIANDO VALIDACIÓN: CATEGORIZACIÓN DE INCIDENCIAS POR SEVERIDAD E IMPACTO");
console.log("=====================================================================================\n");

// ============================================================================
// CRITERIO 1: Criterios de severidad acordados
// ============================================================================
console.log("📋 EVALUANDO CRITERIO 1: Criterios de severidad acordados...");

// 1.1 Existencia y formalización de los 4 niveles de severidad
const requiredSeverities: BugSeverity[] = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const policiesFound = requiredSeverities.every((sev) =>
  SEVERITY_CRITERIA_POLICIES.some((p) => p.severity === sev)
);
assert(
  "CRITERIOS_ACORDADOS",
  "Definición Formal de los 4 Niveles de Severidad",
  policiesFound && SEVERITY_CRITERIA_POLICIES.length === 4,
  `Se verificaron formalmente los 4 niveles: Crítica (S1), Alta (S2), Media (S3) y Baja (S4).`
);

// 1.2 SLAs de resolución definidos por severidad
const allSlasDefined = SEVERITY_CRITERIA_POLICIES.every(
  (p) => p.slaResolution && p.slaResolution.length > 5
);
const criticalSla = SEVERITY_CRITERIA_POLICIES.find((p) => p.severity === "CRITICAL")?.slaResolution;
assert(
  "CRITERIOS_ACORDADOS",
  "SLAs de Respuesta y Resolución Comprometidos",
  allSlasDefined && (criticalSla?.includes("2 Horas") ?? false),
  `Cada severidad cuenta con SLA reglamentario. Crítica: ${criticalSla}.`
);

// 1.3 Condiciones y criterios objetivos de impacto en el sistema
const allConditionsDocumented = SEVERITY_CRITERIA_POLICIES.every(
  (p) => p.criteriaConditions.length >= 3 && p.systemImpactDefinition.length > 20
);
assert(
  "CRITERIOS_ACORDADOS",
  "Matriz de Condiciones Objetivas de Activación",
  allConditionsDocumented,
  `Se verificaron al menos 3 condiciones objetivas y definición técnica por cada nivel de impacto.`
);

// ============================================================================
// CRITERIO 2: Bugs clasificados en la bitácora
// ============================================================================
console.log("\n🐞 EVALUANDO CRITERIO 2: Bugs clasificados en la bitácora...");

// 2.1 100% de bugs clasificados en escala reglamentaria
const totalBugs = INITIAL_ISSUES.length;
const validSeverities = INITIAL_ISSUES.every((iss) =>
  requiredSeverities.includes(iss.severity)
);
assert(
  "BUGS_CLASIFICADOS",
  "Clasificación Total de Incidencias en la Bitácora",
  totalBugs >= 5 && validSeverities,
  `El 100% (${totalBugs}/${totalBugs}) de las incidencias cuenta con severidad válida asignada.`
);

// 2.2 Representatividad en todos los niveles de severidad
const severityCounts: Record<BugSeverity, number> = {
  CRITICAL: 0,
  HIGH: 0,
  MEDIUM: 0,
  LOW: 0,
};
INITIAL_ISSUES.forEach((iss) => {
  severityCounts[iss.severity]++;
});
const allLevelsRepresented = requiredSeverities.every((sev) => severityCounts[sev] > 0);
assert(
  "BUGS_CLASIFICADOS",
  "Distribución Representativa por Severidad",
  allLevelsRepresented,
  `Distribución verificada: Crítica: ${severityCounts.CRITICAL}, Alta: ${severityCounts.HIGH}, Media: ${severityCounts.MEDIUM}, Baja: ${severityCounts.LOW}.`
);

// 2.3 Justificación de impacto documentada en cada bug
const allJustified = INITIAL_ISSUES.every(
  (iss) => iss.impactJustification && iss.impactJustification.length > 10
);
assert(
  "BUGS_CLASIFICADOS",
  "Justificación de Impacto Sistémico en Cada Bug",
  allJustified,
  `Todos los bugs explican la justificación técnica de por qué pertenecen a su nivel de severidad.`
);

// 2.4 Validación de presets con severidad
const presetsWithSeverity = PRESET_TEMPLATES.every((p) =>
  requiredSeverities.includes(p.severity) && p.impactJustification.length > 5
);
assert(
  "BUGS_CLASIFICADOS",
  "Plantillas Preconfiguradas con Severidad e Impacto Justificado",
  presetsWithSeverity,
  `Las ${PRESET_TEMPLATES.length} plantillas tipo (Decreto 67, RBAC, UX) incluyen severidad e impacto.`
);

// ============================================================================
// CRITERIO 3: Prioridad de resolución asignada
// ============================================================================
console.log("\n🎯 EVALUANDO CRITERIO 3: Prioridad de resolución asignada...");

// 3.1 100% de bugs tienen prioridad P0-P3 asignada
const validPriorities: BugPriority[] = ["P0_BLOCKER", "P1_HIGH", "P2_MEDIUM", "P3_LOW"];
const allPrioritiesAssigned = INITIAL_ISSUES.every((iss) =>
  validPriorities.includes(iss.priority)
);
assert(
  "PRIORIDAD_ASIGNADA",
  "Asignación Universal de Prioridad de Resolución",
  allPrioritiesAssigned,
  `El 100% (${totalBugs}/${totalBugs}) de las incidencias tiene prioridad formal P0-P3 asignada.`
);

// 3.2 Correlación lógica entre severidad y prioridad
const criticalHasP0 = INITIAL_ISSUES.filter((i) => i.severity === "CRITICAL").every(
  (i) => i.priority === "P0_BLOCKER"
);
const highHasP1 = INITIAL_ISSUES.filter((i) => i.severity === "HIGH").every(
  (i) => i.priority === "P1_HIGH"
);
const lowHasP3 = INITIAL_ISSUES.filter((i) => i.severity === "LOW").every(
  (i) => i.priority === "P3_LOW"
);
assert(
  "PRIORIDAD_ASIGNADA",
  "Correlación Coherente entre Severidad y Prioridad de Atención",
  criticalHasP0 && highHasP1 && lowHasP3,
  `Bugs Críticos asignados a P0 Blocker, Bugs Altos a P1 Alta y Bugs Bajos a P3 Baja.`
);

// 3.3 Prioridad por defecto en políticas acordadas
const policiesDefaultPriority = SEVERITY_CRITERIA_POLICIES.every((p) =>
  validPriorities.includes(p.defaultPriority)
);
assert(
  "PRIORIDAD_ASIGNADA",
  "Políticas de Triage con Prioridad por Defecto",
  policiesDefaultPriority,
  `Cada política vincula automáticamente la severidad con su prioridad recomendada.`
);

// ============================================================================
// RESUMEN Y BALANCE FINAL
// ============================================================================
console.log("\n=====================================================================================");
console.log("📊 RESUMEN DE CUMPLIMIENTO - DEFINITION OF DONE (SEVERIDAD & PRIORIDAD)");
console.log("=====================================================================================");

const passedCount = results.filter((r) => r.passed).length;
const failedCount = results.filter((r) => !r.passed).length;

console.log(`Total Aserciones: ${results.length} | Superadas: ${passedCount} | Falladas: ${failedCount}`);

if (failedCount === 0) {
  console.log("\n🎉 DEFINITION OF DONE CUMPLIDA AL 100% (3/3 CRITERIOS SATISFECHOS):");
  console.log("  - [X] Criterios de severidad acordados");
  console.log("  - [X] Bugs clasificados en la bitácora");
  console.log("  - [X] Prioridad de resolución asignada");
  process.exit(0);
} else {
  console.error(`\n❌ ERROR: ${failedCount} aserciones no se cumplieron.`);
  process.exit(1);
}
