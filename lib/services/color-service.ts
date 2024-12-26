import { Color } from "@prisma/client";
import { apiClient } from "./api-service";

export const colorService = {
  getAll: async (storeId: string) => 
    apiClient.fetch<Color[]>(apiClient.buildUrl(storeId, 'colors')),
    
  getById: async (storeId: string, id: string) => 
    apiClient.fetch<Color>(apiClient.buildUrl(storeId, 'colors', id)),
    
  create: async (storeId: string, data: Partial<Color>) => 
    apiClient.fetch<Color>(
      apiClient.buildUrl(storeId, 'colors'), 
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    ),
    
  update: async (storeId: string, id: string, data: Partial<Color>) => 
    apiClient.fetch<Color>(
      apiClient.buildUrl(storeId, 'colors', id),
      {
        method: 'PATCH',
        body: JSON.stringify(data)
      }
    ),
    
  delete: async (storeId: string, id: string) => 
    apiClient.fetch<void>(
      apiClient.buildUrl(storeId, 'colors', id),
      { method: 'DELETE' }
    )
};