"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Pen, Trash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/alert-modal";
import { useDeleteColor } from "@/hooks/api/use-color";

interface ColorActionsProps {
  id: string;
  storeId: string;
}

export const ColorActions = ({ id, storeId }: ColorActionsProps) => {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);

  const { mutate: deleteColor, isPending } = useDeleteColor({
    storeId,
    colorId: id,
    onSuccess: () => {
      toast.success("Color deleted successfully");
      router.refresh();
    },
  });

  const onCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success("Color ID copied to clipboard");
  };

  return (
    <div className="flex gap-4 items-center">
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={
          () => {
            deleteColor();
            setAlertOpen(false);
          }
        }
        loading={isPending}
        title="Are you sure?"
        description="Are you sure you want to delete this color?"
      />
      <Button
        variant="ghost"
        onClick={() => router.push(`colors/${id}`)}
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