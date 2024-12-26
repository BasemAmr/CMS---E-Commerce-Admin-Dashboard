import { Size } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sizeService } from "@/lib/services/size-service";
import { toast } from "sonner";

export const SIZE_KEYS = {
  all: ['sizes'] as const,
  lists: () => [...SIZE_KEYS.all, 'list'] as const,
  list: (storeId: string) => [...SIZE_KEYS.lists(), storeId] as const,
  details: () => [...SIZE_KEYS.all, 'detail'] as const,
  detail: (storeId: string, id: string) => [...SIZE_KEYS.details(), storeId, id] as const,
};

export const useSizes = (storeId: string) => {
  return useQuery({
    queryKey: SIZE_KEYS.list(storeId),
    queryFn: () => sizeService.getAll(storeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSize = (storeId: string, id: string) => {
  return useQuery({
    queryKey: SIZE_KEYS.detail(storeId, id),
    queryFn: () => sizeService.getById(storeId, id),
    enabled: !!id && id !== "new",
  });
};

export const useCreateSize = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Size>) => sizeService.create(storeId, data),
    onMutate: async (newSize) => {
      await queryClient.cancelQueries({ queryKey: SIZE_KEYS.list(storeId) });
      const previousSizes = queryClient.getQueryData<Size[]>(SIZE_KEYS.list(storeId));

      queryClient.setQueryData<Size[]>(SIZE_KEYS.list(storeId), old => [
        ...(old || []),
        { ...newSize, id: 'temp-id', createdAt: new Date() } as Size
      ]);

      return { previousSizes };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(SIZE_KEYS.list(storeId), context?.previousSizes);
      toast.error(`Failed to create size`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIZE_KEYS.list(storeId) });
    },
  });
};

export const useUpdateSize = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Size> }) =>
      sizeService.update(storeId, id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: SIZE_KEYS.detail(storeId, id) });
      const previousSize = queryClient.getQueryData<Size>(SIZE_KEYS.detail(storeId, id));

      queryClient.setQueryData<Size>(SIZE_KEYS.detail(storeId, id), old => {
        if (!old) return old;
        return {
          ...old,
          ...data
        } as Size;
      });

      return { previousSize };
    },
    onError: (_, { id }, context) => {
      queryClient.setQueryData(SIZE_KEYS.detail(storeId, id), context?.previousSize);
      toast.error(`Failed to update size`);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: SIZE_KEYS.detail(storeId, id) });
      queryClient.invalidateQueries({ queryKey: SIZE_KEYS.list(storeId) });
    },
  });
};

export const useDeleteSize = ({ storeId, sizeId, onSuccess }: { 
  storeId: string; 
  sizeId: string; 
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sizeService.delete(storeId, sizeId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: SIZE_KEYS.list(storeId) });
      const previousSizes = queryClient.getQueryData<Size[]>(SIZE_KEYS.list(storeId));

      queryClient.setQueryData<Size[]>(SIZE_KEYS.list(storeId), old => 
        old?.filter(size => size.id !== sizeId) || []
      );

      return { previousSizes };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(SIZE_KEYS.list(storeId), context?.previousSizes);
      toast.error(`Failed to delete size`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SIZE_KEYS.list(storeId) });
      onSuccess?.();
    },
  });
};