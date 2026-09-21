"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TablePagination, TableEmptyState } from "@/components/ui/table";
import { TableRowSkeleton, Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Filter,
  UserCheck,
  UserX,
  Eye,
  Edit3,
  MoreVertical,
  IdCard,
  Phone,
  Trash2,
  FileSpreadsheet,
  CheckCircle2,
} from "lucide-react";
import { CreateStudentModal } from "./create-student-modal";
import { StudentProfileModal, StudentProfileData } from "./student-profile-modal";
import { EditStudentModal } from "./edit-student-modal";

interface RawEnrollment {
  id: string;
  schoolId: string;
  studentProfileId: string;
  courseId: string;
  year: number;
  status: string;
  course: {
    id: string;
    name: string;
    gradeNumber: number;
    letter?: string | null;
    educationLevel: {
      name: string;
    };
  };
  student: {
    id: string;
    enrollmentNumber?: string | null;
    birthDate?: Date | string | null;
    medicalNotes?: string | null;
    membership: {
      user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        rutOrNationalId?: string | null;
        phone?: string | null;
        avatarUrl?: string | null;
        status: string;
      };
    };
    guardians: Array<{
      id: string;
      relationship: string;
      isEmergencyContact: boolean;
      canPickUp: boolean;
      guardian: {
        occupation?: string | null;
        membership: {
          user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phone?: string | null;
          };
        };
      };
    }>;
    attendances?: Array<{
      id: string;
      date: Date | string;
      status: string;
      justification?: string | null;
    }>;
    enrollments?: Array<{
      course: { name: string };
      grades: Array<{
        id: string;
        value: any;
        assessment: { title: string; subjectId: string };
      }>;
    }>;
  };
}

interface CourseOption {
  id: string;
  name: string;
}

interface StudentListViewProps {
  schoolSlug: string;
  enrollments: RawEnrollment[];
  courses: CourseOption[];
  isLoading?: boolean;
}

export function StudentListView({
  schoolSlug,
  enrollments,
  courses,
  isLoading = false,
}: StudentListViewProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedStudentForView, setSelectedStudentForView] = useState<StudentProfileData | null>(null);
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<StudentProfileData | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // Resetear a la página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCourse, selectedStatus]);

  // Transformar enrollment a StudentProfileData
  const formatStudentData = (enrollment: RawEnrollment): StudentProfileData => {
    const user = enrollment.student.membership.user;
    const guardians = enrollment.student.guardians.map((g) => ({
      id: g.id,
      relationship: g.relationship,
      isEmergencyContact: g.isEmergencyContact,
      canPickUp: g.canPickUp,
      name: `${g.guardian.membership.user.firstName} ${g.guardian.membership.user.lastName}`,
      email: g.guardian.membership.user.email,
      phone: g.guardian.membership.user.phone,
      occupation: g.guardian.occupation,
    }));

    return {
      enrollmentId: enrollment.id,
      studentProfileId: enrollment.student.id,
      courseId: enrollment.courseId,
      courseName: enrollment.course.name,
      educationLevelName: enrollment.course.educationLevel.name,
      enrollmentNumber: enrollment.student.enrollmentNumber,
      status: enrollment.status,
      year: enrollment.year,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        rutOrNationalId: user.rutOrNationalId,
        phone: user.phone,
        avatarUrl: user.avatarUrl,
      },
      birthDate: enrollment.student.birthDate ? String(enrollment.student.birthDate) : null,
      medicalNotes: enrollment.student.medicalNotes,
      guardians,
      attendances: enrollment.student.attendances?.map((a) => ({
        id: a.id,
        date: a.date,
        status: a.status,
        justification: a.justification,
      })),
      grades: [],
    };
  };

  const filteredStudents = useMemo(() => {
    return enrollments.filter((item) => {
      const user = item.student.membership.user;
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();
      const rut = (user.rutOrNationalId || "").toLowerCase();
      const matNumber = (item.student.enrollmentNumber || "").toLowerCase();
      const term = searchTerm.toLowerCase();

      const matchesSearch =
        fullName.includes(term) ||
        email.includes(term) ||
        rut.includes(term) ||
        matNumber.includes(term);

      const matchesCourse =
        selectedCourse === "ALL" || item.courseId === selectedCourse;

      const matchesStatus =
        selectedStatus === "ALL" || item.status === selectedStatus;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [enrollments, searchTerm, selectedCourse, selectedStatus]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

  const handleDeleteEnrollment = async (studentProfileId: string) => {
    if (!confirm("¿Estás seguro de dar de baja la matrícula de este estudiante?")) return;
    setIsDeleting(studentProfileId);
    try {
      const res = await fetch(`/api/schools/${schoolSlug}/students/${studentProfileId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        const d = await res.json();
        alert(d.error || "No se pudo dar de baja la matrícula");
      }
    } catch {
      alert("Error al comunicarse con el servidor");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Barra superior de herramientas y filtros */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="student-search-input"
              type="text"
              placeholder="Buscar por nombre, RUN, correo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-sm rounded-xl pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
            <select
              id="filter-course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl py-2 px-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">Todos los Cursos</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              id="filter-status-select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full sm:w-auto text-xs font-semibold rounded-xl py-2 px-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="ACTIVE">Matrícula Activa</option>
              <option value="SUSPENDED">Suspendidos</option>
              <option value="INACTIVE">Inactivos / Retirados</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CreateStudentModal schoolSlug={schoolSlug} courses={courses} />
        </div>
      </div>

      {/* Indicador de Conteo */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Mostrando <strong className="text-slate-900 dark:text-white">{filteredStudents.length}</strong> de{" "}
          <strong className="text-slate-900 dark:text-white">{enrollments.length}</strong> estudiantes
        </span>
        {(searchTerm || selectedCourse !== "ALL" || selectedStatus !== "ALL") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCourse("ALL");
              setSelectedStatus("ALL");
            }}
            className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla Interactiva de Estudiantes */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-850/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Estudiante</th>
                <th className="px-6 py-4">Identificación (RUN)</th>
                <th className="px-6 py-4">Curso Asignado</th>
                <th className="px-6 py-4">Apoderado Titular</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading
                ? Array.from({ length: itemsPerPage || 8 }).map((_, idx) => (
                    <TableRowSkeleton key={idx} columns={6} />
                  ))
                : paginatedStudents.map((enrollment) => {
                    const user = enrollment.student.membership.user;
                    const guardianContact = enrollment.student.guardians[0]?.guardian.membership.user;
                    const guardianRel = enrollment.student.guardians[0]?.relationship || "Apoderado";
                    const studentProfileData = formatStudentData(enrollment);

                    return (
                      <tr
                    key={enrollment.id}
                    id={`student-row-${enrollment.id}`}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                    onClick={() => setSelectedStudentForView(studentProfileData)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-brand-600 dark:text-brand-400 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200 dark:border-slate-700">
                          {user.firstName[0]}{user.lastName[0]}
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-brand-600 transition">
                            {user.lastName}, {user.firstName}
                          </div>
                          <div className="text-xs text-slate-400 truncate">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-xs text-slate-600 dark:text-slate-400">
                      {user.rutOrNationalId || (
                        <span className="text-slate-400 italic">No registrado</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900 dark:text-white">
                        {enrollment.course.name}
                      </span>
                      <div className="text-[11px] text-slate-400">
                        {enrollment.course.educationLevel.name}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                      {guardianContact ? (
                        <div>
                          <div className="font-medium text-slate-900 dark:text-white">
                            {guardianContact.firstName} {guardianContact.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span className="text-brand-600 dark:text-brand-400">{guardianRel}</span>
                            <span>•</span>
                            <span>{guardianContact.phone || guardianContact.email}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Sin tutor asignado</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <Badge variant={enrollment.status === "ACTIVE" ? "success" : "neutral"}>
                        {enrollment.status === "ACTIVE" ? "Activo" : enrollment.status}
                      </Badge>
                    </td>

                    <td
                      className="px-6 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          id={`btn-view-student-${enrollment.id}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStudentForView(studentProfileData)}
                          className="text-slate-500 hover:text-brand-600 dark:hover:text-brand-400"
                          title="Ver Ficha Detallada"
                        >
                          <Eye className="w-4 h-4" />
                          <span className="hidden lg:inline text-xs ml-1">Ficha</span>
                        </Button>

                        <Button
                          id={`btn-edit-student-${enrollment.id}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStudentForEdit(studentProfileData)}
                          className="text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                          title="Editar Ficha"
                        >
                          <Edit3 className="w-4 h-4" />
                          <span className="hidden lg:inline text-xs ml-1">Editar</span>
                        </Button>

                        <Button
                          id={`btn-delete-student-${enrollment.id}`}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEnrollment(enrollment.student.id)}
                          disabled={isDeleting === enrollment.student.id}
                          className="text-slate-400 hover:text-red-600 dark:hover:text-red-400"
                          title="Dar de baja matrícula"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && !isLoading && (
                <TableEmptyState
                  colSpan={6}
                  title="No se encontraron estudiantes"
                  description="No hay estudiantes matriculados que coincidan con los criterios de búsqueda o filtros seleccionados."
                  searchTerm={searchTerm}
                  activeFilterCount={
                    (searchTerm ? 1 : 0) +
                    (selectedCourse !== "ALL" ? 1 : 0) +
                    (selectedStatus !== "ALL" ? 1 : 0)
                  }
                  onClearFilters={
                    searchTerm || selectedCourse !== "ALL" || selectedStatus !== "ALL"
                      ? () => {
                          setSearchTerm("");
                          setSelectedCourse("ALL");
                          setSelectedStatus("ALL");
                        }
                      : undefined
                  }
                  clearButtonText="Limpiar filtros"
                />
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredStudents.length}
          itemsPerPage={itemsPerPage}
          pageSizeOptions={[10, 25, 50]}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(newSize) => {
            setItemsPerPage(newSize);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Modal Ficha Detallada */}
      <StudentProfileModal
        isOpen={Boolean(selectedStudentForView)}
        onClose={() => setSelectedStudentForView(null)}
        student={selectedStudentForView}
        onEdit={(student) => {
          setSelectedStudentForView(null);
          setSelectedStudentForEdit(student);
        }}
      />

      {/* Modal Edición de Ficha */}
      {selectedStudentForEdit && (
        <EditStudentModal
          isOpen={Boolean(selectedStudentForEdit)}
          onClose={() => setSelectedStudentForEdit(null)}
          schoolSlug={schoolSlug}
          courses={courses}
          studentData={{
            studentProfileId: selectedStudentForEdit.studentProfileId,
            firstName: selectedStudentForEdit.user.firstName,
            lastName: selectedStudentForEdit.user.lastName,
            email: selectedStudentForEdit.user.email,
            rutOrNationalId: selectedStudentForEdit.user.rutOrNationalId,
            phone: selectedStudentForEdit.user.phone,
            birthDate: selectedStudentForEdit.birthDate,
            medicalNotes: selectedStudentForEdit.medicalNotes,
            enrollmentNumber: selectedStudentForEdit.enrollmentNumber,
            courseId: selectedStudentForEdit.courseId,
            status: selectedStudentForEdit.status,
            guardian: selectedStudentForEdit.guardians[0] ? {
              firstName: selectedStudentForEdit.guardians[0].name.split(" ")[0],
              lastName: selectedStudentForEdit.guardians[0].name.split(" ").slice(1).join(" "),
              email: selectedStudentForEdit.guardians[0].email,
              phone: selectedStudentForEdit.guardians[0].phone || undefined,
              relationship: selectedStudentForEdit.guardians[0].relationship,
            } : null,
          }}
          onSuccess={() => {
            setSelectedStudentForEdit(null);
          }}
        />
      )}
    </div>
  );
}
