"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  ExternalLink, 
  ShieldCheck, 
  AlertTriangle, 
  CreditCard, 
  Users, 
  Globe, 
  CheckCircle2, 
  XCircle,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SchoolItem {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  customDomain?: string | null;
  institutionalCode: string;
  city: string;
  country: string;
  status: "ACTIVE" | "SUSPENDED" | "INACTIVE";
  subscription: {
    plan: "BASIC" | "PRO" | "ENTERPRISE";
    status: "ACTIVE" | "TRIAL" | "SUSPENDED_PAYMENT" | "EXPIRED" | "CANCELLED";
    maxStudents: number;
    currentStudents: number;
    monthlyFeeClp: number;
    billingCycle: "MONTHLY" | "ANNUAL";
    renewalDate: string;
    isPaymentUpToDate: boolean;
    lastPaymentDate: string;
  };
  settings: {
    termType: "SEMESTER" | "TRIMESTER";
    primaryColor: string;
  };
  _count: {
    memberships: number;
    courses: number;
  };
}

export function SchoolSubscriptionTable({ initialSchools }: { initialSchools: SchoolItem[] }) {
  const [schools, setSchools] = useState<SchoolItem[]>(initialSchools);
  const [filter, setFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const filteredSchools = schools.filter((s) => {
    if (filter === "ACTIVE") return s.status === "ACTIVE";
    if (filter === "SUSPENDED") return s.status === "SUSPENDED";
    return true;
  });

  const handleToggleStatus = async (schoolId: string, currentStatus: string) => {
    setLoadingId(schoolId);
    const newStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

    // Llamar al endpoint o actualizar estado localmente
    try {
      const res = await fetch(`/api/system/schools/${schoolId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      // Actualizar localmente de inmediato para feedback instantáneo
      setSchools((prev) =>
        prev.map((s) => {
          if (s.id === schoolId || s.slug === schoolId) {
            const isNowActive = newStatus === "ACTIVE";
            return {
              ...s,
              status: isNowActive ? "ACTIVE" : "SUSPENDED",
              subscription: {
                ...s.subscription,
                status: isNowActive ? "ACTIVE" : "SUSPENDED_PAYMENT",
                isPaymentUpToDate: isNowActive,
              },
            };
          }
          return s;
        })
      );

      setNotification(
        newStatus === "ACTIVE"
          ? "Colegio reactivado: Suscripción al día y acceso habilitado."
          : "Colegio suspendido: Acceso pausado por falta de pago."
      );
      setTimeout(() => setNotification(null), 4000);
    } catch {
      // Fallback local
      setSchools((prev) =>
        prev.map((s) => {
          if (s.id === schoolId || s.slug === schoolId) {
            const isNowActive = newStatus === "ACTIVE";
            return {
              ...s,
              status: isNowActive ? "ACTIVE" : "SUSPENDED",
              subscription: {
                ...s.subscription,
                status: isNowActive ? "ACTIVE" : "SUSPENDED_PAYMENT",
                isPaymentUpToDate: isNowActive,
              },
            };
          }
          return s;
        })
      );
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Toast de notificación */}
      {notification && (
        <div className="p-3.5 rounded-xl bg-slate-900 text-white text-xs font-medium flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2">
          <span>{notification}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-white ml-3">
            ✕
          </button>
        </div>
      )}

      {/* Barra de Filtros y Métricas Rápidas */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "ALL"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Todos ({schools.length})
          </button>
          <button
            onClick={() => setFilter("ACTIVE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "ACTIVE"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Al Día ({schools.filter((s) => s.status === "ACTIVE").length})
          </button>
          <button
            onClick={() => setFilter("SUSPENDED")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              filter === "SUSPENDED"
                ? "bg-amber-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Suspendidos ({schools.filter((s) => s.status === "SUSPENDED").length})
          </button>
        </div>

        <div className="text-xs text-slate-500 flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Subdominios Wildcard activos (*.aurenis.app)
          </span>
          <span className="font-semibold text-slate-700">
            MRR Total: $
            {schools
              .filter((s) => s.status === "ACTIVE")
              .reduce((acc, curr) => acc + curr.subscription.monthlyFeeClp, 0)
              .toLocaleString("es-CL")}{" "}
            CLP
          </span>
        </div>
      </div>

      {/* Tabla de Colegios */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Institución & Subdominio</th>
                <th className="px-6 py-4">Plan SaaS</th>
                <th className="px-6 py-4">Capacidad Alumnos</th>
                <th className="px-6 py-4">Facturación & Cobro</th>
                <th className="px-6 py-4">Estado Licencia</th>
                <th className="px-6 py-4 text-right">Acciones Directas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSchools.map((school) => {
                const isSuspended = school.status === "SUSPENDED";
                const percentage = Math.round(
                  (school.subscription.currentStudents / school.subscription.maxStudents) * 100
                );

                return (
                  <tr
                    key={school.id}
                    className={`hover:bg-slate-50/60 transition ${
                      isSuspended ? "bg-amber-50/30" : ""
                    }`}
                  >
                    {/* Institución & Subdominio */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-xs"
                          style={{ backgroundColor: school.settings.primaryColor || "#0284c7" }}
                        >
                          {school.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{school.name}</div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Globe className="w-3 h-3 text-slate-400" />
                            <code className="text-xs font-mono text-brand-600 font-medium">
                              {school.subdomain}
                            </code>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {school.city}, {school.country} • Cód: {school.institutionalCode}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Plan */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            school.subscription.plan === "ENTERPRISE"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : school.subscription.plan === "PRO"
                              ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                              : "bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          {school.subscription.plan}
                        </span>
                        <div className="text-xs text-slate-500 font-medium">
                          ${school.subscription.monthlyFeeClp.toLocaleString("es-CL")} / mes
                        </div>
                      </div>
                    </td>

                    {/* Capacidad Alumnos */}
                    <td className="px-6 py-4">
                      <div className="space-y-1.5 max-w-[140px]">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                          <span>
                            {school.subscription.currentStudents} / {school.subscription.maxStudents}
                          </span>
                          <span className="text-[11px] text-slate-400">{percentage}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percentage > 90
                                ? "bg-red-500"
                                : percentage > 70
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Facturación */}
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5">
                        <div className="text-slate-600">
                          Ciclo: <strong>{school.subscription.billingCycle === "ANNUAL" ? "Anual" : "Mensual"}</strong>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Próx. Cobro: {school.subscription.renewalDate}
                        </div>
                      </div>
                    </td>

                    {/* Estado Licencia */}
                    <td className="px-6 py-4">
                      {isSuspended ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          Pago Pendiente (Suspendido)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Al Día (Activo)
                        </span>
                      )}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Botón de suspender o reactivar por pago */}
                        <button
                          onClick={() => handleToggleStatus(school.id, school.status)}
                          disabled={loadingId === school.id}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                            isSuspended
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                              : "bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200"
                          }`}
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{isSuspended ? "Reactivar Pago" : "Suspender Pago"}</span>
                        </button>

                        {/* Entrar al portal */}
                        <Link
                          href={`/${school.slug}/dashboard`}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition inline-flex items-center gap-1"
                        >
                          <span>Portal</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
