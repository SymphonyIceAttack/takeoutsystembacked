-- CreateTable
CREATE TABLE "UserInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "isLike" BOOLEAN NOT NULL,
    "comment" TEXT NOT NULL,
    CONSTRAINT "UserInteraction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductsShelves" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserInteraction_id_key" ON "UserInteraction"("id");
