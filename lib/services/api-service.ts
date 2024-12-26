const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_STORE_URL;

export const apiClient = {
  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  },

  buildUrl(storeId: string, path: string, id?: string) {
    return `/api/stores/${storeId}/${path}${id ? `/${id}` : ''}`;
  }
};