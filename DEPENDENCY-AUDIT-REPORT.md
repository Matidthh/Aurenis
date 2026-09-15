# Reporte de Auditoría de Seguridad de Dependencias (CVEs) — Aurenis

**Fecha de Ejecución:** 14 de Septiembre de 2026  
**Alcance:** Dependencias directas y transitivas (`package.json`, `package-lock.json`, `node_modules`)  
**Herramientas Empleadas:** `npm audit`, GitHub Advisory Database (GHSA), Snyk Open Source Intelligence  
**Resultado Global:** **0 Vulnerabilidades (0 Críticas, 0 Altas, 0 Moderadas, 0 Bajas)**

---

## 1. Resumen Ejecutivo y Cumplimiento de Criterios (DoD)

| Criterio de Aceptación | Estado | Evidencia |
| :--- | :---: | :--- |
| **Comando npm audit ejecutado sin vulnerabilidades críticas o altas** | **Cumplido** | `npm audit` finaliza con código de salida `0` y `found 0 vulnerabilities`. |
| **Librerías desactualizadas parcheadas** | **Cumplido** | Parche aplicado para `postcss` (v8.5.28) y `deepmerge-ts` (v8.0.2) vía directiva `overrides`. |
| **Reporte de dependencias adjunto** | **Cumplido** | Documentación detallada de CVEs mitigados, inventario y scripts de verificación (`DEPENDENCY-AUDIT-REPORT.md`). |

---

## 2. Hallazgos Identificados y Mitigaciones Aplicadas

Durante el escaneo inicial automatizado se identificaron vulnerabilidades en dependencias transitivas:

### 2.1. `postcss` (<= 8.5.22) — Severidad Alta
- **CVEs / Asesorías Asociadas:**
  - **GHSA-qx2v-qp2m-jg93**: Cross-Site Scripting (XSS) mediante tag `</style>` sin escapar en la serialización CSS.
  - **GHSA-6g55-p6wh-862q**: Lectura arbitraria de archivos e información sensible a través de `sourceMappingURL` controlado por el atacante en comentarios CSS.
  - **GHSA-fxqj-rqcc-2cmp**: Solución incompleta para lectura arbitraria de archivos `.map` cuando `from` no está configurado.
  - **GHSA-r28c-9q8g-f849**: Path Traversal en la carga automática de Source Maps anteriores (`sourceMappingURL`).
- **Ruta Afectada:** `node_modules/next/node_modules/postcss` y compilación local.
- **Acción Correctiva:** 
  - Se actualizó `postcss` en `devDependencies` a `^8.5.28`.
  - Se configuró la directiva `overrides` en `package.json`: `"postcss": "$postcss"`, forzando a todo el árbol de dependencias (incluyendo Next.js interno) a utilizar la versión sanitizada `8.5.28`.

### 2.2. `deepmerge-ts` (< 8.0.0) — Severidad Alta
- **CVE / Asesoría Asociada:**
  - **GHSA-ggr8-5vv4-36mx**: Agotamiento de pila (*Stack exhaustion*) al fusionar grafos de objetos recursivos complejos, conduciendo a Denegación de Servicio (DoS).
- **Ruta Afectada:** `node_modules/@prisma/config/node_modules/deepmerge-ts` -> `prisma`.
- **Acción Correctiva:**
  - Se fijó la versión en `overrides` de `package.json`: `"deepmerge-ts": "^8.0.2"`, eliminando el vector de desbordamiento de pila en la configuración de Prisma.

---

## 3. Configuración de Parches en `package.json`

```json
{
  "devDependencies": {
    ...
    "postcss": "^8.5.28",
    ...
  },
  "overrides": {
    "deepmerge-ts": "^8.0.2",
    "postcss": "$postcss"
  }
}
```

---

## 4. Inventario de Dependencias Directas Analizadas

### 4.1. Producción (`dependencies`)
| Paquete | Versión | Estado de Seguridad | Propósito |
| :--- | :--- | :---: | :--- |
| `@prisma/client` | `^6.4.1` | Limpio (0 CVEs) | ORM para comunicación con base de datos PostgreSQL |
| `bcryptjs` | `^3.0.2` | Limpio (0 CVEs) | Hashing seguro de contraseñas mediante algoritmo Blowfish |
| `clsx` | `^2.1.1` | Limpio (0 CVEs) | Construcción condicional de clases CSS |
| `jose` | `^6.0.8` | Limpio (0 CVEs) | Criptografía Web Crypto / firma y validación de tokens JWT |
| `lucide-react` | `^1.16.0` | Limpio (0 CVEs) | Iconografía de interfaz de usuario |
| `motion` | `^13.2.0` | Limpio (0 CVEs) | Animaciones aceleradas por hardware |
| `next` | `^15.2.1` | Limpio (0 CVEs) | Framework de aplicación y renderizado SSR/Híbrido |
| `react` | `^19.0.0` | Limpio (0 CVEs) | Librería de interfaz de usuario |
| `react-dom` | `^19.0.0` | Limpio (0 CVEs) | Renderer DOM de React |
| `tailwind-merge` | `^3.0.2` | Limpio (0 CVEs) | Fusión libre de conflictos para utilidades Tailwind |
| `zod` | `^3.24.2` | Limpio (0 CVEs) | Validación estricta y tipado de esquemas de datos de entrada |

### 4.2. Entorno de Desarrollo (`devDependencies`)
| Paquete | Versión | Estado de Seguridad | Propósito |
| :--- | :--- | :---: | :--- |
| `autoprefixer` | `^10.4.21` | Limpio (0 CVEs) | Prefijador automático de reglas CSS |
| `eslint` | `^9.22.0` | Limpio (0 CVEs) | Análisis estático de código |
| `eslint-config-next` | `^15.2.1` | Limpio (0 CVEs) | Reglas de linting específicas de Next.js |
| `postcss` | `^8.5.28` | **Parcheado** | Transformador CSS y preprocesador |
| `prisma` | `^6.4.1` | Limpio (0 CVEs) | CLI y generador de migraciones de base de datos |
| `tailwindcss` | `^3.4.17` | Limpio (0 CVEs) | Motor de diseño basado en utilidades |
| `tsx` | `^4.23.13` | Limpio (0 CVEs) | Ejecución directa de TypeScript para scripts de mantenimiento |
| `typescript` | `^5.8.2` | Limpio (0 CVEs) | Compilador y chequeo de tipos estáticos |

---

## 5. Salida de Verificación del Escaneo

Ejecución de `npm run audit:report`:

```text
================================================================================
🛡️  AURENIS — REPORTE DE AUDITORÍA DE DEPENDENCIAS Y VULNERABILIDADES (CVEs)
================================================================================

▶ 1. Ejecutando análisis de seguridad automatizado (npm audit)...
   └─ Resultado: Total vulnerabilidades: 0 (Críticas: 0, Altas: 0, Moderadas: 0, Bajas: 0)
   └─ Estado: ✅ SIN VULNERABILIDADES CRÍTICAS NI ALTAS (0 CVEs)

▶ 2. Librerías Parcheadas y Overrides Aplicados:
   📦 [PARCHEADO] postcss (^8.5.28)
      ↳ CVEs Mitigados: GHSA-qx2v-qp2m-jg93, GHSA-6g55-p6wh-862q, GHSA-fxqj-rqcc-2cmp, GHSA-r28c-9q8g-f849
      ↳ Detalle: Actualizado a v8.5.28 y fijado vía override npm para proteger el compilador CSS y Next.js.
   📦 [PARCHEADO] deepmerge-ts (^8.0.2)
      ↳ CVEs Mitigados: GHSA-ggr8-5vv4-36mx
      ↳ Detalle: Fijado a v8.0.2 vía override en Prisma/config para mitigar ataques de denegación de servicio (DoS).

================================================================================
📊 ESTADO FINAL: 100% SEGURO (0 VULNERABILIDADES)
================================================================================
```

---

## 6. Procedimiento de Verificación Continua
Para re-ejecutar la auditoría en cualquier momento:
```bash
npm run audit:report
# O directamente mediante npm CLI:
npm audit
```
