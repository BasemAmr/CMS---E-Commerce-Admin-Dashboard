"use client";

import { DataTable } from "@/components/ui/data-table";
import { useBillboards } from "@/hooks/api/use-billboard";
import { billboardCols } from "./columns";
import { BillboardHeader } from "./header";

export const BillboardList = ({ storeId }: { storeId: string }) => {
  const { data: billboards, isLoading } = useBillboards(storeId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      <BillboardHeader storeId={storeId} count={billboards?.length ?? 0} />
      <DataTable
        columns={billboardCols}
        data={billboards ?? []}
        searchKey="label"
      />
    </div>
  );
};
