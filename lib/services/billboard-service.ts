import { Billboard } from "@prisma/client";
import { apiClient } from "./api-service";

export const billboardService = {
  getAll: async (storeId: string) => 
    apiClient.fetch<Billboard[]>(apiClient.buildUrl(storeId, 'billboards')),
    
  getById: async (storeId: string, id: string) => 
    apiClient.fetch<Billboard>(apiClient.buildUrl(storeId, 'billboards', id)),
    
  create: async (storeId: string, data: Partial<Billboard>) => 
    apiClient.fetch<Billboard>(
      apiClient.buildUrl(storeId, 'billboards'), 
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    ),
    
  update: async (storeId: string, id: string, data: Partial<Billboard>) => 
    apiClient.fetch<Billboard>(
      apiClient.buildUrl(storeId, 'billboards', id),
      {
        method: 'PATCH',
        body: JSON.stringify(data)
      }
    ),
    
  delete: async (storeId: string, id: string) => 
    apiClient.fetch<void>(
      apiClient.buildUrl(storeId, 'billboards', id),
      { method: 'DELETE' }
    )
};