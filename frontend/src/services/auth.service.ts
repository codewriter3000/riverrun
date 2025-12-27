// Authentication service
import api from './api';
import { LoginRequest, AuthResponse, TokenValidationResponse } from '../types/auth.types';

export const authService = {
  /**
   * Login with username and password
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);

    // Store auth data in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('tenantId', response.data.tenantId);
      localStorage.setItem('userId', response.data.userId);
      localStorage.setItem('username', response.data.username);
      localStorage.setItem('roles', JSON.stringify(response.data.roles));
    }

    return response.data;
  },

  /**
   * Validate current token
   */
  validateToken: async (): Promise<TokenValidationResponse> => {
    const response = await api.get<TokenValidationResponse>('/auth/validate');
    return response.data;
  },

  /**
   * Logout - clear local storage and redirect
   */
  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('tenantId');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    window.location.href = '/login';
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('token');
    return !!token;
  },

  /**
   * Get current user ID
   */
  getCurrentUserId: (): string | null => {
    return localStorage.getItem('userId');
  },

  /**
   * Get current username
   */
  getCurrentUsername: (): string | null => {
    return localStorage.getItem('username');
  },

  /**
   * Get current tenant ID
   */
  getCurrentTenantId: (): string | null => {
    return localStorage.getItem('tenantId');
  },

  /**
   * Get current user roles
   */
  getCurrentUserRoles: (): string[] => {
    const roles = localStorage.getItem('roles');
    return roles ? JSON.parse(roles) : [];
  },

  /**
   * Check if user has specific role
   */
  hasRole: (role: string): boolean => {
    const roles = authService.getCurrentUserRoles();
    return roles.includes(role);
  },

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole: (roles: string[]): boolean => {
    const userRoles = authService.getCurrentUserRoles();
    return roles.some(role => userRoles.includes(role));
  },
};
