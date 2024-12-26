"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
  useProducts,
} from "@/hooks/api/use-product";
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
  FormDescription
} from "@/components/ui/form";
import {Separator} from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import AlertModal from "@/components/modals/alert-modal";
import {  Color, Product, Size } from "@prisma/client";
import ImageUpload from "@/components/ui/ImageUpload";
import { publicKey, urlEndpoint, authenticator } from "@/lib/i-kit-auth";
import { ImageKitProvider } from "imagekitio-next";
import Heading from "@/components/ui/heading";
import { categoryPopulateBillboards } from "../../categories/components/columns";


interface ProductFormProps {
  initialData?: string;
  storeId: string;
  sizes?: Size[];
  colors?: Color[];
  categories?: categoryPopulateBillboards[];
}

const productSchema = z.object({
  name: z.string().nonempty("Name is required"),
  price: z.number().positive("Price must be positive"),
  sizeIds: z.array(z.string().nonempty()),
  colorIds: z.array(z.string().nonempty()),
  categoryId: z.string().nonempty("Category is required"),
  images: z.array(z.string().nonempty("Image is required")),
  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export const ProductForm = ({
  initialData,
  storeId,
  sizes,
  colors,
  categories,
}: ProductFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const isEditing = initialData !== "new" ? Boolean(initialData) : false;

  const { mutate: createProduct, isPending: isCreating } =
    useCreateProduct(storeId);
  const { mutate: updateProduct, isPending: isUpdating } =
    useUpdateProduct(storeId);
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct({
    storeId,
    productId: initialData || "",
    onSuccess: () => {
      toast.success("Product deleted successfully");
    },
  });

  const { data: products } = useProducts(storeId);
  const product = products?.find((p) => p.id === initialData);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product as Product || {
      name: "",
      price: 0,
      sizeIds: [],
      colorIds: [],
      categoryId: "",
      images: [],
      isFeatured: false,
      isArchived: false,
    },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (isEditing && product) {
        await updateProduct({ id: product.id, data });
        toast.success(
          "Product updated successfully, you will be redirected shortly"
        );
      } else {
        await createProduct(data);
        toast.success(
          "Product created successfully, you will be redirected shortly"
        );
      }

      setTimeout(() => router.push(`/${storeId}/products`), 200);
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await deleteProduct();
      router.push(`/${storeId}/products`);
    } catch (error) {
      toast.error("Failed to delete product");
      console.error(error);
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  const handleImageSuccess = (urls: string[]) => {
    form.setValue('images', urls);
  };

  const handleImageRemove = (urls: string[]) => {
    form.setValue('images', urls);
  };

  return (
    <div className="flex flex-col space-y-4">
      <AlertModal
        isOpen={alertOpen}
        onClose={() => {
          setAlertOpen(false);
        }}
        onConfirm={onDelete}
        loading={loading}
        title="Are you sure?"
        description="Are you sure you want to delete this Product?"
      />
      <div className="flex justify-between px-4 items-center">
        <Heading
          title={isEditing ? "Edit product" : "Create product"}
          description={
            isEditing ? "Update your product details" : "Add a new product"
          }
        />
        {isEditing && (
          <Button
            variant="destructive"
            onClick={() => {
              setAlertOpen(true);
            }}
            size="icon"
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Product price" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Category Field */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Sizes Field */}
            <FormField
              control={form.control}
              name="sizeIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <FormDescription>Select available sizes</FormDescription>
                  <div className="flex flex-wrap items-start gap-4">
                    {sizes?.map((size) => (
                      <FormField
                        key={size.id}
                        control={form.control}
                        name="sizeIds"
                        render={() => {
                          const checked = field.value?.includes(size.id);
                          return (
                            <FormItem
                              key={size.id}
                              className="flex items-center space-x-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([...field.value, size.id]);
                                    } else {
                                      field.onChange(
                                        field.value.filter((id) => id !== size.id)
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel>{size.name}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Colors Field */}
            <FormField
              control={form.control}
              name="colorIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Colors</FormLabel>
                  <FormDescription>Select available colors</FormDescription>
                  <div className="flex flex-wrap items-start gap-4">
                    {colors?.map((color) => (
                      <FormField
                        key={color.id}
                        control={form.control}
                        name="colorIds"
                        render={() => {
                          const checked = field.value?.includes(color.id);
                          return (
                            <FormItem
                              key={color.id}
                              className="flex items-center space-x-3"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={checked}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      field.onChange([
                                        ...field.value,
                                        color.id,
                                      ]);
                                    } else {
                                      field.onChange(
                                        field.value.filter(
                                          (id) => id !== color.id
                                        )
                                      );
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel>{color.name}</FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between px-4 items-center">
              {/* isFeatured Field */}
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Featured</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* isArchived Field */}
              <FormField
                control={form.control}
                name="isArchived"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Archived</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
            </div>
            {/* Image Upload Field */}
              <ImageKitProvider
              publicKey={publicKey}
              urlEndpoint={urlEndpoint}
              authenticator={authenticator}
            >
              <FormField
                control={form.control}
                name="images"
                render={() => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormControl>
                    <ImageUpload
                      onSuccess={
                        (urls) => handleImageSuccess(urls)
                      } 
                      onRemove={
                        (urls) => handleImageRemove(urls)
                      }
                      existingImages={
                        isEditing ? form.getValues('images') : []
                      } 
                      setFormLoading={
                        (loading) => setLoading(loading)
                      }
                      multiple={true} 
                    />
                    </FormControl>
                    <FormMessage  />
                    {
                        !form.getValues('images') && (
                            <p 
                                className="text-sm text-gray-500"
                            >
                                Image will not be uploaded if more than 10MB
                            </p>
                        )
                    }
                  </FormItem>
                )}
              />
            </ImageKitProvider>

                
          </div>
          <Button
            type="submit"
            className="ml-auto"
            disabled={loading || isCreating || isUpdating || isDeleting}
          >
            {isEditing ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};