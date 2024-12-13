import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from "next/server";

export async function POST(
    req:NextRequest,
    {params}: { params: { storeId: string } }
) {
    try {
        const { userId } = await auth();
        const body = await req.json();
        const { name, billboardId } = body;
        const { storeId } = await params;

        if (!userId) {
            console.log("Unauthorized: No user ID");
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        if (!name) {
            console.log("Missing Name");
            return new NextResponse("Missing Name", { status: 400 });
        }

        if (!billboardId) {
            console.log("Missing Billboard ID");
            return new NextResponse("Missing Billboard ID", { status: 400 });
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

        if (!storeByUserId) {
            console.log("Store not found, Unauthorized");
            return new NextResponse("Store not found, Unauthorized", { status: 404 });
        }

        const category = await prismadb.category.create({
            data: {
                name,
                storeId,
                billboardId
            }
        });
        console.log("Billboard created:", category);

        return NextResponse.json(category, { status: 201 });
        
    } catch (error) {
        console.log("CATEGORY_ROUTE_POST_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req:NextRequest,
    {params}: { params: { storeId: string } }
) {
    try {
        const { storeId } = await params;
        console.log("Store ID:", storeId);

        if (!storeId) {
            console.log("Missing storeId");
            return new NextResponse("Missing storeId", { status: 400 });
        }

        const categories = await prismadb.category.findMany({
            where: {
                storeId: storeId
            },
            include : {
                billboards: true
            }
        });
        console.log("Billboards found:", categories);
        
        return NextResponse.json(categories, { status: 200 });
    }
    catch (error) {
        console.log("CATEGORY_ROUTE_GET_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}