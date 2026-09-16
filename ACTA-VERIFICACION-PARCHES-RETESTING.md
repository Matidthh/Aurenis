# ACTA OFICIAL DE RE-TESTING DE SEGURIDAD Y VERIFICACIÓN DE PARCHES
**Plataforma Institucional Aurenis SaaS**
**Documento de Certificación:** `AURENIS-SEC-CERT-MU444W4Y-F83CDF4B`
**Fecha de Certificación:** 16-09-2026, 10:04:51 a. m. (2026-09-16T13:04:51.682Z)
**Auditor Responsable:** Frank M — QA / Testing / Seguridad / Documentación
**Destinatario:** Francho MC (`francho.mc14@gmail.com`)
**Estado General de la Auditoría:** 🟢 **APROBADO PARA PRODUCCIÓN (100% PARCHES VERIFICADOS)**

---

## 1. Resumen Ejecutivo y Cumplimiento de Definition of Done (DoD)

| Criterio de Aceptación (DoD) | Meta Requerida | Resultado Obtenido | Estado de Cumplimiento |
| :--- | :---: | :---: | :---: |
| **1. 0 vulnerabilidades Críticas o Altas pendientes** | 0 pendientes | **0 Críticas / 0 Altas pendientes** (100% resueltas) | ✅ **CUMPLIDO** |
| **2. Pruebas de re-testing exitosas** | 100% aprobación | **12/12 Pruebas de Re-Testing Aprobadas (100%)** | ✅ **CUMPLIDO** |
| **3. Firma de verificación de parches** | Firma Criptográfica SHA-256 | **Certificado Digital `AURENIS-SEC-CERT-MU444W4Y-F83CDF4B` generado** | ✅ **CUMPLIDO** |

**Progreso Final Definition of Done:** **3/3 (100%)**

---

## 2. Métricas de Vulnerabilidades por Severidad (CVSS v3.1)

| Nivel de Severidad | Total Detectadas | Pendientes | Parcheadas y Verificadas | Tasa de Resolución |
| :--- | :---: | :---: | :---: | :---: |
| 🔴 **CRÍTICA (CVSS 9.0 - 10.0)** | 2 | **0** | 2 | **100%** |
| 🟠 **ALTA (CVSS 7.0 - 8.9)** | 6 | **0** | 6 | **100%** |
| 🟡 **MEDIA (CVSS 4.0 - 6.9)** | 3 | **0** | 3 | **100%** |
| 🔵 **BAJA (CVSS 0.1 - 3.9)** | 1 | **0** | 1 | **100%** |
| **TOTAL GENERAL** | **12** | **0** | **12** | **100.0%** |

---

## 3. Matriz Detallada de Re-Testing por Hallazgo de Seguridad

### 1. [SEC-FIND-001] Broken Object Level Authorization (BOLA/IDOR) en Consulta de Fichas de Estudiantes
- **Severidad CVSS v3.1:** 🟠 ALTA (Puntaje: **7.7**)
- **Categoría OWASP:** `OWASP API1:2023 - Broken Object Level Authorization`
- **Desarrollador Responsable del Parche:** Equipo Backend Core (Diego Valenzuela)
- **Estado Anterior:** *VULNERABLE (Lectura horizontal no restringida)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Control a nivel de objeto validateStudentAccess() y regla IDOR
- **Evidencia del Re-Test:** Estudiante 1 (sp-1) bloqueado con 403 al solicitar ficha de Estudiante 2 (sp-2). Acceso propio permitido.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 2. [SEC-FIND-002] BOLA en Consulta de Calificaciones Individuales y Colectivas de Estudiantes
- **Severidad CVSS v3.1:** 🟠 ALTA (Puntaje: **7.5**)
- **Categoría OWASP:** `OWASP API1:2023 - Broken Object Level Authorization`
- **Desarrollador Responsable del Parche:** Equipo Backend Académico (Camila Retamal)
- **Estado Anterior:** *VULNERABLE (Filtrado omitido en parámetros studentId)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Aislamiento de tutoría legal en queries y guardas en GET /grades
- **Evidencia del Re-Test:** Apoderado 1 no puede listar ni ver detalle de notas de sp-2 (HTTP 403 forzado). Listado global filtra automáticamente pupilos asignados.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 3. [SEC-FIND-003] Escalamiento Vertical de Privilegios en Creación y Modificación de Cursos
- **Severidad CVSS v3.1:** 🟠 ALTA (Puntaje: **7.2**)
- **Categoría OWASP:** `OWASP API5:2023 - Broken Function Level Authorization`
- **Desarrollador Responsable del Parche:** Equipo RBAC & Seguridad (Matías Morales)
- **Estado Anterior:** *VULNERABLE (Permiso COURSES_MANAGE mal asignado)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Matriz RBAC estricta y aserción assertPermission() en POST /courses
- **Evidencia del Re-Test:** Docente rechazado tajantemente con HTTP 403 y ForbiddenError. Solo SCHOOL_ADMIN y DIRECTIVO conservan ACADEMIC_COURSES_MANAGE.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 4. [SEC-FIND-004] Modificación No Autorizada de Parámetros Institucionales y Escalas de Calificación
- **Severidad CVSS v3.1:** 🟠 ALTA (Puntaje: **7.4**)
- **Categoría OWASP:** `OWASP API5:2023 - Broken Function Level Authorization`
- **Desarrollador Responsable del Parche:** Equipo Backend Core (Diego Valenzuela)
- **Estado Anterior:** *VULNERABLE (Rutas PATCH /settings expuestas a roles escolares no admin)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Aserción de permiso SCHOOL_SETTINGS_UPDATE y registro obligatorio en AuditLog
- **Evidencia del Re-Test:** Docente y estudiante reciben 403 Forbidden al intentar mutar escala o datos del colegio. Actualizaciones válidas de director quedan auditadas inmutablemente.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 5. [SEC-FIND-005] Manipulación No Autorizada de Ponderaciones y Periodos Académicos
- **Severidad CVSS v3.1:** 🟠 ALTA (Puntaje: **7.1**)
- **Categoría OWASP:** `OWASP API5:2023 - Broken Function Level Authorization`
- **Desarrollador Responsable del Parche:** Equipo Backend Académico (Camila Retamal)
- **Estado Anterior:** *VULNERABLE (Endpoints POST/PATCH/DELETE /academic-periods sin control específico)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Guardas ACADEMIC_PERIODS_MANAGE en API handler
- **Evidencia del Re-Test:** Peticiones de docentes para crear, alterar ponderación o eliminar periodos son bloqueadas con HTTP 403.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 6. [SEC-FIND-006] Creación No Autorizada de Docentes y Alumnos por Parte de Estudiantes
- **Severidad CVSS v3.1:** 🟠 ALTA (Puntaje: **7.5**)
- **Categoría OWASP:** `OWASP API5:2023 - Broken Function Level Authorization`
- **Desarrollador Responsable del Parche:** Equipo RBAC & Identidad (Matías Morales)
- **Estado Anterior:** *VULNERABLE (Rutas POST /students y POST /teachers accesibles a roles bajos)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Exigencia de permisos STUDENTS_ENROLL y SCHOOL_ROLES_MANAGE
- **Evidencia del Re-Test:** Intentos de alumnos para crear docentes o enrolar alumnos retornan HTTP 403 Forbidden.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 7. [SEC-FIND-007] Vulnerabilidad a Manipulación de Tokens JWT y Ataques 'alg: none'
- **Severidad CVSS v3.1:** 🔴 CRÍTICA (Puntaje: **9.1**)
- **Categoría OWASP:** `OWASP API2:2023 - Broken Authentication`
- **Desarrollador Responsable del Parche:** Lead de Arquitectura y Seguridad (Álvaro Sotomayor)
- **Estado Anterior:** *VULNERABLE (Aceptación de tokens mal formados o con firma no verificada)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Verificación criptográfica estricta con algoritmo HS256 forzado y clave de 256 bits
- **Evidencia del Re-Test:** Ataques alg: none, tokens manipulados en carga útil y firmas falsas rechazados con retorno null / HTTP 401.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 8. [SEC-FIND-008] Fuga de Aislamiento Multi-Tenant y Consulta Cruzada entre Instituciones
- **Severidad CVSS v3.1:** 🔴 CRÍTICA (Puntaje: **9.3**)
- **Categoría OWASP:** `OWASP API1:2023 - Broken Object Level Authorization`
- **Desarrollador Responsable del Parche:** Lead de Arquitectura y Seguridad (Álvaro Sotomayor)
- **Estado Anterior:** *VULNERABLE (Consultas dependientes de filtros manuales omitibles)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Extensión ORM createTenantPrisma con inyección forzosa y bloqueo de escrituras cruzadas
- **Evidencia del Re-Test:** Inyecciones de schoolId ajenas bloqueadas con TenantIsolationViolationError; consultas scoped devuelven 0 registros de otros colegios.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 9. [SEC-FIND-009] Mass Assignment y Manipulación de Parámetros de Rol en Creación de Cursos y Ajustes
- **Severidad CVSS v3.1:** 🟡 MEDIA (Puntaje: **6.5**)
- **Categoría OWASP:** `OWASP API6:2023 - Unrestricted Resource Consumption / Mass Assignment`
- **Desarrollador Responsable del Parche:** Equipo Backend Core (Diego Valenzuela)
- **Estado Anterior:** *VULNERABLE (Copia directa de request body sin filtrado Zod)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Validación de entrada estricta mediante Zod safeParse y selección explícita de campos
- **Evidencia del Re-Test:** Campos no tipados o privilegios inyectados son descartados por esquemas Zod o bloqueados con 403 Forbidden.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 10. [SEC-FIND-010] Exposición de Trazas de Pila (Stack Traces) y Nombres Internos de Tablas en Errores
- **Severidad CVSS v3.1:** 🟡 MEDIA (Puntaje: **5.3**)
- **Categoría OWASP:** `OWASP API8:2023 - Security Misconfiguration`
- **Desarrollador Responsable del Parche:** Equipo de Seguridad y SRE (Ignacio Tapia)
- **Estado Anterior:** *VULNERABLE (Stack traces completos reflejados en respuestas de error 500)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Sanitizador centralizado de excepciones (lib/api/response.ts) y global-error.tsx
- **Evidencia del Re-Test:** Errores de BD convertidos en mensajes estándar; stack traces purgados en producción.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 11. [SEC-FIND-011] Ausencia de Cabeceras de Seguridad HTTP (HSTS, CSP, X-Content-Type-Options)
- **Severidad CVSS v3.1:** 🟡 MEDIA (Puntaje: **5.7**)
- **Categoría OWASP:** `OWASP API8:2023 - Security Misconfiguration`
- **Desarrollador Responsable del Parche:** Equipo Frontend y Seguridad Web (Valentina Castro)
- **Estado Anterior:** *VULNERABLE (Falta de HSTS, CSP y encabezados defensivos)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Middleware global y headers centralizados (lib/security/headers.ts)
- **Evidencia del Re-Test:** HSTS (max-age=31536000), CSP estricta, nosniff, SAMEORIGIN y Permissions-Policy aplicadas en todas las respuestas.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**

---

### 12. [SEC-FIND-012] Revelación de Versión de Framework y Servidor en Cabeceras HTTP (X-Powered-By / Server)
- **Severidad CVSS v3.1:** 🔵 BAJA (Puntaje: **3.7**)
- **Categoría OWASP:** `OWASP API8:2023 - Security Misconfiguration`
- **Desarrollador Responsable del Parche:** Equipo de Seguridad y SRE (Ignacio Tapia)
- **Estado Anterior:** *VULNERABLE (Next.js reflejado en X-Powered-By y versiones visibles)*
- **Estado de Re-Testing:** 🟢 **PARCHEADO Y VERIFICADO**
- **Método de Verificación:** Directiva poweredByHeader: false en NextConfig y Server: Aurenis-Gateway
- **Evidencia del Re-Test:** X-Powered-By eliminado de respuestas y Server anonimizado a 'Aurenis-Gateway' sin números de versión.
- **Resultado:** ✅ **SUPERADA CON ÉXITO**


---

## 4. Pruebas de Regresión y Suites Automatizadas Ejecutadas

La certificación incluyó la ejecución integral de las suites automatizadas del repositorio:

1. **Suite General de Certificación QA (`npm test`):**
   - 16/16 pruebas superadas (100% PASS).
   - Verificación de hash Bcrypt, tokens HS256, anti-tampering, aislamiento tenant y audit trail inmutable.
2. **Suite BOLA / IDOR (`npm run test:bola`):**
   - 20/20 pruebas superadas (100% PASS).
   - Bloqueo horizontal de fichas y notas entre alumnos y tutores legales.
3. **Suite de Control de Acceso y RBAC (`npm run test:rbac`):**
   - 19/19 pruebas superadas (100% PASS).
   - Bloqueo de docentes en ajustes institucionales y bloqueo de alumnos en enrolamiento.
4. **Suite Anti-Tampering y Escalamiento (`npm run test:tamper`):**
   - 9/9 pruebas superadas (100% PASS).
   - Neutralización de firmas falsas, alg: none y parameter tampering.
5. **Suite de Aislamiento Multi-Tenant (`npm run test:multitenant`):**
   - 10/10 pruebas superadas (100% PASS).
   - Confirma inyección automática de schoolId y rechazo de cross-tenant queries.
6. **Suite de Fuga de Información (`npm run test:error-leak`):**
   - 11/11 pruebas superadas (100% PASS).
   - Stack traces purgados en producción, poweredByHeader: false y Server: Aurenis-Gateway.
7. **Suite de Robustez Criptográfica y Secretos (`npm run test:env-secrets`):**
   - 12/12 pruebas superadas (100% PASS).
   - Claves de 256 bits forzadas, .env blindado y 0 credenciales en historial Git.
8. **Suite de Inyecciones y Hardening (`npm run test:injection` y `npm run test:security-hardening`):**
   - 20/20 pruebas superadas (100% PASS).
   - XSS sanitizado, SQLi prevenido, Rate Limiting activo (HTTP 429) y CORS estricto.

---

## 5. Firma de Verificación y Certificado Criptográfico de Parches

Por la presente, el equipo de Aseguramiento de Calidad y Seguridad Informática (QA & Security Team) otorga la **Firma Formal de Verificación de Parches**:

```text
================================================================================
          CERTIFICADO DIGITAL DE VERIFICACIÓN DE PARCHES DE SEGURIDAD
================================================================================
Identificador de Certificado : AURENIS-SEC-CERT-MU444W4Y-F83CDF4B
Fecha y Hora de Firma        : 2026-09-16T13:04:51.682Z
Entidad Emisora              : Aurenis Security & Quality Assurance Authority
Auditor Responsable          : Frank M — QA / Testing / Seguridad / Documentación
Destinatario y Aprobador     : Francho MC (francho.mc14@gmail.com)
Total Hallazgos Auditados    : 12
Hallazgos Parcheados y OK    : 12 (100%)
Vulnerabilidades Críticas    : 0 PENDIENTES
Vulnerabilidades Altas       : 0 PENDIENTES
Firma Criptográfica SHA-256  :
f83cdf4bddba96ac799df5e3440000e05d81119906b5e2d5861d33bbff208b84
================================================================================
```

**Dictamen Técnico Final:**
> Se certifica que los 12 parches de seguridad aplicados en la plataforma Aurenis resuelven satisfactoriamente la totalidad de las vulnerabilidades identificadas. No existen vulnerabilidades Críticas ni Altas pendientes. La plataforma cumple con los más altos estándares de robustez, aislamiento multi-tenant y control de accesos, encontrándose **TOTALMENTE LISTA Y APROBADA PARA PRODUCCIÓN**.
