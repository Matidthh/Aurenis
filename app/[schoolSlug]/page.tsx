import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/session";

interface SchoolIndexPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

/**
 * Punto de entrada institucional para rutas dinámicas como:
 * /lpmm o lpmm.aurenis.app/ -> Redirecciona a /dashboard si está autenticado, o a /login
 */
export default async function SchoolIndexPage({ params }: SchoolIndexPageProps) {
  const { schoolSlug } = await params;
  const session = await getSession();

  const headerList = await headers();
  const host = headerList.get("host") || "";
  const tenantSubdomain = headerList.get("x-tenant-subdomain") || "";
  const isSubdomain = tenantSubdomain === schoolSlug || host.startsWith(`${schoolSlug}.`);

  // Si el usuario ya cuenta con sesión activa en este establecimiento o es SuperAdmin
  if (session && (session.activeSchoolSlug === schoolSlug || session.isSystemAdmin)) {
    redirect(isSubdomain ? "/dashboard" : `/${schoolSlug}/dashboard`);
  }

  // Si no está autenticado en este colegio, redirigir al portal de login institucional
  redirect(isSubdomain ? "/login" : `/login?school=${encodeURIComponent(schoolSlug)}`);
}
