// Task management service
import api, { buildQueryString } from './api';
import {
  TaskRequest,
  TaskResponse,
  TaskFilterParams,
  TaskCompletionRequest,
} from '../types/task.types';
import { PageResponse } from '../types/common.types';

export const taskService = {
  /**
   * Get all tasks with optional filters and pagination
   */
  getAll: async (params?: TaskFilterParams): Promise<TaskResponse[]> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get<TaskResponse[]>(`/tasks${queryString}`);
    return response.data;
  },

  /**
   * Get paginated tasks with filters
   */
  getPaginated: async (params?: TaskFilterParams): Promise<PageResponse<TaskResponse>> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get<PageResponse<TaskResponse>>(`/tasks/paginated${queryString}`);
    return response.data;
  },

  /**
   * Get task by ID
   */
  getById: async (id: string): Promise<TaskResponse> => {
    const response = await api.get<TaskResponse>(`/tasks/${id}`);
    return response.data;
  },

  /**
   * Create new task
   */
  create: async (data: TaskRequest): Promise<TaskResponse> => {
    const response = await api.post<TaskResponse>('/tasks', data);
    return response.data;
  },

  /**
   * Update existing task
   */
  update: async (id: string, data: Partial<TaskRequest>): Promise<TaskResponse> => {
    const response = await api.put<TaskResponse>(`/tasks/${id}`, data);
    return response.data;
  },

  /**
   * Delete task
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);