# 🛡️ POLÍTICA DE SEGURIDAD Y VULNERABILIDADES — AURENIS (SECURITY.md)

**Plataforma:** AURENIS — Sistema Integral de Gestión Escolar y Académica Multi-Tenant  
**Nivel de Madurez:** Enterprise Grade (OWASP ASVS 5.0, OWASP Top 10 2025, NIST SSDF SP 800-218)  
**Clasificación:** Pública / Operaciones y Seguridad de la Información  
**Última Auditoría:** Septiembre 2026  
**Responsables Técnicos:** Maicol R. (Arquitectura & Backend), Malcom Marcelo (Frontend), Lucas P. (UI/UX & Tokens), Frank M. (QA & Seguridad)

---

## 1. Política de Divulgación Responsable de Vulnerabilidades

En AURENIS la seguridad de las instituciones educativas, los datos de los estudiantes y la protección de Niños, Niñas y Adolescentes (NNA) constituyen la prioridad máxima. Si identificas una potencial vulnerabilidad de seguridad o un fallo en el aislamiento multi-tenant, te solicitamos contactar directamente a nuestro equipo de ciberseguridad antes de cualquier divulgación pública.

### 1.1 Canales de Reporte
- **Email de Seguridad:** `security@aurenis.internal` / `ciso@aurenis.cl`
- **PGP Key Fingerprint:** `8F3A 2B9C 4D1E 7F60 A5C8  1290 D4E3 B2A1 9F8E 7C6D`
- **Tiempo de Respuesta Inicial (SLA):** ≤ 12 horas.
- **Tiempo de Evaluación y Triaje:** ≤ 24 horas.
- **Tiempo de Parcheo en Producción:** ≤ 48 horas para vulnerabilidades críticas (CVSS ≥ 8.5).

---

## 2. Versiones Soportadas

| Versión | Estado de Soporte | Actualizaciones de Seguridad |
| :--- | :--- | :--- |
| **v1.0.x (Current)** | 🟢 Soportada activamente | Parches inmediatos y hotfixes |
| **v0.9.x (Beta)** | 🔴 Obsoleta | No soportada — Migrar a v1.0 |

---

## 3. Postura de Seguridad y Cumplimiento Normativo

AURENIS implementa una arquitectura de **Defensa en Profundidad (Defense in Depth)** y **Zero Trust Architecture (NIST SP 800-207)**:

1. **Protección de Datos de Menores:**
   - Cumplimiento estricto de la **Circular N° 482** de la Superintendencia de Educación.
   - Alineación con **Ley N° 19.628 / Ley N° 21.430** (Protección de los Derechos de la Niñez).
   - Encriptación de campos altamente sensibles (diagnósticos NEE, historial conductual, RUN/RUT) mediante AES-256-GCM.

2. **Alineación con Estándares Internacionales:**
   - **OWASP ASVS 5.0 (Application Security Verification Standard):** Nivel 2 y 3 en control de acceso, gestión de sesiones y sanitización de datos.
   - **OWASP Top 10 (2025):** Controles perimetrales e internos contra Broken Access Control, Cryptographic Failures, Injection, Insecure Design y Security Misconfiguration.
   - **NIST SSDF (Secure Software Development Framework - SP 800-218):** Prácticas de desarrollo seguro, validación estricta de dependencias (SCA/SBOM) y pruebas automatizadas de regresión de seguridad.

---

## 4. Controles Criptográficos y de Sesión

- **Firmado de Tokens:** Algoritmo **HS256** utilizando una clave maestra de al menos 256 bits (`process.env.JWT_SECRET`), validada al arranque del servidor.
- **Almacenamiento de Tokens:** Cookies seguras con flags `HttpOnly`, `Secure`, `SameSite=None/Lax`, `Path=/`, con rotación forzada y expiración máxima de 7 días.
- **Mecanismo Anti-Fixation:** Regeneración automática del identificador de token (`jti`) en cada inicio de sesión y revocación en lista negra distribuida (`session-revocation.ts`).
- **Hashing de Contraseñas:** `bcrypt` con factor de coste balanceado (cost factor 10) y salts criptográficamente aleatorios por usuario.

---

## 5. Prevención de Ataques BOLA/IDOR y Aislamiento Multi-Tenant

- **Verificación en Capa Perimetral (`middleware.ts`):** Inspección estricta de URLs de tenant (`/[schoolSlug]/*`, `/api/schools/:schoolId/*`) cruzada contra la sesión criptográfica del token. Bloqueo inmediato de solicitudes no coincidentes (Error 403 `TENANT_MISMATCH`).
- **Verificación en Capa de Datos (`object-authorization.ts` & Prisma ORM):**
  - Toda consulta (`findFirst`, `findMany`, `update`, `delete`) requiere explícitamente `schoolId` en la cláusula `where`.
  - Prohibido el uso de `findUnique` con solo el ID de entidad en contextos de tenant; se utiliza `findFirst` con `{ id, schoolId }` compuesto para garantizar aislamiento de datos a nivel de fila.

---

## 6. Cabeceras de Seguridad y Protección de Navegador

- **Content Security Policy (CSP):** `default-src 'self'`, scripts y estilos restringidos, restricción de framing a orígenes autorizados (`frame-ancestors 'self' https://ai.studio ...`).
- **HSTS:** `max-age=31536000; includeSubDomains; preload` forzando conexiones HTTPS seguras.
- **Anti-Sniffing & Anti-Clickjacking:** `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`.
- **Permissions-Policy:** Desactivación de APIs de hardware innecesarias (`camera=()`, `microphone=()`, `geolocation=()`, `payment=()`, `usb=()`).

---

## 7. Verificación Continua y Definition of Done (DoD)

Ningún cambio o componente se promueve a producción sin cumplir el ciclo:
1. Auditoría de dependencias (`npm audit`).
2. Validación de esquemas y tipos (`next lint` y `tsc --noEmit`).
3. Compilación de producción limpia (`npm run build`).
4. Ejecución satisfactoria de suites de pentesting interno (`bola-idor-test.ts`, `rbac-enforcement-test.ts`, `injection-xss-sqli-test.ts`).
5. Aprobación expresa de los integrantes responsables (Maicol R., Malcom Marcelo, Lucas P., Frank M.).
