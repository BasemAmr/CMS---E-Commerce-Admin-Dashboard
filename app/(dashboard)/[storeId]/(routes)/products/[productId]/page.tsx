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
  console.time("fetchProduct");
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
  console.timeEnd("fetchProduct");
  return product;
}

async function fetchCategories(storeId: string) {
  console.time("fetchCategories");
  const categories = await prismadb.category.findMany({
    where: {
      storeId,
    },
  });
  console.timeEnd("fetchCategories");
  return categories;
}

async function fetchSizes(storeId: string) {
  console.time("fetchSizes");
  const sizes = await prismadb.size.findMany({
    where: {
      storeId,
    },
  });
  console.timeEnd("fetchSizes");
  return sizes;
}

async function fetchColors(storeId: string) {
  console.time("fetchColors");
  const colors = await prismadb.color.findMany({
    where: {
      storeId,
    },
  });
  console.timeEnd("fetchColors");
  return colors;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId, storeId } = await params;

  console.time("fetchProductData");
  const product =
    productId === "new" ? null : (await fetchProduct(productId)) || null;
  console.timeEnd("fetchProductData");

  console.time("fetchCategoriesData");
  const categories = await fetchCategories(storeId);
  console.timeEnd("fetchCategoriesData");

  console.time("fetchSizesData");
  const sizes = await fetchSizes(storeId);
  console.timeEnd("fetchSizesData");

  console.time("fetchColorsData");
  const colors = await fetchColors(storeId);
  console.timeEnd("fetchColorsData");

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
