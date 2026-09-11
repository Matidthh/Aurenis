# ⚙️ GUÍA DE DESARROLLO, OPERACIONES Y DESPLIEGUE — AURENIS v1.0

**Documento:** Manual Técnico de Ingeniería, DevOps, Migraciones y Despliegue  
**Plataforma:** AURENIS — Sistema de Gestión Académica Multi-Tenant  
**Fecha:** Septiembre de 2026  
**Clasificación:** Técnica / Ingeniería de Software  

---

## 1. Requisitos del Sistema y Entorno

- **Node.js:** Versión 18.18+ o Node.js 20 LTS (Recomendado).
- **Gestor de Paquetes:** `npm` v10+ o `bun` / `pnpm`.
- **Motor de Base de Datos:** PostgreSQL 14+ (Producción) o SQLite (Desarrollo local rápido / Testing).
- **Herramientas de CLI:** Prisma CLI (`npx prisma`).

---

## 2. Variables de Entorno

Crear el archivo `.env` en la raíz del proyecto tomando como plantilla `.env.example`:

```env
# -------------------------------------------------------------
# BASE DE DATOS
# -------------------------------------------------------------
# Conexión PostgreSQL a Cloud SQL / Neon / Supabase / Local
DATABASE_URL="postgresql://postgres:password@localhost:5432/aurenis_db?schema=public"

# -------------------------------------------------------------
# SEGURIDAD Y SESIONES JWT
# -------------------------------------------------------------
# Clave maestra para firma de tokens de sesión HS256 (Mínimo 32 caracteres)
JWT_SECRET="aurenis-super-secret-master-encryption-key-2026-production-grade"
JWT_EXPIRES_IN="8h"

# -------------------------------------------------------------
# CONFIGURACIÓN DE LA APLICACIÓN
# -------------------------------------------------------------
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
PORT=3000

# -------------------------------------------------------------
# SERVICIOS EXTERNOS (OPCIONALES)
# -------------------------------------------------------------
# GEMINI_API_KEY="" # Si se habilitan asistentes pedagógicos server-side
```

---

## 3. Puesta en Marcha Local Paso a Paso

### 3.1 Instalación de Dependencias
```bash
npm install
```

### 3.2 Generación del Cliente ORM & Migraciones
```bash
# Generar el cliente tipado de Prisma
npx prisma generate

# Ejecutar migraciones en base de datos
npx prisma migrate dev --name init_schema
```

### 3.3 Inicialización del Servidor de Desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## 4. Estrategia de Testing & Calidad

Aurenis incluye una suite de pruebas de seguridad y lógica de dominio automatizada:

```bash
# Ejecución de la suite completa de 57 pruebas de seguridad y RBAC
npm test

# Ejecución del linter de código
npm run lint

# Compilación de producción
npm run build
```

---

## 5. Modelo de Datos y Comandos Útiles de Prisma

| Comando | Descripción |
| :--- | :--- |
| `npx prisma studio` | Abre una interfaz web en `http://localhost:5555` para visualizar y editar datos directamente. |
| `npx prisma db push` | Sincroniza el esquema `schema.prisma` directamente con la base de datos sin generar archivos de migración (ideal para prototipado rápido). |
| `npx prisma migrate reset` | Restablece la base de datos a cero y vuelve a ejecutar todas las migraciones. |
| `npx prisma validate` | Valida la sintaxis del archivo `prisma/schema.prisma`. |

---

## 6. Despliegue en Producción (Google Cloud Run / Docker)

### 6.1 Dockerfile para Producción Multi-Stage
```dockerfile
# Etapa 1: Dependencias y Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Etapa 2: Runner Ligero de Producción
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000
CMD ["node", "server.js"]
```

### 6.2 Despliegue en Google Cloud Run
```bash
# Construcción y subida de la imagen
gcloud builds submit --tag gcr.io/[PROJECT_ID]/aurenis:v1.0.0

# Despliegue del servicio con puerto 3000
gcloud run deploy aurenis \
  --image gcr.io/[PROJECT_ID]/aurenis:v1.0.0 \
  --platform managed \
  --region us-west2 \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production,PORT=3000" \
  --set-secrets="DATABASE_URL=AURENIS_DB_URL:latest,JWT_SECRET=AURENIS_JWT_SECRET:latest"
```

---

## 7. Protocolo de Respaldo y Contingencia de Base de Datos

1. **Respaldos Automáticos Diarios:**
   - Para PostgreSQL en Cloud SQL: Snapshots automáticos diarios con retención mínima de 30 días y *Point-in-Time Recovery* (PITR) de 7 días.
2. **Procedimiento de Restauración:**
   - En caso de incidente de corrupción de datos:
     ```bash
     pg_restore -h [HOST] -U [USER] -d [DATABASE_NAME] backup_file.dump
     ```
3. **Verificación de Integridad de la Bitácora de Auditoría:**
   - La tabla `AuditLog` debe mantenerse inmutable y con verificación periódica de consistencia de marcas de tiempo e identificadores de usuario.
