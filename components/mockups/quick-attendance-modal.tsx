"use client";

import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Save,
  Wifi,
  WifiOff,
  Sparkles,
  ShieldCheck,
  X,
  FileSignature,
} from "lucide-react";

interface StudentAttendanceItem {
  id: string;
  name: string;
  rut: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
  notes?: string;
}

const SAMPLE_STUDENTS: StudentAttendanceItem[] = [
  { id: "s1", name: "Álvarez Morales, Camila Paz", rut: "21.458.932-4", status: "PRESENT" },
  { id: "s2", name: "Barrientos Soto, Matías Ignacio", rut: "21.849.201-K", status: "PRESENT" },
  { id: "s3", name: "Cárdenas Silva, Florencia Antonia", rut: "22.103.495-8", status: "LATE" },
  { id: "s4", name: "Delgado Vera, Benjamín Andrés", rut: "21.930.128-3", status: "PRESENT" },
  { id: "s5", name: "Espinoza Ruiz, Valentina Isidora", rut: "21.784.629-1", status: "EXCUSED" },
  { id: "s6", name: "Fuentes Muñoz, Sebastián Nicolás", rut: "22.049.184-7", status: "ABSENT" },
  { id: "s7", name: "Gómez Castro, Martina Ignacia", rut: "21.650.392-5", status: "PRESENT" },
  { id: "s8", name: "Herrera Pardo, Lucas Maximiliano", rut: "21.902.584-0", status: "PRESENT" },
];

export interface QuickAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName?: string;
  subjectName?: string;
}

export function QuickAttendanceModal({
  isOpen,
  onClose,
  courseName = "1° Medio B",
  subjectName = "Matemática",
}: QuickAttendanceModalProps) {
  const [students, setStudents] = useState<StudentAttendanceItem[]>(SAMPLE_STUDENTS);
  const [isOffline, setIsOffline] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [digitalSignApproved, setDigitalSignApproved] = useState(false);

  if (!isOpen) return null;

  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const excusedCount = students.filter((s) => s.status === "EXCUSED").length;
  const attendancePct = Math.round(((presentCount + lateCount) / students.length) * 100);

  const handleSetStatus = (id: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleMarkAll = (status: "PRESENT" | "ABSENT") => {
    setStudents((prev) => prev.map((s) => ({ ...s, status })));
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold">
                <Users className="w-4 h-4" />
              </span>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Toma Rápida de Asistencia Diaria
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Curso: <span className="font-semibold text-slate-800 dark:text-slate-200">{courseName}</span> • Asignatura:{" "}
              <span className="font-semibold text-slate-800 dark:text-slate-200">{subjectName}</span> • Fecha: Hoy
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumen y Acciones Rápidas */}
        <div className="p-4 bg-slate-100/60 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              Asistencia: <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{attendancePct}%</span>
            </span>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                {presentCount} Presentes
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold">
                {absentCount} Ausentes
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                {lateCount} Atrasos
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                {excusedCount} Justificados
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleMarkAll("PRESENT")}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 transition cursor-pointer text-[11px]"
            >
              Todos Presentes
            </button>
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 cursor-pointer transition ${
                isOffline
                  ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300"
                  : "bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300"
              }`}
            >
              {isOffline ? <WifiOff className="w-3 h-3" /> : <Wifi className="w-3 h-3" />}
              <span>{isOffline ? "Modo Offline (Cola Local)" : "Online Sync"}</span>
            </button>
          </div>
        </div>

        {/* Lista de Alumnos */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100 dark:divide-slate-800">
          {students.map((student) => (
            <div
              key={student.id}
              className="pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
                <div className="text-[11px] font-mono text-slate-400">RUN: {student.rut}</div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSetStatus(student.id, "PRESENT")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    student.status === "PRESENT"
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  Presente
                </button>
                <button
                  onClick={() => handleSetStatus(student.id, "ABSENT")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    student.status === "ABSENT"
                      ? "bg-rose-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                  }`}
                >
                  Ausente
                </button>
                <button
                  onClick={() => handleSetStatus(student.id, "LATE")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    student.status === "LATE"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                  }`}
                >
                  Atraso
                </button>
                <button
                  onClick={() => handleSetStatus(student.id, "EXCUSED")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    student.status === "EXCUSED"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  Justif.
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={digitalSignApproved}
              onChange={(e) => setDigitalSignApproved(e.target.checked)}
              className="rounded text-brand-600"
            />
            <span className="flex items-center gap-1">
              <FileSignature className="w-3.5 h-3.5 text-indigo-500" />
              Firmar digitalmente según Circular N°30 MINEDUC
            </span>
          </label>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex-1 sm:flex-none"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              disabled={savedSuccess}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? "¡Asistencia Guardada!" : "Guardar Asistencia"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
