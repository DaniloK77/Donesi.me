-- CreateTable
CREATE TABLE "PopularRestaurant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PopularRestaurant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PopularRestaurant_slug_key" ON "PopularRestaurant"("slug");

-- CreateIndex
CREATE INDEX "PopularRestaurant_displayOrder_idx" ON "PopularRestaurant"("displayOrder");
