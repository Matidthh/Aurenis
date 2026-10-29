import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { getSession } from "@/lib/auth/session";
import { getSchoolBySlug } from "@/lib/services/school.service";
import { InstitutionalPortal } from "@/components/school/institutional-portal";

interface SchoolIndexPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

/**
 * Extrae el subdominio de cualquier encabezado host eliminando puertos y prefijos reservados
 */
function extractSubdomainFromHost(hostHeader: string | null): string | null {
  if (!hostHeader) return null;
  const cleanHost = hostHeader.split(":")[0].toLowerCase().trim();
  const parts = cleanHost.split(".");
  const RESERVED_SUBDOMAINS = new Set([
    "www",
    "app",
    "api",
    "admin",
    "auth",
    "mail",
    "system",
    "localhost",
    "127",
  ]);

  // Soporte para dominios institucionales de producción: *.aurenis.app, *.aurenis.com, *.aurenis.cl
  if (
    cleanHost.endsWith(".aurenis.app") ||
    cleanHost.endsWith(".aurenis.com") ||
    cleanHost.endsWith(".aurenis.cl")
  ) {
    if (parts.length >= 3) {
      const sub = parts[0];
      if (!RESERVED_SUBDOMAINS.has(sub)) {
        return sub;
      }
    }
  } else if (cleanHost.includes("localhost") || cleanHost.includes("127.0.0.1")) {
    if (parts.length >= 2) {
      const sub = parts[0];
      if (!RESERVED_SUBDOMAINS.has(sub)) {
        return sub;
      }
    }
  }

  return null;
}

/**
 * Punto de entrada institucional para rutas dinámicas como:
 * /colegio o colegio.aurenis.app/ -> Redirecciona a su panel limpio sin requerir parámetros manuales.
 * Autores: 👑 Maicol R. (Arquitectura y Backend) & 💻 Malcom Marcelo (Lógica de Cliente)
 */
export default async function SchoolIndexPage({ params }: SchoolIndexPageProps) {
  const { schoolSlug } = await params;
  const session = await getSession();

  const headerList = await headers();
  const rawHost =
    headerList.get("x-forwarded-host") ||
    headerList.get("host") ||
    headerList.get("x-original-host") ||
    "";
  const headerSubdomain = headerList.get("x-tenant-subdomain");
  const hostSubdomain = extractSubdomainFromHost(rawHost);

  // 1. Subdominio detectado por cabeceras perimetrales WAF, proxies o middleware
  const detectedSubdomain = headerSubdomain || hostSubdomain;

  // 2. Resolver entidad escolar canónica (asocia subdominios como 'sanjose' a 'colegio-san-jose')
  const school = await getSchoolBySlug(detectedSubdomain || schoolSlug);
  const canonicalSlug = school?.slug || schoolSlug;

  // 3. Determinación infalible de si la petición proviene de un subdominio institucional dedicado
  const isSubdomain = Boolean(
    detectedSubdomain ||
      (school?.subdomain && rawHost.toLowerCase().includes(school.subdomain.split(".")[0]))
  );

  // 4. Verificación de autorización de sesión en la institución solicitada
  const isAuthorized =
    session &&
    (session.isSystemAdmin ||
      session.activeSchoolSlug?.toLowerCase() === canonicalSlug.toLowerCase() ||
      session.activeSchoolSlug?.toLowerCase() === schoolSlug.toLowerCase() ||
      (school?.id && session.activeSchoolId === school.id));

  // 5. Subruta específica asignada al rol del usuario en la plataforma
  const roleUpper = (session?.roleName || "").toUpperCase();
  let roleSubpath = "";
  if (roleUpper === "STUDENT") roleSubpath = "/estudiante";
  else if (roleUpper === "TEACHER") roleSubpath = "/docente";
  else if (roleUpper === "ADMIN" || roleUpper === "DIRECTOR" || roleUpper === "SCHOOL_ADMIN") {
    roleSubpath = "/directivo";
  } else if (roleUpper === "GUARDIAN") roleSubpath = "/apoderado";
  else if (roleUpper === "CONVIVENCIA") roleSubpath = "/convivencia";

  // CASO A: Usuario autenticado con membresía válida en este establecimiento
  if (isAuthorized) {
    if (isSubdomain) {
      redirect(`/dashboard${roleSubpath}`);
    }
    redirect(`/${canonicalSlug}/dashboard${roleSubpath}`);
  }

  // CASO B: Usuario autenticado pero perteneciente a otra institución (Prevención BOLA/IDOR)
  if (session && !isAuthorized) {
    if (session.activeSchoolSlug) {
      redirect(`/${session.activeSchoolSlug}/dashboard?notice=tenant_switch_required`);
    }
    redirect("/select-school");
  }

  // CASO C: Usuario no autenticado que visita colegio.aurenis.app
  // Renderizamos el Portal Institucional autónomo con identidad del colegio
  return <InstitutionalPortal school={school} isSubdomainMode={isSubdomain} />;
}
