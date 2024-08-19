/*
  Warnings:

  - You are about to drop the column `category` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `products` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pid]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discounted_price` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_FK_Advantage_product` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pid` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_category_tree` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_name` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_url` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `retail_price` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "products_category_idx";

-- DropIndex
DROP INDEX "products_name_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "category",
DROP COLUMN "discount",
DROP COLUMN "name",
DROP COLUMN "price",
DROP COLUMN "stock",
ADD COLUMN     "brand" TEXT NOT NULL DEFAULT 'NA',
ADD COLUMN     "discounted_price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "is_FK_Advantage_product" BOOLEAN NOT NULL,
ADD COLUMN     "overall_rating" DOUBLE PRECISION,
ADD COLUMN     "pid" TEXT NOT NULL,
ADD COLUMN     "product_category_tree" TEXT NOT NULL,
ADD COLUMN     "product_name" TEXT NOT NULL,
ADD COLUMN     "product_rating" DOUBLE PRECISION,
ADD COLUMN     "product_specifications" TEXT,
ADD COLUMN     "product_url" TEXT NOT NULL,
ADD COLUMN     "retail_price" DOUBLE PRECISION NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "products_pid_key" ON "products"("pid");

-- CreateIndex
CREATE INDEX "products_product_name_idx" ON "products"("product_name");

-- CreateIndex
CREATE INDEX "products_product_category_tree_idx" ON "products"("product_category_tree");
