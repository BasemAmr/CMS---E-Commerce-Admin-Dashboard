"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
;
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import AlertModal from "@/components/modals/alert-modal";
import Heading from "@/components/ui/heading";
import {Separator} from "@/components/ui/separator";
import { ProductCols } from "./columns";
import { Size, Color, Category, Image } from "@prisma/client";
import { Trash } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import { publicKey, urlEndpoint, authenticator } from "@/lib/i-kit-auth";
import { ImageKitProvider } from "imagekitio-next";
import revalidateTagAction from "@/lib/revalidate-tags";

const formSchema = z.object({
  name: z.string().nonempty(),
  price: z.coerce.number().positive(),
  sizeIds: z.array(z.string().nonempty()),
  colorIds: z.array(z.string().nonempty()),
  categoryId: z.string().nonempty(),
  images: z.array(z.string().nonempty()),
  isFeatured: z.boolean().optional(),
  isArchived: z.boolean().optional(),
});

interface ProductFormProps {
  initialData: ProductCols | null;
  sizes: Size[];
  colors: Color[];
  categories: Category[];
  storeId: string;
}

const ProductForm = ({
  initialData,
  storeId,
  sizes,
  colors,
  categories,
}: ProductFormProps) => {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      price: initialData?.price || 0,
      sizeIds: initialData?.sizes?.map((size: Size) => size.id) || [],
      colorIds: initialData?.colors?.map((color: Color) => color.id) || [],
      categoryId: initialData?.category?.id || "",
      images: initialData?.images?.map((img: Image) => img.url) || [],
      isFeatured: initialData?.isFeatured || false,
      isArchived: initialData?.isArchived || false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (isEditing && initialData) {
        const response = await fetch(`/${process.env.NEXT_PUBLIC_BACKEND_STORE_URL}/api/stores/${storeId}/products/${initialData.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          next: { tags: [`product-${initialData.id}`] }
        });

        if (!response.ok) throw new Error('Failed to update product');
        
        revalidateTagAction('products');
        revalidateTagAction(`product-${initialData.id}`);
        
        toast.success("Product updated successfully, you will be redirected shortly");
        setTimeout(() => {
          window.location.assign(`/${storeId}/products`);
        }, 2000);
      } else {
        const response = await fetch(`/${process.env.NEXT_PUBLIC_BACKEND_STORE_URL}/api/stores/${storeId}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          next: { tags: ['products'] }
        });

        if (!response.ok) throw new Error('Failed to create product');
        
        revalidateTagAction('products');
        
        toast.success("Product created successfully, you will be redirected shortly");
        setTimeout(() => {
          window.location.assign(`/${storeId}/products`);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/${process.env.NEXT_PUBLIC_BACKEND_STORE_URL}/api/stores/${storeId}/products/${initialData?.id}`, {
        method: 'DELETE',
        next: { tags: [`product-${initialData?.id}`] }
      });

      if (!response.ok) throw new Error('Failed to delete product');

      revalidateTagAction('products');
      revalidateTagAction(`product-${initialData?.id}`);
      
      toast.success("Product deleted successfully");
      router.push(`/${storeId}/products`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
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
                        {categories.map((category) => (
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
                    {sizes.map((size) => (
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
                    {colors.map((color) => (
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
                        initialData ? form.getValues('images') : []
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
          <Button type="submit" className="ml-auto" disabled={loading}>
            {isEditing ? "Update" : "Create"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProductForm;