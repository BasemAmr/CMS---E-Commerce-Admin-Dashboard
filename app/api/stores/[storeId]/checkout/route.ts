import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosError } from "axios";
import prismadb from "@/lib/prismadb";

const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY;
// const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY;
// const FRONTEND_STORE_URL = process.env.FRONTEND_STORE_URL;

export async function POST(req: NextRequest, { params }: { params: { storeId: string } }) {
    try {
        const req_body = await req.json();
        const { storeId } = await params;

        if (!PAYMOB_SECRET_KEY) {
            throw new Error("Paymob API key not configured");
        }

        const { productIds, ...paymentData } = req_body;
        if (!productIds || productIds.length === 0) {
            return NextResponse.json({ error: "Product IDs are required" }, { status: 400 });
        }

        const body = {
            ...paymentData,
            notification_url: "https://webhook.site/1ca12a5f-b977-41e5-8a0d-8009cd143980",
            payment_methods: [4900588],
            redirection: process.env.FRONTEND_STORE_URL,
        };

        console.log("Payment data:", body);

        const response = await axios.post(
            "https://accept.paymob.com/v1/intention/",
            body,
            {
                headers: {
                    "Authorization": `Token ${PAYMOB_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 10000,
            }
        );

        const { client_secret } = response.data;
        const payment_url = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`;

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const order = await prismadb.order.create({
            data: {
              storeId: storeId,
              isPaid: false,
              orderItems: {
                create: productIds.map((productId: string) => ({
                  product: { connect: { id: productId } },
                })),
              },
              phone: paymentData.billing_data.phone_number,
              address: `Street: ${paymentData.billing_data.street}, Building: ${paymentData.billing_data.building}, Apartment: ${paymentData.billing_data.apartment}, Floor: ${paymentData.billing_data.floor}, ${paymentData.billing_data.state}, ${paymentData.billing_data.country}`,
            },
          });

        return NextResponse.json({ payment_url }, { status: 200 });

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError;
            console.error("Error in processing payment intention:", axiosError.response?.data || axiosError.message);
            return NextResponse.json({ error: "Failed to create payment intention" }, { status: 500 });
        }
    }
}