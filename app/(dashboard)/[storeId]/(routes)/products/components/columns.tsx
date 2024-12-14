"use client"

import { ColumnDef } from "@tanstack/react-table"

import {  Category, Color, Product, Size, Image } from "@prisma/client"
// import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Copy, Pen, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import axios from "axios"
import AlertModal from "@/components/modals/alert-modal"




const ProductActions = ({ id }: { id: string }) => {
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
        await axios.delete(`/api/stores/${storeId}/products/${id}`);
        toast.success('Product deleted successfully');
        router.push(`/${storeId}/products`);
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete product');
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
        description="Are you sure you want to delete this product?"
      />
      <Button
        variant="ghost"
        onClick={() => {
          // navigate to edit page
          router.push(`products/${id}`)
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
          toast.success("Product ID Copied to clipboard")
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

export type ProductCols = 
({
  colors: {
    [key in keyof Color]: Color[key]
  }[],
  sizes: {
    [key in keyof Size]: Size[key]
  }[],
  category: {
    [key in keyof Category]: Category[key]
  },
  images: {
    [key in keyof Image]: Image[key]
  }[]
}
& {
  [key in keyof Product]: Product[key]
});


export const productsCols: ColumnDef<ProductCols>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const color = row.original.isFeatured ? "text-green-500" : row.original.isArchived ? "text-gray-500" : "text-black";
      return <span className={color}>{row.original.name}</span>;
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => {
      const color = row.original.isFeatured ? "text-green-500" : row.original.isArchived ? "text-gray-500" : "text-black";
      return <span className={color}>EGP{(row.original.price).toFixed(2)}</span>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const color = row.original.isFeatured ? "text-green-500" : row.original.isArchived ? "text-gray-500" : "text-black";
      return <span className={color}>{row.original.category.name}</span>;
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => {
      const color = row.original.isFeatured ? "text-green-500" : row.original.isArchived ? "text-gray-500" : "text-black";
      return <span className={color}>{row.original.sizes.map((size) => size.name).join(", ")}</span>;
    },
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => {
      const color = row.original.isFeatured ? "text-green-500" : row.original.isArchived ? "text-gray-500" : "text-black";
      return row.original.colors.map((colorItem) => (
        <div key={colorItem.id} className={`flex items-center space-x-2 ${color}`}>
          <span
            className="w-6 h-6 rounded-full border"
            style={{ backgroundColor: colorItem.value }}
          ></span>
          <span>{colorItem.value}</span>
        </div>
      ));
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ProductActions id={row.original.id} />;
    },
  },
];