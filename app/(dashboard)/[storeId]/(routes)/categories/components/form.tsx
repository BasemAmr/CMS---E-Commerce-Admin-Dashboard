"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { useCreateCategory, useUpdateCategory, useDeleteCategory, useCategories } from "@/hooks/api/use-category";
import { useBillboards } from "@/hooks/api/use-billboard";

// Types
interface CategoryFormProps {
  initialData?: string;
  storeId: string;
}

// Schema
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  billboardId: z.string({
    required_error: "Please select Billboard.",
  }),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const CategoryForm = ({ initialData, storeId }: CategoryFormProps) => {
  const router = useRouter();
  const [alertOpen, setAlertOpen] = useState(false);
  const isEditing = initialData !== "new" ? Boolean(initialData) : false;

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory(storeId);
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory(storeId);
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory({
    storeId,
    categoryId: initialData || "",
    onSuccess: () => {
      toast.success("Category deleted successfully");
      router.push(`/${storeId}/categories`);
    },
  });

  const { data: billboards, isLoading } = useBillboards(storeId)
  const { data: categories } = useCategories(storeId);

  const category = categories && categories.find((b) => b.id === initialData);


  const form = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: category || {
      name: "",
      billboardId: "",
    },
  });

  const redirectToCategories = () => {
    router.push(`/${storeId}/categories`);
  };

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (isEditing && category) {
        await updateCategory({ id: category.id, data });
        toast.success("Category updated successfully, you will be redirected shortly");
      } else {
        await createCategory(data);
        toast.success("Category created successfully, you will be redirected shortly");
      }
      setTimeout(redirectToCategories, 200);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={() => deleteCategory()}
        loading={isDeleting}
        title="Are you sure?"
        description="Are you sure you want to delete this Category?"
      />
      <div className="flex justify-between px-4 items-center">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Category" : "New Category"}
        </h1>
        {isEditing && (
          <Button variant="destructive" onClick={() => setAlertOpen(true)} size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Billboard" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {!isLoading ? (billboards?.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))) 
                    : (
                      <SelectItem value="" disabled>
                        Loading...
                      </SelectItem>
                    )
                    }
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
            type="submit" 
            className="ml-auto" 
            disabled={ isCreating || isUpdating}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;
