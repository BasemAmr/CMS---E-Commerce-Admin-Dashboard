"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useCreateBillboard,
  useUpdateBillboard,
  useDeleteBillboard,
  useBillboards,
} from "@/hooks/api/use-billboard";
import * as z from "zod";
import { useState } from "react";
import { toast } from "sonner";
import { ImageKitProvider } from "imagekitio-next";
import { publicKey, urlEndpoint, authenticator } from "@/lib/i-kit-auth";
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
import ImageUpload from "@/components/ui/ImageUpload";
import { Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";

// Types
interface BillboardFormProps {
  initialData?: string;
  storeId: string;
}

// Schema
const billboardSchema = z.object({
  label: z.string().nonempty("Label is required"),
  imageUrl: z.string().nonempty("Image is required"),
});

type BillboardFormData = z.infer<typeof billboardSchema>;

export const BillboardForm = ({ initialData, storeId }: BillboardFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const isEditing = initialData !== "new" ? Boolean(initialData) : false;

  const { mutate: createBillboard, isPending: isCreating } =
    useCreateBillboard(storeId);
  const { mutate: updateBillboard, isPending: isUpdating } =
    useUpdateBillboard(storeId);
  const { mutate: deleteBillboard, isPending: isDeleting } = useDeleteBillboard({
    storeId,
    billboardId: initialData || "",
    onSuccess: () => {
      toast.success("Billboard deleted successfully");
      router.push(`/${storeId}/billboards`);
    },
  });

  const { data: billboards } = useBillboards(storeId);
  const billboard = billboards?.find((b) => b.id === initialData);

  const form = useForm<BillboardFormData>({
    resolver: zodResolver(billboardSchema),
    defaultValues: billboard || {
      label: "",
      imageUrl: "",
    },
  });

  const handleImageSuccess = (urls: string[]) => {
    form.setValue("imageUrl", urls[0]);
  };

  const handleImageRemove = () => {
    form.setValue("imageUrl", "");
  };

  const redirectToBillboards = () => {
    router.push(`/${storeId}/billboards`);
  };

  const onSubmit = async (data: BillboardFormData) => {
    try {
      if (isEditing && billboard) {
        await updateBillboard({ id: billboard.id, data });
        toast.success(
          "Billboard updated successfully, you will be redirected shortly"
        );
      } else {
        await createBillboard(data);
        toast.success(
          "Billboard created successfully, you will be redirected shortly"
        );
      }

      setTimeout(redirectToBillboards, 200);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const renderImageUpload = () => (
    <ImageKitProvider
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <FormField
        control={form.control}
        name="imageUrl"
        render={() => (
          <FormItem>
            <FormLabel>Image</FormLabel>
            <FormControl>
              <ImageUpload
                onSuccess={handleImageSuccess}
                onRemove={handleImageRemove}
                existingImages={
                  form.getValues("imageUrl") ? [form.getValues("imageUrl")] : []
                }
                setFormLoading={setLoading}
                multiple={false}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </ImageKitProvider>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Billboard" : "New Billboard"}
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
        onConfirm={deleteBillboard}
        loading={isDeleting}
        title="Are you sure?"
        description="Are you sure you want to delete this Billboard?"
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {renderImageUpload()}
          </div>

          <Button
            type="submit"
            className="ml-auto"
            disabled={loading || isCreating || isUpdating}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
