import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    console.log("User ID:", userId);

    const body = await req.json();
    const { name, value } = body;
    const { storeId } = await params;

    console.log("Request Body:", body);
    console.log("Store ID:", storeId);

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

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        storeId: storeId
      }
    });
    console.log("Size created:", size);

    return NextResponse.json(size, { status: 201 });

  } catch (error) {
    console.log("SIZE_ROUTE_POST_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = await params;
    console.log("Store ID:", storeId);

    if (!storeId) {
      console.log("Missing storeId");
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: storeId
      }
    });
    console.log("Sizes found:", sizes);

    return NextResponse.json(sizes, { status: 200 });
  }
  catch (error) {
    console.log("SIZE_ROUTE_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}