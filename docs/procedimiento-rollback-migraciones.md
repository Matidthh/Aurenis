# 📘 Procedimiento Operativo Estándar (SOP): Gestión de Migraciones y Protocolo de Rollback

**Sistema**: Aurenis Enterprise Core  
**Módulo**: Database Engineering & Reliability  
**Motor de Base de Datos**: PostgreSQL 16+ (Neon Database / Cloud SQL)  
**ORM / Herramienta**: Prisma ORM 6+  
**Versión de Documento**: 1.0.0  
**Fecha de Publicación**: 2026-09-11  

---

## 🎯 1. Objetivos y Alcance

Este documento establece la normativa técnica y los procedimientos operativos obligatorios para la ejecución, validación, monitoreo y reversión (**Rollback**) de migraciones de base de datos en los entornos de:
- **Desarrollo (Development)**: Entornos locales de ingenieros.
- **Pruebas (Test / CI)**: Pipelines automatizados de integración continua.
- **Staging / Pre-producción**: Réplica exacta de producción con datos anonimizados.
- **Producción (Production)**: Clúster de alta disponibilidad multi-tenant en vivo.

---

## 🏗️ 2. Arquitectura del Pipeline de Migraciones

```
+-----------------------------------------------------------------------------------+
|                           PIPELINE DE MIGRACIONES AURENIS                         |
+-----------------------------------------------------------------------------------+
|                                                                                   |
|  [ 1. Desarrollo ]                                                                |
|    - Modificación de prisma/schema.prisma                                         |
|    - Creación de migración: `npx prisma migrate dev --name <nombre>`              |
|    - Creación obligatoria de `rollback.sql` en la carpeta generada                |
|    - Validación local: `npm run db:migrate:validate`                              |
|                                                                                   |
|  [ 2. Pull Request & CI Gate ]                                                    |
|    - CI ejecuta: `npm run db:migrate:validate`                                    |
|    - Validación de inmutabilidad y `migration_lock.toml`                          |
|    - Prueba de despliegue en base de datos efímera (Shadow DB / Test)             |
|                                                                                   |
|  [ 3. Despliegue en Staging & Producción ]                                        |
|    - Ejecución automatizada: `npm run db:migrate:deploy`                          |
|    - Pre-flight checks de conectividad y latencia                                 |
|    - Aplicación de sentencias DDL con `prisma migrate deploy`                     |
|    - Verificación post-migración (Smoke Test & Healthchecks)                      |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

---

## 📜 3. Historial de Migraciones en Git

Cada migración en el repositorio reside en `prisma/migrations/<TIMESTAMP>_<NOMBRE>/` y cuenta con:
1. **`migration.sql`**: Sentencias DDL hacia adelante (**Forward Migration**).
2. **`rollback.sql`**: Sentencias DDL de reversión complementarias (**Down Migration**).
3. **Registro en `prisma/migrations/MIGRATION_INDEX.md`**: Bitácora con detalles de dependencias e impacto.

### Registro Actual de Migraciones
1. `20260907141816_init`: Esquema base multi-tenant institucional.
2. `20260908180000_db_optimizations_and_fixes`: Optimización de perfiles, tipos numéricos decimales y partial unique indexes para soft-delete.
3. `20260908190000_enterprise_expansion`: Módulos de aulas, tareas, justificaciones, auditoría avanzada, finanzas y webhooks.

---

## 🔄 4. Patrón de Despliegue Zero-Downtime: Expand & Contract

Para garantizar disponibilidad 99.99% sin interrupción para los colegios activos, los cambios mayores de esquema deben dividirse en 3 fases:

```
+----------------+      +-------------------+      +------------------+
|  FASE 1: EXPAND| ---> |  FASE 2: MIGRATION| ---> | FASE 3: CONTRACT |
|  Agregar nueva |      |  Escribir en ambas|      | Eliminar columna |
|  columna/tabla |      |  columnas (Dual)  |      | o tabla obsoleta |
+----------------+      +-------------------+      +------------------+
```

1. **Fase Expand (No destructiva)**: Se añade la nueva columna o tabla como opcional (`NULLABLE` o con valor `DEFAULT`). La aplicación antigua sigue funcionando sin enterarse.
2. **Fase Dual-Write / Backfill**: El código de la aplicación se actualiza para leer/escribir en ambas estructuras. Un script asíncrono migra datos históricos.
3. **Fase Contract (Limpieza)**: Una vez que el 100% del tráfico utiliza la nueva estructura, se despliega una migración que elimina la columna o tabla deprecada.

---

## 🚨 5. Protocolo de Rollback de Emergencia (Runbook)

Cuando ocurre un error durante o inmediatamente después del despliegue de una migración en producción, el equipo de guardia (On-Call) debe seguir este procedimiento:

### 5.1 Árbol de Decisión de Emergencia

```
¿Falló el comando 'prisma migrate deploy'?
  ├── SÍ -> Ir a SECCIÓN 5.2 (Fallo de Despliegue en Tránsito)
  └── NO, pero la aplicación genera errores 500:
        ├── ¿Se generaron datos nuevos en la nueva tabla/columna?
        │     ├── NO -> Ir a SECCIÓN 5.3 (Rollback DDL Rápido)
        │     └── SÍ -> Ir a SECCIÓN 5.4 (Forward-Fix o PITR)
```

---

### 5.2 Fallo de Despliegue en Tránsito (`Failed Migration State`)
Si la conexión se interrumpió o una sentencia DDL falló a mitad de camino, Prisma marcará la migración con `applied_steps_count` incompleto y bloqueará despliegues posteriores.

**Pasos de Recuperación**:
1. Inspeccionar el error exacto:
   ```bash
   npm run db:migrate:status
   ```
2. Ejecutar manualmente el script `rollback.sql` de la migración afectada mediante `psql` para dejar el esquema limpio:
   ```bash
   psql "$DIRECT_URL" -f "prisma/migrations/<TIMESTAMP_MIGRACION>/rollback.sql"
   ```
3. Informar a Prisma que la migración fallida ha sido revertida:
   ```bash
   npx prisma migrate resolve --rolled-back "<TIMESTAMP_MIGRACION>"
   ```
4. Verificar que el estado volvió a ser verde:
   ```bash
   npm run db:migrate:status
   ```

---

### 5.3 Rollback DDL Rápido (Sin Datos Nuevos Comprometidos)
Si la migración fue exitosa pero la nueva versión de la aplicación tiene un defecto crítico y debe revertirse el release:

1. **Revertir la versión del contenedor/aplicación** a la imagen anterior inmediatamente (Traffic Shift al release anterior).
2. **Ejecutar el script automatizado de rollback**:
   ```bash
   npm run db:migrate:rollback -- --target <NOMBRE_DE_MIGRACION>
   ```
   *O ejecutar manualmente*:
   ```bash
   psql "$DIRECT_URL" -f "prisma/migrations/<NOMBRE_DE_MIGRACION>/rollback.sql"
   npx prisma migrate resolve --rolled-back "<NOMBRE_DE_MIGRACION>"
   ```
3. **Re-generar el cliente Prisma**:
   ```bash
   npm run db:generate
   ```
4. **Ejecutar pruebas de humo**:
   ```bash
   npm run db:migrate:status
   ```

---

### 5.4 Procedimiento Point-in-Time Recovery (PITR) para Desastres Críticos

En caso de pérdida o corrupción de datos generada por una migración destructiva en producción, se debe recurrir a la restauración por Point-in-Time Recovery (PITR) de PostgreSQL / Neon.

#### Procedimiento en Neon Database (Branching / PITR Instantáneo):
Neon permite crear ramas de recuperación en segundos apuntando a cualquier milisegundo antes de la migración:
1. Identificar el timestamp exacto del inicio del despliegue (ej. `2026-09-11T07:00:00Z`).
2. En la consola de Neon o mediante Neon CLI:
   ```bash
   neon branches create --name recovery-pre-migration --point "2026-09-11T07:00:00Z"
   ```
3. Obtener la cadena de conexión de la rama de recuperación:
   ```bash
   neon connection-string recovery-pre-migration
   ```
4. Actualizar `DATABASE_URL` y `DIRECT_URL` en las variables de entorno de producción para redirigir el tráfico a la rama restaurada.
5. Iniciar investigación y post-mortem.

---

## 🛠️ 6. Resumen de Scripts y Herramientas Automatizadas

| Comando NPM | Script Subyacente | Función |
| :--- | :--- | :--- |
| `npm run db:migrate:deploy` | `scripts/migrate-deploy.ts` | Ejecución segura en CI/CD con healthcheck previo y posterior |
| `npm run db:migrate:status` | `scripts/migrate-status.ts` | Diagnóstico de migraciones aplicadas vs locales |
| `npm run db:migrate:rollback` | `scripts/migrate-rollback.ts` | Ejecución asistida de scripts `rollback.sql` |
| `npm run db:migrate:validate` | `scripts/migrate-validate.ts` | CI Gate: comprueba integridad, lockfile y sintaxis |
| `npm run db:migrate:test` | `scripts/migrate-deploy.ts --seed` | Despliegue y población de datos en ambiente de pruebas |

---

## 📋 7. Lista de Chequeo Pre-Despliegue (Production Checklist)

- [ ] ¿El script `rollback.sql` fue probado exitosamente en Staging?
- [ ] ¿Se verificó que no existen bloqueos de tabla prolongados (`ACCESS EXCLUSIVE`)?
- [ ] ¿Se tomó snapshot / backup de seguridad o se verificó la disponibilidad de PITR?
- [ ] ¿El Pull Request pasó la validación `npm run db:migrate:validate`?
- [ ] ¿Se cuenta con personal de guardia conectado durante la ventana de mantenimiento?
