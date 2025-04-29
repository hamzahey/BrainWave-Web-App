// app/utils/auth.service.ts

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  }
  
  interface AuthResponse {
    message: string;
    user?: User;
    authenticated?: boolean;
  }
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  export const authService = {
    async login(email: string, password: string): Promise<User> {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
  
      const data: AuthResponse = await response.json();
      return data.user as User;
    },
  
    async register(userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber: string;
      dateOfBirth: string;
      gender: string;
    }): Promise<User> {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important for cookies
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
  
      const data: AuthResponse = await response.json();
      return data.user as User;
    },
  
    async logout(): Promise<void> {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });

      if (!response.ok) {
        // Handle error if the response is not OK (status 200-299)
        const data = await response.json();
        throw new Error(data.message || 'Logout failed');
      }
    },
  
    async checkAuthStatus(): Promise<{ authenticated: boolean; user?: User }> {
      try {
        const response = await fetch(`${API_URL}/auth/check`, {
          credentials: 'include', // Important for cookies
        });
        
        if (response.status === 401) {
          return { authenticated: false };
        }

        if (!response.ok) {
          return { authenticated: false };
        }
  
        const data: AuthResponse = await response.json();
        return {
          authenticated: data.authenticated || false,
          user: data.user,
        };
      } catch (error) {
        return { authenticated: false };
      }
    },
  
    async refreshToken(): Promise<boolean> {
      try {
        const response = await fetch(`${API_URL}/auth/refresh-token`, {
          method: 'POST',
          credentials: 'include', // Important for cookies
        });
  
        return response.ok;
      } catch (error) {
        return false;
      }
    },
  };