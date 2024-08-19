/*
  Warnings:

  - You are about to drop the column `description` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_FK_Advantage_product` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `pid` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `product_specifications` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `product_url` on the `products` table. All the data in the column will be lost.
  - Added the required column `product_description` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `top_seller` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overall_rating` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `product_rating` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "products_pid_key";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "is_FK_Advantage_product",
DROP COLUMN "pid",
DROP COLUMN "product_specifications",
DROP COLUMN "product_url",
ADD COLUMN     "product_description" TEXT NOT NULL,
ADD COLUMN     "top_seller" BOOLEAN NOT NULL,
ALTER COLUMN "brand" DROP DEFAULT,
DROP COLUMN "overall_rating",
ADD COLUMN     "overall_rating" DOUBLE PRECISION NOT NULL,
DROP COLUMN "product_rating",
ADD COLUMN     "product_rating" DOUBLE PRECISION NOT NULL;
