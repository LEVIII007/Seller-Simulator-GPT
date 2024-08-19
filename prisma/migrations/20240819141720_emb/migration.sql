-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category_embedding" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN     "description_embedding" TEXT NOT NULL DEFAULT '[]';
