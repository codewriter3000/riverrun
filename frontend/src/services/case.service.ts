// Case management service
import api, { buildQueryString } from './api';
import {
  CaseRequest,
  CaseResponse,
  CaseFilterParams,
} from '../types/case.types';
import { PageResponse } from '../types/common.types';

export const caseService = {
  /**
   * Get all cases with optional filters and pagination
   */
  getAll: async (params?: CaseFilterParams): Promise<CaseResponse[]> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get<CaseResponse[]>(`/cases${queryString}`);
    return response.data;
  },

  /**
   * Get paginated cases with filters
   */
  getPaginated: async (params?: CaseFilterParams): Promise<PageResponse<CaseResponse>> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get<PageResponse<CaseResponse>>(`/cases/paginated${queryString}`);
    return response.data;
  },

  /**
   * Get case by ID
   */
  getById: async (id: string): Promise<CaseResponse> => {
    const response = await api.get<CaseResponse>(`/cases/${id}`);
    return response.data;
  },

  /**
   * Get case by case number
   */
  getByCaseNumber: async (caseNumber: string): Promise<CaseResponse> => {
    const response = await api.get<CaseResponse>(`/cases/number/${caseNumber}`);
    return response.data;
  },

  /**
   * Create new case
   */
  create: async (data: CaseRequest): Promise<CaseResponse> => {
    const response = await api.post<CaseResponse>('/cases', data);
    return response.data;
  },

  /**
   * Update existing case
   */
  update: async (id: string, data: Partial<CaseRequest>): Promise<CaseResponse> => {
    const response = await api.put<CaseResponse>(`/cases/${id}`, data);
    return response.data;
  },

  /**
   * Delete case
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/cases/${id}`);
  },
};