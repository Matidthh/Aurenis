"use client";

import React, { useState } from "react";
import { X, Check, Clock, AlertCircle, Users, CheckCheck, Save } from "lucide-react";

interface QuickAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
}

interface StudentAttendanceItem {
  id: string;
  name: string;
  rut: string;
  status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED";
}

const INITIAL_ATTENDANCE_STUDENTS: StudentAttendanceItem[] = [
  { id: "st-1", name: "Valentina Muñoz Castro", rut: "21.432.890-4", status: "PRESENT" },
  { id: "st-2", name: "Benjamín Soto Riquelme", rut: "21.765.432-8", status: "PRESENT" },
  { id: "st-3", name: "Isidora Valenzuela Tapia", rut: "22.109.876-K", status: "PRESENT" },
  { id: "st-4", name: "Matías Contreras Alarcón", rut: "21.987.654-3", status: "LATE" },
  { id: "st-5", name: "Florencia Espinoza Navarrete", rut: "22.345.678-1", status: "PRESENT" },
  { id: "st-6", name: "Vicente Morales Sanhueza", rut: "21.654.321-9", status: "ABSENT" },
  { id: "st-7", name: "Sofía Herrera Araya", rut: "22.567.890-2", status: "PRESENT" },
  { id: "st-8", name: "Tomás Sepúlveda Vergara", rut: "21.876.543-7", status: "PRESENT" },
];

export function QuickAttendanceModal({
  isOpen,
  onClose,
  courseName,
}: QuickAttendanceModalProps) {
  const [students, setStudents] = useState<StudentAttendanceItem[]>(INITIAL_ATTENDANCE_STUDENTS);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const presentCount = students.filter((s) => s.status === "PRESENT").length;
  const absentCount = students.filter((s) => s.status === "ABSENT").length;
  const lateCount = students.filter((s) => s.status === "LATE").length;
  const attendanceRate = Math.round(((presentCount + lateCount) / students.length) * 100);

  function handleSetStatus(studentId: string, status: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED") {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, status } : s))
    );
  }

  function handleMarkAllPresent() {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "PRESENT" })));
  }

  function handleSave() {
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Pase Rápido de Asistencia - {courseName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Registro digital diario con sincronización instantánea
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumen */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-600 dark:text-slate-300">
              Presentes: <strong className="text-emerald-600 dark:text-emerald-400">{presentCount}</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Ausentes: <strong className="text-rose-600 dark:text-rose-400">{absentCount}</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Atrasos: <strong className="text-amber-600 dark:text-amber-400">{lateCount}</strong>
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Tasa: <strong className="text-brand-600 dark:text-brand-400">{attendanceRate}%</strong>
            </span>
          </div>
          <button
            onClick={handleMarkAllPresent}
            className="px-3 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Marcar Todos Presentes</span>
          </button>
        </div>

        {/* Lista de Alumnos */}
        <div className="p-6 overflow-y-auto space-y-2 flex-1 divide-y divide-slate-100 dark:divide-slate-800/60">
          {students.map((student) => (
            <div
              key={student.id}
              className="pt-2 first:pt-0 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">
                  {student.name}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                  {student.rut}
                </p>
              </div>

              {/* Botonera de Estado */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleSetStatus(student.id, "PRESENT")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    student.status === "PRESENT"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-emerald-600"
                  }`}
                >
                  P
                </button>
                <button
                  type="button"
                  onClick={() => handleSetStatus(student.id, "LATE")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    student.status === "LATE"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-amber-600"
                  }`}
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => handleSetStatus(student.id, "ABSENT")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    student.status === "ABSENT"
                      ? "bg-rose-600 text-white shadow-sm"
                      : "text-slate-600 dark:text-slate-400 hover:text-rose-600"
                  }`}
                >
                  I
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={savedSuccess}
            className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>Asistencia Guardada</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Asistencia</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
