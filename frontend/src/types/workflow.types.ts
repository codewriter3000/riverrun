// Workflow types

export interface WorkflowDefinition {
  id: string;
  workflowId: string;
  name: string;
  description?: string;
  version: string;
  active: boolean;
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  initialState: string;
  finalStates: string[];
}

export interface WorkflowState {
  id: string;
  name: string;
  description?: string;
  type?: 'start' | 'intermediate' | 'end';
  metadata?: Record<string, any>;
}

export interface WorkflowTransition {
  id: string;
  name: string;
  fromState: string;
  toState: string;
  guards?: WorkflowGuard[];
  actions?: WorkflowAction[];
  description?: string;
  metadata?: Record<string, any>;
}

export interface WorkflowGuard {
  type: string;
  parameters?: Record<string, any>;
  errorMessage?: string;
}

export interface WorkflowAction {
  type: string;
  parameters?: Record<string, any>;
}

export interface AvailableTransition {
  transition: WorkflowTransition;
  available: boolean;
  reason?: string;
  guardsStatus: GuardStatus[];
}

export interface GuardStatus {
  guardType: string;
  satisfied: boolean;
  message?: string;
}
