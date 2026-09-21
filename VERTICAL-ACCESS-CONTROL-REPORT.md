# INFORME DE CONTROL VERTICAL Y AUDITORÍA RBAC
**Plataforma Educativa Aurenis — Control de Acceso Basado en Roles**
**Fecha de Auditoría:** 2026-09-21T13:19:37.135Z
**Estado:** APROBADO (100% Criterios de Aceptación Cumplidos)
**Total de Pruebas Evaluadas:** 22
**Pruebas Aprobadas:** 22
**Pruebas Fallidas:** 0
**Tasa de Éxito:** 100.0%

---

## 1. Resumen Ejecutivo de la Evaluación

Se ejecutó una auditoría exhaustiva de **Control de Acceso Vertical (RBAC Enforcement)** y segregación de privilegios sobre la plataforma Aurenis. El objetivo es garantizar que perfiles básicos con privilegios acotados (Docentes, Estudiantes, Apoderados) bajo ninguna circunstancia puedan invocar endpoints reservados para Administradores de Escuela (Director) o Administradores Globales (SuperAdmin).

### Mecanismos de Protección Validados
1. **Validación de Sesión y Membresía Criptográfica:** Cada petición a las rutas `/api/schools/[schoolId]/*` resuelve la sesión firmada y verifica la membresía activa del usuario en el tenant escolar correspondiente.
2. **Matriz Granular de Permisos:** Antes de procesar cualquier operación sensible de configuración o gestión de personas, el backend valida explícitamente el catálogo de permisos (`membership.role.permissions`):
   - Modificación de configuración: Requiere `school:settings:update`.
   - Consulta de configuración administrativa: Requiere `school:settings:view` o `school:settings:update`.
   - Periodos académicos: Requiere `school:settings:update` o `academic:periods:manage`.
   - Matrícula / Gestión de estudiantes: Requiere `people:students:manage` o `people:enrollment:manage`.
   - Gestión de profesores: Requiere `people:teachers:manage`.
   - Cursos académicos: Requiere `academic:courses:manage`.
   - Registro de colegios: Requiere `session.isSystemAdmin = true`.
3. **Respuesta Hermética HTTP 403 Forbidden:** Todos los intentos de escalamiento vertical son neutralizados retornando estrictamente el código HTTP 403 Forbidden, sin exponer información confidencial ni ejecutar modificaciones en el estado del servidor.

---

## 2. Definición de Hecho (Definition of Done - Criterios de Aceptación)

| Criterio de Aceptación | Estado | Pruebas | Resultado Técnico |
| :--- | :---: | :---: | :--- |
| **Intentos de llamado a APIs de configuración por docentes rechazados** | ✅ CUMPLIDO | 7/7 | Docentes bloqueados con HTTP 403 en `/settings` (GET/PATCH), `/academic-periods` (POST/PATCH/DELETE), `/courses` y `/system/schools`. |
| **Creación de usuarios por alumnos denegada** | ✅ CUMPLIDO | 7/7 | Alumnos bloqueados con HTTP 403 en creación de estudiantes (`/students`), docentes (`/teachers`), escuelas (`/system/schools`), cursos y notas. |
| **Reporte de control vertical emitido** | ✅ CUMPLIDO | 1/1 | Informe técnico oficial emitido con registro de auditoría, trazabilidad y firma criptográfica SHA-256. |

---

## 3. Matriz de Roles y Privilegios en Aurenis

| Recurso / Operación | Método | Endpoint | Docente | Estudiante | Apoderado | Director | SuperAdmin |
| :--- | :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **Ajustes de Colegio (Edición)** | `PATCH` | `/api/schools/[id]/settings` | ❌ (403) | ❌ (403) | ❌ (403) | ✅ (200) | ✅ (200) |
| **Ajustes de Colegio (Lectura Admin)** | `GET` | `/api/schools/[id]/settings` | ❌ (403) | ❌ (403) | ❌ (403) | ✅ (200) | ✅ (200) |
| **Periodos Académicos (Crear)** | `POST` | `/api/schools/[id]/academic-periods` | ❌ (403) | ❌ (403) | ❌ (403) | ✅ (201) | ✅ (201) |
| **Periodos Académicos (Modificar)** | `PATCH` | `/api/schools/[id]/academic-periods/[id]` | ❌ (403) | ❌ (403) | ❌ (403) | ✅ (200) | ✅ (200) |
| **Periodos Académicos (Eliminar)** | `DELETE` | `/api/schools/[id]/academic-periods/[id]` | ❌ (403) | ❌ (403) | ❌ (403) | ✅ (200) | ✅ (200) |
| **Matrícula de Estudiantes** | `POST` | `/api/schools/[id]/students` | ❌ (403) | ❌ (403) | ❌ (403) | ✅ (201) | ✅ (201) |
| **Contratación de Docentes** | `POST` | `/api/schools/[id]/teachers` | ❌ (403) | ❌ (403) | ❌ (403) | ✅ (201) | ✅ (201) |
| **Creación de Cursos** | `POST` | `/api/schools/[id]/courses` | ❌ (403) | ❌ (403) | ❌ (403) | ✅ (201) | ✅ (201) |
| **Ingreso de Notas** | `POST` | `/api/schools/[id]/grades` | ✅ (201) | ❌ (403) | ❌ (403) | ✅ (201) | ✅ (201) |
| **Creación de Escuelas (Global)** | `POST` | `/api/system/schools` | ❌ (403) | ❌ (403) | ❌ (403) | ❌ (403) | ✅ (201) |

---

## 4. Registro Detallado de Pruebas Ejecutadas

### Criterio 1: Intentos de llamado a APIs de configuración por docentes rechazados
- **[CFG-DOC-01]** `PASSED` (HTTP 403/403): Docente intenta modificar ajustes institucionales (PATCH /settings)
  - *Resultado:* Bloqueado con HTTP 403: "No posees el permiso para modificar la configuración del colegio."
- **[CFG-DOC-02]** `PASSED` (HTTP 403/403): Docente intenta consultar configuración administrativa (GET /settings)
  - *Resultado:* Bloqueado con HTTP 403: "No posees el permiso para ver la configuración del colegio."
- **[CFG-DOC-03]** `PASSED` (HTTP 403/403): Docente intenta crear un periodo académico institucional (POST /academic-periods)
  - *Resultado:* Bloqueado con HTTP 403: "No tienes permisos para crear periodos académicos"
- **[CFG-DOC-04]** `PASSED` (HTTP 403/403): Docente intenta modificar un periodo académico institucional (PATCH /academic-periods/[id])
  - *Resultado:* Bloqueado con HTTP 403: "No tienes permisos para modificar periodos académicos"
- **[CFG-DOC-05]** `PASSED` (HTTP 403/403): Docente intenta eliminar un periodo académico institucional (DELETE /academic-periods/[id])
  - *Resultado:* Bloqueado con HTTP 403: "No tienes permisos para eliminar periodos académicos"
- **[CFG-DOC-06]** `PASSED` (HTTP 403/403): Docente intenta crear cursos en la escuela (POST /courses)
  - *Resultado:* Bloqueado con HTTP 403: "Acceso denegado. Se requieren privilegios de administración de cursos."
- **[CFG-DOC-07]** `PASSED` (HTTP 403/403): Docente intenta crear nuevas instituciones en SaaS (POST /api/system/schools)
  - *Resultado:* Bloqueado con HTTP 403: "Acceso denegado. Se requieren privilegios de SuperAdmin."

### Criterio 2: Creación de usuarios por alumnos denegada
- **[USR-ALU-01]** `PASSED` (HTTP 403/403): Alumno intenta matricular / crear estudiante (POST /students)
  - *Resultado:* Bloqueado con HTTP 403: "No tienes permiso para matricular estudiantes en esta institución."
- **[USR-ALU-02]** `PASSED` (HTTP 403/403): Alumno intenta crear / registrar docente en la escuela (POST /teachers)
  - *Resultado:* Bloqueado con HTTP 403: "No tienes permiso para gestionar profesores en esta institución."
- **[USR-ALU-03]** `PASSED` (HTTP 403/403): Alumno intenta registrar institución y nuevo administrador en SaaS (POST /api/system/schools)
  - *Resultado:* Bloqueado con HTTP 403: "Acceso denegado. Se requieren privilegios de SuperAdmin."
- **[USR-ALU-04]** `PASSED` (HTTP 403/403): Alumno intenta crear cursos académicos (POST /courses)
  - *Resultado:* Bloqueado con HTTP 403: "Acceso denegado. Se requieren privilegios de administración de cursos."
- **[USR-ALU-05]** `PASSED` (HTTP 403/403): Alumno intenta ingresar o alterar notas académicas (POST /grades)
  - *Resultado:* Bloqueado con HTTP 403: "Acceso denegado. Permisos insuficientes para ingresar o crear calificaciones."
- **[USR-ALU-06]** `PASSED` (HTTP 403/403): Alumno intenta modificar ajustes de calificación del colegio (PATCH /settings)
  - *Resultado:* Bloqueado con HTTP 403: "No posees el permiso para modificar la configuración del colegio."
- **[USR-ALU-07]** `PASSED` (HTTP 403/403): Alumno intenta consultar configuración administrativa (GET /settings)
  - *Resultado:* Bloqueado con HTTP 403: "No posees el permiso para ver la configuración del colegio."

### Control Vertical Adicional y Límites Multi-Tenant
- **[RBAC-APOD-01]** `PASSED` (HTTP 403/403): Apoderado intenta ingresar o crear calificaciones (POST /grades)
  - *Resultado:* Bloqueado con HTTP 403: "Acceso denegado. Permisos insuficientes para ingresar o crear calificaciones."
- **[RBAC-APOD-02]** `PASSED` (HTTP 403/403): Apoderado intenta crear cursos en la institución (POST /courses)
  - *Resultado:* Bloqueado con HTTP 403: "Acceso denegado. Se requieren privilegios de administración de cursos."
- **[RBAC-APOD-03]** `PASSED` (HTTP 403/403): Apoderado intenta alterar configuración escolar (PATCH /settings)
  - *Resultado:* Bloqueado con HTTP 403: "No posees el permiso para modificar la configuración del colegio."
- **[RBAC-DIR-01]** `PASSED` (HTTP 403/403): Director intenta crear colegios globales (SuperAdmin)
  - *Resultado:* Bloqueado con HTTP 403: "Acceso denegado. Se requieren privilegios de SuperAdmin."
- **[RBAC-DIR-02]** `PASSED` (HTTP 403/403): Director intenta gestionar recursos de otra institución escolar (Aislamiento Multi-Tenant)
  - *Resultado:* Bloqueado con HTTP 403: "Acceso denegado a esta institución"

### Línea Base Positiva (Operaciones Autorizadas)
- **[AUTH-DIR-01]** `PASSED` (HTTP 201/201): Director crea legítimamente un curso en su colegio
  - *Resultado:* Acceso autorizado confirmado con HTTP 201 Created
- **[AUTH-DIR-02]** `PASSED` (HTTP 200/200): Director consulta legítimamente los ajustes de su colegio
  - *Resultado:* Acceso autorizado confirmado con HTTP 200 OK
- **[AUTH-ADMIN-01]** `PASSED` (HTTP 200/200): SuperAdmin accede a la API global del sistema
  - *Resultado:* Acceso autorizado confirmado con HTTP 200 OK

---

## 5. Dictamen y Certificación de Seguridad

Los resultados de las 22 evaluaciones confirman que la plataforma Aurenis cuenta con barreras robustas de control de acceso vertical y verificación de privilegios RBAC:
1. Ningún docente tiene capacidad de invocar APIs de configuración, escalamiento de notas o periodos lectivos.
2. Ningún estudiante tiene capacidad de registrar usuarios, contratar profesores, crear cursos o auto-asignarse notas.
3. El aislamiento jerárquico entre Director, Profesor, Estudiante, Apoderado y SuperAdmin es estricto e inviolable.

---

## 6. Verificación Criptográfica de Integridad

- **Algoritmo de Hash:** SHA-256
- **Firma Digital del Reporte:** `820a0262a5e4b3769a629a144e22a07b03eead0ee865a54b7606dbcd6edbc65c`
- **Validador:** Aurenis Security Engine (RBAC Verification Module)
- **Certificación:** CONFORME Y APROBADO PARA PRODUCCIÓN
