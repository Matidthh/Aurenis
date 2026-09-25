import { redirect } from "next/navigation";

interface SchoolLoginPageProps {
  params: Promise<{
    schoolSlug: string;
  }>;
}

/**
 * Atajo institucional: /[schoolSlug]/login -> /login?school=[schoolSlug]
 */
export default async function SchoolLoginPage({ params }: SchoolLoginPageProps) {
  const { schoolSlug } = await params;
  redirect(`/login?school=${encodeURIComponent(schoolSlug)}`);
}
