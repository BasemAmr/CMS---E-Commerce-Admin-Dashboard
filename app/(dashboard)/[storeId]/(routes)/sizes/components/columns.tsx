"use client"

import { ColumnDef } from "@tanstack/react-table"

import {  Size } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Copy, Pen, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import AlertModal from "@/components/modals/alert-modal"
import { revalidateTag } from "next/cache"

const SizesActions = ({ id }: { id: string }) => {
  const router = useRouter()
  const [alertOpen, setAlertOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  const url = window.location.pathname
  const urlParts = url.split("/") 
  const storeId = urlParts[1]

  const onDelete = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.BACKEND_STORE_URL}/api/stores/${storeId}/sizes/${id}`, {
        method: 'DELETE',
        next: {
          tags: ['sizes', `size-${id}`]
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete size')
      }

      await revalidateTag('sizes')
      await revalidateTag(`size-${id}`)
      
      toast.success('Size deleted successfully')
      router.push(`/${storeId}/sizes`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to delete size')
    } finally {
      setLoading(false)
      setAlertOpen(false)
    }
  }

  return (
    <div className="flex  gap-4 items-center">
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
      <Button
        variant="ghost"
        onClick={() => {
          // navigate to edit page
          router.push(`sizes/${id}`)
        }}
        size="icon"
      >
        <Pen className="cursor-pointer w-4 h-4 text-blue-900" />
      </Button>
      {/* // copy id */}
      <Button
        variant="ghost"
        onClick={() => {
          navigator.clipboard.writeText(id)
          toast.success("size ID Copied to clipboard")
        }}
        size="icon"
      >
        <Copy className="cursor-pointer w-4 h-4 " />
      </Button>
      {/* delete */}
      <Button
        variant="ghost"
        onClick={() => {
          setAlertOpen(true)
        }}
        size="icon"
      >
        <Trash className="cursor-pointer w-4 h-4 text-red-500 " />
      </Button>
    </div>
  )
}

export const sizesCols: ColumnDef<Size>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({row}) => {
      return new Date(row.original.createdAt).toISOString().split('T')[0]
    }
  },
  {
    id: "actions",
    cell: ({row}) => {
      return <SizesActions id={row.original.id} />
    }
  }
  
]
    
    