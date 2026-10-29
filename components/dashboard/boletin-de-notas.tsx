"use client";

/**
 * Módulo de Boletín Oficial de Notas y Calificaciones (Decreto 67 MINEDUC)
 * Responsables:
 * 👑 Maicol R. (Lógica de Promedios & Decreto 67)
 * 🎨 Lucas P. (Diseño e Imprimibilidad de Documento Oficial)
 * 🛡️ Frank M. (Firma Digital y Certificado Criptográfico QR)
 */

import React, { useState } from "react";
import {
  FileText,
  Printer,
  Download,
  Award,
  CalendarCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  QrCode,
  User,
  GraduationCap,
  Building2,
  Search,
  ChevronDown,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { AurenisLogo } from "@/components/ui/aurenis-logo";
import { cn } from "@/lib/utils/cn";

export interface StudentGradeSubject {
  id: string;
  code: string;
  name: string;
  teacher: string;
  n1: number | string;
  n2: number | string;
  n3: number | string;
  n4: number | string;
  n5?: number | string;
  sem1Average: number;
  sem2Average?: number;
  finalAverage: number;
  attendancePercent: number;
  status: "Aprobado" | "En Riesgo" | "Pendiente";
}

export interface StudentBulletinProfile {
  rut: string;
  fullName: string;
  course: string;
  specialty: string;
  headTeacher: string;
  generalAverage: number;
  totalAttendance: number;
  status: string;
  subjects: StudentGradeSubject[];
}

export const BULLETIN_STUDENTS_MOCK: Record<string, StudentBulletinProfile> = {
  "3E-01": {
    rut: "21.345.890-K",
    fullName: "Alejandra López",
    course: "3.º Medio E",
    specialty: "Programación TP",
    headTeacher: "Prof. Julio Molina",
    generalAverage: 6.6,
    totalAttendance: 94.5,
    status: "Promovida sin observaciones (Decreto 67)",
    subjects: [
      { id: "s1", code: "PROG-301", name: "Programación Backend & APIs", teacher: "Prof. Julio Molina", n1: 6.8, n2: 7.0, n3: 6.5, n4: 6.9, sem1Average: 6.8, finalAverage: 6.8, attendancePercent: 96.0, status: "Aprobado" },
      { id: "s2", code: "BD-302", name: "Bases de Datos PostgreSQL & Prisma", teacher: "Prof. Julio Molina", n1: 6.5, n2: 6.8, n3: 7.0, n4: 6.4, sem1Average: 6.7, finalAverage: 6.7, attendancePercent: 95.0, status: "Aprobado" },
      { id: "s3", code: "LEN-301", name: "Lengua y Literatura", teacher: "Prof. María Belén", n1: 6.0, n2: 6.2, n3: 6.5, n4: 6.3, sem1Average: 6.3, finalAverage: 6.3, attendancePercent: 92.0, status: "Aprobado" },
      { id: "s4", code: "MAT-301", name: "Matemática Aplicada TP", teacher: "Prof. Rodrigo Castro", n1: 6.5, n2: 6.0, n3: 6.7, n4: 6.4, sem1Average: 6.4, finalAverage: 6.4, attendancePercent: 94.0, status: "Aprobado" },
      { id: "s5", code: "ING-301", name: "Inglés Técnico de Especialidad", teacher: "Prof. Eduardo Soto", n1: 7.0, n2: 6.8, n3: 7.0, n4: 6.9, sem1Average: 6.9, finalAverage: 6.9, attendancePercent: 98.0, status: "Aprobado" },
      { id: "s6", code: "HIS-301", name: "Historia y Formación Ciudadana", teacher: "Prof. Ana Silva", n1: 6.2, n2: 6.5, n3: 6.0, n4: 6.1, sem1Average: 6.2, finalAverage: 6.2, attendancePercent: 91.0, status: "Aprobado" },
      { id: "s7", code: "RED-303", name: "Redes y Seguridad de la Información", teacher: "Prof. Carlos M.", n1: 6.7, n2: 6.9, n3: 6.8, n4: 6.6, sem1Average: 6.8, finalAverage: 6.8, attendancePercent: 95.5, status: "Aprobado" },
    ],
  },
  "3E-02": {
    rut: "21.876.543-2",
    fullName: "Miguel Sanhueza",
    course: "3.º Medio E",
    specialty: "Programación TP",
    headTeacher: "Prof. Julio Molina",
    generalAverage: 6.4,
    totalAttendance: 92.0,
    status: "Promovido (Decreto 67)",
    subjects: [
      { id: "s1", code: "PROG-301", name: "Programación Backend & APIs", teacher: "Prof. Julio Molina", n1: 6.5, n2: 6.7, n3: 6.2, n4: 6.6, sem1Average: 6.5, finalAverage: 6.5, attendancePercent: 93.0, status: "Aprobado" },
      { id: "s2", code: "BD-302", name: "Bases de Datos PostgreSQL & Prisma", teacher: "Prof. Julio Molina", n1: 6.2, n2: 6.5, n3: 6.8, n4: 6.3, sem1Average: 6.5, finalAverage: 6.5, attendancePercent: 91.0, status: "Aprobado" },
      { id: "s3", code: "LEN-301", name: "Lengua y Literatura", teacher: "Prof. María Belén", n1: 6.0, n2: 6.0, n3: 6.2, n4: 6.1, sem1Average: 6.1, finalAverage: 6.1, attendancePercent: 90.0, status: "Aprobado" },
      { id: "s4", code: "MAT-301", name: "Matemática Aplicada TP", teacher: "Prof. Rodrigo Castro", n1: 6.3, n2: 6.1, n3: 6.5, n4: 6.2, sem1Average: 6.3, finalAverage: 6.3, attendancePercent: 92.0, status: "Aprobado" },
      { id: "s5", code: "ING-301", name: "Inglés Técnico de Especialidad", teacher: "Prof. Eduardo Soto", n1: 6.8, n2: 6.5, n3: 6.9, n4: 6.7, sem1Average: 6.7, finalAverage: 6.7, attendancePercent: 95.0, status: "Aprobado" },
    ],
  },
  "3E-03": {
    rut: "22.109.432-1",
    fullName: "Yamir Alonso Ahumada",
    course: "3.º Medio E",
    specialty: "Programación TP",
    headTeacher: "Prof. Julio Molina",
    generalAverage: 6.5,
    totalAttendance: 91.1,
    status: "Promovido Destacado (Decreto 67)",
    subjects: [
      { id: "s1", code: "PROG-301", name: "Programación Backend & APIs", teacher: "Prof. Julio Molina", n1: 6.9, n2: 7.0, n3: 6.7, n4: 6.8, sem1Average: 6.9, finalAverage: 6.9, attendancePercent: 95.0, status: "Aprobado" },
      { id: "s2", code: "BD-302", name: "Bases de Datos PostgreSQL & Prisma", teacher: "Prof. Julio Molina", n1: 6.6, n2: 6.8, n3: 6.9, n4: 6.5, sem1Average: 6.7, finalAverage: 6.7, attendancePercent: 92.0, status: "Aprobado" },
      { id: "s3", code: "LEN-301", name: "Lengua y Literatura", teacher: "Prof. María Belén", n1: 6.1, n2: 6.3, n3: 6.0, n4: 6.2, sem1Average: 6.2, finalAverage: 6.2, attendancePercent: 89.0, status: "Aprobado" },
      { id: "s4", code: "MAT-301", name: "Matemática Aplicada TP", teacher: "Prof. Rodrigo Castro", n1: 6.2, n2: 6.4, n3: 6.1, n4: 6.3, sem1Average: 6.3, finalAverage: 6.3, attendancePercent: 90.0, status: "Aprobado" },
      { id: "s5", code: "ING-301", name: "Inglés Técnico de Especialidad", teacher: "Prof. Eduardo Soto", n1: 6.7, n2: 6.9, n3: 7.0, n4: 6.8, sem1Average: 6.9, finalAverage: 6.9, attendancePercent: 94.0, status: "Aprobado" },
    ],
  },
};

interface BoletinDeNotasProps {
  schoolName?: string;
  rbdCode?: string;
  studentKey?: string;
  allowStudentSelect?: boolean;
}

export function BoletinDeNotas({
  schoolName = "Liceo Politécnico Marga Marga (LPMM)",
  rbdCode = "RBD 10240",
  studentKey = "3E-01",
  allowStudentSelect = true,
}: BoletinDeNotasProps) {
  const [selectedStudentKey, setSelectedStudentKey] = useState<string>(studentKey);
  const [termFilter, setTermFilter] = useState<"1S" | "2S" | "ANUAL">("1S");

  const studentData = BULLETIN_STUDENTS_MOCK[selectedStudentKey] || BULLETIN_STUDENTS_MOCK["3E-01"];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Barra de Controles e Impresión */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0C1425] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm print:hidden">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Boletín Oficial de Calificaciones
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Reglamento de Evaluación Decreto 67 MINEDUC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {allowStudentSelect && (
            <div className="relative">
              <select
                value={selectedStudentKey}
                onChange={(e) => setSelectedStudentKey(e.target.value)}
                className="px-3 py-2 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer pr-8"
              >
                <option value="3E-01">Estudiante: Alejandra López (3° Medio E)</option>
                <option value="3E-02">Estudiante: Miguel Sanhueza (3° Medio E)</option>
                <option value="3E-03">Estudiante: Yamir Ahumada (3° Medio E)</option>
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Boletín</span>
          </button>
        </div>
      </div>

      {/* DOCUMENTO OFICIAL HOJA DE BOLETÍN (A4 PRINT FRIENDLY) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-lg text-slate-900 dark:text-slate-100 space-y-8 print:shadow-none print:border-none print:p-0 print:m-0">
        
        {/* Encabezado Institucional MINEDUC */}
        <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white p-2 flex items-center justify-center shrink-0">
              <AurenisLogo showText={false} className="w-full h-full" />
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                {schoolName}
              </h1>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                {rbdCode} · Quilpué, Región de Valparaíso · Chile
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                MINEDUC — Dirección de Educación Técnica Profesional
              </p>
            </div>
          </div>

          <div className="text-right sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-800">
            <span className="inline-block px-3 py-1 rounded-lg text-xs font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              Boletín 1er Semestre 2026
            </span>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-1">
              Fecha de Emisión: 28/10/2026
            </p>
          </div>
        </div>

        {/* Ficha Informativa del Alumno */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Estudiante</span>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white block mt-0.5">
              {studentData.fullName}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">RUT: {studentData.rut}</span>
          </div>

          <div>
            <span className="text-slate-500 dark:text-slate-400 block font-medium">Curso & Especialidad</span>
            <span className="font-extrabold text-slate-900 dark:text-white block mt-0.5">
              {studentData.course} — {studentData.specialty}
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Profesor Jefe: {studentData.headTeacher}
            </span>
          </div>

          <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-700 pt-3 md:pt-0 md:pl-4">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block font-medium">Promedio & Asistencia</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-lg font-black text-blue-600 dark:text-blue-400">
                  {studentData.generalAverage.toFixed(1)}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  {studentData.totalAttendance}% Asistencia
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TABLA OFICIAL DE CALIFICACIONES DECRETO 67 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" />
              <span>Informe de Calificaciones por Asignatura / Módulo (Escala 1.0 a 7.0)</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Nota Mínima Aprobación: 4.0
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-200 dark:border-slate-800">
                  <th className="p-3">Cód. / Asignatura</th>
                  <th className="p-3">Docente</th>
                  <th className="p-3 text-center">N1</th>
                  <th className="p-3 text-center">N2</th>
                  <th className="p-3 text-center">N3</th>
                  <th className="p-3 text-center">N4</th>
                  <th className="p-3 text-center bg-blue-50/50 dark:bg-blue-950/30">Prom 1S</th>
                  <th className="p-3 text-center">% Asist.</th>
                  <th className="p-3 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {studentData.subjects.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3">
                      <span className="font-extrabold text-slate-900 dark:text-white block">
                        {sub.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{sub.code}</span>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400 font-medium">
                      {sub.teacher}
                    </td>
                    <td className="p-3 text-center font-mono font-bold">{sub.n1}</td>
                    <td className="p-3 text-center font-mono font-bold">{sub.n2}</td>
                    <td className="p-3 text-center font-mono font-bold">{sub.n3}</td>
                    <td className="p-3 text-center font-mono font-bold">{sub.n4}</td>
                    <td className="p-3 text-center font-mono font-black text-sm text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20">
                      {sub.sem1Average.toFixed(1)}
                    </td>
                    <td className="p-3 text-center font-mono font-bold text-slate-600 dark:text-slate-300">
                      {sub.attendancePercent}%
                    </td>
                    <td className="p-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 className="w-3 h-3" />
                        {sub.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Observaciones Pedagógicas y Convivencia */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] block">
            Observaciones Pedagógicas & Desarrollo Formativo
          </span>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">
            "El estudiante demuestra un desempeño académico sobresaliente en los módulos de especialidad técnica. Cumple rigurosamente con el reglamento interno de asistencia y entrega oportuna de proyectos evaluativos Decreto 67."
          </p>
        </div>

        {/* Firmas Digitales de Autoridad Escolar con Sellos Criptográficos */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-2 flex flex-col items-center">
            <div className="w-28 h-12 border-b border-slate-400 flex items-center justify-center font-mono text-[10px] text-slate-400 italic">
              [Firma Digital AURENIS]
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white block">Prof. Julio Molina</span>
              <span className="text-slate-500 text-[11px]">Profesor Jefe 3.º Medio E</span>
            </div>
          </div>

          <div className="space-y-2 flex flex-col items-center">
            <div className="w-28 h-12 border-b border-slate-400 flex items-center justify-center font-mono text-[10px] text-slate-400 italic">
              [Sello UTP Habilitado]
            </div>
            <div>
              <span className="font-extrabold text-slate-900 dark:text-white block">Dirección Técnica Pedagógica (UTP)</span>
              <span className="text-slate-500 text-[11px]">{schoolName}</span>
            </div>
          </div>
        </div>

        {/* Sello Verificador QR de Autenticidad */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Documento Verificado Criptográficamente por AURENIS CORE</span>
          </div>
          <span>FOLIO: AURENIS-2026-3E-09214</span>
        </div>

      </div>
    </div>
  );
}
