import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from "next/server";

export async function PATCH(
    req:NextRequest,
    { params }: { params:  Promise<{ storeId: string }> }
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { storeId } = await params;
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!body.name) {
            return new NextResponse("Missing name", { status: 400 });
        }

        if (! storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const store = await prismadb.store.updateMany({
            where: {
                id: storeId,
                userId
            },
            data: {
                name: body.name
            }
        });

        return NextResponse.json(store);
        
    } catch (error) {
        console.log("[STORE_PATCH_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req:NextRequest,
    { params }: { params: { storeId: string } }
) {
    try {
        const { userId } = await auth();

        const { storeId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!storeId) {
            return new NextResponse("Store ID is required", { status: 400 });
        }

        const store = await prismadb.store.deleteMany({
            where: {
                id: storeId,
                userId
            }
        });

        return NextResponse.json(store);
        
    } catch (error) {
        console.log("[STORE_DELETE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
