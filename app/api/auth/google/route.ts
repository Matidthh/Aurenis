export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { setSessionCookie, signSessionToken } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Correo institucional de Google inválido." }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Buscar usuario en la base de datos por correo
    let user = await prisma.user.findUnique({
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
    });

    // Si el usuario no existe pero es un correo institucional válido de Google Workspace (@lpmm.cl o similar)
    if (!user) {
      const domain = normalizedEmail.split("@")[1];
      const school = await prisma.school.findFirst({
        where: {
          OR: [
            { slug: domain },
            { emailDomain: domain },
          ],
        },
      });

      if (school) {
        const nameParts = (name || "Usuario Google").split(" ");
        const firstName = nameParts[0] || "Usuario";
        const lastName = nameParts.slice(1).join(" ") || "Institucional";

        const defaultRole = await prisma.role.findFirst({ where: { schoolId: school.id } });

        user = await prisma.user.create({
          data: {
            email: normalizedEmail,
            passwordHash: "GOOGLE_OAUTH_MANAGED",
            firstName,
            lastName,
            isActive: true,
            memberships: defaultRole ? {
              create: {
                schoolId: school.id,
                roleId: defaultRole.id,
                status: "ACTIVE",
              },
            } : undefined,
          },
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
        });
      } else {
        return NextResponse.json(
          { error: "El dominio de correo Google Workspace no está asociado a ningún establecimiento activo en Aurenis." },
          { status: 403 }
        );
      }
    }

    if (!user || !user.isActive) {
      return NextResponse.json({ error: "Cuenta de usuario desactivada o no encontrada." }, { status: 403 });
    }

    const activeMemberships = user.memberships || [];
    if (activeMemberships.length === 0 && !user.isSystemAdmin) {
      return NextResponse.json({ error: "No tienes membresías activas asociadas a tu cuenta de Google." }, { status: 403 });
    }

    const mem = activeMemberships[0];
    const permissions = mem && mem.role && mem.role.permissions 
      ? mem.role.permissions.map((rp: any) => rp.permission.code) 
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

    const redirectUrl = user.isSystemAdmin ? "/system/dashboard" : mem ? `/${mem.school.slug}/dashboard` : "/select-school";

    return NextResponse.json({
      success: true,
      token,
      redirectUrl,
      user: {
        id: user.id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        roleName: mem?.role?.name,
        activeSchool: mem?.school ? {
          id: mem.school.id,
          slug: mem.school.slug,
          name: mem.school.name,
        } : undefined,
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
