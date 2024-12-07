import ImageKit from "imagekit"
import { NextResponse, NextRequest } from "next/server";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_URL_ENDPOINT!,
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(request) {
  return NextResponse.json(imagekit.getAuthenticationParameters());
}