-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "path" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Comment_path_idx" ON "Comment"("path");
