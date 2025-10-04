-- CreateEnum
CREATE TYPE "public"."RequirementStatus" AS ENUM ('NOT_IMPLEMENTED', 'PARTIALLY_IMPLEMENTED', 'MOSTLY_IMPLEMENTED', 'FULLY_IMPLEMENTED', 'NOT_APPLICABLE');

-- AlterTable
ALTER TABLE "public"."gap_assessments" ADD COLUMN     "complianceStandardId" INTEGER;

-- AlterTable
ALTER TABLE "public"."requirements" ADD COLUMN     "complianceStandardId" INTEGER;

-- CreateTable
CREATE TABLE "public"."compliance_standards" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" TEXT,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" INTEGER NOT NULL,

    CONSTRAINT "compliance_standards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "compliance_standards_name_version_organizationId_key" ON "public"."compliance_standards"("name", "version", "organizationId");

-- AddForeignKey
ALTER TABLE "public"."requirements" ADD CONSTRAINT "requirements_complianceStandardId_fkey" FOREIGN KEY ("complianceStandardId") REFERENCES "public"."compliance_standards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."gap_assessments" ADD CONSTRAINT "gap_assessments_complianceStandardId_fkey" FOREIGN KEY ("complianceStandardId") REFERENCES "public"."compliance_standards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."compliance_standards" ADD CONSTRAINT "compliance_standards_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
