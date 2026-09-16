"use client";

import React, { useState, useEffect } from "react";
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
  AlertCircle,
  Award,
  BookOpen,
  Calendar,
  Loader2,
} from "lucide-react";
import { TeacherData } from "./teacher-management-mockup";
import { validateRutWithReason, validateEmailWithReason, validateNumberRange, formatRut } from "@/lib/utils/rut";

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

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
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
      setFieldErrors({});
      setIsSaving(false);
      setSaveSuccess(false);
    }
  }, [teacher, isOpen]);

  function handleClose() {
    if (isSaving) return;
    setFieldErrors({});
    onClose();
  }

  if (!isOpen || !teacher) return null;

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = "El nombre del docente es requerido.";
    } else if (formData.name.trim().length < 3) {
      errors.name = "El nombre debe tener al menos 3 caracteres.";
    }

    if (!formData.rut.trim()) {
      errors.rut = "El RUN es requerido.";
    } else {
      const rutVal = validateRutWithReason(formData.rut);
      if (!rutVal.isValid) {
        errors.rut = rutVal.error || "El RUN ingresado no es válido (Módulo 11).";
      }
    }

    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es requerido.";
    } else {
      const emailVal = validateEmailWithReason(formData.email);
      if (!emailVal.isValid) {
        errors.email = emailVal.error || "Ingresa un correo institucional válido.";
      }
    }

    if (!formData.specialty.trim()) {
      errors.specialty = "El título profesional o especialidad es requerido.";
    } else if (formData.specialty.trim().length < 3) {
      errors.specialty = "La especialidad debe tener al menos 3 caracteres.";
    }

    const hoursVal = validateNumberRange(formData.contractHours, 1, 44, "Las horas de contrato");
    if (!hoursVal.isValid) {
      errors.contractHours = hoursVal.error || "Las horas deben estar entre 1 y 44.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

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
        handleClose();
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
            type="button"
            onClick={handleClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} noValidate className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
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
                      Nombre Completo <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isSaving}
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (fieldErrors.name) setFieldErrors({ ...fieldErrors, name: "" });
                      }}
                      className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 font-medium focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                        fieldErrors.name
                          ? "border-rose-500 text-rose-900 dark:text-rose-200"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {fieldErrors.name && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{fieldErrors.name}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      RUN Chileno <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isSaving}
                      value={formData.rut}
                      onChange={(e) => {
                        setFormData({ ...formData, rut: e.target.value });
                        if (fieldErrors.rut) setFieldErrors({ ...fieldErrors, rut: "" });
                      }}
                      onBlur={() => {
                        if (formData.rut.trim()) {
                          const formatted = formatRut(formData.rut);
                          setFormData((prev) => ({ ...prev, rut: formatted }));
                        }
                      }}
                      className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 font-mono focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                        fieldErrors.rut
                          ? "border-rose-500 text-rose-900 dark:text-rose-200"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {fieldErrors.rut && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{fieldErrors.rut}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Correo Electrónico Institucional <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      disabled={isSaving}
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                      }}
                      className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                        fieldErrors.email
                          ? "border-rose-500 text-rose-900 dark:text-rose-200"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {fieldErrors.email && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{fieldErrors.email}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Teléfono de Contacto
                    </label>
                    <input
                      type="tel"
                      disabled={isSaving}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
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
                    Título Profesional / Especialidad <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isSaving}
                    value={formData.specialty}
                    onChange={(e) => {
                      setFormData({ ...formData, specialty: e.target.value });
                      if (fieldErrors.specialty) setFieldErrors({ ...fieldErrors, specialty: "" });
                    }}
                    className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                      fieldErrors.specialty
                        ? "border-rose-500 text-rose-900 dark:text-rose-200"
                        : "border-slate-200 dark:border-slate-700"
                    }`}
                  />
                  {fieldErrors.specialty && (
                    <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{fieldErrors.specialty}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Departamento
                    </label>
                    <select
                      disabled={isSaving}
                      value={formData.department}
                      onChange={(e) =>
                        setFormData({ ...formData, department: e.target.value as any })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden font-medium disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
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
                      Horas de Contrato Semanal (1 a 44) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={44}
                      disabled={isSaving}
                      value={formData.contractHours}
                      onChange={(e) => {
                        setFormData({ ...formData, contractHours: Number(e.target.value) });
                        if (fieldErrors.contractHours) setFieldErrors({ ...fieldErrors, contractHours: "" });
                      }}
                      className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 font-bold focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                        fieldErrors.contractHours
                          ? "border-rose-500 text-rose-900 dark:text-rose-200"
                          : "border-slate-200 dark:border-slate-700"
                      }`}
                    />
                    {fieldErrors.contractHours && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{fieldErrors.contractHours}</span>
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Jefatura de Curso
                    </label>
                    <select
                      disabled={isSaving}
                      value={formData.headTeacherOf}
                      onChange={(e) => setFormData({ ...formData, headTeacherOf: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden font-medium disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
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
                      disabled={isSaving}
                      checked={formData.digitalSignatureActive}
                      onChange={(e) =>
                        setFormData({ ...formData, digitalSignatureActive: e.target.checked })
                      }
                      className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
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
                onClick={handleClose}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white shadow-md transition cursor-pointer disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Guardando Cambios...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Guardar Ficha Docente</span>
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
