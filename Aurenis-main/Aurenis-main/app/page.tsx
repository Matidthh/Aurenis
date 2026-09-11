import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
          Aurenis v1.0 • Multi-Tenant Core
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
          Plataforma de Gestión Académica Multi-Institución
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300">
          Aislamiento garantizado por colegio, membresías unificadas, roles y permisos granulares.
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/select-school"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 transition"
          >
            Seleccionar Institución
          </Link>
        </div>
      </div>
    </main>
  );
}
