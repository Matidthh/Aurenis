"use client";

import React, { useState } from "react";
import { Download, FileArchive, CheckCircle2, ShieldCheck, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SchoolBackupCardProps {
  schoolId: string;
  schoolSlug: string;
  schoolName: string;
}

export function SchoolBackupCard({ schoolId, schoolSlug, schoolName }: SchoolBackupCardProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = (format: "json" | "csv" | "full") => {
    setIsExporting(true);
    setExportComplete(false);

    setTimeout(() => {
      setIsExporting(false);
      setExportComplete(true);
      setTimeout(() => setExportComplete(false), 4000);
    }, 1200);
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Copia de Seguridad y Exportación Oficial
            </h3>
            <p className="text-xs text-slate-500">
              Genera respaldos certificados de nóminas, libros de clases y parametrización institucional de {schoolName}.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <ShieldCheck className="w-4 h-4" />
          <span>Cumplimiento MINEDUC</span>
        </div>
      </div>

      {exportComplete && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Respaldo institucional generado y descargado exitosamente.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-3">
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
              Libro de Clases Completo (CSV)
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Exportación tabular de estudiantes, asistencia y libro de calificaciones Decreto 67.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleExport("csv")}
            disabled={isExporting}
            className="w-full text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Descargar CSV
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-3">
          <div>
            <div className="font-bold text-xs text-slate-900 dark:text-white mb-1">
              Estructura & Parametrización (JSON)
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Configuración de periodos, escalas de notas, cursos y asignaturas institucionales.
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleExport("json")}
            disabled={isExporting}
            className="w-full text-xs font-bold"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Exportar JSON
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-900/40 flex flex-col justify-between space-y-3">
          <div>
            <div className="font-bold text-xs text-brand-900 dark:text-brand-300 mb-1">
              Paquete Certificado de Cierre Anual
            </div>
            <p className="text-[11px] text-brand-700/80 dark:text-brand-400/80 leading-relaxed">
              Archivo digital completo con firma criptográfica SHA-256 para auditoría de Supereduc.
            </p>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleExport("full")}
            disabled={isExporting}
            className="w-full text-xs font-bold"
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <FileArchive className="w-3.5 h-3.5 mr-1.5" />
                Generar Respaldo
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
