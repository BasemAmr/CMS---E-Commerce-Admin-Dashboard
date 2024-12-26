"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductHeaderProps {
  storeId: string;
  count: number;
}

export const ProductHeader = ({ storeId, count }: ProductHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-6 w-full py-8">
      <Heading
        title={`Products (${count})`}
        description="Manage your products"
      />
      <Button onClick={() => router.push(`/${storeId}/products/new`)}>
        <Plus className="mr-2 h-4 w-4" />
        Add New
      </Button>
    </div>
  );
};