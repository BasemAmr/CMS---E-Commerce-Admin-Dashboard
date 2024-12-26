"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Billboard } from "@prisma/client";
import Image from "next/image";

import { BillboardActions } from "./actions";

export const billboardCols: ColumnDef<Billboard>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toISOString().split("T")[0];
    },
  },
  {
    accessorKey: "imageUrl",
    header: "Image",
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <Image
            src={row.original.imageUrl}
            alt={row.original.label}
            width={50}
            height={50}
          />
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <BillboardActions id={row.original.id} storeId={row.original.storeId} />
      );
    },
  },
];
