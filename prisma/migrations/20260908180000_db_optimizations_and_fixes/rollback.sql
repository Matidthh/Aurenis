-- =============================================================
-- ROLLBACK SCRIPT FOR MIGRATION: 20260908180000_db_optimizations_and_fixes
-- Description: Reverts multi-tenant profile schoolId relations, decimal precision changes, and soft-delete partial unique indexes
-- Target Environment: Staging / Production / Testing
-- =============================================================

-- 1. Revert Partial Unique Indexes to Standard Unique Indexes
-- 1.1 Enrollment
DROP INDEX IF EXISTS "Enrollment_schoolId_courseId_studentProfileId_year_key";
CREATE UNIQUE INDEX "Enrollment_schoolId_courseId_studentProfileId_year_key" ON "Enrollment"("schoolId", "courseId", "studentProfileId", "year");

-- 1.2 School institutionalCode
DROP INDEX IF EXISTS "School_institutionalCode_key";
CREATE UNIQUE INDEX "School_institutionalCode_key" ON "School"("institutionalCode");

-- 1.3 School slug
DROP INDEX IF EXISTS "School_slug_key";
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug");

-- 1.4 User rutOrNationalId
DROP INDEX IF EXISTS "User_rutOrNationalId_key";
CREATE UNIQUE INDEX "User_rutOrNationalId_key" ON "User"("rutOrNationalId");

-- 1.5 User email
DROP INDEX IF EXISTS "User_email_key";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- 2. Revert Grade value data type
ALTER TABLE "Grade" ALTER COLUMN "value" SET DATA TYPE DOUBLE PRECISION;

-- 3. Revert GuardianProfile schoolId
ALTER TABLE "GuardianProfile" DROP CONSTRAINT IF EXISTS "GuardianProfile_schoolId_fkey";
DROP INDEX IF EXISTS "GuardianProfile_schoolId_idx";
ALTER TABLE "GuardianProfile" DROP COLUMN IF EXISTS "schoolId";

-- 4. Revert StudentProfile schoolId
ALTER TABLE "StudentProfile" DROP CONSTRAINT IF EXISTS "StudentProfile_schoolId_fkey";
DROP INDEX IF EXISTS "StudentProfile_schoolId_idx";
ALTER TABLE "StudentProfile" DROP COLUMN IF EXISTS "schoolId";

-- 5. Revert TeacherProfile schoolId
ALTER TABLE "TeacherProfile" DROP CONSTRAINT IF EXISTS "TeacherProfile_schoolId_fkey";
DROP INDEX IF EXISTS "TeacherProfile_schoolId_idx";
ALTER TABLE "TeacherProfile" DROP COLUMN IF EXISTS "schoolId";

-- 6. Revert SchoolSettings grade columns data type
ALTER TABLE "SchoolSettings" ALTER COLUMN "minPassingGrade" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "minGrade" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "maxGrade" SET DATA TYPE DOUBLE PRECISION;
