// Audit log types
import { BaseEntity } from './common.types';

export interface AuditLogResponse extends BaseEntity {
  entityType: string;
  entityId: string;
  action: AuditAction;
  userId: string;
  username: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  STATE_CHANGE = 'STATE_CHANGE',
}

export interface AuditLogFilterParams {
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: AuditAction;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}
