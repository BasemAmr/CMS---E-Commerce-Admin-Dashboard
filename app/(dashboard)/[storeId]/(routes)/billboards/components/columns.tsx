"use client"

import { ColumnDef } from "@tanstack/react-table"

import { Billboard } from "@prisma/client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Copy, Pen, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
;
import { toast } from "sonner"
import AlertModal from "@/components/modals/alert-modal"
import revalidateTagAction from "@/lib/revalidate-tags"





const BillboardActions = ({ id }: { id: string }) => {
  const router = useRouter()
  const [alertOpen, setAlertOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])
    if (!mounted) return null

    // get current url and split it to get storeId
    const url = window.location.pathname
    const urlParts = url.split("/") 
    const storeId = urlParts[1]


    const onDelete = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_STORE_URL}/api/stores/${storeId}/billboards/${id}`, {
          method: 'DELETE',
          next: { tags: [`billboard-${id}`, 'billboards'] },
        });

        if (!response.ok) {
          throw new Error('Failed to delete billboard');
        }

        toast.success('Billboard deleted successfully');
        revalidateTagAction(`billboard-${id}`);
        revalidateTagAction('billboards');
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
        description="Are you sure you want to delete this Billboard?"
      />
      <Button
        variant="ghost"
        onClick={() => {
          // navigate to edit page
          router.push(`billboards/${id}`)
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
          toast.success("Billboard ID Copied to clipboard")
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

export const billboardCols: ColumnDef<Billboard>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({row}) => {
      return new Date(row.original.createdAt).toISOString().split('T')[0]
    }
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({row}) => {
      return (
        <div className="flex items-center">
          <Image
            src={row.original.imageUrl}
            alt={row.original.label}
            width={50}
            height={50}
          />
        </div>
      )}
  },
  {
    id: "actions",
        cell: ({row}) => {
          return <BillboardActions id={row.original.id} />
        }
  }
]
    
    