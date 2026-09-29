# 🔌 CATÁLOGO CANÓNICO DE ENDPOINTS, ESPECIFICACIÓN DE APIS Y FORMATOS DE RESPUESTA — AURENIS SAAS v2.4.0

**Documento Oficial:** Anexo Técnico Canónico de APIs REST, Contratos de Entrada/Salida y Protocolo de Intercambio  
**Versión de la API:** `v1.0.0 (Next.js App Router API Handlers)`  
**Fecha de Emisión:** 27 de Septiembre de 2026  
**Líder de Arquitectura & Backend:** **Maicol R.** (*Project Lead, Arquitectura & Backend Lead*)  
**Equipo de Desarrollo & Validación:** **Malcom Marcelo** (*Frontend Lead*), **Lucas P.** (*UI/UX Lead*), **Frank M.** (*QA Lead & Ciberseguridad*)  
**Estado:** 🟢 **CERTIFICADO PARA PRODUCCIÓN Y REVISIÓN FINAL DE ENDPOINTS (100% AUDITADO)**

---

## 📋 1. Resumen Ejecutivo y Estándares de Comunicación

El presente documento constituye el **Catálogo Canónico de APIs** de la plataforma **AURENIS**. En cumplimiento con las directrices de arquitectura de **Maicol R.** y las auditorías de seguridad de **Frank M.**, todas las rutas de la API operan bajo los siguientes estándares de ingeniería:

1. **Protocolo y Formato de Intercambio:** HTTP/1.1 y HTTP/2 sobre TLS 1.3. Cuerpos de mensaje serializados en `application/json; charset=utf-8`.
2. **Autenticación Basada en Cookies Criptográficas:** Autenticación de estado de sesión mediante cookie `aurenis_session` firmada con algoritmo HMAC-SHA256 (JWT), con atributos `HttpOnly`, `SameSite=Lax` y `Path=/`.
3. **Aislamiento Multi-Tenant Automático:** En todas las rutas `/api/schools/[schoolId]/*`, el backend valida la correspondencia entre la sesión del usuario y la institución (`schoolId`), inyectando el cliente Scoped Prisma (`createTenantPrisma(schoolId)`), erradicando vulnerabilidades BOLA/IDOR (Broken Object Level Authorization).
4. **Validación Estricta de Esquemas (Zod):** Todo parámetro de ruta (`params`), parámetro de consulta (`searchParams`) y cuerpo de solicitud (`body`) es sanitizado y validado fuertemente contra esquemas Zod en tiempo de ejecución.
5. **Formato Uniforme de Respuestas de Error (RFC 7807 / Standard Aurenis):** Las respuestas de error siguen una estructura JSON predecible:
   ```json
   {
     "error": "Mensaje descriptivo saneado para usuario",
     "code": "ERROR_CODE_ENUM",
     "details": {
       "fieldErrors": { "fieldName": ["Razón de falla de validación"] },
       "formErrors": []
     }
   }
   ```

---

## 🗺️ 2. Mapa Global de Endpoints por Módulo Funcional

```
====================================================================================================
                        MATRIZ DE RUTAS Y ENDPOINTS REST — AURENIS
====================================================================================================

[ 🔐 MÓDULO 1: AUTENTICACIÓN Y SESIONES ]
  POST   /api/auth/login                  -> Autenticación de credenciales y emisión de cookie JWT
  POST   /api/auth/logout                 -> Revocación de sesión e invalidación de cookie
  GET    /api/auth/me                     -> Inspección de identidad, roles y contexto activo
  POST   /api/auth/select-school          -> Conmutación de colegio activo (Multi-Tenant Switch)

[ 👤 MÓDULO 2: PREFERENCIAS DE USUARIO ]
  GET    /api/user/preferences            -> Obtención de preferencias (tema, accesibilidad, locale)
  PATCH  /api/user/preferences            -> Actualización de preferencias personales de interfaz

[ 🌐 MÓDULO 3: CONTACTO Y SOPORTE PÚBLICO ]
  POST   /api/contact                     -> Envío de formulario público de contacto y demo comercial

[ 🏢 MÓDULO 4: BÚSQUEDA Y GESTIÓN DE COLEGIOS (TENANTS) ]
  GET    /api/schools/search              -> Búsqueda pública/autenticada de instituciones por término
  GET    /api/schools/[schoolId]/settings -> Consulta de configuración institucional y Decreto 67
  PATCH  /api/schools/[schoolId]/settings -> Actualización de escalas de notas y periodos lectivos

[ 📅 MÓDULO 5: PERIODOS ACADÉMICOS ]
  GET    /api/schools/[schoolId]/academic-periods             -> Listar periodos lectivos anuales
  POST   /api/schools/[schoolId]/academic-periods             -> Crear nuevo periodo académico
  GET    /api/schools/[schoolId]/academic-periods/[periodId]  -> Detalle de periodo académico
  PATCH  /api/schools/[schoolId]/academic-periods/[periodId]  -> Actualizar fechas o estado de periodo
  DELETE /api/schools/[schoolId]/academic-periods/[periodId]  -> Eliminar periodo (sin notas asociadas)

[ 📚 MÓDULO 6: ASIGNATURAS Y CURSOS ]
  GET    /api/schools/[schoolId]/subjects            -> Listar asignaturas/planes curriculares
  POST   /api/schools/[schoolId]/subjects            -> Registrar nueva asignatura
  GET    /api/schools/[schoolId]/courses             -> Listar cursos y niveles educacionales
  POST   /api/schools/[schoolId]/courses             -> Crear nuevo curso/sección
  GET    /api/schools/[schoolId]/courses/[courseId]  -> Detalle de curso, matrícula y jefatura
  PATCH  /api/schools/[schoolId]/courses/[courseId]  -> Actualizar nombre, nivel o profesor jefe
  DELETE /api/schools/[schoolId]/courses/[courseId]  -> Eliminar curso

[ 👨‍🎓 MÓDULO 7: ESTUDIANTES Y MATRÍCULAS (PROTECCIÓN NNA) ]
  GET    /api/schools/[schoolId]/students             -> Listar estudiantes matriculados
  POST   /api/schools/[schoolId]/students             -> Matricular nuevo estudiante (cifrado RUN/PII)
  GET    /api/schools/[schoolId]/students/[studentId] -> Ficha individual de estudiante
  PATCH  /api/schools/[schoolId]/students/[studentId] -> Modificar datos de matrícula o médicos
  DELETE /api/schools/[schoolId]/students/[studentId] -> Retiro/Eliminación de estudiante

[ 👨‍🏫 MÓDULO 8: DOCENTES Y ASIGNACIONES ACADÉMICAS ]
  GET    /api/schools/[schoolId]/teachers                          -> Listar cuerpo docente institucional
  POST   /api/schools/[schoolId]/teachers                          -> Registrar nuevo docente
  GET    /api/schools/[schoolId]/teachers/[teacherId]              -> Perfil y carga académica de docente
  PATCH  /api/schools/[schoolId]/teachers/[teacherId]              -> Actualizar datos laborales docente
  DELETE /api/schools/[schoolId]/teachers/[teacherId]              -> Desactivar docente
  POST   /api/schools/[schoolId]/teachers/[teacherId]/assign       -> Asignar docente a curso/asignatura

[ 📝 MÓDULO 9: EVALUACIONES, CALIFICACIONES Y LIBRO DIGITAL (DECRETO 67) ]
  GET    /api/schools/[schoolId]/grades/assessments                 -> Listar eventos evaluativos
  POST   /api/schools/[schoolId]/grades/assessments                 -> Programar nueva evaluación
  GET    /api/schools/[schoolId]/grades/assessments/[assessmentId]  -> Detalle de evaluación
  PATCH  /api/schools/[schoolId]/grades/assessments/[assessmentId]  -> Modificar ponderación/fecha
  DELETE /api/schools/[schoolId]/grades/assessments/[assessmentId]  -> Eliminar evaluación
  GET    /api/schools/[schoolId]/grades                             -> Listar notas (filtrado por alumno/curso)
  POST   /api/schools/[schoolId]/grades                             -> Registrar nota individual
  GET    /api/schools/[schoolId]/grades/[gradeId]                   -> Obtener nota específica
  PATCH  /api/schools/[schoolId]/grades/[gradeId]                   -> Rectificar nota con justificación
  DELETE /api/schools/[schoolId]/grades/[gradeId]                   -> Anular calificación
  GET    /api/schools/[schoolId]/grades/matrix                      -> Matriz consolidada de libro de clases
  POST   /api/schools/[schoolId]/grades/bulk                        -> Carga masiva de notas con auditoría

[ 📦 MÓDULO 10: EXPORTACIÓN, COPIAS DE SEGURIDAD Y CUMPLIMIENTO ]
  GET    /api/schools/[schoolId]/export                             -> Descarga de backup institucional .ZIP

[ 👑 MÓDULO 11: CONTROL PLANE & SUPERADMINISTRACIÓN (SYSTEM_ADMIN) ]
  GET    /api/system/schools                                        -> Listado global de colegios SaaS
  POST   /api/system/schools                                        -> Aprovisionamiento atómico de colegio
  PATCH  /api/system/schools/[schoolId]/status                      -> Activar/Suspender colegio
  GET    /api/system/e2e-workflow                                   -> Estado de suites de integración E2E
====================================================================================================
```

---

## 🔍 3. Especificación Detallada de Parámetros y Formatos de Respuesta

---

### 3.1 MÓDULO DE AUTENTICACIÓN Y SESIONES (`/api/auth`)
*Responsable Técnico: Maicol R. (Backend Lead)*

#### 3.1.1 `POST /api/auth/login`
- **Descripción:** Autentica a un usuario mediante credenciales (email/contraseña), genera el token JWT y establece la cookie segura `aurenis_session`.
- **Nivel de Acceso:** Público (Sin autenticación requerida).
- **Esquema de Entrada (Request Body):**
  | Campo | Tipo | Requerido | Validaciones Zod / Reglas |
  | :--- | :--- | :--- | :--- |
  | `email` | `string` | Sí | `z.string().email("Correo electrónico inválido")` |
  | `password` | `string` | Sí | `z.string().min(6, "Mínimo 6 caracteres")` |
- **Ejemplo de Request:**
  ```json
  {
    "email": "director@sanjose.cl",
    "password": "PasswordSeguro2026!"
  }
  ```
- **Formato de Respuestas:**
  - **`200 OK` (Éxito):**
    ```json
    {
      "success": true,
      "redirectUrl": "/colegio-san-jose/dashboard",
      "user": {
        "id": "u-018f3a9b-1122-7788-99aa-bbccddeeff00",
        "email": "director@sanjose.cl",
        "name": "Carlos Mendoza",
        "isSystemAdmin": false
      },
      "activeSchool": {
        "id": "s-018f3a9b-3344-7788-99aa-bbccddeeff11",
        "name": "Colegio San José",
        "slug": "colegio-san-jose"
      }
    }
    ```
    *Cabecera retornada:* `Set-Cookie: aurenis_session=<token_jwt>; Path=/; HttpOnly; SameSite=Lax`
  - **`400 Bad Request`:**
    ```json
    {
      "error": "Datos de entrada inválidos",
      "details": {
        "fieldErrors": {
          "email": ["Correo electrónico inválido"]
        }
      }
    }
    ```
  - **`401 Unauthorized`:**
    ```json
    {
      "error": "Credenciales inválidas."
    }
    ```

---

#### 3.1.2 `POST /api/auth/logout`
- **Descripción:** Cierra la sesión activa revocando y limpiando la cookie `aurenis_session`.
- **Nivel de Acceso:** Público / Autenticado.
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Sesión cerrada correctamente"
  }
  ```
  *Cabecera retornada:* `Set-Cookie: aurenis_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`

---

#### 3.1.3 `GET /api/auth/me`
- **Descripción:** Retorna el contexto de sesión verificado, memberships institucionales y permisos del usuario activo.
- **Nivel de Acceso:** Requiere sesión válida (`aurenis_session`).
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "authenticated": true,
    "user": {
      "userId": "u-018f3a9b-1122-7788-99aa-bbccddeeff00",
      "email": "director@sanjose.cl",
      "name": "Carlos Mendoza",
      "isSystemAdmin": false,
      "schoolId": "s-018f3a9b-3344-7788-99aa-bbccddeeff11",
      "schoolSlug": "colegio-san-jose",
      "schoolName": "Colegio San José",
      "role": "SCHOOL_ADMIN",
      "permissions": ["school:settings:update", "academic:manage", "grades:enter", "grades:publish"]
    }
  }
  ```
- **Formato de Respuesta `401 Unauthorized`:**
  ```json
  {
    "authenticated": false,
    "user": null,
    "error": "No hay sesión activa"
  }
  ```

---

#### 3.1.4 `POST /api/auth/select-school`
- **Descripción:** Permite a usuarios multi-rol o multi-institución conmutar su colegio de trabajo activo.
- **Nivel de Acceso:** Autenticado.
- **Esquema de Entrada (Request Body):**
  | Campo | Tipo | Requerido | Validaciones |
  | :--- | :--- | :--- | :--- |
  | `schoolId` | `string` | Sí | `z.string().uuid("UUID inválido")` |
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "redirectUrl": "/liceo-bicentenario/dashboard",
    "activeSchool": {
      "id": "s-018f3a9b-9999-7788-99aa-bbccddeeff22",
      "name": "Liceo Bicentenario",
      "slug": "liceo-bicentenario"
    }
  }
  ```

---

### 3.2 MÓDULO DE GESTIÓN INSTITUCIONAL Y CONFIGURACIÓN (`/api/schools/[schoolId]/settings`)
*Responsable Técnico: Maicol R. & Lucas P.*

#### 3.2.1 `GET /api/schools/[schoolId]/settings`
- **Descripción:** Obtiene los parámetros institucionales, esquema de evaluación y reglas de aprobación según Decreto 67.
- **Parámetros de Ruta:** `schoolId` (UUID o slug institucional).
- **Nivel de Acceso:** Requiere permiso `SCHOOL_SETTINGS_VIEW` o pertenencia activa a la institución.
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "settings": {
      "id": "set-018f3a9b-5566-7788-99aa-bbccddeeff33",
      "schoolId": "s-018f3a9b-3344-7788-99aa-bbccddeeff11",
      "minPassingGrade": 4.0,
      "maxGrade": 7.0,
      "minAttendancePercentage": 85.0,
      "academicTermType": "SEMESTER",
      "allowTeacherGradeEdit": true,
      "requireAdminApprovalForGradeChange": true,
      "createdAt": "2026-03-01T08:00:00.000Z",
      "updatedAt": "2026-09-20T14:30:00.000Z"
    }
  }
  ```

---

#### 3.2.2 `PATCH /api/schools/[schoolId]/settings`
- **Descripción:** Actualiza los umbrales de aprobación, tipo de periodos (Semestral/Trimestral) y políticas del libro de notas.
- **Nivel de Acceso:** Requiere rol `SCHOOL_ADMIN` o permiso `SCHOOL_SETTINGS_UPDATE`.
- **Esquema de Entrada (Request Body):**
  | Campo | Tipo | Requerido | Validaciones Zod |
  | :--- | :--- | :--- | :--- |
  | `minPassingGrade` | `number` | No | `z.number().min(1.0).max(7.0)` |
  | `maxGrade` | `number` | No | `z.number().min(1.0).max(7.0)` |
  | `minAttendancePercentage` | `number` | No | `z.number().min(0).max(100)` |
  | `academicTermType` | `string` | No | `z.enum(["SEMESTER", "TRIMESTER", "BIMESTER", "ANNUAL"])` |
  | `allowTeacherGradeEdit` | `boolean` | No | `z.boolean()` |
  | `requireAdminApprovalForGradeChange` | `boolean` | No | `z.boolean()` |
- **Ejemplo de Request:**
  ```json
  {
    "minPassingGrade": 4.0,
    "maxGrade": 7.0,
    "minAttendancePercentage": 85.0,
    "academicTermType": "SEMESTER",
    "allowTeacherGradeEdit": true
  }
  ```
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Configuración institucional actualizada correctamente",
    "settings": {
      "schoolId": "s-018f3a9b-3344-7788-99aa-bbccddeeff11",
      "minPassingGrade": 4.0,
      "maxGrade": 7.0,
      "academicTermType": "SEMESTER"
    }
  }
  ```

---

### 3.3 MÓDULO DE PERIODOS ACADÉMICOS (`/api/schools/[schoolId]/academic-periods`)
*Responsable Técnico: Maicol R.*

#### 3.3.1 `GET /api/schools/[schoolId]/academic-periods`
- **Descripción:** Lista los años y periodos lectivos (ej: Primer Semestre 2026, Segundo Semestre 2026) con sus estados de apertura/cierre.
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "periods": [
      {
        "id": "p-018f3a9b-0001-7788-99aa-bbccddeeff44",
        "name": "Primer Semestre 2026",
        "code": "2026-S1",
        "startDate": "2026-03-01T00:00:00.000Z",
        "endDate": "2026-07-15T23:59:59.000Z",
        "isClosed": false,
        "isCurrent": true
      }
    ]
  }
  ```

#### 3.3.2 `POST /api/schools/[schoolId]/academic-periods`
- **Descripción:** Crea e inicializa un nuevo periodo lectivo en el calendario institucional.
- **Nivel de Acceso:** `SCHOOL_ADMIN` (`academic:period:create`).
- **Esquema de Entrada (Request Body):**
  | Campo | Tipo | Requerido | Validaciones Zod |
  | :--- | :--- | :--- | :--- |
  | `name` | `string` | Sí | `z.string().min(3).max(100)` |
  | `code` | `string` | Sí | `z.string().min(2).max(20)` |
  | `startDate` | `string (ISO)` | Sí | `z.string().datetime()` |
  | `endDate` | `string (ISO)` | Sí | `z.string().datetime()` |
  | `isCurrent` | `boolean` | No | `z.boolean().optional()` |

---

### 3.4 MÓDULO DE ASIGNATURAS Y CURSOS (`/api/schools/[schoolId]/courses` y `subjects`)
*Responsable Técnico: Maicol R. & Malcom Marcelo*

#### 3.4.1 `GET /api/schools/[schoolId]/courses`
- **Descripción:** Lista todos los cursos y secciones del colegio con conteo de estudiantes matriculados y profesor jefe.
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "courses": [
      {
        "id": "c-018f3a9b-7788-7788-99aa-bbccddeeff55",
        "name": "1° Medio A",
        "gradeLevel": "PRIMERO_MEDIO",
        "section": "A",
        "shift": "MORNING",
        "headTeacher": {
          "id": "t-018f3a9b-8899-7788-99aa-bbccddeeff66",
          "name": "Prof. Roberto González"
        },
        "_count": {
          "enrollments": 32
        }
      }
    ]
  }
  ```

#### 3.4.2 `POST /api/schools/[schoolId]/courses`
- **Descripción:** Registra un nuevo curso o nivel escolar.
- **Esquema de Entrada (Request Body):**
  ```json
  {
    "name": "2° Medio B",
    "gradeLevel": "SEGUNDO_MEDIO",
    "section": "B",
    "headTeacherId": "t-018f3a9b-8899-7788-99aa-bbccddeeff66"
  }
  ```

---

### 3.5 MÓDULO DE ESTUDIANTES Y MATRÍCULAS (`/api/schools/[schoolId]/students`)
*Responsable Técnico: Maicol R. & Frank M. (Protección de Datos NNA y Cifrado AES-256-GCM)*

#### 3.5.1 `GET /api/schools/[schoolId]/students`
- **Descripción:** Lista los estudiantes matriculados con datos descifrados en memoria para usuarios autorizados.
- **Parámetros de Consulta (Query Params):**
  - `courseId` (opcional): Filtra estudiantes por curso.
  - `status` (opcional): `ACTIVE`, `WITHDRAWN`, `GRADUATED`.
  - `search` (opcional): Búsqueda por nombre, apellido o RUN.
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "students": [
      {
        "id": "st-018f3a9b-1111-7788-99aa-bbccddeeff77",
        "firstName": "Martina",
        "lastName": "Soto Pérez",
        "rut": "23.456.789-0",
        "email": "martina.soto@estudiantes.cl",
        "status": "ACTIVE",
        "enrollment": {
          "courseId": "c-018f3a9b-7788-7788-99aa-bbccddeeff55",
          "courseName": "1° Medio A",
          "rollNumber": 14
        },
        "guardians": [
          {
            "id": "g-018f3a9b-2222-7788-99aa-bbccddeeff88",
            "name": "Andrea Pérez",
            "relationship": "MADRE",
            "phone": "+56 9 8765 4321",
            "canPickUp": true
          }
        ]
      }
    ]
  }
  ```

#### 3.5.2 `POST /api/schools/[schoolId]/students`
- **Descripción:** Registra una nueva matrícula estudiantil. Cifra automáticamente RUN, notas médicas y datos de contacto de emergencia antes de persistir en PostgreSQL.
- **Esquema de Entrada (Request Body):**
  ```json
  {
    "firstName": "Lucas",
    "lastName": "Navarro Díaz",
    "rut": "24.567.890-1",
    "birthDate": "2010-05-14",
    "gender": "MALE",
    "email": "lucas.navarro@estudiantes.cl",
    "courseId": "c-018f3a9b-7788-7788-99aa-bbccddeeff55",
    "medicalNotes": "Alergia severa a la penicilina",
    "emergencyContact": "+56 9 1122 3344"
  }
  ```

---

### 3.6 MÓDULO DE DOCENTES Y ASIGNACIONES (`/api/schools/[schoolId]/teachers`)
*Responsable Técnico: Maicol R.*

#### 3.6.1 `GET /api/schools/[schoolId]/teachers`
- **Descripción:** Lista el plantel docente institucional con sus asignaturas y cursos asignados.
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "teachers": [
      {
        "id": "t-018f3a9b-8899-7788-99aa-bbccddeeff66",
        "user": {
          "id": "u-018f3a9b-3333-7788-99aa-bbccddeeff99",
          "name": "Roberto González",
          "email": "roberto.gonzalez@sanjose.cl"
        },
        "specialty": "Matemática y Física",
        "isActive": true,
        "assignments": [
          {
            "id": "asg-01",
            "course": { "id": "c-01", "name": "1° Medio A" },
            "subject": { "id": "sub-01", "name": "Matemáticas" }
          }
        ]
      }
    ]
  }
  ```

#### 3.6.2 `POST /api/schools/[schoolId]/teachers/[teacherId]/assign`
- **Descripción:** Asigna a un docente la responsabilidad académica de una asignatura en un curso específico.
- **Esquema de Entrada (Request Body):**
  ```json
  {
    "courseId": "c-018f3a9b-7788-7788-99aa-bbccddeeff55",
    "subjectId": "sub-018f3a9b-4444-7788-99aa-bbccddeeff00",
    "academicPeriodId": "p-018f3a9b-0001-7788-99aa-bbccddeeff44"
  }
  ```

---

### 3.7 MÓDULO DE CALIFICACIONES Y LIBRO DE CLASES (`/api/schools/[schoolId]/grades`)
*Responsable Técnico: Maicol R. & Malcom Marcelo (Decreto 67 y Redondeo Oficial)*

#### 3.7.1 `GET /api/schools/[schoolId]/grades/matrix`
- **Descripción:** Retorna la cuadrícula consolidada de notas del curso y asignatura para renderizar la sábana del libro digital.
- **Parámetros de Consulta (Query Params):**
  - `courseId` (requerido): Identificador del curso.
  - `subjectId` (requerido): Identificador de la asignatura.
  - `periodId` (requerido): Periodo académico (semestre/trimestre).
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "course": { "id": "c-01", "name": "1° Medio A" },
    "subject": { "id": "sub-01", "name": "Matemáticas" },
    "period": { "id": "p-01", "name": "Primer Semestre 2026" },
    "assessments": [
      { "id": "ev-01", "title": "Prueba Parcial 1", "weight": 25, "date": "2026-04-10" },
      { "id": "ev-02", "title": "Taller Grupal", "weight": 25, "date": "2026-05-15" }
    ],
    "students": [
      {
        "studentId": "st-01",
        "studentName": "Martina Soto Pérez",
        "grades": {
          "ev-01": { "gradeId": "gr-01", "value": 6.5, "isExempt": false },
          "ev-02": { "gradeId": "gr-02", "value": 5.8, "isExempt": false }
        },
        "calculatedAverage": 6.2,
        "isPassing": true
      }
    ]
  }
  ```

#### 3.7.2 `POST /api/schools/[schoolId]/grades`
- **Descripción:** Registra una calificación individual en el libro digital con validación de escala 1.0 a 7.0 (Decreto 67).
- **Nivel de Acceso:** `TEACHER` o `SCHOOL_ADMIN` (`grades:enter`).
- **Esquema de Entrada (Request Body):**
  | Campo | Tipo | Requerido | Validaciones Zod |
  | :--- | :--- | :--- | :--- |
  | `assessmentId` | `string` | Sí | `z.string().uuid()` |
  | `studentProfileId` | `string` | Sí | `z.string().uuid()` |
  | `value` | `number` | Sí | `z.number().min(1.0).max(7.0)` |
  | `isExempt` | `boolean` | No | `z.boolean().default(false)` |
  | `feedback` | `string` | No | `z.string().max(500).optional()` |
- **Formato de Respuesta `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Calificación registrada exitosamente",
    "grade": {
      "id": "gr-018f3a9b-9999-7788-99aa-bbccddeeff99",
      "assessmentId": "ev-018f3a9b-0001-7788-99aa-bbccddeeff44",
      "studentProfileId": "st-018f3a9b-1111-7788-99aa-bbccddeeff77",
      "value": 6.5,
      "isExempt": false,
      "feedback": "Excelente comprensión de funciones cuadráticas"
    }
  }
  ```

#### 3.7.3 `POST /api/schools/[schoolId]/grades/bulk`
- **Descripción:** Ingesta atómica y transaccional de una columna completa de notas para un curso, generando bitácora de auditoría inmutable.
- **Esquema de Entrada (Request Body):**
  ```json
  {
    "assessmentId": "ev-018f3a9b-0001-7788-99aa-bbccddeeff44",
    "grades": [
      { "studentProfileId": "st-01", "value": 6.5, "isExempt": false },
      { "studentProfileId": "st-02", "value": 4.8, "isExempt": false },
      { "studentProfileId": "st-03", "value": 1.0, "isExempt": true, "feedback": "Licencia médica justificada" }
    ]
  }
  ```
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "processedCount": 3,
    "message": "3 calificaciones procesadas y persistidas correctamente"
  }
  ```

---

### 3.8 MÓDULO DE EXPORTACIÓN Y BACKUP (`/api/schools/[schoolId]/export`)
*Responsable Técnico: Maicol R. & Frank M.*

#### 3.8.1 `GET /api/schools/[schoolId]/export`
- **Descripción:** Genera un archivo ZIP cifrado en memoria que contiene el dump completo de la institución (estudiantes, profesores, cursos, calificaciones en JSON y CSV de libro de clases).
- **Nivel de Acceso:** Exclusivo para `SCHOOL_ADMIN` y `SYSTEM_ADMIN`.
- **Protección Adicional:** Rate Limiting estricto (máximo 5 descargas por hora por IP/usuario) y registro no repudiable en `AuditLog`.
- **Cabeceras de Respuesta `200 OK`:**
  - `Content-Type: application/zip`
  - `Content-Disposition: attachment; filename="backup_colegio-san-jose_2026-09-27.zip"`

---

### 3.9 MÓDULO SUPERADMIN & CONTROL PLANE (`/api/system/schools`)
*Responsable Técnico: Maicol R. (SuperAdmin Control Plane)*

#### 3.9.1 `GET /api/system/schools`
- **Descripción:** Lista global de todas las instituciones cliente registradas en el SaaS multi-tenant.
- **Nivel de Acceso:** Exclusivo `SYSTEM_ADMIN` (`isSystemAdmin: true`).
- **Formato de Respuesta `200 OK`:**
  ```json
  {
    "success": true,
    "schools": [
      {
        "id": "s-018f3a9b-3344-7788-99aa-bbccddeeff11",
        "name": "Colegio San José",
        "slug": "colegio-san-jose",
        "status": "ACTIVE",
        "createdAt": "2026-01-15T10:00:00.000Z",
        "_count": {
          "memberships": 84,
          "courses": 12
        }
      }
    ]
  }
  ```

#### 3.9.2 `POST /api/system/schools`
- **Descripción:** Aprovisionamiento transaccional de un nuevo colegio, creando su registro institucional, configuración inicial, roles por defecto y usuario Director primario.
- **Nivel de Acceso:** Exclusivo `SYSTEM_ADMIN`.
- **Esquema de Entrada (Request Body):**
  ```json
  {
    "name": "Colegio San Agustín",
    "slug": "colegio-san-agustin",
    "address": "Av. Los Leones 1234, Providencia",
    "phone": "+56 2 2233 4455",
    "adminFirstName": "Patricia",
    "adminLastName": "Lagos",
    "adminEmail": "directora@sanagustin.cl",
    "adminPassword": "PasswordFuerte2026!",
    "adminRut": "12.345.678-9"
  }
  ```
- **Formato de Respuesta `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Institución creada e inicializada exitosamente.",
    "school": {
      "id": "s-018f3a9b-7777-7788-99aa-bbccddeeff00",
      "name": "Colegio San Agustín",
      "slug": "colegio-san-agustin"
    },
    "admin": {
      "id": "u-018f3a9b-8888-7788-99aa-bbccddeeff11",
      "email": "directora@sanagustin.cl"
    }
  }
  ```

---

## 🛡️ 4. Matriz de Códigos de Error HTTP y Mitigación de Vulnerabilidades

| Código HTTP | Significado | Causa Típica | Prevención Arquitectónica |
| :---: | :--- | :--- | :--- |
| **`400`** | `Bad Request` | Error en validación Zod de parámetros o UUID malformado. | `SchoolIdParamSchema` y validadores Zod tipados. |
| **`401`** | `Unauthorized` | Token ausente, firma HMAC inválida o sesión expirada. | `getSession()` en `lib/auth/session.ts`. |
| **`403`** | `Forbidden` | Intento de BOLA/IDOR o usuario sin permiso RBAC requerido. | `validateGradesAccess` y `assertPermission`. |
| **`404`** | `Not Found` | Colegio, curso, estudiante o nota inexistente en tenant. | Consultas con discriminador estricto `where: { schoolId }`. |
| **`409`** | `Conflict` | Slug de colegio duplicado o RUN ya registrado en el colegio. | Índices únicos en PostgreSQL e integridad referencial. |
| **`422`** | `Unprocessable` | Calificación fuera de rango [1.0 - 7.0] o periodo cerrado. | Reglas del Decreto 67 aplicadas en capa de servicio. |
| **`429`** | `Too Many Requests`| Exceso de intentos de login o descarga masiva de backups. | Token-bucket `checkRateLimit` en memoria/Redis. |
| **`500`** | `Internal Server Error`| Error imprevisto en ejecución o timeout de base de datos. | `sanitizeErrorMessage` para impedir fuga de stack traces. |

---

## 👥 5. Matriz de Autoría y Responsabilidad Técnica

| Componente / Módulo de API | Integrante Responsable | Rol |
| :--- | :--- | :--- |
| **Arquitectura de API, Handlers REST, Schemas Zod y Persistencia** | **Maicol R.** | *Project Lead, Arquitectura & Backend Lead* |
| **Contratos de Consumo Frontend, React SWR Hooks & Errores UI** | **Malcom Marcelo** | *Frontend Lead & Core Developer* |
| **Diseño Visual de Respuestas, Feedback de Validación y UX** | **Lucas P.** | *UI / UX Lead & Design System* |
| **Auditoría de Seguridad de APIs, Pentesting BOLA/IDOR y QA Suite** | **Frank M.** | *QA Lead & Ciberseguridad* |

---

## 📜 6. Dictamen de Aprobación de la Especificación de APIs

> *"Certifico que el presente catálogo de endpoints cubre la totalidad de las rutas implementadas en el backend de AURENIS, con esquemas de validación Zod verificados, protección contra vulnerabilidades BOLA/IDOR y formatos estandarizados de respuesta."*  
> **— Maicol R., Project Lead & Arquitectura de Backend**
