import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { listAllSchools } from "@/lib/services/school.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q")?.toLowerCase().trim() || "";

    let schools: Array<{
      id: string;
      name: string;
      slug: string;
      institutionalCode: string | null;
      city: string | null;
      status: string;
    }> = [];

    if (isDatabaseConfigured()) {
      try {
        const dbSchools = await prisma.school.findMany({
          where: query
            ? {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { slug: { contains: query, mode: "insensitive" } },
                  { institutionalCode: { contains: query, mode: "insensitive" } },
                  { city: { contains: query, mode: "insensitive" } },
                ],
              }
            : undefined,
          select: {
            id: true,
            name: true,
            slug: true,
            institutionalCode: true,
            city: true,
            status: true,
          },
          take: 20,
          orderBy: { name: "asc" },
        });

        if (dbSchools.length > 0) {
          schools = dbSchools;
        }
      } catch (err) {
        console.warn("DB query failed in /api/schools/search, falling back to catalog:", err);
      }
    }

    // Si no hay resultados de la BD o no está configurada, usar catálogo
    if (schools.length === 0) {
      const catalog = await listAllSchools();
      schools = catalog
        .filter((s) => {
          if (!query) return true;
          return (
            s.name.toLowerCase().includes(query) ||
            s.slug.toLowerCase().includes(query) ||
            (s.institutionalCode && s.institutionalCode.toLowerCase().includes(query)) ||
            (s.city && s.city.toLowerCase().includes(query))
          );
        })
        .map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          institutionalCode: s.institutionalCode,
          city: s.city,
          status: s.status,
        }));
    }

    return NextResponse.json({
      success: true,
      schools,
      total: schools.length,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Error al buscar instituciones",
      },
      { status: 500 }
    );
  }
}
