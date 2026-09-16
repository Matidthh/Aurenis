# INFORME DE SEGURIDAD: PREVENCIÓN DE BOLA / IDOR (OWASP API1:2023)
**Plataforma Institucional Aurenis**
**Fecha de Auditoría:** 2026-09-15T14:19:10.726Z
**Estado:** APROBADO (100% Cobertura de Criterios de Aceptación)
**Tasa de Éxito:** 100.0% (20/20 pruebas superadas)

---

## 1. Resumen Ejecutivo de la Evaluación

Se ejecutaron pruebas automatizadas de seguridad orientadas a mitigar vulnerabilidades de **Broken Object Level Authorization (BOLA)** e **Insecure Direct Object References (IDOR)** en la plataforma Aurenis.

La arquitectura implementa un **Motor de Autorización a Nivel de Objeto** (`lib/security/object-authorization.ts`) que valida matemáticamente la relación de pertenencia entre el usuario autenticado y el registro solicitado antes de permitir cualquier operación de lectura, edición o consulta:
- **Estudiantes:** Restringidos a su propia ficha y sus propias notas. Intentos de consultar registros de otros estudiantes devuelven **HTTP 403 Forbidden**.
- **Apoderados:** Restringidos a las fichas y notas de sus pupilos directamente vinculados (`StudentGuardian`). Intentos de consultar notas o fichas de otros apoderados devuelven **HTTP 403 Forbidden**.
- **Recursos Inexistentes:** Devuelven **HTTP 404 Not Found** sin revelar la estructura interna del colegio.
- **Filtrado de Listados:** Los listados generales filtran proactivamente a nivel de objeto para asegurar que un apoderado o estudiante nunca reciba datos de terceros.

---

## 2. Definición de Hecho (Definition of Done)

| Criterio de Aceptación | Estado | Pruebas | Resultado |
| :--- | :---: | :---: | :--- |
| **Acceso a fichas de otros estudiantes bloqueado** | ✅ CUMPLIDO | 6/6 | Acceso cruzado entre estudiantes o apoderados ajenos bloqueado con 403 |
| **Consulta de notas de otros apoderados denegada** | ✅ CUMPLIDO | 9/9 | Consultas por parámetro ?studentId y listados generales aislados a nivel de pupilo |
| **Respuestas 403 / 404 confirmadas** | ✅ CUMPLIDO | 5/5 | 403 para violaciones BOLA; 404 para identificadores inexistentes |

---

## 3. Matriz Detallada de Pruebas Ejecutadas

### Criterio 1: Acceso a fichas de otros estudiantes bloqueado
- **[BOLA-01]** `PASSED` (HTTP 403/403): Estudiante 1 intenta acceder a ficha de Estudiante 2 (IDOR Horizontal entre alumnos)
  - *Detalle:* Bloqueo confirmado con 403: "Acceso denegado (BOLA / IDOR): No tienes autorización para acceder a la ficha de otro estudiante."
- **[BOLA-02]** `PASSED` (HTTP 200/200): Estudiante 1 accede a su propia ficha (sp-1)
  - *Detalle:* Acceso autorizado a ficha propia confirmado.
- **[BOLA-03]** `PASSED` (HTTP 403/403): Apoderado 1 intenta consultar ficha de Estudiante 2 (alumno ajeno / hijo de otro apoderado)
  - *Detalle:* Bloqueo confirmado con 403: "Acceso denegado (BOLA / IDOR): No tienes autorización para consultar la ficha de un estudiante que no es tu pupilo."
- **[BOLA-04]** `PASSED` (HTTP 200/200): Apoderado 1 accede a la ficha de su propia pupila (sp-1 Martina González)
  - *Detalle:* Acceso autorizado a ficha de su pupilo confirmado.
- **[BOLA-05]** `PASSED` (HTTP 403/403): Apoderado 2 intenta acceder a la ficha de Estudiante 1 (Martina González)
  - *Detalle:* Bloqueo simétrico confirmado con 403: "Acceso denegado (BOLA / IDOR): No tienes autorización para consultar la ficha de un estudiante que no es tu pupilo."
- **[BOLA-06]** `PASSED` (HTTP 200/200): Apoderado 2 accede a la ficha de su propio pupilo (sp-2 Benjamín Silva)
  - *Detalle:* Acceso autorizado a ficha de su pupilo confirmado.

### Criterio 2: Consulta de notas de otros apoderados denegada
- **[BOLA-07]** `PASSED` (HTTP 403/403): Apoderado 1 intenta consultar calificaciones pasando ?studentId=sp-2 (otro apoderado)
  - *Detalle:* Consulta denegada con 403: "Acceso denegado (BOLA / IDOR): Consulta de notas de estudiantes de otros apoderados denegada."
- **[BOLA-08]** `PASSED` (HTTP 403/403): Apoderado 2 intenta consultar calificaciones pasando ?studentId=sp-1 (otro apoderado)
  - *Detalle:* Consulta denegada simétricamente con 403: "Acceso denegado (BOLA / IDOR): Consulta de notas de estudiantes de otros apoderados denegada."
- **[BOLA-09]** `PASSED` (HTTP 200/200): Apoderado 1 en listado general de notas: filtrado estricto a nivel de objeto para sus pupilos
  - *Detalle:* Filtro de notas activo. Pupilos autorizados: [sp-1]. Notas ajenas excluidas.
- **[BOLA-10]** `PASSED` (HTTP 200/200): Apoderado 2 en listado general de notas: filtrado estricto a nivel de objeto para sus pupilos
  - *Detalle:* Filtro de notas activo. Pupilos autorizados: [sp-2]. Notas ajenas excluidas.
- **[BOLA-11]** `PASSED` (HTTP 403/403): Apoderado 1 intenta consultar calificación individual grade-1-2 (pertenece a otro apoderado)
  - *Detalle:* Consulta individual denegada con 403: "Acceso denegado (BOLA / IDOR): Consulta de notas de otros apoderados denegada."
- **[BOLA-12]** `PASSED` (HTTP 200/200): Apoderado 1 consulta calificación individual grade-1-1 (pertenece a su pupila Martina)
  - *Detalle:* Acceso autorizado a nota de su propia pupila confirmado.
- **[BOLA-13]** `PASSED` (HTTP 403/403): Estudiante 1 intenta consultar calificaciones pasando ?studentId=sp-2 (otro alumno)
  - *Detalle:* Consulta denegada con 403: "Acceso denegado (BOLA / IDOR): No puedes consultar las notas de otro estudiante."
- **[BOLA-14]** `PASSED` (HTTP 403/403): Estudiante 1 intenta consultar calificación individual grade-1-2 de Estudiante 2
  - *Detalle:* Consulta denegada con 403: "Acceso denegado (BOLA / IDOR): No puedes ver la calificación de otro estudiante."
- **[BOLA-15]** `PASSED` (HTTP 200/200): Estudiante 1 consulta su propia calificación individual grade-1-1
  - *Detalle:* Acceso autorizado a su propia nota confirmado.

### Criterio 3: Respuestas 403 / 404 confirmadas
- **[BOLA-16]** `PASSED` (HTTP 404/404): Consulta de ficha de estudiante inexistente por Apoderado -> 404 Not Found
  - *Detalle:* Confirmado HTTP 404: "Ficha de estudiante no encontrada."
- **[BOLA-17]** `PASSED` (HTTP 404/404): Consulta de ficha de estudiante inexistente por Estudiante -> 404 Not Found
  - *Detalle:* Confirmado HTTP 404: "Ficha de estudiante no encontrada."
- **[BOLA-18]** `PASSED` (HTTP 404/404): Consulta de calificación individual inexistente -> 404 Not Found
  - *Detalle:* Confirmado HTTP 404: "Calificación no encontrada."
- **[BOLA-19]** `PASSED` (HTTP 403/403): Verificación de código exacto 403 Forbidden en ataque horizontal BOLA
  - *Detalle:* Confirmado HTTP 403 en recurso existente de otro estudiante: "Acceso denegado (BOLA / IDOR): No tienes autorización para acceder a la ficha de otro estudiante."
- **[BOLA-20]** `PASSED` (HTTP 200/200): Ausencia de fuga de datos en payloads de respuesta 403 / 404
  - *Detalle:* Verificado: ningún payload 403 o 404 contiene perfiles, notas, RUTs ni relaciones privadas.

---

## 4. Endpoints y Componentes Protegidos

1. `/api/schools/[schoolId]/students/[studentId]`:
   - `GET`: Validado con `validateStudentRecordAccess`.
   - `PATCH` / `DELETE`: Exclusivo para administradores escolares (`PEOPLE_STUDENTS_MANAGE`). Bloqueado para estudiantes y apoderados con 403.
2. `/api/schools/[schoolId]/grades`:
   - `GET`: Validado con `validateGradesAccess`. Soporta parámetro `?studentId=...` con validación estricta de pupilo, y listado general filtrado por `allowedStudentProfileIds`.
3. `/api/schools/[schoolId]/grades/[gradeId]`:
   - `GET`: Validado con `validateSingleGradeAccess`. Bloquea consultas a notas de otros alumnos con 403.
4. `/[schoolSlug]/grades`:
   - Vista SSR que inyecta automáticamente `allowedStudentProfileIds` basado en la sesión del usuario.
5. `/[schoolSlug]/students`:
   - Redirección automática al dashboard institucional para estudiantes o apoderados sin permisos directos de gestión.

---

## 5. Firma Digital del Informe

**Algoritmo de Firma:** SHA-256
**Hash Criptográfico de Integridad:** `ad96c66acc17b240441dc1d04389b7939dbd3755f1821cf4acd74fbcb6056b93`
**Firmante:** Aurenis Security Engine (v1.0.0)
