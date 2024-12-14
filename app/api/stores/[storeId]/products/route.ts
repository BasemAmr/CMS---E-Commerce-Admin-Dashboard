import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from "next/server";

// Create a new product
export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, price, categoryId, sizeIds, colorIds, images, isFeatured, isArchived } = body;
    const { storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name || !price || !categoryId || !sizeIds || !colorIds || !images) {
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

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        storeId,
        categoryId,
        isFeatured,
        isArchived,
        sizes: {
          connect: sizeIds.map((id: string) => ({ id }))
        },
        colors: {
          connect: colorIds.map((id: string) => ({ id }))
        },
        images: {
          create: images.map((url: string) => ({ url }))
        }
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.log("[PRODUCT_POST_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Fetch all products for a specific store
export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId') || undefined;
    const isFeatured = searchParams.get('isFeatured');
    const isArchived = searchParams.get('isArchived');
    const { storeId } = params;

    if (!storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const products = await prismadb.product.findMany({
      where: {
        storeId,
        categoryId,
        isFeatured: isFeatured ? Boolean(isFeatured) : undefined,
        isArchived: isArchived ? Boolean(isArchived) : undefined,
      },
      include: {
        sizes: true,
        colors: true,
        images: true,
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_GET_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
