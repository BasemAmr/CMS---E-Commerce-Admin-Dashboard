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
import { Input } from '@/components/ui/input';


import { Size } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import AlertModal from '@/components/modals/alert-modal';

const formSchema = z.object({
  name: z.string().nonempty(),
  value: z.string().nonempty(),
});

interface SizeFormProps {
  initialData: Size | null;
  storeId: string;
}

const SizeForm = ({ initialData, storeId }: SizeFormProps) => {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      value: initialData?.value || '',
    },
  });

  

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (isEditing && initialData) {
        await axios.patch(`/api/stores/${storeId}/sizes/${initialData.id}`, data);
        toast.success('size updated successfully, you will be redirected shortly');
        setTimeout(() => {
           window.location.assign(`/${storeId}/sizes`);
        } , 2000);

      } else {

        const res = await axios.post(`/api/stores/${storeId}/sizes`, data);
        console.log(res);
        toast.success('size created successfully, you will be redirected shortly');
        setTimeout(() => {
           window.location.assign(`/${storeId}/sizes`);
        } , 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save size');
    } finally {
      setLoading(false);
    }
  };

   const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${storeId}/sizes/${initialData?.id}`);
      toast.success('size deleted successfully');
      router.push(`/${storeId}/sizes`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete size');
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
        description="Are you sure you want to delete this size?"
      />
      <div className="flex justify-between px-4 items-center">
        
        <Heading
          title={isEditing ? 'Edit size' : 'Create size'}
          description={
            isEditing ? 'Update your size details' : 'Add a new size'
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
                  <FormLabel>Size name</FormLabel>
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
                  <FormLabel>Size value</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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

export default SizeForm;