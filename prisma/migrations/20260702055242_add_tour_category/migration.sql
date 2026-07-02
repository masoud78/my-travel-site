-- CreateTable
CREATE TABLE "TourCategory" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "image" TEXT,
    "destinationIds" TEXT NOT NULL DEFAULT '[]',
    "hotelStars" INTEGER,
    "transportType" TEXT,
    "originCity" TEXT,
    "tourIds" TEXT NOT NULL DEFAULT '[]',
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "keywords" TEXT,
    "ogImage" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TourCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TourCategory_slug_key" ON "TourCategory"("slug");
