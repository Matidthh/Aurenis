"use client";

import React, { useState } from "react";
import { Plus, X, BookOpen, Save, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EducationLevel {
  id: string;
  name: string;
  orderIndex: number;
}

export interface CreateCourseModalProps {
  schoolSlug: string;
  educationLevels: EducationLevel[];
  currentYear: number;
}

export function CreateCourseModal({
  schoolSlug,
  educationLevels,
  currentYear,
}: CreateCourseModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [gradeNumber, setGradeNumber] = useState<number>(1);
  const [letter, setLetter] = useState("A");
  const [educationLevelId, setEducationLevelId] = useState(
    educationLevels[0]?.id || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Form submission handling
      setTimeout(() => {
        setIsSubmitting(false);
        setIsOpen(false);
        setName("");
      }, 500);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Nuevo Curso</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-brand-100 dark:bg-brand-950 text-brand-600 font-bold">
                  <BookOpen className="w-4 h-4" />
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Crear Curso ({currentYear})
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  Nombre del Curso (ej. 1° Medio A)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: 1° Medio A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Nivel Educativo
                  </label>
                  <select
                    value={educationLevelId}
                    onChange={(e) => setEducationLevelId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    {educationLevels.map((lvl) => (
                      <option key={lvl.id} value={lvl.id}>
                        {lvl.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Letra / División
                  </label>
                  <select
                    value={letter}
                    onChange={(e) => setLetter(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold shadow-md shadow-brand-500/20 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Guardando..." : "Crear Curso"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
