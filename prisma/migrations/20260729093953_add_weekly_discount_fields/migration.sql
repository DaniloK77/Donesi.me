-- AlterTable
ALTER TABLE "MenuItem" ADD COLUMN     "discountWeekStart" TIMESTAMP(3),
ADD COLUMN     "weeklyDiscountPercent" INTEGER;

-- CreateIndex
CREATE INDEX "MenuItem_weeklyDiscountPercent_idx" ON "MenuItem"("weeklyDiscountPercent");
