-- CreateEnum
CREATE TYPE "AssessmentType" AS ENUM ('SUMMATIVE', 'FORMATIVE', 'DIAGNOSTIC', 'HOMEWORK', 'EXAM');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('GRADE_POSTED', 'ATTENDANCE_ALERT', 'ANNOUNCEMENT', 'DIRECT_MESSAGE', 'OBSERVATION', 'ASSIGNMENT_DUE', 'PARENT_MEETING', 'SYSTEM');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "MeetingStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'GRADED', 'LATE', 'RETURNED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'OVERDUE', 'WAIVED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'DEBIT_CARD', 'ONLINE_GATEWAY');

-- CreateEnum
CREATE TYPE "TeacherRoleType" AS ENUM ('HEAD_TEACHER', 'ASSISTANT', 'SPECIAL_ED_PIE', 'REPLACEMENT');

-- CreateTable Classroom
CREATE TABLE IF NOT EXISTS "Classroom" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "building" TEXT,
    "floor" INTEGER NOT NULL DEFAULT 1,
    "capacity" INTEGER NOT NULL DEFAULT 35,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("id")
);

-- AlterTable Course
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "classroomId" TEXT;
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "Course" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable Subject
ALTER TABLE "Subject" ADD COLUMN IF NOT EXISTS "department" TEXT;
ALTER TABLE "Subject" ADD COLUMN IF NOT EXISTS "isElective" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Subject" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "Subject" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable SubjectTeacher
CREATE TABLE IF NOT EXISTS "SubjectTeacher" (
    "id" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "roleType" "TeacherRoleType" NOT NULL DEFAULT 'HEAD_TEACHER',
    "isPrimary" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubjectTeacher_pkey" PRIMARY KEY ("id")
);

-- AlterTable Assessment
ALTER TABLE "Assessment" ADD COLUMN IF NOT EXISTS "type" "AssessmentType" NOT NULL DEFAULT 'SUMMATIVE';
ALTER TABLE "Assessment" ADD COLUMN IF NOT EXISTS "maxScore" DECIMAL(5,2) NOT NULL DEFAULT 7.0;
ALTER TABLE "Assessment" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "Assessment" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable Grade
ALTER TABLE "Grade" ADD COLUMN IF NOT EXISTS "letterGrade" TEXT;
ALTER TABLE "Grade" ADD COLUMN IF NOT EXISTS "isExempt" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Grade" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "Grade" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable GradeAuditLog
CREATE TABLE IF NOT EXISTS "GradeAuditLog" (
    "id" TEXT NOT NULL,
    "gradeId" TEXT NOT NULL,
    "previousValue" DECIMAL(5,2),
    "newValue" DECIMAL(5,2) NOT NULL,
    "modifiedByMembershipId" TEXT,
    "reason" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GradeAuditLog_pkey" PRIMARY KEY ("id")
);

-- AlterTable AttendanceRecord
ALTER TABLE "AttendanceRecord" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "AttendanceRecord" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable AttendanceJustification
CREATE TABLE IF NOT EXISTS "AttendanceJustification" (
    "id" TEXT NOT NULL,
    "attendanceRecordId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "medicalCertificateUrl" TEXT,
    "documentFileId" TEXT,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "reviewNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttendanceJustification_pkey" PRIMARY KEY ("id")
);

-- AlterTable ScheduleBlock
ALTER TABLE "ScheduleBlock" ADD COLUMN IF NOT EXISTS "classroomId" TEXT;
ALTER TABLE "ScheduleBlock" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "ScheduleBlock" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable Assignment
CREATE TABLE IF NOT EXISTS "Assignment" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "maxScore" DECIMAL(5,2) NOT NULL DEFAULT 7.0,
    "attachmentUrl" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable AssignmentSubmission
CREATE TABLE IF NOT EXISTS "AssignmentSubmission" (
    "id" TEXT NOT NULL,
    "assignmentId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'SUBMITTED',
    "submissionText" TEXT,
    "attachmentUrl" TEXT,
    "score" DECIMAL(5,2),
    "feedback" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gradedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssignmentSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable LearningMaterial
CREATE TABLE IF NOT EXISTS "LearningMaterial" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningMaterial_pkey" PRIMARY KEY ("id")
);

-- CreateTable Conversation
CREATE TABLE IF NOT EXISTS "Conversation" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "title" TEXT,
    "isGroup" BOOLEAN NOT NULL DEFAULT false,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable ConversationParticipant
CREATE TABLE IF NOT EXISTS "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lastReadAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable DirectMessage
CREATE TABLE IF NOT EXISTS "DirectMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "attachmentUrl" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DirectMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable Notification
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "recipientUserId" TEXT NOT NULL,
    "senderUserId" TEXT,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "actionUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable ParentMeetingSlot
CREATE TABLE IF NOT EXISTS "ParentMeetingSlot" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "teacherProfileId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "location" TEXT,
    "status" "MeetingStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentMeetingSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable ParentMeetingBooking
CREATE TABLE IF NOT EXISTS "ParentMeetingBooking" (
    "id" TEXT NOT NULL,
    "slotId" TEXT NOT NULL,
    "guardianProfileId" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ParentMeetingBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable FeeStructure
CREATE TABLE IF NOT EXISTS "FeeStructure" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "educationLevelId" TEXT,
    "year" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeeStructure_pkey" PRIMARY KEY ("id")
);

-- CreateTable StudentFeeAccount
CREATE TABLE IF NOT EXISTS "StudentFeeAccount" (
    "id" TEXT NOT NULL,
    "schoolId" TEXT NOT NULL,
    "enrollmentId" TEXT NOT NULL,
    "feeStructureId" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "discountAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    "finalAmount" DECIMAL(10,2) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentFeeAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable FeePayment
CREATE TABLE IF NOT EXISTS "FeePayment" (
    "id" TEXT NOT NULL,
    "studentFeeAccountId" TEXT NOT NULL,
    "amountPaid" DECIMAL(10,2) NOT NULL,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'BANK_TRANSFER',
    "receiptNumber" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "transactionReference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeePayment_pkey" PRIMARY KEY ("id")
);

-- AlterTable StudentObservation
ALTER TABLE "StudentObservation" ADD COLUMN IF NOT EXISTS "severity" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "StudentObservation" ADD COLUMN IF NOT EXISTS "followUpRequired" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "StudentObservation" ADD COLUMN IF NOT EXISTS "guardianSignedAt" TIMESTAMP(3);
ALTER TABLE "StudentObservation" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "StudentObservation" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;

-- AlterTable InstitutionAnnouncement
ALTER TABLE "InstitutionAnnouncement" ADD COLUMN IF NOT EXISTS "deletedAt" TIMESTAMP(3);
ALTER TABLE "InstitutionAnnouncement" ADD COLUMN IF NOT EXISTS "version" INTEGER NOT NULL DEFAULT 1;

-- Indexes and Constraints
CREATE UNIQUE INDEX IF NOT EXISTS "Classroom_schoolId_name_key" ON "Classroom"("schoolId", "name");
CREATE INDEX IF NOT EXISTS "Classroom_schoolId_idx" ON "Classroom"("schoolId");

CREATE UNIQUE INDEX IF NOT EXISTS "SubjectTeacher_subjectId_teacherProfileId_key" ON "SubjectTeacher"("subjectId", "teacherProfileId");
CREATE INDEX IF NOT EXISTS "SubjectTeacher_teacherProfileId_idx" ON "SubjectTeacher"("teacherProfileId");

CREATE INDEX IF NOT EXISTS "GradeAuditLog_gradeId_idx" ON "GradeAuditLog"("gradeId");
CREATE INDEX IF NOT EXISTS "GradeAuditLog_modifiedByMembershipId_idx" ON "GradeAuditLog"("modifiedByMembershipId");
CREATE INDEX IF NOT EXISTS "GradeAuditLog_timestamp_idx" ON "GradeAuditLog"("timestamp");

CREATE UNIQUE INDEX IF NOT EXISTS "AttendanceJustification_attendanceRecordId_key" ON "AttendanceJustification"("attendanceRecordId");
CREATE INDEX IF NOT EXISTS "AttendanceJustification_isApproved_idx" ON "AttendanceJustification"("isApproved");

CREATE INDEX IF NOT EXISTS "Assignment_schoolId_subjectId_idx" ON "Assignment"("schoolId", "subjectId");
CREATE INDEX IF NOT EXISTS "Assignment_dueDate_idx" ON "Assignment"("dueDate");
CREATE INDEX IF NOT EXISTS "Assignment_deletedAt_idx" ON "Assignment"("deletedAt");

CREATE UNIQUE INDEX IF NOT EXISTS "AssignmentSubmission_assignmentId_enrollmentId_key" ON "AssignmentSubmission"("assignmentId", "enrollmentId");
CREATE INDEX IF NOT EXISTS "AssignmentSubmission_enrollmentId_idx" ON "AssignmentSubmission"("enrollmentId");
CREATE INDEX IF NOT EXISTS "AssignmentSubmission_status_idx" ON "AssignmentSubmission"("status");

CREATE INDEX IF NOT EXISTS "LearningMaterial_schoolId_subjectId_idx" ON "LearningMaterial"("schoolId", "subjectId");

CREATE INDEX IF NOT EXISTS "Conversation_schoolId_idx" ON "Conversation"("schoolId");
CREATE INDEX IF NOT EXISTS "Conversation_lastMessageAt_idx" ON "Conversation"("lastMessageAt");

CREATE UNIQUE INDEX IF NOT EXISTS "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");
CREATE INDEX IF NOT EXISTS "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

CREATE INDEX IF NOT EXISTS "DirectMessage_conversationId_createdAt_idx" ON "DirectMessage"("conversationId", "createdAt");
CREATE INDEX IF NOT EXISTS "DirectMessage_senderUserId_idx" ON "DirectMessage"("senderUserId");

CREATE INDEX IF NOT EXISTS "Notification_schoolId_recipientUserId_isRead_idx" ON "Notification"("schoolId", "recipientUserId", "isRead");
CREATE INDEX IF NOT EXISTS "Notification_recipientUserId_createdAt_idx" ON "Notification"("recipientUserId", "createdAt");

CREATE INDEX IF NOT EXISTS "ParentMeetingSlot_schoolId_teacherProfileId_date_idx" ON "ParentMeetingSlot"("schoolId", "teacherProfileId", "date");
CREATE INDEX IF NOT EXISTS "ParentMeetingSlot_status_idx" ON "ParentMeetingSlot"("status");

CREATE UNIQUE INDEX IF NOT EXISTS "ParentMeetingBooking_slotId_key" ON "ParentMeetingBooking"("slotId");
CREATE INDEX IF NOT EXISTS "ParentMeetingBooking_guardianProfileId_idx" ON "ParentMeetingBooking"("guardianProfileId");
CREATE INDEX IF NOT EXISTS "ParentMeetingBooking_studentProfileId_idx" ON "ParentMeetingBooking"("studentProfileId");

CREATE INDEX IF NOT EXISTS "FeeStructure_schoolId_year_idx" ON "FeeStructure"("schoolId", "year");
CREATE INDEX IF NOT EXISTS "FeeStructure_educationLevelId_idx" ON "FeeStructure"("educationLevelId");

CREATE UNIQUE INDEX IF NOT EXISTS "StudentFeeAccount_enrollmentId_feeStructureId_key" ON "StudentFeeAccount"("enrollmentId", "feeStructureId");
CREATE INDEX IF NOT EXISTS "StudentFeeAccount_schoolId_status_idx" ON "StudentFeeAccount"("schoolId", "status");
CREATE INDEX IF NOT EXISTS "StudentFeeAccount_dueDate_idx" ON "StudentFeeAccount"("dueDate");

CREATE UNIQUE INDEX IF NOT EXISTS "FeePayment_receiptNumber_key" ON "FeePayment"("receiptNumber");
CREATE INDEX IF NOT EXISTS "FeePayment_studentFeeAccountId_idx" ON "FeePayment"("studentFeeAccountId");
CREATE INDEX IF NOT EXISTS "FeePayment_paidAt_idx" ON "FeePayment"("paidAt");

-- Foreign Keys
ALTER TABLE "Classroom" ADD CONSTRAINT "Classroom_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Course" ADD CONSTRAINT "Course_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SubjectTeacher" ADD CONSTRAINT "SubjectTeacher_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "TeacherProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GradeAuditLog" ADD CONSTRAINT "GradeAuditLog_gradeId_fkey" FOREIGN KEY ("gradeId") REFERENCES "Grade"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GradeAuditLog" ADD CONSTRAINT "GradeAuditLog_modifiedByMembershipId_fkey" FOREIGN KEY ("modifiedByMembershipId") REFERENCES "Membership"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AttendanceJustification" ADD CONSTRAINT "AttendanceJustification_attendanceRecordId_fkey" FOREIGN KEY ("attendanceRecordId") REFERENCES "AttendanceRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ScheduleBlock" ADD CONSTRAINT "ScheduleBlock_classroomId_fkey" FOREIGN KEY ("classroomId") REFERENCES "Classroom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Assignment" ADD CONSTRAINT "Assignment_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_assignmentId_fkey" FOREIGN KEY ("assignmentId") REFERENCES "Assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AssignmentSubmission" ADD CONSTRAINT "AssignmentSubmission_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningMaterial" ADD CONSTRAINT "LearningMaterial_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "LearningMaterial" ADD CONSTRAINT "LearningMaterial_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DirectMessage" ADD CONSTRAINT "DirectMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ParentMeetingSlot" ADD CONSTRAINT "ParentMeetingSlot_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ParentMeetingSlot" ADD CONSTRAINT "ParentMeetingSlot_teacherProfileId_fkey" FOREIGN KEY ("teacherProfileId") REFERENCES "TeacherProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ParentMeetingBooking" ADD CONSTRAINT "ParentMeetingBooking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "ParentMeetingSlot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ParentMeetingBooking" ADD CONSTRAINT "ParentMeetingBooking_guardianProfileId_fkey" FOREIGN KEY ("guardianProfileId") REFERENCES "GuardianProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ParentMeetingBooking" ADD CONSTRAINT "ParentMeetingBooking_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "StudentProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeeStructure" ADD CONSTRAINT "FeeStructure_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "FeeStructure" ADD CONSTRAINT "FeeStructure_educationLevelId_fkey" FOREIGN KEY ("educationLevelId") REFERENCES "EducationLevel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "StudentFeeAccount" ADD CONSTRAINT "StudentFeeAccount_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentFeeAccount" ADD CONSTRAINT "StudentFeeAccount_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "StudentFeeAccount" ADD CONSTRAINT "StudentFeeAccount_feeStructureId_fkey" FOREIGN KEY ("feeStructureId") REFERENCES "FeeStructure"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "FeePayment" ADD CONSTRAINT "FeePayment_studentFeeAccountId_fkey" FOREIGN KEY ("studentFeeAccountId") REFERENCES "StudentFeeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Full Text Search Function and Trigger on User
CREATE OR REPLACE FUNCTION user_update_searchable_text() RETURNS trigger AS $$
BEGIN
  NEW."searchableText" := COALESCE(NEW."firstName", '') || ' ' ||
                          COALESCE(NEW."lastName", '') || ' ' ||
                          COALESCE(NEW."email", '') || ' ' ||
                          COALESCE(NEW."rutOrNationalId", '');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_searchable_text_trigger ON "User";
CREATE TRIGGER user_searchable_text_trigger
BEFORE INSERT OR UPDATE OF "firstName", "lastName", "email", "rutOrNationalId"
ON "User"
FOR EACH ROW
EXECUTE FUNCTION user_update_searchable_text();
