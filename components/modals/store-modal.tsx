"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import axios from "axios";

const formSchema = z.object({
  name: z.string().min(1),
});

export default function StoreModal() {
  const { isOpen, setIsOpen } = useStoreModal();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/stores ", data);
      console.log(response.data);
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create store");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(isOpen) => {
        setIsOpen(!isOpen);
      }}
    >
      <DialogContent aria-describedby="store-modal-description">
        <DialogHeader>
          <DialogTitle>Create a Store</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Create a store to start selling your products.
        </DialogDescription>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Create your store"
                      {...field}
                      disabled={loading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setIsOpen(isOpen)}
                variant={"outline"}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
