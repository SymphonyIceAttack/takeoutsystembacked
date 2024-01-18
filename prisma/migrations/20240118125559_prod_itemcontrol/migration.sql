/*
  Warnings:

  - Added the required column `allowShopControl` to the `ProductsShelves` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isShelvesShow` to the `ProductsShelves` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductsShelves" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goods_title" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "mer_id" TEXT NOT NULL,
    "store_title" TEXT NOT NULL,
    "AreaTitle" TEXT NOT NULL,
    "goods_price_sale" INTEGER NOT NULL,
    "sold_total_all" INTEGER NOT NULL,
    "allowShopControl" BOOLEAN NOT NULL,
    "isShelvesShow" BOOLEAN NOT NULL,
    CONSTRAINT "ProductsShelves_mer_id_fkey" FOREIGN KEY ("mer_id") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ProductsShelves" ("AreaTitle", "area_id", "goods_price_sale", "goods_title", "id", "mer_id", "sold_total_all", "store_title") SELECT "AreaTitle", "area_id", "goods_price_sale", "goods_title", "id", "mer_id", "sold_total_all", "store_title" FROM "ProductsShelves";
DROP TABLE "ProductsShelves";
ALTER TABLE "new_ProductsShelves" RENAME TO "ProductsShelves";
CREATE UNIQUE INDEX "ProductsShelves_id_key" ON "ProductsShelves"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
