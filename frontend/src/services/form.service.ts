// Form schema service
import api, { buildQueryString } from './api';
import {
  FormSchemaRequest,
  FormSchemaResponse,
  FormValidationRequest,
  FormValidationResponse,
} from '../types/form.types';

export const formService = {
  /**
   * Get all form schemas
   */
  getAll: async (params?: { active?: boolean }): Promise<FormSchemaResponse[]> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get<FormSchemaResponse[]>(`/forms${queryString}`);
    return response.data;
  },

  /**
   * Get form schema by ID
   */
  getById: async (id: string): Promise<FormSchemaResponse> => {
    const response = await api.get<FormSchemaResponse>(`/forms/${id}`);
    return response.data;
  },

  /**
   * Get form schema by code
   */
  getByCode: async (code: string): Promise<FormSchemaResponse> => {
    const response = await api.get<FormSchemaResponse>(`/forms/code/${code}`);
    return response.data;
  },

  /**
   * Create new form schema
   */
  create: async (data: FormSchemaRequest): Promise<FormSchemaResponse> => {
    const response = await api.post<FormSchemaResponse>('/forms', data);
    return response.data;
  },

  /**
   * Update existing form schema
   */
  update: async (id: string, data: Partial<FormSchemaRequest>): Promise<FormSchemaResponse> => {
    const response = await api.put<FormSchemaResponse>(`/forms/${id}`, data);