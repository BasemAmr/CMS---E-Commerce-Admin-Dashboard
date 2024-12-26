import { ColumnDef } from "@tanstack/react-table";
import { Size } from "@prisma/client";
import { SizeActions } from "./actions";

export const sizeCols: ColumnDef<Size>[] = [
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
    cell: ({ row }) => {
      return new Date(row.original.createdAt).toISOString().split("T")[0];
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <SizeActions id={row.original.id} storeId={row.original.storeId} />;
    },
  },
];