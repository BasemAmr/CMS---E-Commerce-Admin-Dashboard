"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export const ColorHeader = (
  { count, storeId }: { count: number; storeId: string }
) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-6 w-full py-8">
      <Heading
        title={`Colors (${count})`}
        description="Manage your store colors"
      />
      <Button onClick={() => router.push(`/${storeId}/colors/new`)}>
        <Plus className="mr-2 h-4 w-4" />
        Add New
      </Button>
    </div>
  );
};