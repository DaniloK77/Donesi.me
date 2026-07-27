-- CreateEnum
CREATE TYPE "DealCategory" AS ENUM ('VEGAN', 'SUSHI', 'PIZZA_FASTFOOD', 'OTHER');

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT,
    "imageUrl" TEXT NOT NULL,
    "discountPercentage" INTEGER NOT NULL,
    "category" "DealCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Deal_category_idx" ON "Deal"("category");
