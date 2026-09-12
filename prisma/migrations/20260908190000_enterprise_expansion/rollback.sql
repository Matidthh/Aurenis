-- =============================================================
-- ROLLBACK SCRIPT FOR MIGRATION: 20260908190000_enterprise_expansion
-- Description: Reverts enterprise modules (Classrooms, Assignments, Payments, Webhooks, Partitioning, Archival, Notifications, Meetings)
-- Target Environment: Staging / Production / Testing
-- =============================================================

-- 1. Drop Tables added in enterprise expansion (in reverse dependency order)
DROP TABLE IF EXISTS "PerformanceMetric" CASCADE;
DROP TABLE IF EXISTS "ReplicaLagMetrics" CASCADE;
DROP TABLE IF EXISTS "PartitionMetadata" CASCADE;
DROP TABLE IF EXISTS "WebhookDelivery" CASCADE;
DROP TABLE IF EXISTS "Webhook" CASCADE;
DROP TABLE IF EXISTS "ArchivedRecord" CASCADE;
DROP TABLE IF EXISTS "PaymentRecord" CASCADE;
DROP TABLE IF EXISTS "StudentPaymentAccount" CASCADE;
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "AnnouncementRecipient" CASCADE;
DROP TABLE IF EXISTS "ParentTeacherMeeting" CASCADE;
DROP TABLE IF EXISTS "AssignmentSubmission" CASCADE;
DROP TABLE IF EXISTS "Assignment" CASCADE;
DROP TABLE IF EXISTS "StudentAttendanceSummary" CASCADE;
DROP TABLE IF EXISTS "AttendanceJustification" CASCADE;
DROP TABLE IF EXISTS "GradeAuditLog" CASCADE;
DROP TABLE IF EXISTS "SubjectTeacher" CASCADE;
DROP TABLE IF EXISTS "Classroom" CASCADE;

-- 2. Remove added columns from existing tables
-- 2.1 AuditLog
ALTER TABLE "AuditLog" DROP COLUMN IF EXISTS "deletedAt";
ALTER TABLE "AuditLog" DROP COLUMN IF EXISTS "version";

-- 2.2 AttendanceRecord
ALTER TABLE "AttendanceRecord" DROP COLUMN IF EXISTS "deletedAt";
ALTER TABLE "AttendanceRecord" DROP COLUMN IF EXISTS "version";

-- 2.3 Grade
ALTER TABLE "Grade" DROP COLUMN IF EXISTS "letterGrade";
ALTER TABLE "Grade" DROP COLUMN IF EXISTS "isExempt";
ALTER TABLE "Grade" DROP COLUMN IF EXISTS "deletedAt";
ALTER TABLE "Grade" DROP COLUMN IF EXISTS "version";

-- 2.4 Assessment
ALTER TABLE "Assessment" DROP COLUMN IF EXISTS "type";
ALTER TABLE "Assessment" DROP COLUMN IF EXISTS "maxScore";
ALTER TABLE "Assessment" DROP COLUMN IF EXISTS "deletedAt";
ALTER TABLE "Assessment" DROP COLUMN IF EXISTS "version";

-- 2.5 Subject
ALTER TABLE "Subject" DROP COLUMN IF EXISTS "department";
ALTER TABLE "Subject" DROP COLUMN IF EXISTS "isElective";
ALTER TABLE "Subject" DROP COLUMN IF EXISTS "deletedAt";
ALTER TABLE "Subject" DROP COLUMN IF EXISTS "version";

-- 2.6 Course
ALTER TABLE "Course" DROP CONSTRAINT IF EXISTS "Course_classroomId_fkey";
ALTER TABLE "Course" DROP COLUMN IF EXISTS "classroomId";
ALTER TABLE "Course" DROP COLUMN IF EXISTS "deletedAt";
ALTER TABLE "Course" DROP COLUMN IF EXISTS "version";

-- 2.7 Enrollment
ALTER TABLE "Enrollment" DROP COLUMN IF EXISTS "deletedAt";
ALTER TABLE "Enrollment" DROP COLUMN IF EXISTS "version";

-- 2.8 School
ALTER TABLE "School" DROP COLUMN IF EXISTS "deletedAt";
ALTER TABLE "School" DROP COLUMN IF EXISTS "version";

-- 2.9 User
ALTER TABLE "User" DROP COLUMN IF EXISTS "deletedAt";
ALTER TABLE "User" DROP COLUMN IF EXISTS "version";

-- 3. Drop Enums introduced in enterprise expansion
DROP TYPE IF EXISTS "TeacherRoleType" CASCADE;
DROP TYPE IF EXISTS "PaymentMethod" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;
DROP TYPE IF EXISTS "SubmissionStatus" CASCADE;
DROP TYPE IF EXISTS "MeetingStatus" CASCADE;
DROP TYPE IF EXISTS "NotificationChannel" CASCADE;
DROP TYPE IF EXISTS "NotificationType" CASCADE;
DROP TYPE IF EXISTS "AssessmentType" CASCADE;
