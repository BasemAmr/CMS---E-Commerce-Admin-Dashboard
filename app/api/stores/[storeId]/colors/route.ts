import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from "next/server";
import * as z from 'zod';

const colorSchema = z.object({
  name: z.string().nonempty("Name is required"),
  value: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid HEX color code"),
});

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = await auth();
    const body = await req.json();
    const { name, value } = colorSchema.parse(body);
    const { storeId } = params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId,
      },
    });

    return NextResponse.json(color, { status: 201 });

  } catch (error) {
    console.log("COLOR_ROUTE_POST_ERROR", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(error.errors.map(e => e.message).join(", "), { status: 400 });
    }
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { storeId } = params;

    if (!storeId) {
      return new NextResponse("Missing storeId", { status: 400 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: storeId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(colors, { status: 200 });
  }
  catch (error) {
    console.log("COLOR_ROUTE_GET_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}