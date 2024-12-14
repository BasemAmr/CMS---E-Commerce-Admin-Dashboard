// /api/stores/[storeId]/colors/[colorId]/route.ts

import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from "next/server";
import * as z from 'zod';

const colorSchema = z.object({
  name: z.string().nonempty("Name is required"),
  value: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid HEX color code"),
});

export async function GET(
  req: NextRequest,
  { params }: { params:  Promise<{ colorId: string; storeId: string }> }
) {
  try {
    const { colorId, storeId } = await params;

    if (!colorId) {
      return new NextResponse("Missing colorId", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    if (!color) {
      return new NextResponse("Color not found", { status: 404 });
    }

    if (color.storeId !== storeId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    return NextResponse.json(color, { status: 200 });

  } catch (error) {
    console.log("COLOR_ROUTE_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params:  Promise<{ colorId: string; storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = colorSchema.parse(body);
    const { colorId, storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!colorId) {
      return new NextResponse("Missing colorId", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Store not found, Unauthorized", { status: 404 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    if (!color) {
      return new NextResponse("Color not found", { status: 404 });
    }

    if (color.storeId !== storeId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const updatedColor = await prismadb.color.update({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(updatedColor, { status: 200 });

  } catch (error) {
    console.log("COLOR_ROUTE_PATCH_ERROR", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors.map(e => e.message).join(", "), { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params:  Promise<{ colorId: string; storeId: string }> }
) {
  try {
    const { userId } = await auth();
    const { colorId, storeId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!colorId) {
      return new NextResponse("Missing colorId", { status: 400 });
    }

    if (!storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: storeId,
      },
    });

    if (!storeByUserId) {
      return new NextResponse("Store not found, Unauthorized", { status: 404 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: colorId,
      },
    });

    if (!color) {
      return new NextResponse("Color not found", { status: 404 });
    }

    if (color.storeId !== storeId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    await prismadb.color.delete({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json({ message: "Color deleted successfully" }, { status: 200 });

  }
  catch (error) {
    console.log("COLOR_ROUTE_DELETE_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}