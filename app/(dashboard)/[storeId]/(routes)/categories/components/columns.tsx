"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Billboard, Category } from "@prisma/client";
import Image from "next/image";
import { CategoryActions } from "./actions";

export type categoryPopulateBillboards = {
  billboards: {
    [key in keyof Billboard]: Billboard[key];
  };
} & {
  [key in keyof Category]: Category[key];
};

export const categoriesCols: ColumnDef<categoryPopulateBillboards>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Image
          src={row.original.billboards.imageUrl === "loading" ? "https://placehold.jp/150x150.png" : row.original.billboards.imageUrl}
          alt={row.original.billboards.label}
          width={50}
          height={50}
          quality={
            row.original.billboards.imageUrl === "loading" ? 20 : 80
          }
        />
        <span>{row.original.billboards.label}</span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toISOString().split("T")[0],
  },
  {
    id: "actions",
    cell: ({ row }) => <CategoryActions id={row.original.id} 
      storeId={row.original.storeId}
    />,
  },
];
