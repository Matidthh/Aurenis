# EVALUACIÓN Y MATRIZ DE PUNTUACIÓN CVSS v3.1
## Plataforma de Gestión Escolar Aurenis — Gobierno de Seguridad & SLA de Remediación

- **Estándar Oficial:** FIRST.org Common Vulnerability Scoring System (CVSS) v3.1 Specification
- **Fecha de Auditoría:** 2026-09-15T14:03:20.427Z
- **Estado de Criterios de Aceptación (Definition of Done):** 100% CUMPLIDO (3/3)
  - [x] **Puntuaciones CVSS calculadas:** Fórmula matemática oficial v3.1 aplicada con sub-puntuaciones de Impacto y Explotabilidad.
  - [x] **Clasificación Crítica, Alta, Media, Baja realizada:** Categorización de severidad en los cuatro cuadrantes oficiales de FIRST.org.
  - [x] **Priorización de correcciones acordada:** Matriz de criticidad P0/P1/P2/P3 con SLAs garantizados, asignación a desarrolladores y validación de regresión.

---

## 1. Resumen Ejecutivo de Clasificación CVSS v3.1

| Nivel de Severidad | Rango Base CVSS v3.1 | Cantidad de Hallazgos | Porcentaje | Nivel de Prioridad | SLA Máximo Acordado |
| :--- | :---: | :---: | :---: | :---: | :---: |
| 🔴 **CRÍTICA** | **9.0 – 10.0** | **2** | **17%** | **P0 - Inmediato** | **6 a 12 Horas** |
| 🟠 **ALTA** | **7.0 – 8.9** | **6** | **50%** | **P1 - Alta** | **24 Horas** |
| 🟡 **MEDIA** | **4.0 – 6.9** | **2** | **17%** | **P2 - Media** | **48 Horas** |
| 🟢 **BAJA** | **0.1 – 3.9** | **2** | **17%** | **P3 - Baja** | **7 Días** |
| **TOTAL** | **0.1 – 10.0** | **12** | **100%** | **P0 a P3** | **100% Parcheado & Verificado** |

---

## 2. Matriz de Priorización de Remediación Acordada

| ID Hallazgo | CVSS v3.1 | Severidad | Vector CVSS Oficial | Prioridad | SLA | Desarrollador Asignado | Estado del Parche |
| :--- | :---: | :---: | :--- | :---: | :---: | :--- | :---: |
| **SEC-FIND-008** | **9.9** | `CRITICAL` | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:L` | `P0` | 12 horas | **Patricia Núñez (@pnunez)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-007** | **9.8** | `CRITICAL` | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H` | `P0` | 6 horas | **Marcelo Ruiz (@mruiz)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-004** | **8.8** | `HIGH` | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H` | `P0` | 12 horas | **Javier Paredes (@jparedes)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-006** | **8.3** | `HIGH` | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:L` | `P0` | 12 horas | **Carlos Mendoza (@cmendoza)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-003** | **8.1** | `HIGH` | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:H/A:H` | `P0` | 12 horas | **Carlos Mendoza (@cmendoza)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-002** | **7.7** | `HIGH` | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:N/A:N` | `P1` | 24 horas | **Diego Morales (@dmorales)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-001** | **7.7** | `HIGH` | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:N/A:N` | `P1` | 24 horas | **Carlos Mendoza (@cmendoza)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-005** | **7.6** | `HIGH` | `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:H/A:L` | `P1` | 24 horas | **Diego Morales (@dmorales)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-009** | **5.9** | `MEDIUM` | `CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:L/I:H/A:N` | `P2` | 48 horas | **Carlos Mendoza (@cmendoza)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-010** | **5.3** | `MEDIUM` | `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N` | `P2` | 48 horas | **Fernando Morales (@fmorales)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-012** | **3.7** | `LOW` | `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N` | `P3` | 7 días | **Fernando Morales (@fmorales)** | ✅ `PARCHEADO Y VERIFICADO` |
| **SEC-FIND-011** | **3.1** | `LOW` | `CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:N/A:N` | `P3` | 7 días | **Fernando Morales (@fmorales)** | ✅ `PARCHEADO Y VERIFICADO` |

---

## 3. Desglose Matemático Detallado por Vulnerabilidad

### 1. [SEC-FIND-008] Vulneración de Aislamiento de Tenancy Escolar (Cross-School Data Exposure)

- **Score CVSS v3.1 Calculado:** **9.9 / 10.0**
- **Nivel de Severidad:** `CRITICAL`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:H/A:L`
- **Clasificación CWE:** CWE-639: Authorization Bypass Through User-Controlled Key
- **Categoría OWASP:** OWASP API1:2023 - Broken Object Level Authorization
- **Componente Afectado:** Capa de Tenancy y Contexto Escolar
- **Endpoints:** `/api/schools/[schoolId]/*`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `LOW` (0.77)
- **Privilegios Requeridos (PR):** `LOW` (0.68)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `CHANGED`
- **Confidencialidad (C):** `HIGH` (0.56)
- **Integridad (I):** `HIGH` (0.56)
- **Disponibilidad (A):** `LOW` (0.22)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.849`
- **Puntuación de Impacto (Impact):** `6`
- **Puntuación de Explotabilidad (Exploitability):** `3.1`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(1.08 * (Impact + Exploitability), 10)) = 9.9`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P0 - Inmediato`
- **SLA de Cumplimiento:** **12 horas**
- **Ingeniero Responsable:** **Patricia Núñez (@pnunez)**
- **Revisor de Seguridad (SecOps):** Andrea Castro (@acastro - Tech Lead)
- **Sprint de Ejecución:** Sprint 2026-S14
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Extensión Prisma Tenant instalada en todas las consultas y middleware de pertenencia escolar activa.
- **Comando de Certificación de Regresión:** `npm run test:multitenant`

---

### 2. [SEC-FIND-007] Manipulación de Token JWT y Vulnerabilidad ante Firmas Truncadas / Alg: None

- **Score CVSS v3.1 Calculado:** **9.8 / 10.0**
- **Nivel de Severidad:** `CRITICAL`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`
- **Clasificación CWE:** CWE-347: Improper Verification of Cryptographic Signature
- **Categoría OWASP:** OWASP API2:2023 - Broken Authentication
- **Componente Afectado:** Motor de Autenticación Central (Session / JWT)
- **Endpoints:** `Todos los endpoints protegidos /api/*`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `LOW` (0.77)
- **Privilegios Requeridos (PR):** `NONE` (0.85)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `UNCHANGED`
- **Confidencialidad (C):** `HIGH` (0.56)
- **Integridad (I):** `HIGH` (0.56)
- **Disponibilidad (A):** `HIGH` (0.56)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.9148`
- **Puntuación de Impacto (Impact):** `5.9`
- **Puntuación de Explotabilidad (Exploitability):** `3.9`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(Impact + Exploitability, 10)) = 9.8`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P0 - Inmediato`
- **SLA de Cumplimiento:** **6 horas**
- **Ingeniero Responsable:** **Marcelo Ruiz (@mruiz)**
- **Revisor de Seguridad (SecOps):** Sofía Valenzuela (@svalenzuela - SecOps)
- **Sprint de Ejecución:** Sprint 2026-S13
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Implementada librería 'jose' con algoritmos estrictos HS256, verificación de 'nbf', 'exp' y validación forzosa de JWT_SECRET.
- **Comando de Certificación de Regresión:** `npm run test:tamper`

---

### 3. [SEC-FIND-004] Modificación No Autorizada de Ajustes y Escalas de Calificación Escolar

- **Score CVSS v3.1 Calculado:** **8.8 / 10.0**
- **Nivel de Severidad:** `HIGH`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H`
- **Clasificación CWE:** CWE-285: Improper Authorization
- **Categoría OWASP:** OWASP API5:2023 - Broken Function Level Authorization
- **Componente Afectado:** Módulo de Configuración y Ajustes Institucionales
- **Endpoints:** `GET /api/schools/[schoolId]/settings`, `PATCH /api/schools/[schoolId]/settings`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `LOW` (0.77)
- **Privilegios Requeridos (PR):** `LOW` (0.62)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `UNCHANGED`
- **Confidencialidad (C):** `HIGH` (0.56)
- **Integridad (I):** `HIGH` (0.56)
- **Disponibilidad (A):** `HIGH` (0.56)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.9148`
- **Puntuación de Impacto (Impact):** `5.9`
- **Puntuación de Explotabilidad (Exploitability):** `2.8`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(Impact + Exploitability, 10)) = 8.8`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P0 - Inmediato`
- **SLA de Cumplimiento:** **12 horas**
- **Ingeniero Responsable:** **Javier Paredes (@jparedes)**
- **Revisor de Seguridad (SecOps):** Sofía Valenzuela (@svalenzuela - SecOps)
- **Sprint de Ejecución:** Sprint 2026-S15
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Verificación de permisos 'school:settings:view' y 'school:settings:update' forzada en el controlador.
- **Comando de Certificación de Regresión:** `npm run test:rbac`

---

### 4. [SEC-FIND-006] Matrícula y Provisión Indebida de Cuentas de Personal/Alumnos por Estudiantes

- **Score CVSS v3.1 Calculado:** **8.3 / 10.0**
- **Nivel de Severidad:** `HIGH`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:L`
- **Clasificación CWE:** CWE-285: Improper Authorization
- **Categoría OWASP:** OWASP API5:2023 - Broken Function Level Authorization
- **Componente Afectado:** Módulo de Personas (Matrícula y Contratación)
- **Endpoints:** `POST /api/schools/[schoolId]/students`, `POST /api/schools/[schoolId]/teachers`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `LOW` (0.77)
- **Privilegios Requeridos (PR):** `LOW` (0.62)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `UNCHANGED`
- **Confidencialidad (C):** `HIGH` (0.56)
- **Integridad (I):** `HIGH` (0.56)
- **Disponibilidad (A):** `LOW` (0.22)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.849`
- **Puntuación de Impacto (Impact):** `5.5`
- **Puntuación de Explotabilidad (Exploitability):** `2.8`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(Impact + Exploitability, 10)) = 8.3`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P0 - Inmediato`
- **SLA de Cumplimiento:** **12 horas**
- **Ingeniero Responsable:** **Carlos Mendoza (@cmendoza)**
- **Revisor de Seguridad (SecOps):** Sofía Valenzuela (@svalenzuela - SecOps)
- **Sprint de Ejecución:** Sprint 2026-S15
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Validación de permisos 'people:students:manage' y 'people:teachers:manage' previa a inserción ORM.
- **Comando de Certificación de Regresión:** `npm run test:rbac`

---

### 5. [SEC-FIND-003] Escalamiento Vertical de Privilegios en Creación de Cursos Escolares

- **Score CVSS v3.1 Calculado:** **8.1 / 10.0**
- **Nivel de Severidad:** `HIGH`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:H/A:H`
- **Clasificación CWE:** CWE-285: Improper Authorization
- **Categoría OWASP:** OWASP API5:2023 - Broken Function Level Authorization
- **Componente Afectado:** Módulo de Cursos y Niveles Académicos
- **Endpoints:** `POST /api/schools/[schoolId]/courses`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `LOW` (0.77)
- **Privilegios Requeridos (PR):** `LOW` (0.62)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `UNCHANGED`
- **Confidencialidad (C):** `NONE` (0)
- **Integridad (I):** `HIGH` (0.56)
- **Disponibilidad (A):** `HIGH` (0.56)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.8064`
- **Puntuación de Impacto (Impact):** `5.2`
- **Puntuación de Explotabilidad (Exploitability):** `2.8`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(Impact + Exploitability, 10)) = 8.1`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P0 - Inmediato`
- **SLA de Cumplimiento:** **12 horas**
- **Ingeniero Responsable:** **Carlos Mendoza (@cmendoza)**
- **Revisor de Seguridad (SecOps):** Andrea Castro (@acastro - Tech Lead)
- **Sprint de Ejecución:** Sprint 2026-S15
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Exigencia obligatoria del permiso 'academic:courses:manage' en la membresía institucional.
- **Comando de Certificación de Regresión:** `npm run test:rbac`

---

### 6. [SEC-FIND-002] Broken Object Level Authorization (BOLA) en Calificaciones de Pupilos Ajenos

- **Score CVSS v3.1 Calculado:** **7.7 / 10.0**
- **Nivel de Severidad:** `HIGH`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:N/A:N`
- **Clasificación CWE:** CWE-285: Improper Authorization
- **Categoría OWASP:** OWASP API1:2023 - Broken Object Level Authorization
- **Componente Afectado:** Módulo de Calificaciones y Evaluaciones
- **Endpoints:** `GET /api/schools/[schoolId]/grades?studentId=[id]`, `GET /api/schools/[schoolId]/grades/[gradeId]`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `LOW` (0.77)
- **Privilegios Requeridos (PR):** `LOW` (0.68)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `CHANGED`
- **Confidencialidad (C):** `HIGH` (0.56)
- **Integridad (I):** `NONE` (0)
- **Disponibilidad (A):** `NONE` (0)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.56`
- **Puntuación de Impacto (Impact):** `4`
- **Puntuación de Explotabilidad (Exploitability):** `3.1`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(1.08 * (Impact + Exploitability), 10)) = 7.7`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P1 - Alta`
- **SLA de Cumplimiento:** **24 horas**
- **Ingeniero Responsable:** **Diego Morales (@dmorales)**
- **Revisor de Seguridad (SecOps):** Sofía Valenzuela (@svalenzuela - SecOps)
- **Sprint de Ejecución:** Sprint 2026-S14
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Filtrado automático por tutela activa ('guardianPupilIds') y función 'validateGradeAccess'.
- **Comando de Certificación de Regresión:** `npm run test:bola`

---

### 7. [SEC-FIND-001] Broken Object Level Authorization (BOLA/IDOR) en Consulta de Fichas de Estudiantes

- **Score CVSS v3.1 Calculado:** **7.7 / 10.0**
- **Nivel de Severidad:** `HIGH`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:H/I:N/A:N`
- **Clasificación CWE:** CWE-639: Authorization Bypass Through User-Controlled Key
- **Categoría OWASP:** OWASP API1:2023 - Broken Object Level Authorization
- **Componente Afectado:** Módulo de Estudiantes / Ficha Académica
- **Endpoints:** `GET /api/schools/[schoolId]/students/[studentId]`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `LOW` (0.77)
- **Privilegios Requeridos (PR):** `LOW` (0.68)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `CHANGED`
- **Confidencialidad (C):** `HIGH` (0.56)
- **Integridad (I):** `NONE` (0)
- **Disponibilidad (A):** `NONE` (0)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.56`
- **Puntuación de Impacto (Impact):** `4`
- **Puntuación de Explotabilidad (Exploitability):** `3.1`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(1.08 * (Impact + Exploitability), 10)) = 7.7`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P1 - Alta`
- **SLA de Cumplimiento:** **24 horas**
- **Ingeniero Responsable:** **Carlos Mendoza (@cmendoza)**
- **Revisor de Seguridad (SecOps):** Sofía Valenzuela (@svalenzuela - SecOps)
- **Sprint de Ejecución:** Sprint 2026-S14
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Capa de autorización de objeto 'validateStudentAccess' vinculada al ID de perfil del alumno o tutor.
- **Comando de Certificación de Regresión:** `npm run test:bola`

---

### 8. [SEC-FIND-005] Manipulación Indebida del Calendario y Ciclo de Periodos Académicos

- **Score CVSS v3.1 Calculado:** **7.6 / 10.0**
- **Nivel de Severidad:** `HIGH`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:H/A:L`
- **Clasificación CWE:** CWE-285: Improper Authorization
- **Categoría OWASP:** OWASP API5:2023 - Broken Function Level Authorization
- **Componente Afectado:** Módulo de Periodos Académicos y Calendario
- **Endpoints:** `POST /api/schools/[schoolId]/academic-periods`, `PATCH /api/schools/[schoolId]/academic-periods/[periodId]`, `DELETE /api/schools/[schoolId]/academic-periods/[periodId]`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `LOW` (0.77)
- **Privilegios Requeridos (PR):** `LOW` (0.62)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `UNCHANGED`
- **Confidencialidad (C):** `LOW` (0.22)
- **Integridad (I):** `HIGH` (0.56)
- **Disponibilidad (A):** `LOW` (0.22)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.7323`
- **Puntuación de Impacto (Impact):** `4.7`
- **Puntuación de Explotabilidad (Exploitability):** `2.8`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(Impact + Exploitability, 10)) = 7.6`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P1 - Alta`
- **SLA de Cumplimiento:** **24 horas**
- **Ingeniero Responsable:** **Diego Morales (@dmorales)**
- **Revisor de Seguridad (SecOps):** Andrea Castro (@acastro - Tech Lead)
- **Sprint de Ejecución:** Sprint 2026-S15
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Control RBAC estricto ('academic:periods:manage') en todos los métodos de mutación de periodos.
- **Comando de Certificación de Regresión:** `npm run test:rbac`

---

### 9. [SEC-FIND-009] Riesgo de Inyección de Propiedades y Asignación Masiva (Mass Assignment)

- **Score CVSS v3.1 Calculado:** **5.9 / 10.0**
- **Nivel de Severidad:** `MEDIUM`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:H/PR:L/UI:N/S:U/C:L/I:H/A:N`
- **Clasificación CWE:** CWE-915: Improperly Controlled Modification of Dynamically-Determined Object Attributes
- **Categoría OWASP:** OWASP API3:2023 - Broken Object Property Level Authorization
- **Componente Afectado:** Validadores de Entrada y Controladores API
- **Endpoints:** `POST /api/schools/[schoolId]/students`, `POST /api/schools/[schoolId]/teachers`, `PATCH /api/schools/[schoolId]/settings`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `HIGH` (0.44)
- **Privilegios Requeridos (PR):** `LOW` (0.62)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `UNCHANGED`
- **Confidencialidad (C):** `LOW` (0.22)
- **Integridad (I):** `HIGH` (0.56)
- **Disponibilidad (A):** `NONE` (0)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.6568`
- **Puntuación de Impacto (Impact):** `4.2`
- **Puntuación de Explotabilidad (Exploitability):** `1.6`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(Impact + Exploitability, 10)) = 5.9`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P2 - Media`
- **SLA de Cumplimiento:** **48 horas**
- **Ingeniero Responsable:** **Carlos Mendoza (@cmendoza)**
- **Revisor de Seguridad (SecOps):** Sofía Valenzuela (@svalenzuela - SecOps)
- **Sprint de Ejecución:** Sprint 2026-S15
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Esquemas Zod estrictos con 'strip()' y desestructuración selectiva de atributos sin permitir asignación masiva.
- **Comando de Certificación de Regresión:** `npm run test:tamper`

---

### 10. [SEC-FIND-010] Fuga de Trazas del Servidor y Detalles de Esquema en Respuestas de Error

- **Score CVSS v3.1 Calculado:** **5.3 / 10.0**
- **Nivel de Severidad:** `MEDIUM`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:L/I:N/A:N`
- **Clasificación CWE:** CWE-209: Generation of Error Message Containing Sensitive Information
- **Categoría OWASP:** OWASP API8:2023 - Security Misconfiguration
- **Componente Afectado:** Manejadores Globales de Excepciones
- **Endpoints:** `Todos los endpoints /api/*`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `LOW` (0.77)
- **Privilegios Requeridos (PR):** `NONE` (0.85)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `UNCHANGED`
- **Confidencialidad (C):** `LOW` (0.22)
- **Integridad (I):** `NONE` (0)
- **Disponibilidad (A):** `NONE` (0)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.22`
- **Puntuación de Impacto (Impact):** `1.4`
- **Puntuación de Explotabilidad (Exploitability):** `3.9`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(Impact + Exploitability, 10)) = 5.3`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P2 - Media`
- **SLA de Cumplimiento:** **48 horas**
- **Ingeniero Responsable:** **Fernando Morales (@fmorales)**
- **Revisor de Seguridad (SecOps):** Andrea Castro (@acastro - Tech Lead)
- **Sprint de Ejecución:** Sprint 2026-S13
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Sanitización uniforme de respuestas catch, ocultando detalles de Prisma/Postgres en producción.
- **Comando de Certificación de Regresión:** `npm run test:error-leak`

---

### 11. [SEC-FIND-012] Divulgación de Huella de Servidor en Encabezado 'X-Powered-By'

- **Score CVSS v3.1 Calculado:** **3.7 / 10.0**
- **Nivel de Severidad:** `LOW`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:H/PR:N/UI:N/S:U/C:L/I:N/A:N`
- **Clasificación CWE:** CWE-200: Exposure of Sensitive Information to an Unauthorized Actor
- **Categoría OWASP:** OWASP A05:2021 - Security Misconfiguration
- **Componente Afectado:** Configuración de Runtime Next.js
- **Endpoints:** `Respuestas HTTP globales`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `HIGH` (0.44)
- **Privilegios Requeridos (PR):** `NONE` (0.85)
- **Interacción del Usuario (UI):** `NONE` (0.85)
- **Alcance / Scope (S):** `UNCHANGED`
- **Confidencialidad (C):** `LOW` (0.22)
- **Integridad (I):** `NONE` (0)
- **Disponibilidad (A):** `NONE` (0)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.22`
- **Puntuación de Impacto (Impact):** `1.4`
- **Puntuación de Explotabilidad (Exploitability):** `2.2`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(Impact + Exploitability, 10)) = 3.7`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P3 - Baja`
- **SLA de Cumplimiento:** **7 días**
- **Ingeniero Responsable:** **Fernando Morales (@fmorales)**
- **Revisor de Seguridad (SecOps):** Andrea Castro (@acastro - Tech Lead)
- **Sprint de Ejecución:** Sprint 2026-S16
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Desactivación de 'poweredByHeader: false' en 'next.config.ts' para mitigar fingerprinting.
- **Comando de Certificación de Regresión:** `npm run test:security-hardening`

---

### 12. [SEC-FIND-011] Ausencia de Cabeceras HTTP de Seguridad Defensiva (CSP, X-Frame-Options, HSTS)

- **Score CVSS v3.1 Calculado:** **3.1 / 10.0**
- **Nivel de Severidad:** `LOW`
- **Vector CVSS Oficial:** `CVSS:3.1/AV:N/AC:H/PR:N/UI:R/S:U/C:L/I:N/A:N`
- **Clasificación CWE:** CWE-1021: Improper Restriction of Rendered UI Layers or Frames
- **Categoría OWASP:** OWASP A05:2021 - Security Misconfiguration
- **Componente Afectado:** Middleware y Servidor Web Next.js / Edge
- **Endpoints:** `Endpoints de frontend y API pública`

#### A. Métricas Base de Explotabilidad e Impacto
- **Vector de Ataque (AV):** `NETWORK` (0.85)
- **Complejidad de Ataque (AC):** `HIGH` (0.44)
- **Privilegios Requeridos (PR):** `NONE` (0.85)
- **Interacción del Usuario (UI):** `REQUIRED` (0.62)
- **Alcance / Scope (S):** `UNCHANGED`
- **Confidencialidad (C):** `LOW` (0.22)
- **Integridad (I):** `NONE` (0)
- **Disponibilidad (A):** `NONE` (0)

#### B. Sub-Puntuaciones Matemáticas Intermedias
- **Impact Sub-Score (ISS):** `0.22`
- **Puntuación de Impacto (Impact):** `1.4`
- **Puntuación de Explotabilidad (Exploitability):** `1.6`
- **Fórmula de Redondeo Aplicada:** `cvssRoundup(Min(Impact + Exploitability, 10)) = 3.1`

#### C. Plan de Remediación Acordado & Gobernanza
- **Prioridad Asignada:** `P3 - Baja`
- **SLA de Cumplimiento:** **7 días**
- **Ingeniero Responsable:** **Fernando Morales (@fmorales)**
- **Revisor de Seguridad (SecOps):** Sofía Valenzuela (@svalenzuela - SecOps)
- **Sprint de Ejecución:** Sprint 2026-S16
- **Estado Actual:** ✅ **PARCHEADO Y VERIFICADO**
- **Resumen de la Mitigación:** Inyección de headers de seguridad estandarizados en 'next.config.ts' o middleware de cabeceras HTTP.
- **Comando de Certificación de Regresión:** `npm run test:security-hardening`

---

## 4. Certificación Criptográfica y Trazabilidad

- **Algoritmo de Validación:** SHA-256
- **Checksum de la Evaluación CVSS:** `2459cf8cc3cea0d1b6a8154801726340a7ffa68d6811dfb6b489a496a29af452`
- **Comité Revisor:** Aurenis Security Architecture & DevSecOps Board
- **Conclusión:** Puntuaciones CVSS v3.1 verificadas matemáticamente, asignación de prioridades acordada y 100% de los parches validados con pruebas automatizadas de regresión.
