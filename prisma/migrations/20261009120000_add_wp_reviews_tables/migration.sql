-- Migration: 20261009120000_add_wp_reviews_tables
-- Descripción: Creación de tablas persistentes wp_reviews y wp_review_comments para el sistema de reseñas y conexión externa
-- Autor: Maicol R. (Arquitectura y Base de Datos)

-- CreateTable wp_reviews
CREATE TABLE IF NOT EXISTS "wp_reviews" (
    "id" TEXT NOT NULL,
    "authorName" VARCHAR(120) NOT NULL,
    "authorEmail" VARCHAR(180),
    "authorRole" TEXT NOT NULL DEFAULT 'Comunidad Escolar',
    "institutionName" VARCHAR(180),
    "rating" INTEGER NOT NULL DEFAULT 5,
    "title" VARCHAR(160) NOT NULL,
    "comment" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "originSite" TEXT NOT NULL DEFAULT 'aurenis-platform',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wp_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable wp_review_comments
CREATE TABLE IF NOT EXISTS "wp_review_comments" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "authorName" VARCHAR(120) NOT NULL,
    "comment" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wp_review_comments_pkey" PRIMARY KEY ("id")
);

-- Índices de Rendimiento y Filtrado
CREATE INDEX IF NOT EXISTS "wp_reviews_rating_idx" ON "wp_reviews"("rating");
CREATE INDEX IF NOT EXISTS "wp_reviews_isVerified_idx" ON "wp_reviews"("isVerified");
CREATE INDEX IF NOT EXISTS "wp_reviews_createdAt_idx" ON "wp_reviews"("createdAt");
CREATE INDEX IF NOT EXISTS "wp_review_comments_reviewId_idx" ON "wp_review_comments"("reviewId");

-- Llave Foránea con Cascada
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'wp_review_comments_reviewId_fkey'
    ) THEN
        ALTER TABLE "wp_review_comments" ADD CONSTRAINT "wp_review_comments_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "wp_reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
