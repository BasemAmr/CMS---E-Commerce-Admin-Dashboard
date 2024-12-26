"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Pen, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/alert-modal";
import { useDeleteProduct } from "@/hooks/api/use-product";

interface ProductActionsProps {
  id: string;
  storeId: string;
}

export const ProductActions = ({ id, storeId }: ProductActionsProps) => {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);

  const { mutate: deleteProduct, isPending } = useDeleteProduct({
    storeId,
    productId: id,
    onSuccess: () => {
      toast.success("Product deleted successfully");
      router.refresh();
      setAlertOpen(false);
    },
  });

  const onCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success("Product ID copied to clipboard");
  };

  return (
    <div className="flex gap-4 items-center">
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={deleteProduct}
        loading={isPending}
        title="Are you sure?"
        description="Are you sure you want to delete this product?"
      />
      <Button
        variant="ghost"
        onClick={() => router.push(`products/${id}`)}
        size="icon"
      >
        <Pen className="cursor-pointer w-4 h-4 text-blue-900" />
      </Button>
      <Button variant="ghost" onClick={onCopy} size="icon">
        <Copy className="cursor-pointer w-4 h-4" />
      </Button>
      <Button variant="ghost" onClick={() => setAlertOpen(true)} size="icon">
        <Trash className="cursor-pointer w-4 h-4 text-red-500" />
      </Button>
    </div>
  );
};