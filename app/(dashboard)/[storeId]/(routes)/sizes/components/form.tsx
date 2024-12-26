"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useCreateSize,
  useUpdateSize,
  useDeleteSize,
  useSizes,
} from "@/hooks/api/use-size";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";

interface SizeFormProps {
  initialData?: string;
  storeId: string;
}

const sizeSchema = z.object({
  name: z.string().nonempty("Name is required"),
  value: z.string().nonempty("Value is required"),
});

type SizeFormData = z.infer<typeof sizeSchema>;

export const SizeForm = ({ initialData, storeId }: SizeFormProps) => {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const isEditing = initialData !== "new" ? Boolean(initialData) : false;

  const { mutate: createSize, isPending: isCreating } = useCreateSize(storeId);
  const { mutate: updateSize, isPending: isUpdating } = useUpdateSize(storeId);
  const { mutate: deleteSize, isPending: isDeleting } = useDeleteSize({
    storeId,
    sizeId: initialData || "",
    onSuccess: () => {
      toast.success("Size deleted successfully");
      router.push(`/${storeId}/sizes`);
    },
  });

  const { data: sizes } = useSizes(storeId);
  const size = sizes?.find((s) => s.id === initialData);

  const form = useForm<SizeFormData>({
    resolver: zodResolver(sizeSchema),
    defaultValues: size || {
      name: "",
      value: "",
    },
  });

  const onSubmit = async (data: SizeFormData) => {
    try {
      if (isEditing && size) {
        await updateSize({ id: size.id, data });
        toast.success("Size updated successfully");
      } else {
        await createSize(data);
        toast.success("Size created successfully");
      }
      router.push(`/${storeId}/sizes`);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Size" : "New Size"}
        </h1>
        {isEditing && (
          <Button
            variant="ghost"
            onClick={() => setAlertOpen(true)}
            size="icon"
            disabled={isDeleting}
          >
            <Trash className="cursor-pointer w-4 h-4 text-red-500" />
          </Button>
        )}
      </div>
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={deleteSize}
        loading={isDeleting}
        title="Are you sure?"
        description="Are you sure you want to delete this size?"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="ml-auto"
            disabled={isCreating || isUpdating}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};