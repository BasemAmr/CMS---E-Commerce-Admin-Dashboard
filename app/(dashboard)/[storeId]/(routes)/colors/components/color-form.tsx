"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';

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
import AlertModal from '@/components/modals/alert-modal';
import { Trash } from 'lucide-react';
import { ChromePicker } from  '@/components/ChromePicker';
import { Color } from '@prisma/client';

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  value: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid HEX color code"),
});

interface ColorFormProps {
  initialData: Color | null;
  storeId: string;
}

const ColorForm = ({ initialData, storeId }: ColorFormProps) => {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      value: initialData?.value || '#ffffff', // Default color
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (isEditing && initialData) {
        await axios.patch(`/api/stores/${storeId}/colors/${initialData.id}`, data);
        toast.success('Color updated successfully, you will be redirected shortly');
        setTimeout(() => {
          router.push(`/${storeId}/colors`);
        }, 2000);
      } else {
        const res = await axios.post(`/api/stores/${storeId}/colors`, data);
        console.log(res);
        toast.success('Color created successfully, you will be redirected shortly');
        setTimeout(() => {
          router.push(`/${storeId}/colors`);
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save color');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${storeId}/colors/${initialData?.id}`);
      toast.success('Color deleted successfully');
      router.push(`/${storeId}/colors`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete color');
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <AlertModal 
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        title="Are you sure?"
        description="Are you sure you want to delete this color?"
      />
      <div className="flex justify-between px-4 items-center">
        <Heading
          title={isEditing ? 'Edit Color' : 'Create Color'}
          description={
            isEditing ? 'Update your color details' : 'Add a new color'
          }
        />
        {isEditing && (
          <Button variant="destructive" onClick={() => setAlertOpen(true)} size="icon">
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
                  <FormLabel>Color Name</FormLabel>
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
                  <FormLabel>Color Value</FormLabel>
                  <FormControl>
                    <ChromePicker
                      color={field.value}
                      onChange={(color) => field.onChange(color.hex)}
                      onChangeComplete={(color) => field.onChange(color.hex)}
                    />
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

export default ColorForm;