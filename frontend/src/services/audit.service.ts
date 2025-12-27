// Audit log service
import api, { buildQueryString } from './api';
import { AuditLogResponse, AuditLogFilterParams } from '../types/audit.types';
import { PageResponse } from '../types/common.types';

export const auditService = {
  /**
   * Get all audit logs with optional filters
   */
  getAll: async (params?: AuditLogFilterParams): Promise<AuditLogResponse[]> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get<AuditLogResponse[]>(`/audit${queryString}`);
    return response.data;
  },

  /**
   * Get paginated audit logs with filters
   */
  getPaginated: async (params?: AuditLogFilterParams): Promise<PageResponse<AuditLogResponse>> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get<PageResponse<AuditLogResponse>>(`/audit/paginated${queryString}`);
    return response.data;
  },

  /**
   * Get audit log by ID
   */
  getById: async (id: string): Promise<AuditLogResponse> => {
    const response = await api.get<AuditLogResponse>(`/audit/${id}`);
    return response.data;