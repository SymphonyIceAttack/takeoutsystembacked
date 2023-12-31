/*
  Warnings:

  - Added the required column `area_title` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "store_title" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "area_title" TEXT NOT NULL
);
INSERT INTO "new_Shop" ("area_id", "id", "store_title") SELECT "area_id", "id", "store_title" FROM "Shop";
DROP TABLE "Shop";
ALTER TABLE "new_Shop" RENAME TO "Shop";
CREATE UNIQUE INDEX "Shop_id_key" ON "Shop"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
