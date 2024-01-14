/*
  Warnings:

  - Added the required column `userId` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "store_title" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "area_title" TEXT NOT NULL,
    CONSTRAINT "Shop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Shop" ("area_id", "area_title", "id", "store_title") SELECT "area_id", "area_title", "id", "store_title" FROM "Shop";
DROP TABLE "Shop";
ALTER TABLE "new_Shop" RENAME TO "Shop";
CREATE UNIQUE INDEX "Shop_id_key" ON "Shop"("id");
CREATE UNIQUE INDEX "Shop_userId_key" ON "Shop"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
