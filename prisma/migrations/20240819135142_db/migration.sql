-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "product_category_tree" TEXT NOT NULL,
    "retail_price" DOUBLE PRECISION NOT NULL,
    "discounted_price" DOUBLE PRECISION NOT NULL,
    "product_rating" DOUBLE PRECISION NOT NULL,
    "overall_rating" DOUBLE PRECISION NOT NULL,
    "brand" TEXT NOT NULL,
    "product_description" TEXT NOT NULL,
    "top_seller" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "products_product_name_idx" ON "products"("product_name");

-- CreateIndex
CREATE INDEX "products_product_category_tree_idx" ON "products"("product_category_tree");
