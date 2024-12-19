import React from "react";
import { Separator } from "@radix-ui/react-separator";
import ProductForm from "../components/products-form";

interface ProductPageProps {
  params: Promise<{
    productId: string;
    storeId: string;
  }>;
}
async function fetchProduct(storeId: string, productId: string) {
  const res = await fetch(`${process.env.BACKEND_STORE_URL}/api/stores/${storeId}/products/${productId}`, {
    next: { tags: [`product-${productId}`] },
    cache: 'force-cache'
  });
  return res.json();
}

async function fetchCategories(storeId: string) {
  const res = await fetch(`${process.env.BACKEND_STORE_URL}/api/stores/${storeId}/categories`, {
    next: { tags: ['categories'] },
    cache: 'force-cache'
  });
  return res.json();
}

async function fetchSizes(storeId: string) {
  const res = await fetch(`${process.env.BACKEND_STORE_URL}/api/stores/${storeId}/sizes`, {
    next: { tags: ['sizes'] },
    cache: 'force-cache'
  });
  return res.json();
}

async function fetchColors(storeId: string) {
  const res = await fetch(`${process.env.BACKEND_STORE_URL}/api/stores/${storeId}/colors`, {
    next: { tags: ['colors'] },
    cache: 'force-cache'
  });
  return res.json();
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId, storeId } = await params;

  const product = productId === "new" ? null : 
    await fetchProduct(storeId, productId);

  const [categories, sizes, colors] = await Promise.all([
    fetchCategories(storeId),
    fetchSizes(storeId),
    fetchColors(storeId)
  ]);

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
