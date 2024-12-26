import { Category } from "@prisma/client";
import { apiClient } from "./api-service";
import { categoryPopulateBillboards } from "@/app/(dashboard)/[storeId]/(routes)/categories/components/columns";

export const categoryService = {
  getAll: async (storeId: string) => 
    apiClient.fetch<categoryPopulateBillboards[]>(apiClient.buildUrl(storeId, 'categories')),
    
  getById: async (storeId: string, id: string) => 
    apiClient.fetch<Category>(apiClient.buildUrl(storeId, 'categories', id)),
    
  create: async (storeId: string, data: Partial<Category>) => 
    apiClient.fetch<Category>(
      apiClient.buildUrl(storeId, 'categories'), 
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    ),
    
  update: async (storeId: string, id: string, data: Partial<categoryPopulateBillboards>) => 
    apiClient.fetch<Category>(
      apiClient.buildUrl(storeId, 'categories', id),
      {
        method: 'PATCH',
        body: JSON.stringify(data)
      }
    ),
    
  delete: async (storeId: string, id: string) => 
    apiClient.fetch<void>(
      apiClient.buildUrl(storeId, 'categories', id),
      { method: 'DELETE' }
    )
};