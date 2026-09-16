"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  User,
  BookOpen,
  Phone,
  HeartPulse,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";
import { validateRutWithReason, validateEmailWithReason, formatRut } from "@/lib/utils/rut";

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (studentData: any) => void;
}

const getInitialFormData = () => ({
  // Step 1: Identificación
  firstName: "",
  lastName: "",
  rut: "",
  birthDate: "",
  gender: "male",
  nationality: "Chilena",
  // Step 2: Académico
  course: "1° Medio B",
  educationLevel: "Media",
  enrollmentYear: "2026",
  previousSchool: "",
  isPie: false,
  hasScholarship: false,
  // Step 3: Apoderado
  guardianName: "",
  guardianRut: "",
  guardianPhone: "",
  guardianEmail: "",
  guardianRelationship: "Madre",
  address: "",
  // Step 4: Ficha Salud
  bloodGroup: "O+",
  healthSystem: "FONASA",
  hasAllergies: false,
  allergyDetails: "",
  isJunaebBeneficiary: true,
});

export function StudentRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: StudentRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData());
      setFieldErrors({});
      setCurrentStep(1);
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  function handleClose() {
    if (isSubmitting) return;
    setFormData(getInitialFormData());
    setFieldErrors({});
    setCurrentStep(1);
    setIsSubmitting(false);
    setIsSuccess(false);
    onClose();
  }

  function validateStep(step: number): boolean {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        errs.firstName = "El nombre del estudiante es obligatorio.";
      } else if (formData.firstName.trim().length < 2) {
        errs.firstName = "El nombre debe tener al menos 2 caracteres.";
      }

      if (!formData.lastName.trim()) {
        errs.lastName = "Los apellidos del estudiante son obligatorios.";
      } else if (formData.lastName.trim().length < 2) {
        errs.lastName = "Los apellidos deben tener al menos 2 caracteres.";
      }

      if (!formData.rut.trim()) {
        errs.rut = "El RUN es obligatorio.";
      } else {
        const rutValidation = validateRutWithReason(formData.rut);
        if (!rutValidation.isValid) {
          errs.rut = rutValidation.error || "El RUN ingresado no es válido (Módulo 11).";
        }
      }

      if (!formData.birthDate) {
        errs.birthDate = "La fecha de nacimiento es obligatoria.";
      } else {
        const birth = new Date(formData.birthDate);
        const today = new Date();
        if (isNaN(birth.getTime())) {
          errs.birthDate = "Fecha de nacimiento inválida.";
        } else if (birth > today) {
          errs.birthDate = "La fecha de nacimiento no puede ser una fecha futura.";
        } else {
          const age = today.getFullYear() - birth.getFullYear();
          if (age > 40 || age < 3) {
            errs.birthDate = "La edad del estudiante debe ser coherente con el nivel escolar.";
          }
        }
      }
    } else if (step === 2) {
      if (!formData.course) {
        errs.course = "Debe seleccionar un curso para matricular.";
      }
    } else if (step === 3) {
      if (!formData.guardianName.trim()) {
        errs.guardianName = "El nombre del apoderado es obligatorio.";
      } else if (formData.guardianName.trim().length < 3) {
        errs.guardianName = "El nombre del apoderado debe tener al menos 3 caracteres.";
      }

      if (!formData.guardianPhone.trim()) {
        errs.guardianPhone = "El teléfono de contacto es obligatorio.";
      } else if (formData.guardianPhone.replace(/\D/g, "").length < 8) {
        errs.guardianPhone = "Ingresa un número telefónico válido (mínimo 8 dígitos).";
      }

      if (!formData.guardianEmail.trim()) {
        errs.guardianEmail = "El correo electrónico del apoderado es obligatorio.";
      } else {
        const emailValidation = validateEmailWithReason(formData.guardianEmail);
        if (!emailValidation.isValid) {
          errs.guardianEmail = emailValidation.error || "Formato de correo electrónico no válido.";
        }
      }

      if (formData.guardianRut && formData.guardianRut.trim()) {
        const gRutVal = validateRutWithReason(formData.guardianRut);
        if (!gRutVal.isValid) {
          errs.guardianRut = gRutVal.error || "El RUN del apoderado no es válido.";
        }
      }
    } else if (step === 4) {
      if (formData.hasAllergies && !formData.allergyDetails.trim()) {
        errs.allergyDetails = "Especifique el detalle de las alergias y medicamentos.";
      }
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  if (!isOpen) return null;

  function handleNext() {
    if (isSubmitting) return;
    if (!validateStep(currentStep)) return;
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as any);
      setFieldErrors({});
    }
  }

  function handlePrev() {
    if (isSubmitting) return;
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
      setFieldErrors({});
    }
  }

  function handleStepClick(step: 1 | 2 | 3 | 4) {
    if (isSubmitting) return;
    // Allow going backwards anytime, but validate before going forward
    if (step < currentStep) {
      setCurrentStep(step);
      setFieldErrors({});
    } else if (validateStep(currentStep)) {
      setCurrentStep(step);
      setFieldErrors({});
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(4)) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) onSuccess(formData);
        handleClose();
      }, 1500);
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header Modal */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-md shadow-brand-500/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                Matricular Nuevo Estudiante
              </h3>
              <p className="text-xs text-slate-500">
                Paso {currentStep} de 4 • Proceso oficial año lectivo 2026
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progreso de Pasos (Anti-Sobrecarga Cognitiva) */}
        <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] font-bold">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleStepClick(1)}
            className={`py-3 px-2 border-b-2 flex items-center justify-center gap-1.5 transition disabled:opacity-50 ${
              currentStep === 1
                ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:bg-brand-950/30"
                : "border-transparent text-slate-400"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">1. Identificación</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleStepClick(2)}
            className={`py-3 px-2 border-b-2 flex items-center justify-center gap-1.5 transition disabled:opacity-50 ${
              currentStep === 2
                ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:bg-brand-950/30"
                : "border-transparent text-slate-400"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">2. Académico</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleStepClick(3)}
            className={`py-3 px-2 border-b-2 flex items-center justify-center gap-1.5 transition disabled:opacity-50 ${
              currentStep === 3
                ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:bg-brand-950/30"
                : "border-transparent text-slate-400"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">3. Apoderado</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleStepClick(4)}
            className={`py-3 px-2 border-b-2 flex items-center justify-center gap-1.5 transition disabled:opacity-50 ${
              currentStep === 4
                ? "border-brand-600 text-brand-600 bg-brand-50/50 dark:bg-brand-950/30"
                : "border-transparent text-slate-400"
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">4. Salud</span>
          </button>
        </div>

        {/* Cuerpo del Formulario */}
        <form onSubmit={handleSubmit} noValidate className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-black text-slate-900 dark:text-white">
                ¡Estudiante Matriculado Exitosamente!
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                La matrícula ha sido registrada en el Libro Digital y sincronizada con el Directorio Institucional.
              </p>
            </div>
          ) : (
            <>
              {/* PASO 1: IDENTIFICACIÓN */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Nombres del Estudiante <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formData.firstName}
                        onChange={(e) => {
                          setFormData({ ...formData, firstName: e.target.value });
                          if (fieldErrors.firstName) setFieldErrors({ ...fieldErrors, firstName: "" });
                        }}
                        placeholder="Ej. Martín Ignacio"
                        className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                          fieldErrors.firstName
                            ? "border-rose-500 text-rose-900 dark:text-rose-200"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      {fieldErrors.firstName && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.firstName}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Apellidos del Estudiante <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formData.lastName}
                        onChange={(e) => {
                          setFormData({ ...formData, lastName: e.target.value });
                          if (fieldErrors.lastName) setFieldErrors({ ...fieldErrors, lastName: "" });
                        }}
                        placeholder="Ej. Alarcón Valenzuela"
                        className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                          fieldErrors.lastName
                            ? "border-rose-500 text-rose-900 dark:text-rose-200"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.lastName}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        RUN / Cédula de Identidad <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
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
                        placeholder="23.491.028-4"
                        className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 font-mono focus:ring-2 focus:ring-brand-500 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                          fieldErrors.rut
                            ? "border-rose-500 text-rose-900 dark:text-rose-200"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      {fieldErrors.rut && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.rut}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Fecha de Nacimiento <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        disabled={isSubmitting}
                        value={formData.birthDate}
                        onChange={(e) => {
                          setFormData({ ...formData, birthDate: e.target.value });
                          if (fieldErrors.birthDate) setFieldErrors({ ...fieldErrors, birthDate: "" });
                        }}
                        className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                          fieldErrors.birthDate
                            ? "border-rose-500 text-rose-900 dark:text-rose-200"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      {fieldErrors.birthDate && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.birthDate}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Género</label>
                      <select
                        disabled={isSubmitting}
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="male">Masculino</option>
                        <option value="female">Femenino</option>
                        <option value="other">No binario / Otro</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Nacionalidad</label>
                      <input
                        type="text"
                        disabled={isSubmitting}
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 2: ACADÉMICO */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Curso Asignado <span className="text-rose-500">*</span>
                      </label>
                      <select
                        disabled={isSubmitting}
                        value={formData.course}
                        onChange={(e) => {
                          setFormData({ ...formData, course: e.target.value });
                          if (fieldErrors.course) setFieldErrors({ ...fieldErrors, course: "" });
                        }}
                        className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:outline-hidden font-semibold disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                          fieldErrors.course
                            ? "border-rose-500 text-rose-900 dark:text-rose-200"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <option value="1° Medio B">1° Medio B</option>
                        <option value="2° Medio A">2° Medio A</option>
                        <option value="3° Medio B">3° Medio B</option>
                        <option value="4° Medio A">4° Medio A</option>
                        <option value="7° Básico B">7° Básico B</option>
                        <option value="8° Básico A">8° Básico A</option>
                      </select>
                      {fieldErrors.course && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.course}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Año Lectivo de Matrícula
                      </label>
                      <input
                        type="text"
                        disabled
                        value="2026 (Primer Semestre)"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/50 text-slate-500 font-semibold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Colegio de Procedencia (Opcional)
                    </label>
                    <input
                      type="text"
                      disabled={isSubmitting}
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      placeholder="Ej. Colegio San Agustín"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Checkboxes Beneficios */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={isSubmitting}
                        checked={formData.isPie}
                        onChange={(e) => setFormData({ ...formData, isPie: e.target.checked })}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          Incorporar al Programa de Integración Escolar (PIE)
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Habilita seguimiento con equipo multidisciplinario (Educadora Diferencial, Fonoaudióloga, Psicóloga).
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={isSubmitting}
                        checked={formData.hasScholarship}
                        onChange={(e) => setFormData({ ...formData, hasScholarship: e.target.checked })}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          Beneficiario Beca Ley SEP / Prioritario
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Exención de aranceles y acceso a textos escolares y apoyo socioeducativo.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* PASO 3: APODERADO */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Nombre Completo Apoderado Titular <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={isSubmitting}
                        value={formData.guardianName}
                        onChange={(e) => {
                          setFormData({ ...formData, guardianName: e.target.value });
                          if (fieldErrors.guardianName) setFieldErrors({ ...fieldErrors, guardianName: "" });
                        }}
                        placeholder="Ej. María Silva"
                        className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                          fieldErrors.guardianName
                            ? "border-rose-500 text-rose-900 dark:text-rose-200"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      {fieldErrors.guardianName && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.guardianName}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Parentesco</label>
                      <select
                        disabled={isSubmitting}
                        value={formData.guardianRelationship}
                        onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="Madre">Madre</option>
                        <option value="Padre">Padre</option>
                        <option value="Abuelo/a">Abuelo/a</option>
                        <option value="Tutor Legal">Tutor Legal</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Teléfono de Contacto <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        disabled={isSubmitting}
                        value={formData.guardianPhone}
                        onChange={(e) => {
                          setFormData({ ...formData, guardianPhone: e.target.value });
                          if (fieldErrors.guardianPhone) setFieldErrors({ ...fieldErrors, guardianPhone: "" });
                        }}
                        placeholder="+56 9 8765 4321"
                        className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 font-mono focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                          fieldErrors.guardianPhone
                            ? "border-rose-500 text-rose-900 dark:text-rose-200"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      {fieldErrors.guardianPhone && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.guardianPhone}</span>
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Correo Electrónico <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        disabled={isSubmitting}
                        value={formData.guardianEmail}
                        onChange={(e) => {
                          setFormData({ ...formData, guardianEmail: e.target.value });
                          if (fieldErrors.guardianEmail) setFieldErrors({ ...fieldErrors, guardianEmail: "" });
                        }}
                        placeholder="apoderado@ejemplo.cl"
                        className={`w-full p-2.5 rounded-xl border bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                          fieldErrors.guardianEmail
                            ? "border-rose-500 text-rose-900 dark:text-rose-200"
                            : "border-slate-200 dark:border-slate-700"
                        }`}
                      />
                      {fieldErrors.guardianEmail && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{fieldErrors.guardianEmail}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Dirección de Residencia Familiar
                    </label>
                    <input
                      type="text"
                      disabled={isSubmitting}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Calle, Número, Comuna"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              )}

              {/* PASO 4: SALUD & JUNAEB */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Grupo Sanguíneo
                      </label>
                      <select
                        disabled={isSubmitting}
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="O+">O+ (Positivo)</option>
                        <option value="A+">A+ (Positivo)</option>
                        <option value="B+">B+ (Positivo)</option>
                        <option value="AB+">AB+ (Positivo)</option>
                        <option value="O-">O- (Negativo)</option>
                        <option value="A-">A- (Negativo)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Sistema de Salud
                      </label>
                      <select
                        disabled={isSubmitting}
                        value={formData.healthSystem}
                        onChange={(e) => setFormData({ ...formData, healthSystem: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        <option value="FONASA">FONASA</option>
                        <option value="ISAPRE">ISAPRE</option>
                        <option value="Particular">Particular / FFAA</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={isSubmitting}
                        checked={formData.hasAllergies}
                        onChange={(e) => {
                          setFormData({ ...formData, hasAllergies: e.target.checked });
                          if (!e.target.checked && fieldErrors.allergyDetails) {
                            setFieldErrors({ ...fieldErrors, allergyDetails: "" });
                          }
                        }}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">
                        Presenta alergias a medicamentos o alimentos
                      </span>
                    </label>

                    {formData.hasAllergies && (
                      <div className="space-y-1">
                        <input
                          type="text"
                          disabled={isSubmitting}
                          value={formData.allergyDetails}
                          onChange={(e) => {
                            setFormData({ ...formData, allergyDetails: e.target.value });
                            if (fieldErrors.allergyDetails) setFieldErrors({ ...fieldErrors, allergyDetails: "" });
                          }}
                          placeholder="Especificar (ej. Alergia severa a la Penicilina o Maní)..."
                          className={`w-full p-2 rounded-xl border bg-white dark:bg-slate-800 text-xs focus:outline-hidden disabled:bg-slate-100 dark:disabled:bg-slate-850 disabled:opacity-60 disabled:cursor-not-allowed ${
                            fieldErrors.allergyDetails
                              ? "border-rose-500 text-rose-900 dark:text-rose-200"
                              : "border-slate-200 dark:border-slate-700"
                          }`}
                        />
                        {fieldErrors.allergyDetails && (
                          <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1 font-medium">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{fieldErrors.allergyDetails}</span>
                          </p>
                        )}
                      </div>
                    )}

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={isSubmitting}
                        checked={formData.isJunaebBeneficiary}
                        onChange={(e) => setFormData({ ...formData, isJunaebBeneficiary: e.target.checked })}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 disabled:opacity-50"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">
                        Solicita servicio de alimentación escolar JUNAEB
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Botones de Navegación del Modal */}
          {!isSuccess && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Cancelar
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Siguiente Paso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-md transition cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Registrando Matrícula...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Confirmar y Matricular</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
