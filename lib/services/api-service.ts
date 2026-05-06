const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_STORE_URL;

export const apiClient = {
  async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    // Sanitize BASE_URL: remove trailing slashes and any accidental /api/stores suffix
    const baseUrl = (BASE_URL || '').replace(/\/+$/, '').replace(/\/api\/stores\/.*$/, '');
    
    // Ensure endpoint starts with a slash
    const sanitizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    const response = await fetch(`${baseUrl}${sanitizedEndpoint}`, {
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