import prismadb from "@/lib/prismadb";
import React from "react";
import { Separator } from "@radix-ui/react-separator";
import ProductForm from "../components/products-form";

interface ProductPageProps {
  params: Promise<{
    productId: string;
    storeId: string;
  }>;
}
const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId, storeId } = await params;

  const product =
    (await prismadb.product.findFirst({
      where: {
        id: productId,
      },
      include: {
        category: true,
        sizes: true,
        colors: true,
        images: true,
      },
    })) || null;

  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
    storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
    storeId,
    },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} storeId={storeId} 
            categories={categories} sizes={sizes} colors={colors}
        />
        <Separator />
      </div>
    </div>
  );
};

export default ProductPage;
