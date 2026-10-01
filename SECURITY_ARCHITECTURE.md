# 🏛️ ARQUITECTURA DE SEGURIDAD INTEGRAL — AURENIS (SECURITY_ARCHITECTURE.md)

**Plataforma:** AURENIS Multi-Tenant School Management  
**Arquitectura:** Defensa en Profundidad & Zero-Trust (NIST SP 800-207)  
**Fecha:** Septiembre 2026  
**Responsables Técnicos:** Maicol R. (Arquitectura de Software & Backend), Frank M. (Seguridad & QA), Lucas P. (Diseño Seguro), Malcom Marcelo (Frontend)

---

## 1. Visión Holística de la Arquitectura de Seguridad

AURENIS está diseñado para operar en entornos escolares altamente regulados, donde la coexistencia de múltiples instituciones en una misma infraestructura exige barreras criptográficas y lógicas infranqueables.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              CAPAS DE DEFENSA EN PROFUNDIDAD                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Capa Perimetral / Edge: WAF, CORS estricto, Anti-CSRF, Sanitización de Cabeceras    │
│ 2. Capa de Autenticación: Tokens JWT HS256 firmados, Cookies HttpOnly/Secure, Revocación│
│ 3. Capa de Autorización: RBAC estricto en servidor, verificación de membresía y tenant │
│ 4. Capa de Aplicación: Validación Zod de esquemas, Rate Limiting, Filtros Anti-SSRF     │
│ 5. Capa de Datos / ORM: Consultas Prisma aisladas por schoolId, Cifrado AES-256-GCM    │
│ 6. Capa de Auditoría: Bitácora inmutable de eventos de seguridad con Request IDs       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Componentes Clave de la Arquitectura

### 2.1 Capa Perimetral y Firewall de Aplicación Web (`SecurityFirewallService` & `middleware.ts`)
- **Inspección de Tráfico:** Análisis de payloads maliciosos, patrones de SQLi, XSS, Path Traversal (`../`), manipulación de prototipos (`__proto__`) y caracteres de escape peligrosos.
- **Purga de Cabeceras:** Eliminación de cualquier cabecera `x-user-*` o `x-auth-*` provista por el cliente antes de invocar cualquier handler de Next.js.
- **Anti-CSRF Origin Validation:** Verificación obligatoria de las cabeceras `Origin` y `Referer` contra la lista de dominios permitidos en todos los métodos de mutación (`POST`, `PUT`, `PATCH`, `DELETE`).

### 2.2 Gestión Criptográfica de Sesiones (`session.ts` & `session-revocation.ts`)
- **Algoritmo:** **HS256** con secreto criptográfico de 256 bits (`JWT_SECRET`).
- **Ciclo de Vida de Token:**
  - Emisión de token con tiempo de expiración estándar (7 días) y `jti` único.
  - Almacenamiento en cookie segura con `httpOnly: true`, `secure: true`, `sameSite: 'none'/'lax'`, `path: '/'`.
  - Mecanismo de revocación distribuida: Al invocar `/api/auth/logout`, el `jti` y `userId` se registran en la lista de revocación (`isTokenRevoked`), invalidando cualquier uso posterior inmediato.

### 2.3 Autorización RBAC y Aislamiento Multi-Tenant (`object-authorization.ts` & `permissions.ts`)
- **Modelo de Permisos:** Matriz canónica RBAC con soporte para roles jerárquicos: `SUPERADMIN`, `ADMIN` (Director/UTP), `TEACHER` (Docente), `STUDENT` (Estudiante), `GUARDIAN` (Apoderado).
- **Validación en Dos Fases:**
  1. **Fase Perimetral:** `middleware.ts` valida que el `schoolSlug` o `schoolId` en la URL coincida con el tenant activo del token verificado.
  2. **Fase de Negocio / Capa de Datos:** Cada servicio backend utiliza `verifyObjectAuthorization` o cláusulas Prisma compuestas `{ id, schoolId }` para prevenir fugas BOLA/IDOR.

### 2.4 Sanitización de Entradas y Protección contra Inyecciones (`sanitization.ts`)
- **Filtros de Entrada:** Sanitización de cadenas de texto para eliminar etiquetas `<script>`, manipulaciones de atributos y eventos JavaScript (`onload`, `onerror`).
- **Protección contra Inyecciones SQL:** Exclusividad del query builder tipado de Prisma ORM. Prohibido el uso de `$queryRaw` sin parámetros tipados con `Prisma.sql`.

### 2.5 Cifrado en Reposo y Tránsito (`encryption.ts` & `crypto-keys.ts`)
- **Tránsito:** Conexiones obligadas vía TLS 1.3 / HTTPS mediante HSTS de 1 año (`max-age=31536000; includeSubDomains; preload`).
- **Reposo:** Cifrado simétrico de campos de alta sensibilidad (RUTs, diagnósticos médicos y psicológicos) utilizando **AES-256-GCM** con vector de inicialización (IV) aleatorio de 12 bytes y Authentication Tag de 16 bytes para garantizar integridad.

### 2.6 Trazabilidad y Logging de Auditoría (`requestId` & Audit Logs)
- Cada solicitud que ingresa al sistema recibe o genera un `x-request-id` criptográficamente aleatorio (UUID v4).
- Los eventos de seguridad (fallos de autenticación, accesos denegados, mutaciones de notas, cambios de membresía) se registran estructuradamente con `requestId`, `userId`, `schoolId`, `action` y marca temporal ISO 8601, suprimiendo cualquier secreto o contraseña del log.
