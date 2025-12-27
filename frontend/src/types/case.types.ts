// Case management types
import { BaseEntity, Priority, Status } from './common.types';

export interface CaseRequest {
  title: string;
  description?: string;
  caseType?: string;
  status?: Status;
  priority?: Priority;
  assignedTo?: string;
  dueDate?: string;
  customFields?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface CaseResponse extends BaseEntity {
  caseNumber: string;
  title: string;
  description?: string;
  caseType?: string;
  status: Status;
  priority: Priority;
  assignedTo?: string;
  assignedToUser?: {
    id: string;
    username: string;
    email: string;
  };
  dueDate?: string;
  customFields?: Record<string, any>;
  metadata?: Record<string, any>;
  workflowDefinitionId?: string;
  currentState?: string;
}

export interface CaseFilterParams {
  status?: Status;
  priority?: Priority;
  assignedTo?: string;
  caseType?: string;
  searchTerm?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export interface CaseTransitionRequest {
  targetState: string;
  notes?: string;
  metadata?: Record<string, any>;
}
