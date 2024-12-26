
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import DialogProvider from "@/providers/modal-provider";
import StoreModal from "@/components/modals/store-modal";
import { Toaster } from "@/components/ui/sonner";
import { ClerkProvider } from "@clerk/nextjs";
import  ReactQueryProvider  from "@/providers/react-query-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <ReactQueryProvider>
              <DialogProvider>
                <StoreModal />
              </DialogProvider>
              {children}
              <Toaster />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}