import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { categoryId: string } }
) {
    try {
        const { categoryId } = await params;


        const category = await prismadb.category.findUnique({
            where: {
                id: categoryId,
            },
            include: {
                billboards: true
            }
        });

        return NextResponse.json(category);
        
    } catch (error) {
        console.log("[CATEGORY_GET_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { categoryId: string ; storeId:string} }
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const {name, billboardId} = body;
        const { categoryId,storeId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!name) {
            return new NextResponse("Missing name", { status: 400 });
        }

        if (!billboardId) {
            return new NextResponse("Missing imageUrl", { status: 400 });
        }

        if (!categoryId) {
            return new NextResponse("CATEGORY ID is required", { status: 400 });
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


        const category = await prismadb.category.updateMany({
            where: {
                id: categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);
        
    } catch (error) {
        console.log("[CATEGORY_PATCH_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req:NextRequest,
{ params }: { params:   { categoryId: string ; storeId:string} }
) {
    try {
        const { userId } = await auth();

        const { categoryId, storeId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!categoryId) {
            return new NextResponse("Store ID is required", { status: 400 });
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

        const category = await prismadb.category.deleteMany({
            where: {
                id: categoryId,
            }
        });

        return NextResponse.json(category);
        
    }
    catch (error) {
        console.log("[category_DELETE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}