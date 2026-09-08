import { NextRequest, NextResponse } from "next/server";
import { LoginSchema } from "@/lib/validations/auth.schema";
import { authenticateUser } from "@/lib/services/user.service";
import { setSessionCookie, signSessionToken } from "@/lib/auth/session";
import { withRateLimit, RATE_LIMIT_CONFIGS } from "@/lib/middleware/rate-limit";
import { withValidation } from "@/lib/middleware/validation";
import { withErrorHandler, UnauthorizedError } from "@/lib/middleware/error-handler";

const handler = withRateLimit(RATE_LIMIT_CONFIGS.LOGIN)(
  withValidation(LoginSchema)(
    withErrorHandler(async (req: NextRequest, context, data) => {
      const user = await authenticateUser(data.email, data.password);

      // Caso A: SuperAdmin del Sistema
      if (user.isSystemAdmin) {
        const token = await signSessionToken({
          sub: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isSystemAdmin: true,
          permissions: ["*"],
        });

        await setSessionCookie(token);

        return NextResponse.json({
          success: true,
          redirectUrl: "/system/dashboard",
          user: {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            isSystemAdmin: true,
          },
        });
      }

      // Caso B: Usuario institucional
      const activeMemberships = user.memberships;

      if (activeMemberships.length === 0) {
        throw new UnauthorizedError("No tienes una membresía activa en ninguna institución educativa.");
      }

      // Si tiene exactamente 1 colegio asociado, activamos su contexto inmediatamente
      if (activeMemberships.length === 1) {
        const mem = activeMemberships[0];
        const permissions = mem.role.permissions.map((rp) => rp.permission.code);

        const token = await signSessionToken({
          sub: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isSystemAdmin: false,
          schoolId: mem.school.id,
          schoolSlug: mem.school.slug,
          membershipId: mem.id,
          roleName: mem.role.name,
          permissions,
        });

        await setSessionCookie(token);

        return NextResponse.json({
          success: true,
          redirectUrl: `/${mem.school.slug}/dashboard`,
          user: {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            activeSchool: {
              id: mem.school.id,
              slug: mem.school.slug,
              name: mem.school.name,
            },
          },
        });
      }

      // Si tiene múltiples colegios, emitimos sesión parcial y lo enviamos al selector
      const token = await signSessionToken({
        sub: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isSystemAdmin: false,
        permissions: [],
      });

      await setSessionCookie(token);

      return NextResponse.json({
        success: true,
        redirectUrl: "/select-school",
        user: {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          multipleSchools: true,
        },
      });
    })
  )
);

export { handler as POST };
