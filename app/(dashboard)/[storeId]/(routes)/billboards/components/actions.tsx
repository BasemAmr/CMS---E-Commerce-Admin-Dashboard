"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Pen, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import  AlertModal  from "@/components/modals/alert-modal";
import { useDeleteBillboard } from "@/hooks/api/use-billboard";

interface BillboardActionsProps {
  id: string;
  storeId: string;
}

export const BillboardActions = ({ id, storeId }: BillboardActionsProps) => {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);

  const { mutate: deleteBillboard, isPending } = useDeleteBillboard({
    storeId,
    billboardId: id,
    onSuccess: () => {
      toast.success("Billboard deleted successfully");
      router.refresh();
      setAlertOpen(false);
    },
  });

  const onCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success("Billboard ID copied to clipboard");
  };

  return (
    <div className="flex gap-4 items-center">
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={deleteBillboard}
        loading={isPending}
        title="Are you sure?"
        description="Are you sure you want to delete this Billboard?"
      />
      <Button
        variant="ghost"
        onClick={() => router.push(`billboards/${id}`)}
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
