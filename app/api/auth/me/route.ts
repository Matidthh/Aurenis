import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { withErrorHandler, UnauthorizedError } from "@/lib/middleware/error-handler";

export const GET = withErrorHandler(async () => {
  const session = await getSession();

  if (!session) {
    throw new UnauthorizedError("No autenticado");
  }

  return NextResponse.json({
    success: true,
    user: {
      id: session.userId,
      email: session.email,
      firstName: session.firstName,
      lastName: session.lastName,
      fullName: `${session.firstName} ${session.lastName}`,
      isSystemAdmin: session.isSystemAdmin,
      activeSchoolId: session.activeSchoolId,
      activeSchoolSlug: session.activeSchoolSlug,
      activeMembershipId: session.activeMembershipId,
      roleName: session.roleName,
      permissions: session.permissions,
    },
  });
});