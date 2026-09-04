import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { CreateSchoolSchema } from "@/lib/validations/school.schema";
import { createSchoolWithOnboarding, listAllSchools } from "@/lib/services/school.service";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.isSystemAdmin) {
      return NextResponse.json({ error: "No autorizado. Requiere privilegios de SYSTEM_ADMIN." }, { status: 403 });
    }

    const schools = await listAllSchools();
    return NextResponse.json({ success: true, schools });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !session.isSystemAdmin) {
      return NextResponse.json({ error: "No autorizado. Requiere privilegios de SYSTEM_ADMIN." }, { status: 403 });
    }

    const body = await req.json();
    const validated = CreateSchoolSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Datos de formulario inválidos", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const result = await createSchoolWithOnboarding(validated.data, session.userId);

    return NextResponse.json(
      {
        success: true,
        message: "Institución creada e inicializada exitosamente.",
        school: {
          id: result.school.id,
          name: result.school.name,
          slug: result.school.slug,
        },
        admin: {
          id: result.adminUser.id,
          email: result.adminUser.email,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Error al crear institución" }, { status: 400 });
  }
}
