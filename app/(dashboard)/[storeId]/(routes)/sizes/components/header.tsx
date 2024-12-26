"use client";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

interface SizeHeaderProps {
  storeId: string;
  count: number;
}

export const SizeHeader = ({ storeId, count }: SizeHeaderProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between px-6 w-full py-8">
      <Heading
        title={`Sizes (${count})`}
        description="Manage your sizes"
      />
      <Button onClick={() => router.push(`/${storeId}/sizes/new`)}>
        <Plus className="mr-2 h-4 w-4" />
        Add New
      </Button>
    </div>
  );
};