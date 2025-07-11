// app/context/AuthContext.tsx

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../utils/auth.service';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  registerDoctor: (doctorData: any) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on component mount
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const { authenticated, user } = await authService.checkAuthStatus();
      
      setIsAuthenticated(authenticated);
      if (authenticated && user) {
        setUser(user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any) => {
    setLoading(true);
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      setIsAuthenticated(true);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerDoctor = async (doctorData: any) => {
    setLoading(true);
    try {
      // Only admins should be able to register doctors
      if (!user || user.role !== 'admin') {
        throw new Error('Unauthorized: Only admin can register doctors');
      }
      
      await authService.registerDoctor(doctorData);
      // No need to update current user or authentication state
      // since the admin remains logged in
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API logout fails, we still need to clear client-side auth
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      router.push('/auth/login');
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        registerDoctor,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}