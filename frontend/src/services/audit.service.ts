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
  },

  /**
   * Export audit logs to CSV
   */
  exportCsv: async (params?: AuditLogFilterParams): Promise<Blob> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get(`/audit/export/csv${queryString}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get audit logs by entity
   */
  getByEntity: async (entityType: string, entityId: string): Promise<AuditLogResponse[]> => {
    const response = await api.get<AuditLogResponse[]>(`/audit/entity/${entityType}/${entityId}`);
    return response.data;
  },

  /**
   * Get audit logs by user
   */
  getByUser: async (userId: string, params?: AuditLogFilterParams): Promise<AuditLogResponse[]> => {
    const queryString = params ? buildQueryString(params) : '';
    const response = await api.get<AuditLogResponse[]>(`/audit/user/${userId}${queryString}`);
    return response.data;
  },
};