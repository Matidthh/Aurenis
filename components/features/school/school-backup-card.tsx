"use client";

import { useState } from "react";
import { Download, FileArchive, CheckCircle2, ShieldCheck, Database, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SchoolBackupCardProps {
  schoolId: string;
  schoolSlug: string;
  schoolName: string;
}

export function SchoolBackupCard({ schoolId, schoolSlug, schoolName }: SchoolBackupCardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDownloadBackup = async () => {
    try {
      setIsExporting(true);
      setError(null);
      setSuccess(false);

      const targetId = schoolSlug || schoolId;
      const res = await fetch(`/api/schools/${targetId}/export`, {
        method: "GET",
      });

      if (!res.ok) {
        let errorMsg = "No se pudo generar el respaldo.";
        try {
          const errData = await res.json();
          errorMsg = errData.error || errData.message || errorMsg;
        } catch {
          // ignore parsing error
        }
        throw new Error(errorMsg);
      }

      // Convert response stream to blob
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition");
      let filename = `respaldo_${schoolSlug || "colegio"}_${new Date().toISOString().slice(0, 10)}.zip`;

      if (disposition && disposition.includes("filename=")) {
        const matches = disposition.match(/filename="?([^"]+)"?/);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }

      // Trigger browser file download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 8000);
    } catch (err: any) {
      console.error("Error al descargar respaldo:", err);
      setError(err.message || "Error al descargar el archivo de respaldo.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-6 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200/60 dark:border-emerald-800/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Soberanía de Datos Garantizada
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileArchive className="w-5 h-5 text-emerald-600" />
            Respaldo Completo de la Institución (.ZIP)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl">
            Descarga en cualquier momento una copia íntegra y estructurada de la base de datos de <strong>{schoolName}</strong>. 
            El colegio es el único dueño de sus registros académicos, notas y asistencia.
          </p>
        </div>

        <Button
          onClick={handleDownloadBackup}
          disabled={isExporting}
          variant="primary"
          size="lg"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shrink-0 shadow-sm transition-all"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Empaquetando ZIP...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Descargar Respaldo (.ZIP)
            </>
          )}
        </Button>
      </div>

      {/* Success Alert */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong>¡Descarga completada con éxito!</strong> El archivo comprimido contiene las 7 tablas del establecimiento en formato CSV compatible directamente con Microsoft Excel y Google Sheets.
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 text-red-800 dark:text-red-300 text-xs flex items-center gap-3 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid of included tables */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Database className="w-3.5 h-3.5" />
          Tablas y Archivos Incluidos en el Paquete .ZIP
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              01_colegio_y_configuracion.csv
            </div>
            <p className="text-[11px] text-slate-500">Datos institucionales, RBD, régimen lectivo y escalas de notas.</p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              02_usuarios_y_docentes.csv
            </div>
            <p className="text-[11px] text-slate-500">Nómina del equipo docente y roles institucionales (sin contraseñas).</p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              03_cursos_y_niveles.csv
            </div>
            <p className="text-[11px] text-slate-500">Catálogo de cursos activos, letras y niveles de enseñanza.</p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              04_estudiantes_matricula.csv
            </div>
            <p className="text-[11px] text-slate-500">Nómina completa de matrícula, RUTs, cursos asignados y estado.</p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              05_asignaturas_y_evaluaciones.csv
            </div>
            <p className="text-[11px] text-slate-500">Malla de asignaturas, evaluaciones planificadas y ponderaciones (%).</p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              06_calificaciones_historicas.csv
            </div>
            <p className="text-[11px] text-slate-500">Historial de notas individuales por alumno, asignatura y fecha.</p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              07_registro_asistencia.csv
            </div>
            <p className="text-[11px] text-slate-500">Bitácora diaria de asistencia, ausencias y justificaciones.</p>
          </div>

          <div className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50 text-xs space-y-1">
            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              LEEME_RESPALDO_OFICIAL.txt
            </div>
            <p className="text-[11px] text-slate-500">Manifiesto de auditoría, sello de fecha/hora y parámetros de exportación.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
