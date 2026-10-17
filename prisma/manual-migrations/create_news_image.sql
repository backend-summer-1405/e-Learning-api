CREATE TABLE "NewsImage" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "newsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "NewsImage_newsId_idx"
ON "NewsImage"("newsId");

ALTER TABLE "NewsImage"
ADD CONSTRAINT "NewsImage_newsId_fkey"
FOREIGN KEY ("newsId")
REFERENCES "News"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;