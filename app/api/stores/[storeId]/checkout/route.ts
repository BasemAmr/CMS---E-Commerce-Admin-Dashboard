import { NextResponse, NextRequest } from "next/server";
import axios, { AxiosError } from "axios";
import prismadb from "@/lib/prismadb";
import { Product } from "@prisma/client";

const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY;
// const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY;
// const FRONTEND_STORE_URL = process.env.FRONTEND_STORE_URL;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  try {
    const req_body = await req.json();
    console.log("CHECKOUT_REQUEST_BODY:", JSON.stringify(req_body, null, 2));
    const { storeId } = await params;

    if (!PAYMOB_SECRET_KEY) {
      throw new Error("Paymob API key not configured");
    }

    const { productIds, ...paymentData } = req_body;
    if (!productIds || productIds.length === 0) {
      return NextResponse.json(
        { error: "Product IDs are required" },
        { status: 400 }
      );
    }

    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds.filter((id: any) => typeof id === 'string'),
        },
      },
      include: {
        images: true,
      },
    });

    const items = products.map((product: (Product & { images: { url: string }[] })) => ({
      name: product.name,
      amount: Math.round(product.price * 100),
      quantity: 1,
      description: product.name,
      // Trying both common field names for images in checkout UIs
      image: product.images[0]?.url,
      image_url: product.images[0]?.url,
    }));

    const body = {
      ...paymentData,
      items, // Use our constructed items
      notification_url:
        `${process.env.NEXT_PUBLIC_BACKEND_STORE_URL}/api/stores/${storeId}/webhook`,
      payment_methods: [4900588],
      redirection_url: `${process.env.FRONTEND_STORE_URL}/success`,
    };

    const response = await axios.post(
      "https://accept.paymob.com/v1/intention/",
      body,
      {
        headers: {
          Authorization: `Token ${PAYMOB_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const { client_secret } = response.data;
    const payment_url = `https://accept.paymob.com/unifiedcheckout/?publicKey=${process.env.PAYMOB_PUBLIC_KEY}&clientSecret=${client_secret}`;
    console.log(response.data);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const order = await prismadb.order.create({
      data: {
        storeId: storeId,
        isPaid: false,
        orderItems: {
          create: productIds
            .filter((id: any) => typeof id === 'string' && id.length > 0)
            .map((productId: string) => ({
              productId: productId,
            })),
        },
        phone: paymentData?.billing_data?.phone_number || "",
        address: `Street: ${paymentData?.billing_data?.street || ""}, Building: ${paymentData?.billing_data?.building || ""}, Apartment: ${paymentData?.billing_data?.apartment || ""}, Floor: ${paymentData?.billing_data?.floor || ""}, ${paymentData?.billing_data?.state || ""}, ${paymentData?.billing_data?.country || ""}`,
      },
    });

    console.log("Order created:", order);
    // order id:
    console.log("Order ID: ", order.id)

    return NextResponse.json(
      {
        payment_url,
        orderId: order.id,
      },
      { status: 200 }
    );
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      console.error(
        "Error in processing payment intention:",
        axiosError.response?.data || axiosError.message
      );
      return NextResponse.json(
        { error: "Failed to create payment intention" },
        { status: 500 }
      );
    }
    console.error("GENERIC_CHECKOUT_ERROR", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
