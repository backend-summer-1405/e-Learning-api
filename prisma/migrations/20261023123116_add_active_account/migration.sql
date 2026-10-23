/*
  Warnings:

  - A unique constraint covering the columns `[activeAccountId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeAccountId" TEXT;

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_activeAccountId_key" ON "User"("activeAccountId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_activeAccountId_fkey" FOREIGN KEY ("activeAccountId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
