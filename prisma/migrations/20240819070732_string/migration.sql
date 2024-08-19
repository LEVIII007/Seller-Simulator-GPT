-- AlterTable
ALTER TABLE "products" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "overall_rating" SET DATA TYPE TEXT,
ALTER COLUMN "product_rating" SET DATA TYPE TEXT;
