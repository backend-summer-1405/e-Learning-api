-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('COMMENT_REPLY', 'COMMENT_LIKE', 'COMMENT_APPROVED', 'COMMENT_REJECTED', 'COURSE_ENROLLED', 'COURSE_APPROVED', 'COURSE_REJECTED', 'PODCAST_APPROVED', 'PODCAST_REJECTED', 'WALLET_TOPUP', 'WALLET_WITHDRAW', 'PURCHASE', 'RATING');

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notification_userId_isRead_idx" ON "Notification"("userId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_userId_createdAt_idx" ON "Notification"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
