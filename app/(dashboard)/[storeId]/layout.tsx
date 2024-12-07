import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
  params
}: Readonly<{
    children: React.ReactNode;
    params: {storeId: string};
}>) {

    const {userId} = await auth();

    const {storeId} = await params;

    if (!userId) {
        redirect("/sign-in");
    }

    const store = await prismadb.store.findFirst({
        where: {
            id: storeId,
            userId
        }
    });

    if (!store) {
        redirect("/");
    }

    const stores = await prismadb.store.findMany({
        where: {
            userId
        }
    });

  return (
    <div>
        <Navbar stores={stores}
            
        />
        {children}
    </div>
  );
}