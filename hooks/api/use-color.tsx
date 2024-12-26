"use client";

import { Color } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { colorService } from "@/lib/services/color-service";
import { toast } from "sonner";

export const COLOR_KEYS = {
  all: ['colors'] as const,
  lists: () => [...COLOR_KEYS.all, 'list'] as const,
  list: (storeId: string) => [...COLOR_KEYS.lists(), storeId] as const,
  details: () => [...COLOR_KEYS.all, 'detail'] as const,
  detail: (storeId: string, id: string) => [...COLOR_KEYS.details(), storeId, id] as const,
};

export const useColors = (storeId: string) => {
  return useQuery({
    queryKey: COLOR_KEYS.list(storeId),
    queryFn: () => colorService.getAll(storeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useColor = (storeId: string, id: string) => {
  return useQuery({
    queryKey: COLOR_KEYS.detail(storeId, id),
    queryFn: () => colorService.getById(storeId, id),
    enabled: !!id && id !== "new",
  });
};

export const useCreateColor = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Color>) => colorService.create(storeId, data),
    onMutate: async (newColor) => {
      await queryClient.cancelQueries({ queryKey: COLOR_KEYS.list(storeId) });
      const previousColors = queryClient.getQueryData<Color[]>(COLOR_KEYS.list(storeId));

      queryClient.setQueryData<Color[]>(COLOR_KEYS.list(storeId), old => [
        ...(old || []),
        { ...newColor, id: 'temp-id', createdAt: new Date() } as Color
      ]);

      return { previousColors };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(COLOR_KEYS.list(storeId), context?.previousColors);
      toast.error(`Failed to create color`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLOR_KEYS.list(storeId) });
    },
  });
};

export const useUpdateColor = (storeId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Color> }) =>
      colorService.update(storeId, id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: COLOR_KEYS.detail(storeId, id) });
      const previousColor = queryClient.getQueryData<Color>(COLOR_KEYS.detail(storeId, id));

      queryClient.setQueryData<Color>(COLOR_KEYS.detail(storeId, id), old => {
        if (!old) return old;
        return {
          ...old,
          ...data
        } as Color;
      });

      return { previousColor };
    },
    onError: (_, { id }, context) => {
      queryClient.setQueryData(COLOR_KEYS.detail(storeId, id), context?.previousColor);
      toast.error(`Failed to update color`);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: COLOR_KEYS.detail(storeId, id) });
      queryClient.invalidateQueries({ queryKey: COLOR_KEYS.list(storeId) });
    },
  });
};

export const useDeleteColor = ({ storeId, colorId, onSuccess }: { 
  storeId: string; 
  colorId: string; 
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => colorService.delete(storeId, colorId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: COLOR_KEYS.list(storeId) });
      const previousColors = queryClient.getQueryData<Color[]>(COLOR_KEYS.list(storeId));

      queryClient.setQueryData<Color[]>(COLOR_KEYS.list(storeId), old => 
        old?.filter(color => color.id !== colorId) || []
      );

      return { previousColors };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(COLOR_KEYS.list(storeId), context?.previousColors);
      toast.error(`Failed to delete color`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: COLOR_KEYS.list(storeId) });
      onSuccess?.();
    },
  });
};
