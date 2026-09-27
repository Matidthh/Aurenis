# HISTORIAL DE PARCHES Y TRAZABILIDAD DE CORRECCIONES
**Plataforma Institucional Aurenis SaaS**  
**Versión de Release:** `v2.4.0-stable`  
**Fecha de Registro:** 2026-09-25  
**Auditor:** **Frank M.** (*Lead QA*) con **Carlos M.** (*Release Manager*)

---

## 📋 Resumen de Parches Aplicados por Autor / Módulo Técnico

| ID de Parche | Commit | Incidencia | Módulo | Autor Principal | Archivos Modificados | Estado |
| :--- | :---: | :---: | :--- | :--- | :--- | :---: |
| `PATCH-DEC67-TRUNC-v1.4` | `a8f921e` | BUG-2026-001 | Calificaciones | **Malcom S. (Frontend)** | `grade.service.ts`, `grade-matrix.tsx` | 🟢 VERIFIED |
| `PATCH-FOCUS-RAF-v2.0` | `b4c109d` | BUG-2026-002 | Libro Digital | **Lucas P. (UI/UX)** | `grade-matrix.tsx` | 🟢 VERIFIED |
| `PATCH-RUN-MOD11-K-v2.1` | `c7e301a` | BUG-2026-003 | Matrícula RUN | **Maicol R. (Backend)** | `rut-validator.ts`, `student-modal.tsx` | 🟢 VERIFIED |
| `PATCH-ATTENDANCE-BATCH-v1.8` | `d9f482b` | BUG-2026-004 | Asistencia | **Maicol R. / Malcom S.** | `attendance.service.ts`, `teachers.tsx` | 🟢 VERIFIED |
| `PATCH-TOOLTIP-ART10-v1.1` | `e1a783c` | BUG-2026-005 | Actas | **Lucas P. (UI/UX)** | `grade-matrix.tsx`, `tooltip.tsx` | 🟢 VERIFIED |
| `PATCH-RBAC-ISCLOSED-GUARD-v3.0` | `f6b219e` | BUG-2026-006 | Autenticación | **Maicol R. / Carlos M.** | `middleware.ts`, `rbac-guard.ts` | 🟢 VERIFIED |
| `PATCH-IOS-SAFARI-PADDING-v1.2` | `19c847d` | BUG-2026-007 | UI Tokens | **Lucas P. (UI/UX)** | `hero.tsx`, `device-matrix.tsx` | 🟢 VERIFIED |
| `PATCH-MEMO-WEIGHTED-RENDER-v2.4` | `28d750e` | BUG-2026-008 | Calificaciones | **Malcom S. (Frontend)** | `grade-matrix.tsx`, `grade.service.ts` | 🟢 VERIFIED |
| `PATCH-WCAG-BADGE-CONTRAST-v1.5` | `37e961f` | BUG-2026-009 | Libro Digital | **Lucas P. (UI/UX)** | `badge.tsx`, `hero.tsx` | 🟢 VERIFIED |
| `PATCH-RATELIMIT-SIGE-RESILIENCE-v2.0` | `46f082a` | BUG-2026-010 | Reportes SIGE | **Maicol R. / Frank M.** | `certificate/route.ts`, `rate-limiter.ts` | 🟢 VERIFIED |

---

## 🔍 Detalle Técnico y Diffs de Parches

### 1. Parche `PATCH-DEC67-TRUNC-v1.4` (Commit `a8f921e`)
- **Autor:** **Malcom S. (Frontend)** con **Carlos M. (Auditor Decreto 67)**
- **Incidencia:** `BUG-2026-001` (Inconsistencia en redondeo Decreto 67)
- **Problema:** El cálculo de notas con decimales periódicos generaba 2 decimales sin el truncamiento oficial a 1 decimal ordenado por el Art. 9 del Decreto 67.
- **Solución Técnica:**
```typescript
// Antes:
const average = rawSum / count; // ej: 5.833333333

// Después (Parche v1.4):
const average = Math.floor((rawSum / count) * 10 + 0.0001) / 10; // ej: 5.8 reglamentario
```
- **Prueba:** `test/decreto67-rounding.spec.ts` ➔ **100% PASSED** (38 casos de prueba).

---

### 2. Parche `PATCH-RUN-MOD11-K-v2.1` (Commit `c7e301a`)
- **Autor:** **Maicol R. (Backend)**
- **Incidencia:** `BUG-2026-003` (Rechazo de RUN con 'K' en matrícula)
- **Problema:** Validador comparaba en minúscula estricta sin normalizar entrada de usuario.
- **Solución Técnica:**
```typescript
// Antes:
return expectedDv === dv;

// Después (Parche v2.1):
const cleanDv = dv.trim().toUpperCase();
const calculatedDv = calculated === 10 ? 'K' : calculated === 11 ? '0' : String(calculated);
return cleanDv === calculatedDv;
```
- **Prueba:** `scripts/non-regression-stability-test.ts` (REG-MAT-001) ➔ **100% PASSED**.

---

### 3. Parche `PATCH-RBAC-ISCLOSED-GUARD-v3.0` (Commit `f6b219e`)
- **Autor:** **Maicol R. (Backend)** & **Carlos M. (Fullstack)**
- **Incidencia:** `BUG-2026-006` (Bypass de actas cerradas)
- **Problema:** Middleware no comprobaba el flag inmutable `isClosed` de las actas ministeriales.
- **Solución Técnica:**
```typescript
// Parche v3.0:
if (acta.isClosed && !user.isSystemAdmin) {
  await logSecurityAudit({ event: 'MUTATION_BLOCKED_CLOSED_ACTA', userId: user.id });
  return NextResponse.json({ error: 'Acta cerrada. Modificación prohibida.' }, { status: 403 });
}
```
- **Prueba:** `scripts/non-regression-stability-test.ts` (REG-AUTH-002) ➔ **100% PASSED**.

---

### 4. Parche `PATCH-MEMO-WEIGHTED-RENDER-v2.4` (Commit `28d750e`)
- **Autor:** **Malcom S. (Frontend)**
- **Incidencia:** `BUG-2026-008` (Lag en recálculo con 45 alumnos)
- **Problema:** Cada cambio de nota re-renderizaba 45 filas x 10 columnas en O(N*M).
- **Solución Técnica:**
```typescript
// Parche v2.4: Memoización por celda y estado desacoplado
const memoizedStudentAverage = useMemo(() => {
  return calculateWeightedAverage(studentGrades, subjectWeights);
}, [studentGrades, subjectWeights]);
```
- **Prueba:** `test/matrix-performance-45students.spec.ts` ➔ **PASSED** (< 1.2ms por pulsación).

---

### 5. Parche `PATCH-RATELIMIT-SIGE-RESILIENCE-v2.0` (Commit `46f082a`)
- **Autor:** **Maicol R. (Backend)** & **Frank M. (QA Lead)**
- **Incidencia:** `BUG-2026-010` (Error 429 no controlado en reportes SIGE)
- **Problema:** API arrojaba 500 al recibir HTTP 429 por saturación de firmas.
- **Solución Técnica:**
```typescript
// Parche v2.0: Captura de 429 y cabecera Retry-After
if (response.status === 429) {
  const retryAfter = response.headers.get('Retry-After') || '5';
  return NextResponse.json(
    { message: 'Límite de solicitudes alcanzado. Reintentando...', retryAfterSeconds: Number(retryAfter) },
    { status: 429, headers: { 'Retry-After': retryAfter } }
  );
}
```
- **Prueba:** `test/sige-exponential-backoff.spec.ts` ➔ **100% PASSED**.

---

## 🟢 Certificación de Conformidad
- **Tasa de Cierre:** **100.0%** (> 95% requisito completado)
- **Bugs Resueltos:** **10 de 10**
- **Bloqueadores P0/P1:** **0**
- **Firma QA Lead:** `Frank M.`
