// Task management types
import { BaseEntity, Priority, Status } from './common.types';

export interface TaskRequest {
  caseId: string;
  title: string;
  description?: string;
  taskType?: string;
  status?: Status;
  priority?: Priority;
  assignedTo?: string;
  dueDate?: string;
  formSchemaId?: string;
  formData?: Record<string, any>;
}

export interface TaskResponse extends BaseEntity {
  caseId: string;
  caseNumber?: string;
  title: string;
  description?: string;
  taskType?: string;
  status: Status;
  priority: Priority;
  assignedTo?: string;
  assignedToUser?: {
    id: string;
    username: string;
    email: string;
  };
  dueDate?: string;
  completedAt?: string;
  formSchemaId?: string;
  formData?: Record<string, any>;
}

export interface TaskFilterParams {
  caseId?: string;
  status?: Status;
  priority?: Priority;
  assignedTo?: string;
  taskType?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface TaskCompletionRequest {
  notes?: string;
  formData?: Record<string, any>;
}
