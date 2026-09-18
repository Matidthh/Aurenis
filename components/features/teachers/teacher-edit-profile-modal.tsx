"use client";

import React, { useState } from "react";
import {
  X,
  User,
  GraduationCap,
  Mail,
  Phone,
  Clock,
  ShieldCheck,
  Save,
  CheckCircle2,
  Award,
  BookOpen,
  Calendar,
} from "lucide-react";
import { TeacherData } from "./teacher-management-mockup";

interface TeacherEditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacher: TeacherData | null;
  onSave?: (updatedTeacher: TeacherData) => void;
}

export function TeacherEditProfileModal({
  isOpen,
  onClose,
  teacher,
  onSave,
}: TeacherEditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    rut: "",
    email: "",
    phone: "",
    specialty: "",
    department: "Matemática & Ciencias" as TeacherData["department"],
    contractHours: 44,
    headTeacherOf: "",
    status: "Activo" as TeacherData["status"],
    digitalSignatureActive: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  React.useEffect(() => {
    if (teacher) {
      setFormData({
        name: teacher.name,
        rut: teacher.rut,
        email: teacher.email,
        phone: teacher.phone,
        specialty: teacher.specialty,
        department: teacher.department,
        contractHours: teacher.contractHours,
        headTeacherOf: teacher.headTeacherOf || "",
        status: teacher.status,
        digitalSignatureActive: teacher.digitalSignatureActive,
      });
    }
  }, [teacher]);

  if (!isOpen || !teacher) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        if (onSave && teacher) {
          onSave({
            ...teacher,
            ...formData,
            headTeacherOf: formData.headTeacherOf ? formData.headTeacherOf : undefined,
          });
        }
        onClose();
      }, 1000);
    }, 800);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Ficha y Perfil Docente: {teacher.name}
              </h3>
              <p className="text-xs text-slate-500">
                RUN: <span className="font-mono text-slate-700 dark:text-slate-300">{teacher.rut}</span> • Actualización de antecedentes institucionales
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {saveSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                Perfil Docente Actualizado Exitosamente
              </h4>
              <p className="text-xs text-slate-500">
                Los cambios se han sincronizado con el Libro Digital y la Nómina Institucional.
              </p>
            </div>
          ) : (
            <>
              {/* Sección 1: Datos Personales */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-brand-600">
                  1. Antecedentes Personales y Contacto
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden font-medium"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      RUN Chileno
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.rut}
                      onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Correo Electrónico Institucional
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Antecedentes Profesionales y Contrato */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] text-brand-600">
                  2. Especialidad, Contrato y Jefatura
                </h4>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300">
                    Título Profesional / Especialidad
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Departamento
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden font-medium"
                    >
                      <option value="Matemática & Ciencias">Matemática & Ciencias</option>
                      <option value="Lenguaje & Humanidades">Lenguaje & Humanidades</option>
                      <option value="Idiomas">Idiomas</option>
                      <option value="Artes & Ed. Física">Artes & Ed. Física</option>
                      <option value="Tecnología & Formación">Tecnología & Formación</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Horas de Contrato Semanal
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={44}
                      value={formData.contractHours}
                      onChange={(e) =>
                        setFormData({ ...formData, contractHours: Number(e.target.value) })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Jefatura de Curso
                    </label>
                    <select
                      value={formData.headTeacherOf}
                      onChange={(e) => setFormData({ ...formData, headTeacherOf: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden font-medium"
                    >
                      <option value="">Sin Jefatura Asignada</option>
                      <option value="7° Básico A">7° Básico A</option>
                      <option value="7° Básico B">7° Básico B</option>
                      <option value="8° Básico A">8° Básico A</option>
                      <option value="1° Medio A">1° Medio A</option>
                      <option value="1° Medio B">1° Medio B</option>
                      <option value="2° Medio A">2° Medio A</option>
                      <option value="3° Medio B">3° Medio B</option>
                      <option value="4° Medio A">4° Medio A</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.digitalSignatureActive}
                      onChange={(e) =>
                        setFormData({ ...formData, digitalSignatureActive: e.target.checked })
                      }
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">
                        Certificado de Firma Digital Avanzada Habilitado
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Permite firmar el Libro de Clases Electrónico y actas de notas conforme a la Circular N° 30 de la Superintendencia de Educación.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </>
          )}

          {!saveSuccess && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white shadow-md transition"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Guardando Cambios..." : "Guardar Ficha Docente"}</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
