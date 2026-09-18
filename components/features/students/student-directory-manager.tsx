"use client";

import React, { useState } from "react";
import { StudentTableMockup, StudentMockupData, MOCK_STUDENTS } from "./student-table-mockup";
import { StudentFullProfileModal } from "./student-full-profile-modal";
import { StudentRegistrationModal } from "./student-registration-modal";

interface StudentDirectoryManagerProps {
  initialStudents?: any[];
}

export function StudentDirectoryManager({ initialStudents }: StudentDirectoryManagerProps) {
  const [selectedStudent, setSelectedStudent] = useState<StudentMockupData | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

  function handleOpenProfile(student: StudentMockupData) {
    setSelectedStudent(student);
    setIsProfileOpen(true);
  }

  return (
    <div className="space-y-6">
      <StudentTableMockup
        onSelectStudent={handleOpenProfile}
        onOpenNewStudentModal={() => setIsRegistrationOpen(true)}
      />

      <StudentFullProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        student={selectedStudent}
      />

      <StudentRegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onSuccess={(data) => {
          alert(`Estudiante ${data.firstName} ${data.lastName} matriculado exitosamente.`);
        }}
      />
    </div>
  );
}
