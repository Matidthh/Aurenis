"use client";

import React, { useState } from "react";
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

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (studentData: any) => void;
}

export function StudentRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: StudentRegistrationModalProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
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

  if (!isOpen) return null;

  function handleNext() {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as any);
    }
  }

  function handlePrev() {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as any);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        if (onSuccess) onSuccess(formData);
        onClose();
        setCurrentStep(1);
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
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Progreso de Pasos (Anti-Sobrecarga Cognitiva) */}
        <div className="grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            className={`py-3 px-2 border-b-2 flex items-center justify-center gap-1.5 transition ${
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
            onClick={() => setCurrentStep(2)}
            className={`py-3 px-2 border-b-2 flex items-center justify-center gap-1.5 transition ${
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
            onClick={() => setCurrentStep(3)}
            className={`py-3 px-2 border-b-2 flex items-center justify-center gap-1.5 transition ${
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
            onClick={() => setCurrentStep(4)}
            className={`py-3 px-2 border-b-2 flex items-center justify-center gap-1.5 transition ${
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
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
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="Ej. Martín Ignacio"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Apellidos del Estudiante <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Ej. Alarcón Valenzuela"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                      />
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
                        value={formData.rut}
                        onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                        placeholder="23.491.028-4"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Fecha de Nacimiento <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.birthDate}
                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Género</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
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
                        value={formData.nationality}
                        onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
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
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden font-semibold"
                      >
                        <option value="1° Medio B">1° Medio B</option>
                        <option value="2° Medio A">2° Medio A</option>
                        <option value="3° Medio B">3° Medio B</option>
                        <option value="4° Medio A">4° Medio A</option>
                        <option value="7° Básico B">7° Básico B</option>
                        <option value="8° Básico A">8° Básico A</option>
                      </select>
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
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      placeholder="Ej. Colegio San Agustín"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
                    />
                  </div>

                  {/* Checkboxes Beneficios */}
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isPie}
                        onChange={(e) => setFormData({ ...formData, isPie: e.target.checked })}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
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
                        checked={formData.hasScholarship}
                        onChange={(e) => setFormData({ ...formData, hasScholarship: e.target.checked })}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
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
                        value={formData.guardianName}
                        onChange={(e) => setFormData({ ...formData, guardianName: e.target.value })}
                        placeholder="Ej. María Silva"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">Parentesco</label>
                      <select
                        value={formData.guardianRelationship}
                        onChange={(e) => setFormData({ ...formData, guardianRelationship: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
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
                        value={formData.guardianPhone}
                        onChange={(e) => setFormData({ ...formData, guardianPhone: e.target.value })}
                        placeholder="+56 9 8765 4321"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono focus:outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300">
                        Correo Electrónico <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.guardianEmail}
                        onChange={(e) => setFormData({ ...formData, guardianEmail: e.target.value })}
                        placeholder="apoderado@ejemplo.cl"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 dark:text-slate-300">
                      Dirección de Residencia Familiar
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Calle, Número, Comuna"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
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
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
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
                        value={formData.healthSystem}
                        onChange={(e) => setFormData({ ...formData, healthSystem: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
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
                        checked={formData.hasAllergies}
                        onChange={(e) => setFormData({ ...formData, hasAllergies: e.target.checked })}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className="font-bold text-slate-900 dark:text-white">
                        Presenta alergias a medicamentos o alimentos
                      </span>
                    </label>

                    {formData.hasAllergies && (
                      <input
                        type="text"
                        value={formData.allergyDetails}
                        onChange={(e) => setFormData({ ...formData, allergyDetails: e.target.value })}
                        placeholder="Especificar (ej. Alergia severa a la Penicilina o Maní)..."
                        className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs focus:outline-hidden"
                      />
                    )}

                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isJunaebBeneficiary}
                        onChange={(e) => setFormData({ ...formData, isJunaebBeneficiary: e.target.checked })}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
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
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Anterior</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Cancelar
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-xs transition"
                >
                  <span>Siguiente Paso</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-md transition"
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
