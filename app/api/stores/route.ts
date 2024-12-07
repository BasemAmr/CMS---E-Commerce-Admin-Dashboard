import prismadb from "@/lib/prismadb";
import { auth } from '@clerk/nextjs/server'
import { NextResponse, NextRequest } from "next/server";

export async function POST(
    req:NextRequest,
) {
    try {
        const { userId } = await auth()
        const body = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!body.name) {
            return new NextResponse("Missing name", { status: 400 });
        }

        const store = await prismadb.store.create({
            data: {
                name: body.name,
                userId
            }
        });

        return NextResponse.json(store);
        
    } catch (error) {
        console.log("STORE_ROUTE_POST_ERROR", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}