-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Review" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tourId" TEXT,
    "blogPostId" TEXT,
    "postTitle" TEXT,
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT,
    "authorPhone" TEXT,
    "authorImage" TEXT,
    "tourTitle" TEXT,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "agencyReply" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Review_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "Tour" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Review_blogPostId_fkey" FOREIGN KEY ("blogPostId") REFERENCES "BlogPost" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Review" ("agencyReply", "authorEmail", "authorImage", "authorName", "authorPhone", "content", "createdAt", "id", "rating", "status", "title", "tourId", "tourTitle", "updatedAt") SELECT "agencyReply", "authorEmail", "authorImage", "authorName", "authorPhone", "content", "createdAt", "id", "rating", "status", "title", "tourId", "tourTitle", "updatedAt" FROM "Review";
DROP TABLE "Review";
ALTER TABLE "new_Review" RENAME TO "Review";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
