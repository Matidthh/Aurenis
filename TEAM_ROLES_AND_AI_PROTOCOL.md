# PROTOCOLO DE AUDITORÍA DE ROLES, GOBERNANZA TÉCNICA Y GUÍA PARA AGENTES DE IA — AURENIS v1.0

> 📌 **DOCUMENTO DE LECTURA OBLIGATORIA PARA CUALQUIER ASISTENTE O AGENTE DE INTELIGENCIA ARTIFICIAL (AI STUDIO, CURSOR, WINDSURF, COPILOT, CLAUDE, ETC.) Y GUÍA OFICIAL DEL EQUIPO DE DESARROLLO.**
> 
> *Versión:* 1.0.0 — Gobernanza & Sprint Final (30 Días para Entrega Oficial)  
> *Líder General del Proyecto (Project & Tech Lead):* **Maicol R.**  
> *Equipo Técnico:* **Maicol R.**, **Malcom Marcelo**, **Lucas P.**, **Frank M.**

---

## 🧭 1. PROPÓSITO DE ESTE DOCUMENTO

Este documento fue diseñado e implementado por el **Tech Lead (Maicol R.)** para asegurar que cualquier inteligencia artificial que opere en este repositorio —en este chat o en chats independientes utilizados por los diferentes miembros del equipo— comprenda de inmediato:

1. **Quiénes integran el proyecto y qué rol específico tiene cada uno.**
2. **Qué debe hacer y qué NO debe hacer cada integrante** para no invadir áreas ajenas ni generar incongruencias.
3. **Cómo debe responder la IA a cada integrante** para proporcionarle soluciones de nivel profesional acorde a su responsabilidad real, sin código superficial ni mocks falsos.
4. **El estándar inmutable de Definition of Done (DoD)** que garantiza que una funcionalidad esté verdaderamente terminada.
5. **El plan de trabajo y prioridades para los próximos 30 días**, asegurando que el producto llegue al día de la entrega con el 100% de coherencia técnica, seguridad y robustez.

---

## 👥 2. AUDITORÍA DETALLADA DE ROLES Y RESPONSABILIDADES

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        ORGANIGRAMA Y FLUJO DE RESPONSABILIDADES                        │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                  MAICOL R.                                             │
│                 Lead General / Arquitectura, Backend, DB & Seguridad                   │
│                                       │                                                │
│         ┌─────────────────────────────┼─────────────────────────────┐                  │
│         ▼                             ▼                             ▼                  │
│     LUCAS P.                  MALCOM MARCELO                    FRANK M.               │
│ UI/UX Lead & Design System     Frontend Developer          QA, Testing & Seguridad     │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### 👑 1. MAICOL R. — Lead / Arquitectura, Backend, Persistencia y Seguridad

#### Responsabilidad Real
Maicol no es solo el desarrollador backend; es el **Líder Técnico del Proyecto** y quien garantiza que todas las piezas del sistema funcionen como un producto de ingeniería coherente, seguro y escalable.

#### Áreas de Dominio Técnico
- **Arquitectura General del Sistema:** Diseño en capas, flujo unificado de peticiones, separación estricta de responsabilidades.
- **Backend & APIs:** Next.js Server Actions y Route Handlers (`app/api/*`) con validación de esquemas Zod en tiempo de ejecución.
- **Base de Datos & ORM:** PostgreSQL y Prisma (`prisma/schema.prisma`), modelo relacional normalizado, integridad referencial, índices para consultas críticas y migraciones controladas.
- **Autenticación & Sesiones:** Manejo seguro de credenciales con hashing (bcrypt/argon2), tokens JWT, cookies `httpOnly`, `sameSite: 'lax'`, `secure` en producción.
- **Autorización & RBAC:** Control de acceso basado en roles (`SYSTEM_ADMIN`, `SCHOOL_ADMIN`, `TEACHER`, `STUDENT`, `GUARDIAN`) evaluado y forzado **estrictamente en el servidor**.
- **Aislamiento Multi-Tenant:** Validación rigurosa del discriminador `schoolId` en cada query para impedir acceso cruzado entre instituciones (BOLA/IDOR).
- **Despliegue e Infraestructura:** Pipeline de build (`package.json`, `next.config.ts`, `server.ts`), configuración de entorno (`.env.example`), variables de entorno no expuestas al cliente.

#### Lo que debe lograr y defender oralmente
1. **Explicación Arquitectónica:** Debe poder diagramar y explicar oralmente el flujo completo:
   `Frontend (React) ➔ Next.js Server / API ➔ Validaciones (Zod) ➔ Autorización (RBAC) ➔ Prisma ORM ➔ PostgreSQL`.
2. **Defensa ante Vulnerabilidades:** Demostrar exactamente qué ocurre cuando un usuario malintencionado manipula una petición HTTP intentando ver datos de otro colegio u otro alumno.
3. **Manejo de Errores Estándar:** Respuestas HTTP uniformes basadas en RFC 7807 (Problem Details for HTTP APIs) con códigos de estado correctos (`400`, `401`, `403`, `404`, `422`, `500`).

#### Directiva de la IA al interactuar con Maicol
- Reconocerlo como el Tech Lead del proyecto.
- Entregarle soluciones de arquitectura senior: transacciones ACID en Prisma (`prisma.$transaction`), consultas optimizadas con `select` selectivo, validación defensiva de sesión y scripts de despliegue deterministas.
- Asistirlo en la supervisión de los contratos API que requerirá el frontend de Malcom y los flujos que auditará Frank.

---

### 💻 2. MALCOM MARCELO — Frontend Developer & Lógica Interactiva de Cliente

#### Responsabilidad Real
Malcom es el encargado de convertir los diseños e interfaces en una aplicación web interactiva, fluida, reactiva y libre de errores en el navegador.

#### Áreas de Dominio Técnico
- **Componentes React & Next.js App Router:** Desarrollo de páginas y componentes modulares bajo arquitectura Server Components vs. Client Components (`'use client'`).
- **Gestión de Estados:** Estado local y global coherente, sincronización reactiva, custom hooks limpios y desacoplados.
- **Formularios & Validación de Cliente:** Formularios dinámicos con retroalimentación instantánea, prevención de envíos duplicados (`submitting state`).
- **Consumo de APIs & Manejo de Red:** Integración con los endpoints de Maicol, gestión robusta de estados de carga (`loading skeletons`), estados vacíos (`empty states`) y manejo de errores con *Error Boundaries*.
- **Paridad SSR e Hidratación:** Cero errores de mismatch entre servidor y cliente (cero advertencias `Hydration failed`).
- **Responsividad:** Adaptabilidad total en resoluciones móvil (320px+), tablet (768px+) y escritorio (1024px+).
- **Tipado TypeScript:** Cero uso de `any`, interfaces compartidas y tipado estricto en props y retornos de funciones.

#### Lo que debe lograr y defender oralmente
1. **Flujo de Datos en el Cliente:** Explicar cómo viaja la información desde la interacción del usuario hasta la mutación en el servidor y su reflejo inmediato en la UI.
2. **Resiliencia ante Fallos de Red:** Demostrar cómo se comporta la interfaz cuando el servidor responde con error `500`, tiempo de espera agotado o credenciales inválidas.
3. **Optimización de Rendimiento:** Demostrar que no existen re-renders infinitos y que el bundle de cliente está optimizado.

#### Directiva de la IA al interactuar con Malcom
- Proporcionar componentes React limpios, optimizados para React 19 y Next.js 15+.
- Exigir siempre la integración con APIs y Server Actions reales; prohibir la inserción de arreglos estáticos locales o datos simulados cuando debe haber persistencia.
- Recordarle coordinar con Lucas P. para las clases visuales y tokens del Design System, y con Maicol R. para la firma de las APIs.

---

### 🎨 3. LUCAS P. — UI / UX Designer & Frontend Architecture / Design System

#### Responsabilidad Real
Lucas es el custodio de la experiencia de usuario y la coherencia visual de AURENIS. Es quien asegura que la plataforma luzca como un software educativo de categoría mundial, intuitivo, elegante y sin fricciones.

#### Áreas de Dominio Técnico
- **Design System & Tokens:** Estandarización de paleta de colores, tokens de tipografía, escalas de espaciado, radios de borde (`rounded-xl`, `rounded-2xl`) y sombras sutiles.
- **Jerarquía y Composición Visual:** Diseño de vistas complejas (Dashboard Directivo, Libro de Clases, Planilla de Calificaciones, Ficha del Estudiante 360°, Asistencia Diaria).
- **Micro-interacciones y Animaciones:** Transiciones refinadas con `motion` (antes `framer-motion`), estados interactivos claros (`hover`, `focus-visible`, `active`, `disabled`).
- **Accesibilidad Visual (WCAG 2.1 AA):** Ratios de contraste de texto y fondo ≥ 4.5:1, zonas de pulsación táctil (touch targets) ≥ 44×44px, navegación completa por teclado con anillos de foco visibles.
- **Estabilidad de Layout:** Cero desplazamiento de diseño acumulado (Cumulative Layout Shift = 0) y prevención total de scroll horizontal involuntario (*no horizontal body overflow*).

#### Lo que debe lograr y defender oralmente
1. **Decisiones de Diseño:** Justificar por qué una pantalla está organizada de determinada forma según los perfiles de usuario (ej: un profesor en el aula necesita registrar asistencia en 3 clics; un director necesita ver métricas ejecutivas de un vistazo).
2. **Consistencia Global:** Demostrar que un botón, una tabla, un modal o una tarjeta tienen la misma identidad visual en todas las rutas del sistema.
3. **Dictamen de Aprobación UX:** Mantener actualizado y firmado el `DICTAMEN_OFICIAL_APROBACION_UX_UI.md`.

#### Directiva de la IA al interactuar con Lucas
- Entregar código de Tailwind CSS impecable, semántico y apegado al Design System de AURENIS (`docs/DESIGN_SYSTEM_LUCAS.md`).
- Diseñar layouts modernos, profesionales y limpios (evitar estilos sobrecargados o paletas estridentes).
- Recordarle validar los prototipos con Malcom Marcelo para que la implementación sea fiel al 100%.

---

### 🛡️ 4. FRANK M. — QA, Testing & Seguridad

#### Responsabilidad Real
Frank es el auditor implacable del sistema. Su labor es intentar romper la aplicación antes de que llegue a producción o a manos de los evaluadores, garantizando que el software sea seguro, confiable y conforme a la ley.

#### Áreas de Dominio Técnico
- **Estrategia Integral de Pruebas:** Pruebas unitarias, pruebas de integración de endpoints y pruebas end-to-end (E2E) de flujos críticos.
- **Auditoría de Seguridad Técnica (OWASP Top 10):**
  - **Inyecciones:** SQL Injection, Command Injection (mitigadas por Prisma y Zod).
  - **Control de Acceso Vertical:** Asegurarse de que un estudiante o profesor no pueda invocar rutas administrativas de `/system/*` o endpoints de configuración.
  - **Control de Acceso Horizontal (BOLA/IDOR):** Verificar que un usuario del `colegio-a` no pueda consultar ni modificar recursos del `colegio-b`.
  - **Autenticación Rota:** Ataques de fuerza bruta, fijación de sesión, expiración de tokens.
  - **Cross-Site Scripting (XSS) y CSRF:** Sanitización de entradas y protección en cookies.
- **Protección de Datos Sensibles de Menores:** Verificación del cumplimiento de la normativa escolar (Circular 482 y Ley de Protección de Datos Personales), asegurando el cifrado y restricción estricta de fichas médicas, notas PIE/NEE y medidas cautelares de retiro de estudiantes (`canPickUp`).
- **Bitácora de Vulnerabilidades & Re-Testing:** Mantenimiento de `SECURITY-FINDINGS-LOG.md`, `BITACORA-HALLAZGOS-SEGURIDAD.md` y matrices de riesgo CVSS v3.1 y STRIDE.

#### Lo que debe lograr y defender oralmente
1. **Evidencia de Pruebas:** Presentar matrices de prueba reales, logs de ejecución de tests y reportes de vulnerabilidades detectadas y corregidas.
2. **Acreditación de Seguridad:** Demostrar cómo se testeó y comprobó que los endpoints están blindados contra ataques comunes de pentesting.
3. **Criterio de Aceptación:** Ser el encargado de firmar el cierre de las incidencias en el acta de re-testing (`ACTA-VERIFICACION-PARCHES-RETESTING.md`).

#### Directiva de la IA al interactuar con Frank
- Asistirlo en la redacción de casos de prueba exhaustivos, scripts de pentesting automatizados (curl, fetch, jest/playwright) y auditoría de cabeceras de seguridad HTTP.
- Proporcionarle formatos de reporte técnico con severidad CVSS v3.1 cuantitativa y pasos de reproducción claros para que Maicol y Malcom puedan parchar los fallos rápidamente.

---

## 🔄 3. EL DEFINITION OF DONE (DoD) OFICIAL DE AURENIS

En este proyecto queda terminantemente prohibido considerar una tarea como "TERMINADA" únicamente porque se escribió código o se ve bien en pantalla. Para que una característica o módulo obtenga el estado de **DONE**, debe completar sin excepción el siguiente pipeline de calidad:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PIPELINE DE DEFINITION OF DONE (DoD)                 │
├────────────────────────────────────────────────────────────────────────┤
│ 1. 🎨 Especificación UX/UI (Lucas P.)                                  │
│    Diseño de interfaz, tokens, accesibilidad y estados interactivos.  │
│                               ▼                                        │
│ 2. 💻 Implementación Frontend (Malcom Marcelo)                         │
│    Componentes reactivos, formularios, manejo de errores, SSR limpio.  │
│                               ▼                                        │
│ 3. 👑 Contrato API, Backend & Persistencia en DB (Maicol R.)           │
│    Validación Zod, lógica de negocio, RBAC en servidor, queries Prisma.│
│                               ▼                                        │
│ 4. 🛡️ Pentesting, Control de Acceso & QA (Frank M.)                   │
│    Validación contra OWASP, BOLA/IDOR, escalamiento y tests de estrés. │
│                               ▼                                        │
│ 5. 📱 Verificación Responsive & Accesibilidad                          │
│    Validación en móviles, tablets y cumplimiento WCAG 2.1 AA.         │
│                               ▼                                        │
│ 6. 🔧 Corrección de Hallazgos                                          │
│    Subsanación de cualquier error detectado en QA o seguridad.         │
│                               ▼                                        │
│ 7. 🔁 Re-Testing y Verificación de Parches                            │
│    Comprobación de que la corrección no generó regresiones.           │
│                               ▼                                        │
│ 8. 📝 Evidencia y Documentación Técnica                                │
│    Registro en bitácora, actualización de documentación en /docs.      │
│                               ▼                                        │
│                     ✅ TAREA TERMINADA (DONE)                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📅 4. PLAN DE TRABAJO Y PRIORIDADES PARA LOS PRÓXIMOS 30 DÍAS

Con aproximadamente 30 días restantes para el hito final, las prioridades no negociables del proyecto están divididas por responsable:

### Semana 1 (Días 1 a 7): Estabilización de Contratos y Núcleo Académico
- **Maicol R.:** Consolidar la autenticación real en DB, proteger todas las rutas `/api/*` con middleware RBAC centralizado y asegurar que `schoolId` filtre el 100% de las consultas de estudiantes, matrículas, notas y asistencia.
- **Malcom Marcelo:** Reemplazar cualquier dato estático restante en las vistas académicas por llamadas a las APIs reales con gestión de estados (`loading`, `error`, `empty`).
- **Lucas P.:** Auditar y pulir la consistencia visual en todas las vistas del colegio (`/[schoolSlug]/courses`, `/[schoolSlug]/grades`, `/[schoolSlug]/attendance`).
- **Frank M.:** Ejecutar la primera ronda de pruebas de inyección y pruebas de control de acceso cruzado entre tenants (IDOR test suite).

### Semana 2 (Días 8 a 14): Módulos Operativos Críticos y Fichas 360°
- **Maicol R.:** Implementar la lógica transaccional de registro de calificaciones, cierre de periodos académicos y cálculo ponderado de promedios en base de datos.
- **Malcom Marcelo:** Finalizar la planilla interactiva Excel-Like de notas y el modal interactivo de Ficha 360° del Estudiante con carga dinámica.
- **Lucas P.:** Diseñar los estados de alerta temprana, chips de inasistencia crítica y modales de confirmación destructiva.
- **Frank M.:** Auditar el tratamiento de datos sensibles de menores (fichas médicas, autorizaciones de retiro) verificando que solo roles autorizados puedan acceder.

### Semana 3 (Días 15 a 21): Reportes, Exportación y Dashboard Ejecutivo
- **Maicol R.:** Endpoints para generación de reportes oficiales, actas de notas y métricas consolidadas del colegio para el Director y SuperAdmin.
- **Malcom Marcelo:** Renderizado de gráficos de rendimiento, filtros avanzados de búsqueda y paginación en tablas masivas de alumnos.
- **Lucas P.:** Validación de adaptabilidad móvil extrema, auditoría de contrastes y optimización de touch targets.
- **Frank M.:** Ejecución de tests automatizados de estrés y actualización de la matriz de riesgos CVSS v3.1 con verificación de mitigación de vulnerabilidades previas.

### Semana 4 (Días 22 a 30): Congelamiento de Código (Code Freeze), Re-Testing y Auditoría Final
- **Todo el Equipo:**
  - Cero nuevas características no planificadas.
  - Ejecución del ciclo completo de re-testing de Frank M.
  - Emisión de los dictámenes finales de QA, UX/UI y Ciberseguridad.
  - Ensayo general de la defensa técnica del proyecto donde cada integrante defenderá su área según este documento.

---

## 🤖 5. REGLAS DE ORO OBLIGATORIAS PARA CUALQUIER AGENTE DE IA

1. **Contextualizar al Usuario:**
   - Si el usuario se identifica como Maicol, Malcom, Lucas o Frank, responder directamente enmarcando la solución dentro de su competencia y nivel de exigencia.
   - Si el usuario no indica quién es, pero consulta sobre una tarea específica, la IA debe indicar a qué responsable corresponde esa tarea en el equipo.

2. **Atribución de Autoría Obligatoria:**
   - En cualquier explicación técnica o análisis de cambios en el código, la IA **DEBE indicar al lado de cada archivo modificado el integrante responsable** (Maicol R., Malcom Marcelo, Lucas P., o Frank M.).

3. **Prohibición Total de "Placeholders" o Mocks Falsos:**
   - No generar código con `// TODO`, `// Aquí va la lógica`, arreglos en memoria que simulen bases de datos, ni endpoints que devuelvan datos ficticios cuando el schema Prisma ya contiene las entidades reales.

4. **Verificación Previa Obligatoria:**
   - Antes de dar por concluida una respuesta que involucre cambios de código, la IA debe asegurar que el proyecto compile sin errores (`npm run build` / `compile_applet`) y pase el linter (`npm run lint` / `lint_applet`).

5. **Luz Verde Obligatoria para GitHub Push:**
   - Al finalizar con éxito cualquier cambio técnico verificado, la IA **DEBE otorgar explícitamente la LUZ VERDE (aprobación formal)** para que el usuario pueda hacer `git commit` y `git push` a GitHub con total seguridad.
