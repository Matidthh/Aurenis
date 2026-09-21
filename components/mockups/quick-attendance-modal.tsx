"use client";

import React, { useState } from "react";
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Save, ShieldCheck } from "lucide-react";

interface QuickAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseName: string;
}

export function QuickAttendanceModal({
  isOpen,
  onClose,
  courseName,
}: QuickAttendanceModalProps) {
  const [attendance, setAttendance] = useState<Record<string, "PRESENT" | "LATE" | "ABSENT">>({
    "1": "PRESENT",
    "2": "PRESENT",
    "3": "LATE",
    "4": "PRESENT",
    "5": "ABSENT",
  });
  const [saved, setSaved] = useState(false);

  const students = [
    { id: "1", name: "Alarcón Valenzuela, Martín", rut: "23.491.028-4" },
    { id: "2", name: "Barrientos Soto, Camila Paz", rut: "22.819.301-K" },
    { id: "3", name: "Carrasco Morales, Diego", rut: "23.104.992-1" },
    { id: "4", name: "Díaz Fuentes, Florencia", rut: "22.955.120-7" },
    { id: "5", name: "Espinoza Rivas, Benjamín", rut: "23.331.094-8" },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalHeader>
        <ModalTitle>Pase Rápido de Lista — {courseName}</ModalTitle>
        <ModalDescription>
          Registro instantáneo de asistencia de la clase actual con firma digital docente.
        </ModalDescription>
      </ModalHeader>

      <ModalBody>
        {saved ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl text-center font-bold text-sm flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Asistencia firmada y registrada en el libro oficial.</span>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {students.map((st) => (
              <div key={st.id} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {st.name}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">{st.rut}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAttendance((prev) => ({ ...prev, [st.id]: "PRESENT" }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      attendance[st.id] === "PRESENT"
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    P
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance((prev) => ({ ...prev, [st.id]: "LATE" }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      attendance[st.id] === "LATE"
                        ? "bg-amber-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttendance((prev) => ({ ...prev, [st.id]: "ABSENT" }))}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      attendance[st.id] === "ABSENT"
                        ? "bg-rose-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    F
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ModalBody>

      {!saved && (
        <ModalFooter className="justify-between">
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Firma Digital Supereduc</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Save className="w-3.5 h-3.5 mr-1.5" />
              Guardar y Firmar
            </Button>
          </div>
        </ModalFooter>
      )}
    </Modal>
  );
}
