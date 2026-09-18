"use client";

import React, { useState } from "react";
import {
  X,
  UserCheck,
  UserX,
  Clock,
  CheckCircle2,
  Check,
  Lock,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface QuickAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
}

type AttendanceStatus = "present" | "absent" | "late";

interface StudentAttendance {
  id: string;
  name: string;
  status: AttendanceStatus;
}

export function QuickAttendanceModal({
  isOpen,
  onClose,
  courseName = "1° Medio B",
}: QuickAttendanceModalProps) {
  const [students, setStudents] = useState<StudentAttendance[]>([
    { id: "1", name: "Álvarez Barra, Valentina", status: "present" },
    { id: "2", name: "Castro Morales, Benjamín", status: "present" },
    { id: "3", name: "Díaz Fuentes, Camila", status: "present" },
    { id: "4", name: "Espinoza Valdés, Rodrigo", status: "late" },
    { id: "5", name: "Fernández Silva, Mateo", status: "absent" },
    { id: "6", name: "Gómez Soto, Matías", status: "present" },
    { id: "7", name: "Hernández Palma, Sofía", status: "present" },
    { id: "8", name: "Jara Carrasco, Ignacio", status: "present" },
    { id: "9", name: "Muñoz Vera, Catalina", status: "present" },
    { id: "10", name: "Rojas Castro, Valentina", status: "present" },
  ]);

  const [isSigning, setIsSigning] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  if (!isOpen) return null;

  const totalPresent = students.filter((s) => s.status === "present").length;
  const totalAbsent = students.filter((s) => s.status === "absent").length;
  const totalLate = students.filter((s) => s.status === "late").length;
  const percentage = Math.round(((totalPresent + totalLate) / students.length) * 100);

  function handleSetStatus(id: string, status: AttendanceStatus) {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }

  function handleMarkAll(status: AttendanceStatus) {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  }

  function handleSignBook() {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSigned(true);
      setTimeout(() => {
        setIsSigned(false);
        onClose();
      }, 1500);
    }, 1000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Pase de Lista Rápido en 1 Clic
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200">
                {courseName}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Lunes, Bloque 10:00 - 11:30 hrs • Matemática
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Estadísticas Rápidas */}
        <div className="bg-slate-100 dark:bg-slate-800/80 px-5 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-700 text-xs font-semibold">
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 dark:text-emerald-400">
              Presentes: <strong>{totalPresent}</strong>
            </span>
            <span className="text-rose-700 dark:text-rose-400">
              Ausentes: <strong>{totalAbsent}</strong>
            </span>
            <span className="text-amber-700 dark:text-amber-400">
              Atrasos: <strong>{totalLate}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Asistencia:</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-extrabold">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Acciones Rápidas en Lote */}
        <div className="px-5 py-2 flex items-center justify-between bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-xs">
          <span className="text-slate-400 text-[11px]">Marcar todos como:</span>
          <div className="flex gap-2">
            <button
              onClick={() => handleMarkAll("present")}
              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition"
            >
              Todos Presentes
            </button>
            <button
              onClick={() => handleMarkAll("absent")}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Lista de Alumnos */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {students.map((st, idx) => (
            <div
              key={st.id}
              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850/50 transition text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono font-bold text-slate-400 w-5">
                  {idx + 1}.
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {st.name}
                </span>
              </div>

              {/* Botones de Estado */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleSetStatus(st.id, "present")}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition ${
                    st.status === "present"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600"
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>P</span>
                </button>

                <button
                  onClick={() => handleSetStatus(st.id, "late")}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition ${
                    st.status === "late"
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-600"
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>A</span>
                </button>

                <button
                  onClick={() => handleSetStatus(st.id, "absent")}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 transition ${
                    st.status === "absent"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600"
                  }`}
                >
                  <X className="w-3 h-3" />
                  <span>Aus</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer con Firma Digital */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Firma digital acreditada MINEDUC</span>
          </div>

          <button
            onClick={handleSignBook}
            disabled={isSigning || isSigned}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-md ${
              isSigned
                ? "bg-emerald-600"
                : "bg-brand-600 hover:bg-brand-700 disabled:opacity-50"
            }`}
          >
            {isSigning ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Firmando Libro...</span>
              </>
            ) : isSigned ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Asistencia Firmada!</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Firmar y Guardar Asistencia</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
