-- CreateTable
CREATE TABLE "URLSchema" (
    "id" SERIAL NOT NULL,
    "fullURL" TEXT NOT NULL,
    "shortURL" TEXT NOT NULL,
    "visits" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "URLSchema.shortURL_unique" ON "URLSchema"("shortURL");
