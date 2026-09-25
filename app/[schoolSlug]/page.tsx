import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getSchoolBySlug } from "@/lib/services/school.service";

interface SchoolIndexPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

/**
 * Punto de entrada institucional para rutas dinámicas como:
 * /lpmm -> Redirecciona a /lpmm/dashboard si está autenticado, o a /login?school=lpmm
 */
export default async function SchoolIndexPage({ params }: SchoolIndexPageProps) {
  const { schoolSlug } = await params;
  const session = await getSession();

  // Si el usuario ya cuenta con sesión activa en este establecimiento o es SuperAdmin
  if (session && (session.activeSchoolSlug === schoolSlug || session.isSystemAdmin)) {
    redirect(`/${schoolSlug}/dashboard`);
  }

  // Si no está autenticado en este colegio, redirigir al portal de login institucional
  redirect(`/login?school=${encodeURIComponent(schoolSlug)}`);
}
