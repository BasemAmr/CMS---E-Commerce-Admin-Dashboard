"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface BillboardHeaderProps {
  storeId: string;
  count: number;
}

export const BillboardHeader = ({ storeId, count }: BillboardHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-6 w-full py-8">
      <Heading
        title={`Billboards (${count})`}
        description="Manage your billboards"
      />
      <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
        <Plus className="mr-2 h-4 w-4" />
        Add New
      </Button>
    </div>
  );
};
