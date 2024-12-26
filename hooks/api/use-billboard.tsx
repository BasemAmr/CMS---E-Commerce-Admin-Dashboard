"use client";

import { Billboard } from "@prisma/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billboardService } from "@/lib/services/billboard-service";
import {toast} from "sonner"
export const BILLBOARD_KEYS = {
    // Base key for all billboard-related queries
    all: ['billboards'] as const,
    
    // Keys for listing billboards
    lists: () => [...BILLBOARD_KEYS.all, 'list'] as const,
    list: (storeId: string) => [...BILLBOARD_KEYS.lists(), storeId] as const,
    
    // Keys for individual billboard details
    details: () => [...BILLBOARD_KEYS.all, 'detail'] as const,
    detail: (storeId: string, id: string) => [...BILLBOARD_KEYS.details(), storeId, id] as const,
};

export const useBillboards = (storeId: string) => {
  return useQuery({
    queryKey: BILLBOARD_KEYS.list(storeId),
    queryFn: () => billboardService.getAll(storeId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useBillboard = (storeId: string, id: string) => {
  return useQuery({
    queryKey: BILLBOARD_KEYS.detail(storeId, id),
    queryFn: () => billboardService.getById(storeId, id),
    enabled: !!id && id !== "new",
  });
};

export const useCreateBillboard = (storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Billboard>) => 
      billboardService.create(storeId, data),
    onMutate: async (newBillboard) => {
      await queryClient.cancelQueries({ queryKey: BILLBOARD_KEYS.list(storeId) });
      const previousBillboards = queryClient.getQueryData<Billboard[]>(BILLBOARD_KEYS.list(storeId));
      
      queryClient.setQueryData<Billboard[]>(BILLBOARD_KEYS.list(storeId), old => [
        ...(old || []),
        { ...newBillboard, id: 'temp-id', createdAt: new Date() } as Billboard
      ]);

      return { previousBillboards };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(BILLBOARD_KEYS.list(storeId), context?.previousBillboards);
      toast.error(`Failed to create billboard Named: ${context?.previousBillboards}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLBOARD_KEYS.list(storeId) });
    },
  });
};

export const useUpdateBillboard = (storeId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Billboard> }) =>
      billboardService.update(storeId, id, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: BILLBOARD_KEYS.detail(storeId, id) });
      const previousBillboard = queryClient.getQueryData<Billboard>(BILLBOARD_KEYS.detail(storeId, id));
      
      queryClient.setQueryData<Billboard>(BILLBOARD_KEYS.detail(storeId, id), old => {
        if (!old) return old;
        return {
          ...old,
          ...data
        } as Billboard;
      });

      return { previousBillboard };
    },
    onError: (_, { id }, context) => {
      queryClient.setQueryData(BILLBOARD_KEYS.detail(storeId, id), context?.previousBillboard);
      toast.error(`Failed to update billboard Named: ${context?.previousBillboard}`);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: BILLBOARD_KEYS.detail(storeId, id) });
      queryClient.invalidateQueries({ queryKey: BILLBOARD_KEYS.list(storeId) });
    },
  });
};

export const useDeleteBillboard = ({ storeId, billboardId, onSuccess }: { 
  storeId: string; 
  billboardId: string; 
  onSuccess?: () => void;
}) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => billboardService.delete(storeId, billboardId),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: BILLBOARD_KEYS.list(storeId) });
      const previousBillboards = queryClient.getQueryData<Billboard[]>(BILLBOARD_KEYS.list(storeId));
      
      queryClient.setQueryData<Billboard[]>(BILLBOARD_KEYS.list(storeId), old => 
        old?.filter(billboard => billboard.id !== billboardId) || []
      );

      return { previousBillboards };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(BILLBOARD_KEYS.list(storeId), context?.previousBillboards);
      toast.error(`Failed to delete billboard Named: ${context?.previousBillboards}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLBOARD_KEYS.list(storeId) });
      onSuccess?.();
    },
  });
};