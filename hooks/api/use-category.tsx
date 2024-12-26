"use client";

import { Category } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/lib/services/category-service";
import { toast } from "sonner";
import { categoryPopulateBillboards } from "@/app/(dashboard)/[storeId]/(routes)/categories/components/columns";

export const CATEGORY_KEYS = {
  all: ['categories'] as const,
  lists: () => [...CATEGORY_KEYS.all, 'list'] as const,
  list: (storeId: string) => [...CATEGORY_KEYS.lists(), storeId] as const,
  details: () => [...CATEGORY_KEYS.all, 'detail'] as const,
  detail: (storeId: string, id: string) => [...CATEGORY_KEYS.details(), storeId, id] as const,
};

export const useCategories = (storeId: string) => {
  return useQuery<categoryPopulateBillboards[]>({
    queryKey: CATEGORY_KEYS.list(storeId),
    queryFn: () => categoryService.getAll(storeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCategory = (storeId: string, id: string) => {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(storeId, id),
    queryFn: () => categoryService.getById(storeId, id),
    enabled: !!id && id !== "new",
  });
};

export const useCreateCategory = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Category>) => categoryService.create(storeId, data),
    onMutate: async (newCategory) => {
      await queryClient.cancelQueries({ queryKey: CATEGORY_KEYS.list(storeId) });
      const previousCategories = queryClient.getQueryData<Category[]>(CATEGORY_KEYS.list(storeId));

      queryClient.setQueryData<Category[]>(CATEGORY_KEYS.list(storeId), old => [
        ...(old || []),
        { ...newCategory, id: 'temp-id', createdAt: new Date(), billboards:{imageUrl:'loading'} } as Category
      ]);

      return { previousCategories };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(CATEGORY_KEYS.list(storeId), context?.previousCategories);
      toast.error(`Failed to create category`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.list(storeId) });
    },
  });
};

export const useUpdateCategory = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) =>
      categoryService.update(storeId, id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: CATEGORY_KEYS.detail(storeId, id) });
      const previousCategory = queryClient.getQueryData<Category>(CATEGORY_KEYS.detail(storeId, id));

      queryClient.setQueryData<Category>(CATEGORY_KEYS.detail(storeId, id), old => {
        if (!old) return old;
        return {
          ...old,
          ...data
        } as Category;
      });

      return { previousCategory };
    },
    onError: (_, { id }, context) => {
      queryClient.setQueryData(CATEGORY_KEYS.detail(storeId, id), context?.previousCategory);
      toast.error(`Failed to update category`);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.detail(storeId, id) });
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.list(storeId) });
    },
  });
};

export const useDeleteCategory = ({ storeId, categoryId, onSuccess }: { 
  storeId: string; 
  categoryId: string; 
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => categoryService.delete(storeId, categoryId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CATEGORY_KEYS.list(storeId) });
      const previousCategories = queryClient.getQueryData<Category[]>(CATEGORY_KEYS.list(storeId));

      queryClient.setQueryData<Category[]>(CATEGORY_KEYS.list(storeId), old => 
        old?.filter(category => category.id !== categoryId) || []
      );

      return { previousCategories };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(CATEGORY_KEYS.list(storeId), context?.previousCategories);
      toast.error(`Failed to delete category`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.list(storeId) });
      onSuccess?.();
    },
  });
};
