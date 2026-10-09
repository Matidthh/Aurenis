export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { CreateReviewSchema } from "@/lib/validations/review.schema";

/**
 * Cabeceras CORS universales para permitir integración con sitios externos (WordPress, etc.)
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
};

/**
 * Sanitización de texto para mitigar ataques XSS en contenido generado por usuarios
 * Autor: Frank M. (QA & Seguridad)
 */
function sanitizeText(str: string): string {
  if (!str) return "";
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, (char) => (char === "<" ? "&lt;" : "&gt;"))
    .trim();
}

/**
 * OPTIONS /api/reviews — Manejo de Preflight CORS para llamadas desde otras webs
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

/**
 * GET /api/reviews — Listado y estadísticas de reseñas públicas (Tabla: wp_reviews)
 * Autor: Maicol R. (Arquitectura y Backend)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const ratingParam = searchParams.get("rating");
    const roleParam = searchParams.get("role");
    const originParam = searchParams.get("originSite");
    const limitParam = searchParams.get("limit") || searchParams.get("take");

    const whereClause: any = {};
    if (ratingParam) {
      const parsedRating = parseInt(ratingParam, 10);
      if (!isNaN(parsedRating) && parsedRating >= 1 && parsedRating <= 5) {
        whereClause.rating = parsedRating;
      }
    }

    if (roleParam && roleParam.toLowerCase() !== "todos") {
      whereClause.authorRole = { contains: roleParam, mode: "insensitive" };
    }

    if (originParam) {
      whereClause.originSite = originParam;
    }

    const take = limitParam ? Math.min(Math.max(parseInt(limitParam, 10) || 50, 1), 100) : 50;

    // Obtener reseñas ordenadas por fecha más reciente
    const reviews = await prisma.wpReview.findMany({
      where: whereClause,
      take,
      orderBy: { createdAt: "desc" },
    });

    // Calcular estadísticas sobre todas las reseñas
    const allReviews = await prisma.wpReview.findMany({});
    const total = allReviews.length;
    const sumRatings = allReviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0);
    const averageRating = total > 0 ? Number((sumRatings / total).toFixed(1)) : 5.0;

    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let verifiedCount = 0;

    allReviews.forEach((r: any) => {
      const star = r.rating || 5;
      if (distribution[star] !== undefined) {
        distribution[star]++;
      }
      if (r.isVerified) {
        verifiedCount++;
      }
    });

    return NextResponse.json(
      {
        success: true,
        tableName: "wp_reviews",
        stats: {
          total,
          averageRating,
          verifiedCount,
          distribution,
          satisfactionPercentage: total > 0 ? Math.round(((distribution[5] + distribution[4]) / total) * 100) : 100,
        },
        reviews,
      },
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
        },
      }
    );
  } catch (error: unknown) {
    console.error("[API Reviews GET] Error al obtener reseñas:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error al obtener las reseñas.",
        tableName: "wp_reviews",
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}

/**
 * POST /api/reviews — Crear nueva reseña en tabla wp_reviews (Acepta peticiones locales y remotas vía CORS)
 * Autor: Maicol R. (Backend) & Frank M. (Seguridad)
 */
export async function POST(req: NextRequest) {
  try {
    let rawBody: any = null;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "El cuerpo de la solicitud debe ser un JSON válido." },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const validation = CreateReviewSchema.safeParse(rawBody);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Los datos de la reseña no son válidos.",
          details: validation.error.flatten(),
        },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const data = validation.data;

    // Sanitización activa anti-XSS
    const sanitizedData = {
      authorName: sanitizeText(data.authorName),
      authorEmail: data.authorEmail ? sanitizeText(data.authorEmail) : null,
      authorRole: sanitizeText(data.authorRole || "Comunidad Escolar"),
      institutionName: data.institutionName ? sanitizeText(data.institutionName) : null,
      rating: data.rating,
      title: sanitizeText(data.title),
      comment: sanitizeText(data.comment),
      originSite: sanitizeText(data.originSite || "web-externa"),
      isVerified: true,
      isFeatured: data.rating === 5,
    };

    const newReview = await prisma.wpReview.create({
      data: sanitizedData,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Reseña registrada exitosamente en la tabla wp_reviews.",
        tableName: "wp_reviews",
        review: newReview,
      },
      {
        status: 201,
        headers: CORS_HEADERS,
      }
    );
  } catch (error: unknown) {
    console.error("[API Reviews POST] Error al crear reseña:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Error interno al guardar la reseña.",
        tableName: "wp_reviews",
      },
      {
        status: 500,
        headers: CORS_HEADERS,
      }
    );
  }
}
