import * as bcrypt from "bcryptjs";
import { DEFAULT_SCHOOL_ROLES, ROLE_PRESETS } from "../constants/roles";
import { LPMM_OFFICIAL_SHEETS_DATA } from "./lpmm-real-sheets";
import {
  LPMM_COURSE_SUBJECTS,
  LPMM_STUDENTS_ACADEMIC_RECORDS,
} from "./lpmm-curriculum-and-grades";

export interface StudentDatasetItem {
  num: number;
  fullName: string;
  grades: {
    lenguaje: { notes: number[]; avg: number };
    ingles: { notes: number[]; avg: number };
    matematica: { notes: number[]; avg: number };
    historia: { notes: number[]; avg: number };
    biologia: { notes: number[]; avg: number };
    quimica: { notes: number[]; avg: number };
    fisica: { notes: number[]; avg: number };
    cienciasNaturales: { notes: number[]; avg: number };
    artesVisuales: { notes: number[]; avg: number };
    edTecnologica: { notes: number[]; avg: number };
    edFisica: { notes: number[]; avg: number };
    parvulo: { notes: number[]; avg: number };
    enfermeria: { notes: number[]; avg: number };
    programacion: { notes: number[]; avg: number };
    formacionValorica: { notes: number[]; avg: number };
  };
  attendance: {
    julioTdc: number;
    julioPct: number;
    agostoTdc: number;
    agostoPct: number;
    septiembreTdc: number;
    septiembrePct: number;
    pctSem1: number;
    pctSem2: number;
    pctReal: number;
  };
}

export const LPMM_STUDENTS_DATA: StudentDatasetItem[] = [
  {
    num: 1,
    fullName: "Yamir Alonso Ahumada Acuña",
    grades: {
      lenguaje: { notes: [6.2, 6.8, 6.5, 6.6, 6.4, 6.7, 6.7], avg: 6.5 },
      ingles: { notes: [6.2, 7.0, 6.6, 7.0], avg: 6.7 },
      matematica: { notes: [6.8, 6.1, 6.8, 7.0, 7.0, 7.0], avg: 6.7 },
      historia: { notes: [6.3, 7.0], avg: 6.6 },
      biologia: { notes: [7.0, 6.8, 7.0, 7.0], avg: 6.9 },
      quimica: { notes: [7.0, 5.5], avg: 6.2 },
      fisica: { notes: [7.0, 5.0, 7.0], avg: 6.3 },
      cienciasNaturales: { notes: [6.7, 4.5], avg: 5.6 },
      artesVisuales: { notes: [5.3, 6.2], avg: 5.7 },
      edTecnologica: { notes: [5.5], avg: 5.5 },
      edFisica: { notes: [6.9, 7.0], avg: 6.9 },
      parvulo: { notes: [5.7], avg: 5.7 },
      enfermeria: { notes: [6.3, 5.7, 6.9], avg: 6.3 },
      programacion: { notes: [6.7, 4.0], avg: 5.3 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 6, julioPct: 46.15, agostoTdc: 15, agostoPct: 71.43, septiembreTdc: 11, septiembrePct: 55.0, pctSem1: 78, pctSem2: 59, pctReal: 70.27 }
  },
  {
    num: 2,
    fullName: "Gianella Andrea Ahumada Contreras",
    grades: {
      lenguaje: { notes: [4.7, 7.0, 6.4, 5.8, 6.5, 7.0, 6.5], avg: 6.2 },
      ingles: { notes: [6.5, 6.5, 6.7, 6.6, 7.0], avg: 6.6 },
      matematica: { notes: [7.0, 6.6, 5.5, 6.8, 2.0, 5.1], avg: 5.5 },
      historia: { notes: [6.6, 7.0], avg: 6.8 },
      biologia: { notes: [5.8, 6.5, 7.0, 7.0], avg: 6.5 },
      quimica: { notes: [6.2, 6.5], avg: 6.3 },
      fisica: { notes: [7.0, 3.4, 7.0], avg: 5.8 },
      cienciasNaturales: { notes: [6.7, 7.0], avg: 6.8 },
      artesVisuales: { notes: [7.0, 6.4], avg: 6.7 },
      edTecnologica: { notes: [4.9], avg: 4.9 },
      edFisica: { notes: [6.9, 5.9], avg: 6.4 },
      parvulo: { notes: [6.7], avg: 6.7 },
      enfermeria: { notes: [5.8, 6.7, 6.4], avg: 6.3 },
      programacion: { notes: [7.0, 6.8], avg: 6.9 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 12, julioPct: 92.31, agostoTdc: 21, agostoPct: 100.0, septiembreTdc: 17, septiembrePct: 85.0, pctSem1: 90, pctSem2: 93, pctReal: 91.07 }
  },
  {
    num: 3,
    fullName: "Muriel Anaís Arancibia Carvajal",
    grades: {
      lenguaje: { notes: [6.0, 6.1, 6.4, 5.4, 6.0, 6.2, 7.0], avg: 6.1 },
      ingles: { notes: [6.7, 6.3, 7.0, 7.0, 7.0], avg: 6.8 },
      matematica: { notes: [7.0, 5.0, 5.2, 6.8, 7.0, 7.0], avg: 6.3 },
      historia: { notes: [6.3, 6.6], avg: 6.4 },
      biologia: { notes: [6.6, 6.6, 6.5, 6.2], avg: 6.4 },
      quimica: { notes: [6.6, 7.0], avg: 6.8 },
      fisica: { notes: [6.8, 6.7, 7.0], avg: 6.8 },
      cienciasNaturales: { notes: [6.2, 7.0], avg: 6.6 },
      artesVisuales: { notes: [4.4, 5.6], avg: 5.0 },
      edTecnologica: { notes: [4.4], avg: 4.4 },
      edFisica: { notes: [6.0, 5.6], avg: 5.8 },
      parvulo: { notes: [6.0], avg: 6.0 },
      enfermeria: { notes: [6.8, 5.0, 5.8], avg: 5.8 },
      programacion: { notes: [6.5, 7.0], avg: 6.7 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 10, julioPct: 76.92, agostoTdc: 19, agostoPct: 90.48, septiembreTdc: 19, septiembrePct: 95.0, pctSem1: 93, pctSem2: 89, pctReal: 91.31 }
  },
  {
    num: 4,
    fullName: "Constanza Ignacia Arancibia Cortés",
    grades: {
      lenguaje: { notes: [4.0, 5.3, 6.2, 5.8, 6.0, 5.8, 6.7], avg: 5.6 },
      ingles: { notes: [5.4, 4.7, 5.7, 5.7, 6.8], avg: 5.6 },
      matematica: { notes: [2.3, 6.1, 4.4, 6.5, 5.0, 4.8], avg: 4.8 },
      historia: { notes: [4.5, 4.0], avg: 4.2 },
      biologia: { notes: [5.1, 5.8, 6.4, 6.6], avg: 5.9 },
      quimica: { notes: [4.0, 6.5], avg: 5.2 },
      fisica: { notes: [7.0, 5.0, 6.8], avg: 6.2 },
      cienciasNaturales: { notes: [4.0, 6.3], avg: 5.1 },
      artesVisuales: { notes: [3.6, 5.1], avg: 4.3 },
      edTecnologica: { notes: [4.9], avg: 4.9 },
      edFisica: { notes: [5.0, 6.3], avg: 5.6 },
      parvulo: { notes: [6.3], avg: 6.3 },
      enfermeria: { notes: [6.2, 4.3, 5.6], avg: 5.3 },
      programacion: { notes: [6.7, 7.0], avg: 6.8 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 12, julioPct: 92.31, agostoTdc: 20, agostoPct: 95.24, septiembreTdc: 19, septiembrePct: 95.0, pctSem1: 90, pctSem2: 94, pctReal: 91.83 }
  },
  {
    num: 5,
    fullName: "Klaudia Jaquelinne Araya Canto",
    grades: {
      lenguaje: { notes: [5.8], avg: 5.8 },
      ingles: { notes: [6.1, 5.8, 6.6, 6.2, 4.2], avg: 5.8 },
      matematica: { notes: [3.0, 4.6, 4.3, 5.0, 3.0, 5.9], avg: 4.3 },
      historia: { notes: [4.6, 5.6], avg: 5.1 },
      biologia: { notes: [6.5, 6.5], avg: 6.5 },
      quimica: { notes: [4.5, 6.5], avg: 5.5 },
      fisica: { notes: [6.5, 2.2, 6.0], avg: 4.9 },
      cienciasNaturales: { notes: [5.5, 6.0], avg: 5.7 },
      artesVisuales: { notes: [6.1, 4.2], avg: 5.1 },
      edTecnologica: { notes: [3.9], avg: 3.9 },
      edFisica: { notes: [4.3, 5.6], avg: 4.9 },
      parvulo: { notes: [4.4], avg: 4.4 },
      enfermeria: { notes: [4.9, 5.1, 4.9], avg: 4.9 },
      programacion: { notes: [6.7, 7.0], avg: 6.8 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 10, julioPct: 76.92, agostoTdc: 18, agostoPct: 85.71, septiembreTdc: 15, septiembrePct: 75.0, pctSem1: 81, pctSem2: 80, pctReal: 80.44 }
  },
  {
    num: 7,
    fullName: "Fabiola Ankayra Araya Hernández",
    grades: {
      lenguaje: { notes: [5.0, 4.0, 5.0, 4.5, 5.0, 5.8, 6.7], avg: 5.1 },
      ingles: { notes: [3.0, 6.7, 3.7], avg: 4.5 },
      matematica: { notes: [6.5, 2.4, 4.6, 2.0, 4.5, 4.0], avg: 4.0 },
      historia: { notes: [5.6, 5.5, 6.4, 6.2, 6.5], avg: 6.0 },
      biologia: { notes: [6.6, 7.0], avg: 6.8 },
      quimica: { notes: [6.6, 1.5, 5.3], avg: 4.4 },
      fisica: { notes: [4.0, 4.0], avg: 4.0 },
      cienciasNaturales: { notes: [4.0, 5.9], avg: 4.9 },
      artesVisuales: { notes: [4.9], avg: 4.9 },
      edTecnologica: { notes: [1.5, 6.3], avg: 3.9 },
      edFisica: { notes: [5.3], avg: 5.3 },
      parvulo: { notes: [4.4, 4.9, 3.9], avg: 4.4 },
      enfermeria: { notes: [6.7, 2.0], avg: 4.3 },
      programacion: { notes: [6.0, 6.0], avg: 6.0 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 10, julioPct: 76.92, agostoTdc: 19, agostoPct: 90.48, septiembreTdc: 16, septiembrePct: 80.0, pctSem1: 82, pctSem2: 83, pctReal: 82.55 }
  },
  {
    num: 9,
    fullName: "Trinidad Isabella Becerra Nova",
    grades: {
      lenguaje: { notes: [4.5, 7.0, 5.5, 3.0, 6.0, 5.0, 6.5], avg: 5.3 },
      ingles: { notes: [4.7, 6.7], avg: 5.7 },
      matematica: { notes: [4.6, 3.0, 4.6, 6.0, 5.5, 4.7], avg: 4.7 },
      historia: { notes: [3.6, 5.7, 6.0, 6.2, 6.7], avg: 5.6 },
      biologia: { notes: [6.3, 7.0], avg: 6.6 },
      quimica: { notes: [6.6, 2.8, 5.1], avg: 4.8 },
      fisica: { notes: [4.0, 4.0], avg: 4.0 },
      cienciasNaturales: { notes: [3.1, 5.9], avg: 4.5 },
      artesVisuales: { notes: [4.6], avg: 4.6 },
      edTecnologica: { notes: [5.0, 5.8], avg: 5.4 },
      edFisica: { notes: [4.6], avg: 4.6 },
      parvulo: { notes: [4.8, 4.5, 5.4], avg: 4.9 },
      enfermeria: { notes: [6.7, 7.0], avg: 6.8 },
      programacion: { notes: [6.0, 6.0], avg: 6.0 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 8, julioPct: 61.54, agostoTdc: 14, agostoPct: 66.67, septiembreTdc: 18, septiembrePct: 90.0, pctSem1: 85, pctSem2: 74, pctReal: 80.50 }
  },
  {
    num: 10,
    fullName: "Marthina Alejandra Brito Díaz",
    grades: {
      lenguaje: { notes: [5.4, 5.2, 5.4, 5.0, 5.0, 5.8, 6.7], avg: 5.5 },
      ingles: { notes: [7.0, 6.3, 5.7, 6.3, 7.0], avg: 6.5 },
      matematica: { notes: [2.5, 2.4, 4.0, 4.5, 5.0, 6.0], avg: 4.0 },
      historia: { notes: [5.3, 3.4, 6.6, 6.7, 5.8, 6.6], avg: 5.7 },
      biologia: { notes: [5.8, 6.5], avg: 6.1 },
      quimica: { notes: [6.1, 4.6, 6.6], avg: 5.7 },
      fisica: { notes: [4.3, 6.3], avg: 5.3 },
      cienciasNaturales: { notes: [6.2, 5.9], avg: 6.0 },
      artesVisuales: { notes: [4.2], avg: 4.2 },
      edTecnologica: { notes: [6.9, 6.3], avg: 6.6 },
      edFisica: { notes: [6.3], avg: 6.3 },
      parvulo: { notes: [5.7, 6.0, 6.6], avg: 6.1 },
      enfermeria: { notes: [6.5, 6.0], avg: 6.2 },
      programacion: { notes: [7.0, 6.0], avg: 6.5 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 13, julioPct: 100.0, agostoTdc: 21, agostoPct: 100.0, septiembreTdc: 19, septiembrePct: 95.0, pctSem1: 100, pctSem2: 98, pctReal: 99.24 }
  },
  {
    num: 11,
    fullName: "Esteban Ariel Campos Ocaranza",
    grades: {
      lenguaje: { notes: [4.5, 6.3, 6.7, 4.8, 6.0, 6.2, 6.5], avg: 5.8 },
      ingles: { notes: [5.8, 6.3, 7.0, 7.0, 5.7], avg: 6.4 },
      matematica: { notes: [5.5, 1.2, 7.0, 5.0, 5.0, 5.8], avg: 4.9 },
      historia: { notes: [4.9, 5.0, 6.1, 6.0, 4.3, 6.3], avg: 5.4 },
      biologia: { notes: [6.4, 6.5], avg: 6.4 },
      quimica: { notes: [6.5, 4.8, 6.4], avg: 5.9 },
      fisica: { notes: [6.0, 5.5], avg: 5.7 },
      cienciasNaturales: { notes: [4.5, 5.1], avg: 4.8 },
      artesVisuales: { notes: [5.9], avg: 5.9 },
      edTecnologica: { notes: [6.0, 6.1], avg: 6.0 },
      edFisica: { notes: [5.0], avg: 5.0 },
      parvulo: { notes: [5.9, 4.8, 6.0], avg: 5.5 },
      enfermeria: { notes: [5.1, 2.0], avg: 3.5 },
      programacion: { notes: [7.0, 6.0], avg: 6.5 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 11, julioPct: 84.62, agostoTdc: 16, agostoPct: 76.19, septiembreTdc: 19, septiembrePct: 95.0, pctSem1: 89, pctSem2: 85, pctReal: 87.43 }
  },
  {
    num: 12,
    fullName: "Reiker Gabriel Carrasquero Araya",
    grades: {
      lenguaje: { notes: [3.5, 4.8, 5.7, 4.4, 5.0, 6.0, 6.7], avg: 5.1 },
      ingles: { notes: [6.7, 5.4, 7.0, 6.4, 2.8], avg: 5.7 },
      matematica: { notes: [5.4, 1.4, 5.1, 6.0, 6.7, 6.6], avg: 5.2 },
      historia: { notes: [5.0, 5.2, 5.5, 5.7, 5.4, 6.1], avg: 5.5 },
      biologia: { notes: [4.4], avg: 4.4 },
      quimica: { notes: [6.5, 2.3, 7.0], avg: 5.2 },
      fisica: { notes: [4.0, 5.3], avg: 4.6 },
      cienciasNaturales: { notes: [6.5, 6.4], avg: 6.4 },
      artesVisuales: { notes: [4.4], avg: 4.4 },
      edTecnologica: { notes: [5.8, 6.6], avg: 6.2 },
      edFisica: { notes: [5.0], avg: 5.0 },
      parvulo: { notes: [5.2, 6.4, 6.2], avg: 5.9 },
      enfermeria: { notes: [4.3, 2.0], avg: 3.1 },
      programacion: { notes: [7.0, 6.8], avg: 6.9 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 9, julioPct: 69.23, agostoTdc: 17, agostoPct: 80.95, septiembreTdc: 14, septiembrePct: 70.0, pctSem1: 93, pctSem2: 74, pctReal: 85.20 }
  },
  {
    num: 13,
    fullName: "Maximiliano Giuliano Cerda Robles",
    grades: {
      lenguaje: { notes: [6.4, 5.5, 6.4, 5.4, 5.0, 6.4, 6.5], avg: 5.9 },
      ingles: { notes: [7.0, 7.0, 7.0, 7.0, 7.0], avg: 7.0 },
      matematica: { notes: [6.2, 7.0, 6.5, 6.6, 7.0], avg: 6.7 },
      historia: { notes: [5.1, 6.2, 6.1, 6.6, 6.2, 6.8], avg: 6.2 },
      biologia: { notes: [6.0, 6.5], avg: 6.2 },
      quimica: { notes: [7.0, 4.6, 6.0], avg: 5.8 },
      fisica: { notes: [6.5, 5.5], avg: 6.0 },
      cienciasNaturales: { notes: [5.3, 6.2], avg: 5.7 },
      artesVisuales: { notes: [5.3], avg: 5.3 },
      edTecnologica: { notes: [6.3, 6.5], avg: 6.4 },
      edFisica: { notes: [6.7], avg: 6.7 },
      parvulo: { notes: [5.8, 5.7, 6.4], avg: 5.9 },
      enfermeria: { notes: [6.7, 7.0], avg: 6.8 },
      programacion: { notes: [7.0, 6.5], avg: 6.7 },
      formacionValorica: { notes: [7.0, 7.0], avg: 7.0 },
    },
    attendance: { julioTdc: 11, julioPct: 84.62, agostoTdc: 16, agostoPct: 76.19, septiembreTdc: 19, septiembrePct: 95.0, pctSem1: 99, pctSem2: 85, pctReal: 93.31 }
  },
  {
    num: 15,
    fullName: "Rayen Yasmin Espinoza Poveda",
    grades: {
      lenguaje: { notes: [3.5, 5.7, 6.5, 5.1, 5.1, 5.0, 6.2], avg: 5.3 },
      ingles: { notes: [6.1], avg: 6.1 },
      matematica: { notes: [3.4, 2.6, 5.3, 4.0, 2.0, 7.0], avg: 4.0 },
      historia: { notes: [4.3, 5.3, 4.2, 5.7, 5.8, 6.3], avg: 5.3 },
      biologia: { notes: [6.3], avg: 6.3 },
      quimica: { notes: [4.7, 2.4, 7.0], avg: 4.7 },
      fisica: { notes: [5.2], avg: 5.2 },
      cienciasNaturales: { notes: [6.7, 3.4], avg: 5.0 },
      artesVisuales: { notes: [1.5, 1.5], avg: 1.5 },
      edTecnologica: { notes: [5.3], avg: 5.3 },
      edFisica: { notes: [4.7, 5.0, 1.5], avg: 3.7 },
      parvulo: { notes: [5.9, 5.7], avg: 5.8 },
      enfermeria: { notes: [7.0, 6.5], avg: 6.7 },
      programacion: { notes: [6.8, 7.0, 6.3], avg: 6.7 },
      formacionValorica: { notes: [6.5, 6.7, 6.3, 5.8], avg: 6.3 },
    },
    attendance: { julioTdc: 5, julioPct: 38.46, agostoTdc: 12, agostoPct: 57.14, septiembreTdc: 9, septiembrePct: 45.0, pctSem1: 68, pctSem2: 48, pctReal: 59.82 }
  },
  {
    num: 16,
    fullName: "Cristóbal Eduardo Fuenzalida Abarca",
    grades: {
      lenguaje: { notes: [7.0, 7.0, 7.0, 6.0, 6.5, 6.5, 6.2], avg: 6.6 },
      ingles: { notes: [7.0, 7.0, 7.0, 7.0, 7.0], avg: 7.0 },
      matematica: { notes: [6.5, 7.0, 7.0, 7.0, 7.0], avg: 6.9 },
      historia: { notes: [7.0, 5.5, 6.7, 6.8, 6.6], avg: 6.5 },
      biologia: { notes: [6.8, 7.0], avg: 6.9 },
      quimica: { notes: [7.0, 6.7, 7.0], avg: 6.9 },
      fisica: { notes: [5.6, 6.7], avg: 6.1 },
      cienciasNaturales: { notes: [7.0], avg: 7.0 },
      artesVisuales: { notes: [6.3, 6.6], avg: 6.4 },
      edTecnologica: { notes: [6.3], avg: 6.3 },
      edFisica: { notes: [6.9, 6.1, 6.4], avg: 6.4 },
      parvulo: { notes: [4.0, 7.0, 5.8], avg: 5.6 },
      enfermeria: { notes: [6.0], avg: 6.0 },
      programacion: { notes: [6.3, 5.0, 6.9], avg: 6.0 },
      formacionValorica: { notes: [7.0, 6.4, 7.0, 6.6], avg: 6.7 },
    },
    attendance: { julioTdc: 13, julioPct: 100.0, agostoTdc: 19, agostoPct: 90.48, septiembreTdc: 18, septiembrePct: 90.0, pctSem1: 97, pctSem2: 93, pctReal: 95.18 }
  },
  {
    num: 17,
    fullName: "Isidora Abigail Galdames Pérez",
    grades: {
      lenguaje: { notes: [5.0, 6.7, 6.3, 4.8, 6.3, 6.5, 6.9], avg: 6.0 },
      ingles: { notes: [5.8, 6.3, 7.0, 6.4, 5.0], avg: 6.1 },
      matematica: { notes: [7.0, 5.8, 6.1, 7.0, 7.0, 7.0], avg: 6.6 },
      historia: { notes: [5.5, 5.2, 6.0, 6.1, 6.8, 7.0], avg: 6.1 },
      biologia: { notes: [6.6, 6.5], avg: 6.5 },
      quimica: { notes: [7.0, 2.7, 6.8], avg: 5.5 },
      fisica: { notes: [4.0, 6.3], avg: 5.1 },
      cienciasNaturales: { notes: [7.0, 6.7], avg: 6.8 },
      artesVisuales: { notes: [6.1], avg: 6.1 },
      edTecnologica: { notes: [6.0, 6.6], avg: 6.3 },
      edFisica: { notes: [4.6], avg: 4.6 },
      parvulo: { notes: [5.5, 6.8, 6.3], avg: 6.2 },
      enfermeria: { notes: [7.0, 7.0], avg: 7.0 },
      programacion: { notes: [7.0, 7.0], avg: 7.0 },
      formacionValorica: { notes: [7.0, 6.5, 7.0], avg: 6.8 },
    },
    attendance: { julioTdc: 12, julioPct: 92.31, agostoTdc: 20, agostoPct: 95.24, septiembreTdc: 18, septiembrePct: 90.0, pctSem1: 96, pctSem2: 93, pctReal: 94.60 }
  },
  {
    num: 18,
    fullName: "Ylitia Magdalena Jara Fuenzalida",
    grades: {
      lenguaje: { notes: [3.2, 4.3, 4.3, 3.5, 4.5, 4.0, 6.0], avg: 4.2 },
      ingles: { notes: [1.5], avg: 1.5 },
      matematica: { notes: [1.9, 2.0, 3.3, 4.5, 5.0, 3.3], avg: 3.3 },
      historia: { notes: [5.3, 4.2, 4.0, 4.0], avg: 4.3 },
      biologia: { notes: [4.1], avg: 4.1 },
      quimica: { notes: [5.5, 1.5, 5.0], avg: 4.0 },
      fisica: { notes: [1.5, 4.0], avg: 2.7 },
      cienciasNaturales: { notes: [2.5, 5.9], avg: 4.2 },
      artesVisuales: { notes: [1.5], avg: 1.5 },
      edTecnologica: { notes: [1.5, 1.5], avg: 1.5 },
      edFisica: { notes: [1.5], avg: 1.5 },
      parvulo: { notes: [4.0, 4.2, 1.5], avg: 3.2 },
      enfermeria: { notes: [5.7, 6.0], avg: 5.8 },
      programacion: { notes: [3.0, 5.0], avg: 4.0 },
      formacionValorica: { notes: [7.0, 6.6, 6.5], avg: 6.7 },
    },
    attendance: { julioTdc: 6, julioPct: 46.15, agostoTdc: 10, agostoPct: 47.62, septiembreTdc: 6, septiembrePct: 30.0, pctSem1: 62, pctSem2: 41, pctReal: 53.24 }
  },
  {
    num: 20,
    fullName: "Paz Yeraldi Martínez Ramírez",
    grades: {
      lenguaje: { notes: [4.0, 4.0, 6.5, 5.2, 5.5, 6.0, 6.2], avg: 5.3 },
      ingles: { notes: [3.3, 5.2, 5.4, 4.6, 6.3], avg: 5.0 },
      matematica: { notes: [3.5, 4.1, 3.5, 4.5, 5.0, 4.1], avg: 4.1 },
      historia: { notes: [3.4, 3.5, 6.6, 6.1, 6.3, 6.7], avg: 5.4 },
      biologia: { notes: [6.7, 7.0], avg: 6.8 },
      quimica: { notes: [4.0, 4.1, 7.0], avg: 5.0 },
      fisica: { notes: [4.0, 6.3], avg: 5.1 },
      cienciasNaturales: { notes: [6.4, 4.0], avg: 5.2 },
      artesVisuales: { notes: [4.0], avg: 4.0 },
      edTecnologica: { notes: [1.8, 6.6], avg: 4.2 },
      edFisica: { notes: [4.6], avg: 4.6 },
      parvulo: { notes: [5.0, 5.2, 4.2], avg: 4.8 },
      enfermeria: { notes: [6.5, 2.0], avg: 4.2 },
      programacion: { notes: [7.0, 6.5], avg: 6.7 },
      formacionValorica: { notes: [7.0, 6.7, 6.7, 6.4], avg: 6.7 },
    },
    attendance: { julioTdc: 12, julioPct: 92.31, agostoTdc: 17, agostoPct: 80.95, septiembreTdc: 20, septiembrePct: 100.0, pctSem1: 88, pctSem2: 91, pctReal: 89.13 }
  },
  {
    num: 21,
    fullName: "Florencia Victoria Morales Martínez",
    grades: {
      lenguaje: { notes: [5.2, 6.7, 6.6, 6.0, 6.0, 6.5, 7.0], avg: 6.2 },
      ingles: { notes: [6.7, 5.8, 7.0, 6.5, 7.0], avg: 6.6 },
      matematica: { notes: [5.5, 6.4, 5.2, 7.0, 7.0, 6.7], avg: 6.3 },
      historia: { notes: [6.0, 6.0, 7.0, 6.8, 5.0, 6.2], avg: 6.1 },
      biologia: { notes: [5.8, 7.0], avg: 6.4 },
      quimica: { notes: [6.3, 4.4, 7.0], avg: 5.9 },
      fisica: { notes: [6.2, 7.0], avg: 6.6 },
      cienciasNaturales: { notes: [4.5, 6.2], avg: 5.3 },
      artesVisuales: { notes: [4.6], avg: 4.6 },
      edTecnologica: { notes: [4.0, 4.0], avg: 4.0 },
      edFisica: { notes: [6.0], avg: 6.0 },
      parvulo: { notes: [5.9, 5.3, 4.0], avg: 5.0 },
      enfermeria: { notes: [7.0, 7.0], avg: 7.0 },
      programacion: { notes: [6.0, 7.0], avg: 6.5 },
      formacionValorica: { notes: [7.0, 6.7, 7.0, 6.4], avg: 6.7 },
    },
    attendance: { julioTdc: 12, julioPct: 92.31, agostoTdc: 21, agostoPct: 100.0, septiembreTdc: 20, septiembrePct: 100.0, pctSem1: 74, pctSem2: 98, pctReal: 83.95 }
  },
  {
    num: 22,
    fullName: "Naomí Akira Morales Ponce",
    grades: {
      lenguaje: { notes: [4.2, 5.7, 6.3, 5.7, 5.0, 6.6, 6.7], avg: 5.7 },
      ingles: { notes: [6.7, 5.8, 7.0, 6.5, 3.4], avg: 5.9 },
      matematica: { notes: [4.5, 1.3, 4.7, 6.5, 6.0, 5.5], avg: 4.7 },
      historia: { notes: [6.6, 6.8, 5.2, 6.0], avg: 6.1 },
      biologia: { notes: [6.5], avg: 6.5 },
      quimica: { notes: [6.5, 2.3, 7.0], avg: 5.2 },
      fisica: { notes: [6.0, 6.5], avg: 6.2 },
      cienciasNaturales: { notes: [5.2, 5.8], avg: 5.5 },
      artesVisuales: { notes: [5.0, 6.6], avg: 5.8 },
      edTecnologica: { notes: [4.6], avg: 4.6 },
      edFisica: { notes: [5.2, 5.5, 5.8], avg: 5.5 },
      parvulo: { notes: [7.0, 6.0], avg: 6.5 },
      enfermeria: { notes: [7.0, 4.0], avg: 5.5 },
      programacion: { notes: [6.2, 6.5, 7.0], avg: 6.5 },
      formacionValorica: { notes: [5.8, 5.8, 5.8, 6.1], avg: 5.8 },
    },
    attendance: { julioTdc: 7, julioPct: 53.85, agostoTdc: 14, agostoPct: 66.67, septiembreTdc: 11, septiembrePct: 55.0, pctSem1: 86, pctSem2: 59, pctReal: 74.98 }
  },
  {
    num: 24,
    fullName: "Catalina Leticia Oyanadel Vergara",
    grades: {
      lenguaje: { notes: [4.0, 5.1, 7.0, 5.0, 6.0, 5.4, 6.5], avg: 5.5 },
      ingles: { notes: [5.6, 6.7, 4.0], avg: 5.4 },
      matematica: { notes: [4.3, 4.2, 4.0, 6.0, 4.9, 6.3], avg: 4.9 },
      historia: { notes: [2.7, 7.0, 6.4, 6.5, 6.8], avg: 5.9 },
      biologia: { notes: [6.8, 7.0], avg: 6.9 },
      quimica: { notes: [5.5, 3.4, 7.0], avg: 5.3 },
      fisica: { notes: [4.8, 5.7], avg: 5.2 },
      cienciasNaturales: { notes: [4.2, 6.7], avg: 5.4 },
      artesVisuales: { notes: [5.1], avg: 5.1 },
      edTecnologica: { notes: [2.9, 6.1], avg: 4.5 },
      edFisica: { notes: [5.6], avg: 5.6 },
      parvulo: { notes: [5.3, 5.4, 4.5], avg: 5.0 },
      enfermeria: { notes: [5.4, 7.0], avg: 6.2 },
      programacion: { notes: [6.0, 7.0], avg: 6.5 },
      formacionValorica: { notes: [6.5, 7.0, 5.8, 6.4], avg: 6.4 },
    },
    attendance: { julioTdc: 10, julioPct: 76.92, agostoTdc: 20, agostoPct: 95.24, septiembreTdc: 16, septiembrePct: 80.0, pctSem1: 93, pctSem2: 85, pctReal: 89.78 }
  },
  {
    num: 25,
    fullName: "Winyelber Andres Paternina Ruiz",
    grades: {
      lenguaje: { notes: [4.1, 5.0, 5.0, 4.0, 6.0, 5.4, 6.7], avg: 5.1 },
      ingles: { notes: [5.0, 5.4, 6.1, 5.5, 4.2], avg: 5.2 },
      matematica: { notes: [3.5, 1.4, 6.1, 4.5, 5.5, 4.1], avg: 4.1 },
      historia: { notes: [5.6, 5.0, 5.3, 6.2, 6.2, 6.1], avg: 5.7 },
      biologia: { notes: [4.7, 7.0], avg: 5.8 },
      quimica: { notes: [6.1, 4.0, 6.6], avg: 5.5 },
      fisica: { notes: [5.0, 5.0], avg: 5.0 },
      cienciasNaturales: { notes: [6.6, 5.1], avg: 5.8 },
      artesVisuales: { notes: [4.0], avg: 4.0 },
      edTecnologica: { notes: [6.0, 6.8], avg: 6.4 },
      edFisica: { notes: [4.6], avg: 4.6 },
      parvulo: { notes: [5.5, 5.8, 6.4], avg: 5.9 },
      enfermeria: { notes: [5.1, 2.0], avg: 3.5 },
      programacion: { notes: [7.0, 2.0], avg: 4.5 },
      formacionValorica: { notes: [7.0, 7.0, 6.8, 5.8], avg: 6.6 },
    },
    attendance: { julioTdc: 12, julioPct: 92.31, agostoTdc: 18, agostoPct: 85.71, septiembreTdc: 17, septiembrePct: 85.0, pctSem1: 89, pctSem2: 87, pctReal: 88.19 }
  },
  {
    num: 26,
    fullName: "Antonia Paz Piña Riquelme",
    grades: {
      lenguaje: { notes: [3.5, 2.0, 4.5, 2.0, 5.0, 5.4, 6.4], avg: 4.1 },
      ingles: { notes: [3.3, 4.5, 5.2, 4.3, 5.5], avg: 4.6 },
      matematica: { notes: [3.7, 1.2, 3.5, 4.0, 4.0, 3.0], avg: 3.2 },
      historia: { notes: [4.5, 4.2, 4.5, 6.5, 6.7], avg: 5.3 },
      biologia: { notes: [7.0], avg: 7.0 },
      quimica: { notes: [5.2, 1.8, 5.3], avg: 4.1 },
      fisica: { notes: [4.0, 4.0], avg: 4.0 },
      cienciasNaturales: { notes: [5.4, 3.7], avg: 4.5 },
      artesVisuales: { notes: [4.6], avg: 4.6 },
      edTecnologica: { notes: [1.9, 4.3], avg: 3.1 },
      edFisica: { notes: [5.1], avg: 5.1 },
      parvulo: { notes: [4.1, 4.5, 3.1], avg: 3.9 },
      enfermeria: { notes: [5.0, 7.0], avg: 6.0 },
      programacion: { notes: [7.0, 2.0], avg: 4.5 },
      formacionValorica: { notes: [5.8, 2.0, 6.4, 5.5], avg: 4.9 },
    },
    attendance: { julioTdc: 13, julioPct: 100.0, agostoTdc: 12, agostoPct: 57.14, septiembreTdc: 14, septiembrePct: 70.0, pctSem1: 86, pctSem2: 72, pctReal: 80.32 }
  },
  {
    num: 30,
    fullName: "Jeurlande Theodule",
    grades: {
      lenguaje: { notes: [6.1, 6.1, 7.0, 6.0, 6.5, 6.5], avg: 6.3 },
      ingles: { notes: [6.1, 6.1, 7.0, 7.0, 6.2], avg: 6.5 },
      matematica: { notes: [4.0, 4.4, 5.0, 7.0, 7.0, 5.8], avg: 5.5 },
      historia: { notes: [6.0, 5.4, 5.7, 5.7, 6.4, 5.4, 7.0], avg: 6.0 },
      biologia: { notes: [4.9, 6.5], avg: 5.7 },
      quimica: { notes: [6.6, 2.7, 7.0], avg: 5.4 },
      fisica: { notes: [5.7, 7.0], avg: 6.3 },
      cienciasNaturales: { notes: [5.1, 5.1], avg: 5.1 },
      artesVisuales: { notes: [4.0], avg: 4.0 },
      edTecnologica: { notes: [4.5, 6.1], avg: 5.3 },
      edFisica: { notes: [6.0], avg: 6.0 },
      parvulo: { notes: [5.4, 5.1, 5.3], avg: 5.2 },
      enfermeria: { notes: [5.9, 6.8], avg: 6.3 },
      programacion: { notes: [7.0, 7.0], avg: 7.0 },
      formacionValorica: { notes: [7.0, 7.0, 7.0, 6.1], avg: 6.7 },
    },
    attendance: { julioTdc: 10, julioPct: 76.92, agostoTdc: 21, agostoPct: 100.0, septiembreTdc: 20, septiembrePct: 100.0, pctSem1: 95, pctSem2: 94, pctReal: 94.77 }
  },
  {
    num: 31,
    fullName: "Antonia Maleny Vega Fernández",
    grades: {
      lenguaje: { notes: [6.0, 7.0, 6.7, 6.1, 5.0, 4.5, 6.9], avg: 6.0 },
      ingles: { notes: [6.5, 6.3, 6.6, 6.5, 4.2], avg: 6.0 },
      matematica: { notes: [5.7, 4.3, 6.3, 5.0, 5.0, 5.2], avg: 5.2 },
      historia: { notes: [4.0, 2.5, 5.3, 5.3, 6.2, 7.0], avg: 5.1 },
      biologia: { notes: [7.0, 6.0], avg: 6.5 },
      quimica: { notes: [6.8, 5.8, 6.8], avg: 6.4 },
      fisica: { notes: [4.5, 7.0], avg: 5.7 },
      cienciasNaturales: { notes: [7.0, 6.4], avg: 6.7 },
      artesVisuales: { notes: [5.9], avg: 5.9 },
      edTecnologica: { notes: [5.8, 6.6], avg: 6.2 },
      edFisica: { notes: [5.6], avg: 5.6 },
      parvulo: { notes: [6.4, 6.7, 6.2], avg: 6.4 },
      enfermeria: { notes: [6.5, 6.0], avg: 6.2 },
      programacion: { notes: [7.0, 7.0], avg: 7.0 },
      formacionValorica: { notes: [6.7, 6.4, 7.0, 6.0], avg: 6.5 },
    },
    attendance: { julioTdc: 11, julioPct: 84.62, agostoTdc: 21, agostoPct: 100.0, septiembreTdc: 17, septiembrePct: 85.0, pctSem1: 96, pctSem2: 91, pctReal: 93.83 }
  },
  {
    num: 34,
    fullName: "Francisca Alexandra Fernández Bravo",
    grades: {
      lenguaje: { notes: [5.4, 4.7, 5.4, 4.5, 6.0, 6.0, 6.2], avg: 5.4 },
      ingles: { notes: [4.8, 4.5], avg: 4.7 },
      matematica: { notes: [4.4, 5.7, 5.0, 7.0, 7.0, 5.2], avg: 5.7 },
      historia: { notes: [4.8, 1.5, 7.0, 5.7, 5.3, 5.0], avg: 4.9 },
      biologia: { notes: [5.1, 6.5], avg: 5.8 },
      quimica: { notes: [5.2, 4.3, 7.0], avg: 5.5 },
      fisica: { notes: [4.0, 4.0], avg: 4.0 },
      cienciasNaturales: { notes: [6.5, 4.8], avg: 5.6 },
      artesVisuales: { notes: [5.1], avg: 5.1 },
      edTecnologica: { notes: [4.8, 4.5], avg: 4.6 },
      edFisica: { notes: [6.0], avg: 6.0 },
      parvulo: { notes: [5.5, 5.6, 4.6], avg: 5.2 },
      enfermeria: { notes: [6.3, 4.0], avg: 5.1 },
      programacion: { notes: [7.0, 7.0], avg: 7.0 },
      formacionValorica: { notes: [5.8, 6.7, 6.4, 5.8], avg: 6.1 },
    },
    attendance: { julioTdc: 13, julioPct: 100.0, agostoTdc: 21, agostoPct: 100.0, septiembreTdc: 20, septiembrePct: 100.0, pctSem1: 100, pctSem2: 100, pctReal: 100.0 }
  },
  {
    num: 35,
    fullName: "Allison Belén Jiménez Carrizo",
    grades: {
      lenguaje: { notes: [], avg: 0 },
      ingles: { notes: [6.5], avg: 6.5 },
      matematica: { notes: [], avg: 0 },
      historia: { notes: [3.8], avg: 3.8 },
      biologia: { notes: [7.0, 7.0], avg: 7.0 },
      quimica: { notes: [5.2, 6.0], avg: 5.6 },
      fisica: { notes: [6.8], avg: 6.8 },
      cienciasNaturales: { notes: [3.3], avg: 3.3 },
      artesVisuales: { notes: [], avg: 0 },
      edTecnologica: { notes: [], avg: 0 },
      edFisica: { notes: [], avg: 0 },
      parvulo: { notes: [], avg: 0 },
      enfermeria: { notes: [], avg: 0 },
      programacion: { notes: [6.7, 6.0, 6.7], avg: 6.4 },
      formacionValorica: { notes: [], avg: 0 },
    },
    attendance: { julioTdc: 10, julioPct: 76.92, agostoTdc: 13, agostoPct: 61.90, septiembreTdc: 14, septiembrePct: 70.0, pctSem1: 100, pctSem2: 69, pctReal: 87.02 }
  },
  {
    num: 36,
    fullName: "Branco Heidan Eletelier Porras Arévalo",
    grades: {
      lenguaje: { notes: [], avg: 0 },
      ingles: { notes: [], avg: 0 },
      matematica: { notes: [], avg: 0 },
      historia: { notes: [], avg: 0 },
      biologia: { notes: [], avg: 0 },
      quimica: { notes: [], avg: 0 },
      fisica: { notes: [], avg: 0 },
      cienciasNaturales: { notes: [], avg: 0 },
      artesVisuales: { notes: [], avg: 0 },
      edTecnologica: { notes: [], avg: 0 },
      edFisica: { notes: [], avg: 0 },
      parvulo: { notes: [], avg: 0 },
      enfermeria: { notes: [], avg: 0 },
      programacion: { notes: [], avg: 0 },
      formacionValorica: { notes: [], avg: 0 },
    },
    attendance: { julioTdc: 13, julioPct: 100.0, agostoTdc: 21, agostoPct: 100.0, septiembreTdc: 20, septiembrePct: 100.0, pctSem1: 75, pctSem2: 100, pctReal: 85.31 }
  },
];

export const LPMM_SUBJECTS_DEFINITIONS = [
  { name: "Lenguaje y Comunicación", code: "LENG", hoursPerWeek: 6 },
  { name: "Idioma Extranjero Inglés", code: "ING", hoursPerWeek: 4 },
  { name: "Matemática", code: "MAT", hoursPerWeek: 6 },
  { name: "Historia y Ciencias Sociales", code: "HIST", hoursPerWeek: 4 },
  { name: "Biología", code: "BIO", hoursPerWeek: 3 },
  { name: "Química", code: "QUIM", hoursPerWeek: 3 },
  { name: "Física", code: "FIS", hoursPerWeek: 3 },
  { name: "Ciencias Naturales", code: "CNAT", hoursPerWeek: 4 },
  { name: "Artes Visuales", code: "ART", hoursPerWeek: 2 },
  { name: "Educación Tecnológica", code: "TEC", hoursPerWeek: 2 },
  { name: "Educación Física y Salud", code: "EDF", hoursPerWeek: 2 },
  { name: "Atención de Párvulos", code: "TP-PARV", hoursPerWeek: 4 },
  { name: "Atención de Enfermería", code: "TP-ENF", hoursPerWeek: 4 },
  { name: "Técnico en Programación", code: "TP-PROG", hoursPerWeek: 6 },
  { name: "Formación Valórica y Ciudadana", code: "FORM-VAL", hoursPerWeek: 2 },
];

export function populateLpmmStore(store: any) {
  const currentYear = 2026;

  // 1. Escuela LPMM
  const lpmmSchool = {
    id: "school-lpmm-001",
    slug: "lpmm",
    name: "Liceo Politécnico Marga Marga",
    institutionalCode: "LPMM-8921",
    address: "Av. Los Carreras 1250, Quilpué",
    city: "Quilpué / Marga Marga",
    country: "Chile",
    timezone: "America/Santiago",
    status: "ACTIVE",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.schools.set(lpmmSchool.id, lpmmSchool);
  store.schools.set(lpmmSchool.slug, lpmmSchool);

  // Settings
  const lpmmSettings = {
    id: "settings-lpmm-001",
    schoolId: lpmmSchool.id,
    termType: "SEMESTER",
    minPassingGrade: 4.0,
    minGrade: 1.0,
    maxGrade: 7.0,
    gradeScalePrecision: 1,
    primaryColor: "#2563eb",
    requireAttendanceNote: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.schoolSettings.set(lpmmSettings.id, lpmmSettings);
  store.schoolSettings.set(lpmmSchool.id, lpmmSettings);

  // Roles para LPMM
  const lpmmRoleMap: Record<string, any> = {};
  for (const preset of Object.values(ROLE_PRESETS)) {
    const role = {
      id: `role-lpmm-${preset.name.toLowerCase()}`,
      schoolId: lpmmSchool.id,
      name: preset.name,
      displayName: preset.displayName,
      description: preset.description,
      isSystem: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.roles.set(role.id, role);
    lpmmRoleMap[preset.name] = role;

    for (const code of preset.permissions) {
      const rp = {
        id: `rp-lpmm-${role.id}-${code}`,
        roleId: role.id,
        permissionId: code,
      };
      store.rolePermissions.set(rp.id, rp);
    }
  }

  // Período Académico LPMM
  const lpmmPeriod = {
    id: "period-lpmm-2026",
    schoolId: lpmmSchool.id,
    name: "Año Académico 2026",
    year: currentYear,
    startDate: new Date("2026-03-01T08:00:00Z"),
    endDate: new Date("2026-12-20T18:00:00Z"),
    isCurrent: true,
    isClosed: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.academicPeriods.set(lpmmPeriod.id, lpmmPeriod);

  // Nivel Educativo
  const lpmmLevel = {
    id: "level-lpmm-emtp",
    schoolId: lpmmSchool.id,
    name: "Enseñanza Media Técnico Profesional",
    shortCode: "EMTP",
    orderIndex: 1,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.educationLevels.set(lpmmLevel.id, lpmmLevel);

  // Crear los 14 cursos oficiales reales del Liceo Politécnico Marga Marga (LPMM):
  // 1° Medio: A, B, C
  // 2° Medio: A, B, C
  // 3° Medio: A, C, D, E
  // 4° Medio: A, C, D, E
  const OFFICIAL_LPMM_COURSES = [
    { grade: 1, letter: "A" },
    { grade: 1, letter: "B" },
    { grade: 1, letter: "C" },
    { grade: 2, letter: "A" },
    { grade: 2, letter: "B" },
    { grade: 2, letter: "C" },
    { grade: 3, letter: "A" },
    { grade: 3, letter: "C" },
    { grade: 3, letter: "D" },
    { grade: 3, letter: "E" },
    { grade: 4, letter: "A" },
    { grade: 4, letter: "C" },
    { grade: 4, letter: "D" },
    { grade: 4, letter: "E" },
  ];
  const lpmmCourses: Record<string, any> = {};

  for (const { grade, letter } of OFFICIAL_LPMM_COURSES) {
    const courseName = `${grade}° Medio ${letter}`;
    const courseId = `course-lpmm-${grade}m${letter.toLowerCase()}`;
    const course = {
      id: courseId,
      schoolId: lpmmSchool.id,
      educationLevelId: lpmmLevel.id,
      name: courseName,
      letter,
      gradeNumber: grade,
      year: currentYear,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.courses.set(course.id, course);
    lpmmCourses[courseName] = course;

      // Crear asignaturas reales para este curso
      const courseSubjs = LPMM_COURSE_SUBJECTS[courseName] || LPMM_SUBJECTS_DEFINITIONS;
      for (const subjDef of courseSubjs) {
        const subjCode = (subjDef.code || subjDef.name).toLowerCase().replace(/[^a-z0-9]/g, "");
        const subjId = `subj-lpmm-${grade}${letter.toLowerCase()}-${subjCode}`;
        const subject = {
          id: subjId,
          schoolId: lpmmSchool.id,
          courseId: course.id,
          name: subjDef.name,
          code: subjDef.code || `${subjCode.toUpperCase()}-${grade}${letter}`,
          hoursPerWeek: subjDef.weeklyHours || subjDef.hoursPerWeek || 4,
          teacherProfileId: null,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        };
        store.subjects.set(subject.id, subject);
      }
    }

  // Director y Docente de LPMM
  const STATIC_DEMO_HASH = "$2a$10$wN35rBdg2bFqY5p5gZkJ.eU7lY2U3KjW7uUeL1I7b2o0V9Fz6Q7aC";
  const directorPasswordHash = STATIC_DEMO_HASH;
  const directorUser = {
    id: "user-lpmm-director",
    email: "director@lpmm.cl",
    firstName: "Dirección",
    lastName: "Liceo Marga Marga",
    passwordHash: directorPasswordHash,
    status: "ACTIVE",
    isSystemAdmin: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.users.set(directorUser.id, directorUser);

  const directorMem = {
    id: "mem-lpmm-director",
    userId: directorUser.id,
    schoolId: lpmmSchool.id,
    roleId: lpmmRoleMap[DEFAULT_SCHOOL_ROLES.SCHOOL_ADMIN]?.id || "role-lpmm-school_admin",
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.memberships.set(directorMem.id, directorMem);

  const teacherPasswordHash = STATIC_DEMO_HASH;
  const teacherUser = {
    id: "user-lpmm-profesor-rodrigo",
    email: "profesor.rodrigo@lpmm.cl",
    firstName: "Rodrigo",
    lastName: "Castro Díaz",
    passwordHash: teacherPasswordHash,
    status: "ACTIVE",
    isSystemAdmin: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.users.set(teacherUser.id, teacherUser);
  store.users.set("user-lpmm-profesor-rodrigo-alias", {
    ...teacherUser,
    id: "user-lpmm-profesor-rodrigo-alias",
    email: "rodrigo.castro@lpmm.cl",
  });
  store.users.set("user-lpmm-profesor-1a", {
    ...teacherUser,
    id: "user-lpmm-profesor-1a",
    email: "profesor.1a@lpmm.cl",
  });
  store.users.set("user-lpmm-profesor-general", {
    ...teacherUser,
    id: "user-lpmm-profesor-general",
    email: "profesor@lpmm.cl",
  });

  const teacherMemRodrigo = {
    id: "mem-lpmm-profesor-rodrigo",
    userId: teacherUser.id,
    schoolId: lpmmSchool.id,
    roleId: lpmmRoleMap[DEFAULT_SCHOOL_ROLES.TEACHER]?.id || "role-lpmm-teacher",
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.memberships.set(teacherMemRodrigo.id, teacherMemRodrigo);

  const teacherMem1A = {
    id: "mem-lpmm-profesor-1a",
    userId: "user-lpmm-profesor-1a",
    schoolId: lpmmSchool.id,
    roleId: lpmmRoleMap[DEFAULT_SCHOOL_ROLES.TEACHER]?.id || "role-lpmm-teacher",
    isActive: true,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.memberships.set(teacherMem1A.id, teacherMem1A);

  const teacherProfile = {
    id: "tp-lpmm-1a",
    membershipId: teacherMemRodrigo.id,
    specialty: "Técnico Profesional y Jefatura",
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
  };
  store.teacherProfiles.set(teacherProfile.id, teacherProfile);

  // Vincular profesor a asignaturas de 1° Medio A
  const course1A = lpmmCourses["1° Medio A"];
  for (const subjDef of LPMM_SUBJECTS_DEFINITIONS) {
    const subjId = `subj-lpmm-1a-${subjDef.code.toLowerCase()}`;
    const subj = store.subjects.get(subjId);
    if (subj) {
      subj.teacherProfileId = teacherProfile.id;
    }
  }

function formatStudentEmail(firstName: string, lastName: string, domain = "lpmm.cl"): string {
  const sanitize = (str: string) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/ñ/g, "n")
      .replace(/[^a-z0-9]/g, "");

  const f = sanitize(firstName.trim().split(/\s+/)[0] || "alumno");
  const l = sanitize(lastName.trim().split(/\s+/)[0] || "lpmm");
  return `${f}.${l}@${domain}`;
}

  // Ingesta de los 14 cursos oficiales del LPMM con sus 312 estudiantes reales
  const studentPasswordHash = "$2b$10$XxLv1NgTdH/u00egvwnbGuhukOXft0/lZVjk3GyW4LlZ8yEi8hzbW"; // Bcrypt hash de "Estudiantelpmm2026"

  for (const { grade, letter } of OFFICIAL_LPMM_COURSES) {
    const courseName = `${grade}° Medio ${letter}`;
    const course = lpmmCourses[courseName];
    if (!course) continue;

    const courseKey = `${grade}${letter.toLowerCase()}`;

    // Crear profesor jefe de este curso
    const teacherCourseUser = {
      id: `user-lpmm-profesor-${courseKey}`,
      email: `profesor.${courseKey}@lpmm.cl`,
      firstName: `Profesor ${grade}°${letter}`,
      lastName: `LPMM`,
      passwordHash: teacherPasswordHash,
      status: "ACTIVE",
      isSystemAdmin: false,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.users.set(teacherCourseUser.id, teacherCourseUser);

    const teacherCourseMem = {
      id: `mem-lpmm-profesor-${courseKey}`,
      userId: teacherCourseUser.id,
      schoolId: lpmmSchool.id,
      roleId: lpmmRoleMap[DEFAULT_SCHOOL_ROLES.TEACHER]?.id || "role-lpmm-teacher",
      isActive: true,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.memberships.set(teacherCourseMem.id, teacherCourseMem);

    const tpCourse = {
      id: `tp-lpmm-${courseKey}`,
      membershipId: teacherCourseMem.id,
      specialty: `Docente Jefatura ${courseName}`,
      createdAt: new Date("2026-01-01"),
      updatedAt: new Date("2026-01-01"),
    };
    store.teacherProfiles.set(tpCourse.id, tpCourse);

    // Vincular asignaturas de este curso a su profesor
    const courseSubjsForTeacher = LPMM_COURSE_SUBJECTS[courseName] || LPMM_SUBJECTS_DEFINITIONS;
    for (const subjDef of courseSubjsForTeacher) {
      const subjCode = (subjDef.code || subjDef.name).toLowerCase().replace(/[^a-z0-9]/g, "");
      const subjId = `subj-lpmm-${courseKey}-${subjCode}`;
      const subj = store.subjects.get(subjId);
      if (subj) {
        subj.teacherProfileId = tpCourse.id;
      }
    }

    // Ingesta de estudiantes reales desde Google Sheets Oficiales
    const officialCourseStudents = LPMM_OFFICIAL_SHEETS_DATA[courseName];

    if (officialCourseStudents && officialCourseStudents.length > 0) {
      officialCourseStudents.forEach((st) => {
        const userId = (courseKey === "1a" && st.num === 1) ? "user-lpmm-std-1" : `user-lpmm-${courseKey}-std-${st.num}`;
        const memId = (courseKey === "1a" && st.num === 1) ? "mem-lpmm-std-1" : `mem-lpmm-${courseKey}-std-${st.num}`;

        const user = {
          id: userId,
          email: st.email,
          firstName: st.firstName,
          lastName: st.lastName,
          rutOrNationalId: st.rut,
          passwordHash: studentPasswordHash,
          status: "ACTIVE",
          isSystemAdmin: false,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        };
        store.users.set(user.id, user);
        if (userId === "user-lpmm-std-1") {
          store.users.set("user-lpmm-1a-std-1", user);
        }

        const membership = {
          id: memId,
          userId: user.id,
          schoolId: lpmmSchool.id,
          roleId: lpmmRoleMap[DEFAULT_SCHOOL_ROLES.STUDENT]?.id || "role-lpmm-student",
          isActive: true,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        };
        store.memberships.set(membership.id, membership);

        const studentProfile = {
          id: `sp-lpmm-${courseKey}-std-${st.num}`,
          membershipId: membership.id,
          enrollmentNumber: `LPMM-2026-${courseKey.toUpperCase()}-${String(st.num).padStart(3, "0")}`,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        };
        store.studentProfiles.set(studentProfile.id, studentProfile);

        const enrollment = {
          id: `enroll-lpmm-${courseKey}-${st.num}`,
          schoolId: lpmmSchool.id,
          courseId: course.id,
          studentProfileId: studentProfile.id,
          year: currentYear,
          status: "ACTIVE",
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        };
        store.enrollments.set(enrollment.id, enrollment);

        // Calificaciones reales extraídas de las planillas oficiales por asignatura
        const studentRecord = LPMM_STUDENTS_ACADEMIC_RECORDS[st.email];
        if (studentRecord && studentRecord.subjects.length > 0) {
          studentRecord.subjects.forEach((sub) => {
            const subjCode = (sub.code || sub.name).toLowerCase().replace(/[^a-z0-9]/g, "");
            const subjId = `subj-lpmm-${courseKey}-${subjCode}`;
            
            sub.grades.forEach((g, gIdx) => {
              if (g.value === null || g.value === undefined) return;
              const assessId = `assess-lpmm-${courseKey}-${subjCode}-n${gIdx + 1}`;
              if (!store.assessments.has(assessId)) {
                const assess = {
                  id: assessId,
                  schoolId: lpmmSchool.id,
                  subjectId: subjId,
                  academicPeriodId: lpmmPeriod.id,
                  title: `${g.label || `Evaluación N°${gIdx + 1}`} (${sub.code})`,
                  date: new Date("2026-05-15"),
                  weight: (g.weightPct || 25) / 100,
                  maxScore: 7.0,
                  createdAt: new Date("2026-01-01"),
                  updatedAt: new Date("2026-01-01"),
                };
                store.assessments.set(assess.id, assess);
              }

              const gradeId = `grade-lpmm-${courseKey}-${st.num}-${subjCode}-n${gIdx + 1}`;
              const gradeRec = {
                id: gradeId,
                schoolId: lpmmSchool.id,
                enrollmentId: enrollment.id,
                assessmentId: assessId,
                score: g.value,
                isPublished: true,
                createdAt: new Date("2026-01-01"),
                updatedAt: new Date("2026-01-01"),
              };
              store.grades.set(gradeRec.id, gradeRec);
            });
          });
        }

        // Asistencia Real
        const attRec = {
          id: `att-lpmm-${courseKey}-${st.num}`,
          schoolId: lpmmSchool.id,
          courseId: course.id,
          studentProfileId: studentProfile.id,
          date: new Date("2026-09-30"),
          status: "PRESENT",
          justification: null,
          percentageReal: 88.5,
          createdAt: new Date("2026-01-01"),
          updatedAt: new Date("2026-01-01"),
        };
        store.attendanceRecords.set(attRec.id, attRec);
      });
    }
  }
}
