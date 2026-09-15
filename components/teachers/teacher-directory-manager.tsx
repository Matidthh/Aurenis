"use client";

import React, { useState } from "react";
import {
  TeacherManagementMockup,
  TeacherData,
  MOCK_TEACHERS,
} from "./teacher-management-mockup";
import { SubjectAssignmentModal } from "./subject-assignment-modal";
import { TeacherEditProfileModal } from "./teacher-edit-profile-modal";
import { NewTeacherModal } from "./new-teacher-modal";

interface TeacherDirectoryManagerProps {
  initialTeachers?: any[];
}

export function TeacherDirectoryManager({ initialTeachers }: TeacherDirectoryManagerProps) {
  const [selectedTeacherForEdit, setSelectedTeacherForEdit] = useState<TeacherData | null>(null);
  const [selectedTeacherForSubjects, setSelectedTeacherForSubjects] = useState<TeacherData | null>(null);
  const [isNewTeacherOpen, setIsNewTeacherOpen] = useState(false);

  return (
    <div className="space-y-6">
      <TeacherManagementMockup
        onSelectTeacherForEdit={(t) => setSelectedTeacherForEdit(t)}
        onOpenSubjectAssignment={(t) => setSelectedTeacherForSubjects(t)}
        onOpenNewTeacherModal={() => setIsNewTeacherOpen(true)}
      />

      <SubjectAssignmentModal
        isOpen={!!selectedTeacherForSubjects}
        onClose={() => setSelectedTeacherForSubjects(null)}
        teacher={selectedTeacherForSubjects}
      />

      <TeacherEditProfileModal
        isOpen={!!selectedTeacherForEdit}
        onClose={() => setSelectedTeacherForEdit(null)}
        teacher={selectedTeacherForEdit}
      />

      <NewTeacherModal
        isOpen={isNewTeacherOpen}
        onClose={() => setIsNewTeacherOpen(false)}
        onSuccess={(data) => {
          alert(`Docente ${data.name} incorporado con éxito al plantel.`);
        }}
      />
    </div>
  );
}
