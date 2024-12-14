import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from "next/server";

// Get a product by ID
export async function GET(
  req: NextRequest,
  { params }: { params:  Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!productId) {
      return new NextResponse("Missing productId", { status: 400 });
    }

    const product = await prismadb.product.findUnique({
      where: { id: productId },
      include: {
        sizes: true,
        colors: true,
        images: true
      }
    });

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Update a product
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ productId: string; storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, price, categoryId, sizeIds, colorIds, images, isFeatured, isArchived } = body;
    const { productId, storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !price || !categoryId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: storeId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Store not found, Unauthorized", { status: 404 });
    }

    const product = await prismadb.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        categoryId,
        isFeatured,
        isArchived,
        sizes: {
          set: sizeIds.map((id: string) => ({ id }))
        },
        colors: {
          set: colorIds.map((id: string) => ({ id }))
        },
        images: {
          deleteMany: {},
          create: images.map((url: string) => ({ url }))
        }
      }
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_PATCH_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Delete a product
export async function DELETE(
  req: NextRequest,
  { params }: { params:  Promise<{ productId: string; storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { productId, storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: storeId
      }
    });

    if (!storeByUserId) {
      return new NextResponse("Store not found, Unauthorized", { status: 404 });
    }

    const product = await prismadb.product.delete({
      where: { id: productId }
    });

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_DELETE_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
