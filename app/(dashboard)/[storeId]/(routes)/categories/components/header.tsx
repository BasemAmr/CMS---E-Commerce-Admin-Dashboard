"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const CategoryHeader = (
  {storeId, count}: {storeId:  string, count: number}
) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-6 w-full py-8">
      <Heading
        title={`Categories (${count})`}
        description="Manage your store categories"
      />
      <Button onClick={() => router.push(`/${storeId}/categories/new`)}>
        <Plus className="mr-2 h-4 w-4" />
        Add New
      </Button>
    </div>
  );
};