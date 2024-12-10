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

import ImageUpload from '@/components/ui/ImageUpload';
import { ImageKitProvider } from 'imagekitio-next';
import { publicKey, urlEndpoint, authenticator } from '@/lib/i-kit-auth';
import { Billboard } from '@prisma/client';
import { Trash } from 'lucide-react';
import { useState } from 'react';
import AlertModal from '@/components/modals/alert-modal';

const formSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  imageUrl: z.string().url('Invalid URL'),
});

interface BillboardFormProps {
  initialData: Billboard | null;
  storeId: string;
}

const BillboardForm = ({ initialData, storeId }: BillboardFormProps) => {
  const router = useRouter();
  const isEditing = Boolean(initialData);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: initialData?.label || '',
      imageUrl: initialData?.imageUrl || '',
    },
  });

  const handleImageSuccess = (urls: string[]) => {
    form.setValue('imageUrl', urls[0][0]);
  };

  const handleImageRemove = () => {
    form.setValue('imageUrl', '');
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      if (isEditing && initialData) {
        await axios.patch(`/api/stores/${storeId}/billboards/${initialData.id}`, data);
        toast.success('Billboard updated successfully, you will be redirected shortly');
        setTimeout(() => {
           window.location.assign(`/${storeId}/billboards`);
        } , 2000);

      } else {

        const res = await axios.post(`/api/stores/${storeId}/billboards`, data);
        console.log(res);
        toast.success('Billboard created successfully, you will be redirected shortly');
        setTimeout(() => {
           window.location.assign(`/${storeId}/billboards`);
        } , 2000);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save billboard');
    } finally {
      setLoading(false);
    }
  };

   const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${storeId}/billboards/${initialData?.id}`);
      toast.success('Billboard deleted successfully');
      router.push(`/${storeId}/billboards`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete billboard');
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
        description="Are you sure you want to delete this Billboard?"
      />
      <div className="flex justify-between px-4 items-center">
        
        <Heading
          title={isEditing ? 'Edit Billboard' : 'Create Billboard'}
          description={
            isEditing ? 'Update your billboard details' : 'Add a new billboard'
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
                        form.getValues('imageUrl') ? [form.getValues('imageUrl')]: []
                      } 
                      setFormLoading={
                        setLoading
                      }
                      multiple={false} 
                    />
                    </FormControl>
                    <FormMessage  />
                  </FormItem>
                )}
              />
            </ImageKitProvider>
          </div>

          <Button type="submit" className="ml-auto" disabled={loading}>
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default BillboardForm;