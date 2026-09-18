import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  checkRateLimit,
  getClientIdentifier,
  getRateLimitHeaders,
} from "@/lib/security/rate-limiter";

const LeadContactSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().min(8, "Teléfono de contacto requerido").max(25),
  role: z.enum([
    "director",
    "sostenedor",
    "utp",
    "docente",
    "administrador",
    "otro",
  ]),
  schoolName: z.string().min(2, "Nombre de la institución o colegio requerido").max(120),
  rbd: z.string().max(20).optional(),
  studentCount: z.string().optional(),
  requestedPlan: z.string().optional(),
  message: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  const clientIp = getClientIdentifier(req);
  const rateLimitKey = `lead_contact:${clientIp}`;

  // Rate limiting preventivo
  const rateLimitResult = checkRateLimit(rateLimitKey, {
    max: 10,
    windowMs: 15 * 60 * 1000,
  });

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      {
        error: "Demasiadas solicitudes. Por favor intente nuevamente en unos minutos.",
        code: "TOO_MANY_REQUESTS",
      },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  try {
    const body = await req.json();
    const result = LeadContactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Datos de formulario incompletos o inválidos",
          details: result.error.flatten(),
        },
        { status: 400, headers: getRateLimitHeaders(rateLimitResult) }
      );
    }

    const data = result.data;

    // Log estructurado de la solicitud para el equipo comercial y directivo
    console.info("[AURENIS_LEAD_SOLICITUD]", {
      timestamp: new Date().toISOString(),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      schoolName: data.schoolName,
      rbd: data.rbd || "N/A",
      studentCount: data.studentCount || "N/A",
      plan: data.requestedPlan || "General",
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Solicitud recibida exitosamente. Nuestro equipo se pondrá en contacto a la brevedad para coordinar la demostración guiada.",
        data: {
          referenceId: `AUR-${Date.now().toString(36).toUpperCase()}`,
          receivedAt: new Date().toISOString(),
        },
      },
      { status: 200, headers: getRateLimitHeaders(rateLimitResult) }
    );
  } catch (error) {
    console.error("Error processing contact lead request:", error);
    return NextResponse.json(
      { error: "Error interno procesando la solicitud" },
      { status: 500 }
    );
  }
}
