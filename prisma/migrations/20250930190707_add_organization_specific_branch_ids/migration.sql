/*
  Warnings:

  - A unique constraint covering the columns `[branchId,organizationId]` on the table `branches` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `branchId` to the table `branches` without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add the branchId column as nullable first
ALTER TABLE "public"."branches" ADD COLUMN "branchId" INTEGER;

-- Step 2: Update existing branches with organization-specific IDs
-- This will assign branchId 1, 2, 3, etc. for each organization
WITH numbered_branches AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY "organizationId" ORDER BY id) as branch_number
  FROM "public"."branches"
)
UPDATE "public"."branches" 
SET "branchId" = numbered_branches.branch_number
FROM numbered_branches
WHERE "public"."branches".id = numbered_branches.id;

-- Step 3: Make branchId NOT NULL
ALTER TABLE "public"."branches" ALTER COLUMN "branchId" SET NOT NULL;

-- Step 4: Create the unique constraint
CREATE UNIQUE INDEX "branches_branchId_organizationId_key" ON "public"."branches"("branchId", "organizationId");