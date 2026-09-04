import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { Shield, Building2, Users, FileText, LogOut } from "lucide-react";

export default async function SystemLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  if (!session || !session.isSystemAdmin) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar de System Admin */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight block">Aurenis Core</span>
            <span className="text-[10px] font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider block">
              Control Plane
            </span>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          <Link
            href="/system/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Shield className="w-4 h-4 text-slate-500" />
            Panel General
          </Link>
          <Link
            href="/system/schools"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Building2 className="w-4 h-4 text-slate-500" />
            Colegios e Instituciones
          </Link>
          <Link
            href="/system/schools/new"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition text-brand-600 font-semibold"
          >
            + Nuevo Colegio (Onboarding)
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <div className="text-xs text-slate-500 mb-2 truncate">
            {session.email}
          </div>
          <a
            href="/api/auth/logout"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            Cerrar Sesión Global
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  );
}
