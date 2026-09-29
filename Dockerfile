# ==============================================================================
# AURENIS SAAS — PRODUCTION DOCKERFILE (MULTI-STAGE)
# Architecture & DevOps Lead: Maicol R. | Frontend: Malcom Marcelo | QA: Frank M.
# Target: Google Cloud Run & AWS ECS / Kubernetes
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Base & Dependencies
# ------------------------------------------------------------------------------
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Instalar dependencias exactas y generar cliente Prisma
RUN npm ci --prefer-offline --no-audit

# ------------------------------------------------------------------------------
# Stage 2: Builder
# ------------------------------------------------------------------------------
FROM node:22-alpine AS builder
RUN apk add --no-cache openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desactivar telemetría de Next.js durante el build
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Generar Prisma Client y compilar Next.js
RUN npx prisma generate
RUN npm run build

# ------------------------------------------------------------------------------
# Stage 3: Production Runner (Non-Root User)
# ------------------------------------------------------------------------------
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl curl bash

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

# Crear usuario y grupo sin privilegios de root (Seguridad CIS / OWASP)
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar artefactos necesarios desde builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/scripts ./scripts

# Permisos seguros para el usuario no-root
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

# Healthcheck nativo para contenedores de Cloud Run y Kubernetes
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Comando de arranque del servidor Next.js de producción
CMD ["npm", "run", "start"]
