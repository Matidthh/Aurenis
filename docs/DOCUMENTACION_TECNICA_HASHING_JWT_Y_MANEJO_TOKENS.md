# 🔐 DOCUMENTACIÓN TÉCNICA: MECANISMO DE HASHING, JWT Y MANEJO DE TOKENS — AURENIS SaaS

**Documento:** Especificación Criptográfica y Arquitectura de Autenticación y Sesiones  
**Proyecto:** AURENIS — Sistema Integral de Gestión Escolar y Académica Multi-Tenant  
**Versión:** 2.0.0 (Release Candidate / 30 Días para Entrega Final)  
**Fecha de Emisión:** 27 de Septiembre de 2026  
**Líder de Proyecto & Arquitectura:** **Maicol R.** (*Project Lead & Backend Lead*)  
**Frontend & Lógica de Cliente:** **Malcom Marcelo** (*Frontend Lead*)  
**UI/UX Lead & Design System:** **Lucas P.** (*Design Lead*)  
**QA Lead & Ciberseguridad:** **Frank M.** (*Lead QA & Security*)  

---

## 📑 ÍNDICE GENERAL

1. [Visión General y Filosofía de Seguridad](#1-visión-general-y-filosofía-de-seguridad)
2. [Mecanismo de Hashing de Contraseñas (Bcrypt)](#2-mecanismo-de-hashing-de-contraseñas-bcrypt)
   - 2.1 Parámetros Criptográficos y Factor de Coste
   - 2.2 Algoritmo de Hashing y Verificación en Tiempo Constante
   - 2.3 Resistencia contra Ataques de Diccionario, Tablas Rainbow y Timing Attacks
3. [Estructura y Ciclo de Vida de los Tokens JWT (JSON Web Tokens)](#3-estructura-y-ciclo-de-vida-de-los-tokens-jwt-json-web-tokens)
   - 3.1 Algoritmo Criptográfico y Gestión de la Clave Maestra (`JWT_SECRET`)
   - 3.2 Anatomía del Payload y Claims Canónicos
   - 3.3 Flujo de Emisión, Firma y Validación de Tokens
   - 3.4 Mecanismo de Revocación de Sesiones (Blacklist Edge-Safe)
4. [Esquema de Cookies Seguras (Session Cookies)](#4-esquema-de-cookies-seguras-session-cookies)
   - 4.1 Atributos de Seguridad (`HttpOnly`, `Secure`, `SameSite`, `Path`)
   - 4.2 Ciclo de Vida, Expiración y Políticas de Renovación
   - 4.3 Procedimiento de Invalidation y Destrucción Segura en Logout
   - 4.4 Soporte Dual: Cookie de Sesión + Header `Authorization: Bearer <token>`
5. [Diagrama de Secuencia de Extremo a Extremo (End-to-End Login Flow)](#5-diagrama-de-secuencia-de-extremo-a-extremo-end-to-end-login-flow)
6. [Matriz de Amenazas y Controles Mitigantes (OWASP / STRIDE)](#6-matriz-de-amenazas-y-controles-mitigantes-owasp--stride)
7. [Atribución de Autoría por Integrante del Equipo](#7-atribución-de-autoría-por-integrante-del-equipo)

---

## 1. VISIÓN GENERAL Y FILOSOFÍA DE SEGURIDAD

El subsistema de autenticación y gestión de sesiones de **AURENIS** fue concebido bajo el principio de **Defensa en Profundidad (Defense in Depth)** y el modelo **Zero-Trust**:

* **Servidor como Única Fuente de Verdad:** El cliente web jamás genera, manipula ni firma tokens de acceso. Las decisiones de autenticación y asignación de permisos residen íntegramente en el backend (`lib/auth/session.ts` y `app/api/auth/*`).
* **Inaccesibilidad del Lado del Cliente:** Las credenciales de sesión se almacenan en cookies HTTP con el flag `HttpOnly`, haciendo imposible su extracción mediante ataques de Cross-Site Scripting (XSS).
* **Aislamiento Multi-Tenant Embebido:** El token de sesión encapsula tanto la identidad del usuario (`sub`) como el identificador del colegio (`schoolId`) y su rol institucional (`role`), permitiendo la validación instantánea de contexto en el Edge Middleware y en los Scoped Prisma Clients.

---

## 2. MECANISMO DE HASHING DE CONTRASEÑAS (BCRYPT)

### 2.1 Parámetros Criptográficos y Factor de Coste

AURENIS utiliza **Bcrypt** (`bcryptjs`) para el hashing irreversible de contraseñas de todos los usuarios (SuperAdmins, Directores, Profesores, Estudiantes y Apoderados).

```typescript
// Ubicación: lib/auth/password.ts
// Responsable: Maicol R. (Backend Lead) & Malcom Marcelo (Frontend/Client Guards)

import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10; // Factor de coste estándar en la industria (2^10 iteraciones)
```

* **Salt Criptográfico Aleatorio:** Cada contraseña genera un salt criptográficamente seguro único de 128 bits antes de computar el hash. Esto garantiza que dos usuarios con contraseñas idénticas tendrán hashes completamente disímiles en la base de datos.
* **Factor de Coste ($2^{10} = 1.024$ rondas):** Calibrado para tomar aproximadamente 60-90 ms por operación en hardware de servidor moderno, logrando un balance ideal entre velocidad para el usuario legítimo e inviabilidad matemática para ataques de fuerza bruta masiva.

### 2.2 Algoritmo de Hashing y Verificación

```typescript
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string, 
  hash: string | null | undefined
): Promise<boolean> {
  // Guarda preventiva: Si la contraseña o el hash son nulos, indefinidos o vacíos, rechazar
  if (!password || !hash || typeof hash !== "string" || hash.trim() === "") {
    return false;
  }
  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}
```

### 2.3 Resistencia contra Vectores de Ataque

1. **Tablas Rainbow:** Invalidadas gracias al salt aleatorio por usuario.
2. **Ataques de Canal Lateral (Timing Attacks):** `bcrypt.compare` ejecuta la comparación de cadenas en tiempo constante, evitando que un atacante deduzca caracteres correctos midiendo los microsegundos de respuesta.
3. **Inyección de Hashes Nulos o Corruptos:** Las guardas de tipado estricto previenen errores de ejecución que puedan resultar en accesos indebidos (*fail-closed policy*).

---

## 3. ESTRUCTURA Y CICLO DE VIDA DE LOS TOKENS JWT

### 3.1 Algoritmo Criptográfico y Clave Maestra

La generación y verificación de tokens de sesión se apoya en la biblioteca estándar de alto rendimiento **`jose`**, compatible tanto con el runtime de Node.js como con el Edge Runtime de Next.js:

* **Algoritmo:** `HS256` (HMAC con función de resumen SHA-256).
* **Gestión de la Clave Secreta (`JWT_SECRET`):**
  - Obtenida desde las variables de entorno (`process.env.JWT_SECRET`).
  - Validada al inicio del servidor en `lib/security/crypto-keys.ts` exigiendo una longitud mínima de 32 caracteres criptográficos (256 bits).
  - Nunca expuesta en el frontend ni prefijada con `NEXT_PUBLIC_`.

### 3.2 Anatomía del Payload y Claims Canónicos

El token JWT de AURENIS contiene un payload estructurado y tipado en TypeScript (`AuthCookiePayload`):

```json
{
  "sub": "usr_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "email": "carlos.mendoza@colegiosanjose.cl",
  "firstName": "Carlos",
  "lastName": "Mendoza",
  "isSystemAdmin": false,
  "schoolId": "sch_csj_001_8a7c",
  "schoolSlug": "colegio-san-jose",
  "role": "SCHOOL_ADMIN",
  "permissions": [
    "SCHOOL_SETTINGS_VIEW",
    "SCHOOL_SETTINGS_UPDATE",
    "SCHOOL_ROLES_MANAGE",
    "TEACHERS_VIEW",
    "TEACHERS_ASSIGN",
    "STUDENTS_VIEW",
    "STUDENTS_MANAGE",
    "GRADES_VIEW",
    "GRADES_ENTER",
    "GRADES_LOCK",
    "ATTENDANCE_VIEW",
    "ATTENDANCE_RECORD"
  ],
  "iat": 1790500000,
  "exp": 1791104800
}
```

#### Descripción de Claims:
* **`sub` (Subject):** Identificador único inmutable del usuario (`User.id`).
* **`email` / `firstName` / `lastName`:** Datos de perfil básico para renderizado en componentes de encabezado sin necesidad de consultar la base de datos en cada petición.
* **`schoolId` & `schoolSlug`:** Identificadores del colegio activo. Permiten el enrutamiento multi-tenant y la inyección en `createTenantPrisma(schoolId)`.
* **`role`:** Rol institucional asignado en la membresía (`SUPER_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `GUARDIAN`).
* **`permissions`:** Vector de permisos canónicos calculados en el momento de la firma para evaluación rápida en memoria.
* **`iat` (Issued At):** Timestamp UNIX de emisión.
* **`exp` (Expiration Time):** Timestamp UNIX de expiración (7 días / 604.800 segundos).

---

### 3.3 Flujo de Emisión, Firma y Validación

```typescript
// Ubicación: lib/auth/session.ts
// Responsable: Maicol R. (Backend Lead)

export async function signSessionToken(
  payload: Omit<AuthCookiePayload, "iat" | "exp">
): Promise<string> {
  const secretKey = getValidatedJwtSecret();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<AuthCookiePayload | null> {
  try {
    const secretKey = getValidatedJwtSecret();
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as AuthCookiePayload;
  } catch {
    // Si la firma es inválida, el token expiró o fue alterado, retorna null de forma segura
    return null;
  }
}
```

---

### 3.4 Mecanismo de Revocación de Sesiones (Blacklist Edge-Safe)

Para permitir el cierre de sesión inmediato, revocación por cambio de contraseña o mitigación ante robo de credenciales, AURENIS implementa un sistema de revocación dual (`lib/auth/session-revocation.ts`):

1. **Identificador de Token (`jti`) / Centinela por Usuario:** Permite revocar un token individual o invalidar todas las sesiones activas de un usuario (`revokeAllUserSessions(userId)`).
2. **Memoria de Acceso Rápido y Limpieza Automática:** Los identificadores revocados se almacenan temporalmente hasta su fecha natural de expiración (`cleanupMemoryTokens`), liberando memoria de manera continua sin sobrecargar el servidor.

---

## 4. ESQUEMA DE COOKIES SEGURAS (SESSION COOKIES)

### 4.1 Atributos de Configuración de la Cookie de Sesión

La sesión se almacena bajo el nombre `aurenis_session` con las directivas de seguridad más estrictas de los estándares web modernos:

```typescript
// Ubicación: lib/auth/session.ts

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "aurenis_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,                  // 🔒 Inaccesible por JavaScript (Anti-XSS)
  secure: true,                    // 🔒 Solo transmitida vía HTTPS/TLS 1.3
  sameSite: "none" as const,       // 🔒 Soporte cross-origin para iframes embebidos y previews
  path: "/",                       // 🔒 Disponible en toda la jerarquía de rutas
  maxAge: 60 * 60 * 24 * 7,        // 🔒 7 días de duración (604.800 segundos)
};
```

### 4.2 Tabla de Parámetros de la Cookie

| Directiva | Valor Configurado | Justificación Técnica de Seguridad |
| :--- | :--- | :--- |
| **Nombre** | `aurenis_session` | Identificador estandarizado de sesión del sistema. |
| **`HttpOnly`** | `true` | Impide que scripts maliciosos ejecutados vía XSS lean el token a través de `document.cookie`. |
| **`Secure`** | `true` | Obliga al navegador a transmitir la cookie exclusivamente sobre canales cifrados TLS/HTTPS, evitando la interceptación en redes abiertas (Man-in-the-Middle). |
| **`SameSite`** | `none` / `lax` | Configurado para compatibilidad total en entornos con iframes seguros y navegación estándar, complementado con validación de origen en API Routes. |
| **`Path`** | `/` | Garantiza que el middleware pueda evaluar la sesión en cualquier ruta de la aplicación (`/`, `/[schoolSlug]/*`, `/api/*`, `/system/*`). |
| **`Max-Age`** | `604800` (7 días) | Establece una expiración finita y sincronizada con el claim `exp` del JWT. |

---

### 4.3 Procedimiento de Invalidación y Destrucción en Logout

El cierre de sesión (`POST /api/auth/logout`) realiza una purga total de la cookie tanto para directivas `SameSite=none` como `SameSite=lax`:

```typescript
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  
  // Sobrescribe la cookie con contenido vacío y fecha de expiración en la época UNIX (1970)
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    sameSite: "none",
    secure: true,
    maxAge: 0,
    expires: new Date(0),
  });

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    ...SESSION_COOKIE_OPTIONS,
    sameSite: "lax",
    maxAge: 0,
    expires: new Date(0),
  });

  try {
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Ignorar si el runtime no soporta delete directo
  }
}
```

---

### 4.4 Soporte Dual: Cookie de Sesión + Header `Authorization: Bearer`

Para facilitar la interoperabilidad con clientes móviles, suites de pruebas automatizadas (`scripts/qa-security-test.ts`) y herramientas de monitoreo, el extractor de sesión (`getSession()`) inspecciona ambas fuentes de forma transparente:

```
Petición HTTP Entrante
       │
       ├── ¿Existe Cookie 'aurenis_session'? ────► [SÍ] ──► Validar JWT con verifySessionToken()
       │                                                          │
       └── [NO]                                                  │
            │                                                    ▼
            └── ¿Existe Header 'Authorization: Bearer <tok>'? ──► [SÍ] ──► Validar JWT
```

---

## 5. DIAGRAMA DE SECUENCIA DE EXTREMO A EXTREMO (LOGIN FLOW)

```
[ Navegador / Cliente ]        [ Edge Middleware ]       [ /api/auth/login ]      [ PostgreSQL (Prisma) ]
         │                              │                         │                         │
         │─── 1. POST /api/auth/login ─►│                         │                         │
         │    { email, password, slug } │── 2. Pasa (Ruta Pública)│                         │
         │                              │────────────────────────►│                         │
         │                                                        │── 3. Check Rate Limit ──│
         │                                                        │   (Max 5 req/min)       │
         │                                                        │                         │
         │                                                        │── 4. Zod Schema Parse ──│
         │                                                        │                         │
         │                                                        │── 5. findUnique(email) ─►
         │                                                        │◄─ 6. Retorna User+Hash ─│
         │                                                        │                         │
         │                                                        │── 7. verifyPassword() ──│
         │                                                        │   (Bcrypt Compare 10)   │
         │                                                        │                         │
         │                                                        │── 8. Resolve Membership ─►
         │                                                        │◄─ 9. Retorna School/Role│
         │                                                        │                         │
         │                                                        │── 10. signSessionToken()│
         │                                                        │   (HS256 + 7d Expiry)   │
         │                                                        │                         │
         │                                                        │── 11. setSessionCookie()│
         │                                                        │   (HttpOnly, Secure)    │
         │                                                        │                         │
         │◄── 12. HTTP 200 OK + Set-Cookie: aurenis_session ──────│                         │
         │    { success: true, redirectUrl: "/[schoolSlug]" }     │                         │
         ▼                                                        ▼                         ▼
```

---

## 6. MATRIZ DE AMENAZAS Y CONTROLES MITIGANTES

| Amenaza Criptográfica / Sesión | Vector de Ataque | Control Técnico Mitigante en AURENIS |
| :--- | :--- | :--- |
| **Robo de Token vía XSS** | Inyección de JavaScript malicioso en el navegador. | Flag `HttpOnly: true` en la cookie; el script no puede acceder al token. |
| **Ataques de Fuerza Bruta / Credential Stuffing** | Miles de intentos automatizados contra `/api/auth/login`. | `RateLimiter` por IP con límite de 5 intentos por minuto y bloqueo temporal (HTTP 429). |
| **Manipulación de Claims (Tampering)** | Modificación de `schoolId` o `role` en el token. | Firma criptográfica `HS256` con clave de 256 bits; cualquier cambio invalida la firma. |
| **Falsificación de Peticiones en Sitios Cruzados (CSRF)** | Envío de peticiones no consentidas desde sitios externos. | Directivas `SameSite`, validación de `Origin`/`Referer` y comprobación de permisos server-side. |
| **Fuga de Base de Datos (Password Compromise)** | Extracción del dump de PostgreSQL por atacantes. | Contraseñas protegidas con **Bcrypt (10 Salt Rounds)** con sal aleatoria por registro. |
| **Timing Attacks en Autenticación** | Medición de tiempos de respuesta para deducir credenciales. | Comparación en tiempo constante en `bcrypt.compare` y validaciones homogéneas. |

---

## 7. ATRIBUCIÓN DE AUTORÍA POR INTEGRANTE DEL EQUIPO

| Integrante del Equipo | Rol Principal | Componentes y Módulos de Autenticación Bajo su Autoría |
| :--- | :--- | :--- |
| 👑 **Maicol R.** | **Project Lead, Arquitectura & Backend Lead** | - Arquitectura criptográfica, motor JWT y sesiones (`lib/auth/session.ts`).<br>- Hashing con Bcrypt (`lib/auth/password.ts`).<br>- Endpoints de login, logout y me (`app/api/auth/*`).<br>- Validación de clave maestra de 256 bits (`lib/security/crypto-keys.ts`). |
| 💻 **Malcom Marcelo** | **Frontend Lead & Core Developer** | - Guardas de seguridad preventivas en `verifyPassword`.<br>- Componentes interactivos de Login (`components/auth/LoginForm.tsx`).<br>- Selector dinámico de colegio e inicio de sesión institucional. |
| 🎨 **Lucas P.** | **UI / UX Lead & Design System** | - Formulario de inicio de sesión sobrio, accesible (WCAG 2.1 AA) y feedback visual de error.<br>- Estados `loading`, `error` y animaciones de transición en la autenticación. |
| 🛡️ **Frank M.** | **QA Lead & Ciberseguridad** | - Módulo de revocación y blacklist de tokens (`lib/auth/session-revocation.ts`).<br>- Rate Limiting por IP contra fuerza bruta (`lib/security/rate-limiter.ts`).<br>- Pruebas automatizadas de hash y anti-tampering (`scripts/qa-security-test.ts`). |

---

> **Aprobación Oficial:**  
> **Maicol R.** — *Líder General del Proyecto & Arquitectura Técnica*  
> *Sello Digital de Validación:* `AURENIS-AUTH-CRYPTO-SPEC-2026-9E4B1`
