import { ColumnDef } from "@tanstack/react-table";
import { Category, Color, Product, Size, Image } from "@prisma/client";
import { ProductActions } from "./actions";

export type ProductCols = {
  colors: Color[];
  sizes: Size[];
  category: Category;
  images: Partial<Image>[];
} & Product;

export const productColumns: ColumnDef<ProductCols>[] = [
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
      return <span className={color}>${row.original.price.toFixed(2)}</span>;
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
    accessorKey: "sizes",
    header: "Sizes",
    cell: ({ row }) => {
      const color = row.original.isFeatured ? "text-green-500" : row.original.isArchived ? "text-gray-500" : "text-black";
      return <span className={color}>{row.original.sizes.map((size) => size.name).join(", ")}</span>;
    },
  },
  {
    accessorKey: "colors",
    header: "Colors",
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
      return <ProductActions id={row.original.id} storeId={row.original.storeId} />;
    },
  },
];