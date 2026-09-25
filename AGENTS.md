# PROTOCOLO OBLIGATORIO DE INTELIGENCIA ARTIFICIAL Y DIRECTRICES DEL EQUIPO AURENIS

> ⚠️ **DIRECTIVA OBLIGATORIA PARA CUALQUIER AGENTE O MODELO DE IA (AI STUDIO, CURSOR, COPILOT, CLAUDE, ETC.):**
> Este archivo define las reglas inmutables de desarrollo, responsabilidades por integrante, control de calidad y flujo de trabajo para el proyecto **AURENIS**.
> Antes de generar código, sugerir cambios o responder al usuario en CUALQUIER chat o sesión, la IA **DEBE** aplicar rigurosamente este protocolo.

---

## 1. CONTEXTO DEL PROYECTO Y PLAZO DE ENTREGA
- **Proyecto:** AURENIS — Plataforma Integral de Gestión Escolar y Académica Multi-Tenant.
- **Horizonte Temporal:** Restan aproximadamente **30 días** para la entrega final y evaluación del proyecto.
- **Estado Actual:** La base arquitectónica y funcional está en marcha, pero existen frentes críticos pendientes en backend/autorización, frontend reactivo, diseño/UX y suite de pruebas/seguridad.
- **Principio Fundamental:** **CERO PLACEHOLDERS, CERO MOCKS FALSOS Y CERO CÓDIGO DE JUGUETE**. Toda funcionalidad debe ser robusta, tipada, persistente en base de datos y validada en servidor.

---

## 2. INTEGRANTES DEL EQUIPO Y ROLES ASIGNADOS

El equipo está conformado por 4 integrantes con responsabilidades técnicas delimitadas. Cuando un usuario interactúe en el chat, la IA debe identificar quién es o asumir el contexto de su área, asegurando que las respuestas eleven el nivel técnico a la exigencia de su rol:

### 👑 1. Maicol R. — Lead del Proyecto, Arquitectura y Backend
- **Identidad:** Maicol es el **Líder General del Proyecto (Project Lead)** y responsable supremo de que todas las piezas encajen como un producto de software real y coherente.
- **Áreas bajo su responsabilidad directa:**
  - Arquitectura general y coherencia sistémica del software.
  - Backend, Next.js API Routes, Server Actions y middleware de autorización.
  - Base de datos relacional PostgreSQL y ORM Prisma (`prisma/schema.prisma`).
  - Modelado de datos, integridad referencial, índices y migraciones controladas.
  - Autenticación, sesiones JWT/cookies seguras (`httpOnly`, `sameSite`, `secure`).
  - Autorización RBAC estricta validada **exclusivamente en el servidor** (nunca confiar en el cliente).
  - Prevención de ataques BOLA/IDOR mediante validación de `schoolId` y aislamiento multi-tenant.
  - Contratos de API estrictos y validación de esquemas de entrada/salida (Zod).
  - Decisiones de infraestructura, build pipeline y despliegue a producción.
- **Lo que debe defender y demostrar:**
  - Explicar oralmente la arquitectura completa del sistema de punta a punta.
  - Demostrar qué ocurre si un usuario manipula peticiones para acceder a datos ajenos (defensa multi-tenant).
  - Justificar cada decisión técnica con argumentos de ingeniería de software.
- **Instrucción para la IA cuando interactúe con Maicol:**
  - Tratarlo como el Tech Lead del proyecto.
  - Ofrecerle código de backend de grado arquitectónico senior (transacciones Prisma, aislamiento de tenant, tipado estricto, manejo uniforme de errores HTTP y RFC 7807).
  - Ayudarle a auditar y coordinar los entregables de los demás compañeros.

---

### 💻 2. Malcom Marcelo — Frontend Developer & Lógica de Cliente
- **Áreas bajo su responsabilidad directa:**
  - Construcción y lógica interactiva de componentes React y páginas en Next.js (App Router).
  - Sincronización de estados locales y globales, React Hooks, custom hooks limpios.
  - Manejo de formularios con validación en tiempo real y retroalimentación de usuario.
  - Consumo seguro de APIs y Server Actions, manejo de estados de carga (`loading`), éxito y error de red (`error boundaries`).
  - Paridad estricta entre Server-Side Rendering (SSR) y cliente (Cero errores de hidratación).
  - Responsive design impecable en resoluciones móvil, tablet y escritorio.
  - Tipado TypeScript estricto en el frontend (sin uso de `any`).
- **Instrucción para la IA cuando interactúe con Malcom:**
  - Guiarlo en patrones limpios de Next.js / React 19, componentes desacoplados, Server Components vs Client Components.
  - Asegurar que no implemente datos 'hardcodeados' o simulaciones cuando exista un endpoint o contrato con el backend de Maicol.
  - Recomendarle coordinar con Lucas P. para fidelidad de diseño y con Maicol R. para contratos de datos.

---

### 🎨 3. Lucas P. — UI / UX Designer & Frontend Architecture / Design System
- **Áreas bajo su responsabilidad directa:**
  - Arquitectura de interfaz de usuario (UI), diseño visual y experiencia de usuario (UX).
  - Sistema de diseño unificado (*Design System*): paleta cromática, tokens de espaciado, radios, tipografía y sombras consistentes.
  - Micro-interacciones visuales, transiciones sutiles con `motion`, estados *hover*, *focus-visible* y *active*.
  - Maquetación y jerarquía visual de pantallas: Dashboards, Directorios, Libro de Clases, Calificaciones, Asistencia, Fichas de Estudiantes.
  - Accesibilidad visual (cumplimiento WCAG 2.1 AA: contraste ≥ 4.5:1, touch targets ≥ 44px, navegación por teclado).
  - Cero saltos visuales (Cumulative Layout Shift = 0) y prevención de desbordamientos horizontales (*no horizontal overflow*).
- **Instrucción para la IA cuando interactúe con Lucas:**
  - Brindarle soluciones centradas en Tailwind CSS limpio, layouts semánticos, diseño profesional sobrio y consistente con el Design System de AURENIS.
  - Cuidar que no se rompa la estética del sistema ni se introduzcan estilos incoherentes entre pantallas.

---

### 🛡️ 4. Frank M. — QA, Testing & Seguridad
- **Áreas bajo su responsabilidad directa:**
  - Estrategia integral de Aseguramiento de Calidad (QA) y pruebas automatizadas (unitarias, integración y e2e).
  - Auditoría de seguridad técnica activa: OWASP Top 10, prevención de IDOR/BOLA, inyección SQL, XSS, CSRF.
  - Control de acceso vertical (roles no autorizados escalando privilegios) y horizontal (aislamiento entre colegios).
  - Protección de datos sensibles de niños, niñas y adolescentes (NNA), cumplimiento normativo escolar (Circular 482 y Ley de Protección de Datos).
  - Bitácora de hallazgos de seguridad (`SECURITY-FINDINGS-LOG.md`), matrices de riesgo (CVSS v3.1, STRIDE) y verificación de parches (re-testing).
  - Aseguramiento de que el código no pase a producción sin evidencia auditable de pruebas.
- **Instrucción para la IA cuando interactúe con Frank:**
  - Proveer scripts de pruebas, comandos de validación, casos de prueba de penetración (pentest interno) y verificación de vulnerabilidades.
  - Ayudarle a documentar matrices CVSS, reportes de auditoría y tests de regresión antes de declarar una tarea como "DONE".

---

## 3. DEFINICIÓN DE TERMINADO (DEFINITION OF DONE - DoD)
En AURENIS **ninguna tarea se considera terminada** simplemente porque el código se haya escrito. El flujo obligatorio de entrega es:

```
  Diseño & Especificación UX (Lucas P.)
                  ↓
  Implementación Frontend (Malcom Marcelo)
                  ↓
  Contrato API, Backend & Persistencia en DB (Maicol R.)
                  ↓
  Ataque / Validación QA & Pentesting (Frank M.)
                  ↓
  Responsive & Accesibilidad
                  ↓
  Corrección de Hallazgos
                  ↓
  Re-Testing de Seguridad
                  ↓
  Evidencia & Documentación Técnica
                  ↓
               ✅ DONE
```

---

## 4. REGLAS OBLIGATORIAS DE COMPORTAMIENTO PARA LA IA

1. **Comprensión del Contexto de Rol:**
   - Cuando un integrante consulte, la IA debe responder a la altura de su especialidad técnica, indicando con claridad qué archivos corresponden a su ámbito de trabajo.
   - Si se detecta que una tarea involucra a otro compañero, la IA debe indicar la dependencia explícitamente (ej: *"Para este componente, Malcom requiere que Maicol defina primero el endpoint `/api/...` con el schema Zod"*).

2. **Cero Superficialidad (Anti-AI Slop):**
   - Prohibido dejar comentarios tipo `// TODO: Implementar luego` o mockups falsos en endpoints que deben persistir datos.
   - Cada cambio debe resolver el problema de raíz, respetando la estructura existente y sin introducir regresiones.

3. **Verificación Previa a la Respuesta:**
   - La IA debe validar la compilación (`compile_applet` o `npm run build`) y linteo (`lint_applet` o `npm run lint`) antes de dar por finalizada su intervención.

4. **Identificación de Autoría en el Análisis de Código (OBLIGATORIO):**
   - Cada vez que se explique o analice código modificado, se debe indicar expresamente al lado de cada archivo o bloque **el integrante responsable** (Maicol R., Malcom Marcelo, Lucas P., o Frank M.).

5. **Luz Verde Obligatoria para GitHub Push (OBLIGATORIO):**
   - Al finalizar cualquier tarea o ajuste técnico, una vez verificado que el build compila limpiamente y no existen errores, la IA **DEBE** otorgar de forma explícita y visible la **luz verde (aprobación para push a GitHub)** al usuario.

---

## 5. DOCUMENTACIÓN DE REFERENCIA OBLIGATORIA
Para detalles exhaustivos de arquitectura, auditoría y seguridad, consultar:
- `TEAM_ROLES_AND_AI_PROTOCOL.md` (Manual detallado de roles y protocolo para IAs).
- `docs/ARCHITECTURE.md` (Arquitectura técnica y aislamiento multi-tenant).
- `docs/RBAC_PERMISSIONS_MATRIX.md` (Matriz canónica de roles y permisos).
- `docs/STRIDE_THREAT_MODELING.md` (Modelado de amenazas de seguridad).
- `docs/DESIGN_SYSTEM_LUCAS.md` (Sistema de diseño de interfaces).
- `docs/OWASP_SECURITY_CHECKLIST.md` (Checklist de controles de seguridad).
