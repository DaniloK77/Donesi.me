CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "cartId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CartItem_cartId_menuItemId_key"
    ON "CartItem"("cartId", "menuItemId");
CREATE INDEX "CartItem_cartId_createdAt_idx"
    ON "CartItem"("cartId", "createdAt");
CREATE INDEX "CartItem_menuItemId_idx"
    ON "CartItem"("menuItemId");

ALTER TABLE "CartItem"
    ADD CONSTRAINT "CartItem_cartId_fkey"
    FOREIGN KEY ("cartId") REFERENCES "Cart"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CartItem"
    ADD CONSTRAINT "CartItem_menuItemId_fkey"
    FOREIGN KEY ("menuItemId") REFERENCES "MenuItem"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
