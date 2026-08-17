-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH_ON_DELIVERY');

-- CreateEnum
CREATE TYPE "CancelledBy" AS ENUM ('CUSTOMER', 'ADMIN', 'RESTAURANT');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH_ON_DELIVERY',
ADD COLUMN     "confirmedAt" TIMESTAMP(3),
ADD COLUMN     "estimatedDeliveryMinutes" INTEGER,
ADD COLUMN     "estimatedDeliveryAt" TIMESTAMP(3),
ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "cancelledBy" "CancelledBy",
ADD COLUMN     "cancellationReason" TEXT;

-- Backfill: orders that are already past acceptance get a confirmation stamp so
-- existing rows do not look like they were never accepted.
UPDATE "Order"
SET "confirmedAt" = "updatedAt"
WHERE "status" IN ('CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED')
  AND "confirmedAt" IS NULL;

UPDATE "Order"
SET "cancelledAt" = "updatedAt"
WHERE "status" = 'CANCELLED'
  AND "cancelledAt" IS NULL;
