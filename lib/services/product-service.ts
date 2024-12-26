import { Product } from "@prisma/client";
import { apiClient } from "./api-service";
import { ProductCols } from "@/app/(dashboard)/[storeId]/(routes)/products/components/columns";

export const productService = {
  getAll: async (storeId: string) => 
    apiClient.fetch<ProductCols[]>(apiClient.buildUrl(storeId, 'products')),
    
  getById: async (storeId: string, id: string) => 
    apiClient.fetch<Product>(apiClient.buildUrl(storeId, 'products', id)),
    
  create: async (storeId: string, data: Partial<Product>) => 
    apiClient.fetch<Product>(
      apiClient.buildUrl(storeId, 'products'), 
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    ),
    
  update: async (storeId: string, id: string, data: Partial<Product>) => 
    apiClient.fetch<Product>(
      apiClient.buildUrl(storeId, 'products', id),
      {
        method: 'PATCH',
        body: JSON.stringify(data)
      }
    ),
    
  delete: async (storeId: string, id: string) => 
    apiClient.fetch<void>(
      apiClient.buildUrl(storeId, 'products', id),
      { method: 'DELETE' }
    )
};