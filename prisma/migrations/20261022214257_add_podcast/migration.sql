-- CreateEnum
CREATE TYPE "PodcastStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "timestamp" INTEGER;

-- CreateTable
CREATE TABLE "Podcast" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "audioUrl" TEXT NOT NULL,
    "subtitleUrl" TEXT,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "thumbnailUrl" TEXT,
    "teacherId" TEXT NOT NULL,
    "status" "PodcastStatus" NOT NULL DEFAULT 'DRAFT',
    "rejectionReason" TEXT,
    "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "ratingCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "dislikeCount" INTEGER NOT NULL DEFAULT 0,
    "playCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "podcastId" TEXT NOT NULL,
    "lastPosition" INTEGER NOT NULL DEFAULT 0,
    "completedSegments" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PodcastProgress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PodcastPlay" (
    "id" TEXT NOT NULL,
    "podcastId" TEXT NOT NULL,
    "userId" TEXT,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PodcastPlay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_slug_key" ON "Podcast"("slug");

-- CreateIndex
CREATE INDEX "Podcast_status_createdAt_idx" ON "Podcast"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Podcast_teacherId_idx" ON "Podcast"("teacherId");

-- CreateIndex
CREATE INDEX "Podcast_slug_idx" ON "Podcast"("slug");

-- CreateIndex
CREATE INDEX "Podcast_playCount_idx" ON "Podcast"("playCount");

-- CreateIndex
CREATE INDEX "PodcastProgress_userId_idx" ON "PodcastProgress"("userId");

-- CreateIndex
CREATE INDEX "PodcastProgress_podcastId_idx" ON "PodcastProgress"("podcastId");

-- CreateIndex
CREATE UNIQUE INDEX "PodcastProgress_userId_podcastId_key" ON "PodcastProgress"("userId", "podcastId");

-- CreateIndex
CREATE INDEX "PodcastPlay_podcastId_createdAt_idx" ON "PodcastPlay"("podcastId", "createdAt");

-- CreateIndex
CREATE INDEX "PodcastPlay_podcastId_position_idx" ON "PodcastPlay"("podcastId", "position");

-- CreateIndex
CREATE INDEX "PodcastPlay_userId_idx" ON "PodcastPlay"("userId");

-- AddForeignKey
ALTER TABLE "Podcast" ADD CONSTRAINT "Podcast_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastProgress" ADD CONSTRAINT "PodcastProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastProgress" ADD CONSTRAINT "PodcastProgress_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastPlay" ADD CONSTRAINT "PodcastPlay_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PodcastPlay" ADD CONSTRAINT "PodcastPlay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
