-- CreateTable
CREATE TABLE "ProductsShelves" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "goods_title" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "mer_id" TEXT NOT NULL,
    "store_title" TEXT NOT NULL,
    "AreaTitle" TEXT NOT NULL,
    "goods_price_sale" INTEGER NOT NULL,
    "sold_total_all" INTEGER NOT NULL,
    CONSTRAINT "ProductsShelves_mer_id_fkey" FOREIGN KEY ("mer_id") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "store_title" TEXT NOT NULL,
    "area_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductsShelves_id_key" ON "ProductsShelves"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_id_key" ON "Shop"("id");
