// app/api/webhook/route.ts
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        
        // Verify the transaction was successful
        console.log(body);
        if (body.success == 'true') {
            const orderId = body.orderId;
            
            // Update order status in database
            if (!orderId) {
                return NextResponse.json({ error: 'Order ID not found' }, { status: 400 });
            }
            console.log("ORDER ID REVIEVED:" , orderId)
            await prismadb.order.update({
                where: {
                    id: orderId
                },
                data: {
                    isPaid: true,
                }
            });
            return NextResponse.json({ received: true });
        }

    } catch (error) {
        console.error('[WEBHOOK_ERROR]', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}