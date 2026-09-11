# 🔌 ESPECIFICACIÓN DE LA API REST — AURENIS v1.0

**Estado:** 🟢 **CERTIFICADO PARA PRODUCCIÓN**  
**Versión:** 1.0.0  
**Fecha:** 10 de Septiembre de 2026  
**Formato de Intercambio:** `application/json`  
**Mecanismo de Autenticación:** Cookie de Sesión Criptográfica `aurenis_session` (JWT HS256)

---

## 1. Convenciones Generales y Encabezados

Todas las peticiones a la API deben ajustarse a los siguientes estándares:

- **Base URL:** `/api`
- **Encabezados Requeridos en Peticiones con Payload:**
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Gestión de Sesión:**
  - El navegador o cliente HTTP debe incluir la cookie `aurenis_session` en cada solicitud a endpoints protegidos.
  - En llamadas programmatic (scripts/QA), la cookie se envía mediante el encabezado `Cookie: aurenis_session=<token_jwt>`.

---

## 2. Endpoints de Autenticación y Sesión (`/api/auth`)

### 2.1 Iniciar Sesión (`POST /api/auth/login`)
Valida las credenciales del usuario, emite la cookie de sesión criptográfica y determina la URL de redirección adecuada según el rol.

- **Autenticación requerida:** Ninguna (Ruta Pública).
- **Esquema de Validación (Zod):**
  - `email`: Cadena obligatoria con formato de correo válido.
  - `password`: Cadena obligatoria, longitud mínima de 6 caracteres.

#### Solicitud (Request):
```http
POST /api/auth/login HTTP/1.1
Content-Type: application/json

{
  "email": "carlos.mendoza@sanjose.cl",
  "password": "Password123!"
}
```

#### Respuestas (Responses):

##### `200 OK` — Autenticación Exitosa
```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: aurenis_session=<jwt_token>; Path=/; HttpOnly; SameSite=Lax

{
  "success": true,
  "redirectUrl": "/colegio-san-jose/dashboard",
  "user": {
    "id": "user-director",
    "email": "carlos.mendoza@sanjose.cl",
    "name": "Carlos Mendoza",
    "isSystemAdmin": false
  },
  "activeSchool": {
    "id": "school-csj-001",
    "name": "Colegio San José",
    "slug": "colegio-san-jose"
  }
}
```

##### `400 Bad Request` — Datos de Entrada Inválidos
```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": "Datos de entrada inválidos",
  "details": {
    "fieldErrors": {
      "email": ["Correo electrónico inválido"],
      "password": ["La contraseña debe tener al menos 6 caracteres"]
    }
  }
}
```

##### `401 Unauthorized` — Credenciales Inválidas
```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Credenciales inválidas."
}
```

---

### 2.2 Cierre de Sesión Programático (`POST /api/auth/logout`)
Invalida y revoca la cookie de sesión en el cliente.

- **Autenticación requerida:** Ninguna (puede invocarse con o sin sesión activa).

#### Solicitud (Request):
```http
POST /api/auth/logout HTTP/1.1
Content-Type: application/json
```

#### Respuesta (`200 OK`):
```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: aurenis_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly

{
  "success": true,
  "redirectUrl": "/login"
}
```

---

### 2.3 Cierre de Sesión Nativo por Navegador (`GET /api/auth/logout`)
Permite al navegador ejecutar logout mediante un enlace simple o redirección directa.

#### Respuesta (`307 Temporary Redirect`):
```http
HTTP/1.1 307 Temporary Redirect
Location: /login
Set-Cookie: aurenis_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly
```

---

### 2.4 Cambio de Institución Activa (`POST /api/auth/select-school`)
Para usuarios vinculados a múltiples colegios, actualiza el tenant activo en la sesión.

- **Autenticación requerida:** Sesión activa (`401 Unauthorized` si no existe).

#### Solicitud (Request):
```http
POST /api/auth/select-school HTTP/1.1
Content-Type: application/json

{
  "schoolId": "school-csj-001"
}
```

#### Respuesta (`200 OK`):
```http
HTTP/1.1 200 OK
Content-Type: application/json
Set-Cookie: aurenis_session=<jwt_renovado_con_nuevo_schoolId>; Path=/; HttpOnly; SameSite=Lax

{
  "success": true,
  "redirectUrl": "/colegio-san-jose/dashboard"
}
```

---

## 3. Endpoints de Administración de Plataforma (`/api/system`)

Endpoints exclusivos para el rol **`SYSTEM_ADMIN`** (SuperAdmin global).

### 3.1 Listar Todas las Instituciones (`GET /api/system/schools`)
Obtiene el catálogo completo de colegios registrados en la plataforma.

- **Autenticación requerida:** Sesión activa con `isSystemAdmin: true`.
- **Permisos requeridos:** `SYSTEM_ADMIN` / `SYSTEM_SCHOOLS_MANAGE`.

#### Solicitud (Request):
```http
GET /api/system/schools HTTP/1.1
Cookie: aurenis_session=<token_superadmin>
```

#### Respuestas:

##### `200 OK` — Éxito
```json
[
  {
    "id": "school-csj-001",
    "name": "Colegio San José",
    "slug": "colegio-san-jose",
    "institutionalCode": "CSJ-001",
    "city": "Santiago",
    "country": "Chile",
    "status": "ACTIVE",
    "stats": {
      "teachersCount": 1,
      "studentsCount": 5,
      "coursesCount": 2
    }
  }
]
```

##### `401 Unauthorized` — Petición sin Sesión
```json
{
  "error": "No autenticado. Inicie sesión para continuar."
}
```

##### `403 Forbidden` — Petición con Sesión No-SuperAdmin (ej. Docente o Director)
```json
{
  "error": "Acceso denegado. Se requieren privilegios de SuperAdmin."
}
```

---

### 3.2 Crear Nueva Institución Educativa (`POST /api/system/schools`)
Provisiona un nuevo tenant escolar con su configuración base y roles predeterminados.

- **Autenticación requerida:** SuperAdmin global (`isSystemAdmin: true`).

#### Solicitud (Request):
```json
{
  "name": "Colegio San Patricio",
  "slug": "colegio-san-patricio",
  "institutionalCode": "CSP-002",
  "city": "Concepción",
  "country": "Chile",
  "timezone": "America/Santiago",
  "adminEmail": "director@sanpatricio.cl",
  "adminName": "Mariana Soto"
}
```

#### Respuesta (`201 Created`):
```json
{
  "success": true,
  "school": {
    "id": "school-csp-002",
    "name": "Colegio San Patricio",
    "slug": "colegio-san-patricio",
    "status": "ACTIVE"
  }
}
```

---

## 4. Endpoints de Institución y Tenant (`/api/schools/[schoolId]`)

### 4.1 Obtener Configuración Institucional (`GET /api/schools/[schoolId]/settings`)
Recupera los parámetros académicos de evaluación y presentación del colegio.

- **Autenticación requerida:** Sesión activa con pertenencia al colegio (`schoolId`).
- **Permiso requerido:** `SCHOOL_SETTINGS_VIEW` (Directores, Docentes, Estudiantes).

#### Solicitud (Request):
```http
GET /api/schools/school-csj-001/settings HTTP/1.1
Cookie: aurenis_session=<token_usuario>
```

#### Respuesta (`200 OK`):
```json
{
  "settings": {
    "id": "settings-csj-001",
    "schoolId": "school-csj-001",
    "termType": "SEMESTER",
    "minPassingGrade": 4.0,
    "minGrade": 1.0,
    "maxGrade": 7.0,
    "gradeScalePrecision": 1,
    "primaryColor": "#1e3a8a",
    "requireAttendanceNote": false,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

---

### 4.2 Actualizar Configuración Institucional (`PATCH /api/schools/[schoolId]/settings`)
Modifica los parámetros académicos del colegio. Genera automáticamente un registro en `AuditLog`.

- **Autenticación requerida:** Sesión activa perteneciente al colegio.
- **Permiso requerido:** `SCHOOL_SETTINGS_UPDATE` (exclusivo para Director / Administrador Escolar).
- **Validación Zod (`schoolSettingsSchema`):**
  - `termType`: `"SEMESTER"` | `"TRIMESTER"` | `"BIMESTER"` | `"ANNUAL"`.
  - `minPassingGrade`: Numérico (típicamente entre 1.0 y 7.0).
  - `minGrade` y `maxGrade`: Números válidos donde `minGrade < maxGrade`.
  - `gradeScalePrecision`: Número entero entre 0 y 2.
  - `primaryColor`: Cadena hexadecimal válida (ej: `"#1e3a8a"`).

#### Solicitud (Request):
```http
PATCH /api/schools/school-csj-001/settings HTTP/1.1
Content-Type: application/json
Cookie: aurenis_session=<token_director>

{
  "termType": "TRIMESTER",
  "minPassingGrade": 4.0,
  "primaryColor": "#0284c7"
}
```

#### Respuestas:

##### `200 OK` — Configuración Actualizada
```json
{
  "success": true,
  "settings": {
    "id": "settings-csj-001",
    "schoolId": "school-csj-001",
    "termType": "TRIMESTER",
    "minPassingGrade": 4.0,
    "minGrade": 1.0,
    "maxGrade": 7.0,
    "gradeScalePrecision": 1,
    "primaryColor": "#0284c7",
    "requireAttendanceNote": false,
    "updatedAt": "2026-09-10T14:30:00.000Z"
  }
}
```

##### `403 Forbidden` — Usuario sin Permiso (ej. Estudiante o Docente)
```json
{
  "error": "Acceso denegado. Permisos insuficientes para modificar ajustes institucionales."
}
```

---

## 5. Resumen de Respuestas y Códigos de Estado

| Código | Significado | Causa Habitual en Aurenis |
| :---: | :--- | :--- |
| **`200`** | `OK` | Operación exitosa (lectura o actualización). |
| **`201`** | `Created` | Creación exitosa de un recurso (ej: nuevo colegio). |
| **`400`** | `Bad Request` | Falla de validación en esquema Zod (campos obligatorios o formatos inválidos). |
| **`401`** | `Unauthorized` | Token ausente, firma adulterada o expirada. |
| **`403`** | `Forbidden` | El rol no posee el permiso RBAC necesario para la operación o violación de tenant. |
| **`404`** | `Not Found` | El colegio o recurso solicitado no existe. |
| **`500`** | `Internal Server Error` | Excepción no controlada en el backend. |
