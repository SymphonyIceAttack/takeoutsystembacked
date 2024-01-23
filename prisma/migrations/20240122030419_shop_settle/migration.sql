-- CreateTable
CREATE TABLE "ShopSettle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "account" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "store_title" TEXT NOT NULL,
    "area_id" TEXT NOT NULL,
    "area_title" TEXT NOT NULL,
    "status" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopSettle_id_key" ON "ShopSettle"("id");

-- CreateIndex
CREATE UNIQUE INDEX "ShopSettle_account_key" ON "ShopSettle"("account");
