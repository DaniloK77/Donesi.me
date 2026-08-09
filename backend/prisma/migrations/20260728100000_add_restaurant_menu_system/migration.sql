-- Preserve existing homepage restaurant IDs and timestamps while promoting the
-- lightweight table into the full restaurant domain model.
ALTER TABLE "PopularRestaurant" RENAME TO "Restaurant";
ALTER TABLE "Restaurant" RENAME CONSTRAINT "PopularRestaurant_pkey" TO "Restaurant_pkey";
ALTER INDEX "PopularRestaurant_slug_key" RENAME TO "Restaurant_slug_key";
ALTER INDEX "PopularRestaurant_displayOrder_idx" RENAME TO "Restaurant_displayOrder_idx";

ALTER TABLE "Restaurant"
    ADD COLUMN "coverImageUrl" TEXT,
    ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Restoran',
    ADD COLUMN "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    ADD COLUMN "address" TEXT NOT NULL DEFAULT 'Podgorica',
    ADD COLUMN "city" TEXT NOT NULL DEFAULT 'Podgorica',
    ADD COLUMN "deliveryTimeMin" INTEGER NOT NULL DEFAULT 30;

-- category and address are required application data, not database defaults.
ALTER TABLE "Restaurant" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Restaurant" ALTER COLUMN "address" DROP DEFAULT;

CREATE INDEX "Restaurant_city_category_idx" ON "Restaurant"("city", "category");

CREATE TABLE "MenuCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuCategory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MenuItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL,
    "menuCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MenuItem_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "MenuCategory_restaurantId_name_key"
    ON "MenuCategory"("restaurantId", "name");
CREATE INDEX "MenuCategory_restaurantId_displayOrder_idx"
    ON "MenuCategory"("restaurantId", "displayOrder");
CREATE UNIQUE INDEX "MenuItem_menuCategoryId_name_key"
    ON "MenuItem"("menuCategoryId", "name");
CREATE INDEX "MenuItem_menuCategoryId_displayOrder_idx"
    ON "MenuItem"("menuCategoryId", "displayOrder");

ALTER TABLE "MenuCategory"
    ADD CONSTRAINT "MenuCategory_restaurantId_fkey"
    FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MenuItem"
    ADD CONSTRAINT "MenuItem_menuCategoryId_fkey"
    FOREIGN KEY ("menuCategoryId") REFERENCES "MenuCategory"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
