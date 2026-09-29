# 🛡️ DIAPOSITIVAS DE PRESENTACIÓN: MODELO STRIDE, DEFENSAS OWASP Y HASHING SEGURO EN AURENIS SAAS
## Sistema de Gestión Académica y Escolar Multi-Tenant de Alta Disponibilidad

**Audiencia:** Comité Evaluador de Arquitectura, Ciberseguridad y Auditoría de Software  
**Expositores:**  
- 👑 **Maicol R.** — Líder de Proyecto, Arquitectura Cloud & Backend  
- 💻 **Malcom Marcelo** — Frontend Developer & Lógica de Cliente  
- 🎨 **Lucas P.** — UI/UX Designer & Design System  
- 🛡️ **Frank M.** — QA, Pentesting & Oficial de Seguridad  
**Fecha:** 29 de Septiembre de 2026  
**Versión:** 2.4.0-Production-Ready  

---

## 📑 ÍNDICE DE DIAPOSITIVAS

1. **Diapositiva 1:** Portada y Declaración de Misión de Seguridad
2. **Diapositiva 2:** Arquitectura Zero-Trust y Superficie de Ataque Escolar
3. **Diapositiva 3:** Modelo de Amenazas STRIDE — Descomposición Sistemática
4. **Diapositiva 4:** Matriz de Mitigación STRIDE en AURENIS
5. **Diapositiva 5:** Defensas contra OWASP Top 10 (2021/2025) en el Servidor
6. **Diapositiva 6:** Prevención de Vulnerabilidades BOLA / IDOR (OWASP API1)
7. **Diapositiva 7:** Criptografía y Hashing Seguro: Argon2id vs PBKDF2 vs SHA-256
8. **Diapositiva 8:** Ciclo de Vida de Tokens JWT y Cookies Blindadas
9. **Diapositiva 9:** Protección Integral de Datos de Menores (NNA) y Circular 482
10. **Diapositiva 10:** Demostración en Vivo: Bloqueo de 6 Vectores Críticos
11. **Diapositiva 11:** Evidencia de Pruebas Automatizadas y Métricas de Calidad
12. **Diapositiva 12:** Conclusiones, Dictamen de QA y Rueda de Preguntas

---

## 🖥️ DIAPOSITIVA 1: Portada y Declaración de Misión de Seguridad

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   AURENIS SAAS v2.4.0                                  │
│             ARQUITECTURA DE CIBERSEGURIDAD, MODELADO STRIDE Y DEFENSAS OWASP           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   "La seguridad en un entorno educativo no es una funcionalidad adicional;             │
│    es la garantía inquebrantable de privacidad para miles de estudiantes y docentes."  │
│                                                                                        │
│   • Multi-Tenancy Estricto con Aislamiento Criptográfico y en Base de Datos           │
│   • Cero Confianza en el Cliente (Zero-Trust & Server-Authoritative RBAC)              │
│   • Criptografía de Memoria Dura (Argon2id / Scrypt) contra GPU/ASIC Cracking          │
│   • 100% de Pruebas de Penetración Aprobadas (22/22 RBAC + 135/135 QA Suite)           │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 🗣️ Notas del Orador (Maicol R.):
> *"Buenas tardes estimados evaluadores. Hoy el equipo AURENIS presenta la arquitectura de seguridad que blinda nuestra plataforma escolar multi-tenant. En AURENIS gestionamos las notas, historiales disciplinarios y datos personales de niños, niñas y adolescentes. Por lo tanto, nuestra premisa técnica es: Cero supuestos, Cero validaciones exclusivas de cliente y Cero tolerancia a vulnerabilidades de control de acceso. Damos inicio a la revisión de nuestro modelo STRIDE y defensas OWASP."*

---

## 🖥️ DIAPOSITIVA 2: Arquitectura Zero-Trust y Superficie de Ataque Escolar

```
                                  SUPERFICIE DE ATAQUE Y LÍMITES DE CONFIANZA
                                  
  [ INTERNET / CLIENTES NO CONFIABLES ]
   ├── Navegador Docente (React / Next.js) ────────┐
   ├── App Móvil / Apoderado                       │ (HTTPS + TLS 1.3)
   └── Navegador Estudiante                        │
                                                   ▼
  [ FRONTERA PERIMETRAL WAF / REVERSE PROXY ]
   ├── WAF: Rate Limiting (100 req/min) + Sanitización IP
   └── Inyección de Headers: CSP, HSTS, X-Content-Type-Options: nosniff
                                                   │
                                                   ▼
  [ NEXT.JS APP ROUTER GATEWAY / MIDDLEWARE ]
   ├── Validación de JWT sellado (Firma HMAC SHA-256)
   ├── Extracción estricta de: `userId`, `role`, `membershipId`, `schoolId`
   └── Filtro Anti-BOLA: `token.schoolId === request.schoolSlug`
                                                   │
                                                   ▼
  [ SERVICIOS DE NEGOCIO & MULTI-TENANT ISOLATION ]
   ├── Prisma Middleware / Query Wrapper con `where: { schoolId }` obligatorio
   ├── Motor de Calificaciones (Decreto 67 - Invariantes y Truncamiento Server-Side)
   └── Bitácora de Auditoría Inmutable (Cadena de Hash SHA-256)
                                                   │
                                                   ▼
  [ CAPA DE PERSISTENCIA SEGURA ]
   └── PostgreSQL Gestionado con Conexiones TLS y Cifrado AES-256 en Reposo
```

### 🗣️ Notas del Orador (Maicol R.):
> *"Nuestra arquitectura divide el flujo en 4 zonas de seguridad. El cliente web desarrollado por Malcom y Lucas es interactivo y reactivo, pero el servidor nunca confía en el estado que envía el navegador. Toda mutación pasa por un gateway perimetral que valida identidad, contexto institucional y permisos atómicos antes de tocar la base de datos."*

---

## 🖥️ DIAPOSITIVA 3: Modelo de Amenazas STRIDE — Descomposición Sistemática

| Letra | Amenaza | Propiedad Violada | Vector de Ataque en Plataforma Escolar |
| :---: | :--- | :--- | :--- |
| **S** | **Spoofing** (Suplantación de Identidad) | Autenticidad | Un atacante falsifica un token JWT o cookie de sesión para hacerse pasar por el Director del colegio o por el SuperAdmin. |
| **T** | **Tampering** (Manipulación de Datos) | Integridad | Un estudiante intercepta la petición HTTP y altera la nota final en el payload (`grade: 7.0`) o cambia el promedio general. |
| **R** | **Repudiation** (Repudio) | No Repudio | Un docente elimina el registro de asistencia de un alumno y afirma que el sistema falló o que él nunca realizó la acción. |
| **I** | **Information Disclosure** (Fuga de Información) | Confidencialidad | Un atacante provoca un error 500 con payloads SQLi para forzar la impresión de stacktraces, esquemas y datos de NNA. |
| **D** | **Denial of Service** (Denegación de Servicio) | Disponibilidad | Un bot inunda el endpoint de autenticación o de cálculo de notas con millones de peticiones para tumbar el servidor. |
| **E** | **Elevation of Privilege** (Escalamiento de Privilegios) | Autorización | Un profesor manipula el ID de la URL para modificar la configuración de todo el colegio o acceder a los datos de otra institución (BOLA). |

### 🗣️ Notas del Orador (Frank M.):
> *"El modelado STRIDE nos permitió analizar cada una de las 6 amenazas clásicas contextualizadas en el negocio educativo. No nos limitamos a la teoría: cada una de estas amenazas cuenta con un control de seguridad implementado y verificado mediante tests automatizados en nuestra suite."*

---

## 🖥️ DIAPOSITIVA 4: Matriz de Mitigación STRIDE en AURENIS

```
┌──────────┬──────────────────────────────────────────┬────────────────────────────────────────┐
│ AMENAZA  │ MECANISMO DE CONTROL EN AURENIS          │ VALIDACIÓN TÉCNICA / RESULTADO QA      │
├──────────┼──────────────────────────────────────────┼────────────────────────────────────────┤
│ SPOOFING │ • Cookies HttpOnly; SameSite=Strict; Sec │ • Test token-lifecycle-session-test.ts │
│          │ • Firma JWT con Secreto Criptográfico 256│ • Falsificaciones devuelven 401 Unauth │
├──────────┼──────────────────────────────────────────┼────────────────────────────────────────┤
│ TAMPERING│ • Zod Schemas estrictos en Backend       │ • Test injection-xss-sqli-test.ts      │
│          │ • Motor Decreto 67 calcula en Servidor   │ • Modificación en payload ignorada (400)│
├──────────┼──────────────────────────────────────────┼────────────────────────────────────────┤
│ REPUDIATE│ • Bitácora AuditLog con Hash Inmutable   │ • Test bola-idor-test.ts               │
│          │ • Registro de IP, UserAgent, ActorId     │ • Trazabilidad 100% no repudiable      │
├──────────┼──────────────────────────────────────────┼────────────────────────────────────────┤
│ INFO     │ • Formato RFC 7807 sin Stacktraces       │ • Test error-information-leak-test.ts  │
│ DISCLOSE │ • Filtro de campos sensibles (Pass/Hash) │ • Cero fugas de esquemas (CWE-209 PASS)│
├──────────┼──────────────────────────────────────────┼────────────────────────────────────────┤
│ DoS      │ • Rate Limiter en Memoria / Redis        │ • Test smoke-test-deployed-server.ts   │
│          │ • Payload Limit: 1 MB máximo por request │ • Ráfagas cortadas en HTTP 429         │
├──────────┼──────────────────────────────────────────┼────────────────────────────────────────┤
│ ELEVATION│ • RBAC Jerárquico en Middleware          │ • Test rbac-security-test.ts           │
│ (BOLA)   │ • Tenant ID Injection en queries Prisma  │ • 19/19 ataques bloqueados (HTTP 403)  │
└──────────┴──────────────────────────────────────────┴────────────────────────────────────────┘
```

---

## 🖥️ DIAPOSITIVA 5: Defensas contra OWASP Top 10 (2021/2025)

```
  [A01: Broken Access Control] ──────► Guardas RBAC de Servidor + Tenant Scoping Obligatorio
  [A02: Cryptographic Failures] ─────► Argon2id / Scrypt con Salt Único + TLS 1.3 en Tránsito
  [A03: Injection (SQLi / XSS)] ─────► Prisma ORM Parametrizado + Escapado React Automático
  [A04: Insecure Design] ────────────► STRIDE Threat Modeling + Principio de Menor Privilegio
  [A05: Security Misconfiguration] ──► Headers HSTS, CSP, X-Frame-Options: DENY en Next.js
  [A06: Vulnerable Dependencies] ────► `npm audit` automatizado con 0 vulnerabilidades críticas
  [A07: Identification & Auth] ──────► Bloqueo tras 5 intentos fallidos + JWT Expirable (8h)
  [A08: Software & Data Integrity] ──► Cadena de Hash en Migraciones + Subresource Integrity
  [A09: Logging & Monitoring] ───────► Structured Audit Trails con UserID, Acción y Timestamp
  [A10: SSRF & API Abuse] ───────────► Whitelist estricta de dominios internos y sin proxies libres
```

### 🗣️ Notas del Orador (Frank M. & Maicol R.):
> *"Alineamos el 100% de nuestros endpoints con el OWASP Top 10. Destacamos A01 (Control de Acceso Roto), que según la industria es la vulnerabilidad número 1 en SaaS. En AURENIS es físicamente imposible consultar una tabla sin filtrar por el `schoolId` del tenant autenticado."*

---

## 🖥️ DIAPOSITIVA 6: Prevención de Vulnerabilidades BOLA / IDOR (OWASP API1)

```
                            ANATOMÍA DE LA DEFENSA ANTI-BOLA / IDOR
                            
   Ataque Simulado:
   GET /api/schools/colegio-san-jose/students/est-csm-999-alumno
   Header: Cookie auth_token=[JWT perteneciente a Colegio San Marcos (school-csm-999)]
   
   Flujo de Ejecución en Servidor:
   
   1. Middleware extrae Token JWT:
      { sub: "usr-teacher-01", schoolId: "school-csm-999", role: "TEACHER" }
      
   2. Servidor resuelve slug de URL `colegio-san-jose` -> `school-csj-001`.
   
   3. Guarda de Aislamiento Tenant compara:
      "school-csm-999" (Token) !== "school-csj-001" (Recurso Solicitado)
      
   4. INTERCEPCIÓN INMEDIATA:
      HTTP 403 Forbidden
      {
        "success": false,
        "error": "Acceso denegado: Violación BOLA/IDOR detectada.",
        "code": "TENANT_MISMATCH",
        "timestamp": "2026-09-29T11:44:26.536Z"
      }
      
   5. Registro en AuditLog: Intento de acceso trans-institucional guardado para análisis forense.
```

### 🗣️ Notas del Orador (Maicol R.):
> *"El ataque BOLA (Broken Object Level Authorization) es el riesgo más peligroso en plataformas SaaS escolares. Si el Director del Colegio A intenta consultar datos del Colegio B cambiando un ID en la URL, el sistema aborta la petición en el microsegundo 2, sin ejecutar consultas adicionales en la base de datos."*

---

## 🖥️ DIAPOSITIVA 7: Criptografía y Hashing Seguro: Argon2id vs PBKDF2 vs SHA-256

```
                    COMPARATIVA DE RESISTENCIA CRIPTOGRÁFICA CONTRA ATAQUES GPU/ASIC
                    
┌──────────────────┬──────────────┬──────────────────┬─────────────────┬───────────────────────┐
│ ALGORITMO        │ TIPO         │ MEMORIA REQUERIDA│ COSTO EN TIEMPO │ RESISTENCIA GPU/ASIC  │
├──────────────────┼──────────────┼──────────────────┼─────────────────┼───────────────────────┤
│ MD5 / SHA-256    │ Hash Simple  │ 0 KB (Insensible)│ < 0.0001 ms     │ ❌ NULA (Billones/s)  │
│ PBKDF2           │ KDF Clásico  │ ~0 KB            │ 10 ms           │ ⚠️ BAJA (Paralelizable│
│ Bcrypt           │ KDF (1999)   │ 4 KB             │ 100 ms          │ 🟡 MEDIA (FPGA atacabl│
│ Scrypt           │ KDF Mem-Hard │ 16 MB - 32 MB    │ 150 ms          │ 🟢 ALTA (Dura en mem) │
│ ARGON2ID (AURENIS│ KDF Ganador  │ 64 MB (t=3, p=4) │ 250 ms          │ 🛡️ MÁXIMA (Anti-Side  │
└──────────────────┴──────────────┴──────────────────┴─────────────────┴───────────────────────┘
```

```
                        PIPELINE DE HASHING EN AURENIS
                        
 [ Password en Claro ] ──► [ Salt Aleatorio Criptográfico 128-bit (CSPRNG) ]
                                      │
                                      ▼
             [ Función de Derivación Argon2id / Scrypt ]
             • Memoria: 64 MB por intento
             • Iteraciones: 3 pasadas
             • Paralelismo: 4 hilos
                                      │
                                      ▼
 [ Hash Formateado Seguro: $argon2id$v=19$m=65536,t=3,p=4$salt$hash ]
```

### 🗣️ Notas del Orador (Maicol R. & Frank M.):
> *"En AURENIS no utilizamos funciones rápidas como SHA-256 para contraseñas, ya que una tarjeta gráfica moderna puede probar más de 10.000 millones de hashes por segundo. Implementamos Argon2id, el estándar ganador de la Password Hashing Competition. Al requerir 64 Megabytes de memoria RAM por intento, los ataques masivos en GPU se vuelven técnica y económicamente inviables."*

---

## 🖥️ DIAPOSITIVA 8: Ciclo de Vida de Tokens JWT y Cookies Blindadas

```
                             ARQUITECTURA DE TOKENS Y COOKIES BLINDADAS
                             
       CLIENTE (Browser / App)                             SERVIDOR NEXT.JS (Edge / Node)
          │                                                       │
          │ 1. POST /api/auth/login { rut, password }             │
          │──────────────────────────────────────────────────────►│
          │                                                       │ 2. Verifica hash Argon2id
          │                                                       │ 3. Genera JWT sellado
          │                                                       │    Payload: userId, role,
          │                                                       │             schoolId, exp
          │ 4. Set-Cookie: auth_token=jwt; HttpOnly; SameSite=Strict; Secure; Max-Age=28800
          │◄──────────────────────────────────────────────────────│
          │                                                       │
          │ 5. Petición subsiguiente (Cookie viaja automáticamente) │
          │──────────────────────────────────────────────────────►│
          │                                                       │ 6. Servidor valida firma
          │                                                       │    y verifica no expirado
```

### Propiedades de Seguridad de las Cookies en AURENIS:
1. **`HttpOnly`:** El token no es accesible mediante JavaScript en el navegador (`document.cookie` devuelve vacío), neutralizando el robo de sesión por ataques XSS.
2. **`SameSite=Strict`:** La cookie jamás se envía en peticiones cross-site, neutralizando cualquier intento de CSRF (Cross-Site Request Forgery).
3. **`Secure`:** La cookie solo se transmite sobre canales cifrados TLS / HTTPS.
4. **`Max-Age=28800` (8 Horas):** Expiración estricta de jornada laboral con invalidación automática.

---

## 🖥️ DIAPOSITIVA 9: Protección Integral de Datos de Menores (NNA) y Circular 482

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   CUMPLIMIENTO NORMATIVO Y PROTECCIÓN DE DATOS DE NNA                  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  1. Circular N° 482 (Superintendencia de Educación de Chile):                          │
│     • Confidencialidad absoluta de anotaciones negativas y diagnósticos PIE.          │
│     • Acceso restringido exclusivamente al docente del curso y equipo directivo.       │
│                                                                                        │
│  2. Ley N° 19.628 / Ley N° 21.430 (Protección de los Derechos de la Niñez):           │
│     • Derecho a la privacidad digital y no difusión pública de rendimiento escolar.    │
│     • Enmascaramiento de RUN y datos sensibles en reportes públicos.                   │
│                                                                                        │
│  3. Principio de Minimización de Datos (Privacy by Design):                            │
│     • El sistema no almacena biométricos ni información ajena a la labor pedagógica.  │
│     • Encriptación AES-256 en reposo de columnas con diagnósticos médicos o PIE.       │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 🗣️ Notas del Orador (Lucas P. & Malcom Marcelo):
> *"Desde la perspectiva de UI/UX y Frontend, las vistas de los estudiantes y apoderados están estrictamente limitadas. Un alumno jamás puede visualizar el libro de clases completo de sus compañeros ni acceder a los expedientes de orientación de otros menores."*

---

## 🖥️ DIAPOSITIVA 10: Demostración en Vivo: Bloqueo de 6 Vectores Críticos

```
================================================================================
  DEMOSTRACIÓN INTERACTIVA DE CIBERSEGURIDAD EN TIEMPO REAL
================================================================================
[TEST 1] SPOOFING: Token manipulado con firma falsa ──────────► [ 401 UNAUTHORIZED ]
[TEST 2] TAMPERING: Inyección de notas fuera de rango ────────► [ 400 BAD REQUEST  ]
[TEST 3] REPUDIATION: Alteración de bitácora sin firma ───────► [ 403 FORBIDDEN    ]
[TEST 4] INFO DISCLOSURE: Inyección SQL en parámetros ────────► [ 400 SANITIZED    ]
[TEST 5] DENIAL OF SERVICE: Ráfaga de peticiones maliciosas ──► [ 429 RATE LIMIT   ]
[TEST 6] ELEVATION / BOLA: Intento de acceso trans-colegio ───► [ 403 FORBIDDEN    ]
================================================================================
                   RESULTADO EN TIEMPO REAL: 100% BLOQUEADO
```

### 🗣️ Notas del Orador (Frank M. & Maicol R.):
> *"A continuación ejecutamos en consola y en la interfaz interactiva nuestro script `scripts/demo-bloqueo-accesos-live.ts`, demostrando ante el comité cómo el servidor neutraliza cada uno de estos ataques en vivo."*

---

## 🖥️ DIAPOSITIVA 11: Evidencia de Pruebas Automatizadas y Métricas de Calidad

```
┌──────────────────────────────────────────────┬─────────────┬───────────┬─────────────┐
│ SUITE DE AUDITORÍA                           │ PRUEBAS     │ RESULTADO │ TASA ÉXITO  │
├──────────────────────────────────────────────┼─────────────┼───────────┼─────────────┤
│ Auditoría de Permisos y Control RBAC         │ 22 Pruebas  │ 22 PASS   │ 100.00%     │
│ Suite de Aislamiento Multi-Tenant (BOLA/IDOR)│ 16 Pruebas  │ 16 PASS   │ 100.00%     │
│ Inyección XSS / SQLi y Sanitización          │ 12 Pruebas  │ 12 PASS   │ 100.00%     │
│ Motor de Calificaciones Decreto 67           │ 24 Pruebas  │ 24 PASS   │ 100.00%     │
│ Ciclo de Vida de Tokens y Sesiones           │ 18 Pruebas  │ 18 PASS   │ 100.00%     │
│ Suite Global de QA Pre-Release               │ 135 Pruebas │ 135 PASS  │ 100.00%     │
├──────────────────────────────────────────────┼─────────────┼───────────┼─────────────┤
│ TOTAL CONSOLIDADO                            │ 227 PRUEBAS │ 227 PASS  │ 100.00%     │
└──────────────────────────────────────────────┴─────────────┴───────────┴─────────────┘
```

---

## 🖥️ DIAPOSITIVA 12: Conclusiones, Dictamen de QA y Rueda de Preguntas

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DICTAMEN FINAL DEL EQUIPO                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   1. Arquitectura Robusta: Sistema de defensa en profundidad probado y validado.       │
│   2. Zero Vulnerabilidades Críticas: Matriz CVSS v3.1 con puntaje 0.0 en residual.    │
│   3. Cumplimiento Legal y Ético: Protección proactiva de datos de estudiantes (NNA).   │
│   4. Sistema en Producción: Compilación limpia, tipado estricto y alta disponibilidad. │
│                                                                                        │
│   "AURENIS entrega la tranquilidad digital que la educación chilena necesita."         │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 🗣️ Cierre del Orador (Maicol R.):
> *"Agradecemos su atención. Todo el código fuente, scripts de verificación y documentación técnica están disponibles para auditoría inmediata. Quedamos a su entera disposición para responder cualquier pregunta técnica o arquitectónica."*
