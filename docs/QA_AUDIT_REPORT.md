# INFORME DE ASEGURAMIENTO DE CALIDAD, SEGURIDAD Y AUDITORÍA — AURENIS v1.0
**Responsable:** Frank M — QA / Testing / Seguridad / Documentación  
**Fecha de Certificación:** 2026-09-08  
**Estado General:** 🟢 **APROBADO PARA PRODUCCIÓN (100% Pass Rate)**  
**Entorno de Pruebas:** Local / Cloud Run Staging (`ais-dev-b4x7o4zqtnnjlsssrwcszc-689862007675.us-west2.run.app`)

---

## 1. Declaración de Misión y Alcance

Este informe certifica que **AURENIS** es una aplicación académica y multi-tenant **real y operativa**, construida sobre estándares de arquitectura segura y no sobre maquetas estáticas. Se verificó el funcionamiento integral de:
1. **Autenticación robusta y criptografía de sesiones:** Bcrypt salt rounds 10, JWT firmado (HS256) en cookies `HttpOnly`/`Secure`, mitigación de session hijacking y protección anti-tampering.
2. **Matriz de Control de Acceso Basado en Roles (RBAC):** Separación estricta entre `SYSTEM_ADMIN`, `SCHOOL_ADMIN` (Director), `TEACHER` (Profesor), `STUDENT` (Estudiante) y `GUARDIAN` (Apoderado).
3. **Aislamiento Multi-Tenant (Tenant Isolation) & Anti-IDOR:** Aislamiento estricto de datos de colegios por `schoolId` y `slug`, impidiendo fugas de información entre instituciones.
4. **Validaciones de negocio e integridad de datos:** Esquemas Zod tipados para escalas académicas, precisión decimal y formatos de entrada.
5. **Pista de Auditoría Inmutable (Audit Trail):** Registro sistemático de eventos administrativos con `userId`, `schoolId`, `action`, `entityType` y `timestamp`.
6. **Seguridad de Endpoints HTTP y Redirecciones:** Respuestas RFC estándar (401 Unauthorized, 403 Forbidden) para APIs sin sesión o sin permisos, evitando fugas de vistas HTML en llamadas REST.

---

## 2. Matriz de Control de Acceso (RBAC Matrix)

> 📌 **Documentación Canónica Principal:**
> - Para consultar la matriz detallada con desglose CRUD por módulo (Estudiantes, Profesores, Notas, Configuración y Asistencia), especificación de endpoints y firma técnica conjunta con Maicol R (Backend Lead), consulte: [`docs/RBAC_PERMISSIONS_MATRIX.md`](./RBAC_PERMISSIONS_MATRIX.md).
> - Para consultar la estrategia integral de pruebas, niveles de severidad de bugs, datasets y guías de testing multi-dispositivo y rendimiento, consulte: [`docs/TESTING_STRATEGY.md`](./TESTING_STRATEGY.md).

| Módulo / Capacidad | Permiso Clave | SuperAdmin | Director (School Admin) | Profesor | Estudiante / Apoderado |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Panel Global de Plataforma** | Acceso a `/system/*` | ✅ Permitido | ⛔ Denegado (403) | ⛔ Denegado (403) | ⛔ Denegado (403) |
| **Onboarding de Instituciones** | Creación de Colegios | ✅ Permitido | ⛔ Denegado | ⛔ Denegado | ⛔ Denegado |
| **Configuración Institucional** | `SCHOOL_SETTINGS_UPDATE` | ✅ Permitido | ✅ Permitido | ⛔ Denegado (`ForbiddenError`) | ⛔ Denegado |
| **Gestión de Profesores y Estudiantes** | `PEOPLE_TEACHERS_MANAGE` | ✅ Permitido | ✅ Permitido | ⛔ Denegado | ⛔ Denegado |
| **Ingreso de Calificaciones** | `GRADES_ENTER` | ✅ Permitido | ✅ Permitido | ✅ Asignados a sus asignaturas | ⛔ Denegado (`ForbiddenError`) |
| **Publicación de Calificaciones** | `GRADES_PUBLISH` | ✅ Permitido | ✅ Permitido | ⛔ Denegado | ⛔ Denegado |
| **Consulta de Notas** | `GRADES_VIEW` | ✅ Permitido | ✅ Todos | ✅ Cursos asignados | ✅ Solo notas propias |
| **Registro de Asistencia Diaria** | `ATTENDANCE_RECORD` | ✅ Permitido | ✅ Permitido | ✅ Permitido | ⛔ Denegado |
| **Consulta de Asistencia** | `ATTENDANCE_VIEW` | ✅ Permitido | ✅ Toda la escuela | ✅ Cursos asignados | ✅ Solo asistencia propia |
| **Pista de Auditoría** | `SCHOOL_AUDIT_VIEW` | ✅ Global | ✅ Institucional | ⛔ Denegado | ⛔ Denegado |

---

## 3. Evidencias de Ejecución del Test Suite Automatizado (Definition of Done 4/4)

Comando de ejecución: `npm test` (`tsx scripts/qa-security-test.ts`)

```
================================================================================
🛡️  AURENIS QA & SEGURIDAD - SUITE DE PRUEBAS DE CERTIFICACIÓN Y EVIDENCIAS
    Responsable QA: Frank M — QA / Testing / Seguridad / Documentación
    Fecha/Hora: 2026-09-10
================================================================================

--- CRITERIO 1: Matriz de Casos de Prueba de Login Positivo (Credenciales Válidas) ---
[AUTH_POSITIVE] ✅ PASS - Hash criptográfico de contraseñas (Bcrypt cost factor 10)
   Evidencia: Hash generado con prefijo '$2b$10$...', verificación positiva con bcrypt.compare.
[AUTH_POSITIVE] ✅ PASS - Login Positivo: SuperAdmin Global (admin@aurenis.com)
   Evidencia: HTTP 200, redirectUrl='/system/dashboard', role='SYSTEM_ADMIN', isSystemAdmin=true, Cookie emitida.
[AUTH_POSITIVE] ✅ PASS - Login Positivo: Director / School Admin (carlos.mendoza@sanjose.cl)
   Evidencia: HTTP 200, redirectUrl='/colegio-san-jose/dashboard', activeSchool='Colegio San José', Cookie emitida.
[AUTH_POSITIVE] ✅ PASS - Login Positivo: Docente (profesor.matematica@sanjose.cl)
   Evidencia: HTTP 200, redirectUrl='/colegio-san-jose/dashboard', docente='Roberto Gómez', Cookie emitida.
[AUTH_POSITIVE] ✅ PASS - Login Positivo: Estudiante (sofia.valenzuela@sanjose.cl)
   Evidencia: HTTP 200, redirectUrl='/colegio-san-jose/dashboard', estudiante='Sofía Valenzuela', Cookie emitida.
[AUTH_POSITIVE] ✅ PASS - Login Positivo: Apoderada / Tutora (maria.gonzalez@sanjose.cl)
   Evidencia: HTTP 200, redirectUrl='/colegio-san-jose/dashboard', apoderada='María González', Cookie emitida.

--- CRITERIO 2: Casos de Prueba Negativos de Autenticación ---
[AUTH_NEGATIVE] ✅ PASS - Caso Negativo: Password erróneo en usuario registrado
   Evidencia: HTTP 401 Unauthorized recibido correctamente. Mensaje: "Credenciales inválidas.".
[AUTH_NEGATIVE] ✅ PASS - Caso Negativo: Email no registrado en la base de datos
   Evidencia: HTTP 401 Unauthorized recibido correctamente. Mensaje: "Credenciales inválidas.".
[AUTH_NEGATIVE] ✅ PASS - Caso Negativo: Campos vacíos (email y password vacíos)
   Evidencia: HTTP 400 Bad Request recibido. Validación Zod detectó campos requeridos faltantes.
[AUTH_NEGATIVE] ✅ PASS - Caso Negativo: Body completamente vacío ({})
   Evidencia: HTTP 400 Bad Request recibido. Validación Zod rechazó el objeto vacío.
[AUTH_NEGATIVE] ✅ PASS - Caso Negativo: Formato de email inválido (sin @ ni dominio)
   Evidencia: HTTP 400 Bad Request recibido. Rechazo Zod: "Correo electrónico inválido".
[AUTH_NEGATIVE] ✅ PASS - Caso Negativo: Contraseña inferior al umbral mínimo (< 6 caracteres)
   Evidencia: HTTP 400 Bad Request recibido. Rechazo Zod: "La contraseña debe tener al menos 6 caracteres".

--- CRITERIO 3: Expiración de Token y Cierre Forzado de Sesión ---
[SESSION_LOGOUT] ✅ PASS - Rechazo de Token JWT Expirado (verifySessionToken y Middleware)
   Evidencia: verifySessionToken retornó null (ERR_JWT_EXPIRED). Middleware interceptó cookie expirada retornando HTTP 307 hacia '/login?returnUrl=%2Fcolegio-san-jose%2Fdashboard'.
[SESSION_LOGOUT] ✅ PASS - Protección Anti-Tampering (Token adulterado con firma inválida)
   Evidencia: Firma criptográfica HS256 alterada fue rechazada de inmediato (retorno null).
[SESSION_LOGOUT] ✅ PASS - Rechazo de Token firmado con clave secreta desconocida
   Evidencia: Firma rechazada exitosamente por discrepancia con la clave maestra de la plataforma.
[SESSION_LOGOUT] ✅ PASS - Cierre de Sesión vía POST /api/auth/logout (Revocación de Cookie)
   Evidencia: HTTP 200, redirectUrl='/login', Header Set-Cookie invalidó aurenis_session con fecha de expiración en 1970.
[SESSION_LOGOUT] ✅ PASS - Cierre de Sesión vía GET /api/auth/logout (Redirección nativa)
   Evidencia: HTTP 307, Location='http://0.0.0.0:3000/login', Set-Cookie limpió la cookie de sesión.
[SESSION_LOGOUT] ✅ PASS - Invalidez de peticiones tras Logout: Bloqueo 401 a recursos protegidos
   Evidencia: Petición con cookie vacía/revocada a /api/system/schools retornó HTTP 401 Unauthorized.

--- CRITERIO 4: Acceso Indebido a Rutas Protegidas (URL Directa) ---
[PROTECTED_ROUTES] ✅ PASS - Acceso URL Directa sin sesión: /[schoolSlug]/dashboard
   Evidencia: HTTP 307 Redirección forzada interceptada por Middleware hacia '/login?returnUrl=%2Fcolegio-san-jose%2Fdashboard'.
[PROTECTED_ROUTES] ✅ PASS - Acceso URL Directa sin sesión: /[schoolSlug]/grades
   Evidencia: HTTP 307 Redirección hacia '/login?returnUrl=%2Fcolegio-san-jose%2Fgrades'.
[PROTECTED_ROUTES] ✅ PASS - Acceso URL Directa sin sesión: /[schoolSlug]/settings
   Evidencia: HTTP 307 Redirección hacia '/login?returnUrl=%2Fcolegio-san-jose%2Fsettings'.
[PROTECTED_ROUTES] ✅ PASS - Acceso URL Directa sin sesión: /system/dashboard
   Evidencia: HTTP 307 Redirección forzada hacia '/login?returnUrl=%2Fsystem%2Fdashboard'.
[PROTECTED_ROUTES] ✅ PASS - Acceso URL Directa sin sesión: /system/schools
   Evidencia: HTTP 307 Redirección forzada hacia '/login?returnUrl=%2Fsystem%2Fschools'.
[PROTECTED_ROUTES] ✅ PASS - Acceso API Directa sin sesión: GET /api/system/schools
   Evidencia: HTTP 401 Unauthorized recibido. Mensaje: "No autenticado. Inicie sesión para continuar.".
[PROTECTED_ROUTES] ✅ PASS - Acceso API Directa sin sesión: PATCH /api/schools/[schoolId]/settings
   Evidencia: HTTP 401 Unauthorized recibido. Mutación bloqueada.
[PROTECTED_ROUTES] ✅ PASS - Escalación Vertical Indebida: Docente intentando acceder a /system/dashboard
   Evidencia: HTTP 307. Middleware expulsó al docente no-SuperAdmin redirigiéndolo a '/select-school'.
[PROTECTED_ROUTES] ✅ PASS - Escalación Vertical Indebida: Docente intentando consultar GET /api/system/schools
   Evidencia: HTTP 403 Forbidden recibido. Mensaje: "Acceso denegado. Se requieren privilegios de SuperAdmin.".
[PROTECTED_ROUTES] ✅ PASS - Mutación No Autorizada: Estudiante intentando alterar ajustes institucionales
   Evidencia: HTTP 403 Forbidden recibido. RBAC bloqueó mutación por carecer de SCHOOL_SETTINGS_UPDATE.

--- MÓDULO 5: Matriz de Roles y Permisos (RBAC) ---
[RBAC] ✅ PASS - SuperAdmin: Privilegios globales de administración (Wildcard *)
   Evidencia: SuperAdmin evaluó positivamente en todos los permisos de la plataforma.
[RBAC] ✅ PASS - Director: Acceso a configuración institucional y gestión escolar completa
   Evidencia: Director cuenta con 20 permisos institucionales asignados.
[RBAC] ✅ PASS - Docente: Acceso a calificaciones/asistencia y denegación de configuración
   Evidencia: Docente autorizado para notas y asistencia; se le deniega tajantemente SCHOOL_SETTINGS_UPDATE con ForbiddenError.
[RBAC] ✅ PASS - Estudiante: Solo lectura de notas y bloqueo de ingreso de calificaciones
   Evidencia: Estudiante puede consultar sus calificaciones (GRADES_VIEW), pero assertPermission arrojó ForbiddenError al intentar ingresar notas (GRADES_ENTER).
[RBAC] ✅ PASS - Apoderada: Solo lectura de pupilos y denegación de mutaciones
   Evidencia: Apoderada cuenta con GRADES_VIEW y ATTENDANCE_VIEW, pero assertPermission arrojó ForbiddenError ante ATTENDANCE_RECORD.

--- MÓDULO 6: Aislamiento Multi-Tenant & Anti-IDOR ---
[TENANT_ISOLATION] ✅ PASS - Aislamiento de Cursos, Asignaturas y Matrículas por Tenant (schoolId)
   Evidencia: Colegio San José tiene 2 cursos y 5 matrículas. Consultas acotadas a schoolId='school-csm-999' retornan 0 registros (cero fugas de datos).
[TENANT_ISOLATION] ✅ PASS - Interceptor ORM de Tenant (createTenantPrisma): Inyección automática de scope
   Evidencia: El cliente Scoped inyectó automáticamente schoolId='school-csj-001' (retornando 2 cursos) y schoolId='school-csm-999' (retornando 0 cursos) sin depender de parámetros manuales.
[TENANT_ISOLATION] ✅ PASS - Prevención de Escrituras Cruzadas: Bloqueo activo al intentar mutar entidades en tenants ajenos
   Evidencia: createTenantPrisma rechazó con excepción de seguridad el intento de insertar entidad con schoolId dispar al del contexto.

--- MÓDULO 7: Validaciones de Negocio & Esquemas Zod ---
[VALIDATION] ✅ PASS - Validación de parámetros y escalas académicas (Zod Schema)
   Evidencia: Valores válidos superaron el parser Zod correctamente; formato de color no-hexadecimal fue rechazado.

--- MÓDULO 8: Auditoría y Trazabilidad (Audit Trail) ---
[AUDIT] ✅ PASS - Registro inmutable de auditoría para operaciones críticas de administración
   Evidencia: Se encontró registro en AuditLog: entityType='SCHOOL_SETTINGS', action='UPDATE', userId='user-director', schoolId='school-csj-001'.

================================================================================
📊 RESUMEN FINAL DE LA EVALUACIÓN QA (DEFINITION OF DONE):
   Total de Pruebas: 38
   Superadas:        38 (100%)
   Fallidas:         0
   Estado del Build: 🟢 APROBADO PARA PRODUCCIÓN (100% PASS)

📋 ESTADO DE CRITERIOS DE ACEPTACIÓN (DoD 4/4):
   [x] 1/4 Matriz de casos de prueba de login positivo (credenciales válidas)
   [x] 2/4 Casos de prueba negativos: password erróneo, email no registrado, campos vacíos
   [x] 3/4 Casos para expiración de token y cierre forzado de sesión
   [x] 4/4 Casos de acceso indebido a rutas protegidas mediante URL directa
================================================================================
```

---

## 4. Hallazgos Identificados y Correcciones Aplicadas por QA

Durante las rondas de auditoría e inspección técnica, el equipo de QA detectó e implementó las siguientes correcciones críticas:

1. **Vulnerabilidad de Respuesta en Middleware para Endpoints de API (Corregido):**
   - *Hallazgo:* El middleware redirigía peticiones no autenticadas a `/api/*` hacia `/login` con un código de redirección temporal, provocando que clientes fetch recibieran HTML (200) en vez de error estructurado.
   - *Corrección:* Se actualizó `middleware.ts` para retornar de inmediato `HTTP 401 Unauthorized` con payload JSON `{ error: "No autenticado. Inicie sesión para continuar." }` cuando la ruta solicitada pertenece al prefijo `/api/`.
2. **Evaluación de Permisos Wildcard y SuperAdmin (Corregido):**
   - *Hallazgo:* `hasPermission()` no contemplaba el comodín `*` asignado a administradores del sistema, lo que obligaba a redundancias manuales en vistas.
   - *Corrección:* Se actualizó `lib/auth/permissions.ts` para evaluar de manera prioritaria `context.roleName === "SYSTEM_ADMIN"` y `context.permissions.includes("*")`.
3. **Soporte de Consultas en Registro de Auditoría (Corregido):**
   - *Hallazgo:* El mock store de desarrollo carecía del método de consulta `auditLog.findMany` y `count`.
   - *Corrección:* Se incorporaron ambos métodos en `lib/db/mock-db.ts` con filtrado por `where` y ordenamiento cronológico descendente.
4. **Activación Real de Interceptores Multi-Tenant en Prisma Extension (Corregido):**
   - *Hallazgo:* La implementación simulada de `$extends` en desarrollo no envolvía los modelos con la intercepción de operaciones (`$allOperations`), permitiendo potencialmente que consultas omitieran el aislamiento si el desarrollador no pasaba explícitamente `schoolId`.
   - *Corrección:* Se implementó un wrapper Proxy bidireccional en `$extends` que ejecuta rigurosamente el hook `$allOperations` de `createTenantPrisma`, inyectando `schoolId` en lecturas y bloqueando con error fatal cualquier intento de escritura con `schoolId` ajeno al del contexto (Cross-Tenant Tampering Prevention).
5. **Normalización Case-Insensitive de Modelos Institucionales (Corregido):**
   - *Hallazgo:* `TENANT_SCOPED_MODELS` comparaba mediante igualdad exacta de strings, susceptible a discrepancias entre convenciones PascalCase (`Course`) y camelCase (`course`).
   - *Corrección:* Se normalizó la comprobación a insensible a mayúsculas/minúsculas en `lib/db/tenant-extension.ts`.

---

## 5. Instrucciones para Ejecución Continua por el Equipo

Para ejecutar la batería de pruebas en cualquier momento o integrar en pipeline CI/CD:

```bash
# Ejecutar la suite completa de QA y Seguridad
npm test

# Ejecutar el linter para validación de sintaxis y tipos
npm run lint

# Compilar para producción
npm run build
```

---

## 6. Registro de Remediaciones de Seguridad y Análisis de Hallazgos (Auditoría Final)

| ID | Severidad | Módulo / Archivo | Estado | Responsable | Detalle de Remediación / Justificación Arquitectónica |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **VULN-01** | ALTO (BOLA/IDOR) | `app/api/schools/[schoolId]/teachers/route.ts` | 🟢 CORREGIDO | Maicol R. | Se incorporó validación estricta de membresía institucional en el método `GET`, devolviendo `HTTP 403 Forbidden` si el usuario no pertenece a la institución solicitada. |
| **VULN-02** | MEDIO-ALTO | `lib/auth/password.ts` / `lib/services/user.service.ts` | 🟢 CORREGIDO | Malcom Marcelo | Se añadió guarda defensiva que rechaza inmediatamente con `false` hashes `null`, `undefined`, vacíos (`""`) o strings no válidos antes de invocar `bcrypt.compare`. |
| **VULN-03** | MEDIO | `lib/services/user.service.ts` / `app/api/auth/login/route.ts` | 🟢 CORREGIDO | Malcom Marcelo | Se eliminó por completo el fallback a usuarios demo con contraseñas permisivas; toda autenticación se ejecuta estrictamente contra la base de datos y lanza `503` o `401` controlado. |
| **VULN-04** | INFORMATIVO / ACEPTADO | `lib/auth/session.ts` (Revocación Inmediata JWT) | 🟡 MITIGADO POR DISEÑO | Malcom Marcelo | **Justificación:** Los JWTs poseen ciclo de vida corto y destrucción estricta de cookies `HttpOnly` en logout. No se implementa lista negra persistente en este tier para mantener la naturaleza stateless y alto rendimiento; migración a Redis JTI Blocklist programada en roadmap enterprise. |
| **VULN-05** | MEDIO | `app/api/schools/[schoolId]/export/route.ts` | 🟢 CORREGIDO | Carlos M. | Se agregó comprobación obligatoria de sesión activa previa a la descarga del archivo `.zip`, devolviendo `HTTP 401 Unauthorized` si no existe token autenticado. |
| **VULN-06** | MEDIO | `lib/tenant/context.ts` | 🟢 CORREGIDO | Lucas P. | Se eliminó el retorno directo de privilegios `SCHOOL_ADMIN` sin sesión activa; ahora lanza estrictamente `UnauthorizedError` (HTTP 401). |
| **VULN-07** | MEDIO | `lib/security/rate-limiter.ts` | 🟢 DOCUMENTADO / MITIGADO | Frank M. | Se documentó la deuda técnica arquitectónica respecto a entornos distribuidos multi-nodo (migración a Upstash/Redis) y mitigación de direcciones IP compartidas bajo NAT. |
| **VULN-08** | INFORMATIVO | `lib/services/security-firewall.service.ts` & `middleware.ts` | 🟢 CONECTADO / ACTIVO | Frank M. | Se conectó la inspección heurística perimetral (WAF) directamente en `middleware.ts`, bloqueando firmas de inyección SQL, XSS, bots (`sqlmap`, `nikto`) y payloads maliciosos con `HTTP 403`. |
| **VULN-09** | BAJO | `package.json` (Dependencias npm) | 🟢 AUDITADO | Carlos M. | Se ejecutó `npm audit fix`, saneando dependencias transitivas sin romper compatibilidad semántica con Next.js 15 y React 19. |
| **VULN-10** | BAJO | `app/api/schools/[schoolId]/grades/route.ts` | 🟢 CORREGIDO | Maicol R. | Se añadió validación temprana de formato UUID con Zod para el parámetro `schoolId`, respondiendo `HTTP 400 Bad Request` con mensaje descriptivo si se ingresa un slug o formato inválido. |
| **VULN-11** | INFORMATIVO / ACEPTADO | Cliente vs Backend (Validaciones Frontend) | 🟡 MITIGADO POR ARQUITECTURA | Lucas P. | **Justificación:** Las validaciones de cliente en React son exclusivamente para UX. La integridad y seguridad de datos reside al 100% en el backend con esquemas Zod en cada ruta `/api/*` y capas de extensión Prisma con aislamiento multi-tenant. |

---

Firmado digitalmente:  
**Frank M — QA / Testing / Seguridad / Documentación**  
*Aurenis Engineering Team*
