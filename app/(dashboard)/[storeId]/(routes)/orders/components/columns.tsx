"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"





export type OrdersCols =  {
  id: string;
  phone: string;
  address: string;
  totalPrice: string;
  products: string;
  isPaid: boolean;
  createdAt: Date;
}

export const ordersCols: ColumnDef<OrdersCols>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    // badge oaid or not paid
    cell: ({ row }) => {
      return row.original.isPaid ? <Badge>Paid</Badge> : <Badge variant="destructive">Not Paid</Badge>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toISOString().split("T")[0]
    }
  }
]
    
    