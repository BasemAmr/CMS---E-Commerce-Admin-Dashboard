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

async function fetchProduct(productId: string) {
  const product = await prismadb.product.findFirst({
    where: {
      id: productId,
    },
    include: {
      category: true,
      sizes: true,
      colors: true,
      images: true,
    },
  });
  return product;
}

async function fetchCategories(storeId: string) {
  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });
  return categories;
}

async function fetchSizes(storeId: string) {
  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
  });
  return sizes;
}

async function fetchColors(storeId: string) {
  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
  });
  return colors;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId, storeId } = await params;

  const product =
    productId === "new" ? null : (await fetchProduct(productId)) || null;

  const categories = await fetchCategories(storeId);

  const sizes = await  fetchSizes(storeId);

  const colors = await  fetchColors(storeId);

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
