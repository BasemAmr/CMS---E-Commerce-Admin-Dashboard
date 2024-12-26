"use client";

import { DataTable } from "@/components/ui/data-table";
import { useCategories } from "@/hooks/api/use-category";
import { categoriesCols } from "./columns";
import { CategoryHeader } from "./header";

export const CategoryList = ({ storeId }: { storeId: string }) => {
  const { data: categories, isLoading } = useCategories(storeId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <CategoryHeader storeId={storeId} count={categories?.length ?? 0} />
      <DataTable
        columns={categoriesCols}
        data={categories ?? []}
        searchKey="name"
      />
    </div>
  );
};
