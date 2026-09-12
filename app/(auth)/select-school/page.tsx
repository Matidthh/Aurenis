import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
import { getSession } from "@/lib/auth/session";
import { getUserSchools } from "@/lib/services/user.service";
import { SchoolSelectorList } from "./school-selector-list";
import { Building2 } from "lucide-react";

export default async function SelectSchoolPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Si es SystemAdmin, puede ir directo a /system/dashboard
  if (session.isSystemAdmin) {
    redirect("/system/dashboard");
  }

  const schools = await getUserSchools(session.userId);

  if (schools.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sin Institución Asignada</h2>
          <p className="text-sm text-slate-500">
            Tu cuenta no tiene colegios activos asignados actualmente. Por favor, contacta al administrador escolar de tu institución.
          </p>
          <a
            href="/api/auth/logout"
            className="inline-block text-sm text-brand-600 hover:underline pt-2"
          >
            Cerrar Sesión
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Selecciona tu Institución
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Hola <span className="font-semibold text-slate-700 dark:text-slate-200">{session.firstName}</span>, elige el colegio con el que deseas interactuar hoy:
          </p>
        </div>

        <SchoolSelectorList schools={schools} />

        <div className="text-center pt-2">
          <a
            href="/api/auth/logout"
            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition"
          >
            Cerrar Sesión
          </a>
        </div>
      </div>
    </div>
  );
}
