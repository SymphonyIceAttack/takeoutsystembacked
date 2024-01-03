-- CreateTable
CREATE TABLE "Dish" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "order_id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "Dish_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Dish_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductsShelves" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "mer_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "create_time" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Order_mer_id_fkey" FOREIGN KEY ("mer_id") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_id_key" ON "Order"("id");
