"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Color } from "@prisma/client";
import { ColorActions } from "./actions";

export const colorColumns: ColumnDef<Color>[] = [
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
    cell: ({ row }) => new Date(row.original.createdAt).toISOString().split('T')[0]

  },
  {
    id: "actions",
    cell: ({ row }) => (
      <ColorActions id={row.original.id} storeId={row.original.storeId} />
    ),
  },
];