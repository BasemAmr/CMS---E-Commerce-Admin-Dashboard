"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Pen, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/alert-modal";
import { useDeleteSize } from "@/hooks/api/use-size";

interface SizeActionsProps {
  id: string;
  storeId: string;
}

export const SizeActions = ({ id, storeId }: SizeActionsProps) => {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);

  const { mutate: deleteSize, isPending } = useDeleteSize({
    storeId,
    sizeId: id,
    onSuccess: () => {
      toast.success("Size deleted successfully");
      router.refresh();
      setAlertOpen(false);
    },
  });

  const onCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success("Size ID copied to clipboard");
  };

  return (
    <div className="flex gap-4 items-center">
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={deleteSize}
        loading={isPending}
        title="Are you sure?"
        description="Are you sure you want to delete this size?"
      />
      <Button
        variant="ghost"
        onClick={() => router.push(`sizes/${id}`)}
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