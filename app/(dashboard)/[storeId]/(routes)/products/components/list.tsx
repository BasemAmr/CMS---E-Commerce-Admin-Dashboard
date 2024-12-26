"use client";

import { DataTable } from "@/components/ui/data-table";
import { useProducts } from "@/hooks/api/use-product";
import { productColumns } from "./columns";
import { ProductHeader } from "./header";

export const ProductList = ({ storeId }: { storeId: string }) => {
  const { data: products, isLoading } = useProducts(storeId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <ProductHeader storeId={storeId} count={products?.length ?? 0} />
      <DataTable
        columns={productColumns}
        data={products ?? []}
        searchKey="name"
      />
    </div>
  );
};