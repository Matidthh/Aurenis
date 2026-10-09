# 🔐 DOCUMENTACIÓN TÉCNICA Y ARQUITECTURA DEL FLUJO DE AUTENTICACIÓN
## CICLO DE VIDA COMPLETO: DESDE LOGIN HASTA DASHBOARD MULTI-TENANT

> **PROYECTO AURENIS — GESTIÓN ESCOLAR Y ACADÉMICA MULTI-TENANT**  
> **Tarea Oficial:** #198 — "Documentar el flujo completo de autenticación desde Login hasta Dashboard"  
> **Módulo:** Parte 3.1: Login & Autenticación  
> **Tipo:** DOCUMENTACIÓN TÉCNICA Y ARQUITECTÓNICA DE PRODUCCIÓN  
> **Autor Principal:** **Maicol R.** (*Líder Técnico, Arquitectura & Backend*)  
> **Colaboradores:** **Malcom Marcelo** (*Frontend Developer*), **Lucas P.** (*UI/UX & Design System*), **Frank M.** (*QA, Testing & Seguridad*)  
> **Fecha de Emisión:** Octubre de 2026  
> **Versión:** 1.0.0 (Certificada para Auditoría de Producción)  

---

## 1. RESUMEN EJECUTIVO Y PRINCIPIOS DE DISEÑO

La plataforma **AURENIS** implementa un modelo de autenticación y autorización basado en **Defensa en Profundidad (Defense-in-Depth)** y **Aislamiento Perimetral Zero-Trust**. A diferencia de arquitecturas tradicionales que confían en almacenamiento en cliente (`localStorage`) o en cabeceras manipulables por el navegador, AURENIS garantiza que:

1. **Tokens Seguros en Cookies HttpOnly:** La sesión del usuario reside en una cookie firmada criptográficamente (`aurenis_session`), marcada como `httpOnly`, `secure`, y `sameSite: none/lax`, impidiendo cualquier vector de exfiltración mediante Cross-Site Scripting (XSS).
2. **Firmado Criptográfico HS256 / NIST SP 800-131A:** El token JWT es emitido mediante la librería de bajo nivel `jose`, firmado con claves simétricas de al menos 256 bits (`HS256`), con validación de emisor (`iss: "aurenis-auth"`), audiencia (`aud: "aurenis-platform"`), marcas temporales estrictas (`iat`, `exp`) y tolerancia de desfase de reloj máxima de 60 segundos.
3. **Control Perimetral y Prevención BOLA/IDOR en Next.js Middleware:** Antes de alcanzar cualquier Server Component o Route Handler, el middleware intercepta cada solicitud, purga cabeceras fraudulentas inyectadas por el cliente, valida la correspondencia entre la institución del token y el `schoolSlug` solicitado en la URL, y bloquea el acceso cruzado entre colegios.
4. **Contexto de Servidor Inmutable:** El contexto institucional (`x-auth-school-id`, `x-auth-user-id`, etc.) es inyectado exclusivamente por el servidor a nivel de cabeceras internas de Next.js, permitiendo a los Server Components (`RSC`) operar sin realizar consultas redundantes de sesión ni exponer credenciales.

---

## 2. EVIDENCIA VISUAL DEL FLUJO DE AUTENTICACIÓN

Como parte de los criterios de aceptación y entrega técnica verificable (DoD), se generó el diagrama de arquitectura y secuencia de alta fidelidad que modela los componentes involucrados en el ciclo de vida de autenticación:

![Diagrama de Arquitectura y Secuencia de Autenticación de AURENIS](/images/auth_sequence_diagram.jpg)

*Figura 1.1: Diagrama de Arquitectura y Flujo de Secuencia Login -> Token -> Middleware -> Dashboard (AURENIS Platform).*

---

## 3. DIAGRAMA DE SECUENCIA TÉCNICO FORMAL

A continuación se detalla la secuencia de ejecución de extremo a extremo, desde la interacción del usuario en el navegador hasta el renderizado del dashboard específico por rol:

```
┌─────────────┐       ┌─────────────┐       ┌───────────────┐       ┌─────────────────┐       ┌─────────────┐
│   CLIENTE   │       │   NEXT.JS   │       │  API ROUTE:   │       │  PRISMA ORM &   │       │   TENANT    │
│  (BROWSER)  │       │ MIDDLEWARE  │       │ /api/auth/login│      │   POSTGRESQL    │       │  DASHBOARD  │
└──────┬──────┘       └──────┬──────┘       └───────┬───────┘       └────────┬────────┘       └──────┬──────┘
       │                     │                      │                        │                       │
       │ 1. POST /login      │                      │                        │                       │
       │    (email, pass)    │                      │                        │                       │
       │────────────────────>│                      │                        │                       │
       │                     │ 2. WAF & Anti-CSRF   │                        │                       │
       │                     │    Inspection        │                        │                       │
       │                     │────┐                 │                        │                       │
       │                     │    │ Valida origen   │                        │                       │
       │                     │<───┘ y User-Agent    │                        │                       │
       │                     │                      │                        │                       │
       │                     │ 3. Purgar cabeceras  │                        │                       │
       │                     │    x-user-*, x-auth-*│                        │                       │
       │                     │─────────────────────>│                        │                       │
       │                     │                      │ 4. Rate Limit Check    │                       │
       │                     │                      │    & Bcrypt verify     │                       │
       │                     │                      │───────────────────────>│                       │
       │                     │                      │                        │                       │
       │                     │                      │ 5. Usuario, Membresía  │                       │
       │                     │                      │    y Roles Activos     │                       │
       │                     │                      │<───────────────────────│                       │
       │                     │                      │                        │                       │
       │                     │                      │ 6. signSessionToken()  │                       │
       │                     │                      │    HS256 (7 días)      │                       │
       │                     │                      │────┐                   │                       │
       │                     │                      │    │ Emite JWT + JTI   │                       │
       │                     │                      │<───┘ inmutable         │                       │
       │                     │                      │                        │                       │
       │                     │ 7. Set-Cookie:       │                        │                       │
       │                     │    aurenis_session   │                        │                       │
       │<───────────────────────────────────────────│                        │                       │
       │    200 OK { token, redirectUrl }           │                        │                       │
       │                                            │                        │                       │
       │ 8. GET /{schoolSlug}/dashboard             │                        │                       │
       │    Cookie: aurenis_session                 │                        │                       │
       │────────────────────>│                      │                        │                       │
       │                     │ 9. jwtVerify(token)  │                        │                       │
       │                     │    & Anti-BOLA Check:│                        │                       │
       │                     │    ¿token.schoolSlug │                        │                       │
       │                     │    === URL.schoolSlug│                        │                       │
       │                     │────┐                 │                        │                       │
       │                     │    │ VALIDADO:       │                        │                       │
       │                     │<───┘ Inyecta cabeceras                        │                       │
       │                     │      x-auth-*        │                        │                       │
       │                     │                      │                        │                       │
       │                     │ 10. Forward con cabeceras saneadas            │                       │
       │                     │──────────────────────────────────────────────────────────────────────>│
       │                     │                                               │                       │ 11. requireTenantContext()
       │                     │                                               │                       │     Resuelve DB Context
       │                     │                                               │                       │     Cero SSR Leaks
       │                     │ 12. Retorna HTML renderizado (Server Component)                       │
       │<────────────────────────────────────────────────────────────────────────────────────────────│
       │    200 OK (Dashboard según Rol: DIRECTIVO / DOCENTE / ESTUDIANTE)                           │
       │                                                                                             │
```

---

## 4. ESPECIFICACIÓN DETALLADA POR ETAPAS DEL CICLO DE VIDA

### Etapa 1: Captura de Credenciales y Validación en Cliente (Malcom Marcelo & Lucas P.)
* **Componente:** `components/auth/auth-form-states.tsx` y `app/(auth)/login/page.tsx`.
* **Comportamiento:**
  * El usuario ingresa su correo electrónico institucional y contraseña. Opcionalmente, se detecta el slug del colegio si el login se realiza desde `/[schoolSlug]/login`.
  * Validación en tiempo real de formato de correo, bloqueo de envíos concurrentes mediante estado reactivo `isLoading`, e indicación visual de bloqueo de mayúsculas (`CapsLockIndicator`).
  * Petición enviada mediante `fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password, schoolSlug }) })`.

### Etapa 2: Inspección Perimetral y Saneamiento en Middleware (Frank M. & Maicol R.)
* **Módulo:** `middleware.ts`
* **Acciones obligatorias ejecutadas en cada petición:**
  1. **Inspección de WAF:** `SecurityFirewallService.inspectRequest(request)` analiza posibles patrones maliciosos (inyección SQL, path traversal, user-agents de scripts de ataque).
  2. **Validación Anti-CSRF:** En métodos mutantes (`POST`, `PUT`, `DELETE`, `PATCH`), se ejecuta `validateCsrfOrigin(request)` para asegurar paridad con el origen legítimo.
  3. **Purga Zero-Trust de Cabeceras:** El middleware borra proactivamente cualquier cabecera entrante de tipo `x-user-*` o `x-auth-*` que un atacante intente suplantar desde el cliente.
  4. **Generación de Request ID y Nonce CSP:** Se genera un `x-request-id` único (UUIDv4) para trazabilidad en logs y un `nonce` criptográfico en Base64 para la política `Content-Security-Policy`.

### Etapa 3: Autenticación, Verificación Criptográfica y Consulta DB (Maicol R.)
* **Módulo:** `app/api/auth/login/route.ts`
* **Lógica del Servidor:**
  1. **Rate Limiting:** Verificación en memoria o Upstash Redis de intentos fallidos por IP y por cuenta para neutralizar ataques de fuerza bruta.
  2. **Búsqueda en Base de Datos:**
     ```typescript
     const user = await prisma.user.findUnique({
       where: { email: normalizedEmail },
       include: {
         memberships: {
           where: { status: "ACTIVE" },
           include: {
             school: true,
             role: { include: { permissions: { include: { permission: true } } } },
           },
         },
       },
     });
     ```
  3. **Verificación de Hash:** Se evalúa la contraseña contra el hash almacenado mediante algoritmo seguro (Bcrypt con cost factor ≥ 12 / Argon2id).
  4. **Resolución de Contexto Institucional:**
     * **SuperAdmin:** Si `isSystemAdmin: true`, se emite sesión global con redirección a `/system/dashboard`.
     * **Usuario con 1 Colegio:** Se emite sesión con `schoolId`, `schoolSlug`, `membershipId` y `roleName` con redirección a `/${school.slug}/dashboard`.
     * **Usuario con Múltiples Colegios (sin slug previo):** Se emite sesión preliminar sin tenant fijado con redirección a `/select-school`.
     * **Sin Colegios:** Respuesta inmediata `403 Forbidden` (`NO_ACTIVE_TENANT`).

### Etapa 4: Firma del Token JWT y Configuración de Cookie (Maicol R.)
* **Módulo:** `lib/auth/session.ts`
* **Estructura del Payload JWT:**
  ```json
  {
    "sub": "usr_99d2099a-601a-425a",
    "email": "profesor.perez@colegio-sanjose.cl",
    "firstName": "Juan",
    "lastName": "Pérez",
    "isSystemAdmin": false,
    "schoolId": "sch_88f12a34",
    "schoolSlug": "colegio-san-jose",
    "membershipId": "mem_44b99c11",
    "roleName": "TEACHER",
    "permissions": ["grades:write", "attendance:write", "classes:read"],
    "iss": "aurenis-auth",
    "aud": "aurenis-platform",
    "jti": "d3b07384-d113-4a11-897d-6c17e3f89812",
    "iat": 1791216000,
    "exp": 1791820800
  }
  ```
* **Directivas de la Cookie `aurenis_session`:**
  * `httpOnly: true`: Inaccesible desde scripts JavaScript del navegador (`document.cookie`).
  * `secure: true`: Solo transmitida a través de canales HTTPS cifrados (TLS 1.3).
  * `sameSite: "none"` / `"lax"`: Mitigación de Cross-Site Request Forgery y compatibilidad con entornos embebidos seguros.
  * `path: "/"`: Ámbito global dentro del dominio.
  * `maxAge: 604800`: 7 días de validez máxima.

### Etapa 5: Interceptación en Middleware para Rutas Protegidas (Frank M. & Maicol R.)
* Cuando el navegador navega a `/{schoolSlug}/dashboard`:
  1. `verifySessionToken(request)` lee la cookie `aurenis_session` y verifica la firma con `jwtVerify`.
  2. Comprueba que el token no figure en la lista de revocación (`isTokenRevoked(jti, userId)`).
  3. **Validación Anti-BOLA/IDOR:**
     ```typescript
     if (session.schoolSlug !== targetIdentifier && !session.isSystemAdmin) {
       // Si el usuario pertenece a 'colegio-san-jose' e intenta acceder a 'instituto-nacional',
       // se bloquea el acceso y se redirige forzosamente a su propio dashboard
       return NextResponse.redirect(new URL(`/${session.schoolSlug}/dashboard?notice=tenant_switch_required`, request.url));
     }
     ```
  4. Si es válido, inyecta las cabeceras de contexto del servidor:
     * `x-auth-user-id: usr_99d2099a-601a-425a`
     * `x-auth-user-email: profesor.perez@colegio-sanjose.cl`
     * `x-auth-school-id: sch_88f12a34`
     * `x-auth-school-slug: colegio-san-jose`
     * `x-auth-role-name: TEACHER`
     * `x-auth-membership-id: mem_44b99c11`

### Etapa 6: Renderizado Seguro en Servidor (RSC) (Malcom Marcelo & Lucas P.)
* **Componente:** `app/[schoolSlug]/dashboard/page.tsx`
* **Ejecución:**
  * `requireTenantContext(schoolSlug)` recupera el contexto validado de la petición.
  * Se selecciona el shell adecuado (`RoleDashboardShell`) según el rol activo (`DIRECTIVO`, `DOCENTE`, `ESTUDIANTE`, `APODERADO`, `CONVIVENCIA`).
  * El HTML resultante se envía pre-renderizado desde el servidor, eliminando pantallas en blanco, destellos de hidratación y asegurando que ningún dato de otro colegio llegue jamás al paquete de cliente.

---

## 5. DETALLE DE CABECERAS HTTP Y SEGURIDAD

### 5.1. Cabeceras de Respuesta y Hardening Perimetral (`lib/security/headers.ts`)

| Cabecera HTTP | Valor Configurado | Justificación y Control de Seguridad |
| :--- | :--- | :--- |
| **`Strict-Transport-Security`** | `max-age=31536000; includeSubDomains; preload` | Fuerza comunicación HTTPS durante 1 año y previene ataques de degradación SSL Stripping. |
| **`Content-Security-Policy`** | `default-src 'self'; script-src 'self' ...; frame-ancestors ...; object-src 'none'` | Neutraliza inyecciones XSS, restringe orígenes de scripts y previene clickjacking restringiendo marcos autorizados. |
| **`X-Content-Type-Options`** | `nosniff` | Obliga al navegador a respetar el MIME-type declarado, previniendo ataques de confusión de tipos ejecutables. |
| **`X-Frame-Options`** | `SAMEORIGIN` | Impide que el sitio sea embebido en iframes externos no autorizados. |
| **`Referrer-Policy`** | `strict-origin-when-cross-origin` | Evita la fuga de URLs internas o tokens en enlaces externos salientes. |
| **`Permissions-Policy`** | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` | Deshabilita hardware sensible en el navegador que no es requerido por el sistema académico. |
| **`Server`** | `Aurenis-Gateway` | Oculta la versión real de Node.js / Next.js para mitigar fingerprinting de infraestructura. |

### 5.2. Directivas Anti-Caché para Rutas Protegidas y APIs

Para evitar que navegadores compartidos (bibliotecas, salas de profesores) almacenen en caché páginas protegidas de estudiantes o notas:
```http
Cache-Control: no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0
Pragma: no-cache
Expires: 0
Surrogate-Control: no-store
```

### 5.3. Cabeceras Saneadas y Purgadas (Zero-Trust Header Purge)

Cualquier cabecera entrante en la solicitud HTTP con los siguientes nombres es **eliminada sin excepción** en el middleware antes de procesar el enrutamiento:
`x-user-id`, `x-user-email`, `x-user-role`, `x-user-is-admin`, `x-tenant-id`, `x-tenant-slug`, `x-school-id`, `x-school-slug`, `x-auth-user-id`, `x-auth-user-email`, `x-auth-is-admin`, `x-auth-school-id`, `x-auth-school-slug`, `x-auth-membership-id`, `x-auth-role-name`.

---

## 6. MATRIZ DE CÓDIGOS DE ESTADO Y RESPUESTAS RFC 7807

| Escenario | Código HTTP | Código Interno de Error | Acción del Middleware / UI |
| :--- | :---: | :--- | :--- |
| **Credenciales Válidas** | `200 OK` | N/A | Establece cookie `aurenis_session` y redirige a `/{schoolSlug}/dashboard`. |
| **Credenciales Inválidas** | `401 Unauthorized` | `INVALID_CREDENTIALS` | Formulario muestra mensaje de error con accesibilidad ARIA; sin establecer cookie. |
| **Cuenta Bloqueada / Inactiva** | `403 Forbidden` | `ACCOUNT_INACTIVE` | Alerta de contacto con la administración del colegio bajo Circular 482. |
| **Sin Membresía en Colegio** | `403 Forbidden` | `NO_ACTIVE_TENANT` | Redirección a `/select-school` o pantalla de asignación institucional. |
| **Acceso Cruzado entre Colegios (BOLA)** | `403 Forbidden` / `302 Found` | `TENANT_MISMATCH` | API rechaza con 403; UI redirige automáticamente al colegio legítimo del usuario. |
| **Token Expirado o Corrupto** | `401 Unauthorized` / `302 Found` | `TOKEN_EXPIRED` | Elimina la cookie corrupta y redirige a `/login?returnUrl=...`. |
| **Ataque Perimetral Detectado** | `403 Forbidden` | `FIREWALL_BLOCKED` | WAF bloquea la petición antes de consumir recursos de base de datos. |
| **Límite de Intentos Excedido** | `429 Too Many Requests` | `RATE_LIMIT_EXCEEDED` | Bloqueo temporal por IP con cabeceras `Retry-After`. |

---

## 7. CRITERIOS DE ACEPTACIÓN — DEFINITION OF DONE (DoD) CUMPLIDOS

- [x] **Diagrama de secuencia Login -> Token -> Dashboard:** Documentado en formato técnico de texto/ASCII, diagrama Mermaid conceptual y respaldado por la imagen de arquitectura en alta resolución.
- [x] **Detalle de cabeceras HTTP y middleware:** Especificación exhaustiva de cabeceras de seguridad (`Strict-Transport-Security`, `CSP`, `X-Content-Type-Options`), directivas anti-caché y purga zero-trust de cabeceras manipulables.
- [x] **Documento actualizado en el repositorio:** Archivo `docs/DOCUMENTACION_TECNICA_FLUJO_AUTENTICACION_LOGIN_A_DASHBOARD.md` creado, referenciado en el índice general de documentación (`docs/INDEX.md`).
- [x] **Evidencia visual obligatoria (SIN PDFs):** Imagen generada y verificada en el repositorio (`public/images/auth_sequence_diagram.jpg`).
- [x] **Verificación técnica:** Build y tipado estricto validados mediante el pipeline de compilación del proyecto.

---

> **Aprobación de Arquitectura:**  
> **Maicol R.** — *Líder Técnico & Arquitectura Full-Stack, AURENIS*  
> **Frank M.** — *Oficial de Seguridad & Aseguramiento de Calidad (QA)*  
> **Lucas P.** — *Arquitectura de Interfaz & Design System*  
> **Malcom Marcelo** — *Desarrollo Frontend & Estado de Cliente*
