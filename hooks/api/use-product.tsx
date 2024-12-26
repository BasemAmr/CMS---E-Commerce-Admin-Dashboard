"use client";

import { Product } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/lib/services/product-service";
import { toast } from "sonner";

export const PRODUCT_KEYS = {
  all: ['products'] as const,
  lists: () => [...PRODUCT_KEYS.all, 'list'] as const,
  list: (storeId: string) => [...PRODUCT_KEYS.lists(), storeId] as const,
  details: () => [...PRODUCT_KEYS.all, 'detail'] as const,
  detail: (storeId: string, id: string) => [...PRODUCT_KEYS.details(), storeId, id] as const,
};

export const useProducts = (storeId: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(storeId),
    queryFn: () => productService.getAll(storeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useProduct = (storeId: string, id: string) => {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(storeId, id),
    queryFn: () => productService.getById(storeId, id),
    enabled: !!id && id !== "new",
  });
};

export const useCreateProduct = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Product>) => productService.create(storeId, data),
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: PRODUCT_KEYS.list(storeId) });
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCT_KEYS.list(storeId));

      queryClient.setQueryData<Product[]>(PRODUCT_KEYS.list(storeId), old => [
        ...(old || []),
        { ...newProduct, id: 'temp-id', createdAt: new Date() } as Product
      ]);

      return { previousProducts };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(PRODUCT_KEYS.list(storeId), context?.previousProducts);
      toast.error(`Failed to create product`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list(storeId) });
    },
  });
};

export const useUpdateProduct = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      productService.update(storeId, id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: PRODUCT_KEYS.detail(storeId, id) });
      const previousProduct = queryClient.getQueryData<Product>(PRODUCT_KEYS.detail(storeId, id));

      queryClient.setQueryData<Product>(PRODUCT_KEYS.detail(storeId, id), old => {
        if (!old) return old;
        return {
          ...old,
          ...data
        } as Product;
      });

      return { previousProduct };
    },
    onError: (_, { id }, context) => {
      queryClient.setQueryData(PRODUCT_KEYS.detail(storeId, id), context?.previousProduct);
      toast.error(`Failed to update product`);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(storeId, id) });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list(storeId) });
    },
  });
};

export const useDeleteProduct = ({ storeId, productId, onSuccess }: { 
  storeId: string; 
  productId: string; 
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => productService.delete(storeId, productId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: PRODUCT_KEYS.list(storeId) });
      const previousProducts = queryClient.getQueryData<Product[]>(PRODUCT_KEYS.list(storeId));

      queryClient.setQueryData<Product[]>(PRODUCT_KEYS.list(storeId), old => 
        old?.filter(product => product.id !== productId) || []
      );

      return { previousProducts };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(PRODUCT_KEYS.list(storeId), context?.previousProducts);
      toast.error(`Failed to delete product`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.list(storeId) });
      onSuccess?.();
    },
  });
};
