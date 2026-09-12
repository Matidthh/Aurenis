import { NextRequest } from "next/server";
import { toggleSchoolSubscription } from "@/lib/services/school.service";
import { getSession } from "@/lib/auth/session";
import { apiSuccess, apiError } from "@/lib/api/response";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ schoolId: string }> }
) {
  const session = await getSession();
  if (!session?.isSystemAdmin) {
    return apiError("No autorizado.", "FORBIDDEN", { statusCode: 403 });
  }

  const { schoolId } = await params;
  const body = await req.json();
  const { status } = body;

  if (!["ACTIVE", "SUSPENDED", "INACTIVE"].includes(status)) {
    return apiError("Estado no válido.", "VALIDATION_ERROR", { statusCode: 400 });
  }

  const updated = await toggleSchoolSubscription(schoolId, status);

  return apiSuccess(
    { school: updated },
    { message: `Estado institucional actualizado a ${status}` }
  );
}

