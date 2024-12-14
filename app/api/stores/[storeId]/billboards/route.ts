import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from "next/server";

export async function POST(
    req:NextRequest,
    {params}: { params:  Promise<{ storeId: string }> }
) {
    try {
        const { userId } = await auth();
        console.log("User ID:", userId);
        const body = await req.json();
        const { label, imageUrl } = body;
        const { storeId } = await params;
        console.log("Request Body:", body);
        console.log("Store ID:", storeId);

        if (!userId) {
            console.log("Unauthorized: No user ID");
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        if (!label) {
            console.log("Missing label");
            return new NextResponse("Missing label", { status: 400 });
        }

        if (!imageUrl) {
            console.log("Missing imageUrl");
            return new NextResponse("Missing imageUrl", { status: 400 });
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

        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: storeId
            }
        });
        console.log("Billboard created:", billboard);

        return NextResponse.json(billboard, { status: 201 });
        
    } catch (error) {
        console.log("BILLBOARD_ROUTE_POST_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}

export async function GET(
    req:NextRequest,
    {params}: { params: Promise<{ storeId: string }> }
) {
    try {
        const { storeId } = await params;
        console.log("Store ID:", storeId);

        if (!storeId) {
            console.log("Missing storeId");
            return new NextResponse("Missing storeId", { status: 400 });
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: storeId
            }
        });
        console.log("Billboards found:", billboards);
        
        return NextResponse.json(billboards, { status: 200 });
    }
    catch (error) {
        console.log("BILLBOARD_ROUTE_GET_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}