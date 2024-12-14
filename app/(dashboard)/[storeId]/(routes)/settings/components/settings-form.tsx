"use client";

import { Store } from '@prisma/client'
import React, { useState } from 'react'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { toast } from "sonner"
import { useParams, useRouter } from "next/navigation"

import Heading from '@/components/ui/heading'
import { Button } from '@/components/ui/button'
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Trash } from 'lucide-react'
import AlertModal from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';
import { useOrigin } from '@/hooks/use-origin';

const formSchema = z.object({
  name: z.string().min(2, "Store name must be at least 2 characters"),
})

type SettingsFormValues = z.infer<typeof formSchema>

interface SettingsFormProps {
  initialData: Store
}

const SettingsForm = ({
  initialData
}: SettingsFormProps) => {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)
  const origin = useOrigin()
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
    }
  })

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true)
      await axios.patch(`/api/stores/${params.storeId}`, data)
      router.refresh()
      toast.success("Store updated successfully")
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const onDelete = async () => {



    try {
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.refresh()
      router.push('/')
      toast.success('Store deleted successfully')
      
    } catch (error) {
      toast.error('Make sure you removed all products and categories first')
      console.error(error)
    } finally {
      setLoading(false)
      setAlertOpen(false)
    }
  }

  return (
    <>

      <AlertModal 
        isOpen={alertOpen}
        onClose={
          () => {
            setAlertOpen(false)
          }
        }
        onConfirm={
          () => {
            onDelete()
          }
        }
        loading={loading}
        title="Are you sure?"
        description="Are you sure you want to delete this store?"
      />

      <div className="flex items-center justify-between">
        <Heading 
          title="Settings" 
          description="Update your store settings"
        />
        <Button
          disabled={loading}
          variant="destructive"
          size="icon"
          onClick={
            () => {
              setAlertOpen(true)
            }
          }
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator className="my-4" />
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
                  <FormLabel>Store Name</FormLabel>
                  <FormControl>
                    <Input 
                      disabled={loading} 
                      placeholder="Store name" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button 
            disabled={loading}
            className="ml-auto"
            type="submit"
          >
            Save changes
          </Button>
        </form>
      </Form>

      <Separator className="my-4" />
      <ApiAlert 
        title='NEXT_PUBLIC_API_URL'
        description={`${origin}/api/stores/${params.storeId}`}
        variant='public'
      />

    </>
  )
}

export default SettingsForm