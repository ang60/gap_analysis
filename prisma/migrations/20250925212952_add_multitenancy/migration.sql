/*
  Warnings:

  - A unique constraint covering the columns `[clause,organizationId]` on the table `requirements` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `organizationId` to the `action_plans` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `branches` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `gap_assessments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `requirements` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `risks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `users` table without a default value. This is not possible if the table is not empty.

*/

-- First, create the organizations table
CREATE TABLE "public"."organizations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "subdomain" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "settings" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- Create indexes for organizations
CREATE UNIQUE INDEX "organizations_domain_key" ON "public"."organizations"("domain");
CREATE UNIQUE INDEX "organizations_subdomain_key" ON "public"."organizations"("subdomain");

-- Insert a default organization for existing data
INSERT INTO "public"."organizations" ("name", "domain", "subdomain", "isActive", "settings", "createdAt", "updatedAt")
VALUES ('Default Organization', 'default.local', 'default', true, '{}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Add organizationId columns as nullable first
ALTER TABLE "public"."users" ADD COLUMN "organizationId" INTEGER;
ALTER TABLE "public"."branches" ADD COLUMN "organizationId" INTEGER;
ALTER TABLE "public"."requirements" ADD COLUMN "organizationId" INTEGER;
ALTER TABLE "public"."gap_assessments" ADD COLUMN "organizationId" INTEGER;
ALTER TABLE "public"."action_plans" ADD COLUMN "organizationId" INTEGER;
ALTER TABLE "public"."risks" ADD COLUMN "organizationId" INTEGER;
ALTER TABLE "public"."schedules" ADD COLUMN "organizationId" INTEGER;
ALTER TABLE "public"."notifications" ADD COLUMN "organizationId" INTEGER;

-- Update all existing records to use the default organization (ID 1)
UPDATE "public"."users" SET "organizationId" = 1 WHERE "organizationId" IS NULL;
UPDATE "public"."branches" SET "organizationId" = 1 WHERE "organizationId" IS NULL;
UPDATE "public"."requirements" SET "organizationId" = 1 WHERE "organizationId" IS NULL;
UPDATE "public"."gap_assessments" SET "organizationId" = 1 WHERE "organizationId" IS NULL;
UPDATE "public"."action_plans" SET "organizationId" = 1 WHERE "organizationId" IS NULL;
UPDATE "public"."risks" SET "organizationId" = 1 WHERE "organizationId" IS NULL;
UPDATE "public"."schedules" SET "organizationId" = 1 WHERE "organizationId" IS NULL;
UPDATE "public"."notifications" SET "organizationId" = 1 WHERE "organizationId" IS NULL;

-- Make organizationId NOT NULL
ALTER TABLE "public"."users" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "public"."branches" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "public"."requirements" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "public"."gap_assessments" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "public"."action_plans" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "public"."risks" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "public"."schedules" ALTER COLUMN "organizationId" SET NOT NULL;
ALTER TABLE "public"."notifications" ALTER COLUMN "organizationId" SET NOT NULL;

-- Drop the old unique constraint
DROP INDEX "public"."requirements_clause_key";

-- Create new unique constraint for requirements
CREATE UNIQUE INDEX "requirements_clause_organizationId_key" ON "public"."requirements"("clause", "organizationId");

-- Add foreign key constraints
ALTER TABLE "public"."users" ADD CONSTRAINT "users_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."branches" ADD CONSTRAINT "branches_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."requirements" ADD CONSTRAINT "requirements_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."gap_assessments" ADD CONSTRAINT "gap_assessments_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."action_plans" ADD CONSTRAINT "action_plans_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."risks" ADD CONSTRAINT "risks_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."schedules" ADD CONSTRAINT "schedules_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
