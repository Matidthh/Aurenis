import { prisma } from "@/lib/db/prisma";
import Link from "next/link";
import { Building2, Users, Layers, ArrowUpRight } from "lucide-react";

export default async function SystemDashboardPage() {
  const [totalSchools, totalUsers, totalMemberships, recentSchools] = await Promise.all([
    prisma.school.count(),
    prisma.user.count(),
    prisma.membership.count(),
    prisma.school.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { memberships: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Panel Global de Administración</h1>
        <p className="text-sm text-slate-500">
          Supervisión técnica y operativa de la plataforma Aurenis Multi-Tenant.
        </p>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Instituciones</span>
            <Building2 className="w-5 h-5 text-brand-600" />
          </div>
          <p className="text-3xl font-extrabold">{totalSchools}</p>
          <p className="text-xs text-slate-400">Colegios y liceos registrados</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Cuentas de Usuario</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-extrabold">{totalUsers}</p>
          <p className="text-xs text-slate-400">Usuarios únicos en el sistema</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Membresías Activas</span>
            <Layers className="w-5 h-5 text-indigo-600" />
          </div>
          <p className="text-3xl font-extrabold">{totalMemberships}</p>
          <p className="text-xs text-slate-400">Vínculos institución-usuario</p>
        </div>
      </div>

      {/* Instituciones Recientes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Instituciones Registradas Recientemente</h2>
          <Link
            href="/system/schools/new"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition"
          >
            + Nueva Institución
          </Link>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recentSchools.map((school) => (
            <div key={school.id} className="py-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">{school.name}</h3>
                <p className="text-xs text-slate-400">
                  Slug: <span className="font-mono text-brand-600">/{school.slug}</span> • {school.city}, {school.country}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                  {school._count.memberships} miembros
                </span>
                <Link
                  href={`/${school.slug}/dashboard`}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 transition"
                  title="Visitar Tenant"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}

          {recentSchools.length === 0 && (
            <div className="py-8 text-center text-sm text-slate-400">
              Aún no hay instituciones registradas. Utiliza el botón &quot;+ Nueva Institución&quot; para comenzar el onboarding.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
