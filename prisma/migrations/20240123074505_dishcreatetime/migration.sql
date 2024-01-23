/*
  Warnings:

  - Added the required column `create_time` to the `Dish` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Dish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "create_time" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "Dish_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Dish_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductsShelves" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Dish" ("id", "order_id", "productId") SELECT "id", "order_id", "productId" FROM "Dish";
DROP TABLE "Dish";
ALTER TABLE "new_Dish" RENAME TO "Dish";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
