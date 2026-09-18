"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Calendar,
  Phone,
  Mail,
  Award,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Printer,
  HeartPulse,
  Send,
  MapPin,
  ShieldCheck,
  Building,
  GraduationCap,
  Sparkles,
  Download,
} from "lucide-react";
import { StudentMockupData } from "./student-table-mockup";

interface StudentFullProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentMockupData | null;
}

export function StudentFullProfileModal({
  isOpen,
  onClose,
  student,
}: StudentFullProfileModalProps) {
  const [activeTab, setActiveTab] = useState<
    "general" | "academic" | "attendance" | "guardians" | "health" | "conduct"
  >("general");

  const [downloadCertNotice, setDownloadCertNotice] = useState(false);

  if (!isOpen || !student) return null;

  function handleDownloadCertificate() {
    setDownloadCertNotice(true);
    setTimeout(() => {
      setDownloadCertNotice(false);
    }, 3000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
        {/* Header Ficha */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-50 via-white to-slate-50 dark:from-slate-850 dark:via-slate-900 dark:to-slate-850 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-brand-500/20 shrink-0">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {student.name}
                </h2>
                <span
                  className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                    student.status === "Activo"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200"
                  }`}
                >
                  {student.status}
                </span>
                {student.pie && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border border-purple-200">
                    Programa PIE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                RUN: <strong className="font-mono text-slate-700 dark:text-slate-200">{student.rut}</strong> • {student.course} ({student.level}) • Matrícula N° 2026-{student.id.replace("st-", "084")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadCertificate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition"
              title="Descargar Certificado de Alumno Regular"
            >
              <Download className="w-3.5 h-3.5 text-brand-600" />
              <span>Certificado Regular</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notificación de descarga */}
        {downloadCertNotice && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Generando Certificado de Alumno Regular MINEDUC en PDF con Firma Digital...</span>
          </div>
        )}

        {/* Navegación Pestañas de la Ficha */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-850/50 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab("general")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === "general"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Ficha General</span>
          </button>

          <button
            onClick={() => setActiveTab("academic")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === "academic"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Notas & Calificaciones</span>
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === "attendance"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Asistencia Diaria</span>
          </button>

          <button
            onClick={() => setActiveTab("guardians")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === "guardians"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Apoderados & Contacto</span>
          </button>

          <button
            onClick={() => setActiveTab("health")}
            className={`py-3 px-3.5 border-b-2 flex items-center gap-1.5 whitespace-nowrap transition ${
              activeTab === "health"
                ? "border-brand-600 text-brand-600 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Salud & JUNAEB</span>
          </button>
        </div>

        {/* Contenido de la Ficha */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700 dark:text-slate-300">
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-5">
              {/* Tarjetas de Métricas Resumen */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Promedio General
                  </span>
                  <span
                    className={`text-2xl font-black ${
                      student.avgGrade < 4.0 ? "text-rose-600" : "text-slate-900 dark:text-white"
                    }`}
                  >
                    {student.avgGrade.toFixed(1)}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Escala 1.0 a 7.0</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Asistencia Anual
                  </span>
                  <span
                    className={`text-2xl font-black ${
                      student.attendance < 85 ? "text-rose-600" : "text-emerald-600"
                    }`}
                  >
                    {student.attendance}%
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Meta MINEDUC: ≥85%</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Anotaciones
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    2 Pos / 1 Neg
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Hoja de Vida 2026</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Beneficios
                  </span>
                  <span className="text-2xl font-black text-brand-600">
                    {student.scholarship ? "Gratuidad" : "Particular"}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Beca Ley SEP</p>
                </div>
              </div>

              {/* Alerta si está en riesgo */}
              {student.riskFactor && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-xs">Alerta Temprana UTP Activa</h4>
                    <p className="text-xs text-rose-800 dark:text-rose-300 leading-relaxed">
                      {student.riskFactor}. Se recomienda citación presencial con el apoderado y asignación a taller de reforzamiento pedagógico.
                    </p>
                  </div>
                </div>
              )}

              {/* Información Personal y Domicilio */}
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                  Antecedentes Personales
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Fecha de Nacimiento</span>
                    <strong className="text-slate-800 dark:text-slate-200">14 de Mayo de 2011 (15 años)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nacionalidad</span>
                    <strong className="text-slate-800 dark:text-slate-200">Chilena</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Género</span>
                    <strong className="text-slate-800 dark:text-slate-200">Masculino</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block text-[11px]">Dirección de Residencia</span>
                    <strong className="text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      Av. Los Leones 2341, Dpto. 402, Providencia, Santiago
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Colegio de Procedencia</span>
                    <strong className="text-slate-800 dark:text-slate-200">Colegio San Agustín</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADÉMICO */}
          {activeTab === "academic" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 dark:text-white">
                  Registro de Calificaciones 1° Semestre 2026
                </h4>
                <span className="text-slate-400 text-xs">Decreto 67/2018 MINEDUC</span>
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase font-semibold">
                    <tr>
                      <th className="py-3 px-4">Asignatura</th>
                      <th className="py-3 px-4">Docente</th>
                      <th className="py-3 px-3 text-center">N1</th>
                      <th className="py-3 px-3 text-center">N2</th>
                      <th className="py-3 px-3 text-center">N3</th>
                      <th className="py-3 px-3 text-center">N4</th>
                      <th className="py-3 px-4 text-center">Promedio</th>
                      <th className="py-3 px-4 text-right">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-3 px-4 font-bold">Matemática</td>
                      <td className="py-3 px-4 text-slate-500">Prof. Rodrigo Valdés</td>
                      <td className="py-3 px-3 text-center text-rose-600 font-bold">3.2</td>
                      <td className="py-3 px-3 text-center text-rose-600 font-bold">3.8</td>
                      <td className="py-3 px-3 text-center">4.5</td>
                      <td className="py-3 px-3 text-center text-slate-400">-</td>
                      <td className="py-3 px-4 text-center font-black text-rose-600">3.8</td>
                      <td className="py-3 px-4 text-right text-rose-600 font-bold">Riesgo</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Lenguaje y Comunicación</td>
                      <td className="py-3 px-4 text-slate-500">Prof. Marcela Soto</td>
                      <td className="py-3 px-3 text-center">5.5</td>
                      <td className="py-3 px-3 text-center">5.8</td>
                      <td className="py-3 px-3 text-center">6.0</td>
                      <td className="py-3 px-3 text-center">5.2</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">5.6</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-semibold">Aprobado</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Ciencias Naturales (Biología)</td>
                      <td className="py-3 px-4 text-slate-500">Prof. Andrea Silva</td>
                      <td className="py-3 px-3 text-center text-rose-600 font-bold">3.9</td>
                      <td className="py-3 px-3 text-center">4.2</td>
                      <td className="py-3 px-3 text-center">4.8</td>
                      <td className="py-3 px-3 text-center text-slate-400">-</td>
                      <td className="py-3 px-4 text-center font-bold text-amber-600">4.3</td>
                      <td className="py-3 px-4 text-right text-amber-600 font-semibold">Límite</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Historia, Geografía y Cs. Sociales</td>
                      <td className="py-3 px-4 text-slate-500">Prof. Fernando Castro</td>
                      <td className="py-3 px-3 text-center">6.0</td>
                      <td className="py-3 px-3 text-center">6.2</td>
                      <td className="py-3 px-3 text-center">5.8</td>
                      <td className="py-3 px-3 text-center text-slate-400">-</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">6.0</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-semibold">Aprobado</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-bold">Inglés</td>
                      <td className="py-3 px-4 text-slate-500">Prof. John Miller</td>
                      <td className="py-3 px-3 text-center">5.0</td>
                      <td className="py-3 px-3 text-center">5.4</td>
                      <td className="py-3 px-3 text-center">5.2</td>
                      <td className="py-3 px-3 text-center text-slate-400">-</td>
                      <td className="py-3 px-4 text-center font-bold text-emerald-600">5.2</td>
                      <td className="py-3 px-4 text-right text-emerald-600 font-semibold">Aprobado</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ASISTENCIA */}
          {activeTab === "attendance" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Días Presente</span>
                  <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">114 Días</span>
                </div>
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
                  <span className="text-[10px] uppercase font-bold text-rose-600 block">Inasistencias Injustificadas</span>
                  <span className="text-2xl font-black text-rose-700 dark:text-rose-300">18 Días</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                  <span className="text-[10px] uppercase font-bold text-amber-600 block">Atrasos Registrados</span>
                  <span className="text-2xl font-black text-amber-700 dark:text-amber-300">5 Bloques</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Últimos Justificativos Médicos Registrados
                </span>
                <p className="text-xs text-slate-500">
                  Certificado médico presentado el 02 de Septiembre por cuadro respiratorio (3 días justificados).
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: APODERADOS */}
          {activeTab === "guardians" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 text-[10px] font-bold border border-brand-200">
                      Apoderado Titular
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {student.guardianName} (Madre)
                    </h4>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>{student.guardianPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>{student.guardianEmail}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 text-[10px] font-bold">
                  Apoderado Suplente
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  Roberto Alarcón (Padre)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span>+56 9 1234 5678</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span>r.alarcon@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SALUD */}
          {activeTab === "health" && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white">Ficha Médica y Alergias</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Grupo Sanguíneo</span>
                    <strong className="text-slate-800 dark:text-slate-200">O+ (Positivo)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Alergias Conocidas</span>
                    <strong className="text-rose-600 font-bold">Alergia a la Penicilina</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Sistema de Salud</span>
                    <strong className="text-slate-800 dark:text-slate-200">FONASA Tramo B</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Programa Alimentación Escolar</span>
                    <strong className="text-emerald-600 font-bold">Beneficiario JUNAEB Activo</strong>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Ficha vinculada al Sistema de Información General de Estudiantes (SIGE)
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition"
          >
            Cerrar Ficha
          </button>
        </div>
      </div>
    </div>
  );
}
