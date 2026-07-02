/*
  Warnings:

  - You are about to drop the column `podcastUrl` on the `Destination` table. All the data in the column will be lost.
  - You are about to drop the column `podcastUrl` on the `Tour` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Destination" DROP COLUMN "podcastUrl",
ADD COLUMN     "continentId" TEXT,
ADD COLUMN     "countryId" TEXT;

-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "podcastUrl";

-- CreateTable
CREATE TABLE "_TourDestinations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CategoryTours" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TourDestinations_AB_unique" ON "_TourDestinations"("A", "B");

-- CreateIndex
CREATE INDEX "_TourDestinations_B_index" ON "_TourDestinations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryTours_AB_unique" ON "_CategoryTours"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryTours_B_index" ON "_CategoryTours"("B");

-- AddForeignKey
ALTER TABLE "_TourDestinations" ADD CONSTRAINT "_TourDestinations_A_fkey" FOREIGN KEY ("A") REFERENCES "Destination"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TourDestinations" ADD CONSTRAINT "_TourDestinations_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTours" ADD CONSTRAINT "_CategoryTours_A_fkey" FOREIGN KEY ("A") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryTours" ADD CONSTRAINT "_CategoryTours_B_fkey" FOREIGN KEY ("B") REFERENCES "TourCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
