/**
 * AURENIS — SERVICIO DE DASHBOARD DEL ESTUDIANTE
 * Responsables:
 * - 👑 Maicol R. (Arquitectura, Backend, Aislamiento de Tenant & Sesión)
 * - 💻 Malcom Marcelo (Contratos de Datos para Frontend React)
 * - 🛡️ Frank M. (Seguridad, Prevención de BOLA/IDOR & Decreto 67)
 */

import {
  getStudentAcademicRecord,
  StudentAcademicRecord,
  LPMM_COURSE_SUBJECTS,
  LPMM_STUDENTS_ACADEMIC_RECORDS,
} from "@/lib/db/lpmm-curriculum-and-grades";

export interface StudentDashboardData {
  student: {
    num: number;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    rut: string;
    courseName: string;
    courseCode: string;
    grade: number;
    letter: string;
    specialty: string;
    overallGpa: number;
    overallAttendance: number;
  };
  subjects: StudentAcademicRecord["subjects"];
  schedule: {
    id: string;
    timeRange: string;
    subject: string;
    teacher: string;
    room: string;
    isCurrent: boolean;
    isPast: boolean;
  }[];
  summary: {
    gpa: number;
    attendanceRate: number;
    totalPassed: number;
    totalAtRisk: number;
    totalSubjects: number;
  };
}

export function getStudentDashboardData(identifier?: string): StudentDashboardData {
  const record = getStudentAcademicRecord(identifier || "yamir.ahumada@lpmm.cl") ||
    getStudentAcademicRecord("yamir.ahumada@lpmm.cl")!;

  const subjects = record.subjects;
  const totalPassed = subjects.filter((s) => s.currentAvg >= 4.0).length;
  const totalAtRisk = subjects.filter((s) => s.currentAvg < 4.0).length;

  // Build daily schedule tailored to student's course subjects
  const sampleSubjects = subjects.slice(0, 5);
  const timeSlots = [
    "08:00 - 09:30",
    "09:45 - 11:15",
    "11:30 - 13:00",
    "13:45 - 15:15",
    "15:30 - 17:00",
  ];

  const schedule = timeSlots.map((slot, idx) => {
    const sub = sampleSubjects[idx] || subjects[0];
    return {
      id: `block-${idx + 1}`,
      timeRange: slot,
      subject: sub.name,
      teacher: sub.teacher,
      room: sub.room,
      isCurrent: idx === 1,
      isPast: idx === 0,
    };
  });

  return {
    student: {
      num: record.num,
      fullName: record.fullName,
      firstName: record.firstName,
      lastName: record.lastName,
      email: record.email,
      rut: record.rut,
      courseName: record.courseName,
      courseCode: record.courseCode,
      grade: record.grade,
      letter: record.letter,
      specialty: record.specialty,
      overallGpa: record.overallGpa,
      overallAttendance: record.overallAttendance,
    },
    subjects,
    schedule,
    summary: {
      gpa: record.overallGpa,
      attendanceRate: record.overallAttendance,
      totalPassed,
      totalAtRisk,
      totalSubjects: subjects.length,
    },
  };
}

export function listAvailableDemoStudents(): {
  email: string;
  name: string;
  course: string;
  specialty: string;
}[] {
  const sampledKeys = [
    "yamir.ahumada@lpmm.cl", // 1° Medio A
    "gianella.ahumada@lpmm.cl", // 1° Medio A
    "carmen.baleizan@lpmm.cl", // 3° Medio A (Párvulos)
    "nallely.caicea@lpmm.cl", // 3° Medio C (Enfermería)
    "priscila.abarca@lpmm.cl", // 4° Medio E (Programación)
  ];

  return sampledKeys.map((email) => {
    const rec = getStudentAcademicRecord(email);
    return {
      email,
      name: rec?.fullName || email,
      course: rec?.courseName || "LPMM",
      specialty: rec?.specialty || "Plan Común",
    };
  });
}
