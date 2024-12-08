"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import Heading from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
 
import { Input } from '@/components/ui/input';

import {  Billboard } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import AlertModal from '@/components/modals/alert-modal';
import { categoryPopulateBillboards } from './columns';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  billboardId: z
    .string({
      required_error: "Please select Billboard.",
    })

});

interface CategoryFormProps {
  initialData: categoryPopulateBillboards | null;
  billboards: Billboard[];
  storeId: string;
}

const CategoryForm = ({ initialData, storeId, billboards }: CategoryFormProps) => {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      billboardId: initialData?.billboards.id || '',
    },
  });


  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (isEditing && initialData) {
        await axios.patch(`/api/stores/${storeId}/categories/${initialData.id}`, data);
        toast.success('Category updated successfully, you will be redirected shortly');
        setTimeout(() => {
           window.location.assign(`/${storeId}/categories`);
        } , 2000);

      } else {

        const res = await axios.post(`/api/stores/${storeId}/categories`, data);
        console.log(res);
        toast.success('Category created successfully, you will be redirected shortly');
        setTimeout(() => {
           window.location.assign(`/${storeId}/categories`);
        } , 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save Category');
    } finally {
      setLoading(false);
    }
  };

   const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${storeId}/categories/${initialData?.id}`);
      toast.success('Category deleted successfully');
      router.push(`/${storeId}/categories`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete Category');
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  }

  return (
    <div className="flex flex-col space-y-4">
            <AlertModal 
        isOpen={alertOpen}
        onClose={
          () => {
            setAlertOpen(false)
          }
        }
        onConfirm = {
          () => {
            onDelete()
          }
        }
        loading={loading}
        title="Are you sure?"
        description="Are you sure you want to delete this Category?"
      />
      <div className="flex justify-between px-4 items-center">
        
        <Heading
          title={isEditing ? 'Edit Category' : 'Create Category'}
          description={
            isEditing ? 'Update your Category details' : 'Add a new Category'
          }
        />
        {isEditing && (
          <Button variant="destructive" onClick={
            () => {
              setAlertOpen(true)
            }
          } size="icon">
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
                  {billboards.map((billboard) => (
                    <SelectItem key={billboard.id} value={billboard.id}>
                      {billboard.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

            
          </div>

          <Button type="submit" className="ml-auto" disabled={loading}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CategoryForm;