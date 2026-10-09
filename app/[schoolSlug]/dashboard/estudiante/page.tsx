import { requireTenantContext } from "@/lib/tenant/context";
import { getSession } from "@/lib/auth/session";
import { Page } from "@/components/layout/page";
import { EstudianteDashboard } from "@/components/dashboard/estudiante-dashboard";
import { getStudentAcademicRecord } from "@/lib/db/lpmm-curriculum-and-grades";

export default async function EstudianteDashboardPage({
  params,
}: {
  params: Promise<{ schoolSlug: string }>;
}) {
  const { schoolSlug } = await params;
  const tenantCtx = await requireTenantContext(schoolSlug);
  const session = await getSession();

  const userEmail = session?.email || "yamir.ahumada@lpmm.cl";
  const isStudentSelf = session?.roleName === "STUDENT";
  const record =
    getStudentAcademicRecord(userEmail) ||
    (session?.firstName && session?.lastName
      ? getStudentAcademicRecord(`${session.firstName} ${session.lastName}`)
      : null) ||
    getStudentAcademicRecord("yamir.ahumada@lpmm.cl")!;

  return (
    <Page title="Dashboard Estudiantes">
      <EstudianteDashboard
        schoolSlug={schoolSlug}
        studentName={record.fullName || `${session?.firstName || ""} ${session?.lastName || ""}`.trim()}
        studentEmail={record.email}
        courseName={`${record.courseName} — ${record.specialty}`}
        studentRut={record.rut}
        initialRecord={record}
        isStudentSelf={isStudentSelf}
      />
    </Page>
  );
}
