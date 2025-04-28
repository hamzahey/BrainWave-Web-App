// app/utils/api.client.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  async fetch(url: string, options: RequestInit = {}) {
    // Add credentials to include cookies
    const fetchOptions: RequestInit = {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    let response = await fetch(`${API_URL}${url}`, fetchOptions);

    // If response is 401 Unauthorized, try to refresh the token
    if (response.status === 401) {
      const refreshed = await this.refreshToken();
      
      // If token refresh was successful, retry the original request
      if (refreshed) {
        response = await fetch(`${API_URL}${url}`, fetchOptions);
      }
    }

    return response;
  }

  async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: 'POST',
        credentials: 'include',
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Helper methods for common HTTP methods
  async get(url: string, options?: RequestInit) {
    return this.fetch(url, { ...options, method: 'GET' });
  }

  async post(url: string, data?: any, options?: RequestInit) {
    return this.fetch(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(url: string, data?: any, options?: RequestInit) {
    return this.fetch(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(url: string, options?: RequestInit) {
    return this.fetch(url, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();