/*
  Warnings:

  - A unique constraint covering the columns `[name,organizationId]` on the table `branches` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "branches_name_organizationId_key" ON "public"."branches"("name", "organizationId");
