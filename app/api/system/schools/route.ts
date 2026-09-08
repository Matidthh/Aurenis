import { NextRequest, NextResponse } from "next/server";
import { CreateSchoolSchema } from "@/lib/validations/school.schema";
import { createSchoolWithOnboarding, listAllSchools } from "@/lib/services/school.service";
import { withAuth, withPermissions } from "@/lib/middleware/authorization";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/middleware/rate-limit";
import { withErrorHandler } from "@/lib/middleware/error-handler";
import { PERMISSIONS } from "@/lib/constants/permissions";

const getHandler = withAuth(
  withErrorHandler(async (req: NextRequest, context) => {
    if (!context.isSystemAdmin) {
      return NextResponse.json(
        { error: "No autorizado. Requiere privilegios de SYSTEM_ADMIN." },
        { status: 403 }
      );
    }

    const schools = await listAllSchools();
    return NextResponse.json({ success: true, schools });
  })
);

const postHandler = withPermissions([PERMISSIONS.SYSTEM_SCHOOLS_MANAGE])(
  withRateLimit(RATE_LIMIT_CONFIGS.SENSITIVE)(
    withErrorHandler(async (req: NextRequest, context) => {
      const body = await req.json();
      const validated = CreateSchoolSchema.safeParse(body);

      if (!validated.success) {
        return NextResponse.json(
          { error: "Datos de formulario inválidos", details: validated.error.flatten() },
          { status: 400 }
        );
      }

      const result = await createSchoolWithOnboarding(validated.data, context.userId);

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
    })
  )
);

export { getHandler as GET, postHandler as POST };
