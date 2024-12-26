"use client";

import { DataTable } from "@/components/ui/data-table";
import { useColors } from "@/hooks/api/use-color";
import { colorColumns } from "./columns";
import { ColorHeader } from "./header";

export const ColorList = ({ storeId }: { storeId: string }) => {
  const { data: colors, isLoading } = useColors(storeId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <ColorHeader storeId={storeId} count={colors?.length ?? 0} />
      <DataTable
        columns={colorColumns}
        data={colors ?? []}
        searchKey="name"
      />
    </div>
  );
};