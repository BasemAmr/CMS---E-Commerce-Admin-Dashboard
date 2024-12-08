import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { sizeId, storeId } = params;
    console.log("Store ID:", storeId);
    console.log("Size ID:", sizeId);

    if (!sizeId) {
      console.log("Missing sizeId");
      return new NextResponse("Missing sizeId", { status: 400 });
    }

    if (!storeId) {
      console.log("Missing storeId");
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      }
    });

    if (!size) {
      console.log("Size not found");
      return new NextResponse("Size not found", { status: 404 });
    }

    // Optional: Verify if the size belongs to the store
    if (size.storeId !== storeId) {
      console.log("Size does not belong to the store");
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(size, { status: 200 });

  } catch (error) {
    console.log("SIZE_ROUTE_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = body;
    const { sizeId, storeId } = params;

    console.log("User ID:", userId);
    console.log("Request Body:", body);
    console.log("Store ID:", storeId);
    console.log("Size ID:", sizeId);

    if (!userId) {
      console.log("Unauthorized: No user ID");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      console.log("Missing name");
      return new NextResponse("Missing name", { status: 400 });
    }

    if (!value) {
      console.log("Missing value");
      return new NextResponse("Missing value", { status: 400 });
    }

    if (!sizeId) {
      console.log("Missing sizeId");
      return new NextResponse("Missing sizeId", { status: 400 });
    }

    if (!storeId) {
      console.log("Missing storeId");
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: storeId
      }
    });
    console.log("Store by User ID:", storeByUserId);

    if (!storeByUserId) {
      console.log("Store not found, Unauthorized");
      return new NextResponse("Store not found, Unauthorized", { status: 404 });
    }

    // Optional: Verify if the size belongs to the store
    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      }
    });

    if (!size) {
      console.log("Size not found");
      return new NextResponse("Size not found", { status: 404 });
    }

    if (size.storeId !== storeId) {
      console.log("Size does not belong to the store");
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const updatedSize = await prismadb.size.update({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value
      }
    });

    console.log("Size updated:", updatedSize);

    return NextResponse.json(updatedSize, { status: 200 });

  } catch (error) {
    console.log("SIZE_ROUTE_PATCH_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = await auth();
    const { sizeId, storeId } = params;

    console.log("User ID:", userId);
    console.log("Store ID:", storeId);
    console.log("Size ID:", sizeId);

    if (!userId) {
      console.log("Unauthorized: No user ID");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!sizeId) {
      console.log("Missing sizeId");
      return new NextResponse("Missing sizeId", { status: 400 });
    }

    if (!storeId) {
      console.log("Missing storeId");
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: storeId
      }
    });
    console.log("Store by User ID:", storeByUserId);

    if (!storeByUserId) {
      console.log("Store not found, Unauthorized");
      return new NextResponse("Store not found, Unauthorized", { status: 404 });
    }

    // Optional: Verify if the size belongs to the store
    const size = await prismadb.size.findUnique({
      where: {
        id: sizeId,
      }
    });

    if (!size) {
      console.log("Size not found");
      return new NextResponse("Size not found", { status: 404 });
    }

    if (size.storeId !== storeId) {
      console.log("Size does not belong to the store");
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prismadb.size.delete({
      where: {
        id: sizeId,
      }
    });

    console.log("Size deleted successfully");

    return NextResponse.json({ message: "Size deleted successfully" }, { status: 200 });

  }
  catch (error) {
    console.log("SIZE_ROUTE_DELETE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}