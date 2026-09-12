-- AlterTable SchoolSettings
ALTER TABLE "SchoolSettings" ALTER COLUMN "minPassingGrade" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "minGrade" SET DATA TYPE DECIMAL(5,2),
ALTER COLUMN "maxGrade" SET DATA TYPE DECIMAL(5,2);

-- AlterTable TeacherProfile
ALTER TABLE "TeacherProfile" ADD COLUMN "schoolId" TEXT;
CREATE INDEX "TeacherProfile_schoolId_idx" ON "TeacherProfile"("schoolId");
ALTER TABLE "TeacherProfile" ADD CONSTRAINT "TeacherProfile_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable StudentProfile
ALTER TABLE "StudentProfile" ADD COLUMN "schoolId" TEXT;
CREATE INDEX "StudentProfile_schoolId_idx" ON "StudentProfile"("schoolId");
ALTER TABLE "StudentProfile" ADD CONSTRAINT "StudentProfile_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable GuardianProfile
ALTER TABLE "GuardianProfile" ADD COLUMN "schoolId" TEXT;
CREATE INDEX "GuardianProfile_schoolId_idx" ON "GuardianProfile"("schoolId");
ALTER TABLE "GuardianProfile" ADD CONSTRAINT "GuardianProfile_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable Grade
ALTER TABLE "Grade" ALTER COLUMN "value" SET DATA TYPE DECIMAL(5,2);

-- Replace standard Unique Indexes with Partial Unique Indexes for Soft-Deleted Models
-- 1. User email
DROP INDEX IF EXISTS "User_email_key";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email") WHERE "deletedAt" IS NULL;

-- 2. User rutOrNationalId
DROP INDEX IF EXISTS "User_rutOrNationalId_key";
CREATE UNIQUE INDEX "User_rutOrNationalId_key" ON "User"("rutOrNationalId") WHERE "deletedAt" IS NULL AND "rutOrNationalId" IS NOT NULL;

-- 3. School slug
DROP INDEX IF EXISTS "School_slug_key";
CREATE UNIQUE INDEX "School_slug_key" ON "School"("slug") WHERE "deletedAt" IS NULL;

-- 4. School institutionalCode
DROP INDEX IF EXISTS "School_institutionalCode_key";
CREATE UNIQUE INDEX "School_institutionalCode_key" ON "School"("institutionalCode") WHERE "deletedAt" IS NULL AND "institutionalCode" IS NOT NULL;

-- 5. Enrollment (schoolId, courseId, studentProfileId, year)
DROP INDEX IF EXISTS "Enrollment_schoolId_courseId_studentProfileId_year_key";
CREATE UNIQUE INDEX "Enrollment_schoolId_courseId_studentProfileId_year_key" ON "Enrollment"("schoolId", "courseId", "studentProfileId", "year") WHERE "deletedAt" IS NULL;
