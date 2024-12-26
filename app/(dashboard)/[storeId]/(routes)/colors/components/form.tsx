"use client";

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { useCreateColor, useUpdateColor, useDeleteColor, useColors } from '@/hooks/api/use-color';

const formSchema = z.object({
  name: z.string().nonempty("Name is required"),
  value: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, "Invalid HEX color code"),
});

interface ColorFormProps {
  initialData: string | null;
  storeId: string;
}

const ColorForm = ({ initialData, storeId }: ColorFormProps) => {
  const router = useRouter();
  const isEditing = initialData !== "new" ? Boolean(initialData) : false
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);

  const { mutate: createColor } = useCreateColor(storeId);
  const { mutate: updateColor } = useUpdateColor(storeId);
  const { mutate: deleteColor } = useDeleteColor({
    storeId,
    colorId: initialData || '',
    onSuccess: () => {
      toast.success('Color deleted successfully');
      router.push(`/${storeId}/colors`);
    },
  });

  const {data: colors} = useColors(storeId)
  const color = colors && colors.find((b) => b.id === initialData)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: color || { name: '', value: '' },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (isEditing && color) {
        updateColor({ id: color?.id, data });
        toast.success('Color updated successfully');
      } else {
        createColor(data);
        toast.success('Color created successfully');
      }
      router.push(`/${storeId}/colors`);
    } catch (error) {
      toast.error('Failed to save color');
      console.error(error)
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    setLoading(true);
    try {
      deleteColor();
    } catch (error) {
      toast.error('Failed to delete color');
      console.error(error)
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
          description={isEditing ? 'Update your color details' : 'Add a new color'}
        />
        {isEditing && (
          <Button variant="destructive" onClick={() => setAlertOpen(true)} size="icon">
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
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