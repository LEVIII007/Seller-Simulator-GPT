import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Define the Zod schema for Product
const ProductSchema = z.object({
  product_name: z.string(),
  product_category_tree: z.string(),
  retail_price: z.number(),
  discounted_price: z.number(),
  product_description: z.string(),
  brand: z.string(),
  product_rating: z.number(),
  overall_rating: z.number(),
  top_seller: z.boolean(),
});

const ProductsArraySchema = z.array(ProductSchema);

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body = await req.json();

    // Validate the request body using Zod
    const parsedBody = ProductsArraySchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        { message: "Invalid request body", errors: parsedBody.error.errors },
        { status: 400 }
      );
    }

    // Transform the data to match Prisma's expected type
    const productsToCreate: Prisma.ProductCreateManyInput[] =
      parsedBody.data.map((product) => ({
        product_name: product.product_name,
        product_category_tree: product.product_category_tree,
        retail_price: product.retail_price,
        discounted_price: product.discounted_price,
        product_description: product.product_description,
        brand: product.brand,
        product_rating: product.product_rating,
        overall_rating: product.overall_rating,
        top_seller: product.top_seller,
      }));

    // Create products in the database
    const response = await prisma.product.createMany({
      data: productsToCreate,
    });

    return NextResponse.json(
      {
        message: "Products created successfully",
        response,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
