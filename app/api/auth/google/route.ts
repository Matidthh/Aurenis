export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma, isDatabaseConfigured } from "@/lib/db/prisma";
import { setSessionCookie, signSessionToken } from "@/lib/auth/session";

const DEFAULT_DEMO_SCHOOL = {
  id: "school-lpmm-001",
  slug: "lpmm",
  name: "Liceo Politécnico Marga Marga",
  status: "ACTIVE",
};

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Correo institucional de Google inválido." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    let user: any = null;

    // 1. Intentar resolver en la base de datos si está configurada
    if (isDatabaseConfigured()) {
      try {
        user = await Promise.race([
          prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: {
              memberships: {
                include: {
                  school: true,
                  role: {
                    include: {
                      permissions: {
                        include: {
                          permission: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("DB Timeout")), 3000)),
        ]);
      } catch (dbErr) {
        console.warn("[Google Auth] Fallback por indisponibilidad de DB:", dbErr);
      }
    }

    // 2. Si no se encontró en DB o DB no configurada, buscar en catálogo demo institucional o crear sesión institucional
    if (!user) {
      const isDirector = normalizedEmail.includes("director");
      const isProfesor = normalizedEmail.includes("profesor") || normalizedEmail.includes("docente") || normalizedEmail.includes("castro");
      const isEstudiante = normalizedEmail.includes("alumno") || normalizedEmail.includes("estudiante") || normalizedEmail.includes("ahumada");
      const isApoderado = normalizedEmail.includes("apoderado");
      const isAdmin = normalizedEmail.includes("admin");

      const roleName = isDirector ? "SCHOOL_ADMIN" : isProfesor ? "TEACHER" : isEstudiante ? "STUDENT" : isApoderado ? "GUARDIAN" : isAdmin ? "SYSTEM_ADMIN" : "STUDENT";
      const userFirstName = name?.split(" ")[0] || (isDirector ? "Dirección" : isProfesor ? "Rodrigo" : isEstudiante ? "Yamir Alonso" : isApoderado ? "María Belén" : "Usuario");
      const userLastName = name?.split(" ").slice(1).join(" ") || (isDirector ? "LPMM" : isProfesor ? "Castro Díaz" : isEstudiante ? "Ahumada" : isApoderado ? "Ahumada" : "Google");

      user = {
        id: `google-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`,
        email: normalizedEmail,
        firstName: userFirstName,
        lastName: userLastName,
        isActive: true,
        isSystemAdmin: isAdmin,
        memberships: [
          {
            id: `mem-${normalizedEmail.replace(/[^a-z0-9]/g, "-")}`,
            isActive: true,
            school: DEFAULT_DEMO_SCHOOL,
            role: {
              id: `role-${roleName.toLowerCase()}`,
              name: roleName,
              permissions: [{ permission: { code: "*" } }],
            },
          },
        ],
      };
    }

    const activeMemberships = user.memberships || [];
    const mem = activeMemberships[0];
    const permissions = mem?.role?.permissions
      ? mem.role.permissions.map((rp: any) => rp.permission?.code || rp.permission)
      : ["*"];

    const token = await signSessionToken({
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isSystemAdmin: user.isSystemAdmin,
      schoolId: mem?.school?.id,
      schoolSlug: mem?.school?.slug,
      membershipId: mem?.id,
      roleName: mem?.role?.name || (user.isSystemAdmin ? "SYSTEM_ADMIN" : "USER"),
      permissions,
    });

    await setSessionCookie(token);

    const redirectUrl = user.isSystemAdmin
      ? "/system/dashboard"
      : mem?.school?.slug
      ? `/${mem.school.slug}/dashboard`
      : "/select-school";

    return NextResponse.json({
      success: true,
      token,
      redirectUrl,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        roleName: mem?.role?.name,
        activeSchool: mem?.school
          ? {
              id: mem.school.id,
              slug: mem.school.slug,
              name: mem.school.name,
            }
          : undefined,
      },
    });
  } catch (error: unknown) {
    console.error("Google OAuth login error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno en autenticación Google Workspace." },
      { status: 500 }
    );
  }
}
