-- CreateEnum
CREATE TYPE "CommentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropIndex
DROP INDEX "Comment_parentId_createdAt_idx";

-- DropIndex
DROP INDEX "Comment_targetType_targetId_createdAt_idx";

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "status" "CommentStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "Comment_targetType_targetId_status_createdAt_idx" ON "Comment"("targetType", "targetId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_parentId_status_createdAt_idx" ON "Comment"("parentId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Comment_status_idx" ON "Comment"("status");
