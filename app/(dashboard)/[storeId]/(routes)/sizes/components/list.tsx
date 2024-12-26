"use client";

import { DataTable } from "@/components/ui/data-table";
import { useSizes } from "@/hooks/api/use-size";
import { sizeCols } from "./columns";
import { SizeHeader } from "./header";

export const SizeList = ({ storeId }: { storeId: string }) => {
  const { data: sizes, isLoading } = useSizes(storeId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <SizeHeader storeId={storeId} count={sizes?.length ?? 0} />
      <DataTable
        columns={sizeCols}
        data={sizes ?? []}
        searchKey="name"
      />
    </div>
  );
};