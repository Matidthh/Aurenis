# 🚨 Referencia Rápida de Rollback de Migraciones

Guía operativa inmediata para incidentes de despliegue de base de datos en Aurenis. Para la documentación exhaustiva con diagramas, consulta [docs/procedimiento-rollback-migraciones.md](../../docs/procedimiento-rollback-migraciones.md).

---

## ⚡ Comandos Rápidos de Emergencia

### 1. Consultar estado actual de migraciones
```bash
npm run db:migrate:status
```

### 2. Ejecutar rollback asistido
```bash
# Modo interactivo o automático con script de rollback
npm run db:migrate:rollback -- --target 20260908180000_db_optimizations_and_fixes
```

### 3. Reversión Manual Directa mediante SQL
Si la migración falló a mitad de ejecución o se necesita aplicar el script `rollback.sql`:
```bash
# Ejecutar el script rollback.sql con psql
psql "$DATABASE_URL" -f prisma/migrations/<VERSION>/rollback.sql

# Marcar la migración como rolled-back en la tabla _prisma_migrations
npx prisma migrate resolve --rolled-back "<VERSION>"
```

### 4. Si la migración se completó pero fue necesario corregirla externamente:
```bash
npx prisma migrate resolve --applied "<VERSION>"
```

---

## 📋 Matriz de Decisión de Reversión

| Situación | Acción Recomendada | Riesgo |
| :--- | :--- | :--- |
| **Fallo en CI/CD antes de tráfico** | Abortar release, ejecutar `rollback.sql`, corregir PR. | 🟢 Bajo |
| **Error en Producción sin datos nuevos** | Ejecutar `rollback.sql`, ejecutar `prisma migrate resolve --rolled-back`, revertir commit de la app. | 🟡 Medio |
| **Error en Producción con datos creados** | **NO ejecutar `rollback.sql` destructivo**. Aplicar migración "Forward-Fix" o activar Point-in-Time Recovery (PITR). | 🔴 Crítico |
