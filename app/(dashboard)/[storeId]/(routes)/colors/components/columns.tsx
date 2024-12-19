"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Color } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Copy, Pen, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import AlertModal from "@/components/modals/alert-modal"
import { revalidateTag } from 'next/cache'

const ColorsActions = ({ id }: { id: string }) => {
  const router = useRouter()
  const [alertOpen, setAlertOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const urlParts = window.location.pathname.split("/") 
  const storeId = urlParts[1]

  const onDelete = async () => {
    try {
      setLoading(true);
      await fetch(`${process.env.BACKEND_STORE_URL}/api/stores/${storeId}/colors/${id}`, {
        method: 'DELETE',
        next: { tags: [`color-${id}`] }
      });
      toast.success('Color deleted successfully');
      revalidateTag(`color-${id}`);
      revalidateTag('colors');
      router.push(`/${storeId}/colors`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete color');
    } finally {
      setLoading(false);
      setAlertOpen(false);
    }
  }    

  return (
    <div className="flex gap-4 items-center">
      <AlertModal 
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        title="Are you sure?"
        description="Are you sure you want to delete this color?"
      />
      <Button
        variant="ghost"
        onClick={() => router.push(`/${storeId}/colors/${id}`)}
        size="icon"
      >
        <Pen className="cursor-pointer w-4 h-4 text-blue-900" />
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          navigator.clipboard.writeText(id)
          toast.success("Color ID Copied to clipboard")
        }}
        size="icon"
      >
        <Copy className="cursor-pointer w-4 h-4 " />
      </Button>
      <Button
        variant="ghost"
        onClick={() => setAlertOpen(true)}
        size="icon"
      >
        <Trash className="cursor-pointer w-4 h-4 text-red-500 " />
      </Button>
    </div>
  )
}

export const colorsCols: ColumnDef<Color>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center space-x-2">
        <span
          className="w-6 h-6 rounded-full border"
          style={{ backgroundColor: row.original.value }}
        ></span>
        <span>{row.original.value}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toLocaleDateString()
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ColorsActions id={row.original.id} />
    }
  }
]