import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth.service';
import { AuthResponse } from '../types/auth.types';

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  hasRole: (role: string) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const tenantId = localStorage.getItem('tenantId');
    const rolesStr = localStorage.getItem('roles');

    if (token && userId && username && tenantId && rolesStr) {
      try {
        const roles = JSON.parse(rolesStr);
        setUser({
          token,
          userId,
          username,
          tenantId,
          roles,
          expiresAt: '', // Could decode from JWT if needed
        });
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        authService.logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string, rememberMe = false) => {
    try {
      const response = await authService.login({ username, password, rememberMe });
      setUser(response);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.roles.includes(role);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
