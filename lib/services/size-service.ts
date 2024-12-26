import { Size } from "@prisma/client";
import { apiClient } from "./api-service";

export const sizeService = {
  getAll: async (storeId: string) => 
    apiClient.fetch<Size[]>(apiClient.buildUrl(storeId, 'sizes')),
    
  getById: async (storeId: string, id: string) => 
    apiClient.fetch<Size>(apiClient.buildUrl(storeId, 'sizes', id)),
    
  create: async (storeId: string, data: Partial<Size>) => 
    apiClient.fetch<Size>(
      apiClient.buildUrl(storeId, 'sizes'), 
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    ),
    
  update: async (storeId: string, id: string, data: Partial<Size>) => 
    apiClient.fetch<Size>(
      apiClient.buildUrl(storeId, 'sizes', id),
      {
        method: 'PATCH',
        body: JSON.stringify(data)
      }
    ),
    
  delete: async (storeId: string, id: string) => 
    apiClient.fetch<void>(
      apiClient.buildUrl(storeId, 'sizes', id),
      { method: 'DELETE' }
    )
};