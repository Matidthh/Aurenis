# GUÍA DE CONTRIBUCIÓN Y GOBERNANZA DE EQUIPO — AURENIS SaaS

> ⚠️ **DIRECTIVA OBLIGATORIA PARA DESARROLLADORES Y ASISTENTES DE INTELIGENCIA ARTIFICIAL:**
> Antes de realizar cualquier cambio, responder consultas, o proponer código o arquitectura, **ES OBLIGATORIO** leer este archivo en su totalidad y verificar la matriz de roles y responsabilidades.
> Este proyecto tiene como directiva estricta: **CERO PLACEHOLDERS, CERO MOCKS FALSOS Y CERO CÓDIGO DE JUGUETE**.

---

## 1. Contexto del Proyecto y Horizonte Temporal
- **Proyecto:** AURENIS — Plataforma Integral de Gestión Escolar y Académica Multi-Tenant.
- **Horizonte Temporal:** Restan aproximadamente **30 días** para la entrega final y evaluación del proyecto.
- **Filosofía Técnica:** Robustez arquitectónica, separación de responsabilidades, tipado estricto (TypeScript sin `any`), paridad SSR/Cliente sin desajustes de hidratación, persistencia real en PostgreSQL con Prisma y aislamiento multi-tenant a nivel de consultas.

---

## 2. Integrantes del Equipo y Asignación de Roles

Toda contribución, revisión de código o interacción debe identificar al integrante y ceñirse a sus responsabilidades técnicas:

### 👑 1. Maicol R. — Lead del Proyecto, Arquitectura y Backend
- **Rol:** Líder General del Proyecto (Project Lead) y Guardián de la Arquitectura.
- **Ámbitos de Trabajo:**
  - Arquitectura sistémica y coherencia end-to-end.
  - Endpoints de backend en Next.js (App Router API Routes `/app/api/...`), Server Actions y Middleware.
  - Base de datos relacional PostgreSQL y ORM Prisma (`prisma/schema.prisma`).
  - Modelado relacional, integridad referencial, índices y migraciones (`prisma migrate`).
  - Autenticación segura (JWT, cookies `httpOnly`, `sameSite`, `secure`).
  - Autorización RBAC estricta validada **en el servidor** (prevención BOLA/IDOR por `schoolId`).
  - Contratos de API estrictos, esquemas Zod y códigos de error estándar.
  - Infraestructura, pipeline de compilación y despliegue a producción.

### 💻 2. Malcom Marcelo — Frontend Developer & Lógica de Cliente
- **Rol:** Desarrollador Frontend y Lógica de Interacción React.
- **Ámbitos de Trabajo:**
  - Componentes React y páginas Next.js App Router (`app/(dashboard)/...`, `components/...`).
  - Sincronización de estados locales/globales y custom hooks limpios.
  - Formularios con validación en tiempo real y feedback al usuario.
  - Consumo de APIs y Server Actions, manejo de `loading`, `error`, `empty` states y error boundaries.
  - Cero discrepancias SSR/Cliente (prevención de errores de hidratación).
  - Responsive design en dispositivos móviles, tablets y escritorios.
  - Tipado TypeScript estricto en frontend (cero `any`).

### 🎨 3. Lucas P. — UI / UX Designer & Frontend Architecture / Design System
- **Rol:** Diseñador UI/UX y Arquitecto del Design System.
- **Ámbitos de Trabajo:**
  - Arquitectura visual y experiencia de usuario.
  - Tokens de diseño: paleta de colores, espaciados, radios de borde, tipografía y sombras consistentes.
  - Micro-interacciones y transiciones con `motion/react`.
  - Estados interactivos: `hover`, `focus-visible`, `active`, `disabled`.
  - Maquetación y jerarquía visual: Dashboards, Directorios, Libro de Clases, Calificaciones, Asistencia.
  - Accesibilidad WCAG 2.1 AA (contraste ≥ 4.5:1, touch targets ≥ 44px, navegación por teclado).
  - Cero saltos visuales (CLS = 0) y sin desbordamientos horizontales.

### 🛡️ 4. Frank M. — QA, Testing & Seguridad
- **Rol:** Líder de Calidad (QA), Pruebas y Ciberseguridad.
- **Ámbitos de Trabajo:**
  - Estrategia integral de QA, tests unitarios, de integración y end-to-end.
  - Auditoría de seguridad OWASP Top 10: IDOR/BOLA, SQLi, XSS, CSRF, Session Hijacking.
  - Control de acceso vertical (escalada de privilegios) y horizontal (aislamiento multi-tenant entre colegios).
  - Protección de datos sensibles de niños, niñas y adolescentes (NNA), Circular 482 y Ley de Protección de Datos.
  - Bitácora de hallazgos (`SECURITY-FINDINGS-LOG.md`), matrices de riesgo (CVSS v3.1, STRIDE) y actas de re-testing.
  - Verificación formal de que ningún código se despliegue a producción sin evidencia auditable.

---

## 3. Flujo de Trabajo Obligatorio (Definition of Done - DoD)

Ningún ticket, feature o corrección se considera terminado sin recorrer el siguiente pipeline:

```
  1. Diseño & Especificación UX (Lucas P.)
                  ↓
  2. Implementación Frontend (Malcom Marcelo)
                  ↓
  3. Contrato API, Backend & Persistencia en DB (Maicol R.)
                  ↓
  4. Ataque / Validación QA & Pentesting (Frank M.)
                  ↓
  5. Responsive & Accesibilidad (Lucas P. & Malcom Marcelo)
                  ↓
  6. Corrección de Hallazgos y Re-Testing (Frank M.)
                  ↓
  7. Evidencia, Documentación & Certificación
                  ↓
               ✅ DONE
```

---

## 4. Directivas de Código y Estándares de Ingeniería

1. **TypeScript Estricto:** Prohibido el uso de `any` no tipado. Toda interfaz de datos debe estar modelada y sincronizada con el esquema de Prisma o los DTOs de Zod.
2. **Server-Side Authorization:** Nunca confiar en el cliente para determinar permisos o tenencia (`schoolId`). Toda verificación de roles y aislamiento debe resolverse en el servidor.
3. **No Slop:** No se permiten comentarios con `TODO: implementar luego` en código de producción, ni mocks provisionales cuando existe el modelo de base de datos.
4. **Verificación de Compilación y Calidad:** Cada cambio debe compilar limpiamente (`npm run build`) y pasar los chequeos de linteo (`npm run lint`).
5. **Aprobación de Push:** Todo push a GitHub requiere verificación explícita y asignación de autoría por integrante.

---

## 5. Documentación de Soporte Obligatoria
- `AGENTS.md` — Protocolo canónico de IA y directrices del equipo.
- `TEAM_ROLES_AND_AI_PROTOCOL.md` — Manual detallado de roles, gobernanza y auditoría.
- `docs/ARCHITECTURE.md` — Arquitectura técnica y aislamiento multi-tenant.
- `docs/RBAC_PERMISSIONS_MATRIX.md` — Matriz canónica de roles y permisos.
- `docs/STRIDE_THREAT_MODELING.md` — Modelado de amenazas y vectores de ataque.
- `docs/DESIGN_SYSTEM_LUCAS.md` — Sistema de diseño y tokens visuales.
