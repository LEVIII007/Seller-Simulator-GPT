import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";
import { z } from "zod";

// Define the Zod schema for Product
const ProductSchema = z.object({
  name: z.string(),
  category: z.string(),
  original_price: z.number(),
  offer_price: z.number(),
  rating: z.number(),
  total_ratings: z.number(),
  total_reviews: z.number(),
  description: z.string(),
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
      name: product.name,
      category: product.category,
      original_price: product.original_price,
      offer_price: product.offer_price,
      description: product.description,
      rating: product.rating,
      total_ratings: product.total_ratings,
      total_reviews: product.total_reviews,
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
