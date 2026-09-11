import { listAllSchools } from "@/lib/services/school.service";
import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { Page } from "@/components/layout/page";
import { PageHeader } from "@/components/ui/page-header";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export default async function SchoolsListPage() {
  const schools = await listAllSchools();

  return (
    <Page>
      <PageHeader
        title="Colegios e Instituciones"
        description="Administra todas las instituciones educativas activas en Aurenis."
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Panel General", href: "/system/dashboard" },
              { label: "Colegios e Instituciones" },
            ]}
          />
        }
        actions={
          <Link
            href="/system/schools/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Nuevo Colegio
          </Link>
        }
      />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Institución</th>
              <th className="px-6 py-4">Ruta (Slug)</th>
              <th className="px-6 py-4">Régimen</th>
              <th className="px-6 py-4">Miembros</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900 dark:text-white">{school.name}</div>
                  <div className="text-xs text-slate-400">{school.city}, {school.country}</div>
                </td>
                <td className="px-6 py-4 font-mono text-xs text-brand-600">
                  /{school.slug}
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  {school.settings?.termType || "SEMESTER"}
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                  {school._count.memberships} usuarios
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {school.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/${school.slug}/dashboard`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700 dark:hover:text-brand-400"
                  >
                    <span>Entrar</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}

            {schools.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No hay instituciones registradas todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Page>
  );
}
