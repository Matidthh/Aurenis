# 📦 Guía de Migraciones de Base de Datos - Aurenis

Este directorio contiene las migraciones versionadas y reproducibles para el esquema PostgreSQL del sistema Aurenis.

---

## 🚀 Flujo de Trabajo por Entorno

### 1. Desarrollo Local (`Development`)
Para crear y probar cambios en el esquema local:
```bash
# 1. Modificar prisma/schema.prisma
# 2. Generar y aplicar migración en base de datos de desarrollo
npx prisma migrate dev --name descripcion_del_cambio

# 3. Crear manualmente el archivo de rollback correspondiente:
#    prisma/migrations/<timestamp>_descripcion_del_cambio/rollback.sql

# 4. Actualizar el cliente Prisma
npm run db:generate
```

### 2. Entornos CI / Staging / Producción (`Production & Staging`)
En pipelines automáticos y servidores en vivo, **NUNCA** se usa `prisma migrate dev`. Se utiliza el script automatizado y validado:
```bash
# Ejecutar pipeline automatizado con pre-checks y validaciones de salud
npm run db:migrate:deploy

# O bien directamente vía CLI de Prisma
npx prisma migrate deploy
```

---

## 🛠️ Comandos Disponibles en `package.json`

- **`npm run db:migrate:deploy`**: Ejecuta `prisma migrate deploy` con verificación previa de conectividad, variables de entorno, timeout y healthcheck posterior.
- **`npm run db:migrate:status`**: Inspecciona el estado de las migraciones aplicadas vs pendientes.
- **`npm run db:migrate:rollback`**: Ejecuta o planifica un procedimiento de reversión asistido.
- **`npm run db:migrate:validate`**: Valida la integridad del historial de migraciones en Git y la concordancia con `schema.prisma`.
- **`npm run db:migrate:test`**: Ejecuta migraciones y seeds automáticos en entorno de pruebas.

---

## ⚠️ Política de Integración en Git
- Todo cambio de base de datos se envía en una rama dedicada `feat/db-...` o `fix/db-...`.
- El commit debe incluir:
  - La carpeta `prisma/migrations/<timestamp>_<nombre>/` con `migration.sql` y `rollback.sql`.
  - El archivo `prisma/schema.prisma` actualizado.
  - La actualización en `prisma/migrations/MIGRATION_INDEX.md`.
