# 🛡️ MODELO DE AMENAZAS — AURENIS (THREAT_MODEL.md)

**Plataforma:** AURENIS — Sistema de Gestión Escolar y Académica Multi-Tenant  
**Estándar:** Microsoft STRIDE Threat Model & OWASP Threat Modeling Framework  
**Puntuación de Riesgo:** CVSS v3.1 / DREAD Matrix  
**Fecha:** Septiembre 2026  
**Responsables Técnicos:** Frank M. (QA & Seguridad), Maicol R. (Arquitectura & Backend)

---

## 1. Inventario de Activos Críticos y Datos Sensibles

1. **Datos Personales y de Niños, Niñas y Adolescentes (NNA):**
   - RUN/RUT, nombres, fecha de nacimiento, teléfonos, direcciones particulares de estudiantes y apoderados.
   - Historial médico, diagnósticos NEE (Necesidades Educativas Especiales), registros de vulnerabilidad social y psicosocial.
2. **Registros Académicos y Legales:**
   - Calificaciones oficiales, actas de evaluación semestral/anual, asistencia diaria, libro de clases digital auditado por el MINEDUC/Superintendencia.
3. **Credenciales y Secretos de Infraestructura:**
   - Hashes de contraseñas de usuarios (`bcrypt`), tokens de sesión JWT, secretos de cifrado (`JWT_SECRET`, `DATA_ENCRYPTION_KEY`), credenciales de conexión a PostgreSQL.
4. **Disponibilidad del Servicio:**
   - Operatividad del sistema durante periodos críticos: cierres de actas, registro de asistencia matutina, publicación de promedios.

---

## 2. Actores de Amenaza (Threat Actors)

| Actor | Motivación | Nivel de Habilidad | Vectores Probables |
| :--- | :--- | :--- | :--- |
| **Estudiante Malicioso / Curioso** | Modificar calificaciones, ver notas de compañeros, alterar registros de asistencia. | Bajo - Medio | Manipulación de parámetros de URL (IDOR), inyección de scripts (XSS), manipulación de payload en DevTools. |
| **Docente Descontento / No Autorizado** | Acceder a cursos ajenos, modificar actas fuera de plazo, ver datos confidenciales NEE. | Medio | Abuso de privilegios verticales, elusión de validaciones de membresía, acceso directo a endpoints API. |
| **Atacante Externo Oportunista** | Secuestro de credenciales, exfiltración masiva de datos (BOLA), denegación de servicio (DoS). | Medio - Alto | Ataques de fuerza bruta, Credential Stuffing, escaneo automatizado de vulnerabilidades OWASP, inyecciones SQL/NoSQL. |
| **Administrador Escolar Malicioso** | Intentar acceder a datos de otros colegios en la misma plataforma compartida (Multi-Tenant Breach). | Medio | Manipulación de `schoolId` o slugs institucionales en cabeceras y parámetros. |

---

## 3. Límites de Confianza (Trust Boundaries)

```
[ INTERNET / CLIENTE WEB (Navegador, React, LocalStorage - NO CONFIABLE) ]
                              │
                    (HTTPS / TLS 1.3)
                              ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [Trust Boundary 1: Edge & Perímetro]                                   │
│ Next.js Reverse Proxy + WAF (SecurityFirewallService) + middleware.ts │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │ Inyección de cabeceras seguras (x-auth-*)
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [Trust Boundary 2: Backend API & Servicios de Negocio]                │
│ Next.js API Routes + Server Actions + Zod Validation + RBAC Resolver  │
└────────────────────────────────┬───────────────────────────────────────┘
                                 │ Cláusulas where compuestas { id, schoolId }
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│ [Trust Boundary 3: Capa de Persistencia & Base de Datos]               │
│ Prisma ORM + PostgreSQL + Cifrado AES-256-GCM en Reposo               │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Matriz de Amenazas STRIDE y Mitigaciones Implementadas

### S — Spoofing (Suplantación de Identidad)
- **Amenaza:** Un usuario inyecta cabeceras `x-user-id` o adultera el JWT para suplantar a un directivo.
- **Mitigación:** 
  - Purga zero-trust de cabeceras entrantes en `middleware.ts` antes de procesar cualquier solicitud.
  - Firma HS256 con clave simétrica robusta; verificación criptográfica exclusiva en el servidor.
  - Revocación instantánea en `session-revocation.ts` al cerrar sesión.
- **DREAD Score:** 2.4 (Bajo / Totalmente Mitigado).

### T — Tampering (Manipulación de Datos)
- **Amenaza:** Alteración de notas enviando un PUT/POST con IDs de otros estudiantes o materias.
- **Mitigación:** 
  - Validación de esquemas estrictos con `zod` (`parse`/`safeParse`).
  - Verificación de titularidad de curso y matrícula en `object-authorization.ts` antes de persistir cualquier registro en Prisma.
- **DREAD Score:** 2.8 (Bajo / Totalmente Mitigado).

### R — Repudiation (Repudio)
- **Amenaza:** Un docente modifica una calificación o borra una anotación y niega haber realizado la acción.
- **Mitigación:** 
  - Bitácora inmutable de auditoría con registro de `userId`, `action`, `entityId`, `schoolId`, `timestamp` y `requestId`.
- **DREAD Score:** 3.0 (Bajo / Totalmente Mitigado).

### I — Information Disclosure (Exposición de Información)
- **Amenaza:** Fuga de RUTs, teléfonos o diagnósticos NEE mediante respuestas de error detalladas o endpoints sin filtro.
- **Mitigación:** 
  - DTOs y proyecciones `select` explícitas en Prisma (sin devolver `passwordHash` ni datos no solicitados).
  - Sanitización y encriptación de datos sensibles con AES-256-GCM.
  - Ocultación de stacktraces en entornos de producción mediante `formatErrorResponse`.
- **DREAD Score:** 2.6 (Bajo / Totalmente Mitigado).

### D — Denial of Service (Denegación de Servicio)
- **Amenaza:** Bombardeo masivo de peticiones contra endpoints de autenticación o búsqueda para saturar el pool de PostgreSQL.
- **Mitigación:** 
  - Rate Limiter en memoria con ventanas deslizantes (`rate-limiter.ts`) limitando peticiones por IP y usuario.
  - Límites en payload de entrada (JSON body size limits) y protección anti-ReDoS.
- **DREAD Score:** 3.2 (Bajo / Mitigado).

### E — Elevation of Privilege (Escalamiento de Privilegios)
- **Amenaza:** Un estudiante o profesor invoca una API administrativa cambiando su rol en el cliente o navegando a rutas de SuperAdmin.
- **Mitigación:** 
  - RBAC estricto evaluado en servidor (`hasPermission` / `requirePermission`).
  - Bloqueo en middleware de rutas `/system/*` para usuarios no administradores globales.
  - Validación de membresía institucional activa en cada operación.
- **DREAD Score:** 2.2 (Bajo / Totalmente Mitigado).

---

## 5. Resumen de Puntuaciones CVSS v3.1 Post-Mitigación

| Vector de Ataque | CVSS v3.1 Base | CVSS v3.1 Mitigado | Estado |
| :--- | :---: | :---: | :--- |
| **BOLA / IDOR entre Colegios** | 8.8 (Alto) | **0.0 (None)** | ✅ Resuelto en Middleware + Prisma Object Authorization |
| **Falsificación de Cabeceras x-auth** | 9.8 (Crítico) | **0.0 (None)** | ✅ Resuelto con Header Purge en Middleware |
| **Escalamiento Vertical a Admin** | 8.8 (Alto) | **0.0 (None)** | ✅ Resuelto con Server-Side RBAC & Session Token Verify |
| **Fuerza Bruta en /api/auth/login** | 7.5 (Alto) | **2.6 (Bajo)** | ✅ Resuelto con Rate Limiting & Account Lockout |
| **Inyección XSS en Libro de Clases**| 6.1 (Medio) | **0.0 (None)** | ✅ Resuelto con DOMPurify, Sanitización & CSP |
