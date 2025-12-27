// User service
import api, { buildQueryString } from "./api";
import { User } from "../types/common.types";

export const userService = {
  /**
   * Get all users
   */
  getAll: async (params?: {
    role?: string;
    active?: boolean;
  }): Promise<User[]> => {
    const queryString = params ? buildQueryString(params) : "";
    const response = await api.get<User[]>(`/users${queryString}`);
    return response.data;
  },

  /**
   * Get user by ID
   */
  getById: async (id: string): Promise<User> => {
    const response = await api.get<User>(`/users/${id}`);
    return response.data;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/users/profile");
    return response.data;
  },

  /**
   * Update user
   */
  update: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, userData);
    return response.data;
  },

  /**
   * Delete user
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
