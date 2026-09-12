-- =============================================================
-- ROLLBACK SCRIPT FOR MIGRATION: 20260907141816_init
-- Description: Reverts the initial database schema (drops all tables & enums)
-- Target Environment: Development / Test / Clean Slate
-- WARNING: This is a DESTRUCTIVE operation that drops all core schema objects.
-- =============================================================

-- 1. Drop Foreign Key Constraints & Tables in reverse dependency order
DROP TABLE IF EXISTS "AuditLog" CASCADE;
DROP TABLE IF EXISTS "Observation" CASCADE;
DROP TABLE IF EXISTS "Announcement" CASCADE;
DROP TABLE IF EXISTS "Grade" CASCADE;
DROP TABLE IF EXISTS "Assessment" CASCADE;
DROP TABLE IF EXISTS "AttendanceRecord" CASCADE;
DROP TABLE IF EXISTS "Enrollment" CASCADE;
DROP TABLE IF EXISTS "Subject" CASCADE;
DROP TABLE IF EXISTS "Course" CASCADE;
DROP TABLE IF EXISTS "AcademicPeriod" CASCADE;
DROP TABLE IF EXISTS "AcademicYear" CASCADE;
DROP TABLE IF EXISTS "GuardianStudent" CASCADE;
DROP TABLE IF EXISTS "GuardianProfile" CASCADE;
DROP TABLE IF EXISTS "StudentProfile" CASCADE;
DROP TABLE IF EXISTS "TeacherProfile" CASCADE;
DROP TABLE IF EXISTS "MembershipRole" CASCADE;
DROP TABLE IF EXISTS "SchoolMembership" CASCADE;
DROP TABLE IF EXISTS "RolePermission" CASCADE;
DROP TABLE IF EXISTS "Role" CASCADE;
DROP TABLE IF EXISTS "Permission" CASCADE;
DROP TABLE IF EXISTS "SchoolSettings" CASCADE;
DROP TABLE IF EXISTS "School" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- 2. Drop Enums
DROP TYPE IF EXISTS "AnnouncementAudience" CASCADE;
DROP TYPE IF EXISTS "ObservationType" CASCADE;
DROP TYPE IF EXISTS "AuditAction" CASCADE;
DROP TYPE IF EXISTS "AcademicTermType" CASCADE;
DROP TYPE IF EXISTS "AttendanceStatus" CASCADE;
DROP TYPE IF EXISTS "SchoolStatus" CASCADE;
DROP TYPE IF EXISTS "UserStatus" CASCADE;
