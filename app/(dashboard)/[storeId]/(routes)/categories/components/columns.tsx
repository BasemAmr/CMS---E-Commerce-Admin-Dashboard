"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Billboard, Category } from "@prisma/client";
import Image from "next/image";
import { CategoryActions } from "./actions";

export type categoryPopulateBillboards = {
  billboard: Billboard;
} & Category;

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
          src={row.original.billboard?.imageUrl === "loading" ? "https://placehold.jp/150x150.png" : row.original.billboard?.imageUrl || "https://placehold.jp/150x150.png"}
          alt={row.original.billboard?.label || "Category Billboard"}
          width={50}
          height={50}
          quality={
            row.original.billboard?.imageUrl === "loading" ? 20 : 80
          }
        />
        <span>{row.original.billboard?.label || "No Billboard"}</span>
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
