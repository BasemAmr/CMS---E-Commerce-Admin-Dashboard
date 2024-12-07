import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: { billboardId: string } }
) {
    try {
        const { billboardId } = params;


        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: billboardId,
            }
        });

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log("[BILLBOARD_GET_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { billboardId: string ; storeId:string} }
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const {label, imageUrl} = body;
        const { billboardId,storeId } = await params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!label) {
            return new NextResponse("Missing name", { status: 400 });
        }

        if (!imageUrl) {
            return new NextResponse("Missing imageUrl", { status: 400 });
        }

        if (!billboardId) {
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


        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);
        
    } catch (error) {
        console.log("[BILLBOARD_PATCH_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function DELETE(
    req:NextRequest,
{ params }: { params:   { billboardId: string ; storeId:string} }
) {
    try {
        const { userId } = await auth();

        const { billboardId, storeId } = params;

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!billboardId) {
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

        const billboard = await prismadb.billboard.deleteMany({
            where: {
                id: billboardId,
            }
        });

        return NextResponse.json(billboard);
        
    }
    catch (error) {
        console.log("[BILLBOARD_DELETE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }

}