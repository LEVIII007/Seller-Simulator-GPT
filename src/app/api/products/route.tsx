import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prisma";
interface Product {
  name: string;
  price: number;
  category: string;
}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const body: Product[] = await req.json();

    // Validate the request body
    if (!Array.isArray(body)) {
      return NextResponse.json(
        { message: "Request body must be an array of products" },
        { status: 400 }
      );
    }

    // Validate each product in the array
    for (const product of body) {
      if (!product.name || typeof product.name !== "string") {
        return NextResponse.json(
          { message: "Each product must have a valid 'name'" },
          { status: 400 }
        );
      }
      if (typeof product.price !== "number") {
        return NextResponse.json(
          { message: "Each product must have a valid 'price'" },
          { status: 400 }
        );
      }
      if (!product.category || typeof product.category !== "string") {
        return NextResponse.json(
          { message: "Each product must have a valid 'category'" },
          { status: 400 }
        );
      }
    }

    // Create products in the database
    const response = await prisma.product.createMany({
      data: body,
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
